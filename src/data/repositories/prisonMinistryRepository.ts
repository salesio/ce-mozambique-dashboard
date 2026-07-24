import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  PrisonFollowUp,
  PrisonFoundationStudent,
  PrisonLocation,
  PrisonMaterialsRequest,
  PrisonParticipant,
  PrisonReport,
  PrisonRepresentative,
  PrisonService,
  PrisonWeeklyAgenda,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { PRISON_LOCATIONS_SEED } from "../seeds/prisonLocationsSeed";
import { PRISON_REPRESENTATIVES_SEED } from "../seeds/prisonRepresentativesSeed";
import { PRISON_SERVICES_SEED } from "../seeds/prisonServicesSeed";
import { PRISON_PARTICIPANTS_SEED } from "../seeds/prisonParticipantsSeed";
import { PRISON_FOUNDATION_STUDENTS_SEED } from "../seeds/prisonFoundationStudentsSeed";
import { PRISON_WEEKLY_AGENDAS_SEED } from "../seeds/prisonWeeklyAgendasSeed";
import { PRISON_FOLLOW_UPS_SEED } from "../seeds/prisonFollowUpsSeed";
import { PRISON_REPORTS_SEED } from "../seeds/prisonReportsSeed";
import { PRISON_MATERIALS_REQUESTS_SEED } from "../seeds/prisonMaterialsRequestsSeed";

function fail<T>(error: string, code = "PRISON_ERROR"): DataResult<T> {
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
        module: "prisonMinistry",
        details,
        severity: /validate|reject|complete|participant|export|activate/i.test(action)
          ? "warning"
          : "info",
      });
    }
  } catch {
    /* soft */
  }
}

// ---------------------------------------------------------------------------
// Normalize (dual-map EN + PT UI)
// ---------------------------------------------------------------------------

export function normalizePrisonLocation(
  input: Partial<PrisonLocation> & { id?: string },
): PrisonLocation {
  const name = input.name || input.nome_da_prisao || "";
  const status = input.status || input.estado || "Active";
  return {
    ...input,
    id: input.id || `prison-${Date.now()}`,
    name,
    nome_da_prisao: input.nome_da_prisao || name,
    type: input.type || "Prison",
    province: input.province || input.provincia || "",
    provincia: input.provincia || input.province || "",
    city: input.city || input.cidade || "",
    cidade: input.cidade || input.city || "",
    church_id: input.church_id || null,
    igreja_responsavel: input.igreja_responsavel || input.church_id || "",
    representative_name: input.representative_name || input.representante_da_prisao || "",
    representante_da_prisao: input.representante_da_prisao || input.representative_name || "",
    contacto_do_representante:
      input.contacto_do_representante || input.contact_phone || "",
    contact_phone: input.contact_phone || input.contacto_do_representante || "",
    status,
    estado: input.estado || status,
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonRepresentative(
  input: Partial<PrisonRepresentative> & { id?: string },
): PrisonRepresentative {
  return {
    ...input,
    id: input.id || `prep-${Date.now()}`,
    prison_id: input.prison_id || null,
    prison_name: input.prison_name || "",
    full_name: input.full_name || "",
    phone: input.phone || "",
    whatsapp: input.whatsapp || input.phone || "",
    role: input.role || "Coordinator",
    status: input.status || "Active",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonService(
  input: Partial<PrisonService> & { id?: string },
): PrisonService {
  const date = input.service_date || input.data || null;
  const prisonId = input.prison_id || input.prisao || null;
  const att = Number(input.attendance_total ?? input.numero_de_internos_presentes ?? 0) || 0;
  const nc = Number(input.new_converts_count ?? input.novos_convertidos ?? 0) || 0;
  const fi =
    Number(input.foundation_interest_count ?? input.interessados_em_escola_de_fundacao ?? 0) || 0;
  const status = input.status || input.estado || "Scheduled";
  return {
    ...input,
    id: input.id || `ps-${Date.now()}`,
    service_number: input.service_number || "",
    prison_id: prisonId,
    prisao: input.prisao || prisonId || "",
    prison_name: input.prison_name || "",
    church_id: input.church_id || null,
    igreja_responsavel: input.igreja_responsavel || input.church_id || "",
    service_date: date,
    data: date || input.data || null,
    dia_da_semana: input.dia_da_semana || "",
    service_type: input.service_type || "Thursday Service",
    responsible_name: input.responsible_name || input.lider_responsavel || "",
    lider_responsavel: input.lider_responsavel || input.responsible_name || "",
    membros_que_foram: input.membros_que_foram || "",
    attendance_total: att,
    numero_de_internos_presentes: att,
    new_converts_count: nc,
    novos_convertidos: nc,
    foundation_interest_count: fi,
    interessados_em_escola_de_fundacao: fi,
    aula_de_fundacao_dada: !!input.aula_de_fundacao_dada,
    tema_ou_mensagem: input.tema_ou_mensagem || "",
    status,
    estado: input.estado || status,
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonParticipant(
  input: Partial<PrisonParticipant> & { id?: string },
): PrisonParticipant {
  return {
    ...input,
    id: input.id || `pp-${Date.now()}`,
    participant_code: input.participant_code || "",
    prison_id: input.prison_id || null,
    full_name: input.full_name || input.preferred_name || "",
    preferred_name: input.preferred_name || input.full_name || "",
    age_range: input.age_range || "Unknown",
    contact_allowed: !!input.contact_allowed,
    born_again: !!input.born_again,
    foundation_interest: !!input.foundation_interest,
    foundation_status: input.foundation_status || "Not Interested",
    follow_up_status: input.follow_up_status || "Pending",
    confidentiality_level: input.confidentiality_level || "Private",
    status: input.status || "Active",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonFoundationStudent(
  input: Partial<PrisonFoundationStudent> & { id?: string },
): PrisonFoundationStudent {
  const name = input.participant_name || input.nome_do_participante || "";
  const prisonId = input.prison_id || input.prisao || null;
  const lessons = [
    input.aula_1_presenca,
    input.aula_2_presenca,
    input.aula_3_presenca,
    input.aula_4_presenca,
    input.aula_5_presenca,
    input.aula_6_presenca,
    input.aula_7_presenca,
  ].filter(Boolean).length;
  const status = input.status || input.estado || "Enrolled";
  return {
    ...input,
    id: input.id || `pfs-${Date.now()}`,
    participant_name: name,
    nome_do_participante: input.nome_do_participante || name,
    prison_id: prisonId,
    prisao: input.prisao || prisonId || "",
    delivery_mode: input.delivery_mode || "Prison Ministry",
    lessons_completed: Number(input.lessons_completed ?? lessons) || 0,
    current_lesson: Number(input.current_lesson ?? lessons) || 0,
    nota_exame: Number(input.nota_exame ?? input.test_scores ?? 0) || 0,
    test_scores: Number(input.test_scores ?? input.nota_exame ?? 0) || 0,
    pratica_evangelismo: !!(input.pratica_evangelismo ?? input.soul_winning_completed),
    soul_winning_completed: !!(input.soul_winning_completed ?? input.pratica_evangelismo),
    aprovado: !!input.aprovado,
    graduado: !!input.graduado,
    certificado_emitido: !!input.certificado_emitido,
    status,
    estado: input.estado || status,
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonWeeklyAgenda(
  input: Partial<PrisonWeeklyAgenda> & { id?: string },
): PrisonWeeklyAgenda {
  const start = input.week_start_date || input.semana_inicio || null;
  const end = input.week_end_date || input.semana_fim || null;
  const status = input.status || input.estado || "Draft";
  return {
    ...input,
    id: input.id || `pwa-${Date.now()}`,
    week_start_date: start,
    week_end_date: end,
    semana_inicio: input.semana_inicio || start,
    semana_fim: input.semana_fim || end,
    week_label: input.week_label || `${start || ""} / ${end || ""}`,
    responsible_name: input.responsible_name || input.responsavel || "",
    responsavel: input.responsavel || input.responsible_name || "",
    monday_reports_agenda: !!(
      input.monday_reports_agenda ?? input.segunda_preparar_relatorios_e_agenda
    ),
    segunda_preparar_relatorios_e_agenda: !!(
      input.segunda_preparar_relatorios_e_agenda ?? input.monday_reports_agenda
    ),
    tuesday_prayer_preparation: !!(
      input.tuesday_prayer_preparation ?? input.terca_reuniao_de_oracao
    ),
    terca_reuniao_de_oracao: !!(input.terca_reuniao_de_oracao ?? input.tuesday_prayer_preparation),
    wednesday_representative_followup: !!(
      input.wednesday_representative_followup ?? input.quarta_followup_com_representante
    ),
    quarta_followup_com_representante: !!(
      input.quarta_followup_com_representante ?? input.wednesday_representative_followup
    ),
    thursday_service_plan: !!(input.thursday_service_plan ?? input.quinta_servico_prisional),
    quinta_servico_prisional: !!(input.quinta_servico_prisional ?? input.thursday_service_plan),
    friday_service_plan: !!(input.friday_service_plan ?? input.sexta_servico_prisional),
    sexta_servico_prisional: !!(input.sexta_servico_prisional ?? input.friday_service_plan),
    weekend_followup_plan: !!(
      input.weekend_followup_plan ?? input.sabado_domingo_acompanhamento
    ),
    sabado_domingo_acompanhamento: !!(
      input.sabado_domingo_acompanhamento ?? input.weekend_followup_plan
    ),
    status,
    estado: input.estado || status,
    notes: input.notes || input.observacoes || "",
    observacoes: input.observacoes || input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonFollowUp(
  input: Partial<PrisonFollowUp> & { id?: string },
): PrisonFollowUp {
  return {
    ...input,
    id: input.id || `pfu-${Date.now()}`,
    participant_id: input.participant_id || null,
    participant_name: input.participant_name || "",
    prison_id: input.prison_id || null,
    method: input.method || "Through Representative",
    status: input.status || "Pending",
    result: input.result || "",
    next_action: input.next_action || "",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonReport(
  input: Partial<PrisonReport> & { id?: string },
): PrisonReport {
  const status = input.status || input.estado || "Draft";
  return {
    ...input,
    id: input.id || `pr-${Date.now()}`,
    report_number: input.report_number || "",
    prison_id: input.prison_id || null,
    service_id: input.service_id || null,
    name: input.name || "Relatório Prisional",
    category: input.category || "",
    attendance_total: Number(input.attendance_total ?? 0) || 0,
    new_converts_count: Number(input.new_converts_count ?? 0) || 0,
    foundation_interest_count: Number(input.foundation_interest_count ?? 0) || 0,
    materials_distributed: Number(input.materials_distributed ?? 0) || 0,
    status,
    estado: input.estado || status,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePrisonMaterialsRequest(
  input: Partial<PrisonMaterialsRequest> & { id?: string },
): PrisonMaterialsRequest {
  return {
    ...input,
    id: input.id || `pmr-${Date.now()}`,
    request_number: input.request_number || "",
    prison_id: input.prison_id || null,
    material_type: input.material_type || "Other",
    material_name: input.material_name || "",
    quantity_requested: Number(input.quantity_requested ?? 0) || 0,
    quantity_fulfilled: Number(input.quantity_fulfilled ?? 0) || 0,
    status: input.status || "Pending",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

export async function listPrisonLocations(): Promise<DataResult<PrisonLocation[]>> {
  try {
    const r = await getDataProvider().prisonLocations.list();
    if (!r.ok) return r as DataResult<PrisonLocation[]>;
    return ok((r.data || []).map((x) => normalizePrisonLocation(x as PrisonLocation)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonLocations failed");
  }
}
export async function getPrisonLocationById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonLocations.getById(id);
    if (!r.ok) return r as DataResult<PrisonLocation | null>;
    return ok(r.data ? normalizePrisonLocation(r.data as PrisonLocation) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonLocationById failed");
  }
}
export async function createPrisonLocation(payload: Partial<PrisonLocation>) {
  try {
    const row = normalizePrisonLocation(payload);
    const repo = getDataProvider().prisonLocations;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonLocation>;
    const n = normalizePrisonLocation(r.data as PrisonLocation);
    void softAudit("prison_location_created", "prison_location", n.id, n.name || "");
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonLocation failed");
  }
}
export async function updatePrisonLocation(id: EntityId, payload: Partial<PrisonLocation>) {
  try {
    const existing = await getPrisonLocationById(id);
    if (!existing.ok || !existing.data) return fail("Prisão não encontrada", "NOT_FOUND");
    const row = normalizePrisonLocation({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonLocations;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonLocation>;
    return ok(normalizePrisonLocation(r.data as PrisonLocation));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonLocation failed");
  }
}
export async function deletePrisonLocation(id: EntityId) {
  try {
    const repo = getDataProvider().prisonLocations;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePrisonLocation failed");
  }
}
export async function searchPrisonLocations(query: string) {
  const list = await listPrisonLocations();
  if (!list.ok) return list;
  const q = sk(query);
  if (!q) return list;
  return ok(
    list.data.filter((p) =>
      sk([p.name, p.nome_da_prisao, p.city, p.province].join(" ")).includes(q),
    ),
  );
}
export async function getPrisonLocationsByProvince(province: string) {
  const list = await listPrisonLocations();
  if (!list.ok) return list;
  const k = sk(province);
  return ok(list.data.filter((p) => sk(p.province || p.provincia).includes(k)));
}
export async function getPrisonLocationsByStatus(status: string) {
  const list = await listPrisonLocations();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(
    list.data.filter((p) => sk(p.status).includes(k) || sk(p.estado).includes(k)),
  );
}
export async function getActivePrisonLocations() {
  return getPrisonLocationsByStatus("Active");
}

// ---------------------------------------------------------------------------
// Representatives
// ---------------------------------------------------------------------------

export async function listPrisonRepresentatives(): Promise<DataResult<PrisonRepresentative[]>> {
  try {
    const r = await getDataProvider().prisonRepresentatives.list();
    if (!r.ok) return r as DataResult<PrisonRepresentative[]>;
    return ok(
      (r.data || []).map((x) => normalizePrisonRepresentative(x as PrisonRepresentative)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonRepresentatives failed");
  }
}
export async function getPrisonRepresentativeById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonRepresentatives.getById(id);
    if (!r.ok) return r as DataResult<PrisonRepresentative | null>;
    return ok(r.data ? normalizePrisonRepresentative(r.data as PrisonRepresentative) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonRepresentativeById failed");
  }
}
export async function createPrisonRepresentative(payload: Partial<PrisonRepresentative>) {
  try {
    const row = normalizePrisonRepresentative(payload);
    const repo = getDataProvider().prisonRepresentatives;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonRepresentative>;
    return ok(normalizePrisonRepresentative(r.data as PrisonRepresentative));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonRepresentative failed");
  }
}
export async function updatePrisonRepresentative(
  id: EntityId,
  payload: Partial<PrisonRepresentative>,
) {
  try {
    const existing = await getPrisonRepresentativeById(id);
    if (!existing.ok || !existing.data) return fail("Representante não encontrado", "NOT_FOUND");
    const row = normalizePrisonRepresentative({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonRepresentatives;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonRepresentative>;
    return ok(normalizePrisonRepresentative(r.data as PrisonRepresentative));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonRepresentative failed");
  }
}
export async function deletePrisonRepresentative(id: EntityId) {
  try {
    const repo = getDataProvider().prisonRepresentatives;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePrisonRepresentative failed");
  }
}
export async function getRepresentativesByPrison(prisonId: EntityId) {
  const list = await listPrisonRepresentatives();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.prison_id === prisonId));
}
export async function getRepresentativesByStatus(status: string) {
  const list = await listPrisonRepresentatives();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(list.data.filter((r) => sk(r.status).includes(k)));
}
export async function getActiveRepresentatives() {
  return getRepresentativesByStatus("Active");
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function listPrisonServices(): Promise<DataResult<PrisonService[]>> {
  try {
    const r = await getDataProvider().prisonServices.list();
    if (!r.ok) return r as DataResult<PrisonService[]>;
    return ok((r.data || []).map((x) => normalizePrisonService(x as PrisonService)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonServices failed");
  }
}
export async function getPrisonServiceById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonServices.getById(id);
    if (!r.ok) return r as DataResult<PrisonService | null>;
    return ok(r.data ? normalizePrisonService(r.data as PrisonService) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonServiceById failed");
  }
}
export async function createPrisonService(payload: Partial<PrisonService>) {
  try {
    const listed = await listPrisonServices();
    const nums = listed.ok ? listed.data.map((s) => s.service_number || "") : [];
    const row = normalizePrisonService({
      ...payload,
      service_number: payload.service_number || nextNum("PSV", nums),
    });
    const repo = getDataProvider().prisonServices;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonService>;
    const n = normalizePrisonService(r.data as PrisonService);
    void softAudit("prison_service_created", "prison_service", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonService failed");
  }
}
export async function updatePrisonService(id: EntityId, payload: Partial<PrisonService>) {
  try {
    const existing = await getPrisonServiceById(id);
    if (!existing.ok || !existing.data) return fail("Serviço não encontrado", "NOT_FOUND");
    const row = normalizePrisonService({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonServices;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonService>;
    return ok(normalizePrisonService(r.data as PrisonService));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonService failed");
  }
}
export async function deletePrisonService(id: EntityId) {
  try {
    const repo = getDataProvider().prisonServices;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePrisonService failed");
  }
}
export async function getServicesByPrison(prisonId: EntityId) {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.prison_id === prisonId || s.prisao === prisonId));
}
export async function getServicesByDate(date: string) {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  const d = String(date).slice(0, 10);
  return ok(
    list.data.filter((s) => String(s.service_date || s.data || "").slice(0, 10) === d),
  );
}
export async function getServicesByDateRange(startDate: string, endDate: string) {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  return ok(
    list.data.filter((s) => {
      const d = String(s.service_date || s.data || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getServicesByStatus(status: string) {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(
    list.data.filter((s) => sk(s.status).includes(k) || sk(s.estado).includes(k)),
  );
}
export async function getUpcomingPrisonServices() {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter((s) => {
      const d = String(s.service_date || s.data || "");
      return d >= today && !/cancel|complete|realiz|conclu/i.test(String(s.status || s.estado));
    }),
  );
}
export async function getCompletedPrisonServices() {
  const list = await listPrisonServices();
  if (!list.ok) return list;
  return ok(
    list.data.filter((s) =>
      /complete|realiz|conclu|report/i.test(String(s.status || s.estado || "")),
    ),
  );
}
export async function completePrisonService(
  id: EntityId,
  payload: Partial<PrisonService> = {},
) {
  const result = await updatePrisonService(id, {
    ...payload,
    status: "Completed",
    estado: "Realizado",
  });
  if (result.ok) void softAudit("prison_service_completed", "prison_service", String(id));
  return result;
}
export async function cancelPrisonService(id: EntityId, payload: { notes?: string } = {}) {
  return updatePrisonService(id, {
    status: "Cancelled",
    estado: "Cancelado",
    notes: payload.notes || "",
  });
}

// ---------------------------------------------------------------------------
// Participants (minimal sensitive data)
// ---------------------------------------------------------------------------

export async function listPrisonParticipants(): Promise<DataResult<PrisonParticipant[]>> {
  try {
    const r = await getDataProvider().prisonParticipants.list();
    if (!r.ok) return r as DataResult<PrisonParticipant[]>;
    return ok((r.data || []).map((x) => normalizePrisonParticipant(x as PrisonParticipant)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonParticipants failed");
  }
}
export async function getPrisonParticipantById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonParticipants.getById(id);
    if (!r.ok) return r as DataResult<PrisonParticipant | null>;
    if (r.data) void softAudit("prison_participant_viewed", "prison_participant", String(id));
    return ok(r.data ? normalizePrisonParticipant(r.data as PrisonParticipant) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonParticipantById failed");
  }
}
export async function createPrisonParticipant(payload: Partial<PrisonParticipant>) {
  try {
    // Strip criminal-like keys if ever sent
    const clean = { ...payload } as Record<string, unknown>;
    delete clean.crime;
    delete clean.sentence;
    delete clean.criminal_record;
    const listed = await listPrisonParticipants();
    const nums = listed.ok ? listed.data.map((p) => p.participant_code || "") : [];
    const row = normalizePrisonParticipant({
      ...(clean as Partial<PrisonParticipant>),
      participant_code:
        (clean.participant_code as string) || nextNum("INM", nums),
      confidentiality_level:
        (clean.confidentiality_level as string) || "Private",
    });
    const repo = getDataProvider().prisonParticipants;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonParticipant>;
    const n = normalizePrisonParticipant(r.data as PrisonParticipant);
    void softAudit("prison_participant_created", "prison_participant", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonParticipant failed");
  }
}
export async function updatePrisonParticipant(
  id: EntityId,
  payload: Partial<PrisonParticipant>,
) {
  try {
    const existing = await getPrisonParticipantById(id);
    if (!existing.ok || !existing.data) return fail("Participante não encontrado", "NOT_FOUND");
    const clean = { ...payload } as Record<string, unknown>;
    delete clean.crime;
    delete clean.sentence;
    delete clean.criminal_record;
    const row = normalizePrisonParticipant({
      ...existing.data,
      ...(clean as Partial<PrisonParticipant>),
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonParticipants;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonParticipant>;
    return ok(normalizePrisonParticipant(r.data as PrisonParticipant));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonParticipant failed");
  }
}
export async function deletePrisonParticipant(id: EntityId) {
  try {
    const repo = getDataProvider().prisonParticipants;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePrisonParticipant failed");
  }
}
export async function getParticipantsByPrison(prisonId: EntityId) {
  const list = await listPrisonParticipants();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.prison_id === prisonId));
}
export async function getParticipantsByStatus(status: string) {
  const list = await listPrisonParticipants();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(list.data.filter((p) => sk(p.status).includes(k)));
}
export async function getParticipantsByFoundationStatus(status: string) {
  const list = await listPrisonParticipants();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(list.data.filter((p) => sk(p.foundation_status).includes(k)));
}
export async function getNewConvertsInPrison() {
  const list = await listPrisonParticipants();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.born_again || p.new_convert_date));
}
export async function getParticipantsNeedingFollowUp() {
  const list = await listPrisonParticipants();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) =>
      /pend|progress|need|visit/i.test(String(p.follow_up_status || "")),
    ),
  );
}

// ---------------------------------------------------------------------------
// Foundation students (prison)
// ---------------------------------------------------------------------------

export async function listPrisonFoundationStudents(): Promise<
  DataResult<PrisonFoundationStudent[]>
> {
  try {
    const r = await getDataProvider().prisonFoundationStudents.list();
    if (!r.ok) return r as DataResult<PrisonFoundationStudent[]>;
    return ok(
      (r.data || []).map((x) => normalizePrisonFoundationStudent(x as PrisonFoundationStudent)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonFoundationStudents failed");
  }
}
export async function getPrisonFoundationStudentById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonFoundationStudents.getById(id);
    if (!r.ok) return r as DataResult<PrisonFoundationStudent | null>;
    return ok(
      r.data ? normalizePrisonFoundationStudent(r.data as PrisonFoundationStudent) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonFoundationStudentById failed");
  }
}
export async function createPrisonFoundationStudent(
  payload: Partial<PrisonFoundationStudent>,
) {
  try {
    const row = normalizePrisonFoundationStudent(payload);
    const repo = getDataProvider().prisonFoundationStudents;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonFoundationStudent>;
    const n = normalizePrisonFoundationStudent(r.data as PrisonFoundationStudent);
    if (n.participant_id) {
      await updatePrisonParticipant(n.participant_id, {
        foundation_status: "Enrolled",
        foundation_student_id: n.id,
        foundation_interest: true,
      });
    }
    void softAudit("prison_foundation_enrolled", "prison_foundation_student", n.id);
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonFoundationStudent failed");
  }
}
export async function updatePrisonFoundationStudent(
  id: EntityId,
  payload: Partial<PrisonFoundationStudent>,
) {
  try {
    const existing = await getPrisonFoundationStudentById(id);
    if (!existing.ok || !existing.data) return fail("Aluno não encontrado", "NOT_FOUND");
    const row = normalizePrisonFoundationStudent({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonFoundationStudents;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonFoundationStudent>;
    return ok(normalizePrisonFoundationStudent(r.data as PrisonFoundationStudent));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonFoundationStudent failed");
  }
}
export async function getPrisonFoundationStudentsByPrison(prisonId: EntityId) {
  const list = await listPrisonFoundationStudents();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.prison_id === prisonId || s.prisao === prisonId));
}
export async function getPrisonFoundationStudentsByClass(classId: EntityId) {
  const list = await listPrisonFoundationStudents();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.class_id === classId));
}
export async function getPrisonFoundationStudentsByProgressStatus(status: string) {
  const list = await listPrisonFoundationStudents();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(
    list.data.filter((s) => sk(s.status).includes(k) || sk(s.estado).includes(k)),
  );
}
export async function markPrisonFoundationLessonCompleted(
  id: EntityId,
  payload: { lesson?: number } = {},
) {
  const existing = await getPrisonFoundationStudentById(id);
  if (!existing.ok || !existing.data) return fail("Aluno não encontrado", "NOT_FOUND");
  const lesson = Number(payload.lesson ?? (existing.data.current_lesson || 0) + 1) || 1;
  const key = `aula_${Math.min(lesson, 7)}_presenca` as keyof PrisonFoundationStudent;
  const patch: Partial<PrisonFoundationStudent> = {
    current_lesson: lesson,
    lessons_completed: Math.max(Number(existing.data.lessons_completed || 0), lesson),
    [key]: true,
  };
  return updatePrisonFoundationStudent(id, patch);
}
export async function updatePrisonFoundationScore(
  id: EntityId,
  payload: { score?: number } = {},
) {
  return updatePrisonFoundationStudent(id, {
    nota_exame: payload.score,
    test_scores: payload.score,
  });
}
export async function markPrisonFoundationReadyForFinalExam(
  id: EntityId,
  _payload = {},
) {
  return updatePrisonFoundationStudent(id, {
    status: "Ready for Final Exam",
    estado: "Exame",
    final_exam_status: "Ready",
  });
}

// ---------------------------------------------------------------------------
// Weekly agenda
// ---------------------------------------------------------------------------

export async function listPrisonWeeklyAgendas(): Promise<DataResult<PrisonWeeklyAgenda[]>> {
  try {
    const r = await getDataProvider().prisonWeeklyAgendas.list();
    if (!r.ok) return r as DataResult<PrisonWeeklyAgenda[]>;
    return ok((r.data || []).map((x) => normalizePrisonWeeklyAgenda(x as PrisonWeeklyAgenda)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonWeeklyAgendas failed");
  }
}
export async function getPrisonWeeklyAgendaById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonWeeklyAgendas.getById(id);
    if (!r.ok) return r as DataResult<PrisonWeeklyAgenda | null>;
    return ok(r.data ? normalizePrisonWeeklyAgenda(r.data as PrisonWeeklyAgenda) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonWeeklyAgendaById failed");
  }
}
export async function createPrisonWeeklyAgenda(payload: Partial<PrisonWeeklyAgenda>) {
  try {
    const row = normalizePrisonWeeklyAgenda(payload);
    const repo = getDataProvider().prisonWeeklyAgendas;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonWeeklyAgenda>;
    return ok(normalizePrisonWeeklyAgenda(r.data as PrisonWeeklyAgenda));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonWeeklyAgenda failed");
  }
}
export async function updatePrisonWeeklyAgenda(
  id: EntityId,
  payload: Partial<PrisonWeeklyAgenda>,
) {
  try {
    const existing = await getPrisonWeeklyAgendaById(id);
    if (!existing.ok || !existing.data) return fail("Agenda não encontrada", "NOT_FOUND");
    const row = normalizePrisonWeeklyAgenda({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonWeeklyAgendas;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonWeeklyAgenda>;
    return ok(normalizePrisonWeeklyAgenda(r.data as PrisonWeeklyAgenda));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonWeeklyAgenda failed");
  }
}
export async function activatePrisonWeeklyAgenda(id: EntityId, _payload = {}) {
  const list = await listPrisonWeeklyAgendas();
  if (list.ok) {
    for (const a of list.data) {
      if (a.id !== id && /active|confirm/i.test(String(a.status || a.estado))) {
        await updatePrisonWeeklyAgenda(a.id, { status: "Completed", estado: "Concluído" });
      }
    }
  }
  const result = await updatePrisonWeeklyAgenda(id, {
    status: "Active",
    estado: "Confirmado",
  });
  if (result.ok) void softAudit("prison_agenda_activated", "prison_weekly_agenda", String(id));
  return result;
}
export async function closePrisonWeeklyAgenda(id: EntityId, _payload = {}) {
  return updatePrisonWeeklyAgenda(id, { status: "Completed", estado: "Concluído" });
}
export async function getCurrentPrisonWeeklyAgenda() {
  const list = await listPrisonWeeklyAgendas();
  if (!list.ok) return list as DataResult<PrisonWeeklyAgenda | null>;
  const active = list.data.find((a) => /active|confirm/i.test(String(a.status || a.estado)));
  return ok(active || list.data[0] || null);
}
export async function getAgendaByWeek(weekStartDate: string, weekEndDate: string) {
  const list = await listPrisonWeeklyAgendas();
  if (!list.ok) return list;
  return ok(
    list.data.filter((a) => {
      const s = String(a.week_start_date || a.semana_inicio || "");
      return s === weekStartDate || (s >= weekStartDate && s <= weekEndDate);
    }),
  );
}
export async function getAgendaByPrison(_prisonId: EntityId) {
  return listPrisonWeeklyAgendas();
}

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export async function listPrisonFollowUps(): Promise<DataResult<PrisonFollowUp[]>> {
  try {
    const r = await getDataProvider().prisonFollowUps.list();
    if (!r.ok) return r as DataResult<PrisonFollowUp[]>;
    return ok((r.data || []).map((x) => normalizePrisonFollowUp(x as PrisonFollowUp)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonFollowUps failed");
  }
}
export async function getPrisonFollowUpById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonFollowUps.getById(id);
    if (!r.ok) return r as DataResult<PrisonFollowUp | null>;
    return ok(r.data ? normalizePrisonFollowUp(r.data as PrisonFollowUp) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonFollowUpById failed");
  }
}
export async function createPrisonFollowUp(payload: Partial<PrisonFollowUp>) {
  try {
    const row = normalizePrisonFollowUp(payload);
    const repo = getDataProvider().prisonFollowUps;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonFollowUp>;
    const n = normalizePrisonFollowUp(r.data as PrisonFollowUp);
    if (n.participant_id) {
      await updatePrisonParticipant(n.participant_id, {
        follow_up_status: n.status || "In Progress",
        last_follow_up_date: n.follow_up_date || todayIso(),
        next_follow_up_date: n.next_follow_up_date || null,
      });
    }
    return ok(n);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonFollowUp failed");
  }
}
export async function updatePrisonFollowUp(id: EntityId, payload: Partial<PrisonFollowUp>) {
  try {
    const existing = await getPrisonFollowUpById(id);
    if (!existing.ok || !existing.data) return fail("Follow-up não encontrado", "NOT_FOUND");
    const row = normalizePrisonFollowUp({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonFollowUps;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonFollowUp>;
    return ok(normalizePrisonFollowUp(r.data as PrisonFollowUp));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonFollowUp failed");
  }
}
export async function completePrisonFollowUp(
  id: EntityId,
  payload: { result?: string; notes?: string } = {},
) {
  return updatePrisonFollowUp(id, {
    status: "Completed",
    result: payload.result || "Encouraged",
    notes: payload.notes || "",
  });
}
export async function getFollowUpsByPrison(prisonId: EntityId) {
  const list = await listPrisonFollowUps();
  if (!list.ok) return list;
  return ok(list.data.filter((f) => f.prison_id === prisonId));
}
export async function getFollowUpsByParticipant(participantId: EntityId) {
  const list = await listPrisonFollowUps();
  if (!list.ok) return list;
  return ok(list.data.filter((f) => f.participant_id === participantId));
}
export async function getPendingPrisonFollowUps() {
  const list = await listPrisonFollowUps();
  if (!list.ok) return list;
  return ok(list.data.filter((f) => /pend|progress|need/i.test(String(f.status || ""))));
}
export async function getTodayPrisonFollowUps() {
  const list = await listPrisonFollowUps();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter(
      (f) =>
        String(f.follow_up_date || "") === today || String(f.next_follow_up_date || "") === today,
    ),
  );
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export async function listPrisonReports(): Promise<DataResult<PrisonReport[]>> {
  try {
    const r = await getDataProvider().prisonReports.list();
    if (!r.ok) return r as DataResult<PrisonReport[]>;
    return ok((r.data || []).map((x) => normalizePrisonReport(x as PrisonReport)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonReports failed");
  }
}
export async function getPrisonReportById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonReports.getById(id);
    if (!r.ok) return r as DataResult<PrisonReport | null>;
    return ok(r.data ? normalizePrisonReport(r.data as PrisonReport) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonReportById failed");
  }
}
export async function createPrisonReport(payload: Partial<PrisonReport>) {
  try {
    const listed = await listPrisonReports();
    const nums = listed.ok ? listed.data.map((x) => x.report_number || "") : [];
    const row = normalizePrisonReport({
      ...payload,
      report_number: payload.report_number || nextNum("PREP", nums),
    });
    const repo = getDataProvider().prisonReports;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonReport>;
    return ok(normalizePrisonReport(r.data as PrisonReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonReport failed");
  }
}
export async function updatePrisonReport(id: EntityId, payload: Partial<PrisonReport>) {
  try {
    const existing = await getPrisonReportById(id);
    if (!existing.ok || !existing.data) return fail("Relatório não encontrado", "NOT_FOUND");
    const row = normalizePrisonReport({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonReports;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonReport>;
    return ok(normalizePrisonReport(r.data as PrisonReport));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonReport failed");
  }
}
export async function submitPrisonReport(
  id: EntityId,
  payload: { submitted_by_name?: string } = {},
) {
  const result = await updatePrisonReport(id, {
    status: "Submitted",
    estado: "Relatório Submetido",
    submitted_at: nowIso(),
    submitted_by_name: payload.submitted_by_name || "",
  });
  if (result.ok && result.data?.service_id) {
    await updatePrisonService(result.data.service_id, {
      status: "Report Submitted",
      estado: "Relatório Submetido",
      report_id: id,
    });
  }
  if (result.ok) void softAudit("prison_report_submitted", "prison_report", String(id));
  return result;
}
export async function validatePrisonReport(
  id: EntityId,
  payload: { validated_by_name?: string } = {},
) {
  const result = await updatePrisonReport(id, {
    status: "Validated",
    validated_at: nowIso(),
    validated_by_name: payload.validated_by_name || "",
  });
  if (result.ok) void softAudit("prison_report_validated", "prison_report", String(id));
  return result;
}
export async function rejectPrisonReport(
  id: EntityId,
  payload: { rejection_reason?: string; rejected_by_name?: string } = {},
) {
  if (!payload.rejection_reason?.trim()) {
    return fail("rejection_reason é obrigatório", "VALIDATION");
  }
  const result = await updatePrisonReport(id, {
    status: "Needs Correction",
    rejection_reason: payload.rejection_reason,
    rejected_at: nowIso(),
    rejected_by_name: payload.rejected_by_name || "",
  });
  if (result.ok) void softAudit("prison_report_rejected", "prison_report", String(id));
  return result;
}
export async function getReportsByPrison(prisonId: EntityId) {
  const list = await listPrisonReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.prison_id === prisonId));
}
export async function getReportsByDateRange(startDate: string, endDate: string) {
  const list = await listPrisonReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) => {
      const d = String(r.report_date || r.period_end || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getReportsByStatus(status: string) {
  const list = await listPrisonReports();
  if (!list.ok) return list;
  const k = sk(status);
  return ok(
    list.data.filter((r) => sk(r.status).includes(k) || sk(r.estado).includes(k)),
  );
}
export async function getPendingPrisonReports() {
  const list = await listPrisonReports();
  if (!list.ok) return list;
  return ok(
    list.data.filter((r) =>
      /draft|submit|review|rascun|submet|revis/i.test(String(r.status || r.estado)),
    ),
  );
}
export async function getValidatedPrisonReports() {
  const list = await listPrisonReports();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => /valid|aprov/i.test(String(r.status || r.estado))));
}

// ---------------------------------------------------------------------------
// Materials requests (prepare Ministry Materials link)
// ---------------------------------------------------------------------------

export async function listPrisonMaterialsRequests(): Promise<
  DataResult<PrisonMaterialsRequest[]>
> {
  try {
    const r = await getDataProvider().prisonMaterialsRequests.list();
    if (!r.ok) return r as DataResult<PrisonMaterialsRequest[]>;
    return ok(
      (r.data || []).map((x) => normalizePrisonMaterialsRequest(x as PrisonMaterialsRequest)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPrisonMaterialsRequests failed");
  }
}
export async function getPrisonMaterialsRequestById(id: EntityId) {
  try {
    const r = await getDataProvider().prisonMaterialsRequests.getById(id);
    if (!r.ok) return r as DataResult<PrisonMaterialsRequest | null>;
    return ok(
      r.data ? normalizePrisonMaterialsRequest(r.data as PrisonMaterialsRequest) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPrisonMaterialsRequestById failed");
  }
}
export async function createPrisonMaterialsRequest(payload: Partial<PrisonMaterialsRequest>) {
  try {
    const listed = await listPrisonMaterialsRequests();
    const nums = listed.ok ? listed.data.map((x) => x.request_number || "") : [];
    const row = normalizePrisonMaterialsRequest({
      ...payload,
      request_number: payload.request_number || nextNum("PMAT", nums),
    });
    const repo = getDataProvider().prisonMaterialsRequests;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const r = await repo.create(row);
    if (!r.ok) return r as DataResult<PrisonMaterialsRequest>;
    return ok(normalizePrisonMaterialsRequest(r.data as PrisonMaterialsRequest));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPrisonMaterialsRequest failed");
  }
}
export async function updatePrisonMaterialsRequest(
  id: EntityId,
  payload: Partial<PrisonMaterialsRequest>,
) {
  try {
    const existing = await getPrisonMaterialsRequestById(id);
    if (!existing.ok || !existing.data) return fail("Pedido não encontrado", "NOT_FOUND");
    const row = normalizePrisonMaterialsRequest({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().prisonMaterialsRequests;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const r = await repo.update(id, row);
    if (!r.ok) return r as DataResult<PrisonMaterialsRequest>;
    return ok(normalizePrisonMaterialsRequest(r.data as PrisonMaterialsRequest));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePrisonMaterialsRequest failed");
  }
}
export async function getMaterialsRequestsByPrison(prisonId: EntityId) {
  const list = await listPrisonMaterialsRequests();
  if (!list.ok) return list;
  return ok(list.data.filter((m) => m.prison_id === prisonId));
}
export async function getPendingPrisonMaterialsRequests() {
  const list = await listPrisonMaterialsRequests();
  if (!list.ok) return list;
  return ok(list.data.filter((m) => /pend|partial/i.test(String(m.status || ""))));
}
export async function markPrisonMaterialsRequestFulfilled(
  id: EntityId,
  payload: { quantity_fulfilled?: number } = {},
) {
  const existing = await getPrisonMaterialsRequestById(id);
  if (!existing.ok || !existing.data) return fail("Pedido não encontrado", "NOT_FOUND");
  const qty =
    payload.quantity_fulfilled ?? existing.data.quantity_requested ?? 0;
  return updatePrisonMaterialsRequest(id, {
    quantity_fulfilled: qty,
    status:
      qty >= Number(existing.data.quantity_requested || 0) ? "Fulfilled" : "Partially Fulfilled",
  });
}

// ---------------------------------------------------------------------------
// Analytics (aggregated by default — no sensitive participant notes)
// ---------------------------------------------------------------------------

export async function getPrisonMinistryOverviewStats(_filters: Record<string, unknown> = {}) {
  const [locs, services, participants, students, followUps, reports, materials] =
    await Promise.all([
      listPrisonLocations(),
      listPrisonServices(),
      listPrisonParticipants(),
      listPrisonFoundationStudents(),
      listPrisonFollowUps(),
      listPrisonReports(),
      listPrisonMaterialsRequests(),
    ]);
  const s = services.ok ? services.data : [];
  const p = participants.ok ? participants.data : [];
  const st = students.ok ? students.data : [];
  return ok({
    activePrisons: (locs.ok ? locs.data : []).filter((l) =>
      /activ|activo/i.test(String(l.status || l.estado)),
    ).length,
    servicesCompleted: s.filter((x) =>
      /complete|realiz|report/i.test(String(x.status || x.estado)),
    ).length,
    servicesScheduled: s.filter((x) =>
      /sched|plane|confirm/i.test(String(x.status || x.estado)),
    ).length,
    participantsActive: p.filter((x) => /activ/i.test(String(x.status || ""))).length,
    newConverts: p.filter((x) => x.born_again || x.new_convert_date).length,
    foundationStudents: st.length,
    foundationInProgress: st.filter((x) =>
      /progress|curso|enroll/i.test(String(x.status || x.estado)),
    ).length,
    pendingFollowUps: (followUps.ok ? followUps.data : []).filter((f) =>
      /pend|progress/i.test(String(f.status || "")),
    ).length,
    pendingReports: (reports.ok ? reports.data : []).filter((r) =>
      /draft|submit|submet/i.test(String(r.status || r.estado)),
    ).length,
    materialsPending: (materials.ok ? materials.data : []).filter((m) =>
      /pend|partial/i.test(String(m.status || "")),
    ).length,
    inmatesReached: s.reduce(
      (sum, x) => sum + Number(x.attendance_total || x.numero_de_internos_presentes || 0),
      0,
    ),
  });
}

export async function getPrisonServicesReport(filters: { startDate?: string; endDate?: string } = {}) {
  if (filters.startDate && filters.endDate) {
    return getServicesByDateRange(filters.startDate, filters.endDate);
  }
  return listPrisonServices();
}
export async function getPrisonFoundationSchoolReport(_filters = {}) {
  const list = await listPrisonFoundationStudents();
  if (!list.ok) return list;
  // Aggregated — no confidential notes body
  return ok(
    list.data.map((s) => ({
      id: s.id,
      prison_id: s.prison_id,
      status: s.status,
      lessons_completed: s.lessons_completed,
      delivery_mode: s.delivery_mode,
      final_exam_status: s.final_exam_status,
      // participant_name intentionally soft-shown; UI must gate by RBAC
      has_participant: !!s.participant_id,
    })),
  );
}
export async function getPrisonFollowUpReport(_filters = {}) {
  return listPrisonFollowUps();
}
export async function getPrisonMaterialsReport(_filters = {}) {
  return listPrisonMaterialsRequests();
}
export async function getPrisonWeeklyReport(_filters = {}) {
  const [agenda, services, reports] = await Promise.all([
    getCurrentPrisonWeeklyAgenda(),
    listPrisonServices(),
    listPrisonReports(),
  ]);
  return ok({
    agenda: agenda.ok ? agenda.data : null,
    services: services.ok ? services.data : [],
    reports: reports.ok ? reports.data : [],
  });
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensurePrisonMinistrySeeded(): Promise<DataResult<boolean>> {
  try {
    const seed = async <T extends { id: string }>(
      listFn: () => Promise<DataResult<T[]>>,
      createViaRepo: (row: T) => Promise<unknown>,
      rows: T[],
    ) => {
      const listed = await listFn();
      if (listed.ok && listed.data.length === 0) {
        for (const s of rows) await createViaRepo(s);
      }
    };
    const p = getDataProvider();
    await seed(listPrisonLocations, (r) => p.prisonLocations.create!(normalizePrisonLocation(r)), PRISON_LOCATIONS_SEED as PrisonLocation[]);
    await seed(
      listPrisonRepresentatives,
      (r) => p.prisonRepresentatives.create!(normalizePrisonRepresentative(r)),
      PRISON_REPRESENTATIVES_SEED as PrisonRepresentative[],
    );
    await seed(
      listPrisonServices,
      (r) => p.prisonServices.create!(normalizePrisonService(r)),
      PRISON_SERVICES_SEED as PrisonService[],
    );
    await seed(
      listPrisonParticipants,
      (r) => p.prisonParticipants.create!(normalizePrisonParticipant(r)),
      PRISON_PARTICIPANTS_SEED as PrisonParticipant[],
    );
    await seed(
      listPrisonFoundationStudents,
      (r) => p.prisonFoundationStudents.create!(normalizePrisonFoundationStudent(r)),
      PRISON_FOUNDATION_STUDENTS_SEED as PrisonFoundationStudent[],
    );
    await seed(
      listPrisonWeeklyAgendas,
      (r) => p.prisonWeeklyAgendas.create!(normalizePrisonWeeklyAgenda(r)),
      PRISON_WEEKLY_AGENDAS_SEED as PrisonWeeklyAgenda[],
    );
    await seed(
      listPrisonFollowUps,
      (r) => p.prisonFollowUps.create!(normalizePrisonFollowUp(r)),
      PRISON_FOLLOW_UPS_SEED as PrisonFollowUp[],
    );
    await seed(
      listPrisonReports,
      (r) => p.prisonReports.create!(normalizePrisonReport(r)),
      PRISON_REPORTS_SEED as PrisonReport[],
    );
    await seed(
      listPrisonMaterialsRequests,
      (r) => p.prisonMaterialsRequests.create!(normalizePrisonMaterialsRequest(r)),
      PRISON_MATERIALS_REQUESTS_SEED as PrisonMaterialsRequest[],
    );
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensurePrisonMinistrySeeded failed");
  }
}

export function getPrisonMinistryDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "prisonMinistry",
  };
}

export {
  PRISON_LOCATIONS_SEED,
  PRISON_REPRESENTATIVES_SEED,
  PRISON_SERVICES_SEED,
  PRISON_PARTICIPANTS_SEED,
  PRISON_FOUNDATION_STUDENTS_SEED,
  PRISON_WEEKLY_AGENDAS_SEED,
  PRISON_FOLLOW_UPS_SEED,
  PRISON_REPORTS_SEED,
  PRISON_MATERIALS_REQUESTS_SEED,
};

export const prisonMinistryRepository = {
  listPrisonLocations,
  getPrisonLocationById,
  createPrisonLocation,
  updatePrisonLocation,
  deletePrisonLocation,
  searchPrisonLocations,
  getActivePrisonLocations,
  listPrisonRepresentatives,
  createPrisonRepresentative,
  updatePrisonRepresentative,
  getRepresentativesByPrison,
  getActiveRepresentatives,
  listPrisonServices,
  createPrisonService,
  updatePrisonService,
  completePrisonService,
  cancelPrisonService,
  getUpcomingPrisonServices,
  getCompletedPrisonServices,
  listPrisonParticipants,
  createPrisonParticipant,
  updatePrisonParticipant,
  getNewConvertsInPrison,
  getParticipantsNeedingFollowUp,
  listPrisonFoundationStudents,
  createPrisonFoundationStudent,
  updatePrisonFoundationStudent,
  markPrisonFoundationLessonCompleted,
  updatePrisonFoundationScore,
  markPrisonFoundationReadyForFinalExam,
  listPrisonWeeklyAgendas,
  createPrisonWeeklyAgenda,
  updatePrisonWeeklyAgenda,
  activatePrisonWeeklyAgenda,
  closePrisonWeeklyAgenda,
  getCurrentPrisonWeeklyAgenda,
  listPrisonFollowUps,
  createPrisonFollowUp,
  updatePrisonFollowUp,
  completePrisonFollowUp,
  getPendingPrisonFollowUps,
  listPrisonReports,
  createPrisonReport,
  updatePrisonReport,
  submitPrisonReport,
  validatePrisonReport,
  rejectPrisonReport,
  getPendingPrisonReports,
  listPrisonMaterialsRequests,
  createPrisonMaterialsRequest,
  updatePrisonMaterialsRequest,
  getPendingPrisonMaterialsRequests,
  markPrisonMaterialsRequestFulfilled,
  getPrisonMinistryOverviewStats,
  getPrisonServicesReport,
  getPrisonFoundationSchoolReport,
  getPrisonFollowUpReport,
  getPrisonMaterialsReport,
  getPrisonWeeklyReport,
  ensurePrisonMinistrySeeded,
  getPrisonMinistryDataSourceInfo,
  getInfo: getPrisonMinistryDataSourceInfo,
};
