import { Button } from "@monorepo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/components/card";
import { Link, useParams } from "react-router-dom";

export default function UserEditPage() {
	const { id } = useParams();

	return (
		<div>
			<Link
				to={`/dashboard/users/${id}`}
				className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
			>
				← Back to User Details
			</Link>

			<Card>
				<CardHeader>
					<CardTitle>Edit User</CardTitle>
					<CardDescription>
						Update user information for ID: {id}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-slate-700 mb-1"
							>
								Name
							</label>
							<input
								id="name"
								type="text"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								placeholder="Enter user name"
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-slate-700 mb-1"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
								placeholder="Enter user email"
							/>
						</div>

						<div className="flex gap-3 pt-4">
							<Button type="submit" className="bg-purple-600 hover:bg-purple-700">
								Save Changes
							</Button>
							<Link to={`/dashboard/users/${id}`}>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</Link>
						</div>
					</form>

					<div className="mt-6 pt-6 border-t border-slate-200">
						<div className="bg-blue-50 p-4 rounded-lg">
							<p className="text-sm text-blue-900 font-semibold mb-2">
								📁 Route Structure Example
							</p>
							<div className="text-xs text-blue-800 space-y-1">
								<p>
									<strong>Current route:</strong> /dashboard/users/:id/edit
								</p>
								<p>
									<strong>File location:</strong> pages/dashboard/users/[id]/edit.tsx
								</p>
								<p>
									<strong>Parent routes:</strong> dashboard/layout.tsx → users/layout.tsx → [id]/page.tsx
								</p>
								<p className="mt-2">
									This demonstrates nested layouts with dynamic routes and multiple pages in the same directory!
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
