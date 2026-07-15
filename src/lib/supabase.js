// src/lib/supabase.js
import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)


/*
import { createClient} from "@supabase/supabase-js";
import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
} from "$env/static/public";

export const supabase = createClient (
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
);
*/