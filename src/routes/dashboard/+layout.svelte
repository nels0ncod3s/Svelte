<script>
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { enhance } from "$app/forms";
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	// `data.user` and `data.projects` come from +layout.server.js, which
	// already redirects to /login if there's no session.
	let { data, children } = $props();

	function handleWindowClick(e) {
		if (!e.target.closest("[data-project-switcher]")) {
			dashboard.closeSwitcher();
		}
	}

	// `$page.data.project` is populated whenever the current route is under
	// /dashboard/[project]/** — it comes from that segment's
	// +layout.server.js. Reading it off $page (rather than looking it up in
	// dashboard.projects) keeps the breadcrumb correct even right after a
	// hard refresh, before the grid page has ever run in this session.
	let activeProject = $derived($page.data.project ?? null);

	let routeSegments = $derived($page.route.id?.split("/").filter(Boolean) ?? []);
	let pageSegment = $derived(routeSegments.at(-1) === "[project]" ? null : routeSegments.at(-1));

	/** Single consolidated breadcrumb trail: [ProjectName] or [ProjectName, PageName]. */
	let crumbs = $derived(
		activeProject ? (pageSegment ? [activeProject.name, pageSegment] : [activeProject.name]) : []
	);

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
				// If the project being deleted is the one currently open,
				// navigate back to the grid — its route would otherwise 404.
				const wasActive = $page.params.project === result.data.deletedId;
				dashboard.removeProject(result.data.deletedId);
				if (wasActive) goto("/dashboard");
			}
			await update();
		};
	}

	function handleAddDialogOpenChange(open) {
		if (open) {
			dashboard.dialogOpen = true;
		} else {
			dashboard.closeAddDialog();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<Sidebar.Provider>
	<AppSidebar userName={data.user.name} userEmail={data.user.email} avatarUrl={data.user.avatarUrl} />

	<main class="flex-1 min-w-0 bg-[#0a0a0b] min-h-screen text-zinc-100">

		<!-- Sticky header — single consolidated breadcrumb bar. -->
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
												aria-selected={$page.params.project === project.id}
												onclick={() => dashboard.switchProject(project)}
												class="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-zinc-200 hover:bg-zinc-800 transition-colors {$page.params.project === project.id ? 'text-white font-medium' : ''}"
											>
												{project.name}
												{#if $page.params.project === project.id}
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
							     rendered below in this same layout. -->
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

				<!-- Rest of the breadcrumb: active project name, then the current
				     page segment (App / Auth / Users / Logs / Settings) if any.
				     Driven entirely by the URL via $page, not client-only state. -->
				{#each crumbs as crumb, i}
					<ChevronRight class="h-3.5 w-3.5 text-zinc-700 shrink-0" aria-hidden="true" />
					{#if i === crumbs.length - 1}
						<span class="text-zinc-100 font-medium truncate">{crumb}</span>
					{:else}
						<a
							href={`/dashboard/${activeProject.id}`}
							class="text-zinc-500 hover:text-zinc-300 transition-colors truncate"
						>
							{crumb}
						</a>
					{/if}
				{/each}
			</nav>
		</header>

		<div class="p-4 sm:p-6">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>

<!-- Add Project modal — lives here (not on the grid page) so it can be
     opened from anywhere in the dashboard: the header switcher, the grid's
     empty state, or a disabled sidebar item when there's no active project.
     Because this is rendered on every /dashboard/** route, the form posts
     to an explicit absolute action path rather than the relative "?/create"
     — otherwise it would try to hit a `create` action on whatever child
     route happens to be active. Persists via the `create` Form Action in
     dashboard/+page.server.js. -->
<Dialog.Root open={dashboard.dialogOpen} onOpenChange={handleAddDialogOpenChange}>
	<Dialog.Content class="sm:max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Create a new project</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				Give your project a name and framework. You can change this later.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="/dashboard?/create" use:enhance={submitCreate} class="grid gap-4 pt-2">
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

<!-- Delete confirmation — same reasoning as above: lives in the layout so
     it can be triggered from the grid's card menu OR a project's own
     overview page. Persists via the `delete` Form Action, which re-checks
     the confirmation text server-side too. -->
<Dialog.Root open={dashboard.deleteTarget !== null} onOpenChange={(open) => !open && dashboard.cancelDelete()}>
	<Dialog.Content class="sm:max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Delete project</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				This permanently deletes "{dashboard.deleteTarget?.name}". This can't be undone.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="/dashboard?/delete" use:enhance={submitDelete} class="contents">
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
