import { type QueryClient } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
	queryClient: QueryClient;
	head?: string;
	appCssHrefs?: string[];
}

export interface CreateRouterOptions {
	queryClient: QueryClient;
	head?: string;
	appCssHrefs?: string[];
}

export function createRouter(options: CreateRouterOptions) {
	const context: RouterContext = {
		queryClient: options.queryClient,
		head: options.head ?? "",
		appCssHrefs: options.appCssHrefs ?? [],
	};

	return createTanstackRouter({
		routeTree,
		context,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
