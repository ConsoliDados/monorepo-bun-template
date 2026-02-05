/**
 * Production entry point for the web app.
 *
 * Runtime detection is automatic — this file works on Bun, Node, Vercel,
 * Cloudflare Workers, and Netlify without changes.
 *
 * Build outputs referenced here:
 *   dist/server/index.js          — SSR bundle (entry-server.tsx compiled).
 *                                   Default-exports the fully-configured Hono app.
 *   dist/server/server-config.mjs — serialised ServerConfig (written by webRuntime plugin)
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "@consolidados/hono-vite-runtime/server/start";

// Ensure CWD points to this file's directory so that the bundled SSR handler
// (which uses process.cwd() for rootDir defaults) can locate server/api/,
// src/, dist/client/, etc. regardless of where `bun server.ts` is invoked.
const appDir = dirname(fileURLToPath(import.meta.url));
process.chdir(appDir);

// Dynamic imports: these files only exist after `bun run build`.
// @ts-expect-error — generated at build time
const { default: app } = await import("./dist/server/index.js");
// @ts-expect-error — generated at build time
const config = (await import("./dist/server/server-config.mjs")).default;

startServer(config, app);
