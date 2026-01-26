import type { CreateUserInput, User } from "@monorepo/api/schemas";
import { Elysia } from "elysia";

// Mock database
const users: User[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		createdAt: new Date(),
	},
];

export const usersRoute = new Elysia({ prefix: "/api/users" })
	.get("/", () => users)
	.get("/:id", ({ params: { id } }) => {
		const user = users.find((u) => u.id === id);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	})
	.post("/", ({ body }) => {
		const input = body as CreateUserInput;
		const newUser: User = {
			id: String(users.length + 1),
			...input,
			createdAt: new Date(),
		};
		users.push(newUser);
		return newUser;
	});
