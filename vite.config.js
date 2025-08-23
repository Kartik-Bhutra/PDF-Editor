import electron from "vite-plugin-electron/simple";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  plugins: [
    electron({
      main: {
        entry: "electron/dev.ts",
      },
    }),
  ],
});
