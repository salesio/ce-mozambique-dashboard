/**
 * Smoke tests — F.E.V.O data layer.
 * Run: node scripts/smoke-fevo-data.mjs  (after npm run build)
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

ok("fevo repository exists", existsSync(join(root, "src/data/repositories/fevoRepository.ts")));
ok("configs seed exists", existsSync(join(root, "src/data/seeds/fevoWeeklyConfigsSeed.ts")));
ok("teams seed exists", existsSync(join(root, "src/data/seeds/fevoTeamsSeed.ts")));
ok("activities seed exists", existsSync(join(root, "src/data/seeds/fevoActivitiesSeed.ts")));
ok("reports seed exists", existsSync(join(root, "src/data/seeds/fevoReportsSeed.ts")));
ok("missing seed exists", existsSync(join(root, "src/data/seeds/fevoMissingReportsSeed.ts")));
ok("fevo bridge exists", existsSync(join(root, "js/fevo-data-bridge.js")));
ok(
  "index includes fevo bridge",
  /fevo-data-bridge\.js\?v=20260723-fevo-data-v1/.test(read("index.html")),
);
ok("docs pilot F.E.V.O", /Pilot migration: F\.E\.V\.O/.test(read("DATA_LAYER_PLAN.md")));
ok("FEVO_MODULE_PLAN exists", existsSync(join(root, "FEVO_MODULE_PLAN.md")));
ok("README mentions FEVO pilot", /F\.E\.V\.O/.test(read("README.md")));
ok(
  "dashboard dual-write fevo",
  /dualWriteFevoRecord|hydrateFevoFromRepository/.test(read("js/dashboard.js")),
);
ok(
  "localStorage key fevo-weekly-configs",
  /fevo-weekly-configs/.test(read("src/data/adapters/localStorageProvider.ts")),
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
runInThisContext(readFileSync(join(root, "js/fevo-data-bridge.js"), "utf8"), {
  filename: "fevo-data-bridge.js",
});

const api = globalThis.CEDataLayer?.fevo || globalThis.CEFevo || globalThis.CESupabase;
ok("CEFevo / CEDataLayer.fevo exposed", !!(api && typeof api.createFevoWeeklyConfig === "function"));

if (api?.listFevoWeeklyConfigs) {
  const listed = await api.listFevoWeeklyConfigs();
  ok("listFevoWeeklyConfigs ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has configs",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const cfg = await api.createFevoWeeklyConfig({
    semana_inicio: "2026-08-01",
    semana_fim: "2026-08-07",
    week_start_date: "2026-08-01",
    week_end_date: "2026-08-07",
    team_a_activity: "Acompanhamento",
    team_b_activity: "Evangelização",
    team_c_activity: "Visitação",
    team_d_activity: "Oração",
    preparado_por: "Sister Cassandra",
    church_id: "church-hq",
    status: "Draft",
    estado: "Rascunho",
  });
  ok("createFevoWeeklyConfig ok", !!cfg?.ok, cfg?.error || "");

  if (cfg?.ok && api.activateFevoWeeklyConfig) {
    const act = await api.activateFevoWeeklyConfig(cfg.data.id);
    ok("activateFevoWeeklyConfig ok", !!act?.ok, act?.error || "");
    ok(
      "config Active/Activo",
      /active|activo/i.test(String(act?.data?.status || act?.data?.estado || "")),
      String(act?.data?.status || act?.data?.estado),
    );
    if (api.listFevoActivities) {
      const acts = await api.listFevoActivities();
      const forWeek = (acts?.data || []).filter(
        (a) => a.config_id === cfg.data.id || a.weekly_config_id === cfg.data.id,
      );
      ok(
        "activate creates Team A-D activities",
        forWeek.length >= 4,
        String(forWeek.length),
      );
    }
  }

  if (api.createFevoTeam) {
    const team = await api.createFevoTeam({
      name: "Team Smoke",
      code: "S",
      church_id: "church-hq",
      status: "Active",
    });
    ok("createFevoTeam ok", !!team?.ok, team?.error || "");
  }

  if (api.createFevoActivity) {
    const activity = await api.createFevoActivity({
      config_id: cfg?.data?.id,
      team_name: "Team A",
      activity_type: "Evangelização",
      scheduled_date: "2026-08-03",
      status: "Pending",
    });
    ok("createFevoActivity ok", !!activity?.ok, activity?.error || "");
    if (activity?.ok && api.completeFevoActivity) {
      const done = await api.completeFevoActivity(activity.data.id, {});
      ok("completeFevoActivity ok", !!done?.ok, done?.error || "");
    }
  }

  if (api.createFevoReport) {
    const report = await api.createFevoReport({
      config_id: cfg?.data?.id,
      team: "Team A",
      activity_type: "Acompanhamento",
      group_name: "Smoke Group",
      leader_name: "Smoke Leader",
      semana_inicio: "2026-08-01",
      semana_fim: "2026-08-07",
      souls_contacted: 10,
      status: "Draft",
    });
    ok("createFevoReport ok", !!report?.ok, report?.error || "");
    if (report?.ok && api.submitFevoReport) {
      const sub = await api.submitFevoReport(report.data.id, { submitted_by: "Smoke" });
      ok("submitFevoReport ok", !!sub?.ok, sub?.error || "");
    }
    if (report?.ok && api.validateFevoReport) {
      const val = await api.validateFevoReport(report.data.id, { validated_by: "Sister Cassandra" });
      ok("validateFevoReport ok", !!val?.ok, val?.error || "");
      ok(
        "report Validated/Approved",
        /valid|approv|aprov/i.test(String(val?.data?.status || "")),
        String(val?.data?.status),
      );
    }
    if (api.createFevoReport && api.rejectFevoReport) {
      const bad = await api.createFevoReport({
        team: "Team C",
        activity_type: "Oração",
        status: "Submitted",
      });
      if (bad?.ok) {
        const rejNo = await api.rejectFevoReport(bad.data.id, {});
        ok(
          "reject without reason fails",
          !rejNo?.ok,
          rejNo?.error || String(rejNo?.ok),
        );
        const rej = await api.rejectFevoReport(bad.data.id, {
          rejection_reason: "Dados incompletos",
          validated_by: "Sister Cassandra",
        });
        ok("rejectFevoReport with reason ok", !!rej?.ok, rej?.error || "");
        ok(
          "reject status Needs Correction",
          /needs correction|reject/i.test(String(rej?.data?.status || "")),
          String(rej?.data?.status),
        );
      }
    }
  }

  if (api.createFevoMissingReport) {
    const miss = await api.createFevoMissingReport({
      config_id: cfg?.data?.id,
      team: "Team B",
      activity_type: "Visitação",
      group_name: "Smoke Missing Group",
      leader_name: "Missing Leader",
      reason_not_submitted: "Smoke detect",
      status: "Pending",
    });
    ok("createFevoMissingReport ok", !!miss?.ok, miss?.error || "");
    if (miss?.ok && api.resolveFevoMissingReport) {
      const res = await api.resolveFevoMissingReport(miss.data.id, {
        resolved_by: "Sister Cassandra",
      });
      ok("resolveFevoMissingReport ok", !!res?.ok, res?.error || "");
    }
  }

  if (api.createFevoFollowUpRecord) {
    const fu = await api.createFevoFollowUpRecord({
      report_id: "fevo-rpt-smoke",
      souls_contacted: 12,
      feedback_count: 8,
      successful_contacts: 8,
      no_answer_count: 4,
      followup_result: "Encouraged",
      next_action: "Call Again",
    });
    ok("createFevoFollowUpRecord ok", !!fu?.ok, fu?.error || "");
    if (fu?.ok && api.updateFevoFollowUpRecord) {
      const upd = await api.updateFevoFollowUpRecord(fu.data.id, { next_action: "Visit" });
      ok("updateFevoFollowUpRecord ok", !!upd?.ok, upd?.error || "");
    }
    if (api.getFevoFollowUpByReport) {
      const byR = await api.getFevoFollowUpByReport("fevo-rpt-smoke");
      ok("getFevoFollowUpByReport ok", !!byR?.ok && byR.data.length >= 1, String(byR?.data?.length));
    }
  }
  if (api.createFevoEvangelismRecord) {
    const ev = await api.createFevoEvangelismRecord({
      report_id: "fevo-rpt-smoke",
      souls_evangelized: 20,
      new_converts: 3,
      materials_distributed: 15,
    });
    ok("createFevoEvangelismRecord ok", !!ev?.ok, ev?.error || "");
  }
  if (api.createFevoVisitationRecord) {
    const vi = await api.createFevoVisitationRecord({
      report_id: "fevo-rpt-smoke",
      souls_visited: 6,
      family_members_reached: 4,
      homes_visited: 3,
    });
    ok("createFevoVisitationRecord ok", !!vi?.ok, vi?.error || "");
  }
  if (api.createFevoPrayerRecord) {
    const pr = await api.createFevoPrayerRecord({
      report_id: "fevo-rpt-smoke",
      days_of_prayer: 3,
      average_members_present: 12,
      prayer_focus: "Smoke prayer",
    });
    ok("createFevoPrayerRecord ok", !!pr?.ok, pr?.error || "");
  }
  if (api.listFevoFollowUpRecords) {
    const fu = await api.listFevoFollowUpRecords();
    ok("listFevoFollowUpRecords ok", !!fu?.ok, fu?.error || "");
    ok(
      "follow-up seed or created non-empty",
      Array.isArray(fu?.data) && fu.data.length > 0,
      String(fu?.data?.length || 0),
    );
  }
  if (api.listFevoEvangelismRecords) {
    const ev = await api.listFevoEvangelismRecords();
    ok("listFevoEvangelismRecords ok", !!ev?.ok, ev?.error || "");
  }
  if (api.getFevoOverviewStats) {
    const stats = await api.getFevoOverviewStats();
    ok("getFevoOverviewStats ok", !!stats?.ok, stats?.error || "");
  }
  if (api.getFevoEvangelismStats) {
    const es = await api.getFevoEvangelismStats();
    ok("getFevoEvangelismStats ok", !!es?.ok, es?.error || "");
  }
  if (api.getFevoPrayerStats) {
    const ps = await api.getFevoPrayerStats();
    ok("getFevoPrayerStats ok", !!ps?.ok, ps?.error || "");
  }
  if (api.getFevoMissingReportsStats) {
    const ms = await api.getFevoMissingReportsStats();
    ok("getFevoMissingReportsStats ok", !!ms?.ok, ms?.error || "");
  }
  if (api.getFevoWeeklyReport) {
    const wr = await api.getFevoWeeklyReport({});
    ok("getFevoWeeklyReport ok", !!wr?.ok, wr?.error || "");
  }
  if (api.detectMissingReports && cfg?.ok) {
    const det = await api.detectMissingReports(cfg.data.id);
    ok("detectMissingReports ok", !!det?.ok, det?.error || "");
  }
}

// local persistence
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
if (globalThis.CEDataLayer?.resetDataProvider) {
  try {
    globalThis.CEDataLayer.resetDataProvider();
  } catch (_) {}
}
const localApi = globalThis.CEFevo || globalThis.CEDataLayer?.fevo;
if (localApi?.createFevoWeeklyConfig) {
  const localCreate = await localApi.createFevoWeeklyConfig({
    semana_inicio: "2026-09-01",
    semana_fim: "2026-09-07",
    team_a_activity: "Oração",
    estado: "Rascunho",
  });
  ok("local createFevoWeeklyConfig ok", !!localCreate?.ok, localCreate?.error || "");
  const raw = globalThis.localStorage.getItem("ce-data-layer:fevo-weekly-configs");
  ok(
    "localStorage fevo-weekly-configs written",
    !!raw && (raw.includes("2026-09-01") || raw.includes("Oração") || raw.includes("Oracao")),
    raw ? "has key" : "empty",
  );
}

ok("sacraments still exposed", !!(globalThis.CESacraments || globalThis.CEDataLayer?.sacraments));
ok("counseling still exposed", !!(globalThis.CECounseling || globalThis.CEDataLayer?.counseling));
ok("access control still exposed", !!(globalThis.CEAccessControlData || globalThis.CEDataLayer?.accessControl));

console.log("\n=== F.E.V.O data layer smoke ===\n");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
