/**
 * Follow-Ups API adapter placeholder — Phase 4.
 */
import type { EntityId, FollowUp } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  apiCreate,
  apiDelete,
  apiGetById,
  apiList,
  apiUpdate,
} from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "follow-ups";

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

export async function listFollowUps(): Promise<DataResult<FollowUp[]>> {
  const gate = ensureConfigured<FollowUp[]>();
  if (gate) return gate;
  return wrap(await apiList<FollowUp>(RESOURCE));
}

export async function getFollowUpById(id: EntityId): Promise<DataResult<FollowUp | null>> {
  const gate = ensureConfigured<FollowUp | null>();
  if (gate) return gate;
  return wrap(await apiGetById<FollowUp | null>(RESOURCE, String(id)));
}

export async function createFollowUp(payload: Partial<FollowUp>): Promise<DataResult<FollowUp>> {
  const gate = ensureConfigured<FollowUp>();
  if (gate) return gate;
  return wrap(await apiCreate<FollowUp>(RESOURCE, payload));
}

export async function updateFollowUp(
  id: EntityId,
  payload: Partial<FollowUp>,
): Promise<DataResult<FollowUp>> {
  const gate = ensureConfigured<FollowUp>();
  if (gate) return gate;
  return wrap(await apiUpdate<FollowUp>(RESOURCE, String(id), payload));
}

export async function deleteFollowUp(id: EntityId): Promise<DataResult<boolean>> {
  const gate = ensureConfigured<boolean>();
  if (gate) return gate;
  return wrap(await apiDelete(RESOURCE, String(id)));
}

export async function searchFollowUps(query: string): Promise<DataResult<FollowUp[]>> {
  const listed = await listFollowUps();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase();
  if (!q) return listed;
  return {
    ok: true,
    data: listed.data.filter((p) =>
      [p.full_name, p.phone, p.email, p.status].some((v) =>
        String(v || "").toLowerCase().includes(q),
      ),
    ),
  };
}
