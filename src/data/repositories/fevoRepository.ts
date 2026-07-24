import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  FevoActivity,
  FevoEvangelismRecord,
  FevoFollowUpRecord,
  FevoMissingReport,
  FevoPrayerRecord,
  FevoReport,
  FevoTeam,
  FevoVisitationRecord,
  FevoWeeklyConfig,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { FEVO_WEEKLY_CONFIGS_SEED } from "../seeds/fevoWeeklyConfigsSeed";
import { FEVO_TEAMS_SEED } from "../seeds/fevoTeamsSeed";
import { FEVO_ACTIVITIES_SEED } from "../seeds/fevoActivitiesSeed";
import { FEVO_REPORTS_SEED } from "../seeds/fevoReportsSeed";
import { FEVO_MISSING_REPORTS_SEED } from "../seeds/fevoMissingReportsSeed";
import { FEVO_FOLLOW_UP_RECORDS_SEED } from "../seeds/fevoFollowUpRecordsSeed";
import { FEVO_EVANGELISM_RECORDS_SEED } from "../seeds/fevoEvangelismRecordsSeed";
import { FEVO_VISITATION_RECORDS_SEED } from "../seeds/fevoVisitationRecordsSeed";
import { FEVO_PRAYER_RECORDS_SEED } from "../seeds/fevoPrayerRecordsSeed";

function fail<T>(error: string, code = "FEVO_ERROR"): DataResult<T> {
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

function mapConfigStatus(s: string | null | undefined): { status: string; estado: string } {
  const k = statusKey(s);
  if (k.includes("activ") || k.includes("activo")) return { status: "Active", estado: "Activo" };
  if (k.includes("fech") || k.includes("close")) return { status: "Closed", estado: "Fechado" };
  if (k.includes("rascun") || k.includes("draft")) return { status: "Draft", estado: "Rascunho" };
  return { status: s || "Draft", estado: s || "Rascunho" };
}

function mapReportStatus(s: string | null | undefined): string {
  const k = statusKey(s);
  if (k.includes("needs correction") || k.includes("correc")) return "Needs Correction";
  if (k.includes("valid")) return "Validated";
  if (k.includes("aprov") || k.includes("approv")) return "Validated";
  if (k.includes("rejeit") || k.includes("reject")) return "Rejected";
  if (k.includes("revis") || k.includes("review") || k.includes("em revis")) return "Under Review";
  if (k.includes("submet") || k.includes("submit")) return "Submitted";
  if (k.includes("rascun") || k.includes("draft")) return "Draft";
  if (k.includes("archiv")) return "Archived";
  return s || "Draft";
}

function mapMissingStatus(s: string | null | undefined): string {
  const k = statusKey(s);
  if (k.includes("resolv")) return "Resolved";
  if (k.includes("contact") || k.includes("contactad")) return "Contacted";
  if (k.includes("reincid") || k.includes("recurr")) return "Recurring";
  if (k.includes("pend")) return "Pending";
  return s || "Pending";
}

function isActivityType(type: string, target: string): boolean {
  const t = statusKey(type);
  const x = statusKey(target);
  if (x.includes("acompanh") || x.includes("follow")) {
    return t.includes("acompanh") || t.includes("follow");
  }
  if (x.includes("evangel")) return t.includes("evangel");
  if (x.includes("visit")) return t.includes("visit");
  if (x.includes("ora") || x.includes("prayer")) return t.includes("ora") || t.includes("prayer");
  return t.includes(x) || x.includes(t);
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
        module: "fevo",
        details,
        severity: /validate|reject|submit|activate|close|resolve|detect/i.test(action)
          ? "warning"
          : "info",
      });
    }
  } catch {
    /* soft */
  }
}

// Soft-link to Follow-Up when creating follow-up type reports
async function softCreateFollowUp(report: FevoReport) {
  if (!isActivityType(report.activity_type || "", "Acompanhamento")) return;
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
    if (!fu?.createFollowUp) return;
    await fu.createFollowUp({
      full_name: report.leader_name || report.group_name || "F.E.V.O Contact",
      person_type: "Other",
      status: "Pending",
      metodo: "F.E.V.O Acompanhamento",
      resultado: report.followup_result || report.notes || "",
      notas: `Origem F.E.V.O report ${report.id}`,
      church_id: report.church_id,
    });
  } catch {
    /* soft — never break FEVO */
  }
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeFevoWeeklyConfig(
  input: Partial<FevoWeeklyConfig> & { id?: string },
): FevoWeeklyConfig {
  const start = input.week_start_date || input.semana_inicio || null;
  const end = input.week_end_date || input.semana_fim || null;
  const mapped = mapConfigStatus(input.status || input.estado);
  return {
    ...input,
    id: input.id || `fevo-cfg-${Date.now()}`,
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    week_start_date: start,
    week_end_date: end,
    semana_inicio: input.semana_inicio || start,
    semana_fim: input.semana_fim || end,
    team_a_activity: input.team_a_activity || "",
    team_b_activity: input.team_b_activity || "",
    team_c_activity: input.team_c_activity || "",
    team_d_activity: input.team_d_activity || "",
    prepared_by: input.prepared_by || input.preparado_por || "",
    preparado_por: input.preparado_por || input.prepared_by || "",
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    status: mapped.status,
    estado: mapped.estado,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeFevoTeam(input: Partial<FevoTeam> & { id?: string }): FevoTeam {
  return {
    ...input,
    id: input.id || `fevo-team-${Date.now()}`,
    name: input.name || "",
    code: input.code || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    leader_id: input.leader_id || null,
    leader_name: input.leader_name || "",
    members: Array.isArray(input.members) ? input.members : [],
    activity_types: Array.isArray(input.activity_types) ? input.activity_types : [],
    status: input.status || "Active",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeFevoActivity(
  input: Partial<FevoActivity> & { id?: string },
): FevoActivity {
  const cfgId = input.weekly_config_id || input.config_id || null;
  const leader = input.leader_name || input.assigned_leader_name || "";
  return {
    ...input,
    id: input.id || `fevo-act-${Date.now()}`,
    weekly_config_id: cfgId,
    config_id: cfgId,
    week_label: input.week_label || "",
    week_start_date: input.week_start_date || null,
    week_end_date: input.week_end_date || null,
    team_id: input.team_id || null,
    team_name: input.team_name || "",
    team_code: input.team_code || "",
    activity_type: input.activity_type || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    assigned_date: input.assigned_date || input.scheduled_date || null,
    due_date: input.due_date || input.week_end_date || null,
    scheduled_date: input.scheduled_date || input.assigned_date || null,
    leader_id: input.leader_id || null,
    leader_name: leader,
    assigned_leader_name: input.assigned_leader_name || leader,
    status: input.status || "Assigned",
    report_id: input.report_id || null,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeFevoReport(input: Partial<FevoReport> & { id?: string }): FevoReport {
  const start = input.week_start_date || input.semana_inicio || null;
  const end = input.week_end_date || input.semana_fim || null;
  const status = mapReportStatus(input.status);
  return {
    ...input,
    id: input.id || `fevo-rpt-${Date.now()}`,
    config_id: input.config_id || null,
    report_kind: input.report_kind || "activity",
    church_id: input.church_id || null,
    week_start_date: start,
    week_end_date: end,
    semana_inicio: input.semana_inicio || start,
    semana_fim: input.semana_fim || end,
    team: input.team || "",
    team_id: input.team_id || null,
    activity_type: input.activity_type || "",
    group_name: input.group_name || "",
    leader_name: input.leader_name || "",
    number_of_cells: Number(input.number_of_cells ?? 0) || 0,
    number_of_members: Number(input.number_of_members ?? 0) || 0,
    leaders_present: Number(input.leaders_present ?? 0) || 0,
    members_present: Number(input.members_present ?? 0) || 0,
    ft_in_church: Number(input.ft_in_church ?? 0) || 0,
    submitted_report: input.submitted_report ?? /submit|aprov|review|submet/i.test(status),
    submitted_by: input.submitted_by || "",
    submitted_at: input.submitted_at || null,
    status,
    notes: input.notes || "",
    souls_contacted: Number(input.souls_contacted ?? 0) || 0,
    feedback_count: Number(input.feedback_count ?? 0) || 0,
    followup_result: input.followup_result || "",
    next_action: input.next_action || "",
    souls_evangelized: Number(input.souls_evangelized ?? 0) || 0,
    new_converts: Number(input.new_converts ?? 0) || 0,
    evangelism_location: input.evangelism_location || "",
    materials_distributed: Number(input.materials_distributed ?? 0) || 0,
    souls_visited: Number(input.souls_visited ?? 0) || 0,
    family_members_reached: Number(input.family_members_reached ?? 0) || 0,
    visit_location: input.visit_location || "",
    visit_result: input.visit_result || "",
    average_members_present: Number(input.average_members_present ?? 0) || 0,
    days_of_prayer: Number(input.days_of_prayer ?? 0) || 0,
    prayer_focus: input.prayer_focus || "",
    prayer_testimonies: input.prayer_testimonies || "",
    title: input.title || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeFevoMissingReport(
  input: Partial<FevoMissingReport> & { id?: string },
): FevoMissingReport {
  const start = input.week_start_date || input.semana_inicio || null;
  const end = input.week_end_date || input.semana_fim || null;
  const cfgId = input.weekly_config_id || input.config_id || null;
  const teamName = input.team_name || input.team || "";
  return {
    ...input,
    id: input.id || `fevo-nr-${Date.now()}`,
    weekly_config_id: cfgId,
    config_id: cfgId,
    week_label: input.week_label || "",
    activity_id: input.activity_id || null,
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    week_start_date: start,
    week_end_date: end,
    semana_inicio: input.semana_inicio || start,
    semana_fim: input.semana_fim || end,
    team: teamName,
    team_id: input.team_id || null,
    team_name: teamName,
    team_code: input.team_code || "",
    activity_type: input.activity_type || "",
    expected_report_date: input.expected_report_date || end,
    group_name: input.group_name || "",
    leader_name: input.leader_name || "",
    reason_not_submitted: input.reason_not_submitted || "",
    followup_action: input.followup_action || "",
    resolution_notes: input.resolution_notes || "",
    contacted: !!input.contacted || !!input.contacted_at,
    contacted_by: input.contacted_by || input.contacted_by_name || "",
    contacted_by_name: input.contacted_by_name || input.contacted_by || "",
    contacted_by_user_id: input.contacted_by_user_id || null,
    contacted_at: input.contacted_at || null,
    status: mapMissingStatus(input.status),
    resolved_by: input.resolved_by || input.resolved_by_name || "",
    resolved_by_name: input.resolved_by_name || input.resolved_by || "",
    resolved_by_user_id: input.resolved_by_user_id || null,
    resolved_at: input.resolved_at || null,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Weekly configs
// ---------------------------------------------------------------------------

export async function listFevoWeeklyConfigs(): Promise<DataResult<FevoWeeklyConfig[]>> {
  try {
    const result = await getDataProvider().fevoWeeklyConfigs.list();
    if (!result.ok) return result as DataResult<FevoWeeklyConfig[]>;
    return ok((result.data || []).map((r) => normalizeFevoWeeklyConfig(r as FevoWeeklyConfig)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoWeeklyConfigs failed");
  }
}
export async function getFevoWeeklyConfigById(id: EntityId) {
  try {
    const result = await getDataProvider().fevoWeeklyConfigs.getById(id);
    if (!result.ok) return result as DataResult<FevoWeeklyConfig | null>;
    return ok(result.data ? normalizeFevoWeeklyConfig(result.data as FevoWeeklyConfig) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getFevoWeeklyConfigById failed");
  }
}
export async function createFevoWeeklyConfig(payload: Partial<FevoWeeklyConfig>) {
  try {
    const row = normalizeFevoWeeklyConfig(payload);
    const repo = getDataProvider().fevoWeeklyConfigs;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoWeeklyConfig>;
    const n = normalizeFevoWeeklyConfig(result.data as FevoWeeklyConfig);
    void softAudit("fevo_config_created", "fevo_weekly_config", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoWeeklyConfig failed");
  }
}
export async function updateFevoWeeklyConfig(id: EntityId, payload: Partial<FevoWeeklyConfig>) {
  try {
    const existing = await getFevoWeeklyConfigById(id);
    if (!existing.ok || !existing.data) return fail("Configuração não encontrada", "NOT_FOUND");
    const row = normalizeFevoWeeklyConfig({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoWeeklyConfigs;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoWeeklyConfig>;
    return ok(normalizeFevoWeeklyConfig(result.data as FevoWeeklyConfig));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoWeeklyConfig failed");
  }
}
export async function deleteFevoWeeklyConfig(id: EntityId) {
  try {
    const repo = getDataProvider().fevoWeeklyConfigs;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteFevoWeeklyConfig failed");
  }
}
export async function getFevoWeeklyConfigByWeek(weekStartDate: string, weekEndDate: string) {
  const list = await listFevoWeeklyConfigs();
  if (!list.ok) return list;
  return ok(
    list.data.filter((c) => {
      const s = String(c.week_start_date || c.semana_inicio || "");
      const e = String(c.week_end_date || c.semana_fim || "");
      return s === weekStartDate || (s >= weekStartDate && e <= weekEndDate);
    }),
  );
}
export async function getCurrentFevoWeeklyConfig() {
  const list = await listFevoWeeklyConfigs();
  if (!list.ok) return list as DataResult<FevoWeeklyConfig | null>;
  const active = list.data.find((c) => /active|activo/i.test(String(c.status || c.estado)));
  if (active) return ok(active);
  const today = todayIso();
  const inRange = list.data.find((c) => {
    const s = String(c.week_start_date || c.semana_inicio || "");
    const e = String(c.week_end_date || c.semana_fim || "");
    return s <= today && e >= today;
  });
  return ok(inRange || list.data[0] || null);
}
export async function getUpcomingFevoWeeklyConfigs() {
  const list = await listFevoWeeklyConfigs();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter((c) => String(c.week_start_date || c.semana_inicio || "") >= today),
  );
}
export async function activateFevoWeeklyConfig(id: EntityId, _payload = {}) {
  // Close other actives first (soft)
  const list = await listFevoWeeklyConfigs();
  if (list.ok) {
    for (const c of list.data) {
      if (c.id !== id && /active|activo/i.test(String(c.status || c.estado))) {
        await updateFevoWeeklyConfig(c.id, { status: "Closed", estado: "Fechado" });
      }
    }
  }
  const result = await updateFevoWeeklyConfig(id, { status: "Active", estado: "Activo" });
  if (result.ok && result.data) {
    // Auto-create Team A/B/C/D activities for this week if none exist
    const existing = await getActivitiesByWeek(id);
    if (existing.ok && existing.data.length === 0) {
      const cfg = result.data;
      const weekLabel =
        cfg.week_label ||
        `${cfg.semana_inicio || cfg.week_start_date || ""} – ${cfg.semana_fim || cfg.week_end_date || ""}`;
      const slots: Array<{ code: string; name: string; activity: string }> = [
        { code: "A", name: "Team A", activity: cfg.team_a_activity || "Follow-Up" },
        { code: "B", name: "Team B", activity: cfg.team_b_activity || "Prayer" },
        { code: "C", name: "Team C", activity: cfg.team_c_activity || "Evangelism" },
        { code: "D", name: "Team D", activity: cfg.team_d_activity || "Visitation" },
      ];
      for (const slot of slots) {
        await createFevoActivity({
          weekly_config_id: id,
          config_id: id,
          week_label: weekLabel,
          week_start_date: cfg.week_start_date || cfg.semana_inicio,
          week_end_date: cfg.week_end_date || cfg.semana_fim,
          team_name: slot.name,
          team_code: slot.code,
          activity_type: slot.activity,
          church_id: cfg.church_id,
          church_name: cfg.church_name,
          assigned_date: cfg.week_start_date || cfg.semana_inicio,
          due_date: cfg.week_end_date || cfg.semana_fim,
          scheduled_date: cfg.week_end_date || cfg.semana_fim,
          status: "Assigned",
        });
      }
      void softAudit("fevo_activity_created", "fevo_weekly_config", String(id), "A-D");
    }
    void softAudit("fevo_weekly_config_activated", "fevo_weekly_config", String(id));
  }
  return result;
}
export async function closeFevoWeeklyConfig(id: EntityId, _payload = {}) {
  const result = await updateFevoWeeklyConfig(id, { status: "Closed", estado: "Fechado" });
  if (result.ok) void softAudit("fevo_config_closed", "fevo_weekly_config", String(id));
  return result;
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export async function listFevoTeams(): Promise<DataResult<FevoTeam[]>> {
  try {
    const result = await getDataProvider().fevoTeams.list();
    if (!result.ok) return result as DataResult<FevoTeam[]>;
    return ok((result.data || []).map((r) => normalizeFevoTeam(r as FevoTeam)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoTeams failed");
  }
}
export async function getFevoTeamById(id: EntityId) {
  try {
    const result = await getDataProvider().fevoTeams.getById(id);
    if (!result.ok) return result as DataResult<FevoTeam | null>;
    return ok(result.data ? normalizeFevoTeam(result.data as FevoTeam) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getFevoTeamById failed");
  }
}
export async function createFevoTeam(payload: Partial<FevoTeam>) {
  try {
    const row = normalizeFevoTeam(payload);
    const repo = getDataProvider().fevoTeams;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoTeam>;
    return ok(normalizeFevoTeam(result.data as FevoTeam));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoTeam failed");
  }
}
export async function updateFevoTeam(id: EntityId, payload: Partial<FevoTeam>) {
  try {
    const existing = await getFevoTeamById(id);
    if (!existing.ok || !existing.data) return fail("Equipa não encontrada", "NOT_FOUND");
    const row = normalizeFevoTeam({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().fevoTeams;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoTeam>;
    return ok(normalizeFevoTeam(result.data as FevoTeam));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoTeam failed");
  }
}
export async function deleteFevoTeam(id: EntityId) {
  try {
    const repo = getDataProvider().fevoTeams;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteFevoTeam failed");
  }
}
export async function getFevoTeamsByChurch(churchId: EntityId) {
  const list = await listFevoTeams();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => t.church_id === churchId));
}
export async function getFevoTeamsByLeader(leaderId: EntityId) {
  const list = await listFevoTeams();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => t.leader_id === leaderId));
}
export async function getActiveFevoTeams() {
  const list = await listFevoTeams();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => /activ|activo/i.test(String(t.status || ""))));
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

export async function listFevoActivities(): Promise<DataResult<FevoActivity[]>> {
  try {
    const result = await getDataProvider().fevoActivities.list();
    if (!result.ok) return result as DataResult<FevoActivity[]>;
    return ok((result.data || []).map((r) => normalizeFevoActivity(r as FevoActivity)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoActivities failed");
  }
}
export async function getFevoActivityById(id: EntityId) {
  try {
    const result = await getDataProvider().fevoActivities.getById(id);
    if (!result.ok) return result as DataResult<FevoActivity | null>;
    return ok(result.data ? normalizeFevoActivity(result.data as FevoActivity) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getFevoActivityById failed");
  }
}
export async function createFevoActivity(payload: Partial<FevoActivity>) {
  try {
    const row = normalizeFevoActivity(payload);
    const repo = getDataProvider().fevoActivities;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoActivity>;
    return ok(normalizeFevoActivity(result.data as FevoActivity));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoActivity failed");
  }
}
export async function updateFevoActivity(id: EntityId, payload: Partial<FevoActivity>) {
  try {
    const existing = await getFevoActivityById(id);
    if (!existing.ok || !existing.data) return fail("Actividade não encontrada", "NOT_FOUND");
    const row = normalizeFevoActivity({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoActivities;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoActivity>;
    return ok(normalizeFevoActivity(result.data as FevoActivity));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoActivity failed");
  }
}
export async function deleteFevoActivity(id: EntityId) {
  try {
    const repo = getDataProvider().fevoActivities;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteFevoActivity failed");
  }
}
export async function getActivitiesByWeek(configId: EntityId) {
  const list = await listFevoActivities();
  if (!list.ok) return list;
  return ok(
    list.data.filter((a) => a.config_id === configId || a.weekly_config_id === configId),
  );
}
export async function getActivitiesByTeam(teamId: EntityId) {
  const list = await listFevoActivities();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (a) => a.team_id === teamId || statusKey(a.team_name || "") === statusKey(String(teamId)),
    ),
  );
}
export async function getActivitiesByType(activityType: string) {
  const list = await listFevoActivities();
  if (!list.ok) return list;
  return ok(list.data.filter((a) => isActivityType(a.activity_type || "", activityType)));
}
export async function getActivitiesByStatus(status: string) {
  const list = await listFevoActivities();
  if (!list.ok) return list;
  const k = statusKey(status);
  return ok(list.data.filter((a) => statusKey(a.status || "").includes(k)));
}
export async function getTodayFevoActivities() {
  const list = await listFevoActivities();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(list.data.filter((a) => String(a.scheduled_date || "") === today));
}
export async function getPendingFevoActivities() {
  return getActivitiesByStatus("Pending");
}
export async function completeFevoActivity(id: EntityId, payload: { notes?: string } = {}) {
  return updateFevoActivity(id, {
    status: "Completed",
    completed_at: nowIso(),
    notes: payload.notes || "",
  });
}
export async function cancelFevoActivity(id: EntityId, payload: { notes?: string } = {}) {
  return updateFevoActivity(id, { status: "Cancelled", notes: payload.notes || "" });
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export async function listFevoReports(): Promise<DataResult<FevoReport[]>> {
  try {
    const result = await getDataProvider().fevoReports.list();
    if (!result.ok) return result as DataResult<FevoReport[]>;
    return ok((result.data || []).map((r) => normalizeFevoReport(r as FevoReport)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoReports failed");
  }
}
export async function getFevoReportById(id: EntityId) {
  try {
    const result = await getDataProvider().fevoReports.getById(id);
    if (!result.ok) return result as DataResult<FevoReport | null>;
    return ok(result.data ? normalizeFevoReport(result.data as FevoReport) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getFevoReportById failed");
  }
}
export async function createFevoReport(payload: Partial<FevoReport>) {
  try {
    const row = normalizeFevoReport(payload);
    const repo = getDataProvider().fevoReports;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoReport>;
    const n = normalizeFevoReport(result.data as FevoReport);
    void softAudit("fevo_report_created", "fevo_report", n.id, n.activity_type || "");
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoReport failed");
  }
}
export async function updateFevoReport(id: EntityId, payload: Partial<FevoReport>) {
  try {
    const existing = await getFevoReportById(id);
    if (!existing.ok || !existing.data) return fail("Relatório não encontrado", "NOT_FOUND");
    const row = normalizeFevoReport({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoReports;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoReport>;
    return ok(normalizeFevoReport(result.data as FevoReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoReport failed");
  }
}
export async function deleteFevoReport(id: EntityId) {
  try {
    const repo = getDataProvider().fevoReports;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteFevoReport failed");
  }
}
async function syncActivityFromReport(
  report: FevoReport,
  status: string,
) {
  if (!report.activity_id) return;
  try {
    await updateFevoActivity(report.activity_id, {
      status,
      report_id: report.id,
    });
  } catch {
    /* soft */
  }
}

/** Create typed detail record from a submitted report (idempotent-ish). */
async function ensureTypedRecordFromReport(report: FevoReport) {
  const type = report.activity_type || "";
  if (isActivityType(type, "Acompanhamento") || isActivityType(type, "Follow-Up")) {
    const existing = await getFevoFollowUpByReport(report.id);
    if (existing.ok && existing.data.length > 0) return;
    await createFevoFollowUpRecord({
      report_id: report.id,
      activity_id: report.activity_id,
      souls_contacted: report.souls_contacted,
      feedback_count: report.feedback_count,
      followup_result: report.followup_result,
      next_action: report.next_action,
      notes: report.notes,
    });
    return;
  }
  if (isActivityType(type, "Evangelização") || isActivityType(type, "Evangelism")) {
    const existing = await getEvangelismByReport(report.id);
    if (existing.ok && existing.data.length > 0) return;
    await createFevoEvangelismRecord({
      report_id: report.id,
      activity_id: report.activity_id,
      location: report.evangelism_location,
      evangelism_location: report.evangelism_location,
      souls_evangelized: report.souls_evangelized,
      new_converts: report.new_converts,
      materials_distributed: report.materials_distributed,
      notes: report.notes,
    });
    return;
  }
  if (isActivityType(type, "Visitação") || isActivityType(type, "Visitation")) {
    const existing = await getVisitationByReport(report.id);
    if (existing.ok && existing.data.length > 0) return;
    await createFevoVisitationRecord({
      report_id: report.id,
      activity_id: report.activity_id,
      location: report.visit_location,
      visit_location: report.visit_location,
      souls_visited: report.souls_visited,
      family_members_reached: report.family_members_reached,
      visit_result: report.visit_result,
      notes: report.notes,
    });
    return;
  }
  if (isActivityType(type, "Oração") || isActivityType(type, "Prayer")) {
    const existing = await getPrayerByReport(report.id);
    if (existing.ok && existing.data.length > 0) return;
    await createFevoPrayerRecord({
      report_id: report.id,
      activity_id: report.activity_id,
      prayer_focus: report.prayer_focus,
      average_members_present: report.average_members_present,
      days_of_prayer: report.days_of_prayer,
      testimonies: report.prayer_testimonies,
      prayer_testimonies: report.prayer_testimonies,
      notes: report.notes,
    });
  }
}

export async function submitFevoReport(
  id: EntityId,
  payload: { submitted_by?: string } = {},
) {
  const result = await updateFevoReport(id, {
    status: "Submitted",
    submitted_report: true,
    submitted_by: payload.submitted_by || "",
    submitted_by_name: payload.submitted_by || "",
    submitted_at: todayIso(),
  });
  if (result.ok && result.data) {
    await ensureTypedRecordFromReport(result.data);
    await syncActivityFromReport(result.data, "Report Submitted");
    void softAudit("fevo_report_submitted", "fevo_report", String(id));
    void softCreateFollowUp(result.data);
  }
  return result;
}
export async function validateFevoReport(
  id: EntityId,
  payload: { validated_by?: string } = {},
) {
  const result = await updateFevoReport(id, {
    status: "Validated",
    validated_by: payload.validated_by || "",
    validated_by_name: payload.validated_by || "",
    validated_at: nowIso(),
  });
  if (result.ok && result.data) {
    await syncActivityFromReport(result.data, "Validated");
    void softAudit("fevo_report_validated", "fevo_report", String(id));
  }
  return result;
}
export async function rejectFevoReport(
  id: EntityId,
  payload: { rejection_reason?: string; validated_by?: string } = {},
) {
  if (!payload.rejection_reason || !String(payload.rejection_reason).trim()) {
    return fail("rejection_reason é obrigatório", "VALIDATION");
  }
  const result = await updateFevoReport(id, {
    status: "Needs Correction",
    rejection_reason: payload.rejection_reason || "",
    rejected_by_name: payload.validated_by || "",
    rejected_at: nowIso(),
    validated_by: payload.validated_by || "",
    validated_at: nowIso(),
  });
  if (result.ok && result.data) {
    await syncActivityFromReport(result.data, "Assigned");
    void softAudit("fevo_report_rejected", "fevo_report", String(id));
  }
  return result;
}
export async function getReportsByWeek(configId: EntityId) {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.config_id === configId));
}
export async function getReportsByTeam(teamId: EntityId) {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (r) => r.team_id === teamId || statusKey(r.team || "") === statusKey(String(teamId)),
    ),
  );
}
export async function getReportsByActivityType(activityType: string) {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (r) =>
        r.report_kind !== "weekly_summary" &&
        isActivityType(r.activity_type || "", activityType),
    ),
  );
}
export async function getReportsByChurch(churchId: EntityId) {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.church_id === churchId));
}
export async function getReportsByStatus(status: string) {
  const list = await listFevoReports();
  if (!list.ok) return list;
  const k = statusKey(status);
  return ok(list.data.filter((r) => statusKey(r.status || "").includes(k)));
}
export async function getPendingFevoReports() {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const k = statusKey(r.status);
      return (
        k.includes("draft") ||
        k.includes("submit") ||
        k.includes("review") ||
        k.includes("rascun") ||
        k.includes("submet") ||
        k.includes("revis")
      );
    }),
  );
}
export async function getValidatedFevoReports() {
  const list = await listFevoReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => /valid|approv|aprov/i.test(String(r.status || ""))),
  );
}

// ---------------------------------------------------------------------------
// Typed activity detail records (separate collections)
// ---------------------------------------------------------------------------

export function normalizeFevoFollowUpRecord(
  input: Partial<FevoFollowUpRecord> & { id?: string },
): FevoFollowUpRecord {
  return {
    ...input,
    id: input.id || `fevo-fu-${Date.now()}`,
    report_id: input.report_id || null,
    activity_id: input.activity_id || null,
    souls_contacted: Number(input.souls_contacted ?? 0) || 0,
    feedback_count: Number(input.feedback_count ?? 0) || 0,
    successful_contacts: Number(input.successful_contacts ?? 0) || 0,
    no_answer_count: Number(input.no_answer_count ?? 0) || 0,
    followup_result: input.followup_result || "",
    next_action: input.next_action || "",
    referred_to_follow_up_department: !!input.referred_to_follow_up_department,
    created_follow_up_ids: Array.isArray(input.created_follow_up_ids)
      ? input.created_follow_up_ids
      : [],
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}
export function normalizeFevoEvangelismRecord(
  input: Partial<FevoEvangelismRecord> & { id?: string },
): FevoEvangelismRecord {
  const loc = input.location || input.evangelism_location || "";
  return {
    ...input,
    id: input.id || `fevo-ev-${Date.now()}`,
    report_id: input.report_id || null,
    activity_id: input.activity_id || null,
    location: loc,
    evangelism_location: input.evangelism_location || loc,
    souls_evangelized: Number(input.souls_evangelized ?? 0) || 0,
    new_converts: Number(input.new_converts ?? 0) || 0,
    first_timers_invited: Number(input.first_timers_invited ?? 0) || 0,
    first_timers_attended: Number(input.first_timers_attended ?? 0) || 0,
    invitations_given: Number(input.invitations_given ?? input.first_timers_invited ?? 0) || 0,
    materials_distributed: Number(input.materials_distributed ?? 0) || 0,
    testimonies: input.testimonies || "",
    created_first_timer_ids: Array.isArray(input.created_first_timer_ids)
      ? input.created_first_timer_ids
      : [],
    follow_up_needed: !!input.follow_up_needed,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}
export function normalizeFevoVisitationRecord(
  input: Partial<FevoVisitationRecord> & { id?: string },
): FevoVisitationRecord {
  const loc = input.location || input.visit_location || "";
  return {
    ...input,
    id: input.id || `fevo-vi-${Date.now()}`,
    report_id: input.report_id || null,
    activity_id: input.activity_id || null,
    location: loc,
    visit_location: input.visit_location || loc,
    souls_visited: Number(input.souls_visited ?? 0) || 0,
    families_visited: Number(input.families_visited ?? input.homes_visited ?? 0) || 0,
    family_members_reached: Number(input.family_members_reached ?? 0) || 0,
    homes_visited: Number(input.homes_visited ?? input.families_visited ?? 0) || 0,
    new_converts: Number(input.new_converts ?? 0) || 0,
    prayer_requests: input.prayer_requests || "",
    visit_result: input.visit_result || "",
    referred_to_counseling: !!input.referred_to_counseling,
    referred_to_follow_up: !!input.referred_to_follow_up,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}
export function normalizeFevoPrayerRecord(
  input: Partial<FevoPrayerRecord> & { id?: string },
): FevoPrayerRecord {
  const testimonies = input.testimonies || input.prayer_testimonies || "";
  const reqCount = Number(input.prayer_requests_count ?? input.special_requests_count ?? 0) || 0;
  return {
    ...input,
    id: input.id || `fevo-pr-${Date.now()}`,
    report_id: input.report_id || null,
    activity_id: input.activity_id || null,
    days_of_prayer: Number(input.days_of_prayer ?? 0) || 0,
    average_members_present: Number(input.average_members_present ?? 0) || 0,
    total_attendance: Number(input.total_attendance ?? 0) || 0,
    prayer_focus: input.prayer_focus || "",
    testimonies,
    prayer_testimonies: input.prayer_testimonies || testimonies,
    prayer_requests_count: reqCount,
    special_requests_count: Number(input.special_requests_count ?? reqCount) || 0,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export async function listFevoFollowUpRecords(): Promise<DataResult<FevoFollowUpRecord[]>> {
  try {
    const result = await getDataProvider().fevoFollowUpRecords.list();
    if (!result.ok) return result as DataResult<FevoFollowUpRecord[]>;
    return ok(
      (result.data || []).map((r) => normalizeFevoFollowUpRecord(r as FevoFollowUpRecord)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoFollowUpRecords failed");
  }
}
export async function createFevoFollowUpRecord(payload: Partial<FevoFollowUpRecord>) {
  try {
    const row = normalizeFevoFollowUpRecord(payload);
    const repo = getDataProvider().fevoFollowUpRecords;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoFollowUpRecord>;
    const n = normalizeFevoFollowUpRecord(result.data as FevoFollowUpRecord);
    if (n.referred_to_follow_up_department) {
      try {
        const root = globalThis as unknown as {
          CEFollowUps?: {
            createFollowUp?: (p: Record<string, unknown>) => Promise<DataResult<{ id: string }>>;
          };
        };
        if (root.CEFollowUps?.createFollowUp) {
          const fu = await root.CEFollowUps.createFollowUp({
            full_name: "F.E.V.O Contact",
            person_type: "Other",
            status: "Pending",
            metodo: "F.E.V.O",
            resultado: n.followup_result || "",
            notas: `Origem F.E.V.O follow-up record ${n.id}`,
          });
          if (fu?.ok && fu.data?.id) {
            n.created_follow_up_ids = [...(n.created_follow_up_ids || []), fu.data.id];
            if (repo.update) await repo.update(n.id, n);
          }
        }
      } catch {
        /* soft */
      }
    }
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoFollowUpRecord failed");
  }
}
export async function updateFevoFollowUpRecord(
  id: EntityId,
  payload: Partial<FevoFollowUpRecord>,
) {
  try {
    const existing = await getDataProvider().fevoFollowUpRecords.getById(id);
    if (!existing.ok || !existing.data) return fail("Registo não encontrado", "NOT_FOUND");
    const row = normalizeFevoFollowUpRecord({
      ...(existing.data as FevoFollowUpRecord),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoFollowUpRecords;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoFollowUpRecord>;
    return ok(normalizeFevoFollowUpRecord(result.data as FevoFollowUpRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoFollowUpRecord failed");
  }
}
export async function getFevoFollowUpByReport(reportId: EntityId) {
  const list = await listFevoFollowUpRecords();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.report_id === reportId));
}

export async function listFevoEvangelismRecords(): Promise<DataResult<FevoEvangelismRecord[]>> {
  try {
    const result = await getDataProvider().fevoEvangelismRecords.list();
    if (!result.ok) return result as DataResult<FevoEvangelismRecord[]>;
    return ok(
      (result.data || []).map((r) => normalizeFevoEvangelismRecord(r as FevoEvangelismRecord)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoEvangelismRecords failed");
  }
}
export async function createFevoEvangelismRecord(payload: Partial<FevoEvangelismRecord>) {
  try {
    const row = normalizeFevoEvangelismRecord(payload);
    const repo = getDataProvider().fevoEvangelismRecords;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoEvangelismRecord>;
    return ok(normalizeFevoEvangelismRecord(result.data as FevoEvangelismRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoEvangelismRecord failed");
  }
}
export async function updateFevoEvangelismRecord(
  id: EntityId,
  payload: Partial<FevoEvangelismRecord>,
) {
  try {
    const existing = await getDataProvider().fevoEvangelismRecords.getById(id);
    if (!existing.ok || !existing.data) return fail("Registo não encontrado", "NOT_FOUND");
    const row = normalizeFevoEvangelismRecord({
      ...(existing.data as FevoEvangelismRecord),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoEvangelismRecords;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoEvangelismRecord>;
    return ok(normalizeFevoEvangelismRecord(result.data as FevoEvangelismRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoEvangelismRecord failed");
  }
}
export async function getEvangelismByReport(reportId: EntityId) {
  const list = await listFevoEvangelismRecords();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.report_id === reportId));
}

export async function listFevoVisitationRecords(): Promise<DataResult<FevoVisitationRecord[]>> {
  try {
    const result = await getDataProvider().fevoVisitationRecords.list();
    if (!result.ok) return result as DataResult<FevoVisitationRecord[]>;
    return ok(
      (result.data || []).map((r) => normalizeFevoVisitationRecord(r as FevoVisitationRecord)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoVisitationRecords failed");
  }
}
export async function createFevoVisitationRecord(payload: Partial<FevoVisitationRecord>) {
  try {
    const row = normalizeFevoVisitationRecord(payload);
    const repo = getDataProvider().fevoVisitationRecords;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoVisitationRecord>;
    return ok(normalizeFevoVisitationRecord(result.data as FevoVisitationRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoVisitationRecord failed");
  }
}
export async function updateFevoVisitationRecord(
  id: EntityId,
  payload: Partial<FevoVisitationRecord>,
) {
  try {
    const existing = await getDataProvider().fevoVisitationRecords.getById(id);
    if (!existing.ok || !existing.data) return fail("Registo não encontrado", "NOT_FOUND");
    const row = normalizeFevoVisitationRecord({
      ...(existing.data as FevoVisitationRecord),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoVisitationRecords;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoVisitationRecord>;
    return ok(normalizeFevoVisitationRecord(result.data as FevoVisitationRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoVisitationRecord failed");
  }
}
export async function getVisitationByReport(reportId: EntityId) {
  const list = await listFevoVisitationRecords();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.report_id === reportId));
}

export async function listFevoPrayerRecords(): Promise<DataResult<FevoPrayerRecord[]>> {
  try {
    const result = await getDataProvider().fevoPrayerRecords.list();
    if (!result.ok) return result as DataResult<FevoPrayerRecord[]>;
    return ok((result.data || []).map((r) => normalizeFevoPrayerRecord(r as FevoPrayerRecord)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoPrayerRecords failed");
  }
}
export async function createFevoPrayerRecord(payload: Partial<FevoPrayerRecord>) {
  try {
    const row = normalizeFevoPrayerRecord(payload);
    const repo = getDataProvider().fevoPrayerRecords;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoPrayerRecord>;
    return ok(normalizeFevoPrayerRecord(result.data as FevoPrayerRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoPrayerRecord failed");
  }
}
export async function updateFevoPrayerRecord(id: EntityId, payload: Partial<FevoPrayerRecord>) {
  try {
    const existing = await getDataProvider().fevoPrayerRecords.getById(id);
    if (!existing.ok || !existing.data) return fail("Registo não encontrado", "NOT_FOUND");
    const row = normalizeFevoPrayerRecord({
      ...(existing.data as FevoPrayerRecord),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoPrayerRecords;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoPrayerRecord>;
    return ok(normalizeFevoPrayerRecord(result.data as FevoPrayerRecord));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoPrayerRecord failed");
  }
}
export async function getPrayerByReport(reportId: EntityId) {
  const list = await listFevoPrayerRecords();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.report_id === reportId));
}

// ---------------------------------------------------------------------------
// Missing reports
// ---------------------------------------------------------------------------

export async function listFevoMissingReports(): Promise<DataResult<FevoMissingReport[]>> {
  try {
    const result = await getDataProvider().fevoMissingReports.list();
    if (!result.ok) return result as DataResult<FevoMissingReport[]>;
    return ok(
      (result.data || []).map((r) => normalizeFevoMissingReport(r as FevoMissingReport)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listFevoMissingReports failed");
  }
}
export async function getFevoMissingReportById(id: EntityId) {
  try {
    const result = await getDataProvider().fevoMissingReports.getById(id);
    if (!result.ok) return result as DataResult<FevoMissingReport | null>;
    return ok(
      result.data ? normalizeFevoMissingReport(result.data as FevoMissingReport) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getFevoMissingReportById failed");
  }
}
export async function createFevoMissingReport(payload: Partial<FevoMissingReport>) {
  try {
    const row = normalizeFevoMissingReport(payload);
    const repo = getDataProvider().fevoMissingReports;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<FevoMissingReport>;
    return ok(normalizeFevoMissingReport(result.data as FevoMissingReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createFevoMissingReport failed");
  }
}
export async function updateFevoMissingReport(
  id: EntityId,
  payload: Partial<FevoMissingReport>,
) {
  try {
    const existing = await getFevoMissingReportById(id);
    if (!existing.ok || !existing.data) return fail("Registo não encontrado", "NOT_FOUND");
    const row = normalizeFevoMissingReport({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().fevoMissingReports;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<FevoMissingReport>;
    return ok(normalizeFevoMissingReport(result.data as FevoMissingReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateFevoMissingReport failed");
  }
}
export async function resolveFevoMissingReport(
  id: EntityId,
  payload: { resolved_by?: string; followup_action?: string; resolution_notes?: string } = {},
) {
  const result = await updateFevoMissingReport(id, {
    status: "Resolved",
    resolved_at: nowIso(),
    resolved_by: payload.resolved_by || "",
    resolved_by_name: payload.resolved_by || "",
    followup_action: payload.followup_action || "",
    resolution_notes: payload.resolution_notes || payload.followup_action || "",
    contacted: true,
  });
  if (result.ok) void softAudit("fevo_missing_report_resolved", "fevo_missing_report", String(id));
  return result;
}
export async function getMissingReportsByWeek(configId: EntityId) {
  const list = await listFevoMissingReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((m) => m.config_id === configId || m.weekly_config_id === configId),
  );
}
export async function getMissingReportsByTeam(teamId: EntityId) {
  const list = await listFevoMissingReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (m) => m.team_id === teamId || statusKey(m.team || "") === statusKey(String(teamId)),
    ),
  );
}
export async function getMissingReportsByChurch(churchId: EntityId) {
  const list = await listFevoMissingReports();
  if (!list.ok) return list;
  return ok(list.data.filter((m) => m.church_id === churchId));
}
export async function getUnresolvedMissingReports() {
  const list = await listFevoMissingReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((m) => !/resolv/i.test(String(m.status || ""))),
  );
}
export async function detectMissingReports(configId: EntityId) {
  const [activities, reports, existing] = await Promise.all([
    getActivitiesByWeek(configId),
    getReportsByWeek(configId),
    getMissingReportsByWeek(configId),
  ]);
  if (!activities.ok) return activities as DataResult<FevoMissingReport[]>;
  const reportedTeams = new Set(
    (reports.ok ? reports.data : [])
      .filter((r) => r.report_kind !== "weekly_summary")
      .map((r) => statusKey(r.team || r.team_id || "")),
  );
  const existingKeys = new Set(
    (existing.ok ? existing.data : []).map((m) =>
      statusKey(`${m.team}|${m.activity_type}|${m.group_name}`),
    ),
  );
  const created: FevoMissingReport[] = [];
  for (const act of activities.data) {
    const teamKey = statusKey(act.team_name || act.team_id || "");
    if (reportedTeams.has(teamKey)) continue;
    const key = statusKey(`${act.team_name}|${act.activity_type}|`);
    if (existingKeys.has(key)) continue;
    const row = await createFevoMissingReport({
      weekly_config_id: configId,
      config_id: configId,
      week_label: act.week_label || "",
      activity_id: act.id,
      team: act.team_name || "",
      team_name: act.team_name || "",
      team_code: act.team_code || "",
      team_id: act.team_id,
      activity_type: act.activity_type || "",
      church_id: act.church_id,
      church_name: act.church_name || "",
      week_start_date: act.week_start_date,
      week_end_date: act.week_end_date,
      expected_report_date: act.due_date || act.week_end_date,
      reason_not_submitted: "Detectado automaticamente — sem relatório submetido.",
      status: "Pending",
    });
    if (row.ok) {
      created.push(row.data);
      await updateFevoActivity(act.id, { status: "Missing Report" });
    }
  }
  void softAudit(
    "fevo_missing_report_detected",
    "fevo_weekly_config",
    String(configId),
    `${created.length}`,
  );
  return ok(created);
}

// ---------------------------------------------------------------------------
// Reports / overview
// ---------------------------------------------------------------------------

export async function getFevoOverviewStats(_filters: Record<string, unknown> = {}) {
  const [configs, reports, missing, activities, teams, fu, ev, vi, pr] = await Promise.all([
    listFevoWeeklyConfigs(),
    listFevoReports(),
    listFevoMissingReports(),
    listFevoActivities(),
    listFevoTeams(),
    listFevoFollowUpRecords(),
    listFevoEvangelismRecords(),
    listFevoVisitationRecords(),
    listFevoPrayerRecords(),
  ]);
  const r = reports.ok ? reports.data.filter((x) => x.report_kind !== "weekly_summary") : [];
  const m = missing.ok ? missing.data : [];
  const a = activities.ok ? activities.data : [];
  const fuRows = fu.ok ? fu.data : [];
  const evRows = ev.ok ? ev.data : [];
  const viRows = vi.ok ? vi.data : [];
  return ok({
    activeConfigs: (configs.ok ? configs.data : []).filter((c) =>
      /active|activo/i.test(String(c.status || c.estado)),
    ).length,
    totalReports: r.length,
    pendingReports: r.filter((x) =>
      /draft|submit|review|rascun|submet|revis/i.test(String(x.status)),
    ).length,
    approvedReports: r.filter((x) => /approv|aprov|valid/i.test(String(x.status))).length,
    missingUnresolved: m.filter((x) => !/resolv/i.test(String(x.status || ""))).length,
    activitiesPending: a.filter((x) => /pending|assigned|pend/i.test(String(x.status || ""))).length,
    activitiesCompleted: a.filter((x) => /complete|conclu|validated/i.test(String(x.status || ""))).length,
    activeTeams: (teams.ok ? teams.data : []).filter((t) =>
      /activ|activo/i.test(String(t.status || "")),
    ).length,
    soulsEvangelized:
      evRows.reduce((s, x) => s + Number(x.souls_evangelized || 0), 0) ||
      r.reduce((s, x) => s + Number(x.souls_evangelized || 0), 0),
    soulsVisited:
      viRows.reduce((s, x) => s + Number(x.souls_visited || 0), 0) ||
      r.reduce((s, x) => s + Number(x.souls_visited || 0), 0),
    soulsContacted:
      fuRows.reduce((s, x) => s + Number(x.souls_contacted || 0), 0) ||
      r.reduce((s, x) => s + Number(x.souls_contacted || 0), 0),
    newConverts:
      evRows.reduce((s, x) => s + Number(x.new_converts || 0), 0) ||
      r.reduce((s, x) => s + Number(x.new_converts || 0), 0),
    followUpRecords: fuRows.length,
    evangelismRecords: evRows.length,
    visitationRecords: viRows.length,
    prayerRecords: pr.ok ? pr.data.length : 0,
  });
}

export async function getFevoTeamReport(filters: { configId?: string } = {}) {
  const reports = filters.configId
    ? await getReportsByWeek(filters.configId)
    : await listFevoReports();
  if (!reports.ok) return reports;
  const byTeam: Record<string, { team: string; count: number; souls: number }> = {};
  for (const r of reports.data.filter((x) => x.report_kind !== "weekly_summary")) {
    const t = r.team || r.team_name || "Unknown";
    if (!byTeam[t]) byTeam[t] = { team: t, count: 0, souls: 0 };
    byTeam[t].count += 1;
    byTeam[t].souls +=
      Number(r.souls_evangelized || 0) +
      Number(r.souls_visited || 0) +
      Number(r.souls_contacted || 0);
  }
  return ok(Object.values(byTeam));
}
/** Alias used by product spec */
export async function getFevoTeamPerformanceReport(filters: { configId?: string } = {}) {
  return getFevoTeamReport(filters);
}

export async function getFevoActivityTypeReport(_filters = {}) {
  const reports = await listFevoReports();
  if (!reports.ok) return reports;
  const counts: Record<string, number> = {};
  for (const r of reports.data.filter((x) => x.report_kind !== "weekly_summary")) {
    const t = r.activity_type || "Other";
    counts[t] = (counts[t] || 0) + 1;
  }
  return ok(Object.entries(counts).map(([activity_type, count]) => ({ activity_type, count })));
}

export async function getFevoWeeklyReport(filters: { configId?: string } = {}) {
  if (filters.configId) {
    const [cfg, reports, missing, activities] = await Promise.all([
      getFevoWeeklyConfigById(filters.configId),
      getReportsByWeek(filters.configId),
      getMissingReportsByWeek(filters.configId),
      getActivitiesByWeek(filters.configId),
    ]);
    return ok({
      config: cfg.ok ? cfg.data : null,
      reports: reports.ok ? reports.data : [],
      missing: missing.ok ? missing.data : [],
      activities: activities.ok ? activities.data : [],
    });
  }
  const current = await getCurrentFevoWeeklyConfig();
  if (current.ok && current.data?.id) {
    return getFevoWeeklyReport({ configId: current.data.id });
  }
  return ok({ config: null, reports: [], missing: [], activities: [] });
}

export async function getFevoMissingReportsStats(_filters = {}) {
  const list = await listFevoMissingReports();
  if (!list.ok) return list as DataResult<Record<string, number>>;
  const rows = list.data;
  return ok({
    total: rows.length,
    pending: rows.filter((m) => /pend/i.test(String(m.status || ""))).length,
    contacted: rows.filter((m) => /contact/i.test(String(m.status || ""))).length,
    resolved: rows.filter((m) => /resolv/i.test(String(m.status || ""))).length,
    recurring: rows.filter((m) => /recurr|reincid/i.test(String(m.status || ""))).length,
  });
}

export async function getFevoEvangelismStats(_filters = {}) {
  const list = await listFevoEvangelismRecords();
  if (!list.ok) return list as DataResult<Record<string, number>>;
  const rows = list.data;
  return ok({
    records: rows.length,
    souls_evangelized: rows.reduce((s, x) => s + Number(x.souls_evangelized || 0), 0),
    new_converts: rows.reduce((s, x) => s + Number(x.new_converts || 0), 0),
    materials_distributed: rows.reduce((s, x) => s + Number(x.materials_distributed || 0), 0),
    invitations_given: rows.reduce((s, x) => s + Number(x.invitations_given || 0), 0),
  });
}

export async function getFevoPrayerStats(_filters = {}) {
  const list = await listFevoPrayerRecords();
  if (!list.ok) return list as DataResult<Record<string, number>>;
  const rows = list.data;
  return ok({
    records: rows.length,
    days_of_prayer: rows.reduce((s, x) => s + Number(x.days_of_prayer || 0), 0),
    average_members_present:
      rows.length > 0
        ? Number(
            (
              rows.reduce((s, x) => s + Number(x.average_members_present || 0), 0) / rows.length
            ).toFixed(1),
          )
        : 0,
    special_requests: rows.reduce((s, x) => s + Number(x.special_requests_count || 0), 0),
  });
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureFevoSeeded(): Promise<DataResult<boolean>> {
  try {
    const cfg = await listFevoWeeklyConfigs();
    if (cfg.ok && cfg.data.length === 0) {
      for (const s of FEVO_WEEKLY_CONFIGS_SEED) {
        const repo = getDataProvider().fevoWeeklyConfigs;
        if (repo.create) await repo.create(normalizeFevoWeeklyConfig(s));
      }
    }
    const teams = await listFevoTeams();
    if (teams.ok && teams.data.length === 0) {
      for (const s of FEVO_TEAMS_SEED) {
        const repo = getDataProvider().fevoTeams;
        if (repo.create) await repo.create(normalizeFevoTeam(s));
      }
    }
    const acts = await listFevoActivities();
    if (acts.ok && acts.data.length === 0) {
      for (const s of FEVO_ACTIVITIES_SEED) {
        const repo = getDataProvider().fevoActivities;
        if (repo.create) await repo.create(normalizeFevoActivity(s));
      }
    }
    const rpts = await listFevoReports();
    if (rpts.ok && rpts.data.length === 0) {
      for (const s of FEVO_REPORTS_SEED) {
        const repo = getDataProvider().fevoReports;
        if (repo.create) await repo.create(normalizeFevoReport(s));
      }
    }
    const miss = await listFevoMissingReports();
    if (miss.ok && miss.data.length === 0) {
      for (const s of FEVO_MISSING_REPORTS_SEED) {
        const repo = getDataProvider().fevoMissingReports;
        if (repo.create) await repo.create(normalizeFevoMissingReport(s));
      }
    }
    const fu = await listFevoFollowUpRecords();
    if (fu.ok && fu.data.length === 0) {
      for (const s of FEVO_FOLLOW_UP_RECORDS_SEED) {
        const repo = getDataProvider().fevoFollowUpRecords;
        if (repo.create) await repo.create(normalizeFevoFollowUpRecord(s));
      }
    }
    const ev = await listFevoEvangelismRecords();
    if (ev.ok && ev.data.length === 0) {
      for (const s of FEVO_EVANGELISM_RECORDS_SEED) {
        const repo = getDataProvider().fevoEvangelismRecords;
        if (repo.create) await repo.create(normalizeFevoEvangelismRecord(s));
      }
    }
    const vi = await listFevoVisitationRecords();
    if (vi.ok && vi.data.length === 0) {
      for (const s of FEVO_VISITATION_RECORDS_SEED) {
        const repo = getDataProvider().fevoVisitationRecords;
        if (repo.create) await repo.create(normalizeFevoVisitationRecord(s));
      }
    }
    const pr = await listFevoPrayerRecords();
    if (pr.ok && pr.data.length === 0) {
      for (const s of FEVO_PRAYER_RECORDS_SEED) {
        const repo = getDataProvider().fevoPrayerRecords;
        if (repo.create) await repo.create(normalizeFevoPrayerRecord(s));
      }
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureFevoSeeded failed");
  }
}

export function getFevoDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "fevo",
  };
}

export {
  FEVO_WEEKLY_CONFIGS_SEED,
  FEVO_TEAMS_SEED,
  FEVO_ACTIVITIES_SEED,
  FEVO_REPORTS_SEED,
  FEVO_MISSING_REPORTS_SEED,
  FEVO_FOLLOW_UP_RECORDS_SEED,
  FEVO_EVANGELISM_RECORDS_SEED,
  FEVO_VISITATION_RECORDS_SEED,
  FEVO_PRAYER_RECORDS_SEED,
};

export const fevoRepository = {
  listFevoWeeklyConfigs,
  getFevoWeeklyConfigById,
  createFevoWeeklyConfig,
  updateFevoWeeklyConfig,
  deleteFevoWeeklyConfig,
  getFevoWeeklyConfigByWeek,
  getCurrentFevoWeeklyConfig,
  getUpcomingFevoWeeklyConfigs,
  activateFevoWeeklyConfig,
  closeFevoWeeklyConfig,
  listFevoTeams,
  getFevoTeamById,
  createFevoTeam,
  updateFevoTeam,
  deleteFevoTeam,
  getFevoTeamsByChurch,
  getFevoTeamsByLeader,
  getActiveFevoTeams,
  listFevoActivities,
  getFevoActivityById,
  createFevoActivity,
  updateFevoActivity,
  deleteFevoActivity,
  getActivitiesByWeek,
  getActivitiesByTeam,
  getActivitiesByType,
  getActivitiesByStatus,
  getTodayFevoActivities,
  getPendingFevoActivities,
  completeFevoActivity,
  cancelFevoActivity,
  listFevoReports,
  getFevoReportById,
  createFevoReport,
  updateFevoReport,
  deleteFevoReport,
  submitFevoReport,
  validateFevoReport,
  rejectFevoReport,
  getReportsByWeek,
  getReportsByTeam,
  getReportsByActivityType,
  getReportsByChurch,
  getReportsByStatus,
  getPendingFevoReports,
  getValidatedFevoReports,
  listFevoFollowUpRecords,
  createFevoFollowUpRecord,
  updateFevoFollowUpRecord,
  getFevoFollowUpByReport,
  listFevoEvangelismRecords,
  createFevoEvangelismRecord,
  updateFevoEvangelismRecord,
  getEvangelismByReport,
  listFevoVisitationRecords,
  createFevoVisitationRecord,
  updateFevoVisitationRecord,
  getVisitationByReport,
  listFevoPrayerRecords,
  createFevoPrayerRecord,
  updateFevoPrayerRecord,
  getPrayerByReport,
  listFevoMissingReports,
  getFevoMissingReportById,
  createFevoMissingReport,
  updateFevoMissingReport,
  resolveFevoMissingReport,
  getMissingReportsByWeek,
  getMissingReportsByTeam,
  getMissingReportsByChurch,
  getUnresolvedMissingReports,
  detectMissingReports,
  getFevoOverviewStats,
  getFevoWeeklyReport,
  getFevoTeamReport,
  getFevoTeamPerformanceReport,
  getFevoActivityTypeReport,
  getFevoMissingReportsStats,
  getFevoEvangelismStats,
  getFevoPrayerStats,
  ensureFevoSeeded,
  getFevoDataSourceInfo,
  getInfo: getFevoDataSourceInfo,
};
