import { Link } from "@tanstack/react-router";
import { formatInsightDate, type Insight } from "@/data/insights";

/** Article card with featured image for the insights index. */
export function InsightCard({ article }: { article: Insight }) {
  return (
    <Link to="/insights/$slug" params={{ slug: article.slug }} className="group block">
      <div className="aspect-[3/2] overflow-hidden bg-mist">
        <img
          src={article.image}
          alt={article.imageAlt}
          width={1024}
          height={683}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <p className="micro-label mt-5 text-ink-soft">
        <time dateTime={article.date}>{formatInsightDate(article.date)}</time>
        <span className="mx-2 text-rule" aria-hidden="true">
          ·
        </span>
        <span className="text-gold-deep">{article.category}</span>
      </p>
      <h3 className="mt-3 font-display text-2xl leading-snug text-ink transition-colors duration-200 group-hover:text-navy">
        {article.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
    </Link>
  );
}
