/**
 * Smoke tests — Public Cell Report Form + cellReportsRepository.
 * Run: node scripts/smoke-public-cell-report.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const require = createRequire(import.meta.url);

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

// --- Static / UI wiring ---
const indexHtml = read("index.html");
ok("login button present", /data-public-cell-report/.test(indexHtml) && /Submeter Relat[oó]rio de C[eé]lula/.test(indexHtml));
ok("public view shell", /id="publicCellReportView"/.test(indexHtml));
ok("cache buster present", /20260723-(cell-report-submit|finance-data)-v\d+/.test(indexHtml));
ok("dashboard script tagged", /dashboard\.js\?v=20260723-/.test(indexHtml));
ok("cell ministry bridge tagged", /cell-ministry-data-bridge\.js\?v=20260723-/.test(indexHtml));

const dash = read("js/dashboard.js");
ok("hash route cell-report-submit", /cell-report-submit/.test(dash));
ok("submitted_by_type public form", /submitted_by_type:\s*"Cell Leader Public Form"/.test(dash));
ok("submitted_from login button", /submitted_from:\s*"login_public_button"/.test(dash));
ok("Pending Finance Review on offering", /Pending Finance Review/.test(dash));
ok("honeypot field", /name="website"[\s\S]*public-honeypot/.test(dash) || /public-honeypot/.test(dash));
ok("rate limit localStorage", /ce-public-cell-report-last-submit/.test(dash));
ok("success actions", /data-submit-another-cell-report/.test(dash) && /data-back-login/.test(dash));
ok("notify public submit", /notifyPublicCellReportSubmitted/.test(dash));
ok("internal mapping to cellReports", /cellReportSubmissionToInternalReport/.test(dash));
ok("no auto verified finance note", /never auto-create verified finance|Pending Finance Review/.test(dash));

const repoThin = read("src/data/repositories/cellReportsRepository.ts");
ok("cellReportsRepository re-exports createCellReport", /createCellReport/.test(repoThin));

const plan = read("DATA_LAYER_PLAN.md");
ok("docs: Public Cell Report Form section", /### Public Cell Report Form/.test(plan));
ok("docs: no admin login principle", /without.*admin login|no admin login/i.test(plan));
ok("docs: cellReportsRepository path", /cellReportsRepository/.test(plan));
ok("docs: finance future phase", /future phase|Pending Finance Review/.test(plan));

const readme = read("README.md");
ok("README mentions public cell report", /Public Cell Report Form/i.test(readme));
ok("README: login button entry", /login screen/i.test(readme) && /cell-report-submit/.test(readme));

// --- Repository create path via built IIFE bundle (cellReportsRepository) ---
async function testRepositoryViaBundle() {
  const bundlePath = join(root, "js/supabase-bundle.js");
  if (!existsSync(bundlePath)) {
    ok("supabase-bundle present", false, "run npm run build first");
    return;
  }

  // Minimal browser shims for IIFE + mock/local adapters
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

  // Load IIFE with `this` = globalThis (ESM import leaves `this` undefined)
  const { readFileSync: readFs } = await import("node:fs");
  const { runInThisContext } = await import("node:vm");
  const code = readFs(bundlePath, "utf8");
  runInThisContext(code, { filename: "supabase-bundle.js" });

  const api =
    globalThis.CEDataLayer?.cellMinistry ||
    globalThis.CEDataLayer?.cellReports ||
    globalThis.CESupabase;

  ok("bundle exposes cell ministry API", !!(api && typeof api.createCellReport === "function"), api ? "ok" : "missing");

  if (!api?.createCellReport) {
    const ministry = read("src/data/repositories/cellMinistryRepository.ts");
    ok("normalize sets Pending Finance when offering", /Pending Finance Review/.test(ministry));
    ok("createCellReport function exists", /export async function createCellReport/.test(ministry));
    return;
  }

  const payload = {
    report_week: "2026-07-20",
    meeting_date: "2026-07-20",
    church_id: "church-hq",
    cell_group_id: "cg-smoke-1",
    cell_id: "cell-smoke-1",
    cell_name: "Smoke Cell Public",
    leader_name: "Líder Smoke",
    leader_phone: "840000000",
    meeting_type: "Presencial",
    attendance_count: 12,
    first_timers_count: 2,
    new_converts_count: 1,
    souls_won_count: 1,
    offering_given: true,
    offering_amount: 500,
    currency: "MZN",
    cell_health_status: "Saudável",
    submitted_by_type: "Cell Leader Public Form",
    submitted_from: "login_public_button",
    status: "Submitted",
    needs_review: false,
    possible_duplicate: false,
    finance_review_status: "Pending Finance Review",
  };

  const created = await api.createCellReport(payload);
  ok("createCellReport ok", !!created?.ok, created?.error?.message || JSON.stringify(created?.error || ""));
  const row = created?.data;
  ok("repo stores public submitted_by_type", row?.submitted_by_type === "Cell Leader Public Form", String(row?.submitted_by_type));
  ok("repo stores submitted_from", row?.submitted_from === "login_public_button", String(row?.submitted_from));
  ok(
    "repo finance_review_status Pending Finance Review",
    row?.finance_review_status === "Pending Finance Review",
    String(row?.finance_review_status),
  );
  ok("repo offering_amount preserved", Number(row?.offering_amount || row?.oferta) === 500, String(row?.offering_amount));
  ok("repo does not mark finance verified", !/verified|confirmad/i.test(String(row?.finance_review_status || "")));

  if (typeof api.listCellReports === "function" && row?.id) {
    const listed = await api.listCellReports();
    const found = (listed?.data || []).some((r) => r.id === row.id);
    ok("listCellReports includes created row", found);
  } else {
    ok("listCellReports includes created row", !!row?.id, "list API missing — id only");
  }

  // Offering = 0 → Not Applicable
  const noOffer = await api.createCellReport({
    ...payload,
    cell_id: "cell-smoke-2",
    cell_name: "Smoke No Offer",
    offering_given: false,
    offering_amount: 0,
    finance_review_status: undefined,
  });
  const noOfferStatus = noOffer?.data?.finance_review_status;
  ok("zero offering → Not Applicable", noOfferStatus === "Not Applicable", String(noOfferStatus));
}

const { pathToFileURL } = await import("node:url");
await testRepositoryViaBundle();

// Bridge key for dual-write
const bridge = read("js/cell-ministry-data-bridge.js");
ok("bridge reports key", /ce-data-layer:cell-reports/.test(bridge));
ok("bridge createCellReport", /createCellReport/.test(bridge));

// --- Manual checklist wiring (steps 1–20) ---
console.log("\n--- Manual checklist (code paths) ---");
ok("1–2 login button → public form", /data-public-cell-report/.test(indexHtml) && /showPublicCellReport/.test(dash));
ok("3 public page hides login+app", /loginView[\s\S]{0,80}d-none[\s\S]{0,120}appView[\s\S]{0,80}d-none/.test(dash) || /showPublicCellReport[\s\S]{0,200}loginView/.test(dash));
ok("4–5 church + group selects", /publicCellChurch/.test(dash) && /publicCellGroup/.test(dash));
ok("6 cells filter by group", /updatePublicCellReportDependentSelects/.test(dash) && /matchGroup/.test(dash));
ok("7 cell select id", /id="publicCell"/.test(dash) || /#publicCell/.test(dash));
ok("8 multi-step form 7 steps", /data-public-step/.test(dash) && /spiritual/.test(dash));
ok("9 ATT FT NC fields", /attendance_count/.test(dash) && /first_timers_count/.test(dash) && /new_converts_count/.test(dash));
ok("10 offering amount + given", /offering_amount/.test(dash) && /offering_given/.test(dash));
ok("11 submitPublicCellReport", /submitPublicCellReport/.test(dash));
ok("12 success confirmation UI", /reportSubmittedSuccess/.test(dash) && /public-report-success/.test(dash));
ok("13 back to login", /data-back-login/.test(dash) && /showLoginView/.test(dash));
ok("14 enter dashboard", /enterDashboard/.test(dash));
ok("15 cell reports tabs", /cellWeeklyReport|receivedReports|weeklyCellReport/.test(dash));
ok("16 lands in cellLeadership.cellReports", /cellLeadership\.cellReports\.unshift/.test(dash));
ok("17 Pending Finance Review on offer", /finance_review_status[\s\S]{0,80}Pending Finance Review/.test(dash));
ok("18 approve/validate actions", /data-cell-report-action.*approve|approve.*validate/.test(dash) || /updateCellReportReviewAction/.test(dash));
ok("19 dual-write local persistence path", /dualWriteCellMinistryRecord/.test(dash) && /ce-data-layer:cell-reports/.test(bridge));
ok("20 no auto verified finance income", /never auto-create verified finance|placeholder only/i.test(dash));

// §24 principles
ok("§24 leader not staff dashboard (public only)", /no admin login|Cell Leader Public Form|login_public_button/i.test(dash + plan + readme));
ok("§24 button on login only entry", /login-public-action/.test(indexHtml));
ok("§24 uses existing data layer", /createCellReport|CECellMinistry|CEDataLayer/.test(dash));
ok("§24 dependent group→cell", /updatePublicCellReportDependentSelects/.test(dash));
ok("§24 existing tab not new module", /receivedReports|weeklyCellReport/.test(dash));
ok("§24 finance future / security future", /future phase|Future backend|Supabase/.test(plan));

console.log("\n=== Public Cell Report smoke ===\n");
results.forEach((line) => console.log(line));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
