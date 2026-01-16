import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import * as schema from "@/lib/db/schema";
import { TeamSchema } from "./team.schema";
import z from "zod";
import { userRequiredMiddleware } from "./auth.api";

export const listTeams = createServerFn({ method: "GET" })
    .handler(async () => {
        const teams = await db.select().from(schema.team);

        return z.array(TeamSchema).parse(teams);
    });

export const createTeam = createServerFn({ method: "GET" })
    .inputValidator(TeamSchema)
    .middleware([userRequiredMiddleware])
    .handler(async ({ data }) => {
        await db.insert(schema.team).values({ ...data, id: undefined }).onConflictDoNothing();
    });
