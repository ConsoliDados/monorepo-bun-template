import type { User } from "@monorepo/api/schemas";
import { Button } from "@monorepo/ui";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

// Fetch function for users
async function fetchUsers(): Promise<User[]> {
	const response = await fetch("http://localhost:3333/api/users");
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	return response.json();
}

export const Route = createFileRoute("/")({
	component: Home,
	loader: ({ context }) => {
		// Prefetch data for SSR
		context.queryClient.prefetchQuery({
			queryKey: ["users"],
			queryFn: fetchUsers,
		});
	},
});

function Home() {
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
	});

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center">Loading...</div>
			</div>
		);
	}

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
										Demonstra como fazer SSR com TanStack Router, carregando
										dados no servidor antes de renderizar.
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
										Exemplos de componentes interativos (countdown, formulário)
										que são hidratados no cliente.
									</p>
								</CardContent>
							</Card>
						</Link>

						<Link to="/server-function" className="group">
							<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
								<CardHeader>
									<CardTitle className="group-hover:text-purple-600 transition-colors">
										Server Functions
									</CardTitle>
									<CardDescription>
										API calls with TanStack Query
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-slate-600">
										Todo list com CRUD completo, demonstrando mutations e cache
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
									Fast and type-safe backend with Bun
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									Backend rodando em Elysia com hot reload e tipos
									compartilhados.
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
									SSR com Hono + Vite, com adapters para Vercel, Netlify,
									Cloudflare e Docker.
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
									Frontend com React, Vite, TanStack Router e componentes
									shadcn/ui.
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
									File-based routing com auto code-splitting e typed contexts.
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
									Gerenciamento de estado assíncrono com cache, mutations e SSR
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
									Packages compartilhados usados diretamente como TypeScript.
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
					<div className="space-y-2">
						{users.map((user) => (
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
			</div>
		</div>
	);
}
