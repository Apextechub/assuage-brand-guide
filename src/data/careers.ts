// Careers content for Assuage Attorneys.
//
// The firm has not supplied recruitment copy or vacancies, so both are empty
// rather than invented. The careers page handles an empty list by inviting
// speculative applications to the firm's general address.
//
// To advertise a role, add it to `openRoles`; to describe the firm as a place
// to work, add paragraphs to `careersCopy.culture`. Both appear automatically.

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
  culture: [] as string[],
};

export const openRoles: Role[] = [];
