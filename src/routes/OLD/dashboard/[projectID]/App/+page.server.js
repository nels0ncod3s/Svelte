import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  if (!user) return { project: null };

  // Fetch the latest project to treat as the active workspace
  const { data: project, error } = await locals.supabase
    .from('Projects')
    .select('id, name, client_secret, redirect_uris')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // PGRST116 just means "no rows" (new user, no projects yet) — that's the
  // normal empty state, not a failure. Anything else (bad table/column name,
  // connection issue, etc.) gets logged so it doesn't fail silently.
  if (error && error.code !== 'PGRST116') {
    console.error('Error loading project for App page:', error.message);
  }

  return { project };
};

export const actions = {
  updateCredentials: async ({ request, locals }) => {
    const formData = await request.formData();
    const projectId = formData.get('projectId');
    const redirectUris = formData.get('redirectUris');

    const { user } = await locals.safeGetSession();
    if (!user) return fail(401, { error: 'Unauthorized' });

    const { error } = await locals.supabase
      .from('Projects')
      .update({ redirect_uris: redirectUris })
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating credentials:', error.message);
      return fail(500, { error: 'Failed to update credentials.' });
    }

    return { success: true };
  }
};