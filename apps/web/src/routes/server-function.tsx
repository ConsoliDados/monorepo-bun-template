import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/server-function")({
	component: ServerFunctionPage,
});

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

// API Functions (Server Functions)
async function fetchTodos(): Promise<{ todos: Todo[]; count: number }> {
	const response = await fetch("/api/todos");
	if (!response.ok) throw new Error("Failed to fetch todos");
	return response.json();
}

async function createTodo(title: string): Promise<{ todo: Todo }> {
	const response = await fetch("/api/todos", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});
	if (!response.ok) throw new Error("Failed to create todo");
	return response.json();
}

async function toggleTodo(id: number, completed: boolean): Promise<{ todo: Todo }> {
	const response = await fetch(`/api/todos/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ completed }),
	});
	if (!response.ok) throw new Error("Failed to update todo");
	return response.json();
}

async function deleteTodo(id: number): Promise<{ todo: Todo }> {
	const response = await fetch(`/api/todos/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Failed to delete todo");
	return response.json();
}

function ServerFunctionPage() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const queryClient = useQueryClient();

	// Query para buscar todos
	const { data, isLoading, error } = useQuery({
		queryKey: ["todos"],
		queryFn: fetchTodos,
	});

	// Mutation para criar todo
	const createMutation = useMutation({
		mutationFn: createTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
			setNewTodoTitle("");
		},
	});

	// Mutation para toggle todo
	const toggleMutation = useMutation({
		mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
			toggleTodo(id, completed),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	// Mutation para deletar todo
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
				Esta página demonstra chamadas a server functions (API routes) usando
				TanStack Query. Os dados são gerenciados no servidor e sincronizados
				automaticamente.
			</p>

			<div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
				<h3 className="font-semibold text-purple-900 mb-2">
					Como funciona:
				</h3>
				<ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
					<li>
						Server functions são implementadas como API routes no servidor
						(Hono)
					</li>
					<li>
						TanStack Query gerencia cache, loading states, e revalidação
					</li>
					<li>Mutations atualizam o servidor e invalidam o cache local</li>
					<li>Estado é persistido no servidor (in-memory neste exemplo)</li>
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

				{/* Form para adicionar novo todo */}
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

				{/* Lista de todos */}
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
									{new Date(todo.createdAt).toLocaleDateString("pt-BR", {
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
					Recursos demonstrados:
				</h3>
				<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
					<li>
						<strong>useQuery</strong> - Fetch de dados com cache automático
					</li>
					<li>
						<strong>useMutation</strong> - Operações de escrita (POST, PATCH,
						DELETE)
					</li>
					<li>
						<strong>invalidateQueries</strong> - Revalidação automática após
						mutations
					</li>
					<li>
						<strong>Loading states</strong> - Estados de carregamento e erro
					</li>
					<li>
						<strong>Optimistic updates</strong> - Feedback imediato ao usuário
					</li>
				</ul>
			</div>
		</div>
	);
}
