<script>
    let mfaEnabled = $state(false);
    let apiToken = $state('sk_live_51N2x...890j');
    let tokenVisible = $state(false);
</script>

<div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Authentication & Security</h1>
        <p class="text-sm text-zinc-400">Manage credentials and configure system security protocols.</p>
    </div>

    <div class="space-y-4">
        <!-- API Credentials Card -->
        <div class="rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-sm">
            <h3 class="text-base font-semibold text-zinc-100">Developer API Credentials</h3>
            <p class="mt-1 text-sm text-zinc-400">Use this secret key to authenticate your custom integrations.</p>
            
            <div class="mt-4 flex gap-2">
                <input 
                    type={tokenVisible ? 'text' : 'password'} 
                    readonly 
                    value={apiToken} 
                    class="block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 font-mono text-sm text-zinc-100 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button 
                    class="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shrink-0" 
                    onclick={() => tokenVisible = !tokenVisible}
                >
                    {tokenVisible ? 'Hide' : 'Reveal'}
                </button>
            </div>
        </div>

        <!-- Two-Factor Card -->
        <div class="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-sm">
            <div class="space-y-0.5">
                <h3 class="text-base font-semibold text-zinc-100">Two-Factor Authentication (MFA)</h3>
                <p class="text-sm text-zinc-400">Require an authenticator app code when logging in.</p>
            </div>
            
            <!-- Tailwind Toggle Switch -->
            <button 
                type="button" 
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none {mfaEnabled ? 'bg-violet-600' : 'bg-zinc-800'}"
                role="switch" 
                aria-checked={mfaEnabled}
                onclick={() => mfaEnabled = !mfaEnabled}
            >
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {mfaEnabled ? 'translate-x-5' : 'translate-x-0'}"></span>
            </button>
        </div>
    </div>
</div>