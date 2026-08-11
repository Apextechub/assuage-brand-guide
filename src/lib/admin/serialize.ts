// Turns admin drafts back into the TypeScript source of the generated data
// files. Output is deterministic: the same drafts always produce byte-identical
// output, so re-exporting without editing yields an empty git diff.

import type { ContentBlock } from "@/data/insights.types";
import { getAssetByIdent, UPLOAD_URL_PREFIX } from "./assets";
import type { AdminState, ImageRef, InsightDraft, NewsDraft } from "./types";
import { ADMIN_STATE_VERSION } from "./types";

export const INSIGHTS_DATA_PATH = "src/data/insights.data.ts";
export const NEWS_DATA_PATH = "src/data/news.data.ts";

/** JSON string literals are valid TypeScript string literals. */
function str(value: string): string {
  return JSON.stringify(value);
}

/** Newest first; slug breaks ties so ordering never depends on input order. */
function byDateDesc<T extends { date: string; slug: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Only published items reach the site. */
export function publishable<T extends { status: string }>(items: T[]): T[] {
  return items.filter((item) => item.status === "published");
}

/**
 * The `image:` value for an article, plus the import it needs (if any).
 * Bundled assets emit a bare identifier; everything else emits a string.
 */
function imageExpression(image: ImageRef): {
  expr: string;
  importIdent?: string;
  importFile?: string;
} {
  if (image.kind === "asset") {
    const asset = getAssetByIdent(image.ident);
    // An unknown ident means the registry and the draft disagree. Fall back to a
    // string literal rather than emitting an import that would not compile.
    if (!asset) return { expr: str(image.ident) };
    return { expr: asset.ident, importIdent: asset.ident, importFile: asset.file };
  }
  if (image.kind === "upload") {
    return { expr: str(`${UPLOAD_URL_PREFIX}/${image.fileName}`) };
  }
  return { expr: str(image.value) };
}

/** The URL to render an image ref with, in the browser, right now. */
export function imagePreviewUrl(image: ImageRef): string {
  if (image.kind === "asset") return getAssetByIdent(image.ident)?.url ?? "";
  if (image.kind === "upload") return image.dataUrl;
  return image.value;
}

/** The path an image ref resolves to once the site is built. */
export function imageExportPath(image: ImageRef): string {
  if (image.kind === "asset") {
    const asset = getAssetByIdent(image.ident);
    return asset ? `src/assets/insights/${asset.file}` : image.ident;
  }
  if (image.kind === "upload") return `${UPLOAD_URL_PREFIX}/${image.fileName}`;
  return image.value;
}

function serializeBlock(block: ContentBlock): string {
  return `      { type: ${str(block.type)}, text: ${str(block.text)} },`;
}

function serializeInsight(draft: InsightDraft): string {
  const { expr } = imageExpression(draft.image);
  const lines = [
    "  {",
    `    slug: ${str(draft.slug)},`,
    `    title: ${str(draft.title)},`,
    `    category: ${str(draft.category)},`,
    `    date: ${str(draft.date)},`,
    `    readTime: ${str(draft.readTime)},`,
    `    excerpt: ${str(draft.excerpt)},`,
    `    author: ${str(draft.author)},`,
    `    image: ${expr},`,
    `    imageAlt: ${str(draft.imageAlt)},`,
    "    content: [",
    ...draft.content.map(serializeBlock),
    "    ],",
    "  },",
  ];
  return lines.join("\n");
}

export function serializeInsightsFile(drafts: InsightDraft[]): string {
  const live = byDateDesc(publishable(drafts));

  const imports = new Map<string, string>();
  for (const draft of live) {
    const { importIdent, importFile } = imageExpression(draft.image);
    if (importIdent && importFile) imports.set(importIdent, importFile);
  }
  const importLines = [...imports.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ident, file]) => `import ${ident} from "@/assets/insights/${file}";`);

  return [
    "// GENERATED FILE — do not edit by hand.",
    "// Written by the Assuage content admin at /admin. Any manual change here is",
    "// overwritten the next time content is exported. Edit articles in the admin.",
    "",
    'import type { Insight } from "./insights.types";',
    ...(importLines.length > 0 ? ["", ...importLines] : []),
    "",
    "export const insights: Insight[] = [",
    ...live.map(serializeInsight),
    "];",
    "",
  ].join("\n");
}

function serializeNewsItem(draft: NewsDraft): string {
  return [
    "  {",
    `    slug: ${str(draft.slug)},`,
    `    date: ${str(draft.date)},`,
    `    label: ${str(draft.label)},`,
    `    title: ${str(draft.title)},`,
    `    body: ${str(draft.body)},`,
    "  },",
  ].join("\n");
}

export function serializeNewsFile(drafts: NewsDraft[]): string {
  const live = byDateDesc(publishable(drafts));
  return [
    "// GENERATED FILE — do not edit by hand.",
    "// Written by the Assuage content admin at /admin. Any manual change here is",
    "// overwritten the next time content is exported. Edit news items in the admin.",
    "",
    'import type { NewsItem } from "./news.types";',
    "",
    "export const news: NewsItem[] = [",
    ...live.map(serializeNewsItem),
    "];",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Fingerprinting
// ---------------------------------------------------------------------------

/**
 * Canonical form of a draft's *content* — everything except bookkeeping fields.
 * Two drafts with the same canonical form would export identically.
 */
function canonical(draft: InsightDraft | NewsDraft): string {
  if (draft.kind === "insight") {
    return JSON.stringify([
      draft.status,
      draft.slug,
      draft.title,
      draft.category,
      draft.date,
      draft.readTime,
      draft.excerpt,
      draft.author,
      imageExportPath(draft.image),
      draft.imageAlt,
      draft.content.map((block) => [block.type, block.text]),
    ]);
  }
  return JSON.stringify([
    draft.status,
    draft.slug,
    draft.date,
    draft.label,
    draft.title,
    draft.body,
  ]);
}

/** FNV-1a. Not cryptographic — this only has to detect edits. */
export function fingerprint(draft: InsightDraft | NewsDraft): string {
  const input = canonical(draft);
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

// ---------------------------------------------------------------------------
// Hand-off bundle
// ---------------------------------------------------------------------------

/**
 * The whole admin state as JSON, including any inlined uploads. This is what an
 * editor without repo access sends to whoever does the deploy — importing it in
 * another browser reproduces their work exactly.
 */
export function exportBundle(state: AdminState): string {
  return JSON.stringify(state, null, 2);
}

export function parseBundle(json: string): AdminState {
  const parsed: unknown = JSON.parse(json);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as AdminState).insights) ||
    !Array.isArray((parsed as AdminState).news)
  ) {
    throw new Error("That file is not an Assuage content bundle.");
  }
  const state = parsed as AdminState;
  if (state.version !== ADMIN_STATE_VERSION) {
    throw new Error(
      `That bundle was made by a different version of the admin (v${String(state.version)}, expected v${ADMIN_STATE_VERSION}).`,
    );
  }
  return { version: ADMIN_STATE_VERSION, insights: state.insights, news: state.news };
}
