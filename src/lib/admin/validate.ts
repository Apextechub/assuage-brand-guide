// Validation for the admin editors. Errors block export; warnings do not.
//
// The rules mirror what the public pages actually rely on: a slug is a URL, an
// author must resolve to a real team member, and every image needs alt text.
//
// Field keys are spelled out rather than typed as Record<string, string> so
// that `errors.title` type-checks under noPropertyAccessFromIndexSignature.

import { insightCategories } from "@/data/insights.types";
import { team } from "@/data/team";
import type { AnyDraft, InsightDraft, NewsDraft } from "./types";

export type InsightField =
  | "title"
  | "slug"
  | "date"
  | "category"
  | "author"
  | "excerpt"
  | "readTime"
  | "image"
  | "imageAlt"
  | "content";

export type NewsField = "title" | "slug" | "date" | "label" | "body";

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface ValidationResult<K extends string> {
  errors: FieldErrors<K>;
  warnings: string[];
  ok: boolean;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Roughly 200 words per minute, rounded up, minimum one. */
export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function isRealDate(iso: string): boolean {
  if (!ISO_DATE_PATTERN.test(iso)) return false;
  const parsed = new Date(`${iso}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso;
}

/** Shared slug rules — same for both content types. */
function slugError(slug: string, id: string, siblings: AnyDraft[]): string | undefined {
  if (!slug.trim()) return "A web address is required.";
  if (!SLUG_PATTERN.test(slug)) {
    return "Use lowercase letters, numbers and single hyphens only, e.g. new-partner-2026.";
  }
  if (siblings.some((item) => item.id !== id && item.slug === slug)) {
    return "Another item already uses this web address.";
  }
  return undefined;
}

function countErrors(errors: object): number {
  return Object.values(errors).filter(Boolean).length;
}

export function validateInsight(
  draft: InsightDraft,
  siblings: InsightDraft[],
): ValidationResult<InsightField> {
  const errors: FieldErrors<InsightField> = {};
  const warnings: string[] = [];

  if (!draft.title.trim()) errors.title = "A headline is required.";
  else if (draft.title.length > 140) {
    warnings.push("The headline is long and may wrap awkwardly on cards.");
  }

  const insightSlugError = slugError(draft.slug, draft.id, siblings);
  if (insightSlugError) errors.slug = insightSlugError;

  if (!isRealDate(draft.date)) errors.date = "Enter a valid date.";

  if (!(insightCategories as readonly string[]).includes(draft.category)) {
    errors.category = "Choose one of the site's categories.";
  }

  if (!draft.author.trim()) errors.author = "Choose an author.";
  else if (!team.some((member) => member.slug === draft.author)) {
    errors.author = "That author is not on the People page any more.";
  }

  if (!draft.excerpt.trim()) {
    errors.excerpt = "A summary is required — it appears on cards and in search results.";
  } else if (draft.excerpt.length > 260) {
    warnings.push("The summary is over 260 characters and will be truncated in some previews.");
  }

  if (!draft.readTime.trim()) errors.readTime = "A reading time is required.";

  if (!draft.imageAlt.trim()) {
    errors.imageAlt = "Describe the image for readers using a screen reader.";
  }
  if (draft.image.kind === "path" && !draft.image.value.trim()) {
    errors.image = "Enter the image path.";
  }

  const written = draft.content.filter((block) => block.text.trim().length > 0);
  if (written.length === 0) errors.content = "The article has no content yet.";
  else if (written.length !== draft.content.length) {
    warnings.push("Empty blocks are left out when the article is exported.");
  }

  return { errors, warnings, ok: countErrors(errors) === 0 };
}

export function validateNews(draft: NewsDraft, siblings: NewsDraft[]): ValidationResult<NewsField> {
  const errors: FieldErrors<NewsField> = {};
  const warnings: string[] = [];

  if (!draft.title.trim()) errors.title = "A headline is required.";
  const newsSlugError = slugError(draft.slug, draft.id, siblings);
  if (newsSlugError) errors.slug = newsSlugError;
  if (!isRealDate(draft.date)) errors.date = "Enter a valid date.";
  if (!draft.label.trim()) errors.label = "A label is required.";

  if (!draft.body.trim()) errors.body = "The announcement needs some text.";
  else if (draft.body.trim().length < 40) {
    warnings.push("This announcement is very short next to the others on the page.");
  }

  return { errors, warnings, ok: countErrors(errors) === 0 };
}

/** Type-agnostic check, for list screens that only need the verdict. */
export function validateDraft(
  draft: AnyDraft,
  siblings: AnyDraft[],
): ValidationResult<InsightField | NewsField> {
  return draft.kind === "insight"
    ? validateInsight(
        draft,
        siblings.filter((item): item is InsightDraft => item.kind === "insight"),
      )
    : validateNews(
        draft,
        siblings.filter((item): item is NewsDraft => item.kind === "news"),
      );
}
