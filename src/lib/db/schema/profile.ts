import { date, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./user";

export const profile = pgTable("profile", {
  userId: text("author_id").references(() => user.id).unique(),
  fccCallsign: text("fcc_callsign"),
  bio: text("bio"),
  membershipStatus: text("membership_status"),
  linkedIn: text("linkedin"),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  memberSince: date("member_since").notNull()
});