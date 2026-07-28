import type {
  VipSignupErrorCode,
  VipSignupRequest,
  VipSignupResponse,
} from "../src/types/vip";

export interface Env {
  ASSETS: Fetcher;
  SIGNUP_RATE_LIMITER: RateLimit;
  BREVO_API_KEY: string;
  BREVO_LIST_ID: string;
  TURNSTILE_SECRET_KEY: string;
  SITE_ORIGIN: string;
}

interface TurnstileResponse {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
} as const;

function json(
  body: VipSignupResponse,
  status: number,
  extraHeaders?: HeadersInit,
): Response {
  return Response.json(body, {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function error(
  code: VipSignupErrorCode,
  message: string,
  status: number,
  fields?: Extract<VipSignupResponse, { ok: false }>["fields"],
): Response {
  return json({ ok: false, code, message, fields }, status);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validatePayload(value: unknown):
  | { ok: true; payload: VipSignupRequest }
  | {
      ok: false;
      fields: Extract<VipSignupResponse, { ok: false }>["fields"];
    } {
  if (!isRecord(value)) {
    return { ok: false, fields: { email: "Enter a valid email address." } };
  }

  const firstName = typeof value.firstName === "string" ? value.firstName.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const consent = value.consent === true;
  const turnstileToken =
    typeof value.turnstileToken === "string" ? value.turnstileToken.trim() : "";
  const website = typeof value.website === "string" ? value.website.trim() : "";
  const startedAt = typeof value.startedAt === "number" ? value.startedAt : 0;
  const fields: Extract<VipSignupResponse, { ok: false }>["fields"] = {};

  if (
    firstName.length < 1 ||
    firstName.length > 80 ||
    /[\u0000-\u001F\u007F]/u.test(firstName)
  ) {
    fields.firstName = "Enter your first name.";
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)
  ) {
    fields.email = "Enter a valid email address.";
  }

  if (!consent) {
    fields.consent = "Please confirm that you would like to receive NIPO updates.";
  }

  if (!turnstileToken || turnstileToken.length > 2048) {
    fields.turnstile = "Please complete the security check.";
  }

  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    fields.turnstile = "Please refresh the page and try again.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    payload: {
      firstName,
      email,
      consent: true,
      turnstileToken,
      website,
      startedAt,
    },
  };
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env,
): Promise<boolean> {
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileResponse;
  if (!result.success || (result.action && result.action !== "vip_signup")) {
    return false;
  }

  const expectedHostname = new URL(env.SITE_ORIGIN).hostname;
  const isLocal = expectedHostname === "localhost" || expectedHostname === "127.0.0.1";
  return isLocal || !result.hostname || result.hostname === expectedHostname;
}

async function createBrevoContact(payload: VipSignupRequest, env: Env): Promise<boolean> {
  const listId = Number.parseInt(env.BREVO_LIST_ID, 10);
  if (!Number.isSafeInteger(listId) || listId <= 0) {
    return false;
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: payload.email,
      attributes: {
        FNAME: payload.firstName,
      },
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    console.error("Brevo contact request failed", {
      status: response.status,
      requestId:
        response.headers.get("x-request-id") ?? response.headers.get("cf-ray") ?? "unknown",
    });
  }

  return response.ok;
}

function configurationIsValid(env: Env): boolean {
  return Boolean(
    env.BREVO_API_KEY &&
      env.BREVO_LIST_ID &&
      env.TURNSTILE_SECRET_KEY &&
      env.SITE_ORIGIN,
  );
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname !== "/api/vip-signup") {
    if (url.pathname.startsWith("/api/")) {
      return error("NOT_FOUND", "This endpoint does not exist.", 404);
    }
    return env.ASSETS.fetch(request);
  }

  if (request.method !== "POST") {
    return error("METHOD_NOT_ALLOWED", "Use POST for this endpoint.", 405, undefined);
  }

  if (!configurationIsValid(env)) {
    return error(
      "CONFIGURATION",
      "VIP signup is temporarily unavailable. Please try again later.",
      503,
    );
  }

  const origin = request.headers.get("Origin");
  if (origin !== env.SITE_ORIGIN) {
    return error("ORIGIN", "This request could not be accepted.", 403);
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);
  if (!contentType.includes("application/json") || contentLength > 8_192) {
    return error("VALIDATION", "Check your details and try again.", 400);
  }

  const ipAddress = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const rateLimit = await env.SIGNUP_RATE_LIMITER.limit({ key: ipAddress });
  if (!rateLimit.success) {
    return error(
      "RATE_LIMITED",
      "Too many attempts. Please wait a minute and try again.",
      429,
      undefined,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("VALIDATION", "Check your details and try again.", 400);
  }

  const validated = validatePayload(body);
  if (!validated.ok) {
    return error(
      "VALIDATION",
      "Check the highlighted fields and try again.",
      400,
      validated.fields,
    );
  }

  const payload = validated.payload;

  // Give automated honeypot submissions a plausible success response without touching Brevo.
  if (payload.website) {
    return json({ ok: true, message: "Welcome to NIPO. You’re on the list." }, 201);
  }

  const elapsed = Date.now() - payload.startedAt;
  if (elapsed < 1_500 || elapsed > 86_400_000) {
    return error(
      "VERIFICATION",
      "Please refresh the page and try again.",
      403,
      { turnstile: "The security check expired." },
    );
  }

  let verified = false;
  try {
    verified = await verifyTurnstile(payload.turnstileToken, request, env);
  } catch {
    verified = false;
  }

  if (!verified) {
    return error(
      "VERIFICATION",
      "The security check could not be completed. Please try again.",
      403,
      { turnstile: "Please complete the security check again." },
    );
  }

  const created = await createBrevoContact(payload, env);
  if (!created) {
    return error(
      "UPSTREAM",
      "We couldn’t add you just now. Please try again in a moment.",
      502,
    );
  }

  return json({ ok: true, message: "Welcome to NIPO. You’re on the list." }, 201);
}

export default {
  fetch(request, env): Promise<Response> {
    return handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
