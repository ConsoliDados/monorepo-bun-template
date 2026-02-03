import { Link } from "react-router-dom";

/**
 * Example page demonstrating OPTIONAL catch-all routes [[...slug]]
 *
 * File: pages/routing-docs/catch-all-optional.tsx
 * URL: /routing-docs/catch-all-optional
 *
 * This is a named route file that demonstrates how regular routes work.
 * For actual optional catch-all behavior, see:
 * - pages/blog/[[...slug]]/page.tsx (optional catch-all)
 */
export default function CatchAllOptionalExample() {
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
					Optional Catch-All Routes:{" "}
					<code className="text-3xl">[[...slug]]</code>
				</h1>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						What is an Optional Catch-All?
					</h2>
					<p className="text-slate-700 mb-4">
						An optional catch-all route uses the{" "}
						<code className="bg-slate-100 px-2 py-1 rounded">
							[[...slug]]
						</code>{" "}
						pattern and matches <strong>zero or more</strong> path segments. It
						can match the base path with no segments.
					</p>

					<div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
						<p className="text-sm font-medium text-green-900 mb-2">
							💡 Key Characteristics:
						</p>
						<ul className="list-disc list-inside text-green-800 text-sm space-y-1">
							<li>
								Matches: /blog, /blog/2024, /blog/2024/01/post (zero or more
								segments)
							</li>
							<li>Unlike required catch-all, it ALSO matches /blog (zero segments)</li>
							<li>Perfect for: Blog indexes, flexible routing, optional hierarchies</li>
						</ul>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						File Structure
					</h2>
					<pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
{`pages/
  └── blog/
      └── [[...slug]]/
          └── page.tsx       → Matches /blog AND /blog/*

Generated Routes:
{
  path: "blog",
  children: [
    {
      index: true,         // Matches /blog
      element: <BlogSlugPage />
    },
    {
      path: "*",           // Matches /blog/*
      element: <BlogSlugPage />
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
{`// pages/blog/[[...slug]]/page.tsx
import { useParams } from 'react-router-dom';

export default function BlogPage() {
  const { "*": slug } = useParams();

  // slug will be undefined for /blog
  // or contain the path for /blog/...
  const segments = slug?.split("/").filter(Boolean) || [];
  const isRoot = segments.length === 0;

  if (isRoot) {
    return <h1>Blog Home</h1>;
  }

  return (
    <div>
      <h1>Blog Article</h1>
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
						Try visiting these URLs to see the optional catch-all in action:
					</p>
					<div className="space-y-2">
						<a
							href="/blog"
							className="block px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
						>
							/blog ✓ Matches (root)
						</a>
						<a
							href="/blog/2024"
							className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
						>
							/blog/2024 ✓ Matches
						</a>
						<a
							href="/blog/2024/01/hello-world"
							className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
						>
							/blog/2024/01/hello-world ✓ Matches
						</a>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">
						Comparison: Required vs Optional
					</h2>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
										Pattern
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
										/blog
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
										/blog/2024
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
										Use When
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-200">
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
										<code>[...slug]</code>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
										✗ No match
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
										✓ Matches
									</td>
									<td className="px-6 py-4 text-sm text-slate-500">
										Path must have content
									</td>
								</tr>
								<tr>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
										<code>[[...slug]]</code>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
										✓ Matches
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
										✓ Matches
									</td>
									<td className="px-6 py-4 text-sm text-slate-500">
										Path can be empty or have content
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="bg-slate-100 rounded-lg p-6">
					<h3 className="font-semibold text-slate-900 mb-2">Use Cases</h3>
					<ul className="space-y-2 text-slate-700 text-sm">
						<li>
							<strong>Blog with index:</strong> /blog (list) and
							/blog/2024/post-title (article)
						</li>
						<li>
							<strong>Shop categories:</strong> /shop (all products) and
							/shop/electronics/phones (filtered)
						</li>
						<li>
							<strong>User profiles:</strong> /user (my profile) and
							/user/john-doe (other profile)
						</li>
						<li>
							<strong>Settings pages:</strong> /settings (overview) and
							/settings/privacy/cookies (specific)
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
