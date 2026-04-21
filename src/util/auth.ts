import { getUserSession } from "@/services/auth.api";

export function isAdmin(userSession: Awaited<ReturnType<typeof getUserSession>>) {
    return userSession?.user.role === "admin";
}