"use client";
import Button, { ArrowButton } from "@/components/Button";
import NavBar from "@/components/NavBar";
import RedirectCard from "@/components/RedirectCard";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";

export const Route = createFileRoute('/_main/contact')({
  component: ContactPage,
})

function ContactPage() {
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div
                    style={{
                        backgroundImage: `url("/dotsh.svg")`,
                        backgroundSize: "20rem"
                    }}
                    className="absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60"
                />
                <div className={`flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-bg border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl`}>QUESTIONS?</h1>
                    <p className={`font-medium text-text-dark text-center md:text-left`}>Send any inquires to &nbsp;
                        <a className={`rounded-full px-4 py-1 hover:bg-fg border-bg-highlight text-center border-[1px] text-[1rem]/[3rem]`} href="mailto:satelliteteam@wustl.edu">
                            satelliteteam@wustl.edu
                        </a>
                    </p>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <RedirectCard
                        title="Looking to join?"
                        href={"/apply"}
                        buttonText={"See applications"}
                    />
                    <div className="opacity-50 pointer-events-none">
                        <RedirectCard
                            title="Not ready to apply?"
                            href={"/subscribe"}
                            buttonText={"Fill out the interest form"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}