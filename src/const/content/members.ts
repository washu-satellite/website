import membersJson from "./members.json";

export type Member = {
  name: string;
  email?: string;
  teams: string[];
  isAdmin: boolean;
  gradYear?: number;
};

export const members: Member[] = membersJson;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function memberBySlug(slug: string): Member | undefined {
  return members.find((m) => slugify(m.name) === slug);
}

/** Primary team = first listed team. Used for /team grouping. */
export function primaryTeam(m: Member): string {
  return m.teams[0] ?? "Unassigned";
}
