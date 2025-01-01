import React, { PropsWithChildren } from "react";
import Divider from "./Divider";

export default function Heading(props: PropsWithChildren) {
    return (
        <div className={"flex flex-col md:flex-row font-mono mt-[3rem] gap-4 md:gap-[4rem] justify-center items-start md:items-center md:mt-16 md:mb-8"}>
            <div className={"w-full hidden md:block"}><Divider/></div>
            <h2 className={"grow font-bold text-4xl"}>
                {props.children}
            </h2>
            <Divider/>
        </div>
    );
};