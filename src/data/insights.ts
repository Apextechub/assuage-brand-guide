// Insights (articles) published by Assuage Attorneys.
// TODO: all articles are placeholder copy written to demonstrate layout, tone
// and typography. Replace with the firm's real publications before launch.
// Nothing here constitutes legal advice.

import corporateCama from "@/assets/insights/corporate-cama.jpg";
import financeCapital from "@/assets/insights/finance-capital.jpg";
import arbitration from "@/assets/insights/arbitration.jpg";
import electricity from "@/assets/insights/electricity.jpg";
import dataProtection from "@/assets/insights/data-protection.jpg";
import forex from "@/assets/insights/forex.jpg";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export interface Insight {
  slug: string;
  title: string;
  category: string;
  /** ISO date string. */
  date: string;
  readTime: string;
  excerpt: string;
  /** Author slug from team.ts. */
  author: string;
  image: string;
  imageAlt: string;
  content: ContentBlock[];
}

export const insightCategories = [
  "Corporate",
  "Finance",
  "Dispute Resolution",
  "Energy",
  "Technology",
] as const;

export const insights: Insight[] = [
  {
    slug: "cbn-recapitalisation-practical-steps",
    title: "The CBN recapitalisation programme: practical steps for banks and their corporate borrowers",
    category: "Finance",
    date: "2026-06-30",
    readTime: "7 min read",
    excerpt:
      "The Central Bank of Nigeria's revised minimum capital requirements continue to reshape lending relationships. We outline the practical steps boards and treasury teams should be taking now.",
    author: "ngozi-nwosu",
    image: financeCapital,
    imageAlt: "Financial documents and a pen on a dark wooden desk",
    content: [
      {
        type: "p",
        text: "The Central Bank of Nigeria's programme of revised minimum capital requirements for banks has moved from announcement to implementation. For banks, the options — rights issues, public offers, private placements and mergers — each carry distinct legal workstreams. For corporate borrowers, the programme is quietly changing the terms on which credit is available.",
      },
      {
        type: "p",
        text: "This note summarises the legal considerations we are most frequently asked about, from both sides of the lending relationship.",
      },
      { type: "h2", text: "For banks: sequencing the raise" },
      {
        type: "p",
        text: "A capital raise under the programme typically involves shareholder approvals, regulatory clearances from the Central Bank and the Securities and Exchange Commission, and, where a listing is involved, engagement with the exchange. Sequencing matters: approvals obtained in the wrong order can cost months.",
      },
      {
        type: "p",
        text: "Boards should also consider the corporate approvals required under the Companies and Allied Matters Act 2020, including any increase in issued share capital and amendments to the company's constitution.",
      },
      { type: "h2", text: "For borrowers: expect tighter documentation" },
      {
        type: "p",
        text: "As banks manage capital adequacy, we are seeing closer scrutiny of security packages, more conservative facility covenants and greater emphasis on perfection. Borrowers should review existing facilities for cross-default exposure and ensure that title documents and security filings are in order before approaching lenders.",
      },
      {
        type: "quote",
        text: "The institutions that prepare their documentation early will find the market more receptive than those that treat recapitalisation as someone else's problem.",
      },
      { type: "h2", text: "What we advise" },
      {
        type: "p",
        text: "Whether raising or borrowing, early legal input reduces cost. We recommend a documentation audit, a clear approvals timetable and early engagement with regulators where novel structures are proposed.",
      },
      {
        type: "p",
        text: "This article is for general information only and does not constitute legal advice. Specific advice should be sought on any particular matter.",
      },
    ],
  },
  {
    slug: "third-party-funding-arbitration-nigeria",
    title: "Third-party funding of arbitration in Nigeria: a cautious opening",
    category: "Dispute Resolution",
    date: "2026-05-12",
    readTime: "6 min read",
    excerpt:
      "The Arbitration and Mediation Act 2023 opened the door to third-party funding of disputes in Nigeria. We consider what funders and claimants should understand before proceeding.",
    author: "olumide-ajayi",
    image: arbitration,
    imageAlt: "An empty modern arbitration hearing room with a long table",
    content: [
      {
        type: "p",
        text: "For many years, the common law doctrines of maintenance and champerty made third-party funding of litigation and arbitration uncertain in Nigeria. The Arbitration and Mediation Act 2023 changed that position for arbitration, expressly recognising third-party funding and requiring disclosure of funding arrangements.",
      },
      { type: "h2", text: "What the Act provides" },
      {
        type: "p",
        text: "Under the Act, a party to arbitral proceedings may enter into an agreement with a third-party funder, and must disclose the existence of the funding and the identity of the funder to the tribunal and the other party. Costs consequences may follow where disclosure is not made.",
      },
      {
        type: "p",
        text: "The Act does not, however, resolve every question. The enforceability of particular funding terms, the treatment of success fees and the position of funders in related court proceedings remain matters on which practice is still developing.",
      },
      {
        type: "quote",
        text: "Funding is now possible, but the quality of the funding agreement will determine whether it helps or complicates the arbitration.",
      },
      { type: "h2", text: "Practical considerations" },
      {
        type: "p",
        text: "Claimants considering funding should expect funders to conduct rigorous case assessment, including merits, quantum and enforceability of any award. Funding agreements should address control of strategy, settlement approval, termination and the treatment of adverse costs.",
      },
      {
        type: "p",
        text: "We advise both claimants and funders on structuring these arrangements under Nigerian law. This article is for general information only and does not constitute legal advice.",
      },
    ],
  },
  {
    slug: "state-electricity-markets-electricity-act-2023",
    title: "State electricity markets under the Electricity Act 2023",
    category: "Energy",
    date: "2026-03-18",
    readTime: "8 min read",
    excerpt:
      "The Electricity Act 2023 empowers states to regulate electricity within their territories. We examine how state markets are taking shape and what investors should watch.",
    author: "ibrahim-danladi",
    image: electricity,
    imageAlt: "High-voltage power transmission lines against a hazy sky",
    content: [
      {
        type: "p",
        text: "The Electricity Act 2023 marked a structural change in the regulation of electricity in Nigeria. Following the constitutional amendment of 2023, states may now legislate on the generation, transmission and distribution of electricity within their territories, and several states have begun to establish their own regulatory commissions.",
      },
      { type: "h2", text: "The emerging map" },
      {
        type: "p",
        text: "A growing number of states have enacted electricity laws and commenced the transfer of regulatory oversight from the Nigerian Electricity Regulatory Commission. The pace and detail of these transitions differ considerably, and investors should not assume uniformity across states.",
      },
      {
        type: "p",
        text: "Projects that cross state boundaries, or that rely on the national grid, continue to engage federal regulation. The interaction between state and federal licensing is one of the areas where careful structuring advice is most valuable.",
      },
      {
        type: "quote",
        text: "The opportunity in state markets is real, but so is the regulatory divergence. Each state must be assessed on its own framework.",
      },
      { type: "h2", text: "What investors should examine" },
      {
        type: "p",
        text: "Before committing to a state market, investors should review the state electricity law, the status of the state regulator, tariff methodology, licensing procedures and the treatment of existing distribution arrangements. Community and land considerations remain governed by state-level land law as well.",
      },
      {
        type: "p",
        text: "We advise sponsors, lenders and state governments on these transitions. This article is for general information only and does not constitute legal advice.",
      },
    ],
  },
  {
    slug: "nigeria-data-protection-act-compliance-priorities",
    title: "The Nigeria Data Protection Act: compliance priorities for 2026",
    category: "Technology",
    date: "2026-01-27",
    readTime: "5 min read",
    excerpt:
      "With the Nigeria Data Protection Commission now fully operational, enforcement is increasing. We set out the compliance priorities we advise clients to address first.",
    author: "yetunde-alabi",
    image: dataProtection,
    imageAlt: "Repeating glass panels of a modern building facade",
    content: [
      {
        type: "p",
        text: "The Nigeria Data Protection Act 2023 established a comprehensive framework for the processing of personal data and created the Nigeria Data Protection Commission as the sector's regulator. Registration of data controllers and processors of major importance, compliance audits and enforcement activity have all gathered pace.",
      },
      { type: "h2", text: "Start with the register" },
      {
        type: "p",
        text: "Organisations cannot comply with what they have not mapped. A data register — recording what personal data is held, where it came from, who it is shared with and how long it is kept — is the foundation of every other compliance step.",
      },
      {
        type: "quote",
        text: "Most enforcement encounters we see begin with documentation gaps, not deliberate misuse. The register is where compliance starts.",
      },
      { type: "h2", text: "Priorities for the year" },
      {
        type: "p",
        text: "Beyond the register, we advise clients to prioritise: registration with the Commission where required; appointment and training of a data protection officer; review of privacy notices and consent language; processor and cross-border transfer agreements; and a tested breach response procedure.",
      },
      {
        type: "p",
        text: "Sector regulators, including the Central Bank of Nigeria, impose additional requirements on regulated entities. This article is for general information only and does not constitute legal advice.",
      },
    ],
  },
  {
    slug: "cama-2020-governance-duties-boards-overlook",
    title: "CAMA 2020 five years on: governance duties boards still overlook",
    category: "Corporate",
    date: "2025-11-10",
    readTime: "6 min read",
    excerpt:
      "The Companies and Allied Matters Act 2020 modernised Nigerian company law, but several of its governance provisions remain under-applied in practice. We highlight the duties boards most often miss.",
    author: "adaeze-okonkwo",
    image: corporateCama,
    imageAlt: "Modern glass office towers on Victoria Island, Lagos",
    content: [
      {
        type: "p",
        text: "The Companies and Allied Matters Act 2020 was the most significant reform of Nigerian company law in three decades. Much attention has been given to its headline changes — single-member companies, electronic filings and smaller company exemptions — but several governance duties it restated or introduced remain under-applied.",
      },
      { type: "h2", text: "Directors' duties are codified" },
      {
        type: "p",
        text: "The Act codifies directors' duties of care, skill, loyalty and good faith. Boards should treat these as operational standards, not abstractions: minutes, conflicts registers and documented deliberation are the evidence that duties were discharged.",
      },
      {
        type: "p",
        text: "We continue to see companies without a conflicts register, without written terms for committee delegation, and with statutory registers that have not been updated since incorporation. Each is a compliance exposure.",
      },
      {
        type: "quote",
        text: "Good governance under CAMA is mostly documentary discipline. The companies that keep clean records rarely have governance disputes that reach us.",
      },
      { type: "h2", text: "Beneficial ownership and disclosure" },
      {
        type: "p",
        text: "The Act's disclosure regime for persons with significant control requires companies to maintain and file beneficial ownership information. This obligation is increasingly relevant in financing and investment transactions, where incomplete registers delay due diligence.",
      },
      {
        type: "p",
        text: "We advise boards and company secretaries on putting these arrangements in order. This article is for general information only and does not constitute legal advice.",
      },
    ],
  },
  {
    slug: "foreign-exchange-contract-drafting-notes",
    title: "Foreign exchange volatility and contract drafting: practical notes",
    category: "Finance",
    date: "2025-09-22",
    readTime: "5 min read",
    excerpt:
      "Exchange rate movements have tested commercial contracts across sectors. We set out drafting approaches that allocate currency risk clearly and reduce the scope for dispute.",
    author: "ngozi-nwosu",
    image: forex,
    imageAlt: "Lagos marina with harbour cranes under an overcast sky",
    content: [
      {
        type: "p",
        text: "Periods of exchange rate volatility expose weaknesses in commercial contracts. Provisions that seemed routine when signed — payment currency, price adjustment, force majeure — become the subject of dispute when the naira moves sharply.",
      },
      { type: "h2", text: "Currency of payment" },
      {
        type: "p",
        text: "Contracts should state the currency of account and the currency of payment distinctly, and address the source and date of any conversion rate. Silence on these points invites disagreement; ambiguity is usually resolved against the party that drafted it.",
      },
      {
        type: "p",
        text: "Where foreign currency obligations are involved, parties should also consider the regulatory framework for foreign exchange, including the documentation required to access official channels.",
      },
      {
        type: "quote",
        text: "Currency risk cannot be drafted away, but it can be allocated clearly. Clear allocation is what keeps commercial relationships intact through volatility.",
      },
      { type: "h2", text: "Adjustment and hardship" },
      {
        type: "p",
        text: "Price adjustment clauses tied to published indices, and carefully drafted hardship provisions, give contracts room to absorb movement without resort to termination or litigation. Nigerian courts will generally hold parties to their bargain, so the drafting is the protection.",
      },
      {
        type: "p",
        text: "We advise on contract structures for volatile conditions. This article is for general information only and does not constitute legal advice.",
      },
    ],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((article) => article.slug === slug);
}

export function formatInsightDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
