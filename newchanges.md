# Developer Request: Implement Project Persistence in SvelteKit with Supabase

## Objective

I want to allow users to create and save projects to a Supabase database. When they log back in or refresh their dashboard, their saved projects should load and display dynamically.

## Tech Stack

- **Framework:** Svelte / SvelteKit (using JavaScript, no TypeScript)
- **Database & Auth:** Supabase

---

## What I Need Help With

1. **Database Schema & Policies:**
   - Best practices for setting up a `Projects` table.
   - Row Level Security (RLS) policies to ensure users can only create, view, and manage their own projects.

2. **Database Write (Saving Projects):**
   - A SvelteKit server-side action (using Form Actions in `+page.server.js`) to handle the database insert securely.
   - A Svelte frontend form (`+page.svelte`) utilizing SvelteKit's progressive enhancement (`use:enhance`) to submit the new project.

3. **Database Read (Loading & Persisting Projects):**
   - How to set up a server-side load function (`+page.server.js`) to fetch the logged-in user's projects.
   - How to safely read and render this fetched data in the existing Svelte dashboard UI so that it persists across page reloads and new login sessions.
