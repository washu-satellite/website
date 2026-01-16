import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import * as schema from "@/lib/db/schema";
import { and, eq, isNull, ne, sql } from "drizzle-orm";
import z from "zod";
import { DisplayUserShortSchema, DisplayUserShort, DisplayUser, DisplayUserSchema } from "./user.schema";
import { userRequiredMiddleware } from "./auth.api";
import { Profile, ProfileSchema } from "./auth.schema";
import { isAdmin } from "@/util/auth";
import { ilike } from "drizzle-orm";

export const listUsers = createServerFn({ method: "GET" })
    .handler(async () => {
        const profiles = await db.select().from(schema.profile);

        const arr = z.array(DisplayUserShortSchema).parse(profiles.map(p => ({
            ...p,
            memberSince: new Date(p?.memberSince??Date.now())
        })));

        return arr;
    });

export const listUsersAdmin = createServerFn({ method: "GET" })
    .middleware([userRequiredMiddleware])
    .handler(async ({ context }) => {
        if (context.userSession.user.role !== "admin") {
          throw new Error("You do not have permission to perform this index!");
        }

        const users = await db.select().from(schema.profile).leftJoin(schema.user, eq(schema.profile.userId, schema.user.id));

        console.log("DB RESULT");
        console.log(users);

        const filtered = users.map(p => ({
          ...p.user,
          ...p.profile,
          memberSince: new Date(p.profile.memberSince)
        }));

        console.log("PARSED RESULT");
        console.log(filtered);

        return filtered;
    });

export const getFullProfile = createServerFn({ method: "GET" })
  .inputValidator(z.object({ username: z.string() }))
  .handler(async ({ data }) => {
    const value = (await db
      .select()
      .from(schema.profile)
      .leftJoin(schema.user, eq(schema.profile.userId, schema.user.id))
      .where(eq(schema.profile.username, data.username))
      .limit(1)
    )[0];

    console.log("GETTING USER PROFILE");

    console.log(value);

    if (!value)
        return undefined;

    return {
        ...value.profile,
        ...value.user,
        memberSince: new Date(value.profile?.memberSince??Date.now())
    } as DisplayUser;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(DisplayUserSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context }) => {
    const user = context.userSession.user;
    
    if (user.id !== data.id && user.role !== "admin") {
      throw new Error("You do not have permission to edit this user's profile!");
    }

    const res1 = await db
      .update(schema.user)
      .set(data)
      .where(eq(schema.user.id, data.id));
    
    console.log(res1.rowCount);

    const res2 = await db
      .update(schema.profile)
      .set({
        ...data,
        memberSince: data.memberSince.toISOString().slice(0, 10)
      })
      .where(eq(schema.profile.username, data.username));
    
    console.log(res2.rowCount);

    return { success: true, id: Date.now() };
  });

export const checkUsernameTaken = createServerFn({ method: "GET" })
  .inputValidator(z.object({
    username: z.string()
  }))
  .handler(async ({ data }) => {
    const res = await db
      .select({
        username: schema.profile.username
      })
      .from(schema.profile)
      .where(eq(schema.profile.username, data.username));
    
    return res.length > 0;
  });

export const checkSimilarName = createServerFn({ method: "GET" })
  .inputValidator(z.object({
    name: z.string()
  }))
  .handler(async ({ data }) => {
    const res = await db
      .select()
      .from(schema.profile)
      .where(and(
        isNull(schema.profile.userId),
        ilike(schema.profile.name, `%${data.name}%`)
      ));
    
    return res[0];
  });

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    username: z.string()
  }))
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context }) => {
    if (!isAdmin(context.userSession)) {
      throw new Error("You are not authorized to perform this action!");
    }

    const entry = await db
      .delete(schema.profile)
      .where(eq(schema.profile.username, data.username))
      .returning({
        id: schema.profile.userId
      });

    if (entry[0].id) {
      await db
        .delete(schema.user)
        .where(eq(schema.user.id, entry[0].id));
    }
  });