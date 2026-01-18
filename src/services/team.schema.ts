import { projectIconEnum } from "@/lib/db/schema";
import z from "zod";

export const TeamSchema = z.object({
    id: z.string().trim().optional().nullable(),
    name: z.string().trim(),
    description: z.string().trim()
        .max(2000, { error: "Description cannot be longer than 2000 characters" })
        .optional().nullable(),
    applicationUrl: z.url().trim().optional().nullable()
});

export type Team = z.infer<typeof TeamSchema>;

export const RoleSchema = z.object({
    id: z.string().trim().optional().nullable(),
    name: z.string(),
    rank: z.number(),
    projectId: z.string(),
    userId: z.string().optional().nullable(),
    reportsTo: z.string().optional().nullable(),
});

export type Role = z.infer<typeof RoleSchema>;

export const ProjectSchema = z.object({
    id: z.string().trim().optional().nullable(),
    name: z.string().trim(),
    acronym: z.string().trim(),
    description: z.string().trim()
        .max(2000, { error: "Description cannot be longer than 2000 characters" })
        .optional().nullable(),
    descriptionShort: z.string().trim()
        .max(200, { error: "Short description cannot be longer than 200 characters" })
        .optional().nullable(),
    icon: z.enum(projectIconEnum.enumValues).default("empty").nonoptional(),
});

export type Project = z.infer<typeof ProjectSchema>;