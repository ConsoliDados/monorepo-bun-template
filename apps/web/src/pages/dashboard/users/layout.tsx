import { Outlet } from "react-router-dom";

export default function UsersLayout() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900">Users Section</h1>
				<p className="text-slate-600 mt-2">
					This layout wraps all /users/* routes
				</p>
			</div>
			<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
				<Outlet />
			</div>
		</div>
	);
}
