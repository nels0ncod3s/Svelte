<script>
    let appName = $state('My Core App');
    let environment = $state('development');
</script>

<div class="space-y-6 max-w-2xl">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Global Settings</h1>
        <p class="text-sm text-zinc-400">Configure default settings and custom naming details.</p>
    </div>

    <!-- Settings Card -->
    <div class="rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-sm">
        <form onsubmit={(e) => e.preventDefault()} class="space-y-5">
            <!-- App Name Field -->
            <div class="space-y-2">
                <label for="appName" class="text-sm font-medium text-zinc-300">Application Name</label>
                <input 
                    type="text" 
                    id="appName" 
                    bind:value={appName} 
                    class="block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
            </div>

            <!-- Environment Select Field -->
            <div class="space-y-2">
                <label for="env" class="text-sm font-medium text-zinc-300">Primary Environment</label>
                <div class="relative">
                    <select 
                        id="env" 
                        bind:value={environment} 
                        class="block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none"
                    >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                    </select>
                </div>
            </div>

            <!-- Submit button -->
            <div class="pt-2">
                <button 
                    type="submit" 
                    class="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>