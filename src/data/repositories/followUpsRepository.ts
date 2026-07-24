import { getDataProvider } from "../dataProvider";
import { getDataSource, getBackendFeatureFlags } from "../config";
import type {
  EntityId,
  FollowUp,
  FollowUpTimelineEvent,
  Member,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { FOLLOW_UPS_SEED } from "../seeds/followUpsSeed";
import { listChurches } from "./churchesRepository";
import { getFirstTimerById, updateFirstTimer } from "./firstTimersRepository";
import { createMember, listMembers } from "./membersRepository";
import { getSupabaseEnvConfig } from "../adapters/supabase/supabaseConfig";
import * as followUpsSb from "../adapters/supabase/followUpsSupabaseAdapter";
import * as followUpsApi from "../adapters/api/followUpsApiAdapter";

function fail<T>(error: string, code = "FOLLOW_UPS_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}

/** Phase 4: route to Supabase adapter when flags + source allow. */
function useSupabaseFollowUps(): boolean {
  if (getDataSource() !== "supabase") return false;
  const cfg = getSupabaseEnvConfig();
  const flags = getBackendFeatureFlags();
  return flags.enableSupabase && cfg.isConfigured;
}

function useApiFollowUps(): boolean {
  return getDataSource() === "api";
}

function asBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "on" || value === "true" || value === "1" || value === 1) return true;
  return false;
}

function statusKey(status: string | null | undefined): string {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeTimelineEvent(
  followUpId: string,
  event_type: string,
  title: string,
  description: string,
  performer?: string | null,
): FollowUpTimelineEvent {
  return {
    id: `fue-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    follow_up_id: followUpId,
    event_type,
    title,
    description,
    performed_by_name: performer || null,
    performed_at: new Date().toISOString(),
  };
}

function eventTypeFromStatus(status: string | null | undefined): string {
  const key = statusKey(status);
  if (key === "pending") return "created";
  if (key === "contacted") return "contacted";
  if (key === "noanswer" || key === "noresponse") return "no_response";
  if (key === "interested" || key === "visitscheduled") return "visit_scheduled";
  if (key === "senttocell") return "sent_to_cell";
  if (key.includes("foundation") || key === "enrolledinfoundationschool") {
    return "sent_to_foundation";
  }
  if (key.includes("counseling")) return "sent_to_counseling";
  if (key === "becamemember") return "became_member";
  if (key === "closed") return "closed";
  return "updated";
}

export function normalizeFollowUp(
  input: Partial<FollowUp> & { id?: string },
): FollowUp {
  const id = input.id || `fu-${Date.now()}`;
  const status = input.status || input.estado || "Pending";
  const contactDate =
    input.data_do_contacto || input.follow_up_date || todayIso();
  const nextDate =
    input.proxima_data_de_contacto || input.next_follow_up_date || null;
  const method = input.metodo || input.contact_method || "";
  const result = input.resultado || input.result || "";
  const nextStep = input.proximo_passo || input.next_step || "";
  const fullName = input.full_name || input.fullName || "";
  const phone = input.phone || input.telefone || "";
  const responsible =
    input.responsible_name || input.actualizado_por || input.updated_by || "";
  const timeline = Array.isArray(input.timeline) ? input.timeline : [];

  return {
    ...input,
    id,
    first_timer_id: input.first_timer_id || input.firstTimerId || null,
    firstTimerId: input.firstTimerId || input.first_timer_id || null,
    member_id: input.member_id || null,
    person_type: input.person_type || (input.first_timer_id ? "First Timer" : "Other"),
    full_name: fullName,
    fullName,
    phone,
    telefone: input.telefone || phone,
    whatsapp: input.whatsapp || phone,
    email: input.email || "",
    church_id: input.church_id || null,
    church_name: input.church_name || null,
    cell_group_id: input.cell_group_id || null,
    cell_group_name: input.cell_group_name || null,
    cell_id: input.cell_id || null,
    cell_name: input.cell_name || input.celula || null,
    celula: input.celula || input.cell_name || "",
    responsible_user_id: input.responsible_user_id || null,
    responsible_name: responsible,
    actualizado_por: input.actualizado_por || responsible,
    data_do_contacto: contactDate,
    follow_up_date: contactDate,
    proxima_data_de_contacto: nextDate,
    next_follow_up_date: nextDate,
    metodo: method,
    contact_method: input.contact_method || method,
    resultado: result,
    result: input.result || result,
    proximo_passo: nextStep,
    next_step: input.next_step || nextStep,
    status,
    estado: input.estado || status,
    priority: input.priority || "Normal",
    wants_foundation_school: asBool(input.wants_foundation_school),
    wants_counseling: asBool(input.wants_counseling),
    interested_in_cell: asBool(input.interested_in_cell),
    became_member:
      asBool(input.became_member) || statusKey(status) === "becamemember",
    notas: input.notas || input.notes || "",
    notes: input.notes || input.notas || "",
    timeline,
    counseling_request_id: input.counseling_request_id || null,
    created_at: input.created_at || input.createdAt || todayIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
    createdAt:
      input.createdAt ||
      (typeof input.created_at === "string" ? input.created_at : undefined),
    updatedAt:
      input.updatedAt ||
      (typeof input.updated_at === "string" ? input.updated_at : undefined),
    dueAt: input.dueAt || (nextDate ? `${nextDate}T12:00:00.000Z` : null),
  };
}

async function attachChurchName(record: FollowUp): Promise<FollowUp> {
  if (!record.church_id || record.church_name) return record;
  try {
    const churches = await listChurches();
    if (!churches.ok) return record;
    const church = (churches.data || []).find(
      (c) => c.id === record.church_id || c.church_id === record.church_id,
    );
    if (!church) return record;
    const name = church.church_name || church.public_name || "";
    return normalizeFollowUp({ ...record, church_name: name });
  } catch {
    return record;
  }
}

export async function ensureFollowUpsSeeded(): Promise<void> {
  if (useSupabaseFollowUps() || useApiFollowUps()) return;
  const provider = getDataProvider();
  const listed = await provider.followUps.list();
  if (!listed.ok) return;
  if ((listed.data || []).length > 0) return;
  if (provider.followUps.create) {
    for (const seed of FOLLOW_UPS_SEED) {
      await provider.followUps.create(normalizeFollowUp(seed));
    }
  }
}

export async function listFollowUps(): Promise<DataResult<FollowUp[]>> {
  try {
    if (useSupabaseFollowUps()) {
      const result = await followUpsSb.listFollowUps();
      if (!result.ok) return result;
      const rows = await Promise.all(
        (result.data || []).map(async (row) => attachChurchName(normalizeFollowUp(row))),
      );
      return ok(rows);
    }
    if (useApiFollowUps()) {
      const result = await followUpsApi.listFollowUps();
      if (!result.ok) return result;
      return ok((result.data || []).map((row) => normalizeFollowUp(row)));
    }
    await ensureFollowUpsSeeded();
    const provider = getDataProvider();
    const result = await provider.followUps.list();
    if (!result.ok) return result;
    const rows = await Promise.all(
      (result.data || []).map(async (row) => attachChurchName(normalizeFollowUp(row))),
    );
    return ok(rows);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar acompanhamentos.");
  }
}

export async function getFollowUpById(
  id: EntityId,
): Promise<DataResult<FollowUp | null>> {
  try {
    if (useSupabaseFollowUps()) {
      const result = await followUpsSb.getFollowUpById(id);
      if (!result.ok) return result;
      if (!result.data) return ok(null);
      return ok(await attachChurchName(normalizeFollowUp(result.data)));
    }
    if (useApiFollowUps()) {
      const result = await followUpsApi.getFollowUpById(id);
      if (!result.ok) return result;
      return ok(result.data ? normalizeFollowUp(result.data) : null);
    }
    await ensureFollowUpsSeeded();
    const provider = getDataProvider();
    const result = await provider.followUps.getById(id);
    if (!result.ok) return result;
    if (!result.data) return ok(null);
    return ok(await attachChurchName(normalizeFollowUp(result.data)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter acompanhamento.");
  }
}

export async function createFollowUp(
  payload: Partial<FollowUp>,
): Promise<DataResult<FollowUp>> {
  try {
    if (useSupabaseFollowUps()) {
      let record = normalizeFollowUp(payload);
      record = await attachChurchName(record);
      const result = await followUpsSb.createFollowUp(record);
      if (!result.ok) return result;
      return ok(normalizeFollowUp(result.data));
    }
    if (useApiFollowUps()) {
      const result = await followUpsApi.createFollowUp(payload);
      if (!result.ok) return result;
      return ok(normalizeFollowUp(result.data));
    }
    await ensureFollowUpsSeeded();
    const provider = getDataProvider();
    if (!provider.followUps.create) {
      return fail("Criar acompanhamento não suportado neste data source.", "NOT_SUPPORTED");
    }
    const id = payload.id || `fu-${Date.now()}`;
    const performer =
      payload.actualizado_por || payload.responsible_name || payload.updated_by || "";
    const status = payload.status || payload.estado || "Pending";
    const timeline = [
      ...(Array.isArray(payload.timeline) ? payload.timeline : []),
      makeTimelineEvent(
        id,
        eventTypeFromStatus(status) === "created" ? "created" : eventTypeFromStatus(status),
        "Acompanhamento criado",
        payload.resultado || payload.notas || "Novo registo de acompanhamento.",
        performer,
      ),
    ];
    let record = normalizeFollowUp({
      ...payload,
      id,
      status,
      estado: payload.estado || status,
      timeline,
      created_at: payload.created_at || todayIso(),
      updated_at: todayIso(),
    });
    record = await attachChurchName(record);
    const result = await provider.followUps.create(record);
    if (!result.ok) return result;
    return ok(normalizeFollowUp(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar acompanhamento.");
  }
}

export async function updateFollowUp(
  id: EntityId,
  payload: Partial<FollowUp>,
): Promise<DataResult<FollowUp>> {
  try {
    if (useSupabaseFollowUps()) {
      const result = await followUpsSb.updateFollowUp(id, payload);
      if (!result.ok) return result;
      return ok(normalizeFollowUp(result.data));
    }
    if (useApiFollowUps()) {
      const result = await followUpsApi.updateFollowUp(id, payload);
      if (!result.ok) return result;
      return ok(normalizeFollowUp(result.data));
    }
    const provider = getDataProvider();
    if (!provider.followUps.update) {
      return fail("Actualizar acompanhamento não suportado neste data source.", "NOT_SUPPORTED");
    }
    const existing = await provider.followUps.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Acompanhamento não encontrado.", "NOT_FOUND");

    const prev = normalizeFollowUp(existing.data);
    const nextStatus = payload.status || payload.estado || prev.status;
    const performer =
      payload.actualizado_por || payload.responsible_name || payload.updated_by || "";
    const timeline = [...(prev.timeline || [])];
    if (nextStatus && nextStatus !== prev.status && nextStatus !== prev.estado) {
      timeline.push(
        makeTimelineEvent(
          id,
          eventTypeFromStatus(nextStatus),
          String(nextStatus),
          payload.resultado || payload.notas || `Estado actualizado para ${nextStatus}.`,
          performer,
        ),
      );
    }

    let next = normalizeFollowUp({
      ...prev,
      ...payload,
      id,
      status: nextStatus,
      estado: payload.estado || nextStatus,
      timeline,
      updated_at: todayIso(),
    });
    next = await attachChurchName(next);
    const result = await provider.followUps.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeFollowUp(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar acompanhamento.");
  }
}

export async function deleteFollowUp(id: EntityId): Promise<DataResult<boolean>> {
  try {
    if (useSupabaseFollowUps()) return followUpsSb.deleteFollowUp(id);
    if (useApiFollowUps()) return followUpsApi.deleteFollowUp(id);
    const provider = getDataProvider();
    if (!provider.followUps.remove) {
      return fail("Eliminar acompanhamento não suportado neste data source.", "NOT_SUPPORTED");
    }
    return provider.followUps.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar acompanhamento.");
  }
}

export async function searchFollowUps(query: string): Promise<DataResult<FollowUp[]>> {
  try {
    if (useSupabaseFollowUps()) {
      const result = await followUpsSb.searchFollowUps(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((r) => normalizeFollowUp(r)));
    }
    if (useApiFollowUps()) {
      const result = await followUpsApi.searchFollowUps(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((r) => normalizeFollowUp(r)));
    }
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return listed;
    return ok(
      listed.data.filter((row) =>
        [
          row.full_name,
          row.phone,
          row.telefone,
          row.whatsapp,
          row.email,
          row.church_name,
          row.responsible_name,
          row.actualizado_por,
          row.metodo,
          row.resultado,
          row.status,
          row.estado,
          row.notas,
        ].some((value) => String(value || "").toLowerCase().includes(q)),
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao pesquisar acompanhamentos.");
  }
}

export async function getFollowUpsByChurch(
  churchId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((row) => row.church_id === churchId));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por igreja.");
  }
}

export async function getFollowUpsByCell(
  cellId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((row) => row.cell_id === cellId));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por célula.");
  }
}

export async function getFollowUpsByCellGroup(
  cellGroupId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((row) => row.cell_group_id === cellGroupId));
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao filtrar por grupo de célula.",
    );
  }
}

export async function getFollowUpsByStatus(
  status: string,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const key = statusKey(status);
    return ok(
      listed.data.filter(
        (row) => statusKey(row.status) === key || statusKey(row.estado) === key,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por estado.");
  }
}

export async function getFollowUpsByResponsibleUser(
  userId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const key = String(userId || "").toLowerCase();
    return ok(
      listed.data.filter(
        (row) =>
          row.responsible_user_id === userId ||
          String(row.responsible_name || "").toLowerCase() === key ||
          String(row.actualizado_por || "").toLowerCase() === key,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por responsável.");
  }
}

export async function getFollowUpsByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const start = String(startDate || "").slice(0, 10);
    const end = String(endDate || "").slice(0, 10);
    return ok(
      listed.data.filter((row) => {
        const d = String(
          row.data_do_contacto || row.follow_up_date || row.created_at || "",
        ).slice(0, 10);
        if (!d) return false;
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      }),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por datas.");
  }
}

export async function getPendingFollowUps(): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter((row) => {
        const key = statusKey(row.status || row.estado);
        return key === "pending" || key === "noanswer" || key === "noresponse";
      }),
    );
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao listar acompanhamentos pendentes.",
    );
  }
}

export async function getOverdueFollowUps(): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const today = todayIso();
    return ok(
      listed.data.filter((row) => {
        const key = statusKey(row.status || row.estado);
        if (key === "closed" || key === "becamemember") return false;
        const next = String(
          row.proxima_data_de_contacto || row.next_follow_up_date || "",
        ).slice(0, 10);
        return !!next && next < today;
      }),
    );
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao listar acompanhamentos atrasados.",
    );
  }
}

export async function getTodayFollowUps(): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const today = todayIso();
    return ok(
      listed.data.filter((row) => {
        const contact = String(row.data_do_contacto || row.follow_up_date || "").slice(0, 10);
        const next = String(
          row.proxima_data_de_contacto || row.next_follow_up_date || "",
        ).slice(0, 10);
        return contact === today || next === today;
      }),
    );
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao listar acompanhamentos de hoje.",
    );
  }
}

export async function getFollowUpsByFirstTimer(
  firstTimerId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  try {
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter(
        (row) =>
          row.first_timer_id === firstTimerId || row.firstTimerId === firstTimerId,
      ),
    );
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao listar acompanhamentos do visitante.",
    );
  }
}

/**
 * Create a follow-up case from a First Timer (copies fields + updates FT status).
 */
export async function createFollowUpFromFirstTimer(
  firstTimerId: EntityId,
  payload: Partial<FollowUp> = {},
): Promise<DataResult<FollowUp>> {
  try {
    let personData: Record<string, unknown> = {};
    try {
      const ft = await getFirstTimerById(firstTimerId);
      if (ft.ok && ft.data) {
        const p = ft.data;
        personData = {
          first_timer_id: p.id,
          person_type: "First Timer",
          full_name:
            p.full_name ||
            [p.tratamento, p.nome, p.apelido].filter(Boolean).join(" ").trim(),
          phone: p.telefone || p.phone || "",
          whatsapp: p.whatsapp || p.telefone || "",
          email: p.email || "",
          church_id: p.church_id || p.churchId || null,
          church_name: p.church_name || p.igreja || null,
          cell_group_id: p.cell_group_id || null,
          cell_group_name: p.cell_group_name || null,
          cell_id: p.cell_id || null,
          cell_name: p.cell_name || p.celula || p.celula_preferida || null,
          wants_foundation_school: p.quer_escola_de_fundacao || p.wants_foundation_school,
          wants_counseling: p.quer_aconselhamento || p.wants_counseling,
          interested_in_cell: p.interesse_em_celula || p.interested_in_cell,
          responsible_name: p.conselheiro_responsavel || payload.responsible_name,
        };

        // Soft-update first timer follow-up status when possible
        const nextStatus = payload.status || payload.estado || "Pending";
        await updateFirstTimer(firstTimerId, {
          estado_do_seguimento: String(nextStatus),
          follow_up_status: String(nextStatus),
          next_follow_up_date:
            payload.proxima_data_de_contacto ||
            payload.next_follow_up_date ||
            p.next_follow_up_date,
        }).catch((error) => {
          console.warn("[CE FollowUps] first timer status update skipped", error);
        });
      }
    } catch (error) {
      console.warn("[CE FollowUps] firstTimersRepository unavailable for createFrom", error);
      personData = { first_timer_id: firstTimerId, person_type: "First Timer" };
    }

    return createFollowUp({
      ...personData,
      ...payload,
      first_timer_id: firstTimerId,
    });
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Falha ao criar acompanhamento a partir de Primeira Vez.",
    );
  }
}

/**
 * Prepare member conversion when status becomes "Became Member".
 * Avoids duplicates by phone/email when possible. Not auto-run by UI unless called.
 */
export async function markFollowUpBecameMember(
  followUpId: EntityId,
  overrides: Partial<Member> = {},
): Promise<DataResult<{ followUp: FollowUp; member: Member | null }>> {
  try {
    const existing = await getFollowUpById(followUpId);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Acompanhamento não encontrado.", "NOT_FOUND");

    const row = existing.data;
    let member: Member | null = null;

    if (row.member_id) {
      const members = await listMembers();
      if (members.ok) {
        member = members.data.find((m) => m.id === row.member_id) || null;
      }
    }

    if (!member) {
      const members = await listMembers();
      if (members.ok) {
        const phone = String(row.phone || row.telefone || "").replace(/\D/g, "");
        const email = String(row.email || "").toLowerCase();
        member =
          members.data.find((m) => {
            const mPhone = String(m.telefone || m.phone || "").replace(/\D/g, "");
            const mEmail = String(m.email || "").toLowerCase();
            return (phone && mPhone === phone) || (email && mEmail === email);
          }) || null;
      }
    }

    if (!member) {
      const nameParts = String(row.full_name || "")
        .trim()
        .split(/\s+/);
      const created = await createMember({
        nome: nameParts[0] || "Membro",
        apelido: nameParts.slice(1).join(" ") || "",
        telefone: row.phone || row.telefone || "",
        whatsapp: row.whatsapp || "",
        email: row.email || "",
        church_id: row.church_id || null,
        church_name: row.church_name || null,
        celula: row.celula || row.cell_name || "",
        estado: "Active",
        origem: "Primeira Vez",
        source: "First Timer",
        data_de_entrada: todayIso(),
        ...overrides,
      });
      if (created.ok) member = created.data;
    }

    const updated = await updateFollowUp(followUpId, {
      status: "Became Member",
      estado: "Became Member",
      became_member: true,
      member_id: member?.id || row.member_id || null,
      resultado: row.resultado || "Tornou-se Membro",
    });
    if (!updated.ok) return fail(updated.error, updated.code);

    if (row.first_timer_id) {
      await updateFirstTimer(row.first_timer_id, {
        estado_do_seguimento: "Became Member",
        converted_to_member: true,
        member_id: member?.id || null,
      }).catch((error) => {
        console.warn("[CE FollowUps] first timer become-member update skipped", error);
      });
    }

    return ok({ followUp: updated.data, member });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao marcar tornou-se membro.",
    );
  }
}

export function getFollowUpsDataSourceInfo() {
  const provider = getDataProvider();
  const sb = useSupabaseFollowUps();
  const api = useApiFollowUps();
  return {
    source: getDataSource(),
    provider: sb
      ? "supabase-follow-ups-adapter"
      : api
        ? "api-follow-ups-adapter"
        : provider.name,
    ready: sb ? getSupabaseEnvConfig().isConfigured : api ? false : provider.isReady(),
    description: sb
      ? "Follow-Up pilot via Supabase public.follow_ups"
      : api
        ? "Follow-Up API placeholder"
        : provider.description,
    pilot: sb ? "first-timers-followups-supabase-v1" : undefined,
  };
}
