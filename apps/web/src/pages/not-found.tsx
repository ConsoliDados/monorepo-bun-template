/** biome-ignore-all lint/suspicious/noArrayIndexKey: Example code */
import { Link } from "react-router-dom";

function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-md bg-slate-200 ${className ?? ""}`}
		/>
	);
}

export const meta = {
	title: "404 - Page not found",
	description: "The page you are looking for does not exist.",
};

export default function NotFoundPage() {
	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="max-w-3xl w-full space-y-12">
				{/* 404 Badge */}
				<div className="flex justify-center">
					<div className="flex items-center gap-3 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-50">
						<span className="text-red-500">404</span>
						<span>Page not found</span>
					</div>
				</div>

				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold text-slate-900">
						We couldn’t find this page
					</h1>
					<p className="text-slate-600 max-w-xl mx-auto">
						The URL may be incorrect, or the page might have been moved or
						deleted.
					</p>
				</div>

				{/* Visual placeholder */}
				<div className="flex justify-center">
					<div className="relative w-64 h-40 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
						<span className="text-6xl font-extrabold text-slate-300">404</span>

						{/* subtle skeleton overlays */}
						<div className="absolute -bottom-3 left-6 right-6">
							<Skeleton className="h-3 w-full" />
						</div>
					</div>
				</div>

				{/* Suggested content (skeleton-based) */}
				<div className="grid gap-4 md:grid-cols-2">
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-slate-200 p-6 space-y-4"
						>
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-4 w-2/3" />
						</div>
					))}
				</div>

				{/* Actions */}
				<div className="flex justify-center gap-4">
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
					>
						Go to home
					</Link>

					<button
						type="button"
						onClick={() => history.back()}
						className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
					>
						Go back
					</button>
				</div>
			</div>
		</div>
	);
}
