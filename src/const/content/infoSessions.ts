/**
 * TEMPORARY. The coordinated design-team info sessions on 30 August 2026. Delete this file and
 * src/routes/info-sessions.tsx once the day has passed.
 *
 * Instagram handles are only listed where the account was actually verified. A wrong link sends
 * someone to a stranger's profile, which is worse than no link, so unverified teams simply have
 * none rather than a plausible guess.
 */
export type InfoSession = {
  /** 24-hour start, used for sorting and for the "happening now" state. */
  start: string;
  end: string;
  label: string;
  team: string;
  instagram?: string;
  /** Set on the entry that is ours, so the page can say so without special-casing a name. */
  ours?: boolean;
  /** Breaks are not a team and are rendered differently. */
  break?: boolean;
  note?: string;
};

export const SESSION_DATE = "Sunday, August 30";
export const SESSION_LOCATION = "Lopata 101";

export const INFO_SESSIONS: InfoSession[] = [
  { start: "10:00", end: "11:00", label: "10:00 – 11:00", team: "Racing" },
  { start: "11:00", end: "12:00", label: "11:00 – 12:00", team: "Robotics" },
  {
    start: "12:00",
    end: "12:30",
    label: "12:00 – 12:30",
    team: "Lunch break",
    break: true,
    note: "Potentially catered",
  },
  { start: "12:30", end: "13:15", label: "12:30 – 1:15", team: "VTOL" },
  { start: "13:15", end: "14:00", label: "1:15 – 2:00", team: "Ursaworks" },
  { start: "14:00", end: "15:00", label: "2:00 – 3:00", team: "Rocketry" },
  { start: "15:00", end: "16:00", label: "3:00 – 4:00", team: "DBF" },
  { start: "16:00", end: "16:30", label: "4:00 – 4:30", team: "TOM" },
  { start: "16:30", end: "17:00", label: "4:30 – 5:00", team: "EWB" },
  {
    start: "17:00",
    end: "18:00",
    label: "5:00 – 6:00",
    team: "Satellite",
    instagram: "https://www.instagram.com/washusatellite/",
    ours: true,
  },
];
