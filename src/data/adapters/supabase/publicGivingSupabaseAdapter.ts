/**
 * Public Giving Supabase adapter — Phase 5.
 * Does NOT create income until explicit verify.
 * Re-verify does not duplicate finance records.
 */
import type {
  EntityId,
  FinanceRecord,
  PublicGivingContributionLine,
  PublicGivingSubmission,
} from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  createRow,
  deleteRow,
  filterRows,
  getRowById,
  isValidUuid,
  listRows,
  newClientUuid,
  updateRow,
} from "./supabaseRepositoryBase";
import type { SupabaseRow } from "./supabaseTypes";
import * as financeSb from "./financeSupabaseAdapter";

const TABLE = "public_giving_submissions";

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
  if (k.includes("verified") || k === "verificado") return "Verified";
  if (k.includes("reject") || k.includes("rejeit")) return "Rejected";
  if (k.includes("underreview") || k.includes("emrevisao")) return "Under Review";
  return "Pending Verification";
}

function guessGroup(category: string): string {
  const c = String(category || "").toLowerCase();
  if (c.includes("dízim") || c.includes("dizim") || c.includes("tithe")) return "Dízimos";
  if (
    c.includes("parcer") ||
    c.includes("partner") ||
    c.includes("rapsód") ||
    c.includes("loveworld") ||
    c.includes("visão") ||
    c.includes("visao")
  ) {
    return "Parcerias";
  }
  if (c.includes("ofert") || c.includes("offering")) return "Ofertas";
  return "Outros";
}

export function mapPublicGivingFromRow(
  row: SupabaseRow | null | undefined,
): PublicGivingSubmission | null {
  if (!row) return null;
  const id = String(row.id || "");
  const status = toEnglishStatus(String(row.status || "Pending Verification"));
  let contributions: PublicGivingContributionLine[] = [];
  const raw = row.contributions;
  if (Array.isArray(raw)) contributions = raw as PublicGivingContributionLine[];
  else if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) contributions = p;
    } catch {
      /* empty */
    }
  }
  let createdIds: string[] = [];
  const idsRaw = row.created_finance_record_ids;
  if (Array.isArray(idsRaw)) createdIds = idsRaw.map(String);
  else if (typeof idsRaw === "string") {
    try {
      const p = JSON.parse(idsRaw);
      if (Array.isArray(p)) createdIds = p.map(String);
    } catch {
      /* empty */
    }
  }
  const fullName = String(row.full_name || "");
  return {
    id,
    submission_group_id: (row.submission_group_id as string) || id,
    full_name: fullName,
    nome: fullName.split(" ")[0] || "",
    apelido: fullName.split(" ").slice(1).join(" ") || "",
    phone: (row.phone as string) || "",
    telefone: (row.phone as string) || "",
    email: (row.email as string) || "",
    church_id: row.church_id != null ? String(row.church_id) : null,
    igreja_id: row.church_id != null ? String(row.church_id) : null,
    church_name: (row.church_name as string) || null,
    igreja: (row.church_name as string) || null,
    cell_group_id: row.cell_group_id != null ? String(row.cell_group_id) : null,
    cell_group_name: (row.cell_group_name as string) || null,
    cell_id: row.cell_id != null ? String(row.cell_id) : null,
    cell_name: (row.cell_name as string) || null,
    contributions,
    total_amount: Number(row.total_amount || 0),
    valor_total: Number(row.total_amount || 0),
    currency: (row.currency as string) || "MZN",
    payment_method: (row.payment_method as string) || null,
    metodo_de_pagamento: (row.payment_method as string) || null,
    payment_reference: (row.payment_reference as string) || null,
    payment_date: (row.payment_date as string) || null,
    data_da_transferencia: (row.payment_date as string) || null,
    proof_file_url: (row.proof_file_url as string) || null,
    proof_file_name: (row.proof_file_name as string) || null,
    status,
    verified_by: (row.verified_by_name as string) || null,
    verified_at: (row.verified_at as string) || null,
    rejected_by: (row.rejected_by_name as string) || null,
    rejected_at: (row.rejected_at as string) || null,
    rejection_reason: (row.rejection_reason as string) || null,
    motivo_rejeicao: (row.rejection_reason as string) || null,
    created_finance_record_ids: createdIds,
    notes: (row.notes as string) || "",
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
  } as PublicGivingSubmission;
}

export function mapPublicGivingToRow(
  sub: Partial<PublicGivingSubmission>,
  forUpdate = false,
): SupabaseRow {
  const fullName = sub.full_name || [sub.nome, sub.apelido].filter(Boolean).join(" ").trim() || "Contributor";
  const churchId = sub.church_id || sub.igreja_id || null;
  const contributions = Array.isArray(sub.contributions) ? sub.contributions : [];
  const total =
    Number(sub.total_amount ?? sub.valor_total) ||
    contributions.reduce((s, c) => s + Number(c.amount || 0), 0);
  const row: SupabaseRow = {
    submission_group_id: sub.submission_group_id || null,
    full_name: fullName,
    phone: sub.phone || sub.telefone || null,
    email: sub.email || null,
    church_id: churchId && isValidUuid(String(churchId)) ? String(churchId) : null,
    church_name: sub.church_name || sub.igreja || null,
    cell_group_id: sub.cell_group_id != null ? String(sub.cell_group_id) : null,
    cell_group_name: sub.cell_group_name || null,
    cell_id: sub.cell_id != null ? String(sub.cell_id) : null,
    cell_name: sub.cell_name || sub.celula || null,
    contributions,
    total_amount: total,
    currency: sub.currency || "MZN",
    payment_method: sub.payment_method || sub.metodo_de_pagamento || null,
    payment_reference: sub.payment_reference || sub.referencia_da_transaccao || null,
    payment_date: sub.payment_date || sub.data_da_transferencia || todayIso(),
    proof_document_id:
      (sub as { proof_document_id?: string }).proof_document_id &&
      isValidUuid(String((sub as { proof_document_id?: string }).proof_document_id))
        ? String((sub as { proof_document_id?: string }).proof_document_id)
        : null,
    proof_file_url: sub.proof_file_url || sub.imagem_envelope_ou_pop || null,
    proof_file_name: sub.proof_file_name || null,
    status: toEnglishStatus(sub.status),
    verified_by_name: sub.verified_by || null,
    verified_at: sub.verified_at || null,
    rejected_by_name: sub.rejected_by || null,
    rejected_at: sub.rejected_at || null,
    rejection_reason: sub.rejection_reason || sub.motivo_rejeicao || null,
    created_finance_record_ids: sub.created_finance_record_ids || [],
    source: "public_website",
    notes: sub.notes || null,
    metadata: {},
  };
  if (!forUpdate) {
    row.id = sub.id && isValidUuid(sub.id) ? sub.id : newClientUuid();
    if (!row.submission_group_id) row.submission_group_id = `sg-${row.id}`;
  }
  return row;
}

export async function listPublicGivingSubmissions(): Promise<DataResult<PublicGivingSubmission[]>> {
  const res = await listRows(TABLE, { orderBy: "created_at", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapPublicGivingFromRow(r)!).filter(Boolean));
}

export async function getPublicGivingSubmissionById(
  id: EntityId,
): Promise<DataResult<PublicGivingSubmission | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapPublicGivingFromRow(res.data));
}

export async function createPublicGivingSubmission(
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  const row = mapPublicGivingToRow(
    { ...payload, status: payload.status || "Pending Verification" },
    false,
  );
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapPublicGivingFromRow(res.data);
  if (!mapped) return fail("Invalid submission response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updatePublicGivingSubmission(
  id: EntityId,
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  const row = mapPublicGivingToRow({ ...payload, id: String(id) }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapPublicGivingFromRow(res.data);
  if (!mapped) return fail("Invalid submission response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function getPublicGivingSubmissionsByStatus(
  status: string,
): Promise<DataResult<PublicGivingSubmission[]>> {
  const listed = await listPublicGivingSubmissions();
  if (!listed.ok) return listed;
  const key = statusKey(toEnglishStatus(status));
  return ok(listed.data.filter((s) => statusKey(toEnglishStatus(s.status)) === key));
}

export async function getPendingPublicGivingSubmissions(): Promise<
  DataResult<PublicGivingSubmission[]>
> {
  const listed = await listPublicGivingSubmissions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((s) => {
      const e = toEnglishStatus(s.status);
      return e === "Pending Verification" || e === "Under Review";
    }),
  );
}

export async function getVerifiedPublicGivingSubmissions(): Promise<
  DataResult<PublicGivingSubmission[]>
> {
  return getPublicGivingSubmissionsByStatus("Verified");
}

export async function getRejectedPublicGivingSubmissions(): Promise<
  DataResult<PublicGivingSubmission[]>
> {
  return getPublicGivingSubmissionsByStatus("Rejected");
}

export async function verifyPublicGivingSubmission(
  id: EntityId,
  payload: { verified_by?: string; notes?: string } = {},
): Promise<DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>> {
  const existing = await getPublicGivingSubmissionById(id);
  if (!existing.ok) {
    return existing as DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>;
  }
  if (!existing.data) return fail("Submissão não encontrada.", "NOT_FOUND");
  const sub = existing.data;
  const st = toEnglishStatus(sub.status);

  // Idempotent: already verified → return existing links, no duplicates
  if (st === "Verified") {
    const ids = (sub.created_finance_record_ids || []).map(String);
    const records: FinanceRecord[] = [];
    for (const rid of ids) {
      const r = await financeSb.getFinanceRecordById(rid);
      if (r.ok && r.data) records.push(r.data);
    }
    return ok({ submission: sub, financeRecords: records });
  }
  if (st === "Rejected") {
    return fail("Submissão rejeitada não pode ser verificada.", "INVALID_STATUS");
  }

  const lines = (sub.contributions || []).filter((c) => Number(c.amount || 0) > 0);
  const created: FinanceRecord[] = [];
  const verifier = payload.verified_by || "Finance Head";
  const now = nowIso();

  for (const line of lines) {
    const createdRec = await financeSb.createFinanceRecord({
      transaction_type: "income",
      contribution_group:
        line.contribution_group || guessGroup(String(line.contribution_category || "")),
      contribution_category: line.contribution_category || "",
      partnership_arm_id: line.partnership_arm_id || null,
      partnership_arm_name: line.partnership_arm_name || "",
      contributor_name: sub.full_name,
      contributor_phone: sub.phone || sub.telefone,
      contributor_email: sub.email,
      church_id: sub.church_id || sub.igreja_id,
      church_name: sub.church_name || sub.igreja,
      cell_group_id: sub.cell_group_id,
      cell_group_name: sub.cell_group_name,
      cell_id: sub.cell_id,
      cell_name: sub.cell_name || sub.celula,
      amount: Number(line.amount || 0),
      currency: sub.currency || "MZN",
      payment_method: sub.payment_method || sub.metodo_de_pagamento,
      payment_reference: sub.payment_reference,
      payment_date: sub.payment_date || sub.data_da_transferencia || todayIso(),
      proof_file_url: sub.proof_file_url,
      proof_file_name: sub.proof_file_name,
      status: "Verified",
      source: "Public Giving Form",
      source_type: "public_website",
      submission_group_id: sub.submission_group_id || "",
      verified_by_name: verifier,
      verified_by: verifier,
      verified_at: now,
      notes: payload.notes || sub.notes || "",
    });
    if (createdRec.ok) created.push(createdRec.data);
  }

  const updated = await updatePublicGivingSubmission(id, {
    status: "Verified",
    verified_by: verifier,
    verified_at: now,
    reviewed_by: verifier,
    reviewed_at: now,
    created_finance_record_ids: created.map((r) => r.id),
    notes: payload.notes || sub.notes,
  });
  if (!updated.ok) {
    return updated as DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>;
  }

  // Soft audit if available
  try {
    const root = globalThis as typeof globalThis & {
      recordAuditLog?: (a: string, p?: Record<string, unknown>) => void;
    };
    root.recordAuditLog?.("finance_public_giving_verified", {
      module: "finance",
      entity_type: "public_giving_submission",
      entity_id: id,
      description: `Verified public giving; created ${created.length} finance records`,
    });
  } catch {
    /* soft */
  }

  return ok({ submission: updated.data, financeRecords: created });
}

export async function rejectPublicGivingSubmission(
  id: EntityId,
  reason: string,
  rejectedBy = "Finance Head",
): Promise<DataResult<PublicGivingSubmission>> {
  if (!String(reason || "").trim()) {
    return fail("Motivo de rejeição é obrigatório.", "VALIDATION");
  }
  const existing = await getPublicGivingSubmissionById(id);
  if (!existing.ok) return existing;
  if (!existing.data) return fail("Submissão não encontrada.", "NOT_FOUND");
  if (toEnglishStatus(existing.data.status) === "Verified") {
    return fail("Submissão já verificada não pode ser rejeitada.", "INVALID_STATUS");
  }
  const updated = await updatePublicGivingSubmission(id, {
    status: "Rejected",
    rejected_by: rejectedBy,
    rejected_at: nowIso(),
    rejection_reason: reason.trim(),
    motivo_rejeicao: reason.trim(),
    reviewed_by: rejectedBy,
    reviewed_at: nowIso(),
  });
  try {
    const root = globalThis as typeof globalThis & {
      recordAuditLog?: (a: string, p?: Record<string, unknown>) => void;
    };
    root.recordAuditLog?.("finance_public_giving_rejected", {
      module: "finance",
      entity_type: "public_giving_submission",
      entity_id: id,
      description: reason.trim(),
    });
  } catch {
    /* soft */
  }
  return updated;
}
