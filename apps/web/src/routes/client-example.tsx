import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

export const Route = createFileRoute("/client-example")({
	component: ClientExamplePage,
});

function Countdown() {
	const [count, setCount] = useState(10);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (!isRunning || count === 0) return;

		const timer = setInterval(() => {
			setCount((c) => {
				if (c <= 1) {
					setIsRunning(false);
					return 0;
				}
				return c - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isRunning, count]);

	const handleStart = () => {
		setIsRunning(true);
	};

	const handleReset = () => {
		setIsRunning(false);
		setCount(10);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Countdown Timer</h2>

			<div className="text-center mb-6">
				<div
					className={`text-6xl font-bold ${
						count === 0 ? "text-red-600" : "text-blue-600"
					} transition-colors`}
				>
					{count}
				</div>
				{count === 0 && (
					<div className="text-2xl text-red-500 mt-2 animate-pulse">
						Time's up!
					</div>
				)}
			</div>

			<div className="flex gap-3 justify-center">
				<button
					type="button"
					onClick={handleStart}
					disabled={isRunning || count === 0}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
				>
					Start
				</button>

				<button
					type="button"
					onClick={handleReset}
					className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
				>
					Reset
				</button>
			</div>

			<p className="text-sm text-slate-500 text-center mt-4">
				Este componente usa React hooks (useState, useEffect) - totalmente
				client-side
			</p>
		</div>
	);
}

function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simula envio para API
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log("Form submitted:", formData);
		setSubmitted(true);
		setIsLoading(false);

		// Reset após 3 segundos
		setTimeout(() => {
			setSubmitted(false);
			setFormData({ name: "", email: "", message: "" });
		}, 3000);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Contact Form</h2>

			{submitted ? (
				<div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
					<div className="text-green-600 text-5xl mb-2">✓</div>
					<h3 className="text-xl font-semibold text-green-900 mb-2">
						Mensagem enviada!
					</h3>
					<p className="text-green-700">
						Obrigado pelo contato, {formData.name}
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-slate-700 mb-1"
						>
							Nome
						</label>
						<input
							type="text"
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							required
							className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							placeholder="Seu nome"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-slate-700 mb-1"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							required
							className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
							placeholder="seu@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-slate-700 mb-1"
						>
							Mensagem
						</label>
						<textarea
							id="message"
							value={formData.message}
							onChange={(e) =>
								setFormData({ ...formData, message: e.target.value })
							}
							required
							rows={4}
							className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
							placeholder="Sua mensagem..."
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
					>
						{isLoading ? (
							<span className="flex items-center justify-center gap-2">
								<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								Enviando...
							</span>
						) : (
							"Enviar Mensagem"
						)}
					</button>
				</form>
			)}

			<p className="text-sm text-slate-500 text-center mt-4">
				Formulário interativo com validação e estado gerenciado no cliente
			</p>
		</div>
	);
}

function ClientExamplePage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-2">Client-Side Examples</h1>
			<p className="text-slate-600 mb-8">
				Exemplos de interatividade no client-side com hydration. Estes
				componentes são renderizados estaticamente no servidor e tornam-se
				interativos após hydration no cliente.
			</p>

			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<h3 className="font-semibold text-yellow-900 mb-2">
					Status de Hydration:
				</h3>
				<p className="text-sm text-yellow-800">
					{mounted ? (
						<span className="text-green-600 font-semibold">
							✓ Componente hidratado - JavaScript ativo
						</span>
					) : (
						<span className="text-orange-600 font-semibold">
							⏳ Aguardando hydration...
						</span>
					)}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Countdown />
				<ContactForm />
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
				<h3 className="font-semibold text-blue-900 mb-2">Como funciona:</h3>
				<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
					<li>HTML inicial é renderizado no servidor (SSR)</li>
					<li>JavaScript faz hydration após o carregamento</li>
					<li>Componentes tornam-se interativos após hydration</li>
					<li>Estado é gerenciado completamente no cliente</li>
				</ul>
			</div>
		</div>
	);
}
