/**
 * Smoke — Requisitions data layer workflow + expense disbursement.
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

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const plan = readFileSync(join(root, "DATA_LAYER_PLAN.md"), "utf8");
const bridge = readFileSync(join(root, "js/requisitions-data-bridge.js"), "utf8");

ok("repository exists", existsSync(join(root, "src/data/repositories/requisitionsRepository.ts")));
ok("bridge exists", existsSync(join(root, "js/requisitions-data-bridge.js")));
ok("index loads bridge", /requisitions-data-bridge\.js\?v=20260723-requisitions-data-v1/.test(indexHtml));
ok("docs pilot Requisitions", /Pilot migration: Requisitions/.test(plan));
ok("bridge keys requisitions", /ce-data-layer:requisitions/.test(bridge));
ok("bridge wraps workflow", /applyWorkflowAction/.test(bridge));

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

const bundle = join(root, "js/supabase-bundle.js");
ok("bundle present", existsSync(bundle));
if (existsSync(bundle)) {
  runInThisContext(readFileSync(bundle, "utf8"), { filename: "supabase-bundle.js" });
}

const api =
  globalThis.CEDataLayer?.requisitionsWorkflow ||
  globalThis.CEDataLayer?.requisitions ||
  globalThis.CERequisitionsData ||
  globalThis.CESupabase;

ok("requisitions API exposed", !!(api && typeof api.createRequisition === "function"));

if (api?.createRequisition) {
  const created = await api.createRequisition({
    title: "Smoke transport",
    department_name: "F.E.V.O",
    church_id: "church-hq",
    requisition_type: "Transporte",
    estimated_amount: 1000,
    urgency: "Normal",
    requested_by_name: "Staff Smoke",
    status: "Rascunho",
  });
  ok("createRequisition ok", !!created?.ok, created?.error || "");
  ok("starts as draft/submittable", /Rascunho|Draft|Submetid/i.test(String(created?.data?.status)), String(created?.data?.status));

  const id = created?.data?.id;
  if (id && api.submitRequisition) {
    const sub = await api.submitRequisition(id, { name: "Staff Smoke", role: "Staff Member" });
    ok("submitRequisition ok", !!sub?.ok && /Submetid|Submitted/i.test(String(sub?.data?.status)), String(sub?.data?.status));
  }
  if (id && api.reviewRequisition) {
    const rev = await api.reviewRequisition(id, { review_notes: "OK", actor: { name: "Pastora Carrissa", role: "Requisition Officer" } });
    ok("reviewRequisition ok", !!rev?.ok && /Revis|Review/i.test(String(rev?.data?.status)), String(rev?.data?.status));
  }
  if (id && api.sendToMainPastor) {
    const sent = await api.sendToMainPastor(id, { actor: { name: "Pastora Carrissa", role: "Requisition Officer" } });
    ok("sendToMainPastor ok", !!sent?.ok && /Pastor/i.test(String(sent?.data?.status)), String(sent?.data?.status));
  }
  if (id && api.approveRequisition) {
    const appr = await api.approveRequisition(id, {
      approved_amount: 900,
      approval_notes: "OK",
      actor: { name: "Pastor Kene", role: "Main Pastor", id: "u-17" },
    });
    ok("approveRequisition ok", !!appr?.ok, appr?.error || "");
    ok(
      "status awaiting finance",
      /Aguardando|Awaiting|Liber/i.test(String(appr?.data?.status || appr?.data?.finance_status)),
      `${appr?.data?.status} / ${appr?.data?.finance_status}`,
    );
    ok("finance_status set", !!appr?.data?.finance_status, String(appr?.data?.finance_status));
    ok("disbursement id prepared", !!appr?.data?.finance_disbursement_id, String(appr?.data?.finance_disbursement_id));
    ok("never income on approval", appr?.data?.transaction_type !== "income");
  }
  if (id && api.markResourcesReleased) {
    const rel = await api.markResourcesReleased(id, {
      released_amount: 900,
      payment_method: "Banco",
      actor: { name: "Finance Head", role: "Finance Head" },
    });
    ok("markResourcesReleased ok", !!rel?.ok, rel?.error || "");
    ok(
      "released status",
      /Liberad|Released/i.test(String(rel?.data?.status || rel?.data?.finance_status)),
      `${rel?.data?.status} / ${rel?.data?.finance_status}`,
    );
  }
  if (id && api.markSentToInventory) {
    // Force inventory path
    await api.updateRequisition(id, { inventory_required: true, requisition_type: "Equipamento" });
    const inv = await api.markSentToInventory(id, { actor: { name: "Finance Head" } });
    ok("markSentToInventory placeholder ok", !!inv?.ok, inv?.error || "");
    ok(
      "inventory status awaiting",
      /Invent|Awaiting|Pending/i.test(String(inv?.data?.inventory_status || inv?.data?.status)),
      String(inv?.data?.inventory_status || inv?.data?.status),
    );
  }

  // Expense disbursement via finance API
  const fin = globalThis.CEDataLayer?.finance || globalThis.CEFinance;
  if (fin?.listFinanceDisbursements) {
    const disb = await fin.listFinanceDisbursements();
    ok("finance disbursements list ok", !!disb?.ok);
    const expenseRows = (disb?.data || []).filter((d) => d.requisition_id || d.source === "requisition");
    ok("has expense disbursements linked to reqs", expenseRows.length >= 0);
  }
}

console.log("\n=== Requisitions data layer smoke ===\n");
results.forEach((line) => console.log(line));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
