import { cn } from "@/lib/utils";
import { useState } from "react";

export function TimelineEntry(props: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row">
      {props.children}
    </div>
  )
}

export function TimelineLine(props: {
  left?: boolean,
  right?: boolean
}) {
  return props.left ? (
    <div className="hidden md:flex flex-row items-center w-full">
      <div className="h-[2px] bg-secondary w-full mb-0.5"/>
      <div className="h-[2px] bg-secondary w-5 -mr-5 mb-0.5"/>
    </div>
  ) : (
    <div className="hidden md:flex flex-row items-center w-full">
      <div className="h-[2px] bg-secondary w-5 -ml-5 mb-0.5"/>
      <div className="h-[2px] bg-secondary w-full mb-0.5"/>
    </div>
  );
}

export function TimelineIcon(props: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-full bg-red-500/50 p-3">
        {props.children}
      </div>
      <div className="rounded-full h-16 w-[2px] bg-secondary"/>
      <div className="hidden md:block rounded-full w-2 h-2 bg-secondary -mb-[1px]"/>    
    </div>
  );
}

export function TimelineDate(props: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col items-end justify-between">
      {typeof props.children === "string" ? (
        <p className="mt-3 mr-2 pl-0 md:pl-4 text-sm text-foreground/80 text-nowrap">{props.children}</p>
      ) : (
        props.children
      )}
      <TimelineLine left/>
    </div>
  );
}

export function TimelineContent(props: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col items-start justify-between min-w-[14rem] max-w-[18rem]">
      <div className="ml-2">
        {props.children}
      </div>
      <TimelineLine right/>
    </div>
  );
}

export function Timeline(props: React.PropsWithChildren<{
    hideControls?: boolean
}>) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      
        {!props.hideControls &&
            <div className="w-full border-b border-border">
                <div className="flex flex-row w-fit divide-x divide-border border-r border-border">
                    <button
                        className="rounded-none font-mono uppercase text-xs block"
                        onClick={() => setSelected(0)}
                    >
                        <p className={cn(
                        "p-2 pb-1 hover:text-foreground",
                        {
                            "text-red-400/80": selected === 0,
                            "text-foreground/80": selected !== 0,
                        }
                        )}>Entire history</p>
                        <div
                        className={cn(
                            "w-full h-[2px] -mb-px",
                            {
                            "bg-red-500/50": selected === 0,
                            "bg-background/0": selected !== 0
                            }
                        )}
                        />
                    </button>
                    <button
                        className="rounded-none font-mono uppercase text-xs block"
                        onClick={() => setSelected(5)}
                    >
                        <p className={cn(
                        "p-2 pb-1 hover:text-foreground",
                        {
                            "text-red-400/80": selected === 5,
                            "text-foreground/80": selected !== 5,
                        }
                        )}>Role Changes</p>
                        <div
                        className={cn(
                            "w-full h-[2px] -mb-px",
                            {
                            "bg-red-500/50": selected === 5,
                            "bg-background/0": selected !== 5
                            }
                        )}
                        />
                    </button>
                    <button
                        className="rounded-none font-mono uppercase text-xs block"
                        onClick={() => setSelected(1)}
                    >
                        <p className={cn(
                        "p-2 pb-1 ",
                        {
                            "text-red-400/80": selected === 1,
                            "text-foreground/80": selected !== 1,
                        }
                        )}>SP 24</p>
                        <div
                        className={cn(
                            "w-full h-[2px] -mb-px",
                            {
                            "bg-red-500/50": selected === 1,
                            "bg-background/0": selected !== 1
                            }
                        )}
                        />
                    </button>
                    <button
                        className="rounded-none font-mono uppercase text-xs block"
                        onClick={() => setSelected(2)}
                    >
                        <p className={cn(
                        "p-2 pb-1 ",
                        {
                            "text-red-400/80": selected === 2,
                            "text-foreground/80": selected !== 2,
                        }
                        )}>FL 25</p>
                        <div
                        className={cn(
                            "w-full h-[2px] -mb-px",
                            {
                            "bg-red-500/50": selected === 2,
                            "bg-background/0": selected !== 2
                            }
                        )}
                        />
                    </button>
                </div>
            </div>
        }
      <div className="flex flex-col md:flex-row justify-start items-center p-4 w-full overflow-x-auto scrollbar py-10">
        {props.children}
      </div>
    </div>
  );
}