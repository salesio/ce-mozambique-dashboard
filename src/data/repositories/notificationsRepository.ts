import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type { EntityId, Notification, NotificationTemplate } from "../types/entities";
import type { DataResult } from "../types/repository";
import { NOTIFICATIONS_SEED } from "../seeds/notificationsSeed";
import { NOTIFICATION_TEMPLATES_SEED } from "../seeds/notificationTemplatesSeed";

function fail<T>(error: string, code = "NOTIFICATIONS_ERROR"): DataResult<T> {
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
    .toLowerCase();
}

function fillTemplate(template: string, vars: Record<string, unknown> = {}): string {
  return String(template || "").replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(vars[key] ?? ""),
  );
}

export function normalizeNotification(input: Partial<Notification> & { id?: string }): Notification {
  return {
    ...input,
    id: input.id || `not-${Date.now()}`,
    title: input.title || "",
    message: input.message || input.body || "",
    body: input.body || input.message || "",
    type: input.type || "info",
    module: input.module || "system",
    priority: input.priority || "normal",
    scope: input.scope || "national",
    is_read: !!input.is_read,
    is_archived: !!input.is_archived,
    recipient_user_id: input.recipient_user_id || input.userId || null,
    userId: input.userId || input.recipient_user_id || null,
    read_at: input.read_at || input.readAt || null,
    readAt: input.readAt || input.read_at || null,
    created_at: input.created_at || input.createdAt || nowIso(),
    createdAt: (input.createdAt || input.created_at || nowIso()) as string,
    metadata: input.metadata || {},
  };
}

export function normalizeNotificationTemplate(
  input: Partial<NotificationTemplate> & { id?: string },
): NotificationTemplate {
  return {
    ...input,
    id: input.id || `ntpl-${Date.now()}`,
    event_type: input.event_type || "",
    module: input.module || "system",
    default_type: input.default_type || "info",
    default_priority: input.default_priority || "normal",
    recipient_strategy: input.recipient_strategy || "role",
    is_active: input.is_active !== false,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export async function listNotifications(): Promise<DataResult<Notification[]>> {
  try {
    const r = await getDataProvider().notifications.list();
    if (!r.ok) return r as DataResult<Notification[]>;
    return ok((r.data || []).map((x) => normalizeNotification(x as Notification)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listNotifications failed");
  }
}

export async function getNotificationById(id: EntityId) {
  try {
    const r = await getDataProvider().notifications.getById(id);
    if (!r.ok) return r as DataResult<Notification | null>;
    return ok(r.data ? normalizeNotification(r.data as Notification) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getNotificationById failed");
  }
}

export async function createNotification(payload: Partial<Notification>) {
  try {
    const row = normalizeNotification(payload);
    const created = await getDataProvider().notifications.create!(row);
    if (!created.ok) return created as DataResult<Notification>;
    return ok(normalizeNotification(created.data as Notification));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createNotification failed");
  }
}

export async function updateNotification(id: EntityId, payload: Partial<Notification>) {
  try {
    const existing = await getNotificationById(id);
    if (!existing.ok || !existing.data) return fail("Notificação não encontrada", "NOT_FOUND");
    const merged = normalizeNotification({ ...existing.data, ...payload, id });
    const r = await getDataProvider().notifications.update!(id, merged);
    if (!r.ok) return r as DataResult<Notification>;
    return ok(normalizeNotification(r.data as Notification));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateNotification failed");
  }
}

export async function deleteNotification(id: EntityId) {
  try {
    const r = await getDataProvider().notifications.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteNotification failed");
  }
}

export async function getNotificationsByUser(userId: EntityId) {
  const list = await listNotifications();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (n) =>
        n.recipient_user_id === userId ||
        n.userId === userId ||
        n.scope === "national" ||
        n.scope === "all",
    ),
  );
}

export async function getNotificationsByRole(roleId: string) {
  const list = await listNotifications();
  if (!list.ok) return list;
  const r = sk(roleId);
  return ok(
    list.data.filter(
      (n) => sk(n.recipient_role) === r || sk(n.recipient_role_name) === r || sk(n.recipient_role_id) === r,
    ),
  );
}

export async function getNotificationsByDepartment(departmentId: EntityId) {
  const list = await listNotifications();
  if (!list.ok) return list;
  return ok(list.data.filter((n) => n.recipient_department_id === departmentId));
}

export async function getNotificationsByChurch(churchId: EntityId) {
  const list = await listNotifications();
  if (!list.ok) return list;
  return ok(list.data.filter((n) => n.recipient_church_id === churchId || n.scope === "national"));
}

export async function getUnreadNotifications(userId: EntityId) {
  const list = await getNotificationsByUser(userId);
  if (!list.ok) return list;
  return ok(list.data.filter((n) => !n.is_read && !n.is_archived));
}

export async function getReadNotifications(userId: EntityId) {
  const list = await getNotificationsByUser(userId);
  if (!list.ok) return list;
  return ok(list.data.filter((n) => n.is_read));
}

export async function getNotificationsByModule(module: string) {
  const list = await listNotifications();
  if (!list.ok) return list;
  const m = sk(module);
  return ok(list.data.filter((n) => sk(n.module) === m));
}

export async function getNotificationsByType(type: string) {
  const list = await listNotifications();
  if (!list.ok) return list;
  const t = sk(type);
  return ok(list.data.filter((n) => sk(n.type) === t));
}

export async function getNotificationsByPriority(priority: string) {
  const list = await listNotifications();
  if (!list.ok) return list;
  const p = sk(priority);
  return ok(list.data.filter((n) => sk(n.priority) === p));
}

export async function markNotificationAsRead(id: EntityId, _payload = {}) {
  return updateNotification(id, { is_read: true, read_at: nowIso(), readAt: nowIso() });
}

export async function markNotificationAsUnread(id: EntityId, _payload = {}) {
  return updateNotification(id, { is_read: false, read_at: null, readAt: null });
}

export async function markAllNotificationsAsRead(userId: EntityId) {
  const list = await getUnreadNotifications(userId);
  if (!list.ok) return list as DataResult<number>;
  let count = 0;
  for (const n of list.data) {
    const r = await markNotificationAsRead(n.id);
    if (r.ok) count += 1;
  }
  return ok(count);
}

export async function archiveNotification(id: EntityId, _payload = {}) {
  return updateNotification(id, { is_archived: true, archived_at: nowIso() });
}

export async function deleteExpiredNotifications() {
  const list = await listNotifications();
  if (!list.ok) return list as DataResult<number>;
  const now = Date.now();
  let count = 0;
  for (const n of list.data) {
    if (n.expires_at && new Date(n.expires_at).getTime() < now) {
      const r = await deleteNotification(n.id);
      if (r.ok) count += 1;
    }
  }
  return ok(count);
}

// Templates
export async function listNotificationTemplates(): Promise<DataResult<NotificationTemplate[]>> {
  try {
    const r = await getDataProvider().notificationTemplates.list();
    if (!r.ok) return r as DataResult<NotificationTemplate[]>;
    return ok((r.data || []).map((x) => normalizeNotificationTemplate(x as NotificationTemplate)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listNotificationTemplates failed");
  }
}

export async function getNotificationTemplateById(id: EntityId) {
  try {
    const r = await getDataProvider().notificationTemplates.getById(id);
    if (!r.ok) return r as DataResult<NotificationTemplate | null>;
    return ok(r.data ? normalizeNotificationTemplate(r.data as NotificationTemplate) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getNotificationTemplateById failed");
  }
}

export async function createNotificationTemplate(payload: Partial<NotificationTemplate>) {
  try {
    const row = normalizeNotificationTemplate(payload);
    const created = await getDataProvider().notificationTemplates.create!(row);
    if (!created.ok) return created as DataResult<NotificationTemplate>;
    return ok(normalizeNotificationTemplate(created.data as NotificationTemplate));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createNotificationTemplate failed");
  }
}

export async function updateNotificationTemplate(
  id: EntityId,
  payload: Partial<NotificationTemplate>,
) {
  try {
    const existing = await getNotificationTemplateById(id);
    if (!existing.ok || !existing.data) return fail("Template não encontrado", "NOT_FOUND");
    const merged = normalizeNotificationTemplate({ ...existing.data, ...payload, id });
    const r = await getDataProvider().notificationTemplates.update!(id, merged);
    if (!r.ok) return r as DataResult<NotificationTemplate>;
    return ok(normalizeNotificationTemplate(r.data as NotificationTemplate));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateNotificationTemplate failed");
  }
}

export async function getTemplatesByModule(module: string) {
  const list = await listNotificationTemplates();
  if (!list.ok) return list;
  const m = sk(module);
  return ok(list.data.filter((t) => sk(t.module) === m));
}

export async function getTemplatesByEvent(eventType: string) {
  const list = await listNotificationTemplates();
  if (!list.ok) return list;
  const e = sk(eventType);
  return ok(list.data.filter((t) => sk(t.event_type) === e && t.is_active !== false));
}

/**
 * Create notification from template eventType + payload vars.
 * Safe fallback if template missing.
 */
export async function notify(
  eventType: string,
  payload: Record<string, unknown> = {},
): Promise<DataResult<Notification[]>> {
  try {
    const templates = await getTemplatesByEvent(eventType);
    const tpl = templates.ok && templates.data.length ? templates.data[0] : null;
    const lang = String(payload.lang || "pt");
    const vars = (payload.vars as Record<string, unknown>) || payload;
    const title = tpl
      ? fillTemplate(
          lang === "en"
            ? tpl.title_template_en || tpl.title_template_pt || ""
            : lang === "fr"
              ? tpl.title_template_fr || tpl.title_template_pt || ""
              : tpl.title_template_pt || "",
          vars,
        )
      : String(payload.title || eventType);
    const message = tpl
      ? fillTemplate(
          lang === "en"
            ? tpl.message_template_en || tpl.message_template_pt || ""
            : lang === "fr"
              ? tpl.message_template_fr || tpl.message_template_pt || ""
              : tpl.message_template_pt || "",
          vars,
        )
      : String(payload.message || "");

    const recipients = Array.isArray(payload.recipients)
      ? (payload.recipients as Partial<Notification>[])
      : [
          {
            scope: String(payload.scope || "role"),
            recipient_user_id: (payload.recipient_user_id as string) || null,
            recipient_role: String(payload.recipient_role || payload.role || ""),
            recipient_department_id: (payload.recipient_department_id as string) || null,
            recipient_church_id: (payload.recipient_church_id as string) || null,
          },
        ];

    const created: Notification[] = [];
    for (const recipient of recipients) {
      const row = await createNotification({
        title,
        message,
        type: String(payload.type || tpl?.default_type || "info"),
        module: String(payload.module || tpl?.module || "system"),
        entity_type: String(payload.entity_type || ""),
        entity_id: (payload.entity_id as string) || null,
        entity_label: String(payload.entity_label || ""),
        priority: String(payload.priority || tpl?.default_priority || "normal"),
        scope: recipient.scope || "role",
        recipient_user_id: recipient.recipient_user_id || null,
        recipient_role: recipient.recipient_role || "",
        recipient_department_id: recipient.recipient_department_id || null,
        recipient_church_id: recipient.recipient_church_id || null,
        action_url: String(payload.action_url || ""),
        action_label: String(payload.action_label || "Ver"),
        metadata: (payload.metadata as Record<string, unknown>) || vars,
      });
      if (row.ok && row.data) created.push(row.data);
    }
    return ok(created);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "notify failed");
  }
}

export async function getNotificationOverviewStats(_filters = {}) {
  const list = await listNotifications();
  if (!list.ok) return list as DataResult<Record<string, number>>;
  const data = list.data;
  return ok({
    total: data.length,
    unread: data.filter((n) => !n.is_read).length,
    urgent: data.filter((n) => /urgent|critical/i.test(String(n.priority || n.type || ""))).length,
    actionRequired: data.filter((n) =>
      /action_required|approval_required/i.test(String(n.type || "")),
    ).length,
    archived: data.filter((n) => n.is_archived).length,
  });
}

export async function getUnreadCountForUser(userId: EntityId) {
  const list = await getUnreadNotifications(userId);
  if (!list.ok) return list as DataResult<number>;
  return ok(list.data.length);
}

export async function getCriticalNotifications(userId: EntityId) {
  const list = await getNotificationsByUser(userId);
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (n) =>
        !n.is_archived &&
        /urgent|critical|high/i.test(String(n.priority || "")) &&
        !n.is_read,
    ),
  );
}

export async function getTodayNotifications(userId: EntityId) {
  const list = await getNotificationsByUser(userId);
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter((n) => String(n.created_at || n.createdAt || "").startsWith(today)),
  );
}

export async function ensureNotificationsSeeded(): Promise<DataResult<boolean>> {
  try {
    const p = getDataProvider();
    const existing = await listNotifications();
    if (!existing.ok || !existing.data.length) {
      for (const row of NOTIFICATIONS_SEED) {
        await p.notifications.create!(normalizeNotification(row));
      }
    }
    const tpls = await listNotificationTemplates();
    if (!tpls.ok || !tpls.data.length) {
      for (const row of NOTIFICATION_TEMPLATES_SEED) {
        await p.notificationTemplates.create!(normalizeNotificationTemplate(row));
      }
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureNotificationsSeeded failed");
  }
}

export function getNotificationsDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "notifications",
  };
}

export { NOTIFICATIONS_SEED, NOTIFICATION_TEMPLATES_SEED };

export const notificationsRepository = {
  listNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByUser,
  getNotificationsByRole,
  getNotificationsByDepartment,
  getNotificationsByChurch,
  getUnreadNotifications,
  getReadNotifications,
  getNotificationsByModule,
  getNotificationsByType,
  getNotificationsByPriority,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  archiveNotification,
  deleteExpiredNotifications,
  listNotificationTemplates,
  getNotificationTemplateById,
  createNotificationTemplate,
  updateNotificationTemplate,
  getTemplatesByModule,
  getTemplatesByEvent,
  notify,
  getNotificationOverviewStats,
  getUnreadCountForUser,
  getCriticalNotifications,
  getTodayNotifications,
  ensureNotificationsSeeded,
  getNotificationsDataSourceInfo,
  getInfo: getNotificationsDataSourceInfo,
};
