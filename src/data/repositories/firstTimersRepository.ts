import { getDataProvider } from "../dataProvider";
import { getDataSource, getBackendFeatureFlags } from "../config";
import type { EntityId, FirstTimer, Member } from "../types/entities";
import type { DataResult } from "../types/repository";
import { FIRST_TIMERS_SEED } from "../seeds/firstTimersSeed";
import { listChurches } from "./churchesRepository";
import { createMember } from "./membersRepository";
import { getSupabaseEnvConfig } from "../adapters/supabase/supabaseConfig";
import * as firstTimersSb from "../adapters/supabase/firstTimersSupabaseAdapter";
import * as firstTimersApi from "../adapters/api/firstTimersApiAdapter";

function fail<T>(error: string, code = "FIRST_TIMERS_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}

/** Phase 4: route to Supabase adapter when flags + source allow. */
function useSupabaseFirstTimers(): boolean {
  if (getDataSource() !== "supabase") return false;
  const cfg = getSupabaseEnvConfig();
  const flags = getBackendFeatureFlags();
  return flags.enableSupabase && cfg.isConfigured;
}

function useApiFirstTimers(): boolean {
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

/**
 * Normalize to dashboard-compatible PT fields + English aliases.
 */
export function normalizeFirstTimer(
  input: Partial<FirstTimer> & { id?: string },
): FirstTimer {
  const id = input.id || `ft-${Date.now()}`;
  const nome = input.nome ?? input.first_name ?? "";
  const apelido = input.apelido ?? input.last_name ?? "";
  const tratamento = input.tratamento ?? input.title ?? "";
  const telefone = input.telefone ?? input.phone ?? "";
  const churchId = input.church_id ?? input.churchId ?? null;
  const fullFromParts = [tratamento, nome, apelido].filter(Boolean).join(" ").trim();
  const fullName =
    input.full_name || input.fullName || fullFromParts || "Primeira Vez";
  const followUp =
    input.estado_do_seguimento ??
    input.follow_up_status ??
    input.followUpStatus ??
    "Pending";
  const status =
    input.status ??
    (statusKey(followUp) === "becamemember"
      ? "Converted to Member"
      : statusKey(followUp) === "pending"
        ? "Pending Follow-Up"
        : followUp);
  const nasceu = asBool(
    input.nasceu_de_novo ?? input.born_again ?? input.bornAgain,
  );
  const querFundacao = asBool(
    input.quer_escola_de_fundacao ??
      input.wants_foundation_school ??
      input.wantsFoundationSchool,
  );
  const querAconselhamento = asBool(
    input.quer_aconselhamento ?? input.wants_counseling ?? input.wantsCounseling,
  );
  const interesseCelula = asBool(
    input.interesse_em_celula ?? input.interested_in_cell ?? input.wantsCell,
  );
  const converted = asBool(
    input.converted_to_member ?? input.convertida_em_membro,
  );
  const visitDate =
    input.data_do_culto ?? input.visit_date ?? input.serviceDate ?? null;
  const serviceName = input.culto ?? input.service_name ?? input.serviceName ?? "";
  const invited =
    input.convidado_por ?? input.invited_by ?? input.invitedBy ?? "";
  const responsibleName =
    input.conselheiro_responsavel ??
    input.follow_up_responsible_name ??
    "";
  const responsibleId =
    input.conselheiro_responsavel_id ??
    input.follow_up_responsible_id ??
    null;
  const nextFollowUp =
    input.proxima_data_contacto ?? input.next_follow_up_date ?? null;

  return {
    ...input,
    id,
    tratamento,
    title: input.title ?? tratamento,
    nome,
    first_name: input.first_name ?? nome,
    apelido,
    last_name: input.last_name ?? apelido,
    full_name: fullName,
    fullName,
    genero: input.genero ?? input.gender ?? null,
    gender: input.gender ?? input.genero ?? null,
    data_de_nascimento:
      input.data_de_nascimento ?? input.date_of_birth ?? input.dateOfBirth ?? null,
    date_of_birth:
      input.date_of_birth ?? input.dateOfBirth ?? input.data_de_nascimento ?? null,
    dateOfBirth:
      input.dateOfBirth ?? input.date_of_birth ?? input.data_de_nascimento ?? null,
    telefone,
    phone: input.phone ?? telefone,
    whatsapp: input.whatsapp ?? telefone,
    email: input.email ?? "",
    endereco: input.endereco ?? input.address ?? input.neighbourhood ?? "",
    address: input.address ?? input.endereco ?? "",
    neighbourhood: input.neighbourhood ?? input.endereco ?? null,
    church_id: churchId,
    churchId,
    church_name: input.church_name ?? input.igreja ?? null,
    igreja: input.igreja ?? input.church_name ?? null,
    cell_group_id: input.cell_group_id ?? null,
    cell_group_name: input.cell_group_name ?? null,
    cell_id: input.cell_id ?? null,
    cell_name: input.cell_name ?? input.celula ?? input.celula_preferida ?? null,
    celula: input.celula ?? input.cell_name ?? input.celula_preferida ?? "",
    celula_preferida: input.celula_preferida ?? input.celula ?? input.cell_name ?? "",
    data_do_culto: visitDate,
    visit_date: visitDate,
    serviceDate: visitDate,
    culto: serviceName,
    service_name: serviceName,
    serviceName,
    convidado_por: invited,
    invited_by: invited,
    invitedBy: invited,
    nasceu_de_novo: nasceu,
    born_again: nasceu,
    bornAgain: nasceu,
    quer_escola_de_fundacao: querFundacao,
    wants_foundation_school: querFundacao,
    wantsFoundationSchool: querFundacao,
    quer_aconselhamento: querAconselhamento,
    wants_counseling: querAconselhamento,
    wantsCounseling: querAconselhamento,
    interesse_em_celula: interesseCelula,
    interested_in_cell: interesseCelula,
    wantsCell: interesseCelula,
    estado_do_seguimento: followUp,
    follow_up_status: followUp,
    followUpStatus: followUp,
    status,
    conselheiro_responsavel: responsibleName,
    follow_up_responsible_name: responsibleName,
    conselheiro_responsavel_id: responsibleId,
    follow_up_responsible_id: responsibleId,
    proxima_data_contacto: nextFollowUp,
    next_follow_up_date: nextFollowUp,
    converted_to_member: converted,
    convertida_em_membro: converted,
    member_id: input.member_id ?? null,
    notas: input.notas ?? input.notes ?? "",
    notes: input.notes ?? input.notas ?? "",
    created_at: input.created_at ?? input.createdAt,
    updated_at: input.updated_at ?? input.updatedAt,
    createdAt:
      input.createdAt ??
      (typeof input.created_at === "string" ? input.created_at : undefined),
    updatedAt:
      input.updatedAt ??
      (typeof input.updated_at === "string" ? input.updated_at : undefined),
  };
}

async function attachChurchName(person: FirstTimer): Promise<FirstTimer> {
  if (!person.church_id) return person;
  try {
    const churches = await listChurches();
    if (!churches.ok) return person;
    const church = (churches.data || []).find(
      (c) => c.id === person.church_id || c.church_id === person.church_id,
    );
    if (!church) return person;
    const name =
      church.church_name || church.public_name || person.church_name || person.igreja || "";
    return normalizeFirstTimer({
      ...person,
      church_name: name,
      igreja: name,
    });
  } catch {
    return person;
  }
}

export async function ensureFirstTimersSeeded(): Promise<void> {
  if (useSupabaseFirstTimers() || useApiFirstTimers()) return;
  const provider = getDataProvider();
  const listed = await provider.firstTimers.list();
  if (!listed.ok) return;
  if ((listed.data || []).length > 0) return;

  if (provider.firstTimers.create) {
    for (const seed of FIRST_TIMERS_SEED) {
      await provider.firstTimers.create(normalizeFirstTimer(seed));
    }
  }
}

export async function listFirstTimers(): Promise<DataResult<FirstTimer[]>> {
  try {
    if (useSupabaseFirstTimers()) {
      const result = await firstTimersSb.listFirstTimers();
      if (!result.ok) return result;
      const rows = await Promise.all(
        (result.data || []).map(async (row) => attachChurchName(normalizeFirstTimer(row))),
      );
      return ok(rows);
    }
    if (useApiFirstTimers()) {
      const result = await firstTimersApi.listFirstTimers();
      if (!result.ok) return result;
      return ok((result.data || []).map((row) => normalizeFirstTimer(row)));
    }
    await ensureFirstTimersSeeded();
    const provider = getDataProvider();
    const result = await provider.firstTimers.list();
    if (!result.ok) return result;
    const rows = await Promise.all(
      (result.data || []).map(async (row) => attachChurchName(normalizeFirstTimer(row))),
    );
    return ok(rows);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar primeira vez.");
  }
}

export async function getFirstTimerById(
  id: EntityId,
): Promise<DataResult<FirstTimer | null>> {
  try {
    if (useSupabaseFirstTimers()) {
      const result = await firstTimersSb.getFirstTimerById(id);
      if (!result.ok) return result;
      if (!result.data) return ok(null);
      return ok(await attachChurchName(normalizeFirstTimer(result.data)));
    }
    if (useApiFirstTimers()) {
      const result = await firstTimersApi.getFirstTimerById(id);
      if (!result.ok) return result;
      return ok(result.data ? normalizeFirstTimer(result.data) : null);
    }
    await ensureFirstTimersSeeded();
    const provider = getDataProvider();
    const result = await provider.firstTimers.getById(id);
    if (!result.ok) return result;
    if (!result.data) return ok(null);
    return ok(await attachChurchName(normalizeFirstTimer(result.data)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter primeira vez.");
  }
}

export async function createFirstTimer(
  payload: Partial<FirstTimer>,
): Promise<DataResult<FirstTimer>> {
  try {
    if (useSupabaseFirstTimers()) {
      let person = normalizeFirstTimer(payload);
      person = await attachChurchName(person);
      const result = await firstTimersSb.createFirstTimer(person);
      if (!result.ok) return result;
      return ok(normalizeFirstTimer(result.data));
    }
    if (useApiFirstTimers()) {
      const result = await firstTimersApi.createFirstTimer(payload);
      if (!result.ok) return result;
      return ok(normalizeFirstTimer(result.data));
    }
    await ensureFirstTimersSeeded();
    const provider = getDataProvider();
    if (!provider.firstTimers.create) {
      return fail("Criar primeira vez não suportado neste data source.", "NOT_SUPPORTED");
    }
    const today = new Date().toISOString().slice(0, 10);
    let person = normalizeFirstTimer({
      ...payload,
      id: payload.id || `ft-${Date.now()}`,
      created_at: payload.created_at || today,
      updated_at: payload.updated_at || today,
    });
    person = await attachChurchName(person);
    const result = await provider.firstTimers.create(person);
    if (!result.ok) return result;
    return ok(normalizeFirstTimer(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar primeira vez.");
  }
}

export async function updateFirstTimer(
  id: EntityId,
  payload: Partial<FirstTimer>,
): Promise<DataResult<FirstTimer>> {
  try {
    if (useSupabaseFirstTimers()) {
      const existing = await firstTimersSb.getFirstTimerById(id);
      if (!existing.ok) return fail(existing.error, existing.code);
      if (!existing.data) return fail("Registo de primeira vez não encontrado.", "NOT_FOUND");
      let next = normalizeFirstTimer({ ...existing.data, ...payload, id });
      next = await attachChurchName(next);
      const result = await firstTimersSb.updateFirstTimer(id, next);
      if (!result.ok) return result;
      return ok(normalizeFirstTimer(result.data));
    }
    if (useApiFirstTimers()) {
      const result = await firstTimersApi.updateFirstTimer(id, payload);
      if (!result.ok) return result;
      return ok(normalizeFirstTimer(result.data));
    }
    const provider = getDataProvider();
    if (!provider.firstTimers.update) {
      return fail("Actualizar primeira vez não suportado neste data source.", "NOT_SUPPORTED");
    }
    const existing = await provider.firstTimers.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Registo de primeira vez não encontrado.", "NOT_FOUND");

    let next = normalizeFirstTimer({
      ...existing.data,
      ...payload,
      id,
      updated_at: new Date().toISOString().slice(0, 10),
    });
    next = await attachChurchName(next);
    const result = await provider.firstTimers.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeFirstTimer(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar primeira vez.");
  }
}

export async function deleteFirstTimer(id: EntityId): Promise<DataResult<boolean>> {
  try {
    if (useSupabaseFirstTimers()) return firstTimersSb.deleteFirstTimer(id);
    if (useApiFirstTimers()) return firstTimersApi.deleteFirstTimer(id);
    const provider = getDataProvider();
    if (!provider.firstTimers.remove) {
      return fail("Eliminar primeira vez não suportado neste data source.", "NOT_SUPPORTED");
    }
    return provider.firstTimers.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar primeira vez.");
  }
}

export async function searchFirstTimers(query: string): Promise<DataResult<FirstTimer[]>> {
  try {
    if (useSupabaseFirstTimers()) {
      const result = await firstTimersSb.searchFirstTimers(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((p) => normalizeFirstTimer(p)));
    }
    if (useApiFirstTimers()) {
      const result = await firstTimersApi.searchFirstTimers(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((p) => normalizeFirstTimer(p)));
    }
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return listed;
    const filtered = listed.data.filter((person) =>
      [
        person.full_name,
        person.fullName,
        person.nome,
        person.apelido,
        person.telefone,
        person.phone,
        person.whatsapp,
        person.email,
        person.endereco,
        person.culto,
        person.convidado_por,
        person.celula,
        person.celula_preferida,
        person.church_name,
        person.igreja,
        person.estado_do_seguimento,
        person.conselheiro_responsavel,
      ].some((value) => String(value || "").toLowerCase().includes(q)),
    );
    return ok(filtered);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao pesquisar primeira vez.");
  }
}

export async function getFirstTimersByChurch(
  churchId: EntityId,
): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter(
        (p) => p.church_id === churchId || p.churchId === churchId,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por igreja.");
  }
}

export async function getFirstTimersByCell(
  cellId: EntityId,
): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((p) => p.cell_id === cellId));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por célula.");
  }
}

export async function getFirstTimersByCellGroup(
  cellGroupId: EntityId,
): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((p) => p.cell_group_id === cellGroupId));
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao filtrar por grupo de célula.",
    );
  }
}

export async function getFirstTimersByStatus(
  status: string,
): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    const key = statusKey(status);
    return ok(
      listed.data.filter(
        (p) => statusKey(p.estado_do_seguimento || p.followUpStatus) === key,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por estado.");
  }
}

export async function getFirstTimersByDateRange(
  startDate: string,
  endDate: string,
): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    const start = String(startDate || "").slice(0, 10);
    const end = String(endDate || "").slice(0, 10);
    return ok(
      listed.data.filter((p) => {
        const d = String(p.data_do_culto || p.serviceDate || p.created_at || "").slice(0, 10);
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

export async function getNewConverts(): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter((p) => p.nasceu_de_novo === true || p.bornAgain === true),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar novos convertidos.");
  }
}

export async function getPendingFollowUps(): Promise<DataResult<FirstTimer[]>> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter((p) => {
        const key = statusKey(p.estado_do_seguimento || p.followUpStatus);
        return key === "pending" || key === "noanswer" || key === "interested";
      }),
    );
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao listar acompanhamentos pendentes.",
    );
  }
}

export async function getInterestedInFoundationSchool(): Promise<
  DataResult<FirstTimer[]>
> {
  try {
    const listed = await listFirstTimers();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter(
        (p) => p.quer_escola_de_fundacao === true || p.wantsFoundationSchool === true,
      ),
    );
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Falha ao listar interessados na Escola de Fundação.",
    );
  }
}

/**
 * Prepare conversion of a First Timer into a Member via membersRepository.
 * Does not run automatically from the UI yet — call explicitly when ready.
 */
export async function convertFirstTimerToMember(
  firstTimerId: EntityId,
  overrides: Partial<Member> = {},
): Promise<DataResult<{ firstTimer: FirstTimer; member: Member }>> {
  try {
    const existing = await getFirstTimerById(firstTimerId);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Registo de primeira vez não encontrado.", "NOT_FOUND");

    const person = existing.data;
    if (person.converted_to_member && person.member_id) {
      return fail("Este registo já foi convertido em membro.", "ALREADY_CONVERTED");
    }

    const memberResult = await createMember({
      tratamento: person.tratamento || person.title || "",
      nome: person.nome || person.first_name || "",
      apelido: person.apelido || person.last_name || "",
      telefone: person.telefone || person.phone || "",
      whatsapp: person.whatsapp || "",
      email: person.email || "",
      endereco: person.endereco || person.address || "",
      church_id: person.church_id || person.churchId || null,
      church_name: person.church_name || person.igreja || null,
      cell_id: person.cell_id || null,
      cell_name: person.cell_name || person.celula || null,
      cell_group_id: person.cell_group_id || null,
      cell_group_name: person.cell_group_name || null,
      celula: person.celula || person.cell_name || person.celula_preferida || "",
      estado: "Active",
      origem: "Primeira Vez",
      source: "First Timer",
      data_de_entrada: new Date().toISOString().slice(0, 10),
      notas: person.notas || person.notes || "",
      ...overrides,
    });

    if (!memberResult.ok) {
      return fail(memberResult.error, memberResult.code || "MEMBER_CREATE_FAILED");
    }

    const updated = await updateFirstTimer(firstTimerId, {
      converted_to_member: true,
      convertida_em_membro: true,
      member_id: memberResult.data.id,
      estado_do_seguimento: "Became Member",
      follow_up_status: "Became Member",
      status: "Converted to Member",
    });

    if (!updated.ok) {
      return fail(updated.error, updated.code || "FIRST_TIMER_UPDATE_FAILED");
    }

    return ok({ firstTimer: updated.data, member: memberResult.data });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Falha ao converter primeira vez em membro.",
    );
  }
}

export function getFirstTimersDataSourceInfo() {
  const provider = getDataProvider();
  const sb = useSupabaseFirstTimers();
  const api = useApiFirstTimers();
  return {
    source: getDataSource(),
    provider: sb
      ? "supabase-first-timers-adapter"
      : api
        ? "api-first-timers-adapter"
        : provider.name,
    ready: sb ? getSupabaseEnvConfig().isConfigured : api ? false : provider.isReady(),
    description: sb
      ? "First Timers pilot via Supabase public.first_timers"
      : api
        ? "First Timers API placeholder"
        : provider.description,
    pilot: sb ? "first-timers-followups-supabase-v1" : undefined,
  };
}
