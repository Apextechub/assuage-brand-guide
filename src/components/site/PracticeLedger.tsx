import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { PracticeArea } from "@/data/practiceAreas";
import { getTeamMember } from "@/data/team";
import { ArrowLink } from "./Button";

/**
 * The signature element: practice areas as a legal ledger.
 * Rows expand on hover (pointer devices), on keyboard focus, and on
 * tap/click (touch + accordion). The numeral shifts ink → gold-deep.
 * Motion is a 340ms ease-out grid-rows transition, disabled under
 * prefers-reduced-motion (see styles.css).
 */
export function PracticeLedger({ areas }: { areas: PracticeArea[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="border-t border-rule">
      {areas.map((area, index) => {
        const open = openSlug === area.slug;
        // The firm has not named lead partners; the block below is skipped
        // until `leadPartner` is set in practiceAreas.ts.
        const partner = area.leadPartner ? getTeamMember(area.leadPartner) : undefined;
        const panelId = `ledger-panel-${area.slug}`;
        return (
          <div
            key={area.slug}
            className="ledger-row border-b border-rule"
            data-open={open ? "true" : "false"}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenSlug(open ? null : area.slug)}
                className="flex w-full cursor-pointer items-baseline gap-5 py-6 text-left md:gap-8 md:py-8"
              >
                <span className="ledger-numeral w-9 shrink-0 font-display text-lg tabular-nums md:text-xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-[1.65rem] leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
                  {area.name}
                </span>
                <span className="ledger-icon shrink-0 self-center">
                  <Plus className="size-5 md:size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div id={panelId} className="ledger-panel">
              <div>
                <div className="grid gap-6 pb-8 pl-14 pr-2 md:grid-cols-12 md:pl-[4.25rem]">
                  <p className="text-[0.95rem] leading-relaxed text-ink-soft md:col-span-7">
                    {area.summary}
                  </p>
                  <div className="flex flex-col items-start gap-4 md:col-span-4 md:col-start-9">
                    {partner ? (
                      <p className="text-sm">
                        <span className="micro-label block text-ink-soft">Lead partner</span>
                        <Link
                          to="/team/$slug"
                          params={{ slug: partner.slug }}
                          className="mt-1.5 inline-block font-medium text-ink underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-gold-deep hover:decoration-gold-deep"
                        >
                          {partner.name}
                        </Link>
                      </p>
                    ) : null}
                    <ArrowLink to="/practice-areas/$slug" params={{ slug: area.slug }}>
                      View practice area
                    </ArrowLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
