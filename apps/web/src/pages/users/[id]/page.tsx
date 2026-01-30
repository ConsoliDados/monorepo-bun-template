import type { User } from "@monorepo/api/schemas/user";
import { useQuery } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { fetchUsers } from "../../../routes/-actions/users-actions.server";

export async function loader({ params }: LoaderFunctionArgs) {
	const { id } = params;
	console.log(`[LOADER] users/[id] - fetching user ${id} for SSR`);

	// Fetch all users and find the one by ID
	const users = await fetchUsers();
	const user = users.find((u) => u.id === id);

	if (!user) {
		throw new Response("User not found", { status: 404 });
	}

	return { user };
}

export default function UserIdPage() {
	const { id } = useParams();
	const { user: preloadedUser } = useLoaderData() as { user: User };

	// Use React Query with SSR data
	const { data: user } = useQuery({
		queryKey: ["user", id],
		queryFn: async () => {
			const users = await fetchUsers();
			return users.find((u) => u.id === id);
		},
		initialData: preloadedUser,
	});

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div>
			<Link
				to="/users"
				className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
			>
				← Back to Users
			</Link>

			<div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
						<span className="text-2xl font-bold text-purple-700">
							{user.name.charAt(0)}
						</span>
					</div>
					<div>
						<h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
						<p className="text-slate-600">{user.email}</p>
					</div>
				</div>

				<div className="bg-white rounded-lg p-6 space-y-4">
					<div>
						<h3 className="text-sm font-semibold text-slate-500 uppercase">
							User ID
						</h3>
						<p className="text-lg text-slate-900">{user.id}</p>
					</div>

					<div className="pt-4 border-t border-slate-200">
						<div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
							✓ Data loaded via React Router loader + React Query
						</div>
					</div>

					<div className="pt-4 border-t border-slate-200 text-sm text-slate-600">
						<p>
							<strong>Route pattern:</strong> /users/:id
						</p>
						<p>
							<strong>File location:</strong> pages/users/[id]/page.tsx
						</p>
						<p>
							<strong>Loader:</strong> Yes (SSR pre-fetch)
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
