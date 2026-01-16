import z from "zod";

export const MEMBERSHIP_STATUS_OPTIONS = ["Current member", "Alum", "Unknown"];

export const NewProfileSchema = z.object({
  userId: z.string().trim(),
  username: z
    .string()
    .min(1, { error: "Username must be at least 1 character" })
    .max(16, { error: "Username cannot be longer than 16 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username must be alphanumeric and/or underscores",
    })
    .trim()
    .trim(),
  name: z
    .string()
    .min(5, "Name must be at least five characters")
    .max(255, "Namme cannot be more than 255 characters"),
  email: z.email().trim()
});

export type NewProfile = z.infer<typeof NewProfileSchema>;

export const ProfileSchema = z.object({
  userId: z.string().trim().optional().nullable(),
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
  fccCallsign: z
    .string()
    .min(5, "Callsign must be at least 5 characters")
    .max(7, "Callsign may not be more than seven characters!")
    .trim()
    .optional().nullable(),
  bio: z.string().optional().nullable(),
  imageUrl: z.string().trim().optional().nullable(),
  teamId: z.string().optional().nullable()
});

export type Profile = z.infer<typeof ProfileSchema>;

export const SignUpSchema = z.object({
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
    .trim(),
  email: z.email({ error: "Invalid email address!" }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z_]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export type SignUp = z.infer<typeof SignUpSchema>;

export const SignInUsernameSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Username must be at least 1 character" })
    .max(16, { error: "Username cannot be longer than 16 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username must be alphanumeric and/or underscores",
    })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z_]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
});

export type SignInUsername = z.infer<typeof SignInUsernameSchema>;

export const SignInSchema = z.object({
  email: z.email({ error: "Invalid email address!" }).trim(),
  password: z.string(),
});

export type SignIn = z.infer<typeof SignInSchema>;
