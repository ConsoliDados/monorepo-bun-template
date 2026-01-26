import { handle } from "@hono/node-server/vercel";
import { createSSRHandler } from "./hono-base";

// Create SSR app for Vercel
const app = await createSSRHandler({
	isProduction: true,
});

// Export handler for Vercel
export default handle(app);
