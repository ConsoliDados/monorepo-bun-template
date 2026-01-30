export function AboutPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">About</h1>
					<p className="text-lg text-slate-600">
						React Router v6 migration project
					</p>
				</div>

				<div className="bg-slate-100 border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Architecture
					</h2>
					<div className="space-y-3 text-slate-700">
						<p>
							<strong>Frontend:</strong> React 19 + Vite + React Router v6
							(library mode)
						</p>
						<p>
							<strong>SSR Runtime:</strong> Hono (universal HTTP framework)
						</p>
						<p>
							<strong>Data Fetching:</strong> TanStack Query
						</p>
						<p>
							<strong>Styling:</strong> Tailwind CSS v4
						</p>
						<p>
							<strong>Backend:</strong> Elysia (separate API server)
						</p>
					</div>
				</div>

				<div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-green-900 mb-4">
						Phase 2 Complete
					</h2>
					<p className="text-slate-700">
						React Router v6 is now integrated in library mode, with full control
						over SSR using Hono. No framework plugin needed!
					</p>
				</div>
			</div>
		</div>
	);
}
