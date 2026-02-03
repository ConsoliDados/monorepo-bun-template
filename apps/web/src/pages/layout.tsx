import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<div className="min-h-screen bg-slate-50">
			<nav className="bg-white border-b border-slate-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<div className="shrink-0">
							<Link
								to="/"
								className="text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors"
							>
								React Router v6 + Hono
							</Link>
						</div>
						<div className="flex gap-1">
							<Link
								to="/"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								Home
							</Link>
							<Link
								to="/routing-docs"
								className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
							>
								📁 Routing
							</Link>
							<Link
								to="/ssr-example"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								SSR
							</Link>
							<Link
								to="/client-example"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								Client
							</Link>
							<Link
								to="/server-actions"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								Actions
							</Link>
							<Link
								to="/react-19-demo"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								React 19
							</Link>
							<Link
								to="/navigation-test"
								className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
							>
								Nav Test
							</Link>
							<Link
								to="/dashboard"
								className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
							>
								🔒 Dashboard
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main>
				<Suspense>
					{/* {import.meta.env.DEV && <ReactQueryDevtools />} */}
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
}
