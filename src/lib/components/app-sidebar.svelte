<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";

    import HouseIcon from "@lucide/svelte/icons/house";
    import SearchIcon from "@lucide/svelte/icons/search";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import Users from "@lucide/svelte/icons/users";
    import KeyRound from "@lucide/svelte/icons/key-round";
    import AppWindow from "@lucide/svelte/icons/app-window";
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import ScrollText from "@lucide/svelte/icons/scroll-text";
    import Webhook from "@lucide/svelte/icons/webhook";
    import CreditCard from "@lucide/svelte/icons/credit-card";
    import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
    import LogOut from "@lucide/svelte/icons/log-out";
    import UserCog from "@lucide/svelte/icons/user-cog";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    // Wire these from a real session later (e.g. pass as props from +layout.svelte)
    let { userName = "Nelson", userEmail = "nelson@example.com" } = $props();

    async function signOut() {
        await logout();
        goto("/login");
    }

    function initials(name) {
        return name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    // Menu items.
    const items = [
        { id: "home", title: "Home", url: "#", icon: HouseIcon },
        { id: "app", title: "App", url: "#", icon: AppWindow },
        { id: "users", title: "Users", url: "#", icon: Users },
        { id: "auth", title: "Authentication", url: "#", icon: ShieldCheck },
        { id: "api-keys", title: "API Keys", url: "#", icon: KeyRound },
        { id: "logs", title: "Logs", url: "#", icon: ScrollText },
        { id: "webhook", title: "Webhook", url: "#", icon: Webhook },
        { id: "billing", title: "Billings", url: "#", icon: CreditCard },
        { id: "settings", title: "Settings", url: "#", icon: SettingsIcon },
    ];
</script>

<Sidebar.Root>
    <!-- Brand / logo -->
    <Sidebar.Header class="border-b border-sidebar-border">
        <div class="flex items-center gap-2 px-2 py-1.5">
            <div class="h-7 w-7 rounded-md bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
                <div class="h-2 w-2 rounded-sm bg-violet-400"></div>
            </div>
            <span class="font-semibold tracking-tight text-sidebar-foreground">Sigil</span>
        </div>
    </Sidebar.Header>

    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.id)}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton>
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
        <Sidebar.Menu>
            <Sidebar.MenuItem>
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
                        <DropdownMenu.Item>
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
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>