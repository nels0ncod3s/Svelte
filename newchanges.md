# SvelteKit + Supabase Dashboard Improvements & Bug Fixes

I am building a SvelteKit application integrated with Supabase and need help resolving three specific issues to make my dashboard and profile settings fully functional. 

Here are the details of what we need to address:

---

## 1. Eliminate the "Flash of Empty State" on Dashboard Reload
* **The Issue:** Whenever I reload the dashboard page, it briefly displays the "empty state" UI before the actual project data from Supabase finishes loading and pops onto the screen.
* **Goal:** I want a seamless loading experience. If SvelteKit is loading data on the server side, we should utilize proper loading states or SSR (Server-Side Rendering) so the server returns the complete HTML immediately, or implement a smooth skeleton/loading transition instead of flashing the empty state.

---

## 2. Implement Project Deletion
* **The Issue:** I currently cannot delete projects from my dashboard and my Supabase database.
* **Goal:** We need to implement a complete deletion flow. This includes:
  * A "Delete Project" button/action in the UI.
  * A secure server-side SvelteKit action in `+page.server.js` that handles the `.delete()` request in Supabase.
  * Confirming that my Supabase Row Level Security (RLS) policies allow authenticated users to safely delete their own projects.

---

## 3. Connect Profile settings (Display Name & PFP) to the Dashboard
* **The Context:** I am building an Account Settings page so users can upload a profile picture (PFP) and change their display name. The necessary Supabase database tables (`profiles`) and storage buckets (`avatars`) have already been created.
* **Goal:** Connect everything together. I need:
  * The frontend settings form to handle image uploads and text updates properly.
  * The server actions to upload the image to Supabase Storage, retrieve the public URL, and `upsert` the user profile details.
  * The root layout to load this profile data dynamically so the user's updated name and avatar instantly sync and display across the sidebar and dashboard.