<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import Users from "@lucide/svelte/icons/users";    
    import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
    import LogOut from "@lucide/svelte/icons/log-out";
    import Logs from "@lucide/svelte/icons/files";
    import Settings from "@lucide/svelte/icons/settings";
    import Folder from "@lucide/svelte/icons/folder";
    import AppWindow from "@lucide/svelte/icons/layers";
    import Auth from "@lucide/svelte/icons/shield";
    import UserCog from "@lucide/svelte/icons/user-cog";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    // avatarUrl is optional — falls back to initials if not provided
    let { userName = "User", userEmail = "", avatarUrl = "" } = $props();

    const sidebar = Sidebar.useSidebar();

    async function signOut() {
        await logout();
        goto("/login");
    }

    function initials(name) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function handleNavigate() {
        if (sidebar.isMobile) sidebar.setOpenMobile(false);
    }

    const items = [
        { id: "projects", title: "Projects", url: "/dashboard", icon: Folder },
        { id: "app", title: "App", url: "/dashboard/App/", icon: AppWindow },
        { id: "users", title: "Users", url: "/dashboard/Users/", icon: Users },
        { id: "auth", title: "Authentication", url: "/dashboard/Auth/", icon: Auth },
        { id: "logs", title: "Logs", url: "/dashboard/Logs/", icon: Logs },
        { id: "settings", title: "Settings", url: "/dashboard/Settings/", icon: Settings },
    ];
</script>

<Sidebar.Root class="bg-zinc-950 text-zinc-100 border-zinc-800">

    <!-- Brand / logo -->
    <Sidebar.Header class="border-b border-zinc-800 bg-zinc-950">
        <div class="flex items-center gap-2 px-2 py-1.5">
            <div class="h-7 w-7 rounded-md bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
                <div class="h-2 w-2 rounded-sm bg-violet-400"></div>
            </div>
            <span class="font-semibold tracking-tight text-zinc-100">First Layer</span>
        </div>
    </Sidebar.Header>

    <Sidebar.Content class="bg-zinc-950">
        <Sidebar.Group>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.id)}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={$page.url.pathname === item.url}
                                class="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[active=true]:bg-zinc-800 data-[active=true]:text-zinc-100"
                            >
                                {#snippet child({ props })}
                                    <a href={item.url} {...props} onclick={handleNavigate}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/each}
                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>

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
                <DropdownMenu.Content
                    class="w-56 bg-zinc-900 border-zinc-800 text-zinc-100"
                    side="top"
                    align="start"
                >
                    <DropdownMenu.Item
                        class="gap-2 focus:bg-zinc-800 focus:text-zinc-100 p-0"
                    >

                        <a href="/dashboard/Account/" 
                        class="flex w-full items-center gap-2 w-full px-2 py-1.5"
                        onclick={() => {}}
                        >
                            <UserCog class="h-4 w-4" />
                                Account settings
                        </a>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator class="bg-zinc-800" />
                    <DropdownMenu.Item
                        onclick={signOut}
                        class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                    >
                        <LogOut class="h-4 w-4" />
                        Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Sidebar.MenuItem>
    </Sidebar.Footer>

</Sidebar.Root>