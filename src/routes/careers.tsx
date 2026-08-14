import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CareersForm } from "@/components/site/CareersForm";
import { Container } from "@/components/site/Container";
import { MicroLabel } from "@/components/site/MicroLabel";
import { PageHeader } from "@/components/site/PageHeader";
import { careersCopy, openRoles } from "@/data/careers";
import { formatNewsDate } from "@/data/news";
import { absoluteUrl } from "@/data/site";

const description =
  "Careers at Assuage Attorneys: current vacancies and graduate opportunities at a law firm in Onitsha, Anambra State.";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Assuage Attorneys" },
      { name: "description", content: description },
      { property: "og:title", content: "Careers — Assuage Attorneys" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/careers") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/careers") }],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <>
      <PageHeader
        label="Careers"
        title="Work with us"
        intro="We are always glad to hear from lawyers who share our commitment to integrity, excellence and genuine client service."
      />

      {/* Culture — appears once careersCopy.culture has paragraphs. */}
      {careersCopy.culture.length > 0 && (
        <section className="py-16 md:py-24" aria-labelledby="culture-heading">
          <Container className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <MicroLabel>Life at the firm</MicroLabel>
            </div>
            <div className="md:col-span-8">
              <h2 id="culture-heading" className="sr-only">
                Life at the firm
              </h2>
              {careersCopy.culture.map((paragraph: string) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="measure mb-5 leading-relaxed text-ink-soft first:text-lg first:text-ink"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Open roles */}
      <section className="border-t border-rule py-16 md:py-24" aria-labelledby="roles-heading">
        <Container>
          <MicroLabel>Open roles</MicroLabel>
          <h2 id="roles-heading" className="display-2 mt-4 text-ink">
            Current vacancies
          </h2>
          {openRoles.length === 0 ? (
            <div className="mt-10 border border-rule bg-mist p-10 text-center md:p-16">
              <p className="display-3 text-ink">No vacancies at the moment</p>
              <p className="measure mx-auto mt-4 text-ink-soft">
                We are not advertising a role right now, but we do consider speculative
                applications. Use the form below and we will keep your details on file.
              </p>
            </div>
          ) : (
            <div className="mt-10 border-t border-rule">
              {openRoles.map((role) => (
                <article
                  key={role.slug}
                  className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-8"
                >
                  <div className="md:col-span-7">
                    <h3 className="font-display text-2xl leading-snug text-ink">{role.title}</h3>
                    <p className="micro-label mt-3 text-ink-soft">
                      {role.team} · {role.location} · {role.type}
                    </p>
                    <p className="measure mt-4 text-sm leading-relaxed text-ink-soft">
                      {role.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-4 md:col-span-4 md:col-start-9 md:pt-1">
                    <p className="micro-label text-ink-soft">
                      Closing ·{" "}
                      <time dateTime={role.closingDate}>{formatNewsDate(role.closingDate)}</time>
                    </p>
                    <a
                      href="#apply"
                      className="group inline-flex items-center gap-2.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-gold-deep transition-colors duration-200 hover:text-ink"
                    >
                      <span className="underline decoration-gold-deep/30 underline-offset-8 transition-colors duration-200 group-hover:decoration-ink">
                        Apply for this role
                      </span>
                      <ArrowRight
                        className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Application form */}
      <section
        id="apply"
        className="border-t border-rule bg-mist py-16 md:py-24"
        aria-labelledby="apply-heading"
      >
        <Container className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <MicroLabel>Apply</MicroLabel>
            <h2 id="apply-heading" className="display-2 mt-4 text-ink">
              Application
            </h2>
            <p className="measure mt-6 text-sm leading-relaxed text-ink-soft">
              Attach your CV and tell us which role you are applying for. Speculative applications
              are welcome; we keep them on file for twelve months and contact candidates when a
              suitable role opens.
            </p>
          </div>
          <div className="md:col-span-7">
            <CareersForm />
          </div>
        </Container>
      </section>
    </>
  );
}
