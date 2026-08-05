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
  /**
   * Sort key, "YYYY-MM". `date` is written for humans ("Fall 2026", "Late
   * 2025") so it cannot be parsed reliably — this is what actually orders the
   * timeline. Pick the month the item lands in.
   */
  sort: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  icon?: RoadmapIcon;
  /** Surfaced on the homepage timeline. Everything renders on /roadmap. */
  featured?: boolean;
};

// Newest first. Single source of truth — /roadmap renders all of it, the
// homepage timeline renders the `featured` subset.
//
// This is public. We are under NDA covering our launch provider and the
// deliverables package tied to it, so do not name either, and do not publish
// deliverable names or their due dates. Describe our own engineering progress
// instead. Check with program leadership before adding SCALAR flight dates.
export const roadmap: RoadmapItem[] = [
  {
    date: "2027+",
    sort: "2027-06",
    title: "VECTOR development begins",
    description:
      "Versatile Educational Controls Testbed for Optical Response — the next step after SCALAR, carrying configurable algorithms for transient observation.",
    status: "planned",
    icon: "rocket",
  },
  {
    date: "Feb 2027",
    sort: "2027-02",
    title: "SCALAR launch",
    description:
      "Our first satellite reaches orbit: a 1U CubeSat demonstrating attitude control with magnetic torque rods, bus endurance, and ground-side mission operations.",
    status: "planned",
    icon: "satellite",
    featured: true,
  },
  {
    date: "Feb 2027",
    sort: "2027-02",
    title: "VECTOR proposal complete",
    description:
      "University Nanosatellite Program proposal draft finished, closing out the VECTOR concept phase.",
    status: "planned",
    icon: "notebook",
  },
  {
    date: "Feb 2027",
    sort: "2027-01",
    title: "GS-2 operational",
    description:
      "Second ground station assembled, tested, and ready to command SCALAR from the Crow Hall rooftop.",
    status: "planned",
    icon: "antenna",
  },
  {
    date: "Late 2026",
    sort: "2026-11",
    title: "SCALAR protoflight testing",
    description:
      "Vibration and thermal testing to qualify the flight unit for launch.",
    status: "planned",
    icon: "file",
    featured: true,
  },
  {
    date: "Fall 2026",
    sort: "2026-09",
    title: "VECTOR concept work begins",
    description:
      "Project kickoff, systems engineering and integration leads named, sensor and lens trade study opens.",
    status: "planned",
    icon: "rocket",
  },
  {
    date: "Aug 2026",
    sort: "2026-08",
    title: "SCALAR engineering model build",
    description:
      "The integrated 3D prototype is done and the full engineering model enters machining and assembly, with mass properties and the test plan settled.",
    status: "active",
    icon: "satellite",
    featured: true,
  },
  {
    date: "2026",
    sort: "2026-07",
    title: "GS-2 in assembly",
    description:
      "Antenna simulation, structures, and control software in progress across seven modules, aimed at rapid data downlink. Rooftop site selected.",
    status: "active",
    icon: "antenna",
    featured: true,
  },
  {
    date: "Jun 2026",
    sort: "2026-06",
    title: "SCALAR range safety review passed",
    description:
      "Range safety requirements accepted, with ground operations and transport planning complete.",
    status: "done",
    icon: "file",
  },
  {
    date: "2026",
    sort: "2026-05",
    title: "AIRIS in development",
    description:
      "A fast-slewing optical telescope flying on ADAPT, a NASA near-space balloon over Antarctica, imaging gamma-ray burst afterglows for the multi-messenger collaboration.",
    status: "active",
    icon: "balloon",
    featured: true,
  },
  {
    date: "Apr 2026",
    sort: "2026-04",
    title: "SCALAR passes program entry review",
    description:
      "Initial design package accepted, moving SCALAR from concept into flight development.",
    status: "done",
    icon: "satellite",
    featured: true,
  },
  {
    date: "Late 2025",
    sort: "2025-10",
    title: "GS-1 closed, GS-2 begins",
    description:
      "The team closed out GS-1 and restarted as GS-2 with a written requirements sheet, carrying forward its hardware, software, and lessons learned.",
    status: "done",
    icon: "antenna",
  },
  {
    date: "Oct 2024",
    sort: "2024-10",
    title: "GS-1 PDRs",
    description: "Preliminary design reviews for the first ground station passed.",
    status: "done",
    icon: "antenna",
  },
  {
    date: "Aug 2024",
    sort: "2024-08",
    title: "Team procedures formalized",
    description:
      "Engineering reviews, budgets, and responsible-engineering standards adopted.",
    status: "done",
    icon: "notebook",
  },
  {
    date: "Apr 2024",
    sort: "2024-04",
    title: "SB-1 launch",
    description: "First mission: small balloon launched from Tisch Park.",
    status: "done",
    icon: "balloon",
    featured: true,
  },
  {
    date: "Jan 2024",
    sort: "2024-01",
    title: "Club founded",
    description: "WashU Satellite founded with 11 initial members.",
    status: "done",
    icon: "rocket",
    featured: true,
  },
];

export const featuredRoadmap = roadmap.filter((r) => r.featured);

/** Oldest first — the order the horizontal timeline reads, left to right. */
export const chronologicalRoadmap = [...roadmap].sort((a, b) =>
  a.sort.localeCompare(b.sort),
);
