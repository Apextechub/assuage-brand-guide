import { createFileRoute, notFound } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { PageHeader } from "@/components/site/PageHeader";
import { TeamCard } from "@/components/site/TeamCard";
import { getPracticeArea } from "@/data/practiceAreas";
import { team } from "@/data/team";
import { absoluteUrl } from "@/data/site";

export const Route = createFileRoute("/practice-areas/$slug")({
  loader: ({ params }) => {
    const area = getPracticeArea(params.slug);
    if (!area) throw notFound();
    return area;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Practice area"} — Assuage Attorneys` },
      { name: "description", content: loaderData?.summary ?? "" },
      {
        property: "og:title",
        content: `${loaderData?.name ?? "Practice area"} — Assuage Attorneys`,
      },
      { property: "og:description", content: loaderData?.summary ?? "" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl(`/practice-areas/${loaderData?.slug ?? ""}`) },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(`/practice-areas/${loaderData?.slug ?? ""}`) }],
  }),
  component: PracticeAreaPage,
});

function PracticeAreaPage() {
  const area = Route.useLoaderData();
  const lawyers = team.filter((member) => member.practiceAreas.includes(area.slug));

  return (
    <>
      <PageHeader label="Practice area" title={area.name} intro={area.summary} />

      {/* Overview */}
      <section className="py-16 md:py-24" aria-labelledby="overview-heading">
        <Container className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <MicroLabel>Overview</MicroLabel>
          </div>
          <div className="md:col-span-8">
            <h2 id="overview-heading" className="sr-only">
              Overview
            </h2>
            {area.overview.map((paragraph: string, index: number) => (
              <p
                key={paragraph.slice(0, 32)}
                className={
                  index === 0
                    ? "measure text-lg leading-relaxed text-ink"
                    : "measure mt-5 leading-relaxed text-ink-soft"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section className="border-t border-rule py-16 md:py-24" aria-labelledby="services-heading">
        <Container className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <MicroLabel>Services</MicroLabel>
          </div>
          <div className="md:col-span-8">
            <h2 id="services-heading" className="display-3 text-ink">
              What we do
            </h2>
            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {area.services.map((service: string) => (
                <li key={service} className="flex items-baseline gap-3 border-t border-rule py-4">
                  <span
                    className="size-1.5 shrink-0 -translate-y-0.5 bg-gold-deep"
                    aria-hidden="true"
                  />
                  <span className="text-ink">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Related lawyers */}
      {lawyers.length > 0 && (
        <section className="border-t border-rule py-16 md:py-24" aria-labelledby="lawyers-heading">
          <Container>
            <MicroLabel>Who to speak to</MicroLabel>
            <h2 id="lawyers-heading" className="display-2 mt-4 text-ink">
              Related lawyers
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3">
              {lawyers.map((member) => (
                <TeamCard key={member.slug} member={member} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <ClosingBand title={`Discuss a ${area.name.toLowerCase()} matter with us.`} />
    </>
  );
}
