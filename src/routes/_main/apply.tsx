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
                    <p className={`font-medium text-text-dark`}>All WashU students are welcome to join and participate in our organization.</p>
                    <p className={`font-medium text-text-dark`}>We are not yet recruiting for the FL25 season. Please continue to check this page or <TextLink href="/subscribe">subscribe to the newsletter</TextLink> for updates</p>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        <Button disabled isLink style='red' href={"https://docs.google.com/forms/d/e/1FAIpQLSdydIvgb-3itmRnQpUdMgsEuMHWyt44yE0YeHLsUDrWNZDzXg/viewform?usp=header"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Software</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button disabled isLink style='red' href={"https://docs.google.com/forms/d/e/1FAIpQLSfwRUMb8xrc3STzUQqrfxHm6vLGaLVgMb5t-tjPafT9srxqBw/viewform?usp=header"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Electrical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button disabled isLink style='red' href={"https://docs.google.com/forms/d/e/1FAIpQLScSOZvS36khL8C79IY1Phvh4iCGRsnpbkSZLI2_hzF5bbhFGw/viewform?usp=header"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Mechanical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button disabled isLink style='red' href={"https://docs.google.com/forms/d/e/1FAIpQLSei4poSuWmwbXtAJiWMO17_6yGRGkn8xTpxFxno_WJgV1yzBw/viewform?usp=header"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Physics</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button disabled isLink style='red' href={"https://docs.google.com/forms/d/e/1FAIpQLSdjk0GohScdZdpPmfwck4giNIAglpX8AhN-cAd7GqzIW8cPMQ/viewform?usp=header"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Systems</p>
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
                    <RedirectCard
                        title="Not ready to apply?"
                        href={"/subscribe"}
                        buttonText={"Join our email list"}
                    />
                </div>
            </div>
        </div>
    );
}
