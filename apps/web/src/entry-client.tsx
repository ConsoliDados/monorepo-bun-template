import { QueryClient } from "@tanstack/react-query";
import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import { publicEnv } from "../lib/env.public";
import { createRouter } from "./router";

import "./app.css";

function getInitialAppCssHrefs() {
	const links =
		document.querySelectorAll<HTMLLinkElement>("link[data-app-css]");
	return Array.from(links)
		.map((link) => {
			try {
				return new URL(link.href).pathname;
			} catch {
				return null;
			}
		})
		.filter((href): href is string => Boolean(href));
}

// Create QueryClient for client-side
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			refetchOnWindowFocus: false,
		},
	},
});

const router = createRouter({
	queryClient,
	env: publicEnv,
	appCssHrefs: getInitialAppCssHrefs(),
});

hydrateRoot(document, <RouterClient router={router} />);
