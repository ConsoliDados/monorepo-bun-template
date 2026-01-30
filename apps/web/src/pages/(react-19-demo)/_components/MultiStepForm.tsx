"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitMultiStepForm } from "../_actions/react19-actions.server";

// Submit button component that reads form status
function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
		>
			{pending ? (
				<>
					<div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
					<span>Submitting...</span>
				</>
			) : (
				<span>Submit Registration</span>
			)}
		</button>
	);
}

// Form status indicator component
function FormStatusIndicator() {
	const { pending, data } = useFormStatus();

	if (!pending && !data) return null;

	return (
		<div
			className={`p-4 rounded-lg border ${
				pending ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
			}`}
		>
			{pending ? (
				<div className="flex items-center gap-3">
					<div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
					<div>
						<p className="font-medium text-blue-900">Processing...</p>
						<p className="text-sm text-blue-700">
							Please wait while we submit your information
						</p>
					</div>
				</div>
			) : (
				<p className="text-green-800">Form submitted successfully!</p>
			)}
		</div>
	);
}

interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	zipCode: string;
}

export function MultiStepForm() {
	const [currentStep, setCurrentStep] = useState(1);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const [formData, setFormData] = useState<Partial<FormData>>({});

	const handleSubmit = async (submitData: globalThis.FormData) => {
		try {
			const response = await submitMultiStepForm(submitData);
			setResult(response);
		} catch (error) {
			setResult({
				success: false,
				message: error instanceof Error ? error.message : "Submission failed",
			});
		}
	};

	const saveStepData = (step: number, data: Partial<FormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new globalThis.FormData(form);

		if (currentStep === 1) {
			saveStepData(1, {
				firstName: data.get("firstName") as string,
				lastName: data.get("lastName") as string,
			});
		} else if (currentStep === 2) {
			saveStepData(2, {
				email: data.get("email") as string,
				phone: data.get("phone") as string,
			});
		}

		setCurrentStep((prev) => prev + 1);
	};

	const resetForm = () => {
		setCurrentStep(1);
		setResult(null);
		setFormData({});
	};

	if (result) {
		return (
			<div className="space-y-4">
				<div
					className={`p-6 rounded-lg border ${
						result.success
							? "bg-green-50 border-green-200"
							: "bg-red-50 border-red-200"
					}`}
				>
					<h3
						className={`text-lg font-semibold mb-2 ${
							result.success ? "text-green-900" : "text-red-900"
						}`}
					>
						{result.success ? "Success!" : "Error"}
					</h3>
					<p className={result.success ? "text-green-800" : "text-red-800"}>
						{result.message}
					</p>
				</div>
				<button
					type="button"
					onClick={resetForm}
					className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
				>
					Fill Another Form
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
				<h3 className="font-semibold text-pink-900 mb-2">useFormStatus Hook</h3>
				<p className="text-sm text-pink-800">
					This hook provides status information of a form's submission from
					child components. The{" "}
					<code className="bg-pink-200 px-1 rounded">SubmitButton</code> and{" "}
					<code className="bg-pink-200 px-1 rounded">FormStatusIndicator</code>{" "}
					components read the form's pending state without prop drilling!
				</p>
			</div>

			{/* Step indicator */}
			<div className="flex items-center justify-between mb-6">
				{[1, 2, 3].map((step) => (
					<div key={step} className="flex items-center flex-1">
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
								step === currentStep
									? "bg-purple-600 text-white"
									: step < currentStep
										? "bg-green-500 text-white"
										: "bg-slate-200 text-slate-500"
							}`}
						>
							{step < currentStep ? "✓" : step}
						</div>
						{step < 3 && (
							<div
								className={`flex-1 h-1 mx-2 ${
									step < currentStep ? "bg-green-500" : "bg-slate-200"
								}`}
							/>
						)}
					</div>
				))}
			</div>

			<form
				onSubmit={
					currentStep < 3
						? handleNextStep
						: (e) => {
								e.preventDefault();
								const submitData = new globalThis.FormData(e.currentTarget);
								handleSubmit(submitData);
							}
				}
				data-no-intercept
				className="space-y-4 bg-white p-6 rounded-lg border border-slate-200"
			>
				<FormStatusIndicator />

				{/* Step 1: Personal Info */}
				{currentStep >= 1 && (
					<div className="space-y-4 p-4 bg-slate-50 rounded-lg">
						<h3 className="font-semibold text-slate-900">
							Step 1: Personal Information
						</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-slate-700 mb-1"
								>
									First Name
								</label>
								<input
									id="firstName"
									name={currentStep === 1 ? "firstName" : ""}
									type="text"
									required={currentStep === 1}
									defaultValue={formData.firstName || ""}
									readOnly={currentStep > 1}
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none read-only:bg-slate-100"
									placeholder="John"
								/>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-slate-700 mb-1"
								>
									Last Name
								</label>
								<input
									id="lastName"
									name={currentStep === 1 ? "lastName" : ""}
									type="text"
									required={currentStep === 1}
									defaultValue={formData.lastName || ""}
									readOnly={currentStep > 1}
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none read-only:bg-slate-100"
									placeholder="Doe"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Step 2: Contact Info */}
				{currentStep >= 2 && (
					<div className="space-y-4 p-4 bg-slate-50 rounded-lg">
						<h3 className="font-semibold text-slate-900">
							Step 2: Contact Information
						</h3>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-slate-700 mb-1"
							>
								Email
							</label>
							<input
								id="email"
								name={currentStep === 2 ? "email" : ""}
								type="email"
								required={currentStep === 2}
								defaultValue={formData.email || ""}
								readOnly={currentStep > 2}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none read-only:bg-slate-100"
								placeholder="john@example.com"
							/>
						</div>
						<div>
							<label
								htmlFor="phone"
								className="block text-sm font-medium text-slate-700 mb-1"
							>
								Phone
							</label>
							<input
								id="phone"
								name={currentStep === 2 ? "phone" : ""}
								type="tel"
								required={currentStep === 2}
								defaultValue={formData.phone || ""}
								readOnly={currentStep > 2}
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none read-only:bg-slate-100"
								placeholder="+1 (555) 000-0000"
							/>
						</div>
					</div>
				)}

				{/* Step 3: Address */}
				{currentStep >= 3 && (
					<div className="space-y-4 p-4 bg-slate-50 rounded-lg">
						<h3 className="font-semibold text-slate-900">Step 3: Address</h3>

						{/* Hidden inputs for step 1 & 2 data */}
						<input
							type="hidden"
							name="firstName"
							value={formData.firstName || ""}
						/>
						<input
							type="hidden"
							name="lastName"
							value={formData.lastName || ""}
						/>
						<input type="hidden" name="email" value={formData.email || ""} />
						<input type="hidden" name="phone" value={formData.phone || ""} />

						<div>
							<label
								htmlFor="address"
								className="block text-sm font-medium text-slate-700 mb-1"
							>
								Street Address
							</label>
							<input
								id="address"
								name="address"
								type="text"
								required
								className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
								placeholder="123 Main St"
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="city"
									className="block text-sm font-medium text-slate-700 mb-1"
								>
									City
								</label>
								<input
									id="city"
									name="city"
									type="text"
									required
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
									placeholder="New York"
								/>
							</div>
							<div>
								<label
									htmlFor="zipCode"
									className="block text-sm font-medium text-slate-700 mb-1"
								>
									ZIP Code
								</label>
								<input
									id="zipCode"
									name="zipCode"
									type="text"
									required
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
									placeholder="10001"
								/>
							</div>
						</div>
					</div>
				)}

				<div className="flex gap-3 pt-4">
					{currentStep > 1 && currentStep < 4 && (
						<button
							type="button"
							onClick={() => setCurrentStep((prev) => prev - 1)}
							className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
						>
							Previous
						</button>
					)}

					{currentStep < 3 ? (
						<button
							type="submit"
							className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
						>
							Next
						</button>
					) : (
						<div className="flex-1">
							<SubmitButton />
						</div>
					)}
				</div>
			</form>

			<div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
				<h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
				<ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
					<li>
						<code className="bg-slate-200 px-1 rounded">useFormStatus</code>{" "}
						must be called in a child component of the form
					</li>
					<li>
						Returns <code className="bg-slate-200 px-1 rounded">pending</code>,{" "}
						<code className="bg-slate-200 px-1 rounded">data</code>,{" "}
						<code className="bg-slate-200 px-1 rounded">method</code>, and{" "}
						<code className="bg-slate-200 px-1 rounded">action</code>
					</li>
					<li>Multiple components can read the same form status</li>
					<li>No prop drilling needed for loading states!</li>
					<li>Server action simulates 2.5s delay with 10% error rate</li>
				</ul>
			</div>
		</div>
	);
}
