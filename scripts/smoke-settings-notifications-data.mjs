/**
 * Smoke tests — Settings + Notifications data layer.
 * Run: node scripts/smoke-settings-notifications-data.mjs (after npm run build)
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInThisContext } from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
let passed = 0;
let failed = 0;
const results = [];

function ok(name, cond, detail = "") {
  if (cond) {
    passed += 1;
    results.push(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed += 1;
    results.push(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

ok("settings repository exists", existsSync(join(root, "src/data/repositories/settingsRepository.ts")));
ok(
  "notifications repository exists",
  existsSync(join(root, "src/data/repositories/notificationsRepository.ts")),
);
ok("system settings seed", existsSync(join(root, "src/data/seeds/systemSettingsSeed.ts")));
ok("languages seed", existsSync(join(root, "src/data/seeds/languageSettingsSeed.ts")));
ok("notifications seed", existsSync(join(root, "src/data/seeds/notificationsSeed.ts")));
ok("templates seed", existsSync(join(root, "src/data/seeds/notificationTemplatesSeed.ts")));
ok("settings bridge", existsSync(join(root, "js/settings-data-bridge.js")));
ok("notifications bridge", existsSync(join(root, "js/notifications-data-bridge.js")));
ok(
  "index includes bridges",
  /settings-data-bridge\.js\?v=20260723-settings-notifications-v1/.test(read("index.html")) &&
    /notifications-data-bridge\.js\?v=20260723-settings-notifications-v1/.test(read("index.html")),
);
ok("docs pilot Settings", /Pilot migration: Settings/.test(read("DATA_LAYER_PLAN.md")));
ok("SETTINGS_MODULE_PLAN", existsSync(join(root, "SETTINGS_MODULE_PLAN.md")));
ok("NOTIFICATION_CENTER_PLAN", existsSync(join(root, "NOTIFICATION_CENTER_PLAN.md")));
ok("MILESTONES", existsSync(join(root, "MILESTONES.md")));
ok("MODULES_MAP", existsSync(join(root, "MODULES_MAP.md")));
ok("SYSTEM_ARCHITECTURE", existsSync(join(root, "SYSTEM_ARCHITECTURE_OVERVIEW.md")));
ok(
  "dashboard hydrate settings/notifications",
  /hydrateSettingsFromRepository|hydrateNotificationsFromRepository/.test(read("js/dashboard.js")),
);
ok(
  "localStorage system-settings key",
  /system-settings/.test(read("src/data/adapters/localStorageProvider.ts")),
);

const store = new Map();
globalThis.window = globalThis;
globalThis.document = {
  readyState: "complete",
  addEventListener() {},
  querySelector() {
    return null;
  },
};
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
  key: (i) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "mock" };

const bundlePath = join(root, "js/supabase-bundle.js");
ok("bundle present", existsSync(bundlePath), "run npm run build first");
if (existsSync(bundlePath)) {
  runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
}
runInThisContext(readFileSync(join(root, "js/settings-data-bridge.js"), "utf8"), {
  filename: "settings-data-bridge.js",
});
runInThisContext(readFileSync(join(root, "js/notifications-data-bridge.js"), "utf8"), {
  filename: "notifications-data-bridge.js",
});

const settings = globalThis.CEDataLayer?.settings || globalThis.CESettings;
const notif = globalThis.CEDataLayer?.notifications || globalThis.CENotifications;

ok("CESettings exposed", !!(settings && typeof settings.setSystemSetting === "function"));
ok("CENotifications exposed", !!(notif && typeof notif.createNotification === "function"));
ok("recordAuditLog helper", typeof globalThis.recordAuditLog === "function");
ok("createSystemNotification helper", typeof globalThis.createSystemNotification === "function");

if (settings?.listSystemSettings) {
  const listed = await settings.listSystemSettings();
  ok("listSystemSettings ok", !!listed?.ok, listed?.error || "");
  ok(
    "has default_currency",
    Array.isArray(listed?.data) && listed.data.some((s) => s.key === "default_currency"),
  );

  const set = await settings.setSystemSetting("dashboard_theme", "dark");
  ok("setSystemSetting ok", !!set?.ok, set?.error || "");

  const got = await settings.getSystemSettingByKey("dashboard_theme");
  ok("getSystemSettingByKey ok", !!got?.ok && got.data?.value === "dark", got?.data?.value);

  if (settings.listLanguageSettings) {
    const langs = await settings.listLanguageSettings();
    ok("listLanguageSettings ok", !!langs?.ok, langs?.error || "");
    ok(
      "pt is default",
      langs?.ok && langs.data.some((l) => l.code === "pt" && l.is_default),
    );
  }

  if (settings.setDefaultLanguage) {
    const d = await settings.setDefaultLanguage("en");
    ok("setDefaultLanguage en ok", !!d?.ok, d?.error || "");
    await settings.setDefaultLanguage("pt");
  }

  if (settings.createGlobalCategory) {
    const cat = await settings.createGlobalCategory({
      module: "finance",
      name: "Smoke Category",
      name_pt: "Categoria Smoke",
      status: "Active",
    });
    ok("createGlobalCategory ok", !!cat?.ok, cat?.error || "");
  }
}

if (notif?.listNotifications) {
  const listed = await notif.listNotifications();
  ok("listNotifications ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has notifications",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const created = await notif.createNotification({
    title: "Smoke notification",
    message: "Test message",
    type: "info",
    module: "system",
    priority: "normal",
    scope: "user",
    recipient_user_id: "u-1",
    is_read: false,
  });
  ok("createNotification ok", !!created?.ok, created?.error || "");

  if (created?.ok && notif.markNotificationAsRead) {
    const read = await notif.markNotificationAsRead(created.data.id);
    ok("markNotificationAsRead ok", !!read?.ok && read.data?.is_read, String(read?.data?.is_read));
  }

  if (notif.notify) {
    const n = await notif.notify("fevo_missing_report", {
      recipient_role: "F.E.V.O Coordinator",
      scope: "role",
      vars: {},
    });
    ok("notify template ok", !!n?.ok, n?.error || "");
  }

  if (notif.getNotificationOverviewStats) {
    const stats = await notif.getNotificationOverviewStats();
    ok("getNotificationOverviewStats ok", !!stats?.ok, stats?.error || "");
    ok(
      "overview total number",
      stats?.ok && typeof stats.data?.total === "number",
      String(stats?.data?.total),
    );
  }

  if (notif.getUnreadCountForUser) {
    const c = await notif.getUnreadCountForUser("u-1");
    ok("getUnreadCountForUser ok", !!c?.ok && typeof c.data === "number", String(c?.data));
  }
}

// local persistence
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
store.clear();
if (settings?.setSystemSetting) {
  await settings.setSystemSetting("smoke_local_key", "yes");
  const raw = store.get("ce-data-layer:system-settings");
  ok(
    "local system-settings written",
    !!raw && String(raw).includes("smoke_local_key"),
    raw ? "present" : "missing",
  );
}
if (notif?.createNotification) {
  await notif.createNotification({
    title: "Local Notif",
    message: "persist",
    scope: "user",
    recipient_user_id: "u-1",
  });
  const rawN = store.get("ce-data-layer:notifications");
  ok(
    "local notifications written",
    !!rawN && String(rawN).includes("Local Notif"),
    rawN ? "present" : "missing",
  );
}

// regressions still exposed
ok("programs still exposed", !!(globalThis.CEPrograms || globalThis.CEDataLayer?.programs));
ok(
  "access control still exposed",
  !!(globalThis.CEAccessControlData || globalThis.CEDataLayer?.accessControl),
);

console.log("\n=== Settings + Notifications data layer smoke ===");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
