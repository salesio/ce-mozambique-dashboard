import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  Requisition,
  RequisitionTimelineEvent,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { REQUISITIONS_SEED, REQUISITION_TIMELINE_SEED } from "../seeds/requisitionsSeed";
import { createFinanceDisbursement, updateFinanceDisbursement } from "./financeRepository";

function fail<T>(error: string, code = "REQUISITIONS_ERROR"): DataResult<T> {
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
function asBool(v: unknown): boolean {
  return v === true || v === "on" || v === "true" || v === 1 || v === "1";
}
function statusKey(s: string | null | undefined): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/** Inventory-suggesting types */
const INVENTORY_TYPES = new Set([
  "equipamento",
  "equipment",
  "material de ministerio",
  "material",
  "nova aquisicao",
  "reparacao",
  "repair",
  "apoio de midia",
  "media support",
  "materiais ministeriais",
  "ministry materials",
]);

export function shouldRequireInventory(type: string | null | undefined): boolean {
  const k = statusKey(type);
  return [...INVENTORY_TYPES].some((t) => k.includes(t));
}

export function normalizeRequisition(input: Partial<Requisition> & { id?: string }): Requisition {
  const id = input.id || `req-${Date.now()}`;
  const estimated = Number(input.estimated_amount ?? input.amount ?? 0);
  const approved = Number(input.approved_amount ?? 0);
  const released = Number(input.released_amount ?? input.amount_released ?? 0);
  const pending =
    input.pending_amount != null
      ? Number(input.pending_amount)
      : Math.max(0, (approved || estimated) - released);
  const invRequired =
    input.inventory_required != null
      ? asBool(input.inventory_required)
      : shouldRequireInventory(input.requisition_type);

  return {
    ...input,
    id,
    request_number: input.request_number || `REQ-${new Date().getFullYear()}-TEMP`,
    title: input.title || "",
    description: input.description || "",
    justification: input.justification || "",
    requested_by_user_id: input.requested_by_user_id || null,
    requested_by_name: input.requested_by_name || "",
    requested_by_role: input.requested_by_role || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    church_id: input.church_id || input.churchId || null,
    churchId: input.churchId || input.church_id || null,
    church_name: input.church_name || "",
    requisition_type: input.requisition_type || "Outro",
    urgency: input.urgency || "Normal",
    needed_by_date: input.needed_by_date || null,
    estimated_amount: estimated,
    approved_amount: approved || null,
    amount: estimated,
    currency: input.currency || "MZN",
    supplier_name: input.supplier_name || input.supplier_or_vendor || "",
    supplier_or_vendor: input.supplier_or_vendor || input.supplier_name || "",
    quotation_number: input.quotation_number || "",
    quotation_file_url: input.quotation_file_url || "",
    attachments: Array.isArray(input.attachments) ? input.attachments : [],
    reviewed_by: input.reviewed_by || input.reviewed_by_name || "",
    reviewed_by_name: input.reviewed_by_name || input.reviewed_by || "",
    reviewed_at: input.reviewed_at || null,
    review_notes: input.review_notes || "",
    sent_to_main_pastor_by: input.sent_to_main_pastor_by || input.sent_to_main_pastor_by_name || "",
    sent_to_main_pastor_by_name:
      input.sent_to_main_pastor_by_name || input.sent_to_main_pastor_by || "",
    sent_to_main_pastor_at: input.sent_to_main_pastor_at || null,
    approved_by: input.approved_by || input.approved_by_name || "",
    approved_by_name: input.approved_by_name || input.approved_by || "",
    approved_at: input.approved_at || null,
    approval_notes: input.approval_notes || "",
    rejected_by: input.rejected_by || input.rejected_by_name || "",
    rejected_by_name: input.rejected_by_name || input.rejected_by || "",
    rejected_at: input.rejected_at || null,
    rejection_reason: input.rejection_reason || "",
    returned_by: input.returned_by || input.returned_by_name || "",
    returned_by_name: input.returned_by_name || input.returned_by || "",
    returned_at: input.returned_at || null,
    return_reason: input.return_reason || input.return_notes || "",
    return_notes: input.return_notes || input.return_reason || "",
    finance_status: input.finance_status || "Not Applicable",
    released_amount: released,
    amount_released: released,
    pending_amount: pending,
    resources_released_by: input.resources_released_by || input.released_by || "",
    resources_released_by_name:
      input.resources_released_by_name || input.resources_released_by || input.released_by || "",
    resources_released_at: input.resources_released_at || input.released_at || null,
    released_by: input.released_by || input.resources_released_by || "",
    released_at: input.released_at || input.resources_released_at || null,
    payment_method: input.payment_method || "",
    payment_reference: input.payment_reference || "",
    payment_notes: input.payment_notes || "",
    sent_to_finance: asBool(input.sent_to_finance),
    sent_to_finance_at: input.sent_to_finance_at || null,
    finance_disbursement_id: input.finance_disbursement_id || null,
    finance_record_id: input.finance_record_id || null,
    inventory_required: invRequired,
    inventory_item_id: input.inventory_item_id || null,
    inventory_status: input.inventory_status || (invRequired ? "Not Applicable" : "Not Applicable"),
    status: input.status || "Rascunho",
    notes: input.notes || "",
    audit_history: Array.isArray(input.audit_history) ? input.audit_history : [],
    timeline: Array.isArray(input.timeline) ? input.timeline : [],
    created_by: input.created_by || input.requested_by_name || "",
    updated_by: input.updated_by || "",
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

export function normalizeTimelineEvent(
  input: Partial<RequisitionTimelineEvent> & { id?: string },
): RequisitionTimelineEvent {
  return {
    id: input.id || `rtl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    requisition_id: input.requisition_id || null,
    event_type: input.event_type || "updated",
    title: input.title || "",
    description: input.description || "",
    old_status: input.old_status || "",
    new_status: input.new_status || "",
    performed_by_user_id: input.performed_by_user_id || null,
    performed_by_name: input.performed_by_name || "",
    performed_by_role: input.performed_by_role || "",
    created_at: input.created_at || nowIso(),
    metadata: input.metadata || {},
  };
}

async function appendTimeline(
  requisitionId: string,
  event: Partial<RequisitionTimelineEvent>,
): Promise<void> {
  try {
    const provider = getDataProvider();
    if (!provider.requisitionTimeline?.create) return;
    await provider.requisitionTimeline.create(
      normalizeTimelineEvent({ ...event, requisition_id: requisitionId }),
    );
  } catch {
    /* soft */
  }
}

export async function ensureRequisitionsSeeded(): Promise<void> {
  const provider = getDataProvider();
  const list = await provider.requisitions.list();
  if (list.ok && (list.data || []).length === 0 && provider.requisitions.create) {
    for (const seed of REQUISITIONS_SEED) {
      await provider.requisitions.create(normalizeRequisition(seed));
    }
  }
  const tl = await provider.requisitionTimeline.list();
  if (tl.ok && (tl.data || []).length === 0 && provider.requisitionTimeline.create) {
    for (const seed of REQUISITION_TIMELINE_SEED) {
      await provider.requisitionTimeline.create(normalizeTimelineEvent(seed));
    }
  }
}

export function getRequisitionsDataSourceInfo() {
  const provider = getDataProvider();
  return {
    source: getDataSource(),
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listRequisitions(): Promise<DataResult<Requisition[]>> {
  try {
    await ensureRequisitionsSeeded();
    const result = await getDataProvider().requisitions.list();
    if (!result.ok) return result;
    return ok((result.data || []).map((r) => normalizeRequisition(r)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar requisições.");
  }
}

export async function getRequisitionById(id: EntityId): Promise<DataResult<Requisition | null>> {
  try {
    await ensureRequisitionsSeeded();
    const result = await getDataProvider().requisitions.getById(id);
    if (!result.ok) return result;
    return ok(result.data ? normalizeRequisition(result.data) : null);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter requisição.");
  }
}

export async function createRequisition(
  payload: Partial<Requisition>,
): Promise<DataResult<Requisition>> {
  try {
    await ensureRequisitionsSeeded();
    const provider = getDataProvider();
    if (!provider.requisitions.create) return fail("Criar requisição não suportado.", "NOT_SUPPORTED");
    const year = new Date().getFullYear();
    const existing = await provider.requisitions.list();
    const nums = (existing.ok ? existing.data || [] : [])
      .map((r) => String(r.request_number || ""))
      .filter((n) => n.startsWith(`REQ-${year}-`))
      .map((n) => Number(n.replace(`REQ-${year}-`, "")) || 0);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    const row = normalizeRequisition({
      ...payload,
      id: payload.id || `req-${Date.now()}`,
      request_number: payload.request_number || `REQ-${year}-${String(next).padStart(4, "0")}`,
      status: payload.status || "Rascunho",
      finance_status: payload.finance_status || "Not Applicable",
      created_at: payload.created_at || nowIso(),
      updated_at: todayIso(),
    });
    const result = await provider.requisitions.create(row);
    if (!result.ok) return result;
    const data = normalizeRequisition(result.data);
    await appendTimeline(data.id, {
      event_type: "created",
      title: "Requisição criada",
      description: data.title || "",
      new_status: data.status || "",
      performed_by_name: data.requested_by_name || "",
    });
    return ok(data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar requisição.");
  }
}

export async function updateRequisition(
  id: EntityId,
  payload: Partial<Requisition>,
): Promise<DataResult<Requisition>> {
  try {
    const provider = getDataProvider();
    if (!provider.requisitions.update) return fail("Actualizar requisição não suportado.", "NOT_SUPPORTED");
    const existing = await provider.requisitions.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
    const next = normalizeRequisition({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const result = await provider.requisitions.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeRequisition(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar requisição.");
  }
}

export async function deleteRequisition(id: EntityId): Promise<DataResult<boolean>> {
  try {
    const provider = getDataProvider();
    if (!provider.requisitions.remove) return fail("Eliminar requisição não suportado.", "NOT_SUPPORTED");
    return provider.requisitions.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar requisição.");
  }
}

export async function searchRequisitions(query: string): Promise<DataResult<Requisition[]>> {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  const q = String(query || "").toLowerCase().trim();
  if (!q) return listed;
  return ok(
    listed.data.filter((r) =>
      [
        r.request_number,
        r.title,
        r.department_name,
        r.requested_by_name,
        r.status,
        r.requisition_type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    ),
  );
}

// Filters
export async function getRequisitionsByChurch(churchId: EntityId) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => r.church_id === churchId));
}
export async function getRequisitionsByDepartment(departmentId: string) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) => r.department_id === departmentId || r.department_name === departmentId,
    ),
  );
}
export async function getRequisitionsByRequester(userId: string) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => r.requested_by_user_id === userId));
}
export async function getRequisitionsByStatus(status: string) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  const key = statusKey(status);
  return ok(listed.data.filter((r) => statusKey(r.status).includes(key) || statusKey(r.status) === key));
}
export async function getRequisitionsByUrgency(urgency: string) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => r.urgency === urgency));
}
export async function getRequisitionsByDateRange(startDate: string, endDate: string) {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  const start = String(startDate || "").slice(0, 10);
  const end = String(endDate || "").slice(0, 10);
  return ok(
    listed.data.filter((r) => {
      const d = String(r.created_at || "").slice(0, 10);
      if (!d) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    }),
  );
}

function matchStatus(r: Requisition, needles: string[]) {
  const k = statusKey(r.status);
  return needles.some((n) => k.includes(statusKey(n)));
}

export async function getSubmittedRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => matchStatus(r, ["submetid", "submitted"])));
}
export async function getUnderReviewRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => matchStatus(r, ["revis", "review"])));
}
export async function getAwaitingMainPastorRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => matchStatus(r, ["pastor principal", "main pastor", "enviado ao pastor"])));
}
export async function getApprovedRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((r) =>
      matchStatus(r, ["aprovad", "approved", "recursos liberad", "resources released", "invent"]),
    ),
  );
}
export async function getRejectedRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => matchStatus(r, ["rejeit", "reject"])));
}
export async function getReturnedForCorrectionRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(listed.data.filter((r) => matchStatus(r, ["devolvid", "returned", "correc"])));
}
export async function getApprovedAwaitingFinance() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) =>
        matchStatus(r, ["aguardando liber", "awaiting finance", "awaiting release"]) ||
        statusKey(r.finance_status).includes("aguardando"),
    ),
  );
}
export async function getResourcesReleasedRequisitions() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) =>
        matchStatus(r, ["recursos liberad", "resources released"]) ||
        statusKey(r.finance_status).includes("liberad") ||
        statusKey(r.finance_status).includes("released"),
    ),
  );
}
export async function getRequisitionsPendingInventory() {
  const listed = await listRequisitions();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter(
      (r) =>
        r.inventory_required &&
        (matchStatus(r, ["invent", "inventory"]) ||
          statusKey(r.inventory_status).includes("awaiting") ||
          statusKey(r.inventory_status).includes("pending")),
    ),
  );
}

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

type Actor = { id?: string; name?: string; role?: string };

export async function submitRequisition(id: EntityId, actor: Actor = {}) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Submetido",
    submitted_by: actor.name || existing.data.requested_by_name,
    submitted_at: nowIso(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "submitted",
      title: "Requisição submetida",
      old_status: old || "",
      new_status: "Submetido",
      performed_by_name: actor.name || "",
      performed_by_role: actor.role || "",
      performed_by_user_id: actor.id || null,
    });
  }
  return updated;
}

export async function reviewRequisition(
  id: EntityId,
  payload: { review_notes?: string; actor?: Actor } = {},
) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Em Revisão",
    reviewed_by: actor.name || "",
    reviewed_by_name: actor.name || "",
    reviewed_by_user_id: actor.id || null,
    reviewed_at: nowIso(),
    review_notes: payload.review_notes || existing.data.review_notes || "",
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "reviewed",
      title: "Em revisão",
      description: payload.review_notes || "",
      old_status: old || "",
      new_status: "Em Revisão",
      performed_by_name: actor.name || "",
      performed_by_role: actor.role || "",
    });
  }
  return updated;
}

export async function sendToMainPastor(
  id: EntityId,
  payload: { review_notes?: string; actor?: Actor } = {},
) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Enviado ao Pastor Principal",
    reviewed_by: actor.name || existing.data.reviewed_by,
    reviewed_at: existing.data.reviewed_at || nowIso(),
    review_notes: payload.review_notes || existing.data.review_notes || "",
    sent_to_main_pastor_by: actor.name || "",
    sent_to_main_pastor_by_name: actor.name || "",
    sent_to_main_pastor_at: nowIso(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "sent_to_main_pastor",
      title: "Enviada ao Pastor Principal",
      old_status: old || "",
      new_status: "Enviado ao Pastor Principal",
      performed_by_name: actor.name || "",
      performed_by_role: actor.role || "",
    });
  }
  return updated;
}

export async function approveRequisition(
  id: EntityId,
  payload: { approved_amount?: number; approval_notes?: string; actor?: Actor } = {},
) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const approvedAmount =
    Number(payload.approved_amount || existing.data.estimated_amount || 0) || 0;
  const status = "Aprovado — Aguardando Liberação de Recursos";
  let financeDisbursementId = existing.data.finance_disbursement_id || `disb-${id}`;

  // Prepare finance disbursement (expense path — never income)
  try {
    const disb = await createFinanceDisbursement({
      id: String(financeDisbursementId),
      requisition_id: id,
      request_number: existing.data.request_number,
      title: existing.data.title,
      department_id: existing.data.department_id,
      department_name: existing.data.department_name,
      church_id: existing.data.church_id,
      church_name: existing.data.church_name,
      requested_by_name: existing.data.requested_by_name,
      approved_by_name: actor.name || "",
      approved_at: nowIso(),
      approved_amount: approvedAmount,
      released_amount: 0,
      pending_amount: approvedAmount,
      status: "Awaiting Release",
      notes: payload.approval_notes || "",
    });
    if (disb.ok && disb.data?.id) financeDisbursementId = disb.data.id;
  } catch {
    /* soft — requisition still updates */
  }

  const updated = await updateRequisition(id, {
    status,
    approved_by: actor.name || "",
    approved_by_name: actor.name || "",
    approved_by_user_id: actor.id || null,
    approved_at: nowIso(),
    approved_amount: approvedAmount,
    pending_amount: approvedAmount,
    released_amount: 0,
    amount_released: 0,
    approval_notes: payload.approval_notes || "",
    finance_status: "Aguardando Liberação",
    sent_to_finance: true,
    sent_to_finance_at: nowIso(),
    finance_disbursement_id: financeDisbursementId,
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "approved",
      title: "Aprovada — aguardando Finanças",
      description: payload.approval_notes || `Valor aprovado: ${approvedAmount}`,
      old_status: old || "",
      new_status: status,
      performed_by_name: actor.name || "",
      performed_by_role: actor.role || "",
    });
    await appendTimeline(id, {
      event_type: "sent_to_finance",
      title: "Enviada para Finanças",
      new_status: status,
      performed_by_name: "Sistema",
    });
  }
  return updated;
}

export async function rejectRequisition(
  id: EntityId,
  payload: { rejection_reason?: string; actor?: Actor } = {},
) {
  if (!String(payload.rejection_reason || "").trim()) {
    return fail("Motivo de rejeição é obrigatório.", "VALIDATION");
  }
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Rejeitado",
    rejected_by: actor.name || "",
    rejected_by_name: actor.name || "",
    rejected_by_user_id: actor.id || null,
    rejected_at: nowIso(),
    rejection_reason: payload.rejection_reason!.trim(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "rejected",
      title: "Rejeitada",
      description: payload.rejection_reason,
      old_status: old || "",
      new_status: "Rejeitado",
      performed_by_name: actor.name || "",
    });
  }
  return updated;
}

export async function returnRequisitionForCorrection(
  id: EntityId,
  payload: { return_reason?: string; actor?: Actor } = {},
) {
  if (!String(payload.return_reason || "").trim()) {
    return fail("Motivo de devolução é obrigatório.", "VALIDATION");
  }
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Devolvido para Correção",
    returned_by: actor.name || "",
    returned_by_name: actor.name || "",
    returned_by_user_id: actor.id || null,
    returned_at: nowIso(),
    return_reason: payload.return_reason!.trim(),
    return_notes: payload.return_reason!.trim(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "returned",
      title: "Devolvida para correcção",
      description: payload.return_reason,
      old_status: old || "",
      new_status: "Devolvido para Correção",
      performed_by_name: actor.name || "",
    });
  }
  return updated;
}

export async function markResourcesReleased(
  id: EntityId,
  payload: {
    released_amount?: number;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
    actor?: Actor;
  } = {},
) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const approved = Number(existing.data.approved_amount || existing.data.estimated_amount || 0);
  const prevReleased = Number(existing.data.released_amount || existing.data.amount_released || 0);
  const add = Number(payload.released_amount || 0) || approved - prevReleased;
  const totalReleased = Math.min(approved || add, prevReleased + Math.max(0, add));
  const pending = Math.max(0, approved - totalReleased);
  const partial = totalReleased < approved;
  const status = partial
    ? "Aprovado — Aguardando Liberação de Recursos"
    : "Recursos Liberados";
  const financeStatus = partial ? "Parcialmente Pago" : "Recursos Liberados";

  // Sync disbursement
  if (existing.data.finance_disbursement_id) {
    try {
      await updateFinanceDisbursement(String(existing.data.finance_disbursement_id), {
        released_amount: totalReleased,
        pending_amount: pending,
        status: partial ? "Partially Released" : "Released",
        payment_method: payload.payment_method || "",
        payment_reference: payload.payment_reference || "",
        released_by_name: actor.name || "",
        released_at: nowIso(),
        release_date: todayIso(),
        notes: payload.notes || "",
      });
    } catch {
      /* soft */
    }
  }

  const updated = await updateRequisition(id, {
    status,
    finance_status: financeStatus,
    released_amount: totalReleased,
    amount_released: totalReleased,
    pending_amount: pending,
    resources_released_by: actor.name || "",
    resources_released_by_name: actor.name || "",
    resources_released_at: nowIso(),
    released_by: actor.name || "",
    released_at: nowIso(),
    payment_method: payload.payment_method || existing.data.payment_method || "",
    payment_reference: payload.payment_reference || "",
    payment_notes: payload.notes || "",
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: partial ? "partial_release" : "resources_released",
      title: partial ? "Recursos parcialmente liberados" : "Recursos liberados",
      description: `Liberado: ${totalReleased} / ${approved}`,
      new_status: status,
      performed_by_name: actor.name || "",
      performed_by_role: actor.role || "Finance Head",
    });
  }
  return updated;
}

export async function markSentToInventory(
  id: EntityId,
  payload: { actor?: Actor } = {},
) {
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const actor = payload.actor || {};
  const old = existing.data.status;
  const updated = await updateRequisition(id, {
    status: "Enviada para Inventário",
    inventory_required: true,
    inventory_status: "Awaiting Inventory",
    sent_to_inventory_at: nowIso(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "sent_to_inventory",
      title: "Enviada para Inventário",
      description: "Placeholder — inventário completo em fase futura",
      old_status: old || "",
      new_status: "Enviada para Inventário",
      performed_by_name: actor.name || "",
    });
  }
  return updated;
}

export async function closeRequisition(id: EntityId, payload: { actor?: Actor } = {}) {
  const actor = payload.actor || {};
  const existing = await getRequisitionById(id);
  if (!existing.ok || !existing.data) return fail("Requisição não encontrada.", "NOT_FOUND");
  const updated = await updateRequisition(id, {
    status: "Fechado",
    closed_by: actor.name || "",
    closed_at: nowIso(),
    updated_by: actor.name || "",
  });
  if (updated.ok) {
    await appendTimeline(id, {
      event_type: "closed",
      title: "Requisição fechada",
      new_status: "Fechado",
      performed_by_name: actor.name || "",
    });
  }
  return updated;
}

export async function listRequisitionTimeline(
  requisitionId?: EntityId,
): Promise<DataResult<RequisitionTimelineEvent[]>> {
  try {
    await ensureRequisitionsSeeded();
    const result = await getDataProvider().requisitionTimeline.list();
    if (!result.ok) return result;
    let rows = (result.data || []).map((e) => normalizeTimelineEvent(e));
    if (requisitionId) rows = rows.filter((e) => e.requisition_id === requisitionId);
    rows.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    return ok(rows);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar timeline.");
  }
}
