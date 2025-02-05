"use client";

import { useScrollPos } from "@/util/ui";
import clsx from "clsx";
import Link from 'next/link';
import { ReactNode, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import Button from "./Button";
import Dropdown from "./Dropdown";
import ThemedLink from "./ThemedLink";

import Image from 'next/image';

import { ProjectHighlightData } from "@/const/content/projects";
import { ProjectData } from "@/types/data";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import logo from '../app/logo.svg';
import logoLight from '../app/logo_light.svg';

import { motion } from 'motion/react';

const ProjectMenuItem = (props: ProjectData) => {
    return (
        <Link className={clsx(
            `text-text`,
            "flex flex-row items-start p-2 gap-4"
        )} href={`/projects/${props.url}`}>
            <div className={`flex border-bg-highlight border-[1px] rounded-md w-[2.4rem] h-[2.4rem] items-center justify-center shrink-0`}>
                {props.icon}
            </div>
            <div className="flex flex-col items-start text-left">
                <h3>{props.id}</h3>
                <p className={`text-text-dark text-xs`}>{props.short}</p>
            </div>
        </Link>
    )
}

export default function NavBar() {
    const [projects, setProjects] = useState<ReactNode[][]>([]);

    console.log("render");

    const {theme} = useTheme();

    const scroll = useScrollPos();

    const pathName = usePathname();

    const SCROLL_MIN = pathName === "/" ? 0 : -1;

    const SCROLL_MAX = pathName === "/" ? 608 : 0;

    const BORDER_MIN = pathName === "/" ? SCROLL_MAX : 300;

    useEffect(() => {
        setProjects([
            ProjectHighlightData.filter(p => p.phase !== 'success').map(p => (
                <ProjectMenuItem
                    {...p}
                />
            )),
            (ProjectHighlightData.filter(p => p.phase === 'success').map(p => (
                <ProjectMenuItem
                    {...p}
                />
            )))
        ]);
    }, []);

    return (
        <motion.div
            initial={{ 
                backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
                    scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
                ),
                borderBottomWidth: scroll > BORDER_MIN ? 1 : 0
            }}
            animate={{ 
                backgroundColor: scroll > SCROLL_MAX ? "rgba(from var(--bg) r g b / 1)" : (
                    scroll > SCROLL_MIN ? (theme === 'light' ? "rgba(from var(--bg) r g b / 1)" : "rgba(from var(--bg) r g b / 0.3)") : "rgba(from var(--bg) r g b / 0)"
                ),
                borderBottomWidth: scroll > BORDER_MIN ? 1 : 0
            }}
            className={clsx(
                `text-text bg-bg border-bg-highlight`,
                scroll > 0 && pathName === "/" ? "backdrop-blur-[4px]" : "",
                theme === 'light' && scroll > SCROLL_MAX ? 'shadow' : 'shadow-none',
                "fixed z-20 w-full top-0 left-0 flex flex-row justify-between items-center py-4 px-4 xl:px-8 lg:px-[4rem]"
            )}
        >
            <div className="flex-row hidden lg:flex justify-start items-center font-semibold">
                <Link href={"/"} className={clsx(
                    "font-bold text-lg mr-2"
                )}>
                    <Image
                        alt=""
                        src={theme === 'light' && !(pathName === "/" && scroll === 0) ? logoLight : logo}
                        width={80}
                    />
                </Link>
                <Dropdown
                    key={"projects"}
                    elements={projects}
                >
                    <span className={"p-2"}>
                        Projects
                    </span>
                </Dropdown>

                <ThemedLink key={"contact"} href={"/contact"}>
                    Contact
                </ThemedLink>

                <ThemedLink key={"team"} href={"/team"}>
                    Our Team
                </ThemedLink>
            </div>
            <div className={"flex-row hidden lg:flex justify-end items-center font-semibold gap-6"}>

                <Button raiseHover key={"subscribe"} isLink={true} href={"/subscribe"}>
                    Subscribe
                </Button>

                <Button
                    raiseHover
                    key={"apply"}
                    style={'red'}
                    isLink={true}
                    href={"/apply"}
                >
                    Join the Team
                </Button>
            </div>
            <div className={"flex-1 flex flex-row justify-between items-center gap-4 lg:hidden"}>
                <Link href={"/"} className={clsx(
                    // scroll > 0 ? "block" : "hidden",
                    "font-bold text-lg mr-2"
                )}>
                    <Image
                        alt=""
                        src={theme === 'light' && !(pathName === "/" && scroll === 0) ? logoLight : logo}
                        width={80}
                    />
                </Link>
                <div className="flex flex-row justify-end items-center gap-4">
                    <div className={"hidden sm:block"}>
                        <Button raiseHover key={"subscribe"} isLink={true} href={"/subscribe"}>
                            Subscribe
                        </Button>
                    </div>
                    <div className={"block"}>
                        <Button
                            raiseHover
                            key={"apply"}
                            style={'red'}
                            isLink={true}
                            href={"/apply"}
                        >
                            Join the Team
                        </Button>
                    </div>
                    <Dropdown
                        key={"hamburgerMenu"}
                        hideArrow
                        enlarge={true}
                        elements={[[
                            <Link href={`/projects`}>Projects</Link>,
                            <Link href={`/contact`}>Contact</Link>,
                            <Link href={`/team`}>Our Team</Link>,
                            <Link className="block sm:hidden" href={`/subscribe`}>Subscribe</Link>
                        ]]}
                    >
                        <IoMenu className={"w-10 h-10"} />
                    </Dropdown>
                </div>
            </div>
        </motion.div>
    )
}