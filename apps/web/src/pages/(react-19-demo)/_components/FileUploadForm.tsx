/** biome-ignore-all lint/suspicious/noArrayIndexKey: Example code */
"use client";

import { useActionState, useState } from "react";
import { uploadFiles } from "../_actions/react19-actions.server";

interface FilePreview {
	name: string;
	size: number;
	type: string;
	url?: string;
}

export function FileUploadForm() {
	const [state, formAction, isPending] = useActionState(uploadFiles, null);
	const [avatarPreview, setAvatarPreview] = useState<FilePreview | null>(null);
	const [documentPreviews, setDocumentPreviews] = useState<FilePreview[]>([]);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Create preview for images
			if (file.type.startsWith("image/")) {
				const url = URL.createObjectURL(file);
				setAvatarPreview({
					name: file.name,
					size: file.size,
					type: file.type,
					url,
				});
			} else {
				setAvatarPreview({
					name: file.name,
					size: file.size,
					type: file.type,
				});
			}
		}
	};

	const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const previews: FilePreview[] = files.map((file) => {
			const preview: FilePreview = {
				name: file.name,
				size: file.size,
				type: file.type,
			};

			// Create preview URL for images
			if (file.type.startsWith("image/")) {
				preview.url = URL.createObjectURL(file);
			}

			return preview;
		});

		setDocumentPreviews(previews);
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
	};

	const clearAvatar = () => {
		setAvatarPreview(null);
		const input = document.getElementById("avatar") as HTMLInputElement;
		if (input) input.value = "";
	};

	const clearDocuments = () => {
		setDocumentPreviews([]);
		const input = document.getElementById("documents") as HTMLInputElement;
		if (input) input.value = "";
	};

	return (
		<div className="space-y-4">
			<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
				<h3 className="font-semibold text-indigo-900 mb-2">
					File Upload with useActionState
				</h3>
				<p className="text-sm text-indigo-800">
					This demo shows file uploads with React 19's{" "}
					<code className="bg-indigo-200 px-1 rounded">useActionState</code>.
					FormData and Files are automatically serialized (base64) on the
					client, sent as JSON, and reconstructed on the server. Supports image
					preview and validation!
				</p>
			</div>

			<form action={formAction} data-no-intercept className="space-y-6">
				{/* Name field */}
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
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
						placeholder="Enter your name"
					/>
					{state?.errors?.name && (
						<p className="text-red-600 text-sm mt-1">{state.errors.name}</p>
					)}
				</div>

				{/* Avatar upload */}
				<div>
					<label
						htmlFor="avatar"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Avatar / Profile Picture (optional)
					</label>
					<input
						id="avatar"
						name="avatar"
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
					/>
					<p className="text-xs text-slate-500 mt-1">Images only, max 5MB</p>
					{state?.errors?.avatar && (
						<p className="text-red-600 text-sm mt-1">{state.errors.avatar}</p>
					)}

					{/* Avatar preview */}
					{avatarPreview && (
						<div className="mt-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
							<div className="flex items-start gap-4">
								{avatarPreview.url && (
									<img
										src={avatarPreview.url}
										alt="Avatar preview"
										className="w-20 h-20 rounded-lg object-cover border-2 border-purple-300"
									/>
								)}
								<div className="flex-1">
									<p className="font-medium text-slate-900">
										{avatarPreview.name}
									</p>
									<p className="text-sm text-slate-600">
										{formatFileSize(avatarPreview.size)}
									</p>
									<p className="text-xs text-slate-500">{avatarPreview.type}</p>
								</div>
								<button
									type="button"
									onClick={clearAvatar}
									className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
								>
									Remove
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Documents upload */}
				<div>
					<label
						htmlFor="documents"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Documents (optional)
					</label>
					<input
						id="documents"
						name="documents"
						type="file"
						accept="image/*,.pdf"
						multiple
						onChange={handleDocumentsChange}
						disabled={isPending}
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
					/>
					<p className="text-xs text-slate-500 mt-1">
						PDF or images, max 10MB each, multiple allowed
					</p>
					{state?.errors?.documents && (
						<p className="text-red-600 text-sm mt-1">
							{state.errors.documents}
						</p>
					)}

					{/* Documents preview */}
					{documentPreviews.length > 0 && (
						<div className="mt-3 space-y-2">
							<div className="flex items-center justify-between mb-2">
								<p className="text-sm font-medium text-slate-700">
									{documentPreviews.length}{" "}
									{documentPreviews.length === 1 ? "file" : "files"} selected
								</p>
								<button
									type="button"
									onClick={clearDocuments}
									className="text-sm text-red-600 hover:underline"
								>
									Clear all
								</button>
							</div>
							{documentPreviews.map((doc, index) => (
								<div
									key={index}
									className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center gap-3"
								>
									{doc.url ? (
										<img
											src={doc.url}
											alt={doc.name}
											className="w-12 h-12 rounded object-cover border border-slate-300"
										/>
									) : (
										<div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
											PDF
										</div>
									)}
									<div className="flex-1 min-w-0">
										<p className="font-medium text-slate-900 truncate">
											{doc.name}
										</p>
										<p className="text-sm text-slate-600">
											{formatFileSize(doc.size)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<button
					type="submit"
					disabled={isPending}
					className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
				>
					{isPending ? (
						<>
							<div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
							<span>Uploading...</span>
						</>
					) : (
						<span>Upload Files</span>
					)}
				</button>

				{/* Result message */}
				{state?.message && (
					<div
						className={`p-4 rounded-lg ${
							state.success
								? "bg-green-50 border border-green-200"
								: "bg-red-50 border border-red-200"
						}`}
					>
						<p
							className={`font-medium ${
								state.success ? "text-green-900" : "text-red-900"
							}`}
						>
							{state.message}
						</p>

						{/* Show uploaded files */}
						{state.success && state.files && state.files.length > 0 && (
							<div className="mt-3 space-y-2">
								<p className="text-sm font-medium text-green-800">
									Uploaded files:
								</p>
								{state.files.map((file, index) => (
									<div
										key={index}
										className="text-sm text-green-700 flex items-center gap-2"
									>
										<span className="font-mono">✓</span>
										<span className="font-medium">{file.name}</span>
										<span className="text-green-600">
											({formatFileSize(file.size)})
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</form>

			<div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
				<ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
					<li>Files are converted to base64 on the client automatically</li>
					<li>Sent as JSON to server (no multipart/form-data needed)</li>
					<li>Reconstructed as File objects on the server</li>
					<li>Server validates type, size, and processes files</li>
					<li>Image previews work with URL.createObjectURL</li>
					<li>Supports single and multiple file uploads</li>
				</ul>
			</div>
		</div>
	);
}
