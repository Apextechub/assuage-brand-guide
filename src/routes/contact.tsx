import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { OfficeBlock } from "@/components/site/OfficeBlock";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/data/site";

const description =
  "Contact Assuage Attorneys in Onitsha, Anambra State. Schedule a consultation to discuss your circumstances and the appropriate next steps.";

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
        intro="Legal problems are often easier to manage when addressed early. Whether you need legal advice, documentation, representation or guidance, our team is available to discuss your circumstances and advise you on the appropriate next steps."
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
                <p className="mt-3 text-sm">
                  <span className="block text-ink-soft">Consultations</span>
                  <a
                    href={`mailto:${site.consultationEmail}`}
                    className="break-all text-gold-deep underline decoration-gold-deep/30 underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    {site.consultationEmail}
                  </a>
                </p>
                <p className="mt-3 text-sm">
                  <span className="block text-ink-soft">General enquiries</span>
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-gold-deep underline decoration-gold-deep/30 underline-offset-4 transition-colors duration-200 hover:text-ink"
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
    </>
  );
}
