import { useParams } from "react-router-dom";

export default function DocsPage() {
	const { "*": slug } = useParams();

	// Split slug into segments
	const segments = slug?.split("/").filter(Boolean) || [];

	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-slate-900 mb-4">
					Documentation
				</h1>

				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">
						Catch-All Route Example (Required)
					</h2>
					<p className="text-slate-600 mb-4">
						This page demonstrates the <code className="bg-slate-100 px-2 py-1 rounded">[...slug]</code> pattern.
						It requires at least one path segment.
					</p>

					<div className="bg-blue-50 border border-blue-200 rounded p-4">
						<p className="text-sm font-medium text-blue-900 mb-2">
							Current Path:
						</p>
						<code className="text-blue-700 text-sm">
							/docs/{slug || "(empty)"}
						</code>

						<p className="text-sm font-medium text-blue-900 mt-4 mb-2">
							Segments ({segments.length}):
						</p>
						{segments.length > 0 ? (
							<ul className="list-disc list-inside text-blue-700 text-sm">
								{segments.map((segment, idx) => (
									<li key={idx}>{segment}</li>
								))}
							</ul>
						) : (
							<p className="text-blue-600 text-sm italic">No segments</p>
						)}
					</div>
				</div>

				<div className="bg-slate-100 rounded-lg p-6">
					<h3 className="font-semibold text-slate-900 mb-2">
						Try these URLs:
					</h3>
					<ul className="space-y-2 text-slate-700 text-sm">
						<li>
							<a href="/docs/getting-started" className="text-blue-600 hover:underline">
								/docs/getting-started
							</a>
						</li>
						<li>
							<a href="/docs/api/authentication" className="text-blue-600 hover:underline">
								/docs/api/authentication
							</a>
						</li>
						<li>
							<a href="/docs/guides/deployment/vercel" className="text-blue-600 hover:underline">
								/docs/guides/deployment/vercel
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
