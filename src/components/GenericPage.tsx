import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type BgPosition = 'left' | 'right' | 'center';

const BG_POSITION: Record<BgPosition, { justify: string; translate: string }> = {
    left:   { justify: "justify-start",  translate: "-translate-x-[15%]" },
    right:  { justify: "justify-end",    translate: "translate-x-[15%]"  },
    center: { justify: "justify-center", translate: "translate-x-0"      },
};

export default function GenericPage(props: React.PropsWithChildren<{
    title: string,
    headerContent?: ReactNode,
    /** Optional decorative image rendered as a faded backdrop. */
    backgroundImage?: string,
    /** Where to anchor the backdrop horizontally. Default "right". */
    backgroundPosition?: BgPosition,
}>) {
    const pos = BG_POSITION[props.backgroundPosition ?? "right"];

    return (
        <div className="flex-1">
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            {props.backgroundImage && (
                <div
                    aria-hidden
                    className={cn(
                        "pointer-events-none fixed inset-0 z-0 flex items-center overflow-hidden",
                        pos.justify,
                    )}
                >
                    <img
                        src={props.backgroundImage}
                        alt=""
                        className={cn(
                            "w-[80rem] max-w-[110vw] opacity-50 dark:opacity-60 object-contain",
                            pos.translate,
                        )}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}
            <div className={cn(
                `border-border border-t`,
                props.backgroundImage ? "bg-transparent" : "bg-bg",
                "mt-[20rem] z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className="dots-header absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60" />
                <div className={`flex z-10 min-w-[30rem] flex-col items-center gap-8 justify-center max-w-[40rem] bg-background border-inherit border-[1px] p-8 -mt-[10rem] rounded-md`}>
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