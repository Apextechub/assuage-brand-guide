import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { PracticeLedger } from "@/components/site/PracticeLedger";
import { practiceAreas } from "@/data/practiceAreas";
import { absoluteUrl } from "@/data/site";

const description =
  "The practice areas of Assuage Attorneys: corporate and commercial, M&A, banking and finance, capital markets, dispute resolution, energy, real estate and technology.";

export const Route = createFileRoute("/practice-areas/")({
  head: () => ({
    meta: [
      { title: "Practice Areas — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Practice Areas — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/practice-areas") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/practice-areas") }],
  }),
  component: PracticeAreasPage,
});

function PracticeAreasPage() {
  return (
    <>
      <PageHeader
        label="Practice areas"
        title="What we do"
        intro="Five practice areas, one standard of preparation. Select any area to read a summary of the work we do there."
      />
      <section className="py-16 md:py-24" aria-label="Practice area index">
        <Container>
          <PracticeLedger areas={practiceAreas} />
        </Container>
      </section>
      <ClosingBand />
    </>
  );
}
