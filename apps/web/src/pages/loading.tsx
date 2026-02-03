/** biome-ignore-all lint/suspicious/noArrayIndexKey: Example code */
import { Card, CardContent, CardHeader } from "@monorepo/ui/components/card";

function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-md bg-slate-200 ${className ?? ""}`}
		/>
	);
}

export default function Loading() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="space-y-10">
				{/* Header */}
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-80 mx-auto" />
					<Skeleton className="h-5 w-96 mx-auto" />
				</div>

				{/* Example Pages */}
				<div className="rounded-xl p-8 border border-slate-200">
					<div className="space-y-4 text-center mb-8">
						<Skeleton className="h-8 w-64 mx-auto" />
						<Skeleton className="h-4 w-96 mx-auto" />
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<Card key={i} className="h-full">
								<CardHeader>
									<Skeleton className="h-6 w-40 mb-2" />
									<Skeleton className="h-4 w-32" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-5/6" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Stack Features */}
				<div>
					<div className="text-center mb-6">
						<Skeleton className="h-8 w-48 mx-auto" />
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-5 w-32 mb-2" />
									<Skeleton className="h-4 w-48" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-5/6" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Users section */}
				<div>
					<Skeleton className="h-7 w-72 mb-4" />

					<div className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardContent className="p-4 flex items-center justify-between">
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
									<Skeleton className="h-8 w-20" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
