<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getSession } from "$lib/services/auth";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();

    let loading = $state(true);

    onMount(async () => {
        try {
            const {
                data: { session }
            } = await getSession();

            console.log("session:", session);

            if (!session) {
                console.log("no session, redirecting to /login");
                goto("/login");
                return;
            }

            loading = false;
        } catch (err) {
            console.error("getSession failed:", err);
        }
    });
</script>

{#if loading}
    <div class="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <h2 class="text-zinc-400 text-sm">Loading...</h2>
    </div>
{:else}
    <Sidebar.Provider>
        <AppSidebar />

        <main class="flex-1 min-w-0">
            <!-- Sticky mobile-friendly header: always reachable trigger -->
            <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md px-4 py-3 sm:px-6">
                <Sidebar.Trigger class="h-9 w-9 rounded-md hover:bg-zinc-800 transition-colors" />
                <span class="text-sm font-medium text-zinc-300 sm:hidden">Dashboard</span>
            </header>

            <div class="p-4 sm:p-6">
                {@render children?.()}
            </div>
        </main>
    </Sidebar.Provider>
{/if}