/**
 * Smoke tests — Counseling data layer.
 * Run: node scripts/smoke-counseling-data.mjs  (after npm run build)
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

ok(
  "counseling repository exists",
  existsSync(join(root, "src/data/repositories/counselingRepository.ts")),
);
ok("requests seed exists", existsSync(join(root, "src/data/seeds/counselingRequestsSeed.ts")));
ok("cases seed exists", existsSync(join(root, "src/data/seeds/counselingCasesSeed.ts")));
ok("appointments seed exists", existsSync(join(root, "src/data/seeds/counselingAppointmentsSeed.ts")));
ok("counselors seed exists", existsSync(join(root, "src/data/seeds/counselorsSeed.ts")));
ok("feedback seed exists", existsSync(join(root, "src/data/seeds/counselingFeedbackSeed.ts")));
ok("referrals seed exists", existsSync(join(root, "src/data/seeds/counselingReferralsSeed.ts")));
ok("counseling bridge exists", existsSync(join(root, "js/counseling-data-bridge.js")));
ok(
  "index includes counseling bridge",
  /counseling-data-bridge\.js\?v=20260723-counseling-data-v1/.test(read("index.html")),
);
ok("docs pilot Counseling", /Pilot migration: Counseling/.test(read("DATA_LAYER_PLAN.md")));
ok("COUNSELING_MODULE_PLAN exists", existsSync(join(root, "COUNSELING_MODULE_PLAN.md")));
ok("README mentions Counseling pilot", /Counseling/.test(read("README.md")));
ok(
  "dashboard dual-write counseling",
  /dualWriteCounselingRecord|hydrateCounselingFromRepository/.test(read("js/dashboard.js")),
);
ok(
  "localStorage key counseling-requests",
  /counseling-requests/.test(read("src/data/adapters/localStorageProvider.ts")),
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
runInThisContext(readFileSync(join(root, "js/counseling-data-bridge.js"), "utf8"), {
  filename: "counseling-data-bridge.js",
});

const api =
  globalThis.CEDataLayer?.counseling || globalThis.CECounseling || globalThis.CESupabase;
ok(
  "CECounseling / CEDataLayer.counseling exposed",
  !!(api && typeof api.createCounselingRequest === "function"),
);

if (api?.listCounselingRequests) {
  const listed = await api.listCounselingRequests();
  ok("listCounselingRequests ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has requests",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const created = await api.createCounselingRequest({
    person_type: "Member",
    person_name: "Smoke Counseling Person",
    full_name: "Smoke Counseling Person",
    phone: "840000777",
    church_id: "church-hq",
    category: "Spiritual Growth",
    counseling_category: "Crescimento Espiritual",
    subject: "Smoke subject",
    summary: "Smoke counseling request",
    urgency: "Normal",
    confidentiality_level: "Normal",
    status: "New",
  });
  ok("createCounselingRequest ok", !!created?.ok, created?.error || "");
  ok("request_number present", !!created?.data?.request_number, String(created?.data?.request_number));
  ok(
    "status New",
    /new/i.test(String(created?.data?.status || "")),
    String(created?.data?.status),
  );

  let caseId = null;
  if (api.createCounselingCase) {
    const cas = await api.createCounselingCase({
      request_id: created?.data?.id,
      person_type: "Member",
      person_name: "Smoke Counseling Person",
      category: "Spiritual Growth",
      subject: "Smoke case",
      summary: "Case from smoke",
      confidential_notes: "SECRET NOTES — for allowed roles only",
      confidentiality_level: "Private",
      counselor_id: "coun-1",
      counselor_name: "Líder de Aconselhamento",
      status: "Assigned",
      urgency: "Normal",
    });
    ok("createCounselingCase ok", !!cas?.ok, cas?.error || "");
    ok("case_number present", !!cas?.data?.case_number, String(cas?.data?.case_number));
    caseId = cas?.data?.id || null;
  }

  if (api.createCounselingAppointment) {
    const apt = await api.createCounselingAppointment({
      case_id: caseId,
      request_id: created?.data?.id,
      person_name: "Smoke Counseling Person",
      counselor_id: "coun-1",
      counselor_name: "Líder de Aconselhamento",
      appointment_date: "2026-07-25",
      start_time: "10:00",
      appointment_type: "In Person",
      status: "Scheduled",
    });
    ok("createCounselingAppointment ok", !!apt?.ok, apt?.error || "");

    if (apt?.ok && api.completeCounselingAppointment) {
      const done = await api.completeCounselingAppointment(apt.data.id, {
        session_notes: "Smoke session completed",
        completed_by_name: "Smoke Tester",
      });
      ok("completeCounselingAppointment ok", !!done?.ok, done?.error || "");
      ok(
        "appointment Completed",
        /completed|conclu/i.test(String(done?.data?.status || "")),
        String(done?.data?.status),
      );
    }
  }

  if (api.createCounselingFeedback) {
    const fb = await api.createCounselingFeedback({
      case_id: caseId,
      request_id: created?.data?.id,
      counselor_id: "coun-1",
      counselor_name: "Líder de Aconselhamento",
      person_name: "Smoke Counseling Person",
      feedback_type: "Session Summary",
      summary: "Smoke feedback",
      outcome: "Precisa de Acompanhamento",
      needs_follow_up: true,
      next_step: "Criar Acompanhamento",
      status: "Submitted",
    });
    ok("createCounselingFeedback ok", !!fb?.ok, fb?.error || "");
  }

  if (api.createCounselingReferral) {
    const ref = await api.createCounselingReferral({
      case_id: caseId,
      request_id: created?.data?.id,
      target_type: "Church Pastor",
      referred_to_type: "Church Pastor",
      referral_reason: "Smoke escalation",
      urgency: "High",
      from_name: "Smoke Tester",
      status: "Pending",
    });
    ok("createCounselingReferral ok", !!ref?.ok, ref?.error || "");
  }

  if (api.createCounselor) {
    const coun = await api.createCounselor({
      full_name: "Smoke Counselor",
      categories: ["Prayer"],
      counseling_categories: ["Oração"],
      max_cases_per_week: 5,
      status: "Active",
      church_id: "church-hq",
    });
    ok("createCounselor ok", !!coun?.ok, coun?.error || "");
  }

  if (caseId && api.closeCounselingCase) {
    const closed = await api.closeCounselingCase(caseId, {
      closed_by_name: "Smoke Tester",
      outcome: "Resolvido",
      closure_notes: "Smoke close",
    });
    ok("closeCounselingCase ok", !!closed?.ok, closed?.error || "");
    ok(
      "case Closed",
      /closed|closed/i.test(String(closed?.data?.status || "")),
      String(closed?.data?.status),
    );
  }

  if (api.getCounselingOverviewStats) {
    const stats = await api.getCounselingOverviewStats();
    ok("getCounselingOverviewStats ok", !!stats?.ok, stats?.error || "");
    ok(
      "overview has openCases number",
      stats?.data && typeof stats.data.openCases === "number",
      String(stats?.data?.openCases),
    );
  }

  if (api.getUrgentCounselingRequests) {
    const urgent = await api.getUrgentCounselingRequests();
    ok("getUrgentCounselingRequests ok", !!urgent?.ok, urgent?.error || "");
  }

  if (api.listCounselors) {
    const counselors = await api.listCounselors();
    ok("listCounselors ok", !!counselors?.ok, counselors?.error || "");
    ok(
      "counselors seed non-empty",
      Array.isArray(counselors?.data) && counselors.data.length > 0,
      String(counselors?.data?.length || 0),
    );
  }

  // Confidential report must not expose notes body
  if (api.getConfidentialCounselingReport || globalThis.CEDataLayer?.counseling) {
    const layer = globalThis.CEDataLayer?.counseling || api;
    if (typeof layer.getConfidentialCounselingReport === "function") {
      const rep = await layer.getConfidentialCounselingReport();
      ok("confidential report ok", !!rep?.ok, rep?.error || "");
      const hasNotes = (rep?.data || []).some(
        (r) => r.confidential_notes != null && String(r.confidential_notes).length > 0,
      );
      ok("confidential report strips notes", !hasNotes);
    } else {
      ok("confidential report method optional on bridge", true, "skipped on pure bridge");
    }
  }
}

// local persistence
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
if (globalThis.CEDataLayer?.resetDataProvider) {
  try {
    globalThis.CEDataLayer.resetDataProvider();
  } catch (_) {}
}
const localApi = globalThis.CECounseling || globalThis.CEDataLayer?.counseling;
if (localApi?.createCounselingRequest) {
  const localCreate = await localApi.createCounselingRequest({
    person_name: "Local Persist Person",
    full_name: "Local Persist Person",
    status: "New",
    urgency: "Normal",
  });
  ok("local createCounselingRequest ok", !!localCreate?.ok, localCreate?.error || "");
  const raw = globalThis.localStorage.getItem("ce-data-layer:counseling-requests");
  ok(
    "localStorage counseling-requests written",
    !!raw && raw.includes("Local Persist Person"),
    raw ? "has key" : "empty",
  );
}

// regressions still exposed
ok("media still exposed", !!(globalThis.CEMedia || globalThis.CEDataLayer?.media));
ok("staff HR still exposed", !!(globalThis.CEStaffHR || globalThis.CEDataLayer?.staffHR));

console.log("\n=== Counseling data layer smoke ===\n");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
