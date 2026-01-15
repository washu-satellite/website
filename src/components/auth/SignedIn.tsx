import { useAuthentication } from "@/lib/auth/client";
import { useRouteContext } from "@tanstack/react-router";
import React from "react";

export default function SignedIn(props: React.PropsWithChildren<{}>) {
    const { userSession } = useRouteContext({ from: "__root__" });

    if (!userSession)
        return null;

    return (
        props.children
    );
}