"use client";
import NavBar from "@/components/NavBar";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type ProjectPageProps = {
    title: string
}

export default function ProjectPage(props: PropsWithChildren<ProjectPageProps>) {
    return (
        <div className="flex-1 overflow-x-hidden">
            <NavBar/>
            <div className={"fixed top-0 w-full h-full bg-[#1A1F27]"}/>
            <h1 className={`absolute font-mono top-[2rem] left-0 text-[18rem] text-[#c2c2c2] opacity-80`}>{props.title}</h1>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                {props.children}
            </div>
        </div>
    );
}