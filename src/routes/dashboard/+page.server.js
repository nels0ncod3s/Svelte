import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: projects, error } = await locals.supabase
		.from('Projects')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error loading projects:', error.message);
		return { projects: [] };
	}

	return { projects };
};

export const actions = {
	// Creates a project for the logged-in user. Called from the "Add Project"
	// form via use:enhance in +page.svelte.
	create: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'You must be logged in.' });

		const formData = await request.formData();
		const name = (formData.get('name') ?? '').toString().trim();
		const framework = formData.get('framework')?.toString().trim() || null;

		if (!name) {
			return fail(400, { field: 'name', message: 'Project name is required.' });
		}

		const { data: project, error } = await locals.supabase
			.from('Projects')
			.insert({ name, framework, user_id: user.id })
			.select()
			.single();

		if (error) {
			// Postgres unique_violation — caught by the DB's unique index on
			// (user_id, lower(name)), so this is authoritative, not just a
			// client-side guess.
			if (error.code === '23505') {
				return fail(400, {
					field: 'name',
					message: `A project named "${name}" already exists.`
				});
			}
			console.error('Error creating project:', error.message);
			return fail(500, { message: 'Could not create project. Please try again.' });
		}

		return { success: true, project };
	},

	// Deletes a project. The confirm-by-typing-the-name check is re-verified
	// here server-side, not just trusted from the client.
	delete: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'You must be logged in.' });

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const projectName = formData.get('projectName')?.toString() ?? '';
		const confirmName = formData.get('confirmName')?.toString() ?? '';

		if (!id) return fail(400, { message: 'Missing project id.' });
		if (confirmName !== projectName) {
			return fail(400, { message: "Confirmation text doesn't match the project name." });
		}

		const { error } = await locals.supabase
			.from('Projects')
			.delete()
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			console.error('Error deleting project:', error.message);
			return fail(500, { message: 'Could not delete project. Please try again.' });
		}

		return { success: true, deletedId: id };
	}
};
