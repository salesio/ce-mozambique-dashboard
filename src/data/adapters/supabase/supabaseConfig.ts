/**
 * Supabase config for data-layer foundation.
 * Public anon key only — never service role.
 */

export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
  enableSupabase: boolean;
  enableRealAuth: boolean;
  enableStorage: boolean;
  enableRls: boolean;
  isConfigured: boolean;
}

function readEnv(name: string): string {
  try {
    const runtime =
      typeof window !== "undefined"
        ? (window as Window & { __CE_ENV__?: Record<string, string> }).__CE_ENV__?.[name]
        : undefined;
    // Vite replaces import.meta.env.VITE_* at build time
    const fromVite = (import.meta.env as Record<string, string | undefined>)[name];
    return String(runtime || fromVite || "").trim();
  } catch {
    return "";
  }
}

function flagTrue(name: string): boolean {
  return /^(1|true|yes|on)$/i.test(readEnv(name));
}

export function isLikelySupabaseUrl(url: string): boolean {
  if (!url) return false;
  if (/YOUR_PROJECT|YOUR_SUPABASE|example\.com|placeholder/i.test(url)) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co")) return true;
    // Local Supabase CLI / self-host (optional future)
    if (flagTrue("VITE_ENABLE_SUPABASE") && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getSupabaseEnvConfig(): SupabaseEnvConfig {
  const url = readEnv("VITE_SUPABASE_URL");
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY");
  const enableSupabase = flagTrue("VITE_ENABLE_SUPABASE");
  // isConfigured = env usable for a public client (URL+anon look valid).
  // enableSupabase still gates initialization in foundation client.
  const isConfigured = isLikelySupabaseUrl(url) && anonKey.length > 20;
  return {
    url,
    anonKey,
    enableSupabase,
    enableRealAuth: flagTrue("VITE_ENABLE_REAL_AUTH"),
    enableStorage: flagTrue("VITE_ENABLE_STORAGE"),
    enableRls: flagTrue("VITE_ENABLE_RLS"),
    isConfigured: enableSupabase && isConfigured,
  };
}

export function getSupabaseConnectionInfo() {
  const cfg = getSupabaseEnvConfig();
  let status: "disabled" | "missing_env" | "ready" = "disabled";
  let message = "Supabase disabled (VITE_ENABLE_SUPABASE!=true). Using mock/local data layer.";
  if (cfg.enableSupabase) {
    if (!cfg.url || !cfg.anonKey) {
      status = "missing_env";
      message = "VITE_ENABLE_SUPABASE=true but URL/anon key missing.";
    } else if (!cfg.isConfigured) {
      status = "missing_env";
      message = "Supabase env present but invalid/placeholder.";
    } else {
      status = "ready";
      message = "Supabase public client may initialize (modules still on mock/local until pilots).";
    }
  }
  let urlHost: string | undefined;
  try {
    if (cfg.url) urlHost = new URL(cfg.url).hostname;
  } catch {
    urlHost = undefined;
  }
  return {
    status,
    enabled: cfg.enableSupabase,
    hasUrl: !!cfg.url,
    hasAnonKey: !!cfg.anonKey,
    urlHost,
    usingServiceRole: false as const,
    message,
  };
}
