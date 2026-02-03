import { Link } from "react-router-dom";

/**
 * Example page demonstrating REQUIRED catch-all routes [...slug]
 *
 * File: pages/routing-docs/catch-all-required.tsx
 * URL: /routing-docs/catch-all-required
 *
 * This is a named route file that demonstrates how regular routes work.
 * For actual catch-all behavior, see:
 * - pages/docs/[...slug]/page.tsx (required catch-all)
 * - pages/blog/[[...slug]]/page.tsx (optional catch-all)
 */
export default function CatchAllRequiredExample() {
	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<Link
					to="/routing-docs"
					className="text-blue-600 hover:underline mb-4 inline-block"
				>
					← Back to Routing Docs
				</Link>

				<h1 className="text-4xl font-bold text-slate-900 mb-6">
					Required Catch-All Routes: <code className="text-3xl">[...slug]</code>
				</h1>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						What is a Required Catch-All?
					</h2>
					<p className="text-slate-700 mb-4">
						A required catch-all route uses the <code className="bg-slate-100 px-2 py-1 rounded">[...slug]</code> pattern
						and matches one or more path segments. It <strong>requires at least one segment</strong> to match.
					</p>

					<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
						<p className="text-sm font-medium text-blue-900 mb-2">
							💡 Key Characteristics:
						</p>
						<ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
							<li>Matches: /docs/a, /docs/a/b, /docs/a/b/c (any number of segments)</li>
							<li>Does NOT match: /docs (no segments)</li>
							<li>Perfect for: Documentation, file browsers, category hierarchies</li>
						</ul>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						File Structure
					</h2>
					<pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`pages/
  └── docs/
      └── [...slug]/
          └── page.tsx       → Matches /docs/* (1+ segments)

Generated Route:
{
  path: "docs",
  children: [
    {
      path: "*",           // React Router catch-all
      element: <DocsSlugPage />
    }
  ]
}`}
					</pre>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Implementation Example
					</h2>
					<pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// pages/docs/[...slug]/page.tsx
import { useParams } from 'react-router-dom';

export default function DocsPage() {
  const { "*": slug } = useParams();

  // slug will be the full path after /docs/
  // Examples:
  // /docs/getting-started → slug = "getting-started"
  // /docs/api/auth        → slug = "api/auth"

  const segments = slug?.split("/") || [];

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug}</p>
      <p>Segments: {segments.join(", ")}</p>
    </div>
  );
}`}
					</pre>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Live Example
					</h2>
					<p className="text-slate-700 mb-4">
						Try visiting these URLs to see the required catch-all in action:
					</p>
					<div className="space-y-2">
						<a
							href="/docs/getting-started"
							className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
						>
							/docs/getting-started ✓ Matches
						</a>
						<a
							href="/docs/api/authentication"
							className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
						>
							/docs/api/authentication ✓ Matches
						</a>
						<a
							href="/docs/guides/deployment/vercel"
							className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
						>
							/docs/guides/deployment/vercel ✓ Matches
						</a>
						<div className="px-4 py-2 bg-red-50 text-red-700 rounded border border-red-200">
							/docs ✗ Does NOT match (no segments)
						</div>
					</div>
				</div>

				<div className="bg-slate-100 rounded-lg p-6">
					<h3 className="font-semibold text-slate-900 mb-2">
						Use Cases
					</h3>
					<ul className="space-y-2 text-slate-700 text-sm">
						<li>
							<strong>Documentation sites:</strong> /docs/introduction/getting-started
						</li>
						<li>
							<strong>File browsers:</strong> /files/projects/2024/report.pdf
						</li>
						<li>
							<strong>Category hierarchies:</strong> /categories/electronics/computers/laptops
						</li>
						<li>
							<strong>Multi-level routing:</strong> /admin/users/123/settings/profile
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
