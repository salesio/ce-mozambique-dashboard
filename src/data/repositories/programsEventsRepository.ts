import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  Program,
  ProgramBudget,
  ProgramChecklist,
  ProgramParticipant,
  ProgramRegistration,
  ProgramReport,
  ProgramResource,
  ProgramSession,
  ProgramTeam,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { PROGRAMS_SEED } from "../seeds/programsSeed";
import { PROGRAM_SESSIONS_SEED } from "../seeds/programSessionsSeed";
import { PROGRAM_TEAMS_SEED } from "../seeds/programTeamsSeed";
import { PROGRAM_PARTICIPANTS_SEED } from "../seeds/programParticipantsSeed";
import { PROGRAM_REGISTRATIONS_SEED } from "../seeds/programRegistrationsSeed";
import { PROGRAM_RESOURCES_SEED } from "../seeds/programResourcesSeed";
import { PROGRAM_BUDGETS_SEED } from "../seeds/programBudgetsSeed";
import { PROGRAM_CHECKLISTS_SEED } from "../seeds/programChecklistsSeed";
import { PROGRAM_REPORTS_SEED } from "../seeds/programReportsSeed";

function fail<T>(error: string, code = "PROGRAMS_ERROR"): DataResult<T> {
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
function sk(s: string | null | undefined): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}
function nextNum(prefix: string, nums: string[]): string {
  const year = new Date().getFullYear();
  const re = new RegExp(`^${prefix}-${year}-(\\d+)$`, "i");
  let max = 0;
  for (const n of nums) {
    const m = String(n || "").match(re);
    if (m) max = Math.max(max, Number(m[1]) || 0);
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, "0")}`;
}

async function softAudit(action: string, entityType: string, entityId: string, details = "") {
  try {
    const root = globalThis as unknown as {
      CEAccessControlData?: { createAuditLog?: (p: Record<string, unknown>) => Promise<unknown> };
      CEDataLayer?: {
        accessControl?: { createAuditLog?: (p: Record<string, unknown>) => Promise<unknown> };
      };
    };
    const api = root.CEAccessControlData || root.CEDataLayer?.accessControl;
    if (api?.createAuditLog) {
      await api.createAuditLog({
        action,
        entity_type: entityType,
        entity_id: entityId,
        module: "programs",
        details,
        severity: /cancel|reject|validate|budget|export|submit/i.test(action) ? "warning" : "info",
      });
    }
  } catch {
    /* soft */
  }
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeProgram(input: Partial<Program> & { id?: string }): Program {
  const status = input.status || input.estado || "Draft";
  return {
    ...input,
    id: input.id || `prog-${Date.now()}`,
    program_code: input.program_code || "",
    name: input.name || "",
    program_type: input.program_type || "Other",
    category: input.category || "Local Church",
    church_id: input.church_id || null,
    recurrence: input.recurrence || "None",
    location_type: input.location_type || "In Person",
    streaming_required: !!input.streaming_required,
    expected_attendance: Number(input.expected_attendance ?? 0),
    actual_attendance: Number(input.actual_attendance ?? 0),
    responsible_name: input.responsible_name || input.owner || "",
    owner: input.owner || input.responsible_name || "",
    status,
    estado: input.estado || status,
    priority: input.priority || "Normal",
    budget_required: Number(input.budget_required ?? 0),
    approved_budget: Number(input.approved_budget ?? 0),
    currency: input.currency || "MTn",
    registration_required: !!input.registration_required,
    registration_status: input.registration_status || "Not Required",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramSession(
  input: Partial<ProgramSession> & { id?: string },
): ProgramSession {
  return {
    ...input,
    id: input.id || `psess-${Date.now()}`,
    program_id: input.program_id || null,
    title: input.title || "",
    session_type: input.session_type || "Other",
    status: input.status || "Scheduled",
    attendance_count: Number(input.attendance_count ?? 0),
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramTeam(input: Partial<ProgramTeam> & { id?: string }): ProgramTeam {
  return {
    ...input,
    id: input.id || `pteam-${Date.now()}`,
    program_id: input.program_id || null,
    team_name: input.team_name || "",
    members: Array.isArray(input.members) ? input.members : [],
    status: input.status || "Active",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramParticipant(
  input: Partial<ProgramParticipant> & { id?: string },
): ProgramParticipant {
  return {
    ...input,
    id: input.id || `ppart-${Date.now()}`,
    program_id: input.program_id || null,
    participant_type: input.participant_type || "Visitor",
    full_name: input.full_name || "",
    attendance_status: input.attendance_status || "Not Checked In",
    status: input.status || "Registered",
    born_again: !!input.born_again,
    new_convert: !!input.new_convert,
    foundation_interest: !!input.foundation_interest,
    counseling_interest: !!input.counseling_interest,
    cell_interest: !!input.cell_interest,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramRegistration(
  input: Partial<ProgramRegistration> & { id?: string },
): ProgramRegistration {
  return {
    ...input,
    id: input.id || `preg-${Date.now()}`,
    registration_number: input.registration_number || "",
    program_id: input.program_id || null,
    participant_type: input.participant_type || "Visitor",
    full_name: input.full_name || "",
    status: input.status || "Pending",
    payment_required: !!input.payment_required,
    payment_status: input.payment_status || "Not Required",
    amount: Number(input.amount ?? 0),
    currency: input.currency || "MTn",
    finance_record_id: input.finance_record_id ?? null,
    checked_in: !!input.checked_in,
    registration_date: input.registration_date || todayIso(),
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramResource(
  input: Partial<ProgramResource> & { id?: string },
): ProgramResource {
  return {
    ...input,
    id: input.id || `pres-${Date.now()}`,
    program_id: input.program_id || null,
    resource_type: input.resource_type || "Other",
    resource_name: input.resource_name || "",
    quantity_required: Number(input.quantity_required ?? 0),
    quantity_available: Number(input.quantity_available ?? 0),
    source_module: input.source_module || "Manual",
    status: input.status || "Needed",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramBudget(
  input: Partial<ProgramBudget> & { id?: string },
): ProgramBudget {
  return {
    ...input,
    id: input.id || `pbud-${Date.now()}`,
    program_id: input.program_id || null,
    budget_item: input.budget_item || "",
    category: input.category || "Other",
    estimated_amount: Number(input.estimated_amount ?? 0),
    approved_amount: Number(input.approved_amount ?? 0),
    spent_amount: Number(input.spent_amount ?? 0),
    currency: input.currency || "MTn",
    status: input.status || "Draft",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramChecklist(
  input: Partial<ProgramChecklist> & { id?: string },
): ProgramChecklist {
  return {
    ...input,
    id: input.id || `pchk-${Date.now()}`,
    program_id: input.program_id || null,
    checklist_type: input.checklist_type || "Pre-Program",
    status: input.status || "Open",
    venue_ready: !!input.venue_ready,
    media_ready: !!input.media_ready,
    sound_ready: !!input.sound_ready,
    streaming_ready: !!input.streaming_ready,
    materials_ready: !!input.materials_ready,
    staff_ready: !!input.staff_ready,
    security_ready: !!input.security_ready,
    decoration_ready: !!input.decoration_ready,
    registration_ready: !!input.registration_ready,
    transport_ready: !!input.transport_ready,
    finance_ready: !!input.finance_ready,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeProgramReport(
  input: Partial<ProgramReport> & { id?: string },
): ProgramReport {
  return {
    ...input,
    id: input.id || `prep-${Date.now()}`,
    report_number: input.report_number || "",
    program_id: input.program_id || null,
    report_date: input.report_date || todayIso(),
    attendance_total: Number(input.attendance_total ?? 0),
    first_timers_count: Number(input.first_timers_count ?? 0),
    new_converts_count: Number(input.new_converts_count ?? 0),
    foundation_interest_count: Number(input.foundation_interest_count ?? 0),
    counseling_interest_count: Number(input.counseling_interest_count ?? 0),
    cell_interest_count: Number(input.cell_interest_count ?? 0),
    sessions_completed: Number(input.sessions_completed ?? 0),
    teams_involved: Number(input.teams_involved ?? 0),
    materials_distributed: Number(input.materials_distributed ?? 0),
    media_coverage_done: !!input.media_coverage_done,
    budget_approved: Number(input.budget_approved ?? 0),
    budget_spent: Number(input.budget_spent ?? 0),
    currency: input.currency || "MTn",
    status: input.status || "Draft",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------

export async function listPrograms(): Promise<DataResult<Program[]>> {
  try {
    const r = await getDataProvider().programs.list();
    if (!r.ok) return r as DataResult<Program[]>;
    return ok((r.data || []).map((x) => normalizeProgram(x as Program)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrograms failed");
  }
}

export async function getProgramById(id: EntityId) {
  try {
    const r = await getDataProvider().programs.getById(id);
    if (!r.ok) return r as DataResult<Program | null>;
    return ok(r.data ? normalizeProgram(r.data as Program) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramById failed");
  }
}

export async function createProgram(payload: Partial<Program>) {
  try {
    const list = await listPrograms();
    const codes = (list.ok ? list.data : []).map((p) => p.program_code || "");
    const row = normalizeProgram({
      ...payload,
      program_code: payload.program_code || nextNum("PROG", codes),
    });
    const created = await getDataProvider().programs.create!(row);
    if (!created.ok) return created as DataResult<Program>;
    await softAudit("create_program", "Program", created.data!.id, row.name || "");
    return ok(normalizeProgram(created.data as Program));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgram failed");
  }
}

export async function updateProgram(id: EntityId, payload: Partial<Program>) {
  try {
    const existing = await getProgramById(id);
    if (!existing.ok || !existing.data) return fail("Programa não encontrado", "NOT_FOUND");
    const merged = normalizeProgram({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programs.update!(id, merged);
    if (!r.ok) return r as DataResult<Program>;
    await softAudit("update_program", "Program", id);
    return ok(normalizeProgram(r.data as Program));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgram failed");
  }
}

export async function deleteProgram(id: EntityId) {
  try {
    const r = await getDataProvider().programs.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    await softAudit("delete_program", "Program", id);
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteProgram failed");
  }
}

export async function searchPrograms(query: string) {
  const list = await listPrograms();
  if (!list.ok) return list;
  const q = sk(query);
  if (!q) return list;
  return ok(
    list.data.filter(
      (p) =>
        sk(p.name).includes(q) ||
        sk(p.program_code).includes(q) ||
        sk(p.program_type).includes(q) ||
        sk(p.category).includes(q) ||
        sk(p.owner).includes(q),
    ),
  );
}

export async function getProgramsByChurch(churchId: EntityId) {
  const list = await listPrograms();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.church_id === churchId));
}

export async function getProgramsByType(programType: string) {
  const list = await listPrograms();
  if (!list.ok) return list;
  const t = sk(programType);
  return ok(list.data.filter((p) => sk(p.program_type) === t));
}

export async function getProgramsByStatus(status: string) {
  const list = await listPrograms();
  if (!list.ok) return list;
  const s = sk(status);
  return ok(list.data.filter((p) => sk(p.status) === s || sk(p.estado) === s));
}

export async function getProgramsByDateRange(startDate: string, endDate: string) {
  const list = await listPrograms();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => {
      const d = String(p.start_date || "");
      return d >= startDate && d <= endDate;
    }),
  );
}

export async function getUpcomingPrograms() {
  const list = await listPrograms();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter(
      (p) =>
        String(p.start_date || "") >= today &&
        !/cancel|complete|closed|conclu/i.test(String(p.status || p.estado || "")),
    ),
  );
}

export async function getTodayPrograms() {
  const list = await listPrograms();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(list.data.filter((p) => p.start_date === today || p.end_date === today));
}

export async function getActivePrograms() {
  const list = await listPrograms();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) =>
      /sched|progress|approv|planning|agend|curso|aprov|plane/i.test(
        String(p.status || p.estado || ""),
      ),
    ),
  );
}

export async function getCompletedPrograms() {
  const list = await listPrograms();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => /complete|conclu|closed|fechado/i.test(String(p.status || p.estado || ""))),
  );
}

export async function getCancelledPrograms() {
  const list = await listPrograms();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => /cancel/i.test(String(p.status || p.estado || ""))));
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export async function listProgramSessions(): Promise<DataResult<ProgramSession[]>> {
  try {
    const r = await getDataProvider().programSessions.list();
    if (!r.ok) return r as DataResult<ProgramSession[]>;
    return ok((r.data || []).map((x) => normalizeProgramSession(x as ProgramSession)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramSessions failed");
  }
}

export async function getProgramSessionById(id: EntityId) {
  try {
    const r = await getDataProvider().programSessions.getById(id);
    if (!r.ok) return r as DataResult<ProgramSession | null>;
    return ok(r.data ? normalizeProgramSession(r.data as ProgramSession) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramSessionById failed");
  }
}

export async function createProgramSession(payload: Partial<ProgramSession>) {
  try {
    const row = normalizeProgramSession(payload);
    if (!row.program_name && row.program_id) {
      const prog = await getProgramById(row.program_id);
      if (prog.ok && prog.data) row.program_name = prog.data.name || "";
    }
    const created = await getDataProvider().programSessions.create!(row);
    if (!created.ok) return created as DataResult<ProgramSession>;
    await softAudit("create_session", "ProgramSession", created.data!.id);
    return ok(normalizeProgramSession(created.data as ProgramSession));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramSession failed");
  }
}

export async function updateProgramSession(id: EntityId, payload: Partial<ProgramSession>) {
  try {
    const existing = await getProgramSessionById(id);
    if (!existing.ok || !existing.data) return fail("Sessão não encontrada", "NOT_FOUND");
    const merged = normalizeProgramSession({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programSessions.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramSession>;
    return ok(normalizeProgramSession(r.data as ProgramSession));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramSession failed");
  }
}

export async function deleteProgramSession(id: EntityId) {
  try {
    const r = await getDataProvider().programSessions.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteProgramSession failed");
  }
}

export async function getSessionsByProgram(programId: EntityId) {
  const list = await listProgramSessions();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.program_id === programId));
}

export async function getSessionsByDate(date: string) {
  const list = await listProgramSessions();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.session_date === date));
}

export async function getSessionsBySpeaker(speakerId: EntityId) {
  const list = await listProgramSessions();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.speaker_id === speakerId || sk(s.speaker_name) === sk(speakerId)));
}

export async function completeProgramSession(
  id: EntityId,
  payload: { attendance_count?: number; notes?: string } = {},
) {
  const r = await updateProgramSession(id, {
    status: "Completed",
    attendance_count: payload.attendance_count,
    notes: payload.notes,
  });
  if (r.ok) await softAudit("complete_session", "ProgramSession", id);
  return r;
}

export async function cancelProgramSession(id: EntityId, payload: { notes?: string } = {}) {
  const r = await updateProgramSession(id, { status: "Cancelled", notes: payload.notes });
  if (r.ok) await softAudit("cancel_session", "ProgramSession", id);
  return r;
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export async function listProgramTeams(): Promise<DataResult<ProgramTeam[]>> {
  try {
    const r = await getDataProvider().programTeams.list();
    if (!r.ok) return r as DataResult<ProgramTeam[]>;
    return ok((r.data || []).map((x) => normalizeProgramTeam(x as ProgramTeam)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramTeams failed");
  }
}

export async function getProgramTeamById(id: EntityId) {
  try {
    const r = await getDataProvider().programTeams.getById(id);
    if (!r.ok) return r as DataResult<ProgramTeam | null>;
    return ok(r.data ? normalizeProgramTeam(r.data as ProgramTeam) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramTeamById failed");
  }
}

export async function createProgramTeam(payload: Partial<ProgramTeam>) {
  try {
    const row = normalizeProgramTeam(payload);
    const created = await getDataProvider().programTeams.create!(row);
    if (!created.ok) return created as DataResult<ProgramTeam>;
    await softAudit("create_team", "ProgramTeam", created.data!.id);
    return ok(normalizeProgramTeam(created.data as ProgramTeam));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramTeam failed");
  }
}

export async function updateProgramTeam(id: EntityId, payload: Partial<ProgramTeam>) {
  try {
    const existing = await getProgramTeamById(id);
    if (!existing.ok || !existing.data) return fail("Equipa não encontrada", "NOT_FOUND");
    const merged = normalizeProgramTeam({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programTeams.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramTeam>;
    return ok(normalizeProgramTeam(r.data as ProgramTeam));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramTeam failed");
  }
}

export async function deleteProgramTeam(id: EntityId) {
  try {
    const r = await getDataProvider().programTeams.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteProgramTeam failed");
  }
}

export async function getTeamsByProgram(programId: EntityId) {
  const list = await listProgramTeams();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => t.program_id === programId));
}

export async function getTeamsByDepartment(departmentId: EntityId) {
  const list = await listProgramTeams();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => t.department_id === departmentId));
}

export async function getTeamsByMember(staffId: EntityId) {
  const list = await listProgramTeams();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (t) =>
        t.leader_staff_id === staffId ||
        (t.members || []).some((m) => m.staff_id === staffId),
    ),
  );
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

export async function listProgramParticipants(): Promise<DataResult<ProgramParticipant[]>> {
  try {
    const r = await getDataProvider().programParticipants.list();
    if (!r.ok) return r as DataResult<ProgramParticipant[]>;
    return ok((r.data || []).map((x) => normalizeProgramParticipant(x as ProgramParticipant)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramParticipants failed");
  }
}

export async function getProgramParticipantById(id: EntityId) {
  try {
    const r = await getDataProvider().programParticipants.getById(id);
    if (!r.ok) return r as DataResult<ProgramParticipant | null>;
    return ok(r.data ? normalizeProgramParticipant(r.data as ProgramParticipant) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramParticipantById failed");
  }
}

export async function createProgramParticipant(payload: Partial<ProgramParticipant>) {
  try {
    const row = normalizeProgramParticipant(payload);
    const created = await getDataProvider().programParticipants.create!(row);
    if (!created.ok) return created as DataResult<ProgramParticipant>;
    await softAudit("create_participant", "ProgramParticipant", created.data!.id);
    return ok(normalizeProgramParticipant(created.data as ProgramParticipant));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramParticipant failed");
  }
}

export async function updateProgramParticipant(
  id: EntityId,
  payload: Partial<ProgramParticipant>,
) {
  try {
    const existing = await getProgramParticipantById(id);
    if (!existing.ok || !existing.data) return fail("Participante não encontrado", "NOT_FOUND");
    const merged = normalizeProgramParticipant({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programParticipants.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramParticipant>;
    return ok(normalizeProgramParticipant(r.data as ProgramParticipant));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramParticipant failed");
  }
}

export async function deleteProgramParticipant(id: EntityId) {
  try {
    const r = await getDataProvider().programParticipants.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteProgramParticipant failed");
  }
}

export async function getParticipantsByProgram(programId: EntityId) {
  const list = await listProgramParticipants();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.program_id === programId));
}

export async function getParticipantsByType(participantType: string) {
  const list = await listProgramParticipants();
  if (!list.ok) return list;
  const t = sk(participantType);
  return ok(list.data.filter((p) => sk(p.participant_type) === t));
}

export async function getParticipantsByStatus(status: string) {
  const list = await listProgramParticipants();
  if (!list.ok) return list;
  const s = sk(status);
  return ok(list.data.filter((p) => sk(p.status) === s));
}

export async function markProgramParticipantAttendance(
  id: EntityId,
  payload: { attendance_status?: string; notes?: string } = {},
) {
  const status = payload.attendance_status || "Present";
  return updateProgramParticipant(id, {
    attendance_status: status,
    check_in_time: /present|late/i.test(status) ? nowIso() : undefined,
    status: /present|late/i.test(status) ? "Attended" : status === "Absent" ? "No Show" : "Registered",
    notes: payload.notes,
  });
}

// ---------------------------------------------------------------------------
// Registrations — no auto financeRecord
// ---------------------------------------------------------------------------

export async function listProgramRegistrations(): Promise<DataResult<ProgramRegistration[]>> {
  try {
    const r = await getDataProvider().programRegistrations.list();
    if (!r.ok) return r as DataResult<ProgramRegistration[]>;
    return ok((r.data || []).map((x) => normalizeProgramRegistration(x as ProgramRegistration)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramRegistrations failed");
  }
}

export async function getProgramRegistrationById(id: EntityId) {
  try {
    const r = await getDataProvider().programRegistrations.getById(id);
    if (!r.ok) return r as DataResult<ProgramRegistration | null>;
    return ok(r.data ? normalizeProgramRegistration(r.data as ProgramRegistration) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramRegistrationById failed");
  }
}

export async function createProgramRegistration(payload: Partial<ProgramRegistration>) {
  try {
    const list = await listProgramRegistrations();
    const nums = (list.ok ? list.data : []).map((r) => r.registration_number || "");
    const row = normalizeProgramRegistration({
      ...payload,
      registration_number: payload.registration_number || nextNum("PREG", nums),
      finance_record_id: null,
    });
    const created = await getDataProvider().programRegistrations.create!(row);
    if (!created.ok) return created as DataResult<ProgramRegistration>;
    await softAudit("create_registration", "ProgramRegistration", created.data!.id);
    return ok(normalizeProgramRegistration(created.data as ProgramRegistration));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramRegistration failed");
  }
}

export async function updateProgramRegistration(
  id: EntityId,
  payload: Partial<ProgramRegistration>,
) {
  try {
    const existing = await getProgramRegistrationById(id);
    if (!existing.ok || !existing.data) return fail("Inscrição não encontrada", "NOT_FOUND");
    const merged = normalizeProgramRegistration({
      ...existing.data,
      ...payload,
      id,
      finance_record_id: existing.data.finance_record_id ?? null,
    });
    const r = await getDataProvider().programRegistrations.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramRegistration>;
    return ok(normalizeProgramRegistration(r.data as ProgramRegistration));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramRegistration failed");
  }
}

export async function approveProgramRegistration(
  id: EntityId,
  payload: { notes?: string } = {},
) {
  const r = await updateProgramRegistration(id, {
    status: "Approved",
    notes: payload.notes,
  });
  if (r.ok) await softAudit("approve_registration", "ProgramRegistration", id);
  return r;
}

export async function rejectProgramRegistration(
  id: EntityId,
  payload: { notes?: string } = {},
) {
  const r = await updateProgramRegistration(id, { status: "Rejected", notes: payload.notes });
  if (r.ok) await softAudit("reject_registration", "ProgramRegistration", id);
  return r;
}

export async function checkInProgramRegistration(
  id: EntityId,
  payload: { notes?: string } = {},
) {
  const existing = await getProgramRegistrationById(id);
  if (!existing.ok || !existing.data) return fail("Inscrição não encontrada", "NOT_FOUND");
  const r = await updateProgramRegistration(id, {
    status: "Checked In",
    checked_in: true,
    check_in_time: nowIso(),
    notes: payload.notes,
  });
  if (r.ok) {
    // soft create participant if not exists
    try {
      await createProgramParticipant({
        program_id: existing.data.program_id,
        program_name: existing.data.program_name,
        participant_type: existing.data.participant_type,
        full_name: existing.data.full_name,
        phone: existing.data.phone,
        email: existing.data.email,
        church_id: existing.data.church_id,
        registration_id: id,
        attendance_status: "Present",
        check_in_time: nowIso(),
        status: "Checked In",
      });
    } catch {
      /* soft */
    }
    await softAudit("checkin_registration", "ProgramRegistration", id);
  }
  return r;
}

export async function getRegistrationsByProgram(programId: EntityId) {
  const list = await listProgramRegistrations();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.program_id === programId));
}

export async function getRegistrationsByStatus(status: string) {
  const list = await listProgramRegistrations();
  if (!list.ok) return list;
  const s = sk(status);
  return ok(list.data.filter((r) => sk(r.status) === s));
}

export async function getPendingProgramRegistrations() {
  const list = await listProgramRegistrations();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => /pend/i.test(String(r.status || ""))));
}

export async function getCheckedInRegistrations(programId: EntityId) {
  const list = await getRegistrationsByProgram(programId);
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.checked_in || /check/i.test(String(r.status || ""))));
}

// ---------------------------------------------------------------------------
// Resources — soft links only
// ---------------------------------------------------------------------------

export async function listProgramResources(): Promise<DataResult<ProgramResource[]>> {
  try {
    const r = await getDataProvider().programResources.list();
    if (!r.ok) return r as DataResult<ProgramResource[]>;
    return ok((r.data || []).map((x) => normalizeProgramResource(x as ProgramResource)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramResources failed");
  }
}

export async function getProgramResourceById(id: EntityId) {
  try {
    const r = await getDataProvider().programResources.getById(id);
    if (!r.ok) return r as DataResult<ProgramResource | null>;
    return ok(r.data ? normalizeProgramResource(r.data as ProgramResource) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramResourceById failed");
  }
}

export async function createProgramResource(payload: Partial<ProgramResource>) {
  try {
    const row = normalizeProgramResource(payload);
    const created = await getDataProvider().programResources.create!(row);
    if (!created.ok) return created as DataResult<ProgramResource>;
    await softAudit("create_resource", "ProgramResource", created.data!.id);
    return ok(normalizeProgramResource(created.data as ProgramResource));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramResource failed");
  }
}

export async function updateProgramResource(id: EntityId, payload: Partial<ProgramResource>) {
  try {
    const existing = await getProgramResourceById(id);
    if (!existing.ok || !existing.data) return fail("Recurso não encontrado", "NOT_FOUND");
    const merged = normalizeProgramResource({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programResources.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramResource>;
    return ok(normalizeProgramResource(r.data as ProgramResource));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramResource failed");
  }
}

export async function deleteProgramResource(id: EntityId) {
  try {
    const r = await getDataProvider().programResources.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteProgramResource failed");
  }
}

export async function getResourcesByProgram(programId: EntityId) {
  const list = await listProgramResources();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.program_id === programId));
}

export async function getResourcesByType(resourceType: string) {
  const list = await listProgramResources();
  if (!list.ok) return list;
  const t = sk(resourceType);
  return ok(list.data.filter((r) => sk(r.resource_type) === t));
}

export async function getPendingProgramResources() {
  const list = await listProgramResources();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => /need|request|pend|aprov/i.test(String(r.status || ""))),
  );
}

export async function markProgramResourceReady(id: EntityId, payload: { notes?: string } = {}) {
  return updateProgramResource(id, { status: "Ready", notes: payload.notes });
}

export async function markProgramResourceUsed(id: EntityId, payload: { notes?: string } = {}) {
  return updateProgramResource(id, { status: "Used", notes: payload.notes });
}

/** Explicit soft-create material request via CEMinistryMaterials if present. */
export async function requestMinistryMaterialsForProgram(
  programId: EntityId,
  payload: {
    material_name?: string;
    material_id?: string;
    quantity_requested?: number;
    notes?: string;
  } = {},
) {
  try {
    const prog = await getProgramById(programId);
    if (!prog.ok || !prog.data) return fail("Programa não encontrado", "NOT_FOUND");
    const root = globalThis as unknown as {
      CEMinistryMaterials?: {
        createMaterialRequest?: (p: Record<string, unknown>) => Promise<DataResult<Record<string, unknown>>>;
      };
    };
    const mm = root.CEMinistryMaterials;
    if (!mm?.createMaterialRequest) {
      // fallback: create resource only
      const res = await createProgramResource({
        program_id: programId,
        program_name: prog.data.name,
        resource_type: "Ministry Material",
        resource_name: payload.material_name || "Material",
        quantity_required: payload.quantity_requested || 0,
        source_module: "Ministry Materials",
        status: "Needed",
        notes: payload.notes || "CEMinistryMaterials indisponível — recurso local",
      });
      return ok({ resource: res.ok ? res.data : null, materialRequest: null, soft: true });
    }
    const req = await mm.createMaterialRequest({
      source: "Program",
      source_module: "programs",
      source_id: programId,
      material_id: payload.material_id || null,
      material_name: payload.material_name || "",
      quantity_requested: payload.quantity_requested || 0,
      target_type: "Program",
      target_id: programId,
      target_name: prog.data.name,
      church_id: prog.data.church_id,
      status: "Pending",
      notes: payload.notes || `Pedido do programa ${prog.data.name}`,
    });
    const res = await createProgramResource({
      program_id: programId,
      program_name: prog.data.name,
      resource_type: "Ministry Material",
      resource_name: payload.material_name || "Material",
      quantity_required: payload.quantity_requested || 0,
      source_module: "Ministry Materials",
      source_id: req?.ok ? String((req.data as { id?: string }).id || "") : null,
      status: "Requested",
      notes: payload.notes,
    });
    return ok({
      resource: res.ok ? res.data : null,
      materialRequest: req?.ok ? req.data : null,
      soft: false,
    });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "requestMinistryMaterialsForProgram failed");
  }
}

// ---------------------------------------------------------------------------
// Budgets — no auto expense / financeRecord
// ---------------------------------------------------------------------------

export async function listProgramBudgets(): Promise<DataResult<ProgramBudget[]>> {
  try {
    const r = await getDataProvider().programBudgets.list();
    if (!r.ok) return r as DataResult<ProgramBudget[]>;
    return ok((r.data || []).map((x) => normalizeProgramBudget(x as ProgramBudget)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramBudgets failed");
  }
}

export async function getProgramBudgetById(id: EntityId) {
  try {
    const r = await getDataProvider().programBudgets.getById(id);
    if (!r.ok) return r as DataResult<ProgramBudget | null>;
    return ok(r.data ? normalizeProgramBudget(r.data as ProgramBudget) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramBudgetById failed");
  }
}

export async function createProgramBudget(payload: Partial<ProgramBudget>) {
  try {
    const row = normalizeProgramBudget(payload);
    const created = await getDataProvider().programBudgets.create!(row);
    if (!created.ok) return created as DataResult<ProgramBudget>;
    await softAudit(
      "create_budget",
      "ProgramBudget",
      created.data!.id,
      "budget only — no financeRecord",
    );
    return ok(normalizeProgramBudget(created.data as ProgramBudget));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramBudget failed");
  }
}

export async function updateProgramBudget(id: EntityId, payload: Partial<ProgramBudget>) {
  try {
    const existing = await getProgramBudgetById(id);
    if (!existing.ok || !existing.data) return fail("Orçamento não encontrado", "NOT_FOUND");
    const merged = normalizeProgramBudget({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programBudgets.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramBudget>;
    await softAudit("update_budget", "ProgramBudget", id);
    return ok(normalizeProgramBudget(r.data as ProgramBudget));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramBudget failed");
  }
}

export async function getBudgetsByProgram(programId: EntityId) {
  const list = await listProgramBudgets();
  if (!list.ok) return list;
  return ok(list.data.filter((b) => b.program_id === programId));
}

export async function getApprovedProgramBudgets() {
  const list = await listProgramBudgets();
  if (!list.ok) return list;
  return ok(list.data.filter((b) => /approv|aprov/i.test(String(b.status || ""))));
}

export async function getPendingProgramBudgets() {
  const list = await listProgramBudgets();
  if (!list.ok) return list;
  return ok(list.data.filter((b) => /draft|submit|pend/i.test(String(b.status || ""))));
}

export async function getProgramBudgetSummary(programId: EntityId) {
  const list = await getBudgetsByProgram(programId);
  if (!list.ok) return list;
  const estimated = list.data.reduce((s, b) => s + Number(b.estimated_amount || 0), 0);
  const approved = list.data.reduce((s, b) => s + Number(b.approved_amount || 0), 0);
  const spent = list.data.reduce((s, b) => s + Number(b.spent_amount || 0), 0);
  return ok({
    programId,
    items: list.data,
    estimated,
    approved,
    spent,
    currency: "MTn",
    note: "Budget is not verified expense — no automatic financeRecord",
  });
}

// ---------------------------------------------------------------------------
// Checklists
// ---------------------------------------------------------------------------

export async function listProgramChecklists(): Promise<DataResult<ProgramChecklist[]>> {
  try {
    const r = await getDataProvider().programChecklists.list();
    if (!r.ok) return r as DataResult<ProgramChecklist[]>;
    return ok((r.data || []).map((x) => normalizeProgramChecklist(x as ProgramChecklist)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramChecklists failed");
  }
}

export async function getProgramChecklistById(id: EntityId) {
  try {
    const r = await getDataProvider().programChecklists.getById(id);
    if (!r.ok) return r as DataResult<ProgramChecklist | null>;
    return ok(r.data ? normalizeProgramChecklist(r.data as ProgramChecklist) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramChecklistById failed");
  }
}

export async function createProgramChecklist(payload: Partial<ProgramChecklist>) {
  try {
    const row = normalizeProgramChecklist(payload);
    const created = await getDataProvider().programChecklists.create!(row);
    if (!created.ok) return created as DataResult<ProgramChecklist>;
    return ok(normalizeProgramChecklist(created.data as ProgramChecklist));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramChecklist failed");
  }
}

export async function updateProgramChecklist(id: EntityId, payload: Partial<ProgramChecklist>) {
  try {
    const existing = await getProgramChecklistById(id);
    if (!existing.ok || !existing.data) return fail("Checklist não encontrado", "NOT_FOUND");
    const merged = normalizeProgramChecklist({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programChecklists.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramChecklist>;
    return ok(normalizeProgramChecklist(r.data as ProgramChecklist));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramChecklist failed");
  }
}

export async function completeProgramChecklist(
  id: EntityId,
  payload: { completed_by_name?: string; notes?: string } = {},
) {
  return updateProgramChecklist(id, {
    status: "Completed",
    completed_by_name: payload.completed_by_name || "",
    completed_at: nowIso(),
  });
}

export async function getChecklistsByProgram(programId: EntityId) {
  const list = await listProgramChecklists();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => c.program_id === programId));
}

export async function getOpenProgramChecklists() {
  const list = await listProgramChecklists();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => /open|progress|open/i.test(String(c.status || ""))));
}

export async function getProgramChecklistsRequiringAttention() {
  const list = await listProgramChecklists();
  if (!list.ok) return list;
  return ok(list.data.filter((c) => /attention|require|aten/i.test(String(c.status || ""))));
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export async function listProgramReports(): Promise<DataResult<ProgramReport[]>> {
  try {
    const r = await getDataProvider().programReports.list();
    if (!r.ok) return r as DataResult<ProgramReport[]>;
    return ok((r.data || []).map((x) => normalizeProgramReport(x as ProgramReport)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listProgramReports failed");
  }
}

export async function getProgramReportById(id: EntityId) {
  try {
    const r = await getDataProvider().programReports.getById(id);
    if (!r.ok) return r as DataResult<ProgramReport | null>;
    return ok(r.data ? normalizeProgramReport(r.data as ProgramReport) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getProgramReportById failed");
  }
}

export async function createProgramReport(payload: Partial<ProgramReport>) {
  try {
    const list = await listProgramReports();
    const nums = (list.ok ? list.data : []).map((r) => r.report_number || "");
    const row = normalizeProgramReport({
      ...payload,
      report_number: payload.report_number || nextNum("PREP", nums),
    });
    const created = await getDataProvider().programReports.create!(row);
    if (!created.ok) return created as DataResult<ProgramReport>;
    if (row.program_id) {
      await updateProgram(row.program_id, {
        report_id: created.data!.id,
        status: "Report Pending",
        estado: "Relatório Pendente",
      });
    }
    await softAudit("create_report", "ProgramReport", created.data!.id);
    return ok(normalizeProgramReport(created.data as ProgramReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createProgramReport failed");
  }
}

export async function updateProgramReport(id: EntityId, payload: Partial<ProgramReport>) {
  try {
    const existing = await getProgramReportById(id);
    if (!existing.ok || !existing.data) return fail("Relatório não encontrado", "NOT_FOUND");
    const merged = normalizeProgramReport({ ...existing.data, ...payload, id });
    const r = await getDataProvider().programReports.update!(id, merged);
    if (!r.ok) return r as DataResult<ProgramReport>;
    return ok(normalizeProgramReport(r.data as ProgramReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateProgramReport failed");
  }
}

export async function submitProgramReport(
  id: EntityId,
  payload: { submitted_by_name?: string } = {},
) {
  const r = await updateProgramReport(id, {
    status: "Submitted",
    submitted_by_name: payload.submitted_by_name || "",
    submitted_at: nowIso(),
  });
  if (r.ok) await softAudit("submit_report", "ProgramReport", id);
  return r;
}

export async function validateProgramReport(
  id: EntityId,
  payload: { validated_by_name?: string } = {},
) {
  const existing = await getProgramReportById(id);
  if (!existing.ok || !existing.data) return fail("Relatório não encontrado", "NOT_FOUND");
  const r = await updateProgramReport(id, {
    status: "Validated",
    validated_by_name: payload.validated_by_name || "",
    validated_at: nowIso(),
  });
  if (r.ok && existing.data.program_id) {
    await updateProgram(existing.data.program_id, {
      status: "Closed",
      estado: "Fechado",
      actual_attendance: existing.data.attendance_total,
    });
    await softAudit("validate_report", "ProgramReport", id);
  }
  return r;
}

export async function rejectProgramReport(
  id: EntityId,
  payload: { rejection_reason?: string; rejected_by_name?: string } = {},
) {
  if (!payload.rejection_reason) return fail("rejection_reason é obrigatório", "VALIDATION");
  const r = await updateProgramReport(id, {
    status: "Needs Correction",
    rejection_reason: payload.rejection_reason,
    rejected_by_name: payload.rejected_by_name || "",
    rejected_at: nowIso(),
  });
  if (r.ok) await softAudit("reject_report", "ProgramReport", id, payload.rejection_reason);
  return r;
}

export async function getReportsByProgram(programId: EntityId) {
  const list = await listProgramReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.program_id === programId));
}

export async function getReportsByStatus(status: string) {
  const list = await listProgramReports();
  if (!list.ok) return list;
  const s = sk(status);
  return ok(list.data.filter((r) => sk(r.status) === s));
}

export async function getPendingProgramReports() {
  const list = await listProgramReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => /draft|submit|pend|rascun|submet/i.test(String(r.status || ""))));
}

export async function getValidatedProgramReports() {
  const list = await listProgramReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => /valid/i.test(String(r.status || ""))));
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getProgramsOverviewStats(_filters: Record<string, unknown> = {}) {
  const [programs, sessions, regs, reports, budgets, checklists] = await Promise.all([
    listPrograms(),
    listProgramSessions(),
    listProgramRegistrations(),
    listProgramReports(),
    listProgramBudgets(),
    listProgramChecklists(),
  ]);
  const p = programs.ok ? programs.data : [];
  const r = reports.ok ? reports.data : [];
  return ok({
    totalPrograms: p.length,
    upcoming: p.filter((x) => String(x.start_date || "") >= todayIso()).length,
    active: p.filter((x) =>
      /sched|progress|approv|planning/i.test(String(x.status || "")),
    ).length,
    completed: p.filter((x) => /complete|closed|conclu/i.test(String(x.status || ""))).length,
    reportPending: p.filter((x) => /report pend/i.test(String(x.status || ""))).length,
    sessions: sessions.ok ? sessions.data.length : 0,
    registrations: regs.ok ? regs.data.length : 0,
    pendingRegistrations: regs.ok
      ? regs.data.filter((x) => /pend/i.test(String(x.status || ""))).length
      : 0,
    totalAttendance: r.reduce((s, x) => s + Number(x.attendance_total || 0), 0),
    newConverts: r.reduce((s, x) => s + Number(x.new_converts_count || 0), 0),
    budgetEstimated: budgets.ok
      ? budgets.data.reduce((s, b) => s + Number(b.estimated_amount || 0), 0)
      : 0,
    checklistsAttention: checklists.ok
      ? checklists.data.filter((c) => /attention|require/i.test(String(c.status || ""))).length
      : 0,
    currency: "MTn",
    note: "Budget is planning data — not verified finance expense",
  });
}

export async function getProgramAttendanceReport(_filters = {}) {
  const [parts, regs, reports] = await Promise.all([
    listProgramParticipants(),
    listProgramRegistrations(),
    listProgramReports(),
  ]);
  return ok({
    participants: parts.ok ? parts.data : [],
    registrations: regs.ok ? regs.data : [],
    reports: reports.ok ? reports.data : [],
  });
}

export async function getProgramBudgetReport(_filters = {}) {
  const list = await listProgramBudgets();
  if (!list.ok) return list;
  return ok({
    budgets: list.data,
    totalEstimated: list.data.reduce((s, b) => s + Number(b.estimated_amount || 0), 0),
    totalApproved: list.data.reduce((s, b) => s + Number(b.approved_amount || 0), 0),
    financeRecordsCreated: 0,
    note: "No automatic financeRecord from program budgets",
  });
}

export async function getProgramImpactReport(_filters = {}) {
  const list = await listProgramReports();
  if (!list.ok) return list;
  return ok({
    reports: list.data,
    attendance: list.data.reduce((s, r) => s + Number(r.attendance_total || 0), 0),
    firstTimers: list.data.reduce((s, r) => s + Number(r.first_timers_count || 0), 0),
    newConverts: list.data.reduce((s, r) => s + Number(r.new_converts_count || 0), 0),
    foundationInterest: list.data.reduce(
      (s, r) => s + Number(r.foundation_interest_count || 0),
      0,
    ),
  });
}

export async function getProgramResourcesReport(_filters = {}) {
  const list = await listProgramResources();
  if (!list.ok) return list;
  return ok({ resources: list.data });
}

export async function getProgramDepartmentReport(_filters = {}) {
  const teams = await listProgramTeams();
  if (!teams.ok) return teams;
  return ok({ teams: teams.data });
}

export async function getProgramMediaReport(_filters = {}) {
  const list = await listProgramResources();
  if (!list.ok) return list;
  return ok({
    mediaResources: list.data.filter((r) => /media|sound|stream/i.test(String(r.resource_type || ""))),
  });
}

export async function getProgramMaterialsReport(_filters = {}) {
  const list = await listProgramResources();
  if (!list.ok) return list;
  return ok({
    materials: list.data.filter((r) => /material/i.test(String(r.resource_type || r.source_module || ""))),
  });
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureProgramsSeeded(): Promise<DataResult<boolean>> {
  try {
    const p = getDataProvider();
    async function seed<T extends { id: string }>(
      listFn: () => Promise<DataResult<T[]>>,
      createFn: (row: T) => Promise<DataResult<T>>,
      rows: T[],
    ) {
      const existing = await listFn();
      if (existing.ok && existing.data.length) return;
      for (const row of rows) await createFn(row);
    }
    await seed(listPrograms, (r) => p.programs.create!(normalizeProgram(r)), PROGRAMS_SEED as Program[]);
    await seed(
      listProgramSessions,
      (r) => p.programSessions.create!(normalizeProgramSession(r)),
      PROGRAM_SESSIONS_SEED as ProgramSession[],
    );
    await seed(
      listProgramTeams,
      (r) => p.programTeams.create!(normalizeProgramTeam(r)),
      PROGRAM_TEAMS_SEED as ProgramTeam[],
    );
    await seed(
      listProgramParticipants,
      (r) => p.programParticipants.create!(normalizeProgramParticipant(r)),
      PROGRAM_PARTICIPANTS_SEED as ProgramParticipant[],
    );
    await seed(
      listProgramRegistrations,
      (r) => p.programRegistrations.create!(normalizeProgramRegistration(r)),
      PROGRAM_REGISTRATIONS_SEED as ProgramRegistration[],
    );
    await seed(
      listProgramResources,
      (r) => p.programResources.create!(normalizeProgramResource(r)),
      PROGRAM_RESOURCES_SEED as ProgramResource[],
    );
    await seed(
      listProgramBudgets,
      (r) => p.programBudgets.create!(normalizeProgramBudget(r)),
      PROGRAM_BUDGETS_SEED as ProgramBudget[],
    );
    await seed(
      listProgramChecklists,
      (r) => p.programChecklists.create!(normalizeProgramChecklist(r)),
      PROGRAM_CHECKLISTS_SEED as ProgramChecklist[],
    );
    await seed(
      listProgramReports,
      (r) => p.programReports.create!(normalizeProgramReport(r)),
      PROGRAM_REPORTS_SEED as ProgramReport[],
    );
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureProgramsSeeded failed");
  }
}

export function getProgramsDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "programs",
  };
}

export {
  PROGRAMS_SEED,
  PROGRAM_SESSIONS_SEED,
  PROGRAM_TEAMS_SEED,
  PROGRAM_PARTICIPANTS_SEED,
  PROGRAM_REGISTRATIONS_SEED,
  PROGRAM_RESOURCES_SEED,
  PROGRAM_BUDGETS_SEED,
  PROGRAM_CHECKLISTS_SEED,
  PROGRAM_REPORTS_SEED,
};

export const programsEventsRepository = {
  listPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  searchPrograms,
  getProgramsByChurch,
  getProgramsByType,
  getProgramsByStatus,
  getProgramsByDateRange,
  getUpcomingPrograms,
  getTodayPrograms,
  getActivePrograms,
  getCompletedPrograms,
  getCancelledPrograms,
  listProgramSessions,
  getProgramSessionById,
  createProgramSession,
  updateProgramSession,
  deleteProgramSession,
  getSessionsByProgram,
  completeProgramSession,
  cancelProgramSession,
  listProgramTeams,
  createProgramTeam,
  updateProgramTeam,
  getTeamsByProgram,
  listProgramParticipants,
  createProgramParticipant,
  updateProgramParticipant,
  markProgramParticipantAttendance,
  getParticipantsByProgram,
  listProgramRegistrations,
  createProgramRegistration,
  updateProgramRegistration,
  approveProgramRegistration,
  rejectProgramRegistration,
  checkInProgramRegistration,
  getPendingProgramRegistrations,
  listProgramResources,
  createProgramResource,
  updateProgramResource,
  markProgramResourceReady,
  markProgramResourceUsed,
  getPendingProgramResources,
  requestMinistryMaterialsForProgram,
  listProgramBudgets,
  createProgramBudget,
  updateProgramBudget,
  getProgramBudgetSummary,
  getPendingProgramBudgets,
  listProgramChecklists,
  createProgramChecklist,
  updateProgramChecklist,
  completeProgramChecklist,
  getProgramChecklistsRequiringAttention,
  listProgramReports,
  createProgramReport,
  updateProgramReport,
  submitProgramReport,
  validateProgramReport,
  rejectProgramReport,
  getPendingProgramReports,
  getProgramsOverviewStats,
  getProgramAttendanceReport,
  getProgramBudgetReport,
  getProgramImpactReport,
  getProgramResourcesReport,
  ensureProgramsSeeded,
  getProgramsDataSourceInfo,
  getInfo: getProgramsDataSourceInfo,
};
