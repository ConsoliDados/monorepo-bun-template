import { Link as RouterLink, type LinkProps } from "react-router-dom";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Custom Link component that forces server-side navigation
 *
 * This component wraps React Router's Link and adds `reloadDocument`
 * to ensure all navigation triggers a full page reload, passing through
 * server-side middleware.
 *
 * Use this for routes protected by server-side middleware that rely on
 * HTTP-only cookies or other server-side authentication mechanisms.
 *
 * @example
 * ```tsx
 * import { Link } from "@/components/Link";
 *
 * <Link to="/dashboard">Go to Dashboard</Link>
 * ```
 */
export function Link(props: LinkProps & ComponentPropsWithoutRef<"a">) {
	return <RouterLink {...props} reloadDocument />;
}
