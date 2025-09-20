import { Hono } from "hono";
import { cors } from "hono/cors";
import api from "./routes/api";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for frontend requests
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api", api);

export default app;
