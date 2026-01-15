import { createAuthClient } from "better-auth/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { authQueries } from "@/services/queries";
import { adminClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, admin } = createAuthClient({
    plugins: [
        adminClient()
    ]
});

export const useAuthentication = () => {
    const { data } = useSuspenseQuery(authQueries.user());

    return { userSession: data, isAuthenticated: !!data };
}

export const useAuthenticatedUser = () => {
    const { userSession } = useAuthentication();

    if (!userSession)
        return undefined;

    return userSession;
}