import { getColors } from '@/const/theme';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { UrlObject } from 'url';

export default function ThemedLink(props: PropsWithChildren<{ href: string | UrlObject }>) {
    const colors = getColors();
    
    return (
        <Link
            className={`text-[${colors.text}] hover:text-[${colors.textHover}]`}
            href={props.href}
        >
            {props.children}
        </Link>
    )
}