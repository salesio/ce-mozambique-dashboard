/**
 * Supabase Storage client — Phase 5 pilot.
 * Anon key only. NEVER use SUPABASE_SERVICE_ROLE_KEY.
 * finance-proofs must stay private (signed URLs, not public).
 */
import { getSupabaseFoundationClient } from "./supabaseClient";
import { getSupabaseEnvConfig } from "./supabaseConfig";

export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

function fail<T>(error: string, code = "STORAGE_DISABLED"): StorageResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): StorageResult<T> {
  return { ok: true, data };
}

export const FINANCE_PROOFS_BUCKET = "finance-proofs";
export const GENERAL_DOCUMENTS_BUCKET = "general-documents";

export function isSupabaseStorageEnabled(): boolean {
  const cfg = getSupabaseEnvConfig();
  return cfg.enableStorage && cfg.enableSupabase && cfg.isConfigured;
}

export function getStorageInfo() {
  const cfg = getSupabaseEnvConfig();
  const enabled = isSupabaseStorageEnabled();
  return {
    enabled,
    enableStorageFlag: cfg.enableStorage,
    supabaseReady: cfg.isConfigured,
    financeProofsBucket: FINANCE_PROOFS_BUCKET,
    financeProofsPublic: false as const,
    message: !cfg.enableStorage
      ? "Storage não está activado. Configure VITE_ENABLE_STORAGE=true para uploads reais. / Storage is not enabled. Set VITE_ENABLE_STORAGE=true for real uploads."
      : !cfg.isConfigured
        ? "Supabase não está configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
        : "Storage pilot ready (private buckets; signed URLs).",
  };
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options: { contentType?: string; upsert?: boolean } = {},
): Promise<StorageResult<{ path: string; bucket: string }>> {
  if (!isSupabaseStorageEnabled()) {
    return fail(getStorageInfo().message, "STORAGE_DISABLED");
  }
  const client = getSupabaseFoundationClient();
  if (!client) {
    return fail(
      "Supabase não está configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
      "SUPABASE_NOT_CONFIGURED",
    );
  }
  try {
    const { data, error } = await client.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: !!options.upsert,
      contentType:
        options.contentType ||
        (file instanceof File ? file.type : undefined) ||
        "application/octet-stream",
    });
    if (error) {
      if (/bucket|not found|404/i.test(error.message)) {
        return fail(
          `Bucket ${bucket} ainda não está configurado. / ${bucket} bucket is not configured.`,
          "STORAGE_BUCKET_MISSING",
        );
      }
      if (/permission|policy|rls|403/i.test(error.message)) {
        return fail(
          "Sem permissão para aceder a estes dados financeiros. / You do not have permission to access these financial records.",
          "STORAGE_PERMISSION",
        );
      }
      return fail(error.message, "STORAGE_UPLOAD_FAILED");
    }
    return ok({ path: data?.path || path, bucket });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "upload failed", "STORAGE_ERROR");
  }
}

/** Only for intentionally public buckets (e.g. public-assets). Never for finance-proofs. */
export function getPublicUrl(bucket: string, path: string): StorageResult<{ publicUrl: string }> {
  if (bucket === FINANCE_PROOFS_BUCKET) {
    return fail(
      "finance-proofs is private. Use createSignedUrl. / finance-proofs is private. Use createSignedUrl.",
      "STORAGE_PRIVATE_BUCKET",
    );
  }
  const client = getSupabaseFoundationClient();
  if (!client) {
    return fail("Supabase não está configurado.", "SUPABASE_NOT_CONFIGURED");
  }
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return ok({ publicUrl: data.publicUrl });
}

export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600,
): Promise<StorageResult<{ signedUrl: string }>> {
  if (!isSupabaseStorageEnabled()) {
    return fail(getStorageInfo().message, "STORAGE_DISABLED");
  }
  const client = getSupabaseFoundationClient();
  if (!client) {
    return fail("Supabase não está configurado.", "SUPABASE_NOT_CONFIGURED");
  }
  try {
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) return fail(error.message, "STORAGE_SIGNED_URL_FAILED");
    return ok({ signedUrl: data.signedUrl });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "signed url failed");
  }
}

export async function removeFile(
  bucket: string,
  path: string,
): Promise<StorageResult<true>> {
  if (!isSupabaseStorageEnabled()) {
    return fail(getStorageInfo().message, "STORAGE_DISABLED");
  }
  const client = getSupabaseFoundationClient();
  if (!client) {
    return fail("Supabase não está configurado.", "SUPABASE_NOT_CONFIGURED");
  }
  try {
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) return fail(error.message, "STORAGE_REMOVE_FAILED");
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "remove failed");
  }
}

export function sanitizeStorageFileName(name: string): string {
  return String(name || "proof").replace(/[^a-zA-Z0-9._-]/g, "_");
}
