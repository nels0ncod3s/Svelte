<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";

    import HouseIcon from "@lucide/svelte/icons/house";

    import SearchIcon from "@lucide/svelte/icons/search";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    import Users from "@lucide/svelte/icons/users"
    import KeyRound from "@lucide/svelte/icons/key-round"
    import AppWindow from "@lucide/svelte/icons/app-window"
    import ShieldCheck from "@lucide/svelte/icons/shield-check"
    import ScrollText from "@lucide/svelte/icons/scroll-text"
    import Webhook from "@lucide/svelte/icons/webhook"
    import CreditCard from "@lucide/svelte/icons/credit-card"


    async function signOut() {
        await logout();
        goto("/login");
    }

    // Menu items.
    const items = [
        {
            title: "Home",
            url: "#",
            icon: HouseIcon,
        },
        {
            title: "App",
            url: "#",
            icon: AppWindow,
        },
        {
            title: "Users",
            url: "#",
            icon: Users,
        },
        {
            title: "Authentication",
            url: "#",
            icon: ShieldCheck,
        },
        {
            title: "API Keys",
            url: "#",
            icon: KeyRound,
        },
        {
            title: "Users",
            url: "#",
            icon: Users,
        },
        {
            title: "Logs",
            url: "#",
            icon: ScrollText,
        },
        {
            title: "Webhook",
            url: "#",
            icon: Webhook,
        },
        {
            title: "Billings",
            url: "#",
            icon: CreditCard,
        },
        {
            title: "Settings",
            url: "#",
            icon: SettingsIcon,
        },
       
    ];
</script>

<Sidebar.Root>
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    {#each items as item (item.title)}
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

    <!-- logout -->
    <Sidebar.Footer>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-muted"
                    onclick={signOut}
                >
                    Logout
                </button>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>