<script>
  // ============================================================
  // First Layer — Auth-as-a-Service landing page
  // Svelte 5 (runes mode). Drop into src/routes/+page.svelte
  // ============================================================

  // --- SDK switcher state ---
  const frameworks = [
    {
      id: "svelte",
      label: "Svelte",
      file: "auth.js",
      code: `import { createClient } from "firstlayer/svelte";

export const auth = createClient({
  project: "prod_9k2x",
});

// in +layout.svelte
await auth.session.hydrate();`,
    },
    {
      id: "react",
      label: "React",
      file: "auth.jsx",
      code: `import { FirstLayerProvider } from "firstlayer/react";

export default function App() {
  return (
    <FirstLayerProvider project="prod_9k2x">
      <Dashboard />
    </FirstLayerProvider>
  );
}`,
    },
    {
      id: "nextjs",
      label: "Next.js",
      file: "middleware.ts",
      code: `import { withAuth } from "firstlayer/next";

export default withAuth({
  project: "prod_9k2x",
  publicRoutes: ["/", "/pricing"],
});`,
    },
    {
      id: "python",
      label: "Python",
      file: "main.py",
      code: `from firstlayer import Client

auth = Client(project="prod_9k2x")

user = auth.session.verify(token)
print(user.email)`,
    },
    {
      id: "fastapi",
      label: "FastAPI",
      file: "main.py",
      code: `from firstlayer.fastapi import require_auth

@app.get("/me")
def me(user = Depends(require_auth)):
    return {"email": user.email}`,
    },
    {
      id: "go",
      label: "Go",
      file: "main.go",
      code: `client := firstlayer.New("prod_9k2x")

user, err := client.Session.Verify(token)
if err != nil {
    http.Error(w, "unauthorized", 401)
}`,
    },
  ];

  let activeId = $state("svelte");
  let active = $derived(frameworks.find((f) => f.id === activeId));

  // --- Live "edge verification" ticker (signature element) ---
  const regions = ["lagos", "fra", "sin", "iad", "syd", "gru"];
  let ticks = $state([]);
  let tickSeq = 0;

  $effect(() => {
    const interval = setInterval(() => {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const ms = (Math.random() * 4 + 1.2).toFixed(1);
      tickSeq += 1;
      const entry = { id: tickSeq, region, ms };
      ticks = [entry, ...ticks].slice(0, 6);
    }, 1400);
    return () => clearInterval(interval);
  });

  // --- Scroll reveal ---
  function reveal(node) {
    node.classList.add("reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  // --- Mobile nav ---
  let menuOpen = $state(false);

  // --- Email capture ---
  let email = $state("");
  let submitted = $state(false);
  function handleGetKey() {
    if (!email.includes("@")) return;
    submitted = true;
  }

  const pillars = [
    {
      title: "Edge-native speed",
      body: "JWTs verified at the edge, under 5ms, in every region your users actually are.",
      tag: "< 5ms",
    },
    {
      title: "Total security",
      body: "SOC2 Type II, phishing-resistant passkeys, and MFA on by default — not bolted on.",
      tag: "SOC2",
    },
    {
      title: "Fully customizable",
      body: "Headless APIs when you want full control, themed components when you don't.",
      tag: "headless / UI",
    },
  ];

  const logos = ["Voltra", "Kesho Pay", "Nimbus", "Ledger&Co", "Patchwork", "Orbital"];
</script>

<svelte:head>
  <title>First Layer — Authentication that scales with your code</title>
  <meta
    name="description"
    content="Secure, multi-tenant authentication, passkeys, and session management in under 5 lines of code."
  />
</svelte:head>

<div class="page">
  <!-- NAV -->
  <nav class="nav">
    <div class="nav-inner">
      <a class="brand" href="/">
        <span class="brand-mark" aria-hidden="true">⌁</span>
        First Layer
      </a>

      <div class="nav-links">
        <a href="#changelog">Changelog <span class="dot"></span></a>
        <a href="#pricing">Pricing</a>
        <a href="#docs">Docs</a>
      </div>

      <div class="nav-actions">
        <a class="btn-ghost" href="/login">Log in</a>
        <a class="btn-solid" href="/signup">Get started</a>
      </div>

      <button
        class="burger"
        aria-label="Toggle menu"
        onclick={() => (menuOpen = !menuOpen)}
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    {#if menuOpen}
      <div class="mobile-menu">
        <a href="#changelog" onclick={() => (menuOpen = false)}>Changelog</a>
        <a href="#pricing" onclick={() => (menuOpen = false)}>Pricing</a>
        <a href="#docs" onclick={() => (menuOpen = false)}>Docs</a>
        <a class="btn-ghost" href="/login">Log in</a>
        <a class="btn-solid" href="/signup">Get started</a>
      </div>
    {/if}
  </nav>

  <!-- HERO -->
  <header class="hero">
    <div class="hero-grid" aria-hidden="true"></div>

    <div class="hero-content">
      <span class="badge">Introducing v2.0 — enterprise-grade speed</span>

      <h1>
        Authentication that scales
        <span class="grad">with your code, not your budget.</span>
      </h1>

      <p class="lede">
        Multi-tenant auth, passkeys, and session management in under five
        lines of code. Built for the way modern teams actually ship.
      </p>

      <div class="cta-row">
        <a class="btn-solid btn-lg" href="/signup">Start free — deploy in 5m</a>
        <a class="btn-outline btn-lg" href="/demo">Schedule a demo</a>
      </div>
    </div>

    <!-- Signature element: live edge-verification ticker -->
    <div class="edge-monitor" use:reveal>
      <div class="window-chrome">
        <span></span><span></span><span></span>
        <span class="chrome-title">edge-verify · live</span>
      </div>
      <div class="monitor-body">
        <div class="monitor-head">
          <span class="status-dot"></span>
          Verifying sessions at the edge
        </div>
        <ul class="tick-list">
          {#each ticks as t (t.id)}
            <li class="tick-row">
              <span class="tick-region">{t.region}</span>
              <span class="tick-bar">
                <span class="tick-fill" style="--w: {Math.min(t.ms / 5, 1) * 100}%"></span>
              </span>
              <span class="tick-ms">{t.ms}ms</span>
              <span class="tick-ok">200</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </header>

  <!-- SDK SECTION -->
  <section class="sdk" use:reveal>
    <div class="section-head">
      <h2>Built by developers, for developers.</h2>
      <p>
        Zero-config setup, native SDKs, and edge execution that doesn't make
        you think about infrastructure.
      </p>
    </div>

    <div class="sdk-panel">
      <div class="sdk-tabs" role="tablist">
        {#each frameworks as f}
          <button
            role="tab"
            aria-selected={activeId === f.id}
            class="sdk-tab"
            class:active={activeId === f.id}
            onclick={() => (activeId = f.id)}
          >
            {f.label}
          </button>
        {/each}
      </div>

      <div class="code-window">
        <div class="window-chrome">
          <span></span><span></span><span></span>
          <span class="chrome-title">{active.file}</span>
        </div>
        <pre class="code-body"><code>{active.code}</code></pre>
      </div>
    </div>
  </section>

  <!-- PILLARS -->
  <section class="pillars" use:reveal>
    <div class="pillar-grid">
      {#each pillars as p}
        <article class="pillar-card">
          <span class="pillar-tag">{p.tag}</span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </article>
      {/each}
    </div>
  </section>

  <!-- SOCIAL PROOF -->
  <section class="proof" use:reveal>
    <p class="proof-label">Trusted by teams shipping fast</p>
    <div class="logo-wall">
      {#each logos as logo}
        <span class="logo-item">{logo}</span>
      {/each}
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta" use:reveal>
    <div class="final-cta-inner">
      <h2>Ready to secure your application?</h2>
      <p>Get an API key in seconds. No credit card required.</p>

      {#if !submitted}
        <div class="cta-input-row">
          <input
            type="email"
            placeholder="you@company.com"
            bind:value={email}
            onkeydown={(e) => e.key === "Enter" && handleGetKey()}
          />
          <button class="btn-solid" onclick={handleGetKey}>Get API key</button>
        </div>
      {:else}
        <p class="cta-success">Check your inbox — your key is on its way.</p>
      {/if}
    </div>
  </section>

  <!-- FOOTER -->
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
        <a href="#features">Features</a>
        <a href="#security">Security</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#pricing">Pricing</a>
      </div>

      <div class="footer-col">
        <h4>Resources</h4>
        <a href="#docs">Documentation</a>
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
</div>

<style>
  :global(body) {
    margin: 0;
    background: #08080c;
    color: #f3f4f6;
    font-family: "Inter", system-ui, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .page {
    overflow-x: clip;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* ---------- shared buttons ---------- */
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
  }

  /* ---------- nav ---------- */
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
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.05rem;
    margin-right: auto;
  }
  .brand-mark {
    color: #818cf8;
    font-size: 1.2rem;
  }
  .nav-links {
    display: flex;
    gap: 2rem;
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
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22d3ee;
    box-shadow: 0 0 8px #22d3ee;
  }
  .nav-actions {
    display: flex;
    gap: 0.75rem;
  }
  .burger {
    display: none;
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

  /* ---------- hero ---------- */
  .hero {
    position: relative;
    padding: 6.5rem 1.5rem 5rem;
    max-width: 1180px;
    margin: 0 auto;
  }
  .hero-grid {
    position: absolute;
    inset: -2rem 0 auto 0;
    height: 620px;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 42px 42px;
    -webkit-mask-image: radial-gradient(circle at 50% 15%, black 0%, transparent 65%);
    mask-image: radial-gradient(circle at 50% 15%, black 0%, transparent 65%);
    z-index: -1;
  }
  .hero-content {
    max-width: 760px;
    margin: 0 auto;
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
    margin-bottom: 1.75rem;
  }
  h1 {
    font-size: clamp(2.4rem, 5.4vw, 4.2rem);
    line-height: 1.08;
    margin: 0 0 1.4rem;
    letter-spacing: -0.02em;
  }
  .grad {
    display: block;
    background: linear-gradient(120deg, #fff, #9ca3ff 60%, #818cf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .lede {
    color: #9ca3af;
    font-size: 1.1rem;
    max-width: 560px;
    margin: 0 auto 2.25rem;
    line-height: 1.6;
  }
  .cta-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 4rem;
  }

  /* ---------- signature edge monitor ---------- */
  .edge-monitor {
    max-width: 640px;
    margin: 0 auto;
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
  }
  .window-chrome {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .window-chrome span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3f3f46;
  }
  .window-chrome span:nth-child(1) {
    background: #f87171;
  }
  .window-chrome span:nth-child(2) {
    background: #fbbf24;
  }
  .window-chrome span:nth-child(3) {
    background: #34d399;
  }
  .chrome-title {
    margin-left: 0.5rem;
    color: #71717a;
    font-size: 0.78rem;
    font-family: "JetBrains Mono", monospace;
  }
  .monitor-body {
    padding: 1.4rem 1.5rem 1.6rem;
    text-align: left;
  }
  .monitor-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #d4d4d8;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 8px #34d399;
    flex-shrink: 0;
  }
  .tick-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.78rem;
  }
  .tick-row {
    display: grid;
    grid-template-columns: 42px 1fr 52px 34px;
    align-items: center;
    gap: 0.7rem;
    color: #71717a;
    animation: rowIn 0.35s ease;
  }
  .tick-region {
    color: #a5b4fc;
    text-transform: uppercase;
  }
  .tick-bar {
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }
  .tick-fill {
    display: block;
    height: 100%;
    width: var(--w);
    background: linear-gradient(90deg, #6366f1, #22d3ee);
  }
  .tick-ms {
    text-align: right;
    color: #d4d4d8;
  }
  .tick-ok {
    color: #34d399;
    text-align: right;
  }
  @keyframes rowIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ---------- sdk section ---------- */
  .sdk {
    max-width: 1180px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }
  .section-head {
    text-align: center;
    max-width: 620px;
    margin: 0 auto 2.75rem;
  }
  .section-head h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.4rem);
    margin: 0 0 0.75rem;
  }
  .section-head p {
    color: #9ca3af;
    line-height: 1.6;
  }
  .sdk-panel {
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
  }
  .sdk-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .sdk-tab {
    background: none;
    border: none;
    color: #9ca3af;
    padding: 0.55rem 0.95rem;
    border-radius: 8px;
    font-size: 0.88rem;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .sdk-tab:hover {
    color: #fff;
  }
  .sdk-tab.active {
    background: rgba(99, 102, 241, 0.16);
    color: #a5b4fc;
  }
  .code-window {
    display: flex;
    flex-direction: column;
  }
  .code-body {
    margin: 0;
    padding: 1.75rem;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.88rem;
    line-height: 1.7;
    color: #d4d4d8;
    overflow-x: auto;
  }

  /* ---------- pillars ---------- */
  .pillars {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1rem 1.5rem 5rem;
  }
  .pillar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }
  .pillar-card {
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 1.9rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .pillar-card:hover {
    border-color: #6366f1;
    transform: translateY(-4px);
  }
  .pillar-tag {
    display: inline-block;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.75rem;
    color: #22d3ee;
    border: 1px solid rgba(34, 211, 238, 0.3);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    margin-bottom: 1rem;
  }
  .pillar-card h3 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
  }
  .pillar-card p {
    margin: 0;
    color: #9ca3af;
    line-height: 1.6;
    font-size: 0.94rem;
  }

  /* ---------- social proof ---------- */
  .proof {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1rem 1.5rem 5rem;
    text-align: center;
  }
  .proof-label {
    color: #71717a;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1.75rem;
  }
  .logo-wall {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2.5rem;
  }
  .logo-item {
    color: #52525b;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    filter: grayscale(1);
    transition: color 0.2s ease;
  }
  .logo-item:hover {
    color: #a1a1aa;
  }

  /* ---------- final cta ---------- */
  .final-cta {
    margin: 0 1.5rem 5rem;
    max-width: 1180px;
    margin-inline: auto;
    border-radius: 24px;
    background:
      radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.35), transparent 55%),
      radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.18), transparent 50%),
      #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4rem 2rem;
    text-align: center;
  }
  .final-cta-inner h2 {
    font-size: clamp(1.7rem, 3.2vw, 2.3rem);
    margin: 0 0 0.6rem;
  }
  .final-cta-inner p {
    color: #9ca3af;
    margin: 0 0 2rem;
  }
  .cta-input-row {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .cta-input-row input {
    background: #08080c;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #f3f4f6;
    font-size: 0.95rem;
    min-width: 260px;
  }
  .cta-input-row input:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
  .cta-success {
    color: #34d399;
    font-weight: 600;
  }

  /* ---------- footer ---------- */
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

  /* ---------- scroll reveal ---------- */
  :global(.reveal) {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  :global(.reveal-in) {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.reveal) {
      opacity: 1;
      transform: none;
      transition: none;
    }
    .tick-row {
      animation: none;
    }
  }
</style>