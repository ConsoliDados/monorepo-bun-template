import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyMeta } from "@consolidados/hono-vite-runtime/plugins/apply-meta";
import { createSSRHandler } from "@consolidados/hono-vite-runtime/server/hono-base";
import {
	dehydrate,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import {
	createStaticHandler,
	createStaticRouter,
	StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "./routes";

// ── CSS resolution helpers ──────────────────────────────────

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

// ── React Router static handler (created once) ─────────────

const handler = createStaticHandler(routes);

// ── The render function — app-specific, React-specific ─────
// Exported so the production bundle exposes it for hono-base to import.

export async function render(request: Request): Promise<Response> {
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

	// Query the routes (runs loaders/actions)
	const context = await handler.query(request);

	// If context is a Response, return it (redirects, etc.)
	if (context instanceof Response) {
		return context;
	}

	const { title, metaTags } = applyMeta(context, "React Router v6 + Hono SSR");

	// Create static router for SSR
	const router = createStaticRouter(handler.dataRoutes, context);

	// renderToPipeableStream + onAllReady: waits for every Suspense/lazy boundary
	// before flushing. Required in React 19 — renderToString aborts on suspend.
	const appHtml = await new Promise<string>((resolve, reject) => {
		const chunks: string[] = [];
		const { pipe } = renderToPipeableStream(
			<QueryClientProvider client={queryClient}>
				<StaticRouterProvider router={router} context={context} />
			</QueryClientProvider>,
			{
				onAllReady() {
					pipe(
						new Writable({
							write(chunk, _enc, cb) {
								chunks.push(chunk.toString());
								cb();
							},
							final(cb) {
								resolve(chunks.join(""));
								cb();
							},
						}),
					);
				},
				onError(err) {
					reject(err);
				},
			},
		);
	});

	// Dehydrate after the stream completes so all loader-populated queries are captured.
	const dehydratedState = dehydrate(queryClient);

	// Build HTML document
	const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${metaTags}
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
  <body id="root">
    ${appHtml}
    <script type="module" src="${import.meta.env.PROD ? "/static/entry-client.js" : "/src/entry-client.tsx"}"></script>
  <script>
    window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}
  </script>
  </body>
</html>
  `.trim();

	return new Response(html, {
		headers: { "content-type": "text/html; charset=utf-8" },
	});
}

// ── Bootstrap ───────────────────────────────────────────────

const app = await createSSRHandler({
	isProduction: import.meta.env.PROD,
	render,
});

export default app;
