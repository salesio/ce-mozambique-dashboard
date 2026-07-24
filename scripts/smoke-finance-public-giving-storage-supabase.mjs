/**
 * Phase 5 — Finance + Public Giving + Storage pilot smoke (no cloud required).
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
  "src/data/adapters/supabase/financeSupabaseAdapter.ts",
  "src/data/adapters/supabase/publicGivingSupabaseAdapter.ts",
  "src/data/adapters/supabase/financeDisbursementsSupabaseAdapter.ts",
  "src/data/adapters/supabase/documentsSupabaseAdapter.ts",
  "src/data/adapters/supabase/supabaseStorageClient.ts",
  "src/data/adapters/api/financeApiAdapter.ts",
  "src/data/adapters/api/publicGivingApiAdapter.ts",
  "src/data/adapters/api/documentsApiAdapter.ts",
  "supabase/migrations/0005_finance_public_giving_storage_pilot.sql",
  "supabase/seeds/finance_public_giving_seed.sql",
  "docs/backend/FINANCE_PUBLIC_GIVING_STORAGE_SUPABASE_PILOT.md",
];
for (const f of files) ok(`exists ${f}`, existsSync(join(root, f)));

const schema = read("database/schema.sql");
ok("schema finance_records", /create table if not exists public\.finance_records/i.test(schema));
ok("schema public_giving", /create table if not exists public\.public_giving_submissions/i.test(schema));
ok("schema finance_disbursements", /create table if not exists public\.finance_disbursements/i.test(schema));
ok("schema documents", /create table if not exists public\.documents/i.test(schema));
ok("idx_finance_records_status", /idx_finance_records_status/i.test(schema));
ok("idx_public_giving_status", /idx_public_giving_status/i.test(schema));
ok("idx_documents_module", /idx_documents_module/i.test(schema));

const storageSql = read("database/storage.sql");
ok("storage.sql finance-proofs", /finance-proofs/i.test(storageSql));
ok("storage private rule", /private|signed/i.test(storageSql));

const mig = read("supabase/migrations/0005_finance_public_giving_storage_pilot.sql");
ok("migration 0005", /finance_records/i.test(mig) && /public_giving/i.test(mig));
ok("migration no drop", !/drop table/i.test(mig));

const envEx = read(".env.example");
ok(".env.example VITE_ENABLE_STORAGE", /VITE_ENABLE_STORAGE/.test(envEx));

const finRepo = read("src/data/repositories/financeRepository.ts");
ok("finance repo supabase route", /useSupabaseFinance|financeSupabaseAdapter/.test(finRepo));
ok("verify idempotent", /Already verified|already Verified|Idempotent|created_finance_record_ids/i.test(finRepo));

const storageClient = read("src/data/adapters/supabase/supabaseStorageClient.ts");
ok("storage client never service role assign", !/SERVICE_ROLE_KEY\s*=\s*['"`]/.test(storageClient));
ok("storage private finance-proofs", /finance-proofs/i.test(storageClient) && /private|signed/i.test(storageClient));

for (const a of [
  "src/data/adapters/supabase/financeSupabaseAdapter.ts",
  "src/data/adapters/supabase/publicGivingSupabaseAdapter.ts",
  "src/data/adapters/supabase/documentsSupabaseAdapter.ts",
]) {
  ok(`${a.split("/").pop()} no service role`, !/SERVICE_ROLE_KEY\s*=\s*['"`]/.test(read(a)));
}

ok("docs pilot", /VITE_ENABLE_STORAGE|finance-proofs/i.test(read("docs/backend/FINANCE_PUBLIC_GIVING_STORAGE_SUPABASE_PILOT.md")));
ok("DATA_LAYER_PLAN Phase 5", /Backend Phase 5|finance-public-giving/i.test(read("DATA_LAYER_PLAN.md")));
ok("README Phase 5", /Finance|Public Giving|Phase 5/i.test(read("README.md")));
ok("settings finance indicator", /finance:|public giving:/i.test(read("js/dashboard.js")));

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
    VITE_ENABLE_STORAGE: "false",
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
  };

  try {
    runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
    const CE = globalThis.CESupabase;
    ok("CESupabase exists", !!CE);

    if (CE?.listFinanceRecords) {
      const r = await CE.listFinanceRecords();
      ok("mock listFinanceRecords ok", r?.ok === true, `n=${r?.data?.length ?? 0}`);
    }
    if (CE?.listPublicGivingSubmissions) {
      const r = await CE.listPublicGivingSubmissions();
      ok("mock listPublicGiving ok", r?.ok === true, `n=${r?.data?.length ?? 0}`);
    }

    if (CE?.createSupabaseProvider) {
      const sp = CE.createSupabaseProvider();
      ok("provider getInfo", typeof sp.getInfo === "function");
      const info = sp.getInfo();
      ok("usingServiceRole false", info?.usingServiceRole === false);
      if (sp.financeRecords?.list) {
        const r = await sp.financeRecords.list();
        ok(
          "supabase finance list soft without env",
          r?.ok === false || r?.ok === true,
          r?.ok === false ? r.code || "" : "ready",
        );
      }
    }

    if (typeof CE?.getStorageInfo === "function" || typeof CE?.getBackendFeatureFlags === "function") {
      /* optional exports */
    }
    ok("CEFinance getInfo", !!(globalThis.CEFinance && typeof globalThis.CEFinance.getInfo === "function"));
  } catch (e) {
    ok("runtime", false, e instanceof Error ? e.message : String(e));
  }
}

console.log(results.join("\n"));
console.log("");
console.log(`Finance/Public Giving/Storage pilot: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
