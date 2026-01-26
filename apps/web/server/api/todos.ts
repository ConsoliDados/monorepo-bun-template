import { Hono } from "hono";

// Simulating an in-memory database
let todos: Array<{
	id: number;
	title: string;
	completed: boolean;
	createdAt: string;
}> = [
	{
		id: 1,
		title: "Setup monorepo with Bun",
		completed: true,
		createdAt: new Date().toISOString(),
	},
	{
		id: 2,
		title: "Implement SSR with Vite",
		completed: true,
		createdAt: new Date().toISOString(),
	},
	{
		id: 3,
		title: "Create example pages",
		completed: false,
		createdAt: new Date().toISOString(),
	},
];

let nextId = 4;

const app = new Hono();

// GET /api/todos - List all todos
app.get("/", (c) => {
	return c.json({ todos, count: todos.length });
});

// POST /api/todos - Create new todo
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

// PATCH /api/todos/:id - Update todo
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

// DELETE /api/todos/:id - Delete todo
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
