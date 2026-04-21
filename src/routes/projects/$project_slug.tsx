import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, House } from "lucide-react";
import GenericPage from "@/components/GenericPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectPages } from "@/const/content/projects";
import type { ProjectData } from "@/types/data";

export const Route = createFileRoute("/projects/$project_slug")({
  component: ProjectPage,
});

function phaseLabel(phase: ProjectData["phase"]) {
  switch (phase) {
    case "assembly":
      return { text: "Assembly Phase", tone: "text-accent-red" };
    case "design":
      return { text: "Design Phase", tone: "text-accent-red" };
    case "prototyping":
      return { text: "Prototyping Phase", tone: "text-accent-red" };
    case "proposal":
      return { text: "Proposal Phase", tone: "text-accent-red" };
    case "success":
      return { text: "Mission Success", tone: "text-[#4CB75A]" };
    default:
      return { text: "", tone: "" };
  }
}

function ProjectPage() {
  const params = Route.useParams();
  const page = ProjectPages[params.project_slug];

  if (!page) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-lg">
          No project with id{" "}
          <Badge
            variant="outline"
            className="font-mono text-base font-semibold rounded-md"
          >
            {params.project_slug}
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

  const p = page.project;
  const phase = phaseLabel(p.phase);

  return (
    <GenericPage
      title={p.id}
      headerContent={
        <div className="w-full flex flex-col gap-4">
          <p className="text-foreground/80 text-lg">{p.title}</p>
          <div className="flex flex-row flex-wrap items-center gap-4 text-sm font-mono text-foreground/70">
            {p.date && <span>{p.date}</span>}
            <span>//</span>
            <span>{p.contributors} Contributors</span>
            {phase.text && (
              <>
                <span>//</span>
                <span className={phase.tone}>{phase.text}</span>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-8 px-[4rem] py-8">
        {p.image && (
          <div className="w-full overflow-hidden rounded-md border border-border">
            <img src={p.image} alt={p.title} className="w-full h-auto" />
          </div>
        )}
        <p className="text-foreground/90 leading-relaxed">{p.description}</p>
        {p.posterUrl && (
          <div>
            <Button asChild variant="outline">
              <a href={p.posterUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View poster
              </a>
            </Button>
          </div>
        )}
      </div>
    </GenericPage>
  );
}
