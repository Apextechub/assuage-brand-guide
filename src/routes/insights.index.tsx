import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { ArrowLink } from "@/components/site/Button";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { InsightCard } from "@/components/site/InsightCard";
import { PageHeader } from "@/components/site/PageHeader";
import { insightCategories, insights } from "@/data/insights";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/data/site";

const description =
  "Commentary and analysis from Assuage Attorneys on Nigerian corporate, commercial, family, property and dispute resolution law.";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Insights — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/insights") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/insights") }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = insights
    .filter((article) => {
      const matchesCategory = !category || article.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const chipClass = (active: boolean) =>
    cn(
      "micro-label cursor-pointer border px-4 py-2.5 transition-colors duration-200",
      active
        ? "border-navy bg-navy text-paper"
        : "border-rule text-ink-soft hover:border-ink hover:text-ink",
    );

  return (
    <>
      <PageHeader
        label="Insights"
        title="Commentary and analysis"
        intro="Notes on Nigerian law and regulation from our lawyers, written for clients and their advisers. Nothing here is legal advice."
      />
      <section className="py-16 md:py-24" aria-label="Articles">
        <Container>
          {insights.length === 0 ? (
            <div className="border border-rule bg-mist p-10 text-center md:p-16">
              <p className="display-3 text-ink">No articles yet</p>
              <p className="measure mx-auto mt-4 text-ink-soft">
                We are preparing our first commentary. In the meantime, you are welcome to contact
                us about a matter directly.
              </p>
              <ArrowLink to="/contact" className="mt-8">
                Request a consultation
              </ArrowLink>
            </div>
          ) : (
            <>
              <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    aria-label="Search articles"
                    placeholder="Search articles"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full border border-rule bg-paper py-3 pl-11 pr-4 text-sm text-ink transition-colors duration-200 placeholder:text-ink-soft/50 hover:border-ink-soft/40 focus:border-navy"
                  />
                </div>
                <div
                  className="flex flex-wrap gap-2.5"
                  role="group"
                  aria-label="Filter by category"
                >
                  <button
                    type="button"
                    aria-pressed={category === null}
                    onClick={() => setCategory(null)}
                    className={chipClass(category === null)}
                  >
                    All
                  </button>
                  {insightCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={category === item}
                      onClick={() => setCategory(category === item ? null : item)}
                      className={chipClass(category === item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((article) => (
                    <InsightCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : (
                <div className="border border-rule bg-mist p-10 text-center">
                  <p className="text-ink-soft">No articles match your search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory(null);
                    }}
                    className="micro-label mt-4 cursor-pointer text-gold-deep underline decoration-gold-deep/30 underline-offset-8 transition-colors duration-200 hover:text-ink"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
      <ClosingBand />
    </>
  );
}
