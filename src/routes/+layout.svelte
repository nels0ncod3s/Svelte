<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
<CookieConsent />
<Toaster richColors position="top-center" />