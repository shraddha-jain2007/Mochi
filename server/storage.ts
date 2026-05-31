import { db } from "./db";
import { sessions, visitors, type InsertSession, type Session, type Visitor } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  upsertVisitor(visitorId: string): Promise<void>;
  getVisitorStats(): Promise<{
    totalUnique: number;
    totalVisits: number;
    todayUnique: number;
    recentVisitors: Visitor[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessions);
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions).values(session).returning();
    return newSession;
  }

  async upsertVisitor(visitorId: string): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.select().from(visitors).where(eq(visitors.visitorId, visitorId)).limit(1);
    if (existing.length > 0) {
      await db.update(visitors)
        .set({ lastSeen: now, visitCount: sql`${visitors.visitCount} + 1` })
        .where(eq(visitors.visitorId, visitorId));
    } else {
      await db.insert(visitors).values({ visitorId, firstSeen: now, lastSeen: now, visitCount: 1 });
    }
  }

  async getVisitorStats() {
    const all = await db.select().from(visitors);
    const todayStr = new Date().toISOString().split("T")[0];
    const todayUnique = all.filter(v => v.lastSeen.startsWith(todayStr)).length;
    const totalVisits = all.reduce((sum, v) => sum + v.visitCount, 0);
    const recent = [...all].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)).slice(0, 15);
    return { totalUnique: all.length, totalVisits, todayUnique, recentVisitors: recent };
  }
}

export const storage = new DatabaseStorage();
