"use client";

import { ProjectData, Projects } from "@/const/data";
import Dropdown from "./Dropdown";
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from "react";
import ThemedLink from "./ThemedLink";
import Button from "./Button";
import { IoMenu } from "react-icons/io5";
import clsx from "clsx";
import { getColors, getTheme } from "@/const/theme";
import { useScrollPos } from "@/util/ui";

import Image from 'next/image';

import logo from '../app/logo.svg';

const ProjectMenuItem = (props: ProjectData) => {
    const colors = getColors();

    return (
        <Link className={clsx(
            `text-[${colors.text}] hover:text-${colors.accentRed}`,
            "flex flex-row items-start p-2 gap-4"
        )} href={`/projects/${props.url}`}>
            <div className={`flex border-[${colors.bgHighlight}] border-[1px] rounded-md w-[2.4rem] h-[2.4rem] items-center justify-center shrink-0`}>
                {props.icon}
            </div>
            <div className="flex flex-col items-start text-left">
                <h3>{props.id}</h3>
                <p className={`text-[${colors.textDark}] text-xs`}>{props.short}</p>
            </div>
        </Link>
    )
}

export default function NavBar() {
    const [projects, setProjects] = useState<ReactNode[]>([]);

    console.log("render");

    const theme = getTheme();

    const colors = getColors();

    const scroll = useScrollPos();

    useEffect(() => {
        let p = Projects.filter(p => p.phase !== 'success').map(p => (
            <ProjectMenuItem
                {...p}
            />
        ));

        p.push(<div className={`w-full h-[1px] my-2 bg-[${colors.bgHighlight}]`}/>);

        setProjects(p.concat(Projects.filter(p => p.phase === 'success').map(p => (
            <ProjectMenuItem
                {...p}
            />
        ))));
    }, []);

    return (
        <div
            className={clsx(
                `text-[${colors.text}] bg-[${colors.bg}] border-[${colors.bgHighlight}]`,
                scroll > 0 ? 'bg-opacity-100' : 'bg-opacity-50',
                theme === 'light' ? (scroll > 0 ? 'shadow' : 'shadow-none') : (scroll > 0 ? 'border-b-[1px]' : 'border-none'),
                "fixed z-20 w-full top-0 left-0 flex flex-row justify-between items-center py-4 px-4 xl:px-8 lg:px-[4rem]"
            )}
        >
            <div className="flex-row hidden lg:flex justify-start items-center font-semibold">
                <Link href={"/"} className={"font-bold text-lg mr-2"}>
                    <Image
                        alt=""
                        src={logo}
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

                <Button key={"subscribe"} isLink={true} href={"/subscribe"}>
                    Subscribe
                </Button>

                <Button
                    key={"apply"}
                    style={'red'}
                    isLink={true}
                    href={"/apply"}
                >
                    Join the Team
                </Button>
            </div>
            <div className={"flex-1 flex flex-row justify-between items-center gap-4 lg:hidden"}>
                <Link href={"/"} className={"font-bold text-lg"}>
                    <Image
                        alt=""
                        src={logo}
                        width={80}
                    />
                </Link>
                <div className="flex flex-row justify-end items-center gap-4">
                    <div className={"hidden sm:block"}>
                        <Button key={"subscribe"} isLink={true} href={"/subscribe"}>
                            Subscribe
                        </Button>
                    </div>
                    <div className={"block"}>
                        <Button
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
                        hideArrow={true}
                        enlarge={true}
                        elements={[
                            <Link href={`/projects`}>Projects</Link>,
                            <Link href={`/contact`}>Contact</Link>,
                            <Link href={`/team`}>Our Team</Link>,
                            <Link className="block sm:hidden" href={`/subscribe`}>Subscribe</Link>
                        ]}
                    >
                        <IoMenu className={"w-10 h-10"} />
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}