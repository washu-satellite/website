"use client";

import Divider from "@/components/Divider";
import Heading from "@/components/Heading";
import NavBar from "@/components/NavBar";
import Photo from "@/components/Photo";
import ProjectHighlight from "@/components/ProjectHighlight";
import { Projects } from "@/const/data";
import { getColors, getTheme } from "@/const/theme";
import React from "react";
import Image from 'next/image';

// @ts-ignore
import cubeSat from "./cube.svg";
import clsx from "clsx";
import Button from "@/components/Button";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Home() {
  const colors = getColors();

  const theme = getTheme();

  return (
    <div className={"flex-1 overflow-x-hidden"}>
      <NavBar/>
      <main className={`text-[${colors.textDark}]`}>
        <div className={`fixed top-0 w-full h-full bg-[${colors.blueBg}]`}/>
        <div className="absolute -top-[2rem] -left-[14rem]">
          <video width={1000} height={1000} autoPlay muted loop>
            <source src="earth.webm" type='video/webm'/>
          </video>
        </div>
        {/* <div className="absolute top-[10rem] -right-[16rem]  md:-right-[8rem] xl:right-[8rem] rotate-12">
          <video width={700} height={700} autoPlay muted loop>
            <source src="vector.webm" type='video/webm'/>
          </video>
        </div> */}
        <div className={clsx(
          `bg-[${colors.bg}] border-[${colors.bgHighlight}] border-t-[1px]`,
          "flex flex-col px-2 md:px-8 lg:px-24 gap-8 mt-[30rem] z-10 relative pb-[4rem]"
        )}>
          <div className={"flex flex-row mt-[3rem] gap-0 md:gap-[4rem] justify-center items-center"}>
            <div className={"hidden lg:block w-[12rem]"}><Divider/></div>

            <p className={`italic text-center font-semibold w-[60rem] text-lg`}>
              Equipping our members with the skills required to excel in the professional engineering industry through real world experience with cutting-edge spaceflight research and spacecraft development while providing space access for WashU research.
            </p>

            <div className={"hidden lg:block w-[12rem]"}><Divider/></div>
          </div>
          <div className={"flex flex-row justify-center lg:hidden gap-4 items-center"}>
            <div className={"w-full lg:w-[12rem]"}><Divider/></div>
            <Image src={cubeSat.src} alt={""} width={30} height={30}/>
            <div className={"w-full lg:w-[12rem]"}><Divider/></div>
          </div>

          <div className={clsx(
            theme === 'light' ? "shadow-md" : "",
            `rounded-md bg-[${colors.fg}] border-[${colors.bgHighlight}] border-[1px]`,
            "flex flex-row flex-wrap xl:flex-nowrap font-mono items-center gap-8 justify-between mt-[3rem]"
          )}>
            <div className={"flex flex-row flex-wrap xl:flex-nowrap gap-4 xl:gap-14 items-center p-8"}>
              <h2 className={"font-bold text-3xl text-center xl:text-left"}>
                About<br className={"hidden xl:block"}/> Us
              </h2>

              <div className={`flex flex-col gap-4 items-start font-sans pt-8 border-t-[2px] xl:border-l-[2px] xl:border-t-0 xl:pl-8 xl:pt-0 border-[${colors.textAlt}]`}>
                <p className={"text-lg font-medium max-w-[60rem]"}>
                  Founded in December 2023, WashU Satellite, is the university's only space mission engineering team. Consisting of physics majors, electrical, systems, computer, software and mechanical engineers, we represent many disciplines in the McKelvey School of Engineering. We also present opportunities for those with non-technical specialties to participate in communications, graphic design, and more. In Fall of 2024 we successfully grew our team from 12 members to more than 40, bringing in talent from all schools and grades, including graduate students.
                </p>
                  <Button isLink={true} href={"/team"}>
                    <div className={"flex flex-row gap-2 items-center"}>
                        <p>Our Team</p>
                        <FaArrowRightLong />
                    </div>
                  </Button>
              </div>
            </div>

            <Photo src={""} right>
              <p className="p-2">Team Photo</p>
            </Photo>
          </div>

          {/* <Heading>
            Current Projects
          </Heading> */}

          <h1 className={`font-mono text-2xl font-bold mt-[6rem] text-[${colors.textDark}]`}>
            Active Projects
          </h1>

          <div className={"flex flex-row flex-wrap items-start gap-y-[4rem] gap-x-[2rem]"}>
            {Projects.filter(p => p.phase !== 'success').map((p, i) => (
              <ProjectHighlight
                {...p}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          {/* <Heading>
            Completed Projects
          </Heading> */}

          <h1 className={`font-mono text-2xl font-bold mt-[6rem] text-[${colors.textDark}]`}>Completed Projects</h1>

          <div className={"flex flex-col gap-[4rem]"}>
            {Projects.filter(p => p.phase === 'success').map((p, i) => (
              <ProjectHighlight
                {...p}
                key={p.id}
                direction={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
