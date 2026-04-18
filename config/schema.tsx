import { integer, json, pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

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
});
