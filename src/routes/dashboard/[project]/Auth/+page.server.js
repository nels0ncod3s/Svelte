import { fail } from '@sveltejs/kit';

// No load() needed here — data.project already arrives from
// dashboard/[project]/+layout.server.js above this route.
export const actions = {
	updateProviders: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();

		// Checkbox elements return "on" if checked, null if empty
		const authEmail = formData.get('authEmail') === 'on';
		const authGoogle = formData.get('authGoogle') === 'on';
		const authMagicLink = formData.get('authMagicLink') === 'on';

		const { error } = await locals.supabase
			.from('Projects')
			.update({
				auth_email: authEmail,
				auth_google: authGoogle,
				auth_magic_link: authMagicLink
			})
			.eq('id', params.project) // project id now comes from the URL
			.eq('user_id', user.id);

		if (error) {
			console.error('Error updating auth providers:', error.message);
			return fail(500, { error: 'Failed to update auth providers.' });
		}

		return { success: true };
	}
};
