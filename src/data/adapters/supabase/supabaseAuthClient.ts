/**
 * Supabase Auth client (Backend Phase 2 pilot).
 * Anon key only — NEVER use SUPABASE_SERVICE_ROLE_KEY.
 * Safe when env/flags disabled: controlled errors, no build break.
 */
import type { AuthChangeEvent, Session, User as SupabaseAuthUser } from "@supabase/supabase-js";
import { getSupabaseFoundationClient } from "./supabaseClient";
import { getSupabaseEnvConfig } from "./supabaseConfig";

export type AuthClientResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

function fail<T>(error: string, code = "AUTH_DISABLED"): AuthClientResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): AuthClientResult<T> {
  return { ok: true, data };
}

export function isSupabaseAuthEnabled(): boolean {
  const cfg = getSupabaseEnvConfig();
  return cfg.enableSupabase && cfg.enableRealAuth && cfg.isConfigured;
}

export function getSupabaseAuthClient() {
  if (!isSupabaseAuthEnabled()) return null;
  return getSupabaseFoundationClient();
}

export function getSupabaseAuthStatus() {
  const cfg = getSupabaseEnvConfig();
  if (!cfg.enableRealAuth) {
    return {
      enabled: false,
      status: "demo" as const,
      message:
        "Real auth disabled (VITE_ENABLE_REAL_AUTH!=true). Demo login is active.",
    };
  }
  if (!cfg.enableSupabase) {
    return {
      enabled: false,
      status: "missing_flag" as const,
      message:
        "VITE_ENABLE_REAL_AUTH=true but VITE_ENABLE_SUPABASE is false.",
    };
  }
  if (!cfg.isConfigured) {
    return {
      enabled: false,
      status: "missing_env" as const,
      message:
        "Real authentication is not configured. Check Supabase environment variables.",
      message_pt:
        "Autenticação real não está configurada. Verifique as variáveis Supabase.",
    };
  }
  return {
    enabled: true,
    status: "ready" as const,
    message: "Supabase Auth pilot ready (Users/Roles only).",
  };
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthClientResult<{ user: SupabaseAuthUser; session: Session }>> {
  const status = getSupabaseAuthStatus();
  if (!status.enabled) {
    return fail(
      status.message_pt || status.message,
      status.status === "missing_env" ? "AUTH_NOT_CONFIGURED" : "AUTH_DISABLED",
    );
  }
  const client = getSupabaseAuthClient();
  if (!client) {
    return fail(
      "Autenticação real não está configurada. Verifique as variáveis Supabase.",
      "AUTH_NOT_CONFIGURED",
    );
  }
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: String(email || "").trim(),
      password: String(password || ""),
    });
    if (error) return fail(error.message, "AUTH_SIGN_IN_FAILED");
    if (!data.user || !data.session) {
      return fail("Sessão inválida após login.", "AUTH_NO_SESSION");
    }
    return ok({ user: data.user, session: data.session });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "signIn failed", "AUTH_ERROR");
  }
}

export async function signOut(): Promise<AuthClientResult<true>> {
  const client = getSupabaseAuthClient();
  if (!client) {
    // Demo mode: nothing remote to clear
    return ok(true);
  }
  try {
    const { error } = await client.auth.signOut();
    if (error) return fail(error.message, "AUTH_SIGN_OUT_FAILED");
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "signOut failed");
  }
}

export async function getCurrentAuthUser(): Promise<
  AuthClientResult<SupabaseAuthUser | null>
> {
  const client = getSupabaseAuthClient();
  if (!client) return ok(null);
  try {
    const { data, error } = await client.auth.getUser();
    if (error) return fail(error.message, "AUTH_GET_USER_FAILED");
    return ok(data.user ?? null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCurrentAuthUser failed");
  }
}

export async function getSession(): Promise<AuthClientResult<Session | null>> {
  const client = getSupabaseAuthClient();
  if (!client) return ok(null);
  try {
    const { data, error } = await client.auth.getSession();
    if (error) return fail(error.message, "AUTH_GET_SESSION_FAILED");
    return ok(data.session ?? null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getSession failed");
  }
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): { data: { subscription: { unsubscribe: () => void } } } | null {
  const client = getSupabaseAuthClient();
  if (!client) return null;
  return client.auth.onAuthStateChange(callback);
}

export async function resetPassword(email: string): Promise<AuthClientResult<true>> {
  const status = getSupabaseAuthStatus();
  if (!status.enabled) {
    return fail(
      status.message_pt || status.message,
      status.status === "missing_env" ? "AUTH_NOT_CONFIGURED" : "AUTH_DISABLED",
    );
  }
  const client = getSupabaseAuthClient();
  if (!client) {
    return fail(
      "Autenticação real não está configurada. Verifique as variáveis Supabase.",
      "AUTH_NOT_CONFIGURED",
    );
  }
  try {
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
    const { error } = await client.auth.resetPasswordForEmail(String(email || "").trim(), {
      redirectTo,
    });
    if (error) return fail(error.message, "AUTH_RESET_FAILED");
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "resetPassword failed");
  }
}

export async function updatePassword(
  newPassword: string,
): Promise<AuthClientResult<true>> {
  const client = getSupabaseAuthClient();
  if (!client) {
    return fail(
      "Autenticação real não está configurada. Verifique as variáveis Supabase.",
      "AUTH_NOT_CONFIGURED",
    );
  }
  try {
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) return fail(error.message, "AUTH_UPDATE_PASSWORD_FAILED");
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePassword failed");
  }
}
