"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import clsx from "clsx";
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";

export default function Contact() {
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className={`flex flex-col items-center gap-8 justify-center max-w-[40rem] bg-bg border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-4xl md:text-6xl`}>QUESTIONS?</h1>
                    <p className={`font-medium text-text-dark`}>Send any inquires to &nbsp;
                        <Link className={`rounded-full px-4 py-1 hover:bg-fg border-bg-highlight text-center border-[1px] text-[1rem]/[3rem]`} href="/">
                            washusatellite@gmail.com
                        </Link>
                    </p>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <div className={`flex flex-col items-center gap-8 justify-center bg-fg border-bg-highlight border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-text-dark font-mono font-medium text-xl`}>Looking to join?</h1>
                        <Button isLink style='clear' href={"/apply"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>See applications</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                    <div className={`flex flex-col items-center gap-8 justify-center bg-fg border-bg-highlight border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-text-dark font-mono font-medium text-xl`}>Not ready to apply?</h1>
                        <Button isLink style='clear' href={"/subscribe"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Join our email list</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}