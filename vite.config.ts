/// <reference types="vitest/config" />
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const ReactCompilerConfig = {};

const isTest = process.env.NODE_ENV === "test";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    !isTest && TanStackRouterVite(),
  ],
  test: {
    globals: true,
    isolate: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.tsx",
  },
});
