import { ReactNode } from "react"

export type ProjectData = {
    id: string,
    title: string,
    url: string,
    description: string,
    contributors: number,
    date: string,
    phase: 'success' | 'assembly' | 'design',
    icon?: ReactNode,
    short?: string,
    posterUrl?: string
};

export type ProjectPageType = {
    project: ProjectData,
    overview: string,
    disciplineOverviews: {
        title: string,
        description: string
    }[]
};