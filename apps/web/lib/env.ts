import { z } from "zod";

/**
 * Validation schema for environment variables
 * All variables are defined here with their types, defaults, and validations
 */
const envSchema = z.object({
	// URLs
	frontendUrl: z.url().default("http://localhost:3000"),
	backendUrl: z.url().default("http://localhost:3333"),

	// Ports
	frontendPort: z.coerce.number().int().positive().default(3000),
	backendPort: z.coerce.number().int().positive().default(3333),

	// Node environment
	nodeEnv: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Function to parse and validate environment variables
 */
function parseEnv() {
	try {
		// Map process.env to schema format (lowercase)
		const envData = {
			frontendUrl: process.env.FRONTEND_URL,
			backendUrl: process.env.BACKEND_URL,
			frontendPort: process.env.FRONTEND_PORT,
			backendPort: process.env.BACKEND_PORT,
			nodeEnv: process.env.NODE_ENV,
		};

		// Parse and validate
		const parsed = envSchema.parse(envData);

		return parsed;
	} catch (error) {
		console.error("❌ Error validating environment variables:");

		if (error instanceof z.ZodError) {
			// Format Zod errors in a readable way
			for (const issue of error.issues) {
				console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
			}
		} else {
			console.error(error);
		}

		console.error("\nPlease check your .env file and try again.");
		process.exit(1);
	}
}

/**
 * Typed and validated object with all environment variables
 * Use this object instead of process.env to ensure type-safety
 */
export const env = parseEnv();

/**
 * TypeScript type inferred from schema
 * Useful for typing in other parts of the code
 */
export type Env = z.infer<typeof envSchema>;
