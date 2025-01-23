"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import { getColors } from "@/const/theme";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import Link from 'next/link';
import ProjectPage from "@/components/ProjectPage";
import { Projects } from "@/const/data";
import Photo from "@/components/Photo";

export default function GS1() {
    const colors = getColors();
    
    return (
        <ProjectPage
            title="GS-1"
        >
            <div className={clsx(
                `text-[${colors.textDark}]`,
                "flex flex-row w-full justify-between items-start mt-8 gap-x-[4rem] px-[4rem]"
            )}>
                <div className="flex flex-col">
                    <h1 className={`font-mono text-2xl my-4 font-bold`}>
                        Overview
                    </h1>
                    <p className="font-medium">
                        {Projects[1].description}
                    </p>
                </div>
                <div className={clsx(
                    `bg-[${colors.fg}]`,
                    "shrink-0 rounded-md w-[30rem] h-[30rem]"
                )}>

                </div>
            </div>
        </ProjectPage>
    );
}