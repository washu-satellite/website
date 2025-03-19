"use client";
import NavBar from "@/components/NavBar";
import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type ProjectPageProps = {
    title: ReactNode
}

export default function ProjectPage(props: PropsWithChildren<ProjectPageProps>) {
    return (
        <div className="flex-1 overflow-x-hidden">
            <NavBar/>
            <div className={"fixed top-0 w-full h-full bg-[#1A1F27]"}/>
            <div className={`absolute font-mono top-[8rem] left-0 text-[18rem]`}>
                {props.title}
            </div>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                {props.children}
            </div>
        </div>
    );
}