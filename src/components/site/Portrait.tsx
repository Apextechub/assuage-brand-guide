import { initialsOf, type TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

/**
 * A lawyer's portrait, or a monogram where the firm has not supplied one.
 * Never substitutes a stock photograph for a real person.
 */
export function Portrait({
  member,
  className,
  eager = false,
}: {
  member: TeamMember;
  className?: string;
  eager?: boolean;
}) {
  if (member.portrait) {
    return (
      <img
        src={member.portrait}
        alt={member.portraitAlt ?? `Portrait of ${member.name}, ${member.role}`}
        width={768}
        height={1024}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("size-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-full items-center justify-center border border-rule bg-mist",
        className,
      )}
      role="img"
      aria-label={`${member.name}, ${member.role}`}
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl tracking-tight text-navy/25 md:text-6xl"
      >
        {initialsOf(member.name)}
      </span>
    </div>
  );
}
