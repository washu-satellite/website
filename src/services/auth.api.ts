import { auth } from "@/lib/auth/auth";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { NewProfileSchema, ProfileSchema } from "./auth.schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import * as z from 'zod';
import { user } from "../../auth-schema";
import { isAdmin } from "@/util/auth";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();

    if (!request?.headers) {
      return null;
    }

    const userSession = await auth.api.getSession({ headers: request.headers });

    if (!userSession) return null;

    const profile = (await db
      .select()
      .from(schema.profile)
      .where(eq(schema.profile.userId, userSession.user.id)))[0];

    return { user: userSession.user, session: userSession.session, profile };
  }
);

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const userSession = await getUserSession();

    return next({ context: { userSession } });
  }
);

export const userRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.userSession) {
      throw Response.json(
        { message: "You must be logged in to do that!" },
        { status: 401 }
      );
    }

    return next({ context: { userSession: context.userSession } });
  });

export const batchCreateProfile = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    profiles: z.array(ProfileSchema)
  }))
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context }) => {
    if (!isAdmin(context.userSession)) {
      throw new Error("Illegal user creation request");
    }

    await Promise.all(data.profiles.map(p => createProfileAdmin({ data: p })));
  });

export const createProfile = createServerFn({ method: "POST" })
  .inputValidator(NewProfileSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context }) => {
    if (context.userSession.user.id !== data.userId && !isAdmin(context.userSession)) {
      throw new Error("Illegal user creation request");
    }

    await db
      .insert(schema.profile)
      .values({
        ...data,
        memberSince: new Date().toISOString().slice(0, 10),
        membershipStatus: "Unknown"
      })
      .onConflictDoUpdate({
        target: schema.profile.username,
        set: {
          ...data,
          memberSince: new Date().toISOString().slice(0, 10),
          membershipStatus: "Unknown"
        }
      });
  });

export const createProfileAdmin = createServerFn({ method: "POST" })
  .inputValidator(ProfileSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context }) => {
    if (!isAdmin(context.userSession)) {
      throw new Error("Illegal user creation request");
    }

    await db
      .insert(schema.profile)
      .values({
        ...data,
        memberSince: new Date().toISOString().slice(0, 10)
      });
  });