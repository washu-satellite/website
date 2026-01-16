import { date, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { v7 } from "uuid";
import { team } from "./teams";

export const profile = pgTable("profile", {
  id: text("id").primaryKey().$defaultFn(() => v7()),
  userId: text("author_id").references(() => user.id).unique(),
  fccCallsign: text("fcc_callsign"),
  bio: text("bio"),
  membershipStatus: text("membership_status"),
  linkedIn: text("linkedin"),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  memberSince: date("member_since").notNull(),
  teamId: text("team_id").references(() => team.id, { onDelete: "no action" })
});