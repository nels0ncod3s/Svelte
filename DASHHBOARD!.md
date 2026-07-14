# UI/UX & Functional Updates: Project Management Modal and Navigation

Please implement the following updates, styling fixes, and feature enhancements to the project dashboard.

---

## 1. UI & Styling Fixes (Dark Mode Consistency)
*   **Issue:** Both the **"Add Project"** and **"Delete Project"** modals currently display a light gray bottom section (likely a default modal footer background).
*   **Fix:** Style the entire modal container—including the footer/bottom area—to be completely dark. Ensure a seamless, fully dark-mode compliant UI without any contrasting gray panels.

---

## 2. Navigation & Breadcrumb Refactoring
*   **Header Dropdown Alignment:**
    *   Locate the project selection dropdown at the very top of the dashboard screen.
    *   The "Add Project" option within this dropdown must trigger the existing "Add Project" modal state/toggle instead of routing elsewhere or using a different mechanism.
*   **Breadcrumb Restructuring:**
    *   **Consolidation:** Move the entire breadcrumb navigation to the very top of the dashboard, inline with where the current project selector sits.
    *   **Cleanup:** Remove any other duplicate or secondary dashboard breadcrumb elements from the rest of the page to keep the interface clean and unified.

---

## 3. "Add Project" Modal Enhancements
*   **Framework Selector:** 
    *   Inside the "Add Project" modal, add a new dropdown field prompting the user to select their project's framework.
    *   The dropdown must include the following options:
        *   React
        *   Next.js
        *   Python
        *   Go (Golang)

---

## 4. "Delete Project" Modal Safety Validation
To prevent accidental, irreversible deletions, implement a strict confirmation step:
*   **Project Name Display:** Clearly display the exact name of the project the user is attempting to delete inside the modal (e.g., *"To confirm, type 'My-Awesome-App' below"*). Do not make the user guess or remember it.
*   **Input Validation:** 
    *   Add a text input field for the user to type the project name.
    *   The "Delete" action button must be **disabled by default**.
    *   Enable the "Delete" button **only** when the user's input matches the project's name exactly (case-sensitive, word-for-word).