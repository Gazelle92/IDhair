import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/sanity-data": {
        target: "https://9pry8zdk.api.sanity.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-data/, "/v2025-02-19/data"),
      },
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
});
