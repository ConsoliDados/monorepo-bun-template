import { Button } from "@monorepo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@monorepo/ui/components/card";
import { Link } from "../components/Link";

export function DashboardPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						Protected Dashboard
					</h1>
					<p className="text-lg text-slate-600">
						This page requires the "auth-session" cookie to access
					</p>
				</div>

				{/* Authentication Info Card */}
				<Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
					<CardHeader>
						<CardTitle className="text-green-900">
							✓ Authentication Successful
						</CardTitle>
						<CardDescription className="text-green-700">
							You have a valid auth-session cookie
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-green-800">
							The middleware verified your session and allowed access to this
							protected route. If you didn't have the cookie, you would have
							been redirected to the home page.
						</p>
					</CardContent>
				</Card>

				{/* How It Works */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						How the Middleware Works
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>1. Route Matching</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									The middleware is configured with{" "}
									<code className="bg-slate-100 px-2 py-1 rounded text-purple-600">
										matcher: ["/dashboard/:path*"]
									</code>
									, which intercepts all routes under /dashboard.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>2. Cookie Check</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									The middleware checks for the{" "}
									<code className="bg-slate-100 px-2 py-1 rounded text-purple-600">
										auth-session
									</code>{" "}
									cookie on every request to matched routes.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>3. Redirect if Unauthorized</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									If the cookie is missing, the middleware redirects to{" "}
									<code className="bg-slate-100 px-2 py-1 rounded text-purple-600">
										/
									</code>{" "}
									before the page is rendered.
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>4. Allow Access</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-slate-600">
									If the cookie exists, the middleware calls{" "}
									<code className="bg-slate-100 px-2 py-1 rounded text-purple-600">
										next()
									</code>{" "}
									to allow the request to proceed normally.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Test Controls */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Test the Middleware
					</h2>
					<Card>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-slate-900 mb-2">
										To test the middleware:
									</h3>
									<ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
										<li>
											Open your browser's developer tools (F12) and go to the
											Application/Storage tab
										</li>
										<li>
											Find the <strong>auth-session</strong> cookie and delete
											it
										</li>
										<li>
											Refresh this page or try to navigate to /dashboard again
										</li>
										<li>
											You should be redirected to the home page automatically
										</li>
									</ol>
								</div>

								<div className="pt-4 border-t">
									<h3 className="font-semibold text-slate-900 mb-2">
										To regain access:
									</h3>
									<p className="text-sm text-slate-600 mb-3">
										You can set the cookie manually in the browser console:
									</p>
									<pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
										{`document.cookie = "auth-session=valid; path=/; max-age=3600"`}
									</pre>
								</div>

								<div className="flex gap-3 pt-4">
									<Link to="/">
										<Button variant="outline">← Back to Home</Button>
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Implementation Details */}
				<div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Implementation Details
					</h2>
					<Card>
						<CardHeader>
							<CardTitle>Middleware Location</CardTitle>
							<CardDescription>src/middleware.ts</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto">
								{`import { getCookie } from "hono/cookie";
import type {
  MiddlewareConfig,
  MiddlewareHandler,
} from "../server/middleware/types";

export const config: MiddlewareConfig = {
  matcher: [
    "/dashboard",        // Protect dashboard root
    "/dashboard/:path*", // Protect all sub-routes
  ],
};

export const middleware: MiddlewareHandler = async (c, next) => {
  const authSession = getCookie(c, "auth-session");

  if (!authSession) {
    return c.redirect("/");
  }

  await next();
};`}
							</pre>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
