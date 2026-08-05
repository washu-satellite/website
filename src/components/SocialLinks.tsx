import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";

import { socials, heroSocials, type Social } from "@/const/content/socials";
import { cn } from "@/lib/utils";

const ICONS: Record<Social["platform"], IconType> = {
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  YouTube: FaYoutube,
  GitHub: FaGithub,
};

type SocialLinksProps = {
  /** "handle" shows the @name next to the icon; "icon" is icon-only. */
  variant?: "handle" | "icon";
  /** Defaults to the hero subset for "handle", all socials for "icon". */
  items?: Social[];
  className?: string;
  /** Names the list for screen readers, e.g. "WashU Satellite social media". */
  label?: string;
};

export default function SocialLinks({
  variant = "handle",
  items,
  className,
  label = "WashU Satellite social media",
}: SocialLinksProps) {
  const links = items ?? (variant === "handle" ? heroSocials : socials);

  return (
    <nav aria-label={label}>
      <ul className={cn("flex flex-row items-center gap-2 list-none p-0 m-0", className)}>
        {links.map(({ platform, handle, href }) => {
          const Icon = ICONS[platform];
          return (
            <li key={platform}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                // Icons carry no accessible name, so the label supplies it for both
                // variants and disambiguates the repeated @handle text.
                aria-label={`WashU Satellite on ${platform}`}
                className={cn(
                  "group inline-flex flex-row items-center gap-1.5 rounded-md transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
                  variant === "handle" && [
                    "px-2.5 py-1 font-mono text-xs md:text-sm",
                    "border border-[#222] bg-[#111]/50 backdrop-blur-3xl",
                    "text-white/60 hover:text-white hover:border-[#333]",
                  ],
                  variant === "icon" && "p-1 text-foreground/80 hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className={variant === "icon" ? "w-6 h-6" : "w-4 h-4"} />
                {variant === "handle" && <span>{handle}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
