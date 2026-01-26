import { QueryClient } from "@tanstack/react-query";
import {
	createRequestHandler,
	renderRouterToString,
	RouterServer,
} from "@tanstack/react-router/ssr/server";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRouter } from "./router";
import todosApi from "../server/api/todos";

interface ViteManifestChunk {
	file: string;
	assets?: string[];
	css?: string[];
}

type ViteManifest = Record<string, ViteManifestChunk>;

let cachedProdAppCssHrefs: string[] | null = null;

function getProdAppCssHrefs(): string[] {
	if (cachedProdAppCssHrefs) return cachedProdAppCssHrefs;

	try {
		const manifestPath = resolve(
			process.cwd(),
			"dist/client/.vite/manifest.json",
		);
		const raw = readFileSync(manifestPath, "utf8");
		const manifest = JSON.parse(raw) as ViteManifest;
		const entry = manifest["src/entry-client.tsx"];

		if (!entry) {
			console.warn(
				"Could not find src/entry-client.tsx in Vite manifest. CSS will not be linked.",
			);
			cachedProdAppCssHrefs = [];
			return cachedProdAppCssHrefs;
		}

		const cssFiles = new Set<string>();
		for (const href of entry.css ?? []) {
			if (href.endsWith(".css")) cssFiles.add(href);
		}
		for (const href of entry.assets ?? []) {
			if (href.endsWith(".css")) cssFiles.add(href);
		}

		cachedProdAppCssHrefs = Array.from(cssFiles).map((file) =>
			file.startsWith("/") ? file : `/${file}`,
		);
		return cachedProdAppCssHrefs;
	} catch (error) {
		console.warn("Failed to read Vite manifest for CSS assets:", error);
		cachedProdAppCssHrefs = [];
		return cachedProdAppCssHrefs;
	}
}

function getAppCssHrefs(): string[] {
	if (process.env.NODE_ENV === "production") {
		return getProdAppCssHrefs();
	}

	// In dev we want SSR to include immediate styling
	return ["/src/app.css"];
}

// Create Hono app
const app = new Hono();

// API Routes
app.route("/api/todos", todosApi);

// SSR Route Handler
app.use("*", async (c) => {
	const appCssHrefs = getAppCssHrefs();

	// Create a fresh QueryClient for each request (SSR)
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60,
				refetchOnWindowFocus: false,
				retry: false, // Don't retry on server
			},
		},
	});

	const handler = createRequestHandler({
		request: c.req.raw,
		createRouter: () => {
			return createRouter({
				queryClient,
				head: "",
				appCssHrefs,
			});
		},
	});

	return await handler(({ responseHeaders, router }) => {
		return renderRouterToString({
			responseHeaders,
			router,
			children: <RouterServer router={router} />,
		});
	});
});

export default app;
