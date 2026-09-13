import { createFileRoute } from "@tanstack/react-router";
import GenericPage from "@/components/GenericPage";
import RedirectButton from "@/components/RedirectButton";
import { Button } from "@/components/ui/button";
import { Mail, Rocket, Antenna, GraduationCap, FileCheck } from "lucide-react";
import {
  inKindPartners,
  primaryPartners,
  type Partner,
} from "@/const/content/partners";

export const Route = createFileRoute("/partners")({
  component: PartnersPage,
});

const PARTNER_EMAIL = "washusatellite@gmail.com";
const MAILTO = `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(
  "Partnership inquiry — WashU Satellite",
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

/**
 * Swaps to the reverse artwork in dark mode via CSS rather than the theme
 * store, so the correct logo is in the server-rendered HTML and never flashes
 * the wrong one on load. Falls back to the partner's name when we have no file.
 */
function PartnerLogo({ partner, className }: { partner: Partner; className?: string }) {
  if (!partner.logo) {
    return (
      <span className="font-mono text-sm uppercase tracking-wider text-foreground/70">
        {partner.name}
      </span>
    );
  }
  const dark = partner.logoDark ?? partner.logo;
  return (
    <>
      <img
        src={partner.logo}
        alt={partner.name}
        loading="lazy"
        className={`${className} block dark:hidden`}
      />
      <img
        src={dark}
        alt={partner.name}
        loading="lazy"
        className={`${className} hidden dark:block`}
      />
    </>
  );
}

function PartnersPage() {
  return (
    <GenericPage
      title="Partners"
      headerContent={
        <div className="flex flex-col items-center gap-6 text-center">
          <p>
            WashU Satellite is a student-run space mission engineering team. Our
            partners put our hardware in the air and our members in the
            industry.
          </p>
          <Button asChild variant="outline">
            <a href={MAILTO}>
              <Mail className="w-4 h-4 mr-2" />
              Become a partner
            </a>
          </Button>
        </div>
      }
    >
      <div className="px-4 md:px-[4rem] py-8 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
            Who funds the team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-4 border border-border rounded-md bg-background p-6 hover:bg-bg-highlight transition-colors duration-200"
              >
                <div className="flex items-center h-16">
                  <PartnerLogo partner={partner} className="max-h-16 w-auto object-contain" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-sans font-medium">{partner.name}</h3>
                  <p className="text-sm text-foreground/80">{partner.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-mono uppercase text-xs tracking-wider text-foreground/60">
            In-kind partners
          </h2>
          <p className="text-sm text-foreground/70 max-w-[46rem]">
            Companies who give us parts, manufacturing and software instead of
            cash. Much of what flies was cut, machined, simulated or designed
            with something on this list.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inKindPartners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-4 border border-border rounded-md bg-background p-4 hover:bg-bg-highlight transition-colors duration-200"
              >
                <div className="flex items-center h-10">
                  <PartnerLogo partner={partner} className="max-h-10 w-auto object-contain" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="font-sans font-medium text-sm">{partner.name}</h3>
                  <p className="text-sm text-foreground/80">{partner.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

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
              Interested in partnering with us?
            </h2>
            <p className="text-sm text-foreground/80">
              Email us and we&rsquo;ll send over our partnership packet, current
              mission status, and what recognition looks like at each level.
            </p>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline">
              <a href={MAILTO}>
                <Mail className="w-4 h-4 mr-2" />
                {PARTNER_EMAIL}
              </a>
            </Button>
            <RedirectButton text="Other questions" href="/contact" />
          </div>
        </div>
      </div>
    </GenericPage>
  );
}
