import { Card, CardContent, CardHeader, CardTitle } from "@monorepo/ui/card";
import { rootRouteId, useRouteContext } from "@tanstack/react-router";
import type { publicEnv } from "../../lib/env.public";

/**
 * Debug component to display environment variables
 * Demonstrates how to access env from Router Context
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
					{Object.keys(env).map((key) => (
						<div key={key}>
							<span className="text-slate-600">{key}</span>{" "}
							<span className="font-semibold">
								{env[key as keyof typeof publicEnv]}
							</span>
						</div>
					))}
					<div>
						<span className="text-slate-600">Environment:</span>{" "}
						<span className="font-semibold">{env.nodeEnv}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
