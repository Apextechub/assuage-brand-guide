import { createFileRoute } from "@tanstack/react-router";
import aboutLagos from "@/assets/about-lagos.jpg";
import { ClosingBand } from "@/components/site/ClosingBand";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

const description =
  "The story, philosophy and approach of Assuage Attorneys, a commercial law firm based in Lagos, Nigeria.";

// TODO: all copy on this page is placeholder text for layout and tone.
// Replace with the firm's real history and approved positioning.
const differentiators = [
  {
    title: "Partner attention on every matter",
    body: "Matters are led by partners, not passed down. Clients deal directly with the lawyer responsible for their work, from the first meeting to the last signature.",
  },
  {
    title: "Plain-language advice",
    body: "We write advice the way we would want to receive it: direct, specific and free of unnecessary qualification. If a point is uncertain, we say so and explain why.",
  },
  {
    title: "Measured, risk-first counsel",
    body: "We would rather give cautious advice that holds than optimistic advice that pleases. Our opinions say what we can support, and our clients know where they stand.",
  },
  {
    title: "Responsive to international counsel",
    body: "Much of our work comes from firms outside Nigeria. We keep their time zones, formats and reporting standards in mind, and we answer when they call.",
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
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        label="About us"
        title="A firm built on careful work."
        intro="Assuage Attorneys is a commercial law firm based in Lagos. We advise Nigerian and international clients on the corporate, finance and dispute matters that affect their businesses in Nigeria."
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
              The firm was established in Lagos by lawyers who had trained in larger commercial
              practices and wanted to build something more deliberate: a firm small enough for
              partners to know every file, and experienced enough for clients to trust with
              significant matters.
            </p>
            <p className="measure mt-5 leading-relaxed text-ink-soft">
              That shape has not changed. We remain a compact partnership by choice, taking on work
              we can do properly and declining what we cannot. Our clients are companies, investors,
              financial institutions and international law firms who need Nigerian counsel they can
              reach and rely on.
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
              To give clients clear, honest advice on Nigerian law, and to do the careful work that
              advice depends on.
            </p>
          </div>
          <div className="border-t-2 border-navy pt-8">
            <MicroLabel>Our vision</MicroLabel>
            <p className="display-3 mt-5 text-ink">
              To be the firm that serious clients call when the matter in front of them has to be
              done properly.
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

      {/* Documentary image */}
      <section aria-label="Lagos, where the firm is based">
        <Container className="pb-4">
          <div className="aspect-[16/9] overflow-hidden bg-mist">
            <img
              src={aboutLagos}
              alt="The Lagos Island skyline seen from the lagoon in morning haze"
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
          <p className="micro-label mt-4 text-ink-soft">Lagos Island, from the lagoon</p>
        </Container>
      </section>

      {/*
        Memberships & accreditations band.
        TODO: replace these placeholders with the firm's real professional
        memberships as small greyscale logos. If the firm has none, delete
        this entire section — nothing else depends on it.
      */}
      <section className="mt-16 bg-mist py-14" aria-labelledby="memberships-heading">
        <Container>
          <MicroLabel tone="muted">Memberships &amp; accreditations</MicroLabel>
          <h2 id="memberships-heading" className="sr-only">
            Memberships and accreditations
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Membership logo", "Membership logo", "Membership logo", "Membership logo"].map(
              (label, index) => (
                <div
                  key={index}
                  className="flex h-20 items-center justify-center border border-rule bg-paper grayscale"
                  aria-hidden="true"
                >
                  <span className="micro-label text-ink-soft/50">{label}</span>
                </div>
              )
            )}
          </div>
        </Container>
      </section>

      <ClosingBand />
    </>
  );
}
