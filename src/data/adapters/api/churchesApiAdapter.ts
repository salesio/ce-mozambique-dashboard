/**
 * Churches API adapter placeholder — Phase 3.
 * Uses apiClient; returns NOT_CONFIGURED when VITE_API_BASE_URL is empty.
 * Not used by default (VITE_DATA_SOURCE=api only, future backend).
 */
import type { Church, EntityId } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  apiCreate,
  apiDelete,
  apiGetById,
  apiList,
  apiUpdate,
} from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "churches";

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

export async function listChurches(): Promise<DataResult<Church[]>> {
  const gate = ensureConfigured<Church[]>();
  if (gate) return gate;
  return wrap(await apiList<Church>(RESOURCE));
}

export async function getChurchById(id: EntityId): Promise<DataResult<Church | null>> {
  const gate = ensureConfigured<Church | null>();
  if (gate) return gate;
  return wrap(await apiGetById<Church | null>(RESOURCE, String(id)));
}

export async function createChurch(payload: Partial<Church>): Promise<DataResult<Church>> {
  const gate = ensureConfigured<Church>();
  if (gate) return gate;
  return wrap(await apiCreate<Church>(RESOURCE, payload));
}

export async function updateChurch(
  id: EntityId,
  payload: Partial<Church>,
): Promise<DataResult<Church>> {
  const gate = ensureConfigured<Church>();
  if (gate) return gate;
  return wrap(await apiUpdate<Church>(RESOURCE, String(id), payload));
}

export async function deleteChurch(id: EntityId): Promise<DataResult<boolean>> {
  const gate = ensureConfigured<boolean>();
  if (gate) return gate;
  return wrap(await apiDelete(RESOURCE, String(id)));
}

export async function searchChurches(query: string): Promise<DataResult<Church[]>> {
  const gate = ensureConfigured<Church[]>();
  if (gate) return gate;
  const listed = await listChurches();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase();
  if (!q) return listed;
  return {
    ok: true,
    data: listed.data.filter((c) =>
      [c.church_name, c.public_name, c.city, c.province].some((v) =>
        String(v || "").toLowerCase().includes(q),
      ),
    ),
  };
}
