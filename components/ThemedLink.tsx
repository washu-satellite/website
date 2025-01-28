import { getTheme } from '@/const/theme';
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
        <Link
            className={clsx(
                theme === 'light' ? "bg-[#dddddd]" : "bg-black",
                `text-text hover:text-text-hover px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40`
            )}
            href={props.href}
        >
            {props.children}
        </Link>
    )
}