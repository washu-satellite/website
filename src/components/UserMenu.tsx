import { User, LogOut } from "lucide-react";
import SignedIn from "./auth/SignedIn";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";


import { useRouter } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";

export function UserMenu() {
    const queryClient = useQueryClient();
    
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        await queryClient.invalidateQueries();
        router.invalidate();
    };

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