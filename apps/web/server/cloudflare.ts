import { createSSRHandler } from "./hono-base";

// Create SSR app for Cloudflare Workers
const app = await createSSRHandler({
	isProduction: true,
});

// Export fetch handler for Cloudflare Workers
export default {
	async fetch(request: Request, env: any, ctx: any) {
		return app.fetch(request, env, ctx);
	},
};
