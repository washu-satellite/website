import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import * as schema from "@/lib/db/schema";
import { ProjectSchema, RoleSchema, TeamSchema } from "./team.schema";
import z from "zod";
import { userRequiredMiddleware } from "./auth.api";
import { eq } from "drizzle-orm";
import { ProfileSchema } from "./auth.schema";
import { DisplayUserShortSchema } from "./user.schema";

export const listTeams = createServerFn({ method: "GET" })
    .handler(async () => {
        const teams = await db.select().from(schema.team);

        return z.array(TeamSchema).parse(teams);
    });

export const getTeam = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        name: z.string()
    }))
    .handler(async ({ data }) => {
        const team = await db.select().from(schema.team).where(eq(schema.team.name, data.name));

        return TeamSchema.parse(team[0]);
    });

export const getMembersByTeam = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        name: z.string()
    }))
    .handler(async ({ data }) => {
        const profiles = await db.select().from(schema.profile).where(eq(schema.profile.teamId, data.name));

        console.log(profiles);

        return z.array(DisplayUserShortSchema).parse(profiles.map(p => ({ ...p, memberSince: new Date(p.memberSince) })));
    });

export const createTeam = createServerFn({ method: "POST" })
    .inputValidator(TeamSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        await db.insert(schema.team).values({ ...data, id: undefined }).onConflictDoNothing();
    });

export const updateTeam = createServerFn({ method: "POST" })
    .inputValidator(TeamSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        if (!data.id) {
            throw new Error("You need to provide an id!");
        }

        await db.update(schema.team).set({ ...data, id: undefined }).where(eq(schema.team.id, data.id));
    });

export const createRole = createServerFn({ method: "POST" })
    .inputValidator(RoleSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        await db.insert(schema.role).values({ ...data, id: undefined }).onConflictDoNothing();
    });

export const updateRole = createServerFn({ method: "POST" })
    .inputValidator(RoleSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        if (!data.id)
            throw new Error("No id provided!");;

        await db.update(schema.role).set({ ...data, id: undefined }).where(eq(schema.role.id, data.id));
    });

export const createProject = createServerFn({ method: "POST" })
    .inputValidator(ProjectSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        await db.insert(schema.project).values({ ...data, id: undefined }).onConflictDoNothing();
    });

export const updateProject = createServerFn({ method: "POST" })
    .inputValidator(ProjectSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        if (!data.id)
            throw new Error("No id provided!");;

        await db.update(schema.project).set({ ...data, id: undefined }).where(eq(schema.project.id, data.id));
    });

export const listProjects = createServerFn({ method: "GET" })
    .handler(async () => {
        return await db.select().from(schema.project);
    });

export const getProject = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        acronym: z.string()
    }))
    .handler(async ({ data }) => {
        const project = (await db.select().from(schema.project).where(eq(schema.project.acronym, data.acronym)))[0];

        return ProjectSchema.parse(project);
    });

export const getRolesByProject = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        id: z.string()
    }))
    .handler(async ({ data }) => {
        return await db.select().from(schema.role).where(eq(schema.role.projectId, data.id));
    });

export const getRolesByUser = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        id: z.string()
    }))
    .handler(async ({ data }) => {
        return await db.select().from(schema.role).where(eq(schema.role.userId, data.id));
    });

export const listRoles = createServerFn({ method: "GET" })
    .handler(async () => {
        return await db.select().from(schema.role);
    });

export const getRole = createServerFn({ method: "GET" })
    .inputValidator(z.object({
        id: z.string()
    }))
    .handler(async ({ data }) => {
        const role = (await db.select().from(schema.role).where(eq(schema.role.id, data.id)))[0];

        return RoleSchema.parse(role);
    });

export const deleteRole = createServerFn({ method: "POST" })
    .inputValidator(z.object({
        id: z.string()
    }))
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        await db.delete(schema.role).where(eq(schema.role.id, data.id));
    });

export const deleteTeam = createServerFn({ method: "POST" })
    .inputValidator(z.object({
        name: z.string()
    }))
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }
        
        await db.delete(schema.team).where(eq(schema.team.name, data.name));
    });

export const deleteProject = createServerFn({ method: "POST" })
    .inputValidator(z.object({
        acronym: z.string()
    }))
    .middleware([userRequiredMiddleware])
    .handler(async ({ data, context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this action!");
        }

        await db.delete(schema.project).where(eq(schema.project.acronym, data.acronym));
    });
