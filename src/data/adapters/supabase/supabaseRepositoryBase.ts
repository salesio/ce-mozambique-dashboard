/**
 * Generic table helpers for Supabase pilots (Phase 1–3).
 * Anon key only — NEVER use SUPABASE_SERVICE_ROLE_KEY.
 */
import { getSupabaseFoundationClient } from "./supabaseClient";
import { getSupabaseEnvConfig, getSupabaseConnectionInfo } from "./supabaseConfig";
import type { SupabaseResult, SupabaseRow, SupabaseTableName } from "./supabaseTypes";

export type ListRowsOptions = {
  limit?: number;
  offset?: number;
  churchId?: string;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, string | number | boolean | null>;
};

function fail<T>(error: string, code = "SUPABASE_DISABLED"): SupabaseResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): SupabaseResult<T> {
  return { ok: true, data };
}

/** Friendly PT/EN-style errors for common PostgREST / config failures. */
export function mapSupabaseError(raw: string, fallbackCode = "SUPABASE_ERROR"): {
  error: string;
  code: string;
} {
  const msg = String(raw || "");
  const lower = msg.toLowerCase();

  if (!getSupabaseEnvConfig().isConfigured || /not configured|disabled/i.test(msg)) {
    return {
      error:
        "Supabase não está configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. / Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      code: "SUPABASE_NOT_CONFIGURED",
    };
  }
  if (
    /relation .* does not exist|could not find the table|schema cache|PGRST205/i.test(msg) ||
    lower.includes("does not exist")
  ) {
    const tableHint = /first_timers|follow_ups|follow_up_timeline/i.test(msg)
      ? "first_timers/follow_ups "
      : "";
    return {
      error:
        `Tabela ${tableHint}ainda não foi criada ou a migration não foi aplicada. / ${tableHint || ""}table has not been created or migration has not been applied.`,
      code: "SUPABASE_TABLE_MISSING",
    };
  }
  if (/permission denied|row-level security|rls|42501|PGRST301|JWT/i.test(msg)) {
    return {
      error:
        "Sem permissão para aceder a estes dados. Verifique políticas RLS/permissões. / No permission to access this data. Check RLS/permissions.",
      code: "SUPABASE_RLS_DENIED",
    };
  }
  return { error: msg || "Supabase error", code: fallbackCode };
}

function requireClient(): SupabaseResult<NonNullable<ReturnType<typeof getSupabaseFoundationClient>>> {
  const info = getSupabaseConnectionInfo();
  const client = getSupabaseFoundationClient();
  if (!client) {
    const mapped = mapSupabaseError(info.message || "not configured");
    return fail(mapped.error, mapped.code);
  }
  return ok(client);
}

export async function listRows(
  table: SupabaseTableName | string,
  options: ListRowsOptions = {},
): Promise<SupabaseResult<SupabaseRow[]>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow[]>;
  try {
    let q = clientRes.data.from(table).select("*");
    if (options.churchId) q = q.eq("church_id", options.churchId);
    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value === undefined) continue;
        q = q.eq(key, value);
      }
    }
    if (options.orderBy) q = q.order(options.orderBy, { ascending: options.ascending !== false });
    if (options.offset != null && options.limit != null) {
      q = q.range(options.offset, options.offset + options.limit - 1);
    } else if (options.limit) {
      q = q.limit(options.limit);
    }
    const { data, error } = await q;
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok((data || []) as SupabaseRow[]);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "listRows failed");
    return fail(m.error, m.code);
  }
}

export async function getRowById(
  table: SupabaseTableName | string,
  id: string,
): Promise<SupabaseResult<SupabaseRow | null>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow | null>;
  try {
    const { data, error } = await clientRes.data
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok((data as SupabaseRow) || null);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "getRowById failed");
    return fail(m.error, m.code);
  }
}

export async function createRow(
  table: SupabaseTableName | string,
  payload: SupabaseRow,
): Promise<SupabaseResult<SupabaseRow>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow>;
  try {
    const { data, error } = await clientRes.data
      .from(table)
      .insert(payload)
      .select("*")
      .single();
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok(data as SupabaseRow);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "createRow failed");
    return fail(m.error, m.code);
  }
}

export async function updateRow(
  table: SupabaseTableName | string,
  id: string,
  payload: SupabaseRow,
): Promise<SupabaseResult<SupabaseRow>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow>;
  try {
    const { data, error } = await clientRes.data
      .from(table)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok(data as SupabaseRow);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "updateRow failed");
    return fail(m.error, m.code);
  }
}

export async function deleteRow(
  table: SupabaseTableName | string,
  id: string,
): Promise<SupabaseResult<boolean>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<boolean>;
  try {
    const { error } = await clientRes.data.from(table).delete().eq("id", id);
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok(true);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "deleteRow failed");
    return fail(m.error, m.code);
  }
}

export async function searchRows(
  table: SupabaseTableName | string,
  columns: string[],
  query: string,
  options: { limit?: number } = {},
): Promise<SupabaseResult<SupabaseRow[]>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow[]>;
  const q = String(query || "").trim();
  if (!q || !columns.length) return listRows(table, { limit: options.limit });
  try {
    // PostgREST or-filter: col.ilike.%q%,col2.ilike.%q%
    const pattern = `%${q.replace(/%/g, "\\%")}%`;
    const orExpr = columns.map((c) => `${c}.ilike.${pattern}`).join(",");
    let req = clientRes.data.from(table).select("*").or(orExpr);
    if (options.limit) req = req.limit(options.limit);
    const { data, error } = await req;
    if (error) {
      // Fallback: client-side filter if or() syntax unsupported
      const listed = await listRows(table, { limit: options.limit || 500 });
      if (!listed.ok) {
        const m = mapSupabaseError(error.message);
        return fail(m.error, m.code);
      }
      const lower = q.toLowerCase();
      return ok(
        listed.data.filter((row) =>
          columns.some((c) => String(row[c] ?? "").toLowerCase().includes(lower)),
        ),
      );
    }
    return ok((data || []) as SupabaseRow[]);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "searchRows failed");
    return fail(m.error, m.code);
  }
}

export async function filterRows(
  table: SupabaseTableName | string,
  filters: Record<string, string | number | boolean | null>,
  options: { limit?: number; orderBy?: string } = {},
): Promise<SupabaseResult<SupabaseRow[]>> {
  return listRows(table, {
    filters,
    limit: options.limit,
    orderBy: options.orderBy,
  });
}

export async function dateRangeRows(
  table: SupabaseTableName | string,
  dateColumn: string,
  startDate: string,
  endDate: string,
  options: { limit?: number } = {},
): Promise<SupabaseResult<SupabaseRow[]>> {
  const clientRes = requireClient();
  if (!clientRes.ok) return clientRes as SupabaseResult<SupabaseRow[]>;
  try {
    let q = clientRes.data
      .from(table)
      .select("*")
      .gte(dateColumn, startDate)
      .lte(dateColumn, endDate);
    if (options.limit) q = q.limit(options.limit);
    const { data, error } = await q;
    if (error) {
      const m = mapSupabaseError(error.message);
      return fail(m.error, m.code);
    }
    return ok((data || []) as SupabaseRow[]);
  } catch (e) {
    const m = mapSupabaseError(e instanceof Error ? e.message : "dateRangeRows failed");
    return fail(m.error, m.code);
  }
}

// ---------------------------------------------------------------------------
// Back-compat aliases (Phase 1 names)
// ---------------------------------------------------------------------------

export const supabaseList = listRows;
export const supabaseGetById = getRowById;
export const supabaseCreate = createRow;
export const supabaseUpdate = updateRow;
export const supabaseDelete = deleteRow;

export function isValidUuid(value: string | null | undefined): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

export function newClientUuid(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
