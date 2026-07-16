<script>
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  let showSecret = $state(false);
  let copiedField = $state('');
  let isSaving = $state(false);

  function copyToClipboard(text, fieldName) {
    navigator.clipboard.writeText(text);
    copiedField = fieldName;
    setTimeout(() => copiedField = '', 2000);
  }
</script>

<div class="max-w-2xl p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-100 space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight">App Integration</h1>
    <p class="text-zinc-400 text-sm">Retrieve your integration credentials and configure your redirect URIs.</p>
  </div>

  {#if !data.project}
    <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-sm">
      You need to create a project first before configuring app credentials!
    </div>
  {:else}
    {#if form?.success}
      <div class="p-3 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
        App credentials updated successfully!
      </div>
    {/if}

    <!-- Credentials Section -->
    <div class="space-y-4 border-b border-zinc-800 pb-6">
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-zinc-300">Client ID</span>
        <div class="flex gap-2">
          <input type="text" readonly value={data.project.id} class="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm font-mono text-violet-400 flex-1 outline-none" />
          <button onclick={() => copyToClipboard(data.project.id, 'clientId')} class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold">
            {copiedField === 'clientId' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-zinc-300">Client Secret</span>
        <div class="flex gap-2">
          <input type={showSecret ? 'text' : 'password'} readonly value={data.project.client_secret} class="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm font-mono text-zinc-300 flex-1 outline-none" />
          <button onclick={() => showSecret = !showSecret} class="px-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold">
            {showSecret ? 'Hide' : 'Reveal'}
          </button>
          <button onclick={() => copyToClipboard(data.project.client_secret, 'secret')} class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold">
            {copiedField === 'secret' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>

    <!-- Configuration form -->
    <form 
      method="POST" 
      action="?/updateCredentials"
      use:enhance={() => {
        isSaving = true;
        return async ({ update }) => {
          await update();
          isSaving = false;
        };
      }}
      class="space-y-4"
    >
      <input type="hidden" name="projectId" value={data.project.id} />

      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-zinc-300">Allowed Redirect URIs</span>
        <span class="text-xs text-zinc-500">Comma-separated URLs where First Layer can securely send users back after sign-in.</span>
        <input type="text" name="redirectUris" value={data.project.redirect_uris || ''} placeholder="http://localhost:5173/callback" class="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm text-zinc-100 outline-none focus:border-zinc-700" />
      </label>

      <button type="submit" disabled={isSaving} class="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm">
        {isSaving ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  {/if}
</div>