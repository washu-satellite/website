import z from "zod";
import { MEMBERSHIP_STATUS_OPTIONS } from "./auth.schema";

export const DisplayUserShortSchema = z.object({
    id: z.string().trim(),
    name: z
    .string()
    .min(5, "Name must be at least five characters")
    .max(255, "Namme cannot be more than 255 characters"),
    username: z
    .string()
    .min(1, { error: "Username must be at least 1 character" })
    .max(16, { error: "Username cannot be longer than 16 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        error: "Username must be alphanumeric and/or underscores",
    })
    .trim()
    .trim(),
    memberSince: z.date(),
    membershipStatus: z.enum(MEMBERSHIP_STATUS_OPTIONS),
    email: z.email().trim(),
    linkedIn: z.string().trim().optional().nullable(),
    fcc_callsign: z
    .string()
    .min(5, "Callsign must be at least 5 characters")
    .max(7, "Callsign may not be more than seven characters!")
    .trim()
    .optional()
    .nullable(),
    imageUrl: z.string().trim().optional().nullable()
});

export type DisplayUserShort = z.infer<typeof DisplayUserShortSchema>;