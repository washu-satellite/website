import { ReactNode } from "react";
import { FaS, FaSatelliteDish } from "react-icons/fa6";
import { IoTelescope } from "react-icons/io5";
import { BiSolidBalloon } from "react-icons/bi";
import { MdSatelliteAlt } from "react-icons/md";
import { FaSatellite } from "react-icons/fa";

export type ProjectData = {
    id: string,
    title: string,
    url: string,
    description: string,
    contributors: number,
    date: string,
    phase: 'success' | 'assembly' | 'design',
    icon?: ReactNode,
    short?: string,
    posterUrl?: string
}

export const Projects: ProjectData[] = [
    
    {
        id: "GS-1",
        title: "Ground Station 1",
        url: "gs1",
        short: "A UHF ground station to communicate with deployed payloads",
        description: "Ground Station 1 (GS-1) will be the communication center of our satellite operations, a system designed for communication with orbiting spacecraft and high altitude balloons. A high-gain in-house engineered Yagi antenna is attached to a commercial rotator and our roof mount.",
        contributors: 47,
        date: "xx-xx-2024",
        icon: (<FaSatelliteDish size={22}/>),
        phase: 'assembly'
    },
    {
        id: "AIRIS",
        title: "ADAPT Incidence Resolution & Imaging System",
        url: "airis",
        short: "Upper-atmosphere optical telescope payload for spacial search algorithms and physics research",
        description: "Small Balloon 1 was our first project. The main goals were to launch a payload running hardware and software similar to that which would fly on our first satellite and to launch a payload as a team. The payload consisted of a Raspberry Pi, a mounting plate, a camera and two 2-axis gimbals lifted by a 4-foot diameter helium balloon. The flight was successful, and we got some great pics of campus which you can see here:",
        contributors: 47,
        date: "xx-xx-2024",
        icon: (<IoTelescope size={24}/>),
        phase: 'assembly'
    },
    {
        id: "SCALAR",
        title: "SCALAR",
        url: "scalar",
        short: "1U CubeSat integrating open-source hardware and communications software",
        description: "SCALAR will be our inaugural CubeSat mission. Leveraging strategic partnerships with other university CubeSat teams and the WashU Department of Physics, along with utilizing open-source hardware, we are on an accelerated trajectory to launch our first payload in the spring of 2025.",
        contributors: 47,
        date: "xx-xx-2024",
        icon: (<MdSatelliteAlt size={22}/>),
        phase: 'design'
    },
    {
        id: "VECTOR",
        title: "Versatile Educational Controls Testbed for Optical Response",
        url: "vector",
        short: "3U CubeSat for astronomical transient imaging; spaceflight search algorithm testbed",
        description: "VECTOR is a 3U CubeSat designed as an educational platform and on-orbit search and control laboratory for multi-messenger astronomy developed primarily by undergraduate students. Its design invites broad participation, allowing students and the public to engage with and contribute to the mission through algorithm development and testing, building on the success of the ESA’s OPS-SAT. VECTOR combines optical astronomy with a modular in-house developed bus architecture, serving as an accessible in-space testbed and transient event observer.",
        contributors: 47,
        date: "xx-xx-2024",
        icon: (<MdSatelliteAlt size={22}/>),
        phase: 'design'
    },
    {
        id: "SPINOR",
        title: "SPINOR",
        url: "spinor",
        short: "Revolutionary hyperspectral capture technology demonstration",
        description: "SPINOR is a program designed to image the sub-30 MHz radio sky in fine resolution for the first time, which promises discoveries ranging across exoplanet magnetic interactions, heliophysics and space weather, and 21-cm cosmology. Its hardware consists of a set of spin stabilized conductive tethers located outside of the ionosphere, acting as configurable, low-frequency resonant antennas, with possible data processing techniques including imaging, beamforming, and interferometry",
        contributors: 47,
        date: "xx-xx-2024",
        icon: (<MdSatelliteAlt size={22}/>),
        phase: 'design'
    },
    {
        id: "SB-1",
        title: "Small Balloon 1",
        url: "sb1",
        short: "A small balloon payload with a camera; our first development effort",
        description: "Small Balloon 1 was our first project. The main goals were to launch a payload running hardware and software similar to that which would fly on our first satellite and to launch a payload as a team. The payload consisted of a Raspberry Pi, a mounting plate, a camera and two 2-axis gimbals lifted by a 4-foot diameter helium balloon. The flight was successful, and we got some great pics of campus which you can see here:",
        contributors: 11,
        date: "xx-xx-2024",
        icon: (<BiSolidBalloon size={28}/>),
        phase: 'success'
    },
]