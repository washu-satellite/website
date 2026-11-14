/**
 * Who supports the team, split by what they actually give us.
 *
 * Logos render on a light tile, so every file here is the partner's full-colour
 * light-background artwork. That keeps us inside brand guidelines that forbid
 * recolouring (MISUMI's do) without us inventing reverse versions they never
 * supplied. A partner with no logo renders as their name instead of a gap.
 *
 * Names here are the names the partner requires. Several of them care: see the
 * naming table in Notion under "What We Can Get For Free" before editing one.
 */
export type Partner = {
  name: string;
  href?: string;
  /** Path under public/, e.g. "/partners/ansys.svg". */
  logo?: string;
  blurb: string;
};

/** The institutions and programmes funding the missions directly. */
export const primaryPartners: Partner[] = [
  {
    name: "McKelvey School of Engineering",
    href: "https://engineering.washu.edu/",
    logo: "/partners/mckelvey.svg",
    blurb:
      "McKelvey is our home school and the biggest reason we have hardware at all. The Dean's Fund covers our structures, avionics, and machining: everything it takes to get a design off the screen and into something that can actually fly.",
  },
  {
    name: "Department of Physics",
    href: "https://physics.wustl.edu/",
    logo: "/partners/washu-physics.png",
    blurb:
      "Physics supports the science behind our missions, including our work with the Air Force Research Laboratory's University Nanosatellite Program. Their faculty have also advised us on both AIRIS and SCALAR.",
  },
  {
    name: "University Nanosatellite Program",
    href: "https://unp.kirtland.af.mil/",
    logo: "/partners/unp.svg",
    blurb:
      "Run by the Air Force Research Laboratory, UNP funds spacecraft designed and built by university students. Our physics-side hardware is funded through it, and it's where we're aiming VECTOR.",
  },
  {
    // "MCSS" in our internal shorthand. Not the Missouri Space Grant
    // Consortium, which some older records abbreviated the same way.
    name: "McDonnell Center for the Space Sciences",
    href: "https://mcss.wustl.edu/",
    logo: "/partners/mcdonnell-center.png",
    blurb:
      "The McDonnell Center is WashU's home for planetary science, astrophysics, and fundamental physics, with a real track record in major space missions. They've funded our missions directly, and our faculty advisor is a research professor there.",
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
    blurb:
      "Ansys gives us full commercial simulation licenses with no limits on node or cell count, plus additional training and support. We use it for the structural, thermal, and orbital analysis that the student edition can't handle.",
  },
  {
    name: "MISUMI | fictiv",
    href: "https://us.misumi-ec.com/",
    logo: "/partners/misumi-fictiv.png",
    blurb:
      "MISUMI supplies the mechanical parts that hold our builds together: aluminum extrusion, brackets, fasteners, shafts, and bearings for the AIRIS gondola and the GS-2 ground station. When we just need a one-off machined part, Fictiv makes it for us.",
  },
  {
    name: "ProtoSpace Mfg",
    href: "https://www.protocase.com/",
    logo: "/partners/protospace-mfg.png",
    blurb:
      "ProtoSpace handles custom enclosures, machined brackets, and electro-mechanical assembly. They're helping us build the weatherproof rooftop enclosure and rack hardware for our second-generation ground station.",
  },
  {
    name: "SendCutSend",
    href: "https://sendcutsend.com/",
    logo: "/partners/sendcutsend.png",
    blurb:
      "SendCutSend does our laser cutting and sheet metal work, and their parts are already flying on AIRIS. They have backed us through three separate sponsorship rounds.",
  },
  {
    name: "SolidWorks",
    href: "https://www.solidworks.com/",
    logo: "/partners/solidworks.png",
    blurb:
      "SolidWorks gives every member of the team a CAD license, along with certification exams so students leave with a credential they can put on a resume.",
  },
];
