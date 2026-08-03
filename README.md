# NIPO coming-soon website

A static Astro 6 launch site with a Cloudflare Worker endpoint for Brevo VIP-list capture.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and add public build-time values.
3. Copy `.dev.vars.example` to `.dev.vars` and add Worker secrets.
4. Run `pnpm dev` for frontend work.
5. Run `pnpm cf:dev` for an end-to-end Worker preview.

The Astro development server proxies `/api/*` to Wrangler on port `8787`. When testing
the complete signup flow with hot reload, run `wrangler dev` and `pnpm dev` in separate
terminals.

## Production configuration

Before deploying:

- Replace the placeholder `PUBLIC_SITE_URL` and `SITE_ORIGIN`.
- Add the direct Vimeo video URL and verify it supports browser playback, CORS, and byte ranges.
- Replace the temporary SVG poster with a frame approved from the final footage.
- Supply the production Brevo list ID and ensure the `FNAME` contact attribute exists.
- Create a production Turnstile widget restricted to the final hostname.
- Set `BREVO_API_KEY` and `TURNSTILE_SECRET` with `wrangler secret put`.
- Replace the rate-limit namespace ID if `1001` is already used in the Cloudflare account.
- Add the approved privacy contact and have the privacy copy reviewed before launch.
- Add social URLs when the accounts are ready; blank URLs remain non-interactive.

Run `pnpm check`, `pnpm test`, and `pnpm build` before `pnpm deploy`.

## Netlify deployment

The same static Astro site can run on Netlify, with the VIP signup handled by
`netlify/functions/vip-signup.ts` at `/api/vip-signup`.

1. Link or create the site with `npx netlify-cli init --manual`.
2. Set `BREVO_API_KEY`, `BREVO_LIST_ID`, `TURNSTILE_SECRET`, and `SITE_ORIGIN`
   in Netlify. Set the public build variables from `.env.example` there as well.
3. Add the Netlify hostname to the production Turnstile widget's allowed hostnames.
4. Run `pnpm netlify:deploy` for a production deploy.

Use `pnpm netlify:dev` to test the Astro site and function together locally.
