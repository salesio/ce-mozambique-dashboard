/**
 * Finance disbursements Supabase adapter — Phase 5.
 * Expense side only. Never income.
 */
import type { EntityId, FinanceDisbursement, FinanceRecord } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  createRow,
  filterRows,
  getRowById,
  isValidUuid,
  listRows,
  newClientUuid,
  updateRow,
} from "./supabaseRepositoryBase";
import type { SupabaseRow } from "./supabaseTypes";
import * as financeSb from "./financeSupabaseAdapter";

const TABLE = "finance_disbursements";

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function fail<T>(error: string, code?: string): DataResult<T> {
  return { ok: false, error, code };
}
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
function nowIso(): string {
  return new Date().toISOString();
}
function statusKey(s: string | null | undefined): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function mapDisbursementFromRow(
  row: SupabaseRow | null | undefined,
): FinanceDisbursement | null {
  if (!row) return null;
  return {
    id: String(row.id || ""),
    requisition_id: row.requisition_id != null ? String(row.requisition_id) : null,
    request_number: (row.request_number as string) || null,
    title: (row.title as string) || null,
    department_id: row.department_id != null ? String(row.department_id) : null,
    department_name: (row.department_name as string) || null,
    church_id: row.church_id != null ? String(row.church_id) : null,
    church_name: (row.church_name as string) || null,
    requested_by: row.requested_by != null ? String(row.requested_by) : null,
    requested_by_name: (row.requested_by_name as string) || null,
    approved_by: row.approved_by != null ? String(row.approved_by) : null,
    approved_by_name: (row.approved_by_name as string) || null,
    approved_at: (row.approved_at as string) || null,
    approved_amount: Number(row.approved_amount || 0),
    released_amount: Number(row.released_amount || 0),
    pending_amount: Number(row.pending_amount || 0),
    payment_method: (row.payment_method as string) || null,
    payment_reference: (row.payment_reference as string) || null,
    release_date: (row.release_date as string) || null,
    status: (row.status as string) || "Awaiting Release",
    finance_record_id: row.finance_record_id != null ? String(row.finance_record_id) : null,
    notes: (row.notes as string) || null,
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
  };
}

export function mapDisbursementToRow(
  d: Partial<FinanceDisbursement>,
  forUpdate = false,
): SupabaseRow {
  const approved = Number(d.approved_amount || 0);
  const released = Number(d.released_amount || 0);
  const pending =
    d.pending_amount != null ? Number(d.pending_amount) : Math.max(0, approved - released);
  const churchId = d.church_id || null;
  const row: SupabaseRow = {
    requisition_id:
      d.requisition_id && isValidUuid(String(d.requisition_id))
        ? String(d.requisition_id)
        : null,
    request_number: d.request_number || null,
    title: d.title || null,
    description: (d as { description?: string }).description || null,
    department_id: d.department_id != null ? String(d.department_id) : null,
    department_name: d.department_name || null,
    church_id: churchId && isValidUuid(String(churchId)) ? String(churchId) : null,
    church_name: d.church_name || null,
    requested_by_name: d.requested_by_name || null,
    approved_by_name: d.approved_by_name || null,
    approved_at: d.approved_at || null,
    approved_amount: approved,
    released_amount: released,
    pending_amount: pending,
    currency: "MZN",
    payment_method: d.payment_method || null,
    payment_reference: d.payment_reference || null,
    release_date: d.release_date || null,
    status: d.status || "Awaiting Release",
    finance_record_id:
      d.finance_record_id && isValidUuid(String(d.finance_record_id))
        ? String(d.finance_record_id)
        : null,
    notes: d.notes || null,
    metadata: {},
  };
  if (!forUpdate) {
    row.id = d.id && isValidUuid(d.id) ? d.id : newClientUuid();
  }
  return row;
}

export async function listFinanceDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  const res = await listRows(TABLE, { orderBy: "created_at", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapDisbursementFromRow(r)!).filter(Boolean));
}

export async function getFinanceDisbursementById(
  id: EntityId,
): Promise<DataResult<FinanceDisbursement | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapDisbursementFromRow(res.data));
}

export async function createFinanceDisbursement(
  payload: Partial<FinanceDisbursement>,
): Promise<DataResult<FinanceDisbursement>> {
  const row = mapDisbursementToRow(payload, false);
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapDisbursementFromRow(res.data);
  if (!mapped) return fail("Invalid disbursement response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updateFinanceDisbursement(
  id: EntityId,
  payload: Partial<FinanceDisbursement>,
): Promise<DataResult<FinanceDisbursement>> {
  const row = mapDisbursementToRow({ ...payload, id: String(id) }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapDisbursementFromRow(res.data);
  if (!mapped) return fail("Invalid disbursement response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function getFinanceDisbursementsByStatus(
  status: string,
): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  const key = statusKey(status);
  return ok(listed.data.filter((d) => statusKey(d.status).includes(key) || statusKey(d.status) === key));
}

export async function getDisbursementsByRequisition(
  requisitionId: EntityId,
): Promise<DataResult<FinanceDisbursement[]>> {
  const res = await filterRows(TABLE, { requisition_id: String(requisitionId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapDisbursementFromRow(r)!).filter(Boolean));
}

export async function getAwaitingReleaseDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((d) => {
      const k = statusKey(d.status);
      return k.includes("awaiting") || k.includes("pending") || k.includes("aprovado");
    }),
  );
}

export async function getReleasedDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((d) => statusKey(d.status).includes("released") || statusKey(d.status).includes("liberado")));
}

/**
 * Release funds: update disbursement + create expense financeRecord (never income).
 */
export async function releaseFinanceDisbursement(
  id: EntityId,
  payload: {
    released_amount?: number;
    released_by?: string;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
    createExpenseRecord?: boolean;
  } = {},
): Promise<DataResult<{ disbursement: FinanceDisbursement; financeRecord: FinanceRecord | null }>> {
  const existing = await getFinanceDisbursementById(id);
  if (!existing.ok) {
    return existing as DataResult<{
      disbursement: FinanceDisbursement;
      financeRecord: FinanceRecord | null;
    }>;
  }
  if (!existing.data) return fail("Disbursement não encontrado.", "NOT_FOUND");
  const d = existing.data;
  const released = Number(payload.released_amount ?? d.approved_amount ?? 0);
  const approved = Number(d.approved_amount || 0);
  const pending = Math.max(0, approved - released);

  let financeRecord: FinanceRecord | null = null;
  const createExpense = payload.createExpenseRecord !== false;

  if (createExpense && released > 0 && !d.finance_record_id) {
    const rec = await financeSb.createFinanceRecord({
      transaction_type: "expense",
      contribution_group: "Disbursement",
      contribution_category: d.title || "Requisition Disbursement",
      contributor_name: d.requested_by_name || d.department_name || "Department",
      church_id: d.church_id,
      church_name: d.church_name,
      amount: released,
      currency: "MZN",
      payment_method: payload.payment_method || d.payment_method,
      payment_reference: payload.payment_reference || d.payment_reference,
      payment_date: todayIso(),
      status: "Verified",
      source: "Requisition Disbursement",
      source_type: "requisition_disbursement",
      verified_by_name: payload.released_by || "Finance Head",
      verified_at: nowIso(),
      notes: payload.notes || d.notes || "",
    });
    if (rec.ok) financeRecord = rec.data;
  }

  const updated = await updateFinanceDisbursement(id, {
    released_amount: released,
    pending_amount: pending,
    status: pending > 0 ? "Partially Released" : "Released",
    release_date: todayIso(),
    payment_method: payload.payment_method || d.payment_method,
    payment_reference: payload.payment_reference || d.payment_reference,
    finance_record_id: financeRecord?.id || d.finance_record_id,
    notes: payload.notes || d.notes,
    released_by_name: payload.released_by || "Finance Head",
    released_at: nowIso(),
  });
  if (!updated.ok) {
    return updated as DataResult<{
      disbursement: FinanceDisbursement;
      financeRecord: FinanceRecord | null;
    }>;
  }
  return ok({ disbursement: updated.data, financeRecord });
}
