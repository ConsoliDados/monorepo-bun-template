import { Skeleton } from "@monorepo/ui/components/skeleton";

export default function UsersIndexPage() {
	return (
		<div>
			{/* Title */}
			<div className="mb-6 space-y-3">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Users list */}
			<div className="space-y-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="block p-4 bg-slate-50 rounded-lg border border-slate-200"
					>
						<div className="space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-3 w-56" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
