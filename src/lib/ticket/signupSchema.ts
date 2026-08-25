import { z } from "zod";

export const MAX_NAME_LENGTH = 48;
export const MAX_EMAIL_LENGTH = 254;

/**
 * Where the signup came from. The unlisted /9njdxq3e prototype posts without one and is recorded as
 * "ticket"; the public page sends "space". Kept on the entry so a mailing-list export can tell an
 * intentional public subscriber apart from someone who was handed a private link.
 */
export const SIGNUP_SOURCES = ["ticket", "space"] as const;
export type SignupSource = (typeof SIGNUP_SOURCES)[number];

export const signupRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(MAX_NAME_LENGTH),
  // Optional because the older prototype collects a name only. The public page requires one at the
  // form layer instead, so widening the contract here does not weaken that page.
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL_LENGTH)
    .email("Enter a valid email address")
    .optional(),
  source: z.enum(SIGNUP_SOURCES).optional(),
  /** Explicit opt-in to launch updates. Recorded per signup so an export can honour it. */
  newsletter: z.boolean().optional(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export type SignupEntry = {
  name: string;
  email?: string;
  newsletter: boolean;
  source: SignupSource;
  timestamp: string;
  userAgent: string;
};
