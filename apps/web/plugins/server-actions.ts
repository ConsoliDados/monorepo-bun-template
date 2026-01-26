import { relative, resolve } from "node:path";
import type { Plugin } from "vite";

export function serverActions(): Plugin {
	const virtualModuleId = "virtual:server-actions-runtime";
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	return {
		name: "server-actions",
		enforce: "pre",

		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},

		load(id) {
			if (id === resolvedVirtualModuleId) {
				// Client-side runtime to call server actions
				return `
export async function callServerAction(actionPath, functionName, args) {
  console.log('[CLIENT] callServerAction:', { actionPath, functionName, args });
  const response = await fetch('/__server-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionPath, functionName, args })
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

					console.log("[PLUGIN] Transforming .server.ts file:", relativePath, "with exports:", exports);

					// Generate client code that calls the server
					let clientCode = `import { callServerAction } from '${virtualModuleId}';\n\n`;

					for (const exportName of exports) {
						clientCode += `export async function ${exportName}(...args) {
  return callServerAction('${relativePath}', '${exportName}', args);
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
