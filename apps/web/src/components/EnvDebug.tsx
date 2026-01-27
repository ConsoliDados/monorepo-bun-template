import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/card";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";

/**
 * Debug component to display environment variables
 * Automatically iterates over all public env variables
 * No need to edit this file when adding new VITE_* variables
 */
export function EnvDebug() {
	const { env } = useRouteContext({ from: rootRouteId });

	return (
		<Card className="bg-slate-50">
			<CardHeader>
				<CardTitle className="text-sm">Environment Configuration</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-1 text-xs font-mono">
					{Object.entries(env).map(([key, value]) => (
						<div key={key}>
							<span className="text-slate-600">{key}:</span>{" "}
							<span className="font-semibold">{String(value)}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
