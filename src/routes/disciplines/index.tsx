import { createFileRoute, Link } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import { disciplines, disciplineMembers } from "@/const/content/disciplines";

export const Route = createFileRoute("/disciplines/")({
  component: DisciplinesPage,
});

function DisciplinesPage() {
  return (
    <GenericPage
      title="Disciplines"
      headerContent={
        <p className="text-center">
          Eight subteams, one satellite. Find the one that sounds like you.
        </p>
      }
    >
      <div className="px-4 md:px-[4rem] py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {disciplines.map((d) => (
          <Link
            key={d.slug}
            to="/disciplines/$discipline_slug"
            params={{ discipline_slug: d.slug }}
            className="flex flex-col gap-2 border border-border rounded-md bg-background p-4 hover:border-primary/60 transition-colors"
          >
            <div className="flex flex-row items-baseline justify-between gap-2">
              <h2 className="font-sans font-medium">{d.name}</h2>
              <span className="font-mono text-xs text-foreground/60">
                {disciplineMembers(d).length} members
              </span>
            </div>
            <p className="text-sm text-foreground/80">{d.tagline}</p>
          </Link>
        ))}
      </div>
    </GenericPage>
  );
}
