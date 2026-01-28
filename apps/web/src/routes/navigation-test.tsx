import { Button } from "@monorepo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/components/card";
import { createFileRoute, Link as TanStackLink } from "@tanstack/react-router";
import { useState } from "react";
import { Link as CustomLink } from "../components/Link";

export const Route = createFileRoute("/navigation-test")({
	component: NavigationTest,
});

function NavigationTest() {
	const [logs, setLogs] = useState<string[]>([]);

	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						Navigation Interceptor Tests
					</h1>
					<p className="text-lg text-slate-600">
						Test different navigation methods and see which ones are intercepted
						for server-side navigation
					</p>
				</div>

				{/* Debug Log */}
				<Card className="bg-slate-900 text-white">
					<CardHeader>
						<CardTitle className="text-white">
							Debug Log (Check Browser Console)
						</CardTitle>
						<CardDescription className="text-slate-300">
							Intercepted navigations are logged here and in the browser console
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
							{logs.length === 0 ? (
								<p className="text-slate-400">
									Click any link below to see logs...
								</p>
							) : (
								logs.map((log, i) => (
									<div key={i} className="text-green-400">
										{log}
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* Internal Navigation (Should be intercepted) */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						✅ Internal Navigation (Should Force Server-Side)
					</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* 1. Normal anchor tag */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">1. Normal Anchor Tag</CardTitle>
								<CardDescription>
									Standard <code>&lt;a href&gt;</code> tag
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/dashboard"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
									onClick={() => addLog("Clicked: Normal <a> tag")}
								>
									Go to Dashboard
								</a>
								<p className="text-xs text-slate-600">
									Expected: Intercepted → Server-side
								</p>
							</CardContent>
						</Card>

						{/* 2. Custom Link wrapper */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">2. Custom Link Wrapper</CardTitle>
								<CardDescription>
									Our <code>Link</code> with <code>reloadDocument</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<CustomLink
									to="/dashboard"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 w-full"
									onClick={() => addLog("Clicked: Custom Link wrapper")}
								>
									Go to Dashboard
								</CustomLink>
								<p className="text-xs text-slate-600">
									Expected: Server-side (reloadDocument=true)
								</p>
							</CardContent>
						</Card>

						{/* 3. TanStack Router Link WITHOUT reloadDocument */}
						<Card className="hover:shadow-lg transition-shadow border-2 border-orange-200 bg-orange-50">
							<CardHeader>
								<CardTitle className="text-lg">
									3. TanStack Link (No Reload)
								</CardTitle>
								<CardDescription>
									TanStack Link <strong>without</strong>{" "}
									<code>reloadDocument</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<TanStackLink
									to="/dashboard"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2 w-full"
									onClick={() =>
										addLog("Clicked: TanStack Link (no reloadDocument)")
									}
								>
									Go to Dashboard
								</TanStackLink>
								<p className="text-xs text-orange-800 font-semibold">
									⚠️ Test: Does interceptor override TanStack?
								</p>
							</CardContent>
						</Card>

						{/* 4. Form with GET */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">4. Form with GET</CardTitle>
								<CardDescription>
									<code>&lt;form method="get"&gt;</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<form
									method="get"
									action="/dashboard"
									onSubmit={() => addLog("Submitted: GET form")}
								>
									<input type="hidden" name="source" value="form-test" />
									<Button type="submit" className="w-full">
										Submit Form
									</Button>
								</form>
								<p className="text-xs text-slate-600">
									Expected: Intercepted → Server-side
								</p>
							</CardContent>
						</Card>

						{/* 5. Button with window.location.href */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">
									5. window.location.href
								</CardTitle>
								<CardDescription>
									Direct assignment to <code>window.location.href</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<Button
									onClick={() => {
										addLog("Clicked: window.location.href assignment");
										window.location.href = "/dashboard";
									}}
									className="w-full"
								>
									Navigate via JS
								</Button>
								<p className="text-xs text-slate-600">
									Expected: Server-side (not intercepted)
								</p>
							</CardContent>
						</Card>

						{/* 6. Anchor with nested element */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">6. Nested Elements</CardTitle>
								<CardDescription>
									<code>&lt;a&gt;</code> with nested <code>&lt;div&gt;</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/dashboard"
									className="block w-full rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
									onClick={() => addLog("Clicked: Anchor with nested div")}
								>
									<div className="p-3 text-center font-medium">
										<div>Click anywhere</div>
										<div className="text-sm opacity-80">Nested div test</div>
									</div>
								</a>
								<p className="text-xs text-slate-600">
									Expected: Intercepted (event delegation)
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* External/Special Navigation (Should NOT be intercepted) */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						❌ External/Special Links (Should NOT Be Intercepted)
					</h2>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* External HTTP */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">7. External Link</CardTitle>
								<CardDescription>
									<code>href="https://..."</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="https://github.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Open GitHub ↗
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (external)
								</p>
							</CardContent>
						</Card>

						{/* Mailto */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">8. Email Link</CardTitle>
								<CardDescription>
									<code>href="mailto:..."</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="mailto:test@example.com"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Send Email 📧
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (mailto:)
								</p>
							</CardContent>
						</Card>

						{/* Tel */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">9. Phone Link</CardTitle>
								<CardDescription>
									<code>href="tel:..."</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="tel:+1234567890"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Call Phone 📱
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (tel:)
								</p>
							</CardContent>
						</Card>

						{/* Hash link */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">10. Hash/Anchor Link</CardTitle>
								<CardDescription>
									<code>href="#section"</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="#header"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Jump to Top #
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (hash)
								</p>
							</CardContent>
						</Card>

						{/* Download */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">11. Download Link</CardTitle>
								<CardDescription>
									<code>download</code> attribute
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/fake-file.pdf"
									download
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Download File 📥
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (download)
								</p>
							</CardContent>
						</Card>

						{/* Target blank */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">12. New Tab Link</CardTitle>
								<CardDescription>
									<code>target="_blank"</code>
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/dashboard"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full"
								>
									Open in New Tab ↗
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (target=_blank)
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Special Cases */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						🔧 Special Cases
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						{/* data-no-intercept */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">
									13. Opt-out with data-no-intercept
								</CardTitle>
								<CardDescription>
									<code>data-no-intercept</code> attribute
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/dashboard"
									data-no-intercept
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2 w-full"
								>
									Client-side Navigation (Opt-out)
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (explicit opt-out)
								</p>
							</CardContent>
						</Card>

						{/* Cmd/Ctrl + Click simulation */}
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="text-lg">
									14. Modified Click (Cmd/Ctrl)
								</CardTitle>
								<CardDescription>Hold Cmd/Ctrl while clicking</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<a
									href="/dashboard"
									className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 w-full"
								>
									Try Cmd+Click / Ctrl+Click
								</a>
								<p className="text-xs text-slate-600">
									Expected: NOT intercepted (opens new tab)
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Instructions */}
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader>
						<CardTitle>📋 Test Instructions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm">
						<p>
							<strong>1. Open Browser DevTools Console</strong> - You'll see
							debug logs from the interceptor
						</p>
						<p>
							<strong>2. Click each link above</strong> - Observe which ones
							trigger full page reload vs client-side navigation
						</p>
						<p>
							<strong>3. Key Test: #3 TanStack Link</strong> - This will show
							if the interceptor successfully overrides TanStack Router's
							client-side navigation
						</p>
						<p>
							<strong>4. Expected Behavior:</strong>
						</p>
						<ul className="list-disc list-inside pl-4 space-y-1">
							<li>
								✅ Internal links (1-6): Full page reload (server-side)
							</li>
							<li>
								❌ External/special (7-12): Default browser behavior (no
								interception)
							</li>
							<li>🔧 Special cases (13-14): Conditional behavior</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
