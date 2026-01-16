import z from "zod";

export const TeamSchema = z.object({
    id: z.string().trim(),
    name: z.string().trim()
});

export type Team = z.infer<typeof TeamSchema>;