export type RoadmapStatus = "done" | "active" | "planned";

export type RoadmapItem = {
  date: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
};

// Newest first.
export const roadmap: RoadmapItem[] = [
  {
    date: "2026",
    title: "AIRIS first flight",
    description: "Stratospheric balloon mission carrying the AIRIS payload.",
    status: "planned",
  },
  {
    date: "2026",
    title: "SCALAR design freeze",
    description: "Complete the critical design review for the SCALAR satellite bus.",
    status: "active",
  },
  {
    date: "2025",
    title: "Ground Station 1 (GS-1) operational",
    description: "First WashU Satellite ground station online for telemetry and command.",
    status: "active",
  },
  {
    date: "Oct 2024",
    title: "GS-1 PDRs",
    description: "Preliminary design reviews for the first ground station passed.",
    status: "done",
  },
  {
    date: "Aug 2024",
    title: "Team procedures formalized",
    description: "Engineering reviews, budgets, and responsible-engineering standards adopted.",
    status: "done",
  },
  {
    date: "Apr 2024",
    title: "SB-1 launch",
    description: "First mission: small balloon launched from Tisch Park.",
    status: "done",
  },
  {
    date: "Jan 2024",
    title: "Club founded",
    description: "WashU Satellite founded with 11 initial members.",
    status: "done",
  },
];
