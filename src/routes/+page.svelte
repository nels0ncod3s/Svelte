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

  // --- Lightweight VSCode-Dark+ style syntax highlighter ---
  const KEYWORDS = new Set([
    "import", "export", "from", "const", "let", "var", "async", "await",
    "function", "return", "default", "new", "class", "extends", "interface",
    "type", "public", "static", "def", "if", "else", "elif", "for", "while",
    "try", "except", "with", "as", "print", "struct", "package", "func",
    "go", "chan", "range", "err", "nil", "None", "True", "False", "true",
    "false", "null", "undefined", "in", "of",
  ]);

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightCode(code) {
    const pattern =
      /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b(\s*\()?|(<\/?[A-Za-z][\w.]*)/g;

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(code)) !== null) {
      result += escapeHtml(code.slice(lastIndex, match.index));
      const [full, comment, string, number, word, callParen, jsxTag] = match;

      if (comment) {
        result += `<span class="tok-comment">${escapeHtml(comment)}</span>`;
      } else if (string) {
        result += `<span class="tok-string">${escapeHtml(string)}</span>`;
      } else if (number) {
        result += `<span class="tok-number">${escapeHtml(number)}</span>`;
      } else if (jsxTag) {
        result += `<span class="tok-type">${escapeHtml(jsxTag)}</span>`;
      } else if (word) {
        if (KEYWORDS.has(word)) {
          result += `<span class="tok-keyword">${escapeHtml(word)}</span>`;
        } else if (callParen) {
          result += `<span class="tok-function">${escapeHtml(word)}</span>${escapeHtml(callParen)}`;
        } else if (/^[A-Z]/.test(word)) {
          result += `<span class="tok-type">${escapeHtml(word)}</span>`;
        } else {
          result += escapeHtml(word);
        }
      }
      lastIndex = pattern.lastIndex;
    }
    result += escapeHtml(code.slice(lastIndex));
    return result;
  }

  let highlighted = $derived(highlightCode(active.code));

  // --- Live sign-in demo (signature element) — depicts an actual auth
  // flow: typing credentials, verifying, then a session being issued.
  // Loops on its own; respects prefers-reduced-motion by freezing on the
  // "success" frame instead of animating.
  let authPhase = $state("idle"); // idle | email | password | verifying | success
  let emailTyped = $state("");
  let passwordTyped = $state("");
  const demoEmail = "dev@firstlayer.dev";
  const demoPasswordLength = 10;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  $effect(() => {
    let cancelled = false;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      emailTyped = demoEmail;
      passwordTyped = "•".repeat(demoPasswordLength);
      authPhase = "success";
      return;
    }

    (async () => {
      while (!cancelled) {
        authPhase = "email";
        emailTyped = "";
        for (let i = 1; i <= demoEmail.length && !cancelled; i++) {
          emailTyped = demoEmail.slice(0, i);
          await wait(45);
        }
        if (cancelled) return;
        await wait(350);

        authPhase = "password";
        passwordTyped = "";
        for (let i = 1; i <= demoPasswordLength && !cancelled; i++) {
          passwordTyped += "•";
          await wait(70);
        }
        if (cancelled) return;
        await wait(400);

        authPhase = "verifying";
        await wait(1100);
        if (cancelled) return;

        authPhase = "success";
        await wait(2400);
        if (cancelled) return;

        authPhase = "idle";
        await wait(500);
      }
    })();

    return () => {
      cancelled = true;
    };
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

  // --- Installer snippet copy-to-clipboard ---
  let copied = $state(false);
  async function copyInstaller() {
    try {
      await navigator.clipboard.writeText("npm install @firstlayer/sdk");
      copied = true;
      setTimeout(() => (copied = false), 1800);
    } catch (e) {
      // clipboard API unavailable — fail silently
    }
  }

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
  <div class="top-glow" aria-hidden="true"></div>

  <!-- NAV -->
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
        <a href="/changelog" onclick={() => (menuOpen = false)}>Changelog</a>
        <a href="/pricing" onclick={() => (menuOpen = false)}>Pricing</a>
        <a href="/docs" onclick={() => (menuOpen = false)}>Docs</a>
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

      <div class="installer" role="group" aria-label="Install command">
        <span class="installer-prompt">$</span>
        <code class="installer-cmd">npm install @firstlayer/sdk</code>
        <button
          type="button"
          class="installer-copy"
          onclick={copyInstaller}
          aria-label="Copy install command"
        >
          {#if copied}
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Signature element: live sign-in demo — depicts the actual auth
         flow (typing credentials, verifying, session issued) rather than
         abstract network infrastructure. -->
    <div class="edge-monitor" use:reveal>
      <div class="window-chrome">
        <span></span><span></span><span></span>
        <span class="chrome-title">sign-in · live demo</span>
      </div>
      <div class="auth-demo-body">
        <div class="auth-field">
          <span class="auth-label">Email</span>
          <div class="auth-input">
            {emailTyped}<span class="caret" class:show={authPhase === "email"}></span>
          </div>
        </div>

        <div class="auth-field">
          <span class="auth-label">Password</span>
          <div class="auth-input">
            {passwordTyped}<span class="caret" class:show={authPhase === "password"}></span>
          </div>
        </div>

        <button
          type="button"
          class="auth-submit"
          class:pressed={authPhase === "verifying" || authPhase === "success"}
          tabindex="-1"
        >
          {#if authPhase === "verifying"}
            <span class="spinner" aria-hidden="true"></span>
            Verifying credentials...
          {:else if authPhase === "success"}
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            Authenticated
          {:else}
            Sign in
          {/if}
        </button>

        {#if authPhase === "success"}
          <div class="auth-session">
            <span class="status-dot"></span>
            Session issued · edge-verified in 42ms
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- SDK SECTION -->
  <section class="sdk" use:reveal>
    <div class="sdk-layout">
      <div class="sdk-text">
        <h2>Built by developers, for developers.</h2>
        <p>
          Zero-config setup, native SDKs, and edge execution that doesn't
          make you think about infrastructure.
        </p>
      </div>

      <div class="sdk-code-flat">
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
          <div class="flat-header">
            <span class="flat-filename">{active.file}</span>
          </div>
          <pre class="code-body"><code>{@html highlighted}</code></pre>
        </div>
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
        <a href="/pricing">Pricing</a>
        <a href="/changelog">Changelog</a>
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

  .page {
    position: relative;
    overflow-x: clip;
  }

  /* ---------- top radial glow ---------- */
  .top-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 720px;
    background: radial-gradient(
      ellipse 70% 60% at 50% 0%,
      rgba(99, 102, 241, 0.28),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 640px) {
    .top-glow {
      height: 480px;
      background: radial-gradient(
        ellipse 130% 55% at 50% 0%,
        rgba(99, 102, 241, 0.38),
        transparent 72%
      );
    }
  }

  /* ---------- installer snippet ---------- */
  .installer {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 auto;
    padding: 0.7rem 0.7rem 0.7rem 1.1rem;
    background: #0c0c12;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.85rem;
  }
  .installer-prompt {
    color: #6366f1;
    font-weight: 700;
  }
  .installer-cmd {
    color: #d4d4d8;
    background: none;
  }
  .installer-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 7px;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .installer-copy:hover {
    color: #f3f4f6;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
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
    margin-bottom: 2rem;
  }
  .installer {
    margin-bottom: 3.5rem;
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
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 8px #34d399;
    flex-shrink: 0;
  }
  .auth-demo-body {
    padding: 1.75rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    text-align: left;
  }
  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .auth-label {
    color: #71717a;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .auth-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.88rem;
    color: #e4e4e7;
    min-height: 1.5em;
  }
  .caret {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: #818cf8;
    margin-left: 2px;
    vertical-align: middle;
    opacity: 0;
  }
  .caret.show {
    opacity: 1;
    animation: blink 0.9s step-end infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  .auth-submit {
    margin-top: 0.3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #6366f1;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.7rem;
    font-weight: 600;
    font-size: 0.88rem;
    font-family: inherit;
    transition: background 0.25s ease;
    cursor: default;
  }
  .auth-submit.pressed {
    background: #4f46e5;
  }
  .spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .auth-session {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #71717a;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.76rem;
    animation: fadeIn 0.35s ease;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
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
  .sdk-layout {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 3rem;
    align-items: center;
  }
  .sdk-text h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.4rem);
    margin: 0 0 0.9rem;
  }
  .sdk-text p {
    color: #9ca3af;
    line-height: 1.6;
    max-width: 420px;
  }
  .sdk-code-flat {
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
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
    padding: 1.75rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.88rem;
    line-height: 1.7;
    color: #d4d4d8;
    overflow-x: auto;
  }
  .code-body :global(.tok-keyword) {
    color: #569cd6;
  }
  .code-body :global(.tok-string) {
    color: #ce9178;
  }
  .code-body :global(.tok-comment) {
    color: #6a9955;
    font-style: italic;
  }
  .code-body :global(.tok-number) {
    color: #b5cea8;
  }
  .code-body :global(.tok-function) {
    color: #dcdcaa;
  }
  .code-body :global(.tok-type) {
    color: #4ec9b0;
  }

  @media (max-width: 860px) {
    .sdk-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .sdk-text p {
      max-width: none;
    }
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
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
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

  @media (max-width: 640px) {
    .final-cta {
      margin: 0 1rem 3.5rem;
      padding: 2.75rem 1.25rem;
      border-radius: 20px;
    }
    .cta-input-row {
      flex-direction: column;
      align-items: stretch;
    }
    .cta-input-row input {
      min-width: 0;
      width: 100%;
    }
    .cta-input-row button {
      width: 100%;
    }
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
    .caret {
      animation: none;
    }
    .spinner {
      animation: none;
    }
  }
</style>