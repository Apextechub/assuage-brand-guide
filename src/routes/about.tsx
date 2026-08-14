import { createFileRoute } from "@tanstack/react-router";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { absoluteUrl } from "@/data/site";

const description =
  "The story, philosophy and approach of Assuage Attorneys, a Nigerian law firm based in Onitsha, Anambra State.";

const differentiators = [
  {
    title: "How we practise, not only what we practise",
    body: "Our distinction lies not only in the areas of law we practise, but in how we practise law. We combine professional legal expertise with a practical understanding of our clients' realities.",
  },
  {
    title: "No unnecessary complexity",
    body: "We do not believe in unnecessary complexity, or in treating clients as mere case files. We listen, communicate and strategise on every matter we take on.",
  },
  {
    title: "Committed to the right solution",
    body: "We remain committed to finding the most appropriate solution to every case, rather than the most obvious one, and we say plainly where a matter is likely to lead.",
  },
  {
    title: "Clarity, strategy and ease",
    body: "Our promise is simple: to bring clarity to complexity, strategy to legal challenges, and ease to the legal process.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us - Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "About Us - Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/about") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        label="About us"
        title="Addressing legal concerns with ease."
        intro="Assuage Attorneys is a Nigerian law firm providing legal services to individuals, families, entrepreneurs, companies and organisations."
      />

      {/* Firm story */}
      <section className="py-16 md:py-24" aria-labelledby="story-heading">
        <Container className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <MicroLabel>Our story</MicroLabel>
          </div>
          <div className="md:col-span-8">
            <h2 id="story-heading" className="sr-only">
              Our story
            </h2>
            <p className="measure text-lg leading-relaxed text-ink">
              The firm was founded in April 2022 with a simple but enduring idea: legal problems
              should not have to become overwhelming before people seek professional help, and
              quality legal representation should be both effective and reassuring.
            </p>
            <p className="measure mt-5 leading-relaxed text-ink-soft">
              The name Assuage — meaning to ease, relieve or lessen a burden — reflects the
              philosophy upon which the firm was established: to provide sound legal solutions while
              making the legal process clearer, more manageable and less burdensome for our clients.
            </p>
            <p className="measure mt-5 leading-relaxed text-ink-soft">
              From our foundation, we have been committed to building a practice anchored on
              integrity, excellence, diligence, effectiveness and genuine client service. We
              understand that behind every legal matter is a person, family, business, investment or
              aspiration that matters deeply to someone. Consequently, we approach every brief as an
              opportunity to protect the interests of our clients and to provide a practical
              strategy for achieving their objectives.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission and vision */}
      <section className="border-t border-rule py-16 md:py-24" aria-label="Mission and vision">
        <Container className="grid gap-12 md:grid-cols-2">
          <div className="border-t-2 border-navy pt-8">
            <MicroLabel>Our mission</MicroLabel>
            <p className="display-3 mt-5 text-ink">
              To provide effective, ethical and client-focused legal services that address our
              clients' concerns, protect their interests and deliver practical solutions, while
              maintaining the highest standards of professional integrity.
            </p>
          </div>
          <div className="border-t-2 border-navy pt-8">
            <MicroLabel>Our vision</MicroLabel>
            <p className="display-3 mt-5 text-ink">
              To build a distinguished and trusted Nigerian law firm recognised for legal
              excellence, integrity, innovation and exceptional client service — trusted advisers
              whom individuals, families and businesses can rely upon when making important legal
              decisions.
            </p>
          </div>
        </Container>
      </section>

      {/* What sets us apart */}
      <section className="border-t border-rule py-16 md:py-24" aria-labelledby="different-heading">
        <Container>
          <MicroLabel>Our approach</MicroLabel>
          <h2 id="different-heading" className="display-2 mt-4 max-w-2xl text-ink">
            What sets us apart
          </h2>
          <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {differentiators.map((item, index) => (
              <Reveal key={item.title}>
                <div className="border-t border-rule pt-6">
                  <p className="font-display text-2xl tabular-nums text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-2xl leading-snug text-ink">{item.title}</h3>
                  <p className="measure mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ClosingBand />
    </>
  );
}
