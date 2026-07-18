import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { createServerClient } from "@supabase/ssr";

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        },
      },
    },
  );

  // Memoized per request — dashboard/+layout.server.js AND
  // dashboard/[project]/+layout.server.js (and various actions) all call
  // safeGetSession() on the same navigation. Without this cache, that's
  // 2+ round trips to Supabase Auth's getUser() for a single click.
  // `cachedSession` is a variable inside this closure, which is recreated
  // fresh on every request — it never leaks across requests or users.
  let cachedSession;
  event.locals.safeGetSession = async () => {
    if (cachedSession) return cachedSession;

    // getSession() only reads the JWT from the cookie — it does not verify it.
    // getUser() re-checks the token against the Supabase Auth server, so use
    // that for anything that gates access to data.
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      cachedSession = { session: null, user: null };
      return cachedSession;
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      cachedSession = { session: null, user: null };
      return cachedSession;
    }

    cachedSession = { session, user };
    return cachedSession;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};