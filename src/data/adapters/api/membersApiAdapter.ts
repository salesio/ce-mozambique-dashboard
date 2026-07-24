/**
 * Members API adapter placeholder — Phase 3.
 * Uses apiClient; returns NOT_CONFIGURED when VITE_API_BASE_URL is empty.
 */
import type { EntityId, Member } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  apiCreate,
  apiDelete,
  apiGetById,
  apiList,
  apiUpdate,
} from "./apiRepositoryBase";
import { getApiEnvConfig } from "./apiConfig";

const RESOURCE = "members";

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

export async function listMembers(): Promise<DataResult<Member[]>> {
  const gate = ensureConfigured<Member[]>();
  if (gate) return gate;
  return wrap(await apiList<Member>(RESOURCE));
}

export async function getMemberById(id: EntityId): Promise<DataResult<Member | null>> {
  const gate = ensureConfigured<Member | null>();
  if (gate) return gate;
  return wrap(await apiGetById<Member | null>(RESOURCE, String(id)));
}

export async function createMember(payload: Partial<Member>): Promise<DataResult<Member>> {
  const gate = ensureConfigured<Member>();
  if (gate) return gate;
  return wrap(await apiCreate<Member>(RESOURCE, payload));
}

export async function updateMember(
  id: EntityId,
  payload: Partial<Member>,
): Promise<DataResult<Member>> {
  const gate = ensureConfigured<Member>();
  if (gate) return gate;
  return wrap(await apiUpdate<Member>(RESOURCE, String(id), payload));
}

export async function deleteMember(id: EntityId): Promise<DataResult<boolean>> {
  const gate = ensureConfigured<boolean>();
  if (gate) return gate;
  return wrap(await apiDelete(RESOURCE, String(id)));
}

export async function searchMembers(query: string): Promise<DataResult<Member[]>> {
  const gate = ensureConfigured<Member[]>();
  if (gate) return gate;
  const listed = await listMembers();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase();
  if (!q) return listed;
  return {
    ok: true,
    data: listed.data.filter((m) =>
      [m.full_name, m.phone, m.email, m.church_name].some((v) =>
        String(v || "").toLowerCase().includes(q),
      ),
    ),
  };
}

export async function getMembersByChurch(churchId: EntityId): Promise<DataResult<Member[]>> {
  const listed = await listMembers();
  if (!listed.ok) return listed;
  return {
    ok: true,
    data: listed.data.filter(
      (m) => m.church_id === churchId || m.churchId === churchId,
    ),
  };
}
