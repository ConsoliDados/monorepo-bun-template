import { serve } from "@hono/node-server";
import { createServer as createViteServer } from "vite";
import { env } from "../lib/env";
import { createSSRHandler } from "./hono-base";

const port = env.frontendPort;

async function startDevServer() {
	// Create Vite server in middleware mode
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: "custom",
	});

	// Create SSR handler
	const app = await createSSRHandler({
		isProduction: false,
		vite,
	});

	// Use Vite's middleware for HMR, assets, etc
	app.use("*", async (c, next) => {
		// Convert Hono request to Node req/res for Vite middleware
		await new Promise<void>((resolve) => {
			// @ts-expect-error - c.env contains Node.js req/res when using @hono/node-server
			vite.middlewares(c.env.incoming, c.env.outgoing, () => resolve());
		});

		// If Vite didn't handle it, continue to SSR
		// @ts-expect-error - c.env contains Node.js req/res when using @hono/node-server
		if (!c.env.outgoing.writableEnded) {
			await next();
		}
	});

	console.log(`🚀 Dev server running at http://localhost:${port}`);

	serve({
		fetch: app.fetch,
		port,
	});
}

startDevServer().catch(console.error);
