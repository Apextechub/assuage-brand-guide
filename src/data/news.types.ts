// Types and fixed vocabulary for firm news.
// Hand-written — safe to edit. The news data itself lives in the generated
// file news.data.ts, which the content admin at /admin overwrites.

export interface NewsItem {
  slug: string;
  /** ISO date string. */
  date: string;
  label: string;
  title: string;
  body: string;
}

export const newsLabels = ["People", "Briefing", "Publication", "Event", "Community"] as const;

export type NewsLabel = (typeof newsLabels)[number];
