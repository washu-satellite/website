"use client";
import clsx from "clsx";
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";

import { ProjectHighlightData } from "@/const/content/projects";
import { useTheme } from "next-themes";
import { useContext } from "react";
import logo from '../app/logo.svg';
import logoLight from '../app/logo_light.svg';
import { AppContext } from "./AppContext";
import Toggle from "./Toggle";

export default function Footer() {
    const ctx = useContext(AppContext);

    const { theme, setTheme } = useTheme();

    return (
        <div className={clsx(
            `bg-footer border-bg-highlight text-text border-t-[1px]`,
            "flex flex-row flex-wrap z-20 relative px-[4rem] py-[4rem] gap-8 md:gap-[4rem]"
        )}>
            <div className="flex flex-col items-center gap-6">
                <Link href={"/"} className={"font-bold text-lg"}>
                    <Image
                        alt=""
                        src={theme === 'light' ? logoLight : logo}
                        width={140}
                    />
                </Link>
                <div className="flex flex-row items-center gap-2">
                    <FaLinkedin size={30} />
                    <PiInstagramLogoFill size={30} />
                    <FaGithub size={30} />
                </div>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href={"/"} className="font-semibold">Projects</Link>
                {ProjectHighlightData.map(p => (
                    <Link href={`/projects/${p.id.replaceAll("-", "").toLowerCase()}`} className={clsx(`text-text-dark`, "font-medium")}>{p.id}</Link>
                ))}
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href={"/"} className="font-semibold">Keep in Touch</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>Contact us</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>Subscription list</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>Join the team</Link>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href={"/"} className="font-semibold">More information</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>What is WashU Satellite?</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>Our Team</Link>
                <Link href={"/"} className={clsx(`text-text-dark`, "font-medium")}>Team Management</Link>
            </div>
            <div className="flex flex-col items-start gap-2">
                <h3 className="text-base font-semibold">Change site theme</h3>
                <Toggle
                    default={theme === 'light' ? 1 : 0}
                    elements={["Dark", "Light"]}
                    setActive={(a) => setTheme(a === 1 ? 'light' : 'dark')}
                />
            </div>
        </div>
    )
}