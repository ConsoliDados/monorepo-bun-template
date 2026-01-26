import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import type { RouterContext } from "../router";
import "../app.css";

export const Route = createRootRouteWithContext<RouterContext>()({
	head: ({ match }) => ({
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			...match.context.appCssHrefs.map((href) => ({
				rel: "stylesheet",
				href,
				"data-app-css": "1",
			})),
		],
		meta: [
			{
				title: "Monorepo Bun - React + Vite + TanStack Router + Hono SSR",
			},
			{
				charSet: "UTF-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0",
			},
		],
		scripts: [
			...(!import.meta.env.PROD
				? [
						{
							type: "module",
							children: `import RefreshRuntime from "/@react-refresh"
								RefreshRuntime.injectIntoGlobalHook(window)
								window.$RefreshReg$ = () => {}
								window.$RefreshSig$ = () => (type) => type
								window.__vite_plugin_react_preamble_installed__ = true`,
						},
						{
							type: "module",
							src: "/@vite/client",
						},
					]
				: []),
			{
				type: "module",
				src: import.meta.env.PROD
					? "/static/entry-client.js"
					: "/src/entry-client.tsx",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<div className="min-h-screen bg-slate-50">
						<nav className="bg-white border-b border-slate-200 shadow-sm">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex justify-between h-16 items-center">
									<div className="flex-shrink-0">
										<Link
											to="/"
											className="text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
										>
											Monorepo Bun
										</Link>
									</div>
									<div className="flex gap-1">
										<Link
											to="/"
											className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
											activeProps={{
												className:
													"px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg",
											}}
										>
											Home
										</Link>
										<Link
											to="/ssr-example"
											className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
											activeProps={{
												className:
													"px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg",
											}}
										>
											SSR
										</Link>
										<Link
											to="/client-example"
											className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
											activeProps={{
												className:
													"px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg",
											}}
										>
											Client-Side
										</Link>
										<Link
											to="/server-function"
											className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
											activeProps={{
												className:
													"px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg",
											}}
										>
											Server Functions
										</Link>
									</div>
								</div>
							</div>
						</nav>
						<main>
							<Outlet />
						</main>
					</div>
					<Suspense>
						<TanStackRouterDevtools position="bottom-right" />
						<ReactQueryDevtools position="bottom" />
					</Suspense>
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
