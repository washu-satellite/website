"use client";
import RedirectButton from "@/components/RedirectButton";
import RedirectCard from "@/components/RedirectCard";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";

export const Route = createFileRoute('/apply')({
  component: ApplyPage,
})

function ApplyPage() {
    return (
        <div className="flex-1">
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={clsx(
                `bg-bg border-border border-t`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className="dots-header absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60" />
                <div className={`flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-background border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl whitespace-nowrap`}>WANT TO JOIN?</h1>
                    <div className="text-foreground/80 text-center">
                        <p className={`font-medium`}>All WashU students, regardless of major or level of experience, are welcome to participate in our organization. Applications for the summer 2026 season are currently open.</p>
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        <RedirectButton
                            text="Apply"
                            href="https://docs.google.com/forms/d/e/1FAIpQLSdaCwk9SUnwtYgEE1-7FHxjRCvHi2kX4gHcxgV2dIsr3NfnwQ/viewform?usp=publish-editor"
                        />
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8">
                    <RedirectCard
                        title="Not sure where you'd fit?"
                        href={"/disciplines"}
                        buttonText={"Meet the teams"}
                    />
                </div>
            </div>
        </div>
    );
}
