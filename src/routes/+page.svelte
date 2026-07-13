<script>

  import Button from "$lib/components/ui/button/button.svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";


  const features = [
    {
      title: "Passwordless Login",
      description: "Authenticate users with magic links, OTPs, or social providers."
    },
    {
      title: "Social Authentication",
      description: "Connect Google, GitHub, Apple, and more with minimal setup."
    },
    {
      title: "Developer First",
      description: "Simple SDKs, REST APIs, and clean documentation."
    }
  ];
</script>

<svelte:head>
  <title>First Layer - Auth0 alternative</title>
  <meta
    name="description"
    content="Authentication infrastructure without the complexity."
  />
</svelte:head>

<section class="hero">
  <nav>
    <div class="logo">First Layer</div>

    <div class="links">
      <a href="#features">Features</a>
      <a href="#docs">Docs</a>
      <a href="#pricing">Pricing</a>
      <a href="#changelog">Changelog</a>
      <Button class="login"><a href="/login" class="login">Login</a></Button>
    </div>
  </nav>

  <div class="content">
    <div class="left">

      <Badge>Authentication made easy</Badge>

      <span class="badge">
        Authentication made simple
      </span>

      <h1>
        Add secure authentication
        <span>in minutes.</span>
      </h1>

      <p>
        Passwordless login, social authentication, session management,
        and user management in one lightweight platform.
      </p>

      <div class="buttons">
      <button class="primary"><a href="/signup" class="primary">
          Get Started
        </a></button>
      <button class="secondary">Read Docs</button>

        

        <a href="/docs" class="secondary">
          Read Docs
        </a>
      </div>

      <div class="stats">
        <div>
          <h3>5 min</h3>
          <p>Average integration</p>
        </div>

        <div>
          <h3>99.99%</h3>
          <p>API uptime</p>
        </div>

        <div>
          <h3>20+</h3>
          <p>Providers</p>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="window">
        <div class="window-header">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="code">

<pre>{`import { auth } from "simpleauth";

await auth.login({
  provider: "google"
});`}
</pre>

          <button>Continue with Google</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="features" class="features">
  <h2>Everything you need</h2>

  <div class="grid">
    {#each features as feature}
      <article>
        <div class="icon">🔐</div>

        <h3>{feature.title}</h3>

        <p>{feature.description}</p>
      </article>
    {/each}
  </div>
</section>

<style>
  :global(body) {
    margin: 0;
    font-family:
      Inter,
      system-ui,
      sans-serif;
    background: #09090b;
    color: white;
  }

  .hero {
    min-height: 100vh;
    padding: 2rem 7%;
    background:
      radial-gradient(circle at top, #312e81 0%, transparent 45%),
      #09090b;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .links a {
    color: #d4d4d8;
    text-decoration: none;
  }

  .login {
    padding: .7rem 1.3rem;
    border: 1px solid #3f3f46;
    border-radius: 10px;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px,1fr));
    gap: 5rem;
    align-items: center;
    margin-top: 6rem;
  }

  .badge {
    display: inline-block;
    padding: .45rem 1rem;
    background: rgba(99,102,241,.15);
    border: 1px solid rgba(99,102,241,.35);
    border-radius: 999px;
    color: #a5b4fc;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: clamp(3rem,6vw,5rem);
    line-height: 1.05;
    margin: 0;
  }

  h1 span {
    color: #818cf8;
  }

  .left p {
    color: #a1a1aa;
    font-size: 1.1rem;
    max-width: 550px;
    margin: 2rem 0;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }

  .primary,
  .secondary {
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
  }

  .primary {
    background: #6366f1;
    color: white;
  }

  .secondary {
    border: 1px solid #3f3f46;
    color: white;
  }

  .stats {
    display: flex;
    gap: 3rem;
    margin-top: 4rem;
  }

  .stats h3 {
    margin: 0;
    font-size: 2rem;
  }

  .stats p {
    margin: .5rem 0 0;
    color: #71717a;
    font-size: .9rem;
  }

  .window {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,.35);
  }

  .window-header {
    display: flex;
    gap: .5rem;
    padding: 1rem;
    border-bottom: 1px solid #27272a;
  }

  .window-header span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #52525b;
  }

  .code {
    padding: 2rem;
  }

  pre {
    color: #d4d4d8;
    overflow-x: auto;
  }

  button {
    width: 100%;
    margin-top: 2rem;
    padding: 1rem;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
  }

  .features {
    padding: 6rem 7%;
    background: #111113;
  }

  .features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 2rem;
  }

  article {
    background: #18181b;
    border: 1px solid #27272a;
    padding: 2rem;
    border-radius: 18px;
    transition: .2s;
  }

  article:hover {
    transform: translateY(-6px);
    border-color: #6366f1;
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  article p {
    color: #a1a1aa;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .links {
      display: none;
    }

    .stats {
      flex-direction: column;
      gap: 1.5rem;
    }
  }
</style>