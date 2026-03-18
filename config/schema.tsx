import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { report } from "process";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
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
});
