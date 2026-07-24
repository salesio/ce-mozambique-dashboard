/**
 * Public Giving API adapter placeholder — Phase 5.
 */
import type { EntityId, PublicGivingSubmission } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import { apiCreate, apiGetById, apiList, apiUpdate } from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "public-giving-submissions";

function fail<T>(error: string, code = "API_NOT_CONFIGURED"): DataResult<T> {
  return { ok: false, error, code };
}
function ensureConfigured<T>(): DataResult<T> | null {
  if (!getApiEnvConfig().isConfigured) {
    return fail(
      "API não configurada. Defina VITE_API_BASE_URL.",
      "API_NOT_CONFIGURED",
    );
  }
  return null;
}
function wrap<T>(r: { ok: true; data: T } | { ok: false; error: string; code?: string }): DataResult<T> {
  if (!r.ok) return fail(r.error, r.code || "API_ERROR");
  return { ok: true, data: r.data };
}

export async function listPublicGivingSubmissions(): Promise<DataResult<PublicGivingSubmission[]>> {
  const gate = ensureConfigured<PublicGivingSubmission[]>();
  if (gate) return gate;
  return wrap(await apiList<PublicGivingSubmission>(RESOURCE));
}
export async function getPublicGivingSubmissionById(
  id: EntityId,
): Promise<DataResult<PublicGivingSubmission | null>> {
  const gate = ensureConfigured<PublicGivingSubmission | null>();
  if (gate) return gate;
  return wrap(await apiGetById<PublicGivingSubmission | null>(RESOURCE, String(id)));
}
export async function createPublicGivingSubmission(
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  const gate = ensureConfigured<PublicGivingSubmission>();
  if (gate) return gate;
  return wrap(await apiCreate<PublicGivingSubmission>(RESOURCE, payload));
}
export async function updatePublicGivingSubmission(
  id: EntityId,
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  const gate = ensureConfigured<PublicGivingSubmission>();
  if (gate) return gate;
  return wrap(await apiUpdate<PublicGivingSubmission>(RESOURCE, String(id), payload));
}
