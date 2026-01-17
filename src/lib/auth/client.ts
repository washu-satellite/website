import { createAuthClient } from "better-auth/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { authQueries } from "@/services/queries";
import { adminClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, admin } = createAuthClient({
    plugins: [
        adminClient()
    ],
    baseURL: process.env.VERCEL_URL ? ("https://www." + process.env.VERCEL_URL) : undefined
});

export const useAuthentication = () => {
    const { data } = useSuspenseQuery(authQueries.user());

    console.log("returning from useAuthentication");

    return { userSession: data, isAuthenticated: !!data };
}

export const useAuthenticatedUser = () => {
    const { userSession } = useAuthentication();

    if (!userSession)
        return undefined;

    return userSession;
}