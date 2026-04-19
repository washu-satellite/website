import clsx from "clsx";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import GenericPage from "@/components/GenericPage";
import { Badge } from "@/components/ui/badge";
import { MemberList } from "@/components/MemberList";
import { members, slugify, type Member } from "@/const/content/members";

export const Route = createFileRoute("/team/")({
  component: TeamPage,
});

export const TeamTile = (props: Member) => {
  return (
    <div
      className={clsx(
        `border-border border group shadow-sm dark:shadow-none`,
        `flex flex-col font-mono justify-end rounded-md bg-background w-full md:w-[16rem] h-[16rem] min-h-0`,
      )}
    >
      <div className="flex-1 w-full relative overflow-hidden">
        {props.isAdmin && (
          <Badge className="absolute top-1 right-1 bg-primary/50 text-primary-foreground border-primary/70 font-sans">
            Admin
          </Badge>
        )}
        <Link
          to={"/team/people/$user_slug"}
          params={{ user_slug: slugify(props.name) }}
          className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full opacity-0 transition-all duration-500 group-hover:opacity-100"
        >
          <ArrowRight className="-rotate-45 w-24 h-24 transition-all duration-500 mt-6 mr-6 group-hover:mt-0 group-hover:mr-0" />
          <p className="font-sans">See full profile</p>
        </Link>
      </div>
      <div
        className={clsx(
          "border-inherit w-full p-4 rounded-b-md shrink-0",
        )}
      >
        <div className="flex flex-row items-start justify-between">
          <div>
            <h3 className="font-sans font-medium">{props.name}</h3>
            <p className="text-sm font-sans text-foreground/80">
              Class of {props.gradYear} · {props.team}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function TeamPage() {
  return (
    <GenericPage
      title="Our Team"
      headerContent={<p>The folks who make it all happen</p>}
    >
      <div className={`z-10 bg-bg px-[4rem] pt-4 pb-[4rem]`}>
        <MemberList members={members} />
      </div>
    </GenericPage>
  );
}
