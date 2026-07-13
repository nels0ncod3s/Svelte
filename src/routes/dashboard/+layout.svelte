<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getSession } from "$lib/services/auth";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();

    let loading = true;

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
    <h2>Loading...</h2>
{:else}
    <Sidebar.Provider>
        <AppSidebar />

        <main class="flex-1">
            <Sidebar.Trigger />
            {@render children?.()}
        </main>
    </Sidebar.Provider>
{/if}