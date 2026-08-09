import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { profileSitePages } from "./build/portfolioPages.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig(async () => {
  const profileRoot = resolve(projectRoot, "profile");
  const profileModule = resolve(profileRoot, "profile.js");
  const profile = await import(pathToFileURL(profileModule));

  return {
    base: "./",
    publicDir: "static",
    resolve: {
      alias: {
        "@profile": profileModule,
      },
    },
    plugins: [
      react(),
      profileSitePages({
        outputDirectory: "dist",
        profile,
        profileRoot,
        projectRoot,
      }),
    ],
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
