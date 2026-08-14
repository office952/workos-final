import { Hono } from "hono";
import { cors } from "hono/cors";

export const HEALTH_SERVICE_NAME = "workos-final-api" as const;

export type HealthResponse = {
  status: "ok";
  service: typeof HEALTH_SERVICE_NAME;
};

const DEV_WEB_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
] as const;

export function createApp(): Hono {
  const app = new Hono();

  app.use(
    "/api/*",
    cors({
      origin: [...DEV_WEB_ORIGINS],
    }),
  );

  app.get("/api/health", (c) => {
    const body: HealthResponse = {
      status: "ok",
      service: HEALTH_SERVICE_NAME,
    };
    return c.json(body);
  });

  return app;
}
