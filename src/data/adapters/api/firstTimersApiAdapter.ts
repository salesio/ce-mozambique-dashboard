/**
 * First Timers API adapter placeholder — Phase 4.
 */
import type { EntityId, FirstTimer } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  apiCreate,
  apiDelete,
  apiGetById,
  apiList,
  apiUpdate,
} from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "first-timers";

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

export async function listFirstTimers(): Promise<DataResult<FirstTimer[]>> {
  const gate = ensureConfigured<FirstTimer[]>();
  if (gate) return gate;
  return wrap(await apiList<FirstTimer>(RESOURCE));
}

export async function getFirstTimerById(id: EntityId): Promise<DataResult<FirstTimer | null>> {
  const gate = ensureConfigured<FirstTimer | null>();
  if (gate) return gate;
  return wrap(await apiGetById<FirstTimer | null>(RESOURCE, String(id)));
}

export async function createFirstTimer(payload: Partial<FirstTimer>): Promise<DataResult<FirstTimer>> {
  const gate = ensureConfigured<FirstTimer>();
  if (gate) return gate;
  return wrap(await apiCreate<FirstTimer>(RESOURCE, payload));
}

export async function updateFirstTimer(
  id: EntityId,
  payload: Partial<FirstTimer>,
): Promise<DataResult<FirstTimer>> {
  const gate = ensureConfigured<FirstTimer>();
  if (gate) return gate;
  return wrap(await apiUpdate<FirstTimer>(RESOURCE, String(id), payload));
}

export async function deleteFirstTimer(id: EntityId): Promise<DataResult<boolean>> {
  const gate = ensureConfigured<boolean>();
  if (gate) return gate;
  return wrap(await apiDelete(RESOURCE, String(id)));
}

export async function searchFirstTimers(query: string): Promise<DataResult<FirstTimer[]>> {
  const listed = await listFirstTimers();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase();
  if (!q) return listed;
  return {
    ok: true,
    data: listed.data.filter((p) =>
      [p.full_name, p.phone, p.email, p.church_name].some((v) =>
        String(v || "").toLowerCase().includes(q),
      ),
    ),
  };
}
