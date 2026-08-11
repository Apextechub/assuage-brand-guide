import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatInsightDate, type Insight } from "@/data/insights";

/** Clean list row for articles: date, category, title. No cards, no shadows. */
export function ArticleListItem({ article }: { article: Insight }) {
  return (
    <Link
      to="/insights/$slug"
      params={{ slug: article.slug }}
      className="group grid gap-2 border-b border-rule py-6 md:grid-cols-12 md:items-baseline md:gap-6"
    >
      <p className="micro-label text-ink-soft md:col-span-3">
        <time dateTime={article.date}>{formatInsightDate(article.date)}</time>
        <span className="mx-2 text-rule" aria-hidden="true">
          ·
        </span>
        <span className="text-gold-deep">{article.category}</span>
      </p>
      <h3 className="font-display text-xl leading-snug text-ink transition-colors duration-200 group-hover:text-navy md:col-span-8 md:text-2xl">
        {article.title}
      </h3>
      <span className="hidden md:col-span-1 md:justify-self-end">
        <ArrowRight
          className="size-5 text-gold-deep opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
