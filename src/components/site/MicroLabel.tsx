import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Eyebrow / section label — Inter Tight, uppercase, 11px, 0.14em tracking.
 * `goldDeep` is the accessible gold for light surfaces; `gold` is reserved
 * for dark surfaces only.
 */
export function MicroLabel({
  children,
  tone = "goldDeep",
  className,
}: {
  children: ReactNode;
  tone?: "goldDeep" | "gold" | "muted";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "micro-label",
        tone === "goldDeep" && "text-gold-deep",
        tone === "gold" && "text-gold",
        tone === "muted" && "text-ink-soft",
        className
      )}
    >
      {children}
    </p>
  );
}
