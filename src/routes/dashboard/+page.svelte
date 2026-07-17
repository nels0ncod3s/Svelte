<script>
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";

	import Plus from "@lucide/svelte/icons/plus";
	import Search from "@lucide/svelte/icons/search";
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import Settings from "@lucide/svelte/icons/settings";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import PackagePlus from "@lucide/svelte/icons/package-plus";
	import FolderKanban from "@lucide/svelte/icons/folder-kanban";

	// This page only owns the grid content now — the "workspace" view moved
	// to dashboard/[project]/+page.svelte, and the Add/Delete modals moved
	// to +layout.svelte (both are reachable from more than just this page
	// now). `data.projects` comes from dashboard/+layout.server.js.
	let { data } = $props();

	// Effects don't run during SSR, so relying on $effect alone means the
	// server renders the store's initial empty array — real projects only
	// appear after the client hydrates and the effect fires. That's the
	// "empty state flashes before my projects show up" bug. This direct
	// call runs during the normal top-to-bottom script evaluation (both on
	// the server and on the client's first pass), so the very first render
	// already has the real data.
	dashboard.setProjects(data.projects);

	// Effect still needed for subsequent updates — e.g. after a form action
	// triggers SvelteKit's default invalidateAll() and `data` changes on an
	// already-mounted component, where a plain top-level statement wouldn't
	// re-run.
	$effect(() => {
		dashboard.setProjects(data.projects);
	});

	// --- Search ---------------------------------------------------------------
	let searchQuery = $state("");
	let filteredProjects = $derived(
		searchQuery.trim()
			? dashboard.projects.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
			: dashboard.projects
	);
</script>

<!-- The sidebar, Sidebar.Provider, Sidebar.Trigger, the breadcrumb, and the
     Add/Delete Project dialogs are all provided by +layout.svelte — don't
     repeat them here. -->

<div class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
		<h1 class="text-lg font-semibold text-zinc-100 shrink-0">My Projects</h1>

		<div class="flex items-center gap-2 sm:ml-auto">
			<div class="relative flex-1 sm:flex-none">
				<Search class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
				<Input
					type="search"
					placeholder="Search projects..."
					bind:value={searchQuery}
					class="pl-8 w-full sm:w-56 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
				/>
			</div>

			<Button
				class="bg-violet-600 hover:bg-violet-400 text-white hover:text-white gap-1.5"
				variant="ghost"
				onclick={() => dashboard.openAddDialog()}
			>
				<Plus class="h-4 w-4" />
				Add Project
			</Button>
		</div>
	</div>

	<!-- Empty state -->
	{#if dashboard.projects.length === 0}
		<div class="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 sm:py-20 flex flex-col items-center text-center">
			<div class="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
				<PackagePlus class="h-6 w-6 text-violet-400" />
			</div>
			<h2 class="text-base sm:text-lg font-semibold text-zinc-100">No projects yet</h2>
			<p class="text-sm text-zinc-500 mt-1.5 max-w-xs">
				Create your first project to start issuing API keys and managing users.
			</p>
			<Button
				class="mt-6 gap-1.5 border border-zinc-800 bg-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100"
				variant="ghost"
				onclick={() => dashboard.openAddDialog()}
			>
				<Plus class="h-4 w-4" />
				Add Project
			</Button>
		</div>
	{:else if filteredProjects.length === 0}
		<!-- No search results -->
		<div class="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 flex flex-col items-center text-center">
			<Search class="h-6 w-6 text-zinc-600 mb-3" />
			<h2 class="text-sm font-medium text-zinc-300">No projects match "{searchQuery}"</h2>
			<Button
				class="mt-4 text-zinc-400 hover:text-zinc-100"
				variant="ghost"
				size="sm"
				onclick={() => (searchQuery = "")}
			>
				Clear search
			</Button>
		</div>
	{:else}
		<!-- "My Projects" card grid -->
		<ul class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
			{#each filteredProjects as project (project.id)}
				<li class="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 min-h-[168px] flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-900/60 transition-colors">
					<button
						class="flex items-start gap-4 w-full text-left pr-8"
						onclick={() => dashboard.openProject(project)}
					>
						<div class="h-14 w-14 shrink-0 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
							<FolderKanban class="h-7 w-7 text-violet-400" />
						</div>
						<div class="min-w-0 pt-1">
							<p class="font-semibold text-lg text-zinc-100 truncate">{project.name}</p>
							<p class="text-sm text-zinc-500 mt-1">Tap to open workspace</p>
						</div>
					</button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button
									{...props}
									variant="ghost"
									size="icon"
									class="absolute top-5 right-5 h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
									aria-label="Project options"
								>
									<EllipsisVertical class="h-4 w-4" />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
							<DropdownMenu.Item
								class="gap-2 focus:bg-zinc-800 focus:text-zinc-100"
								onclick={() => dashboard.openProjectSettings(project)}
							>
								<Settings class="h-4 w-4" />
								Project settings
							</DropdownMenu.Item>
							<DropdownMenu.Separator class="bg-zinc-800" />
							<DropdownMenu.Item
								class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
								onclick={() => dashboard.requestDelete(project)}
							>
								<Trash2 class="h-4 w-4" />
								Delete project
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</li>
			{/each}
		</ul>
	{/if}
</div>
