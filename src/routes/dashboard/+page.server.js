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

		// Generated once per project so the App integration page has a real
		// secret to display immediately — nothing else in the app sets this.
		const clientSecret = `fl_secret_${crypto.randomUUID().replace(/-/g, '')}`;

		const { data: project, error } = await locals.supabase
			.from('Projects')
			.insert({ name, framework, user_id: user.id, client_secret: clientSecret })
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

		const { data: deletedRows, error } = await locals.supabase
			.from('Projects')
			.delete()
			.eq('id', id)
			.eq('user_id', user.id)
			.select();

		if (!error && (!deletedRows || deletedRows.length === 0)) {
			// Supabase doesn't error when RLS silently blocks a delete — it
			// just matches 0 rows. Without this check the UI removes the
			// project optimistically and it reappears on the next reload.
			console.error('Delete matched 0 rows — check the delete RLS policy on Projects.');
			return fail(403, {
				message: 'Could not delete this project. Please try again or contact support.'
			});
		}

		if (error) {
			console.error('Error deleting project:', error.message);
			return fail(500, { message: 'Could not delete project. Please try again.' });
		}

		return { success: true, deletedId: id };
	}
};
