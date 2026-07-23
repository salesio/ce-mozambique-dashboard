/**
 * Smoke tests — Users, Roles & Access Control data layer.
 * Run: node scripts/smoke-access-control-data.mjs  (after npm run build)
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

ok("access control repository exists", existsSync(join(root, "src/data/repositories/accessControlRepository.ts")));
ok("users seed exists", existsSync(join(root, "src/data/seeds/usersSeed.ts")));
ok("roles seed exists", existsSync(join(root, "src/data/seeds/rolesSeed.ts")));
ok("permissions seed exists", existsSync(join(root, "src/data/seeds/permissionsSeed.ts")));
ok("templates seed exists", existsSync(join(root, "src/data/seeds/permissionTemplatesSeed.ts")));
ok("audit logs seed exists", existsSync(join(root, "src/data/seeds/auditLogsSeed.ts")));
ok("access control bridge exists", existsSync(join(root, "js/access-control-data-bridge.js")));
ok(
  "index includes access control bridge",
  /access-control-data-bridge\.js\?v=20260723-access-control-data-v1/.test(read("index.html")),
);
ok("docs pilot Access Control", /Pilot migration: Users, Roles & Access Control/.test(read("DATA_LAYER_PLAN.md")));
ok("ACCESS_CONTROL_PLAN exists", existsSync(join(root, "ACCESS_CONTROL_PLAN.md")));
ok("README mentions Access Control", /Access Control|Users \/ Roles/.test(read("README.md")));
ok(
  "dashboard access denied audit",
  /logAccessDenied|access_denied|hydrateAccessControlFromRepository/.test(read("js/dashboard.js")),
);
ok("no password storage in repo", !/password_hash|bcrypt/.test(read("src/data/repositories/accessControlRepository.ts")));

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

// Load live access-control first (templates), then bundle, then data bridge
runInThisContext(readFileSync(join(root, "js/access-control.js"), "utf8"), {
  filename: "access-control.js",
});
ok("CEAccessControl templates present", !!globalThis.CEAccessControl?.ROLE_TEMPLATES);

const bundlePath = join(root, "js/supabase-bundle.js");
ok("bundle present", existsSync(bundlePath), "run npm run build first");
if (existsSync(bundlePath)) {
  runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
}
runInThisContext(readFileSync(join(root, "js/access-control-data-bridge.js"), "utf8"), {
  filename: "access-control-data-bridge.js",
});

const api =
  globalThis.CEDataLayer?.accessControl ||
  globalThis.CEAccessControlData ||
  globalThis.CESupabase;
ok("access control API exposed", !!(api && typeof api.createUser === "function"));
ok("canUser preserved on CEAccessControl", typeof globalThis.CEAccessControl?.canUser === "function");
ok(
  "resolveModuleAccess still works",
  typeof globalThis.CEAccessControl?.resolveModuleAccess === "function",
);

const admin = { id: "u-1", role: "Super Admin", department_permissions: ["*"], name: "Admin" };
const staff = {
  id: "u-13",
  role: "Staff Member",
  department_permissions: ["assignedEquipment"],
  name: "Staff",
};
ok(
  "Super Admin can view finance",
  !!globalThis.CEAccessControl.canUser(admin, "finance", "view"),
);
ok(
  "Staff Member cannot view finance",
  !globalThis.CEAccessControl.canUser(staff, "finance", "view"),
);
ok(
  "Staff Member cannot view salary",
  !globalThis.CEAccessControl.canUser(staff, "staffHr", "view_salary"),
);
const hr = { id: "u-19", role: "HR Manager", department_permissions: ["staffHr"], name: "HR" };
ok(
  "HR can view staffHr",
  !!globalThis.CEAccessControl.resolveModuleAccess(hr, "staffHr")?.can_view,
);

if (api?.listUsers) {
  const listed = await api.listUsers();
  ok("listUsers ok", !!listed?.ok, listed?.error || "");
  ok("seed has users", Array.isArray(listed?.data) && listed.data.length > 0, String(listed?.data?.length || 0));

  const created = await api.createUser({
    name: "Smoke Access User",
    email: "smoke.access@ce-mozambique.org",
    role: "Viewer",
    role_name: "Viewer",
    church_id: "church-hq",
    department_permissions: ["reports"],
    status: "Active",
    password: "SHOULD_NOT_PERSIST",
  });
  ok("createUser ok", !!created?.ok, created?.error || "");
  ok("no password field stored", created?.data?.password == null);
  ok(
    "user Active",
    /active|activo/i.test(String(created?.data?.status || "")),
    String(created?.data?.status),
  );

  if (created?.ok && api.updateUserRole) {
    const roleUp = await api.updateUserRole(created.data.id, "role-staff-member", "Staff Member");
    ok("updateUserRole ok", !!roleUp?.ok, roleUp?.error || "");
  }

  if (created?.ok && api.linkUserToStaff) {
    const linked = await api.linkUserToStaff(created.data.id, "staff-4", "Laiza Teresa Chirindza");
    ok("linkUserToStaff ok", !!linked?.ok, linked?.error || "");
    ok(
      "staff_id linked",
      linked?.data?.staff_id === "staff-4",
      String(linked?.data?.staff_id),
    );
  }

  if (api.createRole) {
    const role = await api.createRole({
      name: "Smoke Custom Role",
      display_name: "Smoke Custom Role",
      level: "Staff",
      is_custom_role: true,
      is_system_role: false,
      default_scope: "own",
      status: "Active",
    });
    ok("createRole ok", !!role?.ok, role?.error || "");
  }

  if (api.createAuditLog) {
    const log = await api.createAuditLog({
      user_id: "u-13",
      user_name: "Staff Member Demo",
      user_role: "Staff Member",
      module: "finance",
      action: "access_denied",
      description: "Smoke access denied",
      severity: "warning",
    });
    ok("createAuditLog ok", !!log?.ok, log?.error || "");
    ok("audit action access_denied", log?.data?.action === "access_denied");
  }

  if (api.listRoles) {
    const roles = await api.listRoles();
    ok("listRoles ok", !!roles?.ok && roles.data.length > 0, String(roles?.data?.length || 0));
  }

  if (api.listPermissionTemplates) {
    const tpls = await api.listPermissionTemplates();
    ok("listPermissionTemplates ok", !!tpls?.ok && tpls.data.length > 0, String(tpls?.data?.length || 0));
  }

  // Local persistence
  globalThis.__CE_ENV__.VITE_DATA_SOURCE = "local";
  if (typeof globalThis.CEDataLayer?.resetDataProvider === "function") {
    globalThis.CEDataLayer.resetDataProvider();
  }
  const bridge = globalThis.CEAccessControlData;
  if (bridge?.createUser) {
    const localUser = await bridge.createUser({
      id: "u-local-smoke",
      name: "Local Persist User",
      email: "local.smoke@ce-mozambique.org",
      role: "Viewer",
      status: "Active",
    });
    ok("local create user ok", !!localUser?.ok, localUser?.error || "");
    const raw = globalThis.localStorage.getItem("ce-data-layer:users");
    ok(
      "local key users written",
      !!raw && raw.includes("u-local-smoke"),
      raw ? `len=${raw.length}` : "empty",
    );
  }

  if (bridge?.createAuditLog) {
    await bridge.createAuditLog({
      id: "audit-local-smoke",
      action: "export",
      module: "reports",
      user_name: "Admin",
      severity: "warning",
    });
    const rawAudit = globalThis.localStorage.getItem("ce-data-layer:audit-logs");
    ok(
      "local key audit-logs written",
      !!rawAudit && rawAudit.includes("audit-local-smoke"),
      rawAudit ? `len=${rawAudit.length}` : "empty",
    );
  }

  const info = api.getInfo?.() || api.getAccessControlDataSourceInfo?.();
  ok("getInfo available", !!info, JSON.stringify(info || {}));
}

// Regression: other domains still on globals
ok(
  "staff HR still exposed",
  !!(globalThis.CEDataLayer?.staffHR || globalThis.CEStaffHR || globalThis.CESupabase?.createStaff),
);
ok(
  "finance still exposed",
  !!(globalThis.CEDataLayer?.finance || globalThis.CEFinance || globalThis.CESupabase?.createFinanceRecord),
);
ok(
  "ROLE_TEMPLATES not wiped",
  !!globalThis.CEAccessControl?.ROLE_TEMPLATES?.["Super Admin"],
);

console.log(results.join("\n"));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
