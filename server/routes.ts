import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const ADMIN_KEY = process.env.ADMIN_KEY || "mochi-admin-secret";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.sessions.list.path, async (req, res) => {
    const allSessions = await storage.getSessions();
    res.json(allSessions);
  });

  app.post(api.sessions.create.path, async (req, res) => {
    try {
      const input = api.sessions.create.input.parse(req.body);
      const newSession = await storage.createSession(input);
      res.status(201).json(newSession);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // ── Visitor tracking ──────────────────────────────────────────────────────
  app.post("/api/track", async (req, res) => {
    try {
      const { visitorId } = req.body;
      if (!visitorId || typeof visitorId !== "string") return res.status(400).json({ ok: false });
      await storage.upsertVisitor(visitorId.slice(0, 64));
      res.json({ ok: true });
    } catch {
      res.json({ ok: false });
    }
  });

  // ── Admin stats ───────────────────────────────────────────────────────────
  app.get("/api/admin/stats", async (req, res) => {
    if (req.query.key !== ADMIN_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
