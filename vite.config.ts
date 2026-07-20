import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import pkg from "./package.json";

const rootDir = resolve(import.meta.dirname);
const distDir = resolve(rootDir, "dist");

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

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      plugins: [vue(), serveVidgetDist()],
      root: resolve(rootDir, "playground"),
      resolve: {
        alias: {
          "@": resolve(rootDir, "src"),
        },
      },
      server: {
        open: true,
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
