// Client-side content store for the admin.
//
// Everything lives in localStorage — there is no server. On load the stored
// drafts are reconciled against the committed data files so that:
//   - articles added in code appear in the admin,
//   - articles removed in code disappear,
//   - articles you have edited here are never silently overwritten,
//   - and an item changed in *both* places is flagged rather than merged.

import { useEffect, useSyncExternalStore } from "react";
import { insights as sourceInsights } from "@/data/insights.data";
import { news as sourceNews } from "@/data/news.data";
import { getAssetByUrl } from "./assets";
import { fingerprint } from "./serialize";
import type { AdminState, AnyDraft, ImageRef, InsightDraft, NewsDraft } from "./types";
import { ADMIN_STATE_VERSION } from "./types";

const STORAGE_KEY = "assuage:admin:v1";

// ---------------------------------------------------------------------------
// Seeding from the committed data files
// ---------------------------------------------------------------------------

function withHash<T extends AnyDraft>(draft: T): T {
  return { ...draft, sourceHash: fingerprint(draft) };
}

function sourceInsightDrafts(): InsightDraft[] {
  return sourceInsights.map((article) => {
    const asset = getAssetByUrl(article.image);
    const image: ImageRef = asset
      ? { kind: "asset", ident: asset.ident }
      : { kind: "path", value: article.image };
    return withHash<InsightDraft>({
      kind: "insight",
      id: `s_${article.slug}`,
      origin: "source",
      status: "published",
      updatedAt: "",
      sourceHash: "",
      slug: article.slug,
      title: article.title,
      category: article.category,
      date: article.date,
      readTime: article.readTime,
      excerpt: article.excerpt,
      author: article.author,
      image,
      imageAlt: article.imageAlt,
      content: article.content.map((block) => ({ ...block })),
    });
  });
}

function sourceNewsDrafts(): NewsDraft[] {
  return sourceNews.map((item) =>
    withHash<NewsDraft>({
      kind: "news",
      id: `s_${item.slug}`,
      origin: "source",
      status: "published",
      updatedAt: "",
      sourceHash: "",
      slug: item.slug,
      date: item.date,
      label: item.label,
      title: item.title,
      body: item.body,
    }),
  );
}

/**
 * Merge committed content with what is stored locally.
 *
 * An item whose current fingerprint still equals the fingerprint it was seeded
 * with has not been touched here, so the committed version wins. Otherwise the
 * local edits win, and `conflictWithSource` records that the file also moved.
 */
function reconcile<T extends AnyDraft>(source: T[], stored: T[]): T[] {
  const storedById = new Map(stored.map((draft) => [draft.id, draft]));
  const storedBySlug = new Map(
    stored.filter((draft) => draft.origin === "source").map((draft) => [draft.slug, draft]),
  );
  const consumed = new Set<string>();
  const result: T[] = [];

  for (const incoming of source) {
    // Match on id first; fall back to slug, which covers an item whose slug was
    // renamed here and has since been exported and committed under the new one.
    const local = storedById.get(incoming.id) ?? storedBySlug.get(incoming.slug);
    if (!local) {
      result.push(incoming);
      continue;
    }
    consumed.add(local.id);

    if (fingerprint(local) === local.sourceHash) {
      result.push({ ...incoming, id: local.id });
    } else {
      result.push({
        ...local,
        sourceHash: incoming.sourceHash,
        conflictWithSource: local.sourceHash !== incoming.sourceHash,
      });
    }
  }

  for (const draft of stored) {
    if (consumed.has(draft.id)) continue;
    // Dropped from the data file in code — let it go. Items created here have
    // origin "local" and are always kept.
    if (draft.origin === "source") continue;
    result.push(draft);
  }

  return result;
}

/**
 * The committed data files, expressed as drafts. Serializing this reproduces
 * those files byte for byte, which is how the Publish screen tells whether a
 * file actually needs to change.
 */
export function seededState(): AdminState {
  return {
    version: ADMIN_STATE_VERSION,
    insights: sourceInsightDrafts(),
    news: sourceNewsDrafts(),
  };
}

function loadState(): AdminState {
  const seeded = seededState();
  let stored: AdminState | null = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminState;
      if (parsed.version === ADMIN_STATE_VERSION) stored = parsed;
    }
  } catch (error) {
    console.error("[admin] could not read saved drafts", error);
  }
  if (!stored) return seeded;

  return {
    version: ADMIN_STATE_VERSION,
    insights: reconcile(seeded.insights, stored.insights ?? []),
    news: reconcile(seeded.news, stored.news ?? []),
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

let state: AdminState | null = null;
let lastError: string | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(next: AdminState): void {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    lastError = null;
  } catch (error) {
    // Almost always the 5 MB quota, hit by inlined image uploads.
    console.error("[admin] could not save drafts", error);
    lastError =
      "Your browser refused to save. This usually means the stored images are too large — remove an upload, or export your work now.";
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AdminState | null {
  return state;
}

/** Nothing is available during SSR; the admin renders a loading state instead. */
function getServerSnapshot(): AdminState | null {
  return null;
}

function ensureLoaded(): void {
  if (state === null) {
    state = loadState();
    emit();
  }
}

function mutate(update: (current: AdminState) => AdminState): void {
  if (state === null) ensureLoaded();
  if (state === null) return;
  persist(update(state));
}

function stamp<T extends AnyDraft>(draft: T): T {
  return { ...draft, updatedAt: new Date().toISOString() };
}

function newId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `l_${random}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useAdminState(): { state: AdminState | null; error: string | null } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(ensureLoaded, []);
  return { state: snapshot, error: snapshot ? lastError : null };
}

/**
 * Today as yyyy-mm-dd in the editor's own timezone. Built from local parts, not
 * `toISOString()`, which would report yesterday between midnight and 01:00 in
 * WAT and later in timezones further east.
 */
export function todayISO(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function emptyInsight(): InsightDraft {
  return {
    kind: "insight",
    id: newId(),
    origin: "local",
    status: "draft",
    updatedAt: new Date().toISOString(),
    sourceHash: "",
    slug: "",
    title: "",
    category: "Corporate",
    date: todayISO(),
    readTime: "",
    excerpt: "",
    author: "",
    image: { kind: "asset", ident: "corporateCama" },
    imageAlt: "",
    content: [{ type: "p", text: "" }],
  };
}

export function emptyNews(): NewsDraft {
  return {
    kind: "news",
    id: newId(),
    origin: "local",
    status: "draft",
    updatedAt: new Date().toISOString(),
    sourceHash: "",
    slug: "",
    date: todayISO(),
    label: "People",
    title: "",
    body: "",
  };
}

export const actions = {
  saveInsight(draft: InsightDraft): void {
    mutate((current) => {
      const stamped = stamp(draft);
      const exists = current.insights.some((item) => item.id === draft.id);
      return {
        ...current,
        insights: exists
          ? current.insights.map((item) => (item.id === draft.id ? stamped : item))
          : [...current.insights, stamped],
      };
    });
  },

  saveNews(draft: NewsDraft): void {
    mutate((current) => {
      const stamped = stamp(draft);
      const exists = current.news.some((item) => item.id === draft.id);
      return {
        ...current,
        news: exists
          ? current.news.map((item) => (item.id === draft.id ? stamped : item))
          : [...current.news, stamped],
      };
    });
  },

  removeInsight(id: string): void {
    mutate((current) => ({
      ...current,
      insights: current.insights.filter((item) => item.id !== id),
    }));
  },

  removeNews(id: string): void {
    mutate((current) => ({ ...current, news: current.news.filter((item) => item.id !== id) }));
  },

  setInsightStatus(id: string, status: InsightDraft["status"]): void {
    mutate((current) => ({
      ...current,
      insights: current.insights.map((item) =>
        item.id === id ? stamp({ ...item, status }) : item,
      ),
    }));
  },

  setNewsStatus(id: string, status: NewsDraft["status"]): void {
    mutate((current) => ({
      ...current,
      news: current.news.map((item) => (item.id === id ? stamp({ ...item, status }) : item)),
    }));
  },

  /** Discard local edits to one item and take the committed version again. */
  revertToSource(id: string): void {
    mutate((current) => {
      const seeded = seededState();
      const insight = seeded.insights.find((item) => item.id === id);
      if (insight) {
        return {
          ...current,
          insights: current.insights.map((item) => (item.id === id ? insight : item)),
        };
      }
      const item = seeded.news.find((entry) => entry.id === id);
      if (!item) return current;
      return { ...current, news: current.news.map((entry) => (entry.id === id ? item : entry)) };
    });
  },

  /** Throw away every local change and reseed from the committed data files. */
  resetAll(): void {
    persist(seededState());
  },

  replaceAll(next: AdminState): void {
    persist(next);
  },
};

export function isModified(draft: AnyDraft): boolean {
  if (draft.origin === "local") return true;
  return fingerprint(draft) !== draft.sourceHash;
}

/** True when anything at all differs from what is committed. */
export function hasPendingChanges(state: AdminState): boolean {
  return [...state.insights, ...state.news].some(isModified);
}
