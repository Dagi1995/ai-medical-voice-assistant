import { customType, integer, json, pgTable, text, varchar, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

// Custom vector type for pgvector
const vector = customType<{ data: number[]; config: { dimensions: number } }>({
  dataType(config) {
    return `vector(${config?.dimensions || 768})`;
  },
  toDriver(value: number[]) {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: any) {
    return value
      .replace(/[\[\]]/g, "")
      .split(",")
      .map((v: string) => parseFloat(v));
  },
});


export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  credits: integer().default(0),
  role: varchar({ length: 20 }).default("Patient"), // Patient, Admin
  status: varchar({ length: 20 }).default("Active"), // Active, Blocked
  lastActive: varchar(),
  imageUrl: varchar(),
});

export const aiDoctorsTable = pgTable("aiDoctors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  specialty: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  agentPrompt: text().notNull(),
  voiceId: varchar({ length: 100 }),
  imageUrl: text(),
  hasRag: boolean().default(false),
  createdOn: varchar(),
});

export const aiDoctorKnowledgeTable = pgTable("aiDoctorKnowledge", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  doctorId: integer().references(() => aiDoctorsTable.id, { onDelete: "cascade" }),
  content: text().notNull(),
  embedding: vector({ dimensions: 3072 }), // Updated to 3072 for text-embedding-004
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
