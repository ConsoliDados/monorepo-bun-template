import { Link, Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
	const location = useLocation();

	const isActive = (path: string) => {
		return (
			location.pathname === path || location.pathname.startsWith(`${path}/`)
		);
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Dashboard Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">
						🔒 Dashboard
					</h1>
					<p className="text-slate-600">
						Protected area - This requires authentication via middleware
					</p>
				</div>

				{/* Sub Navigation */}
				<div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
					<nav className="flex border-b border-slate-200">
						<Link
							to="/dashboard"
							className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
								location.pathname === "/dashboard"
									? "border-purple-500 text-purple-600 bg-purple-50"
									: "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
							}`}
						>
							Overview
						</Link>
						<Link
							to="/dashboard/users"
							className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
								isActive("/dashboard/users")
									? "border-purple-500 text-purple-600 bg-purple-50"
									: "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
							}`}
						>
							Users
						</Link>
					</nav>

					{/* Content Area */}
					<div className="p-6">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
