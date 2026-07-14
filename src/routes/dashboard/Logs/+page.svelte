<script>
    const logs = [
        { timestamp: '2026-07-14 14:10:23', event: 'API Key Created', status: 'success', user: 'abeni@company.com' },
        { timestamp: '2026-07-14 13:42:01', event: 'Failed Login Attempt', status: 'warning', user: 'unknown_ip' },
        { timestamp: '2026-07-14 11:15:55', event: 'Database Backup Complete', status: 'success', user: 'system_cron' },
        { timestamp: '2026-07-14 09:02:12', event: 'User Role Changed', status: 'info', user: 'tunde@company.com' }
    ];
</script>

<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-100">Activity Logs</h1>
        <p class="text-sm text-zinc-400">Audit trail of all administrative and security events on your application.</p>
    </div>

    <!-- Logs Container -->
    <div class="rounded-xl border border-zinc-800 bg-[#0c0c0e] p-2 shadow-sm">
        <div class="divide-y divide-zinc-800/50">
            {#each logs as log}
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 text-xs font-mono">
                    <!-- Timestamp -->
                    <span class="text-zinc-500 whitespace-nowrap">{log.timestamp}</span>
                    
                    <!-- Status Badge -->
                    <div class="w-16 shrink-0">
                        {#if log.status === 'success'}
                            <span class="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-3xs font-semibold text-emerald-400 uppercase tracking-wide">Success</span>
                        {:else}
                            <span class="inline-flex items-center rounded-md bg-rose-500/10 px-1.5 py-0.5 text-3xs font-semibold text-rose-400 uppercase tracking-wide">Warning</span>
                        {/if}
                    </div>

                    <!-- Event Name -->
                    <span class="text-zinc-200 font-medium flex-1">{log.event}</span>
                    
                    <!-- Actor -->
                    <span class="text-zinc-500 sm:text-right">by {log.user}</span>
                </div>
            {/each}
        </div>
    </div>
</div>