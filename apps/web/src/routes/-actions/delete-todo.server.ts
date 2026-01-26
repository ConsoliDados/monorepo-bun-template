interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}

export async function deleteTodo(id: number): Promise<{ todo: Todo }> {
	const response = await fetch(`/api/todos/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Failed to delete todo");
	return response.json();
}
