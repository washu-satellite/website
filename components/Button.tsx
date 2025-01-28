import Link from 'next/link';
import { PropsWithChildren } from "react";
import { UrlObject } from "url";

type ButtonProps = {
    style?: 'red' | 'clear',
    color?: string,
    hoverColor?: string,
    textColor?: string,
    isLink?: boolean,
    href?: string | UrlObject,
    disabled?: boolean,
    onClick?: () => void
}

const getStyle = (style: ButtonProps['style']) => {
    switch (style) {
        case 'red':
            return "bg-accent-red hover:bg-accent-red-hover text-white";
        case 'clear':
            return "bg-none hover:bg-fg-hover border-text-dark border-[1px]";
        default:
            return "bg-text hover:bg-text-hover text-bg border-bg ";
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

    const style = `font-sans p-1 px-4 rounded-md font-medium ${props.disabled ? "cursor-not-allowed opacity-30" : ""} ${spec}`;
    
    return props.isLink ? (
        <Link
            className={style}
            href={props.href??""}
        >
            {props.children}
        </Link>
    ) : (
        <button
            className={style}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};