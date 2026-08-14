import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { site, absoluteUrl } from "@/data/site";

// TODO: this is generic placeholder text, not reviewed privacy advice.
// Have the firm's compliance adviser approve final wording before launch.
const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      `${site.name} is a law firm based in Onitsha, Anambra State, Nigeria. This policy explains how we collect, use and protect personal data in connection with this website and our enquiries process, in line with the Nigeria Data Protection Act 2023.`,
    ],
  },
  {
    heading: "What we collect",
    body: [
      "When you contact us through this website, we collect the information you provide: your name, email address, telephone number and the content of your message. We do not collect special categories of personal data through this website, and we ask you not to send confidential documents until we confirm that we can act.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use the information you provide to respond to your enquiry, to assess whether we can act for you (including conflict checks) and, where you apply for a role, to consider your application. We do not use your information for marketing without your consent, and we do not sell personal data.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiry information is kept for as long as needed to handle your matter and for the retention periods our professional obligations require. Job applications are kept for twelve months unless you ask us to delete them sooner.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under the Nigeria Data Protection Act 2023 you may request access to your personal data, ask for it to be corrected or deleted, object to certain processing and lodge a complaint with the Nigeria Data Protection Commission. To exercise any of these rights, contact us using the details below.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about this policy or about how we handle personal data may be sent to ${site.email} or addressed to the Data Protection contact at our Onitsha office.`,
    ],
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Assuage Attorneys" },
      {
        name: "description",
        content: "How Assuage Attorneys collects, uses and protects personal data.",
      },
      { property: "og:title", content: "Privacy Policy — Assuage Attorneys" },
      {
        property: "og:description",
        content: "How Assuage Attorneys collects, uses and protects personal data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/privacy") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHeader
        label="Legal"
        title="Privacy Policy"
        intro="Last updated: [date to be confirmed]" // TODO
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="measure">
            {sections.map((section) => (
              <div key={section.heading} className="mb-12">
                <h2 className="display-3 text-ink">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="mt-4 leading-relaxed text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
