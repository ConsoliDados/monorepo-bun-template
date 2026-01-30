import { resolve } from "node:path";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { env } from "./lib/env";
import { serverActions } from "./plugins/server-actions";

const port = env.frontendPort;
const host = "localhost";

const ssrBuild = {
	outDir: "dist/server",
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
			serverActions(),
			react(),
			tsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			devServer({
				entry: "src/entry-server.tsx",
				injectClientScript: false,
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
			noExternal: ["@tanstack/react-query"],
		},
		optimizeDeps: {
			include: ["react", "react-dom"],
		},
	};
});
