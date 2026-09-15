/** Shared by the Astro build and release checks. Never use a preview URL as canonical. */
export function deploymentConfig(env = {}) {
  const site = new URL(env.PUBLIC_SITE_URL?.trim() || "https://nipobraza.co.uk");
  if (site.protocol !== "https:" || site.username || site.password || site.port ||
      site.pathname !== "/" || site.search || site.hash) {
    throw new Error("PUBLIC_SITE_URL must be a HTTPS origin, without a path, query or credentials.");
  }
  if (env.PUBLIC_NOINDEX && !["true", "false"].includes(env.PUBLIC_NOINDEX)) {
    throw new Error("PUBLIC_NOINDEX must be true or false.");
  }
  const preview = Boolean(env.CONTEXT && env.CONTEXT !== "production") ||
    Boolean(env.CF_PAGES_BRANCH && env.PRODUCTION_BRANCH && env.CF_PAGES_BRANCH !== env.PRODUCTION_BRANCH);
  return { site: site.origin, noIndex: preview || env.PUBLIC_NOINDEX === "true" };
}
