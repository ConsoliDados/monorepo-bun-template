import { setupAnchorInterceptor } from "@monorepo/navigation";
import {
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import "./app.css";

// Create QueryClient for client-side
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			refetchOnWindowFocus: false,
		},
	},
});

// Create browser router from routes config
const router = createBrowserRouter(routes);
// biome-ignore lint/suspicious/noExplicitAny: it's fine
const dehydratedState = (window as any).__REACT_QUERY_STATE__;

hydrateRoot(
	// biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: There are a valid root
	// biome-ignore lint/style/noNonNullAssertion: There are a valid root
	document?.querySelector("#root")!,
	<QueryClientProvider client={queryClient}>
		<HydrationBoundary state={dehydratedState}>
			<RouterProvider router={router} future={{ v7_startTransition: true }} />
		</HydrationBoundary>
	</QueryClientProvider>,
	// {
	// 	onRecoverableError(error) {
	// 		console.error("Recoverable error", error);
	// 	},
	// },
);

// Setup anchor interceptor for server-side navigation
// This ensures all <a> tag clicks trigger full page reloads,
// passing through server middleware (authentication, etc.)
setupAnchorInterceptor({
	debug: import.meta.env.DEV,
	// debug: true,
});
