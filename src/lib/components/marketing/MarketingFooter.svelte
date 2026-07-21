<footer class="footer">
	<div class="footer-grid">
		<div class="footer-col">
			<a class="brand" href="/">
				<span class="brand-mark" aria-hidden="true">⌁</span>
				First Layer
			</a>
			<p class="status">
				<span class="status-dot"></span>
				All systems operational
			</p>
			<p class="copyright">© 2026 First Layer, Inc.</p>
		</div>

		<div class="footer-col">
			<h4>Product</h4>
			<a href="/pricing">Pricing</a>
			<a href="/changelog">Changelog</a>
			<a href="#security">Security</a>
			<a href="#roadmap">Roadmap</a>
		</div>

		<div class="footer-col">
			<h4>Resources</h4>
			<a href="/docs">Documentation</a>
			<a href="#api">API reference</a>
			<a href="#guides">Guides</a>
			<a href="#discord">Community</a>
		</div>

		<div class="footer-col">
			<h4>Company</h4>
			<a href="#about">About</a>
			<a href="#blog">Blog</a>
			<a href="#careers">Careers</a>
			<a href="#press">Press kit</a>
		</div>

		<div class="footer-col">
			<h4>Legal</h4>
			<a href="#privacy">Privacy policy</a>
			<a href="#terms">Terms of service</a>
			<a href="#dpa">DPA</a>
			<a href="#trust">Trust center</a>
		</div>
	</div>
</footer>

<style>
	a {
		color: inherit;
		text-decoration: none;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.05rem;
	}
	.brand-mark {
		color: #818cf8;
		font-size: 1.2rem;
	}

	.footer {
		max-width: 1180px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}
	.footer-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2.5rem;
	}
	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.footer-col h4 {
		color: #71717a;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0 0 0.25rem;
	}
	.footer-col a {
		color: #9ca3af;
		font-size: 0.9rem;
	}
	.footer-col a:hover {
		color: #fff;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #9ca3af;
		font-size: 0.85rem;
		margin: 0.75rem 0 0.25rem;
	}
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #34d399;
		box-shadow: 0 0 8px #34d399;
		flex-shrink: 0;
	}
	.copyright {
		color: #52525b;
		font-size: 0.8rem;
		margin: 0;
	}

	@media (min-width: 720px) {
		.footer-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	@media (max-width: 480px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.footer-col {
			padding-bottom: 1.25rem;
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		}
		.footer-col:last-child {
			border-bottom: none;
			padding-bottom: 0;
		}
	}
</style>