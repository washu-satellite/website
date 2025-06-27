import clsx from 'clsx';
import type { PropsWithChildren } from "react";
import { FaArrowRightLong } from 'react-icons/fa6';

type ButtonProps = {
    style?: 'red' | 'clear',
    color?: string,
    hoverColor?: string,
    textColor?: string,
    isLink?: boolean,
    raiseHover?: boolean,
    href?: string,
    disabled?: boolean,
    onClick?: () => void
}

const getStyle = (style: ButtonProps['style']) => {
    switch (style) {
        case 'red':
            return "bg-accent-red hover:bg-accent-red-hover text-white";
        case 'clear':
            return "bg-none hover:bg-text text-text-dark border-text-dark hover:text-bg hover:border-bg border-[1px]";
        default:
            return "bg-text hover:bg-text-secondary text-bg";
    }
};

export const EmailButton = (props: { text: string, href: string }) => {
    return (
        <a className={`rounded-full font-mono px-4 py-1 hover:bg-fg-hover text-text-dark border-bg-highlight border-[1px]`} href={props.href}>
            {props.text}
        </a>
    );
}

export default function Button(props: PropsWithChildren<ButtonProps>) {
    const spec = getStyle(props.style);

    const style = clsx(
        "group cursor-pointer font-sans p-[0.4rem] px-4 rounded-md font-medium",
        props.raiseHover ? "transition delay-50 duration-300 ease-in-out hover:scale-110" : "",
        props.disabled ? "cursor-not-allowed opacity-30 disabled" : "",
        spec
    );
    
    return props.isLink ? (
        <a
            className={style}
            href={props.disabled ? "" : props.href??""}
        >
            {props.children}
        </a>
    ) : (
        <button
            className={style}
            onClick={props.disabled ? () => null : props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

type ArrowButtonProps = {
    href: string
    text: string
}

export function ArrowButton(props: ArrowButtonProps) {
    return (
        <Button
            isLink={true}
            style='clear'
            href={props.href}
        >
            <div className="flex flex-row gap-2 items-center">
                <p>{props.text}</p>
                <FaArrowRightLong className="group-hover:translate-x-[6px] transition-transform duration-300"/>
            </div>
        </Button>
    )
}