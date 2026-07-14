<div class="page-header">
	<h1>App Overview</h1>
	<p>Monitor your core platform vitals in real-time.</p>
</div>

<div class="metrics-grid">
	<div class="card">
		<h3>Monthly Active Users</h3>
		<p class="value">14,208</p>
		<span class="trend positive">↑ 12.4% this month</span>
	</div>
	<div class="card">
		<h3>API Success Rate</h3>
		<p class="value">99.98%</p>
		<span class="trend positive">Stable</span>
	</div>
	<div class="card">
		<h3>Response Time</h3>
		<p class="value">142ms</p>
		<span class="trend negative">↓ 8ms slower</span>
	</div>
</div>

<style>
	.page-header { margin-bottom: 2rem; }
	h1 { font-size: 1.75rem; margin-bottom: 0.25rem; color: #0f172a; }
	p { color: #64748b; margin: 0; }
	
	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
	}
	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0,0,0,0.05);
	}
	.card h3 { font-size: 0.9rem; color: #64748b; margin-top: 0; }
	.value { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 0.5rem 0; }
	.trend { font-size: 0.85rem; font-weight: 500; }
	.trend.positive { color: #10b981; }
	.trend.negative { color: #f59e0b; }
</style>