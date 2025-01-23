import { getColors } from '@/const/theme';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export default function ThemedLink(props: PropsWithChildren<{ href: string | UrlObject }>) {
    const colors = getColors();
    
    return (
        <Link
            className={`text-[${colors.text}] hover:text-[${colors.textHover}] bg-black px-4 py-2 rounded-md bg-opacity-0 hover:bg-opacity-40`}
            href={props.href}
        >
            {props.children}
        </Link>
    )
}