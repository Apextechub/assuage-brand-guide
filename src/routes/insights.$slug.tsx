import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArticleListItem } from "@/components/site/ArticleListItem";
import { ArrowLink } from "@/components/site/Button";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { formatInsightDate, getInsight, insights, type ContentBlock } from "@/data/insights";
import { getTeamMember } from "@/data/team";
import { absoluteUrl } from "@/data/site";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = getInsight(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Insight"} — Assuage Attorneys` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Insight" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl(`/insights/${loaderData?.slug ?? ""}`) },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(`/insights/${loaderData?.slug ?? ""}`) }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: loaderData.title,
              description: loaderData.excerpt,
              datePublished: loaderData.date,
              author: {
                "@type": "Person",
                name: getTeamMember(loaderData.author)?.name ?? "Assuage Attorneys",
              },
              publisher: { "@type": "Organization", name: "Assuage Attorneys" },
            }),
          },
        ]
      : [],
  }),
  component: InsightPage,
});

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

function InsightPage() {
  const article = Route.useLoaderData();
  const author = getTeamMember(article.author);
  const related = insights
    .filter((item) => item.slug !== article.slug)
    .sort((a, b) =>
      a.category === article.category && b.category !== article.category
        ? -1
        : b.category === article.category && a.category !== article.category
          ? 1
          : b.date.localeCompare(a.date),
    )
    .slice(0, 2);

  return (
    <>
      <article>
        <header className="border-b border-rule">
          <Container className="pb-12 pt-32 md:pb-16 md:pt-44">
            <MicroLabel>{article.category}</MicroLabel>
            <h1 className="display-1 mt-5 max-w-4xl text-ink">{article.title}</h1>
            <p className="micro-label mt-7 text-ink-soft">
              {author && (
                <>
                  {"By "}
                  <Link
                    to="/team/$slug"
                    params={{ slug: author.slug }}
                    className="text-gold-deep underline decoration-gold-deep/30 underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    {author.name}
                  </Link>
                  <span className="mx-2 text-rule" aria-hidden="true">
                    ·
                  </span>
                </>
              )}
              <time dateTime={article.date}>{formatInsightDate(article.date)}</time>
              <span className="mx-2 text-rule" aria-hidden="true">
                ·
              </span>
              {article.readTime}
            </p>
          </Container>
        </header>

        <Container className="py-12 md:py-16">
          <div className="aspect-[3/2] overflow-hidden bg-mist">
            <img
              src={article.image}
              alt={article.imageAlt}
              width={1024}
              height={683}
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        </Container>

        <Container className="grid gap-10 pb-20 md:grid-cols-12 md:pb-28">
          <aside className="md:col-span-3">
            <div className="border-t border-rule pt-6 md:sticky md:top-32">
              <MicroLabel tone="muted">Written by</MicroLabel>
              {author && (
                <>
                  <Link
                    to="/team/$slug"
                    params={{ slug: author.slug }}
                    className="mt-3 block font-display text-xl text-ink transition-colors duration-200 hover:text-navy"
                  >
                    {author.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">{author.role}</p>
                </>
              )}
              <p className="mt-6 text-sm text-ink-soft">
                <time dateTime={article.date}>{formatInsightDate(article.date)}</time>
              </p>
              <p className="text-sm text-ink-soft">{article.readTime}</p>
            </div>
          </aside>
          <div className="measure md:col-span-8 lg:col-span-7">
            {article.content.map((block: ContentBlock, index: number) => (
              <Block key={index} block={block} />
            ))}
            <ArrowLink to="/insights" className="mt-12">
              Back to all insights
            </ArrowLink>
          </div>
        </Container>
      </article>

      <section className="border-t border-rule py-16 md:py-24" aria-labelledby="related-heading">
        <Container>
          <MicroLabel>Continue reading</MicroLabel>
          <h2 id="related-heading" className="display-2 mt-4 text-ink">
            Related articles
          </h2>
          <div className="mt-10 border-t border-rule">
            {related.map((item) => (
              <ArticleListItem key={item.slug} article={item} />
            ))}
          </div>
        </Container>
      </section>

      <ClosingBand />
    </>
  );
}
