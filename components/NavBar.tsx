"use client";

import { Projects } from "@/const/data";
import Dropdown from "./Dropdown";
import Link from 'next/link';
import React from "react";
import ThemedLink from "./ThemedLink";
import Button from "./Button";
import { IoMenu } from "react-icons/io5";

export default function NavBar() {
    console.log("render");

    return (
        <div className={"fixed z-10 lg:absolute w-full top-0 flex flex-row justify-between items-center py-2 pt-6 px-8 lg:px-24"}>
            <p className={"font-bold text-lg"}>WashU Satellite</p>
            <div className={"flex-row hidden lg:flex justify-end items-center font-semibold gap-6"}>
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