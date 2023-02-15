import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
  plugins: [suidPlugin(), solidPlugin()],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
