/**
 * First Timers Supabase adapter — Backend Phase 4 pilot.
 * Maps public.first_timers ↔ dashboard FirstTimer shape (PT + EN).
 * Never auto-creates members. Anon key only.
 */
import type { EntityId, FirstTimer } from "../../types/entities";
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

const TABLE = "first_timers";

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function fail<T>(error: string, code?: string): DataResult<T> {
  return { ok: false, error, code };
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

export function mapFirstTimerFromRow(row: SupabaseRow | null | undefined): FirstTimer | null {
  if (!row) return null;
  const id = String(row.id || "");
  const fullName = String(row.full_name || "Primeira Vez");
  const first = String(row.first_name || "");
  const last = String(row.last_name || "");
  const title = String(row.title || "");
  const phone = String(row.phone || "");
  const churchId = row.church_id != null ? String(row.church_id) : null;
  const followUp = String(row.follow_up_status || "Pending");
  const born = asBool(row.born_again);
  const foundation = asBool(row.foundation_interest);
  const counseling = asBool(row.counseling_interest);
  const cellInterest = asBool(row.cell_interest);
  const converted = asBool(row.converted_to_member);
  const visitDate = (row.visit_date as string) || null;
  const serviceName = String(row.service_name || "");
  const invited = String(row.invited_by || "");
  const status = String(row.status || "Active");

  return {
    id,
    full_name: fullName,
    fullName,
    first_name: first,
    last_name: last,
    nome: first,
    apelido: last,
    title,
    tratamento: title,
    gender: (row.gender as string) || null,
    genero: (row.gender as string) || null,
    date_of_birth: (row.date_of_birth as string) || null,
    data_de_nascimento: (row.date_of_birth as string) || null,
    phone,
    telefone: phone,
    whatsapp: String(row.whatsapp || phone || ""),
    email: String(row.email || ""),
    address: String(row.address || ""),
    endereco: String(row.address || ""),
    church_id: churchId,
    churchId,
    church_name: (row.church_name as string) || null,
    igreja: (row.church_name as string) || null,
    cell_group_id: row.cell_group_id != null ? String(row.cell_group_id) : null,
    cell_group_name: (row.cell_group_name as string) || null,
    cell_id: row.cell_id != null ? String(row.cell_id) : null,
    cell_name: (row.cell_name as string) || null,
    celula: (row.cell_name as string) || "",
    visit_date: visitDate,
    data_do_culto: visitDate,
    serviceDate: visitDate,
    service_name: serviceName,
    culto: serviceName,
    invited_by: invited,
    convidado_por: invited,
    born_again: born,
    nasceu_de_novo: born,
    bornAgain: born,
    foundation_interest: foundation,
    quer_escola_de_fundacao: foundation,
    wants_foundation_school: foundation,
    wantsFoundationSchool: foundation,
    counseling_interest: counseling,
    quer_aconselhamento: counseling,
    wants_counseling: counseling,
    wantsCounseling: counseling,
    cell_interest: cellInterest,
    interesse_em_celula: cellInterest,
    interested_in_cell: cellInterest,
    wantsCell: cellInterest,
    follow_up_status: followUp,
    estado_do_seguimento: followUp,
    followUpStatus: followUp,
    assigned_to_user_id: row.assigned_to_user_id != null ? String(row.assigned_to_user_id) : null,
    follow_up_responsible_id: row.assigned_to_user_id != null ? String(row.assigned_to_user_id) : null,
    conselheiro_responsavel_id:
      row.assigned_to_user_id != null ? String(row.assigned_to_user_id) : null,
    assigned_to_name: (row.assigned_to_name as string) || "",
    follow_up_responsible_name: (row.assigned_to_name as string) || "",
    conselheiro_responsavel: (row.assigned_to_name as string) || "",
    converted_to_member: converted,
    convertida_em_membro: converted,
    member_id: row.member_id != null ? String(row.member_id) : null,
    status,
    notes: (row.notes as string) || "",
    notas: (row.notes as string) || "",
    created_at: (row.created_at as string) || undefined,
    updated_at: (row.updated_at as string) || undefined,
  } as FirstTimer;
}

export function mapFirstTimerToRow(
  person: Partial<FirstTimer>,
  forUpdate = false,
): SupabaseRow {
  const first = person.first_name ?? person.nome ?? "";
  const last = person.last_name ?? person.apelido ?? "";
  const title = person.title ?? person.tratamento ?? "";
  const fullFromParts = [title, first, last].filter(Boolean).join(" ").trim();
  const fullName = person.full_name || person.fullName || fullFromParts || "Primeira Vez";
  const phone = person.phone ?? person.telefone ?? "";
  const churchId = person.church_id ?? person.churchId ?? null;
  const followUp =
    person.follow_up_status ?? person.estado_do_seguimento ?? person.followUpStatus ?? "Pending";

  const row: SupabaseRow = {
    full_name: fullName,
    first_name: first || null,
    last_name: last || null,
    title: title || null,
    gender: person.gender ?? person.genero ?? null,
    date_of_birth: person.date_of_birth ?? person.data_de_nascimento ?? null,
    phone: phone || null,
    whatsapp: person.whatsapp || phone || null,
    email: person.email || null,
    address: person.address ?? person.endereco ?? null,
    church_id: churchId && isValidUuid(String(churchId)) ? String(churchId) : null,
    church_name: person.church_name ?? person.igreja ?? null,
    cell_group_id: person.cell_group_id != null ? String(person.cell_group_id) : null,
    cell_group_name: person.cell_group_name ?? null,
    cell_id: person.cell_id != null ? String(person.cell_id) : null,
    cell_name: person.cell_name ?? person.celula ?? person.celula_preferida ?? null,
    visit_date: person.visit_date ?? person.data_do_culto ?? person.serviceDate ?? null,
    service_name: person.service_name ?? person.culto ?? person.serviceName ?? null,
    invited_by: person.invited_by ?? person.convidado_por ?? person.invitedBy ?? null,
    born_again: asBool(person.born_again ?? person.nasceu_de_novo ?? person.bornAgain),
    foundation_interest: asBool(
      person.foundation_interest ??
        person.quer_escola_de_fundacao ??
        person.wants_foundation_school ??
        person.wantsFoundationSchool,
    ),
    counseling_interest: asBool(
      person.counseling_interest ?? person.quer_aconselhamento ?? person.wants_counseling,
    ),
    cell_interest: asBool(
      person.cell_interest ?? person.interesse_em_celula ?? person.interested_in_cell,
    ),
    follow_up_status: String(followUp),
    assigned_to_user_id:
      person.follow_up_responsible_id && isValidUuid(String(person.follow_up_responsible_id))
        ? String(person.follow_up_responsible_id)
        : person.conselheiro_responsavel_id && isValidUuid(String(person.conselheiro_responsavel_id))
          ? String(person.conselheiro_responsavel_id)
          : null,
    assigned_to_name:
      person.follow_up_responsible_name || person.conselheiro_responsavel || null,
    converted_to_member: asBool(person.converted_to_member ?? person.convertida_em_membro),
    member_id:
      person.member_id && isValidUuid(String(person.member_id)) ? String(person.member_id) : null,
    status: person.status || "Active",
    notes: person.notes ?? person.notas ?? null,
    metadata: {},
  };
  if (!forUpdate) {
    const id = person.id;
    row.id = id && isValidUuid(id) ? id : newClientUuid();
  }
  return row;
}

export async function listFirstTimers(): Promise<DataResult<FirstTimer[]>> {
  const res = await listRows(TABLE, { orderBy: "visit_date", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimerById(id: EntityId): Promise<DataResult<FirstTimer | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapFirstTimerFromRow(res.data));
}

export async function createFirstTimer(
  payload: Partial<FirstTimer>,
): Promise<DataResult<FirstTimer>> {
  const row = mapFirstTimerToRow(payload, false);
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapFirstTimerFromRow(res.data);
  if (!mapped) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updateFirstTimer(
  id: EntityId,
  payload: Partial<FirstTimer>,
): Promise<DataResult<FirstTimer>> {
  const row = mapFirstTimerToRow({ ...payload, id: String(id) }, true);
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapFirstTimerFromRow(res.data);
  if (!mapped) return fail("Resposta inválida do Supabase.", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function deleteFirstTimer(id: EntityId): Promise<DataResult<boolean>> {
  const res = await deleteRow(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(true);
}

export async function searchFirstTimers(query: string): Promise<DataResult<FirstTimer[]>> {
  const res = await searchRows(
    TABLE,
    ["full_name", "first_name", "last_name", "phone", "email", "church_name", "invited_by"],
    query,
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersByChurch(churchId: EntityId): Promise<DataResult<FirstTimer[]>> {
  const res = await filterRows(TABLE, { church_id: String(churchId) });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersByStatus(status: string): Promise<DataResult<FirstTimer[]>> {
  const listed = await listFirstTimers();
  if (!listed.ok) return listed;
  const key = statusKey(status);
  return ok(
    listed.data.filter((p) => statusKey(p.follow_up_status || p.estado_do_seguimento) === key),
  );
}

export async function getFirstTimersByVisitDate(date: string): Promise<DataResult<FirstTimer[]>> {
  const d = String(date || "").slice(0, 10);
  const res = await filterRows(TABLE, { visit_date: d });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FirstTimer[]>> {
  const res = await dateRangeRows(
    TABLE,
    "visit_date",
    String(startDate || "").slice(0, 10),
    String(endDate || "").slice(0, 10),
  );
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersWithFoundationInterest(): Promise<DataResult<FirstTimer[]>> {
  const res = await filterRows(TABLE, { foundation_interest: true });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersBornAgain(): Promise<DataResult<FirstTimer[]>> {
  const res = await filterRows(TABLE, { born_again: true });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

export async function getFirstTimersPendingFollowUp(): Promise<DataResult<FirstTimer[]>> {
  const listed = await listFirstTimers();
  if (!listed.ok) return listed;
  return ok(
    listed.data.filter((p) => {
      const key = statusKey(p.follow_up_status || p.estado_do_seguimento);
      return key === "pending" || key === "noanswer" || key === "interested";
    }),
  );
}

export async function getFirstTimersConvertedToMembers(): Promise<DataResult<FirstTimer[]>> {
  const res = await filterRows(TABLE, { converted_to_member: true });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapFirstTimerFromRow(r)!).filter(Boolean));
}

/**
 * Safe conversion marker only.
 * - If payload.member_id is a valid uuid → link and mark converted (no create).
 * - Does NOT auto-create a member row here (explicit action stays in repository via createMember).
 */
export async function convertFirstTimerToMember(
  firstTimerId: EntityId,
  payload: { member_id?: string } = {},
): Promise<DataResult<FirstTimer>> {
  const memberId = payload.member_id ? String(payload.member_id) : "";
  if (!memberId || !isValidUuid(memberId)) {
    return fail(
      "Conversão segura requer member_id existente. Não se cria membro automaticamente neste adapter.",
      "MEMBER_ID_REQUIRED",
    );
  }
  return updateFirstTimer(firstTimerId, {
    converted_to_member: true,
    convertida_em_membro: true,
    member_id: memberId,
    follow_up_status: "Became Member",
    estado_do_seguimento: "Became Member",
    status: "Converted to Member",
  });
}
