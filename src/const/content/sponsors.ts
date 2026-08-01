// Not rendered yet — /sponsors is CTA-only until the confirmed sponsor list lands.
export type Sponsor = {
  name: string;
  /** Optional URL for the sponsor's website. */
  href?: string;
  /** Path under public/, e.g. "/sponsors/mckelvey.png". */
  logo?: string;
  /** One-line description of what they support. */
  blurb?: string;
  /** Tier displayed on the page. Order in `SPONSOR_TIERS` controls display order. */
  tier: "Founding" | "Major" | "Supporting" | "Partner";
};

export const SPONSOR_TIERS: Sponsor["tier"][] = [
  "Founding",
  "Major",
  "Supporting",
  "Partner",
];

export const sponsors: Sponsor[] = [
  {
    name: "McKelvey School of Engineering",
    href: "https://engineering.washu.edu/",
    blurb: "Our home school at Washington University in St. Louis.",
    tier: "Founding",
  },
  {
    name: "Missouri Space Grant Consortium",
    href: "https://mosgc.mst.edu/",
    blurb: "NASA-affiliated grant program supporting student spaceflight.",
    tier: "Major",
  },
  {
    name: "University Nanosatellite Program (UNP)",
    href: "https://unp.kirtland.af.mil/",
    blurb: "AFRL-led program developing the next generation of space engineers.",
    tier: "Major",
  },
];
