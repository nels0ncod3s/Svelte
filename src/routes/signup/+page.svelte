<script>
	import { signup } from "$lib/services/auth";
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let email = $state("");
	let password = $state("");
	let confirmPassword = $state("");
	let error = $state("");
	let loading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let confirmationSent = $state(false);

	async function createAccount(e) {
		e.preventDefault();
		error = "";

		if (password !== confirmPassword) {
			error = "Passwords do not match.";
			return;
		}

		loading = true;

		const { data, error: signupError } = await signup(email, password);

		loading = false;

		if (signupError) {
			error = signupError.message;
			return;
		}

		// If email confirmation is on (the Supabase default), signUp()
		// succeeds but returns no session — the user isn't actually logged
		// in yet. Redirecting to /dashboard here would just bounce them
		// straight back to /login, so show a "check your email" state
		// instead of assuming success means signed-in.
		if (!data?.session) {
			confirmationSent = true;
			return;
		}

		window.location.href = "/dashboard";
	}
</script>

<!-- Full-bleed dark auth screen -->
<div class="relative flex min-h-screen w-full items-center justify-center bg-[#09090b] px-4 overflow-hidden">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]"></div>

	<a
		href="/"
		class="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
		Back to home
	</a>

	<div class="relative w-full max-w-md flex flex-col items-center">

		<!-- Icon badge -->
		<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 mb-5">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
		</div>

		<!-- Eyebrow -->
		<div class="flex items-center gap-2 mb-6">
			<span class="h-1.5 w-1.5 rounded-full bg-lime-400"></span>
			<span class="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Join the platform</span>
		</div>

		<!-- Heading -->
		<h1 class="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-zinc-50 text-center leading-tight">
			Create an account
		</h1>
		<p class="text-zinc-500 text-sm text-center mt-3 mb-10 max-w-xs">
			Get started with your Auth-as-a-Service developer account
		</p>

		{#if confirmationSent}
			<!-- Signup succeeded but Supabase requires email confirmation
			     before a session exists — don't pretend they're logged in. -->
			<div class="w-full flex flex-col items-center text-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-8">
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-lime-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
				<h2 class="text-lg font-semibold text-zinc-100">Check your email</h2>
				<p class="text-sm text-zinc-400 max-w-xs">
					We sent a confirmation link to <span class="text-zinc-200 font-medium">{email}</span>. Click it to activate your account, then log in.
				</p>
			</div>
		{:else}
		<form onsubmit={createAccount} class="w-full grid gap-3">
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

			<div class="relative">
				<span class="absolute inset-y-0 left-5 flex items-center text-zinc-500 pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
				</span>
				<Input
					id="password"
					type={showPassword ? "text" : "password"}
					placeholder="Password"
					bind:value={password}
					class="h-14 rounded-xl bg-zinc-900/70 border border-zinc-800 pl-12 pr-14 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:ring-offset-0 w-full"
					disabled={loading}
					required
				/>
				<button
					type="button"
					class="absolute inset-y-0 right-5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
					onclick={() => showPassword = !showPassword}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					{#if showPassword}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
					{/if}
				</button>
			</div>

			<div class="relative">
				<span class="absolute inset-y-0 left-5 flex items-center text-zinc-500 pointer-events-none">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
				</span>
				<Input
					id="confirmPassword"
					type={showConfirmPassword ? "text" : "password"}
					placeholder="Confirm password"
					bind:value={confirmPassword}
					class="h-14 rounded-xl bg-zinc-900/70 border border-zinc-800 pl-12 pr-14 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:ring-offset-0 w-full"
					disabled={loading}
					required
				/>
				<button
					type="button"
					class="absolute inset-y-0 right-5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
					onclick={() => showConfirmPassword = !showConfirmPassword}
					aria-label={showConfirmPassword ? "Hide password" : "Show password"}
				>
					{#if showConfirmPassword}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
					{/if}
				</button>
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
						Creating account...
					</span>
				{:else}
					<span class="flex items-center gap-2">
						Create account
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
					</span>
				{/if}
			</Button>
		</form>
		{/if}

		<div class="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mt-10">
			<span>Already have an account?</span>
			<a href="/login" class="font-bold text-zinc-100 hover:text-white underline-offset-4 hover:underline transition-colors">
				Login
			</a>
		</div>
	</div>
</div>