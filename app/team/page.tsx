"use client";

import NavBar from "@/components/NavBar";
import Image from 'next/image';

// @ts-ignore

import teamImg from '../team.jpg';

import { EmailButton } from "@/components/Button";
import { ExecMembers, Members } from "@/const/content/team";
import { MissionKey, Person } from "@/types/data";
import { alphabeticSort } from "@/util/macros";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FaLinkedin, FaSatelliteDish } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";

import { motion, useScroll, useTransform } from 'motion/react';

const getCreditIcon = (c: MissionKey) => {
    switch (c) {
        case 'GS':
            return <FaSatelliteDish />;
        case 'AIRIS':
            return <IoTelescope />;
    }
}

const TeamTile = (props: Person) => {
    const {theme} = useTheme();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={clsx(
                theme === 'light' ? 'shadow-sm' : "",
                `border-bg-highlight border-[1px]`,
                `flex flex-col w-full relative items-start justify-end font-mono rounded-md bg-fg md:w-[16rem] h-[16rem]`
            )}
        >
            <div className="relative w-full h-full">
                {props.avatar &&
                    <Image
                        className="rounded-t-[5px]"
                        src={props.avatar}
                        blurDataURL={props.avatar}
                        placeholder="blur"
                        alt=""
                        fill
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                }
                {props.email &&
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
                }
            </div>
            <div className={clsx(
                props.avatar ? "border-t-[1px]" : "", 
                `z-10 relative bg-fg border-inherit w-full p-4 rounded-b-md`
            )}>
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className="font-semibold">{props.name}</h3>
                        <p className={`text-sm text-text-secondary`}>{props.title}</p>
                    </div>
                    <div className={clsx(
                        `hover:text-text-hover`,
                        "flex flex-row items-center"
                    )}>
                        {props.linkedin && 
                            <a href={props.linkedin}>
                                <FaLinkedin size={30} />
                            </a>
                        }
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function OurTeam() {
    const {theme} = useTheme();

    const { scrollYProgress } = useScroll();

    return (
        <div className="flex-1 relative overflow-x-hidden">
            <NavBar/>
            <motion.div
                style={{
                    y: useTransform(scrollYProgress, [0, 0.78, 1], [0, -400, -400])
                }}
                className={clsx(
                    theme === 'light' ? "-top-[6rem]" : "-top-[12rem]",
                    "fixed w-full h-full -z-10"
                )}
            >
                <Image
                    className={theme === 'light' ? "opacity-90" : "opacity-80"}
                    src={teamImg}
                    alt=""
                    placeholder="blur"
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </motion.div>
            <main className={`text-text-dark relative`}>
                <div className={clsx(
                    theme === 'light' ? "h-[40rem]" : "h-[32rem]",
                    "relative flex flex-col items-center justify-center w-full"
                )}>
                    {/* <span className={`font-bold text-[${colors.text}] bg-accent-red px-4 py-2 rounded-t-xl border-bg-highlight border-[1px] -mb-[2px]`}>These missions made possible by</span> */}
                    <div className={clsx(
                        theme === 'light' ? "mt-16" : "",
                        `text-[4rem] -mt-[4rem] font-semibold font-mono text-accent-red bg-bg border-bg-highlight border-[1px] py-2 rounded-xl cursor-default`
                    )}>
                        <p className={`text-sm text-center italic px-6 text-text-secondary`}>These missions made possible by</p>
                        <div className={`bg-bg-highlight w-full h-[1px] mt-2`}/>
                        <h1 className="px-6">OUR TEAM</h1>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url("/curve.svg")`,
                            backgroundSize: "110%"
                        }}
                        className="absolute -bottom-2 w-[110%] h-[8rem] bg-repeat-x"
                    />
                    <div className="block md:hidden bg-bg absolute -bottom-2 h-[6rem] w-full"/>
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
                        <h2 className="font-mono text-lg font-semibold my-8">Executive Board</h2>
                        <div className="flex flex-row flex-wrap justify-start gap-8">
                            {ExecMembers.map(m => (
                                <TeamTile
                                    key={m.name}
                                    {...m}
                                />
                            ))}
                        </div>
                        <h2 className="font-mono text-lg font-semibold my-8 mt-16">Members</h2>
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