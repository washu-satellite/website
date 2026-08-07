import { z } from "zod";

export const MAX_NAME_LENGTH = 48;

export const signupRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(MAX_NAME_LENGTH),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

export type SignupEntry = {
  name: string;
  timestamp: string;
  userAgent: string;
};
