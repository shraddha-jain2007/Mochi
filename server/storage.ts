import { db } from "./db";
import { sessions, type InsertSession, type Session } from "@shared/schema";

export interface IStorage {
  getSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
}

export class DatabaseStorage implements IStorage {
  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessions);
  }
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db.insert(sessions).values(session).returning();
    return newSession;
  }
}

export const storage = new DatabaseStorage();
