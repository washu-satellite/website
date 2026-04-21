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

/** Unique team names across all members, sorted with Exec pinned first. */
export function teamNames(): string[] {
  const set = new Set<string>();
  for (const m of members) for (const t of m.teams) set.add(t);
  return Array.from(set).sort((a, b) => {
    if (a === "Exec") return -1;
    if (b === "Exec") return 1;
    return a.localeCompare(b);
  });
}
