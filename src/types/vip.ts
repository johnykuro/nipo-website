export interface VipSignupRequest {
  firstName: string;
  email: string;
  consent: true;
  turnstileToken: string;
  website: string;
  startedAt: number;
}

export type VipSignupErrorCode =
  | "CONFIGURATION"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "ORIGIN"
  | "RATE_LIMITED"
  | "VALIDATION"
  | "VERIFICATION"
  | "UPSTREAM";

export type VipSignupResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      code: VipSignupErrorCode;
      message: string;
      fields?: Partial<Record<"firstName" | "email" | "consent" | "turnstile", string>>;
    };
