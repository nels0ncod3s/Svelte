<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    // ... Keep all your lucide icons and component imports exactly as they are ...

    // ADD avatarUrl here:
    let { userName = "User", userEmail = "", avatarUrl = "" } = $props();

    // ... Keep sidebar context, signOut, initials, handleNavigate, and items array exactly the same ...
</script>

<!-- ... Keep Header and Content completely identical ... -->

    <!-- Profile + logout -->
    <Sidebar.Footer class="border-t border-zinc-800 bg-zinc-950">
        <Sidebar.MenuItem class="list-none">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <button
                            {...props}
                            class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-zinc-800 transition-colors"
                        >
                            <!-- UPDATED AVATAR IMPLEMENTATION -->
                            <Avatar.Root class="h-7 w-7 shrink-0">
                                {#if avatarUrl}
                                    <Avatar.Image src={avatarUrl} alt={userName} class="object-cover" />
                                {/if}
                                <Avatar.Fallback class="text-xs bg-violet-500/20 text-violet-300">
                                    {initials(userName)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-zinc-100 truncate">{userName}</p>
                                <p class="text-xs text-zinc-400/70 truncate">{userEmail}</p>
                            </div>
                            <ChevronsUpDown class="h-4 w-4 text-zinc-500 shrink-0" />
                        </button>
                    {/snippet}
                </DropdownMenu.Trigger>
                
                <!-- ... Keep DropdownMenu.Content exactly the same ... -->
            </DropdownMenu.Root>
        </Sidebar.MenuItem>
    </Sidebar.Footer>
</Sidebar.Root>