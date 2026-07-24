import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  CounselingAppointment,
  CounselingCase,
  CounselingFeedback,
  CounselingReferral,
  CounselingRequest,
  Counselor,
  EntityId,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { COUNSELING_REQUESTS_SEED } from "../seeds/counselingRequestsSeed";
import { COUNSELING_CASES_SEED } from "../seeds/counselingCasesSeed";
import { COUNSELING_APPOINTMENTS_SEED } from "../seeds/counselingAppointmentsSeed";
import { COUNSELORS_SEED } from "../seeds/counselorsSeed";
import { COUNSELING_FEEDBACK_SEED } from "../seeds/counselingFeedbackSeed";
import { COUNSELING_REFERRALS_SEED } from "../seeds/counselingReferralsSeed";

function fail<T>(error: string, code = "COUNSELING_ERROR"): DataResult<T> {
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
    .replace(/\s+/g, " ");
}

function nextNumber(prefix: string, existing: string[], field: "request_number" | "case_number"): string {
  const year = new Date().getFullYear();
  const re = new RegExp(`^${prefix}-${year}-(\\d+)$`, "i");
  let max = 0;
  for (const n of existing) {
    const m = String(n || "").match(re);
    if (m) max = Math.max(max, Number(m[1]) || 0);
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeCounselingRequest(
  input: Partial<CounselingRequest> & { id?: string },
): CounselingRequest {
  const name = input.person_name || input.full_name || "";
  const category = input.category || input.counseling_category || "";
  const subject = input.subject || input.counseling_subject || "";
  const summary = input.summary || input.issue_summary || "";
  return {
    ...input,
    id: input.id || `cr-${Date.now()}`,
    request_number: input.request_number || "",
    person_type: input.person_type || "Other",
    person_id: input.person_id || input.member_id || input.first_timer_id || null,
    person_name: name,
    full_name: name,
    member_id: input.member_id || null,
    first_timer_id: input.first_timer_id || null,
    phone: input.phone || "",
    whatsapp: input.whatsapp || input.phone || "",
    email: input.email || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    cell_group_id: input.cell_group_id || null,
    cell_group_name: input.cell_group_name || "",
    cell_id: input.cell_id || null,
    cell_name: input.cell_name || "",
    category,
    counseling_category: input.counseling_category || category,
    subject,
    counseling_subject: input.counseling_subject || subject,
    summary,
    issue_summary: input.issue_summary || summary,
    urgency: input.urgency || "Normal",
    confidentiality_level: input.confidentiality_level || "Normal",
    preferred_contact_method: input.preferred_contact_method || "",
    preferred_date: input.preferred_date || null,
    preferred_time: input.preferred_time || "",
    preferred_counselor_gender: input.preferred_counselor_gender || "",
    preferred_language: input.preferred_language || "Português",
    status: input.status || "New",
    assigned_case_id: input.assigned_case_id || null,
    assigned_counselor_id: input.assigned_counselor_id || null,
    assigned_counselor_name: input.assigned_counselor_name || "",
    notes: input.notes || "",
    source: input.source || "Manual",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeCounselingCase(
  input: Partial<CounselingCase> & { id?: string },
): CounselingCase {
  return {
    ...input,
    id: input.id || `cc-${Date.now()}`,
    case_number: input.case_number || "",
    request_id: input.request_id || null,
    person_type: input.person_type || "Other",
    person_id: input.person_id || null,
    person_name: input.person_name || "",
    member_id: input.member_id || null,
    first_timer_id: input.first_timer_id || null,
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    category: input.category || "",
    subject: input.subject || "",
    summary: input.summary || "",
    confidential_notes: input.confidential_notes || "",
    urgency: input.urgency || "Normal",
    confidentiality_level: input.confidentiality_level || "Normal",
    counselor_id: input.counselor_id || null,
    counselor_name: input.counselor_name || "",
    counselor_staff_id: input.counselor_staff_id || null,
    status: input.status || "Open",
    escalation_level: input.escalation_level || "None",
    needs_follow_up: !!input.needs_follow_up,
    follow_up_id: input.follow_up_id || null,
    outcome: input.outcome || "",
    next_step: input.next_step || "",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeCounselingAppointment(
  input: Partial<CounselingAppointment> & { id?: string },
): CounselingAppointment {
  const time = input.start_time || input.appointment_time || "";
  const reqId = input.request_id || input.counseling_request_id || null;
  return {
    ...input,
    id: input.id || `ca-${Date.now()}`,
    case_id: input.case_id || null,
    case_number: input.case_number || "",
    request_id: reqId,
    counseling_request_id: input.counseling_request_id || reqId,
    person_name: input.person_name || "",
    counselor_id: input.counselor_id || null,
    counselor_name: input.counselor_name || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    appointment_date: input.appointment_date || todayIso(),
    start_time: time,
    appointment_time: time,
    end_time: input.end_time || "",
    duration_minutes: Number(input.duration_minutes ?? 45) || 45,
    appointment_type: input.appointment_type || input.location_type || "In Person",
    location_type: input.location_type || input.appointment_type || "Presencial",
    location: input.location || input.location_details || "",
    location_details: input.location_details || input.location || "",
    meeting_link: input.meeting_link || "",
    status: input.status || "Scheduled",
    attendance_status: input.attendance_status || "Pending",
    session_notes: input.session_notes || input.notes || "",
    confidential_session_notes: input.confidential_session_notes || "",
    notes: input.notes || "",
    reminder_sent: !!input.reminder_sent,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeCounselor(input: Partial<Counselor> & { id?: string }): Counselor {
  const cats = Array.isArray(input.categories)
    ? input.categories
    : Array.isArray(input.counseling_categories)
      ? input.counseling_categories
      : [];
  const open =
    Number(input.current_open_cases ?? input.current_active_cases ?? 0) || 0;
  let status = input.status || "Active";
  if (/activo|active/i.test(status) && !/inactiv|inactivo|leave|licenca|suspend|train/i.test(status)) {
    if (/activo/i.test(status)) status = "Active";
  }
  return {
    ...input,
    id: input.id || `coun-${Date.now()}`,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    user_id: input.user_id || null,
    full_name: input.full_name || "",
    title: input.title || "",
    gender: input.gender || "",
    phone: input.phone || "",
    email: input.email || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    categories: cats,
    counseling_categories: input.counseling_categories || cats,
    languages: Array.isArray(input.languages) ? input.languages : [],
    availability: input.availability || "",
    max_cases_per_week: Number(input.max_cases_per_week ?? 8) || 8,
    current_open_cases: open,
    current_active_cases: open,
    supervisor_id: input.supervisor_id || null,
    supervisor_name: input.supervisor_name || "",
    status,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeCounselingFeedback(
  input: Partial<CounselingFeedback> & { id?: string },
): CounselingFeedback {
  const reqId = input.request_id || input.counseling_request_id || null;
  const summary = input.summary || input.feedback_summary || "";
  return {
    ...input,
    id: input.id || `cfb-${Date.now()}`,
    case_id: input.case_id || null,
    appointment_id: input.appointment_id || null,
    request_id: reqId,
    counseling_request_id: input.counseling_request_id || reqId,
    counselor_id: input.counselor_id || null,
    counselor_name: input.counselor_name || "",
    feedback_type: input.feedback_type || "Counselor Note",
    summary,
    feedback_summary: input.feedback_summary || summary,
    outcome: input.outcome || "",
    needs_follow_up: !!input.needs_follow_up,
    next_step: input.next_step || "",
    next_contact_date: input.next_contact_date || input.follow_up_date || null,
    follow_up_date: input.follow_up_date || input.next_contact_date || null,
    referral_needed: !!input.referral_needed,
    needs_pastor_review: !!input.needs_pastor_review,
    confidentiality_note: input.confidentiality_note || "",
    visible_to_roles: Array.isArray(input.visible_to_roles)
      ? input.visible_to_roles
      : ["Counseling Head", "Super Admin"],
    church_id: input.church_id || null,
    status: input.status || "Pending",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeCounselingReferral(
  input: Partial<CounselingReferral> & { id?: string },
): CounselingReferral {
  const reqId = input.request_id || input.counseling_request_id || null;
  const targetType = input.target_type || input.referred_to_type || "Other";
  const reason = input.referral_reason || input.reason || "";
  return {
    ...input,
    id: input.id || `cref-${Date.now()}`,
    case_id: input.case_id || null,
    case_number: input.case_number || "",
    request_id: reqId,
    counseling_request_id: input.counseling_request_id || reqId,
    from_user_id: input.from_user_id || input.referred_by_user_id || null,
    from_name: input.from_name || input.referred_by_name || "",
    from_role: input.from_role || "",
    referred_by_user_id: input.referred_by_user_id || input.from_user_id || null,
    referred_by_name: input.referred_by_name || input.from_name || "",
    target_type: targetType,
    referred_to_type: input.referred_to_type || targetType,
    target_user_id: input.target_user_id || input.referred_to_user_id || null,
    referred_to_user_id: input.referred_to_user_id || input.target_user_id || null,
    target_name: input.target_name || "",
    target_role: input.target_role || input.referred_to_role || "",
    referred_to_role: input.referred_to_role || input.target_role || "",
    referral_reason: reason,
    reason,
    referral_notes: input.referral_notes || input.response_notes || "",
    response_notes: input.response_notes || "",
    urgency: input.urgency || "Normal",
    status: input.status || "Pending",
    referred_at: input.referred_at || nowIso(),
    completed_at: input.completed_at || null,
    church_id: input.church_id || null,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// Soft audit helper — uses access control audit when available
async function softAudit(action: string, entityType: string, entityId: string, details = "") {
  try {
    const root = globalThis as unknown as {
      CEAccessControlData?: {
        createAuditLog?: (p: Record<string, unknown>) => Promise<unknown>;
      };
      CEDataLayer?: {
        auditLogs?: { createAuditLog?: (p: Record<string, unknown>) => Promise<unknown> };
        accessControl?: { createAuditLog?: (p: Record<string, unknown>) => Promise<unknown> };
      };
    };
    const api =
      root.CEAccessControlData ||
      root.CEDataLayer?.accessControl ||
      root.CEDataLayer?.auditLogs;
    if (api?.createAuditLog) {
      await api.createAuditLog({
        action,
        entity_type: entityType,
        entity_id: entityId,
        module: "counseling",
        details,
        severity: /confidential|sensitive|export|view_case|close/i.test(action)
          ? "critical"
          : "info",
      });
    }
  } catch {
    /* soft */
  }
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export async function listCounselingRequests(): Promise<DataResult<CounselingRequest[]>> {
  try {
    const result = await getDataProvider().counselingRequests.list();
    if (!result.ok) return result as DataResult<CounselingRequest[]>;
    return ok((result.data || []).map((r) => normalizeCounselingRequest(r as CounselingRequest)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselingRequests failed");
  }
}
export async function getCounselingRequestById(id: EntityId) {
  try {
    const result = await getDataProvider().counselingRequests.getById(id);
    if (!result.ok) return result as DataResult<CounselingRequest | null>;
    return ok(result.data ? normalizeCounselingRequest(result.data as CounselingRequest) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselingRequestById failed");
  }
}
export async function createCounselingRequest(payload: Partial<CounselingRequest>) {
  try {
    const listed = await listCounselingRequests();
    const numbers = listed.ok ? listed.data.map((r) => r.request_number || "") : [];
    const row = normalizeCounselingRequest({
      ...payload,
      request_number: payload.request_number || nextNumber("CON", numbers, "request_number"),
      status: payload.status || "New",
    });
    const repo = getDataProvider().counselingRequests;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<CounselingRequest>;
    const n = normalizeCounselingRequest(result.data as CounselingRequest);
    void softAudit("create_request", "counseling_request", n.id, n.request_number || "");
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselingRequest failed");
  }
}
export async function updateCounselingRequest(id: EntityId, payload: Partial<CounselingRequest>) {
  try {
    const existing = await getCounselingRequestById(id);
    if (!existing.ok || !existing.data) return fail("Pedido não encontrado", "NOT_FOUND");
    const row = normalizeCounselingRequest({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselingRequests;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<CounselingRequest>;
    return ok(normalizeCounselingRequest(result.data as CounselingRequest));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselingRequest failed");
  }
}
export async function deleteCounselingRequest(id: EntityId) {
  try {
    const repo = getDataProvider().counselingRequests;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    void softAudit("delete_request", "counseling_request", String(id));
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteCounselingRequest failed");
  }
}
export async function searchCounselingRequests(query: string) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  const q = statusKey(query);
  if (!q) return list;
  return ok(
    list.data.filter((r) =>
      statusKey(
        [r.request_number, r.person_name, r.full_name, r.phone, r.category, r.counseling_category].join(
          " ",
        ),
      ).includes(q),
    ),
  );
}
export async function getCounselingRequestsByChurch(churchId: EntityId) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.church_id === churchId));
}
export async function getCounselingRequestsByStatus(status: string) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  const k = statusKey(status);
  return ok(list.data.filter((r) => statusKey(r.status || "").includes(k)));
}
export async function getCounselingRequestsByCategory(category: string) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  const k = statusKey(category);
  return ok(
    list.data.filter(
      (r) =>
        statusKey(r.category || "").includes(k) ||
        statusKey(r.counseling_category || "").includes(k),
    ),
  );
}
export async function getCounselingRequestsByUrgency(urgency: string) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  const k = statusKey(urgency);
  return ok(list.data.filter((r) => statusKey(r.urgency || "").includes(k)));
}
export async function getCounselingRequestsByPerson(personId: EntityId, personType?: string) {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const matchId =
        r.person_id === personId ||
        r.member_id === personId ||
        r.first_timer_id === personId;
      if (!matchId) return false;
      if (personType && r.person_type && statusKey(r.person_type) !== statusKey(personType)) {
        return false;
      }
      return true;
    }),
  );
}
export async function getNewCounselingRequests() {
  return getCounselingRequestsByStatus("New");
}
export async function getPendingReviewRequests() {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const k = statusKey(r.status);
      return k.includes("pending") || k.includes("new") || k.includes("pendente");
    }),
  );
}
export async function getUrgentCounselingRequests() {
  const list = await listCounselingRequests();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const u = statusKey(r.urgency);
      return u.includes("urgent") || u.includes("high") || u.includes("alta");
    }),
  );
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

export async function listCounselingCases(): Promise<DataResult<CounselingCase[]>> {
  try {
    const result = await getDataProvider().counselingCases.list();
    if (!result.ok) return result as DataResult<CounselingCase[]>;
    return ok((result.data || []).map((r) => normalizeCounselingCase(r as CounselingCase)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselingCases failed");
  }
}
export async function getCounselingCaseById(id: EntityId) {
  try {
    const result = await getDataProvider().counselingCases.getById(id);
    if (!result.ok) return result as DataResult<CounselingCase | null>;
    if (result.data) {
      void softAudit("view_case", "counseling_case", String(id), "getById");
    }
    return ok(result.data ? normalizeCounselingCase(result.data as CounselingCase) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselingCaseById failed");
  }
}
export async function createCounselingCase(payload: Partial<CounselingCase>) {
  try {
    const listed = await listCounselingCases();
    const numbers = listed.ok ? listed.data.map((c) => c.case_number || "") : [];
    const row = normalizeCounselingCase({
      ...payload,
      case_number: payload.case_number || nextNumber("CASE", numbers, "case_number"),
      status: payload.status || "Open",
    });
    const repo = getDataProvider().counselingCases;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<CounselingCase>;
    const n = normalizeCounselingCase(result.data as CounselingCase);
    if (n.request_id) {
      await updateCounselingRequest(n.request_id, {
        assigned_case_id: n.id,
        status: n.counselor_id ? "Assigned" : "In Progress",
        assigned_counselor_id: n.counselor_id || undefined,
        assigned_counselor_name: n.counselor_name || undefined,
      });
    }
    void softAudit("create_case", "counseling_case", n.id, n.case_number || "");
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselingCase failed");
  }
}
export async function updateCounselingCase(id: EntityId, payload: Partial<CounselingCase>) {
  try {
    const existing = await getCounselingCaseById(id);
    if (!existing.ok || !existing.data) return fail("Caso não encontrado", "NOT_FOUND");
    const row = normalizeCounselingCase({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselingCases;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<CounselingCase>;
    return ok(normalizeCounselingCase(result.data as CounselingCase));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselingCase failed");
  }
}
export async function closeCounselingCase(
  id: EntityId,
  payload: {
    closed_by_user_id?: string;
    closed_by_name?: string;
    closure_notes?: string;
    outcome?: string;
  } = {},
) {
  const result = await updateCounselingCase(id, {
    status: "Closed",
    closed_at: nowIso(),
    closed_by_user_id: payload.closed_by_user_id || null,
    closed_by_name: payload.closed_by_name || "",
    closure_notes: payload.closure_notes || "",
    outcome: payload.outcome || "Completed",
  });
  if (result.ok) void softAudit("close_case", "counseling_case", String(id));
  return result;
}
export async function reopenCounselingCase(
  id: EntityId,
  payload: { notes?: string } = {},
) {
  return updateCounselingCase(id, {
    status: "Open",
    closed_at: null,
    closed_by_name: "",
    notes: payload.notes || "",
  });
}
export async function getCasesByCounselor(counselorId: EntityId) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => c.counselor_id === counselorId));
}
export async function getCasesByChurch(churchId: EntityId) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => c.church_id === churchId));
}
export async function getCasesByStatus(status: string) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  const k = statusKey(status);
  return ok(list.data.filter((c) => statusKey(c.status || "").includes(k)));
}
export async function getCasesByCategory(category: string) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  const k = statusKey(category);
  return ok(list.data.filter((c) => statusKey(c.category || "").includes(k)));
}
export async function getCasesByConfidentialityLevel(level: string) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  const k = statusKey(level);
  return ok(list.data.filter((c) => statusKey(c.confidentiality_level || "").includes(k)));
}
export async function getOpenCounselingCases() {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(
    list.data.filter((c) => {
      const k = statusKey(c.status);
      return (
        !k.includes("closed") &&
        !k.includes("completed") &&
        !k.includes("cancel") &&
        !k.includes("conclu")
      );
    }),
  );
}
export async function getCasesNeedingFollowUp() {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (c) =>
        c.needs_follow_up ||
        statusKey(c.status || "").includes("follow") ||
        statusKey(c.next_step || "").includes("acompanh"),
    ),
  );
}
export async function getCasesEscalatedToPastor() {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(
    list.data.filter((c) => {
      const e = statusKey(c.escalation_level || "");
      const s = statusKey(c.status || "");
      return (
        e.includes("pastor") ||
        s.includes("referred") ||
        s.includes("encaminh") ||
        s.includes("pastor")
      );
    }),
  );
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export async function listCounselingAppointments(): Promise<DataResult<CounselingAppointment[]>> {
  try {
    const result = await getDataProvider().counselingAppointments.list();
    if (!result.ok) return result as DataResult<CounselingAppointment[]>;
    return ok(
      (result.data || []).map((r) => normalizeCounselingAppointment(r as CounselingAppointment)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselingAppointments failed");
  }
}
export async function getCounselingAppointmentById(id: EntityId) {
  try {
    const result = await getDataProvider().counselingAppointments.getById(id);
    if (!result.ok) return result as DataResult<CounselingAppointment | null>;
    return ok(
      result.data
        ? normalizeCounselingAppointment(result.data as CounselingAppointment)
        : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselingAppointmentById failed");
  }
}
export async function createCounselingAppointment(payload: Partial<CounselingAppointment>) {
  try {
    const row = normalizeCounselingAppointment(payload);
    const repo = getDataProvider().counselingAppointments;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<CounselingAppointment>;
    const n = normalizeCounselingAppointment(result.data as CounselingAppointment);
    if (n.case_id) {
      await updateCounselingCase(n.case_id, { status: "Scheduled" });
    }
    if (n.request_id || n.counseling_request_id) {
      await updateCounselingRequest(n.request_id || n.counseling_request_id!, {
        status: "Scheduled",
      });
    }
    void softAudit("create_appointment", "counseling_appointment", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselingAppointment failed");
  }
}
export async function updateCounselingAppointment(
  id: EntityId,
  payload: Partial<CounselingAppointment>,
) {
  try {
    const existing = await getCounselingAppointmentById(id);
    if (!existing.ok || !existing.data) return fail("Agendamento não encontrado", "NOT_FOUND");
    const row = normalizeCounselingAppointment({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselingAppointments;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<CounselingAppointment>;
    return ok(normalizeCounselingAppointment(result.data as CounselingAppointment));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselingAppointment failed");
  }
}
export async function cancelCounselingAppointment(
  id: EntityId,
  payload: { notes?: string } = {},
) {
  return updateCounselingAppointment(id, {
    status: "Cancelled",
    notes: payload.notes || "",
  });
}
export async function completeCounselingAppointment(
  id: EntityId,
  payload: {
    completed_by_user_id?: string;
    completed_by_name?: string;
    session_notes?: string;
    attendance_status?: string;
  } = {},
) {
  const result = await updateCounselingAppointment(id, {
    status: "Completed",
    attendance_status: payload.attendance_status || "Present",
    session_notes: payload.session_notes || "",
    completed_at: nowIso(),
    completed_by_user_id: payload.completed_by_user_id || null,
    completed_by_name: payload.completed_by_name || "",
  });
  if (result.ok && result.data?.case_id) {
    await updateCounselingCase(result.data.case_id, { status: "Waiting Feedback" });
  }
  if (result.ok) void softAudit("complete_appointment", "counseling_appointment", String(id));
  return result;
}
export async function getAppointmentsByCounselor(counselorId: EntityId) {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  return ok(list.data.filter((a) => a.counselor_id === counselorId));
}
export async function getAppointmentsByPerson(personId: EntityId, _personType?: string) {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  return ok(list.data.filter((a) => a.person_id === personId));
}
export async function getAppointmentsByDate(date: string) {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  const d = String(date).slice(0, 10);
  return ok(list.data.filter((a) => String(a.appointment_date || "").slice(0, 10) === d));
}
export async function getAppointmentsByDateRange(startDate: string, endDate: string) {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  return ok(
    list.data.filter((a) => {
      const d = String(a.appointment_date || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getTodayCounselingAppointments() {
  return getAppointmentsByDate(todayIso());
}
export async function getUpcomingCounselingAppointments() {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data
      .filter((a) => String(a.appointment_date || "") >= today)
      .filter((a) => {
        const k = statusKey(a.status);
        return !k.includes("cancel") && !k.includes("completed") && !k.includes("conclu");
      })
      .sort((a, b) =>
        String(a.appointment_date || "").localeCompare(String(b.appointment_date || "")),
      ),
  );
}
export async function getMissedCounselingAppointments() {
  const list = await listCounselingAppointments();
  if (!list.ok) return list;
  return ok(
    list.data.filter((a) => {
      const k = statusKey(a.status);
      return k.includes("missed") || k.includes("faltou") || k.includes("absent");
    }),
  );
}

// ---------------------------------------------------------------------------
// Counselors
// ---------------------------------------------------------------------------

export async function listCounselors(): Promise<DataResult<Counselor[]>> {
  try {
    const result = await getDataProvider().counselors.list();
    if (!result.ok) return result as DataResult<Counselor[]>;
    return ok((result.data || []).map((r) => normalizeCounselor(r as Counselor)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselors failed");
  }
}
export async function getCounselorById(id: EntityId) {
  try {
    const result = await getDataProvider().counselors.getById(id);
    if (!result.ok) return result as DataResult<Counselor | null>;
    return ok(result.data ? normalizeCounselor(result.data as Counselor) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselorById failed");
  }
}
export async function createCounselor(payload: Partial<Counselor>) {
  try {
    const row = normalizeCounselor(payload);
    const repo = getDataProvider().counselors;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<Counselor>;
    return ok(normalizeCounselor(result.data as Counselor));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselor failed");
  }
}
export async function updateCounselor(id: EntityId, payload: Partial<Counselor>) {
  try {
    const existing = await getCounselorById(id);
    if (!existing.ok || !existing.data) return fail("Conselheiro não encontrado", "NOT_FOUND");
    const row = normalizeCounselor({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselors;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<Counselor>;
    return ok(normalizeCounselor(result.data as Counselor));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselor failed");
  }
}
export async function deleteCounselor(id: EntityId) {
  try {
    const repo = getDataProvider().counselors;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteCounselor failed");
  }
}
export async function getCounselorsByChurch(churchId: EntityId) {
  const list = await listCounselors();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => c.church_id === churchId));
}
export async function getCounselorsByCategory(category: string) {
  const list = await listCounselors();
  if (!list.ok) return list;
  const k = statusKey(category);
  return ok(
    list.data.filter((c) =>
      [...(c.categories || []), ...(c.counseling_categories || [])].some((x) =>
        statusKey(x).includes(k),
      ),
    ),
  );
}
export async function getCounselorsByAvailability(_day: string) {
  return getActiveCounselors();
}
export async function getActiveCounselors() {
  const list = await listCounselors();
  if (!list.ok) return list;
  return ok(
    list.data.filter((c) => /activ|activo/i.test(String(c.status || ""))),
  );
}
export async function getCounselorsWithCapacity() {
  const list = await getActiveCounselors();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (c) =>
        Number(c.current_open_cases ?? c.current_active_cases ?? 0) <
        Number(c.max_cases_per_week ?? 99),
    ),
  );
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export async function listCounselingFeedback(): Promise<DataResult<CounselingFeedback[]>> {
  try {
    const result = await getDataProvider().counselingFeedback.list();
    if (!result.ok) return result as DataResult<CounselingFeedback[]>;
    return ok(
      (result.data || []).map((r) => normalizeCounselingFeedback(r as CounselingFeedback)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselingFeedback failed");
  }
}
export async function getCounselingFeedbackById(id: EntityId) {
  try {
    const result = await getDataProvider().counselingFeedback.getById(id);
    if (!result.ok) return result as DataResult<CounselingFeedback | null>;
    return ok(
      result.data ? normalizeCounselingFeedback(result.data as CounselingFeedback) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselingFeedbackById failed");
  }
}
export async function createCounselingFeedback(payload: Partial<CounselingFeedback>) {
  try {
    const row = normalizeCounselingFeedback(payload);
    const repo = getDataProvider().counselingFeedback;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<CounselingFeedback>;
    const n = normalizeCounselingFeedback(result.data as CounselingFeedback);
    if (n.needs_follow_up && n.case_id) {
      await updateCounselingCase(n.case_id, {
        needs_follow_up: true,
        status: "Needs Follow-Up",
        next_step: n.next_step || "Criar Acompanhamento",
      });
    }
    // Soft-link Follow-Up department
    if (n.needs_follow_up) {
      try {
        const root = globalThis as unknown as {
          CEFollowUps?: {
            createFollowUp?: (p: Record<string, unknown>) => Promise<DataResult<{ id: string }>>;
          };
          CEDataLayer?: {
            followUps?: {
              createFollowUp?: (p: Record<string, unknown>) => Promise<DataResult<{ id: string }>>;
            };
          };
        };
        const fu = root.CEFollowUps || root.CEDataLayer?.followUps;
        if (fu?.createFollowUp) {
          const created = await fu.createFollowUp({
            full_name: n.person_name,
            person_type: n.person_type || "Other",
            first_timer_id: null,
            status: "Pending",
            notas: `Origem Aconselhamento: ${n.case_id || n.request_id || n.id}`,
            metodo: "Aconselhamento",
            resultado: n.outcome || "Precisa de Acompanhamento",
          });
          if (created?.ok && created.data?.id && n.case_id) {
            await updateCounselingCase(n.case_id, { follow_up_id: created.data.id });
          }
        }
      } catch {
        /* soft */
      }
    }
    void softAudit("create_feedback", "counseling_feedback", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselingFeedback failed");
  }
}
export async function updateCounselingFeedback(id: EntityId, payload: Partial<CounselingFeedback>) {
  try {
    const existing = await getCounselingFeedbackById(id);
    if (!existing.ok || !existing.data) return fail("Feedback não encontrado", "NOT_FOUND");
    const row = normalizeCounselingFeedback({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselingFeedback;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<CounselingFeedback>;
    return ok(normalizeCounselingFeedback(result.data as CounselingFeedback));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselingFeedback failed");
  }
}
export async function getFeedbackByCase(caseId: EntityId) {
  const list = await listCounselingFeedback();
  if (!list.ok) return list;
  return ok(list.data.filter((f) => f.case_id === caseId));
}
export async function getFeedbackByAppointment(appointmentId: EntityId) {
  const list = await listCounselingFeedback();
  if (!list.ok) return list;
  return ok(list.data.filter((f) => f.appointment_id === appointmentId));
}

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------

export async function listCounselingReferrals(): Promise<DataResult<CounselingReferral[]>> {
  try {
    const result = await getDataProvider().counselingReferrals.list();
    if (!result.ok) return result as DataResult<CounselingReferral[]>;
    return ok(
      (result.data || []).map((r) => normalizeCounselingReferral(r as CounselingReferral)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listCounselingReferrals failed");
  }
}
export async function getCounselingReferralById(id: EntityId) {
  try {
    const result = await getDataProvider().counselingReferrals.getById(id);
    if (!result.ok) return result as DataResult<CounselingReferral | null>;
    return ok(
      result.data ? normalizeCounselingReferral(result.data as CounselingReferral) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getCounselingReferralById failed");
  }
}
export async function createCounselingReferral(payload: Partial<CounselingReferral>) {
  try {
    const row = normalizeCounselingReferral(payload);
    const repo = getDataProvider().counselingReferrals;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<CounselingReferral>;
    const n = normalizeCounselingReferral(result.data as CounselingReferral);
    if (n.case_id) {
      const target = statusKey(n.target_type || n.referred_to_type);
      let escalation = "Counseling Head";
      let caseStatus = "Referred to Church Pastor";
      if (target.includes("main")) {
        escalation = "Main Pastor";
        caseStatus = "Referred to Main Pastor";
      } else if (target.includes("church") || target.includes("pastor")) {
        escalation = "Church Pastor";
        caseStatus = "Referred to Church Pastor";
      } else if (target.includes("follow")) {
        caseStatus = "Needs Follow-Up";
        escalation = "Counselor";
      }
      await updateCounselingCase(n.case_id, {
        status: caseStatus,
        escalation_level: escalation,
        referred_to_user_id: n.target_user_id || n.referred_to_user_id,
        referred_to_name: n.target_name || "",
        referred_to_role: n.target_role || n.referred_to_role || "",
      });
    }
    void softAudit("create_referral", "counseling_referral", n.id, n.target_type || "");
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createCounselingReferral failed");
  }
}
export async function updateCounselingReferral(id: EntityId, payload: Partial<CounselingReferral>) {
  try {
    const existing = await getCounselingReferralById(id);
    if (!existing.ok || !existing.data) return fail("Encaminhamento não encontrado", "NOT_FOUND");
    const row = normalizeCounselingReferral({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().counselingReferrals;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<CounselingReferral>;
    return ok(normalizeCounselingReferral(result.data as CounselingReferral));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateCounselingReferral failed");
  }
}
export async function getReferralsByCase(caseId: EntityId) {
  const list = await listCounselingReferrals();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.case_id === caseId));
}
export async function getReferralsByTarget(targetType: string, targetId?: EntityId) {
  const list = await listCounselingReferrals();
  if (!list.ok) return list;
  const k = statusKey(targetType);
  return ok(
    list.data.filter((r) => {
      const typeOk =
        statusKey(r.target_type || "").includes(k) ||
        statusKey(r.referred_to_type || "").includes(k);
      if (!typeOk) return false;
      if (targetId) {
        return r.target_user_id === targetId || r.referred_to_user_id === targetId;
      }
      return true;
    }),
  );
}
export async function getPendingCounselingReferrals() {
  const list = await listCounselingReferrals();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const k = statusKey(r.status);
      return (
        k.includes("pending") ||
        k.includes("pendente") ||
        k.includes("in progress") ||
        k.includes("em curso") ||
        k.includes("aceite")
      );
    }),
  );
}
export async function markReferralCompleted(
  id: EntityId,
  payload: { response_notes?: string } = {},
) {
  return updateCounselingReferral(id, {
    status: "Completed",
    completed_at: nowIso(),
    response_notes: payload.response_notes || "",
  });
}

// ---------------------------------------------------------------------------
// Reports (aggregated by default — no confidential_notes)
// ---------------------------------------------------------------------------

export async function getCounselingOverviewStats(_filters: Record<string, unknown> = {}) {
  const [requests, cases, appointments, counselors, pendingRef] = await Promise.all([
    listCounselingRequests(),
    listCounselingCases(),
    listCounselingAppointments(),
    listCounselors(),
    getPendingCounselingReferrals(),
  ]);
  const req = requests.ok ? requests.data : [];
  const cas = cases.ok ? cases.data : [];
  const apt = appointments.ok ? appointments.data : [];
  const coun = counselors.ok ? counselors.data : [];
  const today = todayIso();
  const month = today.slice(0, 7);
  return ok({
    newRequests: req.filter((r) => /new|pending/i.test(String(r.status || ""))).length,
    pendingReview: req.filter((r) => /pending/i.test(String(r.status || ""))).length,
    openCases: cas.filter((c) => {
      const k = statusKey(c.status);
      return !k.includes("closed") && !k.includes("completed") && !k.includes("cancel");
    }).length,
    urgentCases: cas.filter((c) => /urgent|high/i.test(String(c.urgency || ""))).length,
    todayAppointments: apt.filter((a) => String(a.appointment_date || "") === today).length,
    upcomingAppointments: apt.filter((a) => String(a.appointment_date || "") >= today).length,
    referredCases: cas.filter((c) => /referred|encaminh|pastor/i.test(String(c.status || ""))).length,
    churchPastorCases: cas.filter((c) =>
      /church pastor/i.test(String(c.escalation_level || c.status || "")),
    ).length,
    mainPastorCases: cas.filter((c) =>
      /main pastor/i.test(String(c.escalation_level || c.status || "")),
    ).length,
    needsFollowUp: cas.filter((c) => c.needs_follow_up).length,
    completedThisMonth: cas.filter(
      (c) =>
        /completed|closed|conclu/i.test(String(c.status || "")) &&
        String(c.closed_at || c.updated_at || "").startsWith(month),
    ).length,
    activeCounselors: coun.filter((c) => /activ|activo/i.test(String(c.status || ""))).length,
    pendingReferrals: pendingRef.ok ? pendingRef.data.length : 0,
  });
}

export async function getCounselingCategoryReport(_filters = {}) {
  const list = await listCounselingCases();
  if (!list.ok) return list;
  const counts: Record<string, number> = {};
  for (const c of list.data) {
    const cat = c.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return ok(Object.entries(counts).map(([category, count]) => ({ category, count })));
}

export async function getCounselingAppointmentsReport(
  filters: { startDate?: string; endDate?: string } = {},
) {
  if (filters.startDate && filters.endDate) {
    return getAppointmentsByDateRange(filters.startDate, filters.endDate);
  }
  return listCounselingAppointments();
}

export async function getCounselorWorkloadReport(_filters = {}) {
  const [counselors, cases] = await Promise.all([listCounselors(), listCounselingCases()]);
  if (!counselors.ok) return counselors as DataResult<unknown[]>;
  const open = cases.ok
    ? cases.data.filter((c) => {
        const k = statusKey(c.status);
        return !k.includes("closed") && !k.includes("completed") && !k.includes("cancel");
      })
    : [];
  return ok(
    counselors.data.map((c) => ({
      counselor_id: c.id,
      counselor_name: c.full_name,
      max_cases_per_week: c.max_cases_per_week,
      open_cases: open.filter((x) => x.counselor_id === c.id).length,
      status: c.status,
    })),
  );
}

export async function getCounselingReferralsReport(_filters = {}) {
  return listCounselingReferrals();
}

/** Aggregated only — strips confidential_notes from cases. */
export async function getConfidentialCounselingReport(_filters = {}) {
  void softAudit("export_confidential_report", "counseling", "aggregate", "aggregated report");
  const list = await listCounselingCases();
  if (!list.ok) return list;
  return ok(
    list.data.map((c) => ({
      id: c.id,
      case_number: c.case_number,
      category: c.category,
      urgency: c.urgency,
      confidentiality_level: c.confidentiality_level,
      status: c.status,
      escalation_level: c.escalation_level,
      church_id: c.church_id,
      // never expose confidential_notes in aggregated report
      has_confidential_notes: !!(c.confidential_notes && String(c.confidential_notes).trim()),
    })),
  );
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureCounselingSeeded(): Promise<DataResult<boolean>> {
  try {
    const req = await listCounselingRequests();
    if (req.ok && req.data.length === 0) {
      for (const s of COUNSELING_REQUESTS_SEED) await createCounselingRequest(s);
    }
    const cases = await listCounselingCases();
    if (cases.ok && cases.data.length === 0) {
      for (const s of COUNSELING_CASES_SEED) {
        const repo = getDataProvider().counselingCases;
        if (repo.create) await repo.create(normalizeCounselingCase(s));
      }
    }
    const apt = await listCounselingAppointments();
    if (apt.ok && apt.data.length === 0) {
      for (const s of COUNSELING_APPOINTMENTS_SEED) {
        const repo = getDataProvider().counselingAppointments;
        if (repo.create) await repo.create(normalizeCounselingAppointment(s));
      }
    }
    const coun = await listCounselors();
    if (coun.ok && coun.data.length === 0) {
      for (const s of COUNSELORS_SEED) await createCounselor(s);
    }
    const fb = await listCounselingFeedback();
    if (fb.ok && fb.data.length === 0) {
      for (const s of COUNSELING_FEEDBACK_SEED) {
        const repo = getDataProvider().counselingFeedback;
        if (repo.create) await repo.create(normalizeCounselingFeedback(s));
      }
    }
    const ref = await listCounselingReferrals();
    if (ref.ok && ref.data.length === 0) {
      for (const s of COUNSELING_REFERRALS_SEED) {
        const repo = getDataProvider().counselingReferrals;
        if (repo.create) await repo.create(normalizeCounselingReferral(s));
      }
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureCounselingSeeded failed");
  }
}

export function getCounselingDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "counseling",
  };
}

export {
  COUNSELING_REQUESTS_SEED,
  COUNSELING_CASES_SEED,
  COUNSELING_APPOINTMENTS_SEED,
  COUNSELORS_SEED,
  COUNSELING_FEEDBACK_SEED,
  COUNSELING_REFERRALS_SEED,
};

export const counselingRepository = {
  listCounselingRequests,
  getCounselingRequestById,
  createCounselingRequest,
  updateCounselingRequest,
  deleteCounselingRequest,
  searchCounselingRequests,
  getCounselingRequestsByChurch,
  getCounselingRequestsByStatus,
  getCounselingRequestsByCategory,
  getCounselingRequestsByUrgency,
  getCounselingRequestsByPerson,
  getNewCounselingRequests,
  getPendingReviewRequests,
  getUrgentCounselingRequests,
  listCounselingCases,
  getCounselingCaseById,
  createCounselingCase,
  updateCounselingCase,
  closeCounselingCase,
  reopenCounselingCase,
  getCasesByCounselor,
  getCasesByChurch,
  getCasesByStatus,
  getCasesByCategory,
  getCasesByConfidentialityLevel,
  getOpenCounselingCases,
  getCasesNeedingFollowUp,
  getCasesEscalatedToPastor,
  listCounselingAppointments,
  getCounselingAppointmentById,
  createCounselingAppointment,
  updateCounselingAppointment,
  cancelCounselingAppointment,
  completeCounselingAppointment,
  getAppointmentsByCounselor,
  getAppointmentsByPerson,
  getAppointmentsByDate,
  getAppointmentsByDateRange,
  getTodayCounselingAppointments,
  getUpcomingCounselingAppointments,
  getMissedCounselingAppointments,
  listCounselors,
  getCounselorById,
  createCounselor,
  updateCounselor,
  deleteCounselor,
  getCounselorsByChurch,
  getCounselorsByCategory,
  getCounselorsByAvailability,
  getActiveCounselors,
  getCounselorsWithCapacity,
  listCounselingFeedback,
  getCounselingFeedbackById,
  createCounselingFeedback,
  updateCounselingFeedback,
  getFeedbackByCase,
  getFeedbackByAppointment,
  listCounselingReferrals,
  getCounselingReferralById,
  createCounselingReferral,
  updateCounselingReferral,
  getReferralsByCase,
  getReferralsByTarget,
  getPendingCounselingReferrals,
  markReferralCompleted,
  getCounselingOverviewStats,
  getCounselingCategoryReport,
  getCounselingAppointmentsReport,
  getCounselorWorkloadReport,
  getCounselingReferralsReport,
  getConfidentialCounselingReport,
  ensureCounselingSeeded,
  getCounselingDataSourceInfo,
  getInfo: getCounselingDataSourceInfo,
};
