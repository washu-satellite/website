"use client";

import Divider from "@/components/Divider";
import NavBar from "@/components/NavBar";
import { getColors, getTheme } from "@/const/theme";
import Image from 'next/image';

// @ts-ignore
import cubeSat from "../cube.svg";

import teamImg from '../team.jpg';

import { FaLinkedin, FaSatelliteDish } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";
import clsx from "clsx";
import { alphabeticSort } from "@/util/macros";
import Link from "next/link";
import { EmailButton } from "@/components/Button";

type MissionKey = 'GS' | 'AIRIS' | 'SCALAR';

type Person = {
    name: string,
    title: string,
    email?: string,
    avatar?: string,
    linkedin?: string,
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
            theme === 'light' ? 'shadow-sm' : "",
            `border-[${colors.bgHighlight}] border-[1px]`,
            `flex flex-col w-full relative items-start justify-end font-mono rounded-md bg-[${colors.fg}] md:w-[16rem] h-[16rem]`
        )}>
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
                    <div className="absolute flex items-center justify-center w-full h-full opacity-0 bg-[rgba(0,0,0,0.8)] hover:opacity-100 text-sm rounded-t-[5px]">
                        <EmailButton
                            text={props.email}
                            href={`mailto:${props.email}`}
                        />
                    </div>
                }
            </div>
            <div className={clsx(
                props.avatar ? "border-t-[1px]" : "", 
                `z-10 relative bg-[${colors.fg}] border-inherit w-full p-4 rounded-b-md`
            )}>
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className="font-semibold">{props.name}</h3>
                        <p className={`text-sm text-[${colors.textSecondary}]`}>{props.title}</p>
                    </div>
                    <div className={clsx(
                        `hover:text-[${colors.textHover}]`,
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
        </div>
    );
}

const exec: Person[] = [
    {
        name: "Ben Cook",
        title: "President",
        email: "b.j.cook@wustl.edu",
        avatar: "/headshots/ben.jpg",
        linkedin: "https://www.linkedin.com/in/benjamin-j-cook/",
        credits: ['GS', 'AIRIS']
    },
    {
        name: "Geoffrey Goffman",
        email: "geoffrey.goffman@gmail.com",
        linkedin: "https://www.linkedin.com/in/geoffrey-goffman",
        avatar: "/headshots/geoffrey.jpg",
        title: "Project Manager"
    },
    {
        name: "Owen Nieuwenhuizen",
        title: "Chief Systems Engineer"
    },
    {
        name: "Nate Hayman",
        avatar: "/headshots/nate.jpg",
        email: "nathanielhayman@gmail.com",
        linkedin: "https://www.linkedin.com/in/nathanielhayman/",
        title: "Chief Software Engineer"
    },
    {
        name: "Sophie Fendler",
        title: "Chief Physicist"
    },
    {
        name: "Owen Cromly",
        title: "Chief Electrical Engineer"
    },
    {
        name: "Jack Galloway",
        title: "Chief Mechanical Engineer"
    },
];

const members: Person[] = [
    { name: "Mawin Suphanthapreecha ", title: "Designer" },
    { name: "Andrew Tang", title: "Electrical Engineering" },
    { name: "Gabe Herman", title: "Electrical Engineering" },
    { name: "Lilian Lu", title: "Electrical Engineering" },
    { name: "Nathaniel Bowman", title: "Electrical Engineering" },
    { name: "Siri Rodin", title: "Electrical Engineering" },
    { name: "Andrew Press", title: "Mechanical Engineering" },
    { name: "Eduardo Teixeira", title: "Mechanical Engineering" },
    { name: "Evan Hanning", title: "Mechanical Engineering" },
    { name: "Giselle Groff", title: "Mechanical Engineering" },
    { name: "Michael Safier", title: "Mechanical Engineering" },
    { name: "Oliver Yeaman", title: "Mechanical Engineering" },
    { name: "Peter Essa", title: "Mechanical Engineering" },
    { name: "Sam Kendall", title: "Mechanical Engineering" },
    { name: "Wilson Gao", title: "Mechanical Engineering" },
    { name: "Aavik Wadivkar", title: "Physics" },
    { name: "Bilgee Batsaikhan", title: "Software Engineering" },
    { name: "Drew Butzel", title: "Software Engineering" },
    { name: "Eric Todd", title: "Software Engineering" },
    { name: "Lotanna Okoli", title: "Software Engineering" },
    { name: "Martin Hristov", title: "Software Engineering" },
    { name: "Nick Jarmusz", title: "Software Engineering" },
    { name: "Peter Jacobsen", title: "Software Engineering" },
    { name: "Qihan Wang", title: "Software Engineering" },
    { name: "Sydney Seder", title: "Software Engineering" },
    { name: "Kayleigh Crow", title: "Systems Engineering" },
    { name: "Isabella Shultz", title: "Physics" },
    { name: "Connor Miller", title: "Systems Engineering" },
    { name: "Kelvin Han", title: "Treasury" },
    { name: "Andrew Tang", title: "Electrical Engineering" },
    { name: "Alexis Luna", title: "Electrical Engineering" },
    { name: "Evan Hanning", title: "Mechanical Engineering" },
    { name: "Lilian Lu", title: "Electrical Engineering" }
]

export default function OurTeam() {
    const colors = getColors();

    const theme = getTheme();

    return (
        <div className="flex-1 relative overflow-x-hidden">
            <NavBar/>
            <div className={clsx(
                theme === 'light' ? "-top-[6rem]" : "-top-[12rem]",
                "fixed w-full h-full -z-10"
            )}>
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
            </div>
            <main className={`text-[${colors.textDark}] relative`}>
                <div className={clsx(
                    theme === 'light' ? "h-[34rem]" : "h-[26rem]",
                    "flex flex-col items-center justify-center w-full pt-[8rem]"
                )}>
                    {/* <span className={`font-bold text-[${colors.text}] bg-[${colors.accentRed}] px-4 py-2 rounded-t-xl border-[${colors.bgHighlight}] border-[1px] -mb-[2px]`}>These missions made possible by</span> */}
                    <div className={clsx(
                        theme === 'light' ? "mt-16" : "",
                        `text-[4rem] font-semibold font-mono text-[${colors.accentRed}] bg-[${colors.bg}] border-[${colors.bgHighlight}] border-[1px] py-2 rounded-xl cursor-default`
                    )}>
                        <p className={`text-sm text-center italic px-6 text-[${colors.textSecondary}]`}>These missions made possible by</p>
                        <div className={`bg-[${colors.bgHighlight}] w-full h-[1px] mt-2`}/>
                        <h1 className="px-6">OUR TEAM</h1>
                    </div>
                </div>
                <div className="mt-[6rem]"/>
                <div className={'relative'}>
                    <div className="absolute w-[110%] -ml-2 left-0 bottom-[98%] lg:-top-[8rem]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 853 162" fill="none">
                            <path d="M2.12621 1.508L1 1.36471V2.5V159.5V160.5H2H851H852V159.5V2.5V1.35719L850.867 1.50884C611.961 33.4963 226.049 29.9981 2.12621 1.508Z" fill={colors.bg} stroke={colors.bgHighlight} strokeWidth="1"/>
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
                        <div className="flex flex-row flex-wrap justify-start gap-6">
                            {members.sort((a, b) => alphabeticSort(a.title, b.title)).map(m => (
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