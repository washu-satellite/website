import { CSSProperties, ReactNode } from "react";

export type ProjectData = NavElement & {
    description: string,
    contributors: number,
    date: string,
    phase: 'success' | 'assembly' | 'design' | 'prototyping' | 'proposal',
    posterUrl?: string,
    image?: string,
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

export type ProjectPageType = {
    project: ProjectData,
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