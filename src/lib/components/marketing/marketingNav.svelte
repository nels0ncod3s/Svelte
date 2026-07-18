<script>
	let menuOpen = $state(false);
</script>

<nav class="nav">
	<div class="nav-inner">
		<a class="brand" href="/">
			<span class="brand-mark" aria-hidden="true">⌁</span>
			First Layer
		</a>

		<div class="nav-links">
			<a href="/changelog">Changelog</a>
			<a href="/docs">Docs</a>
			<a href="/pricing">Pricing</a>
		</div>

		<div class="nav-actions">
			<a class="btn-ghost" href="/login">Log in</a>
			<a class="btn-solid" href="/signup">Get started</a>
		</div>

		<button class="burger" aria-label="Toggle menu" onclick={() => (menuOpen = !menuOpen)}>
			<span></span><span></span><span></span>
		</button>
	</div>

	{#if menuOpen}
		<div class="mobile-menu">
			<a href="/changelog" onclick={() => (menuOpen = false)}>Changelog</a>
			<a href="/docs" onclick={() => (menuOpen = false)}>Docs</a>
			<a href="/pricing" onclick={() => (menuOpen = false)}>Pricing</a>
			<a class="btn-ghost" href="/login">Log in</a>
			<a class="btn-solid" href="/signup">Get started</a>
		</div>
	{/if}
</nav>

<style>
	a {
		color: inherit;
		text-decoration: none;
	}

	.btn-ghost,
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
	.btn-ghost {
		color: #d4d4d8;
	}
	.btn-ghost:hover {
		color: #fff;
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

	.nav {
		position: sticky;
		top: 0;
		z-index: 40;
		backdrop-filter: blur(14px);
		background: rgba(8, 8, 12, 0.72);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.nav-inner {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.05rem;
		justify-self: start;
	}
	.brand-mark {
		color: #818cf8;
		font-size: 1.2rem;
	}
	.nav-links {
		display: flex;
		gap: 2rem;
		justify-self: center;
	}
	.nav-links a {
		color: #9ca3af;
		font-size: 0.92rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		transition: color 0.15s ease;
	}
	.nav-links a:hover {
		color: #fff;
	}
	.nav-actions {
		display: flex;
		gap: 0.75rem;
		justify-self: end;
	}
	.burger {
		display: none;
		grid-column: 3;
		justify-self: end;
		flex-direction: column;
		gap: 4px;
		background: none;
		border: none;
		padding: 0.4rem;
		cursor: pointer;
	}
	.burger span {
		width: 20px;
		height: 2px;
		background: #f3f4f6;
	}
	.mobile-menu {
		display: none;
	}

	@media (max-width: 860px) {
		.nav-links,
		.nav-actions {
			display: none;
		}
		.burger {
			display: flex;
		}
		.mobile-menu {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem 1.5rem 1.5rem;
			border-top: 1px solid rgba(255, 255, 255, 0.08);
		}
	}
</style>