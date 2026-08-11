// Central site data for Assuage Attorneys.
// TODO: replace all placeholder contact details, addresses, statistics and
// social URLs with the firm's real information before launch.

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
  // TODO: confirm the registered legal name (e.g. "Assuage Attorneys LP")
  legalName: "Assuage Attorneys",
  tagline: "A commercial law firm in Lagos, Nigeria.",
  description:
    "Assuage Attorneys is a commercial law firm based in Lagos, advising Nigerian and international clients on corporate, finance and dispute matters under Nigerian law.",
  // TODO: real contact details
  email: "contact@assuageattorneys.ng",
  phone: "+234 (0) 1 000 0000",
  // TODO: real office addresses
  offices: [
    {
      name: "Lagos",
      lines: ["00 Placeholder Avenue", "Victoria Island", "Lagos, Nigeria"],
    },
    {
      name: "Abuja",
      lines: ["00 Placeholder Crescent", "Central Business District", "Abuja, Nigeria"],
    },
  ] as Office[],
  // TODO: real social profiles
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  // Credibility strip. The figures are intentional placeholders until the
  // client confirms real numbers.
  // TODO: replace every "00" value with confirmed figures.
  stats: [
    { value: "00", label: "Years in practice" },
    { value: "00", label: "Lawyers" },
    { value: "00", label: "Practice areas" },
    { value: "00", label: "Offices" },
  ],
  nav: [
    { label: "About", to: "/about" },
    { label: "Practice Areas", to: "/practice-areas" },
    { label: "People", to: "/team" },
    { label: "Insights", to: "/insights" },
    { label: "News", to: "/news" },
    { label: "Careers", to: "/careers" },
  ] as NavItem[],
};
