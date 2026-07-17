import { error } from '@sveltejs/kit';

// Every route under /dashboard/[project]/** inherits this load. It resolves
// the :project URL segment to a real row AND checks ownership in the same
// query — no separate "is this mine?" check needed anywhere downstream.
// Anything that fails (wrong id, someone else's project, malformed id)
// becomes a 404 rather than leaking whether the id exists.
//
// The parent dashboard/+layout.server.js already redirects to /login if
// there's no session, and ancestor loads always run before this one, so
// `user` is guaranteed to be set by the time we get here.
export const load = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession();

	const { data: project, error: dbError } = await locals.supabase
		.from('Projects')
		.select('*')
		.eq('id', params.project)
		.eq('user_id', user.id)
		.single();

	if (dbError || !project) {
		throw error(404, 'Project not found');
	}

	return { project };
};
