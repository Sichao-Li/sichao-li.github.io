import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { profileSitePages } from "./build/portfolioPages.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig(async ({ mode }) => {
  const profileName = mode === "template" ? "template" : "sichao";
  const profileRoot = resolve(projectRoot, "profiles", profileName);
  const profileModule = resolve(profileRoot, "profile.js");
  const profile = await import(pathToFileURL(profileModule));
  const outputDirectory = profileName === "sichao" ? "dist" : "dist-template";

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
        outputDirectory,
        profile,
        profileRoot,
        projectRoot,
      }),
    ],
    build: {
      outDir: outputDirectory,
      emptyOutDir: true,
    },
  };
});
