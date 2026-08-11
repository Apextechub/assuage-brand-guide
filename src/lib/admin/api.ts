// Server functions behind the admin: login, logout, and publishing.
//
// The client never sends file contents. It sends the structured drafts, and the
// server re-validates and re-serialises them before committing — so whatever
// lands in the repository is always well-formed, whatever the browser sent.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publishingStatus, readAdminConfig } from "@/lib/server/env.server";
import { commitFiles, type FileChange } from "@/lib/server/github.server";
import { verifyPassword } from "@/lib/server/password.server";
import { endSession, isLoggedIn, requireLogin, startSession } from "@/lib/server/session.server";
import { UPLOAD_DIR } from "./assets";
import {
  INSIGHTS_DATA_PATH,
  NEWS_DATA_PATH,
  publishable,
  serializeInsightsFile,
  serializeNewsFile,
} from "./serialize";
import type { InsightDraft, NewsDraft } from "./types";
import { validateInsight, validateNews } from "./validate";

// ---------------------------------------------------------------------------
// Payload schemas
// ---------------------------------------------------------------------------

const blockSchema = z.object({
  type: z.enum(["p", "h2", "quote"]),
  text: z.string().max(20_000),
});

const imageSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("asset"), ident: z.string().max(120) }),
  z.object({ kind: z.literal("path"), value: z.string().max(500) }),
  z.object({
    kind: z.literal("upload"),
    // Rejects path traversal and directory separators outright.
    fileName: z.string().regex(/^[a-z0-9][a-z0-9-]*\.[a-z0-9]+$/, "Unsafe image file name."),
    dataUrl: z.string().startsWith("data:image/").max(4_000_000),
  }),
]);

const metaSchema = {
  id: z.string().max(200),
  origin: z.enum(["source", "local"]),
  status: z.enum(["published", "draft"]),
  updatedAt: z.string().max(60),
  sourceHash: z.string().max(64),
  conflictWithSource: z.boolean().optional(),
};

const insightSchema = z.object({
  ...metaSchema,
  kind: z.literal("insight"),
  slug: z.string().max(120),
  title: z.string().max(500),
  category: z.string().max(120),
  date: z.string().max(40),
  readTime: z.string().max(60),
  excerpt: z.string().max(2_000),
  author: z.string().max(120),
  image: imageSchema,
  imageAlt: z.string().max(500),
  content: z.array(blockSchema).max(400),
});

const newsSchema = z.object({
  ...metaSchema,
  kind: z.literal("news"),
  slug: z.string().max(120),
  date: z.string().max(40),
  label: z.string().max(120),
  title: z.string().max(500),
  body: z.string().max(20_000),
});

const publishSchema = z.object({
  insights: z.array(insightSchema).max(500),
  news: z.array(newsSchema).max(500),
  message: z.string().max(500).optional(),
});

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export type SessionState = {
  authenticated: boolean;
  publishing: { ready: true } | { ready: false; missing: string[] };
};

/** What the admin needs to know before rendering: logged in? can it publish? */
export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionState> => {
    const status = publishingStatus();
    if (!status.ready) return { authenticated: false, publishing: status };

    const config = readAdminConfig();
    return { authenticated: await isLoggedIn(config.sessionSecret), publishing: status };
  },
);

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ password: z.string().max(500) }).parse(data))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const config = readAdminConfig();
    if (!(await verifyPassword(data.password, config.passwordHash))) {
      // Deliberately vague: there is only one account, so naming the failure
      // would only help someone guessing.
      return { ok: false, error: "That password is not right." };
    }
    await startSession(config.sessionSecret);
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async (): Promise<void> => {
  const config = readAdminConfig();
  await endSession(config.sessionSecret);
});

// ---------------------------------------------------------------------------
// Publish
// ---------------------------------------------------------------------------

export type PublishResult =
  | { status: "committed"; sha: string; url: string; files: string[] }
  | { status: "unchanged" }
  | { status: "invalid"; problems: string[] };

/** Split a data URL into the base64 payload GitHub wants. */
function base64FromDataUrl(dataUrl: string): string | null {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return null;
  if (!dataUrl.slice(0, comma).includes(";base64")) return null;
  const payload = dataUrl.slice(comma + 1);
  return payload.length > 0 ? payload : null;
}

export const publish = createServerFn({ method: "POST" })
  .validator((data: unknown) => publishSchema.parse(data))
  .handler(async ({ data }): Promise<PublishResult> => {
    const config = readAdminConfig();
    await requireLogin(config.sessionSecret);

    const insights = data.insights as InsightDraft[];
    const news = data.news as NewsDraft[];

    // Re-run the same validation the editor sees. A draft that would not pass
    // in the browser must not reach the repository either.
    const problems: string[] = [];
    for (const draft of publishable(insights)) {
      const result = validateInsight(draft, insights);
      for (const message of Object.values(result.errors)) {
        problems.push(`${draft.title || draft.slug || "Untitled article"}: ${message}`);
      }
    }
    for (const draft of publishable(news)) {
      const result = validateNews(draft, news);
      for (const message of Object.values(result.errors)) {
        problems.push(`${draft.title || draft.slug || "Untitled announcement"}: ${message}`);
      }
    }
    if (problems.length > 0) return { status: "invalid", problems };

    const files: FileChange[] = [
      { path: INSIGHTS_DATA_PATH, content: serializeInsightsFile(insights), encoding: "utf-8" },
      { path: NEWS_DATA_PATH, content: serializeNewsFile(news), encoding: "utf-8" },
    ];

    // Any image the editor uploaded travels with the same commit.
    for (const draft of publishable(insights)) {
      if (draft.image.kind !== "upload") continue;
      const base64 = base64FromDataUrl(draft.image.dataUrl);
      if (!base64) {
        return {
          status: "invalid",
          problems: [`${draft.title || draft.slug}: the uploaded image could not be read.`],
        };
      }
      files.push({
        path: `${UPLOAD_DIR}/${draft.image.fileName}`,
        content: base64,
        encoding: "base64",
      });
    }

    const result = await commitFiles({
      token: config.githubToken,
      owner: config.owner,
      repo: config.repo,
      branch: config.branch,
      message: data.message?.trim() || "Update site content from the content admin",
      files,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
    });

    if (result.status === "unchanged") return { status: "unchanged" };
    return {
      status: "committed",
      sha: result.sha,
      url: result.url,
      files: files.map((file) => file.path),
    };
  });
