/**
 * TEMPORARY. The coordinated design-team info sessions on 30 August 2026. Delete this file and
 * src/routes/info-sessions.tsx once the day has passed.
 *
 * Instagram handles were each checked against the live profile or the team's own site rather than
 * pattern-matched, because a wrong one sends someone to a stranger's profile.
 *
 * Ursaworks is the one to double-check. @washu.ursaworks is posting through August 2026 and calls
 * itself the official team, but McKelvey Connect still lists @ursaworks.robotics. The active account
 * is the better bet; if the directory turns out to be right, this is the line to change.
 */
export type InfoSession = {
  /** 24-hour start, used for sorting and for the "happening now" state. */
  start: string;
  end: string;
  label: string;
  team: string;
  instagram?: string;
  /** Set on the entry that is ours, so the page can highlight it without special-casing a name. */
  ours?: boolean;
  /** Breaks are not a team and are rendered differently. */
  break?: boolean;
};

export const SESSION_DATE = "Sunday, August 30";
export const SESSION_LOCATION = "Lopata 101";

export const INFO_SESSIONS: InfoSession[] = [
  { start: "10:00", end: "11:00", label: "10:00 – 11:00", team: "Racing", instagram: "https://www.instagram.com/washuracing/" },
  { start: "11:00", end: "12:00", label: "11:00 – 12:00", team: "Robotics", instagram: "https://www.instagram.com/washurobotics/" },
  {
    start: "12:00",
    end: "12:30",
    label: "12:00 – 12:30",
    team: "Lunch break",
    break: true,
  },
  { start: "12:30", end: "13:15", label: "12:30 – 1:15", team: "VTOL", instagram: "https://www.instagram.com/washu.vtol/" },
  { start: "13:15", end: "14:00", label: "1:15 – 2:00", team: "Ursaworks", instagram: "https://www.instagram.com/washu.ursaworks/" },
  { start: "14:00", end: "15:00", label: "2:00 – 3:00", team: "Rocketry", instagram: "https://www.instagram.com/wurocketry/" },
  { start: "15:00", end: "16:00", label: "3:00 – 4:00", team: "DBF", instagram: "https://www.instagram.com/washudbf/" },
  { start: "16:00", end: "16:30", label: "4:00 – 4:30", team: "TOM", instagram: "https://www.instagram.com/tom.washu/" },
  { start: "16:30", end: "17:00", label: "4:30 – 5:00", team: "EWB", instagram: "https://www.instagram.com/ewbwashu/" },
  {
    start: "17:00",
    end: "18:00",
    label: "5:00 – 6:00",
    team: "Satellite",
    instagram: "https://www.instagram.com/washusatellite/",
    ours: true,
  },
];
