<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import HouseIcon from "@lucide/svelte/icons/house";
    import AppWindow from "@lucide/svelte/icons/app-window";
    import Users from "@lucide/svelte/icons/users";
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import UserIcon from "@lucide/svelte/icons/user";
    import LogOut from "@lucide/svelte/icons/log-out";
    import ChevronUp from "@lucide/svelte/icons/chevron-up";

    // Pull user from your auth store — adjust to match your actual store
    let user = $derived($authStore?.user ?? { name: "Nelson", email: "nelson@example.com" });

    async function signOut() {
        await logout();
        goto("/login");
    }

    const items = [
        { title: "Dashboard",      url: "/dashboard", icon: HouseIcon },
        { title: "App",            url: "/app",       icon: AppWindow },
        { title: "Users",          url: "/users",     icon: Users },
        { title: "Authentication", url: "/auth",      icon: ShieldCheck },
    ];
</script>

<Sidebar.Root>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <!-- Logo / Brand -->
                <div class="flex items-center gap-2.5 px-2 py-2">
                    <div class="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                        <!-- Replace with your actual logo SVG or image -->
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--sidebar-primary-foreground))" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                    </div>
                    <span class="text-lg font-medium text-sidebar-foreground">Acme Inc</span>
                </div>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>

    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.title)}
                        {@const isActive = $page.url.pathname === item.url || $page.url.pathname.startsWith(item.url + "/")}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton isActive={isActive}>
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

    <Sidebar.Footer>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Sidebar.MenuButton
                                {...props}
                                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div class="flex items-center gap-2.5 w-full">
                                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-300 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                                        {user.name?.[0]?.toUpperCase() ?? "?"}
                                    </div>
                                    <div class="flex flex-col items-start overflow-hidden">
                                        <span class="text-sm font-medium truncate">{user.name}</span>
                                        <span class="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
                                    </div>
                                </div>
                                <ChevronUp class="ms-auto transition-transform duration-200" />
                            </Sidebar.MenuButton>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                        side="top"
                        class="w-(--bits-dropdown-menu-anchor-width)"
                    >
                        <DropdownMenu.Item>
                            <a href="/account" class="flex items-center gap-2 w-full">
                                <UserIcon size={16} />
                                <span>Account settings</span>
                            </a>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                            onclick={signOut}
                            class="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                            <LogOut size={16} />
                            <span>Log out</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>

Most of the changes I want have been made in trial-sidebar. Let's clean up the code merge them into one unified working code.

The UI looks weirdly off, lets keep the UI of the main sidebar not the trial bar

- the bottom doesn't show your name and email, just shows signed-in (that's not what we want)
- log out went back to being black lol
- app, authentication & users are all a part of the dashboard - is linking another page the best route to go?
- on mobile, the background is transparent, fix it
