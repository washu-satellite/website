"use client";

import Divider from "@/components/Divider";
import Heading from "@/components/Heading";
import NavBar from "@/components/NavBar";
import Photo from "@/components/Photo";
import ProjectHighlight from "@/components/ProjectHighlight";
import { Projects } from "@/const/data";
import { getColors } from "@/const/theme";
import React from "react";
import Image from 'next/image';

import cubeSat from "./cube.svg";

export default function Home() {
  const colors = getColors();

  return (
    <div className={"flex-1"}>
      <NavBar/>
      <main className={`text-[${colors.textDark}]`}>
        <div className={"w-full h-[20rem] bg-[#1A1F27]"}/>
        <div className={"flex flex-col mx-8 lg:mx-24 gap-8"}>
          <div className={"flex flex-row mt-[3rem] gap-0 md:gap-[4rem] justify-center items-center"}>
            <div className={"hidden md:block w-[12rem]"}><Divider/></div>

            <p className={`italic text-center font-semibold w-[60rem] text-lg`}>
              Equipping our members with the skills and experience required to work in the professional engineering industry through real world experience working on spacecraft while pushing the envelope of space-based research with cutting-edge research.
            </p>

            <div className={"hidden md:block w-[12rem]"}><Divider/></div>
          </div>
          <div className={"flex flex-row justify-center gap-4 items-center"}>
            <div className={"w-full block md:hidden"}><Divider/></div>
            <Image src={cubeSat.src} alt={""} width={30} height={30}/>
            <div className={"w-full block md:hidden"}><Divider/></div>
          </div>

          <div className={"flex flex-row flex-wrap xl:flex-nowrap font-mono items-center gap-8 justify-between mt-[3rem]"}>
            <div className={"flex flex-row flex-wrap xl:flex-nowrap gap-4 xl:gap-14 items-center"}>
              <h2 className={"font-bold text-4xl text-center xl:text-left"}>
                About<br className={"hidden xl:block"}/> Us
              </h2>

              <div className={`pt-8 border-t-[2px] xl:border-l-[2px] xl:border-t-0 xl:pl-8 xl:pt-0  border-[${colors.textAlt}]`}>
                <p className={"text-lg max-w-[60rem]"}>
                  Founded in December 2023, WashU Satellite, is the university’s only space mission engineering team. Consisting of physics majors, electrical, systems, computer, software and mechanical engineers, we represent many disciplines in the McKelvey School of Engineering. We also present opportunities for those with non-technical specialties to participate in communications, graphic design, and more. In Fall of 2024 we successfully grew our team from 12 members to more than 40, bringing in talent from all schools and grades, including graduate students.
                </p>
              </div>
            </div>

            <Photo src={""}>
              <p>Team Photo</p>
            </Photo>
          </div>

          <Heading>
            Current Projects
          </Heading>

          <div className={"flex flex-col gap-[10rem]"}>
            {Projects.filter(p => p.phase !== 'success').map((p, i) => (
              <ProjectHighlight
                {...p}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          <Heading>
            Completed Projects
          </Heading>

          <div className={"flex flex-col gap-[10rem]"}>
            {Projects.filter(p => p.phase === 'success').map((p, i) => (
              <ProjectHighlight
                {...p}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
