import { afterEach, describe, expect, it, vi } from "vitest";
import type { Context } from "@netlify/functions";
import handler from "../functions/vip-signup.mts";
import { handleRequest, type Env } from "../../worker/index";

const origin = "https://nipobraza.co.uk";
function request(location?: unknown) {
  return new Request(origin + "/api/vip-signup", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ firstName: "Test", email: "test@example.com", consent: true,
      turnstileToken: "test-token", website: "", startedAt: Date.now() - 3000, location }),
  });
}
const handlers = {
  Netlify: (req: Request, env: Record<string, string | undefined>) => {
    vi.stubGlobal("Netlify", { env: { get: (key: string) => env[key] } });
    return handler(req, {} as Context);
  },
  Cloudflare: (req: Request, env: Record<string, string | undefined>) => handleRequest(req, {
    ...env, ASSETS: { fetch: vi.fn() }, SIGNUP_RATE_LIMITER: { limit: async () => ({ success: true }) },
  } as unknown as Env),
};
describe.each(Object.entries(handlers))("%s location signups", (_name, run) => {
  const env = { SITE_ORIGIN: origin, BREVO_API_KEY: "test-only", BREVO_LIST_ID: "42",
    BREVO_HARROGATE_LIST_ID: "13", TURNSTILE_SECRET: "test-only" };
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it.each([201, 204])("routes new or existing Harrogate contacts to list 13 (provider status %s)", async status => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ success: true, hostname: "nipobraza.co.uk" }))
      .mockResolvedValueOnce(new Response(null, { status }));
    vi.stubGlobal("fetch", fetch);
    expect((await run(request("harrogate"), env)).status).toBe(201);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toBe("https://api.brevo.com/v3/contacts");
    // No list unlinking, blacklist changes, email trigger or client-selected list.
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ email: "test@example.com",
      attributes: { FNAME: "Test" }, listIds: [13], updateEnabled: true });
  });
  it.each([undefined, "newcastle"])("retains the existing audience for %s", async location => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ success: true }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    expect((await run(request(location), { ...env, BREVO_HARROGATE_LIST_ID: undefined })).status).toBe(201);
    expect(JSON.parse(fetch.mock.calls[1][1].body).listIds).toEqual([42]);
  });
  it.each(["unknown", "13", null, {}, 13])("rejects an invalid location before external calls: %s", async location => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    expect((await run(request(location), env)).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([undefined, "", "0", "13wrong", "-1", "1.3", "9007199254740992"])("does not fall back when Harrogate configuration is %s", async list => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const response = await run(request("harrogate"), { ...env, BREVO_HARROGATE_LIST_ID: list });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, code: "CONFIGURATION" });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("makes repeat signups idempotent and returns retryable provider errors", async () => {
    const fetch = vi.fn().mockImplementation(async url => String(url).includes("turnstile")
      ? Response.json({ success: true }) : new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    expect((await run(request("harrogate"), env)).status).toBe(201);
    expect((await run(request("harrogate"), env)).status).toBe(201);
    fetch.mockImplementation(async url => String(url).includes("turnstile")
      ? Response.json({ success: true }) : new Response(null, { status: 500 }));
    expect((await run(request("harrogate"), env)).status).toBe(502);
  });
});
