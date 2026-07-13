<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getSession } from "$lib/services/auth";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();

    let loading = true;

    onMount(async () => {
        const {
            data: { session }
        } = await getSession();

        if (!session) {
            goto("/login");
            return;
        }

        loading = false;
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