import { resolve } from "node:path";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import fileBasedRouting from "../../packages/web-runtime/plugins/file-based-routing/index";
import { serverActions } from "../../packages/web-runtime/plugins/server-actions";
import webRuntime from "../../packages/web-runtime/plugins/web-runtime";
import { env } from "./lib/env";

const port = env.frontendPort;
const host = "localhost";

const ssrBuild = {
	outDir: "dist/server",
	target: "esnext",
	ssrEmitAssets: false,
	copyPublicDir: false,
	emptyOutDir: false,
	rollupOptions: {
		input: resolve(__dirname, "src/entry-server.tsx"),
		output: {
			entryFileNames: "index.js",
			chunkFileNames: "assets/[name]-[hash].js",
			assetFileNames: "assets/[name]-[hash][extname]",
		},
	},
	ssr: true,
};

const clientBuild = {
	outDir: "dist/client",
	copyPublicDir: true,
	emptyOutDir: true,
	rollupOptions: {
		input: resolve(__dirname, "src/entry-client.tsx"),
		output: {
			entryFileNames: "static/[name].js",
			chunkFileNames: "static/[name]-[hash].js",
			assetFileNames: "static/[name]-[hash][extname]",
		},
	},
	manifest: true,
};

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			fileBasedRouting({ debug: true }),
			serverActions(),
			webRuntime({ compress: true, static: "./dist/client" }),
			react(),
			tsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			devServer({
				entry: "src/entry-server.tsx",
				injectClientScript: true,
				exclude: [
					/^\/src\/.*/, // Allow Vite to handle /src/ requests
					...defaultOptions.exclude,
				],
			}),
		],
		// Inject environment variables at build time
		define: {
			__BACKEND_URL__: JSON.stringify(env.backendUrl),
			__FRONTEND_URL__: JSON.stringify(env.frontendUrl),
			__NODE_ENV__: JSON.stringify(env.nodeEnv),
		},
		build: mode === "client" ? clientBuild : ssrBuild,
		server: {
			watcher: {
				ignored: ["**/node_modules/**"],
				add: ["src/pages/**/*.tsx", "src/**/*.server.ts"],
			},
			host,
			port,
			proxy: {
				"/api": {
					target: env.backendUrl,
					changeOrigin: true,
				},
			},
		},
		ssr: {
			noExternal: ["@tanstack/react-query", "@consolidados/hono-vite-runtime"],
		},
		optimizeDeps: {
			include: ["react", "react-dom"],
		},
	};
});
