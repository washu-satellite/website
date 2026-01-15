import { User, LogOut, ExternalLink } from "lucide-react";
import SignedIn from "./auth/SignedIn";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";


import { Link, useRouter } from "@tanstack/react-router";
import { signOut, useAuthenticatedUser } from "@/lib/auth/client";

export function UserMenu() {
    const userData = useAuthenticatedUser();

    const queryClient = useQueryClient();
    
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        await queryClient.invalidateQueries();
        router.invalidate();
    };

    if (!userData) return <></>;

    return (
        <SignedIn>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="rounded-md border-border border dark:border-none">
                        <AvatarImage src={undefined} alt="u" />
                        <AvatarFallback className="rounded-md">
                            <User className="w-4 h-4"/>
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-border">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            asChild
                        >
                            <Link to="/team/$user_slug" params={{ user_slug: userData.profile.username }}>
                                <ExternalLink className="w-4 h-4"/>
                                Profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => handleSignOut()}
                        >
                            <LogOut className="w-4 h-4"/>
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </SignedIn>
    )
}