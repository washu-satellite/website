/**
 * Who supports the team, split by what they actually give us.
 *
 * `logo` is the light-background file; `logoDark` is the reverse/white variant
 * shown when the site is in dark mode. A partner with no logo renders as their
 * name, so a missing file degrades to something readable rather than a gap.
 *
 * Names here are the names the partner requires. Several of them care: see the
 * naming table in Notion under "What We Can Get For Free" before editing one.
 */
export type Partner = {
  name: string;
  href?: string;
  /** Path under public/, e.g. "/partners/ansys.svg". */
  logo?: string;
  logoDark?: string;
  blurb: string;
};

/** Washington University's two schools that fund the team directly. */
export const primaryPartners: Partner[] = [
  {
    name: "McKelvey School of Engineering",
    href: "https://engineering.washu.edu/",
    blurb:
      "Our home school, and the single largest source of funding behind the hardware. The Dean's Fund pays for structures, avionics and the machining that turns a design into a flight article.",
  },
  {
    name: "Department of Physics",
    href: "https://physics.wustl.edu/",
    blurb:
      "Backs the science side of the missions, including our work through the Air Force Research Laboratory's University Nanosatellite Program, and gives us the faculty guidance behind AIRIS and SCALAR.",
  },
];

/**
 * Companies giving us parts, manufacturing or software rather than cash.
 * Ordered by how much of the build they touch.
 */
export const inKindPartners: Partner[] = [
  {
    name: "Ansys, part of Synopsys",
    href: "https://www.ansys.com/",
    logo: "/partners/ansys.svg",
    logoDark: "/partners/ansys-dark.svg",
    blurb:
      "Commercial-level simulation licences, unlimited in node and cell count, with training and support. We use it for structural, thermal and orbital analysis that the student edition could not run.",
  },
  {
    name: "MISUMI | fictiv",
    href: "https://us.misumi-ec.com/",
    logo: "/partners/misumi-fictiv.png",
    logoDark: "/partners/misumi-fictiv-dark.png",
    blurb:
      "Mechanical components and custom parts. Aluminium extrusion, brackets, fasteners, shafts and bearings for the AIRIS gondola and the GS-2 ground station, plus Fictiv for machined one-offs.",
  },
  {
    name: "ProtoSpace Mfg",
    href: "https://www.protocase.com/",
    logo: "/partners/protospace-mfg.png",
    logoDark: "/partners/protospace-mfg-dark.png",
    blurb:
      "Custom enclosures, machined brackets and electro-mechanical assembly. Supporting the weatherproof rooftop enclosure and rack hardware for our second-generation ground station.",
  },
  {
    name: "SendCutSend",
    href: "https://sendcutsend.com/",
    blurb:
      "Laser cutting and sheet metal fabrication. Their parts are already flying on AIRIS, and they have backed the team across three separate sponsorship rounds.",
  },
  {
    name: "SolidWorks",
    href: "https://www.solidworks.com/",
    blurb:
      "CAD licences for every member of the team, plus certification exams that give students a credential to leave with.",
  },
];
