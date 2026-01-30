import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import {
	createStaticHandler,
	createStaticRouter,
	StaticRouterProvider,
} from "react-router-dom/server";
import { Hono } from "hono";
import { handleServerAction } from "../server/actions-handler";
import { loadApiRoutes } from "../server/api-loader";
import { createMatcher, normalizePath } from "../server/middleware/matcher";
import { loadUserMiddleware } from "../server/middleware/loader";
import { routes } from "./routes";

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

// Middleware loading state
let middlewareLoaded = false;
let userMiddleware: Awaited<ReturnType<typeof loadUserMiddleware>> | null =
	null;

// Load user middleware lazily on first request
app.use("*", async (c, next) => {
	if (!middlewareLoaded) {
		console.log("[MIDDLEWARE] Loading user middleware...");
		userMiddleware = await loadUserMiddleware();
		middlewareLoaded = true;
		if (userMiddleware) {
			console.log("[MIDDLEWARE] ✓ User middleware loaded and registered");
		} else {
			console.log("[MIDDLEWARE] No user middleware found - skipping");
		}
	}

	if (userMiddleware) {
		const { middleware, config } = userMiddleware;
		const matcher = createMatcher(config?.matcher);
		const path = normalizePath(c.req.path);

		if (matcher(path)) {
			return await middleware(c, next);
		}
	}

	await next();
});

// Automatically load all API routes from server/api directory
await loadApiRoutes(app);

// Server Actions Handler
console.log("[ENTRY-SERVER] Registering /__server-actions endpoint");
app.post("/__server-actions", async (c) => {
	console.log("[ENTRY-SERVER] /__server-actions endpoint called");
	return handleServerAction(c);
});

// Create static handler from routes (React Router v6)
const handler = createStaticHandler(routes);

// SSR Route Handler
app.use("*", async (c) => {
	const appCssHrefs = getAppCssHrefs();

	// Create a fresh QueryClient for each request (SSR)
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60,
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	});

	// Create fetch request from Hono context
	const fetchRequest = c.req.raw;

	// Query the routes (runs loaders/actions)
	const context = await handler.query(fetchRequest);

	// If context is a Response, return it (redirects, etc.)
	if (context instanceof Response) {
		return context;
	}

	// Create static router for SSR
	const router = createStaticRouter(handler.dataRoutes, context);

	// Render app to string
	const appHtml = renderToString(
		<QueryClientProvider client={queryClient}>
			<StaticRouterProvider router={router} context={context} />
		</QueryClientProvider>,
	);

	// Build HTML document
	const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Router v6 + Hono SSR</title>
    <link rel="icon" href="/favicon.ico" />
    ${appCssHrefs.map((href) => `<link rel="stylesheet" href="${href}" data-app-css="1" />`).join("\n    ")}
    ${
			import.meta.env.PROD
				? ""
				: `
    <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="/@vite/client"></script>
    `
		}
  </head>
  <body>
    ${appHtml}
    <script type="module" src="${import.meta.env.PROD ? "/static/entry-client.js" : "/src/entry-client.tsx"}"></script>
  </body>
</html>
  `.trim();

	return c.html(html);
});

export default app;
