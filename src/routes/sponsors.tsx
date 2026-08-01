import { createFileRoute } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import RedirectButton from "@/components/RedirectButton";
import { Button } from "@/components/ui/button";
import { Mail, Rocket, Antenna, GraduationCap, FileCheck } from "lucide-react";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

const SPONSOR_EMAIL = "washusatellite@gmail.com";
const MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
  "Sponsorship inquiry — WashU Satellite",
)}`;

const SUPPORTS = [
  {
    Icon: Rocket,
    title: "Flight hardware",
    body: "Structures, optics, avionics, and power systems for AIRIS and SCALAR: the parts that actually leave the ground.",
  },
  {
    Icon: Antenna,
    title: "Ground infrastructure",
    body: "Antennas, radios, and the ground station that lets us command our spacecraft and receive their data.",
  },
  {
    Icon: GraduationCap,
    title: "Students",
    body: "Machining certifications, design software, conference travel, and the training that turns members into engineers.",
  },
  {
    Icon: FileCheck,
    title: "Launch and licensing",
    body: "Integration, launch services, and the FCC and NOAA licensing every mission needs before it can fly.",
  },
];

function SponsorsPage() {
  return (
    <GenericPage
      title="Sponsors"
      headerContent={
        <div className="flex flex-col items-center gap-6 text-center">
          <p>
            WashU Satellite is a student-run space mission engineering team.
            Sponsorship puts our hardware in the air and our members in the
            industry.
          </p>
          <Button asChild variant="outline">
            <a href={MAILTO}>
              <Mail className="w-4 h-4 mr-2" />
              Become a sponsor
            </a>
          </Button>
        </div>
      }
    >
      <div className="px-4 md:px-[4rem] py-8 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
            What your support funds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORTS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-row gap-4 items-start border border-border rounded-md bg-background p-4"
              >
                <div className="rounded-full p-2 border border-border text-foreground/70">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="font-sans font-medium">{title}</h3>
                  <p className="text-sm text-foreground/80">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 justify-center bg-secondary/30 border-border border p-8 rounded-md">
          <div className="flex flex-col items-center gap-2 text-center max-w-[34rem]">
            <h2 className="font-mono text-foreground font-medium text-xl">
              Interested in sponsoring us?
            </h2>
            <p className="text-sm text-foreground/80">
              Email us and we&rsquo;ll send over our sponsorship packet, current
              mission status, and what recognition looks like at each level.
            </p>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline">
              <a href={MAILTO}>
                <Mail className="w-4 h-4 mr-2" />
                {SPONSOR_EMAIL}
              </a>
            </Button>
            <RedirectButton text="Other questions" href="/contact" />
          </div>
        </div>
      </div>
    </GenericPage>
  );
}
