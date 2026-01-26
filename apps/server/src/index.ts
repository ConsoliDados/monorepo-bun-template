import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { usersRoute } from "./routes/users";

const app = new Elysia()
	.get("/", () => ({ message: "Hello from Elysia + Bun!" }))
	.use(
		cors({
			origin: "*",
			// methods: ["GET", "POST", "PUT", "DELETE"],
		}),
	)
	.use(usersRoute)
	.listen(Number(process.env.BACKEND_PORT) || 3333);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
