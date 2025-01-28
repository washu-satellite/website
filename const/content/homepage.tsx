import { ProjectData } from "@/types/data"
import { BiSolidBalloon } from "react-icons/bi"
import { FaSatelliteDish } from "react-icons/fa6"
import { IoTelescope } from "react-icons/io5"
import { MdSatelliteAlt } from "react-icons/md"

type HomepageContentType = {
    missionStatement: string,
    aboutUs: string
};

export const HomepageContent: HomepageContentType = {
    missionStatement: "Equipping our members with the skills required to excel in the professional engineering industry through real world experience with cutting-edge spaceflight research and spacecraft development",

    aboutUs: "Founded in January 2024, WashU Satellite is the university's only space mission engineering team. Consisting of physics majors, electrical, systems, computer, software and mechanical engineers, we represent many disciplines in the McKelvey School of Engineering. We also present opportunities for those with non-technical specialties to participate in communications, graphic design, and more. In Fall of 2024, we successfully grew our team from 12 members to more than 40, bringing in talent from all schools and grades, including graduate students.",
};
