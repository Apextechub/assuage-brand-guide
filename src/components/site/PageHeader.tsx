import { Container } from "./Container";
import { MicroLabel } from "./MicroLabel";

/** Interior page hero: eyebrow label, display title, optional intro. */
export function PageHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-rule">
      <Container className="pb-14 pt-32 md:pb-20 md:pt-44">
        <MicroLabel>{label}</MicroLabel>
        <h1 className="display-1 mt-5 max-w-4xl text-ink">{title}</h1>
        {intro ? (
          <p className="measure mt-7 text-lg leading-relaxed text-ink-soft">{intro}</p>
        ) : null}
      </Container>
    </section>
  );
}
