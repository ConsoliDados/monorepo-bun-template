interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

export async function fetchTodos(): Promise<{ todos: Todo[]; count: number }> {
	const response = await fetch("/api/todos");
	if (!response.ok) throw new Error("Failed to fetch todos");
	return response.json();
}
