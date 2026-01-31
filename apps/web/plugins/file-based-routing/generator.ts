/**
 * File-Based Routing Plugin - Generator Module
 * Generates routes.tsx content from route tree
 */

import type { RouteFile, RouteNode } from "./types";
import {
	convertSegmentToRoute,
	parseFilePath,
	type ScannedFile,
} from "./scanner";
import {
	generateComponentName,
	generateLayoutName,
	generateLoaderName,
	generateMetaName,
	parseFile,
} from "./parser";

/**
 * Build route tree from scanned files
 */
export function buildRouteTree(
	files: ScannedFile[],
	baseDir: string,
): RouteNode {
	// Create root node
	const root: RouteNode = {
		path: "/",
		fullPath: "/",
		originalSegment: "",
		isDynamic: false,
		isCatchAll: false,
		isOptionalCatchAll: false,
		isGroup: false,
		children: [],
	};

	// Group files by directory
	const filesByDir = new Map<string, ScannedFile[]>();

	for (const file of files) {
		const { segments, fileName, fileType } = parseFilePath(file.relativePath);

		// Filter out route groups from segments for directory key
		// (react-19-demo) -> removed, so files are grouped by their effective path
		const nonGroupSegments = segments.filter((seg) => {
			const routeInfo = convertSegmentToRoute(seg);
			return !routeInfo.isGroup;
		});

		// Use "." for root-level files (empty segments array after filtering)
		const dirKey = nonGroupSegments.length === 0 ? "." : nonGroupSegments.join("/");

		if (!filesByDir.has(dirKey)) {
			filesByDir.set(dirKey, []);
		}
		filesByDir.get(dirKey)!.push(file);
	}

	// Build tree structure
	for (const [dirPath, dirFiles] of filesByDir.entries()) {
		// Skip root-level files - they're handled specially below
		if (dirPath === ".") {
			continue;
		}

		const segments = dirPath.split("/");

		// Find or create node for this path
		let currentNode = root;

		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const routeInfo = convertSegmentToRoute(segment);
			const pathSoFar = segments.slice(0, i + 1);

			// Find existing child or create new one
			let childNode = currentNode.children.find(
				(child) => child.originalSegment === segment,
			);

			if (!childNode) {
				const fullPath = buildFullPath(pathSoFar);

				childNode = {
					path: routeInfo.routeSegment,
					fullPath,
					originalSegment: segment,
					isDynamic: routeInfo.isDynamic,
					isCatchAll: routeInfo.isCatchAll,
					isOptionalCatchAll: routeInfo.isOptionalCatchAll,
					isGroup: routeInfo.isGroup,
					children: [],
					parent: currentNode,
				};

				currentNode.children.push(childNode);
			}

			currentNode = childNode;
		}

		// Attach files to this node
		for (const file of dirFiles) {
			const { fileName, fileType } = parseFilePath(file.relativePath);
			const exports = parseFile(file.absolutePath);

			if (fileType === "layout") {
				const componentName = generateLayoutName(segments);
				currentNode.layout = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: fileType,
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
						: undefined,
					metaName: exports.hasMeta
						? generateMetaName(componentName)
						: undefined,
				};
			} else if (fileName === "page.tsx" || fileName === "index.tsx") {
				// page.tsx or index.tsx become index routes
				const componentName = generateComponentName(segments, fileName);
				currentNode.page = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: fileType,
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
						: undefined,
					metaName: exports.hasMeta
						? generateMetaName(componentName)
						: undefined,
				};
			} else if (fileType === "error") {
				const componentName = generateComponentName(segments, fileName);
				currentNode.error = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: fileType,
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
						: undefined,
					metaName: exports.hasMeta
						? generateMetaName(componentName)
						: undefined,
				};
			} else if (fileType === "loading") {
				const componentName = generateComponentName(segments, fileName);
				currentNode.loading = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: fileType,
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
						: undefined,
					metaName: exports.hasMeta
						? generateMetaName(componentName)
						: undefined,
				};
			} else {
				// Other files (edit.tsx, about.tsx, etc.) become named child routes
				const routePath = fileName.replace(/\.tsx$/, "");
				const componentName = generateComponentName(segments, fileName);
				const fullPath = buildFullPath([...segments, routePath]);

				// Create a child node for this route
				const childNode: RouteNode = {
					path: routePath,
					fullPath,
					originalSegment: routePath,
					isDynamic: false,
					isCatchAll: false,
					isOptionalCatchAll: false,
					isGroup: false,
					children: [],
					parent: currentNode,
					page: {
						absolutePath: file.absolutePath,
						relativePath: file.relativePath,
						type: "page",
						hasDefaultExport: exports.hasDefaultExport,
						hasLoader: exports.hasLoader,
						hasAction: exports.hasAction,
						hasMeta: exports.hasMeta,
						componentName,
						loaderName: exports.hasLoader
							? generateLoaderName(componentName)
							: undefined,
						metaName: exports.hasMeta
							? generateMetaName(componentName)
							: undefined,
					},
				};

				currentNode.children.push(childNode);
			}
		}
	}

	// Handle root-level files specially (pages/layout.tsx, pages/page.tsx, etc.)
	if (filesByDir.has(".")) {
		const rootFiles = filesByDir.get(".")!;
		for (const file of rootFiles) {
			const { fileName, fileType } = parseFilePath(file.relativePath);
			const exports = parseFile(file.absolutePath);

			if (fileType === "layout") {
				root.layout = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: "layout",
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName: "Layout",
					metaName: exports.hasMeta
						? generateMetaName("Layout")
						: undefined,
				};
			} else if (fileName === "page.tsx" || fileName === "index.tsx") {
				// page.tsx or index.tsx become the root index route
				const componentName = generateComponentName([], fileName);
				root.page = {
					absolutePath: file.absolutePath,
					relativePath: file.relativePath,
					type: "page",
					hasDefaultExport: exports.hasDefaultExport,
					hasLoader: exports.hasLoader,
					hasAction: exports.hasAction,
					hasMeta: exports.hasMeta,
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
						: undefined,
					metaName: exports.hasMeta
						? generateMetaName(componentName)
						: undefined,
				};
			} else {
				// Other files (ssr-example.tsx, about.tsx, etc.) become named child routes
				// Extract filename without extension as the route path
				const routePath = fileName.replace(/\.tsx$/, "");
				const componentName = generateComponentName([], fileName);

				// Create a child node for this route
				const childNode: RouteNode = {
					path: routePath,
					fullPath: `/${routePath}`,
					originalSegment: routePath,
					isDynamic: false,
					isCatchAll: false,
					isOptionalCatchAll: false,
					isGroup: false,
					children: [],
					parent: root,
					page: {
						absolutePath: file.absolutePath,
						relativePath: file.relativePath,
						type: "page",
						hasDefaultExport: exports.hasDefaultExport,
						hasLoader: exports.hasLoader,
						hasAction: exports.hasAction,
						hasMeta: exports.hasMeta,
						componentName,
						loaderName: exports.hasLoader
							? generateLoaderName(componentName)
							: undefined,
						metaName: exports.hasMeta
							? generateMetaName(componentName)
							: undefined,
					},
				};

				root.children.push(childNode);
			}
		}
	}

	return root;
}

/**
 * Build full path from segments (applying group logic)
 */
function buildFullPath(segments: string[]): string {
	const parts: string[] = [];

	for (const segment of segments) {
		const routeInfo = convertSegmentToRoute(segment);
		if (!routeInfo.isGroup && routeInfo.routeSegment) {
			parts.push(routeInfo.routeSegment);
		}
	}

	return "/" + parts.join("/");
}

/**
 * Generate import statement for a route file
 */
function generateImport(
	file: RouteFile,
	pagesDir: string,
	codeSplitting: boolean,
): string {
	// Convert absolute path to relative import from src/
	const importPath = file.relativePath.replace(/\.tsx$/, "");

	// Layouts should never be lazy (they're wrappers)
	if (file.type === "layout") {
		return `import ${file.componentName} from './${pagesDir}/${importPath}';`;
	}

	// Build named imports list (loader, meta)
	const namedImports: string[] = [];
	if (file.hasLoader && file.loaderName) {
		namedImports.push(`loader as ${file.loaderName}`);
	}
	if (file.hasMeta && file.metaName) {
		namedImports.push(`meta as ${file.metaName}`);
	}

	// If code splitting enabled, use React.lazy for components
	if (codeSplitting) {
		const lazyImport = `const ${file.componentName} = lazy(() => import('./${pagesDir}/${importPath}'));`;

		// If we have named imports (loader/meta), import them separately
		if (namedImports.length > 0) {
			const namedImportStr = `import { ${namedImports.join(", ")} } from './${pagesDir}/${importPath}';`;
			return `${namedImportStr}\n${lazyImport}`;
		}

		return lazyImport;
	}

	// Non-lazy import (code splitting disabled)
	if (namedImports.length > 0) {
		return `import ${file.componentName}, { ${namedImports.join(", ")} } from './${pagesDir}/${importPath}';`;
	}

	return `import ${file.componentName} from './${pagesDir}/${importPath}';`;
}

/**
 * Wrap element with Suspense if needed for lazy loading
 */
function wrapWithSuspense(
	element: string,
	indent: string,
	codeSplitting: boolean,
): string {
	if (!codeSplitting) {
		return element;
	}

	return `<Suspense fallback={<div>Loading...</div>}>\n${indent}  ${element}\n${indent}</Suspense>`;
}

/**
 * Generate RouteObject for a route node
 */
function generateRouteObject(
	node: RouteNode,
	indent: string = "    ",
	codeSplitting: boolean = false,
): string {
	const lines: string[] = [];
	if (node.path === "/") {
		lines.push(`${indent}{`);
		lines.push(`${indent}  index: true,`);
		if (node.page) {
			// Only use page if there's no layout
			const element = wrapWithSuspense(
				`<${node.page.componentName} />`,
				`${indent}  `,
				codeSplitting,
			);
			lines.push(`${indent}  element: ${element},`);
			// Add loader only if no layout (otherwise it goes on the index child)
			if (node.page.hasLoader && node.page.loaderName) {
				lines.push(`${indent}  loader: ${node.page.loaderName},`);
			}
		}
		lines.push(`${indent}    },`);
	}

	// Skip root node
	if (node.path !== "/") {
		lines.push(`${indent}{`);

		// Add path
		// For optional catch-all, we don't add path here - children will handle it
		if (node.isOptionalCatchAll) {
			// Get the parent directory name as the path
			const parentPath = node.fullPath.split("/").filter(Boolean).pop() || "";
			if (parentPath) {
				lines.push(`${indent}  path: "${parentPath}",`);
			}
		} else if (node.path === "*") {
			lines.push(`${indent}  path: "*",`);
		} else if (node.path) {
			lines.push(`${indent}  path: "${node.path}",`);
		} else {
			// Index route
			lines.push(`${indent}  index: true,`);
		}

		// Determine how to handle page and layout
		const hasChildren = node.children.length > 0;
		const hasPageWithLayout = node.layout && node.page;
		const hasPageWithoutLayoutButWithChildren = !node.layout && node.page && hasChildren;

		// Special handling for optional catch-all [[...slug]]
		// It needs to match both index route and wildcard route
		if (node.isOptionalCatchAll && node.page) {
			// Don't add element at this level - we'll create children instead
			// This forces the route to have children (index + wildcard)
		} else if (node.layout) {
			// Has layout: layout becomes element, page becomes index child (if present)
			lines.push(`${indent}  element: <${node.layout.componentName} />,`);
		} else if (node.page && !hasChildren) {
			// Has page but no children and no layout: page becomes element
			const element = wrapWithSuspense(
				`<${node.page.componentName} />`,
				`${indent}  `,
				codeSplitting,
			);
			lines.push(`${indent}  element: ${element},`);

			if (node.page.hasLoader && node.page.loaderName) {
				lines.push(`${indent}  loader: ${node.page.loaderName},`);
			}

			if (node.page.hasMeta && node.page.metaName) {
				lines.push(`${indent}  handle: { meta: ${node.page.metaName} },`);
			}
		}
		// else: Has page WITH children but NO layout -> page becomes index child (handled below)

		// Add children
		const needsChildren = hasChildren || hasPageWithLayout || hasPageWithoutLayoutButWithChildren || node.isOptionalCatchAll;

		if (needsChildren) {
			lines.push(`${indent}  children: [`);

			// Special handling for optional catch-all: create both index and wildcard routes
			if (node.isOptionalCatchAll && node.page) {
				// Index route for /blog
				lines.push(`${indent}    {`);
				lines.push(`${indent}      index: true,`);
				const element = wrapWithSuspense(
					`<${node.page.componentName} />`,
					`${indent}      `,
					codeSplitting,
				);
				lines.push(`${indent}      element: ${element},`);
				if (node.page.hasLoader && node.page.loaderName) {
					lines.push(`${indent}      loader: ${node.page.loaderName},`);
				}
				if (node.page.hasMeta && node.page.metaName) {
					lines.push(`${indent}      handle: { meta: ${node.page.metaName} },`);
				}
				lines.push(`${indent}    },`);

				// Wildcard route for /blog/*
				lines.push(`${indent}    {`);
				lines.push(`${indent}      path: "*",`);
				lines.push(`${indent}      element: ${element},`);
				if (node.page.hasLoader && node.page.loaderName) {
					lines.push(`${indent}      loader: ${node.page.loaderName},`);
				}
				if (node.page.hasMeta && node.page.metaName) {
					lines.push(`${indent}      handle: { meta: ${node.page.metaName} },`);
				}
				lines.push(`${indent}    },`);
			}
			// If node has page (with layout OR with children but no layout), page becomes index child
			else if (hasPageWithLayout || hasPageWithoutLayoutButWithChildren) {
				lines.push(`${indent}    {`);
				lines.push(`${indent}      index: true,`);

				const element = wrapWithSuspense(
					`<${node.page!.componentName} />`,
					`${indent}      `,
					codeSplitting,
				);
				lines.push(`${indent}      element: ${element},`);

				if (node.page?.hasLoader && node.page.loaderName) {
					lines.push(`${indent}      loader: ${node.page.loaderName},`);
				}

				if (node.page?.hasMeta && node.page.metaName) {
					lines.push(`${indent}      handle: { meta: ${node.page.metaName} },`);
				}

				lines.push(`${indent}    },`);
			}

			// Add regular children
			for (const child of node.children) {
				const childStr = generateRouteObject(child, indent + "    ", codeSplitting);
				lines.push(childStr);
			}

			lines.push(`${indent}  ],`);
		}

		lines.push(`${indent}},`);
	} else {
		// Root node - just generate children
		for (const child of node.children) {
			const childStr = generateRouteObject(child, indent, codeSplitting);
			lines.push(childStr);
		}
	}

	return lines.join("\n");
}

/**
 * Generate complete routes.tsx content
 */
export function generateRoutesFile(
	routeTree: RouteNode,
	pagesDir: string,
	codeSplitting: boolean = false,
): string {
	// Collect all route files
	const allFiles: RouteFile[] = [];

	function collectFiles(node: RouteNode) {
		if (node.layout) allFiles.push(node.layout);
		if (node.page) allFiles.push(node.page);
		if (node.error) allFiles.push(node.error);
		if (node.loading) allFiles.push(node.loading);

		for (const child of node.children) {
			collectFiles(child);
		}
	}

	collectFiles(routeTree);

	// Generate imports
	const imports = allFiles.map((file) =>
		generateImport(file, pagesDir, codeSplitting),
	);

	// Check if root has layout (pages/layout.tsx)
	const hasRootLayout = routeTree.layout;
	const rootLayoutElement = hasRootLayout
		? `<${routeTree.layout!.componentName} />`
		: "<RootLayout />";

	// Add RootLayout import only if not using pages/layout.tsx
	const rootLayoutImport = hasRootLayout
		? ""
		: "import RootLayout from './pages/layout';";

	// Generate route objects
	const routeObjects = generateRouteObject(routeTree, "    ", codeSplitting);

	// Add React imports if code splitting is enabled
	const reactImports = codeSplitting
		? "import { lazy, Suspense } from 'react';\n"
		: "";

	// Build file content
	const content = `// This file is auto-generated by file-based-routing plugin
// DO NOT EDIT MANUALLY - changes will be overwritten

${reactImports}import type { RouteObject } from 'react-router-dom';
${rootLayoutImport}

// Auto-generated imports
${imports.join("\n")}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: ${rootLayoutElement},
    children: [
${routeObjects}
    ]
  }
];
`;

	return content;
}
