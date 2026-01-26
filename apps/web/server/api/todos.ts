import { Hono } from "hono";

// Simulando um banco de dados em memória
let todos: Array<{
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}> = [
	{
		id: 1,
		title: "Configurar monorepo com Bun",
		completed: true,
		createdAt: new Date().toISOString(),
	},
	{
		id: 2,
		title: "Implementar SSR com Vite",
		completed: true,
		createdAt: new Date().toISOString(),
	},
	{
		id: 3,
		title: "Criar exemplos de páginas",
		completed: false,
		createdAt: new Date().toISOString(),
	},
];

let nextId = 4;

const app = new Hono();

// GET /api/todos - Lista todos
app.get("/", (c) => {
	return c.json({ todos, count: todos.length });
});

// POST /api/todos - Cria novo todo
app.post("/", async (c) => {
	const body = await c.req.json();

	if (!body.title || typeof body.title !== "string") {
		return c.json({ error: "Title is required" }, 400);
	}

	const newTodo = {
		id: nextId++,
		title: body.title,
		completed: false,
		createdAt: new Date().toISOString(),
	};

	todos.push(newTodo);

	return c.json({ todo: newTodo }, 201);
});

// PATCH /api/todos/:id - Atualiza todo
app.patch("/:id", async (c) => {
	const id = Number.parseInt(c.req.param("id"));
	const body = await c.req.json();

	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		return c.json({ error: "Todo not found" }, 404);
	}

	if (typeof body.completed === "boolean") {
		todo.completed = body.completed;
	}

	if (typeof body.title === "string") {
		todo.title = body.title;
	}

	return c.json({ todo });
});

// DELETE /api/todos/:id - Remove todo
app.delete("/:id", (c) => {
	const id = Number.parseInt(c.req.param("id"));
	const index = todos.findIndex((t) => t.id === id);

	if (index === -1) {
		return c.json({ error: "Todo not found" }, 404);
	}

	const [deleted] = todos.splice(index, 1);

	return c.json({ todo: deleted });
});

export default app;
