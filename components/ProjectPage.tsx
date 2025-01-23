"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import { getColors } from "@/const/theme";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import Link from 'next/link';
import { PropsWithChildren } from "react";

type ProjectPageProps = {
    title: string
}

export default function ProjectPage(props: PropsWithChildren<ProjectPageProps>) {
    const colors = getColors();
    
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={"fixed top-0 w-full h-full bg-[#1A1F27]"}/>
            <h1 className={`absolute font-mono top-[2rem] left-0 text-[18rem] text-[#c2c2c2] opacity-80`}>{props.title}</h1>
            <div className={clsx(
                `bg-[${colors.bg}] border-[${colors.bgHighlight}] border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                {props.children}
            </div>
        </div>
    );
}