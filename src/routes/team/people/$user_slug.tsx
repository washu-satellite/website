import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { House } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import GenericPage from "@/components/GenericPage";
import { MemberAvatar } from "@/components/MemberAvatar";
import { linkedinUrl, memberBySlug } from "@/const/content/members";

export const Route = createFileRoute("/team/people/$user_slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const member = memberBySlug(params.user_slug);

  if (!member) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-lg">
          No member with id{" "}
          <Badge
            variant="outline"
            className="font-mono text-base font-semibold rounded-md"
          >
            {params.user_slug}
          </Badge>
        </h1>
        <Button asChild variant="outline">
          <Link to="/" className="flex flex-row items-center">
            <House />
            Return home
          </Link>
        </Button>
      </div>
    );
  }

  const liUrl = linkedinUrl(member.linkedin);

  return (
    <GenericPage
      title={member.name}
      headerContent={
        <div className="flex flex-row flex-wrap items-center gap-3 text-foreground/80">
          <span>{member.teams.join(" · ")}</span>
          {member.isAdmin && (
            <Badge className="bg-primary/50 text-primary-foreground border-primary/70">
              Admin
            </Badge>
          )}
        </div>
      }
    >
      <div className="px-[4rem] py-8 flex flex-col md:flex-row gap-8 items-start">
        <MemberAvatar
          member={member}
          size="size-48 md:size-56"
          rounded="md"
          className="border-2"
        />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs uppercase text-foreground/60">
              Teams
            </p>
            <p>{member.teams.join(", ")}</p>
          </div>
          {member.email && (
            <div>
              <p className="font-mono text-xs uppercase text-foreground/60">
                Email
              </p>
              <a
                href={`mailto:${member.email}`}
                className="hover:underline underline-offset-2"
              >
                {member.email}
              </a>
            </div>
          )}
          {member.gradYear && (
            <div>
              <p className="font-mono text-xs uppercase text-foreground/60">
                Graduation Year
              </p>
              <p>{member.gradYear}</p>
            </div>
          )}
          {liUrl && (
            <div>
              <p className="font-mono text-xs uppercase text-foreground/60">
                LinkedIn
              </p>
              <Button asChild variant="outline" className="mt-1">
                <a href={liUrl} target="_blank" rel="noreferrer">
                  <FaLinkedin className="w-4 h-4 mr-2" />
                  View profile
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </GenericPage>
  );
}
