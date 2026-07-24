/**
 * Churches Supabase adapter — Backend Phase 3 pilot.
 * Maps public.churches ↔ dashboard Church shape.
 * Anon client only; never service role.
 */
import type { Church, EntityId } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  createRow,
  deleteRow,
  filterRows,
  getRowById,
  isValidUuid,
  listRows,
  newClientUuid,
  searchRows,
  updateRow,
} from "./supabaseRepositoryBase";
import type { SupabaseRow } from "./supabaseTypes";

const TABLE = "churches";

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function fail<T>(error: string, code?: string): DataResult<T> {
  return { ok: false, error, code };
}

function parseServiceTimes(raw: unknown): Church["service_times"] {
  if (Array.isArray(raw)) return raw as Church["service_times"];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** DB row → UI Church */
export function mapChurchFromRow(row: SupabaseRow | null | undefined): Church | null {
  if (!row) return null;
  const id = String(row.id || "");
  const status = String(row.status || "Active");
  return {
    id,
    church_id: id,
    church_name: String(row.church_name || row.name || row.public_name || "Igreja"),
    name: String(row.church_name || row.name || ""),
    public_name: (row.public_name as string) ?? "",
    type: (row.type as string) || null,
    province: (row.province as string) ?? null,
    city: (row.city as string) ?? null,
    district_or_area: (row.district_or_area as string) || null,
    address: (row.address as string) || null,
    pastor_in_charge: (row.pastor_in_charge as string) || null,
    phone_primary: (row.phone_primary as string) || null,
    phone_secondary: (row.phone_secondary as string) || null,
    email: (row.email as string) || null,
    service_times: parseServiceTimes(row.service_times),
    parent_church_id: (row.parent_church_id as string) || null,
    status,
    information_status: (row.information_status as string) || null,
    notes: (row.notes as string) || null,
    created_by: row.created_by != null ? String(row.created_by) : null,
    updated_by: row.updated_by != null ? String(row.updated_by) : null,
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
    isActive: /activ/i.test(status) && !/inactiv/i.test(status),
  };
}

/** UI Church → DB insert/update payload (only known columns) */
export function mapChurchToRow(church: Partial<Church>, forUpdate = false): SupabaseRow {
  const row: SupabaseRow = {
    church_name: church.church_name || church.name || church.public_name || "Igreja",
    public_name: church.public_name ?? church.publicName ?? null,
    type: church.type ?? null,
    province: church.province ?? null,
    city: church.city ?? null,
    district_or_area: church.district_or_area ?? church.districtOrArea ?? null,
    address: church.address ?? null,
    pastor_in_charge: church.pastor_in_charge ?? null,
    phone_primary: church.phone_primary ?? church.phonePrimary ?? null,
    phone_secondary: church.phone_secondary ?? church.phoneSecondary ?? null,
    email: church.email ?? null,
    service_times: Array.isArray(church.service_times) ? church.service_times : [],
    parent_church_id:
      church.parent_church_id && isValidUuid(church.parent_church_id)
        ? church.parent_church_id
        : null,
    status: church.status || "Active",
    information_status: church.information_status ?? null,
    notes: church.notes ?? null,
    metadata: {},
  };
  if (!forUpdate) {
    const id = church.id || church.church_id;
    row.id = id && isValidUuid(id) ? id : newClientUuid();
  }
  return row;
}

export async function listChurches(): Promise<DataResult<Church[]>> {
  const res = await listRows(TABLE, { orderBy: "church_name" });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapChurchFromRow(r)!).filter(Boolean));
}

export async function getChurchById(id: EntityId): Promise<DataResult<Church | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapChurchFromRow(res.data));
}

export async function createChurch(payload: Partial<Church>): Promise<DataResult<Church>> {
  const row = mapChurchToRow(payload, false);
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapChurchFromRow(res.data);
  if (!mapped) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updateChurch(
  id: EntityId,
  payload: Partial<Church>,
): Promise<DataResult<Church>> {
  const row = mapChurchToRow({ ...payload, id: String(id) }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapChurchFromRow(res.data);
  if (!mapped) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function deleteChurch(id: EntityId): Promise<DataResult<boolean>> {
  const res = await deleteRow(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(true);
}

export async function searchChurches(query: string): Promise<DataResult<Church[]>> {
  const res = await searchRows(
    TABLE,
    ["church_name", "public_name", "city", "province", "pastor_in_charge", "address"],
    query,
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapChurchFromRow(r)!).filter(Boolean));
}

export async function getChurchesByStatus(status: string): Promise<DataResult<Church[]>> {
  const res = await filterRows(TABLE, { status });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapChurchFromRow(r)!).filter(Boolean));
}

export async function getChurchesByProvince(province: string): Promise<DataResult<Church[]>> {
  const res = await filterRows(TABLE, { province });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapChurchFromRow(r)!).filter(Boolean));
}

export async function getActiveChurches(): Promise<DataResult<Church[]>> {
  const listed = await listChurches();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((c) => {
      const s = String(c.status || "").toLowerCase();
      return s.includes("activ") && !s.includes("inactiv");
    }),
  );
}
