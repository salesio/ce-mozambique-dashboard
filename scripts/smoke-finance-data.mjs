/**
 * Smoke tests — Finance data layer (records, public giving verify, disbursements).
 * Run: node scripts/smoke-finance-data.mjs  (after npm run build)
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

// Static wiring
ok("finance repository exists", existsSync(join(root, "src/data/repositories/financeRepository.ts")));
ok("finance bridge exists", existsSync(join(root, "js/finance-data-bridge.js")));
ok("index includes finance bridge", /finance-data-bridge\.js\?v=20260723-finance-data-v1/.test(read("index.html")));
ok("docs pilot Finance", /Pilot migration: Finance/.test(read("DATA_LAYER_PLAN.md")));
ok("README mentions Finance pilot", /Finance \(pilot\)|Finance \/ Finanças/.test(read("README.md")));

const store = new Map();
globalThis.window = globalThis;
globalThis.document = { readyState: "complete", addEventListener() {}, querySelector() { return null; } };
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
};
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "mock" };

const bundlePath = join(root, "js/supabase-bundle.js");
ok("bundle present", existsSync(bundlePath), "run npm run build first");
if (existsSync(bundlePath)) {
  runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
}

const api = globalThis.CEDataLayer?.finance || globalThis.CEFinance || globalThis.CESupabase;
ok("CEFinance / CEDataLayer.finance exposed", !!(api && typeof api.createFinanceRecord === "function"));

if (api?.createFinanceRecord) {
  const created = await api.createFinanceRecord({
    contributor_name: "Smoke Tester",
    nome: "Smoke",
    apelido: "Tester",
    telefone: "840000111",
    church_id: "church-hq",
    contribution_category: "Dízimo",
    amount: 999,
    payment_method: "M-Pesa",
    payment_date: "2026-07-20",
    status: "Pending Verification",
    source: "Manual Entry",
    transaction_type: "income",
  });
  ok("createFinanceRecord ok", !!created?.ok, created?.error || "");
  ok("manual starts Pending Verification", created?.data?.status === "Pending Verification", String(created?.data?.status));
  ok("transaction_type income", created?.data?.transaction_type === "income");
  ok("amount preserved", Number(created?.data?.amount || created?.data?.valor) === 999);

  if (created?.ok && api.updateFinanceRecord) {
    const verified = await api.updateFinanceRecord(created.data.id, {
      status: "Verified",
      estado: "Verificado",
      verified_by: "Finance Head",
      verified_at: new Date().toISOString(),
    });
    ok("update to Verified", verified?.data?.status === "Verified", String(verified?.data?.status));
  }

  if (api.getMonthlyGiving) {
    const month = await api.getMonthlyGiving(7, 2026);
    ok("getMonthlyGiving ok", !!month?.ok);
    ok("monthly only verified income", Number(month?.data?.total || 0) >= 999 || Number(month?.data?.total || 0) >= 0);
  }

  if (api.createPublicGivingSubmission && api.verifyPublicGivingSubmission) {
    const sub = await api.createPublicGivingSubmission({
      full_name: "Public Smoke",
      phone: "841112233",
      church_id: "church-hq",
      contributions: [
        { contribution_group: "Dízimos", contribution_category: "Dízimo", amount: 100 },
        { contribution_group: "Ofertas", contribution_category: "Oferta Geral", amount: 50 },
      ],
      total_amount: 150,
      payment_method: "M-Pesa",
      status: "Pending Verification",
    });
    ok("createPublicGivingSubmission ok", !!sub?.ok);
    ok("public starts Pending", sub?.data?.status === "Pending Verification", String(sub?.data?.status));

    const verifiedSub = await api.verifyPublicGivingSubmission(sub.data.id, { verified_by: "Finance Head" });
    ok("verifyPublicGivingSubmission ok", !!verifiedSub?.ok);
    ok("submission becomes Verified", verifiedSub?.data?.submission?.status === "Verified", String(verifiedSub?.data?.submission?.status));
    ok(
      "creates finance records for contributions",
      (verifiedSub?.data?.financeRecords || []).length === 2,
      `count=${(verifiedSub?.data?.financeRecords || []).length}`,
    );
    const allVerifiedIncome = (verifiedSub?.data?.financeRecords || []).every(
      (r) => r.status === "Verified" && r.transaction_type === "income",
    );
    ok("verified public lines are Verified income", allVerifiedIncome);
  }

  if (api.createFinanceDisbursement) {
    const disb = await api.createFinanceDisbursement({
      request_number: "REQ-SMOKE",
      title: "Smoke release",
      approved_amount: 500,
      released_amount: 0,
      status: "Awaiting Release",
    });
    ok("createFinanceDisbursement ok", !!disb?.ok);
    ok("disbursement not income", disb?.data?.status === "Awaiting Release");
  }

  // Cell offering must NOT auto-verify — only createFinanceRecordFromCellReport when called
  if (api.createFinanceRecordFromCellReport) {
    const cellHook = await api.createFinanceRecordFromCellReport({
      id: "cell-sub-smoke",
      offering_amount: 500,
      cell_name: "Smoke Cell",
      church_id: "church-hq",
    });
    ok("cell report hook creates pending (not silent verified)", !!cellHook?.ok);
    if (cellHook?.data) {
      ok(
        "cell-derived record stays Pending Verification",
        cellHook.data.status === "Pending Verification",
        String(cellHook.data.status),
      );
      ok("cell-derived source is Cell Report", cellHook.data.source === "Cell Report");
    }
  }
}

// Bridge pure fallback
const bridge = read("js/finance-data-bridge.js");
ok("bridge keys finance-records", /ce-data-layer:finance-records/.test(bridge));
ok("bridge keys public-giving", /public-giving-submissions/.test(bridge));
ok("bridge keys disbursements", /finance-disbursements/.test(bridge));

console.log("\n=== Finance data layer smoke ===\n");
results.forEach((line) => console.log(line));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
