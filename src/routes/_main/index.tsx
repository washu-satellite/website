"use client";

import Divider from "@/components/Divider";
import NavBar from "@/components/NavBar";
import Photo from "@/components/Photo";
import ProjectHighlight from "@/components/ProjectHighlight";

// @ts-ignore
import Button, { ArrowButton } from "@/components/Button";
import { HomepageContent } from "@/const/content/homepage";
import { ProjectHighlightData } from "@/const/content/projects";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";

import { FaVideo } from "react-icons/fa6";

import { motion, MotionValue, useScroll, useTransform } from 'motion/react';
import { IoIosArrowDown } from "react-icons/io";
import Projects, { AboutUs, CubeSat, PastProjects } from "@/components/Projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_main/')({
  component: HomePage,
})

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 0.8, 1], [0, -distance, -distance])
}

function HomePage() {
  const { theme } = { theme: 'dark' };

  const content = HomepageContent;

  const highlights = ProjectHighlightData;

  const { scrollYProgress } = useScroll();

  const y = useParallax(scrollYProgress, 300);

  return (
    <div className={"flex-1 overflow-x-hidden"}>
      <NavBar />
      <main className={`text-text-dark`}>
        <div className={`fixed top-0 w-full h-full bg-black`} />
        {/* <div className="fixed w-full h-[30rem] top-0">
          <Image
            className="w-full h-[44rem] xl:h-[60rem]"
            alt=""
            src={bgSat}
            placeholder='blur'
            style={{
              objectFit: 'cover'
            }}
          />
        </div> */}
        <div
          className="absolute top-0 hidden md:block w-full h-[56rem] overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: 'cover'
            }}
          >
            <source rel="preload" src="/sat.mp4" type='video/mp4' />
          </video>
        </div>
        <div className="fixed top-[4rem] block md:hidden w-full h-[40rem] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: 'cover'
            }}
          >
            <source src="satBlock.mp4" type='video/mp4' />
          </video>
        </div>
        <div className="absolute w-full top-[8rem] lg:top-[12rem]">
          <div className="flex flex-col pl-0 lg:pl-[4rem] w-full items-center lg:items-start text-center md:text-left">
            <h2 className="font-semibold font-mono text-dark text-3xl text-[#d1d1d1]">
              STUDENT-DEVELOPED
            </h2>
            <h1 className="font-bold font-sans text-6xl md:text-8xl bg-gradient-to-bl from-[#e33737] to-[#d34343] bg-clip-text text-transparent">
              SATELLITES
            </h1>
          </div>
        </div>
        {/* <div className="absolute top-[10rem] -right-[16rem]  md:-right-[8rem] xl:right-[8rem] rotate-12">
          <video width={700} height={700} autoPlay muted loop>
            <source src="vector.webm" type='video/webm'/>
          </video>
        </div> */}
        <div className={clsx(
          `relative bg-bg border-bg-highlight border-t-[1px] mt-[36rem] md:mt-[54rem]`
        )}>
          <div
            className="flex flex-col px-2 md:px-8 lg:px-24 gap-8 relative pb-[4rem]"
          >
            <div
              style={{ backgroundImage: `url("/dots.svg")`, backgroundSize: "100px", backgroundPositionX: 0 }}
              className="absolute z-0 left-0 top-0 w-[10rem] opacity-60 h-full bg-repeat-y"
            />
            <motion.div
              className="flex flex-row gap-2 text-[#e9e9e9] items-center absolute -top-[4rem] left-24 p-1 px-2 m-1 font-mono bg-black rounded-md text-sm font-normal"
              initial={{ opacity: 1, y: 0 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.1, 1], [1, 0, 0]),
                y: useTransform(scrollYProgress, [0, 0.1, 1], [0, -50, -50])
              }}
            >
              <FaVideo />
              <span>VECTOR Model Render</span>
            </motion.div>
            <div className="flex-1 flex flex-col">
              <div className={"flex flex-row mt-[3rem] gap-0 md:gap-[4rem] justify-center items-center"}>
                <p className={`italic text-center font-medium bg-gradient-to-bl from-[#e1e0e0] to-[#9a9999] w-[60rem] my-[2rem] bg-clip-text text-transparent text-xl`}>
                  {content.missionStatement}
                </p>
              </div>

              <motion.div
                transition={{ delay: 0.3, duration: 0.3 }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={'visible'}
                variants={{
                  visible: { opacity: 1, x: 0 }
                }}
                className={clsx(
                  "shadow-md dark:shadow-none",
                  `rounded-md bg-fg border-bg-highlight border-[1px]`,
                  "relative flex flex-row flex-wrap xl:flex-nowrap font-mono items-start justify-between mt-[3rem]"
                )}
              >
                <div className={`flex flex-col items-start justify-between font-sans p-8 gap-2`}>
                  <h2 className="font-semibold font-mono text-text-hover text-3xl">THE TEAM</h2>
                  <p className={"text-lg font-normal max-w-[60rem] mb-2"}>
                    {content.aboutUs}
                  </p>
                  <ArrowButton
                    href="/team"
                    text="Meet the team"
                  />
                </div>

                <Photo src={"/balloon.png"} right>
                  <p className="p-1 px-2 m-1 bg-black bg-opacity-50 rounded-md text-sm text-[#eeeeee] font-semibold">SP24 Team Photo</p>
                </Photo>
              </motion.div>

              <h2 className="font-semibold text-5xl text-text font-mono text-center mt-[6rem]">PROJECTS</h2>

              <div className={"flex flex-row flex-wrap items-center gap-y-[4rem] gap-x-[2rem]"}>
                {highlights.filter(p => p.phase !== 'success').map((p, i) => (
                  <ProjectHighlight
                    {...p}
                    direction={i % 2 === 0 ? 'right' : 'left'}
                  />
                ))}
              </div>

              <h2 className="font-semibold text-5xl text-text font-mono text-center mt my-[6rem]">PAST PROJECTS</h2>

              <div className={"flex flex-col gap-[4rem]"}>
                {highlights.filter(p => p.phase === 'success').map((p, i) => (
                  <ProjectHighlight
                    {...p}
                    key={p.id}
                    direction={i % 2 === 0 ? 'right' : 'left'}
                  />
                ))}
              </div>
            </div>
            </div>
          </div>
      </main>
    </div>
  );
}
