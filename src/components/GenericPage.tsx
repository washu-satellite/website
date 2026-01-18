import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export default function GenericPage(props: React.PropsWithChildren<{
    title: string,
    headerContent?: ReactNode
}>) {
    return (
        <div className="flex-1">
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            <div className={cn(
                `bg-bg border-border border-t`,
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div
                    style={{
                        backgroundImage: `url("/dotsh.svg")`,
                        backgroundSize: "20rem"
                    }}
                    className="absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60"
                />
                <div className={`flex z-10 flex-col items-center gap-8 justify-center max-w-[40rem] bg-background border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
                    <h1 className={`text-accent-red text-center font-mono font-semibold text-5xl md:text-6xl uppercase`}>{props.title}</h1>
                    <div className="text-foreground/80 w-full">
                        {props.headerContent}
                    </div> 
                </div>
                <div className='relative w-full'>
                    {props.children}
                </div>
            </div>
        </div>
    );
}