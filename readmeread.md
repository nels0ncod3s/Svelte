# Auth-as-a-Service

A lightweight, drop-in authentication service for your applications. Supports email/password, social login (Google, GitHub, etc.), session management, and role-based access control — without the complexity of building auth from scratch.

---

## Features

| Feature | Status |
|---------|--------|
| Email & password authentication | ✅ |
| Social login (Google, GitHub) | ✅ |
| Magic link / passwordless | ✅ |
| JWT session management | ✅ |
| Refresh token rotation | ✅ |
| Role-based access control (RBAC) | ✅ |
| Email verification | ✅ |
| Password reset flow | ✅ |
| Multi-tenant organization support | 🚧 |
| MFA / 2FA | 🚧 |

---

## Quick Start

### 1. Install

```bash
npm install @your-org/auth-service
# or
pnpm add @your-org/auth-service
```

### 2. Initialize

```typescript
import { createAuthClient } from "@your-org/auth-service";

const auth = createAuthClient({
  baseUrl: "https://auth.yourapp.com",
  apiKey: process.env.AUTH_API_KEY,
});
```

### 3. Sign up a user

```typescript
const { user, session, error } = await auth.signUp({
  email: "user@example.com",
  password: "secure-password-123",
});

if (error) {
  console.error(error.message);
} else {
  // Send user to dashboard
  redirect("/dashboard");
}
```

### 4. Sign in

```typescript
const { user, session } = await auth.signInWithPassword({
  email: "user@example.com",
  password: "secure-password-123",
});
```

### 5. Protect a route

```typescript
// Express middleware example
import { requireAuth } from "@your-org/auth-service/express";

app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});
```

---

## Social Login

### Google OAuth

```typescript
const { data, error } = await auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: "https://yourapp.com/auth/callback",
  },
});

// Redirect user to data.url
window.location.href = data.url;
```

### Supported Providers

- Google
- GitHub
- Microsoft
- Apple
- Twitter / X

---

## Session Management

Sessions are handled via JWT access tokens (short-lived) and refresh tokens (long-lived, HTTP-only cookie).

### Get current session

```typescript
const { data: { session } } = await auth.getSession();
```

### Refresh session

```typescript
const { data: { session } } = await auth.refreshSession();
```

### Sign out

```typescript
await auth.signOut();
```

---

## Role-Based Access Control

Assign roles to users and check permissions server-side.

```typescript
// Assign role
await auth.setRole(userId, "admin");

// Check permission
const { data: { roles } } = await auth.getUserRoles(userId);

if (roles.includes("admin")) {
  // Grant access to admin panel
}
```

### Default Roles

| Role | Description |
|------|-------------|
| `user` | Standard authenticated user |
| `admin` | Full administrative access |
| `editor` | Can create and modify content |
| `viewer` | Read-only access |

---

## Email Flows

### Verify email

```typescript
await auth.resendVerificationEmail("user@example.com");
```

### Reset password

```typescript
// Request reset link
await auth.resetPasswordForEmail("user@example.com", {
  redirectTo: "https://yourapp.com/auth/reset-password",
});

// Update password with token
await auth.updateUser({ password: "new-password-456" });
```

---

## Framework Integrations

### SvelteKit

```svelte
<!-- +layout.svelte -->
<script>
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });
    return () => data.subscription.unsubscribe();
  });
</script>

{@render children?.()}
```

```typescript
// +layout.ts
import { createBrowserClient, createServerClient, isBrowser } from "@supabase/ssr";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = isBrowser()
    ? createBrowserClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { global: { fetch } }
      )
    : createServerClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          global: { fetch },
          cookies: { getAll: () => data.cookies },
        }
      );

  const { data: { session } } = await supabase.auth.getSession();
  return { supabase, session };
};
```

### Next.js

```typescript
// middleware.ts
import { createMiddlewareClient } from "@your-org/auth-service/nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const auth = createMiddlewareClient({ req, res });
  const { data: { session } } = await auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
```

### Express

```typescript
import { createAuthMiddleware } from "@your-org/auth-service/express";

app.use(createAuthMiddleware({ apiKey: process.env.AUTH_API_KEY }));
```

---

## API Reference

### Client Methods

| Method | Description |
|--------|-------------|
| `auth.signUp(credentials)` | Register a new user |
| `auth.signInWithPassword(credentials)` | Sign in with email/password |
| `auth.signInWithOAuth({ provider })` | Sign in with social provider |
| `auth.signOut()` | End the current session |
| `auth.getSession()` | Get the current session |
| `auth.refreshSession()` | Refresh the access token |
| `auth.updateUser(attributes)` | Update user profile |
| `auth.resetPasswordForEmail(email)` | Send password reset link |
| `auth.resendVerificationEmail(email)` | Resend verification email |
| `auth.getUserRoles(userId)` | Get user roles |
| `auth.setRole(userId, role)` | Assign a role |

### Server Methods

| Method | Description |
|--------|-------------|
| `auth.verifyToken(token)` | Verify a JWT access token |
| `auth.createUser(credentials)` | Create a user server-side |
| `auth.deleteUser(userId)` | Delete a user |
| `auth.listUsers(query)` | List and filter users |
| `auth.inviteUserByEmail(email)` | Send organization invite |

---

## Configuration

```typescript
const auth = createAuthClient({
  baseUrl: "https://auth.yourapp.com",
  apiKey: process.env.AUTH_API_KEY,

  // Optional
  cookieOptions: {
    name: "auth_session",
    lifetime: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure: true,
  },

  jwt: {
    accessTokenLifetime: 60 * 15, // 15 minutes
    refreshTokenLifetime: 60 * 60 * 24 * 7, // 7 days
  },

  mfa: {
    enabled: false,
    issuer: "Your App",
  },
});
```

---

## Security

- **Password hashing**: Argon2id with configurable memory and iteration params
- **Token storage**: Access tokens in memory, refresh tokens in HTTP-only cookies
- **CSRF protection**: Double-submit cookie pattern
- **Rate limiting**: Built-in per-IP and per-user rate limits on auth endpoints
- **Audit logging**: All sign-in attempts, password changes, and role updates are logged

---

## Self-Hosting

Deploy your own auth instance with Docker:

```yaml
# docker-compose.yml
version: "3.8"
services:
  auth:
    image: your-org/auth-service:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/auth
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - API_KEY=${API_KEY}
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: auth
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `API_KEY` | ✅ | Admin API key |
| `SMTP_HOST` | ❌ | SMTP server for emails |
| `SMTP_USER` | ❌ | SMTP username |
| `SMTP_PASS` | ❌ | SMTP password |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | ❌ | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ❌ | GitHub OAuth client secret |

---

## Contributing

```bash
git clone https://github.com/your-org/auth-service.git
cd auth-service
pnpm install
pnpm dev
```

Run tests:

```bash
pnpm test
pnpm test:integration
```

---

## License

MIT © [Your Organization](https://your-org.com)
