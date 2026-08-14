// Central site data for Assuage Attorneys.
// All details below were supplied by the firm.

export interface Office {
  name: string;
  lines: string[];
}

export interface NavItem {
  label: string;
  to: string;
}

export const site = {
  name: "Assuage Attorneys",
  legalName: "Assuage Attorneys",
  tagline: "Addressing legal concerns with ease.",
  description:
    "Assuage Attorneys is a Nigerian law firm based in Onitsha, Anambra State, providing legal services to individuals, families, entrepreneurs, companies and organisations.",
  /** The firm was founded in April 2022. */
  founded: 2022,
  foundedLabel: "April 2022",
  /** General enquiries. */
  email: "thefirm@assuageattorneys.com",
  /** Consultation requests — where the contact form is addressed. */
  consultationEmail: "info@assuageattorneys.com",
  phone: "+234 806 050 5087",
  offices: [
    {
      name: "Onitsha",
      lines: ["No. 8 Niger Drive", "G.R.A, Onitsha", "Anambra State, Nigeria"],
    },
  ] as Office[],
  // Tracking parameters are stripped: these are the canonical profile URLs.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/assuage-attorney/" },
    { label: "Instagram", href: "https://www.instagram.com/assuage_attorneyss" },
    { label: "Facebook", href: "https://www.facebook.com/Assuage.Attorneys" },
    { label: "TikTok", href: "https://www.tiktok.com/@assuageattorneys" },
  ] as { label: string; href: string }[],
  nav: [
    { label: "About", to: "/about" },
    { label: "Practice Areas", to: "/practice-areas" },
    { label: "People", to: "/team" },
    { label: "Insights", to: "/insights" },
    { label: "News", to: "/news" },
    { label: "Careers", to: "/careers" },
  ] as NavItem[],
};

/** Whole years since the firm was founded in April 2022. */
export function yearsInPractice(now: Date = new Date()): number {
  const founding = new Date("2022-04-01T00:00:00");
  let years = now.getFullYear() - founding.getFullYear();
  if (now.getMonth() < founding.getMonth()) years -= 1;
  return Math.max(0, years);
}
