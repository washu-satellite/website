import { darkTheme, getColors } from "@/const/theme";
import { PropsWithChildren } from "react"
import { UrlObject } from "url";
import Link from 'next/link';

type ButtonProps = {
    style?: 'red' | 'clear',
    color?: string,
    hoverColor?: string,
    textColor?: string,
    isLink?: boolean,
    href?: string | UrlObject,
    onClick?: () => void
}

const getStyle = (style: ButtonProps['style'], colors: typeof darkTheme) => {
    switch (style) {
        case 'red':
            return {
                color: colors.accentRed,
                hoverColor: colors.accentRedHover,
                textColor: colors.text
            }
        case 'clear':
            return {
                color: 'none',
                hoverColor: colors.fgHover,
                textColor: colors.textDark,
                borderColor: colors.textDark
            }
        default:
            return {
                color: colors.text,
                hoverColor: colors.textHover,
                textColor: colors.bg
            }
    }
};

export const EmailButton = (props: { text: string, href: string }) => {
    const colors = getColors();

    return (
        <Link className={`rounded-full font-mono px-4 py-1 hover:bg-[${colors.fgHover}] border-[${colors.bgHighlight}] border-[1px]`} href="/">
            {props.text}
        </Link>
    );
}

export default function Button(props: PropsWithChildren<ButtonProps>) {
    const colors = getColors();

    const { color, hoverColor, textColor, borderColor } = getStyle(props.style, colors);

    const style = `font-sans p-1 px-4 rounded-md font-semibold
    bg-[${color}] hover:bg-[${hoverColor}]
    text-[${textColor}] border-[${borderColor}] ${borderColor ? "border-[1px]" : ""}`
    
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