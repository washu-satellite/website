import { ProjectData } from "@/types/data";
import clsx from "clsx";

import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

const getPhase = (phase: ProjectData['phase']) => {
    switch (phase) {
        case 'assembly':
            return <span className={"text-accent-red"}>Assembly Phase</span>;
        case 'design':
            return <span className={"text-accent-red"}>Design Phase</span>;
        case 'prototyping':
            return <span className={"text-accent-red"}>Prototyping Phase</span>;
        case 'proposal':
            return <span className={"text-accent-red"}>Proposal Phase</span>;
        case 'success':
            return <span className={"text-[#4CB75A]"}>Mission Success</span>;
    }
}

export default function ProjectHighlight(props: ProjectData & { direction?: 'left' | 'right' }) {
    return (
        <div className={clsx(
            props.image ? "min-h-[700px]" : "",
            "flex flex-col items-center justify-center relative"
        )}>
            {/* <span className="font-mono">
                {props.id}
            </span> */}
            {props.image &&
                <div
                    style={{
                        width: "100%",
                        maxWidth: props.imageSize??"50rem",
                        height: props.imageSize??"46rem"
                    }}
                    className={clsx(
                        "relative md:absolute z-0 mr-0 ml-0 select-none -mt-[4rem] -mb-[12rem] w-full overflow-hidden",
                        props.direction === 'left' ? "left-0 md:-left-[12rem]" : "right-0 md:-right-[4rem]"
                    )}
                >
                    <img 
                        src={props.image}
                        alt=""
                    />
                </div>
            }
            <div
                className={clsx(
                    `rounded-md z-10 mr-0 ml-0 shadow-md dark:shadow-none`,
                    "flex flex-row flex-wrap xl:flex-nowrap min-w-full md:min-w-[30rem] min-h-0 md:min-h-[24rem]",
                    props.direction === 'right' ? "justify-between" : "justify-start",
                    props.image ? (
                        props.direction === 'right' ? "md:mr-[40rem]" : "md:ml-[40rem]"
                    ) : ""
                )}
            >
                <div className={clsx(
                    "relative border border-border bg-background rounded-md flex flex-col justify-between p-8 gap-8 overflow-hidden shadow-sm dark:shadow-none"
                )}>
                    <div className="font-sans flex flex-col gap-4 z-10">
                        <h3 
                            key={"title"} 
                            className={clsx(
                                `font-semibold md:text-left text-xl text-text`
                            )}
                        >
                            {`${props.title} (${props.id})`}
                        </h3>
                        <p key={"description"} className={"font-sans font-normal text-foreground/80"}>{props.description}</p>
                    </div>
                    <div className="absolute top-0 right-0 w-full h-20 bg-[url(/circle.svg)] bg-center bg-repeat bg-size-[1rem] opacity-20 -mr-11 -mt-1.5"/>
                    <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-bl from-background/0 via-background to-background"/>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-[url(/circle.svg)] bg-center bg-repeat bg-size-[1rem] opacity-10 -ml-5 -mb-1.5"/>
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-tr from-background/0 via-background to-background"/>
                    <div key={"buttons"} className={"flex flex-row text-base font-medium flex-wrap gap-4 justify-between items-center z-10"}>
                        <div className={clsx("font-mono flex flex-row text-sm", `text-[#777777] relative`)}>
                            <p>{props.date}</p>
                            <span className={`flex-1 self-stretch h-full mx-[0.6rem]`}>//</span>
                            <p>{props.contributors} Contributors</p>
                            <p className={`h-full mx-[0.6rem] tracking-wide`}>//</p>
                            <p className="underline underline-offset-3">{getPhase(props.phase)}</p>
                        </div>
                        <div 
                            className={clsx(
                                "flex flex-row md:text-left justify-center md:justify-start gap-4 items-center"
                            )}
                        >
                            {props.posterUrl &&
                                <Button variant='outline' asChild>
                                    <Link
                                        to={props.posterUrl} 
                                        className={"flex flex-row gap-2 items-center"}
                                    >
                                        <p>See Poster</p>
                                        <ExternalLink className="w-4 h-4"/>
                                    </Link>
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
            </div>
        </div>
    )
}