"use client";
import { FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaGithub } from "react-icons/fa";
import clsx from "clsx";
import { getColors } from "@/const/theme";
import Link from 'next/link';
import Image from 'next/image';

import logo from '../app/logo.svg';

export default function Footer() {
    const colors = getColors();

    return (
        <div className={clsx(
            `bg-[#141414] border-[${colors.bgHighlight}] border-t-[1px]`,
            "flex flex-row flex-wrap z-20 relative px-[4rem] py-[4rem] gap-8 md:gap-[4rem]"
        )}>
            <div className="flex flex-col items-center gap-6">
                <Link href={"/"} className={"font-bold text-lg"}>
                    <Image
                        alt=""
                        src={logo}
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
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>GS-1</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>ADAPT</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>SCALAR</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>VECTOR</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>SPINOR</Link>
                <Link href={"/"} className={clsx(`text-[${colors.textDark}]`, "font-medium")}>SB-1</Link>
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
        </div>
    )
}