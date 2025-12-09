"use client";
import clsx from "clsx";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";

import { ProjectHighlightData } from "@/const/content/projects";
import Toggle from "./Toggle";
import ThemedLink from "./ThemedLink";
import useTheme from "@/hooks/useTheme";

export default function Footer() {
    const { theme, setTheme } = useTheme();

    const changeTheme = async (a: number) => {
        const t = a === 1 ? 'light' : 'dark';

        setTheme(t);

        fetch('/api/theme', { 
            method: 'POST',
            body: JSON.stringify({
                theme: t
            })
         });
    }

    return (
        <div className={clsx(
            `bg-footer border-bg-highlight text-text border-t-[1px]`,
            "flex flex-row flex-wrap z-20 relative px-[4rem] py-[4rem] gap-8 md:gap-[4rem]"
        )}>
            <div className="flex flex-col items-center gap-6">
                <ThemedLink href={"/"} className={"font-bold text-lg"}>
                    <img
                        alt=""
                        src={(() => {console.log(theme === 'light'); return theme === 'light' ? "/logo_light.svg" : "/logo.svg"})()}
                        width={140}
                    />
                </ThemedLink>
                <div className="flex flex-row items-center gap-2">
                    <a href="https://www.linkedin.com/company/washu-satellite/posts/?feedView=all"><FaLinkedin size={30} /></a>
                    <a href="https://www.instagram.com/washusatellite/"><PiInstagramLogoFill size={30} /></a>
                    <a href="https://github.com/washu-satellite"><FaGithub size={30} /></a>
                </div>
            </div>
            <div className="flex flex-col items-start gap-2">
                <ThemedLink href={"/"} className="font-semibold">Missions</ThemedLink>
                {ProjectHighlightData.map(p => (
                    <ThemedLink arrowLink href={p.posterUrl ? p.posterUrl : `/missions/${p.id.replaceAll("-", "").toLowerCase()}`} className={clsx(`text-text-dark`, "font-normal")}>{p.id}</ThemedLink>
                ))}
            </div>
            <div className="flex flex-col items-start gap-2">
                <ThemedLink href={"/"} className="font-semibold">Keep in Touch</ThemedLink>
                <ThemedLink arrowLink href={"/contact"} className={clsx(`text-text-dark`, "font-normal")}>Contact us</ThemedLink>
                <ThemedLink arrowLink href={"/subscribe"} className={clsx(`text-text-dark`, "font-normal")}>Subscription list</ThemedLink>
                <ThemedLink arrowLink href={"/apply"} className={clsx(`text-text-dark`, "font-normal")}>Join the team</ThemedLink>
            </div>
            <div className="flex flex-col items-start gap-2">
                <ThemedLink href={"/"} className="font-semibold">More information</ThemedLink>
                <ThemedLink arrowLink href={"/not-ready"} className={clsx(`text-text-dark`, "font-normal")}>What is WashU Satellite?</ThemedLink>
                <ThemedLink arrowLink href={"/team"} className={clsx(`text-text-dark`, "font-normal")}>Our Team</ThemedLink>
                <ThemedLink arrowLink href={"/not-ready"} className={clsx(`text-text-dark`, "font-normal")}>Team Management</ThemedLink>
            </div>
            <div className="flex flex-col items-start gap-2">
                <h3 className="text-base font-semibold">Change site theme</h3>
                <Toggle
                    default={theme === 'light' ? 1 : 0}
                    elements={["Dark", "Light"]}
                    setActive={changeTheme}
                />
            </div>
        </div>
    )
}