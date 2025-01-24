import { getColors, getTheme } from '@/const/theme';
import clsx from 'clsx';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export default function ThemedLink(props: PropsWithChildren<{ href: string | UrlObject }>) {
    const colors = getColors();

    const theme = getTheme();
    
    return (
        <Link
            className={clsx(
                theme === 'light' ? "bg-[#dddddd]" : "bg-black",
                `text-[${colors.text}] hover:text-[${colors.textHover}] px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40`
            )}
            href={props.href}
        >
            {props.children}
        </Link>
    )
}