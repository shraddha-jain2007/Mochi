import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  purpose: text("purpose").notNull(),
  minutes: integer("minutes").notNull(),
  date: text("date").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// ── Visitor tracking (admin analytics) ──────────────────────────────────────
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  visitorId: text("visitor_id").notNull().unique(),
  firstSeen: text("first_seen").notNull(),
  lastSeen: text("last_seen").notNull(),
  visitCount: integer("visit_count").notNull().default(1),
});

export type Visitor = typeof visitors.$inferSelect;
