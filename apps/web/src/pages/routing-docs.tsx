/** biome-ignore-all lint/suspicious/noArrayIndexKey: Example code */
import { Link } from "react-router-dom";

interface RouteExample {
	title: string;
	description: string;
	fileStructure: string;
	generatedRoute: string;
	url: string;
	category: "basic" | "nested" | "dynamic" | "groups" | "special";
}

const routeExamples: RouteExample[] = [
	// Basic Routes
	{
		title: "Root Index Page",
		description: "The home page using page.tsx convention",
		fileStructure: "pages/page.tsx",
		generatedRoute: "{ index: true, element: <HomePage /> }",
		url: "/",
		category: "basic",
	},
	{
		title: "Named Route",
		description: "Any .tsx file in root becomes a route with its filename",
		fileStructure: "pages/routing-docs.tsx",
		generatedRoute: '{ path: "routing-docs", element: <RoutingDocsPage /> }',
		url: "/routing-docs",
		category: "basic",
	},
	{
		title: "Nested Directory",
		description: "Directories create nested routes",
		fileStructure: "pages/dashboard/page.tsx",
		generatedRoute:
			'{ path: "dashboard", children: [{ index: true, element: <DashboardPage /> }] }',
		url: "/dashboard",
		category: "basic",
	},

	// Nested Layouts
	{
		title: "Layout with Index",
		description: "Layout wraps all child routes",
		fileStructure: "pages/users/layout.tsx\npages/users/page.tsx",
		generatedRoute:
			'{ path: "users", element: <UsersLayout />, children: [{ index: true, element: <UsersPage /> }] }',
		url: "/users",
		category: "nested",
	},
	{
		title: "Nested Route with Layout",
		description: "Child routes inherit parent layout",
		fileStructure: "pages/users/layout.tsx\npages/users/[id]/page.tsx",
		generatedRoute:
			'{ path: "users", element: <UsersLayout />, children: [{ path: ":id", children: [{ index: true, element: <UsersIdPage /> }] }] }',
		url: "/users/123",
		category: "nested",
	},

	// Dynamic Routes
	{
		title: "Dynamic Parameter",
		description: "Brackets create dynamic route parameters",
		fileStructure: "pages/users/[id]/page.tsx",
		generatedRoute:
			'{ path: ":id", children: [{ index: true, element: <UsersIdPage /> }] }',
		url: "/users/:id",
		category: "dynamic",
	},
	{
		title: "Multiple Pages in Dynamic Route",
		description: "Add edit, delete, etc. as siblings to the index",
		fileStructure: "pages/users/[id]/page.tsx\npages/users/[id]/edit.tsx",
		generatedRoute:
			'{ path: ":id", children: [{ index: true, element: <UsersIdPage /> }, { path: "edit", element: <UsersIdEditPage /> }] }',
		url: "/users/:id/edit",
		category: "dynamic",
	},

	// Route Groups
	{
		title: "Organization Folder (Route Group)",
		description: "Parentheses folders organize code without affecting URLs",
		fileStructure: "pages/(company)/about/page.tsx",
		generatedRoute:
			'{ path: "about", children: [{ index: true, element: <AboutPage /> }] }',
		url: "/about",
		category: "groups",
	},
	{
		title: "Nested Route Groups",
		description: "Multiple route groups can be nested",
		fileStructure: "pages/(company)/about/(mission-vision-values)/mission.tsx",
		generatedRoute:
			'{ path: "about", children: [{ path: "mission", element: <AboutMissionPage /> }] }',
		url: "/about/mission",
		category: "groups",
	},

	// Special Files
	{
		title: "Root Layout",
		description: "pages/layout.tsx wraps all routes",
		fileStructure: "pages/layout.tsx",
		generatedRoute: '{ path: "/", element: <Layout />, children: [...] }',
		url: "All routes",
		category: "special",
	},
	{
		title: "Excluded Folders",
		description: "Folders starting with _ are ignored",
		fileStructure:
			"pages/_components/Button.tsx\npages/_actions/user-actions.server.ts",
		generatedRoute: "Not included in routes",
		url: "N/A",
		category: "special",
	},
];

const categoryColors = {
	basic: "bg-blue-100 text-blue-800 border-blue-300",
	nested: "bg-green-100 text-green-800 border-green-300",
	dynamic: "bg-purple-100 text-purple-800 border-purple-300",
	groups: "bg-orange-100 text-orange-800 border-orange-300",
	special: "bg-gray-100 text-gray-800 border-gray-300",
};

const categoryNames = {
	basic: "Basic Routes",
	nested: "Nested Layouts",
	dynamic: "Dynamic Routes",
	groups: "Route Groups",
	special: "Special Files",
};

export default function RoutingDocsPage() {
	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-slate-900 mb-4">
						File-Based Routing System
					</h1>
					<p className="text-lg text-slate-600 max-w-3xl mx-auto">
						A powerful Next.js-style file-based routing plugin for React Router
						v6. Define your routes by creating files in the{" "}
						<code className="bg-slate-200 px-2 py-1 rounded text-sm">
							pages/
						</code>{" "}
						directory.
					</p>
				</div>

				{/* Feature Highlights */}
				<div className="grid md:grid-cols-3 gap-6 mb-12">
					<div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
						<div className="text-3xl mb-3">🚀</div>
						<h3 className="text-lg font-semibold text-slate-900 mb-2">
							Zero Config
						</h3>
						<p className="text-slate-600">
							Just create files in pages/ and routes are automatically generated
						</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
						<div className="text-3xl mb-3">🔥</div>
						<h3 className="text-lg font-semibold text-slate-900 mb-2">
							Hot Reload
						</h3>
						<p className="text-slate-600">
							Add, edit, or delete route files and see changes instantly
						</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
						<div className="text-3xl mb-3">📁</div>
						<h3 className="text-lg font-semibold text-slate-900 mb-2">
							Organization
						</h3>
						<p className="text-slate-600">
							Use route groups to organize code without affecting URLs
						</p>
					</div>
				</div>

				{/* Conventions Section */}
				<div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 mb-12">
					<h2 className="text-2xl font-bold text-slate-900 mb-6">
						File Conventions
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-slate-900 mb-2">
								Special Files
							</h3>
							<ul className="space-y-2 text-slate-600">
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										layout.tsx
									</code>{" "}
									- Shared UI wrapper
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										page.tsx
									</code>{" "}
									- Index route for directory
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										index.tsx
									</code>{" "}
									- Alternative to page.tsx
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										error.tsx
									</code>{" "}
									- Error boundary (future)
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										loading.tsx
									</code>{" "}
									- Loading state (future)
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-slate-900 mb-2">
								Naming Patterns
							</h3>
							<ul className="space-y-2 text-slate-600">
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										[id]
									</code>{" "}
									- Dynamic parameter
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										(group)
									</code>{" "}
									- Route group (ignored in URL)
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										_folder
									</code>{" "}
									- Excluded from routing
								</li>
								<li>
									<code className="bg-slate-100 px-2 py-1 rounded text-sm">
										any-name.tsx
									</code>{" "}
									- Becomes a route path
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Examples Grid */}
				<div className="space-y-8">
					{Object.entries(categoryNames).map(([category, name]) => (
						<div key={category}>
							<h2 className="text-2xl font-bold text-slate-900 mb-4">{name}</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{routeExamples
									.filter((example) => example.category === category)
									.map((example, idx) => (
										<div
											key={idx}
											className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
										>
											<div className="flex items-start justify-between mb-3">
												<h3 className="font-semibold text-slate-900">
													{example.title}
												</h3>
												<span
													className={`text-xs px-2 py-1 rounded border ${categoryColors[example.category]}`}
												>
													{category}
												</span>
											</div>
											<p className="text-sm text-slate-600 mb-4">
												{example.description}
											</p>

											<div className="space-y-3">
												<div>
													<div className="text-xs font-medium text-slate-500 mb-1">
														File Structure:
													</div>
													<pre className="bg-slate-50 p-2 rounded text-xs text-slate-700 overflow-x-auto whitespace-pre">
														{example.fileStructure}
													</pre>
												</div>

												<div>
													<div className="text-xs font-medium text-slate-500 mb-1">
														Generated Route:
													</div>
													<pre className="bg-slate-50 p-2 rounded text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap break-all">
														{example.generatedRoute}
													</pre>
												</div>

												<div>
													<div className="text-xs font-medium text-slate-500 mb-1">
														URL:
													</div>
													<code className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm block">
														{example.url}
													</code>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					))}
				</div>

				{/* Live Routes Section */}
				<div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Try It Yourself
					</h2>
					<p className="text-slate-600 mb-6">
						All these routes are live in this application. Click the links below
						to explore:
					</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
						<Link
							to="/"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/ (Home)
						</Link>
						<Link
							to="/about"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/about
						</Link>
						<Link
							to="/about/mission"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/about/mission
						</Link>
						<Link
							to="/dashboard"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/dashboard
						</Link>
						<Link
							to="/users"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/users
						</Link>
						<Link
							to="/users/1"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/users/1
						</Link>
						<Link
							to="/users/1/edit"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/users/1/edit
						</Link>
						<Link
							to="/ssr-example"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/ssr-example
						</Link>
						<Link
							to="/client-example"
							className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
						>
							/client-example
						</Link>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-12 text-center text-slate-600">
					<p className="mb-2">
						This routing system is automatically generated from the{" "}
						<code className="bg-slate-200 px-2 py-1 rounded text-sm">
							pages/
						</code>{" "}
						directory.
					</p>
					<p className="text-sm">
						Check{" "}
						<code className="bg-slate-200 px-2 py-1 rounded text-sm">
							src/routes.tsx
						</code>{" "}
						to see the generated React Router configuration.
					</p>
				</div>
			</div>
		</div>
	);
}
