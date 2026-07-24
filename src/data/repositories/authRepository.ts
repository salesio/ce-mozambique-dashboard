/**
 * Auth repository — Backend Phase 2 (optional Supabase Auth pilot).
 *
 * Default: demo login (mock/local users, demo_password_hint only).
 * Real auth: only when VITE_ENABLE_SUPABASE + VITE_ENABLE_REAL_AUTH + env ready.
 *
 * Never stores real passwords. Never uses service role.
 */
import { getBackendFeatureFlags, getDataSource } from "../config";
import {
  getSupabaseAuthStatus,
  isSupabaseAuthEnabled,
  resetPassword as sbResetPassword,
  signInWithEmailPassword,
  signOut as sbSignOut,
  getSession as sbGetSession,
  getCurrentAuthUser,
} from "../adapters/supabase/supabaseAuthClient";
import { getSupabaseEnvConfig } from "../adapters/supabase/supabaseConfig";
import type { User, AccessPermission } from "../types/entities";
import type { DataResult } from "../types/repository";
import {
  createAuditLog,
  getPermissionsByRole,
  getUserByAuthUserId,
  getUserByEmail,
  linkAuthUserToUser,
  ensureAccessControlSeeded,
  listUsers,
  markUserLastLogin,
  normalizeUser,
  updateUserAuthStatus,
} from "./accessControlRepository";

export type AuthMode = "demo" | "supabase";

export type AuthAccount = User & {
  permissions?: AccessPermission[] | Array<Record<string, unknown>> | null;
  auth_mode?: AuthMode;
};

export type AuthInfo = {
  mode: AuthMode;
  realAuthEnabled: boolean;
  supabaseEnabled: boolean;
  supabaseConfigured: boolean;
  dataSource: string;
  message: string;
  message_pt?: string;
  message_en?: string;
};

export type LoginResult = DataResult<AuthAccount> & {
  linked?: boolean;
  auth_user_id?: string | null;
};

let currentAccount: AuthAccount | null = null;

function fail<T>(error: string, code = "AUTH_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}

function softAudit(action: string, payload: Record<string, unknown> = {}): void {
  try {
    void createAuditLog({
      action,
      module: "auth",
      entity_type: "user",
      entity_id: String(payload.entity_id || payload.user_id || ""),
      entity_label: String(payload.email || payload.user_name || ""),
      description: String(payload.description || action),
      severity: String(payload.severity || "info"),
      user_id: (payload.user_id as string) || null,
      user_name: String(payload.user_name || ""),
      user_role: String(payload.user_role || ""),
      metadata: payload,
    });
  } catch {
    /* soft */
  }
  try {
    const root = globalThis as typeof globalThis & {
      recordAuditLog?: (a: string, p?: Record<string, unknown>) => void;
    };
    root.recordAuditLog?.(action, { module: "auth", ...payload });
  } catch {
    /* soft */
  }
}

export function isRealAuthEnabled(): boolean {
  return isSupabaseAuthEnabled();
}

export function getAuthInfo(): AuthInfo {
  const flags = getBackendFeatureFlags();
  const cfg = getSupabaseEnvConfig();
  const status = getSupabaseAuthStatus();
  const real = isSupabaseAuthEnabled();
  return {
    mode: real ? "supabase" : "demo",
    realAuthEnabled: real,
    supabaseEnabled: flags.enableSupabase,
    supabaseConfigured: cfg.isConfigured,
    dataSource: getDataSource(),
    message: status.message,
    message_pt:
      "message_pt" in status
        ? (status as { message_pt?: string }).message_pt
        : real
          ? "Autenticação Supabase activa (piloto Users/Roles)."
          : "Modo demo. Autenticação real desactivada.",
    message_en: real
      ? "Supabase Auth enabled (Users/Roles pilot)."
      : status.status === "missing_env"
        ? "Real authentication is not configured. Check Supabase environment variables."
        : "Demo mode. Real authentication is disabled.",
  };
}

async function attachPermissions(user: User): Promise<AuthAccount> {
  const account = normalizeUser(user) as AuthAccount;
  if (account.role_id) {
    const perms = await getPermissionsByRole(account.role_id);
    if (perms.ok && perms.data?.length) {
      account.permissions = perms.data as AccessPermission[];
    }
  }
  return account;
}

/**
 * Resolve app user from Supabase Auth user.
 * Links by email when auth_user_id is still null (pilot helper).
 */
export async function resolveUserAccountFromAuth(authUser: {
  id: string;
  email?: string | null;
}): Promise<LoginResult> {
  const authId = String(authUser?.id || "").trim();
  if (!authId) return fail("Invalid auth user", "AUTH_INVALID");

  let linked = false;
  let byAuth = await getUserByAuthUserId(authId);
  if (!byAuth.ok) return byAuth as LoginResult;

  let user = byAuth.data;
  if (!user && authUser.email) {
    const byEmail = await getUserByEmail(authUser.email);
    if (!byEmail.ok) return byEmail as LoginResult;
    if (byEmail.data) {
      if (!byEmail.data.auth_user_id) {
        const link = await linkAuthUserToUser(byEmail.data.id, authId);
        if (link.ok && link.data) {
          user = link.data;
          linked = true;
          softAudit("auth_user_linked", {
            user_id: user.id,
            email: user.email,
            user_name: user.full_name || user.name,
            user_role: user.role_name || user.role,
            auth_user_id: authId,
            description: "Linked Supabase Auth id to app user by email",
          });
        } else {
          user = byEmail.data;
        }
      } else if (byEmail.data.auth_user_id !== authId) {
        softAudit("auth_login_failed", {
          email: authUser.email,
          description: "Email user already linked to a different auth id",
          severity: "warning",
        });
        return fail(
          "Esta conta de email já está ligada a outro utilizador Auth.",
          "AUTH_LINK_CONFLICT",
        );
      } else {
        user = byEmail.data;
      }
    }
  }

  if (!user) {
    softAudit("auth_user_not_provisioned", {
      email: authUser.email || "",
      auth_user_id: authId,
      description: "Supabase Auth user has no matching app users row",
      severity: "warning",
    });
    return fail(
      "User account not provisioned. Contact an administrator to link your Auth user.",
      "AUTH_NOT_PROVISIONED",
    );
  }

  if (/lock|bloque/i.test(String(user.status || "")) || user.has_dashboard_access === false) {
    softAudit("auth_access_denied", {
      user_id: user.id,
      email: user.email,
      description: "User locked or without dashboard access",
      severity: "warning",
    });
    return fail("Conta bloqueada ou sem acesso ao dashboard.", "AUTH_LOCKED");
  }

  await markUserLastLogin(user.id);
  const account = await attachPermissions(user);
  account.auth_mode = "supabase";
  account.auth_user_id = authId;
  currentAccount = account;
  return { ok: true, data: account, linked, auth_user_id: authId };
}

export async function refreshCurrentUserPermissions(): Promise<DataResult<AuthAccount | null>> {
  if (!currentAccount?.id) return ok(null);
  const byId = await getUserByAuthUserId(currentAccount.auth_user_id || "");
  let user = byId.ok ? byId.data : null;
  if (!user) {
    const listed = await listUsers();
    if (listed.ok) user = listed.data.find((u) => u.id === currentAccount!.id) || null;
  }
  if (!user) return ok(null);
  const account = await attachPermissions(user);
  account.auth_mode = currentAccount.auth_mode || "demo";
  currentAccount = account;
  return ok(account);
}

export async function loginDemo(
  email: string,
  passwordOrHint = "demo",
): Promise<LoginResult> {
  const emailNorm = String(email || "").trim().toLowerCase();
  if (!emailNorm) return fail("Email obrigatório", "VALIDATION");

  try {
    await ensureAccessControlSeeded();
  } catch {
    /* soft */
  }

  const listed = await listUsers();
  if (!listed.ok) return listed as LoginResult;
  const user =
    listed.data.find((u) => String(u.email || "").trim().toLowerCase() === emailNorm) || null;

  if (!user) {
    softAudit("auth_login_failed", {
      email: emailNorm,
      description: "Demo login: user not found",
      severity: "warning",
    });
    return fail("Utilizador demo não encontrado.", "AUTH_DEMO_NOT_FOUND");
  }

  if (/lock|bloque/i.test(String(user.status || ""))) {
    softAudit("auth_access_denied", {
      user_id: user.id,
      email: user.email,
      description: "Demo login: locked user",
      severity: "warning",
    });
    return fail("Conta bloqueada (demo).", "AUTH_LOCKED");
  }

  const hint = String(user.demo_password_hint || "demo").trim();
  const pass = String(passwordOrHint || "").trim();
  // Demo accepts: empty, "demo", or matching hint — never real password storage
  if (pass && pass !== hint && pass !== "demo") {
    const attempts = Number(user.failed_login_attempts || 0) + 1;
    await updateUserAuthStatus(user.id, { failed_login_attempts: attempts });
    softAudit("auth_login_failed", {
      user_id: user.id,
      email: user.email,
      description: "Demo login: wrong password hint",
      severity: "warning",
    });
    return fail("Senha demo incorrecta. Use a senha de demonstração.", "AUTH_DEMO_BAD_PASSWORD");
  }

  await markUserLastLogin(user.id);
  const account = await attachPermissions(user);
  account.auth_mode = "demo";
  currentAccount = account;
  softAudit("auth_login_success", {
    user_id: user.id,
    email: user.email,
    user_name: user.full_name || user.name,
    user_role: user.role_name || user.role,
    description: "Demo login success",
  });
  return ok(account);
}

export async function loginWithSupabase(
  email: string,
  password: string,
): Promise<LoginResult> {
  const info = getAuthInfo();
  if (!info.realAuthEnabled) {
    // Soft path: if flags say "want real" but misconfigured, surface friendly error
    const flags = getBackendFeatureFlags();
    if (flags.enableRealAuth) {
      softAudit("auth_login_failed", {
        email,
        description: info.message_en || info.message,
        severity: "warning",
      });
      return fail(
        info.message_pt ||
          "Autenticação real não está configurada. Verifique as variáveis Supabase.",
        "AUTH_NOT_CONFIGURED",
      );
    }
    return loginDemo(email, password);
  }

  const signed = await signInWithEmailPassword(email, password);
  if (!signed.ok) {
    softAudit("auth_login_failed", {
      email,
      description: signed.error,
      severity: "warning",
    });
    return fail(signed.error, signed.code || "AUTH_SIGN_IN_FAILED");
  }

  const resolved = await resolveUserAccountFromAuth({
    id: signed.data.user.id,
    email: signed.data.user.email || email,
  });
  if (!resolved.ok) return resolved;

  softAudit("auth_login_success", {
    user_id: resolved.data.id,
    email: resolved.data.email,
    user_name: resolved.data.full_name || resolved.data.name,
    user_role: resolved.data.role_name || resolved.data.role,
    auth_user_id: signed.data.user.id,
    description: "Supabase Auth login success",
  });
  return resolved;
}

/** Unified login: real auth when enabled, otherwise demo. */
export async function login(email: string, password: string): Promise<LoginResult> {
  if (isRealAuthEnabled() || getBackendFeatureFlags().enableRealAuth) {
    return loginWithSupabase(email, password);
  }
  return loginDemo(email, password);
}

export async function logout(): Promise<DataResult<true>> {
  const prev = currentAccount;
  if (isRealAuthEnabled()) {
    await sbSignOut();
  }
  currentAccount = null;
  softAudit("auth_logout", {
    user_id: prev?.id,
    email: prev?.email,
    user_name: prev?.full_name || prev?.name,
    user_role: prev?.role_name || prev?.role,
    description: "User logged out",
  });
  return ok(true);
}

export async function getCurrentSession(): Promise<
  DataResult<{ mode: AuthMode; session: unknown; account: AuthAccount | null }>
> {
  if (!isRealAuthEnabled()) {
    return ok({ mode: "demo", session: null, account: currentAccount });
  }
  const session = await sbGetSession();
  if (!session.ok) return fail(session.error, session.code);
  return ok({ mode: "supabase", session: session.data, account: currentAccount });
}

export function getCurrentUserAccount(): AuthAccount | null {
  return currentAccount;
}

export async function requestPasswordReset(email: string): Promise<DataResult<true>> {
  const result = await sbResetPassword(email);
  softAudit("auth_password_reset_requested", {
    email,
    description: result.ok ? "Password reset email requested" : result.error,
    severity: result.ok ? "info" : "warning",
  });
  if (!result.ok) return fail(result.error, result.code);
  return ok(true);
}

export async function ensureAuthSeeded(): Promise<DataResult<true>> {
  // Users/roles live in accessControl seeds — no-op marker for pilots
  return ok(true);
}

export function getAuthDataSourceInfo() {
  return {
    ...getAuthInfo(),
    pilot: "auth-users-roles-v1",
    phase: 2,
  };
}

// Re-export for callers that need the low-level probe
export { getCurrentAuthUser, isSupabaseAuthEnabled };
