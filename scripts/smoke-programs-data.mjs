/**
 * Smoke tests — Programs & Events data layer.
 * Run: node scripts/smoke-programs-data.mjs  (after npm run build)
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
  "programs repository exists",
  existsSync(join(root, "src/data/repositories/programsEventsRepository.ts")),
);
ok("programs seed exists", existsSync(join(root, "src/data/seeds/programsSeed.ts")));
ok("sessions seed exists", existsSync(join(root, "src/data/seeds/programSessionsSeed.ts")));
ok("teams seed exists", existsSync(join(root, "src/data/seeds/programTeamsSeed.ts")));
ok("participants seed exists", existsSync(join(root, "src/data/seeds/programParticipantsSeed.ts")));
ok(
  "registrations seed exists",
  existsSync(join(root, "src/data/seeds/programRegistrationsSeed.ts")),
);
ok("resources seed exists", existsSync(join(root, "src/data/seeds/programResourcesSeed.ts")));
ok("budgets seed exists", existsSync(join(root, "src/data/seeds/programBudgetsSeed.ts")));
ok("checklists seed exists", existsSync(join(root, "src/data/seeds/programChecklistsSeed.ts")));
ok("reports seed exists", existsSync(join(root, "src/data/seeds/programReportsSeed.ts")));
ok("programs bridge exists", existsSync(join(root, "js/programs-data-bridge.js")));
ok(
  "index includes programs bridge",
  /programs-data-bridge\.js\?v=20260723-programs-data-v1/.test(read("index.html")),
);
ok(
  "docs pilot Programs",
  /Pilot migration: Programs & Events/.test(read("DATA_LAYER_PLAN.md")),
);
ok("PROGRAMS_MODULE_PLAN exists", existsSync(join(root, "PROGRAMS_MODULE_PLAN.md")));
ok("README mentions Programs pilot", /Programs & Events/.test(read("README.md")));
ok(
  "dashboard dual-write programs",
  /dualWriteProgramsRecord|hydrateProgramsFromRepository/.test(read("js/dashboard.js")),
);
ok(
  "localStorage key programs",
  /ce-data-layer:programs|program-sessions/.test(
    read("src/data/adapters/localStorageProvider.ts"),
  ),
);
ok(
  "no auto financeRecord in programs repo",
  /finance_record_id:\s*null|no financeRecord|Budget only/i.test(
    read("src/data/repositories/programsEventsRepository.ts"),
  ),
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
runInThisContext(readFileSync(join(root, "js/programs-data-bridge.js"), "utf8"), {
  filename: "programs-data-bridge.js",
});

const api = globalThis.CEDataLayer?.programs || globalThis.CEPrograms || globalThis.CESupabase;
ok("CEPrograms exposed", !!(api && typeof api.createProgram === "function"));

ok(
  "ministry materials still exposed",
  !!(globalThis.CEMinistryMaterials || globalThis.CEDataLayer?.ministryMaterials),
);
ok("media still exposed", !!(globalThis.CEMedia || globalThis.CEDataLayer?.media));

if (api?.listPrograms) {
  const listed = await api.listPrograms();
  ok("listPrograms ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has programs",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const prog = await api.createProgram({
    name: "Smoke Special Sunday",
    program_type: "Special Event",
    category: "Local Church",
    church_id: "church-hq",
    start_date: "2026-08-15",
    end_date: "2026-08-15",
    owner: "Programs Team",
    responsible_name: "Programs Team",
    status: "Planning",
    estado: "Planeamento",
  });
  ok("createProgram ok", !!prog?.ok, prog?.error || "");

  if (prog?.ok && api.updateProgram) {
    const upd = await api.updateProgram(prog.data.id, {
      status: "Scheduled",
      estado: "Agendado",
      expected_attendance: 200,
    });
    ok("updateProgram ok", !!upd?.ok, upd?.error || "");
  }

  if (api.createProgramSession) {
    const sess = await api.createProgramSession({
      program_id: prog?.data?.id || "prog-1",
      program_name: prog?.data?.name || "Smoke",
      title: "Sessão Smoke",
      session_date: "2026-08-15",
      start_time: "10:00",
      end_time: "12:00",
      session_type: "Teaching",
      status: "Scheduled",
    });
    ok("createProgramSession ok", !!sess?.ok, sess?.error || "");
    if (sess?.ok && api.completeProgramSession) {
      const done = await api.completeProgramSession(sess.data.id, { attendance_count: 50 });
      ok("completeProgramSession ok", !!done?.ok, done?.error || "");
    }
  }

  if (api.createProgramTeam) {
    const team = await api.createProgramTeam({
      program_id: prog?.data?.id || "prog-1",
      program_name: prog?.data?.name || "Smoke",
      team_name: "Equipa Smoke",
      leader_name: "Coordinator Smoke",
      members: [{ name: "Volunteer A", role: "Usher", status: "Active" }],
      status: "Active",
    });
    ok("createProgramTeam ok", !!team?.ok, team?.error || "");
  }

  if (api.createProgramRegistration) {
    const reg = await api.createProgramRegistration({
      program_id: prog?.data?.id || "prog-1",
      program_name: prog?.data?.name || "Smoke",
      full_name: "Inscrito Smoke",
      phone: "840009999",
      church_id: "church-hq",
      status: "Pending",
      finance_record_id: null,
    });
    ok("createProgramRegistration ok", !!reg?.ok, reg?.error || "");
    ok(
      "registration finance_record_id null",
      reg?.ok && !reg.data.finance_record_id,
      String(reg?.data?.finance_record_id),
    );
    if (reg?.ok && api.approveProgramRegistration) {
      const ap = await api.approveProgramRegistration(reg.data.id);
      ok("approveProgramRegistration ok", !!ap?.ok, ap?.error || "");
    }
    if (reg?.ok && api.checkInProgramRegistration) {
      const ci = await api.checkInProgramRegistration(reg.data.id);
      ok("checkInProgramRegistration ok", !!ci?.ok, ci?.error || "");
    }
  }

  if (api.createProgramParticipant) {
    const part = await api.createProgramParticipant({
      program_id: prog?.data?.id || "prog-1",
      full_name: "Participante Smoke",
      participant_type: "Visitor",
      status: "Registered",
    });
    ok("createProgramParticipant ok", !!part?.ok, part?.error || "");
    if (part?.ok && api.markProgramParticipantAttendance) {
      const att = await api.markProgramParticipantAttendance(part.data.id, {
        attendance_status: "Present",
      });
      ok("markProgramParticipantAttendance ok", !!att?.ok, att?.error || "");
    }
  }

  if (api.createProgramResource) {
    const res = await api.createProgramResource({
      program_id: prog?.data?.id || "prog-1",
      resource_type: "Media",
      resource_name: "Câmeras Smoke",
      source_module: "Media",
      status: "Needed",
    });
    ok("createProgramResource ok", !!res?.ok, res?.error || "");
  }

  if (api.createProgramBudget) {
    const bud = await api.createProgramBudget({
      program_id: prog?.data?.id || "prog-1",
      budget_item: "Hospitality smoke",
      category: "Hospitality",
      estimated_amount: 5000,
      status: "Draft",
    });
    ok("createProgramBudget ok", !!bud?.ok, bud?.error || "");
  }

  // Finance not polluted
  const financeApi =
    globalThis.CEFinance || globalThis.CEDataLayer?.finance || globalThis.CESupabase;
  if (financeApi?.listFinanceRecords) {
    const fin = await financeApi.listFinanceRecords();
    ok("listFinanceRecords still ok", !!fin?.ok, fin?.error || "");
    const polluted = (fin?.data || []).some((r) => {
      const blob = [r.notes, r.description, r.category, r.reference]
        .map((x) => String(x || ""))
        .join(" ");
      return /Smoke Special Sunday|Hospitality smoke/i.test(blob);
    });
    ok("finance not auto-polluted by programs", !polluted);
  }

  if (api.createProgramChecklist) {
    const chk = await api.createProgramChecklist({
      program_id: prog?.data?.id || "prog-1",
      checklist_type: "Pre-Program",
      status: "Requires Attention",
      media_ready: false,
      materials_ready: false,
    });
    ok("createProgramChecklist ok", !!chk?.ok, chk?.error || "");
  }

  if (api.createProgramReport) {
    const rpt = await api.createProgramReport({
      program_id: prog?.data?.id || "prog-1",
      program_name: prog?.data?.name || "Smoke",
      attendance_total: 50,
      first_timers_count: 5,
      new_converts_count: 2,
      status: "Draft",
    });
    ok("createProgramReport ok", !!rpt?.ok, rpt?.error || "");
    if (rpt?.ok && api.submitProgramReport) {
      const sub = await api.submitProgramReport(rpt.data.id, {
        submitted_by_name: "Programs Team",
      });
      ok("submitProgramReport ok", !!sub?.ok, sub?.error || "");
    }
    if (rpt?.ok && api.validateProgramReport) {
      const val = await api.validateProgramReport(rpt.data.id, {
        validated_by_name: "Pastor Kene Ume",
      });
      ok("validateProgramReport ok", !!val?.ok, val?.error || "");
    }
  }

  if (api.getProgramsOverviewStats) {
    const stats = await api.getProgramsOverviewStats();
    ok("getProgramsOverviewStats ok", !!stats?.ok, stats?.error || "");
    ok(
      "overview has totalPrograms",
      stats?.ok && typeof stats.data?.totalPrograms === "number",
      String(stats?.data?.totalPrograms),
    );
  }

  if (api.getProgramBudgetReport) {
    const br = await api.getProgramBudgetReport();
    ok("getProgramBudgetReport ok", !!br?.ok, br?.error || "");
    ok(
      "budget report financeRecordsCreated is 0",
      br?.ok && (br.data.financeRecordsCreated === 0 || br.data.financeRecordsCreated == null),
      String(br?.data?.financeRecordsCreated),
    );
  }

  if (api.getInfo || api.getProgramsDataSourceInfo) {
    const info = (api.getInfo || api.getProgramsDataSourceInfo)();
    ok(
      "data source domain programs",
      info?.domain === "programs" || info?.source,
      JSON.stringify(info || {}),
    );
  }
}

// local persistence
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
store.clear();
const localApi = globalThis.CEPrograms;
if (localApi?.createProgram) {
  const localProg = await localApi.createProgram({
    name: "Local Persist Program",
    status: "Draft",
    church_id: "church-hq",
  });
  ok("local createProgram ok", !!localProg?.ok, localProg?.error || "");
  const raw = store.get("ce-data-layer:programs");
  ok(
    "localStorage programs key written",
    !!raw && String(raw).includes("Local Persist Program"),
    raw ? "key present" : "missing",
  );
}

console.log("\n=== Programs & Events data layer smoke ===");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
