"use client";
import RedirectCard from "@/components/RedirectCard";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
    return (
        <div className="flex-1">
            <div className={`fixed top-0 w-full h-full`}/>
            <div className={clsx(
                `border-t border-border`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className="dots-header absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60" />
                <div className={`flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-background border-inherit border p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl whitespace-nowrap`}>REACH OUT</h1>
                    <div className="text-foreground/80 text-center">
                        <p className="font-medium">Questions, comments, or concerns?</p>
                        <p className="font-medium">We&rsquo;d love to hear from you!</p>
                    </div>
                    <Button asChild variant='outline'>
                        <a href="mailto:washusatellite@gmail.com">
                            washusatellite@gmail.com
                        </a>
                    </Button>
                    <p className="text-xs text-foreground/60 text-center max-w-[26rem]">
                        Email us about anything &mdash; questions, partnerships, sponsorship, press, joining the team. We&rsquo;ll get back to you as soon as we can.
                    </p>
                </div>

                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <RedirectCard
                        title="Looking to join?"
                        href={"/apply"}
                        buttonText={"See applications"}
                    />
                </div>
            </div>
        </div>
    );
}