import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "@netlify/functions";
import handler from "../functions/vip-signup.mts";

const env: Record<string, string> = {
  BREVO_API_KEY: "test-only", BREVO_LIST_ID: "42", TURNSTILE_SECRET: "test-only",
  SITE_ORIGIN: "https://nipobraza.co.uk",
};
const request = (overrides = {}) => new Request(env.SITE_ORIGIN + "/api/vip-signup", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: env.SITE_ORIGIN },
  body: JSON.stringify({ firstName: "Test", email: "test@example.com", consent: true,
    turnstileToken: "test-token", website: "", startedAt: Date.now() - 3000, ...overrides }),
});
const context = {} as Context;
describe("Netlify VIP signup", () => {
  beforeEach(() => vi.stubGlobal("Netlify", { env: { get: (key: string) => env[key] } }));
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it("verifies the challenge and adds the contact to the configured list", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ success: true, hostname: "nipobraza.co.uk", action: "turnstile-spin-v2" }))
      .mockResolvedValueOnce(Response.json({ id: 1 }, { status: 201 }));
    vi.stubGlobal("fetch", fetch);
    const response = await handler(request(), context);
    expect(response.status).toBe(201);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({ listIds: [42], email: "test@example.com", updateEnabled: true });
  });
  it("returns a retryable JSON response when Brevo cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(Response.json({ success: true, hostname: "nipobraza.co.uk" }))
      .mockRejectedValueOnce(new Error("network failure")));
    const response = await handler(request(), context);
    expect(response.status).toBe(502);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ ok: false, code: "UPSTREAM" });
  });
  it("rejects invalid fields before any external call", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const response = await handler(request({ consent: false, email: "invalid" }), context);
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects a challenge issued for another hostname", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ success: true, hostname: "other.example" }));
    vi.stubGlobal("fetch", fetch);
    expect((await handler(request(), context)).status).toBe(403);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("returns a configuration error when secrets are unavailable", async () => {
    vi.stubGlobal("Netlify", { env: { get: () => undefined } });
    const response = await handler(request(), context);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "CONFIGURATION" });
  });
});
