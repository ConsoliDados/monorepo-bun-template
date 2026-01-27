import { z } from "zod";

/**
 * Public environment variables safe to expose to the browser
 * These variables are injected at build time and available on both server and client
 *
 * Only variables with VITE_ prefix are exposed to the client
 */

/**
 * Converts environment variables object to public env format
 * Filters only VITE_* variables and converts them to camelCase
 */
function envToObject(env: Record<string, unknown>): Record<string, unknown> {
	// Filter only VITE_* variables
	const publicEnvs = Object.fromEntries(
		Object.entries(env).filter(([key]) => key.startsWith("VITE_")),
	);

	// Convert VITE_SOME_VAR → someVar (camelCase)
	const converted = Object.fromEntries(
		Object.entries(publicEnvs).map(([key, value]) => {
			const camelKey = key
				.replace("VITE_", "")
				.toLowerCase()
				.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
			return [camelKey, value];
		}),
	);

	return converted;
}

/**
 * Validation schema for public environment variables
 * Defines base fields with validation, but allows additional fields via passthrough
 *
 * To add a new variable:
 * 1. Add VITE_NEW_VAR to .env
 * 2. (Optional) Add validation here if needed
 * 3. Variable will be automatically available as newVar (camelCase)
 */
const publicEnvSchema = z
	.object({
		// URLs - validated format
		frontendUrl: z.url().default("http://localhost:3000"),
		backendUrl: z.url().optional(),

		// Node environment
		nodeEnv: z
			.enum(["development", "production", "test"])
			.default("development"),
	})
	.loose(); // Allow additional VITE_* variables not explicitly defined

/**
 * TypeScript type inferred from schema
 */
export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Parse and validate public environment variables
 * Automatically converts VITE_* variables to camelCase and validates with Zod
 */
function parsePublicEnv(): PublicEnv {
	try {
		// Check if we're in browser context
		const isBrowser = typeof window !== "undefined";

		// Get raw environment object
		const rawEnv = isBrowser
			? (import.meta.env as Record<string, unknown>)
			: (process.env as Record<string, unknown>);

		// Convert VITE_* variables to camelCase object
		const converted = envToObject(rawEnv);

		// Add special handling for nodeEnv (comes from MODE in browser, NODE_ENV on server)
		if (!converted.nodeEnv) {
			converted.nodeEnv = isBrowser
				? import.meta.env.MODE || "development"
				: process.env.NODE_ENV || "development";
		}

		// Special fallback for frontendUrl in browser
		if (isBrowser && !converted.frontendUrl) {
			converted.frontendUrl = window.location.origin;
		}

		// Parse and validate with Zod
		const parsed = publicEnvSchema.parse(converted);

		return parsed as PublicEnv;
	} catch (error) {
		// Log error but don't crash the app
		console.error("❌ Error validating public environment variables:");

		if (error instanceof z.ZodError) {
			// Format Zod errors in a readable way
			for (const issue of error.issues) {
				console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
			}
		} else {
			console.error(error);
		}

		console.warn(
			"⚠️  Using default values. Check your .env file and ensure all VITE_* variables are set correctly.",
		);

		// Return defaults instead of crashing
		return publicEnvSchema.parse({}) as PublicEnv;
	}
}

/**
 * Public environment variables instance
 * Type-safe and validated with Zod
 * Safe to use in both server and client code
 */
export const publicEnv = parsePublicEnv();
