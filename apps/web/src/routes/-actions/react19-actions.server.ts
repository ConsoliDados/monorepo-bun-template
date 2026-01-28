import { env } from "../../../lib/env";

// ============================================
// Types
// ============================================

interface Comment {
	id: number;
	text: string;
	author: string;
	timestamp: string;
}

interface ProfileFormState {
	success: boolean;
	message: string;
	errors?: {
		name?: string;
		email?: string;
		bio?: string;
	};
}

interface AsyncData {
	title: string;
	description: string;
	items: string[];
	loadedAt: string;
}

// ============================================
// 1. useActionState - Profile Update
// ============================================

export async function updateProfile(
	previousState: ProfileFormState | null,
	formData: FormData,
): Promise<ProfileFormState> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const bio = formData.get("bio") as string;

	// Validation
	const errors: ProfileFormState["errors"] = {};

	if (!name || name.length < 3) {
		errors.name = "Name must be at least 3 characters";
	}

	if (!email || !email.includes("@")) {
		errors.email = "Please enter a valid email";
	}

	if (bio && bio.length > 200) {
		errors.bio = "Bio must be less than 200 characters";
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false,
			message: "Please fix the errors below",
			errors,
		};
	}

	// Simulate success
	return {
		success: true,
		message: `Profile updated successfully! Welcome, ${name}!`,
	};
}

// ============================================
// 2. useOptimistic - Comments
// ============================================

// In-memory storage for demo (would be database in production)
let comments: Comment[] = [
	{
		id: 1,
		text: "React 19 is amazing!",
		author: "Alice",
		timestamp: new Date(Date.now() - 3600000).toISOString(),
	},
	{
		id: 2,
		text: "useOptimistic makes UX so much better",
		author: "Bob",
		timestamp: new Date(Date.now() - 1800000).toISOString(),
	},
];

export async function fetchComments(): Promise<Comment[]> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 500));
	return comments;
}

export async function addComment(text: string): Promise<Comment> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 1500));

	// Simulate occasional error (10% chance)
	if (Math.random() < 0.1) {
		throw new Error("Failed to add comment. Please try again.");
	}

	const newComment: Comment = {
		id: Date.now(),
		text,
		author: "You",
		timestamp: new Date().toISOString(),
	};

	comments.push(newComment);
	return newComment;
}

// ============================================
// 3. use() Hook - Async Data
// ============================================

export async function fetchAsyncData(): Promise<AsyncData> {
	// Simulate longer network delay to show Suspense
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Simulate occasional error (5% chance)
	if (Math.random() < 0.05) {
		throw new Error("Failed to fetch data. Please refresh.");
	}

	return {
		title: "React 19 Features",
		description: "Exploring the new capabilities of React 19",
		items: [
			"Server Components",
			"Improved Suspense",
			"New Hooks (useActionState, useOptimistic, use)",
			"Enhanced SSR",
			"Better Error Boundaries",
			"Automatic Batching",
		],
		loadedAt: new Date().toISOString(),
	};
}

// ============================================
// 4. useFormStatus - Multi-step Form
// ============================================

interface MultiStepFormData {
	step1?: {
		firstName: string;
		lastName: string;
	};
	step2?: {
		email: string;
		phone: string;
	};
	step3?: {
		address: string;
		city: string;
		zipCode: string;
	};
}

export async function submitMultiStepForm(
	formData: FormData,
): Promise<{ success: boolean; message: string }> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 2500));

	const firstName = formData.get("firstName") as string;
	const lastName = formData.get("lastName") as string;
	const email = formData.get("email") as string;
	const phone = formData.get("phone") as string;
	const address = formData.get("address") as string;
	const city = formData.get("city") as string;
	const zipCode = formData.get("zipCode") as string;

	// Simulate occasional error
	if (Math.random() < 0.1) {
		throw new Error("Submission failed. Please try again.");
	}

	console.log("Form submitted:", {
		firstName,
		lastName,
		email,
		phone,
		address,
		city,
		zipCode,
	});

	return {
		success: true,
		message: `Thank you, ${firstName} ${lastName}! Your information has been submitted.`,
	};
}

// ============================================
// 5. File Upload - Demo
// ============================================

interface FileUploadState {
	success: boolean;
	message: string;
	files?: Array<{
		name: string;
		size: number;
		type: string;
	}>;
	errors?: {
		name?: string;
		avatar?: string;
		documents?: string;
	};
}

export async function uploadFiles(
	previousState: FileUploadState | null,
	formData: FormData,
): Promise<FileUploadState> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const name = formData.get("name") as string;
	const avatar = formData.get("avatar") as File | null;
	const documents = formData.getAll("documents") as File[];

	// Validation
	const errors: FileUploadState["errors"] = {};

	if (!name || name.length < 3) {
		errors.name = "Name must be at least 3 characters";
	}

	// Validate avatar
	if (avatar && avatar.size > 0) {
		if (!avatar.type.startsWith("image/")) {
			errors.avatar = "Avatar must be an image file";
		} else if (avatar.size > 5 * 1024 * 1024) {
			errors.avatar = "Avatar must be less than 5MB";
		}
	}

	// Validate documents
	const validDocuments = documents.filter((doc) => doc.size > 0);
	if (validDocuments.length > 0) {
		for (const doc of validDocuments) {
			const validTypes = [
				"application/pdf",
				"image/jpeg",
				"image/png",
				"image/jpg",
			];
			if (!validTypes.includes(doc.type)) {
				errors.documents =
					"Documents must be PDF or image files (jpg, png, pdf)";
				break;
			}
			if (doc.size > 10 * 1024 * 1024) {
				errors.documents = "Each document must be less than 10MB";
				break;
			}
		}
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false,
			message: "Please fix the errors below",
			errors,
		};
	}

	// Process files (in production, save to storage)
	const uploadedFiles: FileUploadState["files"] = [];

	if (avatar && avatar.size > 0) {
		uploadedFiles.push({
			name: avatar.name,
			size: avatar.size,
			type: avatar.type,
		});
		console.log("Avatar uploaded:", {
			name: avatar.name,
			size: avatar.size,
			type: avatar.type,
		});
	}

	for (const doc of validDocuments) {
		uploadedFiles.push({
			name: doc.name,
			size: doc.size,
			type: doc.type,
		});
		console.log("Document uploaded:", {
			name: doc.name,
			size: doc.size,
			type: doc.type,
		});
	}

	return {
		success: true,
		message: `Successfully uploaded ${uploadedFiles.length} file(s) for ${name}!`,
		files: uploadedFiles,
	};
}
