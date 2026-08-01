export type RoadmapStatus = "done" | "active" | "planned";

/** Icon key — mapped to a lucide component by the consuming page. */
export type RoadmapIcon =
  | "rocket"
  | "balloon"
  | "antenna"
  | "notebook"
  | "satellite"
  | "file";

export type RoadmapItem = {
  date: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  icon?: RoadmapIcon;
  /** Surfaced on the homepage timeline. Everything renders on /roadmap. */
  featured?: boolean;
};

// Newest first. Single source of truth — /roadmap renders all of it, the
// homepage timeline renders the `featured` subset.
export const roadmap: RoadmapItem[] = [
  {
    date: "Feb 2027",
    title: "VECTOR proposal complete",
    description:
      "University Nanosatellite Program proposal draft finished, closing out the VECTOR concept phase.",
    status: "planned",
    icon: "notebook",
  },
  {
    date: "Oct 2026",
    title: "SCALAR environmental test report",
    description:
      "The final RIDE deliverable. Closes out SCALAR's requirements package with the launch provider.",
    status: "planned",
    icon: "file",
    featured: true,
  },
  {
    date: "Sep 2026",
    title: "SCALAR integration procedure",
    description:
      "Satellite integration procedure update and insurance inputs submitted to RIDE.",
    status: "planned",
    icon: "satellite",
  },
  {
    date: "Fall 2026",
    title: "VECTOR concept work begins",
    description:
      "Project kickoff, systems engineering and integration leads named, sensor and lens trade study opens.",
    status: "planned",
    icon: "rocket",
  },
  {
    date: "Aug 2026",
    title: "SCALAR mass properties final issue",
    description:
      "Final mass properties, constituents list, and the environmental test plan delivered to RIDE.",
    status: "active",
    icon: "satellite",
    featured: true,
  },
  {
    date: "Feb 2027",
    title: "GS-2 operational",
    description:
      "Second ground station assembled, tested, and ready to command SCALAR from the Crow Hall rooftop.",
    status: "planned",
    icon: "antenna",
  },
  {
    date: "2026",
    title: "GS-2 in assembly",
    description:
      "Antenna simulation, structures, and control software in progress across seven modules. Rooftop site selected.",
    status: "active",
    icon: "antenna",
    featured: true,
  },
  {
    date: "Late 2025",
    title: "GS-1 closed, GS-2 begins",
    description:
      "The team closed out GS-1 and restarted as GS-2 with a written requirements sheet, carrying forward its hardware, software, and lessons learned.",
    status: "done",
    icon: "antenna",
  },
  {
    date: "2026",
    title: "AIRIS in development",
    description:
      "Balloon-borne transient imaging payload. Full integration testing complete; flight opportunity pending.",
    status: "active",
    icon: "balloon",
    featured: true,
  },
  {
    date: "Jun 2026",
    title: "SCALAR range safety accepted",
    description:
      "Range safety requirements manual accepted, with ground operations and transport plans submitted.",
    status: "done",
    icon: "file",
  },
  {
    date: "Apr 2026",
    title: "SCALAR enters the RIDE program",
    description:
      "Payload program introduction, CAD model, and initial mass properties accepted by the launch provider.",
    status: "done",
    icon: "satellite",
    featured: true,
  },
  {
    date: "Oct 2024",
    title: "GS-1 PDRs",
    description: "Preliminary design reviews for the first ground station passed.",
    status: "done",
    icon: "antenna",
  },
  {
    date: "Aug 2024",
    title: "Team procedures formalized",
    description:
      "Engineering reviews, budgets, and responsible-engineering standards adopted.",
    status: "done",
    icon: "notebook",
  },
  {
    date: "Apr 2024",
    title: "SB-1 launch",
    description: "First mission: small balloon launched from Tisch Park.",
    status: "done",
    icon: "balloon",
    featured: true,
  },
  {
    date: "Jan 2024",
    title: "Club founded",
    description: "WashU Satellite founded with 11 initial members.",
    status: "done",
    icon: "rocket",
    featured: true,
  },
];

export const featuredRoadmap = roadmap.filter((r) => r.featured);
