<script>
 import * as Empty from "$lib/components/ui/empty/index.js";
 import CreditCard from "@lucide/svelte/icons/credit-card"
 import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- The sidebar, Sidebar.Provider, and Sidebar.Trigger
     are already provided by +layout.svelte — don't repeat them here. -->

<div class="max-w-3xl mx-auto">
	<h1 class="text-xl sm:text-2xl font-semibold text-zinc-100">Welcome Back, NAME</h1>

	<div class="mt-6">
		<Empty.Root class="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-10 sm:px-8 sm:py-14">
			<Empty.Header>
				<Empty.Media variant="icon">
					<CreditCard class="h-5 w-5 sm:h-6 sm:w-6" />
				</Empty.Media>
				<Empty.Title class="text-base sm:text-lg">No data</Empty.Title>
				<Empty.Description class="text-sm text-zinc-500">No data found</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button class="w-full sm:w-auto">Add data</Button>
			</Empty.Content>
		</Empty.Root>
	</div>
</div>