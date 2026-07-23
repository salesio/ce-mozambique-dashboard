import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  FinanceDisbursement,
  FinanceRecord,
  PublicGivingContributionLine,
  PublicGivingSubmission,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { FINANCE_RECORDS_SEED } from "../seeds/financeRecordsSeed";
import { PUBLIC_GIVING_SUBMISSIONS_SEED } from "../seeds/publicGivingSubmissionsSeed";
import { FINANCE_DISBURSEMENTS_SEED } from "../seeds/financeDisbursementsSeed";

function fail<T>(error: string, code = "FINANCE_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
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

/** Map English ↔ PT legacy status used by dashboard UI. */
export function toEnglishFinanceStatus(raw: string | null | undefined): string {
  const k = statusKey(raw);
  if (!k) return "Pending Verification";
  if (k.includes("verified") || k === "verificado" || k.includes("incluid")) return "Verified";
  if (k.includes("reject") || k.includes("rejeit")) return "Rejected";
  if (k.includes("cancel")) return "Cancelled";
  if (k.includes("underreview") || k.includes("emrevisao")) return "Under Review";
  if (k.includes("correction") || k.includes("correc")) return "Needs Correction";
  if (k.includes("pending") || k.includes("pendente")) return "Pending Verification";
  return raw || "Pending Verification";
}

export function toLegacyFinanceEstado(english: string | null | undefined): string {
  const e = toEnglishFinanceStatus(english);
  if (e === "Verified") return "Verificado";
  if (e === "Rejected") return "Rejeitado";
  if (e === "Cancelled") return "Cancelado";
  if (e === "Under Review") return "Em Revisão";
  if (e === "Needs Correction") return "Precisa Correção";
  return "Pendente de Verificação";
}

function isVerifiedStatus(s: string | null | undefined): boolean {
  return toEnglishFinanceStatus(s) === "Verified";
}
function isPendingStatus(s: string | null | undefined): boolean {
  const e = toEnglishFinanceStatus(s);
  return e === "Pending Verification" || e === "Under Review" || e === "Needs Correction";
}

function guessContributionGroup(category: string): string {
  const c = String(category || "").toLowerCase();
  if (c.includes("dízim") || c.includes("dizim") || c.includes("tithe")) return "Dízimos";
  if (c.includes("primíc") || c.includes("primic")) return "Primícias";
  if (c.includes("graças") || c.includes("gracas") || c.includes("thanks")) return "Acção de Graças";
  if (
    c.includes("parcer") ||
    c.includes("partner") ||
    c.includes("rapsód") ||
    c.includes("rapsod") ||
    c.includes("loveworld") ||
    c.includes("visão") ||
    c.includes("visao") ||
    c.includes("cura") ||
    c.includes("sat") ||
    c.includes("missão") ||
    c.includes("missao") ||
    c.includes("alcançar") ||
    c.includes("alcancar") ||
    c.includes("mandato") ||
    c.includes("construção") ||
    c.includes("construcao")
  ) {
    return "Parcerias";
  }
  if (c.includes("ofert") || c.includes("offering")) return "Ofertas";
  return "Outros";
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeFinanceRecord(
  input: Partial<FinanceRecord> & { id?: string },
): FinanceRecord {
  const id = input.id || `fin-${Date.now()}`;
  const amount = Number(input.amount ?? input.valor ?? 0);
  const category =
    input.contribution_category ||
    input.categoria_da_contribuicao ||
    input.category ||
    "";
  const group = input.contribution_group || guessContributionGroup(category);
  const statusEn = toEnglishFinanceStatus(input.status || input.estado);
  const estado = input.estado || toLegacyFinanceEstado(statusEn);
  const nome = input.nome || "";
  const apelido = input.apelido || "";
  const contributorName =
    input.contributor_name ||
    [nome, apelido].filter(Boolean).join(" ").trim() ||
    "";
  const phone = input.contributor_phone || input.telefone || input.whatsapp || "";
  const email = input.contributor_email || input.email || "";
  const churchId = input.church_id || input.churchId || null;
  const paymentDate = input.payment_date || input.data || input.data_da_transferencia || todayIso();
  const proof =
    input.proof_file_url ||
    input.imagem_envelope_ou_pop ||
    input.imagem_do_envelope ||
    "";
  const txType =
    input.transaction_type ||
    (input.source === "Requisition Disbursement" ? "expense" : "income");

  return {
    ...input,
    id,
    transaction_type: txType,
    contribution_group: group,
    contribution_category: category,
    categoria_da_contribuicao: category || input.categoria_da_contribuicao || "",
    category: category || null,
    partnership_arm_id: input.partnership_arm_id || null,
    partnership_arm_name: input.partnership_arm_name || "",
    contributor_id: input.contributor_id || "",
    contributor_name: contributorName,
    contributor_phone: phone,
    contributor_email: email,
    nome: nome || contributorName.split(" ")[0] || "",
    apelido: apelido || contributorName.split(" ").slice(1).join(" ") || "",
    telefone: phone,
    whatsapp: input.whatsapp || phone,
    email,
    member_id: input.member_id || "",
    first_timer_id: input.first_timer_id || "",
    partner_id: input.partner_id || "",
    source_type: input.source_type || "manual",
    church_id: churchId,
    churchId,
    church_name: input.church_name || input.igreja || "",
    igreja: input.igreja || input.church_name || "",
    cell_group_id: input.cell_group_id || "",
    cell_group_name: input.cell_group_name || input.grupo_de_celula || "",
    grupo_de_celula: input.grupo_de_celula || input.cell_group_name || "",
    cell_id: input.cell_id || "",
    cell_name: input.cell_name || input.celula || "",
    celula: input.celula || input.cell_name || "",
    amount,
    valor: amount,
    currency: input.currency || "MZN",
    payment_method: input.payment_method || input.metodo_de_pagamento || "",
    metodo_de_pagamento: input.metodo_de_pagamento || input.payment_method || "",
    payment_reference: input.payment_reference || input.referencia_da_transaccao || "",
    referencia_da_transaccao:
      input.referencia_da_transaccao || input.payment_reference || "",
    payment_date: paymentDate,
    data: paymentDate,
    data_da_transferencia: input.data_da_transferencia || paymentDate,
    recordedAt: paymentDate,
    proof_file_url: proof,
    proof_file_name: input.proof_file_name || "",
    imagem_envelope_ou_pop: proof,
    imagem_do_envelope: proof,
    status: statusEn,
    estado,
    source: input.source || "Manual Entry",
    submission_group_id: input.submission_group_id || "",
    public_submission_id: input.public_submission_id || "",
    requisition_id: input.requisition_id || null,
    cell_report_id: input.cell_report_id || null,
    received_by: input.received_by || input.recebido_por || "",
    received_by_name: input.received_by_name || input.recebido_por || input.received_by || "",
    recebido_por: input.recebido_por || input.received_by_name || input.received_by || "",
    verified_by: input.verified_by || input.verificado_por || "",
    verified_by_name: input.verified_by_name || input.verificado_por || input.verified_by || "",
    verificado_por: input.verificado_por || input.verified_by_name || input.verified_by || "",
    verified_at: input.verified_at || null,
    rejected_by: input.rejected_by || input.rejected_by_name || "",
    rejected_by_name: input.rejected_by_name || input.rejected_by || "",
    rejected_at: input.rejected_at || null,
    rejection_reason: input.rejection_reason || input.motivo_rejeicao || "",
    motivo_rejeicao: input.motivo_rejeicao || input.rejection_reason || "",
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    created_by: input.created_by || "",
    updated_by: input.updated_by || "",
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

export function normalizePublicGivingSubmission(
  input: Partial<PublicGivingSubmission> & { id?: string },
): PublicGivingSubmission {
  const id = input.id || `pgs-${Date.now()}`;
  const contributions: PublicGivingContributionLine[] = Array.isArray(input.contributions)
    ? input.contributions.map((c) => ({
        contribution_group: c.contribution_group || guessContributionGroup(String(c.contribution_category || "")),
        contribution_category: c.contribution_category || "",
        partnership_arm_id: c.partnership_arm_id || null,
        partnership_arm_name: c.partnership_arm_name || "",
        amount: Number(c.amount || 0),
      }))
    : [];
  const totalFromLines = contributions.reduce((s, c) => s + Number(c.amount || 0), 0);
  const total = Number(input.total_amount ?? input.valor_total ?? totalFromLines);
  const statusEn = toEnglishFinanceStatus(input.status);
  const fullName =
    input.full_name ||
    [input.nome, input.apelido].filter(Boolean).join(" ").trim() ||
    "";
  const churchId = input.church_id || input.igreja_id || null;

  return {
    ...input,
    id,
    submission_group_id: input.submission_group_id || `pg-group-${id}`,
    full_name: fullName,
    nome: input.nome || fullName.split(" ")[0] || "",
    apelido: input.apelido || fullName.split(" ").slice(1).join(" ") || "",
    birthday: input.birthday || input.data_de_aniversario || "",
    data_de_aniversario: input.data_de_aniversario || input.birthday || "",
    phone: input.phone || input.telefone || "",
    telefone: input.telefone || input.phone || "",
    email: input.email || "",
    church_id: churchId,
    igreja_id: churchId,
    church_name: input.church_name || input.igreja || "",
    igreja: input.igreja || input.church_name || "",
    cell_group_id: input.cell_group_id || "",
    cell_group_name: input.cell_group_name || input.grupo_de_celula || "",
    grupo_de_celula: input.grupo_de_celula || input.cell_group_name || "",
    cell_id: input.cell_id || "",
    cell_name: input.cell_name || input.celula || "",
    celula: input.celula || input.cell_name || "",
    contributions,
    total_amount: total,
    valor_total: total,
    currency: input.currency || "MZN",
    payment_method: input.payment_method || input.metodo_de_pagamento || "",
    metodo_de_pagamento: input.metodo_de_pagamento || input.payment_method || "",
    payment_reference: input.payment_reference || input.referencia_da_transaccao || "",
    referencia_da_transaccao:
      input.referencia_da_transaccao || input.payment_reference || "",
    payment_date: input.payment_date || input.data_da_transferencia || todayIso(),
    data_da_transferencia: input.data_da_transferencia || input.payment_date || todayIso(),
    proof_file_url: input.proof_file_url || input.imagem_envelope_ou_pop || "",
    proof_file_name: input.proof_file_name || "",
    imagem_envelope_ou_pop: input.imagem_envelope_ou_pop || input.proof_file_url || "",
    transfer_message: input.transfer_message || input.mensagem_transferencia || "",
    mensagem_transferencia: input.mensagem_transferencia || input.transfer_message || "",
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    status: statusEn,
    source: input.source || "Public Giving Form",
    created_finance_record_ids: Array.isArray(input.created_finance_record_ids)
      ? input.created_finance_record_ids
      : [],
    submitted_at: input.submitted_at || input.created_at || nowIso(),
    reviewed_by: input.reviewed_by || "",
    reviewed_at: input.reviewed_at || null,
    verified_by: input.verified_by || "",
    verified_at: input.verified_at || null,
    rejected_by: input.rejected_by || "",
    rejected_at: input.rejected_at || null,
    rejection_reason: input.rejection_reason || input.motivo_rejeicao || "",
    motivo_rejeicao: input.motivo_rejeicao || input.rejection_reason || "",
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

export function normalizeFinanceDisbursement(
  input: Partial<FinanceDisbursement> & { id?: string },
): FinanceDisbursement {
  const id = input.id || `disb-${Date.now()}`;
  const approved = Number(input.approved_amount || 0);
  const released = Number(input.released_amount || 0);
  const pending = input.pending_amount != null ? Number(input.pending_amount) : Math.max(0, approved - released);
  let status = input.status || "Awaiting Release";
  if (!input.status) {
    if (released <= 0) status = "Awaiting Release";
    else if (released < approved) status = "Partially Released";
    else status = "Released";
  }
  return {
    ...input,
    id,
    requisition_id: input.requisition_id || null,
    request_number: input.request_number || "",
    title: input.title || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    requested_by: input.requested_by || input.requested_by_name || "",
    requested_by_name: input.requested_by_name || input.requested_by || "",
    approved_by: input.approved_by || input.approved_by_name || "",
    approved_by_name: input.approved_by_name || input.approved_by || "",
    approved_at: input.approved_at || null,
    approved_amount: approved,
    released_amount: released,
    pending_amount: pending,
    payment_method: input.payment_method || "",
    payment_reference: input.payment_reference || "",
    release_date: input.release_date || null,
    released_by: input.released_by || input.released_by_name || "",
    released_by_name: input.released_by_name || input.released_by || "",
    released_at: input.released_at || null,
    status,
    proof_file_url: input.proof_file_url || "",
    proof_file_name: input.proof_file_name || "",
    notes: input.notes || "",
    finance_record_id: input.finance_record_id || null,
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Seed ensure
// ---------------------------------------------------------------------------

export async function ensureFinanceSeeded(): Promise<void> {
  const provider = getDataProvider();
  const rec = await provider.financeRecords.list();
  if (rec.ok && (rec.data || []).length === 0 && provider.financeRecords.create) {
    for (const seed of FINANCE_RECORDS_SEED) {
      await provider.financeRecords.create(normalizeFinanceRecord(seed));
    }
  }
  const pub = await provider.publicGivingSubmissions.list();
  if (pub.ok && (pub.data || []).length === 0 && provider.publicGivingSubmissions.create) {
    for (const seed of PUBLIC_GIVING_SUBMISSIONS_SEED) {
      await provider.publicGivingSubmissions.create(normalizePublicGivingSubmission(seed));
    }
  }
  const disb = await provider.financeDisbursements.list();
  if (disb.ok && (disb.data || []).length === 0 && provider.financeDisbursements.create) {
    for (const seed of FINANCE_DISBURSEMENTS_SEED) {
      await provider.financeDisbursements.create(normalizeFinanceDisbursement(seed));
    }
  }
}

export function getFinanceDataSourceInfo() {
  const provider = getDataProvider();
  return {
    source: getDataSource(),
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
  };
}

// ---------------------------------------------------------------------------
// Finance Records CRUD + queries
// ---------------------------------------------------------------------------

export async function listFinanceRecords(): Promise<DataResult<FinanceRecord[]>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().financeRecords.list();
    if (!result.ok) return result;
    return ok((result.data || []).map((r) => normalizeFinanceRecord(r)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar finanças.");
  }
}

export async function getFinanceRecordById(id: EntityId): Promise<DataResult<FinanceRecord | null>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().financeRecords.getById(id);
    if (!result.ok) return result;
    return ok(result.data ? normalizeFinanceRecord(result.data) : null);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter lançamento.");
  }
}

export async function createFinanceRecord(
  payload: Partial<FinanceRecord>,
): Promise<DataResult<FinanceRecord>> {
  try {
    await ensureFinanceSeeded();
    const provider = getDataProvider();
    if (!provider.financeRecords.create) return fail("Criar lançamento não suportado.", "NOT_SUPPORTED");
    const row = normalizeFinanceRecord({
      ...payload,
      id: payload.id || `fin-${Date.now()}`,
      status: payload.status || payload.estado || "Pending Verification",
      source: payload.source || "Manual Entry",
      transaction_type: payload.transaction_type || "income",
      created_at: payload.created_at || nowIso(),
      updated_at: todayIso(),
    });
    const result = await provider.financeRecords.create(row);
    if (!result.ok) return result;
    return ok(normalizeFinanceRecord(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar lançamento.");
  }
}

export async function updateFinanceRecord(
  id: EntityId,
  payload: Partial<FinanceRecord>,
): Promise<DataResult<FinanceRecord>> {
  try {
    const provider = getDataProvider();
    if (!provider.financeRecords.update) return fail("Actualizar lançamento não suportado.", "NOT_SUPPORTED");
    const existing = await provider.financeRecords.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Lançamento não encontrado.", "NOT_FOUND");
    const next = normalizeFinanceRecord({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const result = await provider.financeRecords.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeFinanceRecord(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar lançamento.");
  }
}

export async function deleteFinanceRecord(id: EntityId): Promise<DataResult<boolean>> {
  try {
    const provider = getDataProvider();
    if (!provider.financeRecords.remove) return fail("Eliminar lançamento não suportado.", "NOT_SUPPORTED");
    return provider.financeRecords.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar lançamento.");
  }
}

export async function searchFinanceRecords(query: string): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase().trim();
  if (!q) return listed;
  return ok(
    listed.data.filter((r) =>
      [
        r.contributor_name,
        r.nome,
        r.apelido,
        r.telefone,
        r.contribution_category,
        r.categoria_da_contribuicao,
        r.payment_reference,
        r.referencia_da_transaccao,
        r.church_name,
        r.partnership_arm_name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ),
  );
}

export async function getFinanceRecordsByChurch(churchId: EntityId): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => r.church_id === churchId || r.churchId === churchId));
}

export async function getFinanceRecordsByCategory(category: string): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const key = statusKey(category);
  return ok(
    listed.data.filter(
      (r) =>
        statusKey(r.contribution_category) === key ||
        statusKey(r.categoria_da_contribuicao) === key ||
        statusKey(r.category) === key,
    ),
  );
}

export async function getFinanceRecordsByContributionGroup(
  group: string,
): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const key = statusKey(group);
  return ok(listed.data.filter((r) => statusKey(r.contribution_group) === key));
}

export async function getFinanceRecordsByPartnershipArm(
  partnershipArmId: EntityId,
): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => r.partnership_arm_id === partnershipArmId));
}

export async function getFinanceRecordsByStatus(status: string): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const target = toEnglishFinanceStatus(status);
  return ok(listed.data.filter((r) => toEnglishFinanceStatus(r.status || r.estado) === target));
}

export async function getFinanceRecordsByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  const start = String(startDate || "").slice(0, 10);
  const end = String(endDate || "").slice(0, 10);
  return ok(
    listed.data.filter((r) => {
      const d = String(r.payment_date || r.data || r.created_at || "").slice(0, 10);
      if (!d) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    }),
  );
}

export async function getPendingVerificationRecords(): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) => (r.transaction_type || "income") === "income" && isPendingStatus(r.status || r.estado),
    ),
  );
}

export async function getVerifiedRecords(): Promise<DataResult<FinanceRecord[]>> {
  const listed = await listFinanceRecords();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) => (r.transaction_type || "income") === "income" && isVerifiedStatus(r.status || r.estado),
    ),
  );
}

export async function getMonthlyGiving(
  month: number,
  year: number,
): Promise<DataResult<{ total: number; count: number; records: FinanceRecord[] }>> {
  const listed = await getVerifiedRecords();
  if (!listed.ok) return listed as DataResult<{ total: number; count: number; records: FinanceRecord[] }>;
  const mm = String(month).padStart(2, "0");
  const prefix = `${year}-${mm}`;
  const records = listed.data.filter((r) =>
    String(r.payment_date || r.data || r.created_at || "").startsWith(prefix),
  );
  const total = records.reduce((s, r) => s + Number(r.amount || r.valor || 0), 0);
  return ok({ total, count: records.length, records });
}

export async function getTotalGivingByPeriod(
  startDate: string,
  endDate: string,
): Promise<DataResult<{ total: number; count: number; records: FinanceRecord[] }>> {
  const ranged = await getFinanceRecordsByDateRange(startDate, endDate);
  if (!ranged.ok) return ranged as DataResult<{ total: number; count: number; records: FinanceRecord[] }>;
  const records = ranged.data.filter(
    (r) => (r.transaction_type || "income") === "income" && isVerifiedStatus(r.status || r.estado),
  );
  const total = records.reduce((s, r) => s + Number(r.amount || r.valor || 0), 0);
  return ok({ total, count: records.length, records });
}

// ---------------------------------------------------------------------------
// Public Giving Submissions
// ---------------------------------------------------------------------------

export async function listPublicGivingSubmissions(): Promise<DataResult<PublicGivingSubmission[]>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().publicGivingSubmissions.list();
    if (!result.ok) return result;
    return ok((result.data || []).map((r) => normalizePublicGivingSubmission(r)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar submissões públicas.");
  }
}

export async function getPublicGivingSubmissionById(
  id: EntityId,
): Promise<DataResult<PublicGivingSubmission | null>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().publicGivingSubmissions.getById(id);
    if (!result.ok) return result;
    return ok(result.data ? normalizePublicGivingSubmission(result.data) : null);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter submissão pública.");
  }
}

export async function createPublicGivingSubmission(
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  try {
    await ensureFinanceSeeded();
    const provider = getDataProvider();
    if (!provider.publicGivingSubmissions.create) {
      return fail("Criar submissão pública não suportado.", "NOT_SUPPORTED");
    }
    const row = normalizePublicGivingSubmission({
      ...payload,
      id: payload.id || `pgs-${Date.now()}`,
      status: payload.status || "Pending Verification",
      source: payload.source || "Public Giving Form",
      created_finance_record_ids: [],
      submitted_at: payload.submitted_at || nowIso(),
    });
    const result = await provider.publicGivingSubmissions.create(row);
    if (!result.ok) return result;
    return ok(normalizePublicGivingSubmission(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar submissão pública.");
  }
}

export async function updatePublicGivingSubmission(
  id: EntityId,
  payload: Partial<PublicGivingSubmission>,
): Promise<DataResult<PublicGivingSubmission>> {
  try {
    const provider = getDataProvider();
    if (!provider.publicGivingSubmissions.update) {
      return fail("Actualizar submissão não suportado.", "NOT_SUPPORTED");
    }
    const existing = await provider.publicGivingSubmissions.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Submissão não encontrada.", "NOT_FOUND");
    const next = normalizePublicGivingSubmission({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const result = await provider.publicGivingSubmissions.update(id, next);
    if (!result.ok) return result;
    return ok(normalizePublicGivingSubmission(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar submissão.");
  }
}

export async function deletePublicGivingSubmission(id: EntityId): Promise<DataResult<boolean>> {
  try {
    const provider = getDataProvider();
    if (!provider.publicGivingSubmissions.remove) {
      return fail("Eliminar submissão não suportado.", "NOT_SUPPORTED");
    }
    return provider.publicGivingSubmissions.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar submissão.");
  }
}

export async function getPublicGivingSubmissionsByStatus(
  status: string,
): Promise<DataResult<PublicGivingSubmission[]>> {
  const listed = await listPublicGivingSubmissions();
  if (!listed.ok) return listed;
  const target = toEnglishFinanceStatus(status);
  return ok(listed.data.filter((s) => toEnglishFinanceStatus(s.status) === target));
}

export async function getPendingPublicGivingSubmissions(): Promise<DataResult<PublicGivingSubmission[]>> {
  const listed = await listPublicGivingSubmissions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((s) => isPendingStatus(s.status)));
}

/**
 * Verify public submission: create one Verified financeRecord per contribution with amount > 0.
 */
export async function verifyPublicGivingSubmission(
  id: EntityId,
  payload: { verified_by?: string; notes?: string } = {},
): Promise<DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>> {
  try {
    const existing = await getPublicGivingSubmissionById(id);
    if (!existing.ok) return existing as DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>;
    if (!existing.data) return fail("Submissão não encontrada.", "NOT_FOUND");
    const sub = existing.data;
    const lines = (sub.contributions || []).filter((c) => Number(c.amount || 0) > 0);
    const created: FinanceRecord[] = [];
    const verifier = payload.verified_by || "Finance Head";
    const now = nowIso();

    for (const line of lines) {
      const createdRec = await createFinanceRecord({
        transaction_type: "income",
        contribution_group: line.contribution_group || guessContributionGroup(String(line.contribution_category || "")),
        contribution_category: line.contribution_category || "",
        partnership_arm_id: line.partnership_arm_id || null,
        partnership_arm_name: line.partnership_arm_name || "",
        contributor_name: sub.full_name,
        nome: sub.nome,
        apelido: sub.apelido,
        contributor_phone: sub.phone || sub.telefone,
        telefone: sub.phone || sub.telefone,
        contributor_email: sub.email,
        email: sub.email,
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
        estado: "Verificado",
        source: "Public Giving Form",
        source_type: "public_website",
        submission_group_id: sub.submission_group_id || "",
        public_submission_id: sub.id,
        received_by_name: verifier,
        recebido_por: verifier,
        verified_by: verifier,
        verified_by_name: verifier,
        verificado_por: verifier,
        verified_at: now,
        notes: payload.notes || sub.notes || "",
        created_by: verifier,
        updated_by: verifier,
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
    if (!updated.ok) return updated as DataResult<{ submission: PublicGivingSubmission; financeRecords: FinanceRecord[] }>;
    return ok({ submission: updated.data, financeRecords: created });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao verificar submissão.");
  }
}

export async function rejectPublicGivingSubmission(
  id: EntityId,
  reason: string,
  rejectedBy = "Finance Head",
): Promise<DataResult<PublicGivingSubmission>> {
  if (!String(reason || "").trim()) {
    return fail("Motivo de rejeição é obrigatório.", "VALIDATION");
  }
  return updatePublicGivingSubmission(id, {
    status: "Rejected",
    rejected_by: rejectedBy,
    rejected_at: nowIso(),
    rejection_reason: reason.trim(),
    motivo_rejeicao: reason.trim(),
    reviewed_by: rejectedBy,
    reviewed_at: nowIso(),
  });
}

// ---------------------------------------------------------------------------
// Disbursements (expense side)
// ---------------------------------------------------------------------------

export async function listFinanceDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().financeDisbursements.list();
    if (!result.ok) return result;
    return ok((result.data || []).map((r) => normalizeFinanceDisbursement(r)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar liberacões.");
  }
}

export async function getFinanceDisbursementById(
  id: EntityId,
): Promise<DataResult<FinanceDisbursement | null>> {
  try {
    await ensureFinanceSeeded();
    const result = await getDataProvider().financeDisbursements.getById(id);
    if (!result.ok) return result;
    return ok(result.data ? normalizeFinanceDisbursement(result.data) : null);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter liberação.");
  }
}

export async function createFinanceDisbursement(
  payload: Partial<FinanceDisbursement>,
): Promise<DataResult<FinanceDisbursement>> {
  try {
    await ensureFinanceSeeded();
    const provider = getDataProvider();
    if (!provider.financeDisbursements.create) {
      return fail("Criar liberação não suportado.", "NOT_SUPPORTED");
    }
    const row = normalizeFinanceDisbursement({
      ...payload,
      id: payload.id || `disb-${Date.now()}`,
    });
    const result = await provider.financeDisbursements.create(row);
    if (!result.ok) return result;
    return ok(normalizeFinanceDisbursement(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar liberação.");
  }
}

export async function updateFinanceDisbursement(
  id: EntityId,
  payload: Partial<FinanceDisbursement>,
): Promise<DataResult<FinanceDisbursement>> {
  try {
    const provider = getDataProvider();
    if (!provider.financeDisbursements.update) {
      return fail("Actualizar liberação não suportado.", "NOT_SUPPORTED");
    }
    const existing = await provider.financeDisbursements.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Liberação não encontrada.", "NOT_FOUND");
    const next = normalizeFinanceDisbursement({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const result = await provider.financeDisbursements.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeFinanceDisbursement(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar liberação.");
  }
}

export async function getDisbursementsByRequisition(
  requisitionId: EntityId,
): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((d) => d.requisition_id === requisitionId));
}

export async function getPendingDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((d) =>
      ["Awaiting Release", "Partially Released"].includes(String(d.status || "")),
    ),
  );
}

export async function getReleasedDisbursements(): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((d) => d.status === "Released"));
}

export async function getDisbursementsByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FinanceDisbursement[]>> {
  const listed = await listFinanceDisbursements();
  if (!listed.ok) return listed;
  const start = String(startDate || "").slice(0, 10);
  const end = String(endDate || "").slice(0, 10);
  return ok(
    listed.data.filter((d) => {
      const dte = String(d.release_date || d.created_at || "").slice(0, 10);
      if (!dte) return false;
      if (start && dte < start) return false;
      if (end && dte > end) return false;
      return true;
    }),
  );
}

/**
 * Future hook — DO NOT auto-call from cell report submit.
 * Cell offerings stay Pending Finance Review until a future finance phase.
 */
export async function createFinanceRecordFromCellReport(
  cellReport: {
    id?: string;
    offering_amount?: number;
    oferta?: number;
    cell_name?: string;
    celula?: string;
    church_id?: string;
    leader_name?: string;
    report_week?: string;
    payment_method?: string;
    payment_reference?: string;
  },
  options: { createAsPending?: boolean } = {},
): Promise<DataResult<FinanceRecord | null>> {
  const amount = Number(cellReport.offering_amount ?? cellReport.oferta ?? 0);
  if (amount <= 0) return ok(null);
  // Explicit opt-in only — default is no verified income.
  if (options.createAsPending === false) return ok(null);
  return createFinanceRecord({
    transaction_type: "income",
    contribution_group: "Ofertas",
    contribution_category: "Oferta de Célula",
    categoria_da_contribuicao: "Oferta de Célula",
    contributor_name: cellReport.leader_name || cellReport.cell_name || "Célula",
    church_id: cellReport.church_id || null,
    cell_name: cellReport.cell_name || cellReport.celula || "",
    amount,
    currency: "MZN",
    payment_method: cellReport.payment_method || "",
    payment_reference: cellReport.payment_reference || "",
    payment_date: todayIso(),
    status: "Pending Verification",
    source: "Cell Report",
    cell_report_id: cellReport.id || null,
    notes: `Oferta de célula — semana ${cellReport.report_week || "-"}. Ainda não é receita verificada.`,
  });
}
