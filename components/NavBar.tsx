"use client";

import { Projects } from "@/const/data";
import Dropdown from "./Dropdown";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import ThemedLink from "./ThemedLink";
import Button from "./Button";
import { IoMenu } from "react-icons/io5";
import clsx from "clsx";
import { getColors, getTheme } from "@/const/theme";
import { useScrollPos } from "@/util/ui";

import Image from 'next/image';

import logo from '../app/logo.svg';

export default function NavBar() {
    console.log("render");

    const theme = getTheme();

    const colors = getColors();

    const scroll = useScrollPos();

    return (
        <div
            className={clsx(
                `text-[${colors.text}] bg-[${colors.bg}] border-[#0d0c0c]`,
                scroll > 0 ? 'bg-opacity-100' : 'bg-opacity-50',
                theme === 'light' ? (scroll > 0 ? 'shadow' : 'shadow-none') : (scroll > 0 ? 'border-b-[1px]' : 'border-none'),
                "fixed z-20 w-full top-0 left-0 flex flex-row justify-between items-center py-4 px-8 lg:px-[4rem]"
            )}
        >
            <div className="flex-row hidden lg:flex justify-start items-center font-semibold gap-6">
                <Link href={"/"} className={"font-bold text-lg"}>
                    <Image
                        alt=""
                        src={logo}
                        width={80}
                    />
                </Link>
                <Dropdown
                    key={"projects"}
                    elements={Projects.map(p => (
                        <Link href={`/projects/${p.url}`}>{p.id}</Link>
                    ))}
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
            <div className={"flex-1 flex flex-row justify-end items-center gap-4 lg:hidden"}>
                <div className={"hidden sm:block"}>
                    <Button key={"subscribe"} isLink={true} href={"/subscribe"}>
                        Subscribe
                    </Button>
                </div>
                <div className={"hidden sm:block"}>
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
                        <Link href={`/subscribe`}>Subscribe</Link>,
                        <Link className={"block sm:hidden"} href={`/subscribe`}>Join the Team</Link>
                    ]}
                >
                    <IoMenu className={"w-10 h-10"} />
                </Dropdown>
            </div>
        </div>
    )
}