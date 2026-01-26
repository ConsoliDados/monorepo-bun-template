import { env } from "../../../lib/env";

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

// const frontendUrl = process.env.FRONTEND_URL;
const frontendUrl = env.frontendUrl;

export async function fetchTodos(): Promise<{ todos: Todo[]; count: number }> {
	const response = await fetch(`${frontendUrl}/api/todos`);
	if (!response.ok) throw new Error("Failed to fetch todos");
	return response.json();
}

export async function createTodo(title: string): Promise<{ todo: Todo }> {
	const response = await fetch(`${frontendUrl}/api/todos`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});
	if (!response.ok) throw new Error("Failed to create todo");
	return response.json();
}

export async function deleteTodo(id: number): Promise<{ todo: Todo }> {
	const response = await fetch(`${frontendUrl}/api/todos/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Failed to delete todo");
	return response.json();
}

export async function toggleTodo(
	id: number,
	completed: boolean,
): Promise<{ todo: Todo }> {
	console.log("[SERVER ACTION] toggleTodo called with:", { id, completed });

	// Make the fetch internally on the server to the API
	const response = await fetch(`${frontendUrl}/api/todos/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ completed }),
	});

	if (!response.ok) {
		throw new Error("Failed to update todo");
	}

	const result = await response.json();
	console.log("[SERVER ACTION] toggleTodo result:", result);

	return result;
}
