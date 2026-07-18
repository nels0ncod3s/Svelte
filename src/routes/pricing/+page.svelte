<script>
	import MarketingNav from "$lib/components/marketing/MarketingNav.svelte";
	import MarketingFooter from "$lib/components/marketing/MarketingFooter.svelte";

	// Placeholder numbers — swap these for your real pricing before launch.
	const tiers = [
		{
			id: "free",
			name: "Free",
			price: "$0",
			period: "/mo",
			tagline: "For side projects and testing the waters.",
			cta: "Start free",
			href: "/signup",
			featured: false,
			features: [
				"Up to 3 projects",
				"500 monthly active users",
				"Email & Google sign-in",
				"7-day log retention",
				"Community support"
			]
		},
		{
			id: "pro",
			name: "Pro",
			price: "$29",
			period: "/mo",
			tagline: "For products that are live and growing.",
			cta: "Start free trial",
			href: "/signup",
			featured: true,
			features: [
				"Unlimited projects",
				"10,000 monthly active users",
				"All auth providers + passkeys",
				"90-day log retention",
				"Custom email domain",
				"Priority support"
			]
		}
	];
</script>

<svelte:head>
	<title>Pricing — First Layer</title>
	<meta name="description" content="Simple, transparent pricing for First Layer auth." />
</svelte:head>

<div class="page">
	<div class="top-glow" aria-hidden="true"></div>

	<MarketingNav />

	<header class="hero">
		<span class="badge">Pricing</span>
		<h1>Simple pricing, <span class="grad">no surprises.</span></h1>
		<p class="lede">Start free. Upgrade when you have real users to protect.</p>
	</header>

	<section class="tiers">
		{#each tiers as tier (tier.id)}
			<div class="tier-card" class:featured={tier.featured}>
				{#if tier.featured}
					<span class="tier-tag">Most popular</span>
				{/if}
				<h3>{tier.name}</h3>
				<p class="tier-tagline">{tier.tagline}</p>
				<div class="tier-price">
					<span class="amount">{tier.price}</span>
					<span class="period">{tier.period}</span>
				</div>
				<a class={tier.featured ? "btn-solid btn-lg" : "btn-outline btn-lg"} href={tier.href}>
					{tier.cta}
				</a>
				<ul class="tier-features">
					{#each tier.features as feature (feature)}
						<li>
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>

	<section class="faq">
		<h2>Questions</h2>
		<div class="faq-grid">
			<div class="faq-item">
				<h4>Can I switch plans later?</h4>
				<p>Yes — upgrade or downgrade at any time. Changes take effect on your next billing cycle.</p>
			</div>
			<div class="faq-item">
				<h4>What counts as a monthly active user?</h4>
				<p>Any user who completes at least one authenticated request during the billing period.</p>
			</div>
			<div class="faq-item">
				<h4>Do you offer a free trial of Pro?</h4>
				<p>Yes — 14 days, no card required to start.</p>
			</div>
			<div class="faq-item">
				<h4>Need something custom?</h4>
				<p>Reach out and we'll put together a plan that fits.</p>
			</div>
		</div>
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

	.btn-solid,
	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem 1.2rem;
		border-radius: 10px;
		font-weight: 600;
		font-size: 0.9rem;
		transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
		cursor: pointer;
		border: 1px solid transparent;
	}
	.btn-solid {
		background: #6366f1;
		color: #fff;
	}
	.btn-solid:hover {
		transform: translateY(-1px);
		background: #7476f5;
		box-shadow: 0 0 24px rgba(99, 102, 241, 0.45);
	}
	.btn-outline {
		border-color: rgba(255, 255, 255, 0.16);
		color: #f3f4f6;
	}
	.btn-outline:hover {
		border-color: rgba(255, 255, 255, 0.35);
	}
	.btn-lg {
		padding: 0.85rem 1.6rem;
		font-size: 1rem;
		width: 100%;
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

	.tiers {
		max-width: 860px;
		margin: 0 auto;
		padding: 1rem 1.5rem 5rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}
	.tier-card {
		position: relative;
		background: #12121a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}
	.tier-card.featured {
		border-color: #6366f1;
		box-shadow: 0 0 40px rgba(99, 102, 241, 0.15);
	}
	.tier-tag {
		position: absolute;
		top: -0.7rem;
		right: 1.5rem;
		background: #6366f1;
		color: #fff;
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
	}
	.tier-card h3 {
		margin: 0 0 0.4rem;
		font-size: 1.3rem;
	}
	.tier-tagline {
		color: #9ca3af;
		font-size: 0.9rem;
		margin: 0 0 1.5rem;
		min-height: 2.5em;
	}
	.tier-price {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
	}
	.amount {
		font-size: 2.5rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.period {
		color: #71717a;
		font-size: 0.95rem;
	}
	.tier-features {
		list-style: none;
		margin: 1.75rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.tier-features li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: #d4d4d8;
		font-size: 0.92rem;
	}
	.tier-features li svg {
		flex-shrink: 0;
		color: #34d399;
	}

	@media (max-width: 640px) {
		.tiers {
			grid-template-columns: 1fr;
		}
	}

	.faq {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1rem 1.5rem 6rem;
	}
	.faq h2 {
		font-size: 1.6rem;
		margin: 0 0 2rem;
		text-align: center;
	}
	.faq-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.75rem;
	}
	.faq-item h4 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}
	.faq-item p {
		margin: 0;
		color: #9ca3af;
		font-size: 0.9rem;
		line-height: 1.6;
	}
</style>