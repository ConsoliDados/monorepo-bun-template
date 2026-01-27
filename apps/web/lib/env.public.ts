/**
 * Public environment variables safe to expose to the browser
 * These variables are injected at build time and available on both server and client
 */

export interface PublicEnv {
	frontendUrl: string;
	nodeEnv: string;
}

function envToObject(env: { [key: string]: string }) {
	const publicEnvs = Object.fromEntries(
		Object.entries(env).filter(([key, value]) => key.startsWith("VITE_")),
	);

	const envs = Object.fromEntries(
		Object.keys(publicEnvs).map((key) => {
			const camelKey = key
				.replace("VITE_", "")
				.toLowerCase()
				.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
			return [camelKey, publicEnvs[key]];
		}),
	);
	return envs;
}

/**
 * Get public environment variables
 * Works in both SSR and CSR contexts
 */
export function getPublicEnv(): PublicEnv {
	// In browser, use injected values or window.location as fallback
	if (typeof window !== "undefined") {
		// return {
		// 	backendUrl: import.meta.env.VITE_BACKEND_URL
		// 		? import.meta.env.VITE_BACKEND_URL
		// 		: "http://localhost:3333",
		// 	// ? "__BACKEND_URL__"
		// 	// : "http://localhost:3333",
		// 	frontendUrl: import.meta.env.VITE_FRONTEND_URL
		// 		? import.meta.env.VITE_FRONTEND_URL
		// 		: window.location.origin,
		// 	//     ? "__FRONTEND_URL__"
		// 	// : window.location.origin,
		// 	// nodeEnv: import.meta.env.MODE ? "__NODE_ENV__" : "development",
		// 	nodeEnv: import.meta.env.MODE ? __NODE_ENV__ : "development",
		// };
		return envToObject(import.meta.env) as unknown as PublicEnv;
	}

	// On server, use process.env
	// return {
	// 	backendUrl: process.env.BACKEND_URL || "http://localhost:3333",
	// 	frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
	// 	nodeEnv: process.env.NODE_ENV || "development",
	// };
	return envToObject(
		process.env as { [key: string]: string },
	) as unknown as PublicEnv;
}

/**
 * Public environment variables instance
 * Safe to use in both server and client code
 */
export const publicEnv = getPublicEnv();
