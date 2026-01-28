import { getCookie } from "hono/cookie";
import type {
	MiddlewareConfig,
	MiddlewareHandler,
} from "../server/middleware/types";

/**
 * Middleware configuration
 * Specifies which routes should be intercepted by this middleware
 */
export const config: MiddlewareConfig = {
	matcher: [
		"/dashboard", // Protect dashboard root
		"/dashboard/:path*", // Protect all dashboard sub-routes
	],
};

/**
 * Middleware handler
 * Checks for auth-session cookie and redirects to home if not present
 */
export const middleware: MiddlewareHandler = async (c, next) => {
	// Check for auth-session cookie
	const authSession = getCookie(c, "auth-session");

	console.log(`[Middleware] Checking auth for path: ${c.req.path}`);
	console.log(
		`[Middleware] auth-session cookie: ${authSession ?? "not found"}`,
	);

	if (!authSession) {
		// No session found - redirect to home
		console.log("[Middleware] No auth session found, redirecting to /");
		return c.redirect("/");
	}

	// Session exists - allow access
	console.log("[Middleware] Auth session valid, allowing access");
	await next();
};
