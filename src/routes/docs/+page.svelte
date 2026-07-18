<script>
	import MarketingNav from "$lib/components/marketing/MarketingNav.svelte";
	import MarketingFooter from "$lib/components/marketing/MarketingFooter.svelte";

	// Placeholder structure/copy — flesh each section out with real docs.
	const sections = [
		{ id: "quickstart", label: "Quickstart" },
		{ id: "installation", label: "Installation" },
		{ id: "authentication", label: "Authentication" },
		{ id: "webhooks", label: "Webhooks" },
		{ id: "api-reference", label: "API reference" }
	];
</script>

<svelte:head>
	<title>Docs — First Layer</title>
	<meta name="description" content="First Layer documentation." />
</svelte:head>

<div class="page">
	<div class="top-glow" aria-hidden="true"></div>

	<MarketingNav />

	<div class="docs-layout">
		<aside class="docs-nav">
			<span class="docs-nav-label">On this page</span>
			<nav>
				{#each sections as section (section.id)}
					<a href="#{section.id}">{section.label}</a>
				{/each}
			</nav>
		</aside>

		<main class="docs-content">
			<span class="badge">Documentation</span>
			<h1>Get started with <span class="grad">First Layer.</span></h1>
			<p class="lede">Everything you need to add multi-tenant auth to your app in minutes.</p>

			<section id="quickstart">
				<h2>Quickstart</h2>
				<p>Install the SDK for your framework and initialize a client with your project key.</p>
				<div class="code-window">
					<div class="flat-header">
						<span class="flat-filename">terminal</span>
					</div>
					<pre class="code-body">npm install @firstlayer/sdk</pre>
				</div>
				<p>Placeholder — this section should walk through creating a project, grabbing an API key, and making the first authenticated request.</p>
			</section>

			<section id="installation">
				<h2>Installation</h2>
				<p>Placeholder — per-framework setup steps (Svelte, React, Next.js, Python, FastAPI, Go) go here, each with a runnable snippet.</p>
			</section>

			<section id="authentication">
				<h2>Authentication</h2>
				<p>Placeholder — cover session creation, refresh, email/password, OAuth providers, magic links, and passkeys.</p>
			</section>

			<section id="webhooks">
				<h2>Webhooks</h2>
				<p>Placeholder — event types, payload shape, signature verification, and how to use the built-in webhook debugger.</p>
			</section>

			<section id="api-reference">
				<h2>API reference</h2>
				<p>Placeholder — link out to (or embed) the full REST/SDK reference once it exists.</p>
			</section>
		</main>
	</div>

	<MarketingFooter />
</div>

<style>
	:global(body) {
		margin: 0;
		background: #08080c;
		color: #f3f4f6;
		font-family: "Geist Variable", "Geist", system-ui, sans-serif;
	}
	:global(*) {
		box-sizing: border-box;
	}
	a {
		color: inherit;
		text-decoration: none;
	}

	.page {
		position: relative;
		overflow-x: clip;
	}
	.top-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 480px;
		background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99, 102, 241, 0.24), transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	.badge {
		display: inline-block;
		padding: 0.4rem 0.95rem;
		border: 1px solid rgba(99, 102, 241, 0.35);
		background: rgba(99, 102, 241, 0.1);
		border-radius: 999px;
		color: #a5b4fc;
		font-size: 0.82rem;
		margin-bottom: 1.25rem;
	}
	h1 {
		font-size: clamp(1.9rem, 3.8vw, 2.6rem);
		line-height: 1.15;
		margin: 0 0 0.9rem;
		letter-spacing: -0.02em;
	}
	.grad {
		background: linear-gradient(120deg, #fff, #9ca3ff 60%, #818cf8);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.lede {
		color: #9ca3af;
		font-size: 1.05rem;
		margin: 0 0 3rem;
		max-width: 560px;
	}

	.docs-layout {
		max-width: 1180px;
		margin: 0 auto;
		padding: 4rem 1.5rem 5rem;
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 3.5rem;
		align-items: start;
	}
	.docs-nav {
		position: sticky;
		top: 6rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.docs-nav-label {
		color: #71717a;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.docs-nav nav {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.docs-nav a {
		color: #9ca3af;
		font-size: 0.9rem;
		padding: 0.4rem 0;
		transition: color 0.15s ease;
	}
	.docs-nav a:hover {
		color: #fff;
	}

	.docs-content section {
		padding-top: 2.5rem;
		margin-top: 2.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		scroll-margin-top: 6rem;
	}
	.docs-content section:first-of-type {
		padding-top: 0;
		margin-top: 0;
		border-top: none;
	}
	.docs-content h2 {
		font-size: 1.4rem;
		margin: 0 0 0.9rem;
	}
	.docs-content p {
		color: #9ca3af;
		line-height: 1.65;
		font-size: 0.95rem;
		margin: 0 0 1.25rem;
	}

	.code-window {
		background: #12121a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		overflow: hidden;
		margin-bottom: 1.25rem;
	}
	.flat-header {
		padding: 0.65rem 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}
	.flat-filename {
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.78rem;
		color: #71717a;
	}
	.code-body {
		margin: 0;
		padding: 1.25rem 1.5rem;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.88rem;
		line-height: 1.7;
		color: #d4d4d8;
		overflow-x: auto;
	}

	@media (max-width: 860px) {
		.docs-layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.docs-nav {
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.5rem 1.25rem;
		}
		.docs-nav-label {
			display: none;
		}
		.docs-nav nav {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.5rem 1.25rem;
		}
	}
</style>