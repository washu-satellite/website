import { getColors } from "@/const/theme"
import clsx from "clsx";
import { PropsWithChildren } from "react";
import Image from 'next/image';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Photo(props: PropsWithChildren<{ src?: string | StaticImport, right?: boolean, classes?: string }>) {
    const colors = getColors();
    
    return (
        <div className={clsx(
            "shrink-0 relative rounded-md font-mono w-full h-[30rem] xl:w-[20rem] md:h-[20rem]",
            `bg-[${colors.fgHover}] border-r-0 border-[${colors.bgHighlight}] ${props.right ? "xl:border-l-[1px]" : "xl:border-r-[1px]"}`,
            props.classes
        )}>
            {props.src && <Image fill src={props.src} alt={""} className={"rounded-md w-full h-[30rem] xl:w-[20rem] md:h-[20rem] object-cover"}/>}
            <div className={"absolute bottom-0"}>
                {props.children}
            </div>
        </div>
    );
}