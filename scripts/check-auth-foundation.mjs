/**
 * Backend Phase 2 — Auth foundation smoke (no real Supabase connection).
 * Run: npm run test:auth-foundation  (after npm run build)
 */
import { existsSync, readFileSync } from "node:fs";
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

const required = [
  "src/data/adapters/supabase/supabaseAuthClient.ts",
  "src/data/repositories/authRepository.ts",
  "supabase/migrations/0002_auth_users_roles_pilot.sql",
  "docs/backend/SUPABASE_AUTH_PILOT_PLAN.md",
  "docs/backend/AUTH_RBAC_PLAN.md",
  ".env.example",
];

for (const p of required) {
  ok(`exists ${p}`, existsSync(join(root, p)));
}

const envEx = read(".env.example");
for (const k of [
  "VITE_ENABLE_SUPABASE",
  "VITE_ENABLE_REAL_AUTH",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
]) {
  ok(`.env.example has ${k}`, envEx.includes(k));
}

const schema = read("database/schema.sql");
ok("schema has auth_user_id", /auth_user_id/i.test(schema));
ok("schema has idx_users_auth_user_id", /idx_users_auth_user_id/i.test(schema));
ok("schema has idx_users_email", /idx_users_email/i.test(schema));
ok("schema has idx_users_role_id", /idx_users_role_id/i.test(schema));
ok("schema has idx_permissions_role_id", /idx_permissions_role_id/i.test(schema));
ok("schema has failed_login_attempts", /failed_login_attempts/i.test(schema));
ok("schema has locked_until", /locked_until/i.test(schema));

const rls = read("database/rls.sql");
ok("rls has current_app_user_id", /current_app_user_id/i.test(rls));
ok("rls has current_app_role_id", /current_app_role_id/i.test(rls));
ok("rls has has_module_permission", /has_module_permission/i.test(rls));

const authClient = read("src/data/adapters/supabase/supabaseAuthClient.ts");
ok("auth client has signInWithEmailPassword", /signInWithEmailPassword/.test(authClient));
ok("auth client has signOut", /export async function signOut/.test(authClient));
ok("auth client never service role key usage", !/SERVICE_ROLE_KEY\s*=/.test(authClient));
ok("auth client documents never service role", /NEVER|never|service role/i.test(authClient));

const authRepo = read("src/data/repositories/authRepository.ts");
ok("authRepository loginDemo", /loginDemo/.test(authRepo));
ok("authRepository loginWithSupabase", /loginWithSupabase/.test(authRepo));
ok("authRepository getAuthInfo", /getAuthInfo/.test(authRepo));
ok("authRepository resolveUserAccountFromAuth", /resolveUserAccountFromAuth/.test(authRepo));

const ac = read("src/data/repositories/accessControlRepository.ts");
ok("getUserByAuthUserId", /getUserByAuthUserId/.test(ac));
ok("linkAuthUserToUser", /linkAuthUserToUser/.test(ac));
ok("unlinkAuthUser", /unlinkAuthUser/.test(ac));
ok("markUserLastLogin", /markUserLastLogin/.test(ac));
ok("updateUserAuthStatus", /updateUserAuthStatus/.test(ac));

const entities = read("src/data/types/entities.ts");
ok("User type has auth_user_id", /auth_user_id/.test(entities));

const seedSql = read("database/seed.sql");
ok("seed comments no passwords", /Do not store passwords|auth_user_id should be linked/i.test(seedSql));

const loginHtml = read("index.html");
ok("login has mode badge", /loginModeBadge/.test(loginHtml));
ok("login has error box", /loginError/.test(loginHtml));

const dash = read("js/dashboard.js");
ok("dashboard enterDashboard async auth path", /resolveAuthApi|loginDemo|CEAuth/.test(dash));
ok("dashboard showLoginError", /showLoginError/.test(dash));

ok(
  "docs pilot plan",
  /Demo Mode|VITE_ENABLE_REAL_AUTH/i.test(read("docs/backend/SUPABASE_AUTH_PILOT_PLAN.md")),
);
ok("DATA_LAYER_PLAN Phase 2", /Backend Phase 2/i.test(read("DATA_LAYER_PLAN.md")));
ok("README real auth pilot", /Real auth pilot|VITE_ENABLE_REAL_AUTH/i.test(read("README.md")));
ok("MILESTONES auth-users-roles", /auth-users-roles-v1/i.test(read("MILESTONES.md")));

const bundlePath = join(root, "js/supabase-bundle.js");
ok("bundle exists", existsSync(bundlePath));

if (existsSync(bundlePath)) {
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
  globalThis.__CE_ENV__ = {
    VITE_DATA_SOURCE: "mock",
    VITE_ENABLE_SUPABASE: "false",
    VITE_ENABLE_REAL_AUTH: "false",
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
  };

  try {
    runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
    const CE = globalThis.CESupabase;
    const Auth = globalThis.CEAuth || CE?.auth;
    ok("CESupabase exists", !!CE);
    ok("CEAuth or CESupabase.auth exists", !!(Auth || CE?.getAuthInfo));

    if (CE?.getAuthInfo || Auth?.getAuthInfo) {
      const info = (Auth?.getAuthInfo || CE.getAuthInfo)();
      ok("getAuthInfo works", !!info && typeof info.message === "string", info?.mode || "");
      ok("default mode is demo", info?.mode === "demo" || info?.realAuthEnabled === false);
    }

    if (Auth?.isRealAuthEnabled || CE?.isRealAuthEnabled) {
      const en = (Auth?.isRealAuthEnabled || CE.isRealAuthEnabled)();
      ok("isRealAuthEnabled false by default", en === false);
    }

    if (Auth?.loginDemo || CE?.loginDemo) {
      const loginDemo = Auth?.loginDemo || CE.loginDemo;
      const r = await loginDemo("admin@ce-mozambique.org", "demo");
      ok("loginDemo super admin", r?.ok === true, r?.data?.email || r?.error || "");
      ok(
        "loginDemo has role",
        r?.ok && /super admin/i.test(String(r.data?.role_name || r.data?.role || "")),
      );
    }

    if (Auth?.loginWithSupabase || CE?.loginWithSupabase) {
      const loginWithSupabase = Auth?.loginWithSupabase || CE.loginWithSupabase;
      // flags false → falls through to demo OR if force real with missing env...
      // enableRealAuth false means loginWithSupabase should call loginDemo
      const r2 = await loginWithSupabase("staff.member@ce-mozambique.org", "demo");
      ok("loginWithSupabase falls back to demo when disabled", r2?.ok === true, r2?.error || "");
    }

    // Simulate misconfigured real auth via env on a fresh call
    globalThis.__CE_ENV__ = {
      VITE_DATA_SOURCE: "mock",
      VITE_ENABLE_SUPABASE: "true",
      VITE_ENABLE_REAL_AUTH: "true",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
    };
    // Note: Vite define baked flags into bundle at build time — runtime __CE_ENV__
    // still used by readEnv in supabaseConfig for some paths.
    if (CE?.getSupabaseAuthStatus) {
      const st = CE.getSupabaseAuthStatus();
      ok("getSupabaseAuthStatus callable", !!st);
    }

    // Access control still available
    ok("createUser still on bundle", typeof CE?.createUser === "function" || typeof CE?.listUsers === "function");
  } catch (e) {
    ok("bundle auth runtime", false, e instanceof Error ? e.message : String(e));
  }
}

console.log(results.join("\n"));
console.log("");
console.log(`Auth foundation: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
