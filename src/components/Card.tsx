import { cn } from "@/lib/utils";
import React from "react";

export default function Card(props: React.PropsWithChildren<{}>) {
    return (
        <div className={cn(
            "relative border border-border bg-background rounded-md flex flex-col justify-between p-8 gap-8 overflow-hidden shadow-sm dark:shadow-none"
        )}>
            <div className="absolute top-0 right-0 w-full h-20 bg-[url(/circle.svg)] bg-center bg-repeat bg-size-[1rem] opacity-10 -ml-5 -mb-1.5"/>
            <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-bl from-background/0 via-background to-background"/>
            {props.children}
        </div>
    );
}