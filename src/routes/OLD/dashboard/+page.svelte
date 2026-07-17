<script>
	import { enhance } from "$app/forms";
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

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
	import Users from "@lucide/svelte/icons/users";
	import Monitor from "@lucide/svelte/icons/monitor";
	import ShieldCheck from "@lucide/svelte/icons/shield-check";
	import UserPlus from "@lucide/svelte/icons/user-plus";
	import Minus from "@lucide/svelte/icons/minus";
	import KeyRound from "@lucide/svelte/icons/key-round";
	import Github from "$lib/Icons/github-mark.svelte";
	import Google from "$lib/Icons/google.svelte";

	// The breadcrumb lives entirely in +layout.svelte. This page only owns
	// the grid/workspace content and the Add/Delete modals — all UI state
	// comes from the shared `dashboard` store so the layout's header can
	// trigger them too. Project data itself comes from +page.server.js's
	// `load`, and is written back through its `create`/`delete` actions.
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

	// --- Workspace overview (mock data, same as Logs/Users/Settings — no
	// real metrics backend exists yet) ---
	const workspaceStats = [
		{ label: "Total Users", value: "0", delta: "0%", icon: Users },
		{ label: "Active Sessions", value: "0", delta: "0%", icon: Monitor },
		{ label: "Verification Rate", value: "0%", delta: "0%", icon: ShieldCheck },
		{ label: "Signups Today", value: "0", delta: "0%", icon: UserPlus }
	];

	const quickActions = [
		{ label: "Create API key", icon: KeyRound, disabled: false },
		{ label: "Configure Google", icon: Google, disabled: false },
		{ label: "Configure GitHub", icon: Github, disabled: false },
		{ label: "Invite teammate", icon: UserPlus, disabled: true }
	];

	function handleAddDialogOpenChange(open) {
		if (open) {
			dashboard.dialogOpen = true;
		} else {
			dashboard.closeAddDialog();
		}
	}

	/** Submits the "Create project" form to the `create` action. */
	function submitCreate() {
		return async ({ result, update }) => {
			if (result.type === "success" && result.data?.project) {
				dashboard.addProject(result.data.project);
			} else if (result.type === "failure" && result.data?.field === "name") {
				dashboard.nameError = result.data.message;
			}
			// Don't reset form fields on failure so the user doesn't lose their input.
			await update({ reset: result.type === "success" });
		};
	}

	/** Submits the "Delete project" confirmation form to the `delete` action. */
	function submitDelete() {
		return async ({ result, update }) => {
			if (result.type === "success" && result.data?.deletedId) {
				dashboard.removeProject(result.data.deletedId);
			}
			await update();
		};
	}
</script>

<!-- The sidebar, Sidebar.Provider, and Sidebar.Trigger, and the breadcrumb
     are already provided by +layout.svelte — don't repeat them here. -->

<div class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8">
	{#if dashboard.view === "grid"}
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
	{:else if dashboard.view === "workspace" && dashboard.activeProject}
		<!-- Project workspace -->
		<div class="flex items-center justify-between mb-6">
			<button
				class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
				onclick={() => dashboard.goToGrid()}
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
						onclick={() => (dashboard.settingsOpen = true)}
					>
						<Settings class="h-4 w-4" />
						Project settings
					</DropdownMenu.Item>
					<DropdownMenu.Separator class="bg-zinc-800" />
					<DropdownMenu.Item
						class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
						onclick={() => dashboard.requestDelete(dashboard.activeProject)}
					>
						<Trash2 class="h-4 w-4" />
						Delete project
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		{#if dashboard.settingsOpen}
			<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
				<h2 class="text-base font-semibold text-zinc-100 mb-1">Settings</h2>
				<p class="text-sm text-zinc-500 mb-4">Manage settings for {dashboard.activeProject.name}.</p>
				<div class="grid gap-2 max-w-sm">
					<Label for="settings-project-name" class="text-zinc-300">Project name</Label>
					<Input
						id="settings-project-name"
						value={dashboard.activeProject.name}
						class="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-violet-500"
					/>
					<!-- NOTE: renaming isn't wired to a server action yet — this
					     field is read-only in effect until an `update` action is
					     added to +page.server.js, following the same pattern as
					     `create`/`delete` below. -->
				</div>
			</div>
		{:else}
			<div class="space-y-6">
				<div>
					<h2 class="text-base font-semibold text-zinc-100">{dashboard.activeProject.name}</h2>
					<p class="text-sm text-zinc-500 mt-1">What's happening across {dashboard.activeProject.name} today.</p>
				</div>

				<!-- Stat cards -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
					{#each workspaceStats as stat (stat.label)}
						<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
							<div class="flex items-start justify-between gap-2">
								<span class="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-zinc-500 leading-tight">{stat.label}</span>
								<div class="h-7 w-7 shrink-0 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
									<stat.icon class="h-3.5 w-3.5 text-violet-400" />
								</div>
							</div>
							<div class="mt-3 flex items-end justify-between gap-2">
								<span class="text-2xl sm:text-3xl font-bold text-zinc-100">{stat.value}</span>
								<span class="flex items-center gap-0.5 text-xs font-medium text-zinc-500 whitespace-nowrap">
									<Minus class="h-3 w-3 shrink-0" />
									{stat.delta}
								</span>
							</div>
						</div>
					{/each}
				</div>

				<!-- Quick actions -->
				<div>
					<h3 class="text-sm font-semibold text-zinc-300 mb-3">Quick actions</h3>
					<div class="grid sm:grid-cols-2 gap-2.5">
						{#each quickActions as action (action.label)}
							<button
								type="button"
								disabled={action.disabled}
								class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left text-sm font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors disabled:opacity-40 disabled:pointer-events-none"
							>
								<action.icon class="h-4 w-4 text-zinc-400 shrink-0" />
								{action.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<!-- Add Project modal — can be opened from the toolbar/empty-state buttons
     above OR from "Add New Project" in the layout's header dropdown, since
     `dialogOpen` lives on the shared store. Persists via the `create`
     Form Action in +page.server.js. -->
<Dialog.Root open={dashboard.dialogOpen} onOpenChange={handleAddDialogOpenChange}>
	<Dialog.Content class="sm:max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Create a new project</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				Give your project a name and framework. You can change this later.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/create" use:enhance={submitCreate} class="grid gap-4 pt-2">
			<div class="grid gap-2">
				<Label for="project-name" class="text-zinc-300">Project name</Label>
				<Input
					id="project-name"
					name="name"
					placeholder="e.g. Johnsnow"
					bind:value={dashboard.newProjectName}
					oninput={() => (dashboard.nameError = "")}
					autofocus
					required
					aria-invalid={dashboard.nameError ? "true" : undefined}
					class="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 {dashboard.nameError ? 'border-red-500/70 focus-visible:ring-red-500' : ''}"
				/>
				{#if dashboard.nameError}
					<p class="text-xs text-red-400">{dashboard.nameError}</p>
				{/if}
			</div>

			<div class="grid gap-2">
				<Label for="project-framework" class="text-zinc-300">Framework</Label>
				<select
					id="project-framework"
					name="framework"
					bind:value={dashboard.newProjectFramework}
					class="w-full rounded-md border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
				>
					<option value="" disabled>Select a framework</option>
					<option value="react">React</option>
					<option value="nextjs">Next.js</option>
					<option value="python">Python</option>
					<option value="go">Go (Golang)</option>
				</select>
			</div>

			<Dialog.Footer class="mt-2 bg-zinc-950 border-zinc-800/60">
				<Button
					type="button"
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
					onclick={() => dashboard.closeAddDialog()}
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

<!-- Delete confirmation — requires typing the exact project name before
     the Delete button becomes enabled. Persists via the `delete` Form
     Action, which re-checks the confirmation text server-side too. -->
<Dialog.Root open={dashboard.deleteTarget !== null} onOpenChange={(open) => !open && dashboard.cancelDelete()}>
	<Dialog.Content class="sm:max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Delete project</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				This permanently deletes "{dashboard.deleteTarget?.name}". This can't be undone.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/delete" use:enhance={submitDelete} class="contents">
			<input type="hidden" name="id" value={dashboard.deleteTarget?.id ?? ""} />
			<input type="hidden" name="projectName" value={dashboard.deleteTarget?.name ?? ""} />

			<div class="grid gap-2 pt-2">
				<Label for="delete-confirm" class="text-zinc-300">
					To confirm, type <span class="font-mono text-zinc-100">"{dashboard.deleteTarget?.name}"</span> below
				</Label>
				<Input
					id="delete-confirm"
					name="confirmName"
					bind:value={dashboard.deleteConfirmText}
					autocomplete="off"
					spellcheck="false"
					placeholder={dashboard.deleteTarget?.name ?? ""}
					class="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
				/>
			</div>

			<Dialog.Footer class="mt-2 bg-zinc-950 border-zinc-800/60">
				<Button
					type="button"
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
					onclick={() => dashboard.cancelDelete()}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={!dashboard.canDelete}
					class="bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 disabled:pointer-events-none"
				>
					Delete
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>