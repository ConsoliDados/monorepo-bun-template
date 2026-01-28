"use client";

import { useActionState } from "react";
import { updateProfile } from "../../routes/-actions/react19-actions.server";

export function ProfileForm() {
	const [state, formAction, isPending] = useActionState(updateProfile, null);

	return (
		<div className="space-y-4">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
				<h3 className="font-semibold text-blue-900 mb-2">
					useActionState Hook
				</h3>
				<p className="text-sm text-blue-800">
					This hook simplifies form handling with automatic pending state
					management, error handling, and progressive enhancement. No need for
					manual useState!
				</p>
			</div>

			<form action={formAction} data-no-intercept className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						defaultValue=""
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
						placeholder="Enter your name"
					/>
					{state?.errors?.name && (
						<p className="text-red-600 text-sm mt-1">{state.errors.name}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						defaultValue=""
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
						placeholder="your.email@example.com"
					/>
					{state?.errors?.email && (
						<p className="text-red-600 text-sm mt-1">{state.errors.email}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="bio"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Bio (optional)
					</label>
					<textarea
						id="bio"
						name="bio"
						rows={3}
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
						placeholder="Tell us about yourself..."
					/>
					{state?.errors?.bio && (
						<p className="text-red-600 text-sm mt-1">{state.errors.bio}</p>
					)}
					<p className="text-xs text-slate-500 mt-1">Max 200 characters</p>
				</div>

				<button
					type="submit"
					disabled={isPending}
					className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
				>
					{isPending ? (
						<>
							<div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
							<span>Updating Profile...</span>
						</>
					) : (
						<span>Update Profile</span>
					)}
				</button>

				{state?.message && (
					<div
						className={`p-4 rounded-lg ${
							state.success
								? "bg-green-50 border border-green-200 text-green-800"
								: "bg-red-50 border border-red-200 text-red-800"
						}`}
					>
						<p className="font-medium">{state.message}</p>
					</div>
				)}
			</form>

			<div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
				<ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
					<li>
						<code className="bg-slate-200 px-1 rounded">useActionState</code>{" "}
						returns [state, action, isPending]
					</li>
					<li>Form automatically handles pending states during submission</li>
					<li>Server validates and returns success/error messages</li>
					<li>No manual useState or useEffect needed!</li>
					<li>Progressive enhancement - works without JavaScript</li>
				</ul>
			</div>
		</div>
	);
}
