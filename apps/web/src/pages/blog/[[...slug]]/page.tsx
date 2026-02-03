import { useParams } from "react-router-dom";

export default function BlogPage() {
	const { "*": slug } = useParams();

	// Split slug into segments
	const segments = slug?.split("/").filter(Boolean) || [];
	const isRoot = segments.length === 0;

	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-slate-900 mb-4">
					{isRoot ? "Blog Home" : "Blog Article"}
				</h1>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">
						Optional Catch-All Route Example
					</h2>
					<p className="text-slate-600 mb-4">
						This page demonstrates the <code className="bg-slate-100 px-2 py-1 rounded">[[...slug]]</code> pattern.
						It matches both the root path and any number of segments.
					</p>

					{isRoot ? (
						<div className="bg-green-50 border border-green-200 rounded p-4">
							<p className="text-green-900 font-medium mb-2">
								✓ Currently at root (/blog)
							</p>
							<p className="text-green-700 text-sm">
								This route handles both <code>/blog</code> and <code>/blog/any/path</code>
							</p>
						</div>
					) : (
						<div className="bg-blue-50 border border-blue-200 rounded p-4">
							<p className="text-sm font-medium text-blue-900 mb-2">
								Current Path:
							</p>
							<code className="text-blue-700 text-sm">
								/blog/{slug}
							</code>

							<p className="text-sm font-medium text-blue-900 mt-4 mb-2">
								Segments ({segments.length}):
							</p>
							<ul className="list-disc list-inside text-blue-700 text-sm">
								{segments.map((segment, idx) => (
									<li key={idx}>{segment}</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="bg-slate-100 rounded-lg p-6">
					<h3 className="font-semibold text-slate-900 mb-2">
						Try these URLs:
					</h3>
					<ul className="space-y-2 text-slate-700 text-sm">
						<li>
							<a href="/blog" className="text-blue-600 hover:underline">
								/blog (root - works with optional catch-all!)
							</a>
						</li>
						<li>
							<a href="/blog/2024" className="text-blue-600 hover:underline">
								/blog/2024
							</a>
						</li>
						<li>
							<a href="/blog/2024/01/hello-world" className="text-blue-600 hover:underline">
								/blog/2024/01/hello-world
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
