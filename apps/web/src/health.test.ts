import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHealth } from "./health";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchHealth", () => {
  it("maps a real ok payload to connected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ status: "ok", service: "workos-final-api" }),
          { status: 200 },
        ),
      ),
    );

    await expect(fetchHealth()).resolves.toEqual({ kind: "connected" });
  });

  it("maps a failed request to unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(fetchHealth()).resolves.toEqual({ kind: "unavailable" });
  });
});
