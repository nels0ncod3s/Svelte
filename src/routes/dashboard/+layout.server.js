import { redirect } from '@sveltejs/kit';

// Runs on every navigation into this layout's subtree, on the server.
// safeGetSession() (from hooks.server.js) verifies the JWT against Supabase
// Auth rather than trusting the cookie, so this is safe to gate access with.
export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: profile, error } = await locals.supabase
		.from('profiles')
		.select('display_name, avatar_url')
		.eq('id', user.id)
		.single();

	// PGRST116 = no profile row yet — normal for a user who hasn't visited
	// Account settings, not a failure.
	if (error && error.code !== 'PGRST116') {
		console.error('Error loading profile for sidebar:', error.message);
	}

	return {
		user: {
			name:
				profile?.display_name ||
				user.user_metadata?.full_name ||
				user.email?.split('@')[0] ||
				'User',
			email: user.email || '',
			avatarUrl: profile?.avatar_url || ''
		}
	};
};