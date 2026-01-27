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
