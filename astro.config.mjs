import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const site = env.PUBLIC_SITE_URL || "https://nipobraza.co.uk";

  return {
    site,
    output: "static",
    vite: {
      server: {
        proxy: {
          "/api": {
            target: "http://localhost:8787",
            changeOrigin: false,
          },
        },
      },
    },
  };
});
