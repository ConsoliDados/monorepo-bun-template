"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOptimistic, useState } from "react";
import {
	addComment,
	fetchComments,
} from "../../routes/-actions/react19-actions.server";

interface Comment {
	id: number;
	text: string;
	author: string;
	timestamp: string;
}

export function CommentsSection() {
	const [commentText, setCommentText] = useState("");
	const queryClient = useQueryClient();

	// Fetch comments
	const { data: comments = [], isLoading } = useQuery<Comment[]>({
		queryKey: ["comments"],
		queryFn: fetchComments,
	});

	// Optimistic state
	const [optimisticComments, setOptimisticComments] =
		useOptimistic(comments);

	// Mutation to add comment
	const addCommentMutation = useMutation({
		mutationFn: addComment,
		onMutate: async (newCommentText) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["comments"] });

			// Create optimistic comment
			const optimisticComment: Comment = {
				id: Date.now(),
				text: newCommentText,
				author: "You",
				timestamp: new Date().toISOString(),
			};

			// Update optimistic state immediately
			setOptimisticComments([...comments, optimisticComment]);

			return { optimisticComment };
		},
		onSuccess: () => {
			// Refetch to get real data
			queryClient.invalidateQueries({ queryKey: ["comments"] });
			setCommentText("");
		},
		onError: (error) => {
			// Rollback happens automatically via useOptimistic
			console.error("Failed to add comment:", error);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (commentText.trim()) {
			addCommentMutation.mutate(commentText);
		}
	};

	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diff < 60) return "just now";
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return date.toLocaleDateString();
	};

	return (
		<div className="space-y-4">
			<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
				<h3 className="font-semibold text-green-900 mb-2">
					useOptimistic Hook
				</h3>
				<p className="text-sm text-green-800">
					This hook provides instant UI updates while async operations are in
					progress. The UI updates immediately with optimistic data, then
					automatically reverts if the operation fails. Perfect for better UX!
				</p>
			</div>

			{/* Comment Form */}
			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<textarea
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder="Add a comment..."
						rows={3}
						disabled={addCommentMutation.isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
					/>
				</div>
				<button
					type="submit"
					disabled={addCommentMutation.isPending || !commentText.trim()}
					className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
				>
					{addCommentMutation.isPending ? "Posting..." : "Post Comment"}
				</button>
			</form>

			{addCommentMutation.isError && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
					Error: {(addCommentMutation.error as Error).message}
				</div>
			)}

			{/* Comments List */}
			{isLoading ? (
				<div className="text-center py-8">
					<div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
					<p className="text-slate-600 mt-2">Loading comments...</p>
				</div>
			) : (
				<div className="space-y-3">
					{optimisticComments.map((comment, index) => {
						const isPending =
							addCommentMutation.isPending &&
							index === optimisticComments.length - 1;

						return (
							<div
								key={comment.id}
								className={`p-4 border rounded-lg transition-all ${
									isPending
										? "bg-purple-50 border-purple-300 opacity-60"
										: "bg-white border-slate-200"
								}`}
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
											{comment.author[0].toUpperCase()}
										</div>
										<div>
											<p className="font-semibold text-slate-900">
												{comment.author}
											</p>
											<p className="text-xs text-slate-500">
												{formatTimestamp(comment.timestamp)}
											</p>
										</div>
									</div>
									{isPending && (
										<span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
											Posting...
										</span>
									)}
								</div>
								<p className="text-slate-700">{comment.text}</p>
							</div>
						);
					})}
				</div>
			)}

			<div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
				<ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
					<li>
						<code className="bg-slate-200 px-1 rounded">useOptimistic</code>{" "}
						creates optimistic state from real state
					</li>
					<li>UI updates instantly when you submit (no waiting!)</li>
					<li>
						Server action processes in background (~1.5s with 10% error rate)
					</li>
					<li>Automatically rolls back if server operation fails</li>
					<li>Syncs with real data when operation completes</li>
				</ul>
			</div>
		</div>
	);
}
