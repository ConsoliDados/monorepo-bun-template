/**
 * File-Based Routing Plugin for Vite
 * Auto-generates routes.tsx from src/pages/ directory
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { buildRouteTree, generateRoutesFile } from "./generator";
import { scanDirectory } from "./scanner";
import type { PluginOptions } from "./types";

export default function fileBasedRoutingPlugin(
	options: PluginOptions = {},
): Plugin {
	const {
		pagesDir = "pages",
		outputFile = "routes.tsx",
		debug = false,
	} = options;

	let srcDir: string;
	let pagesPath: string;
	let outputPath: string;

	/**
	 * Generate routes from pages/ directory
	 */
	function generateRoutes() {
		if (debug) {
			console.log("[file-based-routing] Scanning pages directory:", pagesPath);
		}

		// Scan directory for route files
		const scannedFiles = scanDirectory(pagesPath, pagesPath, { debug });

		if (debug) {
			console.log(
				`[file-based-routing] Found ${scannedFiles.length} route files`,
			);
		}

		// Build route tree
		const routeTree = buildRouteTree(scannedFiles, pagesPath);

		// Generate routes.tsx content
		const content = generateRoutesFile(routeTree, pagesDir);

		// Write to file
		writeFileSync(outputPath, content, "utf-8");

		console.log(`[file-based-routing] ✓ Generated ${outputFile}`);

		if (debug) {
			console.log(`[file-based-routing] Written to: ${outputPath}`);
		}
	}

	return {
		name: "file-based-routing",

		/**
		 * Configure plugin paths
		 */
		configResolved(config) {
			srcDir = join(config.root, "src");
			pagesPath = join(srcDir, pagesDir);
			outputPath = join(srcDir, outputFile);

			if (debug) {
				console.log("[file-based-routing] Config resolved:");
				console.log("  srcDir:", srcDir);
				console.log("  pagesPath:", pagesPath);
				console.log("  outputPath:", outputPath);
			}
		},

		/**
		 * Generate routes on build start
		 */
		buildStart() {
			console.log("[file-based-routing] Generating routes...");
			try {
				generateRoutes();
			} catch (error) {
				console.error("[file-based-routing] Error generating routes:", error);
				throw error;
			}
		},

		/**
		 * Watch for changes in dev mode
		 */
		configureServer(server) {
			// Watch pages/ directory for changes
			const watcher = server.watcher;
			watcher.unwatch(join(srcDir, "routes.tsx"));

			// watcher.add(pagesPath);
			// watcher.add(join(pagesPath, "/**/*.tsx"));

			watcher.on("change", (file) => {
				if (file.startsWith(pagesPath) && file.endsWith(".tsx")) {
					if (debug) {
						console.log("[file-based-routing] File changed:", file);
					}

					console.log("[file-based-routing] Regenerating routes...");
					try {
						generateRoutes();

						// Trigger HMR for routes.tsx
						const routesModule = server.moduleGraph.getModuleById(outputPath);
						if (routesModule) {
							server.moduleGraph.invalidateModule(routesModule);
						}

						server.ws.send({
							type: "full-reload",
							path: "*",
						});
					} catch (error) {
						console.error(
							"[file-based-routing] Error regenerating routes:",
							error,
						);
					}
				}
			});

			watcher.on("add", (file) => {
				if (file.startsWith(pagesPath) && file.endsWith(".tsx")) {
					if (debug) {
						console.log("[file-based-routing] File added:", file);
					}

					console.log("[file-based-routing] Regenerating routes...");
					try {
						generateRoutes();
						server.ws.send({
							type: "full-reload",
							path: "*",
						});
					} catch (error) {
						console.error(
							"[file-based-routing] Error regenerating routes:",
							error,
						);
					}
				}
			});

			watcher.on("unlink", (file) => {
				if (file.startsWith(pagesPath) && file.endsWith(".tsx")) {
					if (debug) {
						console.log("[file-based-routing] File removed:", file);
					}

					console.log("[file-based-routing] Regenerating routes...");
					try {
						generateRoutes();
						server.ws.send({
							type: "full-reload",
							path: "*",
						});
					} catch (error) {
						console.error(
							"[file-based-routing] Error regenerating routes:",
							error,
						);
					}
				}
			});
		},
	};
}
