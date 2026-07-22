import { supabase } from "$lib/supabase";

export async function signup(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}

export async function requestPasswordReset(email) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
  });
}

export async function updatePassword(password) {
  return await supabase.auth.updateUser({ password });
}

export async function getSession() {
  return await supabase.auth.getSession();
}
