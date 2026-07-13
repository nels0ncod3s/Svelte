<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getSession } from "$lib/services/auth";

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
    <slot />
{/if}