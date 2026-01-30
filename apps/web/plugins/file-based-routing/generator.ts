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
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
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
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
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
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
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
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
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
						componentName,
						loaderName: exports.hasLoader
							? generateLoaderName(componentName)
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
					componentName: "Layout",
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
					componentName,
					loaderName: exports.hasLoader
						? generateLoaderName(componentName)
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
						componentName,
						loaderName: exports.hasLoader
							? generateLoaderName(componentName)
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
function generateImport(file: RouteFile, pagesDir: string): string {
	// Convert absolute path to relative import from src/
	const importPath = file.relativePath.replace(/\.tsx$/, "");

	if (file.type === "layout") {
		return `import ${file.componentName} from './${pagesDir}/${importPath}';`;
	}

	// For pages with loaders, import both component and loader
	if (file.hasLoader) {
		return `import ${file.componentName}, { loader as ${file.loaderName} } from './${pagesDir}/${importPath}';`;
	}

	return `import ${file.componentName} from './${pagesDir}/${importPath}';`;
}

/**
 * Generate RouteObject for a route node
 */
function generateRouteObject(node: RouteNode, indent: string = "    "): string {
	const lines: string[] = [];
	if (node.path === "/") {
		lines.push(`${indent}{`);
		lines.push(`${indent}  index: true,`);
		if (node.page) {
			// Only use page if there's no layout
			lines.push(`${indent}  element: <${node.page.componentName} />,`);
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
		if (node.path === "*") {
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

		// Add element (layout or page)
		if (node.layout) {
			// Has layout: layout becomes element, page becomes index child (if present)
			lines.push(`${indent}  element: <${node.layout.componentName} />,`);
		} else if (node.page && !hasChildren) {
			// Has page but no children and no layout: page becomes element
			lines.push(`${indent}  element: <${node.page.componentName} />,`);

			if (node.page.hasLoader && node.page.loaderName) {
				lines.push(`${indent}  loader: ${node.page.loaderName},`);
			}
		}
		// else: Has page WITH children but NO layout -> page becomes index child (handled below)

		// Add children
		if (hasChildren || hasPageWithLayout || hasPageWithoutLayoutButWithChildren) {
			lines.push(`${indent}  children: [`);

			// If node has page (with layout OR with children but no layout), page becomes index child
			if (hasPageWithLayout || hasPageWithoutLayoutButWithChildren) {
				lines.push(`${indent}    {`);
				lines.push(`${indent}      index: true,`);
				lines.push(`${indent}      element: <${node.page!.componentName} />,`);

				if (node.page?.hasLoader && node.page.loaderName) {
					lines.push(`${indent}      loader: ${node.page.loaderName},`);
				}

				lines.push(`${indent}    },`);
			}

			// Add regular children
			for (const child of node.children) {
				const childStr = generateRouteObject(child, indent + "    ");
				lines.push(childStr);
			}

			lines.push(`${indent}  ],`);
		}

		lines.push(`${indent}},`);
	} else {
		// Root node - just generate children
		for (const child of node.children) {
			// if (node.path === "/") {
			// 	child.children.push("");
			// }

			const childStr = generateRouteObject(child, indent);
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
	const imports = allFiles.map((file) => generateImport(file, pagesDir));

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
	const routeObjects = generateRouteObject(routeTree);

	// Build file content
	const content = `// This file is auto-generated by file-based-routing plugin
// DO NOT EDIT MANUALLY - changes will be overwritten

import type { RouteObject } from 'react-router-dom';
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
