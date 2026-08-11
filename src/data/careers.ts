// Careers content for Assuage Attorneys.
// TODO: culture copy and open roles are placeholders. Replace with the firm's
// real vacancies and approved recruitment copy before launch.

export interface Role {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  closingDate: string; // ISO
  summary: string;
}

export const careersCopy = {
  culture: [
    "We are a small firm by design. Lawyers at Assuage work directly with partners from their first week, and are given responsibility for their own files as early as they are ready for it.",
    "We value careful drafting, plain language and punctuality. We do not measure contribution by hours alone, and we expect everyone in the firm — whatever their role — to treat clients and colleagues with courtesy.",
    "Training is structured but informal: weekly internal seminars, supervised court and transaction exposure, and support for professional qualifications where relevant to a lawyer's practice.",
  ], // TODO
};

export const openRoles: Role[] = [
  {
    slug: "senior-associate-dispute-resolution",
    title: "Senior Associate — Dispute Resolution",
    team: "Dispute Resolution",
    location: "Lagos",
    type: "Full-time",
    closingDate: "2026-09-30", // TODO
    summary:
      "We are seeking a senior associate with five to eight years' post-call experience in commercial litigation and arbitration. The role involves conduct of matters under partner supervision, supervision of associates and participation in client development.", // TODO
  },
  {
    slug: "associate-corporate-commercial",
    title: "Associate — Corporate & Commercial",
    team: "Corporate & Commercial",
    location: "Lagos",
    type: "Full-time",
    closingDate: "2026-09-30", // TODO
    summary:
      "We are seeking an associate with two to four years' post-call experience to support the firm's corporate and commercial practice, including transaction documentation, due diligence and company secretarial work.", // TODO
  },
  {
    slug: "graduate-trainee-nysc",
    title: "Graduate Trainee (NYSC)",
    team: "Rotation across practice areas",
    location: "Lagos",
    type: "National Youth Service",
    closingDate: "2026-12-31", // TODO
    summary:
      "We accept a small number of National Youth Service members each year as graduate trainees. Trainees rotate across practice areas and receive structured supervision from partners and senior associates.", // TODO
  },
];
