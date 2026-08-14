import logoNavy from "@/assets/logo-navy.png";
import { cn } from "@/lib/utils";

/**
 * The firm wordmark. The master asset is the navy version on transparency;
 * `tone="white"` renders it white via a filter for use on navy/ink surfaces.
 * Never recolour to gold, never place on busy imagery, always keep clear
 * space around the mark.
 */
export function Logo({
  tone = "navy",
  className,
}: {
  tone?: "navy" | "white";
  className?: string;
}) {
  return (
    <img
      src={logoNavy}
      alt="Assuage Attorneys"
      width={824}
      height={702}
      className={cn("w-auto", tone === "white" && "brightness-0 invert", className)}
    />
  );
}
