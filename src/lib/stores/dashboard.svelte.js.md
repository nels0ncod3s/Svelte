// lib/stores/dashboard.svelte.js
//
// Single source of truth for the projects dashboard. Both +layout.svelte
// (header project switcher + consolidated breadcrumb) and the dashboard
// +page.svelte (grid/workspace + Add/Delete modals) import this same
// singleton, so an action taken in one place (e.g. "Add New Project" in
// the header dropdown) is reflected everywhere else instantly.
//
// NOTE: swap the in-memory `projects` array for real data fetching
// (e.g. load on mount from your API/Supabase and reassign `dashboard.projects`).

class DashboardStore {
	projects = $state([]);

	/** 'grid' = "My Projects" home. 'workspace' = inside a single project. */
	view = $state("grid");
	activeProjectId = $state(null);
	settingsOpen = $state(false);

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

	get activeProject() {
		return this.projects.find((p) => p.id === this.activeProjectId) ?? null;
	}

	/** Single consolidated breadcrumb trail, rendered only in the layout header. */
	get crumbs() {
		if (this.view === "workspace" && this.activeProject) {
			return this.settingsOpen
				? [this.activeProject.name, "Settings"]
				: [this.activeProject.name];
		}
		return [];
	}

	get canDelete() {
		return this.deleteTarget !== null && this.deleteConfirmText === this.deleteTarget.name;
	}

	isNameTaken(name) {
		const normalized = name.trim().toLowerCase();
		return this.projects.some((p) => p.name.toLowerCase() === normalized);
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

	/** Returns true on success, false if validation failed (name empty/taken). */
	createProject() {
		const name = this.newProjectName.trim();
		if (!name) return false;

		if (this.isNameTaken(name)) {
			this.nameError = `A project named "${name}" already exists.`;
			return false;
		}

		const project = {
			id: crypto.randomUUID(),
			name,
			framework: this.newProjectFramework || null
		};
		this.projects = [...this.projects, project];
		this.closeAddDialog();

		// Post-creation redirect: land directly on the new project's workspace.
		this.activeProjectId = project.id;
		this.settingsOpen = false;
		this.view = "workspace";
		return true;
	}

	// --- Navigation ------------------------------------------------------------
	goToGrid() {
		this.view = "grid";
		this.activeProjectId = null;
		this.settingsOpen = false;
	}

	openProject(project) {
		this.activeProjectId = project.id;
		this.settingsOpen = false;
		this.view = "workspace";
		this.switcherOpen = false;
	}

	openProjectSettings(project) {
		this.activeProjectId = project.id;
		this.settingsOpen = true;
		this.view = "workspace";
		this.switcherOpen = false;
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
	}

	cancelDelete() {
		this.deleteTarget = null;
		this.deleteConfirmText = "";
	}

	confirmDelete() {
		if (!this.canDelete) return;
		const id = this.deleteTarget.id;
		this.projects = this.projects.filter((p) => p.id !== id);
		if (this.activeProjectId === id) this.goToGrid();
		this.deleteTarget = null;
		this.deleteConfirmText = "";
	}
}

export const dashboard = new DashboardStore();