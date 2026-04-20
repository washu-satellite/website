import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { House, User } from "lucide-react";
import { memberBySlug } from "@/const/content/members";

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

  return (
    <div className="flex-1 overflow-x-hidden z-10">
      <main>
        <div className="w-full h-[10rem] md:h-[12rem] overflow-hidden">
          <img src="/space_bg.png" className="size-full object-cover" />
        </div>
        <div className="relative border-t border-border bg-deep-background">
          <div className="flex flex-col px-2 md:px-4 lg:px-[4rem] gap-8 relative border-b">
            <div className="border-border md:border-x">
              <div className="w-full block md:flex flex-row border-t border-border">
                <div className="w-full md:w-1/3 xl:w-1/6 relative border-r border-border flex flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.secondary)]">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <User className="w-16 h-16 text-foreground/80" />
                  </div>
                  <p className="absolute bottom-2 right-2 font-mono text-xs uppercase text-foreground/60">
                    Photo
                  </p>
                </div>
                <div className="w-full md:w-2/3 xl:w-5/6 text-foreground/90 p-6 flex flex-col gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-foreground/60">
                      Name
                    </p>
                    <h1 className="text-2xl font-medium">{member.name}</h1>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase text-foreground/60">
                        Teams
                      </p>
                      <p>{member.teams.join(" · ")}</p>
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
                    {member.isAdmin && (
                      <div>
                        <p className="font-mono text-xs uppercase text-foreground/60">
                          Role
                        </p>
                        <Badge className="bg-primary/50 text-primary-foreground border-primary/70">
                          Admin
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
