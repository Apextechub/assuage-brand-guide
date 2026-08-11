import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { OfficeBlock } from "@/components/site/OfficeBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/data/site";

const description =
  "Contact Assuage Attorneys in Lagos, Nigeria. Request a consultation and a member of our team will respond within one business day.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Contact — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Request a consultation"
        intro="Tell us briefly about your matter and how to reach you. A member of our team will respond within one business day."
      />

      <section className="py-16 md:py-24" aria-label="Consultation request form and office details">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="bg-mist p-8">
              <MicroLabel>Offices</MicroLabel>
              <div className="mt-6 space-y-8">
                {site.offices.map((office) => (
                  <OfficeBlock key={office.name} office={office} />
                ))}
              </div>
              <div className="mt-8 border-t border-rule pt-6">
                <MicroLabel>Direct</MicroLabel>
                <p className="mt-4 text-sm">
                  <a
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                    className="text-ink transition-colors duration-200 hover:text-gold-deep"
                  >
                    {site.phone}
                  </a>
                </p>
                <p className="mt-2 text-sm">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-gold-deep underline decoration-gold-deep/30 underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    {site.email}
                  </a>
                </p>
              </div>
              <p className="mt-8 border-t border-rule pt-6 text-sm leading-relaxed text-ink-soft">
                Please do not send confidential documents until we have confirmed that we can act.
                Unsolicited information may not be treated as privileged.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      <section aria-label="Map of the Lagos office area" className="border-t border-rule">
        <Container className="py-16">
          <iframe
            title="Map showing Victoria Island, Lagos, where the firm's office is located"
            src="https://www.openstreetmap.org/export/embed.html?bbox=3.3950%2C6.4150%2C3.4500%2C6.4400&layer=mapnik&marker=6.4281%2C3.4219"
            className="h-[420px] w-full border border-rule grayscale"
            loading="lazy"
          />
          {/* TODO: confirm the office pin once the real address is available */}
          <p className="micro-label mt-4 text-ink-soft">Victoria Island, Lagos — indicative location</p>
        </Container>
      </section>
    </>
  );
}
