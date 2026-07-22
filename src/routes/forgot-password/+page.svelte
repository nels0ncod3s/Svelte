<script>
	import { requestPasswordReset } from "$lib/services/auth";
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let email = $state("");
	let error = $state("");
	let loading = $state(false);
	let sent = $state(false);

	async function sendResetLink(e) {
		e.preventDefault();
		error = "";
		loading = true;

		const { error: resetError } = await requestPasswordReset(email);

		loading = false;

		if (resetError) {
			error = resetError.message;
			return;
		}

		// Show the same "check your email" state regardless of whether the
		// address is registered — confirming/denying an account's existence
		// here would let anyone enumerate signed-up emails.
		sent = true;
	}
</script>

<!-- Full-bleed dark auth screen -->
<div class="relative flex min-h-screen w-full items-center justify-center bg-[#09090b] px-4 overflow-hidden">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]"></div>

	<a
		href="/login"
		class="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
		Back to login
	</a>

	<div class="relative w-full max-w-md flex flex-col items-center">

		<!-- Icon badge -->
		<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 mb-5">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
		</div>

		<!-- Eyebrow -->
		<div class="flex items-center gap-2 mb-6">
			<span class="h-1.5 w-1.5 rounded-full bg-lime-400"></span>
			<span class="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Account recovery</span>
		</div>

		<!-- Heading -->
		<h1 class="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-zinc-50 text-center leading-tight">
			Reset your password
		</h1>
		<p class="text-zinc-500 text-sm text-center mt-3 mb-10 max-w-xs">
			Enter the email on your account and we'll send you a link to reset your password
		</p>

		{#if sent}
			<div class="w-full flex flex-col items-center text-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-8">
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-lime-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
				<h2 class="text-lg font-semibold text-zinc-100">Check your email</h2>
				<p class="text-sm text-zinc-400 max-w-xs">
					If an account exists for <span class="text-zinc-200 font-medium">{email}</span>, we've sent a link to reset your password.
				</p>
			</div>
		{:else}
			<form onsubmit={sendResetLink} class="w-full grid gap-3">
				<div class="relative">
					<span class="absolute inset-y-0 left-5 flex items-center text-zinc-500 pointer-events-none">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
					</span>
					<Input
						id="email"
						type="email"
						placeholder="Email"
						bind:value={email}
						class="h-14 rounded-xl bg-zinc-900/70 border border-zinc-800 pl-12 pr-6 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:ring-offset-0 w-full"
						disabled={loading}
						required
					/>
				</div>

				{#if error}
					<div class="text-red-400 text-xs font-medium bg-red-950/30 px-5 py-3 rounded-xl border border-red-900/50 flex items-center justify-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
						{error}
					</div>
				{/if}

				<Button
					type="submit"
					class="w-full h-14 mt-2 rounded-xl font-bold uppercase tracking-widest text-sm bg-zinc-100 text-zinc-950 hover:bg-white transition-all"
					disabled={loading}
				>
					{#if loading}
						<span class="flex items-center gap-2">
							<svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Sending link...
						</span>
					{:else}
						<span class="flex items-center gap-2">
							Send reset link
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
						</span>
					{/if}
				</Button>
			</form>
		{/if}

		<div class="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mt-10">
			<span>Remembered it after all?</span>
			<a href="/login" class="font-bold text-zinc-100 hover:text-white underline-offset-4 hover:underline transition-colors">
				Log in
			</a>
		</div>
	</div>
</div>
