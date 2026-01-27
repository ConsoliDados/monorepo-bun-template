import { createHash } from "node:crypto";
import { relative, resolve } from "node:path";
import type { Plugin } from "vite";

interface ActionMeta {
	filePath: string;
	functionName: string;
}

interface ActionManifest {
	salt: string;
	actions: Record<string, ActionMeta>;
}

function generateSalt(): string {
	return createHash("sha256")
		.update(Date.now().toString())
		.update(Math.random().toString())
		.digest("hex");
}

function generateActionHash(
	filePath: string,
	functionName: string,
	salt: string,
): string {
	const data = `${filePath}:${functionName}:${salt}`;
	return createHash("sha256").update(data).digest("hex").substring(0, 12);
}

export function serverActions(): Plugin {
	const virtualRuntimeId = "virtual:server-actions-runtime";
	const virtualManifestId = "virtual:server-actions-manifest";
	const resolvedRuntimeId = `\0${virtualRuntimeId}`;
	const resolvedManifestId = `\0${virtualManifestId}`;

	let salt: string;
	const manifest: ActionManifest = { salt: "", actions: {} };

	return {
		name: "server-actions",
		enforce: "pre",

		configResolved() {
			// Generate salt once per Vite session
			salt = generateSalt();
			manifest.salt = salt;
			console.log(
				"[PLUGIN] Server actions salt generated:",
				salt.substring(0, 8) + "...",
			);
		},

		async buildStart() {
			// Pre-scan all .server.ts files to populate manifest early
			// This ensures the manifest is available when server imports it
			const glob = await import("fast-glob");
			const serverFiles = await glob.default("src/**/*.server.ts", {
				cwd: process.cwd(),
				absolute: true,
			});

			console.log(
				`[PLUGIN] Pre-scanning ${serverFiles.length} server action files...`,
			);

			for (const file of serverFiles) {
				const fs = await import("node:fs/promises");
				const code = await fs.readFile(file, "utf-8");

				const relativePath = relative(resolve(process.cwd(), "src"), file).replace(
					/\\/g,
					"/",
				);

				// Extract exports
				const exportMatches = code.matchAll(
					/export\s+(?:async\s+)?function\s+(\w+)/g,
				);
				const exports = Array.from(exportMatches).map((match) => match[1]);

				// Register each export in manifest
				for (const exportName of exports) {
					const hash = generateActionHash(relativePath, exportName, salt);
					manifest.actions[hash] = {
						filePath: relativePath,
						functionName: exportName,
					};
					console.log(
						`[PLUGIN] Pre-registered: ${exportName} → ${hash} (${relativePath})`,
					);
				}
			}

			console.log(
				`[PLUGIN] Manifest ready with ${Object.keys(manifest.actions).length} actions`,
			);
		},

		resolveId(id) {
			if (id === virtualRuntimeId) {
				return resolvedRuntimeId;
			}
			if (id === virtualManifestId) {
				return resolvedManifestId;
			}
		},

		load(id) {
			if (id === resolvedRuntimeId) {
				// Client-side runtime to call server actions using hash
				return `
export async function callServerAction(actionHash, args) {
  console.log('[CLIENT] callServerAction:', { actionHash, args });
  const response = await fetch('/__server-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionHash, args })
  });

  console.log('[CLIENT] Response status:', response.status);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Server action failed' }));
    console.error('[CLIENT] Server action error:', error);
    throw new Error(error.message || 'Server action failed');
  }

  const result = await response.json();
  console.log('[CLIENT] Server action result:', result);
  return result;
}
`;
			}

			if (id === resolvedManifestId) {
				// Export manifest for server-side usage
				return `export default ${JSON.stringify(manifest, null, 2)}`;
			}
		},

		transform(code, id) {
			// Detect imports from .server.ts files
			if (!id.includes(".server.ts") && !id.includes(".server.js")) {
				return null;
			}

			// If it's the .server.ts file itself, don't transform (server-side)
			if (id.endsWith(".server.ts") || id.endsWith(".server.js")) {
				// In dev/build client, replace with stubs that call the server
				if (this.environment?.name === "client" || !this.environment) {
					const relativePath = relative(
						resolve(process.cwd(), "src"),
						id,
					).replace(/\\/g, "/");

					// Extract exports from file
					const exportMatches = code.matchAll(
						/export\s+(?:async\s+)?function\s+(\w+)/g,
					);
					const exports = Array.from(exportMatches).map((match) => match[1]);

					if (exports.length === 0) {
						console.log("[PLUGIN] No exports found in", id);
						return null;
					}

					console.log(
						"[PLUGIN] Transforming .server.ts file:",
						relativePath,
						"with exports:",
						exports,
					);

					// Generate client code that calls the server using hash
					let clientCode = `import { callServerAction } from '${virtualRuntimeId}';\n\n`;

					for (const exportName of exports) {
						// Generate hash for this action
						const hash = generateActionHash(relativePath, exportName, salt);

						// Register in manifest
						manifest.actions[hash] = {
							filePath: relativePath,
							functionName: exportName,
						};

						console.log(
							`[PLUGIN] Registered action: ${exportName} → ${hash} (${relativePath})`,
						);

						// Generate client function that uses hash
						clientCode += `export async function ${exportName}(...args) {
  return callServerAction('${hash}', args);
}\n\n`;
					}

					console.log("[PLUGIN] Generated client code for", relativePath);

					return {
						code: clientCode,
						map: null,
					};
				}
			}

			return null;
		},
	};
}
