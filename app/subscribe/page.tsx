"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import { getColors } from "@/const/theme";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import Link from 'next/link';

export default function Subscribe() {
    const colors = getColors();
    
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={"fixed top-0 w-full h-full bg-[#1A1F27]"}/>
            <div className={clsx(
                `bg-[${colors.bg}] border-[${colors.bgHighlight}] border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className={`flex flex-col items-center gap-8 justify-center max-w-[40rem] bg-[${colors.bg}] border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-[${colors.accentRed}] text-center font-mono font-semibold text-4xl md:text-6xl`}>INTERESTED?</h1>
                    <p className={`font-medium text-[${colors.textDark}]`}>We will send you emails every semester, updating on the team's progress and the opening of any positions.</p>
                    <Button isLink style='red' href={"/team"}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Join the email list</p>
                            <HiOutlineExternalLink />
                        </div>
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <div className={`flex flex-col items-center gap-8 justify-center bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-[${colors.textDark}] font-mono font-medium text-xl`}>Want more information?</h1>
                        <Button isLink style='clear' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Meet our team</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                    <div className={`flex flex-col items-center gap-8 justify-center bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-[${colors.textDark}] font-mono font-medium text-xl`}>Ready to apply?</h1>
                        <Button isLink style='clear' href={"/apply"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Join the team</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}