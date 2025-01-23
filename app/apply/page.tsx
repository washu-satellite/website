"use client";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import NavBar from "@/components/NavBar";
import { getColors } from "@/const/theme";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Apply() {
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
                    <h1 className={`text-[${colors.accentRed}] text-center font-mono font-semibold text-4xl md:text-6xl`}>WANT TO CONTIRBUTE?</h1>
                    <p className={`font-medium text-[${colors.textDark}]`}>We are currently recruiting for the SP25 semester! Select the discipline team you would like to apply for below to see applicant requirements. You may apply to multiple teams, but you must fill out the application for each, and attend each interview.</p>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                        <Button isLink style='red' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Software</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Electrical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Mechanical</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                        <Button isLink style='red' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Physics</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                    </div>
                    <h2 className={`font-mono text-[${colors.textDark}]`}>Applications close: <span className="font-semibold">1/31/2025</span></h2>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8">
                    <div className={`flex flex-col items-center gap-8 justify-center bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-[${colors.textDark}] font-mono font-medium text-xl`}>Learn more about us</h1>
                        <Button isLink style='clear' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Our team</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                    <div className={`flex flex-col items-center gap-8 justify-center bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-[${colors.textDark}] font-mono font-medium text-xl`}>Not ready to apply?</h1>
                        <Button isLink style='clear' href={"/team"}>
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