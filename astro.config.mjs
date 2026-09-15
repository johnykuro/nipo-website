import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { deploymentConfig } from "./scripts/deployment-config.mjs";

const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const { site, noIndex } = deploymentConfig({ ...env, ...process.env });

// Astro expects a configuration object; Vite-style callbacks are not evaluated.
export default defineConfig({
    site,
    output: "static",
    trailingSlash: "always",
    integrations: [{
      name: "nipo-indexing-headers",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          if (!noIndex) return;
          const file = new URL("_headers", dir);
          const headers = await readFile(file, "utf8");
          await writeFile(file, headers.replace("/*\n", "/*\n  X-Robots-Tag: noindex, nofollow\n").replace("/*\r\n", "/*\r\n  X-Robots-Tag: noindex, nofollow\r\n"));
        },
      },
    }],
    vite: {
      define: {
        __NIPO_SITE_URL__: JSON.stringify(site),
        __NIPO_NOINDEX__: JSON.stringify(noIndex),
      },
      server: {
        proxy: {
          "/api": {
            target: "http://localhost:8787",
            changeOrigin: false,
          },
        },
      },
    },
});
