<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";


    import Users from "@lucide/svelte/icons/users";    
    import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
    import LogOut from "@lucide/svelte/icons/log-out";
    import Logs from "@lucide/svelte/icons/files";
    import Settings from "@lucide/svelte/icons/settings";
    import Dashboard from "@lucide/svelte/icons/layout-dashboard";
    import Folder from "@lucide/svelte/icons/folder";
    import Folders from "@lucide/svelte/icons/folders";
    import AppWindow from "@lucide/svelte/icons/layers";
    import Auth from "@lucide/svelte/icons/shield";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";


    // Destructure properties passed down from layout.svelte
    let { userName = "User", userEmail = "" } = $props();

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

    // Configured real routes mapping to your folders
    const items = [
        { id: "home", title: "Overview", url: "/dashboard", icon: Dashboard },
        { id: "projects", title: "Projects", url: "/dashboard/Projects/", icon: Folder },
        { id: "app", title: "App", url: "/dashboard/App/", icon: AppWindow },
        { id: "users", title: "Users", url: "/dashboard/Users/", icon: Users },
        { id: "auth", title: "Authentication", url: "/dashboard/Auth/", icon: Auth },
        { id: "logs", title: "Logs", url: "/dashboard/Logs/", icon: Logs },
        { id: "settings", title: "Settings", url: "/dashboard/Settings/", icon: Settings },
    ];
</script>

<Sidebar.Root>
    <!-- Brand / logo -->
    <Sidebar.Header class="border-b border-sidebar-border">
        <div class="flex items-center gap-2 px-2 py-1.5">
            <div class="h-7 w-7 rounded-md bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
                <div class="h-2 w-2 rounded-sm bg-violet-400"></div>
            </div>
            <span class="font-semibold tracking-tight text-sidebar-foreground">First Layer</span>
        </div>
    </Sidebar.Header>

    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.id)}
                        <Sidebar.MenuItem>
                            <!-- Use `isActive` dynamically matching SvelteKit's active URL store -->
                            <Sidebar.MenuButton isActive={$page.url.pathname === item.url}>
                                {#snippet child({ props })}
                                    <a href={item.url} {...props}>
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
    <Sidebar.Footer class="border-t border-sidebar-border">
        <Sidebar.MenuItem class="list-none">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <button
                            {...props}
                            class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-sidebar-accent transition-colors"
                        >
                            <Avatar.Root class="h-7 w-7 shrink-0">
                                <Avatar.Fallback class="text-xs bg-violet-500/20 text-violet-300">
                                    {initials(userName)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                                <p class="text-xs text-sidebar-foreground/60 truncate">{userEmail}</p>
                            </div>
                            <ChevronsUpDown class="h-4 w-4 text-sidebar-foreground/50 shrink-0" />
                        </button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56" side="top" align="start">
                    <DropdownMenu.Item href="/dashboard/settings">
                        <UserCog class="h-4 w-4" />
                        Account settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onclick={signOut}>
                        <LogOut class="h-4 w-4" />
                        Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Sidebar.MenuItem>
    </Sidebar.Footer>
</Sidebar.Root>