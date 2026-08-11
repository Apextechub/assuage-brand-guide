import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLink } from "@/components/site/Button";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { practiceAreas } from "@/data/practiceAreas";
import { getTeamMember } from "@/data/team";

export const Route = createFileRoute("/team/$slug")({
  loader: ({ params }) => {
    const member = getTeamMember(params.slug);
    if (!member) throw notFound();
    return member;
  },
  head: ({ loaderData }) => {
    const description = loaderData
      ? `${loaderData.name}, ${loaderData.role} at Assuage Attorneys, a commercial law firm in Lagos, Nigeria.`
      : "Our people — Assuage Attorneys";
    return {
      meta: [
        { title: `${loaderData?.name ?? "Our people"} — Assuage Attorneys` },
        { name: "description", content: description },
        { property: "og:title", content: `${loaderData?.name ?? "Our people"} — Assuage Attorneys` },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: `/team/${loaderData?.slug ?? ""}` },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: `/team/${loaderData?.slug ?? ""}` }],
    };
  },
  component: TeamMemberPage,
});

function TeamMemberPage() {
  const member = Route.useLoaderData();
  const areas = practiceAreas.filter((area) => member.practiceAreas.includes(area.slug));

  return (
    <>
      <article className="border-b border-rule pb-16 pt-32 md:pb-24 md:pt-44">
        <Container className="grid gap-10 md:grid-cols-12">
          {/* Portrait + contact card */}
          <div className="md:col-span-4">
            <div className="aspect-[3/4] overflow-hidden bg-mist">
              <img
                src={member.portrait}
                alt={member.portraitAlt}
                width={768}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
            <div className="mt-6 border border-rule p-6">
              <MicroLabel>Contact</MicroLabel>
              <p className="mt-4 text-sm">
                <a
                  href={`mailto:${member.email}`}
                  className="break-all text-gold-deep underline decoration-rule underline-offset-4 transition-colors duration-200 hover:decoration-gold-deep"
                >
                  {member.email}
                </a>
              </p>
              <p className="mt-3 text-sm">
                <a
                  href={member.linkedin}
                  className="text-ink underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-gold-deep hover:decoration-gold-deep"
                >
                  LinkedIn profile
                </a>
              </p>
              <div className="mt-6 border-t border-rule pt-4">
                <MicroLabel tone="muted">Practice areas</MicroLabel>
                <ul className="mt-3 space-y-1.5">
                  {areas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        to="/practice-areas/$slug"
                        params={{ slug: area.slug }}
                        className="text-sm text-ink underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-gold-deep hover:decoration-gold-deep"
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="md:col-span-8">
            <MicroLabel>{member.role}</MicroLabel>
            <h1 className="display-1 mt-4 text-ink">{member.name}</h1>
            <p className="micro-label mt-5 text-ink-soft">
              Called to the Nigerian Bar · {member.yearOfCall}
            </p>

            <div className="measure mt-8">
              {member.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mb-5 leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>

            <h2 className="display-3 mt-14 text-ink">Qualifications</h2>
            <ul className="measure mt-6">
              {member.qualifications.map((qualification) => (
                <li key={qualification} className="border-t border-rule py-3.5 text-sm text-ink">
                  {qualification}
                </li>
              ))}
            </ul>

            <h2 className="display-3 mt-14 text-ink">Notable matters</h2>
            <ul className="measure mt-6 space-y-4">
              {member.matters.map((matter) => (
                <li key={matter.slice(0, 32)} className="flex items-baseline gap-3">
                  <span
                    className="size-1.5 shrink-0 -translate-y-0.5 bg-gold-deep"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed text-ink-soft">{matter}</span>
                </li>
              ))}
            </ul>

            <ArrowLink to="/team" className="mt-14">
              Back to all people
            </ArrowLink>
          </div>
        </Container>
      </article>
      <ClosingBand />
    </>
  );
}
