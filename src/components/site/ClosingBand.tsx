import { Container } from "./Container";
import { ButtonLink } from "./Button";

/** Quiet closing band on --ink with one line and a consultation CTA. */
export function ClosingBand({
  title = "When the matter warrants careful counsel.",
}: {
  title?: string;
}) {
  return (
    <section className="on-dark border-t-2 border-gold bg-ink">
      <Container className="flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <h2 className="display-2 max-w-xl text-paper">{title}</h2>
        <ButtonLink to="/contact" variant="inverse" className="shrink-0">
          Request a consultation
        </ButtonLink>
      </Container>
    </section>
  );
}
