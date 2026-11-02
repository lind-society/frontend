import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Without an API URL the built admin calls its own origin and gets index.html
  // back, which breaks every page. Stop the build instead of shipping that.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  if (command === "build" && !(env.VITE_BASE_API_URL || env.VITE_SECONDARY_API_URL)) {
    throw new Error("VITE_BASE_API_URL is not set. Put it in .env.production (or pass it as a build arg).");
  }

  return {
    plugins: [react(), tailwindcss()],
  };
});
