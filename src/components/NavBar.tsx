"use client";

import { useScrollPos } from "@/util/ui";
import clsx from "clsx";
import { type ReactNode, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import Button from "./Button";
import Dropdown from "./Dropdown";
import ThemedLink from "./ThemedLink";

import { ProjectHighlightData, PublicationsNavigation, TeamNavigation } from "@/const/content/projects";
import type { NavElement } from "@/types/data";

import { motion } from 'motion/react';
import useTheme from "@/hooks/useTheme";
import { useLocation } from "@tanstack/react-router";

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

export default function NavBar() {
    const [projects, setProjects] = useState<ReactNode[][]>([]);

    console.log("render");

    const {theme} = useTheme();

    const scroll = useScrollPos();

    const pathName = useLocation().pathname;

    // const pathName = usePathname();

    const isHome = pathName === "/";

    const SCROLL_MIN = 0;

    const SCROLL_MAX = window.innerHeight;

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
    }, []);

    return (
        <motion.div
            initial={isHome ? { 
                backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
                    scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
                ),
                borderBottomWidth: scroll > SCROLL_MAX ? 1 : 0
            } : {
                borderBottomWidth: 1
            }}
            animate={isHome ? { 
                backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
                    scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
                ),
                borderBottomWidth: scroll > SCROLL_MAX ? 1 : 0
            } : {}}
            className={clsx(
                scroll > 0 ? "backdrop-blur-none md:backdrop-blur-md" : "",
                `text-text bg-bg border-bg-highlight border-b`,
                theme === 'light' && scroll > SCROLL_MAX ? 'shadow' : 'shadow-none',
                "fixed z-50 w-full top-0 left-0 flex flex-row justify-between items-center py-3 px-4 xl:px-8 lg:px-[4rem]"
            )}
        >
            <div className="flex-row hidden lg:flex justify-start items-center font-normal relative">
                <a href={"/"} className={clsx(
                    "font-bold text-base mr-4",
                )}>
                    <img
                        alt=""
                        src={theme === 'light' && !(pathName === "/" && scroll === 0) ? "/logo_light.svg" : "/logo.svg"}
                        className="h-8"
                    />
                </a>
                <Dropdown
                    key={"missions"}
                    elements={projects}
                    className={scroll <= 0 && pathName === "/" ? "text-white hover:text-gray-300" : ""}
                >
                    <span className={"p-2"}>
                        Missions
                    </span>
                </Dropdown>

                {/* <Dropdown
                    key={"projects"}
                    elements={[PublicationsNavigation.map(p => (
                        <MenuItem
                            {...p}
                        />
                    ))]}
                    className={scroll <= 0 && pathName === "/" ? "text-white hover:text-gray-300" : ""}
                >
                    <span className={"p-2"}>
                        Publications
                    </span>
                </Dropdown> */}

                <Dropdown
                    key={"projects"}
                    elements={[TeamNavigation.map(p => (
                        <MenuItem
                            {...p}
                        />
                    ))]}
                    className={scroll <= 0 && pathName === "/" ? "text-white hover:text-gray-300" : ""}
                >
                    <span className={"p-2"}>
                        Our Team
                    </span>
                </Dropdown>

                <ThemedLink headerLink key={"contact"} href={"/contact"} className={scroll <= 0 && pathName === "/" ? "text-white hover:text-gray-300" : ""}>
                    Contact
                </ThemedLink>

                {/* <ThemedLink headerLink key={"team"} href={"/team"} className={scroll <= 0 && pathName === "/" ? "text-white hover:text-gray-300" : ""}>
                    Our Team
                </ThemedLink> */}
            </div>
            <div className={"flex-row hidden lg:flex justify-end items-center font-semibold gap-6"}>

                {/* <Button key={"subscribe"} isLink={true} href={"/subscribe"}>
                    Interest Form
                </Button> */}

                <Button
                    key={"apply"}
                    style={'red'}
                    isLink={true}
                    href={"/apply"}
                >
                    Apply
                </Button>
            </div>
            <div className={"flex-1 flex flex-row justify-between items-center gap-4 lg:hidden"}>
                <a href={"/"} className={clsx(
                    // scroll > 0 ? "block" : "hidden",
                    "font-bold text-lg mr-2",
                    scroll > 0 ? "" : "opacity-0 md:opacity-100"
                )}>
                    <img
                        alt=""
                        src={theme === 'light' && !(pathName === "/" && scroll === 0) ? "/logo_light.svg" : "/logo.svg"}
                        width={80}
                    />
                </a>
                <div className={"flex-1 flex flex-row justify-end items-center gap-4"}>
                    {/* <div className={"hidden sm:block"}>
                        <Button key={"subscribe"} isLink={true} href={"/subscribe"}>
                            Interest Form
                        </Button>
                    </div> */}
                    <Dropdown
                        key={"hamburgerMenu"}
                        hideArrow
                        enlarge={true}
                        elements={[[
                            <a href={`/projects`}>Projects</a>,
                            <a href={`/contact`}>Contact</a>,
                            <a href={`/team`}>Our Team</a>,
                            <a className="block sm:hidden" href={`/subscribe`}>Subscribe</a>
                        ]]}
                        className={pathName === "/" && scroll <= 0 ? "text-white" : ""}
                    >
                        <IoMenu className={"w-10 h-10"} />
                    </Dropdown>
                </div>
            </div>
        </motion.div>
    )
}