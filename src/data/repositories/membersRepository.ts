import { getDataProvider } from "../dataProvider";
import { getDataSource, getBackendFeatureFlags } from "../config";
import type { EntityId, Member } from "../types/entities";
import type { DataResult } from "../types/repository";
import { MEMBERS_SEED } from "../seeds/membersSeed";
import { listChurches } from "./churchesRepository";
import { getSupabaseEnvConfig } from "../adapters/supabase/supabaseConfig";
import * as membersSb from "../adapters/supabase/membersSupabaseAdapter";
import * as membersApi from "../adapters/api/membersApiAdapter";

function fail<T>(error: string, code = "MEMBERS_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}

/** Phase 3: route to Supabase adapter when flags + source allow. */
function useSupabaseMembers(): boolean {
  if (getDataSource() !== "supabase") return false;
  const cfg = getSupabaseEnvConfig();
  const flags = getBackendFeatureFlags();
  return flags.enableSupabase && cfg.isConfigured;
}

function useApiMembers(): boolean {
  return getDataSource() === "api";
}

function isActiveStatus(status: string | null | undefined): boolean {
  const key = String(status || "")
    .trim()
    .toLowerCase();
  return key === "active" || key === "activo" || key === "ativa" || key === "activa";
}

function isInactiveStatus(status: string | null | undefined): boolean {
  const key = String(status || "")
    .trim()
    .toLowerCase();
  return key === "inactive" || key === "inactivo" || key === "inactiva" || key === "inativo";
}

/**
 * Normalize to dashboard-compatible PT fields + English aliases.
 */
export function normalizeMember(input: Partial<Member> & { id?: string }): Member {
  const id = input.id || `m-${Date.now()}`;
  const nome = input.nome ?? input.first_name ?? "";
  const apelido = input.apelido ?? input.last_name ?? "";
  const tratamento = input.tratamento ?? input.title ?? "";
  const telefone = input.telefone ?? input.phone ?? "";
  const estado = input.estado ?? input.status ?? "Active";
  const churchId = input.church_id ?? input.churchId ?? null;
  const fullFromParts = [tratamento, nome, apelido].filter(Boolean).join(" ").trim();
  const fullName =
    input.full_name ||
    input.fullName ||
    fullFromParts ||
    "Membro";

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
    data_de_nascimento: input.data_de_nascimento ?? input.date_of_birth ?? null,
    date_of_birth: input.date_of_birth ?? input.data_de_nascimento ?? null,
    telefone,
    phone: input.phone ?? telefone,
    whatsapp: input.whatsapp ?? telefone,
    email: input.email ?? "",
    endereco: input.endereco ?? input.address ?? "",
    address: input.address ?? input.endereco ?? "",
    church_id: churchId,
    churchId,
    church_name: input.church_name ?? input.igreja ?? null,
    igreja: input.igreja ?? input.church_name ?? null,
    cell_group_id: input.cell_group_id ?? null,
    cell_group_name: input.cell_group_name ?? null,
    cell_id: input.cell_id ?? null,
    cell_name: input.cell_name ?? input.celula ?? null,
    celula: input.celula ?? input.cell_name ?? "",
    department_id: input.department_id ?? null,
    department_name: input.department_name ?? input.departamento ?? null,
    departamento: input.departamento ?? input.department_name ?? "",
    estado,
    status: input.status ?? estado,
    data_de_entrada: input.data_de_entrada ?? input.member_since ?? null,
    member_since: input.member_since ?? input.data_de_entrada ?? null,
    origem: input.origem ?? input.source ?? "Manual",
    source: input.source ?? input.origem ?? "Manual",
    notas: input.notas ?? input.notes ?? "",
    notes: input.notes ?? input.notas ?? "",
    isActive: input.isActive ?? isActiveStatus(estado),
    created_at: input.created_at ?? input.createdAt,
    updated_at: input.updated_at ?? input.updatedAt,
    createdAt: input.createdAt ?? (typeof input.created_at === "string" ? input.created_at : undefined),
    updatedAt: input.updatedAt ?? (typeof input.updated_at === "string" ? input.updated_at : undefined),
  };
}

/** Resolve church_name from churches repository whenever church_id is set. */
async function attachChurchName(member: Member): Promise<Member> {
  if (!member.church_id) return member;
  try {
    const churches = await listChurches();
    if (!churches.ok) return member;
    const church = (churches.data || []).find(
      (c) => c.id === member.church_id || c.church_id === member.church_id,
    );
    if (!church) return member;
    const name = church.church_name || church.public_name || member.church_name || member.igreja || "";
    return normalizeMember({
      ...member,
      church_name: name,
      igreja: name,
    });
  } catch {
    return member;
  }
}

/**
 * Seed empty providers with dashboard-compatible mock members.
 * Safe to call repeatedly — only seeds when collection is empty.
 * Skipped for supabase/api (remote seed via SQL).
 */
export async function ensureMembersSeeded(): Promise<void> {
  if (useSupabaseMembers() || useApiMembers()) return;
  const provider = getDataProvider();
  const listed = await provider.members.list();
  if (!listed.ok) return;
  if ((listed.data || []).length > 0) return;

  if (provider.members.create) {
    for (const seed of MEMBERS_SEED) {
      await provider.members.create(normalizeMember(seed));
    }
  }
}

export async function listMembers(): Promise<DataResult<Member[]>> {
  try {
    if (useSupabaseMembers()) {
      const result = await membersSb.listMembers();
      if (!result.ok) return result;
      const rows = await Promise.all(
        (result.data || []).map(async (m) => attachChurchName(normalizeMember(m))),
      );
      return ok(rows);
    }
    if (useApiMembers()) {
      const result = await membersApi.listMembers();
      if (!result.ok) return result;
      return ok((result.data || []).map((m) => normalizeMember(m)));
    }
    await ensureMembersSeeded();
    const provider = getDataProvider();
    const result = await provider.members.list();
    if (!result.ok) return result;
    const rows = await Promise.all(
      (result.data || []).map(async (m) => attachChurchName(normalizeMember(m))),
    );
    return ok(rows);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar membros.");
  }
}

export async function getMemberById(id: EntityId): Promise<DataResult<Member | null>> {
  try {
    if (useSupabaseMembers()) {
      const result = await membersSb.getMemberById(id);
      if (!result.ok) return result;
      if (!result.data) return ok(null);
      return ok(await attachChurchName(normalizeMember(result.data)));
    }
    if (useApiMembers()) {
      const result = await membersApi.getMemberById(id);
      if (!result.ok) return result;
      return ok(result.data ? normalizeMember(result.data) : null);
    }
    await ensureMembersSeeded();
    const provider = getDataProvider();
    const result = await provider.members.getById(id);
    if (!result.ok) return result;
    if (!result.data) return ok(null);
    return ok(await attachChurchName(normalizeMember(result.data)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao obter membro.");
  }
}

export async function createMember(payload: Partial<Member>): Promise<DataResult<Member>> {
  try {
    if (useSupabaseMembers()) {
      let member = normalizeMember(payload);
      member = await attachChurchName(member);
      const result = await membersSb.createMember(member);
      if (!result.ok) return result;
      return ok(normalizeMember(result.data));
    }
    if (useApiMembers()) {
      const result = await membersApi.createMember(payload);
      if (!result.ok) return result;
      return ok(normalizeMember(result.data));
    }
    await ensureMembersSeeded();
    const provider = getDataProvider();
    if (!provider.members.create) {
      return fail("Criar membro não suportado neste data source.", "NOT_SUPPORTED");
    }
    const today = new Date().toISOString().slice(0, 10);
    let member = normalizeMember({
      ...payload,
      id: payload.id || `m-${Date.now()}`,
      created_at: payload.created_at || today,
      updated_at: payload.updated_at || today,
    });
    member = await attachChurchName(member);
    const result = await provider.members.create(member);
    if (!result.ok) return result;
    return ok(normalizeMember(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar membro.");
  }
}

export async function updateMember(
  id: EntityId,
  payload: Partial<Member>,
): Promise<DataResult<Member>> {
  try {
    if (useSupabaseMembers()) {
      const existing = await membersSb.getMemberById(id);
      if (!existing.ok) return fail(existing.error, existing.code);
      if (!existing.data) return fail("Membro não encontrado.", "NOT_FOUND");
      let next = normalizeMember({ ...existing.data, ...payload, id });
      next = await attachChurchName(next);
      const result = await membersSb.updateMember(id, next);
      if (!result.ok) return result;
      return ok(normalizeMember(result.data));
    }
    if (useApiMembers()) {
      const result = await membersApi.updateMember(id, payload);
      if (!result.ok) return result;
      return ok(normalizeMember(result.data));
    }
    const provider = getDataProvider();
    if (!provider.members.update) {
      return fail("Actualizar membro não suportado neste data source.", "NOT_SUPPORTED");
    }
    const existing = await provider.members.getById(id);
    if (!existing.ok) return fail(existing.error, existing.code);
    if (!existing.data) return fail("Membro não encontrado.", "NOT_FOUND");

    let next = normalizeMember({
      ...existing.data,
      ...payload,
      id,
      updated_at: new Date().toISOString().slice(0, 10),
    });
    next = await attachChurchName(next);
    const result = await provider.members.update(id, next);
    if (!result.ok) return result;
    return ok(normalizeMember(result.data));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao actualizar membro.");
  }
}

export async function deleteMember(id: EntityId): Promise<DataResult<boolean>> {
  try {
    if (useSupabaseMembers()) return membersSb.deleteMember(id);
    if (useApiMembers()) return membersApi.deleteMember(id);
    const provider = getDataProvider();
    if (!provider.members.remove) {
      return fail("Eliminar membro não suportado neste data source.", "NOT_SUPPORTED");
    }
    return provider.members.remove(id);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao eliminar membro.");
  }
}

export async function searchMembers(query: string): Promise<DataResult<Member[]>> {
  try {
    if (useSupabaseMembers()) {
      const result = await membersSb.searchMembers(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((m) => normalizeMember(m)));
    }
    if (useApiMembers()) {
      const result = await membersApi.searchMembers(query);
      if (!result.ok) return result;
      return ok((result.data || []).map((m) => normalizeMember(m)));
    }
    const listed = await listMembers();
    if (!listed.ok) return listed;
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return listed;
    const filtered = listed.data.filter((member) =>
      [
        member.full_name,
        member.fullName,
        member.nome,
        member.apelido,
        member.first_name,
        member.last_name,
        member.telefone,
        member.phone,
        member.whatsapp,
        member.email,
        member.celula,
        member.cell_name,
        member.departamento,
        member.department_name,
        member.church_name,
        member.igreja,
        member.estado,
        member.origem,
      ].some((value) => String(value || "").toLowerCase().includes(q)),
    );
    return ok(filtered);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao pesquisar membros.");
  }
}

export async function getMembersByChurch(churchId: EntityId): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    return ok(
      listed.data.filter(
        (m) => m.church_id === churchId || m.churchId === churchId,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por igreja.");
  }
}

export async function getMembersByCell(cellId: EntityId): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((m) => m.cell_id === cellId));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por célula.");
  }
}

export async function getMembersByCellGroup(
  cellGroupId: EntityId,
): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((m) => m.cell_group_id === cellGroupId));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por grupo de célula.");
  }
}

export async function getMembersByDepartment(
  departmentId: EntityId,
): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    const key = String(departmentId || "").toLowerCase();
    return ok(
      listed.data.filter(
        (m) =>
          m.department_id === departmentId ||
          String(m.departamento || "").toLowerCase() === key ||
          String(m.department_name || "").toLowerCase() === key,
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao filtrar por departamento.");
  }
}

export async function getActiveMembers(): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((m) => isActiveStatus(m.estado || m.status)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar membros activos.");
  }
}

export async function getInactiveMembers(): Promise<DataResult<Member[]>> {
  try {
    const listed = await listMembers();
    if (!listed.ok) return listed;
    return ok(listed.data.filter((m) => isInactiveStatus(m.estado || m.status)));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao listar membros inactivos.");
  }
}

/** Diagnostic helper for docs / console. */
export function getMembersDataSourceInfo() {
  const provider = getDataProvider();
  const sb = useSupabaseMembers();
  const api = useApiMembers();
  return {
    source: getDataSource(),
    provider: sb ? "supabase-members-adapter" : api ? "api-members-adapter" : provider.name,
    ready: sb ? getSupabaseEnvConfig().isConfigured : api ? false : provider.isReady(),
    description: sb
      ? "Members pilot via Supabase public.members"
      : api
        ? "Members API placeholder"
        : provider.description,
    pilot: sb ? "churches-members-supabase-v1" : undefined,
  };
}
