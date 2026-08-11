// Firm news for Assuage Attorneys.
// TODO: all items are placeholder announcements written for layout. Replace
// with real firm news before launch. Do not add rankings, awards or league
// table claims — see the firm's advertising obligations.

export interface NewsItem {
  slug: string;
  date: string; // ISO
  label: string;
  title: string;
  body: string;
}

export const news: NewsItem[] = [
  {
    slug: "associate-intake-2026",
    date: "2026-07-06",
    label: "People",
    title: "New associate intake joins the firm",
    body:
      "We are pleased to welcome three associates to our Lagos office following the completion of their National Youth Service. The new intake will rotate across the corporate, finance and disputes teams during their first year.", // TODO
  },
  {
    slug: "cbn-recapitalisation-briefing",
    date: "2026-04-15",
    label: "Briefing",
    title: "Client briefing: navigating the CBN recapitalisation programme",
    body:
      "The firm hosted a closed briefing for banking and corporate clients on the legal workstreams arising from the Central Bank of Nigeria's revised minimum capital requirements. A summary note is available to clients on request.", // TODO
  },
  {
    slug: "doing-business-nigeria-2026",
    date: "2026-02-20",
    label: "Publication",
    title: "Firm publishes 'Doing Business in Nigeria' 2026 guide",
    body:
      "Our updated guide for foreign investors and international counsel covers establishment, licensing, taxation, employment and dispute resolution under current Nigerian law. Copies are available on request.", // TODO
  },
  {
    slug: "arbitration-roundtable-2025",
    date: "2025-12-04",
    label: "Event",
    title: "Firm hosts roundtable on arbitration reform",
    body:
      "Partners from our dispute resolution practice joined in-house counsel and arbitrators for a roundtable discussion on the practical effect of the Arbitration and Mediation Act 2023, hosted at our Lagos office.", // TODO
  },
  {
    slug: "mentorship-programme-2025",
    date: "2025-10-06",
    label: "Community",
    title: "Firm supports young lawyers' mentorship programme",
    body:
      "Members of the firm are participating as mentors in a programme pairing early-career lawyers with practitioners across commercial practice areas, organised with a Lagos-based professional association.", // TODO
  },
];

export function formatNewsDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
