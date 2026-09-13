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
 * Partner artwork is full-colour and drawn for light backgrounds, and several
 * of them forbid recolouring. The whole partner section therefore sits on white
 * rather than the site's dark ground, so every mark is shown exactly as its
 * owner supplied it. Falls back to a wordmark when we have no file.
 */
function PartnerLogo({
  partner,
  className,
}: {
  partner: Partner;
  className?: string;
}) {
  if (!partner.logo) {
    return (
      <span className="font-mono text-center uppercase tracking-[0.12em] text-base font-medium text-neutral-800">
        {partner.name}
      </span>
    );
  }
  return (
    <img
      src={partner.logo}
      alt={partner.name}
      loading="lazy"
      className={className}
    />
  );
}

function LevelHeading({
  level,
  title,
  body,
}: {
  level: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 max-w-[46rem]">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-[0.25em] text-accent-red">
          {level}
        </span>
        <span className="h-px flex-1 bg-neutral-300" />
      </div>
      <h2 className="font-mono text-2xl md:text-3xl font-semibold text-neutral-900">
        {title}
      </h2>
      <p className="text-neutral-600 text-sm md:text-base">{body}</p>
    </div>
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
      {/*
        Full-bleed: GenericPage pads its children by 1rem a side, so pulling the
        margins back by that much and growing the width to match lands the white
        band exactly on the viewport edges without a horizontal scrollbar.
      */}
      <section className="-mx-4 w-[calc(100%+2rem)] bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[76rem] px-6 md:px-12 flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col gap-10">
            <LevelHeading
              level="LEVEL 01"
              title="Who funds the team"
              body="The schools, centres and programmes paying for the hardware. Between them they cover structures, avionics, machining, launch and the faculty guidance behind every mission we fly."
            />
            {/* Two across: four funders make a clean 2x2 rather than the 3+1
                orphan a three-column grid would leave. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {primaryPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-6 rounded-lg border border-neutral-200 bg-white p-8 md:p-10 hover:border-neutral-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-center h-28 md:h-36">
                    <PartnerLogo
                      partner={partner}
                      className="max-h-full max-w-full w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-sans font-semibold text-lg text-neutral-900">
                      {partner.name}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                      {partner.blurb}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <LevelHeading
              level="LEVEL 02"
              title="In-kind partners"
              body="Companies who give us parts, manufacturing and software instead of cash. Much of what flies was cut, machined, simulated or designed with something on this list."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inKindPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-center h-20 md:h-24">
                    <PartnerLogo
                      partner={partner}
                      className="max-h-full max-w-full w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="font-sans font-semibold text-neutral-900">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {partner.blurb}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 md:px-[4rem] py-12 flex flex-col gap-10">
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
