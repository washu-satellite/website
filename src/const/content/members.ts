import membersJson from "./members.json";

export type Member = {
  name: string;
  gradYear: number;
  team: string;
  isAdmin: boolean;
};

export const members: Member[] = membersJson;

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function memberBySlug(slug: string): Member | undefined {
  return members.find((m) => slugify(m.name) === slug);
}

export function teamSlugs(): string[] {
  return Array.from(new Set(members.map((m) => m.team))).sort();
}

export function membersByTeam(teamSlug: string): Member[] {
  return members.filter(
    (m) => slugify(m.team) === slugify(teamSlug) || m.team === teamSlug,
  );
}
