"use client";

import Divider from "@/components/Divider";
import NavBar from "@/components/NavBar";
import { getColors, getTheme } from "@/const/theme";
import Image from 'next/image';

// @ts-ignore
import cubeSat from "../cube.svg";

import teamImg from '../team.jpg';

import { FaSatelliteDish } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";
import clsx from "clsx";

type MissionKey = 'GS' | 'AIRIS' | 'SCALAR';

type Person = {
    name: string,
    title: string,
    credits?: MissionKey[]
}

const getCreditIcon = (c: MissionKey) => {
    switch (c) {
        case 'GS':
            return <FaSatelliteDish />;
        case 'AIRIS':
            return <IoTelescope />;
    }
}

const TeamTile = (props: Person) => {
    const colors = getColors();

    const theme = getTheme();

    return (
        <div className={clsx(
            theme === 'light' ? 'shadow-md' : `border-[#0d0c0c] border-[1px]`,
            `flex flex-col w-full relative items-start justify-end font-mono rounded-md bg-[${colors.fg}] md:w-[16rem] h-[16rem] p-4`
        )}>
            <h3 className="font-semibold">{props.name}</h3>
            <p className={`text-sm text-[${colors.textSecondary}]`}>{props.title}</p>
            <div className={`flex flex-row items-center absolute top-0 right-0 pr-4 pt-4 gap-2 text-[${colors.textSecondary}]`}>
                {props.credits?.map(c => 
                    getCreditIcon(c)
                )}
            </div>
        </div>
    );
}

const exec: Person[] = [
    {
        name: "Ben Cook",
        title: "President",
        credits: ['GS', 'AIRIS']
    },
    {
        name: "Geoffrey Goffman",
        title: "Project Manager"
    },
    {
        name: "Owen Nieuwenhuizen",
        title: "Chief Systems Engineer"
    },
    {
        name: "Nate Hayman",
        title: "Chief Software Engineer"
    },
];

const members: Person[] = [
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    },
    {
        name: "Member",
        title: "Member team"
    }
]

export default function OurTeam() {
    const colors = getColors();

    return (
        <div className="flex-1 relative overflow-x-hidden">
            <NavBar/>
            <div className="fixed -top-[12rem] w-full h-full -z-10">
                <Image
                    className="opacity-60"
                    src={teamImg}
                    alt=""
                    placeholder="blur"
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
            <main className={`text-[${colors.textDark}] relative`}>
                <div className="flex flex-col items-center justify-center w-full h-[26rem] pt-[8rem]">
                    <span className={`font-bold text-[${colors.text}] bg-[${colors.accentRed}] px-4 py-2 rounded-t-xl z-10 border-[#0d0c0c] border-[1px] -mb-[2px]`}>These missions made possible by</span>
                    <h1 className={`text-[4rem] font-semibold font-mono text-[${colors.accentRed}] bg-[${colors.bg}] border-[#0d0c0c] border-[1px] px-6 py-2 rounded-xl`}>OUR TEAM</h1>
                </div>
                <div className="mt-[6rem]"/>
                <div className={'relative'}>
                    <div className="absolute w-[110%] -ml-2 left-0 bottom-[98%] lg:-top-[8rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 853 162" fill="none">
                            <path d="M2.12621 1.508L1 1.36471V2.5V159.5V160.5H2H851H852V159.5V2.5V1.35719L850.867 1.50884C611.961 33.4963 226.049 29.9981 2.12621 1.508Z" fill="#181818" stroke="#0d0c0c" strokeWidth="1"/>
                        </svg>
                    </div>
                    <div className={`z-10 relative bg-[${colors.bg}] px-[4rem] pt-4 pb-[4rem]`}>
                        <h2 className="font-mono text-lg font-semibold my-8">Executive Board</h2>
                        <div className="flex flex-row flex-wrap justify-start gap-8">
                            {exec.map(m => (
                                <TeamTile
                                    key={m.name}
                                    {...m}
                                />
                            ))}
                        </div>
                        <h2 className="font-mono text-lg font-semibold my-8 mt-16">Members</h2>
                        <div className="flex flex-row flex-wrap justify-start gap-8">
                            {members.map(m => (
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