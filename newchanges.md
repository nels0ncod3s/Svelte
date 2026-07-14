# Component Refactor: Navigation, Breadcrumbs, and Dark Mode Polish

## Context & Objectives
We are refactoring the main navigation and modal UI elements of our application. The goal is to correct the layout positioning of the breadcrumb component, convert a static link into an interactive project switcher dropdown, and overhaul the dark mode styling for specific management modals.

---

## Technical & UX Requirements

### 1. Breadcrumb Relocation & Restructuring
*   **Repositioning:** Move the breadcrumb component from its current position to the new designated area [**Developer Note:** *Replace this bracketed text with a brief description of the new location, e.g., "the top-left corner of the main content pane, directly below the global header"*].
*   **Format & Copy Update:** 
    *   Change the separator character from a greater-than sign (`>`) to a forward slash (`/`).
    *   Change the root/starter label from `"Dashboard"` to `"Projects"`.
    *   *Target Format:* `Projects / [Project Name]`

### 2. Project Switcher Dropdown
*   **Interactivity:** Transform the first element of the breadcrumb (`Projects`) into an interactive dropdown menu trigger.
*   **Menu Options:** The dropdown must contain:
    *   A list of existing projects to allow the user to switch contexts dynamically.
    *   An explicit, visually distinct option/button at the bottom labeled `"Add New Project"`.

### 3. "Add" & "Delete" Project Modals (Dark Mode Overhaul)
The current dark mode implementation for the **Add Project** and **Delete Project** modals needs a significant aesthetic and visual hierarchy upgrade. Please redesign them to meet modern dark UI standards:
*   **Backgrounds & Borders:** Shift away from harsh, muddy greys or pure blacks. Use a refined, deep slate or charcoal palette with subtle, low-contrast borders to define the modal containers.
*   **Typography:** Ensure crisp contrast with off-white primary text and muted silver/grey for secondary descriptions or helper text.
*   **Input Fields & Actions:** 
    *   Style input fields to fit cleanly into the dark theme (subtle focus rings, appropriate dark background fills).
    *   The "Delete" confirmation action should use an intentional, dark-mode-optimized destructive color (e.g., a rich, desaturated red that stands out without vibrating against the dark background).
    *   The "Add" confirmation action should use a clean accent/primary theme color with high legibility.

---

## Deliverables
Please provide the updated component code (HTML/JSX/CSS as applicable to your stack) handling these visual and behavioral updates. Ensure state management for the dropdown toggle is accounted for.