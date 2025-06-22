import { useScrollPos } from '@/util/ui';
import clsx from 'clsx';
import useTheme from "@/hooks/useTheme";
import { AnchorHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { UrlObject } from 'url';
import { Link } from '@tanstack/react-router';

type ThemedLinkProps = { 
    href: string,
    className?: string,
    arrowLink?: boolean,
    headerLink?: boolean
}

export function TextLink(props: React.ComponentProps<typeof Link> & { linkVariant?: 'accent' | 'regular' }) {
    return (
        <Link className={`${props.linkVariant === 'regular' ? "text-text-secondary" : "text-accent-red hover:text-accent-red-hover"} hover:underline`} {...props}>{props.children}</Link>
    );
}

export default function ThemedLink(props: PropsWithChildren<ThemedLinkProps>) {
    const {theme} = useTheme();

    const scroll = useScrollPos();

    return (
        <div>
            <Link
                className={clsx(
                    props.headerLink ? ( theme === 'light' ? "bg-[rgba(221,221,221,0)] hover:bg-[rgba(221,221,221,1)]" : "bg-[rgba(0,0,0,0)] hover:bg-[rgba(0,0,0,1)]" ) : "",
                    props.headerLink ? "bg-left-bottom bg-gradient-to-r from-[#b3281e] to-[#d1352a] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40" : "",
                    `group flex flex-row items-center transition-all duration-300 ease-out cursor-pointer text-text hover:text-text-hover`,
                    props.className
                )}
                to={props.href}
            >
                {props.children}
                {props.arrowLink &&
                    <FaArrowRightLong className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[6px] transition-transform duration-300"/>
                }
            </Link>
        </div>
    )
}