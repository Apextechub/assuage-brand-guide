import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { formatNewsDate, news } from "@/data/news";

const description =
  "News and announcements from Assuage Attorneys, a law firm in Onitsha, Anambra State.";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Firm News — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Firm News — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/news" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        label="Firm news"
        title="News and announcements"
        intro="Appointments, briefings, publications and other announcements from the firm."
      />
      <section className="py-16 md:py-24" aria-label="Firm news">
        <Container>
          {sorted.length === 0 ? (
            <div className="border border-rule bg-mist p-10 text-center md:p-16">
              <p className="display-3 text-ink">No announcements yet</p>
              <p className="measure mx-auto mt-4 text-ink-soft">
                Firm news, briefings and publications will appear here.
              </p>
            </div>
          ) : (
            <div className="border-t border-rule">
              {sorted.map((item) => (
                <article
                  key={item.slug}
                  id={item.slug}
                  className="grid gap-3 border-b border-rule py-10 md:grid-cols-12 md:gap-8 scroll-mt-32"
                >
                  <p className="micro-label text-ink-soft md:col-span-3">
                    <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                    <span className="mx-2 text-rule" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-gold-deep">{item.label}</span>
                  </p>
                  <div className="md:col-span-8">
                    <h2 className="display-3 text-ink">{item.title}</h2>
                    <p className="measure mt-4 leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
      <ClosingBand />
    </>
  );
}
