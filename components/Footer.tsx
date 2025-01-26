"use client";
import { FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaGithub } from "react-icons/fa";
import clsx from "clsx";
import { getColors, getTheme } from "@/const/theme";
import Link from 'next/link';
import Image from 'next/image';

import logo from '../app/logo.svg';
import logoLight from '../app/logo_light.svg';
import Toggle from "./Toggle";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import { ProjectHighlightData } from "@/const/content/projects";

export default function Footer() {
    const ctx = useContext(AppContext);

    const colors = getColors();

    const theme = getTheme();

    return (
        <div className={clsx(
            `bg-[${colors.footer}] border-[${colors.bgHighlight}] text-[${colors.text}] border-t-[1px]`,
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
                    <Link href={`/projects/${p.id.replaceAll("-", "").toLowerCase()}`} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>{p.id}</Link>
                ))}
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href={"/"} className="font-semibold">Keep in Touch</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>Contact us</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>Subscription list</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>Join the team</Link>
            </div>
            <div className="flex flex-col items-start gap-2">
                <Link href={"/"} className="font-semibold">More information</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>What is WashU Satellite?</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>Our Team</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>Team Management</Link>
            </div>
            <div className="flex flex-col items-start gap-2">
                <h3 className="text-base font-semibold">Change site theme</h3>
                <Toggle
                    default={ctx.theme === 'dark' ? 0 : 1}
                    elements={["Dark", "Light"]}
                    setActive={(a) => ctx.setTheme(a === 0 ? 'dark' : 'light')}
                />
            </div>
        </div>
    )
}