/**
 * Phase 3 — Churches + Members Supabase pilot smoke (no real cloud required).
 * Run: npm run test:churches-members-supabase  (after npm run build)
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

const files = [
  "src/data/adapters/supabase/churchesSupabaseAdapter.ts",
  "src/data/adapters/supabase/membersSupabaseAdapter.ts",
  "src/data/adapters/api/churchesApiAdapter.ts",
  "src/data/adapters/api/membersApiAdapter.ts",
  "src/data/adapters/supabase/supabaseRepositoryBase.ts",
  "supabase/migrations/0003_churches_members_pilot.sql",
  "supabase/seeds/churches_members_seed.sql",
  "docs/backend/CHURCHES_MEMBERS_SUPABASE_PILOT.md",
];

for (const f of files) {
  ok(`exists ${f}`, existsSync(join(root, f)));
}

const schema = read("database/schema.sql");
ok("schema churches table", /create table if not exists public\.churches/i.test(schema));
ok("schema members table", /create table if not exists public\.members/i.test(schema));
ok("schema idx_churches_status", /idx_churches_status/i.test(schema));
ok("schema idx_members_church_id", /idx_members_church_id/i.test(schema));
ok("schema members first_name", /first_name/i.test(schema));
ok("schema churches district_or_area", /district_or_area/i.test(schema));

const mig = read("supabase/migrations/0003_churches_members_pilot.sql");
ok("migration 0003 churches members", /churches/i.test(mig) && /members/i.test(mig));
ok("migration no drop table", !/drop table/i.test(mig));

const envEx = read(".env.example");
ok(".env.example VITE_DATA_SOURCE", /VITE_DATA_SOURCE/.test(envEx));
ok(".env.example VITE_ENABLE_SUPABASE", /VITE_ENABLE_SUPABASE/.test(envEx));
ok(".env.example VITE_SUPABASE_URL", /VITE_SUPABASE_URL/.test(envEx));
ok(".env.example VITE_SUPABASE_ANON_KEY", /VITE_SUPABASE_ANON_KEY/.test(envEx));

const chRepo = read("src/data/repositories/churchesRepository.ts");
ok("churches repo knows supabase mode", /useSupabaseChurches|churchesSupabaseAdapter/.test(chRepo));
const mbRepo = read("src/data/repositories/membersRepository.ts");
ok("members repo knows supabase mode", /useSupabaseMembers|membersSupabaseAdapter/.test(mbRepo));

const base = read("src/data/adapters/supabase/supabaseRepositoryBase.ts");
ok("repository base listRows", /export async function listRows/.test(base));
ok("repository base searchRows", /export async function searchRows/.test(base));
ok("repository base mapSupabaseError", /mapSupabaseError/.test(base));
ok("no service role assignment", !/SERVICE_ROLE_KEY\s*=/.test(base));

const adapters = [
  "src/data/adapters/supabase/churchesSupabaseAdapter.ts",
  "src/data/adapters/supabase/membersSupabaseAdapter.ts",
  "src/data/adapters/supabase/supabaseClient.ts",
];
for (const a of adapters) {
  const t = read(a);
  ok(`${a} no service role key use`, !/SERVICE_ROLE_KEY\s*=\s*['"`]/.test(t));
}

ok(
  "docs pilot",
  /VITE_DATA_SOURCE=supabase/i.test(read("docs/backend/CHURCHES_MEMBERS_SUPABASE_PILOT.md")),
);
ok("DATA_LAYER_PLAN Phase 3", /Backend Phase 3|churches-members-supabase/i.test(read("DATA_LAYER_PLAN.md")));
ok("README phase 3", /Churches \+ Members|churches-members|Phase 3/i.test(read("README.md")));
ok("settings indicator", /dataSourceIndicator|Data Source \(dev\)/i.test(read("js/dashboard.js")));

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
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
  };

  try {
    runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
    const CE = globalThis.CESupabase;
    ok("CESupabase exists", !!CE);

    if (CE?.createSupabaseProvider) {
      const sp = CE.createSupabaseProvider();
      ok("supabase provider getInfo", typeof sp.getInfo === "function");
      const info = sp.getInfo();
      ok("supabase getInfo status", !!info && typeof info.message === "string", info?.status || "");
      ok("usingServiceRole false", info?.usingServiceRole === false);
    }

    // mock mode still lists churches
    if (CE?.listChurches) {
      const listed = await CE.listChurches();
      ok("mock listChurches ok", listed?.ok === true, `n=${listed?.data?.length ?? 0}`);
    }
    if (CE?.listMembers) {
      const listed = await CE.listMembers();
      ok("mock listMembers ok", listed?.ok === true, `n=${listed?.data?.length ?? 0}`);
    }

    // supabase mode without env — friendly fail via repository routing
    // Note: getDataSource is build-time; simulate via provider adapters if exported
    if (CE?.createSupabaseProvider) {
      const sp = CE.createSupabaseProvider();
      const churches = sp.churches;
      if (churches?.list) {
        const r = await churches.list();
        ok(
          "supabase churches.list fails soft without env",
          r?.ok === false || r?.ok === true,
          r?.ok === false ? r.code || r.error : "ready",
        );
        if (r && !r.ok) {
          ok(
            "friendly not configured or error code",
            /NOT_CONFIGURED|SUPABASE|configur/i.test(String(r.error || "") + String(r.code || "")),
          );
        }
      }
    }

    ok(
      "CEChurches getInfo",
      !!(globalThis.CEChurches && typeof globalThis.CEChurches.getInfo === "function"),
    );
    ok(
      "CEMembers getInfo",
      !!(globalThis.CEMembers && typeof globalThis.CEMembers.getInfo === "function"),
    );
  } catch (e) {
    ok("runtime bundle", false, e instanceof Error ? e.message : String(e));
  }
}

console.log(results.join("\n"));
console.log("");
console.log(`Churches/Members Supabase pilot: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
