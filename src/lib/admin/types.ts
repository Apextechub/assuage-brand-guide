import type { ContentBlock } from "@/data/insights.types";

/**
 * How an article's featured image is referenced.
 *
 * - `asset`  an image already bundled at src/assets/insights/<file>. Exported as
 *            a module import, which lets Vite hash and optimise it.
 * - `path`   a path served from public/ (or an absolute URL). Exported as a
 *            plain string.
 * - `upload` an image the editor chose from their own machine. It is held in the
 *            browser as a data URL so it can be previewed, and exported as
 *            `/insights/<fileName>` once the file is saved into public/insights/.
 */
export type ImageRef =
  | { kind: "asset"; ident: string }
  | { kind: "path"; value: string }
  | { kind: "upload"; fileName: string; dataUrl: string };

/** `draft` items are editable but excluded from the exported data files. */
export type DraftStatus = "published" | "draft";

/** Where an item came from: the committed data file, or this browser. */
export type DraftOrigin = "source" | "local";

interface DraftMeta {
  id: string;
  origin: DraftOrigin;
  status: DraftStatus;
  /** ISO timestamp of the last local edit. Empty for untouched source items. */
  updatedAt: string;
  /**
   * Fingerprint of this item as it stood in the generated data file when it was
   * last seeded. Lets the store tell "edited here" from "changed in code".
   */
  sourceHash: string;
  /** Set when the data file changed in code *and* this item has local edits. */
  conflictWithSource?: boolean;
}

export interface InsightDraft extends DraftMeta {
  kind: "insight";
  slug: string;
  title: string;
  category: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  readTime: string;
  excerpt: string;
  /** Author slug from team.ts. */
  author: string;
  image: ImageRef;
  imageAlt: string;
  content: ContentBlock[];
}

export interface NewsDraft extends DraftMeta {
  kind: "news";
  slug: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  label: string;
  title: string;
  body: string;
}

export type AnyDraft = InsightDraft | NewsDraft;

export interface AdminState {
  version: number;
  insights: InsightDraft[];
  news: NewsDraft[];
  /**
   * Ids of committed items the editor has deleted but not yet published.
   *
   * Without this, a deletion cannot be distinguished from an item that has just
   * appeared in the data file, and reloading the page would reinstate it.
   * Tombstones are dropped once the deletion reaches the data file.
   */
  deleted?: string[];
}

export const ADMIN_STATE_VERSION = 1;
