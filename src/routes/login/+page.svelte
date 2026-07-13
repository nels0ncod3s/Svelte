<script>
    import { login } from "$lib/services/auth";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function signIn() {
        error = "";

        loading = true;

        const { error: loginError } = await login(email, password);

        loading = false;

        if (loginError) {
            error = loginError.message;
            return;
        }

        goto("/dashboard");
    }
</script>

<h1>Login</h1>

<input
    type="email"
    placeholder="Email"
    bind:value={email}
/>

<input
    type="password"
    placeholder="Password"
    bind:value={password}
/>

<button on:click={signIn} disabled={loading}>
    {loading ? "Signing in..." : "Login"}
</button>

{#if error}
<p style="color:red;">{error}</p>
{/if}

<p>
    Don't have an account?

    <a href="/signup">
        Sign up
    </a>
</p>