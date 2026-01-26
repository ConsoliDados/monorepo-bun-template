import { createFileRoute } from "@tanstack/react-router";

// Simulando uma API call que roda no servidor
async function fetchUserData() {
	// Simula delay de rede
	await new Promise((resolve) => setTimeout(resolve, 100));

	return {
		name: "João Silva",
		email: "joao@example.com",
		registeredAt: new Date().toISOString(),
		stats: {
			posts: 42,
			followers: 1337,
			following: 256,
		},
	};
}

export const Route = createFileRoute("/ssr-example")({
	// Loader roda no servidor durante SSR
	loader: async () => {
		const userData = await fetchUserData();
		return { userData, loadedAt: new Date().toISOString() };
	},
	component: SSRExamplePage,
});

function SSRExamplePage() {
	const { userData, loadedAt } = Route.useLoaderData();

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-2">SSR Example</h1>
			<p className="text-slate-600 mb-8">
				Esta página foi renderizada no servidor (SSR). Os dados abaixo foram
				carregados durante o SSR.
			</p>

			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">User Profile</h2>

				<div className="space-y-3">
					<div className="flex justify-between py-2 border-b border-slate-100">
						<span className="font-medium text-slate-700">Name:</span>
						<span className="text-slate-900">{userData.name}</span>
					</div>

					<div className="flex justify-between py-2 border-b border-slate-100">
						<span className="font-medium text-slate-700">Email:</span>
						<span className="text-slate-900">{userData.email}</span>
					</div>

					<div className="flex justify-between py-2 border-b border-slate-100">
						<span className="font-medium text-slate-700">Registered:</span>
						<span className="text-slate-900">
							{new Date(userData.registeredAt).toLocaleDateString("pt-BR")}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-4 mt-6">
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">
							{userData.stats.posts}
						</div>
						<div className="text-sm text-slate-600">Posts</div>
					</div>

					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-2xl font-bold text-green-600">
							{userData.stats.followers}
						</div>
						<div className="text-sm text-slate-600">Followers</div>
					</div>

					<div className="text-center p-4 bg-purple-50 rounded-lg">
						<div className="text-2xl font-bold text-purple-600">
							{userData.stats.following}
						</div>
						<div className="text-sm text-slate-600">Following</div>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">
					Como verificar SSR:
				</h3>
				<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
					<li>Veja o source da página (Ctrl+U) - o conteúdo já está lá</li>
					<li>
						Loaded at:{" "}
						<code className="bg-blue-100 px-1 rounded">{loadedAt}</code>
					</li>
					<li>Desabilite JavaScript - a página ainda renderiza</li>
				</ul>
			</div>
		</div>
	);
}
