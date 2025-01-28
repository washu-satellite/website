import { getTheme } from "@/const/theme";
import { ProjectData } from "@/types/data";
import clsx from "clsx";
import Link from 'next/link';
import { HiOutlineExternalLink } from "react-icons/hi";
import Button from "./Button";
import Photo from "./Photo";

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
    const theme = getTheme();

    console.log(props);
    
    const elements = [
        <Photo right={props.direction === 'right'} classes={"border-b-[1px] xl:border-b-0"}>
            
            <p className="p-1 px-2 m-1 bg-black bg-opacity-50 rounded-md text-sm text-[#eeeeee] font-semibold">
                {props.id} Model
            </p>
        </Photo>,
        <div className={clsx(
            "flex flex-col justify-between p-8"
        )}>
            <div className="font-sans flex flex-col gap-4">
                <h3 
                    key={"title"} 
                    className={clsx(
                        `font-bold md:text-left text-2xl text-text`
                    )}
                >
                    <Link className={`rounded-full font-mono -ml-2 mr-1 px-4 py-1 hover:bg-fg-hover border-bg-highlight border-[1px]`} href={`/projects/${props.id.replaceAll("-", "").toLowerCase()}`}>
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
                    {props.posterUrl &&
                        <Button isLink={true} style='clear' href={props.posterUrl}>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <p>See Poster</p>
                                <HiOutlineExternalLink />
                            </div>
                        </Button>
                    }

                    {/* <Button disabled isLink={true} href={`/projects/${props.id.replaceAll("-", "").toLowerCase()}`}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Learn More</p>
                            <FaArrowRightLong />
                        </div>
                    </Button> */}
                </div>
            </div>
        </div>
    ];

    return (
        <div 
            className={clsx(
                theme === 'light' ? "shadow-md" : "",
                `bg-fg border-bg-highlight border-[1px] rounded-md`,
                "flex-1 flex flex-row flex-wrap xl:flex-nowrap min-w-fit md:min-w-[30rem] xl:min-w-fit",
                props.direction === 'right' ? "justify-between" : "justify-start",
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