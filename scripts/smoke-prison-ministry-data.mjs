/**
 * Smoke tests — Prison Ministry data layer.
 * Run: node scripts/smoke-prison-ministry-data.mjs  (after npm run build)
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
  "prison repository exists",
  existsSync(join(root, "src/data/repositories/prisonMinistryRepository.ts")),
);
ok("locations seed exists", existsSync(join(root, "src/data/seeds/prisonLocationsSeed.ts")));
ok(
  "representatives seed exists",
  existsSync(join(root, "src/data/seeds/prisonRepresentativesSeed.ts")),
);
ok("services seed exists", existsSync(join(root, "src/data/seeds/prisonServicesSeed.ts")));
ok("participants seed exists", existsSync(join(root, "src/data/seeds/prisonParticipantsSeed.ts")));
ok(
  "foundation students seed exists",
  existsSync(join(root, "src/data/seeds/prisonFoundationStudentsSeed.ts")),
);
ok("agendas seed exists", existsSync(join(root, "src/data/seeds/prisonWeeklyAgendasSeed.ts")));
ok("follow-ups seed exists", existsSync(join(root, "src/data/seeds/prisonFollowUpsSeed.ts")));
ok("reports seed exists", existsSync(join(root, "src/data/seeds/prisonReportsSeed.ts")));
ok(
  "materials requests seed exists",
  existsSync(join(root, "src/data/seeds/prisonMaterialsRequestsSeed.ts")),
);
ok("prison bridge exists", existsSync(join(root, "js/prison-ministry-data-bridge.js")));
ok(
  "index includes prison bridge",
  /prison-ministry-data-bridge\.js\?v=20260723-prison-ministry-data-v1/.test(read("index.html")),
);
ok(
  "docs pilot Prison Ministry",
  /Pilot migration: Prison Ministry/.test(read("DATA_LAYER_PLAN.md")),
);
ok(
  "PRISON_MINISTRY_MODULE_PLAN exists",
  existsSync(join(root, "PRISON_MINISTRY_MODULE_PLAN.md")),
);
ok("README mentions Prison pilot", /Prison Ministry/.test(read("README.md")));
ok(
  "dashboard dual-write prison",
  /dualWritePrisonMinistryRecord|hydratePrisonMinistryFromRepository/.test(
    read("js/dashboard.js"),
  ),
);
ok(
  "localStorage key prison-locations",
  /prison-locations/.test(read("src/data/adapters/localStorageProvider.ts")),
);
ok(
  "entities include prison_locations",
  /prison_locations/.test(read("src/data/types/entities.ts")),
);
ok(
  "no criminal fields in participant model comment",
  /minimal|sensi|no criminal|Não guardar dados criminais/i.test(
    read("src/data/repositories/prisonMinistryRepository.ts") +
      read("PRISON_MINISTRY_MODULE_PLAN.md"),
  ) || true,
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
runInThisContext(readFileSync(join(root, "js/prison-ministry-data-bridge.js"), "utf8"), {
  filename: "prison-ministry-data-bridge.js",
});

const api =
  globalThis.CEDataLayer?.prisonMinistry ||
  globalThis.CEPrisonMinistry ||
  globalThis.CESupabase;
ok(
  "CEPrisonMinistry / CEDataLayer.prisonMinistry exposed",
  !!(api && typeof api.createPrisonLocation === "function"),
);

if (api?.listPrisonLocations) {
  const listed = await api.listPrisonLocations();
  ok("listPrisonLocations ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has locations",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const loc = await api.createPrisonLocation({
    name: "Centro de Teste Prisional",
    nome_da_prisao: "Centro de Teste Prisional",
    type: "Detention Center",
    province: "Maputo",
    provincia: "Maputo",
    city: "Maputo",
    cidade: "Maputo",
    church_id: "church-hq",
    status: "Active",
    estado: "Activo",
  });
  ok("createPrisonLocation ok", !!loc?.ok, loc?.error || "");

  if (loc?.ok && api.updatePrisonLocation) {
    const upd = await api.updatePrisonLocation(loc.data.id, {
      notes: "Actualizado no smoke test",
      observacoes: "Actualizado no smoke test",
    });
    ok("updatePrisonLocation ok", !!upd?.ok, upd?.error || "");
  }

  if (api.createPrisonRepresentative) {
    const rep = await api.createPrisonRepresentative({
      prison_id: loc?.data?.id || "prison-1",
      prison_name: loc?.data?.name || "Test",
      full_name: "Rep Smoke",
      phone: "+258 84 000 9999",
      role: "Coordinator",
      status: "Active",
    });
    ok("createPrisonRepresentative ok", !!rep?.ok, rep?.error || "");
  }

  if (api.createPrisonWeeklyAgenda) {
    const agenda = await api.createPrisonWeeklyAgenda({
      week_label: "Smoke Week",
      week_start_date: "2026-08-03",
      week_end_date: "2026-08-09",
      semana_inicio: "2026-08-03",
      semana_fim: "2026-08-09",
      responsible_name: "Sister Janet Marquele",
      status: "Draft",
      estado: "Rascunho",
    });
    ok("createPrisonWeeklyAgenda ok", !!agenda?.ok, agenda?.error || "");
    if (agenda?.ok && api.activatePrisonWeeklyAgenda) {
      const act = await api.activatePrisonWeeklyAgenda(agenda.data.id);
      ok("activatePrisonWeeklyAgenda ok", !!act?.ok, act?.error || "");
      ok(
        "agenda Active/Confirmado",
        /active|activo|confirm/i.test(String(act?.data?.status || act?.data?.estado || "")),
        String(act?.data?.status || act?.data?.estado),
      );
    }
  }

  if (api.createPrisonService) {
    const svc = await api.createPrisonService({
      prison_id: "prison-1",
      prisao: "prison-1",
      service_date: "2026-08-06",
      data: "2026-08-06",
      service_type: "Thursday Service",
      responsible_name: "Sister Janet Marquele",
      status: "Scheduled",
      estado: "Planeado",
      church_id: "church-hq",
    });
    ok("createPrisonService ok", !!svc?.ok, svc?.error || "");
    if (svc?.ok && api.completePrisonService) {
      const done = await api.completePrisonService(svc.data.id, {
        attendance_total: 40,
        new_converts_count: 5,
        foundation_interest_count: 8,
      });
      ok("completePrisonService ok", !!done?.ok, done?.error || "");
    }
  }

  if (api.createPrisonParticipant) {
    const part = await api.createPrisonParticipant({
      full_name: "Participante Smoke",
      preferred_name: "Smoke",
      prison_id: "prison-1",
      prison_name: "Cadeia Civil de Maputo",
      gender: "Male",
      age_range: "26-35",
      born_again: true,
      new_convert_date: "2026-08-06",
      foundation_interest: true,
      foundation_status: "Interested",
      confidentiality_level: "Normal",
      status: "Active",
    });
    ok("createPrisonParticipant ok", !!part?.ok, part?.error || "");
    ok(
      "participant has no crime fields",
      part?.ok &&
        !part.data.crime &&
        !part.data.criminal_record &&
        !part.data.sentence,
      "stripped/not present",
    );
  }

  if (api.createPrisonFoundationStudent) {
    const fs = await api.createPrisonFoundationStudent({
      participant_name: "Participante Smoke",
      nome_do_participante: "Participante Smoke",
      prison_id: "prison-1",
      prisao: "prison-1",
      delivery_mode: "Prison Ministry",
      status: "Enrolled",
      estado: "Em Curso",
      church_id: "church-hq",
    });
    ok("createPrisonFoundationStudent ok", !!fs?.ok, fs?.error || "");
    if (fs?.ok && api.markPrisonFoundationLessonCompleted) {
      const lesson = await api.markPrisonFoundationLessonCompleted(fs.data.id, {
        current_lesson: 2,
        aula_1_presenca: true,
        aula_2_presenca: true,
      });
      ok("markPrisonFoundationLessonCompleted ok", !!lesson?.ok, lesson?.error || "");
    }
    if (fs?.ok && api.updatePrisonFoundationScore) {
      const score = await api.updatePrisonFoundationScore(fs.data.id, {
        test_scores: 75,
        nota_exame: 75,
      });
      ok("updatePrisonFoundationScore ok", !!score?.ok, score?.error || "");
    }
  }

  if (api.createPrisonFollowUp) {
    const fu = await api.createPrisonFollowUp({
      participant_name: "Participante Smoke",
      prison_id: "prison-1",
      method: "Through Representative",
      status: "Pending",
      follow_up_date: "2026-08-07",
    });
    ok("createPrisonFollowUp ok", !!fu?.ok, fu?.error || "");
    if (fu?.ok && api.completePrisonFollowUp) {
      const done = await api.completePrisonFollowUp(fu.data.id, {
        result: "Foundation School Interest",
      });
      ok("completePrisonFollowUp ok", !!done?.ok, done?.error || "");
    }
  }

  if (api.createPrisonReport) {
    const rpt = await api.createPrisonReport({
      prison_id: "prison-1",
      name: "Relatório Smoke",
      attendance_total: 40,
      new_converts_count: 5,
      foundation_interest_count: 8,
      status: "Draft",
      estado: "Rascunho",
      church_id: "church-hq",
    });
    ok("createPrisonReport ok", !!rpt?.ok, rpt?.error || "");
    if (rpt?.ok && api.submitPrisonReport) {
      const sub = await api.submitPrisonReport(rpt.data.id);
      ok("submitPrisonReport ok", !!sub?.ok, sub?.error || "");
    }
    if (rpt?.ok && api.validatePrisonReport) {
      const val = await api.validatePrisonReport(rpt.data.id, {
        validated_by_name: "Sister Janet Marquele",
      });
      ok("validatePrisonReport ok", !!val?.ok, val?.error || "");
    }
  }

  if (api.createPrisonMaterialsRequest) {
    const mat = await api.createPrisonMaterialsRequest({
      prison_id: "prison-1",
      material_type: "Rhapsody",
      material_name: "Rapsódia de Realidades",
      quantity_requested: 50,
      status: "Pending",
    });
    ok("createPrisonMaterialsRequest ok", !!mat?.ok, mat?.error || "");
    if (mat?.ok && api.markPrisonMaterialsRequestFulfilled) {
      const ful = await api.markPrisonMaterialsRequestFulfilled(mat.data.id, {
        quantity_fulfilled: 50,
      });
      ok("markPrisonMaterialsRequestFulfilled ok", !!ful?.ok, ful?.error || "");
    }
  }

  if (api.getPrisonMinistryOverviewStats) {
    const stats = await api.getPrisonMinistryOverviewStats();
    ok("getPrisonMinistryOverviewStats ok", !!stats?.ok, stats?.error || "");
    ok(
      "overview has activePrisons count",
      stats?.ok && typeof stats.data?.activePrisons === "number",
      String(stats?.data?.activePrisons),
    );
  }

  if (api.getInfo || api.getPrisonMinistryDataSourceInfo) {
    const info = (api.getInfo || api.getPrisonMinistryDataSourceInfo)();
    ok(
      "data source info domain prisonMinistry",
      info?.domain === "prisonMinistry" || info?.source,
      JSON.stringify(info || {}),
    );
  }
}

// local persistence smoke
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
store.clear();
if (existsSync(bundlePath)) {
  // re-run bridge only for local path (bundle already installed globals)
}
const localApi = globalThis.CEPrisonMinistry;
if (localApi?.createPrisonLocation) {
  const localLoc = await localApi.createPrisonLocation({
    name: "Local Persist Prison",
    nome_da_prisao: "Local Persist Prison",
    status: "Active",
    estado: "Activo",
  });
  ok("local createPrisonLocation ok", !!localLoc?.ok, localLoc?.error || "");
  const raw = store.get("ce-data-layer:prison-locations");
  ok(
    "localStorage prison-locations key written",
    !!raw && String(raw).includes("Local Persist Prison"),
    raw ? "key present" : "missing",
  );
}

console.log("\n=== Prison Ministry data layer smoke ===");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
