import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/data/site";

// TODO: placeholder terms for layout only. Have the firm approve final
// wording before launch.
const sections: { heading: string; body: string[] }[] = [
  {
    heading: "About this website",
    body: [
      `This website is published by ${site.name}, a commercial law firm based in Lagos, Nigeria. By using this website you accept these terms of use.`,
    ],
  },
  {
    heading: "Not legal advice",
    body: [
      "The content of this website, including articles and insights, is provided for general information only. It does not constitute legal advice, and reading it does not create a lawyer–client relationship. You should take specific advice before acting on anything published here.",
    ],
  },
  {
    heading: "Contacting us",
    body: [
      "Sending an enquiry through this website does not make you a client of the firm. Please do not send confidential information until we have confirmed in writing that we are able to act for you.",
    ],
  },
  {
    heading: "Accuracy",
    body: [
      "We take care to keep the information on this website accurate and current, but the law changes and we give no warranty that content is complete or up to date. We may amend or withdraw content at any time without notice.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      `The text, design and branding of this website belong to ${site.name}. You may share links to our pages, but you may not reproduce substantial content without our written permission.`,
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the Federal Republic of Nigeria, and the Nigerian courts have exclusive jurisdiction over any dispute arising from the use of this website.",
    ],
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Assuage Attorneys" },
      {
        name: "description",
        content: "The terms that govern use of the Assuage Attorneys website.",
      },
      { property: "og:title", content: "Terms of Use — Assuage Attorneys" },
      {
        property: "og:description",
        content: "The terms that govern use of the Assuage Attorneys website.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHeader
        label="Legal"
        title="Terms of Use"
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
