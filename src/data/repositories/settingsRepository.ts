import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  GlobalCategory,
  LanguageSetting,
  NotificationSetting,
  StatusDefinition,
  SystemSetting,
  UiPreference,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { SYSTEM_SETTINGS_SEED } from "../seeds/systemSettingsSeed";
import { GLOBAL_CATEGORIES_SEED } from "../seeds/globalCategoriesSeed";
import { STATUS_DEFINITIONS_SEED } from "../seeds/statusDefinitionsSeed";
import { LANGUAGE_SETTINGS_SEED } from "../seeds/languageSettingsSeed";
import { NOTIFICATION_SETTINGS_SEED } from "../seeds/notificationSettingsSeed";
import { UI_PREFERENCES_SEED } from "../seeds/uiPreferencesSeed";

function fail<T>(error: string, code = "SETTINGS_ERROR"): DataResult<T> {
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

async function softAudit(action: string, entityType: string, entityId: string, details = "") {
  try {
    const root = globalThis as unknown as {
      CEAccessControlData?: { createAuditLog?: (p: Record<string, unknown>) => Promise<unknown> };
      recordAuditLog?: (action: string, payload: Record<string, unknown>) => void;
    };
    if (root.recordAuditLog) {
      root.recordAuditLog(action, { entity_type: entityType, entity_id: entityId, module: "settings", details });
      return;
    }
    const api = root.CEAccessControlData;
    if (api?.createAuditLog) {
      await api.createAuditLog({
        action,
        entity_type: entityType,
        entity_id: entityId,
        module: "settings",
        details,
        severity: "info",
      });
    }
  } catch {
    /* soft */
  }
}

export function normalizeSystemSetting(input: Partial<SystemSetting> & { id?: string }): SystemSetting {
  return {
    ...input,
    id: input.id || `set-${Date.now()}`,
    key: input.key || "",
    value: input.value != null ? String(input.value) : "",
    value_type: input.value_type || "string",
    module: input.module || "global",
    is_sensitive: !!input.is_sensitive,
    is_system: !!input.is_system,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeGlobalCategory(input: Partial<GlobalCategory> & { id?: string }): GlobalCategory {
  return {
    ...input,
    id: input.id || `gcat-${Date.now()}`,
    module: input.module || "global",
    name: input.name || input.name_pt || input.name_en || "",
    name_pt: input.name_pt || input.name || "",
    name_en: input.name_en || input.name || "",
    status: input.status || "Active",
    sort_order: Number(input.sort_order ?? 0),
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeStatusDefinition(
  input: Partial<StatusDefinition> & { id?: string },
): StatusDefinition {
  return {
    ...input,
    id: input.id || `st-${Date.now()}`,
    module: input.module || "global",
    status_key: input.status_key || "",
    label_pt: input.label_pt || input.status_key || "",
    label_en: input.label_en || input.status_key || "",
    severity: input.severity || "neutral",
    sort_order: Number(input.sort_order ?? 0),
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeLanguageSetting(
  input: Partial<LanguageSetting> & { id?: string },
): LanguageSetting {
  return {
    ...input,
    id: input.id || `lang-${Date.now()}`,
    code: input.code || "",
    name: input.name || "",
    is_active: input.is_active !== false,
    is_default: !!input.is_default,
    sort_order: Number(input.sort_order ?? 0),
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeNotificationSetting(
  input: Partial<NotificationSetting> & { id?: string },
): NotificationSetting {
  return {
    ...input,
    id: input.id || `ns-${Date.now()}`,
    module: input.module || "global",
    event_type: input.event_type || "",
    enabled: input.enabled !== false,
    channels: Array.isArray(input.channels) ? input.channels : ["in_app"],
    priority_default: input.priority_default || "normal",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeUiPreference(input: Partial<UiPreference> & { id?: string }): UiPreference {
  return {
    ...input,
    id: input.id || `ui-${Date.now()}`,
    user_id: input.user_id || null,
    key: input.key || "theme",
    value: input.value || input.theme || "dark",
    theme: input.theme || input.value || "dark",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// System settings
export async function listSystemSettings(): Promise<DataResult<SystemSetting[]>> {
  try {
    const r = await getDataProvider().systemSettings.list();
    if (!r.ok) return r as DataResult<SystemSetting[]>;
    return ok((r.data || []).map((x) => normalizeSystemSetting(x as SystemSetting)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listSystemSettings failed");
  }
}

export async function getSystemSettingByKey(key: string) {
  const list = await listSystemSettings();
  if (!list.ok) return list as DataResult<SystemSetting | null>;
  const found = list.data.find((s) => s.key === key) || null;
  return ok(found);
}

export async function setSystemSetting(key: string, value: unknown) {
  const existing = await getSystemSettingByKey(key);
  if (!existing.ok) return existing as DataResult<SystemSetting>;
  if (existing.data) {
    return updateSystemSetting(existing.data.id, { value: String(value) });
  }
  try {
    const row = normalizeSystemSetting({ key, value: String(value), module: "global" });
    const created = await getDataProvider().systemSettings.create!(row);
    if (!created.ok) return created as DataResult<SystemSetting>;
    await softAudit("set_system_setting", "SystemSetting", created.data!.id, key);
    return ok(normalizeSystemSetting(created.data as SystemSetting));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "setSystemSetting failed");
  }
}

export async function updateSystemSetting(id: EntityId, payload: Partial<SystemSetting>) {
  try {
    const r = await getDataProvider().systemSettings.getById(id);
    if (!r.ok || !r.data) return fail("Setting não encontrado", "NOT_FOUND");
    const merged = normalizeSystemSetting({
      ...(r.data as SystemSetting),
      ...payload,
      id,
      value: payload.value != null ? String(payload.value) : (r.data as SystemSetting).value,
    });
    const updated = await getDataProvider().systemSettings.update!(id, merged);
    if (!updated.ok) return updated as DataResult<SystemSetting>;
    await softAudit("update_system_setting", "SystemSetting", id, merged.key || "");
    return ok(normalizeSystemSetting(updated.data as SystemSetting));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateSystemSetting failed");
  }
}

export async function resetSystemSetting(key: string) {
  const seed = SYSTEM_SETTINGS_SEED.find((s) => s.key === key);
  if (!seed) return fail("Setting seed not found", "NOT_FOUND");
  return setSystemSetting(key, seed.value);
}

// Categories
export async function listGlobalCategories(): Promise<DataResult<GlobalCategory[]>> {
  try {
    const r = await getDataProvider().globalCategories.list();
    if (!r.ok) return r as DataResult<GlobalCategory[]>;
    return ok((r.data || []).map((x) => normalizeGlobalCategory(x as GlobalCategory)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listGlobalCategories failed");
  }
}

export async function createGlobalCategory(payload: Partial<GlobalCategory>) {
  try {
    const row = normalizeGlobalCategory(payload);
    const created = await getDataProvider().globalCategories.create!(row);
    if (!created.ok) return created as DataResult<GlobalCategory>;
    return ok(normalizeGlobalCategory(created.data as GlobalCategory));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createGlobalCategory failed");
  }
}

export async function updateGlobalCategory(id: EntityId, payload: Partial<GlobalCategory>) {
  try {
    const r = await getDataProvider().globalCategories.getById(id);
    if (!r.ok || !r.data) return fail("Categoria não encontrada", "NOT_FOUND");
    const merged = normalizeGlobalCategory({ ...(r.data as GlobalCategory), ...payload, id });
    const updated = await getDataProvider().globalCategories.update!(id, merged);
    if (!updated.ok) return updated as DataResult<GlobalCategory>;
    return ok(normalizeGlobalCategory(updated.data as GlobalCategory));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateGlobalCategory failed");
  }
}

export async function deleteGlobalCategory(id: EntityId) {
  try {
    const r = await getDataProvider().globalCategories.remove!(id);
    if (!r.ok) return r as DataResult<boolean>;
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteGlobalCategory failed");
  }
}

export async function getCategoriesByModule(module: string) {
  const list = await listGlobalCategories();
  if (!list.ok) return list;
  const m = sk(module);
  return ok(list.data.filter((c) => sk(c.module) === m));
}

// Status definitions
export async function listStatusDefinitions(): Promise<DataResult<StatusDefinition[]>> {
  try {
    const r = await getDataProvider().statusDefinitions.list();
    if (!r.ok) return r as DataResult<StatusDefinition[]>;
    return ok((r.data || []).map((x) => normalizeStatusDefinition(x as StatusDefinition)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStatusDefinitions failed");
  }
}

export async function createStatusDefinition(payload: Partial<StatusDefinition>) {
  try {
    const row = normalizeStatusDefinition(payload);
    const created = await getDataProvider().statusDefinitions.create!(row);
    if (!created.ok) return created as DataResult<StatusDefinition>;
    return ok(normalizeStatusDefinition(created.data as StatusDefinition));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStatusDefinition failed");
  }
}

export async function updateStatusDefinition(id: EntityId, payload: Partial<StatusDefinition>) {
  try {
    const r = await getDataProvider().statusDefinitions.getById(id);
    if (!r.ok || !r.data) return fail("Status não encontrado", "NOT_FOUND");
    const merged = normalizeStatusDefinition({ ...(r.data as StatusDefinition), ...payload, id });
    const updated = await getDataProvider().statusDefinitions.update!(id, merged);
    if (!updated.ok) return updated as DataResult<StatusDefinition>;
    return ok(normalizeStatusDefinition(updated.data as StatusDefinition));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStatusDefinition failed");
  }
}

export async function getStatusesByModule(module: string) {
  const list = await listStatusDefinitions();
  if (!list.ok) return list;
  const m = sk(module);
  return ok(list.data.filter((s) => sk(s.module) === m || sk(s.module) === "global"));
}

// Languages
export async function listLanguageSettings(): Promise<DataResult<LanguageSetting[]>> {
  try {
    const r = await getDataProvider().languageSettings.list();
    if (!r.ok) return r as DataResult<LanguageSetting[]>;
    return ok((r.data || []).map((x) => normalizeLanguageSetting(x as LanguageSetting)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listLanguageSettings failed");
  }
}

export async function updateLanguageSetting(id: EntityId, payload: Partial<LanguageSetting>) {
  try {
    const r = await getDataProvider().languageSettings.getById(id);
    if (!r.ok || !r.data) return fail("Idioma não encontrado", "NOT_FOUND");
    const merged = normalizeLanguageSetting({ ...(r.data as LanguageSetting), ...payload, id });
    const updated = await getDataProvider().languageSettings.update!(id, merged);
    if (!updated.ok) return updated as DataResult<LanguageSetting>;
    return ok(normalizeLanguageSetting(updated.data as LanguageSetting));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateLanguageSetting failed");
  }
}

export async function getActiveLanguages() {
  const list = await listLanguageSettings();
  if (!list.ok) return list;
  return ok(list.data.filter((l) => l.is_active !== false));
}

export async function setDefaultLanguage(language: string) {
  const list = await listLanguageSettings();
  if (!list.ok) return list as DataResult<LanguageSetting | null>;
  const code = sk(language);
  let target: LanguageSetting | null = null;
  for (const lang of list.data) {
    const isDefault = sk(lang.code) === code;
    await updateLanguageSetting(lang.id, { is_default: isDefault });
    if (isDefault) target = { ...lang, is_default: true };
  }
  await setSystemSetting("default_public_language", code);
  await softAudit("set_default_language", "LanguageSetting", target?.id || code, code);
  return ok(target);
}

// Notification settings
export async function listNotificationSettings(): Promise<DataResult<NotificationSetting[]>> {
  try {
    const r = await getDataProvider().notificationSettings.list();
    if (!r.ok) return r as DataResult<NotificationSetting[]>;
    return ok((r.data || []).map((x) => normalizeNotificationSetting(x as NotificationSetting)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listNotificationSettings failed");
  }
}

export async function updateNotificationSetting(
  id: EntityId,
  payload: Partial<NotificationSetting>,
) {
  try {
    const r = await getDataProvider().notificationSettings.getById(id);
    if (!r.ok || !r.data) return fail("Notification setting não encontrado", "NOT_FOUND");
    const merged = normalizeNotificationSetting({
      ...(r.data as NotificationSetting),
      ...payload,
      id,
    });
    const updated = await getDataProvider().notificationSettings.update!(id, merged);
    if (!updated.ok) return updated as DataResult<NotificationSetting>;
    return ok(normalizeNotificationSetting(updated.data as NotificationSetting));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateNotificationSetting failed");
  }
}

export async function getNotificationSettingsByRole(roleId: string) {
  const list = await listNotificationSettings();
  if (!list.ok) return list;
  const r = sk(roleId);
  return ok(
    list.data.filter((s) => sk(s.role_id) === r || sk(s.role_name) === r),
  );
}

export async function getNotificationSettingsByModule(module: string) {
  const list = await listNotificationSettings();
  if (!list.ok) return list;
  const m = sk(module);
  return ok(list.data.filter((s) => sk(s.module) === m));
}

// UI preferences
export async function listUiPreferences(): Promise<DataResult<UiPreference[]>> {
  try {
    const r = await getDataProvider().uiPreferences.list();
    if (!r.ok) return r as DataResult<UiPreference[]>;
    return ok((r.data || []).map((x) => normalizeUiPreference(x as UiPreference)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listUiPreferences failed");
  }
}

export async function updateUiPreference(id: EntityId, payload: Partial<UiPreference>) {
  try {
    const r = await getDataProvider().uiPreferences.getById(id);
    if (!r.ok || !r.data) {
      // create if missing
      const row = normalizeUiPreference({ ...payload, id });
      const created = await getDataProvider().uiPreferences.create!(row);
      if (!created.ok) return created as DataResult<UiPreference>;
      return ok(normalizeUiPreference(created.data as UiPreference));
    }
    const merged = normalizeUiPreference({ ...(r.data as UiPreference), ...payload, id });
    const updated = await getDataProvider().uiPreferences.update!(id, merged);
    if (!updated.ok) return updated as DataResult<UiPreference>;
    return ok(normalizeUiPreference(updated.data as UiPreference));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateUiPreference failed");
  }
}

export async function getUiPreferencesByUser(userId: EntityId) {
  const list = await listUiPreferences();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.user_id === userId));
}

export async function ensureSettingsSeeded(): Promise<DataResult<boolean>> {
  try {
    const p = getDataProvider();
    async function seed<T extends { id: string }>(
      listFn: () => Promise<DataResult<T[]>>,
      createFn: (row: T) => Promise<DataResult<T>>,
      rows: T[],
    ) {
      const existing = await listFn();
      if (existing.ok && existing.data.length) return;
      for (const row of rows) await createFn(row);
    }
    await seed(
      listSystemSettings,
      (r) => p.systemSettings.create!(normalizeSystemSetting(r)),
      SYSTEM_SETTINGS_SEED as SystemSetting[],
    );
    await seed(
      listGlobalCategories,
      (r) => p.globalCategories.create!(normalizeGlobalCategory(r)),
      GLOBAL_CATEGORIES_SEED as GlobalCategory[],
    );
    await seed(
      listStatusDefinitions,
      (r) => p.statusDefinitions.create!(normalizeStatusDefinition(r)),
      STATUS_DEFINITIONS_SEED as StatusDefinition[],
    );
    await seed(
      listLanguageSettings,
      (r) => p.languageSettings.create!(normalizeLanguageSetting(r)),
      LANGUAGE_SETTINGS_SEED as LanguageSetting[],
    );
    await seed(
      listNotificationSettings,
      (r) => p.notificationSettings.create!(normalizeNotificationSetting(r)),
      NOTIFICATION_SETTINGS_SEED as NotificationSetting[],
    );
    await seed(
      listUiPreferences,
      (r) => p.uiPreferences.create!(normalizeUiPreference(r)),
      UI_PREFERENCES_SEED as UiPreference[],
    );
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureSettingsSeeded failed");
  }
}

export function getSettingsDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "settings",
  };
}

export {
  SYSTEM_SETTINGS_SEED,
  GLOBAL_CATEGORIES_SEED,
  STATUS_DEFINITIONS_SEED,
  LANGUAGE_SETTINGS_SEED,
  NOTIFICATION_SETTINGS_SEED,
  UI_PREFERENCES_SEED,
};

export const settingsRepository = {
  listSystemSettings,
  getSystemSettingByKey,
  setSystemSetting,
  updateSystemSetting,
  resetSystemSetting,
  listGlobalCategories,
  createGlobalCategory,
  updateGlobalCategory,
  deleteGlobalCategory,
  getCategoriesByModule,
  listStatusDefinitions,
  createStatusDefinition,
  updateStatusDefinition,
  getStatusesByModule,
  listLanguageSettings,
  updateLanguageSetting,
  getActiveLanguages,
  setDefaultLanguage,
  listNotificationSettings,
  updateNotificationSetting,
  getNotificationSettingsByRole,
  getNotificationSettingsByModule,
  listUiPreferences,
  updateUiPreference,
  getUiPreferencesByUser,
  ensureSettingsSeeded,
  getSettingsDataSourceInfo,
  getInfo: getSettingsDataSourceInfo,
};
