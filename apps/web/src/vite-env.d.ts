/// <reference types="vite/client" />

/**
 * Type declarations for environment variables injected by Vite
 */

// Global constants injected via vite.config.ts define
declare const __BACKEND_URL__: string;
declare const __FRONTEND_URL__: string;
declare const __NODE_ENV__: string;

// Vite environment variables interface
interface ImportMetaEnv {
	readonly VITE_BACKEND_URL?: string;
	readonly VITE_FRONTEND_URL?: string;
	readonly MODE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/**
 * Type declarations for virtual modules (server actions)
 */

interface ActionMeta {
	filePath: string;
	functionName: string;
}

interface ActionManifest {
	salt: string;
	actions: Record<string, ActionMeta>;
}

declare module "virtual:server-actions-manifest" {
	const manifest: ActionManifest;
	export default manifest;
}

declare module "virtual:server-actions-runtime" {
	export function callServerAction(
		actionHash: string,
		args: unknown[],
	): Promise<unknown>;
}
