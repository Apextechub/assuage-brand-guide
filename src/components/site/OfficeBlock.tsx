import type { Office } from "@/data/site";

/** One clearly marked block per office. */
export function OfficeBlock({ office }: { office: Office }) {
  return (
    <div className="border-t border-rule pt-6">
      <h3 className="micro-label text-gold-deep">{office.name} office</h3>
      <address className="mt-4 not-italic">
        {office.lines.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-ink-soft">
            {line}
          </p>
        ))}
      </address>
    </div>
  );
}
