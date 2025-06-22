import { NavElement, ProjectData, ProjectPageType } from "@/types/data";
import { HomepageContent } from "./homepage";
import { FaSatelliteDish } from "react-icons/fa";
import { IoTelescope } from "react-icons/io5";
import { MdSatelliteAlt } from "react-icons/md";
import { BiSolidBalloon } from "react-icons/bi";
import { MdArticle } from "react-icons/md";
import { BiSolidMegaphone } from "react-icons/bi";
import { FaCircleNodes } from "react-icons/fa6";
import { RiTeamFill } from "react-icons/ri";

export const ProjectPages: { [K in any]: ProjectPageType } = {
    gs1: {
        project: {
            id: "GS-1",
            title: "Ground Station 1",
            url: "gs1",
            short: "A UHF ground station to communicate with deployed payloads",
            description: "Ground Station 1 (GS-1) will be the communication link for our satellite operations, supporting critical coordination with orbiting spacecraft and high altitude balloons. The system features a high-gain, in-house engineered Yagi antenna, commercial rotator, custom roof mount, and data processing through an SDR.",
            contributors: 47,
            date: "Q2-2025",
            icon: (<FaSatelliteDish size={22} />),
            phase: 'assembly',
            posterUrl: "https://bpb-us-w2.wpmucdn.com/sites.wustl.edu/dist/d/4409/files/2024/12/GS-1-Poster.pdf",
            image: "/gs1.png"
        },
        overview: "",
        disciplineOverviews: []
    },
    airis: {
        project: {
            id: "AIRIS",
            title: "ADAPT Incidence Resolution & Imaging System",
            url: "airis",
            short: "Upper-atmosphere optical telescope payload for spacial search algorithms and physics research",
            description: "AIRIS is our piggyback payload for the ADAPT mission, a high-altitude WashU Physics, NASA-funded mission which will demonstrate the APT detector on gamma ray burst transients.  Our payload will improve upon transient source predictions by imaging the sky space with a rotating optical telescope, the results of which will be forwarded to the NASA General Coordinates Network for further observation by ground telescopes around the world.",
            contributors: 47,
            date: "Q2-2027",
            icon: (<IoTelescope size={24} />),
            phase: 'assembly',
            posterUrl: "https://bpb-us-w2.wpmucdn.com/sites.wustl.edu/dist/d/4409/files/2024/12/AIRIS-High-Precision-Optical-Follow-Up-Telescope-for-Gamma-Ray-Burst-Detection-with-ADAPT.pdf",
            image: "/airis.png",
            imageSize: "60rem"
            // imageSize: 1000
        },
        overview: "",
        disciplineOverviews: []
    },
    scalar: {
        project: {
            id: "SCALAR",
            title: "Secure Configurable Autonomous Laboratory for Algorithm Research",
            url: "scalar",
            short: "1U CubeSat integrating open-source hardware and communications software",
            description: "SCALAR will be our inaugural CubeSat mission. Leveraging strategic partnerships with other university CubeSat teams and the WashU Department of Physics, along with utilizing open-source hardware, we are on an accelerated trajectory to launch our first payload in the spring of 2026. It is designed to demonstrate on-orbit reconfigurable hybrid compute, a key technology for future, software-enabled missions.",
            contributors: 47,
            date: "Q4-2026",
            icon: (<MdSatelliteAlt size={22} />),
            phase: 'design'
        },
        overview: "",
        disciplineOverviews: []
    },
    vector: {
        project: {
            id: "VECTOR",
            title: "Versatile Educational Controls Testbed for Optical Response",
            url: "vector",
            short: "3U CubeSat for astronomical transient imaging; spaceflight search algorithm testbed",
            description: "VECTOR is a 3U CubeSat designed as a reconfigurable educational platform and on-orbit search and control laboratory for multi-messenger astronomy developed primarily by undergraduate students. Its design invites broad participation, allowing students and the public to engage with and contribute to the mission through algorithm development and testing, building on the success of the ESA’s OPS-SAT. VECTOR combines optical astronomy with a modular in-house developed bus architecture, serving as an accessible in-space testbed and transient event observer.",
            contributors: 47,
            date: "2028",
            icon: (<MdSatelliteAlt size={22} />),
            phase: 'proposal',
            posterUrl: "https://bpb-us-w2.wpmucdn.com/sites.wustl.edu/dist/d/4409/files/2024/12/VECTOR-A-3U-CubeSat-for-Educational-and-Algorithmic-Development-in-Space-Based-Optical-Imaging.pdf",
            image: "/vector.png",
            imageSize: "60rem"
        },
        overview: "",
        disciplineOverviews: []
    },
    spinor: {
        project: {
            id: "SPINOR",
            title: "Spinning Past-Ionospheric Networked Observation of Radio",
            url: "spinor",
            short: "Opening a new frequency window of the radio sky for astronomy",
            description: "SPINOR is a program designed to image the sub-30 MHz radio sky in fine resolution for the first time, promising discoveries across exoplanet magnetic interactions, heliophysics and space weather, and early universe 21-cm cosmology. Its hardware consists of a set of spin stabilized conductive tethers located beyond the ionosphere, acting as configurable, low-frequency resonant antennas, using interferometric super-resolution imaging.",
            contributors: 47,
            date: "Phase I: Q2-2026",
            icon: (<MdSatelliteAlt size={22} />),
            phase: 'proposal',
            posterUrl: "/spinor_poster.pdf"
        },
        overview: "",
        disciplineOverviews: []
    },
    sb1: {
        project: {
            id: "SB-1",
            title: "Small Balloon 1",
            url: "sb1",
            short: "A small balloon payload with a camera; our first development effort",
            description: "Small Balloon 1 was our first project. The main goals were to launch a payload running hardware and software similar to that which would fly on our first satellite and to gain experience planning and operating a mission as a team. The payload consisted of a Raspberry Pi, a mounting plate, a camera and two 2-axis gimbals lifted by a 4-foot diameter helium balloon. The flight was successful, and we got some great pics of campus which you can see here:",
            contributors: 11,
            date: "Q2-2024",
            icon: (<BiSolidBalloon size={28}/>),
            phase: 'success'
        },
        overview: "",
        disciplineOverviews: []
    }
}

export const PublicationsNavigation: NavElement[] = [
    {
        id: "Scientific Publications",
        title: "Scientific Publications",
        url: "publications",
        icon: (<MdArticle size={24}/>),
        short: "Papers, articles, posters, and other publications from our team"
    },
    {
        id: "News",
        title: "News",
        url: "news",
        icon: (<BiSolidMegaphone size={22}/>),
        short: "Announcements and other exciting tidbits"
    }
];

export const TeamNavigation: NavElement[] = [
    {
        id: "Members & Alumni",
        title: "Members & Alumni",
        url: "team",
        icon: (<RiTeamFill size={24}/>),
        short: "The people who make it all possible"
    },
    {
        id: "Team Structure",
        title: "Team Structure",
        url: "structure",
        icon: (<FaCircleNodes size={20}/>),
        short: "Group organization and its benefits"
    }
]

export const ProjectHighlightData = Object.keys(ProjectPages).map(p => ProjectPages[p].project);
