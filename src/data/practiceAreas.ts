// Practice areas of Assuage Attorneys.
// Descriptions and service lists were supplied by the firm.
//
// The firm has not designated a lead partner per area, so `leadPartner` is
// optional and currently unset; the ledger omits the line when it is absent.

export interface PracticeArea {
  slug: string;
  name: string;
  /** Two-sentence summary revealed in the ledger. */
  summary: string;
  /** Longer overview paragraphs for the detail page. */
  overview: string[];
  /** "What we do" service list. */
  services: string[];
  /** Slug of the lead partner in team.ts, where the firm has named one. */
  leadPartner?: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "corporate",
    name: "Corporate Law",
    summary:
      "We advise individuals, businesses and companies at every stage of their operations, from establishment and structuring to transactions and negotiations. Our aim is to help businesses understand the legal implications of their decisions before those decisions become expensive problems.",
    overview: [
      "We advise individuals, businesses and companies at different stages of their operations, from establishment and structuring to transactions, negotiations and dispute resolution.",
      "We help businesses understand the legal implications of their decisions before those decisions become expensive problems. Whether you are starting a new venture, bringing in an investor or expanding an existing business, we provide legal guidance designed to protect your interest and facilitate growth.",
    ],
    services: [
      "Corporate structuring",
      "Company incorporation and regulatory compliance",
      "Shareholding and shareholders' agreements",
      "Investment agreements",
      "Joint ventures",
      "Corporate governance",
      "Commercial contracts",
      "Business negotiations",
      "Corporate advisory",
      "Due diligence",
      "Business restructuring",
      "Debt recovery",
      "Corporate dispute resolution",
      "Risk management",
      "Employment-related agreements",
    ],
  },
  {
    slug: "family-matrimonial",
    name: "Family & Matrimonial Law",
    summary:
      "We provide legal advice and representation in matters affecting families, marriages and family relationships. Our objective is not merely to litigate, but where possible to help clients reach fair and sustainable solutions.",
    overview: [
      "We provide legal advice and representation in matters affecting families, marriages and family relationships.",
      "Our objective is not merely to litigate family disputes, but where possible, to help clients achieve fair and sustainable solutions while protecting their legal rights and interest.",
    ],
    services: [
      "Matrimonial reliefs",
      "Guardianship and wardship",
      "Fostering and adoption",
      "Matrimonial property disputes",
      "Family settlements",
      "Prenuptial and postnuptial arrangements",
      "Family property and succession-related disputes",
      "Negotiation and settlement of matrimonial disputes",
    ],
  },
  {
    slug: "commercial",
    name: "Commercial Law",
    summary:
      "Commercial transactions are the foundation upon which businesses, investments and economic relationships are built. We provide strategic, commercially sound and practical solutions that protect our clients' interests while facilitating successful transactions.",
    overview: [
      "We understand that commercial transactions are the foundation upon which businesses, investments and economic relationships are built.",
      "Our commercial law practice is focused on providing strategic, commercially sound and practical legal solutions that protect our clients' interests while facilitating successful transactions and business relationships.",
    ],
    services: [
      "Commercial instruments",
      "Contracts of sale of goods",
      "Hire purchase transactions",
      "Agency transactions",
      "Trusteeship transactions",
      "Executorship disputes",
      "Bankruptcy disputes",
      "Mortgage transactions",
      "Partnership",
      "Insurance cases",
      "Intellectual property related matters",
    ],
  },
  {
    slug: "land-property",
    name: "Land & Property Law",
    summary:
      "Property transactions often involve significant financial commitments. We provide proper legal advice before you purchase, sell, develop or transfer property, and investigate title so that what you acquire is protected.",
    overview: [
      "Property transactions can involve significant financial commitments. We provide proper legal advice before purchasing, selling, developing or transferring property.",
      "At Assuage Attorneys we conduct every necessary legal check and investigate the title to ensure good title. We help our clients not just to buy property, but to buy property with proper legal protection.",
    ],
    services: [
      "Property sales and purchase disputes",
      "Land documentation",
      "Perfection of title",
      "Landlord and tenant matters",
      "Property development transactions",
      "Title verification",
      "Property deeds",
    ],
  },
  {
    slug: "dispute-resolution",
    name: "Dispute Resolution & Litigation",
    summary:
      "When disputes arise, our role is to protect our clients' interests and pursue the most appropriate resolution. We act in litigation, negotiation, mediation and other forms of alternative dispute resolution.",
    overview: [
      "When disputes arise, our role is to protect our clients' interests and pursue the most appropriate resolution.",
      "We represent clients in litigation and other forms of dispute resolution, and where any of these is applicable we provide strategic representation from the commencement of proceedings through to resolution.",
    ],
    services: [
      "Civil litigation",
      "Commercial disputes",
      "Property disputes",
      "Family and matrimonial disputes",
      "Debt recovery",
      "Corporate disputes",
      "Land disputes",
      "Negotiation",
      "Mediation",
      "Alternative dispute resolution",
    ],
  },
];

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}
