import { useScrollPos } from '@/util/ui';
import clsx from 'clsx';
import useTheme from "@/hooks/useTheme";
import { AnchorHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { UrlObject } from 'url';
import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
    return (
        <Button variant='ghost' asChild>
            <Link
                className={cn(
                    {
                        "bg-left-bottom bg-gradient-to-r from-[#b3281e] to-[#d1352a] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40": props.headerLink
                    },
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
        </Button>
    )
}