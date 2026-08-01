export type Social = {
  platform: "Instagram" | "LinkedIn" | "YouTube" | "GitHub";
  /** Display text. The @handle where the platform has one. */
  handle: string;
  href: string;
  /** Rendered in the homepage hero. Everything shows in the footer regardless. */
  inHero: boolean;
};

export const socials: Social[] = [
  {
    platform: "Instagram",
    handle: "@washusatellite",
    href: "https://www.instagram.com/washusatellite/",
    inHero: true,
  },
  {
    platform: "LinkedIn",
    handle: "@washu-satellite",
    href: "https://www.linkedin.com/company/washu-satellite/",
    inHero: true,
  },
  {
    platform: "YouTube",
    handle: "@WashUSatellite",
    href: "https://www.youtube.com/@WashUSatellite",
    inHero: true,
  },
  {
    platform: "GitHub",
    handle: "@washu-satellite",
    href: "https://github.com/washu-satellite",
    inHero: false,
  },
];

export const heroSocials = socials.filter((s) => s.inHero);
