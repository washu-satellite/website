import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import RedirectButton from "@/components/RedirectButton";
import { TeamTile } from "@/routes/team/index";
import {
  disciplineBySlug,
  disciplineMembers,
} from "@/const/content/disciplines";

export const Route = createFileRoute("/disciplines/$discipline_slug")({
  component: DisciplinePage,
  loader: ({ params }) => {
    const discipline = disciplineBySlug(params.discipline_slug);
    if (!discipline) throw notFound();
    return { discipline };
  },
});

function DisciplinePage() {
  const { discipline } = Route.useLoaderData();
  const people = disciplineMembers(discipline);

  return (
    <GenericPage
      title={discipline.name}
      headerContent={
        <p className="text-center italic">{discipline.tagline}</p>
      }
    >
      <div className="px-4 md:px-[4rem] py-8 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 md:w-3/5">
            {discipline.body.map((para, i) => (
              <p key={i} className="text-foreground/80">
                {para}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-6 md:w-2/5">
            <div className="flex flex-col gap-2">
              <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
                What we're working on
              </h2>
              <ul className="flex flex-col gap-2">
                {discipline.working.map((w) => (
                  <li
                    key={w}
                    className="text-sm text-foreground/80 border-l-2 border-border pl-3"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
                What you'll pick up
              </h2>
              <ul className="flex flex-col gap-2">
                {discipline.learn.map((l) => (
                  <li
                    key={l}
                    className="text-sm text-foreground/80 border-l-2 border-border pl-3"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {people.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
              {people.length} on the {discipline.name} team
            </h2>
            <div className="flex flex-row flex-wrap gap-4">
              {people.map((m) => (
                <TeamTile key={m.name} {...m} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 justify-center bg-secondary/30 border-border border p-8 rounded-md">
          <div className="flex flex-col items-center gap-2 text-center max-w-[34rem]">
            <h2 className="font-mono text-foreground font-medium text-xl">
              Interested in {discipline.name}?
            </h2>
            <p className="text-sm text-foreground/80">
              You do not need prior experience. Applications open at the start of
              each semester, and we take people from every school and year.
            </p>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <RedirectButton text="See applications" href="/apply" />
            <Link
              to="/disciplines"
              className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2"
            >
              Other disciplines
            </Link>
          </div>
        </div>
      </div>
    </GenericPage>
  );
}
