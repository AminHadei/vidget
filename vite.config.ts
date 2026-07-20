import { copyFileSync, createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import pkg from "./package.json";

const rootDir = resolve(import.meta.dirname);
const playgroundDir = resolve(rootDir, "playground");
const distDir = resolve(rootDir, "dist");
const playgroundOutDir = resolve(rootDir, "dist-playground");

const vidgetAssets = ["vidget.js", "vidget.css"] as const;

function serveVidgetDist(): Plugin {
  const assets = {
    "/vidget.js": { file: "vidget.js", type: "application/javascript; charset=utf-8" },
    "/vidget.css": { file: "vidget.css", type: "text/css; charset=utf-8" },
  } as const;

  const handler = (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void,
  ) => {
    const url = req.url?.split("?")[0];
    if (!url || !(url in assets)) {
      next();
      return;
    }

    const asset = assets[url as keyof typeof assets];
    const filePath = resolve(distDir, asset.file);

    if (!existsSync(filePath)) {
      res.statusCode = 404;
      res.end(
        `${asset.file} not found. Run "pnpm build:widget" (or "pnpm dev" which runs it automatically).`,
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", asset.type);
    createReadStream(filePath).pipe(res);
  };

  return {
    name: "serve-vidget-dist",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
    closeBundle() {
      console.log(`Vidget v${pkg.version} → dist/vidget.js, dist/vidget.css`);
    },
  };
}

function copyVidgetAssets(outDir: string): Plugin {
  return {
    name: "copy-vidget-assets",
    closeBundle() {
      for (const file of vidgetAssets) {
        const source = resolve(distDir, file);
        if (!existsSync(source)) {
          throw new Error(`${file} not found. Run "pnpm build:widget" first.`);
        }
        copyFileSync(source, resolve(outDir, file));
      }
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const sharedResolve = {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  };

  if (command === "serve") {
    return {
      plugins: [vue(), serveVidgetDist()],
      root: playgroundDir,
      resolve: sharedResolve,
      server: {
        open: true,
      },
    };
  }

  if (mode === "playground") {
    return {
      base: process.env.VITE_BASE ?? "/",
      plugins: [vue(), copyVidgetAssets(playgroundOutDir)],
      root: playgroundDir,
      resolve: sharedResolve,
      build: {
        outDir: playgroundOutDir,
        emptyOutDir: true,
      },
    };
  }

  return {
    plugins: [vue(), serveVidgetDist()],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry: resolve(rootDir, "src/embed.ts"),
        name: "Vidget",
        formats: ["iife"],
        fileName: () => "vidget.js",
      },
      rollupOptions: {
        output: {
          banner: `/*! Vidget v${pkg.version} */`,
          assetFileNames: (asset) =>
            asset.names?.some((name) => name.endsWith(".css"))
              ? "vidget.css"
              : "vidget.[ext]",
          extend: true,
        },
      },
    },
  };
});
