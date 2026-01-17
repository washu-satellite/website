import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { db } from "../db";
import * as schema from '../db/schema';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    basePath: process.env.VERCEL_URL??undefined,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        tanstackStartCookies(),
        admin()
    ]
});