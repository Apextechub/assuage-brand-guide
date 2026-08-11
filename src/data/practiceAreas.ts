// Practice areas for Assuage Attorneys.
// TODO: all copy below is plausible placeholder text written for layout and
// tone. Replace with the firm's real descriptions before launch.

export interface PracticeArea {
  slug: string;
  name: string;
  /** Two-sentence summary revealed in the ledger. */
  summary: string;
  /** Longer overview paragraphs for the detail page. */
  overview: string[];
  /** "What we do" service list. */
  services: string[];
  /** Slug of the lead partner in team.ts. */
  leadPartner: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "corporate-commercial",
    name: "Corporate & Commercial",
    summary:
      "Advice on company formation, governance, commercial contracts and regulatory compliance under Nigerian law. We act for private companies, multinationals and their investors across the life of a business.",
    overview: [
      "Our corporate and commercial practice advises businesses at every stage, from establishment and structuring through to governance, contracting and ongoing compliance with the Companies and Allied Matters Act 2020 and related regulation.",
      "We work with Nigerian companies, foreign investors and international counsel who need clear, practical advice on how Nigerian law affects their transactions and operations.",
    ],
    services: [
      "Company incorporation and structuring",
      "Corporate governance and board advisory",
      "Commercial contracts and trading arrangements",
      "Regulatory compliance and licensing",
      "Company secretarial services",
      "Foreign investment and business establishment",
    ],
    leadPartner: "adaeze-okonkwo",
  },
  {
    slug: "mergers-acquisitions",
    name: "Mergers & Acquisitions",
    summary:
      "Advice on share and asset acquisitions, mergers, joint ventures and corporate restructurings. We manage due diligence, negotiation and documentation through to closing.",
    overview: [
      "We act for buyers, sellers and investors on private mergers and acquisitions in Nigeria, including share purchases, asset transfers, schemes of arrangement and joint ventures.",
      "Our role typically spans structuring, legal due diligence, negotiation of transaction documents, regulatory approvals and completion, working closely with clients' financial and tax advisers.",
    ],
    services: [
      "Share and asset acquisitions",
      "Mergers and schemes of arrangement",
      "Joint ventures and strategic alliances",
      "Legal due diligence",
      "Corporate restructurings",
      "Private equity and venture transactions",
    ],
    leadPartner: "adaeze-okonkwo",
  },
  {
    slug: "banking-finance",
    name: "Banking & Finance",
    summary:
      "Advice to lenders and borrowers on lending, security and structured finance transactions. Our work covers syndicated lending, project finance and debt restructuring.",
    overview: [
      "Our banking and finance practice acts for commercial banks, development finance institutions, other lenders and corporate borrowers on Nigerian-law aspects of financing transactions.",
      "We advise on facility documentation, security creation and perfection, and the regulatory framework administered by the Central Bank of Nigeria.",
    ],
    services: [
      "Syndicated and bilateral lending",
      "Security creation and perfection",
      "Project and infrastructure finance",
      "Trade and receivables finance",
      "Debt restructuring and rescheduling",
      "Regulatory advice for financial institutions",
    ],
    leadPartner: "ngozi-nwosu",
  },
  {
    slug: "capital-markets",
    name: "Capital Markets",
    summary:
      "Advice on equity and debt capital raising, listings and securities regulation in Nigeria. We act for issuers, sponsors and advisers before the Securities and Exchange Commission and the exchanges.",
    overview: [
      "We advise issuers, issuing houses, sponsors and other market participants on public offers, listings and private placements under the Investments and Securities Act and the rules of the Nigerian exchanges.",
      "The practice also covers continuing obligations, corporate governance requirements for listed companies and securities regulation generally.",
    ],
    services: [
      "Initial public offerings and listings",
      "Bond issuance and commercial paper programmes",
      "Rights issues and public offers",
      "Securities regulation and compliance",
      "Collective investment schemes",
      "Continuing disclosure obligations",
    ],
    leadPartner: "ngozi-nwosu",
  },
  {
    slug: "dispute-resolution",
    name: "Dispute Resolution & Arbitration",
    summary:
      "Representation in commercial litigation, arbitration and mediation before Nigerian courts and tribunals. We focus on early assessment and, where possible, negotiated resolution.",
    overview: [
      "Our disputes practice represents companies and individuals in commercial litigation before Nigerian courts and in domestic and international arbitration under the Arbitration and Mediation Act 2023.",
      "We place emphasis on early, candid assessment of a dispute, and on negotiated or mediated resolution where that serves the client's interests better than a full hearing.",
    ],
    services: [
      "Commercial litigation",
      "Domestic and international arbitration",
      "Mediation and negotiated settlement",
      "Enforcement of judgments and arbitral awards",
      "Injunctive and interim relief",
      "Regulatory investigations and inquiries",
    ],
    leadPartner: "olumide-ajayi",
  },
  {
    slug: "energy-natural-resources",
    name: "Energy & Natural Resources",
    summary:
      "Advice on oil, gas and power transactions and the regulation of Nigeria's energy sector. We act for sponsors, lenders and contractors across upstream, midstream and power.",
    overview: [
      "We advise participants in Nigeria's energy sector on transactions and regulation under the Petroleum Industry Act 2021, the Electricity Act 2023 and related frameworks.",
      "Our work covers upstream acquisitions and farm-ins, gas commercialisation, power project development and the interface between federal and state regulation.",
    ],
    services: [
      "Upstream licensing, acquisitions and farm-ins",
      "Gas sales, processing and transportation agreements",
      "Power project development and regulation",
      "Energy sector compliance",
      "Joint operating and concession arrangements",
      "Environmental and host community matters",
    ],
    leadPartner: "ibrahim-danladi",
  },
  {
    slug: "real-estate-construction",
    name: "Real Estate & Construction",
    summary:
      "Advice on the acquisition, development, financing and leasing of commercial real estate in Nigeria. We also act on construction contracts and related disputes.",
    overview: [
      "Our real estate practice advises investors, developers, lenders and occupiers on Nigerian property transactions, including title investigation, perfection and the consent requirements under the Land Use Act.",
      "On the construction side, we act on procurement, standard-form and bespoke contracts, and disputes arising from development projects.",
    ],
    services: [
      "Title investigation and perfection",
      "Acquisitions and disposals",
      "Commercial leasing",
      "Real estate finance and security",
      "Construction and engineering contracts",
      "Land use regularisation and compensation",
    ],
    leadPartner: "ibrahim-danladi",
  },
  {
    slug: "technology-media-telecommunications",
    name: "Technology, Media & Telecommunications",
    summary:
      "Advice to technology companies, investors and regulators on licensing, data protection and commercial arrangements. We also act for fintech and media businesses.",
    overview: [
      "We advise technology, fintech, media and telecommunications businesses on the Nigerian regulatory and commercial framework, including licensing by the NCC and CBN and compliance with the Nigeria Data Protection Act 2023.",
      "The practice combines regulatory advice with transactional work for investors and founders in the sector.",
    ],
    services: [
      "Technology licensing and SaaS agreements",
      "Data protection and privacy compliance",
      "Fintech regulation and licensing",
      "Telecommunications licensing and regulation",
      "Intellectual property protection",
      "Venture capital and growth investment",
    ],
    leadPartner: "yetunde-alabi",
  },
];

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}
