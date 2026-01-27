import { Button } from "@monorepo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchUsers } from "./-actions/users-actions.server";
import { EnvDebug } from "../components/EnvDebug";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => {
		const usersData = await fetchUsers();
		return { usersData, loadedAt: new Date().toISOString() };
	},
});

function Home() {
	const { usersData } = Route.useLoaderData();

	// const { data: usersData = [], isLoading } = useQuery({
	// 	queryKey: ["users"],
	// 	queryFn: fetchUsers,
	// });
	//
	// if (isLoading) {
	// 	return (
	// 		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	// 			<div className="text-center">Loading...</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						Welcome to Monorepo Bun
					</h1>
					<p className="text-lg text-slate-600">
						React + Vite + TanStack Router + Hono SSR + Elysia Backend
					</p>
				</div>

				{/* Examples Section */}
				<div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
					<h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
						Example Pages
					</h2>
					<p className="text-center text-slate-600 mb-6">
						Explore different features and patterns implemented in this template
					</p>
					<div className="grid gap-4 md:grid-cols-3">
						<Link to="/ssr-example" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
								<CardHeader>
									<CardTitle className="group-hover:text-purple-600 transition-colors">
										SSR Example
									</CardTitle>
									<CardDescription>
										Server-side rendering with data fetching
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Demonstrates SSR with TanStack Router, loading data on the
										server before rendering.
									</p>
								</CardContent>
							</Card>
						</Link>

						<Link to="/client-example" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
								<CardHeader>
									<CardTitle className="group-hover:text-purple-600 transition-colors">
										Client-Side
									</CardTitle>
									<CardDescription>
										Interactive components with hydration
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Examples of interactive components (countdown, form) that
										are hydrated on the client.
									</p>
								</CardContent>
							</Card>
						</Link>

						<Link to="/server-actions" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
								<CardHeader>
									<CardTitle className="group-hover:text-purple-600 transition-colors">
										Server Actions
									</CardTitle>
									<CardDescription>
										API calls with TanStack Query
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Todo list with full CRUD, demonstrating mutations and cache
										management.
									</p>
								</CardContent>
							</Card>
						</Link>
					</div>
				</div>

				{/* Features Section */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
						Stack Features
					</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Elysia Backend</CardTitle>
								<CardDescription>
									Ultra-fast and type-safe backend with Bun
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									Backend running on Elysia with hot reload and shared types.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Hono SSR</CardTitle>
								<CardDescription>
									Ultra-fast SSR with multi-platform support
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									SSR with Hono + Vite, with adapters for Vercel, Netlify,
									Cloudflare, and Docker. Javascript runtime agnostic.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>React + Vite</CardTitle>
								<CardDescription>
									Modern React with blazing fast HMR
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									Frontend with React, Vite, TanStack Router, and shadcn/ui
									components.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>TanStack Router</CardTitle>
								<CardDescription>
									Type-safe routing with loaders
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									File-based routing with auto code-splitting and typed
									contexts.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>TanStack Query</CardTitle>
								<CardDescription>
									Powerful data fetching and caching
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									Async state management with cache, mutations, and SSR
									prefetching.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Shared Packages</CardTitle>
								<CardDescription>
									TypeScript packages without builds
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									Shared packages used directly as TypeScript.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Users from Backend */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Users from Backend (Elysia)
					</h2>
					<div className="space-y-2 mb-2">
						<p>
							This data was fetched from the backend during server execution.
						</p>
					</div>

					<div className="space-y-2">
						{usersData.map((user) => (
							<Card key={user.id}>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-semibold">{user.name}</h3>
											<p className="text-sm text-slate-500">{user.email}</p>
										</div>
										<Button variant="outline" size="sm">
											View
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
				<EnvDebug />
			</div>
		</div>
	);
}
