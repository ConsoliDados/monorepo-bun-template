import { resolve } from "node:path";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const port = Number(process.env.FRONTEND_PORT) || 3000;
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
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
			}),
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
		build: mode === "client" ? clientBuild : ssrBuild,
		server: {
			host,
			port,
			proxy: {
				"/api": {
					target: `http://localhost:${process.env.BACKEND_PORT || 3333}`,
					changeOrigin: true,
				},
			},
		},
		ssr: {
			noExternal: ["@tanstack/react-router", "@tanstack/react-query"],
		},
		optimizeDeps: {
			include: ["react", "react-dom", "@tanstack/react-router"],
		},
	};
});
