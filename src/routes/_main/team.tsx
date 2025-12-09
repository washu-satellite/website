"use client";

import NavBar from "@/components/NavBar";

// @ts-ignore

import { EmailButton } from "@/components/Button";
import { ExecMembers, Members } from "@/const/content/team";
import type { MissionKey, Person } from "@/types/data";
import clsx from "clsx";
import { FaLinkedin, FaSatelliteDish } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";

import { motion, useScroll, useTransform } from 'motion/react';
import { createFileRoute } from "@tanstack/react-router";
import { Curve } from "@/components/Projects";

export const Route = createFileRoute('/_main/team')({
    component: TeamPage,
})

const getCreditIcon = (c: MissionKey) => {
    switch (c) {
        case 'GS':
            return <FaSatelliteDish />;
        case 'AIRIS':
            return <IoTelescope />;
    }
}

const TeamTile = (props: Person) => {
    const { theme } = { theme: 'dark' };

    return (
        <div
            className={clsx(
                theme === 'light' ? 'shadow-sm' : "",
                `border-bg-highlight border-[1px] scale-100 hover:scale-105 transition duration-300 ease-in-out`,
                `flex flex-col font-mono justify-end rounded-md bg-fg w-[16rem] h-[16rem] min-h-0`
            )}
        >
            {props.avatar &&
                <img
                    className="flex-1 object-cover w-full h-0 rounded-t-[5px]"
                    src={props.avatar}
                    alt=""
                />
            }
            {/* {props.email &&
                <motion.a
                    whileHover={{ opacity: 1 }}
                    className={clsx(
                        theme === 'light' ? "bg-[rgba(255,255,255,0.9)]" : "bg-[rgba(0,0,0,0.8)]",
                        "absolute flex items-center justify-center w-full h-full opacity-0 text-sm rounded-t-[5px]"
                    )}
                    href={`mailto:${props.email}`}
                >
                    <EmailButton
                        text={props.email}
                        href={`mailto:${props.email}`}
                    />
                </motion.a>
            } */}
            <div
                className={clsx(
                    props.avatar ? 'border-t-[1px]' : '',
                    'bg-fg border-inherit w-full p-4 rounded-b-md shrink-0'
                )}
            >
                <div className="flex flex-row items-start justify-between text-text">
                    <div>
                        <h3 className="font-sans font-semibold">{props.name}</h3>
                        <p className="text-sm font-sans text-text-secondary">{props.title}</p>
                    </div>
                    <div className="hover:text-text-hover flex flex-row items-center">
                        {props.linkedin && (
                            <a href={props.linkedin}>
                                <FaLinkedin size={30} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function TeamPage() {
    const { theme } = { theme: 'dark' };

    const { scrollYProgress } = useScroll();

    return (
        <div className="flex-1 relative overflow-x-hidden">
            {/* <motion.div
                style={{
                    y: useTransform(scrollYProgress, [0, 0.78, 1], [0, -400, -400])
                }}
                className={clsx(
                    theme === 'light' ? "-top-[8rem]" : "-top-[14rem]",
                    "fixed w-full h-full -z-10"
                )}
            >
                <img
                    className={clsx(
                        "object-cover"
                    )}
                    src={"/team.jpg"}
                    alt=""
                    sizes="100vw"
                />
            </motion.div> */}
            <main className={`text-text-dark relative`}>
                <div className={clsx(
                    theme === 'light' ? "h-[40rem]" : "h-[32rem]",
                    "relative flex flex-col items-center justify-center w-full bg-[url(/team2.png)] bg-cover"
                )}>
                    {/* <span className={`font-bold text-[${colors.text}] bg-accent-red px-4 py-2 rounded-t-xl border-bg-highlight border-[1px] -mb-[2px]`}>These missions made possible by</span> */}
                    <div className={clsx(
                        theme === 'light' ? "mt-16" : "",
                        `text-[4rem] -mt-[4rem] font-semibold font-mono bg-bg border-bg-highlight border-[1px] py-2 rounded-xl cursor-default`
                    )}>
                        <p className={`text-sm text-center italic px-6 text-text-secondary font-medium`}>These missions made possible by</p>
                        <div className={`bg-bg-highlight backdrop-opacity-50 w-full h-[1px] mt-2`} />
                        <h1 className="px-6 text-accent-red">OUR TEAM</h1>
                    </div>
                    <div
                        className="absolute -bottom-2 w-[110%] h-[8rem] bg-repeat-x"
                    >
                        <Curve />
                    </div>
                    <div className="block md:hidden bg-bg absolute -bottom-2 h-[6rem] w-full" />
                    <div
                        style={{
                            maskImage: `url("/curve.svg")`,
                            maskSize: "110%",
                            backgroundImage: `url("/dotsh.svg")`,
                            backgroundSize: "20rem"
                        }}
                        className="absolute -bottom-2 w-[110%] h-[8rem] bg-repeat-x"
                    />
                </div>
                <div className={'relative'}>
                    <div className={`z-10 relative bg-bg px-[4rem] pt-4 pb-[4rem]`}>
                        <h2 className="text-text text-lg font-semibold my-8">Executive Board</h2>
                        <div className="flex flex-row flex-wrap justify-start gap-8">
                            {ExecMembers.map(m => (
                                <TeamTile
                                    key={m.name}
                                    {...m}
                                />
                            ))}
                        </div>
                        <h2 className="text-text text-lg font-semibold my-8 mt-16">Members</h2>
                        <div className="flex flex-row flex-wrap justify-start gap-6">
                            {Members.sort((a, b) => a.avatar ? -1 : 1).map(m => (
                                <TeamTile
                                    key={m.name}
                                    {...m}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}