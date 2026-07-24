/**
 * Finance records Supabase adapter — Phase 5 pilot.
 * Anon only. Income/expense. Pending does not count as verified giving.
 */
import type { EntityId, FinanceRecord } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  createRow,
  dateRangeRows,
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

const TABLE = "finance_records";

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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}
function toEnglishStatus(raw: string | null | undefined): string {
  const k = statusKey(raw);
  if (!k) return "Pending Verification";
  if (k.includes("verified") || k === "verificado") return "Verified";
  if (k.includes("reject") || k.includes("rejeit")) return "Rejected";
  if (k.includes("underreview") || k.includes("emrevisao")) return "Under Review";
  if (k.includes("pending") || k.includes("pendente")) return "Pending Verification";
  return raw || "Pending Verification";
}

export function mapFinanceFromRow(row: SupabaseRow | null | undefined): FinanceRecord | null {
  if (!row) return null;
  const id = String(row.id || "");
  const amount = Number(row.amount || 0);
  const status = toEnglishStatus(String(row.status || "Pending Verification"));
  const contributorName = String(row.contributor_name || "");
  const phone = String(row.contributor_phone || "");
  const category = String(row.contribution_category || "");
  const group = String(row.contribution_group || "");
  return {
    id,
    transaction_type: (row.transaction_type as string) || "income",
    contribution_group: group,
    contribution_category: category,
    categoria_da_contribuicao: category,
    category,
    partnership_arm_id: row.partnership_arm_id != null ? String(row.partnership_arm_id) : null,
    partnership_arm_name: (row.partnership_arm_name as string) || "",
    contributor_name: contributorName,
    contributor_phone: phone,
    contributor_email: (row.contributor_email as string) || "",
    nome: contributorName.split(" ")[0] || "",
    apelido: contributorName.split(" ").slice(1).join(" ") || "",
    telefone: phone,
    email: (row.contributor_email as string) || "",
    member_id: row.member_id != null ? String(row.member_id) : null,
    first_timer_id: row.first_timer_id != null ? String(row.first_timer_id) : null,
    church_id: row.church_id != null ? String(row.church_id) : null,
    churchId: row.church_id != null ? String(row.church_id) : null,
    church_name: (row.church_name as string) || null,
    cell_group_id: row.cell_group_id != null ? String(row.cell_group_id) : null,
    cell_group_name: (row.cell_group_name as string) || null,
    cell_id: row.cell_id != null ? String(row.cell_id) : null,
    cell_name: (row.cell_name as string) || null,
    amount,
    valor: amount,
    currency: (row.currency as string) || "MZN",
    payment_method: (row.payment_method as string) || null,
    payment_reference: (row.payment_reference as string) || null,
    payment_date: (row.payment_date as string) || null,
    data: (row.payment_date as string) || null,
    source: (row.source as string) || null,
    source_type: (row.source_module as string) || null,
    submission_group_id: (row.submission_group_id as string) || null,
    status,
    estado: status === "Verified" ? "Verificado" : status === "Rejected" ? "Rejeitado" : "Pendente de Verificação",
    received_by_name: (row.received_by_name as string) || null,
    verified_by: row.verified_by != null ? String(row.verified_by) : (row.verified_by_name as string) || null,
    verified_by_name: (row.verified_by_name as string) || null,
    verificado_por: (row.verified_by_name as string) || null,
    verified_at: (row.verified_at as string) || null,
    proof_file_url: (row.proof_file_url as string) || null,
    notes: (row.notes as string) || "",
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
  } as FinanceRecord;
}

export function mapFinanceToRow(rec: Partial<FinanceRecord>, forUpdate = false): SupabaseRow {
  const amount = Number(rec.amount ?? rec.valor ?? 0);
  const status = toEnglishStatus(rec.status || rec.estado);
  const contributorName =
    rec.contributor_name ||
    [rec.nome, rec.apelido].filter(Boolean).join(" ").trim() ||
    "";
  const phone = rec.contributor_phone || rec.telefone || "";
  const churchId = rec.church_id || rec.churchId || null;
  const tx = rec.transaction_type || "income";
  const row: SupabaseRow = {
    transaction_type: tx === "expense" ? "expense" : "income",
    contribution_group: rec.contribution_group || null,
    contribution_category: rec.contribution_category || rec.categoria_da_contribuicao || rec.category || null,
    partnership_arm_id: rec.partnership_arm_id != null ? String(rec.partnership_arm_id) : null,
    partnership_arm_name: rec.partnership_arm_name || null,
    contributor_type: (rec as { contributor_type?: string }).contributor_type || null,
    contributor_id:
      rec.contributor_id && isValidUuid(String(rec.contributor_id))
        ? String(rec.contributor_id)
        : null,
    contributor_name: contributorName || null,
    contributor_phone: phone || null,
    contributor_email: rec.contributor_email || rec.email || null,
    member_id: rec.member_id && isValidUuid(String(rec.member_id)) ? String(rec.member_id) : null,
    first_timer_id:
      rec.first_timer_id && isValidUuid(String(rec.first_timer_id))
        ? String(rec.first_timer_id)
        : null,
    church_id: churchId && isValidUuid(String(churchId)) ? String(churchId) : null,
    church_name: rec.church_name || rec.igreja || null,
    cell_group_id: rec.cell_group_id != null ? String(rec.cell_group_id) : null,
    cell_group_name: rec.cell_group_name || null,
    cell_id: rec.cell_id != null ? String(rec.cell_id) : null,
    cell_name: rec.cell_name || rec.celula || null,
    amount,
    currency: rec.currency || "MZN",
    payment_method: rec.payment_method || null,
    payment_reference: rec.payment_reference || null,
    payment_date: rec.payment_date || rec.data || todayIso(),
    source: rec.source || "Manual Entry",
    source_module: rec.source_type || null,
    source_id: null,
    submission_group_id: rec.submission_group_id || null,
    status,
    received_by_name: rec.received_by_name || rec.recebido_por || null,
    verified_by_name: rec.verified_by_name || rec.verificado_por || (typeof rec.verified_by === "string" ? rec.verified_by : null),
    verified_at: rec.verified_at || null,
    rejection_reason: (rec as { rejection_reason?: string }).rejection_reason || null,
    proof_document_id:
      (rec as { proof_document_id?: string }).proof_document_id &&
      isValidUuid(String((rec as { proof_document_id?: string }).proof_document_id))
        ? String((rec as { proof_document_id?: string }).proof_document_id)
        : null,
    proof_file_url: rec.proof_file_url || rec.imagem_envelope_ou_pop || null,
    notes: rec.notes || null,
    metadata: {},
  };
  if (!forUpdate) {
    row.id = rec.id && isValidUuid(rec.id) ? rec.id : newClientUuid();
  }
  return row;
}

export async function listFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  const res = await listRows(TABLE, { orderBy: "payment_date", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFinanceFromRow(r)!).filter(Boolean));
}

export async function getFinanceRecordById(id: EntityId): Promise<DataResult<FinanceRecord | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapFinanceFromRow(res.data));
}

export async function createFinanceRecord(
  payload: Partial<FinanceRecord>,
): Promise<DataResult<FinanceRecord>> {
  const row = mapFinanceToRow(payload, false);
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapFinanceFromRow(res.data);
  if (!mapped) return fail("Invalid finance response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updateFinanceRecord(
  id: EntityId,
  payload: Partial<FinanceRecord>,
): Promise<DataResult<FinanceRecord>> {
  const row = mapFinanceToRow({ ...payload, id: String(id) }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapFinanceFromRow(res.data);
  if (!mapped) return fail("Invalid finance response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function deleteFinanceRecord(id: EntityId): Promise<DataResult<boolean>> {
  const res = await deleteRow(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(true);
}

export async function searchFinanceRecords(query: string): Promise<DataResult<FinanceRecord[]>> {
  const res = await searchRows(
    TABLE,
    ["contributor_name", "contributor_phone", "contribution_category", "partnership_arm_name", "payment_reference"],
    query,
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFinanceFromRow(r)!).filter(Boolean));
}

export async function getFinanceRecordsByChurch(churchId: EntityId): Promise<DataResult<FinanceRecord[]>> {
  const res = await filterRows(TABLE, { church_id: String(churchId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFinanceFromRow(r)!).filter(Boolean));
}

export async function getFinanceRecordsByStatus(status: string): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const key = statusKey(toEnglishStatus(status));
  return ok(listed.data.filter((r) => statusKey(toEnglishStatus(r.status)) === key));
}

export async function getFinanceRecordsByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FinanceRecord[]>> {
  const res = await dateRangeRows(
    TABLE,
    "payment_date",
    String(startDate || "").slice(0, 10),
    String(endDate || "").slice(0, 10),
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFinanceFromRow(r)!).filter(Boolean));
}

export async function getVerifiedFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  return getFinanceRecordsByStatus("Verified");
}

export async function getPendingFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((r) => {
      const e = toEnglishStatus(r.status);
      return e === "Pending Verification" || e === "Under Review" || e === "Needs Correction";
    }),
  );
}

export async function getRejectedFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  return getFinanceRecordsByStatus("Rejected");
}

export async function verifyFinanceRecord(
  id: EntityId,
  payload: { verified_by?: string; notes?: string } = {},
): Promise<DataResult<FinanceRecord>> {
  return updateFinanceRecord(id, {
    status: "Verified",
    estado: "Verificado",
    verified_by_name: payload.verified_by || "Finance Head",
    verified_by: payload.verified_by || "Finance Head",
    verified_at: nowIso(),
    notes: payload.notes,
  });
}

export async function rejectFinanceRecord(
  id: EntityId,
  payload: { rejected_by?: string; rejection_reason?: string },
): Promise<DataResult<FinanceRecord>> {
  if (!String(payload.rejection_reason || "").trim()) {
    return fail("Motivo de rejeição é obrigatório.", "VALIDATION");
  }
  return updateFinanceRecord(id, {
    status: "Rejected",
    estado: "Rejeitado",
    rejection_reason: payload.rejection_reason,
    rejected_by_name: payload.rejected_by || "Finance Head",
    rejected_at: nowIso(),
  } as Partial<FinanceRecord>);
}

export async function getMonthlyGiving(
  filters: { year?: number; month?: number; churchId?: string } = {},
): Promise<DataResult<{ total: number; count: number; records: FinanceRecord[] }>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed as DataResult<{ total: number; count: number; records: FinanceRecord[] }>;
  const y = filters.year || new Date().getFullYear();
  const m = filters.month != null ? filters.month : new Date().getMonth() + 1;
  const records = listed.data.filter((r) => {
    if (toEnglishStatus(r.status) !== "Verified") return false;
    if (r.transaction_type === "expense") return false;
    if (filters.churchId && r.church_id !== filters.churchId && r.churchId !== filters.churchId) {
      return false;
    }
    const d = String(r.payment_date || r.data || "").slice(0, 10);
    if (!d) return false;
    const [yy, mm] = d.split("-").map(Number);
    return yy === y && mm === m;
  });
  const total = records.reduce((s, r) => s + Number(r.amount || 0), 0);
  return ok({ total, count: records.length, records });
}

export async function getFinanceOverviewStats(): Promise<
  DataResult<{
    verifiedIncome: number;
    pendingCount: number;
    rejectedCount: number;
    expenseTotal: number;
  }>
> {
  const listed = await listFinanceRecords();
  if (!listed.ok) {
    return listed as DataResult<{
      verifiedIncome: number;
      pendingCount: number;
      rejectedCount: number;
      expenseTotal: number;
    }>;
  }
  let verifiedIncome = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  let expenseTotal = 0;
  for (const r of listed.data) {
    const st = toEnglishStatus(r.status);
    const amt = Number(r.amount || 0);
    if (r.transaction_type === "expense" && st === "Verified") expenseTotal += amt;
    else if (st === "Verified") verifiedIncome += amt;
    else if (st === "Rejected") rejectedCount += 1;
    else if (st === "Pending Verification" || st === "Under Review") pendingCount += 1;
  }
  return ok({ verifiedIncome, pendingCount, rejectedCount, expenseTotal });
}
