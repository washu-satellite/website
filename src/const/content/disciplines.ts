import { members, slugify } from "./members";

export type Discipline = {
  /** URL slug. Matches `slugify(team)` so member data lines up. */
  slug: string;
  /** Team name exactly as it appears in members.json `teams`. */
  team: string;
  name: string;
  tagline: string;
  /** One concrete sentence for the index cards — what this team actually does. */
  summary: string;
  /** Body paragraphs. */
  body: string[];
  /** Concrete things this team owns right now. */
  working: string[];
  /** Skills you pick up. Written for someone deciding whether to join. */
  learn: string[];
};

export const disciplines: Discipline[] = [
  {
    slug: "mechanical",
    team: "Mechanical",
    name: "Mechanical",
    tagline: "If it holds together in a vacuum, a stratosphere, or a St. Louis winter, we designed it.",
    summary:
      "CAD, structural and thermal analysis, and fabrication for everything we fly — machined, printed, and assembled in house.",
    body: [
      "Mechanical owns everything physical. The frame that keeps a telescope pointed while a balloon swings under it, the structure of a satellite that has to survive a rocket launch, the enclosure that keeps a rooftop ground station dry in February.",
      "Most of the work is CAD, analysis, and then actually making the part. We machine, print, and assemble in house, which means the thing you modeled on Tuesday can be in your hands by the weekend.",
    ],
    working: [
      "SCALAR's structure and thermal design, sized to survive launch loads and orbit",
      "AIRIS's moving frame and electronics mounting for a balloon gondola",
      "GS-2's mast, supports, and weatherproof enclosure",
    ],
    learn: [
      "CAD and design for manufacture",
      "Structural and thermal analysis",
      "Machining, 3D printing, and hands-on assembly",
      "Designing to a written requirement instead of a guess",
    ],
  },
  {
    slug: "electrical",
    team: "Electrical",
    name: "Electrical",
    tagline: "Power, radio, and the boards that carry both.",
    summary:
      "Custom PCBs and RF chains: spacecraft power systems, ground station antennas and amplifiers, and the boards nobody sells off the shelf.",
    body: [
      "Electrical designs the boards and the RF chains. That covers power generation and distribution on a spacecraft, the antenna and amplifier chain on a ground station, and the custom PCBs that do jobs no off-the-shelf part does.",
      "It is one of the fastest places on the team to go from knowing nothing to owning something real. Several of our current module leads had never laid out a board before joining.",
    ],
    working: [
      "SCALAR's electrical power system and embedded magnetorquer PCBs",
      "GS-2's antenna, amplifier, and transmit and receive chain",
      "AIRIS's motor drive electronics and power distribution",
    ],
    learn: [
      "Schematic capture and PCB layout",
      "RF design, antenna simulation, and tuning",
      "Power systems, grounding, and surge protection",
      "Bench testing with real instruments",
    ],
  },
  {
    slug: "software",
    team: "Software",
    name: "Software",
    tagline: "Flight code, ground code, and the pipeline between them.",
    summary:
      "Flight software you cannot reboot by hand, the interface an operator commands a pass from, and the packet pipeline joining them.",
    body: [
      "Software spans further than most people expect. On one end there is flight software running on hardware you cannot reboot by hand. On the other there is the web interface an operator uses to command a spacecraft during a pass that lasts a few minutes.",
      "In between sits the pipeline: packet standards, transport, storage, and the image processing that decides whether a smudge in a frame is a gamma-ray burst or a cosmic ray hit.",
    ],
    working: [
      "GS-2's routing, CCSDS conversion, cloud infrastructure, and operator interface",
      "AIRIS's onboard transient identification, frame alignment, and long-term storage",
      "SCALAR's Mission Operations Framework for uploading experiments after launch",
    ],
    learn: [
      "Embedded and flight software",
      "Real-time data pipelines and packet protocols",
      "Image processing and detection algorithms",
      "Full-stack web work for mission operations",
    ],
  },
  {
    slug: "systems",
    team: "Systems",
    name: "Systems",
    tagline: "The people who make sure the pieces add up to a spacecraft.",
    summary:
      "Requirements, interfaces, and the mass, power, and link budgets every subteam designs against. Catches problems on paper, not on the pad.",
    body: [
      "Systems owns the whole, not a part. Requirements, interfaces, budgets for mass and power and data, and the reviews that catch a problem on paper instead of on a launch pad.",
      "It is the discipline that sees every other one. If you want to understand how a mission actually fits together, this is where you sit.",
    ],
    working: [
      "Requirements and interface control across AIRIS, SCALAR, and GS-2",
      "Integration planning for SCALAR ahead of delivery",
      "Mass, power, and link budgets that every subteam designs against",
    ],
    learn: [
      "Requirements writing and verification",
      "Interface control and integration planning",
      "Design reviews and technical documentation",
      "Trade studies with real constraints",
    ],
  },
  {
    slug: "physics",
    team: "Physics",
    name: "Physics",
    tagline: "The science case behind the hardware.",
    summary:
      "Decides what is worth observing and what instrument can observe it — optics, sensors, and the analysis that turns raw frames into a result.",
    body: [
      "Physics decides what a mission is for. What is worth observing, what instrument can observe it, and what counts as a result once the data comes back.",
      "The work runs from optical design and sensor selection to the analysis that turns raw frames into something an observatory elsewhere in the world can act on. Our proposals have already brought in outside funding.",
    ],
    working: [
      "AIRIS's imaging module: optics, filters, and sensor calibration",
      "VECTOR's science case and onboard search strategy",
      "SPINOR, a proposal to image the radio sky below 30 MHz",
    ],
    learn: [
      "Optical design and sensor selection",
      "Observational astrophysics and data analysis",
      "Writing proposals that win grants",
      "Turning a science question into an instrument requirement",
    ],
  },
  {
    slug: "mission-ops",
    team: "Mission Ops",
    name: "Mission Operations",
    tagline: "Flying the spacecraft once it is up there.",
    summary:
      "FCC licensing, pass planning, and trained console operators, so the few minutes a satellite is overhead actually count.",
    body: [
      "Building a satellite is half the job. Mission Ops handles the other half: licensing, procedures, pass planning, and the people trained to sit at a console and send commands correctly the first time.",
      "SCALAR will pass overhead several times a week, and each pass is short. Ops decides what happens during those minutes and writes the procedures everyone else follows.",
    ],
    working: [
      "FCC licensing and regulatory filings for SCALAR and GS-2",
      "Ground pass planning and operator procedures",
      "Recruiting and training licensed amateur radio operators",
    ],
    learn: [
      "Spectrum licensing and regulatory work",
      "Operational procedure writing",
      "Orbit and pass planning",
      "Getting your amateur radio license",
    ],
  },
  {
    slug: "business",
    team: "Business",
    name: "Business",
    tagline: "The side of a space program that is not an equation.",
    summary:
      "Funding, sponsorships, purchasing, and outreach. No engineering background needed, and every part we order runs through here.",
    body: [
      "Hardware costs money, and a student team lives on grants, sponsorships, and a budget somebody has to actually manage. Business handles funding, outreach, partnerships, and the case we make to the people who back us.",
      "You do not need an engineering background to work here, and the work is real. Every board we order and every trip we take runs through this team.",
    ],
    working: [
      "Budgets and purchasing across every active mission",
      "Sponsorship and grant relationships",
      "Outreach, communications, and design",
    ],
    learn: [
      "Budgeting and financial operations",
      "Grant and sponsorship writing",
      "Marketing, design, and communications",
      "Working directly with engineers on what things cost",
    ],
  },
  {
    slug: "exec",
    team: "Exec",
    name: "Executive",
    tagline: "Chief engineers, project management, and the people accountable for delivery.",
    summary:
      "The chief engineer from each discipline plus project management and finance. Sets standards, runs design reviews, answers for the schedule.",
    body: [
      "Exec is made up of the chief engineer for each discipline plus project management and finance. They set standards, run design reviews, and are accountable when a schedule slips.",
      "Every person on Exec came up through a subteam first. Nobody is appointed into it from outside.",
    ],
    working: [
      "Design review and engineering standards across all missions",
      "Schedule tracking and milestone planning across the mission portfolio",
      "Recruiting, onboarding, and subteam staffing",
    ],
    learn: [
      "Technical leadership across a discipline",
      "Project management with real deadlines",
      "Running design reviews",
      "Making calls with incomplete information",
    ],
  },
];

export function disciplineBySlug(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}

/** Members whose `teams` include this discipline. */
export function disciplineMembers(d: Discipline) {
  return members.filter((m) => m.teams.some((t) => slugify(t) === slugify(d.team)));
}
