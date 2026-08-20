import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { studioApi } from "./server/vite-plugin";

export default defineConfig({
  plugins: [react(), studioApi()],
});
