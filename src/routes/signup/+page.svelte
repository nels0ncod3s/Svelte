<script>
    import { signup } from "$lib/services/auth";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let confirmPassword = "";
    let error = "";
    let loading = false;

    async function createAccount() {
        error = "";

        if (password !== confirmPassword) {
            error = "Passwords do not match.";
            return;
        }

        loading = true;

        const { error: signupError } = await signup(email, password);

        loading = false;

        if (signupError) {
            error = signupError.message;
            return;
        }

        goto("/dashboard");
    }
</script>

<h1>Create Account</h1>

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

<input
    type="password"
    placeholder="Confirm Password"
    bind:value={confirmPassword}
/>

<button on:click={createAccount} disabled={loading}>
    {loading ? "Creating..." : "Create Account"}
</button>

{#if error}
<p style="color:red;">{error}</p>
{/if}

<p>
    Already have an account?

    <a href="/login">
        Login
    </a>
</p>