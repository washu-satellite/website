import { createFileRoute, Link } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import { ProjectPages } from "@/const/content/projects";
import type { ProjectData } from "@/types/data";

export const Route = createFileRoute("/projects/")({
  component: AllMissionsPage,
});

function phaseLabel(phase: ProjectData["phase"]) {
  switch (phase) {
    case "success":
      return "Mission success";
    case "assembly":
      return "Assembly";
    case "design":
      return "Design";
    case "prototyping":
      return "Prototyping";
    case "proposal":
      return "Proposal";
    case "deployment":
      return "Deployment";
  }
}

function AllMissionsPage() {
  return (
    <GenericPage
      title="All Missions"
      headerContent={
        <p className="text-center">
          From our first balloon flight to the satellites we're building now.
        </p>
      }
    >
      <div className="px-4 md:px-[4rem] py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(ProjectPages)
          .filter(([slug]) => slug !== "spinor")
          .map(([slug, { project }]) => (
          <Link
            key={slug}
            to="/projects/$project_slug"
            params={{ project_slug: slug }}
            className="flex flex-col gap-3 border border-border rounded-md bg-background p-4 hover:border-primary/60 transition-colors"
          >
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-md border border-border text-foreground/80">
                  {project.icon}
                </span>
                <h2 className="font-sans font-medium">{project.id}</h2>
              </div>
              {project.phase && (
                <span
                  className={`font-mono text-xs ${project.phase === "success" ? "text-[#4CB75A]" : "text-accent-red"}`}
                >
                  {phaseLabel(project.phase)}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/80">{project.short ?? project.title}</p>
            <p className="text-xs text-foreground/60">{project.date}</p>
          </Link>
          ))}
      </div>
    </GenericPage>
  );
}
