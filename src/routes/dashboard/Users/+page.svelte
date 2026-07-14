<script>
    let users = $state([
        { id: 1, name: 'Abeni Balogun', email: 'abeni@company.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Tunde Wey', email: 'tunde@company.com', role: 'Editor', status: 'Active' },
        { id: 3, name: 'Chidi Okafor', email: 'chidi@company.com', role: 'Viewer', status: 'Inactive' }
    ]);
</script>

<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Team Management</h1>
        <p class="text-sm text-zinc-400">Manage roles, permissions, and invite team members.</p>
    </div>

    <!-- Table Container -->
    <div class="overflow-hidden rounded-xl border border-zinc-800 bg-[#0c0c0e] shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-zinc-300">
                <thead class="border-b border-zinc-800 bg-[#0e0e11] text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Email</th>
                        <th class="px-6 py-4">Role</th>
                        <th class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-zinc-800/50">
                    {#each users as user}
                        <tr class="hover:bg-zinc-900/30 transition-colors">
                            <td class="whitespace-nowrap px-6 py-4 font-medium text-zinc-100">{user.name}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-zinc-400">{user.email}</td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <span class="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                                    {user.role}
                                </span>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4">
                                {#if user.status === 'Active'}
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                        Active
                                    </span>
                                {:else}
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                                        <span class="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
                                        Inactive
                                    </span>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>