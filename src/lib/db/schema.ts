import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const statusEnum = pgEnum("status", ["todo", "in_progress", "done"]);

export const pods = pgTable("pods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  podId: integer("pod_id").references(() => pods.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const epics = pgTable("epics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  podId: integer("pod_id")
    .notNull()
    .references(() => pods.id, { onDelete: "cascade" }),
  status: statusEnum("status").notNull().default("todo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  podId: integer("pod_id")
    .notNull()
    .references(() => pods.id, { onDelete: "cascade" }),
  epicId: integer("epic_id").references(() => epics.id, {
    onDelete: "set null",
  }),
  status: statusEnum("status").notNull().default("todo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  podId: integer("pod_id")
    .notNull()
    .references(() => pods.id, { onDelete: "cascade" }),
  storyId: integer("story_id").references(() => stories.id, {
    onDelete: "set null",
  }),
  assigneeId: integer("assignee_id").references(() => users.id, {
    onDelete: "set null",
  }),
  status: statusEnum("status").notNull().default("todo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const podsRelations = relations(pods, ({ many }) => ({
  users: many(users),
  epics: many(epics),
  stories: many(stories),
  tasks: many(tasks),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  pod: one(pods, { fields: [users.podId], references: [pods.id] }),
  tasks: many(tasks),
}));

export const epicsRelations = relations(epics, ({ one, many }) => ({
  pod: one(pods, { fields: [epics.podId], references: [pods.id] }),
  stories: many(stories),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  pod: one(pods, { fields: [stories.podId], references: [pods.id] }),
  epic: one(epics, { fields: [stories.epicId], references: [epics.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  pod: one(pods, { fields: [tasks.podId], references: [pods.id] }),
  story: one(stories, { fields: [tasks.storyId], references: [stories.id] }),
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
}));
