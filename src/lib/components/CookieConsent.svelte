<script>
	import { onMount } from "svelte";

	let visible = $state(false);
	const COOKIE_NAME = "cookie_consent";
	const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

	function readConsent() {
		const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);
		return match ? decodeURIComponent(match[1]) : null;
	}

	function writeConsent(value) {
		document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
	}

	onMount(() => {
		visible = readConsent() === null;
	});

	function accept() {
		writeConsent("accepted");
		visible = false;
		// Hook future non-essential scripts (analytics, etc.) up here.
	}

	function decline() {
		writeConsent("declined");
		visible = false;
		// See note below — nothing to actually disable today.
	}
</script>

{#if visible}
	<div
		role="dialog"
		aria-label="Cookie preferences"
		class="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-4 py-4 sm:px-6"
	>
		<div class="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-sm text-zinc-300">
				We use strictly necessary cookies to keep you signed in and your session secure. We don't use tracking or advertising cookies.
			</p>
			<div class="flex shrink-0 gap-2">
				<button onclick={decline} class="rounded-lg border border-zinc-800 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
					Decline
				</button>
				<button onclick={accept} class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">
					Accept
				</button>
			</div>
		</div>
	</div>
{/if}