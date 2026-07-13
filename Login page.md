<script>
	import { login } from "$lib/services/auth";
	import { goto } from "$app/navigation";
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let email = "";
	let password = "";
	let error = "";
	let loading = false;
	let showPassword = false;

	async function signIn() {
		error = "";
		loading = true;

		const { error: loginError } = await login(email, password);

		loading = false;

		if (loginError) {
			error = loginError.message;
			return;
		}

		goto("/dashboard");
	}
</script>

<!-- Ambient Radial Glow Wrapper -->
<div class="relative flex min-h-screen w-full items-center justify-center bg-[#09090b] px-4 overflow-hidden">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)]"></div>

	<Card.Root class="relative w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-md shadow-2xl ring-1 ring-white/5">
		<Card.Header class="space-y-2 text-center pt-8">
			<div class="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
			</div>
			<Card.Title class="text-2xl font-bold tracking-tight text-zinc-100">Welcome back</Card.Title>
			<Card.Description class="text-zinc-400 text-sm">
				Enter your credentials to access your developer account
			</Card.Description>
		</Card.Header>
		
		<Card.Content class="pt-4">
			<form on:submit|preventDefault={signIn} class="grid gap-4">
				<div class="grid gap-2">
					<label for="email" class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
						Email Address
					</label>
					<div class="relative">
						<span class="absolute inset-y-0 left-3 flex items-center text-zinc-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
						</span>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							bind:value={email}
							class="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
							disabled={loading}
							required
						/>
					</div>
				</div>
				
				<div class="grid gap-2">
					<label for="password" class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
						Password
					</label>
					<div class="relative">
						<span class="absolute inset-y-0 left-3 flex items-center text-zinc-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
						</span>
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							bind:value={password}
							class="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
							disabled={loading}
							required
						/>
						<button 
							type="button" 
							class="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
							on:click={() => showPassword = !showPassword}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
							{/if}
						</button>
					</div>
				</div>

				{#if error}
					<div class="text-red-400 text-xs font-medium bg-red-950/30 p-3 rounded-lg border border-red-900/50 flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
						{error}
					</div>
				{/if}
				
				<Button type="submit" class="w-full mt-2 font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-all" disabled={loading}>
					{#if loading}
						<span class="flex items-center gap-2">
							<svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Signing in...
						</span>
					{:else}
						Sign In
					{/if}
				</Button>
			</form>
		</Card.Content>
		
		<Card.Footer class="flex items-center justify-center gap-1 pb-8 text-sm text-zinc-500 border-t border-zinc-900/60 mt-4 pt-4">
			<span>Don't have an account?</span>
			<a href="/signup" class="font-medium text-zinc-300 hover:text-white hover:underline underline-offset-4 transition-colors">
				Sign up
			</a>
		</Card.Footer>
	</Card.Root>
</div>