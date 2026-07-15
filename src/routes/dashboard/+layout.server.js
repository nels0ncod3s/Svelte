import { redirect } from '@sveltejs/kit';

// Runs on every navigation into this layout's subtree, on the server.
// safeGetSession() (from hooks.server.js) verifies the JWT against Supabase
// Auth rather than trusting the cookie, so this is safe to gate access with.
export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	return {
		user: {
			name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
			email: user.email || ''
		}
	};
};
