/**
 * Navigation Interceptor
 *
 * Intercepts navigation events and forces server-side navigation
 * to ensure all requests pass through server middleware (authentication, etc.)
 */

export interface InterceptorOptions {
	/**
	 * Enable debug logging
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Callback when navigation is intercepted
	 */
	onIntercept?: (
		type: "anchor" | "form" | "area",
		href: string,
		element: HTMLElement,
	) => void;

	/**
	 * Custom function to determine if a URL should be intercepted
	 * Return true to intercept, false to allow default behavior
	 */
	shouldIntercept?: (href: string, element: HTMLElement) => boolean;
}

/**
 * Checks if a URL is external or should not be intercepted
 */
function isExternalOrSpecial(href: string | null): boolean {
	if (!href) return true;

	// External URLs (http/https with domain)
	if (href.match(/^https?:\/\//)) return true;

	// Special protocols
	if (
		href.startsWith("mailto:") ||
		href.startsWith("tel:") ||
		href.startsWith("sms:") ||
		href.startsWith("ftp:") ||
		href.startsWith("file:")
	) {
		return true;
	}

	// Hash/anchor links (same page)
	if (href.startsWith("#")) return true;

	// Data URIs
	if (href.startsWith("data:")) return true;

	// Blob URLs
	if (href.startsWith("blob:")) return true;

	return false;
}

/**
 * Checks if an element has attributes that prevent interception
 */
function shouldSkipElement(element: HTMLElement): boolean {
	// Skip if explicitly marked
	if (element.hasAttribute("data-no-intercept")) return true;

	// Skip if has external-link class
	if (element.classList.contains("external-link")) return true;

	// Skip if target is _blank (new tab/window)
	if (element.getAttribute("target") === "_blank") return true;

	// Skip if has download attribute (file download)
	if (element.hasAttribute("download")) return true;

	return false;
}

/**
 * Checks if a form is using React 19 actions
 * React 19 forms have action attribute that starts with "javascript:" or is empty
 * when using useActionState or form actions
 */
function isReact19Form(form: HTMLFormElement): boolean {
	const actionAttr = form.getAttribute("action");

	// React 19 forms with useActionState have no action or javascript: action
	if (!actionAttr || actionAttr.startsWith("javascript:")) {
		return true;
	}

	// Additional check: if action is empty string after trim
	if (actionAttr.trim() === "") {
		return true;
	}

	return false;
}

/**
 * Checks if click event should open in new tab
 * (Cmd/Ctrl+Click, Middle click, Shift+Click)
 */
function isModifiedClick(event: MouseEvent): boolean {
	return (
		event.metaKey || // Cmd on Mac
		event.ctrlKey || // Ctrl on Windows/Linux
		event.shiftKey || // Shift (new window)
		event.button === 1
	); // Middle mouse button
}

/**
 * Sets up the anchor interceptor
 * Call this once in your entry-client.tsx after hydration
 */
export function setupAnchorInterceptor(options: InterceptorOptions = {}): void {
	const { debug = false, onIntercept, shouldIntercept } = options;

	if (debug) {
		console.log("[Navigation] Interceptor initialized");
	}

	/**
	 * Intercept <a> and <area> tag clicks
	 */
	document.addEventListener(
		"click",
		(event) => {
			const target = event.target as HTMLElement;

			// Find closest anchor or area element
			const element = target.closest<HTMLAnchorElement | HTMLAreaElement>(
				"a[href], area[href]",
			);

			if (!element) return;

			// Skip if element should not be intercepted
			if (shouldSkipElement(element)) return;

			// Skip if modified click (Cmd+Click, etc)
			if (isModifiedClick(event)) return;

			const href = element.getAttribute("href");

			// Skip external or special URLs
			if (isExternalOrSpecial(href)) return;

			// Custom shouldIntercept check
			if (shouldIntercept && !shouldIntercept(href || "", element)) {
				return;
			}

			// Determine element type for logging
			const type = element.tagName.toLowerCase() === "area" ? "area" : "anchor";

			if (debug) {
				console.log(`[Navigation] Intercepting ${type}:`, href);
			}

			// Call onIntercept callback if provided
			if (onIntercept) {
				onIntercept(type, href || "", element);
			}

			// Prevent default navigation
			event.preventDefault();

			// Force server-side navigation
			window.location.href = href || "";
		},
		true, // Use capture phase to intercept before other handlers
	);

	/**
	 * Intercept <form> submissions with method="GET"
	 * Forms with GET redirect to URL with query params
	 * React 19 forms with actions are automatically skipped
	 */
	document.addEventListener(
		"submit",
		(event) => {
			const form = event.target as HTMLFormElement;

			if (!form || form.tagName !== "FORM") return;

			// Skip React 19 forms (useActionState, form actions)
			if (isReact19Form(form)) {
				if (debug) {
					console.log("[Navigation] Skipping React 19 form (detected action prop)");
				}
				return;
			}

			// Only intercept GET forms (POST should submit normally)
			const method = (form.method || "get").toLowerCase();
			if (method !== "get") return;

			// Skip if form should not be intercepted
			if (shouldSkipElement(form)) return;

			const action = form.action || window.location.href;

			// Skip external URLs
			if (isExternalOrSpecial(action)) return;

			// Custom shouldIntercept check
			if (shouldIntercept && !shouldIntercept(action, form)) {
				return;
			}

			if (debug) {
				console.log("[Navigation] Intercepting form GET:", action);
			}

			// Call onIntercept callback if provided
			if (onIntercept) {
				onIntercept("form", action, form);
			}

			// Build query string from form data
			const formData = new FormData(form);
			const params = new URLSearchParams();

			for (const [key, value] of formData.entries()) {
				if (typeof value === "string") {
					params.append(key, value);
				}
			}

			const queryString = params.toString();
			const url = queryString ? `${action}?${queryString}` : action;

			// Prevent default form submission
			event.preventDefault();

			// Force server-side navigation
			window.location.href = url;
		},
		true, // Use capture phase
	);

	if (debug) {
		console.log("[Navigation] Interceptor ready");
	}
}

/**
 * Helper function to navigate programmatically with server-side reload
 * Use this instead of window.location.href for clarity and consistency
 *
 * @param href - The URL to navigate to (internal or external)
 *
 * @example
 * ```typescript
 * import { navigate } from '@monorepo/navigation';
 *
 * function handleLogout() {
 *   // Clear client state
 *   localStorage.clear();
 *
 *   // Navigate to home with server-side reload
 *   navigate('/');
 * }
 * ```
 *
 * @note Current implementation is a simple alias for `window.location.href`.
 * Future refactor could use a Proxy to intercept ALL `window.location.href`
 * assignments globally, but this adds complexity and potential conflicts with
 * third-party libraries. For now, explicit usage of this helper is recommended.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Location/href
 */
export function navigate(href: string): void {
	window.location.href = href;
}

/**
 * Helper function to check if current environment supports navigation interception
 */
export function isNavigationSupported(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof document !== "undefined" &&
		typeof window.location !== "undefined"
	);
}
