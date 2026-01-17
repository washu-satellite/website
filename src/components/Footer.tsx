import clsx from "clsx";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";

import { ProjectHighlightData } from "@/const/content/projects";
import ThemedLink from "./ThemedLink";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "./ui/button";
import { bStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

function ThemeToggle() {
    const _theme = bStore.use.theme();

    const _setTheme = bStore.use.setTheme();

    return (
        <div className="rounded-full bg-secondary border border-border flex flex-row items-center overflow-hidden">
            <Button
                variant='ghost'
                className={cn(
                    "rounded-sm bg-secondary hover:bg-foreground dark:hover:bg-foreground hover:text-background",
                    {
                        "bg-foreground text-background": _theme === 'light'
                    }
                )}
                onClick={() => _setTheme('light')}
            >
                <Sun className="w-4 h-4"/>
            </Button>
            <Button
                variant='ghost'
                className={cn(
                    "rounded-sm bg-secondary hover:bg-foreground dark:hover:bg-foreground hover:text-background",
                    {
                        "bg-foreground text-background": _theme === 'dark'
                    }
                )}
                onClick={() => _setTheme('dark')}
            >
                <Moon className="w-4 h-4"/>
            </Button>
            <Button
                variant='ghost'
                className={cn(
                    "rounded-sm bg-secondary hover:bg-foreground dark:hover:bg-foreground hover:text-background",
                    {
                        "bg-foreground text-background": _theme === 'system'
                    }
                )}
                onClick={() => _setTheme('system')}
            >
                <Monitor className="w-4 h-4"/>
            </Button>
        </div>
    );
}


export default function Footer() {
    const _theme = bStore.use.theme();

    return (
        <div className={clsx(
            `border-t border-border`,
            "flex flex-row flex-wrap z-20 relative bg-deep-background"
        )}>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6 p-4 border-b-0 md:border-b border-border">
                <ThemedLink href={"/"} className={"font-bold text-lg"}>
                    <img
                        alt=""
                        src={_theme === 'light' ? "/logo_light.svg" : "/logo.svg"}
                        width={140}
                    />
                </ThemedLink>
                <div className="flex flex-row items-center gap-2">
                    <a href="https://www.linkedin.com/company/washu-satellite/posts/?feedView=all"><FaLinkedin size={24} /></a>
                    <a href="https://www.instagram.com/washusatellite/"><PiInstagramLogoFill size={24} /></a>
                    <a href="https://github.com/washu-satellite"><FaGithub size={24} /></a>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-2">
                <ThemedLink href={"/"}><p className="-ml-1">Missions</p></ThemedLink>
                {ProjectHighlightData.map((p, i) => (
                    <ThemedLink key={i} arrowLink href={p.posterUrl ? p.posterUrl : `/missions/${p.id.replaceAll("-", "").toLowerCase()}`} className={clsx(`text-foreground/80`, "font-normal")}>{p.id}</ThemedLink>
                ))}
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-2">
                <ThemedLink key={"keep-in-touch"} href={"/"}><p className="-ml-1">Keep in Touch</p></ThemedLink>
                <ThemedLink key={"contact-us"} arrowLink href={"/contact"} className={clsx(`text-foreground/80`, "font-normal")}>Contact us</ThemedLink>
                <ThemedLink key={"interest-form"} arrowLink href={"/subscribe"} className={clsx(`text-foreground/80`, "font-normal")}>Interest form</ThemedLink>
                <ThemedLink key={"join-the-team"} arrowLink href={"/apply"} className={clsx(`text-foreground/80`, "font-normal")}>Join the team</ThemedLink>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-2">
                <ThemedLink key={"more-info"} href={"/"}><p className="-ml-1">More Information</p></ThemedLink>
                <ThemedLink key={"who-are-we"} arrowLink href={"/not-ready"} className={clsx(`text-foreground/80`, "font-normal")}>What is WashU Satellite?</ThemedLink>
                <ThemedLink key={"team"} arrowLink href={"/team"} className={clsx(`text-foreground/80`, "font-normal")}>Our Team</ThemedLink>
                <ThemedLink key={"team-management"} arrowLink href={"/not-ready"} className={clsx(`text-foreground/80`, "font-normal")}>Team Management</ThemedLink>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-4">
                <h3 className="text-sm">Site theme</h3>
                <ThemeToggle />
            </div>
        </div>
    )
}