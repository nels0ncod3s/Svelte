<script>
  import { enhance } from '$app/forms';
  
  // Lucide icon imports (matches the vibe of your sidebar)
  import User from "@lucide/svelte/icons/user";
  import Mail from "@lucide/svelte/icons/mail";
  import Camera from "@lucide/svelte/icons/camera";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  let { data, form } = $props();
  let isSaving = $state(false);
</script>

<div class="mx-auto max-w-2xl px-4 py-8 md:py-12 text-zinc-100">
  <!-- Header -->
  <div class="mb-8 border-b border-zinc-800 pb-5">
    <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-zinc-50">Account Settings</h1>
    <p class="mt-1.5 text-sm text-zinc-400">Update your profile information and manage your public avatar.</p>
  </div>

  <!-- Alerts -->
  {#if form?.success}
    <div class="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-1 duration-200">
      <span>✓</span>
      <p>Your profile has been updated successfully.</p>
    </div>
  {/if}
  
  {#if form?.error}
    <div class="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
      <span>⚠️</span>
      <p>{form.error}</p>
    </div>
  {/if}

  <!-- Main Settings Form -->
  <form 
    method="POST" 
    action="?/updateProfile" 
    enctype="multipart/form-data"
    use:enhance={() => {
      isSaving = true;
      return async ({ update }) => {
        await update();
        isSaving = false;
      };
    }}
    class="space-y-8"
  >
    <!-- Hidden input to maintain existing avatar if not replaced -->
    <input type="hidden" name="currentAvatarUrl" value={data.profile?.avatar_url || ''} />

    <!-- Profile Picture Selection -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div class="relative group h-20 w-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:border-violet-500">
        {#if data.profile?.avatar_url}
          <img src={data.profile.avatar_url} alt="Profile preview" class="h-full w-full object-cover" />
        {:else}
          <User class="h-8 w-8 text-zinc-500" />
        {/if}
        <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera class="h-5 w-5 text-zinc-200" />
        </div>
      </div>

      <div class="space-y-1.5">
        <h3 class="text-sm font-medium text-zinc-200">Profile Picture</h3>
        <p class="text-xs text-zinc-400 mb-3">JPG, PNG or WEBP. Max size 2MB.</p>
        <label class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors hover:bg-zinc-750 hover:text-zinc-100">
          Upload New Image
          <input type="file" name="avatarFile" accept="image/*" class="sr-only" />
        </label>
      </div>
    </div>

    <!-- User Information Inputs -->
    <div class="space-y-6">
      <!-- Email (Disabled) -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-sm font-medium text-zinc-300">Email Address</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
            <Mail class="h-4 w-4" />
          </div>
          <input 
            type="email" 
            id="email" 
            disabled 
            value={data.userEmail || ''} 
            class="w-full bg-zinc-950 border border-zinc-850 py-2.5 pl-10 pr-4 rounded-lg text-sm text-zinc-550 cursor-not-allowed select-none" 
          />
        </div>
        <p class="text-[11px] text-zinc-500">Your registered email address cannot be changed.</p>
      </div>

      <!-- Display Name -->
      <div class="flex flex-col gap-2">
        <label for="displayName" class="text-sm font-medium text-zinc-300">Display Name</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
            <User class="h-4 w-4" />
          </div>
          <input 
            type="text" 
            id="displayName"
            name="displayName" 
            value={data.profile?.display_name || ''} 
            class="w-full bg-zinc-950 border border-zinc-800 py-2.5 pl-10 pr-4 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/80 transition-all" 
            placeholder="What should we call you?" 
            required 
          />
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end pt-4 border-t border-zinc-800">
      <button 
        type="submit" 
        disabled={isSaving} 
        class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-750 text-white font-medium py-2.5 px-5 text-sm transition-all shadow-lg shadow-violet-600/10 disabled:opacity-50 disabled:pointer-events-none"
      >
        {#if isSaving}
          <LoaderCircle class="h-4 w-4 animate-spin" />
          Saving Changes...
        {:else}
          Save Settings
        {/if}
      </button>
    </div>
  </form>
</div>