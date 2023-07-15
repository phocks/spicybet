import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  integrations: [svelte()],
  adapter: vercel()
});