import { useScrollPos } from '@/util/ui';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export default function ThemedLink(props: PropsWithChildren<{ href: string | UrlObject }>) {
    const {theme} = useTheme();

    const scroll = useScrollPos();

    return (
        <div
            
        >
            <Link
                className={clsx(
                    theme === 'light' ? "bg-[#dddddd]" : "bg-black",
                    "bg-left-bottom bg-gradient-to-r from-[#b3281e] to-[#d1352a] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out",
                    `cursor-pointer text-text hover:text-text-hover px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40`
                )}
                href={props.href}
            >
                {props.children}
            </Link>
        </div>
    )
}