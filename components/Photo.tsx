import { getTheme } from "@/const/theme";
import clsx from "clsx";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from 'next/image';
import { PropsWithChildren } from "react";

export default function Photo(props: PropsWithChildren<{ src?: string | StaticImport, right?: boolean, classes?: string }>) {
    const theme = getTheme();
    
    return (
        <div className={clsx(
            "shrink-0 relative rounded-md font-mono w-full h-[30rem] xl:w-[20rem] md:h-[20rem]",
            `bg-fg-hover border-r-0 border-bg-highlight ${props.right ? "xl:border-l-[1px] xl:rounded-l-none" : "xl:border-r-[1px] xl:rounded-r-none"}`,
            props.classes
        )}>
            {props.src && <Image fill src={props.src} alt={""} className={clsx(
                theme === 'light' ? "opacity-100" : "opacity-90",
                props.right ? "xl:rounded-l-none" : "xl:rounded-r-none",
                "rounded-md w-full h-[30rem] xl:w-[20rem] md:h-[20rem] object-cover"
            )}/>}
            <div className={"absolute bottom-0"}>
                {props.children}
            </div>
        </div>
    );
}