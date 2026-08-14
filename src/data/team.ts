// Lawyers of Assuage Attorneys.
//
// Names, roles, biographies and portraits were supplied by the firm. Fields the
// firm has not provided — individual email addresses, LinkedIn profiles, year of
// call, qualifications and notable matters — are deliberately absent rather than
// invented, and every page that shows them handles their absence.
//
// Notable matters, if added later, must never name clients without written
// consent, and must not claim outcomes or success rates.

import adaoraCynthiaUdenze from "@/assets/team/adaora-cynthia-udenze.webp";
import nwokembaGift from "@/assets/team/nwokemba-gift.webp";
import ofoegbuFavourNneoma from "@/assets/team/ofoegbu-favour-nneoma.webp";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Practice area slugs from practiceAreas.ts. */
  practiceAreas: string[];
  bio: string[];
  email?: string;
  linkedin?: string;
  yearOfCall?: number;
  qualifications?: string[];
  /** Generic, client-anonymous matter descriptions. */
  matters?: string[];
  portrait?: string;
  portraitAlt?: string;
}

export const team: TeamMember[] = [
  {
    slug: "nwokemba-gift",
    name: "Nwokemba Gift",
    role: "Founder & Managing Partner",
    practiceAreas: [
      "corporate",
      "commercial",
      "land-property",
      "family-matrimonial",
      "dispute-resolution",
    ],
    bio: [
      "Nwokemba Gift Esq. is the founder and managing partner of Assuage Attorneys. She is a dedicated legal practitioner with a growing practice spanning business and commercial law, land law, family law and dispute resolution.",
      "Her approach to legal practice is rooted in the belief that a lawyer should do more than identify the law: they should also anticipate risks, simplify complexity and provide practical solutions. That philosophy reflects the very essence of Assuage.",
      "Gift has developed a particular interest in matters involving families, businesses and commercial relationships, with a strong appreciation for the legal structures that protect people and their investments.",
      "Beyond her private practice, she is passionate about the professional development and advancement of lawyers. Her involvement in the Nigerian Bar Association Young Lawyers' Forum as Chairman of the Onitsha branch reflects her commitment to creating opportunities for young practitioners to learn, collaborate and grow within the profession.",
    ],
    portrait: nwokembaGift,
    portraitAlt: "Portrait of Nwokemba Gift, Founder and Managing Partner",
  },
  {
    slug: "ofoegbu-favour-nneoma",
    name: "Ofoegbu Favour Nneoma",
    role: "Associate",
    practiceAreas: ["commercial", "corporate", "dispute-resolution"],
    bio: [
      "Ofoegbu Favour Nneoma Esq. is a legal practitioner and attorney at Assuage Attorneys, specialising in commercial litigation, corporate governance and data protection law.",
      "With a practice built at the intersection of business strategy and litigation, she provides strategic counsel to fast-growing startups and businesses navigating complex legal landscapes.",
      "She is also a familiar face in the digital world of law practice, both as a legal adviser and as a commentator on legal issues.",
    ],
    portrait: ofoegbuFavourNneoma,
    portraitAlt: "Portrait of Ofoegbu Favour Nneoma, Associate",
  },
  {
    slug: "adaora-cynthia-udenze",
    name: "Adaora Cynthia Udenze",
    role: "Associate",
    practiceAreas: ["dispute-resolution", "commercial", "land-property"],
    bio: [
      "Adaora Cynthia Udenze Esq. is a legal practitioner at Assuage Attorneys with a passion for litigation and practical legal advocacy.",
      "She has experience representing clients in court, particularly in civil and commercial disputes, debt recovery and land-related matters.",
      "She approaches every case with thorough preparation, strong advocacy and attention to detail, and has built a practice grounded in integrity, excellence and professionalism.",
    ],
    portrait: adaoraCynthiaUdenze,
    portraitAlt: "Portrait of Adaora Cynthia Udenze, Associate",
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug);
}

/** Initials for the monogram shown where a lawyer has no portrait. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
