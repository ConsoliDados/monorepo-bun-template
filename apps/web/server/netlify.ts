import type { Context } from "@netlify/functions";
import { createSSRHandler } from "./hono-base";

// Create SSR app for Netlify
const app = await createSSRHandler({
	isProduction: true,
});

// Netlify Functions handler
export async function handler(event: any, context: Context) {
	// Convert Netlify event to Request
	const url = new URL(event.path, `https://${event.headers.host}`);
	const request = new Request(url, {
		method: event.httpMethod,
		headers: event.headers,
		body: event.body ? event.body : undefined,
	});

	// Handle with Hono
	const response = await app.fetch(request);

	// Convert Response to Netlify response format
	const body = await response.text();
	const headers: Record<string, string> = {};
	response.headers.forEach((value, key) => {
		headers[key] = value;
	});

	return {
		statusCode: response.status,
		headers,
		body,
	};
}
