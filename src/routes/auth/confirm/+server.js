import { redirect } from '@sveltejs/kit';

// Handles the link from Supabase's password-recovery (and other OTP-based)
// emails. Verifying by token_hash here — rather than letting Supabase's own
// /auth/v1/verify redirect straight back with a PKCE `code` — means the
// link works even when it's opened on a different device/browser than the
// one that requested it, which is the common case for "forgot password"
// emails opened from a phone.
export const GET = async ({ url, locals }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const next = url.searchParams.get('next') ?? '/';

	if (token_hash && type) {
		const { error } = await locals.supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			throw redirect(303, next);
		}
	}

	throw redirect(303, '/login?error=invalid_reset_link');
};
