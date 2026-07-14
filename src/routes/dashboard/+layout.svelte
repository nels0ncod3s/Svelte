<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getSession } from "$lib/services/auth";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";

    let { children } = $props();

    let loading = $state(true);
    let userData = $state({ name: "User", email: "" });

    // --- Project switcher state ---
    let projects = $state([]); // populate from your data layer
    let currentProject = $state(null); // e.g. { id, name }
    let dropdownOpen = $state(false);

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function closeDropdown() {
        dropdownOpen = false;
    }

    function switchProject(project) {
        currentProject = project;
        closeDropdown();
        // TODO: trigger any route/context change needed when switching projects
    }

    function addNewProject() {
        closeDropdown();
        // TODO: open your Add Project modal here
    }

    // Close dropdown when clicking outside
    function handleWindowClick(e) {
        if (!e.target.closest("[data-project-switcher]")) {
            closeDropdown();
        }
    }

    onMount(async () => {
        try {
            const {
                data: { session }
            } = await getSession();

            if (!session) {
                goto("/login");
                return;
            }

            userData = {
                name: session.user?.user_metadata?.full_name || session.user?.email?.split("@")[0] || "User",
                email: session.user?.email || ""
            };

            // TODO: fetch real projects list for this user and set `projects` + `currentProject`
            // e.g. projects = await getProjects(session.user.id);
            //      currentProject = projects[0] ?? null;

            loading = false;
        } catch (err) {
            console.error("getSession failed:", err);
            goto("/login");
        }
    });
</script>

<svelte:window on:click={handleWindowClick} />

{#if loading}
    <div class="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <h2 class="text-zinc-400 text-sm">Loading…</h2>
    </div>
{:else}
    <Sidebar.Provider>
        <AppSidebar userName={userData.name} userEmail={userData.email} />

        <main class="flex-1 min-w-0 bg-[#0a0a0b] min-h-screen text-zinc-100">

            <!-- Sticky header with breadcrumb / project switcher -->
            <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md px-4 py-3 sm:px-6">
                <Sidebar.Trigger class="h-9 w-9 rounded-md hover:bg-zinc-800 transition-colors" />

                <!-- Breadcrumb -->
                <nav class="flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">

                    <!-- "Projects" — dropdown trigger -->
                    <div class="relative" data-project-switcher>
                        <button
                            onclick={toggleDropdown}
                            aria-haspopup="listbox"
                            aria-expanded={dropdownOpen}
                            class="flex items-center gap-1 rounded px-1.5 py-0.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                        >
                            Projects
                            <!-- Chevron icon -->
                            <svg
                                class="w-3.5 h-3.5 text-zinc-500 transition-transform {dropdownOpen ? 'rotate-180' : ''}"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                            </svg>
                        </button>

                        <!-- Dropdown menu -->
                        {#if dropdownOpen}
                            <div
                                role="listbox"
                                aria-label="Switch project"
                                class="absolute left-0 top-full mt-1.5 w-52 rounded-lg border border-zinc-700/60 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden z-50"
                            >
                                {#if projects.length > 0}
                                    <ul class="py-1 max-h-60 overflow-y-auto">
                                        {#each projects as project (project.id)}
                                            <li>
                                                <button
                                                    role="option"
                                                    aria-selected={currentProject?.id === project.id}
                                                    onclick={() => switchProject(project)}
                                                    class="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-zinc-200 hover:bg-zinc-800 transition-colors {currentProject?.id === project.id ? 'text-white font-medium' : ''}"
                                                >
                                                    {project.name}
                                                    {#if currentProject?.id === project.id}
                                                        <!-- Checkmark for active project -->
                                                        <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                                                        </svg>
                                                    {/if}
                                                </button>
                                            </li>
                                        {/each}
                                    </ul>
                                    <div class="border-t border-zinc-700/60"></div>
                                {:else}
                                    <p class="px-3 py-2 text-xs text-zinc-500">No projects yet.</p>
                                    <div class="border-t border-zinc-700/60"></div>
                                {/if}

                                <!-- Add New Project -->
                                <button
                                    onclick={addNewProject}
                                    class="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                                >
                                    <svg class="w-4 h-4 text-zinc-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                    </svg>
                                    Add New Project
                                </button>
                            </div>
                        {/if}
                    </div>

                    <!-- Separator + current project name (only when a project is active) -->
                    {#if currentProject}
                        <span class="text-zinc-600 select-none" aria-hidden="true">/</span>
                        <span class="text-zinc-100 font-medium truncate">{currentProject.name}</span>
                    {/if}
                </nav>
            </header>

            <div class="p-4 sm:p-6">
                {@render children?.()}
            </div>
        </main>
    </Sidebar.Provider>
{/if}