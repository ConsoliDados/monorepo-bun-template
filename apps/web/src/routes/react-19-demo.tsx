import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProfileForm } from "../components/react19/ProfileForm";
import { CommentsSection } from "../components/react19/CommentsSection";
import { AsyncDataDisplay } from "../components/react19/AsyncDataDisplay";
import { MultiStepForm } from "../components/react19/MultiStepForm";
import { FileUploadForm } from "../components/react19/FileUploadForm";

export const Route = createFileRoute("/react-19-demo")({
	component: React19DemoPage,
});

type Tab = "useActionState" | "useOptimistic" | "use" | "useFormStatus" | "fileUpload";

function React19DemoPage() {
	const [activeTab, setActiveTab] = useState<Tab>("useActionState");

	const tabs: { id: Tab; label: string; emoji: string }[] = [
		{ id: "useActionState", label: "useActionState", emoji: "📝" },
		{ id: "useOptimistic", label: "useOptimistic", emoji: "⚡" },
		{ id: "use", label: "use()", emoji: "🎣" },
		{ id: "useFormStatus", label: "useFormStatus", emoji: "📊" },
		{ id: "fileUpload", label: "File Upload", emoji: "📎" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
						React 19 - Now Stable!
					</div>
					<h1 className="text-4xl font-bold text-slate-900 mb-3">
						React 19 Features Demo
					</h1>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto">
						Interactive examples of React 19's new hooks and features, fully
						integrated with our SSR setup, TanStack Router, and server actions.
					</p>
				</div>

				{/* Benefits Section */}
				<div className="grid gap-4 md:grid-cols-4 mb-8">
					<div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
						<div className="text-2xl mb-2">🚀</div>
						<h3 className="font-semibold text-slate-900 mb-1">
							Better Performance
						</h3>
						<p className="text-sm text-slate-600">
							Enhanced SSR with improved hydration and streaming
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
						<div className="text-2xl mb-2">✨</div>
						<h3 className="font-semibold text-slate-900 mb-1">Better UX</h3>
						<p className="text-sm text-slate-600">
							Optimistic updates and instant feedback
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
						<div className="text-2xl mb-2">🎯</div>
						<h3 className="font-semibold text-slate-900 mb-1">
							Simpler Code
						</h3>
						<p className="text-sm text-slate-600">
							Less boilerplate, automatic state management
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
						<div className="text-2xl mb-2">🔒</div>
						<h3 className="font-semibold text-slate-900 mb-1">Type-Safe</h3>
						<p className="text-sm text-slate-600">
							Full TypeScript support with our monorepo setup
						</p>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="border-b border-slate-200">
						<nav className="flex overflow-x-auto">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`flex-1 min-w-fit px-6 py-4 font-medium text-sm transition-colors ${
										activeTab === tab.id
											? "bg-purple-50 text-purple-700 border-b-2 border-purple-600"
											: "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
									}`}
								>
									<span className="mr-2">{tab.emoji}</span>
									{tab.label}
								</button>
							))}
						</nav>
					</div>

					{/* Tab Content */}
					<div className="p-6">
						{activeTab === "useActionState" && (
							<div>
								<h2 className="text-2xl font-bold text-slate-900 mb-2">
									useActionState Hook
								</h2>
								<p className="text-slate-600 mb-6">
									Simplify form handling with automatic pending states, error
									handling, and progressive enhancement. No manual useState
									needed!
								</p>
								<ProfileForm />
							</div>
						)}

						{activeTab === "useOptimistic" && (
							<div>
								<h2 className="text-2xl font-bold text-slate-900 mb-2">
									useOptimistic Hook
								</h2>
								<p className="text-slate-600 mb-6">
									Display optimistic UI updates immediately while async
									operations are processing. Perfect for better user experience!
								</p>
								<CommentsSection />
							</div>
						)}

						{activeTab === "use" && (
							<div>
								<h2 className="text-2xl font-bold text-slate-900 mb-2">
									use() Hook
								</h2>
								<p className="text-slate-600 mb-6">
									Read resources like Promises during render with Suspense
									integration. Can be used conditionally unlike other hooks!
								</p>
								<AsyncDataDisplay />
							</div>
						)}

						{activeTab === "useFormStatus" && (
							<div>
								<h2 className="text-2xl font-bold text-slate-900 mb-2">
									useFormStatus Hook
								</h2>
								<p className="text-slate-600 mb-6">
									Access form submission status from child components without
									prop drilling. Perfect for complex forms!
								</p>
								<MultiStepForm />
							</div>
						)}

						{activeTab === "fileUpload" && (
							<div>
								<h2 className="text-2xl font-bold text-slate-900 mb-2">
									File Upload with useActionState
								</h2>
								<p className="text-slate-600 mb-6">
									Upload files with React 19's form actions. Files are
									automatically serialized and sent to the server, with full
									validation and preview support!
								</p>
								<FileUploadForm />
							</div>
						)}
					</div>
				</div>

				{/* Resources Section */}
				<div className="mt-8 bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-bold text-slate-900 mb-4">
						Additional Resources
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<a
							href="https://react.dev/blog/2024/12/05/react-19"
							target="_blank"
							rel="noopener noreferrer"
							className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
						>
							<h3 className="font-semibold text-slate-900 mb-1">
								📖 React 19 Release Notes
							</h3>
							<p className="text-sm text-slate-600">
								Official announcement and feature overview
							</p>
						</a>
						<a
							href="https://react.dev/reference/react"
							target="_blank"
							rel="noopener noreferrer"
							className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
						>
							<h3 className="font-semibold text-slate-900 mb-1">
								📚 React API Reference
							</h3>
							<p className="text-sm text-slate-600">
								Complete documentation for all React 19 hooks
							</p>
						</a>
					</div>
				</div>

				{/* Implementation Notes */}
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h3 className="font-semibold text-blue-900 mb-2">
						Implementation Notes
					</h3>
					<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
						<li>All demos use real server actions (2-2.5s simulated delay)</li>
						<li>Fully integrated with TanStack Router and TanStack Query</li>
						<li>
							Server actions located in{" "}
							<code className="bg-blue-200 px-1 rounded">
								routes/-actions/react19-actions.server.ts
							</code>
						</li>
						<li>Components support SSR and client-side hydration</li>
						<li>Error states simulate 5-10% failure rate for testing</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
