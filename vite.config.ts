import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  define: {
    // @vercel/blob/client references process.env internally.
    // Vite doesn't provide a `process` global in the browser bundle,
    // so without this, the whole app crashes on load with
    // "ReferenceError: process is not defined" (blank white screen).
    "process.env": {},
  },
});
