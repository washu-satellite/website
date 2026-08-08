import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export type BgPosition = 'left' | 'right' | 'center';

export const BG_POSITION: Record<BgPosition, { justify: string; translate: string }> = {
    left:   { justify: "justify-start",  translate: "-translate-x-[15%]" },
    right:  { justify: "justify-end",    translate: "translate-x-[15%]"  },
    center: { justify: "justify-center", translate: "translate-x-0"      },
};

export default function GenericPage(props: React.PropsWithChildren<{
    title: string,
    headerContent?: ReactNode,
    /** Optional decorative image rendered as a faded backdrop. */
    backgroundImage?: string,
    /** Scroll-scrubbed frame sequence, used instead of backgroundImage. */
    backgroundFrames?: ReactNode,
    /** Where to anchor the backdrop horizontally. Default "right". */
    backgroundPosition?: BgPosition,
}>) {
    const pos = BG_POSITION[props.backgroundPosition ?? "right"];
    // The tall offset exists so the title card floats over a backdrop. Pages
    // without one (Newsletter, Sponsors, Shop, …) were paying 20rem of empty
    // scroll for a backdrop that is not there, which is why their headers
    // appeared to start halfway down the page.
    const hasBackdrop = Boolean(props.backgroundFrames || props.backgroundImage);

    return (
        <div className="flex-1">
            <div className={`fixed top-0 w-full h-full bg-bg-blue`}/>
            {props.backgroundFrames}
            {!props.backgroundFrames && props.backgroundImage && (
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
                hasBackdrop ? "mt-[20rem]" : "mt-[13rem]",
                "z-10 relative flex flex-col items-center justify-center gap-16 pb-[4rem] px-4"
            )}>
                <div className="dots-header absolute top-1 w-full z-0 h-[8rem] bg-repeat-x opacity-60" />
                <div className={cn(
                    "flex z-10 w-full max-w-[40rem] min-w-0 md:min-w-[30rem] flex-col items-center gap-8 justify-center bg-background border-inherit border-[1px] p-8 rounded-md",
                    hasBackdrop ? "-mt-[10rem]" : "-mt-[9rem]",
                )}>
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