import { Link } from "@tanstack/react-router";
import type { TeamMember } from "@/data/team";
import { Portrait } from "./Portrait";

/** Portrait card — 3:4 crop, greyscale until hover/focus. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Link to="/team/$slug" params={{ slug: member.slug }} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-mist">
        <Portrait
          member={member}
          className="grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug text-ink transition-colors duration-200 group-hover:text-navy">
        {member.name}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
    </Link>
  );
}
