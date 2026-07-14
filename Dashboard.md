<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	import Plus from "@lucide/svelte/icons/plus";
	import Search from "@lucide/svelte/icons/search";
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import Settings from "@lucide/svelte/icons/settings";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import PackagePlus from "@lucide/svelte/icons/package-plus";
	import FolderKanban from "@lucide/svelte/icons/folder-kanban";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	// --- Data -----------------------------------------------------------
	// NOTE: In the real app this should live in +layout.svelte / a store, and
	// "workspace" navigation should be `goto(\`/projects/\${id}\`)`. Everything
	// below is wired up locally so this single file stays runnable/demoable
	// without the surrounding route files.
	let projects = $state([]);

	/** 'grid' = "My Projects" home. 'workspace' = inside a single project. */
	let view = $state("grid");
	let activeProjectId = $state(null);
	let settingsOpen = $state(false);

	let activeProject = $derived(projects.find((p) => p.id === activeProjectId) ?? null);

	// --- Search -----------------------------------------------------------
	let searchQuery = $state("");
	let filteredProjects = $derived(
		searchQuery.trim()
			? projects.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
			: projects
	);

	// --- Create project ---------------------------------------------------
	let dialogOpen = $state(false);
	let newProjectName = $state("");
	let nameError = $state("");

	function isNameTaken(name) {
		const normalized = name.trim().toLowerCase();
		return projects.some((p) => p.name.toLowerCase() === normalized);
	}

	function createProject(e) {
		e.preventDefault();
		const name = newProjectName.trim();
		if (!name) return;

		if (isNameTaken(name)) {
			nameError = `A project named "${name}" already exists.`;
			return;
		}

		const project = { id: crypto.randomUUID(), name };
		projects = [...projects, project];
		newProjectName = "";
		nameError = "";
		dialogOpen = false;

		// Post-creation redirect: land directly on the new project's workspace.
		activeProjectId = project.id;
		settingsOpen = false;
		view = "workspace";
	}

	function handleDialogOpenChange(open) {
		dialogOpen = open;
		if (!open) {
			nameError = "";
			newProjectName = "";
		}
	}

	// --- Navigation --------------------------------------------------------
	function goToGrid() {
		view = "grid";
		activeProjectId = null;
		settingsOpen = false;
	}

	function openProject(project) {
		activeProjectId = project.id;
		settingsOpen = false;
		view = "workspace";
	}

	function openProjectSettings(project) {
		activeProjectId = project.id;
		settingsOpen = true;
		view = "workspace";
	}

	// --- Delete project ------------------------------------------------
	let deleteTarget = $state(null);

	function requestDelete(project) {
		deleteTarget = project;
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		projects = projects.filter((p) => p.id !== deleteTarget.id);
		if (activeProjectId === deleteTarget.id) goToGrid();
		deleteTarget = null;
	}

	// --- Breadcrumbs ---------------------------------------------------
	// Hidden/simplified on the dashboard root; only shown once the user is
	// nested inside a project (and further nested inside its settings).
	let crumbs = $derived(
		view === "workspace" && activeProject
			? settingsOpen
				? ["Dashboard", activeProject.name, "Settings"]
				: ["Dashboard", activeProject.name]
			: []
	);
</script>

<!-- The sidebar, Sidebar.Provider, and Sidebar.Trigger
     are already provided by +layout.svelte — don't repeat them here. -->

<!-- Reduced left padding relative to the sidebar: no more mx-auto centering,
     content now hugs the sidebar edge instead of floating in the middle.
     No max-w cap either — previously a fixed max-w-5xl left a dead gap on
     the right whenever the sidebar was collapsed and this area got wider;
     now content grows to fill whatever space is actually available. -->
<div class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8">
	<!-- Desktop/tablet breadcrumb bar, sits in the header next to the sidebar trigger -->
	<div class="hidden sm:flex items-center justify-between mb-6 h-8">
		<nav class="flex items-center flex-wrap gap-1.5 text-sm" aria-label="Breadcrumb">
			{#if crumbs.length === 0}
				<span class="text-zinc-100 font-medium">Dashboard</span>
			{:else}
				<button
					class="text-zinc-500 hover:text-zinc-300 transition-colors"
					onclick={goToGrid}
				>
					Dashboard
				</button>
				{#each crumbs.slice(1) as crumb, i}
					<ChevronRight class="h-3.5 w-3.5 text-zinc-700" />
					{#if i === crumbs.slice(1).length - 1}
						<span class="text-zinc-100 font-medium">{crumb}</span>
					{:else}
						<button
							class="text-zinc-500 hover:text-zinc-300 transition-colors"
							onclick={() => (settingsOpen = false)}
						>
							{crumb}
						</button>
					{/if}
				{/each}
			{/if}
		</nav>
	</div>

    <!-- Mobile: breadcrumb replaces the "Dashboard" title in place, rather than
         living in its own row -->
    <div class="flex sm:hidden items-center mb-6 h-7">
    	<nav class="flex items-center flex-wrap gap-1 text-sm min-w-0" aria-label="Breadcrumb">
    		{#if crumbs.length === 0}
    			<span class="text-zinc-100 font-medium text-base">Dashboard</span>
    		{:else}
    			<button class="text-zinc-500 shrink-0" onclick={goToGrid}>Dashboard</button>
    			{#each crumbs.slice(1) as crumb, i}
    				<ChevronRight class="h-3 w-3 text-zinc-700 shrink-0" />
    				{#if i === crumbs.slice(1).length - 1}
    					<span class="text-zinc-100 font-medium truncate">{crumb}</span>
    				{:else}
    					<button class="text-zinc-500 shrink-0" onclick={() => (settingsOpen = false)}>
    						{crumb}
    					</button>
    				{/if}
    			{/each}
    		{/if}
    	</nav>
    </div>

    {#if view === "grid"}
    	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
    		<h1 class="hidden sm:block text-lg font-semibold text-zinc-100 shrink-0">My Projects</h1>

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

    			<Dialog.Root open={dialogOpen} onOpenChange={handleDialogOpenChange}>
    			<Dialog.Trigger>
    				{#snippet child({ props })}
    					<Button
    						{...props}
    						class="bg-violet-600 hover:bg-violet-400 text-white hover:text-white gap-1.5"
    						variant="ghost"
    					>
    						<Plus class="h-4 w-4" />
    						Add Project
    					</Button>
    				{/snippet}
    			</Dialog.Trigger>
    			<Dialog.Content class="sm:max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100">
    				<Dialog.Header>
    					<Dialog.Title class="text-zinc-100">Create a new project</Dialog.Title>
    					<Dialog.Description class="text-zinc-400">
    						Give your project a name. You can change this later.
    					</Dialog.Description>
    				</Dialog.Header>

    				<form onsubmit={createProject} class="grid gap-4 pt-2">
    					<div class="grid gap-2">
    						<Label for="project-name" class="text-zinc-300">Project name</Label>
    						<Input
    							id="project-name"
    							placeholder="e.g. Johnsnow"
    							bind:value={newProjectName}
    							oninput={() => (nameError = "")}
    							autofocus
    							required
    							aria-invalid={nameError ? "true" : undefined}
    							class="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 {nameError ? 'border-red-500/70 focus-visible:ring-red-500' : ''}"
    						/>
    						{#if nameError}
    							<p class="text-xs text-red-400">{nameError}</p>
    						{/if}
    					</div>

    					<Dialog.Footer class="mt-2">
    						<Button
    							type="button"
    							variant="outline"
    							class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
    							onclick={() => (dialogOpen = false)}
    						>
    							Cancel
    						</Button>
    						<Button type="submit" class="bg-violet-600 hover:bg-violet-500 text-white">
    							Create project
    						</Button>
    					</Dialog.Footer>
    				</form>
    			</Dialog.Content>
    			</Dialog.Root>
    		</div>
    	</div>

    	<!-- Empty state -->
    	{#if projects.length === 0}
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
    				onclick={() => (dialogOpen = true)}
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
    		<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    			{#each filteredProjects as project (project.id)}
    				<li class="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors">
    					<button
    						class="flex items-start gap-3 w-full text-left pr-8"
    						onclick={() => openProject(project)}
    					>
    						<div class="h-9 w-9 shrink-0 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
    							<FolderKanban class="h-4 w-4 text-violet-400" />
    						</div>
    						<div class="min-w-0">
    							<p class="font-medium text-zinc-100 truncate">{project.name}</p>
    							<p class="text-xs text-zinc-500 mt-0.5">Tap to open workspace</p>
    						</div>
    					</button>

    					<DropdownMenu.Root>
    						<DropdownMenu.Trigger>
    							{#snippet child({ props })}
    								<Button
    									{...props}
    									variant="ghost"
    									size="icon"
    									class="absolute top-3 right-3 h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
    									aria-label="Project options"
    								>
    									<EllipsisVertical class="h-4 w-4" />
    								</Button>
    							{/snippet}
    						</DropdownMenu.Trigger>
    						<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
    							<DropdownMenu.Item
    								class="gap-2 focus:bg-zinc-800 focus:text-zinc-100"
    								onclick={() => openProjectSettings(project)}
    							>
    								<Settings class="h-4 w-4" />
    								Project settings
    							</DropdownMenu.Item>
    							<DropdownMenu.Separator class="bg-zinc-800" />
    							<DropdownMenu.Item
    								class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
    								onclick={() => requestDelete(project)}
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
    {:else if view === "workspace" && activeProject}
    	<!-- Project workspace -->
    	<div class="flex items-center justify-between mb-6">
    		<button
    			class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
    			onclick={goToGrid}
    		>
    			<ArrowLeft class="h-3.5 w-3.5" />
    			All projects
    		</button>

    		<DropdownMenu.Root>
    			<DropdownMenu.Trigger>
    				{#snippet child({ props })}
    					<Button
    						{...props}
    						variant="ghost"
    						size="icon"
    						class="h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
    						aria-label="Project options"
    					>
    						<EllipsisVertical class="h-4 w-4" />
    					</Button>
    				{/snippet}
    			</DropdownMenu.Trigger>
    			<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
    				<DropdownMenu.Item
    					class="gap-2 focus:bg-zinc-800 focus:text-zinc-100"
    					onclick={() => (settingsOpen = true)}
    				>
    					<Settings class="h-4 w-4" />
    					Project settings
    				</DropdownMenu.Item>
    				<DropdownMenu.Separator class="bg-zinc-800" />
    				<DropdownMenu.Item
    					class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
    					onclick={() => requestDelete(activeProject)}
    				>
    					<Trash2 class="h-4 w-4" />
    					Delete project
    				</DropdownMenu.Item>
    			</DropdownMenu.Content>
    		</DropdownMenu.Root>
    	</div>

    	{#if settingsOpen}
    		<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
    			<h2 class="text-base font-semibold text-zinc-100 mb-1">Settings</h2>
    			<p class="text-sm text-zinc-500 mb-4">Manage settings for {activeProject.name}.</p>
    			<div class="grid gap-2 max-w-sm">
    				<Label for="settings-project-name" class="text-zinc-300">Project name</Label>
    				<Input
    					id="settings-project-name"
    					value={activeProject.name}
    					class="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-violet-500"
    				/>
    			</div>
    		</div>
    	{:else}
    		<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
    			<h2 class="text-base font-semibold text-zinc-100 mb-1">{activeProject.name}</h2>
    			<p class="text-sm text-zinc-500">Project workspace goes here.</p>
    		</div>
    	{/if}
    {/if}

</div>

<!-- Delete confirmation -->

<Dialog.Root open={deleteTarget !== null} onOpenChange={(open) => !open && (deleteTarget = null)}>
<Dialog.Content class="sm:max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100">
<Dialog.Header>
<Dialog.Title class="text-zinc-100">Delete project</Dialog.Title>
<Dialog.Description class="text-zinc-400">
This permanently deletes "{deleteTarget?.name}". This can't be undone.
</Dialog.Description>
</Dialog.Header>
<Dialog.Footer class="mt-2">
<Button
type="button"
variant="outline"
class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
onclick={() => (deleteTarget = null)} >
Cancel
</Button>
<Button
				type="button"
				class="bg-red-600 hover:bg-red-500 text-white"
				onclick={confirmDelete}
			>
Delete
</Button>
</Dialog.Footer>
</Dialog.Content>
</Dialog.Root>
