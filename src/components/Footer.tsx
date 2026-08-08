import clsx from "clsx";

import ThemedLink from "./ThemedLink";
import SocialLinks from "./SocialLinks";
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
                <SocialLinks variant="icon" />
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-2">
                <ThemedLink key={"keep-in-touch"} href={"/"}><p className="-ml-1">Keep in Touch</p></ThemedLink>
                <ThemedLink key={"contact-us"} arrowLink href={"/contact"} className={clsx(`text-foreground/80`, "font-normal")}>Contact us</ThemedLink>
                <ThemedLink key={"join-the-team"} arrowLink href={"/apply"} className={clsx(`text-foreground/80`, "font-normal")}>Join the team</ThemedLink>
                <ThemedLink key={"newsletter"} arrowLink href={"/newsletters"} className={clsx(`text-foreground/80`, "font-normal")}>Newsletters</ThemedLink>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-2">
                <ThemedLink key={"more-info"} href={"/"}><p className="-ml-1">More Information</p></ThemedLink>
                <ThemedLink key={"about-us"} arrowLink href={"/#who"} className={clsx(`text-foreground/80`, "font-normal")}>About Us</ThemedLink>
                <ThemedLink key={"disciplines"} arrowLink href={"/disciplines"} className={clsx(`text-foreground/80`, "font-normal")}>Disciplines</ThemedLink>
                <ThemedLink key={"roadmap"} arrowLink href={"/roadmap"} className={clsx(`text-foreground/80`, "font-normal")}>Roadmap</ThemedLink>
                <ThemedLink key={"sponsors"} arrowLink href={"/sponsors"} className={clsx(`text-foreground/80`, "font-normal")}>Sponsors</ThemedLink>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1 border-l-0 border-b-0 md:border-l md:border-b border-border p-4">
                <h3 className="text-sm">Site theme</h3>
                <ThemeToggle />
            </div>
        </div>
    )
}