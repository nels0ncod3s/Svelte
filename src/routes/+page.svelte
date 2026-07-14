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

  // --- Live auth verification world map (signature element) ---
  const regionCoords = {
    lagos: [306, 139],
    fra: [315, 67],
    sin: [473, 148],
    iad: [171, 85],
    syd: [552, 207],
    gru: [222, 189],
  };
  const regionKeys = Object.keys(regionCoords);
  let pulses = $state([]);
  let latest = $derived(pulses[pulses.length - 1] ?? null);
  let pulseSeq = 0;

  $effect(() => {
    const interval = setInterval(() => {
      const region = regionKeys[Math.floor(Math.random() * regionKeys.length)];
      const ms = (Math.random() * 4 + 1.2).toFixed(1);
      const [x, y] = regionCoords[region];
      pulseSeq += 1;
      const id = pulseSeq;
      pulses = [...pulses, { id, region, ms, x, y }];
      setTimeout(() => {
        pulses = pulses.filter((p) => p.id !== id);
      }, 1500);
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
        <a href="#changelog">Changelog</a>
        <a href="#docs">Docs</a>
        <a href="#pricing">Pricing</a>
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

    <!-- Signature element: live auth-verification world map -->
    <div class="edge-monitor" use:reveal>
      <div class="window-chrome">
        <span></span><span></span><span></span>
        <span class="chrome-title">auth-network · live</span>
      </div>
      <div class="monitor-body">
        <div class="monitor-head">
          <span class="status-dot"></span>
          Verifying sessions at the edge
        </div>

        <div class="map-wrap">
          <svg class="world-map" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g class="map-dots"><circle cx="42.6" cy="32.7" r="1.4"/><circle cx="52.9" cy="33.5" r="1.4"/><circle cx="53.2" cy="42.5" r="1.4"/><circle cx="66.1" cy="32.8" r="1.4"/><circle cx="66.4" cy="41.5" r="1.4"/><circle cx="77.3" cy="31.4" r="1.4"/><circle cx="76.9" cy="42.5" r="1.4"/><circle cx="77.3" cy="55.5" r="1.4"/><circle cx="86.1" cy="31.6" r="1.4"/><circle cx="85.1" cy="41.9" r="1.4"/><circle cx="86.9" cy="55.7" r="1.4"/><circle cx="96.4" cy="31.8" r="1.4"/><circle cx="96.2" cy="41.4" r="1.4"/><circle cx="99" cy="54.5" r="1.4"/><circle cx="98" cy="66" r="1.4"/><circle cx="99.5" cy="75" r="1.4"/><circle cx="109.2" cy="30.1" r="1.4"/><circle cx="109.2" cy="42.4" r="1.4"/><circle cx="109.3" cy="55.3" r="1.4"/><circle cx="110.3" cy="65.4" r="1.4"/><circle cx="109.7" cy="74.8" r="1.4"/><circle cx="110.4" cy="85.2" r="1.4"/><circle cx="110.1" cy="99.1" r="1.4"/><circle cx="110" cy="110" r="1.4"/><circle cx="121.5" cy="30" r="1.4"/><circle cx="121.4" cy="41.8" r="1.4"/><circle cx="118.8" cy="54.2" r="1.4"/><circle cx="119.1" cy="66.6" r="1.4"/><circle cx="119.4" cy="75.6" r="1.4"/><circle cx="119" cy="85.9" r="1.4"/><circle cx="118.8" cy="98.6" r="1.4"/><circle cx="118.4" cy="110.9" r="1.4"/><circle cx="118.8" cy="118.8" r="1.4"/><circle cx="130.3" cy="31.5" r="1.4"/><circle cx="129.3" cy="41.7" r="1.4"/><circle cx="130.9" cy="55.1" r="1.4"/><circle cx="129.8" cy="66.6" r="1.4"/><circle cx="129.8" cy="75" r="1.4"/><circle cx="130.9" cy="88.7" r="1.4"/><circle cx="129.4" cy="98.7" r="1.4"/><circle cx="130.7" cy="108.6" r="1.4"/><circle cx="131.2" cy="118.8" r="1.4"/><circle cx="140.6" cy="30.2" r="1.4"/><circle cx="142.6" cy="44.4" r="1.4"/><circle cx="142.5" cy="55.4" r="1.4"/><circle cx="143.3" cy="63.1" r="1.4"/><circle cx="143.5" cy="75.7" r="1.4"/><circle cx="142.2" cy="88.9" r="1.4"/><circle cx="144" cy="99.4" r="1.4"/><circle cx="143.1" cy="107.5" r="1.4"/><circle cx="153.2" cy="30.9" r="1.4"/><circle cx="153.3" cy="44.9" r="1.4"/><circle cx="154.9" cy="55.3" r="1.4"/><circle cx="153.7" cy="63.3" r="1.4"/><circle cx="154.1" cy="75.4" r="1.4"/><circle cx="153.9" cy="88.4" r="1.4"/><circle cx="154.4" cy="99.1" r="1.4"/><circle cx="154.7" cy="107.9" r="1.4"/><circle cx="162.2" cy="44.9" r="1.4"/><circle cx="163.9" cy="54.9" r="1.4"/><circle cx="163.8" cy="63.8" r="1.4"/><circle cx="163.8" cy="74.1" r="1.4"/><circle cx="164" cy="88.5" r="1.4"/><circle cx="163.8" cy="98.5" r="1.4"/><circle cx="174.9" cy="55.2" r="1.4"/><circle cx="174.4" cy="64.7" r="1.4"/><circle cx="174.5" cy="75.1" r="1.4"/><circle cx="174.8" cy="88" r="1.4"/><circle cx="175.7" cy="142.1" r="1.4"/><circle cx="176.7" cy="151.4" r="1.4"/><circle cx="175.3" cy="163.6" r="1.4"/><circle cx="175.4" cy="175.4" r="1.4"/><circle cx="187.3" cy="54.7" r="1.4"/><circle cx="187" cy="64.8" r="1.4"/><circle cx="187.5" cy="74.1" r="1.4"/><circle cx="187.5" cy="142.5" r="1.4"/><circle cx="186.9" cy="152.3" r="1.4"/><circle cx="186.3" cy="165.1" r="1.4"/><circle cx="188" cy="175.4" r="1.4"/><circle cx="185.8" cy="185.8" r="1.4"/><circle cx="184.2" cy="195.2" r="1.4"/><circle cx="184.5" cy="209.6" r="1.4"/><circle cx="185.5" cy="220.9" r="1.4"/><circle cx="184.1" cy="229.7" r="1.4"/><circle cx="197.1" cy="64.1" r="1.4"/><circle cx="196.1" cy="140.8" r="1.4"/><circle cx="195.5" cy="151.7" r="1.4"/><circle cx="196.9" cy="164.2" r="1.4"/><circle cx="195.4" cy="175.9" r="1.4"/><circle cx="195.2" cy="184.2" r="1.4"/><circle cx="195.3" cy="195.3" r="1.4"/><circle cx="196.8" cy="209.3" r="1.4"/><circle cx="207.7" cy="140.4" r="1.4"/><circle cx="206.4" cy="152.3" r="1.4"/><circle cx="206.7" cy="164.1" r="1.4"/><circle cx="209.5" cy="176.7" r="1.4"/><circle cx="209.6" cy="184.5" r="1.4"/><circle cx="209.3" cy="196.8" r="1.4"/><circle cx="220.4" cy="152" r="1.4"/><circle cx="220.7" cy="164.3" r="1.4"/><circle cx="220.8" cy="175.9" r="1.4"/><circle cx="220.9" cy="185.5" r="1.4"/><circle cx="231.2" cy="151.2" r="1.4"/><circle cx="230.5" cy="164.9" r="1.4"/><circle cx="228.2" cy="176.5" r="1.4"/><circle cx="229.7" cy="184.1" r="1.4"/><circle cx="286.6" cy="53.1" r="1.4"/><circle cx="285.7" cy="66.4" r="1.4"/><circle cx="286.2" cy="77.7" r="1.4"/><circle cx="284.2" cy="121.1" r="1.4"/><circle cx="283.7" cy="129.3" r="1.4"/><circle cx="283.3" cy="141.9" r="1.4"/><circle cx="295.3" cy="53.3" r="1.4"/><circle cx="294.7" cy="66.8" r="1.4"/><circle cx="295.5" cy="77" r="1.4"/><circle cx="295.4" cy="109.4" r="1.4"/><circle cx="295" cy="121.2" r="1.4"/><circle cx="294.4" cy="130.7" r="1.4"/><circle cx="294.8" cy="141.5" r="1.4"/><circle cx="297" cy="154.7" r="1.4"/><circle cx="306.3" cy="52.6" r="1.4"/><circle cx="305.3" cy="66.7" r="1.4"/><circle cx="308.5" cy="77.2" r="1.4"/><circle cx="308.6" cy="96.9" r="1.4"/><circle cx="308.2" cy="110.8" r="1.4"/><circle cx="308.4" cy="121.9" r="1.4"/><circle cx="307.2" cy="130.8" r="1.4"/><circle cx="307" cy="140.8" r="1.4"/><circle cx="307.1" cy="154" r="1.4"/><circle cx="307.2" cy="165.2" r="1.4"/><circle cx="318.9" cy="52.2" r="1.4"/><circle cx="318.8" cy="65.3" r="1.4"/><circle cx="318.9" cy="77" r="1.4"/><circle cx="318.6" cy="97.5" r="1.4"/><circle cx="319.6" cy="109.7" r="1.4"/><circle cx="318.9" cy="121.3" r="1.4"/><circle cx="318.2" cy="130.5" r="1.4"/><circle cx="319.8" cy="140.6" r="1.4"/><circle cx="316.4" cy="153.3" r="1.4"/><circle cx="316.9" cy="164.6" r="1.4"/><circle cx="317.8" cy="174.8" r="1.4"/><circle cx="329.9" cy="52.8" r="1.4"/><circle cx="329.2" cy="65" r="1.4"/><circle cx="328.5" cy="76.6" r="1.4"/><circle cx="327.3" cy="97.1" r="1.4"/><circle cx="328.6" cy="110.2" r="1.4"/><circle cx="327" cy="120.8" r="1.4"/><circle cx="328.1" cy="130.1" r="1.4"/><circle cx="328.4" cy="141" r="1.4"/><circle cx="328.6" cy="154.7" r="1.4"/><circle cx="328.3" cy="165.6" r="1.4"/><circle cx="328.6" cy="173.6" r="1.4"/><circle cx="328.6" cy="187.7" r="1.4"/><circle cx="328.3" cy="197.2" r="1.4"/><circle cx="339.7" cy="52.2" r="1.4"/><circle cx="338" cy="67" r="1.4"/><circle cx="338.7" cy="76.2" r="1.4"/><circle cx="338.4" cy="96" r="1.4"/><circle cx="338.2" cy="109.3" r="1.4"/><circle cx="338.2" cy="121.4" r="1.4"/><circle cx="338.4" cy="129.8" r="1.4"/><circle cx="340.8" cy="143.7" r="1.4"/><circle cx="341.9" cy="154.7" r="1.4"/><circle cx="340.5" cy="162.9" r="1.4"/><circle cx="341" cy="174.7" r="1.4"/><circle cx="341.1" cy="187.8" r="1.4"/><circle cx="341.6" cy="198.8" r="1.4"/><circle cx="349.2" cy="53.4" r="1.4"/><circle cx="352.1" cy="66.9" r="1.4"/><circle cx="352.8" cy="76.8" r="1.4"/><circle cx="351.7" cy="100" r="1.4"/><circle cx="351.7" cy="109.4" r="1.4"/><circle cx="351.1" cy="118.2" r="1.4"/><circle cx="352" cy="129.8" r="1.4"/><circle cx="351.9" cy="143.9" r="1.4"/><circle cx="352.4" cy="153.9" r="1.4"/><circle cx="351.5" cy="163.7" r="1.4"/><circle cx="352.9" cy="175" r="1.4"/><circle cx="351.2" cy="186.8" r="1.4"/><circle cx="363.1" cy="65.4" r="1.4"/><circle cx="362.8" cy="75.5" r="1.4"/><circle cx="363.7" cy="85.1" r="1.4"/><circle cx="363.6" cy="118.8" r="1.4"/><circle cx="363.9" cy="130.7" r="1.4"/><circle cx="361.6" cy="142.6" r="1.4"/><circle cx="361.9" cy="153.8" r="1.4"/><circle cx="361.5" cy="163.7" r="1.4"/><circle cx="371.8" cy="74.2" r="1.4"/><circle cx="372.9" cy="85.1" r="1.4"/><circle cx="382.7" cy="66" r="1.4"/><circle cx="383.2" cy="75.8" r="1.4"/><circle cx="382.5" cy="86.7" r="1.4"/><circle cx="383.4" cy="99.4" r="1.4"/><circle cx="395.3" cy="65.5" r="1.4"/><circle cx="396.6" cy="74.5" r="1.4"/><circle cx="396.8" cy="86.4" r="1.4"/><circle cx="395.7" cy="98.7" r="1.4"/><circle cx="406.4" cy="54.9" r="1.4"/><circle cx="407.8" cy="66.6" r="1.4"/><circle cx="406.3" cy="74.9" r="1.4"/><circle cx="406.3" cy="86.5" r="1.4"/><circle cx="406.2" cy="99.6" r="1.4"/><circle cx="415.9" cy="54.2" r="1.4"/><circle cx="415.1" cy="66.8" r="1.4"/><circle cx="415.1" cy="75.5" r="1.4"/><circle cx="415.5" cy="85.4" r="1.4"/><circle cx="415.3" cy="99.5" r="1.4"/><circle cx="416.3" cy="110.6" r="1.4"/><circle cx="426.1" cy="42" r="1.4"/><circle cx="427.5" cy="54.5" r="1.4"/><circle cx="427.7" cy="64" r="1.4"/><circle cx="427.8" cy="74.3" r="1.4"/><circle cx="426.8" cy="88.4" r="1.4"/><circle cx="427" cy="99.7" r="1.4"/><circle cx="426.2" cy="108.8" r="1.4"/><circle cx="427.7" cy="118.4" r="1.4"/><circle cx="429.6" cy="132" r="1.4"/><circle cx="438" cy="31" r="1.4"/><circle cx="439" cy="43.4" r="1.4"/><circle cx="439.6" cy="55.2" r="1.4"/><circle cx="439.8" cy="64.5" r="1.4"/><circle cx="439.8" cy="76" r="1.4"/><circle cx="440.5" cy="88.5" r="1.4"/><circle cx="440.5" cy="98.4" r="1.4"/><circle cx="439.8" cy="108.9" r="1.4"/><circle cx="440.7" cy="118.8" r="1.4"/><circle cx="440.4" cy="132.2" r="1.4"/><circle cx="450.2" cy="31.7" r="1.4"/><circle cx="450.7" cy="44.6" r="1.4"/><circle cx="450.4" cy="54.7" r="1.4"/><circle cx="450.4" cy="65" r="1.4"/><circle cx="452" cy="74.4" r="1.4"/><circle cx="450.2" cy="88.2" r="1.4"/><circle cx="451.3" cy="99.2" r="1.4"/><circle cx="451.7" cy="108.5" r="1.4"/><circle cx="449" cy="119.9" r="1.4"/><circle cx="449.9" cy="132.9" r="1.4"/><circle cx="461.3" cy="30.4" r="1.4"/><circle cx="460.7" cy="43.9" r="1.4"/><circle cx="460.8" cy="54.1" r="1.4"/><circle cx="459.5" cy="63.4" r="1.4"/><circle cx="459.5" cy="74.9" r="1.4"/><circle cx="460" cy="87.7" r="1.4"/><circle cx="459.7" cy="98.7" r="1.4"/><circle cx="460" cy="107.5" r="1.4"/><circle cx="459.5" cy="118" r="1.4"/><circle cx="460.6" cy="131.1" r="1.4"/><circle cx="471.5" cy="31.6" r="1.4"/><circle cx="471" cy="44.8" r="1.4"/><circle cx="471.8" cy="54.1" r="1.4"/><circle cx="470.5" cy="64.7" r="1.4"/><circle cx="470.6" cy="74.6" r="1.4"/><circle cx="470.4" cy="88.5" r="1.4"/><circle cx="470.9" cy="98.3" r="1.4"/><circle cx="471.3" cy="107.8" r="1.4"/><circle cx="472.1" cy="118.1" r="1.4"/><circle cx="472.5" cy="132.7" r="1.4"/><circle cx="482.9" cy="31.5" r="1.4"/><circle cx="483.9" cy="43.5" r="1.4"/><circle cx="484.8" cy="56" r="1.4"/><circle cx="484.9" cy="63" r="1.4"/><circle cx="484.3" cy="74.1" r="1.4"/><circle cx="484.2" cy="87.3" r="1.4"/><circle cx="484.7" cy="99.5" r="1.4"/><circle cx="484.7" cy="108.1" r="1.4"/><circle cx="483" cy="119.8" r="1.4"/><circle cx="494.1" cy="30.4" r="1.4"/><circle cx="494.8" cy="43.7" r="1.4"/><circle cx="495.9" cy="54" r="1.4"/><circle cx="495.5" cy="64.9" r="1.4"/><circle cx="495.4" cy="75.4" r="1.4"/><circle cx="494.9" cy="87.7" r="1.4"/><circle cx="494.8" cy="99.9" r="1.4"/><circle cx="492.5" cy="107.1" r="1.4"/><circle cx="493.2" cy="185.2" r="1.4"/><circle cx="492.8" cy="195.9" r="1.4"/><circle cx="503.1" cy="31.2" r="1.4"/><circle cx="504.4" cy="44.2" r="1.4"/><circle cx="503.8" cy="53.3" r="1.4"/><circle cx="504.9" cy="63.5" r="1.4"/><circle cx="504.8" cy="76.1" r="1.4"/><circle cx="503.1" cy="88.2" r="1.4"/><circle cx="503.7" cy="96.7" r="1.4"/><circle cx="503.8" cy="176.5" r="1.4"/><circle cx="505.8" cy="184" r="1.4"/><circle cx="505.6" cy="197" r="1.4"/><circle cx="515.3" cy="33.8" r="1.4"/><circle cx="515.5" cy="43.2" r="1.4"/><circle cx="514.8" cy="52.9" r="1.4"/><circle cx="515.1" cy="64.6" r="1.4"/><circle cx="514.8" cy="77" r="1.4"/><circle cx="514.6" cy="87.8" r="1.4"/><circle cx="517.1" cy="176.4" r="1.4"/><circle cx="516" cy="184.1" r="1.4"/><circle cx="517.5" cy="196.4" r="1.4"/><circle cx="517.4" cy="209.6" r="1.4"/><circle cx="528.4" cy="33.3" r="1.4"/><circle cx="528" cy="44.3" r="1.4"/><circle cx="528.2" cy="52.5" r="1.4"/><circle cx="527.3" cy="64.8" r="1.4"/><circle cx="528.8" cy="76.8" r="1.4"/><circle cx="526.6" cy="176.3" r="1.4"/><circle cx="526.7" cy="185.9" r="1.4"/><circle cx="526.9" cy="196.8" r="1.4"/><circle cx="526.1" cy="209.7" r="1.4"/><circle cx="538.8" cy="32.5" r="1.4"/><circle cx="538.6" cy="43.5" r="1.4"/><circle cx="538.8" cy="52.8" r="1.4"/><circle cx="539.6" cy="63.4" r="1.4"/><circle cx="539.5" cy="77.7" r="1.4"/><circle cx="537.2" cy="176.4" r="1.4"/><circle cx="536.4" cy="184.4" r="1.4"/><circle cx="537.8" cy="196.5" r="1.4"/><circle cx="537.3" cy="209" r="1.4"/><circle cx="547.7" cy="33" r="1.4"/><circle cx="547.9" cy="43" r="1.4"/><circle cx="547.6" cy="53.7" r="1.4"/><circle cx="547.7" cy="64.1" r="1.4"/><circle cx="549.6" cy="198.5" r="1.4"/><circle cx="549.6" cy="208.8" r="1.4"/><circle cx="558.8" cy="44.8" r="1.4"/><circle cx="558.3" cy="52.7" r="1.4"/><circle cx="572.2" cy="44" r="1.4"/><circle cx="571.6" cy="52.1" r="1.4"/><circle cx="583.5" cy="42.6" r="1.4"/></g>
            {#each Object.entries(regionCoords) as [key, coords]}
              <circle class="region-dot" cx={coords[0]} cy={coords[1]} r="3" />
            {/each}
            {#each pulses as p (p.id)}
              <circle
                class="pulse-ring"
                cx={p.x}
                cy={p.y}
                r="3"
              />
            {/each}
          </svg>
        </div>

        {#if latest}
          <div class="map-readout">
            <span class="readout-region">{latest.region}</span>
            <span class="readout-ms">{latest.ms}ms</span>
            <span class="readout-ok">200 OK</span>
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
  .map-wrap {
    margin: 0.25rem 0 1rem;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.015);
  }
  .world-map {
    display: block;
    width: 100%;
    height: auto;
  }
  .map-dots :global(circle) {
    fill: rgba(255, 255, 255, 0.16);
  }
  .region-dot {
    fill: #818cf8;
  }
  .pulse-ring {
    fill: none;
    stroke: #22d3ee;
    stroke-width: 2;
    animation: pulseOut 1.5s ease-out forwards;
  }
  @keyframes pulseOut {
    from {
      r: 3;
      opacity: 0.9;
      stroke-width: 2;
    }
    to {
      r: 18;
      opacity: 0;
      stroke-width: 0.4;
    }
  }
  .map-readout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.7rem;
    color: #71717a;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.78rem;
  }
  .readout-region {
    color: #a5b4fc;
    text-transform: uppercase;
  }
  .readout-ms {
    color: #d4d4d8;
  }
  .readout-ok {
    color: #34d399;
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
    .pulse-ring {
      animation: none;
      opacity: 0;
    }
  }
</style>