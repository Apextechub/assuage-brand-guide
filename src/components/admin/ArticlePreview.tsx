// Renders a draft using the same markup and classes as the live pages, so what
// the editor sees here is what the site will render. If insights.$slug.tsx or
// news.tsx change their typography, mirror the change here.

import type { ContentBlock } from "@/data/insights.types";
import { formatInsightDate } from "@/data/insights";
import { getTeamMember } from "@/data/team";
import { imagePreviewUrl } from "@/lib/admin/serialize";
import type { InsightDraft, NewsDraft } from "@/lib/admin/types";

function Block({ block }: { block: ContentBlock }) {
  if (block.type === "h2") {
    return <h2 className="display-3 mb-5 mt-12 text-ink">{block.text}</h2>;
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-navy">
        {block.text}
      </blockquote>
    );
  }
  return <p className="mb-6 leading-[1.75] text-ink">{block.text}</p>;
}

export function InsightPreview({ draft }: { draft: InsightDraft }) {
  const author = getTeamMember(draft.author);
  const image = imagePreviewUrl(draft.image);
  const blocks = draft.content.filter((block) => block.text.trim().length > 0);

  return (
    <article className="bg-paper">
      <p className="micro-label text-gold-deep">{draft.category || "Category"}</p>
      <h1 className="display-2 mt-4 text-ink">{draft.title || "Untitled article"}</h1>
      <p className="micro-label mt-5 text-ink-soft">
        {author && (
          <>
            {"By "}
            <span className="text-gold-deep">{author.name}</span>
            <span className="mx-2 text-rule" aria-hidden="true">
              ·
            </span>
          </>
        )}
        <time dateTime={draft.date}>{formatInsightDate(draft.date)}</time>
        {draft.readTime && (
          <>
            <span className="mx-2 text-rule" aria-hidden="true">
              ·
            </span>
            {draft.readTime}
          </>
        )}
      </p>

      <div className="mt-8 aspect-[3/2] overflow-hidden bg-mist">
        {image && <img src={image} alt={draft.imageAlt} className="size-full object-cover" />}
      </div>

      <p className="measure mt-8 border-l-2 border-rule pl-5 italic leading-relaxed text-ink-soft">
        {draft.excerpt || "The summary that appears on cards and in search results goes here."}
      </p>

      <div className="measure mt-10">
        {blocks.length > 0 ? (
          blocks.map((block, index) => <Block key={index} block={block} />)
        ) : (
          <p className="text-ink-soft">The article has no content yet.</p>
        )}
      </div>
    </article>
  );
}

export function NewsPreview({ draft }: { draft: NewsDraft }) {
  return (
    <div className="border-t border-rule bg-paper">
      <article className="grid gap-3 border-b border-rule py-10 md:grid-cols-12 md:gap-8">
        <p className="micro-label text-ink-soft md:col-span-3">
          <time dateTime={draft.date}>{formatInsightDate(draft.date)}</time>
          <span className="mx-2 text-rule" aria-hidden="true">
            ·
          </span>
          <span className="text-gold-deep">{draft.label}</span>
        </p>
        <div className="md:col-span-8">
          <h2 className="display-3 text-ink">{draft.title || "Untitled announcement"}</h2>
          <p className="measure mt-4 leading-relaxed text-ink-soft">
            {draft.body || "The announcement text goes here."}
          </p>
        </div>
      </article>
    </div>
  );
}
