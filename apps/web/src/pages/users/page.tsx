import type { User } from "@monorepo/api/schemas/user";
import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "react-router-dom";
import { fetchUsers } from "../../routes/-actions/users-actions.server";

export async function loader() {
	console.log("[LOADER] users/index - fetching users for SSR");
	const users = await fetchUsers();
	return { users };
}

export default function UsersIndexPage() {
	const { users: preloadedUsers } = useLoaderData() as { users: User[] };

	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
		initialData: preloadedUsers,
	});

	return (
		<div>
			<h2 className="text-2xl font-bold text-slate-900 mb-4">All Users</h2>
			<p className="text-slate-600 mb-6">
				Data was pre-fetched on the server using loader + React Query
			</p>

			<div className="space-y-3">
				{users.map((user) => (
					<Link
						key={user.id}
						to={`/users/${user.id}`}
						className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
					>
						<h3 className="font-semibold text-slate-900">{user.name}</h3>
						<p className="text-sm text-slate-500">{user.email}</p>
					</Link>
				))}
			</div>
		</div>
	);
}
