import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __CE_ENV__?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const runtimeUrl = typeof window !== "undefined" ? window.__CE_ENV__?.VITE_SUPABASE_URL : "";
  const runtimeKey = typeof window !== "undefined" ? window.__CE_ENV__?.VITE_SUPABASE_ANON_KEY : "";
  const url = (import.meta.env.VITE_SUPABASE_URL || runtimeUrl || "").trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeKey || "").trim();
  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return cachedClient;
}

export function resetSupabaseClient(): void {
  cachedClient = null;
}

export const PAYMENT_PROOFS_BUCKET = "payment-proofs";