<script>
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	// `data.user` comes from +layout.server.js, which already redirects to
	// /login if there's no session — no client-side auth check needed here,
	// and no loading flash while we wait on it.
	let { data, children } = $props();

	function handleWindowClick(e) {
		if (!e.target.closest("[data-project-switcher]")) {
			dashboard.closeSwitcher();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<Sidebar.Provider>
	<AppSidebar userName={data.user.name} userEmail={data.user.email} avatarUrl={data.user.avatarUrl} />

	<main class="flex-1 min-w-0 bg-[#0a0a0b] min-h-screen text-zinc-100">

		<!-- Sticky header — single consolidated breadcrumb bar. This is the
		     only place a breadcrumb renders; the dashboard page draws none. -->
		<header class="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md px-4 py-3 sm:px-6">
			<Sidebar.Trigger class="h-9 w-9 rounded-md hover:bg-zinc-800 transition-colors" />

			<nav class="flex items-center flex-wrap gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">

				<!-- "Projects" — dropdown trigger + breadcrumb root -->
				<div class="relative" data-project-switcher>
					<button
						onclick={() => dashboard.toggleSwitcher()}
						aria-haspopup="listbox"
						aria-expanded={dashboard.switcherOpen}
						class="flex items-center gap-1 rounded px-1.5 py-0.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
					>
						Projects
						<svg
							class="w-3.5 h-3.5 text-zinc-500 transition-transform {dashboard.switcherOpen ? 'rotate-180' : ''}"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
						</svg>
					</button>

					{#if dashboard.switcherOpen}
						<div
							role="listbox"
							aria-label="Switch project"
							class="absolute left-0 top-full mt-1.5 w-52 rounded-lg border border-zinc-700/60 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden z-50"
						>
							{#if dashboard.projects.length > 0}
								<ul class="py-1 max-h-60 overflow-y-auto">
									{#each dashboard.projects as project (project.id)}
										<li>
											<button
												role="option"
												aria-selected={dashboard.activeProjectId === project.id}
												onclick={() => dashboard.switchProject(project)}
												class="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-zinc-200 hover:bg-zinc-800 transition-colors {dashboard.activeProjectId === project.id ? 'text-white font-medium' : ''}"
											>
												{project.name}
												{#if dashboard.activeProjectId === project.id}
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

							<!-- Add New Project — opens the real Add Project modal
							     (rendered on the dashboard page) via shared state,
							     instead of routing anywhere. -->
							<button
								onclick={() => dashboard.openAddDialog()}
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

				<!-- Rest of the breadcrumb: active project name, then Settings
				     if the user is nested inside it. Each non-final crumb is
				     clickable. -->
				{#each dashboard.crumbs as crumb, i}
					<ChevronRight class="h-3.5 w-3.5 text-zinc-700 shrink-0" aria-hidden="true" />
					{#if i === dashboard.crumbs.length - 1}
						<span class="text-zinc-100 font-medium truncate">{crumb}</span>
					{:else}
						<button
							class="text-zinc-500 hover:text-zinc-300 transition-colors truncate"
							onclick={() => (dashboard.settingsOpen = false)}
						>
							{crumb}
						</button>
					{/if}
				{/each}
			</nav>
		</header>

		<div class="p-4 sm:p-6">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>