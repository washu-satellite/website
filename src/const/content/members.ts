import membersJson from "./members.json";

export type Member = {
  name: string;
  email?: string;
  teams: string[];
  isAdmin: boolean;
  /** Optional title, e.g. "President", "CFO / Business Operations". Shown on tiles + detail page. */
  role?: string;
  gradYear?: number;
  /** Path under public/headshots/, e.g. "/headshots/aavik.jpg". */
  headshot?: string;
  /** LinkedIn handle (e.g. "geoffrey-goffman") OR a full URL. */
  linkedin?: string;
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

/** Uppercase initials from a name, e.g. "Aidan Moriarty" -> "AM". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/** Convert a handle or full URL into a canonical LinkedIn URL. */
export function linkedinUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^\/+|\/+$/g, "").replace(/^in\//i, "");
  return `https://www.linkedin.com/in/${handle}`;
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
