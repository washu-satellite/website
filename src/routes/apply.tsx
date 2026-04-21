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
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl`}>WANT TO CONTRIBUTE?</h1>
                    <div className="text-foreground/80">
                        <p className={`font-medium`}>All WashU students are welcome to join and participate in our organization.</p>
                        <br />
                        <p className={`font-medium`}>Applications for the SP26 season are currently open.</p>
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
                        title="Learn more about us"
                        href={"/team"}
                        buttonText={"Meet the team"}
                    />
                </div>
            </div>
        </div>
    );
}
