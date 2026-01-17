"use client";

import NavBar from "@/components/NavBar";
import Photo from "@/components/Photo";
import ProjectHighlight from "@/components/ProjectHighlight";

// @ts-ignore
import Button, { ArrowButton } from "@/components/Button";
import { HomepageContent } from "@/const/content/homepage";
import { ProjectHighlightData } from "@/const/content/projects";
import clsx from "clsx";
import { FaArrowRightLong } from "react-icons/fa6";

import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { Antenna, Balloon, BookUp, NotebookText, Rocket, Video } from "lucide-react";
import RedirectButton from "@/components/RedirectButton";
import Card from "@/components/Card";
import { bStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import { Timeline, TimelineDate, TimelineIcon, TimelineContent, TimelineEntry } from "@/components/Timeline";

export const Route = createFileRoute('/')({
  component: HomePage,
});

function DividerHeading(props: React.PropsWithChildren<{
  index: number
}>) {
  return (
    <h2 className="relative bg-background text-foreground/40 dark:bg-background/0 shadow-sm dark:shadow-none w-screen border-y border-secondary -ml-[4rem] text-center py-4 font-mono font-light text-5xl z-10 uppercase">
      {props.children}
      <span className="absolute left-0 text-foreground/20 bg-deep-background/20 backdrop-blur-lg">0{props.index}</span>
    </h2>
  );
}

const bannerTextLoop = ["satellites", "science balloons", "interfaces", "earth stations"];

function BannerText() {
  const [bannerTextIndex, setBannerTextIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    console.log("triggering useEffect");

    let subtimer: NodeJS.Timeout | undefined = undefined;

    const timer = setInterval(() => {
      setAnimate(true);
      subtimer = setTimeout(() => {
        setAnimate(false);
        setBannerTextIndex(t =>  (t + 1) % bannerTextLoop.length);
      }, 700);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(subtimer);
    }
  }, []);

  return (
    <div className="block md:p-0 md:absolute w-full top-[8rem] lg:top-[12rem]">
        <div className="flex flex-col lg:pl-[4rem] mt-16 md:mt-0 mb-8 md:mb-0 w-full items-center lg:items-start text-center md:text-left">
          <h2 className="font-light font-mono lowercase text-lg md:text-xl text-white/40 z-10 bg-[#111]/50 inset-shadow-current/15 inset-shadow-sm backdrop-blur-3xl border border-[#222] rounded-xl px-4 py-1">
            Student-developed
          </h2>
          <div
            className={cn(
              "font-black text-white text-5xl md:text-8xl",
              "overflow-hidden text-nowrap lowercase transition-all duration-500 ease-in-out flex flex-row justify-center lg:justify-start",
              {
                "w-0": animate,
                "w-full": !animate
              }
            )}
          >
            <h1
              className="bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.blue.300),theme(colors.blue.100),theme(colors.blue.100),theme(colors.blue.300))] bg-[length:200%_auto] bg-[position:0%_center] w-fit animate-banner-gradient drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            >
              {bannerTextLoop[bannerTextIndex]}
            </h1>
          </div>
        </div>
      </div>
  )
}

function Banner() {
  return (
    <>
      <div
        className="absolute top-0 hidden md:block w-full h-screen overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          preload="none"
          poster="/sat.webp"
          style={{
            width: "100%",
            height: "100%",
            objectFit: 'cover'
          }}
        >
          <source src="/sat.mp4" type='video/mp4' />
        </video>
      </div>
      <div className="h-full md:h-screen"/>
      <BannerText />
      <div
        className="flex flex-row gap-2 text-[#e9e9e9] items-center absolute bottom-4 left-[4rem] p-1 px-2 m-1 font-mono bg-black/50 backdrop-blur-md rounded-sm text-sm font-normal border border-border"
      >
          <Video className="w-4 h-4"/>
          <span className="uppercase text-xs">VECTOR Model Render</span>
      </div>
    </>
  );
}

function TeamIntro() {
  return (
    <>
      <div className="block md:flex flex-row justify-between flex-wrap">
        <div className="flex w-full md:w-2/3 flex-col pr-0 md:pr-8">
          <div className={"flex flex-row my-8 gap-0 md:gap-[4rem] justify-center items-center"}>
            <p className={`italic text-center font-medium bg-gradient-to-bl from-[#e1e0e0] to-[#9a9999] w-[60rem] bg-clip-text text-transparent text-lg`}>
              {HomepageContent.missionStatement}
            </p>
          </div>

          <div className="pl-0 md:pl-8">
            <Card>
              <div className="font-sans space-y-2 z-10">
                <h2 className="font-semibold text-foreground text-xl">Who are we?</h2>
                <p className={"font-normal mb-2 text-foreground/80 pb-2"}>
                  {HomepageContent.aboutUs}
                </p>
                <RedirectButton
                  text="Meet the team"
                  href="/team"
                />
              </div>
            </Card>
          </div>
        </div>



        <div className="relative flex-1 flex flex-row justify-center items-center border-l-0 md:border-l border-border bg-[repeating-linear-gradient(45deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.secondary)]">
          <img src={"/balloon.png"} className="w-[26rem] object-cover rounded-md p-8"/>
          <p className="absolute bottom-2 right-2 font-mono text-xs uppercase text-foreground/60">SP24 Team Photo</p>
        </div>
      </div>
    </>
  );
}

function HomePage() {
  console.log("index rerender");

  return (
    <div className={"flex-1 overflow-x-hidden"}>
      <main>
        <Banner />
        <div className={clsx(
          `relative border-t border-border bg-deep-background`
        )}>
          <div
            className="flex flex-col px-2 md:px-4 lg:px-[4rem] gap-8 relative"
          >
            <div className="border-border md:border-x pb-8">
              <div
                style={{ backgroundImage: `url("/dots.svg")`, backgroundSize: "100px", backgroundPositionX: 0 }}
                className="hidden dark:block absolute z-0 left-0 top-0 w-[10rem] opacity-60 h-full bg-repeat-y"
              />
              <div className="flex-1 flex flex-col">
                <TeamIntro />

                <DividerHeading index={1}>
                  Timeline
                </DividerHeading>

                <Timeline hideControls>
                  <TimelineEntry>
                    <TimelineDate>
                      Jan 2024
                    </TimelineDate>
                    <TimelineIcon>
                      <Rocket className="w-6 h-6"/>
                    </TimelineIcon>
                    <TimelineContent>
                      <h5>Getting started</h5>
                      <p className="text-sm text-foreground/80">Club is founded with 11 initial members</p>
                    </TimelineContent>
                  </TimelineEntry>
                  <TimelineEntry>
                    <TimelineDate>
                      Apr 2024
                    </TimelineDate>
                    <TimelineIcon>
                      <Balloon className="w-6 h-6"/>
                    </TimelineIcon>
                    <TimelineContent>
                      <h5>First mission</h5>
                      <p className="text-sm text-foreground/80">Small balloon mission "SB-1" is developed and launched in Tisch Park</p>
                    </TimelineContent>
                  </TimelineEntry>
                  <TimelineEntry>
                    <TimelineDate>
                      Aug 2024
                    </TimelineDate>
                    <TimelineIcon>
                      <NotebookText className="w-6 h-6"/>
                    </TimelineIcon>
                    <TimelineContent>
                      <h5>Team Procedures</h5>
                      <p className="text-sm text-foreground/80">Important standards including engineering design reviews, budgets, responsible engineering, and more are formalized</p>
                    </TimelineContent>
                  </TimelineEntry>
                  <TimelineEntry>
                    <TimelineDate>
                      Oct 2024
                    </TimelineDate>
                    <TimelineIcon>
                      <Antenna className="w-6 h-6"/>
                    </TimelineIcon>
                    <TimelineContent>
                      <h5>GS-1 PDRs</h5>
                      <p className="text-sm text-foreground/80">Preliminary design reviews for the first ground station are passed</p>
                    </TimelineContent>
                  </TimelineEntry>
                </Timeline>

                <DividerHeading index={2}>
                  Projects
                </DividerHeading>

                <div className={"flex flex-row flex-wrap items-center gap-y-[4rem] gap-x-[2rem] -mt-32 p-8"}>
                  {ProjectHighlightData.filter(p => p.phase !== 'success').map((p, i) => (
                    <ProjectHighlight
                      key={i}
                      {...p}
                      direction={i % 2 === 0 ? 'right' : 'left'}
                    />
                  ))}
                </div>

                <DividerHeading index={3}>
                  Past Projects
                </DividerHeading>

                <div className={"flex flex-col gap-[4rem] p-8"}>
                  {ProjectHighlightData.filter(p => p.phase === 'success').map((p, i) => (
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
        </div>
      </main>
    </div>
  );
}
