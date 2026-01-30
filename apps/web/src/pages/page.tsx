import type { User } from "@monorepo/api/schemas/user";
import { Button } from "@monorepo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { EnvDebug } from "@/components/EnvDebug";
import { Link } from "@/components/Link";
import { fetchUsers } from "./_actions/users-actions.server";

type LoaderData = {
	usersData: User[];
	loadedAt: string;
};

export default function HomePage() {
	const { usersData: preLoaded } = useLoaderData() as LoaderData;
	const { data: usersData = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
		initialData: preLoaded,
	});

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						Welcome to Monorepo Bun
					</h1>
					<p className="text-lg text-slate-600">
						React + Vite + React Router + Hono SSR + Elysia Backend
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
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Link to="/routing-docs" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
								<CardHeader>
									<CardTitle className="group-hover:text-purple-600 transition-colors">
										📁 File-Based Routing
									</CardTitle>
									<CardDescription className="text-purple-700">
										Next.js-style routing system
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Complete documentation with examples of layouts, dynamic routes, route groups, and more.
									</p>
								</CardContent>
							</Card>
						</Link>

						<Link to="/react-19-demo" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
								<CardHeader>
									<CardTitle className="group-hover:text-pink-600 transition-colors">
										✨ React 19 Demo
									</CardTitle>
									<CardDescription className="text-pink-700">
										New hooks and features
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Interactive demos of useActionState, useOptimistic, use(),
										and useFormStatus hooks.
									</p>
								</CardContent>
							</Card>
						</Link>

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
										Demonstrates SSR with React Router, loading data on the
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

						<Link to="/dashboard" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
								<CardHeader>
									<CardTitle className="group-hover:text-green-600 transition-colors">
										🔒 Dashboard
									</CardTitle>
									<CardDescription className="text-green-700">
										Protected route with middleware
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Demonstrates middleware authentication. Requires
										auth-session cookie.
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
									Frontend with React, Vite, React Router, and shadcn/ui
									components.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>React Router</CardTitle>
								<CardDescription>
									Industry-standard routing with loaders
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									SSR-ready routing with data loading and typed routes.
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
					{isLoading ? (
						<p>Loading users...</p>
					) : (
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
					)}
				</div>
				<EnvDebug />
			</div>
		</div>
	);
}

// Loader function - will be imported in routes.tsx
export async function loader() {
	console.log("Running SSR example loader");

	const usersData = await fetchUsers();
	return { usersData, loadedAt: new Date().toISOString() };
}
