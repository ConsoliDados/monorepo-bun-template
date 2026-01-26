interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

export async function toggleTodo(
	id: number,
	completed: boolean,
): Promise<{ todo: Todo }> {
	console.log("[SERVER ACTION] toggleTodo called with:", { id, completed });

	// Make the fetch internally on the server to the API
	const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
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
