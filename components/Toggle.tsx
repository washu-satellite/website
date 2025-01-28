"use client";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useState } from "react";

type ToggleProps = {
    elements: string[],
    setActive: (a: number) => void,
    default?: number
}

export default function Toggle(props: ToggleProps) {
    const [active, setActive] = useState(props.default??0);

    const { theme } = useTheme();

    return (
        <div className={clsx(
            `bg-fg border-bg-highlight p-[2px]`,
            "flex flex-row rounded-full"
        )}>
            {props.elements.map((e, i) => (
                <button
                    className={clsx(
                        theme === 'light' && i === active ? "shadow-md" : "",
                        i === active ? `bg-fg border-inherit border-[1px]` : "border-none",
                        `text-sm font-semibold text-text p-1 px-4 rounded-full`
                    )}
                    onClick={() => { setActive(i); props.setActive(i) }}
                >
                    {e}
                </button>
            ))}
        </div>
    )
}