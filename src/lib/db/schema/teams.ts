import {
  date,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { v7 } from "uuid";

export const team = pgTable("team", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text("name").notNull().unique(),
  description: text("description"),
  applicationUrl: text("application_url")
});

export const projectIconEnum = pgEnum("project_icon", [
  "empty",
  "satelllite",
  "telescope",
  "antenna",
]);

export const project = pgTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text("name").notNull(),
  acronym: text("acronym").notNull(),
  description: text("description"),
  descriptionShort: text("short"),
  icon: projectIconEnum("icon").notNull().default("empty"),
});

export const projectStage = pgTable("project_stage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v7()),
  projectId: text("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const role = pgTable(
  "role",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => v7()),
    name: text("name").notNull(),
    rank: integer("rank").notNull(),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    reportsTo: text("reports_to"),
  },
  (table) => [
    foreignKey({
      columns: [table.reportsTo],
      foreignColumns: [table.id],
      name: "role_reports_to_fk",
    }).onDelete("no action"),
  ]
);
