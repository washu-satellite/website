import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, House, Mail } from "lucide-react";
import GenericPage from "@/components/GenericPage";
import ScrollFrameBackground from "@/components/ScrollFrameBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectPages } from "@/const/content/projects";
import type { ProjectData, ProjectPageType } from "@/types/data";

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
      backgroundImage={p.image}
      backgroundFrames={
        p.frameSequence && (
          <ScrollFrameBackground
            dir={p.frameSequence.dir}
            count={p.frameSequence.count}
            aspect={p.frameSequence.aspect}
            width={p.frameSequence.width}
            position={p.imagePosition}
          />
        )
      }
      backgroundPosition={p.imagePosition}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-10 px-[4rem] py-8">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-12 min-w-0">
          {page.tagline && (
            <p className="italic text-lg text-foreground/80">
              {page.tagline}
            </p>
          )}

          <p className="text-foreground/90 leading-relaxed">
            {p.description}
          </p>

          {page.sections?.map((s) => (
            <ProseBlock key={s.heading} heading={s.heading} body={s.body} />
          ))}

          {page.objectives && page.objectives.length > 0 && (
            <SectionWrap heading="Scientific Objectives">
              <ul className="flex flex-col gap-3">
                {page.objectives.map((o) => (
                  <li key={o.title} className="flex flex-row gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-accent-red shrink-0" />
                    <div>
                      <span className="font-medium">{o.title}</span>
                      <span className="text-foreground/80"> — {o.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionWrap>
          )}

          {page.engineering && page.engineering.length > 0 && (
            <SectionWrap heading="Engineering Highlights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.engineering.map((e) => (
                  <div
                    key={e.title}
                    className="border border-border rounded-md bg-background p-4 flex flex-col gap-2"
                  >
                    <h3 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
                      {e.title}
                    </h3>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {e.description}
                    </p>
                  </div>
                ))}
              </div>
            </SectionWrap>
          )}

          {page.acknowledgments && (
            <SectionWrap heading="Acknowledgments">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {page.acknowledgments}
              </p>
            </SectionWrap>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-8 lg:sticky lg:top-24 self-start">
          {page.factSheet && page.factSheet.length > 0 && (
            <SectionWrap heading="Fact sheet">
              <SpecGrid rows={page.factSheet} cols={1} />
            </SectionWrap>
          )}

          {page.specs && page.specs.length > 0 && (
            <SectionWrap heading="Specs">
              <SpecGrid rows={page.specs} cols={1} mono />
            </SectionWrap>
          )}

          {page.schedule && page.schedule.length > 0 && (
            <SectionWrap heading="Schedule">
              <div className="flex flex-col divide-y divide-border border border-border rounded-md bg-background">
                {page.schedule.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-row gap-4 p-3 items-baseline"
                  >
                    <span className="font-mono text-xs uppercase text-foreground/60 w-[6rem] shrink-0">
                      {s.label}
                    </span>
                    <span className="text-sm">{s.value}</span>
                  </div>
                ))}
              </div>
            </SectionWrap>
          )}

          {page.modules && page.modules.length > 0 && (
            <SectionWrap heading="Subteams">
              <div className="flex flex-row flex-wrap gap-2">
                {page.modules.map((m) => (
                  <Badge
                    key={m}
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-wider"
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </SectionWrap>
          )}

          <div className="flex flex-col gap-2">
            {p.posterUrl && (
              <Button asChild variant="outline" className="justify-start">
                <a href={p.posterUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View poster
                </a>
              </Button>
            )}
            <Button asChild variant="outline" className="justify-start">
              <a
                href={`mailto:washusatellite@gmail.com?subject=${encodeURIComponent(
                  `${p.id} inquiry`,
                )}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get involved
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </GenericPage>
  );
}

function SectionWrap(props: React.PropsWithChildren<{ heading: string }>) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60 border-b border-border pb-2">
        {props.heading}
      </h2>
      {props.children}
    </section>
  );
}

function ProseBlock(props: { heading: string; body: string }) {
  return (
    <SectionWrap heading={props.heading}>
      <p className="text-foreground/90 leading-relaxed max-w-[42rem]">
        {props.body}
      </p>
    </SectionWrap>
  );
}

function SpecGrid(props: {
  rows: NonNullable<ProjectPageType["specs"]>;
  cols?: 1 | 2;
  mono?: boolean;
}) {
  const cls = props.cols === 2 ? "md:grid-cols-2" : "";
  return (
    <div className={`grid grid-cols-1 ${cls} gap-x-8 gap-y-3`}>
      {props.rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-col border-b border-border/50 pb-2"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-foreground/60">
            {r.label}
          </span>
          <span
            className={
              props.mono
                ? "font-mono text-sm tabular-nums"
                : "text-sm"
            }
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
