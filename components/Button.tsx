import { darkTheme, getColors } from "@/const/theme";
import { PropsWithChildren } from "react"
import { UrlObject } from "url";
import Link from 'next/link';

type ButtonProps = {
    style?: 'red',
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
        default:
            return {
                color: colors.text,
                hoverColor: colors.textHover,
                textColor: colors.bg
            }
    }
};

export default function Button(props: PropsWithChildren<ButtonProps>) {
    const colors = getColors();

    const { color, hoverColor, textColor } = getStyle(props.style, colors);

    const style = `font-sans p-1 px-4 rounded-md font-semibold
    bg-[${color}] hover:bg-[${hoverColor}]
    text-[${textColor}]`
    
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