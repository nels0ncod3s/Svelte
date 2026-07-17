import { fail, redirect } from '@sveltejs/kit';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB, matches the UI copy

export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) throw redirect(303, '/login');

	const { data: profile, error } = await locals.supabase
		.from('profiles')
		.select('id, display_name, avatar_url, updated_at')
		.eq('id', user.id)
		.single();

	// PGRST116 = no row yet (first time this user has hit the Account page).
	// That's expected, not a failure — the form just renders with blank fields.
	if (error && error.code !== 'PGRST116') {
		console.error('Error loading profile:', error.message);
	}

	return {
		profile: profile ?? null,
		userEmail: user.email ?? ''
	};
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const displayName = (formData.get('displayName') ?? '').toString().trim();
		const currentAvatarUrl = (formData.get('currentAvatarUrl') ?? '').toString();
		const avatarFile = formData.get('avatarFile');

		if (!displayName) {
			return fail(400, { error: 'Display name is required.' });
		}

		let avatarUrl = currentAvatarUrl || null;

		// Only touches storage if the user actually picked a new file —
		// an empty <input type="file"> still shows up as a File with size 0.
		if (avatarFile instanceof File && avatarFile.size > 0) {
			if (!avatarFile.type.startsWith('image/')) {
				return fail(400, { error: 'Avatar must be an image file.' });
			}
			if (avatarFile.size > MAX_AVATAR_BYTES) {
				return fail(400, { error: 'Avatar must be under 2MB.' });
			}

			const ext = avatarFile.name.split('.').pop() || 'jpg';
			// Fixed filename per user (not per-upload) so re-uploading replaces
			// the old avatar instead of accumulating orphaned files in storage.
			const path = `${user.id}/avatar.${ext}`;

			const { error: uploadError } = await locals.supabase.storage
				.from('avatars')
				.upload(path, avatarFile, { upsert: true });

			if (uploadError) {
				console.error('Error uploading avatar:', uploadError.message);
				return fail(500, { error: 'Could not upload avatar. Please try again.' });
			}

			const {
				data: { publicUrl }
			} = locals.supabase.storage.from('avatars').getPublicUrl(path);

			// Cache-bust so the browser doesn't keep showing the old image
			// under the same URL after an overwrite.
			avatarUrl = `${publicUrl}?t=${Date.now()}`;
		}

		const { error: upsertError } = await locals.supabase.from('profiles').upsert({
			id: user.id,
			display_name: displayName,
			avatar_url: avatarUrl,
			updated_at: new Date().toISOString()
		});

		if (upsertError) {
			console.error('Error saving profile:', upsertError.message);
			return fail(500, { error: 'Could not save profile. Please try again.' });
		}

		return { success: true };
	}
};