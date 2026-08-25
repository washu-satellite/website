import clsx from "clsx";
import React, { type ReactNode, useEffect, useState } from "react";
import ThemedLink from "./ThemedLink";

import type { NavElement } from "@/types/data";

import { ArrowRight, ChevronDown, Rocket, Users, Waypoints } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ProjectPages } from "@/const/content/projects";
import { slugify, teamNames } from "@/const/content/members";
import { disciplines } from "@/const/content/disciplines";
import { bStore } from "@/hooks/useAppStore";

const MenuItem = (props: NavElement) => {
  return (
    <a
      className={clsx(
        `text-text`,
        "flex flex-row items-start p-2 gap-4",
        props.url === undefined || props.url === "" ? "cursor-not-allowed" : "",
      )}
      href={props.url}
    >
      <div
        className={`flex border-bg-highlight border-[1px] rounded-md w-[2.4rem] h-[2.4rem] items-center justify-center shrink-0`}
      >
        {props.icon}
      </div>
      <div className="flex flex-col items-start text-left">
        <h3 className="text-[1rem]">{props.id}</h3>
        <p className={`text-text-dark text-xs`}>{props.short}</p>
      </div>
    </a>
  );
};

function NavbarMenuItem({
  icon,
  title,
  description,
  href,
  search,
  ...linkProps
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  href?: string;
  search?: Record<string, string>;
} & Omit<React.ComponentProps<typeof Link>, "to" | "search">) {
  return (
    <Link
      to={href || undefined}
      search={search as never}
      className={cn("flex flex-row items-start p gap-2 w-full", {
        "items-start": description !== undefined,
        "items-center": !description,
      })}
      {...linkProps}
    >
      <div className="p-1 rounded-md border border-border">{icon}</div>
      <div>
        <h5 className="text-sm">{title}</h5>
        {description && (
          <p className="text-xs text-foreground/70">{description}</p>
        )}
      </div>
    </Link>
  );
}

function NavbarMenu(
  props: React.PropsWithChildren<{
    title: string;
    /** Extra classes on the trigger, so a menu can drop out at a breakpoint. */
    triggerClassName?: string;
  }>,
) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu key={props.title} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "flex flex-row items-center overflow-hidden",
          props.triggerClassName,
        )}
      >
        <span className={"p-1 px-2 rounded-md font-normal text-sm/6"}>
          {props.title}
        </span>
        <ChevronDown
          className={cn("-ml-1 w-4 h-4 transition-all duration-300", {
            "rotate-0": !open,
            "rotate-180": open,
          })}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border max-w-[20rem] -mt-1 pt-1">
        {props.children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const theme = bStore.use.theme();
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 0);
    });
  }, []);

  // Only the homepage has a dark hero (video) sitting behind the fixed
  // header. On that page, while the header is still transparent (scrollY = 0),
  // override to the dark-variant logo + white text or they disappear in
  // light mode. Once scrolled, or on any other route, honor the theme.
  const isHomeHero = location.pathname === "/" && !scrolled;
  const useDarkVariant = isHomeHero || theme !== "light";
  const logoSrc = useDarkVariant ? "/logo.svg" : "/logo_light.svg";

  // Inline color instead of a Tailwind class so we bypass any cascade/layer
  // oddness — this guarantees the navbar text is white on the home hero and
  // theme-matching everywhere else.
  const navTextColor = isHomeHero ? "#ffffff" : "var(--foreground)";

  return (
    <div
      style={{ color: navTextColor }}
      className={cn(
        `transition-all duration-300 border-border`,
        {
          "bg-background dark:bg-background/50 dark:backdrop-blur-lg border-b inset-shadow-current/15 inset-shadow-sm":
            scrolled,
          "bg-none backdrop-blur-none border-b-0": !scrolled,
        },
        "fixed z-50 w-full top-0 left-0 flex flex-row justify-between items-center py-3 px-3 sm:px-4 xl:px-8 lg:px-[4rem]",
      )}
    >
      <div className="flex flex-row justify-start items-center font-normal relative gap-1 sm:gap-2">
        <Link to="/" className={clsx("font-bold text-base")}>
          <img alt="WashU Satellite" src={logoSrc} className="h-8 max-[380px]:h-6 mr-1 sm:mr-4" />
        </Link>

        <NavbarMenu title="Missions">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Active Projects</DropdownMenuLabel>
            {Object.entries(ProjectPages)
              .filter(([, v]) => v.project.phase !== "success")
              .map(([slug, { project }]) => (
                <DropdownMenuItem key={slug} asChild>
                  <NavbarMenuItem
                    title={project.id}
                    description={project.short}
                    icon={project.icon ?? <Rocket />}
                    href={`/projects/${slug}`}
                  />
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Past Missions</DropdownMenuLabel>
            {Object.entries(ProjectPages)
              .filter(([, v]) => v.project.phase === "success")
              .map(([slug, { project }]) => (
                <DropdownMenuItem key={slug} asChild>
                  <NavbarMenuItem
                    title={project.id}
                    description={project.short}
                    icon={project.icon ?? <Rocket />}
                    href={`/projects/${slug}`}
                  />
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
        </NavbarMenu>

        <NavbarMenu title="Disciplines">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <NavbarMenuItem
                title="All disciplines"
                description="Eight subteams, one satellite"
                icon={<Waypoints />}
                href={"/disciplines"}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {disciplines.map((d) => (
              <DropdownMenuItem key={d.slug} asChild>
                <NavbarMenuItem
                  title={d.name}
                  description={d.tagline}
                  icon={<Waypoints />}
                  href={`/disciplines/${d.slug}`}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </NavbarMenu>

        <NavbarMenu title="Team" triggerClassName="max-[380px]:hidden">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <NavbarMenuItem
                title="Members & Alumni"
                description="The people who make it all possible"
                icon={<Users />}
                href={"/team"}
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Subteams</DropdownMenuLabel>
            {teamNames().map((t) => (
              <DropdownMenuItem key={t} asChild>
                <NavbarMenuItem
                  title={t}
                  icon={<Waypoints />}
                  href="/team"
                  search={{ team: slugify(t) }}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </NavbarMenu>
      </div>

      <div className="flex flex-row justify-end items-center font-semibold gap-2 sm:gap-4">
        <div className="flex-row hidden lg:flex items-center gap-4">
        {/* Campaign link for the SCALAR launch push. Remove with the /space page. */}
        <ThemedLink headerLink key={"space"} href={"/space"} className="-mx-2">
          Go to space
        </ThemedLink>

        <ThemedLink headerLink key={"timeline"} href={"/roadmap"} className="-mx-2">
          Timeline
        </ThemedLink>

        <ThemedLink headerLink key={"newsletters"} href={"/newsletters"} className="-mx-2">
          Newsletter
        </ThemedLink>

        <ThemedLink headerLink key={"sponsors"} href={"/sponsors"} className="-mx-2">
          Sponsors
        </ThemedLink>

        <ThemedLink headerLink key={"shop"} href={"/shop"} className="-mx-2">
          Shop
        </ThemedLink>

        <ThemedLink headerLink key={"contact"} href={"/contact"} className="-mx-2">
          Contact
        </ThemedLink>
        </div>

        {/* The only filled control in the header, and the only one that stays
            visible below lg. It replaces the hero CTA, so it has to carry the
            primary action on its own at every breakpoint. */}
        <Link
          to="/apply"
          className={cn(
            "group inline-flex items-center gap-2 rounded-md shrink-0",
            "px-3 sm:px-4 py-2 font-mono text-sm uppercase tracking-wider font-semibold",
            "bg-accent-red hover:bg-accent-red-hover text-white",
            "shadow-sm hover:shadow-md",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-accent-red transition-all duration-300",
          )}
        >
          Apply
          <ArrowRight
            aria-hidden
            className="w-4 h-4 group-hover:translate-x-[3px] transition-transform duration-300"
          />
        </Link>
      </div>
    </div>
  );
}
