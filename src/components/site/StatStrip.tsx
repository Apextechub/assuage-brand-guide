import { practiceAreas } from "@/data/practiceAreas";
import { yearsInPractice } from "@/data/site";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";

/**
 * Credibility strip: display-face figures with micro-labels, separated by
 * vertical hairlines.
 *
 * Every figure is derived from real site data rather than written by hand, so
 * it cannot drift out of date as lawyers or practice areas are added.
 */
export function StatStrip() {
  const stats = [
    // Counts up from April 2022 on its own — no yearly edit needed.
    { value: String(yearsInPractice()).padStart(2, "0"), label: "Years in practice" },
    { value: String(practiceAreas.length).padStart(2, "0"), label: "Practice areas" },
    { value: String(team.length).padStart(2, "0"), label: "Lawyers" },
    { value: "Nigeria", label: "Where we practise" },
  ];

  return (
    <section aria-label="Firm at a glance" className="border-b border-rule">
      <div className="mx-auto grid w-full max-w-[76rem] grid-cols-2 px-5 md:grid-cols-4 md:px-10">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "py-10 md:py-14",
              index % 2 === 1 && "border-l border-rule pl-6 md:pl-10",
              index >= 2 && "border-t border-rule md:border-t-0",
              index >= 2 && "md:border-l md:pl-10",
            )}
          >
            <p className="font-display text-4xl tabular-nums text-ink md:text-6xl">{stat.value}</p>
            <p className="micro-label mt-3 text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
