"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Subscribe() {
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className={`flex flex-col items-center gap-8 justify-center max-w-[40rem] bg-bg border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl`}>INTERESTED?</h1>
                    <p className={`font-medium text-text-dark`}>We'll send you quarterly emails about all of the awesome projects we're working on. For all the prospective members, we also include position openings</p>
                    <Button isLink style='red' href={"https://app.e2ma.net/app2/audience/signup/2009107/1979383/"}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Join the email list</p>
                            <HiOutlineExternalLink />
                        </div>
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <div className={`flex flex-col items-center gap-8 justify-center bg-fg border-bg-highlight border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-text-dark font-mono font-medium text-xl`}>Want more information?</h1>
                        <Button isLink style='clear' href={"/team"}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>Meet our team</p>
                                <FaArrowRightLong />
                            </div>
                        </Button>
                    </div>
                    <div className={`flex flex-col items-center gap-8 justify-center bg-fg border-bg-highlight border-[1px] p-8 rounded-md`}>
                        <h1 className={`text-text-dark font-mono font-medium text-xl`}>Ready to apply?</h1>
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