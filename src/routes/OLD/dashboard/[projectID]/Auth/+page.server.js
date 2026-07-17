import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  if (!user) return { project: null };

  const { data: project, error } = await locals.supabase
    .from('Projects')
    .select('id, name, auth_email, auth_google, auth_magic_link')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // PGRST116 just means "no rows" (new user, no projects yet) — that's the
  // normal empty state, not a failure. Anything else gets logged so it
  // doesn't fail silently.
  if (error && error.code !== 'PGRST116') {
    console.error('Error loading project for Auth page:', error.message);
  }

  return { project };
};

export const actions = {
  updateProviders: async ({ request, locals }) => {
    const formData = await request.formData();
    const projectId = formData.get('projectId');
    
    // Checkbox elements return "on" if checked, null if empty
    const authEmail = formData.get('authEmail') === 'on';
    const authGoogle = formData.get('authGoogle') === 'on';
    const authMagicLink = formData.get('authMagicLink') === 'on';

    const { user } = await locals.safeGetSession();
    if (!user) return fail(401, { error: 'Unauthorized' });

    const { error } = await locals.supabase
      .from('Projects')
      .update({
        auth_email: authEmail,
        auth_google: authGoogle,
        auth_magic_link: authMagicLink
      })
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating auth providers:', error.message);
      return fail(500, { error: 'Failed to update auth providers.' });
    }

    return { success: true };
  }
};