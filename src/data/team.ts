// Team members of Assuage Attorneys.
// TODO: all names, biographies, qualifications, matters and contact details
// are placeholders invented for layout. Replace with real people and approved
// copy before launch. Notable matters must never name clients without written
// consent, and must not claim outcomes or success rates.

import adaezeOkonkwo from "@/assets/team/adaeze-okonkwo.jpg";
import olumideAjayi from "@/assets/team/olumide-ajayi.jpg";
import ngoziNwosu from "@/assets/team/ngozi-nwosu.jpg";
import ibrahimDanladi from "@/assets/team/ibrahim-danladi.jpg";
import yetundeAlabi from "@/assets/team/yetunde-alabi.jpg";
import emekaObi from "@/assets/team/emeka-obi.jpg";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Practice area slugs from practiceAreas.ts. */
  practiceAreas: string[];
  email: string;
  linkedin: string;
  yearOfCall: number;
  qualifications: string[];
  bio: string[];
  /** Generic, client-anonymous matter descriptions. */
  matters: string[];
  portrait: string;
  portraitAlt: string;
}

export const team: TeamMember[] = [
  {
    slug: "adaeze-okonkwo",
    name: "Adaeze C. Okonkwo",
    role: "Managing Partner",
    practiceAreas: ["corporate-commercial", "mergers-acquisitions"],
    email: "aokonkwo@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 1998, // TODO
    qualifications: [
      "LL.B, University of Lagos", // TODO
      "B.L, Nigerian Law School",
      "LL.M, University College London",
    ],
    bio: [
      "Adaeze advises on corporate and commercial matters, with a particular focus on mergers, acquisitions and corporate governance. She has acted for Nigerian and foreign clients on transactions across financial services, energy and consumer markets.",
      "As managing partner she is responsible for the firm's client relationships and for the supervision of transaction teams. She is a frequent speaker at professional briefings on corporate law reform in Nigeria.",
    ],
    matters: [
      "Advised a foreign investor on the acquisition of a majority interest in a Nigerian manufacturing company.",
      "Acted as Nigerian counsel on a cross-border merger involving entities in three jurisdictions.",
      "Advised the board of a listed company on governance and disclosure obligations.",
      "Led due diligence on a series of private equity investments in the financial services sector.",
    ],
    portrait: adaezeOkonkwo,
    portraitAlt: "Portrait of Adaeze C. Okonkwo, Managing Partner",
  },
  {
    slug: "olumide-ajayi",
    name: "Olumide Ajayi",
    role: "Partner, Dispute Resolution",
    practiceAreas: ["dispute-resolution"],
    email: "oajayi@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 2001, // TODO
    qualifications: [
      "LL.B, Obafemi Awolowo University", // TODO
      "B.L, Nigerian Law School",
      "Chartered Institute of Arbitrators (UK), Member",
    ],
    bio: [
      "Olumide heads the firm's dispute resolution practice. He represents clients in commercial litigation before Nigerian superior courts and in domestic and international arbitrations.",
      "His practice covers shareholder disputes, commercial contract claims, banking litigation and the enforcement of arbitral awards. He also sits as an arbitrator and accepts mediation appointments.",
    ],
    matters: [
      "Represented a lender in the enforcement of security over assets located in multiple states.",
      "Acted for a contractor in an arbitration arising from an infrastructure concession.",
      "Advised a shareholder group in a dispute concerning the management of a joint venture company.",
      "Secured interim relief preserving assets pending the determination of an arbitral claim.",
    ],
    portrait: olumideAjayi,
    portraitAlt: "Portrait of Olumide Ajayi, Partner, Dispute Resolution",
  },
  {
    slug: "ngozi-nwosu",
    name: "Ngozi Nwosu",
    role: "Partner, Banking & Finance",
    practiceAreas: ["banking-finance", "capital-markets"],
    email: "nnwosu@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 2003, // TODO
    qualifications: [
      "LL.B, University of Nigeria", // TODO
      "B.L, Nigerian Law School",
      "LL.M (Banking and Finance), Queen Mary University of London",
    ],
    bio: [
      "Ngozi advises lenders and borrowers on financing transactions, including syndicated lending, project finance and debt restructuring. She also acts on capital markets transactions and securities regulation.",
      "Before joining the firm she worked in the legal department of a Nigerian commercial bank, where she was involved in credit documentation and regulatory compliance.",
    ],
    matters: [
      "Advised a syndicate of lenders on a facility for the expansion of a manufacturing plant.",
      "Acted for an issuer on a commercial paper programme listed on the exchange.",
      "Advised a development finance institution on Nigerian-law security arrangements.",
      "Advised a bank on its response to revised regulatory capital requirements.",
    ],
    portrait: ngoziNwosu,
    portraitAlt: "Portrait of Ngozi Nwosu, Partner, Banking & Finance",
  },
  {
    slug: "ibrahim-danladi",
    name: "Ibrahim Danladi",
    role: "Partner, Energy & Real Estate",
    practiceAreas: ["energy-natural-resources", "real-estate-construction"],
    email: "idanladi@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 2005, // TODO
    qualifications: [
      "LL.B, Ahmadu Bello University", // TODO
      "B.L, Nigerian Law School",
      "MBA, Lagos Business School",
    ],
    bio: [
      "Ibrahim advises on oil, gas and power transactions and on commercial real estate across Nigeria. His work spans licensing, project development, joint operating arrangements and land tenure matters.",
      "He acts for sponsors, lenders and contractors, and regularly advises on the interface between federal and state regulation in the energy sector.",
    ],
    matters: [
      "Advised a sponsor on the development of an embedded power project.",
      "Acted on the farm-in to an onshore oil mining lease, including regulatory approvals.",
      "Advised a developer on title perfection for a mixed-use development in Lagos.",
      "Advised a gas processing company on its sales and transportation arrangements.",
    ],
    portrait: ibrahimDanladi,
    portraitAlt: "Portrait of Ibrahim Danladi, Partner, Energy & Real Estate",
  },
  {
    slug: "yetunde-alabi",
    name: "Yetunde Alabi",
    role: "Senior Associate",
    practiceAreas: ["technology-media-telecommunications", "corporate-commercial"],
    email: "yalabi@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 2012, // TODO
    qualifications: [
      "LL.B, University of Ibadan", // TODO
      "B.L, Nigerian Law School",
      "Certified Information Privacy Professional (CIPP/E)",
    ],
    bio: [
      "Yetunde advises technology, fintech and media companies on licensing, data protection and commercial arrangements. She also supports the firm's corporate practice on venture and growth investments.",
      "She regularly assists clients with Nigeria Data Protection Act compliance, including audits, policies and regulator engagement.",
    ],
    matters: [
      "Advised a fintech company on its licensing application to the Central Bank of Nigeria.",
      "Supported a venture capital fund on a Series A investment in a Nigerian startup.",
      "Conducted data protection compliance reviews for companies in the financial and retail sectors.",
      "Advised a media company on content licensing and distribution agreements.",
    ],
    portrait: yetundeAlabi,
    portraitAlt: "Portrait of Yetunde Alabi, Senior Associate",
  },
  {
    slug: "emeka-obi",
    name: "Emeka Obi",
    role: "Associate",
    practiceAreas: ["dispute-resolution", "mergers-acquisitions"],
    email: "eobi@assuageattorneys.ng", // TODO
    linkedin: "#", // TODO
    yearOfCall: 2017, // TODO
    qualifications: [
      "LL.B, Nnamdi Azikiwe University", // TODO
      "B.L, Nigerian Law School",
    ],
    bio: [
      "Emeka is an associate in the firm's dispute resolution and corporate teams. He appears before the High Courts and supports partners in arbitration proceedings.",
      "He also assists on due diligence exercises and the preparation of transaction documents for mergers and acquisitions.",
    ],
    matters: [
      "Part of the team representing a distributor in a commercial contract dispute.",
      "Assisted on the due diligence for the acquisition of a logistics business.",
      "Supported counsel in an arbitration concerning a supply agreement.",
    ],
    portrait: emekaObi,
    portraitAlt: "Portrait of Emeka Obi, Associate",
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug);
}
