import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  MediaAward,
  MediaChannel,
  MediaPerformanceReview,
  MediaRole,
  MediaSchedule,
  MediaService,
  MediaTechnician,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { MEDIA_TEAM_SEED } from "../seeds/mediaTeamSeed";
import { MEDIA_ROLES_SEED } from "../seeds/mediaRolesSeed";
import { MEDIA_SERVICES_SEED } from "../seeds/mediaServicesSeed";
import { MEDIA_SCHEDULES_SEED } from "../seeds/mediaSchedulesSeed";
import { MEDIA_CHANNELS_SEED } from "../seeds/mediaChannelsSeed";
import { MEDIA_PERFORMANCE_SEED } from "../seeds/mediaPerformanceSeed";
import { MEDIA_AWARDS_SEED } from "../seeds/mediaAwardsSeed";

function fail<T>(error: string, code = "MEDIA_ERROR"): DataResult<T> {
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

function toLegacyTeamStatus(s: string | null | undefined): string {
  const e = statusKey(s);
  if (e.includes("train") || e.includes("trein")) return "Em Treinamento";
  if (e.includes("leave") || e.includes("licenca")) return "Em Licença";
  if (e.includes("suspend")) return "Suspenso";
  if (e.includes("inactiv") || e.includes("inactiv")) return "Inactivo";
  if (e.includes("active") || e.includes("activo")) return "Activo";
  return s || "Activo";
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeMediaTeamMember(
  input: Partial<MediaTechnician> & { id?: string },
): MediaTechnician {
  const id = input.id || `mt-${Date.now()}`;
  const name = input.full_name || input.fullName || "";
  return {
    ...input,
    id,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    full_name: name,
    fullName: name,
    title: input.title || "",
    phone: input.phone || "",
    whatsapp: input.whatsapp || input.phone || "",
    email: input.email || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    department_id: input.department_id || "dept-media",
    department_name: input.department_name || "Mídia",
    primary_role_id: input.primary_role_id || null,
    primary_role_name: input.primary_role_name || "",
    roles_can_perform: Array.isArray(input.roles_can_perform) ? input.roles_can_perform : [],
    skill_level: input.skill_level || "Intermediate",
    preferred_services: Array.isArray(input.preferred_services) ? input.preferred_services : [],
    availability_notes: input.availability_notes || "",
    supervisor_id: input.supervisor_id || null,
    supervisor_name: input.supervisor_name || "",
    start_date: input.start_date || todayIso(),
    status: input.status || "Active",
    profile_photo: input.profile_photo || "",
    notes: input.notes || "",
    equipment_assigned_ids: Array.isArray(input.equipment_assigned_ids)
      ? input.equipment_assigned_ids
      : [],
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

export function normalizeMediaRole(input: Partial<MediaRole> & { id?: string }): MediaRole {
  return {
    ...input,
    id: input.id || `mr-${Date.now()}`,
    name: input.name || "",
    key: input.key || statusKey(input.name || "").replace(/\s+/g, ""),
    description: input.description || "",
    category: input.category || "Other",
    required_skill_level: input.required_skill_level || "Intermediate",
    is_required_for_service: !!input.is_required_for_service,
    is_critical_role: !!input.is_critical_role,
    allow_multiple: input.allow_multiple ?? false,
    required_per_service: Number(input.required_per_service ?? 1) || 1,
    requires_equipment: !!input.requires_equipment,
    equipment_categories: Array.isArray(input.equipment_categories)
      ? input.equipment_categories
      : [],
    is_active: input.is_active !== false,
    status: input.status || (input.is_active === false ? "Inactive" : "Active"),
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeMediaService(
  input: Partial<MediaService> & { id?: string },
): MediaService {
  return {
    ...input,
    id: input.id || `ms-${Date.now()}`,
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    name: input.name || "",
    description: input.description || "",
    service_type: input.service_type || "Other",
    day_of_week: input.day_of_week || "",
    time: input.time || input.start_time || "",
    start_time: input.start_time || input.time || "",
    end_time: input.end_time || "",
    service_date: input.service_date || input.event_date || null,
    event_date: input.event_date || input.service_date || null,
    is_recurring: !!input.is_recurring,
    recurrence_rule: input.recurrence_rule || "",
    is_special_event: !!input.is_special_event,
    needs_streaming: !!input.needs_streaming,
    needs_full_team: !!input.needs_full_team,
    channels_used: Array.isArray(input.channels_used) ? input.channels_used : [],
    channels_required: Array.isArray(input.channels_required)
      ? input.channels_required
      : input.channels_used || [],
    venue_space_id: input.venue_space_id || null,
    venue_space_name: input.venue_space_name || input.location || "",
    location: input.location || input.venue_space_name || "",
    responsible_name: input.responsible_name || "",
    checklist_required: input.checklist_required ?? true,
    status: input.status || "Scheduled",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeMediaSchedule(
  input: Partial<MediaSchedule> & { id?: string },
): MediaSchedule {
  const date = input.service_date || input.date || input.serviceDate || todayIso();
  return {
    ...input,
    id: input.id || `sch-${Date.now()}`,
    service_id: input.service_id || null,
    service_name: input.service_name || "",
    service_date: date,
    date,
    start_time: input.start_time || "",
    end_time: input.end_time || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    supervisor_id: input.supervisor_id || null,
    supervisor_name: input.supervisor_name || "",
    status: input.status || "Draft",
    notes: input.notes || "",
    assignments: Array.isArray(input.assignments) ? input.assignments : [],
    role_id: input.role_id || null,
    role_name: input.role_name || input.role || "",
    team_member_id: input.team_member_id || input.technicianId || null,
    team_member_name: input.team_member_name || "",
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
  };
}

export function normalizeMediaChannel(
  input: Partial<MediaChannel> & { id?: string },
): MediaChannel {
  // Never store real stream keys
  const clean = { ...input } as Partial<MediaChannel> & { stream_key?: string };
  delete clean.stream_key;
  return {
    ...clean,
    id: input.id || `mc-${Date.now()}`,
    name: input.name || "",
    type: input.type || input.platform || "Other",
    platform: input.platform || input.type || "",
    platform_url: input.platform_url || input.channel_url || "",
    channel_url: input.channel_url || input.platform_url || "",
    embed_url: input.embed_url || "",
    channel_handle: input.channel_handle || "",
    is_active: input.is_active !== false && !/inactiv|inactiv|por configurar/i.test(String(input.status || "")),
    status: input.status || "Active",
    requires_stream_key: !!input.requires_stream_key,
    stream_key_status: input.stream_key_status || "Not Required",
    responsible_user_id: input.responsible_user_id || null,
    responsible_name: input.responsible_name || "",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeMediaPerformance(
  input: Partial<MediaPerformanceReview> & { id?: string },
): MediaPerformanceReview {
  const scores = [
    Number(input.punctuality_score ?? 0),
    Number(input.technical_quality_score ?? 0),
    Number(input.teamwork_score ?? 0),
    Number(input.responsibility_score ?? 0),
    Number(input.problem_solving_score ?? 0),
    Number(input.spiritual_attitude_score ?? 0),
  ];
  const filled = scores.filter((s) => s > 0);
  let overall = input.overall_score ?? input.score;
  if (overall == null || Number(overall) === 0) {
    overall = filled.length
      ? Number((filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1))
      : 0;
  }
  const techId = input.technician_id || input.team_member_id || null;
  const techName = input.technician_name || input.team_member_name || "";
  return {
    ...input,
    id: input.id || `mev-${Date.now()}`,
    technician_id: techId,
    technician_name: techName,
    team_member_id: input.team_member_id || techId,
    team_member_name: input.team_member_name || techName,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    schedule_id: input.schedule_id || null,
    service_id: input.service_id || null,
    service_name: input.service_name || "",
    service_date: input.service_date || null,
    period: input.period || "",
    role_performed: input.role_performed || input.role_name || "",
    role_id: input.role_id || null,
    role_name: input.role_name || input.role_performed || "",
    evaluated_by: input.evaluated_by || input.reviewed_by_name || "",
    evaluated_at: input.evaluated_at || null,
    reviewed_by_user_id: input.reviewed_by_user_id || null,
    reviewed_by_name: input.reviewed_by_name || input.evaluated_by || "",
    punctuality_score: Number(input.punctuality_score ?? 0),
    technical_quality_score: Number(input.technical_quality_score ?? 0),
    teamwork_score: Number(input.teamwork_score ?? 0),
    responsibility_score: Number(input.responsibility_score ?? 0),
    problem_solving_score: Number(input.problem_solving_score ?? 0),
    spiritual_attitude_score: Number(input.spiritual_attitude_score ?? 0),
    overall_score: Number(overall) || 0,
    score: Number(overall) || 0,
    strengths: input.strengths || "",
    areas_to_improve: input.areas_to_improve || input.improvements || "",
    improvements: input.improvements || input.areas_to_improve || "",
    incidents: input.incidents || "",
    recommendation: input.recommendation || "",
    notes: input.notes || "",
    status: input.status || (input.evaluated_at ? "Reviewed" : "Draft"),
    reviewed_at: input.reviewed_at || input.evaluated_at || null,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeMediaAward(input: Partial<MediaAward> & { id?: string }): MediaAward {
  const cat = input.award_category || input.category || "";
  const techId = input.technician_id || input.team_member_id || input.winner_id || null;
  const techName = input.technician_name || input.team_member_name || "";
  return {
    ...input,
    id: input.id || `maw-${Date.now()}`,
    year: Number(input.year ?? new Date().getFullYear()) || new Date().getFullYear(),
    category: cat,
    award_category: cat,
    award_name: input.award_name || cat,
    technician_id: techId,
    technician_name: techName,
    team_member_id: input.team_member_id || techId,
    team_member_name: input.team_member_name || techName,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    winner_id: input.winner_id || techId,
    reason: input.reason || "",
    score_basis: input.score_basis || "",
    awarded_by: input.awarded_by || input.approved_by_name || "",
    awarded_at: input.awarded_at || null,
    approved_by_user_id: input.approved_by_user_id || null,
    approved_by_name: input.approved_by_name || input.awarded_by || "",
    approved_at: input.approved_at || null,
    status: input.status || "Draft",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export async function listMediaTeam(): Promise<DataResult<MediaTechnician[]>> {
  try {
    const result = await getDataProvider().mediaTechnicians.list();
    if (!result.ok) return result as DataResult<MediaTechnician[]>;
    return ok(
      (result.data || []).map((r) => {
        const n = normalizeMediaTeamMember(r as MediaTechnician);
        return { ...n, status: toLegacyTeamStatus(n.status) };
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaTeam failed");
  }
}
export async function getMediaTeamMemberById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaTechnicians.getById(id);
    if (!result.ok) return result as DataResult<MediaTechnician | null>;
    if (!result.data) return ok(null);
    const n = normalizeMediaTeamMember(result.data as MediaTechnician);
    return ok({ ...n, status: toLegacyTeamStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaTeamMemberById failed");
  }
}
export async function createMediaTeamMember(payload: Partial<MediaTechnician>) {
  try {
    const row = normalizeMediaTeamMember(payload);
    const repo = getDataProvider().mediaTechnicians;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaTechnician>;
    const n = normalizeMediaTeamMember(result.data as MediaTechnician);
    return ok({ ...n, status: toLegacyTeamStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaTeamMember failed");
  }
}
export async function updateMediaTeamMember(id: EntityId, payload: Partial<MediaTechnician>) {
  try {
    const existing = await getMediaTeamMemberById(id);
    if (!existing.ok || !existing.data) return fail("Técnico não encontrado", "NOT_FOUND");
    const row = normalizeMediaTeamMember({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().mediaTechnicians;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaTechnician>;
    const n = normalizeMediaTeamMember(result.data as MediaTechnician);
    return ok({ ...n, status: toLegacyTeamStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaTeamMember failed");
  }
}
export async function deleteMediaTeamMember(id: EntityId) {
  try {
    const repo = getDataProvider().mediaTechnicians;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteMediaTeamMember failed");
  }
}
export async function searchMediaTeam(query: string) {
  const list = await listMediaTeam();
  if (!list.ok) return list;
  const q = statusKey(query);
  if (!q) return list;
  return ok(
    list.data.filter((t) =>
      statusKey([t.full_name, t.email, t.phone, t.primary_role_name].join(" ")).includes(q),
    ),
  );
}
export async function getMediaTeamByChurch(churchId: EntityId) {
  const list = await listMediaTeam();
  if (!list.ok) return list;
  return ok(list.data.filter((t) => t.church_id === churchId));
}
export async function getMediaTeamByRole(roleId: string) {
  const list = await listMediaTeam();
  if (!list.ok) return list;
  const k = statusKey(roleId);
  return ok(
    list.data.filter(
      (t) =>
        statusKey(t.primary_role_id || "") === k ||
        (t.roles_can_perform || []).some((r) => statusKey(r).includes(k)) ||
        statusKey(t.primary_role_name || "").includes(k),
    ),
  );
}
export async function getMediaTeamByStatus(status: string) {
  const list = await listMediaTeam();
  if (!list.ok) return list;
  const k = statusKey(status);
  return ok(list.data.filter((t) => statusKey(t.status || "").includes(k)));
}
export async function getActiveMediaTeam() {
  return getMediaTeamByStatus("Active");
}
export async function getInactiveMediaTeam() {
  return getMediaTeamByStatus("Inactive");
}
export async function getMediaTeamBySkillLevel(skillLevel: string) {
  const list = await listMediaTeam();
  if (!list.ok) return list;
  const k = statusKey(skillLevel);
  return ok(list.data.filter((t) => statusKey(t.skill_level || "").includes(k)));
}
export async function getMediaTeamByAvailability(_day: string) {
  return listMediaTeam();
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export async function listMediaRoles(): Promise<DataResult<MediaRole[]>> {
  try {
    const result = await getDataProvider().mediaRoles.list();
    if (!result.ok) return result as DataResult<MediaRole[]>;
    return ok((result.data || []).map((r) => normalizeMediaRole(r as MediaRole)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaRoles failed");
  }
}
export async function getMediaRoleById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaRoles.getById(id);
    if (!result.ok) return result as DataResult<MediaRole | null>;
    return ok(result.data ? normalizeMediaRole(result.data as MediaRole) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaRoleById failed");
  }
}
export async function createMediaRole(payload: Partial<MediaRole>) {
  try {
    const row = normalizeMediaRole(payload);
    const repo = getDataProvider().mediaRoles;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaRole>;
    return ok(normalizeMediaRole(result.data as MediaRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaRole failed");
  }
}
export async function updateMediaRole(id: EntityId, payload: Partial<MediaRole>) {
  try {
    const existing = await getMediaRoleById(id);
    if (!existing.ok || !existing.data) return fail("Função não encontrada", "NOT_FOUND");
    const row = normalizeMediaRole({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().mediaRoles;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaRole>;
    return ok(normalizeMediaRole(result.data as MediaRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaRole failed");
  }
}
export async function deleteMediaRole(id: EntityId) {
  try {
    const repo = getDataProvider().mediaRoles;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteMediaRole failed");
  }
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function listMediaServices(): Promise<DataResult<MediaService[]>> {
  try {
    const result = await getDataProvider().mediaServices.list();
    if (!result.ok) return result as DataResult<MediaService[]>;
    return ok((result.data || []).map((r) => normalizeMediaService(r as MediaService)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaServices failed");
  }
}
export async function getMediaServiceById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaServices.getById(id);
    if (!result.ok) return result as DataResult<MediaService | null>;
    return ok(result.data ? normalizeMediaService(result.data as MediaService) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaServiceById failed");
  }
}
export async function createMediaService(payload: Partial<MediaService>) {
  try {
    const row = normalizeMediaService(payload);
    const repo = getDataProvider().mediaServices;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaService>;
    return ok(normalizeMediaService(result.data as MediaService));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaService failed");
  }
}
export async function updateMediaService(id: EntityId, payload: Partial<MediaService>) {
  try {
    const existing = await getMediaServiceById(id);
    if (!existing.ok || !existing.data) return fail("Culto/programa não encontrado", "NOT_FOUND");
    const row = normalizeMediaService({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().mediaServices;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaService>;
    return ok(normalizeMediaService(result.data as MediaService));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaService failed");
  }
}
export async function deleteMediaService(id: EntityId) {
  try {
    const repo = getDataProvider().mediaServices;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteMediaService failed");
  }
}
export async function getMediaServicesByChurch(churchId: EntityId) {
  const list = await listMediaServices();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.church_id === churchId));
}
export async function getMediaServicesByType(type: string) {
  const list = await listMediaServices();
  if (!list.ok) return list;
  const k = statusKey(type);
  return ok(list.data.filter((s) => statusKey(s.service_type || "").includes(k)));
}
export async function getUpcomingMediaServices() {
  const list = await listMediaServices();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter((s) => {
      const d = String(s.service_date || s.event_date || "");
      return !d || d >= today;
    }),
  );
}
export async function getTodayMediaServices() {
  const list = await listMediaServices();
  if (!list.ok) return list;
  const today = todayIso();
  const dayName = new Date().toLocaleDateString("pt-PT", { weekday: "long" });
  return ok(
    list.data.filter((s) => {
      const d = String(s.service_date || s.event_date || "");
      if (d === today) return true;
      if (s.is_recurring && s.day_of_week) {
        return statusKey(s.day_of_week).includes(statusKey(dayName).slice(0, 3));
      }
      return false;
    }),
  );
}

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

export async function listMediaSchedules(): Promise<DataResult<MediaSchedule[]>> {
  try {
    const result = await getDataProvider().mediaSchedules.list();
    if (!result.ok) return result as DataResult<MediaSchedule[]>;
    return ok((result.data || []).map((r) => normalizeMediaSchedule(r as MediaSchedule)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaSchedules failed");
  }
}
export async function getMediaScheduleById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaSchedules.getById(id);
    if (!result.ok) return result as DataResult<MediaSchedule | null>;
    return ok(result.data ? normalizeMediaSchedule(result.data as MediaSchedule) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaScheduleById failed");
  }
}
export async function createMediaSchedule(payload: Partial<MediaSchedule>) {
  try {
    const row = normalizeMediaSchedule(payload);
    const repo = getDataProvider().mediaSchedules;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaSchedule>;
    return ok(normalizeMediaSchedule(result.data as MediaSchedule));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaSchedule failed");
  }
}
export async function updateMediaSchedule(id: EntityId, payload: Partial<MediaSchedule>) {
  try {
    const existing = await getMediaScheduleById(id);
    if (!existing.ok || !existing.data) return fail("Escala não encontrada", "NOT_FOUND");
    const row = normalizeMediaSchedule({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().mediaSchedules;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaSchedule>;
    return ok(normalizeMediaSchedule(result.data as MediaSchedule));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaSchedule failed");
  }
}
export async function deleteMediaSchedule(id: EntityId) {
  try {
    const repo = getDataProvider().mediaSchedules;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteMediaSchedule failed");
  }
}
export async function getSchedulesByService(serviceId: EntityId) {
  const list = await listMediaSchedules();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.service_id === serviceId));
}
export async function getSchedulesByTeamMember(teamMemberId: EntityId) {
  const list = await listMediaSchedules();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (s) =>
        s.team_member_id === teamMemberId ||
        (s.assignments || []).some(
          (a) => a.technician_id === teamMemberId || a.team_member_id === teamMemberId,
        ),
    ),
  );
}
export async function getSchedulesByDate(date: string) {
  const list = await listMediaSchedules();
  if (!list.ok) return list;
  const d = String(date).slice(0, 10);
  return ok(
    list.data.filter((s) => String(s.service_date || s.date || "").slice(0, 10) === d),
  );
}
export async function getSchedulesByDateRange(startDate: string, endDate: string) {
  const list = await listMediaSchedules();
  if (!list.ok) return list;
  return ok(
    list.data.filter((s) => {
      const d = String(s.service_date || s.date || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getUpcomingSchedules() {
  const list = await listMediaSchedules();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data
      .filter((s) => String(s.service_date || s.date || "") >= today)
      .sort((a, b) =>
        String(a.service_date || a.date || "").localeCompare(String(b.service_date || b.date || "")),
      ),
  );
}
export async function getTodaySchedules() {
  return getSchedulesByDate(todayIso());
}

function patchAssignment(
  schedule: MediaSchedule,
  assignmentId: string | undefined,
  teamMemberId: string | undefined,
  patch: Record<string, unknown>,
): MediaSchedule {
  const assignments = (schedule.assignments || []).map((a) => {
    if (assignmentId && a.id === assignmentId) return { ...a, ...patch };
    if (teamMemberId && (a.technician_id === teamMemberId || a.team_member_id === teamMemberId)) {
      return { ...a, ...patch };
    }
    return a;
  });
  return { ...schedule, assignments, updated_at: todayIso() };
}

export async function confirmScheduleAssignment(
  scheduleId: EntityId,
  payload: { assignment_id?: string; team_member_id?: string; actor?: { name?: string } } = {},
) {
  const existing = await getMediaScheduleById(scheduleId);
  if (!existing.ok || !existing.data) return fail("Escala não encontrada", "NOT_FOUND");
  const next = patchAssignment(existing.data, payload.assignment_id, payload.team_member_id, {
    status: "Confirmed",
    confirmation_status: "Confirmed",
  });
  return updateMediaSchedule(scheduleId, next);
}
export async function markCheckIn(
  scheduleId: EntityId,
  payload: { assignment_id?: string; team_member_id?: string; check_in_time?: string } = {},
) {
  const existing = await getMediaScheduleById(scheduleId);
  if (!existing.ok || !existing.data) return fail("Escala não encontrada", "NOT_FOUND");
  const time = payload.check_in_time || new Date().toISOString().slice(11, 16);
  const next = patchAssignment(existing.data, payload.assignment_id, payload.team_member_id, {
    check_in_time: time,
    attendance_status: "Present",
    status: "Confirmed",
  });
  return updateMediaSchedule(scheduleId, next);
}
export async function markCheckOut(
  scheduleId: EntityId,
  payload: { assignment_id?: string; team_member_id?: string; check_out_time?: string } = {},
) {
  const existing = await getMediaScheduleById(scheduleId);
  if (!existing.ok || !existing.data) return fail("Escala não encontrada", "NOT_FOUND");
  const time = payload.check_out_time || new Date().toISOString().slice(11, 16);
  const next = patchAssignment(existing.data, payload.assignment_id, payload.team_member_id, {
    check_out_time: time,
    status: "Completed",
  });
  return updateMediaSchedule(scheduleId, next);
}
export async function markAbsent(
  scheduleId: EntityId,
  payload: { assignment_id?: string; team_member_id?: string; notes?: string } = {},
) {
  const existing = await getMediaScheduleById(scheduleId);
  if (!existing.ok || !existing.data) return fail("Escala não encontrada", "NOT_FOUND");
  const next = patchAssignment(existing.data, payload.assignment_id, payload.team_member_id, {
    attendance_status: "Absent",
    status: "No Show",
    notes: payload.notes || "",
  });
  return updateMediaSchedule(scheduleId, next);
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export async function listMediaChannels(): Promise<DataResult<MediaChannel[]>> {
  try {
    const result = await getDataProvider().mediaChannels.list();
    if (!result.ok) return result as DataResult<MediaChannel[]>;
    return ok((result.data || []).map((r) => normalizeMediaChannel(r as MediaChannel)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaChannels failed");
  }
}
export async function getMediaChannelById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaChannels.getById(id);
    if (!result.ok) return result as DataResult<MediaChannel | null>;
    return ok(result.data ? normalizeMediaChannel(result.data as MediaChannel) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaChannelById failed");
  }
}
export async function createMediaChannel(payload: Partial<MediaChannel>) {
  try {
    const row = normalizeMediaChannel(payload);
    const repo = getDataProvider().mediaChannels;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaChannel>;
    return ok(normalizeMediaChannel(result.data as MediaChannel));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaChannel failed");
  }
}
export async function updateMediaChannel(id: EntityId, payload: Partial<MediaChannel>) {
  try {
    const existing = await getMediaChannelById(id);
    if (!existing.ok || !existing.data) return fail("Canal não encontrado", "NOT_FOUND");
    const row = normalizeMediaChannel({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().mediaChannels;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaChannel>;
    return ok(normalizeMediaChannel(result.data as MediaChannel));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaChannel failed");
  }
}
export async function deleteMediaChannel(id: EntityId) {
  try {
    const repo = getDataProvider().mediaChannels;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteMediaChannel failed");
  }
}
export async function getChannelsByType(type: string) {
  const list = await listMediaChannels();
  if (!list.ok) return list;
  const k = statusKey(type);
  return ok(
    list.data.filter(
      (c) => statusKey(c.type || "").includes(k) || statusKey(c.platform || "").includes(k),
    ),
  );
}
export async function getActiveChannels() {
  const list = await listMediaChannels();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (c) => c.is_active || /activo|active/i.test(String(c.status || "")),
    ),
  );
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export async function listMediaPerformanceReviews(): Promise<DataResult<MediaPerformanceReview[]>> {
  try {
    const result = await getDataProvider().mediaPerformance.list();
    if (!result.ok) return result as DataResult<MediaPerformanceReview[]>;
    return ok(
      (result.data || []).map((r) => normalizeMediaPerformance(r as MediaPerformanceReview)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaPerformanceReviews failed");
  }
}
export async function getMediaPerformanceReviewById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaPerformance.getById(id);
    if (!result.ok) return result as DataResult<MediaPerformanceReview | null>;
    return ok(
      result.data ? normalizeMediaPerformance(result.data as MediaPerformanceReview) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaPerformanceReviewById failed");
  }
}
export async function createMediaPerformanceReview(payload: Partial<MediaPerformanceReview>) {
  try {
    const row = normalizeMediaPerformance(payload);
    const repo = getDataProvider().mediaPerformance;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaPerformanceReview>;
    return ok(normalizeMediaPerformance(result.data as MediaPerformanceReview));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaPerformanceReview failed");
  }
}
export async function updateMediaPerformanceReview(
  id: EntityId,
  payload: Partial<MediaPerformanceReview>,
) {
  try {
    const existing = await getMediaPerformanceReviewById(id);
    if (!existing.ok || !existing.data) return fail("Avaliação não encontrada", "NOT_FOUND");
    const row = normalizeMediaPerformance({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().mediaPerformance;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaPerformanceReview>;
    return ok(normalizeMediaPerformance(result.data as MediaPerformanceReview));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaPerformanceReview failed");
  }
}
export async function getPerformanceByTeamMember(teamMemberId: EntityId) {
  const list = await listMediaPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (p) => p.technician_id === teamMemberId || p.team_member_id === teamMemberId,
    ),
  );
}
export async function getPerformanceByService(serviceId: EntityId) {
  const list = await listMediaPerformanceReviews();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.service_id === serviceId));
}
export async function getMediaPerformanceByPeriod(startDate: string, endDate: string) {
  const list = await listMediaPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => {
      const d = String(p.service_date || p.evaluated_at || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
/** @deprecated use getMediaPerformanceByPeriod — avoids clash with staff HR */
export const getPerformanceByPeriod = getMediaPerformanceByPeriod;
export async function getTopMediaPerformers(_period?: string) {
  const list = await listMediaPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    [...list.data]
      .filter((p) => Number(p.overall_score || 0) > 0)
      .sort((a, b) => Number(b.overall_score || 0) - Number(a.overall_score || 0))
      .slice(0, 10),
  );
}
export async function getPendingMediaPerformanceReviews() {
  const list = await listMediaPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => {
      const k = statusKey(p.status);
      return (
        k.includes("draft") ||
        k.includes("pending") ||
        k.includes("pendente") ||
        !p.evaluated_at ||
        Number(p.overall_score || 0) === 0
      );
    }),
  );
}

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export async function listMediaAwards(): Promise<DataResult<MediaAward[]>> {
  try {
    const result = await getDataProvider().mediaAwards.list();
    if (!result.ok) return result as DataResult<MediaAward[]>;
    return ok((result.data || []).map((r) => normalizeMediaAward(r as MediaAward)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listMediaAwards failed");
  }
}
export async function getMediaAwardById(id: EntityId) {
  try {
    const result = await getDataProvider().mediaAwards.getById(id);
    if (!result.ok) return result as DataResult<MediaAward | null>;
    return ok(result.data ? normalizeMediaAward(result.data as MediaAward) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getMediaAwardById failed");
  }
}
export async function createMediaAward(payload: Partial<MediaAward>) {
  try {
    const row = normalizeMediaAward(payload);
    const repo = getDataProvider().mediaAwards;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<MediaAward>;
    return ok(normalizeMediaAward(result.data as MediaAward));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createMediaAward failed");
  }
}
export async function updateMediaAward(id: EntityId, payload: Partial<MediaAward>) {
  try {
    const existing = await getMediaAwardById(id);
    if (!existing.ok || !existing.data) return fail("Prémio não encontrado", "NOT_FOUND");
    const row = normalizeMediaAward({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().mediaAwards;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<MediaAward>;
    return ok(normalizeMediaAward(result.data as MediaAward));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateMediaAward failed");
  }
}
export async function getAwardsByYear(year: number) {
  const list = await listMediaAwards();
  if (!list.ok) return list;
  return ok(list.data.filter((a) => Number(a.year) === Number(year)));
}
export async function getAwardsByTeamMember(teamMemberId: EntityId) {
  const list = await listMediaAwards();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (a) =>
        a.technician_id === teamMemberId ||
        a.team_member_id === teamMemberId ||
        a.winner_id === teamMemberId,
    ),
  );
}
export async function calculateAwardCandidates(year: number) {
  const top = await getTopMediaPerformers(String(year));
  if (!top.ok) return top as DataResult<MediaAward[]>;
  const candidates: MediaAward[] = top.data.slice(0, 5).map((p, i) =>
    normalizeMediaAward({
      id: `maw-cand-${year}-${i}`,
      year,
      award_category: i === 0 ? "Técnico do Ano" : "Prémio de Excelência",
      category: i === 0 ? "Técnico do Ano" : "Prémio de Excelência",
      technician_id: p.technician_id,
      technician_name: p.technician_name,
      reason: `Score ${p.overall_score}`,
      score_basis: String(p.overall_score),
      status: "Nominated",
    }),
  );
  return ok(candidates);
}

// ---------------------------------------------------------------------------
// Reports / overview
// ---------------------------------------------------------------------------

export async function getMediaOverviewStats(_filters: Record<string, unknown> = {}) {
  const [team, schedules, channels, pending, awards] = await Promise.all([
    listMediaTeam(),
    listMediaSchedules(),
    listMediaChannels(),
    getPendingMediaPerformanceReviews(),
    listMediaAwards(),
  ]);
  const tech = team.ok ? team.data : [];
  const sch = schedules.ok ? schedules.data : [];
  const ch = channels.ok ? channels.data : [];
  const today = todayIso();
  const todaySch = sch.filter((s) => String(s.service_date || s.date || "") === today);
  return ok({
    totalTeam: tech.length,
    activeTeam: tech.filter((t) => /activo|active/i.test(String(t.status || ""))).length,
    todaySchedules: todaySch.length,
    pendingSchedules: sch.filter((s) => /draft|pending|incompleta/i.test(String(s.status || ""))).length,
    activeChannels: ch.filter((c) => c.is_active || /activo|active/i.test(String(c.status || ""))).length,
    pendingEvaluations: pending.ok ? pending.data.length : 0,
    awards: awards.ok ? awards.data.length : 0,
  });
}

export async function getMediaAttendanceReport(filters: { startDate?: string; endDate?: string } = {}) {
  let list = await listMediaSchedules();
  if (!list.ok) return list;
  let rows = list.data;
  if (filters.startDate && filters.endDate) {
    const r = await getSchedulesByDateRange(filters.startDate, filters.endDate);
    if (r.ok) rows = r.data;
  }
  return ok(rows);
}
export async function getMediaPerformanceReport(filters: { startDate?: string; endDate?: string } = {}) {
  if (filters.startDate && filters.endDate) {
    return getMediaPerformanceByPeriod(filters.startDate, filters.endDate);
  }
  return listMediaPerformanceReviews();
}
export async function getMediaScheduleReport(filters: { startDate?: string; endDate?: string } = {}) {
  return getMediaAttendanceReport(filters);
}
export async function getMediaEquipmentUsageReport(_filters = {}) {
  // Soft-link to venue inventory Media category when available
  try {
    const root = globalThis as unknown as {
      CEVenueInventory?: { getInventoryItemsByCategory?: (c: string) => Promise<DataResult<unknown[]>> };
      CEDataLayer?: { venueInventory?: { getInventoryItemsByCategory?: (c: string) => Promise<DataResult<unknown[]>> } };
    };
    const vi = root.CEVenueInventory || root.CEDataLayer?.venueInventory;
    if (vi?.getInventoryItemsByCategory) {
      const media = await vi.getInventoryItemsByCategory("Media");
      if (media.ok) return ok(media.data);
    }
  } catch {
    /* soft */
  }
  return ok([]);
}
export async function getMediaAwardsReport(filters: { year?: number } = {}) {
  if (filters.year) return getAwardsByYear(filters.year);
  return listMediaAwards();
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureMediaSeeded(): Promise<DataResult<boolean>> {
  try {
    const team = await listMediaTeam();
    if (team.ok && team.data.length === 0) {
      for (const s of MEDIA_TEAM_SEED) await createMediaTeamMember(s);
    }
    const roles = await listMediaRoles();
    if (roles.ok && roles.data.length === 0) {
      for (const s of MEDIA_ROLES_SEED) await createMediaRole(s);
    }
    const services = await listMediaServices();
    if (services.ok && services.data.length === 0) {
      for (const s of MEDIA_SERVICES_SEED) await createMediaService(s);
    }
    const schedules = await listMediaSchedules();
    if (schedules.ok && schedules.data.length === 0) {
      for (const s of MEDIA_SCHEDULES_SEED) await createMediaSchedule(s);
    }
    const channels = await listMediaChannels();
    if (channels.ok && channels.data.length === 0) {
      for (const s of MEDIA_CHANNELS_SEED) await createMediaChannel(s);
    }
    const perf = await listMediaPerformanceReviews();
    if (perf.ok && perf.data.length === 0) {
      for (const s of MEDIA_PERFORMANCE_SEED) await createMediaPerformanceReview(s);
    }
    const awards = await listMediaAwards();
    if (awards.ok && awards.data.length === 0) {
      for (const s of MEDIA_AWARDS_SEED) await createMediaAward(s);
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureMediaSeeded failed");
  }
}

export function getMediaDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "media",
  };
}

export {
  MEDIA_TEAM_SEED,
  MEDIA_ROLES_SEED,
  MEDIA_SERVICES_SEED,
  MEDIA_SCHEDULES_SEED,
  MEDIA_CHANNELS_SEED,
  MEDIA_PERFORMANCE_SEED,
  MEDIA_AWARDS_SEED,
};

/** Aggregator object for CEDataLayer.media / CEMedia. */
export const mediaRepository = {
  listMediaTeam,
  getMediaTeamMemberById,
  createMediaTeamMember,
  updateMediaTeamMember,
  deleteMediaTeamMember,
  searchMediaTeam,
  getMediaTeamByChurch,
  getMediaTeamByRole,
  getMediaTeamByStatus,
  getMediaTeamByAvailability,
  getMediaTeamBySkillLevel,
  getActiveMediaTeam,
  getInactiveMediaTeam,
  listMediaRoles,
  getMediaRoleById,
  createMediaRole,
  updateMediaRole,
  deleteMediaRole,
  listMediaServices,
  getMediaServiceById,
  createMediaService,
  updateMediaService,
  deleteMediaService,
  getMediaServicesByChurch,
  getMediaServicesByType,
  getUpcomingMediaServices,
  getTodayMediaServices,
  listMediaSchedules,
  getMediaScheduleById,
  createMediaSchedule,
  updateMediaSchedule,
  deleteMediaSchedule,
  getSchedulesByService,
  getSchedulesByTeamMember,
  getSchedulesByDate,
  getSchedulesByDateRange,
  getUpcomingSchedules,
  getTodaySchedules,
  confirmScheduleAssignment,
  markCheckIn,
  markCheckOut,
  markAbsent,
  listMediaChannels,
  getMediaChannelById,
  createMediaChannel,
  updateMediaChannel,
  deleteMediaChannel,
  getChannelsByType,
  getActiveChannels,
  listMediaPerformanceReviews,
  getMediaPerformanceReviewById,
  createMediaPerformanceReview,
  updateMediaPerformanceReview,
  getPerformanceByTeamMember,
  getPerformanceByService,
  getMediaPerformanceByPeriod,
  getPerformanceByPeriod,
  getTopMediaPerformers,
  getPendingMediaPerformanceReviews,
  listMediaAwards,
  getMediaAwardById,
  createMediaAward,
  updateMediaAward,
  getAwardsByYear,
  getAwardsByTeamMember,
  calculateAwardCandidates,
  getMediaOverviewStats,
  getMediaAttendanceReport,
  getMediaPerformanceReport,
  getMediaScheduleReport,
  getMediaEquipmentUsageReport,
  getMediaAwardsReport,
  ensureMediaSeeded,
  getMediaDataSourceInfo,
  getInfo: getMediaDataSourceInfo,
};
