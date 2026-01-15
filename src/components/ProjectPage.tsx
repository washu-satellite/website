"use client";
import NavBar from "@/components/NavBar";
import { PropsWithChildren } from "react";
import { ProjectPages } from "../const/content/projects";

type ProjectPageProps = {
    project: keyof typeof ProjectPages
}

export default function ProjectPage(props: PropsWithChildren<ProjectPageProps>) {
    return (
        <div className="flex-1 overflow-x-hidden bg-bg">
            <NavBar/>
            {/* <div className={"fixed top-0 w-full h-full bg-bg z-0"}/> */}
            <div className="min-h-full h-[60rem] z-10">
                <div className="flex flex-col items-center gap-8 pt-[8rem]">
                    <div className="relative h-[10rem] w-full">
                        <img
                            src={"/AIRIS.svg"}
                            alt=""
                        />
                        <h1 className="absolute bottom-[3rem] font-mono text-center w-full font-semibold text-3xl">ADAPT Incidence and Image Resolution Telescope</h1>
                    </div>

                    {/* <div className="w-full mt-[8rem] flex flex-row items-center justify-center">
                        <div className="w-[2rem] rounded-full h-[0.25rem] bg-text-secondary mr-4"/>
                        <div className="w-[4rem] rounded-full h-[0.25rem] bg-text-secondary mr-4"/>
                        <div className="relative rounded-full w-[70rem] h-[0.25rem] bg-gradient-to-r from-text-secondary to-white">
                            <div className="absolute flex flex-col items-center top-4 left-[8rem]">
                                <div className="bg-white h-4 w-4 rounded-full"/>
                                <Tile
                                    phase="CURRENT PHASE"
                                    title="Design Phase"
                                />
                            </div>
                        </div>
                        <div className="w-[4rem] rounded-full h-[0.25rem] bg-white ml-4"/>
                    </div> */}
                </div>
            </div>
        </div>
    );
}