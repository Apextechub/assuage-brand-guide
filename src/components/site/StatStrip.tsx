import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Credibility strip: display-face figures with micro-labels, separated by
 * vertical hairlines. Values are placeholders until the client confirms
 * real figures (see src/data/site.ts).
 */
export function StatStrip() {
  return (
    <section aria-label="Firm at a glance" className="border-b border-rule">
      <div className="mx-auto grid w-full max-w-[76rem] grid-cols-2 px-5 md:grid-cols-4 md:px-10">
        {site.stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "py-10 md:py-14",
              index % 2 === 1 && "border-l border-rule pl-6 md:pl-10",
              index >= 2 && "border-t border-rule md:border-t-0",
              index >= 2 && "md:border-l md:pl-10"
            )}
          >
            <p className="font-display text-5xl tabular-nums text-ink md:text-6xl">{stat.value}</p>
            <p className="micro-label mt-3 text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
