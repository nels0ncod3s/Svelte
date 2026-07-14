# Dashboard UI & UX Improvements

Please implement the following updates, fixes, and feature additions to the dashboard application. The tasks are categorized by functionality for easier execution.

---

## 1. Navigation & Routing

### 📍 Dynamic Breadcrumbs
* **Requirement:** Add a dynamic breadcrumb navigation bar in the top header, positioned right next to the collapsible sidebar icon.
* **Behavior:** Breadcrumbs should only appear when necessary (e.g., when the user is deep in nested pages like `Dashboard > Projects > [Project Name] > Settings`). If the user is on the root Dashboard home, the breadcrumb should be hidden or simplified.

### ➡️ Post-Creation Redirect
* **Requirement:** Immediately after a user successfully creates a new project, automatically redirect them to that specific new project's workspace page.

---

## 2. Layout, Styling, & UI Adjustments

### 📐 Main Content Spacing
* **Issue:** There is currently too much empty whitespace/padding on the left side of the main content area.
* **Fix:** Reduce the left margin/padding of the main content container relative to the sidebar to make the layout feel more balanced and compact.

### 🌗 "Add Project" Dark Mode
* **Requirement:** Update the "Add Project" view (modal or page) to support and properly display in dark mode, matching the rest of the dark theme design system.

---

## 3. Project Dashboard & Management Flow

### 🗂️ "My Projects" Dashboard Grid
* **Requirement:** Once a user navigates away from an active project page back to the main area, display a dashboard featuring all of their projects in a clean **card format**.
* **Project Card Features:**
  * Each project card must display a **3-dot menu icon (ellipsis)** in the top-right corner.
  * Clicking this 3-dot icon should open a dropdown containing an option to enter **Project Settings**.

### 🗑️ Project Deletion (Bug Fix)
* **Issue:** Users are currently unable to delete projects once they are created.
* **Fix:** Implement a delete project feature (ideally accessible from the new 3-dot settings menu on the project card) to allow users to permanently remove projects.

---

## 4. General Polish
* Walk through the main user flows to identify and fix any residual UI layout shifts, broken alignment, or styling inconsistencies.

## 5. MOBILE
- The top where 'dashboard' is written should be where the breadcrumming should take place