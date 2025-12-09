import useTheme from "@/hooks/useTheme";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export default function Photo(props: PropsWithChildren<{ src?: string, right?: boolean, className?: string }>) {
    const {theme} = useTheme();
    
    return (
        <div className={clsx(
            "shrink-0 relative rounded-md font-mono w-full h-[30rem] xl:w-[20rem] md:h-[20rem]",
            `bg-fg border-r-0 border-bg-highlight ${props.right ? "xl:rounded-l-none" : "xl:border-r-[1px] xl:rounded-r-none"}`,
            props.className
        )}>
            {props.src && <img src={props.src} alt={""} className={clsx(
                theme === 'light' ? "opacity-100" : "opacity-90",
                props.right ? "xl:rounded-l-none" : "xl:rounded-r-none",
                "rounded-md w-full h-[30rem] xl:w-[20rem] md:h-[20rem] object-cover"
            )}/>}
            <div className={"absolute bottom-0 right-0"}>
                {props.children}
            </div>
        </div>
    );
}