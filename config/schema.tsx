import { boolean, integer, json, pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  credits: integer(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const sessionsChatTable = pgTable("sessionsChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  language: varchar().default("English"),
  notes: text(),
  selectedDoctor: json(),
  conversation: json(),
  report: json(),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: varchar(),
  status: varchar().default("Pending"),
});

export const notificationsTable = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar().notNull(), // links to usersTable.email or clerk user id
  title: varchar().notNull(),
  message: text().notNull(),
  type: varchar().default("info"), // info, success, warning, error
  read: boolean().default(false),
  createdAt: timestamp().defaultNow(),
});
