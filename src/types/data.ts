import { CSSProperties, ReactNode } from "react";

export type ProjectData = NavElement & {
    description: string,
    contributors: number,
    date: string,
    phase: 'success' | 'assembly' | 'design' | 'prototyping' | 'proposal',
    posterUrl?: string,
    image?: string,
    /** Where to anchor the background render. Default "right". */
    imagePosition?: 'left' | 'right' | 'center',
    imageSize?: string | number,
    gridImage?: string,
    gridProps?: CSSProperties
};

export type NavElement = {
    id: string,
    title: string,
    url?: string,
    icon?: ReactNode,
    short?: string
};

export type SpecRow = { label: string; value: string };
export type ProseSection = { heading: string; body: string };

export type ProjectPageType = {
    project: ProjectData,
    /** Italic one-liner shown under the title. */
    tagline?: string,
    /** Top fact sheet (Launch Date, Platform, etc.). */
    factSheet?: SpecRow[],
    /** Ordered prose sections — heading + body, rendered as h2 + paragraph. */
    sections?: ProseSection[],
    /** Bullet list rendered under "Scientific Objectives". */
    objectives?: { title: string; description: string }[],
    /** Engineering callouts rendered as cards. */
    engineering?: { title: string; description: string }[],
    /** Hardware specs / numbers, rendered as a key/value table. */
    specs?: SpecRow[],
    /** Subteam pills. */
    modules?: string[],
    /** Schedule rows. */
    schedule?: SpecRow[],
    /** Free-form acknowledgments paragraph. */
    acknowledgments?: string,
    // legacy fields, kept so existing entries still compile
    overview: string,
    disciplineOverviews: {
        title: string,
        description: string
    }[]
};

export type MissionKey = string;

export type Person = {
    name: string,
    title: string,
    email?: string,
    avatar?: string,
    linkedin?: string,
    credits?: MissionKey[]
};