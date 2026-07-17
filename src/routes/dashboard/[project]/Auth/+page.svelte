<script>
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  let isSaving = $state(false);
</script>

<div class="max-w-2xl p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-100 space-y-6">
  <div>
    <h1 class="text-2xl font-bold tracking-tight">Authentication Providers</h1>
    <p class="text-zinc-400 text-sm">Control exactly how users can sign up and sign in to your applications.</p>
  </div>

  {#if !data.project}
    <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-sm">
      You need to create a project first before configuring authentication!
    </div>
  {:else}
    {#if form?.success}
      <div class="p-3 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
        Authentication configurations updated!
      </div>
    {/if}

    <form 
      method="POST" 
      action="?/updateProviders"
      use:enhance={() => {
        isSaving = true;
        return async ({ update }) => {
          await update();
          isSaving = false;
        };
      }}
      class="space-y-6"
    >
      <input type="hidden" name="projectId" value={data.project.id} />

      <div class="space-y-4">
        <!-- Provider 1: Email / Password -->
        <label class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
          <div class="space-y-0.5">
            <span class="text-sm font-semibold">Email & Password</span>
            <p class="text-xs text-zinc-500">Allow signups using standard username and password combinations.</p>
          </div>
          <input type="checkbox" name="authEmail" checked={data.project.auth_email} class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800" />
        </label>

        <!-- Provider 2: Google Social Login -->
        <label class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
          <div class="space-y-0.5">
            <span class="text-sm font-semibold flex items-center gap-2">
              Google OAuth <span class="px-1.5 py-0.5 text-[10px] bg-violet-500/20 text-violet-300 rounded font-normal">Social</span>
            </span>
            <p class="text-xs text-zinc-500">Enable one-click Google Sign-in buttons directly inside your app integrations.</p>
          </div>
          <input type="checkbox" name="authGoogle" checked={data.project.auth_google} class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800" />
        </label>

        <!-- Provider 3: Magic Links -->
        <label class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
          <div class="space-y-0.5">
            <span class="text-sm font-semibold flex items-center gap-2">
              Passwordless Magic Links <span class="px-1.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 rounded font-normal">Secure</span>
            </span>
            <p class="text-xs text-zinc-500">Send passwordless OTP login links straight to user inboxes.</p>
          </div>
          <input type="checkbox" name="authMagicLink" checked={data.project.auth_magic_link} class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800" />
        </label>
      </div>

      <div class="flex justify-end pt-2">
        <button type="submit" disabled={isSaving} class="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 text-sm">
          {isSaving ? 'Saving Configurations...' : 'Save Changes'}
        </button>
      </div>
    </form>
  {/if}
</div>