"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import RedirectCard from "@/components/RedirectCard";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute('/subscribe')({
  component: SubscribePage,
})

export default function SubscribePage() {
    return (
        <div className="flex-1">
            <NavBar/>
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={clsx(
                `bg-bg border-bg-highlight border-t-[1px]`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div
                    style={{
                        backgroundImage: `url("/dotsh.svg")`,
                        backgroundSize: "20rem"
                    }}
                    className="absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60"
                />
                <div className={`flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-bg border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl`}>INTERESTED?</h1>
                    {/* <p className={`font-medium text-text-dark`}>We'll send you quarterly emails about all of the awesome projects we're working on. For all the prospective members, we also include position openings</p> */}
                    {/* <Button isLink style='red' href={"https://app.e2ma.net/app2/audience/signup/2009107/1979383/"}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Join the email list</p>
                            <HiOutlineExternalLink />
                        </div>
                    </Button> */}
                    <p className={`font-medium text-text-dark`}>Excited by the scientific and engineering opportunities presented by WashU Satellite? Let us know! Add your response to the interest survey and we will notify you when applications are released</p>
                    <Button isLink style='red' href={"https://forms.gle/B3TbaKwG28CnDNzo7"}>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <p>Fill out the interest form</p>
                            <ExternalLink />
                        </div>
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <RedirectCard
                        title="Want more information?"
                        href={"/team"}
                        buttonText={"Meet the team"}
                    />
                    <div>
                        <RedirectCard
                            title="Ready to contribute?"
                            href={"/apply"}
                            buttonText={"Apply for a position"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}