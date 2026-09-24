interface TurnstileOptions {
  sitekey: string;
  theme: "dark";
  size: "flexible";
  action: string;
  appearance: "interaction-only";
  "response-field-name": string;
  callback: () => void;
  "error-callback": () => boolean;
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
  reset: (widget: string) => void;
  remove: (widget: string) => void;
}

const turnstileWindow = window as Window & {
  turnstile?: TurnstileApi;
  nipoTurnstileReady?: () => void;
};
let pending: Promise<TurnstileApi> | undefined;

/** Shared, retryable loader. The callback fires when the API is ready to render. */
export function loadTurnstile(): Promise<TurnstileApi> {
  if (pending) return pending;
  pending = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      delete turnstileWindow.nipoTurnstileReady;
      reject(new Error("The security check could not load. Please try again."));
    };
    const timeout = setTimeout(fail, 15000);
    turnstileWindow.nipoTurnstileReady = () => {
      clearTimeout(timeout);
      delete turnstileWindow.nipoTurnstileReady;
      if (turnstileWindow.turnstile) resolve(turnstileWindow.turnstile);
      else fail();
    };
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=nipoTurnstileReady";
    script.async = true;
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    pending = undefined;
    throw error;
  });
  return pending;
}
