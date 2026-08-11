// Types and fixed vocabulary for insights (articles).
// Hand-written — safe to edit. The article data itself lives in the generated
// file insights.data.ts, which the content admin at /admin overwrites.

export type ContentBlock =
  { type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string };

export interface Insight {
  slug: string;
  title: string;
  category: string;
  /** ISO date string. */
  date: string;
  readTime: string;
  excerpt: string;
  /** Author slug from team.ts. */
  author: string;
  image: string;
  imageAlt: string;
  content: ContentBlock[];
}

export const insightCategories = [
  "Corporate",
  "Finance",
  "Dispute Resolution",
  "Energy",
  "Technology",
] as const;

export type InsightCategory = (typeof insightCategories)[number];

/** Human labels for each block type, used by the admin editor. */
export const blockTypeLabels: Record<ContentBlock["type"], string> = {
  p: "Paragraph",
  h2: "Heading",
  quote: "Pull quote",
};
