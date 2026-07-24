/**
 * Documents API adapter placeholder — Phase 5.
 */
import type { EntityId } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import { apiCreate, apiGetById, apiList, apiUpdate } from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "documents";

function fail<T>(error: string, code = "API_NOT_CONFIGURED"): DataResult<T> {
  return { ok: false, error, code };
}
function ensureConfigured<T>(): DataResult<T> | null {
  if (!getApiEnvConfig().isConfigured) {
    return fail("API não configurada. Defina VITE_API_BASE_URL.", "API_NOT_CONFIGURED");
  }
  return null;
}
function wrap<T>(r: { ok: true; data: T } | { ok: false; error: string; code?: string }): DataResult<T> {
  if (!r.ok) return fail(r.error, r.code || "API_ERROR");
  return { ok: true, data: r.data };
}

export async function listDocuments(): Promise<DataResult<unknown[]>> {
  const gate = ensureConfigured<unknown[]>();
  if (gate) return gate;
  return wrap(await apiList(RESOURCE));
}
export async function getDocumentById(id: EntityId): Promise<DataResult<unknown | null>> {
  const gate = ensureConfigured<unknown | null>();
  if (gate) return gate;
  return wrap(await apiGetById(RESOURCE, String(id)));
}
export async function createDocument(payload: unknown): Promise<DataResult<unknown>> {
  const gate = ensureConfigured<unknown>();
  if (gate) return gate;
  return wrap(await apiCreate(RESOURCE, payload));
}
export async function updateDocument(id: EntityId, payload: unknown): Promise<DataResult<unknown>> {
  const gate = ensureConfigured<unknown>();
  if (gate) return gate;
  return wrap(await apiUpdate(RESOURCE, String(id), payload));
}
