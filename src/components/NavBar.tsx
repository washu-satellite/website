import clsx from "clsx";
import React, { type ReactNode, useEffect, useState } from "react";
import ThemedLink from "./ThemedLink";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ProjectHighlightData } from "@/const/content/projects";
import type { NavElement } from "@/types/data";

import { ChevronDown, Eye, Gauge, LogOut, Plus, User, Users, Waypoints } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NotSignedIn from "./auth/NotSignedIn";
import SignedIn from "./auth/SignedIn";
import { signOut, useAuthenticatedUser } from "@/lib/auth/client";
import { UserMenu } from "./UserMenu";
import { teamQueries } from "@/services/queries";

const MenuItem = (props: NavElement) => {
    return (
        <a className={clsx(
            `text-text`,
            "flex flex-row items-start p-2 gap-4",
            props.url === undefined || props.url === "" ? "cursor-not-allowed" : ""
        )} href={props.url}>
            <div className={`flex border-bg-highlight border-[1px] rounded-md w-[2.4rem] h-[2.4rem] items-center justify-center shrink-0`}>
                {props.icon}
            </div>
            <div className="flex flex-col items-start text-left">
                <h3 className="text-[1rem]">{props.id}</h3>
                <p className={`text-text-dark text-xs`}>{props.short}</p>
            </div>
        </a>
    )
}

function NavbarMenuItem(props: {
    icon: ReactNode,
    title: string,
    description?: string,
    href?: string
}) {
    return (
        <Link
            to={props.href}
            className={cn(
                "flex flex-row items-start p gap-2 w-full",
                {
                    "items-start": props.description !== undefined,
                    "items-center": !props.description
                }
            )}
        >
            <div className="p-1 rounded-md border border-border">
                {props.icon}
            </div>
            <div>
                <h5 className="text-sm">{props.title}</h5>
                {props.description &&
                    <p className="text-xs text-foreground/70">{props.description}</p>
                }
            </div>
        </Link>
    );
}

function NavbarMenu(props: React.PropsWithChildren<{
    title: string
}>) {
    const [open, setOpen] = useState(false);

    return (
        <div
            // onMouseEnter={() => setOpen(true)}
            // onMouseLeave={() => setOpen(false)}
        >
            <DropdownMenu key={props.title} open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    className="flex flex-row items-center overflow-hidden"
                >
                    <span className={"p-1 px-2 rounded-md font-normal text-sm/6"}>
                        {props.title}
                    </span>
                    <ChevronDown
                        className={cn(
                            "-ml-1 w-4 h-4 transition-all duration-300",
                            {
                                "rotate-0": !open,
                                "rotate-180": open
                            }
                        )}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-border max-w-[20rem]">
                    {props.children}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

const targetDate = new Date("1/23/26").getTime();

function Countdown() {
    const [countdownTime, setCountdownTime] = useState(targetDate - new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = targetDate - new Date().getTime();

            setCountdownTime(diff);
        }, 300);

        return () => {
            clearTimeout(timer);
        }
    }, []);
    
    return (
        <Link to="/" className="font-mono font-light text-sm text-foreground/80 mr-2">
            T-
            {String(Math.floor(countdownTime / (1000 * 60 * 60 * 24))).padStart(3, "0")}D +&nbsp;
            {String(Math.floor(countdownTime % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))).padStart(2, "0")}:
            {String(Math.floor(countdownTime % (1000 * 60 * 60) / (1000 * 60))).padStart(2, "0")}:
            {String(Math.floor(countdownTime % (1000 * 60) / (1000))).padStart(2, "0")}
        </Link>
    );
}

export default function NavBar() {
    const [projects, setProjects] = useState<ReactNode[][]>([]);
    const [scrolled, setScrolled] = useState(false);

    const auth = useAuthenticatedUser();

    useEffect(() => {
        setProjects([
            ProjectHighlightData.filter(p => p.phase !== 'success').map(p => (
                <MenuItem
                    {...p}
                />
            )),
            (ProjectHighlightData.filter(p => p.phase === 'success').map(p => (
                <MenuItem
                    {...p}
                />
            )))
        ]);

        window.addEventListener('scroll', () => {
            setScrolled(window.scrollY > 0);
        });
    }, []);

    const { data, isPending, error } = useQuery(teamQueries.list());

    return (
        <div
            // initial={isHome ? { 
            //     backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
            //         scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
            //     ),
            //     borderBottomWidth: scroll > SCROLL_MAX ? 1 : 0
            // } : {
            //     borderBottomWidth: 1
            // }}
            // animate={isHome ? { 
            //     backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
            //         scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
            //     ),
            //     borderBottomWidth: scroll > SCROLL_MAX ? 1 : 0
            // } : {}}
            className={cn(
                // scroll > 0 ? "backdrop-blur-none md:backdrop-blur-md" : "",
                `text-text bg-bg border-bg-highlight transition-all duration-300 border-border`,
                // theme === 'light' && scroll > SCROLL_MAX ? 'shadow' : 'shadow-none',
                {
                    "bg-background dark:bg-background/50 dark:backdrop-blur-lg border-b inset-shadow-current/15 inset-shadow-sm": scrolled,
                    "bg-none backdrop-blur-none border-b-0": !scrolled
                },
                "fixed z-50 w-full top-0 left-0 flex flex-row justify-between items-center py-3 px-4 xl:px-8 lg:px-[4rem]"
            )}
        >
            <div className="flex flex-row justify-start items-center font-normal relative gap-2">
                <a href={"/"} className={clsx(
                    "font-bold text-base",
                )}>
                    <img
                        alt=""
                        src="/logo.svg"
                        // src={theme === 'light' && !(pathName === "/" && scroll === 0) ? "/logo_light.svg" : "/logo.svg"}
                        className="h-8 mr-4"
                    />
                </a>

                <NavbarMenu title="Missions">
                    <DropdownMenuGroup>
                        {ProjectHighlightData.filter(p => p.phase !== 'success').map(p => (
                            <DropdownMenuItem key={p.id}>
                                <NavbarMenuItem title={p.id} description={p.short??""} icon={p.icon} href={p.posterUrl}/>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {ProjectHighlightData.filter(p => p.phase === 'success').map(p => (
                            <DropdownMenuItem key={p.id}>
                                <NavbarMenuItem title={p.id} description={p.short??""} icon={p.icon} href={p.posterUrl}/>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </NavbarMenu>

                <NavbarMenu title="Team">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <NavbarMenuItem title="Members & Alumni" description="The people who make it all possible" icon={<Users/>} href={"/team"}/>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>
                            Subteams
                        </DropdownMenuLabel>
                            {data?.map(t => (
                                <DropdownMenuItem>
                                    <NavbarMenuItem title={t.name} icon={<Waypoints/>} href={`/team/subteams/${t.name}`}/>
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuGroup>
                </NavbarMenu>

                {auth?.user.role === "admin" &&
                    <NavbarMenu title="Admin">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <NavbarMenuItem title="Dashboard" icon={<Gauge/>} href={"/dashboard"}/>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <NavbarMenuItem title="User overview" icon={<Eye/>} href={"/admin/users"}/>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <NavbarMenuItem title="Create a user" icon={<Plus/>} href={"/admin/new-user"}/>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <NavbarMenuItem title="Create a subteam" icon={<Plus/>} href={"/admin/new-team"}/>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <NavbarMenuItem title="Create a role" icon={<Plus/>} href={"/admin/new-role"}/>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </NavbarMenu>
                }
            </div>

            <div className={"flex-row hidden lg:flex justify-end items-center font-semibold gap-4"}>
                <Countdown />

                <ThemedLink headerLink key={"contact"} href={"/contact"} className="-mx-2">
                    Contact
                </ThemedLink>
                

                <SignedIn>
                    <Button asChild variant='outline'>
                        <Link to="/apply">
                            Apply
                        </Link>
                    </Button>
                </SignedIn>

                <NotSignedIn>
                    <ThemedLink headerLink key={"apply"} href={"/apply"} className="-mx-2">
                        Apply
                    </ThemedLink>
                </NotSignedIn>
                

                <NotSignedIn>
                    <Button asChild variant='outline'>
                        <Link to="/sign-in">
                            Sign in
                        </Link>
                    </Button>
                </NotSignedIn>

                {/* <div className="w-[2px] h-4 bg-foreground/80 mx-2"/> */}

                <UserMenu />
            </div>
        </div>
    )
}