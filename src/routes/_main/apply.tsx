"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import RedirectCard from "@/components/RedirectCard";
import { TextLink } from "@/components/ThemedLink";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";

export const Route = createFileRoute('/_main/apply')({
  component: ApplyPage,
})

function ApplyPage() {
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
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl`}>WANT TO CONTRIBUTE?</h1>
                    <div>
                        <p className={`font-medium text-text-dark`}>All WashU students are welcome to join and participate in our organization.</p>
                        <br />
                        <p className={`font-medium text-text-dark`}>The following applications are available (based on field/discipline). If you are interested in multiple positions in different disciplines, please apply to each discipline individually. <b>Applications are due on 9/5/25</b>.</p>
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        <Button isLink style='red' href={"https://forms.gle/dQywNpvD87buAGkn8"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Software</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/e84NVrf3NyPSxF6R7"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Electrical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/Df6wBZSsToFcFRye6"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Mechanical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/rrSxAfGfarHw9JLp6"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Physics</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/6wnESBBVSfEs9M9m9"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Systems</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/eR33VMNj3nzxGNEAA"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Mission Ops</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/ziQMuTwwj3S18rKGA"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Business</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"https://forms.gle/R8ES5ZazVCw9rDX49"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Other Fields</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8">
                    <RedirectCard
                        title="Learn more about us"
                        href={"/team"}
                        buttonText={"Meet the team"}
                    />
                    <div className="opacity-50 pointer-events-none">
                        <RedirectCard
                            title="Want updates?"
                            href={"/subscribe"}
                            buttonText={"Fill out the interest form"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
