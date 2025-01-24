"use client";
import NavBar from "@/components/NavBar";
import { getColors } from "@/const/theme";
import clsx from "clsx"

export default function NotReady() {
    const colors = getColors();

    return (
        <div className="flex-1">
            <NavBar/>
            <div className={`absolute bg-[${colors.blueBg}] w-full h-full -z-10`}/>
            <div className={clsx(
                "flex flex-col items-center justify-center h-[40rem] z-10"
            )}>
                <div className={clsx(
                    `bg-[${colors.bg}] border-[${colors.bgHighlight}] border-[1px]`,
                    "font-mono shadow-md rounded-md flex flex-col items-center justify-center"
                )}>
                    <h1 className={`font-bold text-[${colors.text}] p-4 text-6xl`}>(╯°□°）╯︵ ┻━┻</h1>
                    <div className={`bg-[${colors.bgHighlight}] w-full h-[1px] mt-4`}/>
                    <p className={`font-medium text-sm italic text-[${colors.text}] p-4`}>This page isn't ready for you to see yet! Check back again soon</p>
                </div>
            </div>
        </div>
    )
}