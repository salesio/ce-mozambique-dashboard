/**
 * Follow-Ups Supabase adapter — Backend Phase 4 pilot.
 * Maps public.follow_ups + follow_up_timeline_events ↔ dashboard FollowUp shape.
 * Anon key only. Soft-updates first_timers.follow_up_status when linked.
 */
import type {
  EntityId,
  FollowUp,
  FollowUpTimelineEvent,
} from "../../types/entities";
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
import * as firstTimersSb from "./firstTimersSupabaseAdapter";

const TABLE = "follow_ups";
const TIMELINE = "follow_up_timeline_events";

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function fail<T>(error: string, code?: string): DataResult<T> {
  return { ok: false, error, code };
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

export function mapTimelineFromRow(
  row: SupabaseRow | null | undefined,
): FollowUpTimelineEvent | null {
  if (!row) return null;
  return {
    id: String(row.id || ""),
    follow_up_id: row.follow_up_id != null ? String(row.follow_up_id) : null,
    event_type: String(row.event_type || "updated"),
    title: String(row.title || row.event_type || "Event"),
    description: (row.description as string) || null,
    performed_by_user_id:
      row.performed_by_user_id != null ? String(row.performed_by_user_id) : null,
    performed_by_name: (row.performed_by_name as string) || null,
    performed_at: (row.event_date as string) || (row.created_at as string) || null,
    metadata: (row.metadata as Record<string, unknown>) || {
      contact_method: row.contact_method,
      contact_result: row.contact_result,
      old_status: row.old_status,
      new_status: row.new_status,
      first_timer_id: row.first_timer_id,
      member_id: row.member_id,
    },
  };
}

export function mapFollowUpFromRow(
  row: SupabaseRow | null | undefined,
  timeline: FollowUpTimelineEvent[] = [],
): FollowUp | null {
  if (!row) return null;
  const id = String(row.id || "");
  const status = String(row.status || "Pending");
  const personName = String(row.person_name || "");
  const phone = String(row.phone || "");
  const lastContact = (row.last_contact_date as string) || null;
  const nextContact = (row.next_contact_date as string) || null;
  const method = String(row.last_contact_method || "");
  const result = String(row.last_contact_result || "");
  const responsible = String(row.responsible_name || "");

  return {
    id,
    first_timer_id: row.first_timer_id != null ? String(row.first_timer_id) : null,
    firstTimerId: row.first_timer_id != null ? String(row.first_timer_id) : null,
    member_id: row.member_id != null ? String(row.member_id) : null,
    person_type: (row.person_type as string) || "First Timer",
    full_name: personName,
    fullName: personName,
    phone,
    telefone: phone,
    whatsapp: String(row.whatsapp || phone || ""),
    email: String(row.email || ""),
    church_id: row.church_id != null ? String(row.church_id) : null,
    church_name: (row.church_name as string) || null,
    cell_group_id: row.cell_group_id != null ? String(row.cell_group_id) : null,
    cell_group_name: (row.cell_group_name as string) || null,
    cell_id: row.cell_id != null ? String(row.cell_id) : null,
    cell_name: (row.cell_name as string) || null,
    celula: (row.cell_name as string) || "",
    source: (row.source as string) || null,
    category: (row.category as string) || null,
    status,
    estado: status,
    priority: (row.priority as string) || "Normal",
    responsible_user_id:
      row.responsible_user_id != null ? String(row.responsible_user_id) : null,
    responsible_name: responsible,
    actualizado_por: responsible,
    data_do_contacto: lastContact,
    follow_up_date: lastContact,
    proxima_data_de_contacto: nextContact,
    next_follow_up_date: nextContact,
    metodo: method,
    contact_method: method,
    resultado: result,
    result,
    notes: (row.notes as string) || "",
    notas: (row.notes as string) || "",
    became_member: statusKey(status) === "becamemember",
    timeline,
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
  };
}

export function mapFollowUpToRow(fu: Partial<FollowUp>, forUpdate = false): SupabaseRow {
  const personName =
    fu.full_name || fu.fullName || (fu as { person_name?: string }).person_name || "Contacto";
  const phone = fu.phone || fu.telefone || "";
  const status = fu.status || fu.estado || "Pending";
  const lastContact = fu.data_do_contacto || fu.follow_up_date || todayIso();
  const nextContact = fu.proxima_data_de_contacto || fu.next_follow_up_date || null;
  const method = fu.metodo || fu.contact_method || null;
  const result = fu.resultado || fu.result || null;
  const churchId = fu.church_id || null;
  const ftId = fu.first_timer_id || fu.firstTimerId || null;
  const memberId = fu.member_id || null;

  const row: SupabaseRow = {
    first_timer_id: ftId && isValidUuid(String(ftId)) ? String(ftId) : null,
    member_id: memberId && isValidUuid(String(memberId)) ? String(memberId) : null,
    person_type: fu.person_type || (ftId ? "First Timer" : "Other"),
    person_id: null,
    person_name: personName,
    phone: phone || null,
    whatsapp: fu.whatsapp || phone || null,
    email: fu.email || null,
    church_id: churchId && isValidUuid(String(churchId)) ? String(churchId) : null,
    church_name: fu.church_name || null,
    cell_group_id: fu.cell_group_id != null ? String(fu.cell_group_id) : null,
    cell_group_name: fu.cell_group_name || null,
    cell_id: fu.cell_id != null ? String(fu.cell_id) : null,
    cell_name: fu.cell_name || fu.celula || null,
    source: (fu as { source?: string }).source || "Manual",
    category: (fu as { category?: string }).category || null,
    status: String(status),
    priority: fu.priority || "Normal",
    responsible_user_id:
      fu.responsible_user_id && isValidUuid(String(fu.responsible_user_id))
        ? String(fu.responsible_user_id)
        : null,
    responsible_name: fu.responsible_name || fu.actualizado_por || fu.updated_by || null,
    next_contact_date: nextContact,
    last_contact_date: lastContact,
    last_contact_method: method,
    last_contact_result: result,
    notes: fu.notes || fu.notas || null,
    metadata: {},
  };
  if (!forUpdate) {
    const id = fu.id;
    row.id = id && isValidUuid(id) ? id : newClientUuid();
  }
  return row;
}

export async function listFollowUpTimelineEvents(
  followUpId: EntityId,
): Promise<DataResult<FollowUpTimelineEvent[]>> {
  const res = await filterRows(TIMELINE, { follow_up_id: String(followUpId) });
  if (!res.ok) return fail(res.error, res.code);
  const rows = (res.data || [])
    .map((r) => mapTimelineFromRow(r)!)
    .filter(Boolean)
    .sort((a, b) => String(a.performed_at || "").localeCompare(String(b.performed_at || "")));
  return ok(rows);
}

export async function createFollowUpTimelineEvent(
  payload: Partial<FollowUpTimelineEvent> & {
    follow_up_id: string;
    first_timer_id?: string | null;
    member_id?: string | null;
    contact_method?: string | null;
    contact_result?: string | null;
    old_status?: string | null;
    new_status?: string | null;
  },
): Promise<DataResult<FollowUpTimelineEvent>> {
  const followUpId = String(payload.follow_up_id || "");
  if (!followUpId || !isValidUuid(followUpId)) {
    return fail("follow_up_id uuid obrigatório", "VALIDATION");
  }
  const row: SupabaseRow = {
    id: payload.id && isValidUuid(payload.id) ? payload.id : newClientUuid(),
    follow_up_id: followUpId,
    first_timer_id:
      payload.first_timer_id && isValidUuid(String(payload.first_timer_id))
        ? String(payload.first_timer_id)
        : null,
    member_id:
      payload.member_id && isValidUuid(String(payload.member_id))
        ? String(payload.member_id)
        : null,
    event_type: payload.event_type || "updated",
    title: payload.title || payload.event_type || "Event",
    description: payload.description || null,
    contact_method: payload.contact_method || null,
    contact_result: payload.contact_result || null,
    old_status: payload.old_status || null,
    new_status: payload.new_status || null,
    performed_by_user_id:
      payload.performed_by_user_id && isValidUuid(String(payload.performed_by_user_id))
        ? String(payload.performed_by_user_id)
        : null,
    performed_by_name: payload.performed_by_name || null,
    event_date: payload.performed_at || new Date().toISOString(),
    metadata: payload.metadata || {},
  };
  const res = await createRow(TIMELINE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapTimelineFromRow(res.data);
  if (!mapped) return fail("Timeline response invalid", "SUPABASE_ERROR");
  return ok(mapped);
}

async function attachTimeline(fu: FollowUp): Promise<FollowUp> {
  const tl = await listFollowUpTimelineEvents(fu.id);
  if (tl.ok) return { ...fu, timeline: tl.data };
  return fu;
}

export async function listFollowUps(): Promise<DataResult<FollowUp[]>> {
  const res = await listRows(TABLE, { orderBy: "updated_at", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  const base = (res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean);
  const withTl = await Promise.all(base.map((f) => attachTimeline(f)));
  return ok(withTl);
}

export async function getFollowUpById(id: EntityId): Promise<DataResult<FollowUp | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  if (!res.data) return ok(null);
  const fu = mapFollowUpFromRow(res.data);
  if (!fu) return ok(null);
  return ok(await attachTimeline(fu));
}

export async function createFollowUp(payload: Partial<FollowUp>): Promise<DataResult<FollowUp>> {
  const row = mapFollowUpToRow(payload, false);
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const fu = mapFollowUpFromRow(res.data);
  if (!fu) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");

  const performer = payload.actualizado_por || payload.responsible_name || "";
  await createFollowUpTimelineEvent({
    follow_up_id: fu.id,
    first_timer_id: fu.first_timer_id,
    member_id: fu.member_id,
    event_type: "created",
    title: "Acompanhamento criado",
    description: payload.resultado || payload.notas || "Novo registo de acompanhamento.",
    performed_by_name: performer || null,
    new_status: fu.status,
    contact_method: fu.contact_method,
    contact_result: fu.resultado,
  });

  if (fu.first_timer_id) {
    await firstTimersSb
      .updateFirstTimer(fu.first_timer_id, {
        follow_up_status: fu.status,
        estado_do_seguimento: fu.status,
        next_follow_up_date: fu.next_follow_up_date,
      })
      .catch(() => null);
  }

  return ok(await attachTimeline(fu));
}

export async function updateFollowUp(
  id: EntityId,
  payload: Partial<FollowUp>,
): Promise<DataResult<FollowUp>> {
  const existing = await getFollowUpById(id);
  if (!existing.ok) return fail(existing.error, existing.code);
  if (!existing.data) return fail("Acompanhamento não encontrado.", "NOT_FOUND");

  const prev = existing.data;
  const nextStatus = payload.status || payload.estado || prev.status;
  const row = mapFollowUpToRow({ ...prev, ...payload, id: String(id), status: nextStatus }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const fu = mapFollowUpFromRow(res.data);
  if (!fu) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");

  if (nextStatus && nextStatus !== prev.status && nextStatus !== prev.estado) {
    await createFollowUpTimelineEvent({
      follow_up_id: String(id),
      first_timer_id: fu.first_timer_id,
      member_id: fu.member_id,
      event_type: eventTypeFromStatus(nextStatus),
      title: String(nextStatus),
      description:
        payload.resultado || payload.notas || `Estado actualizado para ${nextStatus}.`,
      performed_by_name:
        payload.actualizado_por || payload.responsible_name || prev.responsible_name || null,
      old_status: prev.status || prev.estado || null,
      new_status: String(nextStatus),
      contact_method: payload.metodo || payload.contact_method || fu.contact_method,
      contact_result: payload.resultado || payload.result || fu.resultado,
    });
  }

  if (fu.first_timer_id) {
    await firstTimersSb
      .updateFirstTimer(fu.first_timer_id, {
        follow_up_status: String(nextStatus),
        estado_do_seguimento: String(nextStatus),
        next_follow_up_date: fu.next_follow_up_date,
        converted_to_member: statusKey(nextStatus) === "becamemember" ? true : undefined,
        member_id: fu.member_id || undefined,
      })
      .catch(() => null);
  }

  return ok(await attachTimeline(fu));
}

export async function deleteFollowUp(id: EntityId): Promise<DataResult<boolean>> {
  const res = await deleteRow(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(true);
}

export async function searchFollowUps(query: string): Promise<DataResult<FollowUp[]>> {
  const res = await searchRows(
    TABLE,
    ["person_name", "phone", "email", "church_name", "responsible_name", "status", "notes"],
    query,
  );
  if (!res.ok) return fail(res.error, res.code);
  const base = (res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean);
  return ok(base);
}

export async function getFollowUpsByChurch(churchId: EntityId): Promise<DataResult<FollowUp[]>> {
  const res = await filterRows(TABLE, { church_id: String(churchId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
}

export async function getFollowUpsByStatus(status: string): Promise<DataResult<FollowUp[]>> {
  const res = await filterRows(TABLE, { status: String(status) });
  if (!res.ok) {
    // fallback client filter for fuzzy status labels
    const listed = await listFollowUps();
    if (!listed.ok) return listed;
    const key = statusKey(status);
    return ok(
      listed.data.filter(
        (row) => statusKey(row.status) === key || statusKey(row.estado) === key,
      ),
    );
  }
  return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
}

export async function getFollowUpsByResponsible(userId: EntityId): Promise<DataResult<FollowUp[]>> {
  if (isValidUuid(String(userId))) {
    const res = await filterRows(TABLE, { responsible_user_id: String(userId) });
    if (res.ok) {
      return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
    }
  }
  const listed = await listFollowUps();
  if (!listed.ok) return listed;
  const key = String(userId || "").toLowerCase();
  return ok(
    listed.data.filter(
      (row) =>
        row.responsible_user_id === userId ||
        String(row.responsible_name || "").toLowerCase() === key,
    ),
  );
}

export async function getFollowUpsByFirstTimer(
  firstTimerId: EntityId,
): Promise<DataResult<FollowUp[]>> {
  const res = await filterRows(TABLE, { first_timer_id: String(firstTimerId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
}

export async function getFollowUpsByMember(memberId: EntityId): Promise<DataResult<FollowUp[]>> {
  const res = await filterRows(TABLE, { member_id: String(memberId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
}

export async function getPendingFollowUps(): Promise<DataResult<FollowUp[]>> {
  const listed = await listFollowUps();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((row) => {
      const key = statusKey(row.status || row.estado);
      return key === "pending" || key === "noanswer" || key === "noresponse";
    }),
  );
}

export async function getOverdueFollowUps(): Promise<DataResult<FollowUp[]>> {
  const listed = await listFollowUps();
  if (!listed.ok) return listed;
  const today = todayIso();
  return ok(
    listed.data.filter((row) => {
      const key = statusKey(row.status || row.estado);
      if (key === "closed" || key === "becamemember") return false;
      const next = String(row.proxima_data_de_contacto || row.next_follow_up_date || "").slice(
        0,
        10,
      );
      return !!next && next < today;
    }),
  );
}

export async function getTodayFollowUps(): Promise<DataResult<FollowUp[]>> {
  const listed = await listFollowUps();
  if (!listed.ok) return listed;
  const today = todayIso();
  return ok(
    listed.data.filter((row) => {
      const contact = String(row.data_do_contacto || row.follow_up_date || "").slice(0, 10);
      const next = String(row.proxima_data_de_contacto || row.next_follow_up_date || "").slice(
        0,
        10,
      );
      return contact === today || next === today;
    }),
  );
}

export async function getFollowUpsByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FollowUp[]>> {
  const res = await dateRangeRows(
    TABLE,
    "last_contact_date",
    String(startDate || "").slice(0, 10),
    String(endDate || "").slice(0, 10),
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFollowUpFromRow(r)!).filter(Boolean));
}

export async function createFromFirstTimer(
  firstTimerId: EntityId,
  payload: Partial<FollowUp> = {},
): Promise<DataResult<FollowUp>> {
  const ft = await firstTimersSb.getFirstTimerById(firstTimerId);
  if (!ft.ok) return fail(ft.error, ft.code);
  if (!ft.data) return fail("First timer not found", "NOT_FOUND");
  const p = ft.data;
  return createFollowUp({
    person_type: "First Timer",
    full_name:
      p.full_name ||
      [p.tratamento, p.nome, p.apelido].filter(Boolean).join(" ").trim() ||
      "Primeira Vez",
    phone: p.telefone || p.phone || "",
    whatsapp: p.whatsapp || p.telefone || "",
    email: p.email || "",
    church_id: p.church_id || p.churchId || null,
    church_name: p.church_name || p.igreja || null,
    cell_group_id: p.cell_group_id || null,
    cell_group_name: p.cell_group_name || null,
    cell_id: p.cell_id || null,
    cell_name: p.cell_name || p.celula || null,
    responsible_name: p.conselheiro_responsavel || payload.responsible_name,
    source: "First Timer",
    ...payload,
    first_timer_id: firstTimerId,
  });
}

/**
 * Mark became member without auto-creating member unless member_id provided.
 */
export async function markBecameMember(
  followUpId: EntityId,
  payload: { member_id?: string } = {},
): Promise<DataResult<FollowUp>> {
  const memberId = payload.member_id && isValidUuid(payload.member_id) ? payload.member_id : null;
  return updateFollowUp(followUpId, {
    status: "Became Member",
    estado: "Became Member",
    became_member: true,
    member_id: memberId || undefined,
    resultado: "Tornou-se Membro",
  });
}

export async function getTimelineByFirstTimer(
  firstTimerId: EntityId,
): Promise<DataResult<FollowUpTimelineEvent[]>> {
  const res = await filterRows(TIMELINE, { first_timer_id: String(firstTimerId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapTimelineFromRow(r)!).filter(Boolean));
}

export async function getTimelineByMember(
  memberId: EntityId,
): Promise<DataResult<FollowUpTimelineEvent[]>> {
  const res = await filterRows(TIMELINE, { member_id: String(memberId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapTimelineFromRow(r)!).filter(Boolean));
}
