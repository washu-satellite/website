"use client";

// @ts-ignore

import clsx from "clsx";
import { FaLinkedin } from "react-icons/fa6";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import GenericPage from "@/components/GenericPage";
import { Badge } from "@/components/ui/badge";
import { userQueries } from "@/services/queries";
import { DisplayUserShort } from "@/services/user.schema";
import LoadingPage from "@/components/LoadingPage";

export const Route = createFileRoute('/team/')({
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(userQueries.list());
    },
    component: TeamPage,
});

const TeamTile = (props: DisplayUserShort) => {
    return (
        <div
            className={clsx(
                `border-border border group shadow-sm dark:shadow-none`,
                `flex flex-col font-mono justify-end rounded-md bg-background w-[16rem] h-[16rem] min-h-0`
            )}
        >
            
            <div className="flex-1 w-full relative overflow-hidden">
                {/* {props.avatar &&
                    <img
                        className="object-cover w-full h-full rounded-t-[5px] group-hover:opacity-20"
                        src={props.avatar}
                        alt=""
                    />
                } */}
                {props.membershipStatus === "Alum" &&
                    <Badge className="absolute top-1 right-1 bg-red-500/50 text-white border-red-500/70 font-sans">
                        Alum
                    </Badge>
                }
                <Link
                    to={"/team/people/$user_slug"}
                    params={{ user_slug: props.username }}
                    className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full opacity-0 transition-all duration-500 group-hover:opacity-100"
                >
                    <ArrowRight className="-rotate-45 w-24 h-24 transition-all duration-500 mt-6 mr-6 group-hover:mt-0 group-hover:mr-0"/>
                    <p className="font-sans">See full profile</p>
                </Link>
            </div>
            <div
                className={clsx(
                    // props.avatar ? 'border-t-[1px]' : '',
                    'border-inherit w-full p-4 rounded-b-md shrink-0'
                )}
            >
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className="font-sans font-medium">{props.name}</h3>
                        <p className="text-sm font-sans text-foreground/80"></p>
                    </div>
                    <div className="hover:text-secondary-foreground flex flex-row items-center">
                        {props.linkedIn && (
                            <a href={`https://www.linkedin.com/in/${props.linkedIn}`}>
                                <FaLinkedin size={30} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function TeamPage() {
    const { data, isPending, error } = useQuery(userQueries.list());

    if (isPending) return <LoadingPage />;
    if (error) return "An error has occurred: " + error.message;

    return (
        <GenericPage
            title="Our Team"
            headerContent={(
                <p>The folks who make it all happen</p>
            )}
        >
            <div className={`z-10 bg-bg px-[4rem] pt-4 pb-[4rem]`}>
                {/* <h2 className="text-text text-lg font-semibold my-8">Executive Board</h2>
                <div className="flex flex-row flex-wrap justify-start gap-8">
                    {ExecMembers.map(m => (
                        <TeamTile
                            key={m.name}
                            {...m}
                        />
                    ))}
                </div> */}
                <h2 className="text-text text-lg font-semibold my-8 mt-16">Members</h2>
                <div className="flex flex-row flex-wrap justify-start gap-6">
                    {data.filter(u => u.membershipStatus !== "Unknown").map(m => (
                        <TeamTile
                            key={m.name}
                            {...m}
                        />
                    ))}
                </div>
            </div>
        </GenericPage>
    );
}