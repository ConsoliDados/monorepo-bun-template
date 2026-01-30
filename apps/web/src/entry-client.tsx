import { setupAnchorInterceptor } from "@monorepo/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

hydrateRoot(
	document,
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,
);

// Setup anchor interceptor for server-side navigation
// This ensures all <a> tag clicks trigger full page reloads,
// passing through server middleware (authentication, etc.)
setupAnchorInterceptor({
	// debug: import.meta.env.DEV,
	debug: true,
});
