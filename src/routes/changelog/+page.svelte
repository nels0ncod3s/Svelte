<script>
	import MarketingNav from "$lib/components/marketing/MarketingNav.svelte";
	import MarketingFooter from "$lib/components/marketing/MarketingFooter.svelte";

	// Placeholder entries — replace with your real release history.
	const entries = [
		{
			date: "July 2026",
			tag: "New",
			title: "Passkey support",
			body: "Users can now register and sign in with passkeys across every SDK. Falls back to email automatically on unsupported devices."
		},
		{
			date: "June 2026",
			tag: "Improved",
			title: "Faster session verification",
			body: "Edge-verified sessions now resolve in under 50ms on average, down from ~180ms, by caching JWKS closer to your users."
		},
		{
			date: "May 2026",
			tag: "New",
			title: "Webhook debugging tools",
			body: "Inspect every outbound webhook, replay failed deliveries, and diff payloads directly from the dashboard."
		},
		{
			date: "April 2026",
			tag: "Fixed",
			title: "Magic link expiry edge case",
			body: "Fixed an issue where magic links generated right before a token rotation could be rejected as expired."
		}
	];

	const tagClass = {
		New: "tag-new",
		Improved: "tag-improved",
		Fixed: "tag-fixed"
	};
</script>

<svelte:head>
	<title>Changelog — First Layer</title>
	<meta name="description" content="What's new in First Layer." />
</svelte:head>

<div class="page">
	<div class="top-glow" aria-hidden="true"></div>

	<MarketingNav />

	<header class="hero">
		<span class="badge">Changelog</span>
		<h1>What's <span class="grad">new.</span></h1>
		<p class="lede">Every ship, in one place.</p>
	</header>

	<section class="timeline">
		{#each entries as entry, i (entry.title)}
			<div class="entry">
				<div class="entry-rail">
					<span class="entry-dot"></span>
					{#if i < entries.length - 1}
						<span class="entry-line"></span>
					{/if}
				</div>
				<div class="entry-body">
					<span class="entry-date">{entry.date}</span>
					<div class="entry-head">
						<span class="entry-tag {tagClass[entry.tag]}">{entry.tag}</span>
						<h3>{entry.title}</h3>
					</div>
					<p>{entry.body}</p>
				</div>
			</div>
		{/each}
	</section>

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

	.hero {
		max-width: 700px;
		margin: 0 auto;
		padding: 5rem 1.5rem 3rem;
		text-align: center;
	}
	.badge {
		display: inline-block;
		padding: 0.4rem 0.95rem;
		border: 1px solid rgba(99, 102, 241, 0.35);
		background: rgba(99, 102, 241, 0.1);
		border-radius: 999px;
		color: #a5b4fc;
		font-size: 0.82rem;
		margin-bottom: 1.5rem;
	}
	h1 {
		font-size: clamp(2rem, 4.4vw, 3rem);
		line-height: 1.1;
		margin: 0 0 1rem;
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
		margin: 0;
	}

	.timeline {
		max-width: 700px;
		margin: 0 auto;
		padding: 1rem 1.5rem 6rem;
	}
	.entry {
		display: grid;
		grid-template-columns: 20px 1fr;
		gap: 1.5rem;
	}
	.entry-rail {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.entry-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #6366f1;
		box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
		margin-top: 0.4rem;
		flex-shrink: 0;
	}
	.entry-line {
		flex: 1;
		width: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 0.4rem 0;
	}
	.entry-body {
		padding-bottom: 2.5rem;
	}
	.entry-date {
		display: block;
		color: #71717a;
		font-size: 0.8rem;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		margin-bottom: 0.6rem;
	}
	.entry-head {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
	}
	.entry-head h3 {
		margin: 0;
		font-size: 1.2rem;
	}
	.entry-tag {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.tag-new {
		background: rgba(99, 102, 241, 0.15);
		color: #a5b4fc;
	}
	.tag-improved {
		background: rgba(34, 211, 238, 0.12);
		color: #67e8f9;
	}
	.tag-fixed {
		background: rgba(113, 113, 122, 0.2);
		color: #a1a1aa;
	}
	.entry-body p {
		margin: 0;
		color: #9ca3af;
		line-height: 1.65;
		font-size: 0.95rem;
	}
</style>