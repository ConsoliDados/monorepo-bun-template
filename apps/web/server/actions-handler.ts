import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import manifest from "virtual:server-actions-manifest";
import type { Context } from "hono";

interface ServerActionRequest {
	actionHash: string;
	args: unknown[];
}

// Loaded modules cache
// biome-ignore lint/complexity/noBannedTypes: Need to be any type of function
const moduleCache = new Map<string, Record<string, Function>>();

/**
 * Dynamically loads a server action module
 */
async function loadServerAction(actionPath: string) {
	if (moduleCache.has(actionPath)) {
		return moduleCache.get(actionPath);
	}

	try {
		// Build absolute file path
		const fullPath = resolve(process.cwd(), "src", actionPath);
		const fileUrl = pathToFileURL(fullPath).href;

		// Import the module
		const module = await import(/* @vite-ignore */ fileUrl);

		// Cache the module
		moduleCache.set(actionPath, module);

		return module;
	} catch (e) {
		console.error(`Failed to load server action: ${actionPath}`, e);
		throw new Error(`Server action not found: ${actionPath}`);
	}
}

/**
 * Main handler for server actions
 */
export async function handleServerAction(c: Context) {
	console.log("[ACTIONS-HANDLER] handleServerAction called");
	try {
		const body: ServerActionRequest = await c.req.json();
		const { actionHash, args } = body;
		console.log("[ACTIONS-HANDLER] Request:", { actionHash, args });

		// Validate request
		if (!actionHash) {
			console.log("[ACTIONS-HANDLER] Invalid request - missing actionHash");
			return c.json({ error: "Invalid server action request" }, 400);
		}

		// Resolve hash to action metadata
		const actionMeta = manifest.actions[actionHash];
		if (!actionMeta) {
			console.log("[ACTIONS-HANDLER] Invalid action hash:", actionHash);
			return c.json({ error: "Invalid action hash" }, 404);
		}

		const { filePath, functionName } = actionMeta;
		console.log("[ACTIONS-HANDLER] Resolved action:", {
			hash: actionHash,
			file: filePath,
			function: functionName,
		});

		// Load the module
		console.log("[ACTIONS-HANDLER] Loading module:", filePath);
		const module = await loadServerAction(filePath);

		// Check if function exists
		if (typeof module[functionName] !== "function") {
			console.log("[ACTIONS-HANDLER] Function not found:", functionName);
			return c.json(
				{ error: `Function ${functionName} not found in ${filePath}` },
				404,
			);
		}

		// Execute the function
		console.log("[ACTIONS-HANDLER] Executing function:", functionName);
		const result = await module[functionName](...args);
		console.log("[ACTIONS-HANDLER] Result:", result);

		// Return result
		return c.json(result);
	} catch (e: unknown) {
		const error = e as Error;
		console.error("Server action error:", error);
		return c.json(
			{
				error: error.message || "Server action failed",
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			500,
		);
	}
}

/**
 * Clear modules cache (useful for HMR)
 */
export function clearServerActionsCache() {
	moduleCache.clear();
}
