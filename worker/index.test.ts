import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VipSignupResponse } from "../src/types/vip";
import { handleRequest, type Env } from "./index";

const originalFetch = globalThis.fetch;

const validPayload = {
  firstName: "Aiko",
  email: "aiko@example.com",
  consent: true,
  turnstileToken: "valid-token",
  website: "",
  startedAt: Date.now() - 3_000,
};

function createEnv(overrides: Partial<Env> = {}): Env {
  return {
    ASSETS: {
      fetch: vi.fn(async () => new Response("asset")),
      connect: vi.fn(),
    } as unknown as Fetcher,
    SIGNUP_RATE_LIMITER: {
      limit: vi.fn(async () => ({ success: true })),
    } as unknown as RateLimit,
    BREVO_API_KEY: "brevo-key",
    BREVO_LIST_ID: "42",
    TURNSTILE_SECRET_KEY: "turnstile-secret",
    SITE_ORIGIN: "https://nipo.example",
    ...overrides,
  };
}

function signupRequest(body: unknown = validPayload, headers: HeadersInit = {}): Request {
  return new Request("https://nipo.example/api/vip-signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://nipo.example",
      "CF-Connecting-IP": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("VIP signup Worker", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(validPayload.startedAt + 3_000);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("verifies Turnstile and creates a Brevo contact", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ success: true, hostname: "nipo.example", action: "vip_signup" }),
      )
      .mockResolvedValueOnce(Response.json({ id: 21 }, { status: 201 }));
    globalThis.fetch = fetchMock;

    const response = await handleRequest(signupRequest(), createEnv());
    const body = (await response.json()) as VipSignupResponse;

    expect(response.status).toBe(201);
    expect(body).toEqual({ ok: true, message: "Welcome to NIPO. You’re on the list." });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const brevoRequest = fetchMock.mock.calls[1];
    expect(brevoRequest[0]).toBe("https://api.brevo.com/v3/contacts");
    expect(JSON.parse(brevoRequest[1].body)).toEqual({
      email: "aiko@example.com",
      attributes: { FNAME: "Aiko" },
      listIds: [42],
      updateEnabled: true,
    });
  });

  it("returns field errors for invalid input", async () => {
    globalThis.fetch = vi.fn();
    const response = await handleRequest(
      signupRequest({ ...validPayload, firstName: "", email: "bad", consent: false }),
      createEnv(),
    );
    const body = (await response.json()) as Extract<VipSignupResponse, { ok: false }>;

    expect(response.status).toBe(400);
    expect(body.fields).toMatchObject({
      firstName: expect.any(String),
      email: expect.any(String),
      consent: expect.any(String),
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without contacting external services", async () => {
    globalThis.fetch = vi.fn();
    const response = await handleRequest(
      signupRequest({ ...validPayload, website: "https://spam.example" }),
      createEnv(),
    );

    expect(response.status).toBe(201);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects a mismatched origin", async () => {
    const response = await handleRequest(
      signupRequest(validPayload, { Origin: "https://attacker.example" }),
      createEnv(),
    );
    expect(response.status).toBe(403);
  });

  it("returns 429 when the rate limit is exceeded", async () => {
    const response = await handleRequest(
      signupRequest(),
      createEnv({
        SIGNUP_RATE_LIMITER: {
          limit: vi.fn(async () => ({ success: false })),
        } as unknown as RateLimit,
      }),
    );

    expect(response.status).toBe(429);
  });

  it("rejects failed or expired Turnstile verification", async () => {
    globalThis.fetch = vi.fn(async () =>
      Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    );
    const response = await handleRequest(signupRequest(), createEnv());

    expect(response.status).toBe(403);
    const body = (await response.json()) as Extract<VipSignupResponse, { ok: false }>;
    expect(body.code).toBe("VERIFICATION");
  });

  it("returns a user-safe error when Brevo fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ success: true, hostname: "nipo.example", action: "vip_signup" }),
      )
      .mockResolvedValueOnce(Response.json({ message: "failure" }, { status: 500 }));
    const response = await handleRequest(signupRequest(), createEnv());

    expect(response.status).toBe(502);
    const body = (await response.json()) as Extract<VipSignupResponse, { ok: false }>;
    expect(body.code).toBe("UPSTREAM");
  });

  it("serves assets for non-API requests", async () => {
    const env = createEnv();
    const response = await handleRequest(new Request("https://nipo.example/privacy"), env);

    expect(await response.text()).toBe("asset");
    expect(env.ASSETS.fetch).toHaveBeenCalledOnce();
  });
});
