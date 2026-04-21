import clsx from "clsx";
import React, { type ReactNode, useEffect, useState } from "react";
import ThemedLink from "./ThemedLink";

import type { NavElement } from "@/types/data";

import { ChevronDown, Rocket, Users, Waypoints } from "lucide-react";
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

function NavbarMenuItem(props: {
  icon: ReactNode;
  title: string;
  description?: string;
  href?: string;
}) {
  const [path, hash] = (props.href ?? "").split("#");

  return (
    <Link
      to={path || undefined}
      hash={hash}
      className={cn("flex flex-row items-start p gap-2 w-full", {
        "items-start": props.description !== undefined,
        "items-center": !props.description,
      })}
    >
      <div className="p-1 rounded-md border border-border">{props.icon}</div>
      <div>
        <h5 className="text-sm">{props.title}</h5>
        {props.description && (
          <p className="text-xs text-foreground/70">{props.description}</p>
        )}
      </div>
    </Link>
  );
}

function NavbarMenu(
  props: React.PropsWithChildren<{
    title: string;
  }>,
) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu key={props.title} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex flex-row items-center overflow-hidden">
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

  // Only the homepage has a dark hero (video) sitting behind the fixed header.
  // On that page, while the header is still transparent (scrollY = 0), we
  // need to override to the dark-variant logo + white text or they disappear
  // in light mode. Once scrolled, or on any other route, honor the theme.
  const isHomeHero = location.pathname === "/" && !scrolled;
  const useDarkVariant = isHomeHero || theme !== "light";
  const logoSrc = useDarkVariant ? "/logo.svg" : "/logo_light.svg";

  return (
    <div
      className={cn(
        `transition-all duration-300 border-border`,
        {
          "text-white": isHomeHero,
          "text-foreground": !isHomeHero,
          "bg-background dark:bg-background/50 dark:backdrop-blur-lg border-b inset-shadow-current/15 inset-shadow-sm":
            scrolled,
          "bg-none backdrop-blur-none border-b-0": !scrolled,
        },
        "fixed z-50 w-full top-0 left-0 flex flex-row justify-between items-center py-3 px-4 xl:px-8 lg:px-[4rem]",
      )}
    >
      <div className="flex flex-row justify-start items-center font-normal relative gap-2">
        <Link to="/" className={clsx("font-bold text-base")}>
          <img alt="WashU Satellite" src={logoSrc} className="h-8 mr-4" />
        </Link>

        <NavbarMenu title="Missions">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Active Projects</DropdownMenuLabel>
            {Object.entries(ProjectPages)
              .filter(([, v]) => v.project.phase !== "success")
              .map(([slug, { project }]) => (
                <DropdownMenuItem key={slug}>
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
                <DropdownMenuItem key={slug}>
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

        <NavbarMenu title="Team">
          <DropdownMenuGroup>
            <DropdownMenuItem>
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
              <DropdownMenuItem key={t}>
                <NavbarMenuItem
                  title={t}
                  icon={<Waypoints />}
                  href={`/team#${slugify(t)}`}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </NavbarMenu>
      </div>

      <div
        className={
          "flex-row hidden lg:flex justify-end items-center font-semibold gap-4"
        }
      >
        <ThemedLink headerLink key={"newsletters"} href={"/newsletters"} className="-mx-2">
          Newsletter
        </ThemedLink>

        <ThemedLink headerLink key={"contact"} href={"/contact"} className="-mx-2">
          Contact
        </ThemedLink>

        <ThemedLink headerLink key={"apply"} href={"/apply"} className="-mx-2">
          Apply
        </ThemedLink>
      </div>
    </div>
  );
}
