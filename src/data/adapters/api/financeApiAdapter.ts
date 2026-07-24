/**
 * Finance API adapter placeholder — Phase 5.
 */
import type { EntityId, FinanceRecord } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import { apiCreate, apiDelete, apiGetById, apiList, apiUpdate } from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "finance-records";

function fail<T>(error: string, code = "API_NOT_CONFIGURED"): DataResult<T> {
  return { ok: false, error, code };
}
function ensureConfigured<T>(): DataResult<T> | null {
  if (!getApiEnvConfig().isConfigured) {
    return fail(
      "API não configurada. Defina VITE_API_BASE_URL. / API not configured. Set VITE_API_BASE_URL.",
      "API_NOT_CONFIGURED",
    );
  }
  return null;
}
function wrap<T>(r: { ok: true; data: T } | { ok: false; error: string; code?: string }): DataResult<T> {
  if (!r.ok) return fail(r.error, r.code || "API_ERROR");
  return { ok: true, data: r.data };
}

export async function listFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  const gate = ensureConfigured<FinanceRecord[]>();
  if (gate) return gate;
  return wrap(await apiList<FinanceRecord>(RESOURCE));
}
export async function getFinanceRecordById(id: EntityId): Promise<DataResult<FinanceRecord | null>> {
  const gate = ensureConfigured<FinanceRecord | null>();
  if (gate) return gate;
  return wrap(await apiGetById<FinanceRecord | null>(RESOURCE, String(id)));
}
export async function createFinanceRecord(payload: Partial<FinanceRecord>): Promise<DataResult<FinanceRecord>> {
  const gate = ensureConfigured<FinanceRecord>();
  if (gate) return gate;
  return wrap(await apiCreate<FinanceRecord>(RESOURCE, payload));
}
export async function updateFinanceRecord(
  id: EntityId,
  payload: Partial<FinanceRecord>,
): Promise<DataResult<FinanceRecord>> {
  const gate = ensureConfigured<FinanceRecord>();
  if (gate) return gate;
  return wrap(await apiUpdate<FinanceRecord>(RESOURCE, String(id), payload));
}
export async function deleteFinanceRecord(id: EntityId): Promise<DataResult<boolean>> {
  const gate = ensureConfigured<boolean>();
  if (gate) return gate;
  return wrap(await apiDelete(RESOURCE, String(id)));
}
