// lib/stores/dashboard.svelte.js
//
// Shared UI state for the dashboard: the header's project list + switcher
// dropdown, and the Add/Delete Project modals (both rendered once in
// dashboard/+layout.svelte so they're reachable from any dashboard route).
//
// "Which project is active" is NOT stored here — it lives in the URL
// (/dashboard/[project]/...), so it survives refreshes and deep links.
// Read it via `$page.params.project` / `$page.data.project` in components.
//
// Persistence lives in dashboard/+page.server.js's `create`/`delete` Form
// Actions. This store does NOT talk to Supabase directly.

import { goto } from "$app/navigation";

class DashboardStore {
	projects = $state([]);

	// --- Header project switcher dropdown ---------------------------------
	switcherOpen = $state(false);

	// --- Add Project modal --------------------------------------------------
	dialogOpen = $state(false);
	newProjectName = $state("");
	newProjectFramework = $state("");
	nameError = $state("");

	// --- Delete Project modal -----------------------------------------------
	deleteTarget = $state(null);
	deleteConfirmText = $state("");

	get canDelete() {
		return this.deleteTarget !== null && this.deleteConfirmText === this.deleteTarget.name;
	}

	/** Cheap client-side hint only — the DB's unique index is the real check. */
	isNameTaken(name) {
		const normalized = name.trim().toLowerCase();
		return this.projects.some((p) => p.name.toLowerCase() === normalized);
	}

	// --- Sync from server ------------------------------------------------------
	/** Called from +page.svelte (and now +layout.svelte's parent data) with the load result. */
	setProjects(projects) {
		this.projects = projects ?? [];
	}

	// --- Add Project ---------------------------------------------------------
	openAddDialog() {
		this.dialogOpen = true;
		this.switcherOpen = false;
	}

	closeAddDialog() {
		this.dialogOpen = false;
		this.nameError = "";
		this.newProjectName = "";
		this.newProjectFramework = "";
	}

	/** Called after the `create` Form Action returns the saved project. */
	addProject(project) {
		this.projects = [...this.projects, project];
		this.closeAddDialog();

		// Post-creation redirect: land directly on the new project's workspace.
		goto(`/dashboard/${project.id}`);
	}

	// --- Navigation ------------------------------------------------------------
	openProject(project) {
		this.switcherOpen = false;
		goto(`/dashboard/${project.id}`);
	}

	openProjectSettings(project) {
		this.switcherOpen = false;
		goto(`/dashboard/${project.id}/Settings`);
	}

	/** Used by the header project switcher — same effect as openProject. */
	switchProject(project) {
		this.openProject(project);
	}

	toggleSwitcher() {
		this.switcherOpen = !this.switcherOpen;
	}

	closeSwitcher() {
		this.switcherOpen = false;
	}

	// --- Delete Project --------------------------------------------------------
	requestDelete(project) {
		this.deleteTarget = project;
		this.deleteConfirmText = "";
		this.switcherOpen = false;
	}

	cancelDelete() {
		this.deleteTarget = null;
		this.deleteConfirmText = "";
	}

	/** Called after the `delete` Form Action confirms the row was removed. */
	removeProject(id) {
		this.projects = this.projects.filter((p) => p.id !== id);
		this.deleteTarget = null;
		this.deleteConfirmText = "";
	}
}

export const dashboard = new DashboardStore();
