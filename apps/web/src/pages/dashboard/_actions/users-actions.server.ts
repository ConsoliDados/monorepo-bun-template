import type { User } from "@monorepo/api/schemas/user";
import { env } from "../../../../lib/env";

// const backendURl = "http://localhost:3333";
const backendURl = env.backendUrl;

export async function fetchUsers(): Promise<User[]> {
	const response = await fetch(`${backendURl}/api/users`);
	console.log("Fetching users");
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	return response.json();
}
