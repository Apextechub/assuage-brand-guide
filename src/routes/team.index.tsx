import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { TeamCard } from "@/components/site/TeamCard";
import { practiceAreas } from "@/data/practiceAreas";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";

const description =
  "The partners and associates of Assuage Attorneys, a commercial law firm in Lagos, Nigeria.";

export const Route = createFileRoute("/team/")({
  head: () => ({
    meta: [
      { title: "Our People — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Our People — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/team" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const areasWithMembers = practiceAreas.filter((area) =>
    team.some((member) => member.practiceAreas.includes(area.slug))
  );
  const visible = filter
    ? team.filter((member) => member.practiceAreas.includes(filter))
    : team;

  const chipClass = (active: boolean) =>
    cn(
      "micro-label cursor-pointer border px-4 py-2.5 transition-colors duration-200",
      active
        ? "border-navy bg-navy text-paper"
        : "border-rule text-ink-soft hover:border-ink hover:text-ink"
    );

  return (
    <>
      <PageHeader
        label="Our people"
        title="The lawyers"
        intro="A compact partnership by design. Every matter is led by a partner, and every client knows who is responsible for their work."
      />
      <section className="py-16 md:py-24" aria-label="Team directory">
        <Container>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter by practice area">
            <button
              type="button"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
              className={chipClass(filter === null)}
            >
              All
            </button>
            {areasWithMembers.map((area) => (
              <button
                key={area.slug}
                type="button"
                aria-pressed={filter === area.slug}
                onClick={() => setFilter(filter === area.slug ? null : area.slug)}
                className={chipClass(filter === area.slug)}
              >
                {area.name}
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
            {visible.map((member) => (
              <TeamCard key={member.slug} member={member} />
            ))}
          </div>
        </Container>
      </section>
      <ClosingBand />
    </>
  );
}
