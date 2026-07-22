import { fail } from '@sveltejs/kit';

// No load() needed here — data.project already arrives from
// dashboard/[project]/+layout.server.js above this route.
export const actions = {
	updateCredentials: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const redirectUris = formData.get('redirectUris');

		const { error } = await locals.supabase
			.from('Projects')
			.update({ redirect_uris: redirectUris })
			.eq('id', params.project) // project id now comes from the URL
			.eq('user_id', user.id);

		if (error) {
			console.error('Error updating credentials:', error.message);
			return fail(500, { error: 'Failed to update credentials.' });
		}

		return { success: true };
	}
};
