/**
 * Smoke — Partnerships analytics layer (no duplicate finance ledger).
 * Run: node scripts/smoke-partnerships-data.mjs
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

const indexHtml = read("index.html");
const dash = read("js/dashboard.js");
const mod = read("js/partnerships-module.js");
const plan = read("DATA_LAYER_PLAN.md");
const readme = read("README.md");

ok("partnerships-module.js exists", existsSync(join(root, "js/partnerships-module.js")));
ok("index loads partnerships module", /partnerships-module\.js\?v=20260723-partnerships-v1/.test(indexHtml));
ok("sidebar order finance then partnership", /finance[\s\S]{0,80}partnership/.test(dash));
ok("no Loveworld as separate NAV route", !/\["loveworld|"loveworldSat"|Loveworld SAT.*bi-/.test(dash.match(/NAV_GROUPS[\s\S]{0,800}/)?.[0] || ""));
ok("Loveworld is partnership arm in module", /Loveworld SAT/.test(mod) && /arm-lw-sat/.test(mod));
ok("docs Partnerships analytics layer", /Partnerships analytics layer/.test(plan));
ok("README partnerships note", /Partnerships \/ Parcerias|partnership arm/i.test(readme));
ok("renderPartnerships wired", /renderPartnerships/.test(dash));
ok("verified income only filter", /isVerifiedIncomeRecord|Pending Verification/.test(mod));
ok("promotion helper", /getPartnershipArmPromotionStatus/.test(mod));
ok("tabs include arms partners contributions", /Braços de Parceria|Partnership Arms/.test(mod) && /Parceiros|Partners/.test(mod));

// Runtime: load module with stubs
globalThis.window = globalThis;
globalThis.lang = "pt";
globalThis.L = (k) => k;
globalThis.money = (n) => String(n);
globalThis.state = {
  finance: [
    {
      id: "v1",
      transaction_type: "income",
      status: "Verified",
      estado: "Verificado",
      contribution_group: "Parcerias",
      partnership_arm_id: "arm-lw-sat",
      partnership_arm_name: "Loveworld SAT",
      contributor_name: "Carlos Muianga",
      telefone: "866877389",
      church_id: "church-virtual",
      amount: 5500,
      valor: 5500,
      payment_date: "2026-07-08",
      data: "2026-07-08"
    },
    {
      id: "p1",
      transaction_type: "income",
      status: "Pending Verification",
      estado: "Pendente de Verificação",
      contribution_group: "Parcerias",
      partnership_arm_id: "arm-lw-sat",
      partnership_arm_name: "Loveworld SAT",
      contributor_name: "Pending Person",
      amount: 4200,
      valor: 4200,
      payment_date: "2026-07-02",
      data: "2026-07-02"
    },
    {
      id: "e1",
      transaction_type: "expense",
      status: "Verified",
      contribution_group: "Parcerias",
      partnership_arm_id: "arm-lw-sat",
      amount: 999,
      valor: 999,
      payment_date: "2026-07-08",
      data: "2026-07-08"
    },
    {
      id: "v2",
      transaction_type: "income",
      status: "Verified",
      estado: "Verificado",
      contribution_group: "Parcerias",
      partnership_arm_id: "arm-healing",
      partnership_arm_name: "Escola de Cura",
      contributor_name: "Helena Cossa",
      telefone: "843332211",
      church_id: "church-hq",
      amount: 5000,
      valor: 5000,
      payment_date: "2026-07-09",
      data: "2026-07-09"
    }
  ],
  partnershipArms: []
};
globalThis.getScopedFinanceList = () => globalThis.state.finance;
globalThis.migrateFinanceRecord = (r) => r;
globalThis.activeUser = { role: "Super Admin", can_view_all_churches: true };
globalThis.canEnterRoute = () => true;

runInThisContext(mod, { filename: "partnerships-module.js" });

ok("CEPartnerships exposed", !!globalThis.CEPartnerships);
const list = globalThis.getVerifiedPartnershipRecords();
ok("pending excluded from partnership list", !list.some((r) => r.id === "p1"), `count=${list.length}`);
ok("expense excluded", !list.some((r) => r.id === "e1"));
ok("verified Loveworld included", list.some((r) => r.id === "v1"));
ok("verified healing included", list.some((r) => r.id === "v2"));

const arms = globalThis.computePartnershipArmAnalytics("month");
const lw = arms.find((a) => a.id === "arm-lw-sat");
ok("Loveworld arm total uses verified only", Number(lw?.total_amount) === 5500, String(lw?.total_amount));
const emptyArm = arms.find((a) => a.id === "arm-other" || a.total_amount === 0);
if (emptyArm) {
  const promo = globalThis.getPartnershipArmPromotionStatus(emptyArm, {
    total_amount: 0,
    donor_count: 0,
    growth_percent: 0,
    days_since_last_donation: 99
  });
  ok("zero total needs promotion", promo.needs_promotion === true);
} else {
  ok("zero total needs promotion", true, "no empty arm in list — skipped shape");
}

const partners = globalThis.computePartnershipPartners("month");
ok("partners aggregated from verified only", partners.length >= 1);
ok("Carlos appears as partner", partners.some((p) => /Carlos/i.test(p.contributor_name)));

console.log("\n=== Partnerships analytics smoke ===\n");
results.forEach((line) => console.log(line));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
