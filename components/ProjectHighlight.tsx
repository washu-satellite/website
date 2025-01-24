import { ProjectData } from "@/const/data";
import { getColors } from "@/const/theme"
import React from "react";
import Button from "./Button";
import Photo from "./Photo";
import { FaArrowRightLong } from "react-icons/fa6";
import clsx from "clsx";
import Link from 'next/link';

const getPhase = (phase: ProjectData['phase']) => {
    switch (phase) {
        case 'assembly':
            return <span className={"text-[#E6C300]"}>Assembly Phase</span>;
        case 'design':
            return <span className={"text-[#F4761B]"}>Design Phase</span>;
        case 'success':
            return <span className={"text-[#4CB75A]"}>Mission Success</span>;
    }
}

export default function ProjectHighlight(props: ProjectData & { direction?: 'left' | 'right' }) {
    const colors = getColors();

    console.log(props);
    
    const elements = [
        <Photo right={props.direction === 'right'} classes={"border-b-[1px] xl:border-b-0"}>
            <p className={"p-2"}>{props.id} Image</p>
        </Photo>,
        <div className={clsx(
            "flex flex-col justify-between p-8"
        )}>
            <div className="font-sans flex flex-col gap-4">
                <h3 
                    key={"title"} 
                    className={clsx(
                        `font-bold md:text-left text-2xl text-[${colors.text}]`
                    )}
                >
                    <Link className={`rounded-full font-mono -ml-2 mr-1 px-4 py-1 hover:bg-[${colors.fgHover}] border-[${colors.bgHighlight}] border-[1px]`} href={`/projects/${props.id.replaceAll("-", "").toLowerCase()}`}>
                        {props.id}
                    </Link>
                    &nbsp;{props.title}
                </h3>
                <p key={"description"} className={"font-sans font-medium text-[1.1rem]"}>{props.description}</p>
            </div>
            <div key={"buttons"} className={"flex flex-row flex-wrap gap-4 justify-between items-center"}>
                <div className={clsx("font-mono flex flex-row", `text-[#777777] relative`)}>
                    <p>{props.date}</p>
                    <span className={`flex-1 self-stretch h-full mx-[0.6rem] border-[#777777] border-l-[1px]`}>&#8203;</span>
                    <p>{props.contributors} Contributors</p>
                    <span className={`h-full mx-[0.6rem] border-l-[1px] border-[#777777]`}>&#8203;</span>
                    <p>{getPhase(props.phase)}</p>
                </div>
                <div 
                    className={clsx(
                        "flex flex-row md:text-left justify-center md:justify-start gap-4 items-center"
                    )}
                >
                    <Button style={'clear'} isLink={true} href={""}>
                        See the Poster
                    </Button>

                    <Button isLink={true} href={`/projects/${props.id.replaceAll("-", "").toLowerCase()}`}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Learn More</p>
                            <FaArrowRightLong />
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    ];

    return (
        <div 
            className={clsx(
                `bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px] rounded-md`,
                "flex-1 flex flex-row flex-wrap xl:flex-nowrap min-w-fit md:min-w-[30rem] xl:min-w-fit",
                props.direction === 'right' ? "justify-between" : "justify-start"
            )}
        >
            {props.direction === 'right' &&
                <div className={"block w-full xl:hidden"}>
                    {elements[0]}
                </div>
            }
            {props.direction === 'right' ? (
                <>
                    {elements[1]}
                    <div className={"hidden xl:block"}>{elements[0]}</div>
                </>
            ) : (
                <>
                    {elements[0]}
                    {elements[1]}
                </>
            )}
        </div>
    )
}