interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

export async function createTodo(title: string): Promise<{ todo: Todo }> {
	const response = await fetch("/api/todos", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});
	if (!response.ok) throw new Error("Failed to create todo");
	return response.json();
}
