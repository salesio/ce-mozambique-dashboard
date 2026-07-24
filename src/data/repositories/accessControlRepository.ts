import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  AccessPermission,
  AccessRole,
  AuditLog,
  EntityId,
  PermissionTemplate,
  User,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { USERS_SEED } from "../seeds/usersSeed";
import { ROLES_SEED } from "../seeds/rolesSeed";
import { PERMISSIONS_SEED } from "../seeds/permissionsSeed";
import { PERMISSION_TEMPLATES_SEED } from "../seeds/permissionTemplatesSeed";
import { AUDIT_LOGS_SEED } from "../seeds/auditLogsSeed";

function fail<T>(error: string, code = "ACCESS_CONTROL_ERROR"): DataResult<T> {
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

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeUser(input: Partial<User> & { id?: string }): User {
  const id = input.id || `u-${Date.now()}`;
  const name = input.name || input.full_name || input.fullName || "";
  const status = input.status || (input.isActive === false ? "Inactive" : "Active");
  return {
    ...input,
    id,
    email: input.email || null,
    name,
    full_name: input.full_name || name,
    fullName: input.fullName || name,
    display_name: input.display_name || name,
    phone: input.phone || "",
    role: input.role || input.role_name || "",
    role_id: input.role_id || null,
    role_name: input.role_name || input.role || "",
    church_id: input.church_id || input.churchId || null,
    churchId: input.churchId || input.church_id || null,
    church_name: input.church_name || "",
    department_id: input.department_id || null,
    department_name: input.department_name || input.assigned_department || "",
    assigned_department: input.assigned_department || input.department_name || "",
    department_permissions: Array.isArray(input.department_permissions)
      ? input.department_permissions
      : [],
    can_view_all_churches: !!input.can_view_all_churches,
    auth_user_id: input.auth_user_id || null,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || input.assigned_staff_name || "",
    assigned_staff_name: input.assigned_staff_name || input.staff_name || "",
    status,
    isActive: status === "Active" || status === "Activo",
    has_dashboard_access: input.has_dashboard_access ?? true,
    last_login_at: input.last_login_at || null,
    last_active_at: input.last_active_at || null,
    failed_login_attempts: Number(input.failed_login_attempts ?? 0) || 0,
    locked_until: input.locked_until || null,
    preferred_language: input.preferred_language || "pt",
    avatar_url: input.avatar_url || "",
    notes: input.notes || "",
    demo_password_hint: input.demo_password_hint || "demo",
    permissions: Array.isArray(input.permissions) ? input.permissions : [],
    created_by: input.created_by || "",
    created_by_name: input.created_by_name || "",
    created_at: input.created_at || input.createdAt || nowIso(),
    updated_at: input.updated_at || input.updatedAt || todayIso(),
    createdAt: input.createdAt || input.created_at || nowIso(),
    updatedAt: input.updatedAt || input.updated_at || todayIso(),
  };
}

export function normalizeRole(input: Partial<AccessRole> & { id?: string }): AccessRole {
  return {
    ...input,
    id: input.id || `role-${Date.now()}`,
    name: input.name || "",
    display_name: input.display_name || input.name || "",
    description: input.description || "",
    level: input.level || "Staff",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    is_system_role: input.is_system_role ?? false,
    is_custom_role: input.is_custom_role ?? !input.is_system_role,
    permission_template_id: input.permission_template_id || null,
    default_scope: input.default_scope || "own",
    status: input.status || "Active",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePermission(
  input: Partial<AccessPermission> & { id?: string },
): AccessPermission {
  return {
    ...input,
    id: input.id || `perm-${Date.now()}`,
    role_id: input.role_id || null,
    role_name: input.role_name || "",
    module: input.module || "",
    can_view: !!input.can_view,
    can_create: !!input.can_create,
    can_edit: !!input.can_edit,
    can_delete: !!input.can_delete,
    can_approve: !!input.can_approve,
    can_verify: !!input.can_verify,
    can_release_resources: !!input.can_release_resources,
    can_export: !!input.can_export,
    can_manage_settings: !!input.can_manage_settings,
    can_view_salary: !!input.can_view_salary,
    scope: input.scope || "own",
    conditions: input.conditions || {},
    is_sensitive: !!input.is_sensitive,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePermissionTemplate(
  input: Partial<PermissionTemplate> & { id?: string },
): PermissionTemplate {
  return {
    ...input,
    id: input.id || `tpl-${Date.now()}`,
    name: input.name || "",
    description: input.description || "",
    role_level: input.role_level || "Staff",
    permissions: Array.isArray(input.permissions) ? input.permissions : [],
    is_system_template: input.is_system_template ?? false,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeAuditLog(input: Partial<AuditLog> & { id?: string }): AuditLog {
  const userName = input.user_name || input.actor || "";
  return {
    ...input,
    id: input.id || `audit-${Date.now()}`,
    user_id: input.user_id || null,
    user_name: userName,
    user_role: input.user_role || "",
    actor: input.actor || userName,
    church_id: input.church_id || null,
    date: input.date || todayIso(),
    module: input.module || "",
    action: input.action || "update",
    entity_type: input.entity_type || "",
    entity_id: input.entity_id || null,
    entity_label: input.entity_label || "",
    old_value: input.old_value ?? null,
    new_value: input.new_value ?? null,
    description: input.description || input.action || "",
    severity: input.severity || "info",
    ip_address: input.ip_address || "",
    user_agent: input.user_agent || "",
    created_at: input.created_at || nowIso(),
    metadata: input.metadata || {},
  };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function listUsers(): Promise<DataResult<User[]>> {
  try {
    const result = await getDataProvider().users.list();
    if (!result.ok) return result as DataResult<User[]>;
    return ok((result.data || []).map((r) => normalizeUser(r as User)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listUsers failed");
  }
}

export async function getUserById(id: EntityId): Promise<DataResult<User | null>> {
  try {
    const result = await getDataProvider().users.getById(id);
    if (!result.ok) return result as DataResult<User | null>;
    return ok(result.data ? normalizeUser(result.data as User) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getUserById failed");
  }
}

export async function getUserByEmail(email: string): Promise<DataResult<User | null>> {
  const list = await listUsers();
  if (!list.ok) return list as DataResult<User | null>;
  const e = statusKey(email);
  const found = list.data.find((u) => statusKey(u.email || "") === e) || null;
  return ok(found);
}

/** Resolve app user by Supabase Auth uuid (auth.users.id). */
export async function getUserByAuthUserId(authUserId: string): Promise<DataResult<User | null>> {
  const list = await listUsers();
  if (!list.ok) return list as DataResult<User | null>;
  const id = String(authUserId || "").trim();
  if (!id) return ok(null);
  const found =
    list.data.find((u) => String(u.auth_user_id || "").trim() === id) || null;
  return ok(found);
}

/** Link Supabase Auth user id to an existing app user (Phase 2 pilot). */
export async function linkAuthUserToUser(
  userId: EntityId,
  authUserId: string,
): Promise<DataResult<User>> {
  const authId = String(authUserId || "").trim();
  if (!authId) return fail("auth_user_id required", "VALIDATION");
  const existing = await getUserByAuthUserId(authId);
  if (existing.ok && existing.data && existing.data.id !== userId) {
    return fail("auth_user_id already linked to another user", "AUTH_LINK_CONFLICT");
  }
  return updateUser(userId, { auth_user_id: authId });
}

export async function unlinkAuthUser(userId: EntityId): Promise<DataResult<User>> {
  return updateUser(userId, { auth_user_id: null });
}

export async function markUserLastLogin(userId: EntityId): Promise<DataResult<User>> {
  const now = nowIso();
  return updateUser(userId, {
    last_login_at: now,
    last_active_at: now,
    failed_login_attempts: 0,
    locked_until: null,
  });
}

export async function updateUserAuthStatus(
  userId: EntityId,
  payload: {
    status?: string;
    failed_login_attempts?: number;
    locked_until?: string | null;
    last_active_at?: string | null;
    last_login_at?: string | null;
    auth_user_id?: string | null;
  },
): Promise<DataResult<User>> {
  const patch: Partial<User> = { ...payload };
  if (payload.status) {
    patch.isActive = /active|activo/i.test(payload.status);
  }
  return updateUser(userId, patch);
}

export async function createUser(payload: Partial<User>): Promise<DataResult<User>> {
  try {
    // Never persist real password fields
    const { demo_password_hint, ...rest } = payload as User & { password?: string };
    delete (rest as { password?: string }).password;
    const row = normalizeUser({
      ...rest,
      demo_password_hint: demo_password_hint || "demo",
      status: payload.status || "Active",
    });
    const repo = getDataProvider().users;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<User>;
    return ok(normalizeUser(result.data as User));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createUser failed");
  }
}

export async function updateUser(id: EntityId, payload: Partial<User>): Promise<DataResult<User>> {
  try {
    const existing = await getUserById(id);
    if (!existing.ok || !existing.data) return fail("Utilizador não encontrado", "NOT_FOUND");
    const clean = { ...payload } as Partial<User> & { password?: string };
    delete clean.password;
    const row = normalizeUser({
      ...existing.data,
      ...clean,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().users;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<User>;
    return ok(normalizeUser(result.data as User));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateUser failed");
  }
}

export async function deleteUser(id: EntityId): Promise<DataResult<boolean>> {
  try {
    const repo = getDataProvider().users;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteUser failed");
  }
}

export async function searchUsers(query: string): Promise<DataResult<User[]>> {
  const list = await listUsers();
  if (!list.ok) return list;
  const q = statusKey(query);
  if (!q) return list;
  return ok(
    list.data.filter((u) =>
      statusKey([u.name, u.full_name, u.email, u.role, u.role_name].join(" ")).includes(q),
    ),
  );
}

export async function getUsersByRole(roleId: string) {
  const list = await listUsers();
  if (!list.ok) return list;
  const k = statusKey(roleId);
  return ok(
    list.data.filter(
      (u) => statusKey(u.role_id || "") === k || statusKey(u.role || u.role_name || "") === k,
    ),
  );
}
export async function getUsersByChurch(churchId: EntityId) {
  const list = await listUsers();
  if (!list.ok) return list;
  return ok(list.data.filter((u) => u.church_id === churchId || u.churchId === churchId));
}
export async function getUsersByDepartment(departmentId: string) {
  const list = await listUsers();
  if (!list.ok) return list;
  const k = statusKey(departmentId);
  return ok(
    list.data.filter(
      (u) =>
        statusKey(u.department_id || "") === k ||
        statusKey(u.department_name || u.assigned_department || "").includes(k),
    ),
  );
}
export async function getActiveUsers() {
  const list = await listUsers();
  if (!list.ok) return list;
  return ok(list.data.filter((u) => /active|activo/i.test(String(u.status || "")) || u.isActive));
}
export async function getInactiveUsers() {
  const list = await listUsers();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (u) => /inactive|inactivo|archived|suspend/i.test(String(u.status || "")) || u.isActive === false,
    ),
  );
}
export async function getLockedUsers() {
  const list = await listUsers();
  if (!list.ok) return list;
  return ok(list.data.filter((u) => /lock|bloque/i.test(String(u.status || ""))));
}

export async function linkUserToStaff(userId: EntityId, staffId: EntityId, staffName = "") {
  return updateUser(userId, { staff_id: staffId, staff_name: staffName, assigned_staff_name: staffName });
}
export async function unlinkUserFromStaff(userId: EntityId) {
  return updateUser(userId, { staff_id: null, staff_name: "", assigned_staff_name: "" });
}
export async function updateUserRole(userId: EntityId, roleId: EntityId, roleName?: string) {
  const role = roleName ? { role_id: roleId, role_name: roleName, role: roleName } : { role_id: roleId };
  if (!roleName) {
    const r = await getRoleById(roleId);
    if (r.ok && r.data) {
      return updateUser(userId, {
        role_id: roleId,
        role_name: r.data.name || r.data.display_name || "",
        role: r.data.name || r.data.display_name || "",
      });
    }
  }
  return updateUser(userId, role);
}
export async function updateUserStatus(userId: EntityId, status: string) {
  return updateUser(userId, {
    status,
    isActive: /active|activo/i.test(status),
  });
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export async function listRoles(): Promise<DataResult<AccessRole[]>> {
  try {
    const result = await getDataProvider().roles.list();
    if (!result.ok) return result as DataResult<AccessRole[]>;
    return ok((result.data || []).map((r) => normalizeRole(r as AccessRole)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listRoles failed");
  }
}
export async function getRoleById(id: EntityId) {
  try {
    const result = await getDataProvider().roles.getById(id);
    if (!result.ok) return result as DataResult<AccessRole | null>;
    return ok(result.data ? normalizeRole(result.data as AccessRole) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getRoleById failed");
  }
}
export async function createRole(payload: Partial<AccessRole>) {
  try {
    const row = normalizeRole(payload);
    const repo = getDataProvider().roles;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<AccessRole>;
    return ok(normalizeRole(result.data as AccessRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createRole failed");
  }
}
export async function updateRole(id: EntityId, payload: Partial<AccessRole>) {
  try {
    const existing = await getRoleById(id);
    if (!existing.ok || !existing.data) return fail("Role não encontrado", "NOT_FOUND");
    const row = normalizeRole({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().roles;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<AccessRole>;
    return ok(normalizeRole(result.data as AccessRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateRole failed");
  }
}
export async function deleteRole(id: EntityId) {
  try {
    const existing = await getRoleById(id);
    if (existing.ok && existing.data?.is_system_role) {
      return fail("Não é possível apagar roles de sistema", "SYSTEM_ROLE");
    }
    const repo = getDataProvider().roles;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteRole failed");
  }
}
export async function getAccessRolesByLevel(level: string) {
  const list = await listRoles();
  if (!list.ok) return list;
  const k = statusKey(level);
  return ok(list.data.filter((r) => statusKey(r.level || "") === k));
}
/** Alias for plan naming */
export const getRolesByLevel = getAccessRolesByLevel;

export async function getAccessRolesByDepartment(departmentId: EntityId) {
  const list = await listRoles();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.department_id === departmentId));
}
export async function getSystemRoles() {
  const list = await listRoles();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.is_system_role));
}
export async function getCustomRoles() {
  const list = await listRoles();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.is_custom_role || !r.is_system_role));
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

export async function listPermissions(): Promise<DataResult<AccessPermission[]>> {
  try {
    const result = await getDataProvider().permissions.list();
    if (!result.ok) return result as DataResult<AccessPermission[]>;
    return ok((result.data || []).map((r) => normalizePermission(r as AccessPermission)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPermissions failed");
  }
}
export async function getPermissionById(id: EntityId) {
  try {
    const result = await getDataProvider().permissions.getById(id);
    if (!result.ok) return result as DataResult<AccessPermission | null>;
    return ok(result.data ? normalizePermission(result.data as AccessPermission) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPermissionById failed");
  }
}
export async function createPermission(payload: Partial<AccessPermission>) {
  try {
    const row = normalizePermission(payload);
    const repo = getDataProvider().permissions;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<AccessPermission>;
    return ok(normalizePermission(result.data as AccessPermission));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPermission failed");
  }
}
export async function updatePermission(id: EntityId, payload: Partial<AccessPermission>) {
  try {
    const existing = await getPermissionById(id);
    if (!existing.ok || !existing.data) return fail("Permissão não encontrada", "NOT_FOUND");
    const row = normalizePermission({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().permissions;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<AccessPermission>;
    return ok(normalizePermission(result.data as AccessPermission));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePermission failed");
  }
}
export async function deletePermission(id: EntityId) {
  try {
    const repo = getDataProvider().permissions;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePermission failed");
  }
}
export async function getPermissionsByRole(roleId: EntityId) {
  const list = await listPermissions();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.role_id === roleId));
}
export async function getPermissionsByModule(module: string) {
  const list = await listPermissions();
  if (!list.ok) return list;
  const k = statusKey(module);
  return ok(list.data.filter((p) => statusKey(p.module || "") === k));
}
export async function setRolePermissions(
  roleId: EntityId,
  permissions: Partial<AccessPermission>[],
) {
  try {
    const existing = await getPermissionsByRole(roleId);
    if (existing.ok) {
      for (const p of existing.data) {
        await deletePermission(p.id);
      }
    }
    const role = await getRoleById(roleId);
    const roleName = role.ok && role.data ? role.data.name || "" : "";
    const created: AccessPermission[] = [];
    for (const p of permissions) {
      const r = await createPermission({
        ...p,
        role_id: roleId,
        role_name: roleName,
      });
      if (r.ok) created.push(r.data);
    }
    return ok(created);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "setRolePermissions failed");
  }
}

/**
 * Soft permission check — prefers data-layer permissions when present,
 * otherwise returns null so CEAccessControl ROLE_TEMPLATES can decide.
 */
export async function checkPermission(
  userId: EntityId,
  module: string,
  action: string,
  _context?: Record<string, unknown>,
): Promise<DataResult<boolean | null>> {
  try {
    const user = await getUserById(userId);
    if (!user.ok || !user.data) return ok(false);
    if (user.data.role === "Super Admin" || (user.data.department_permissions || []).includes("*")) {
      return ok(true);
    }
    const roleId = user.data.role_id;
    if (!roleId) return ok(null);
    const perms = await getPermissionsByRole(roleId);
    if (!perms.ok || !perms.data.length) return ok(null);
    const mod = perms.data.find((p) => statusKey(p.module || "") === statusKey(module));
    if (!mod) return ok(null);
    const map: Record<string, keyof AccessPermission> = {
      view: "can_view",
      create: "can_create",
      edit: "can_edit",
      delete: "can_delete",
      approve: "can_approve",
      reject: "can_approve",
      verify: "can_verify",
      release_resources: "can_release_resources",
      export: "can_export",
      manage_settings: "can_manage_settings",
      view_salary: "can_view_salary",
      view_sensitive: "can_view_salary",
    };
    const key = map[action] || "can_view";
    return ok(!!mod[key]);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "checkPermission failed");
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export async function listPermissionTemplates(): Promise<DataResult<PermissionTemplate[]>> {
  try {
    const result = await getDataProvider().permissionTemplates.list();
    if (!result.ok) return result as DataResult<PermissionTemplate[]>;
    return ok(
      (result.data || []).map((r) => normalizePermissionTemplate(r as PermissionTemplate)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPermissionTemplates failed");
  }
}
export async function getPermissionTemplateById(id: EntityId) {
  try {
    const result = await getDataProvider().permissionTemplates.getById(id);
    if (!result.ok) return result as DataResult<PermissionTemplate | null>;
    return ok(
      result.data ? normalizePermissionTemplate(result.data as PermissionTemplate) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPermissionTemplateById failed");
  }
}
export async function createPermissionTemplate(payload: Partial<PermissionTemplate>) {
  try {
    const row = normalizePermissionTemplate(payload);
    const repo = getDataProvider().permissionTemplates;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<PermissionTemplate>;
    return ok(normalizePermissionTemplate(result.data as PermissionTemplate));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPermissionTemplate failed");
  }
}
export async function updatePermissionTemplate(
  id: EntityId,
  payload: Partial<PermissionTemplate>,
) {
  try {
    const existing = await getPermissionTemplateById(id);
    if (!existing.ok || !existing.data) return fail("Template não encontrado", "NOT_FOUND");
    const row = normalizePermissionTemplate({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().permissionTemplates;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<PermissionTemplate>;
    return ok(normalizePermissionTemplate(result.data as PermissionTemplate));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePermissionTemplate failed");
  }
}
export async function deletePermissionTemplate(id: EntityId) {
  try {
    const repo = getDataProvider().permissionTemplates;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deletePermissionTemplate failed");
  }
}
export async function applyTemplateToRole(templateId: EntityId, roleId: EntityId) {
  const tpl = await getPermissionTemplateById(templateId);
  if (!tpl.ok || !tpl.data) return fail("Template não encontrado", "NOT_FOUND");
  const perms = (tpl.data.permissions || []) as Partial<AccessPermission>[];
  await updateRole(roleId, { permission_template_id: templateId });
  return setRolePermissions(roleId, perms);
}
export async function applyTemplateToUser(templateId: EntityId, userId: EntityId) {
  const tpl = await getPermissionTemplateById(templateId);
  if (!tpl.ok || !tpl.data) return fail("Template não encontrado", "NOT_FOUND");
  return updateUser(userId, {
    permissions: tpl.data.permissions as Array<Record<string, unknown>>,
  });
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------

export async function listAuditLogs(): Promise<DataResult<AuditLog[]>> {
  try {
    const result = await getDataProvider().auditLogs.list();
    if (!result.ok) return result as DataResult<AuditLog[]>;
    return ok((result.data || []).map((r) => normalizeAuditLog(r as AuditLog)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listAuditLogs failed");
  }
}
export async function getAuditLogById(id: EntityId) {
  try {
    const result = await getDataProvider().auditLogs.getById(id);
    if (!result.ok) return result as DataResult<AuditLog | null>;
    return ok(result.data ? normalizeAuditLog(result.data as AuditLog) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getAuditLogById failed");
  }
}
export async function createAuditLog(payload: Partial<AuditLog>): Promise<DataResult<AuditLog>> {
  try {
    const row = normalizeAuditLog(payload);
    const repo = getDataProvider().auditLogs;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<AuditLog>;
    return ok(normalizeAuditLog(result.data as AuditLog));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createAuditLog failed");
  }
}
export async function searchAuditLogs(query: string) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  const q = statusKey(query);
  if (!q) return list;
  return ok(
    list.data.filter((l) =>
      statusKey(
        [l.user_name, l.actor, l.module, l.action, l.description, l.entity_label].join(" "),
      ).includes(q),
    ),
  );
}
export async function getAuditLogsByUser(userId: EntityId) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  return ok(list.data.filter((l) => l.user_id === userId));
}
export async function getAuditLogsByModule(module: string) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  const k = statusKey(module);
  return ok(list.data.filter((l) => statusKey(l.module || "") === k));
}
export async function getAuditLogsByEntity(entityType: string, entityId: EntityId) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (l) => statusKey(l.entity_type || "") === statusKey(entityType) && l.entity_id === entityId,
    ),
  );
}
export async function getAuditLogsByAction(action: string) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  const k = statusKey(action);
  return ok(list.data.filter((l) => statusKey(l.action || "") === k));
}
export async function getAuditLogsByDateRange(startDate: string, endDate: string) {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  return ok(
    list.data.filter((l) => {
      const d = String(l.date || l.created_at || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getCriticalAuditLogs() {
  const list = await listAuditLogs();
  if (!list.ok) return list;
  return ok(
    list.data.filter((l) => {
      const s = statusKey(l.severity);
      return s.includes("critical") || s.includes("warning");
    }),
  );
}
export async function exportAuditLogs(filters: {
  startDate?: string;
  endDate?: string;
  module?: string;
  action?: string;
} = {}) {
  let list = await listAuditLogs();
  if (!list.ok) return list;
  let rows = list.data;
  if (filters.startDate && filters.endDate) {
    const r = await getAuditLogsByDateRange(filters.startDate, filters.endDate);
    if (r.ok) rows = r.data;
  }
  if (filters.module) {
    const k = statusKey(filters.module);
    rows = rows.filter((l) => statusKey(l.module || "") === k);
  }
  if (filters.action) {
    const k = statusKey(filters.action);
    rows = rows.filter((l) => statusKey(l.action || "") === k);
  }
  return ok(rows);
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureAccessControlSeeded(): Promise<DataResult<boolean>> {
  try {
    const users = await listUsers();
    if (users.ok && users.data.length === 0) {
      for (const s of USERS_SEED) await createUser(s);
    }
    const roles = await listRoles();
    if (roles.ok && roles.data.length === 0) {
      for (const s of ROLES_SEED) await createRole(s);
    }
    const perms = await listPermissions();
    if (perms.ok && perms.data.length === 0) {
      for (const s of PERMISSIONS_SEED) await createPermission(s);
    }
    const tpls = await listPermissionTemplates();
    if (tpls.ok && tpls.data.length === 0) {
      for (const s of PERMISSION_TEMPLATES_SEED) await createPermissionTemplate(s);
    }
    const logs = await listAuditLogs();
    if (logs.ok && logs.data.length === 0) {
      for (const s of AUDIT_LOGS_SEED) await createAuditLog(s);
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureAccessControlSeeded failed");
  }
}

export function getAccessControlDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "accessControl",
  };
}

export {
  USERS_SEED,
  ROLES_SEED,
  PERMISSIONS_SEED,
  PERMISSION_TEMPLATES_SEED,
  AUDIT_LOGS_SEED,
};
