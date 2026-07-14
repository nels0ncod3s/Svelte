<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	import FolderPlus from "@lucide/svelte/icons/folder-plus";
	import Plus from "@lucide/svelte/icons/plus";

	import Icon from "@lucide/svelte/icons/box";
	import Package from "@lucide/svelte/icons/package";
	import OpenPack from "@lucide/svelte/icons/package-open";
	import PackagePlus from "@lucide/svelte/icons/package-plus";

	// Placeholder trail — wire this up to real routing/project data later
	const crumbs = ["Projects", "...", "Johnsnow", "Active"];

	let dialogOpen = $state(false);
	let newProjectName = $state("");
	let projects = $state([]);

	function createProject(e) {
		e.preventDefault();
		if (!newProjectName.trim()) return;

		projects = [...projects, { id: crypto.randomUUID(), name: newProjectName.trim() }];
		newProjectName = "";
		dialogOpen = false;
	}
</script>

<!-- The sidebar, Sidebar.Provider, and Sidebar.Trigger
     are already provided by +layout.svelte — don't repeat them here. -->

<div class="max-w-3xl mx-auto">
	<!-- Breadcrumb -->
	<nav class="flex items-center flex-wrap gap-1.5 text-sm mb-6" aria-label="Breadcrumb">
		{#each crumbs as crumb, i}
			{#if i === crumbs.length - 1}
				<span class="text-zinc-100 font-medium">{crumb}</span>
			{:else}
				<span class="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">{crumb}</span>
				<span class="text-zinc-700">\</span>
			{/if}
		{/each}
	</nav>

	<div class="flex items-center justify-between mb-6">

		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} class="bg-violet-600 hover:bg-violet-400  text-white hover:text-white gap-1.5" variant="ghost">
						<Plus class="h-4 w-4" />
						Add Project
					</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Create a new project</Dialog.Title>
					<Dialog.Description>
						Give your project a name. You can change this later.
					</Dialog.Description>
				</Dialog.Header>

				<form onsubmit={createProject} class="grid gap-4 pt-2">
					<div class="grid gap-2">
						<Label for="project-name">Project name</Label>
						<Input
							id="project-name"
							placeholder="e.g. Johnsnow"
							bind:value={newProjectName}
							autofocus
							required
						/>
					</div>

					<Dialog.Footer class="mt-2">
						<Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>
							Cancel
						</Button>
						<Button type="submit">Create project</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
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
			<Button class="mt-6 gap-1.5 border border-zinc-800 bg-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100" variant="ghost" onclick={() => (dialogOpen = true)}>
				<Plus class="h-4 w-4" />
				Add Project
			</Button>
		</div>
	{:else}
		<ul class="grid gap-3 sm:grid-cols-2">
			{#each projects as project (project.id)}
				<li class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
					<p class="font-medium text-zinc-100">{project.name}</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>