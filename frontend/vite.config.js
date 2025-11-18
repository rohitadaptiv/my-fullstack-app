import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/ping": "http://backend:5000",
      "/send": "http://backend:5000",
    },
  },
});
