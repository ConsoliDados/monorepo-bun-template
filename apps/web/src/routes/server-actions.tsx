import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	createTodo,
	deleteTodo,
	fetchTodos,
	toggleTodo,
} from "./-actions/todos-actions.server";

export const Route = createFileRoute("/server-actions")({
	component: ServerFunctionPage,
});

function ServerFunctionPage() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const queryClient = useQueryClient();

	// Query to fetch todos
	const { data, isLoading, error } = useQuery({
		queryKey: ["todos"],
		queryFn: fetchTodos,
	});
	console.log("data", data);

	// Mutation to create todo
	const createMutation = useMutation({
		mutationFn: createTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			setNewTodoTitle("");
		},
	});

	// Mutation to toggle todo
	const toggleMutation = useMutation({
		mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
			toggleTodo(id, completed),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	// Mutation to delete todo
	const deleteMutation = useMutation({
		mutationFn: deleteTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTodoTitle.trim()) {
			createMutation.mutate(newTodoTitle);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-2">Server Functions Example</h1>
			<p className="text-slate-600 mb-8">
				This page demonstrates calls to server actions (API routes) using
				TanStack Query. Data is managed on the server and synchronized
				automatically.
			</p>

			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
				<h3 className="font-semibold text-purple-900 mb-2">How it works:</h3>
				<ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
					<li>
						Server actions are implemented as API routes on the server (Hono)
					</li>
					<li>
						TanStack Query manages cache, loading states, and revalidation
					</li>
					<li>Mutations update the server and invalidate the local cache</li>
					<li>State is persisted on the server (in-memory in this example)</li>
				</ul>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">
					Todo List
					{data && (
						<span className="text-sm text-slate-500 ml-2">
							({data.count} {data.count === 1 ? "item" : "items"})
						</span>
					)}
				</h2>

				{/* Form to add new todo */}
				<form onSubmit={handleSubmit} className="mb-6">
					<div className="flex gap-2">
						<input
							type="text"
							value={newTodoTitle}
							onChange={(e) => setNewTodoTitle(e.target.value)}
							placeholder="Add a new todo..."
							className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
							disabled={createMutation.isPending}
						/>
						<button
							type="submit"
							disabled={createMutation.isPending || !newTodoTitle.trim()}
							className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							{createMutation.isPending ? "Adding..." : "Add"}
						</button>
					</div>
					{createMutation.isError && (
						<p className="text-red-600 text-sm mt-2">
							Error: {createMutation.error.message}
						</p>
					)}
				</form>

				{/* Todo list */}
				{isLoading && (
					<div className="text-center py-8">
						<div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
						<p className="text-slate-600 mt-2">Loading todos...</p>
					</div>
				)}

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
						Error loading todos: {error.message}
					</div>
				)}

				{data && data.todos.length === 0 && (
					<div className="text-center py-8 text-slate-500">
						<p>No todos yet. Add one above!</p>
					</div>
				)}

				{data && data.todos.length > 0 && (
					<div className="space-y-2">
						{data.todos.map((todo) => (
							<div
								key={todo.id}
								className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
							>
								<input
									type="checkbox"
									checked={todo.completed}
									onChange={(e) =>
										toggleMutation.mutate({
											id: todo.id,
											completed: e.target.checked,
										})
									}
									disabled={toggleMutation.isPending}
									className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
								/>

								<span
									className={`flex-1 ${
										todo.completed
											? "line-through text-slate-400"
											: "text-slate-900"
									}`}
								>
									{todo.title}
								</span>

								<span className="text-xs text-slate-400">
									{new Date(todo.createdAt).toLocaleDateString("en-US", {
										day: "2-digit",
										month: "short",
									})}
								</span>

								<button
									type="button"
									onClick={() => deleteMutation.mutate(todo.id)}
									disabled={deleteMutation.isPending}
									className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
								>
									Delete
								</button>
							</div>
						))}
					</div>
				)}

				{/* Stats */}
				{data && data.todos.length > 0 && (
					<div className="mt-6 pt-4 border-t border-slate-200">
						<div className="flex gap-6 text-sm">
							<div>
								<span className="text-slate-600">Total: </span>
								<span className="font-semibold">{data.count}</span>
							</div>
							<div>
								<span className="text-slate-600">Completed: </span>
								<span className="font-semibold text-green-600">
									{data.todos.filter((t) => t.completed).length}
								</span>
							</div>
							<div>
								<span className="text-slate-600">Active: </span>
								<span className="font-semibold text-purple-600">
									{data.todos.filter((t) => !t.completed).length}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">
					Featured resources:
				</h3>
				<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
					<li>
						<strong>useQuery</strong> - Data fetching with automatic caching
					</li>
					<li>
						<strong>useMutation</strong> - Write operations (POST, PATCH,
						DELETE)
					</li>
					<li>
						<strong>invalidateQueries</strong> - Automatic revalidation after
						mutations
					</li>
					<li>
						<strong>Loading states</strong> - Loading and error states
					</li>
					<li>
						<strong>Optimistic updates</strong> - Immediate feedback to the user
					</li>
				</ul>
			</div>
		</div>
	);
}
