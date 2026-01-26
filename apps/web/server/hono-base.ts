import { Hono } from "hono";
import type { ViteDevServer } from "vite";
import todosApi from "./api/todos";

export interface SSROptions {
	isProduction: boolean;
	vite?: ViteDevServer;
	base?: string;
}

export async function createSSRHandler(options: SSROptions) {
	const { isProduction } = options;

	const app = new Hono();

	// API Routes
	app.route("/api/todos", todosApi);

	// SSR Route Handler - now handled by @hono/vite-dev-server plugin
	// In dev mode, the plugin handles SSR automatically
	// In production, we need to handle it explicitly
	if (isProduction) {
		// @ts-expect-error - This file only exists after build
		const { render } = await import("../dist/server/index.js");

		app.use("*", async (c) => {
			try {
				const response = await render(c.req.raw);
				return response;
			} catch (e: unknown) {
				const error = e as Error;
				console.error("SSR Error:", error.stack);
				return c.text(error.stack || String(e), 500);
			}
		});
	}

	return app;
}
