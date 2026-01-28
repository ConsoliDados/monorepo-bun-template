"use client";

import React, { Suspense, use, useState } from "react";
import { fetchAsyncData } from "../../routes/-actions/react19-actions.server";

interface AsyncData {
	title: string;
	description: string;
	items: string[];
	loadedAt: string;
}

// Component that uses the use() hook to read a Promise
function DataContent({ dataPromise }: { dataPromise: Promise<AsyncData> }) {
	// The use() hook reads the promise and suspends while pending
	const data = use(dataPromise);

	return (
		<div className="space-y-4">
			<div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
				<h3 className="text-2xl font-bold text-slate-900 mb-2">
					{data.title}
				</h3>
				<p className="text-slate-700 mb-4">{data.description}</p>

				<div className="space-y-2">
					{data.items.map((item, index) => (
						<div
							key={index}
							className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
						>
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
								{index + 1}
							</div>
							<span className="text-slate-800">{item}</span>
						</div>
					))}
				</div>

				<div className="mt-4 pt-4 border-t border-purple-200">
					<p className="text-xs text-slate-500">
						Data loaded at: {new Date(data.loadedAt).toLocaleTimeString()}
					</p>
				</div>
			</div>
		</div>
	);
}

// Error Boundary fallback component
function ErrorFallback({
	error,
	resetError,
}: { error: Error; resetError: () => void }) {
	return (
		<div className="p-6 bg-red-50 border border-red-200 rounded-lg">
			<h3 className="text-lg font-semibold text-red-900 mb-2">
				Error Loading Data
			</h3>
			<p className="text-red-800 mb-4">{error.message}</p>
			<button
				type="button"
				onClick={resetError}
				className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
			>
				Try Again
			</button>
		</div>
	);
}

// Simple Error Boundary implementation
class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; fallback: (error: Error) => React.ReactNode },
	{ error: Error | null }
> {
	constructor(props: any) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error);
		}
		return this.props.children;
	}
}

export function AsyncDataDisplay() {
	const [dataPromise, setDataPromise] = useState<Promise<AsyncData> | null>(
		null,
	);
	const [key, setKey] = useState(0);

	const loadData = () => {
		setDataPromise(fetchAsyncData());
		setKey((prev) => prev + 1);
	};

	const resetError = () => {
		setDataPromise(null);
		setKey((prev) => prev + 1);
	};

	return (
		<div className="space-y-4">
			<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
				<h3 className="font-semibold text-orange-900 mb-2">use() Hook</h3>
				<p className="text-sm text-orange-800">
					The <code className="bg-orange-200 px-1 rounded">use()</code> hook
					reads resources like Promises during render. It integrates with
					Suspense for loading states and Error Boundaries for error handling.
					Unlike other hooks, it can be used conditionally!
				</p>
			</div>

			<div className="flex gap-3">
				<button
					type="button"
					onClick={loadData}
					disabled={dataPromise !== null}
					className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
				>
					{dataPromise ? "Loading..." : "Load Data with use()"}
				</button>

				{dataPromise && (
					<button
						type="button"
						onClick={resetError}
						className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
					>
						Reset
					</button>
				)}
			</div>

			{dataPromise && (
				<ErrorBoundary
					key={key}
					fallback={(error) => (
						<ErrorFallback error={error} resetError={resetError} />
					)}
				>
					<Suspense
						fallback={
							<div className="p-8 text-center">
								<div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
								<p className="text-slate-600 font-medium">
									Loading data with use() hook...
								</p>
								<p className="text-sm text-slate-500 mt-2">
									Component is suspended while Promise resolves
								</p>
							</div>
						}
					>
						<DataContent dataPromise={dataPromise} />
					</Suspense>
				</ErrorBoundary>
			)}

			<div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
				<ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
					<li>
						<code className="bg-slate-200 px-1 rounded">use()</code> hook reads
						the Promise value during render
					</li>
					<li>Component suspends and shows Suspense fallback while loading</li>
					<li>When Promise resolves, component renders with data</li>
					<li>Error Boundary catches errors (5% chance in this demo)</li>
					<li>Unlike useEffect, no manual state management needed!</li>
					<li>Can be used conditionally (if statements, loops)</li>
				</ul>
			</div>
		</div>
	);
}
