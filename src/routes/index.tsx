import { createFileRoute } from "@tanstack/react-router";
import { ArticleListItem } from "@/components/site/ArticleListItem";
import { ArrowLink, ButtonLink } from "@/components/site/Button";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { PracticeLedger } from "@/components/site/PracticeLedger";
import { Reveal } from "@/components/site/Reveal";
import { StatStrip } from "@/components/site/StatStrip";
import { TeamCard } from "@/components/site/TeamCard";
import { insights } from "@/data/insights";
import { practiceAreas } from "@/data/practiceAreas";
import { site } from "@/data/site";
import { team } from "@/data/team";

const description =
  "Assuage Attorneys is a commercial law firm in Lagos, Nigeria, advising companies, investors and international counsel on corporate, finance and dispute matters.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assuage Attorneys — Commercial Law Firm in Lagos" },
      { name: "description", content: description },
      { property: "og:title", content: "Assuage Attorneys — Commercial Law Firm in Lagos" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: site.name,
          description: site.description,
          email: site.email,
          telephone: site.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.offices[0]?.lines[0] ?? "",
            addressLocality: "Lagos",
            addressCountry: "NG",
          },
          areaServed: "Nigeria",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const latestInsights = [...insights].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      {/* Hero — navy, one restrained display line, single primary CTA */}
      <section className="on-dark bg-navy">
        <Container className="pb-20 pt-40 md:pb-28 md:pt-56">
          <MicroLabel tone="gold" className="hero-fade">
            Commercial law firm · Lagos, Nigeria
          </MicroLabel>
          <h1 className="display-1 hero-fade-delay mt-6 max-w-4xl text-paper">
            Clear, considered counsel for business in Nigeria.
          </h1>
          <p className="hero-fade-delay measure mt-8 text-lg leading-relaxed text-paper/70">
            Assuage Attorneys advises companies, investors and international counsel on corporate,
            finance and dispute matters under Nigerian law.
          </p>
          <div className="hero-fade-delay mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink to="/contact" variant="inverse">
              Request a consultation
            </ButtonLink>
            <ArrowLink to="/practice-areas" tone="dark">
              Our practice areas
            </ArrowLink>
          </div>
        </Container>
      </section>

      {/* Credibility strip — placeholder figures */}
      <StatStrip />

      {/* Intro */}
      <section className="py-20 md:py-28" aria-labelledby="intro-heading">
        <Container className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <MicroLabel>The firm</MicroLabel>
          </div>
          <div className="md:col-span-8">
            <h2 id="intro-heading" className="display-3 measure text-ink">
              We advise on the transactions, financing and disputes that shape our clients'
              businesses — carefully, and in plain language.
            </h2>
            <p className="measure mt-6 leading-relaxed text-ink-soft">
              Our clients include Nigerian companies, foreign investors and international law firms
              seeking Nigerian counsel. We keep our teams small, our advice direct and our
              preparation thorough.
            </p>
            <ArrowLink to="/about" className="mt-8">
              More about the firm
            </ArrowLink>
          </div>
        </Container>
      </section>

      {/* Practice areas ledger — the signature element */}
      <section className="border-t border-rule py-20 md:py-28" aria-labelledby="practice-heading">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <MicroLabel>Practice areas</MicroLabel>
              <h2 id="practice-heading" className="display-2 mt-4 text-ink">
                What we do
              </h2>
            </div>
            <ArrowLink to="/practice-areas">Full practice area index</ArrowLink>
          </div>
          <Reveal>
            <PracticeLedger areas={practiceAreas} />
          </Reveal>
        </Container>
      </section>

      {/* People teaser */}
      <section className="border-t border-rule py-20 md:py-28" aria-labelledby="people-heading">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <MicroLabel>Our people</MicroLabel>
              <h2 id="people-heading" className="display-2 mt-4 text-ink">
                The lawyers
              </h2>
            </div>
            <ArrowLink to="/team">Meet the team</ArrowLink>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
            {team.slice(0, 4).map((member, index) => (
              <Reveal key={member.slug} delay={index * 60}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Insights teaser */}
      <section className="border-t border-rule py-20 md:py-28" aria-labelledby="insights-heading">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <MicroLabel>Insights</MicroLabel>
              <h2 id="insights-heading" className="display-2 mt-4 text-ink">
                Recent commentary
              </h2>
            </div>
            <ArrowLink to="/insights">All insights</ArrowLink>
          </div>
          <div className="border-t border-rule">
            {latestInsights.map((article) => (
              <ArticleListItem key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <ClosingBand />
    </>
  );
}
