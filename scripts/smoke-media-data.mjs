/**
 * Smoke tests — Media Department data layer.
 * Run: node scripts/smoke-media-data.mjs  (after npm run build)
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
ok(
  "media repository exists",
  existsSync(join(root, "src/data/repositories/mediaRepository.ts")),
);
ok("media team seed exists", existsSync(join(root, "src/data/seeds/mediaTeamSeed.ts")));
ok("media roles seed exists", existsSync(join(root, "src/data/seeds/mediaRolesSeed.ts")));
ok("media services seed exists", existsSync(join(root, "src/data/seeds/mediaServicesSeed.ts")));
ok("media schedules seed exists", existsSync(join(root, "src/data/seeds/mediaSchedulesSeed.ts")));
ok("media channels seed exists", existsSync(join(root, "src/data/seeds/mediaChannelsSeed.ts")));
ok("media performance seed exists", existsSync(join(root, "src/data/seeds/mediaPerformanceSeed.ts")));
ok("media awards seed exists", existsSync(join(root, "src/data/seeds/mediaAwardsSeed.ts")));
ok("media bridge exists", existsSync(join(root, "js/media-data-bridge.js")));
ok(
  "index includes media bridge",
  /media-data-bridge\.js\?v=20260723-media-data-v1/.test(read("index.html")),
);
ok("docs pilot Media Department", /Pilot migration: Media Department/.test(read("DATA_LAYER_PLAN.md")));
ok("MEDIA_MODULE_PLAN exists", existsSync(join(root, "MEDIA_MODULE_PLAN.md")));
ok("README mentions Media pilot", /Media Department/.test(read("README.md")));
ok(
  "dashboard dual-write media",
  /dualWriteMediaRecord|hydrateMediaFromRepository/.test(read("js/dashboard.js")),
);
ok(
  "localStorage key media-team",
  /media-team/.test(read("src/data/adapters/localStorageProvider.ts")),
);
ok(
  "bridge strips stream_key",
  /stream_key/.test(read("js/media-data-bridge.js")),
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
runInThisContext(readFileSync(join(root, "js/media-data-bridge.js"), "utf8"), {
  filename: "media-data-bridge.js",
});

const api =
  globalThis.CEDataLayer?.media || globalThis.CEMedia || globalThis.CESupabase;
ok("CEMedia / CEDataLayer.media exposed", !!(api && typeof api.createMediaTeamMember === "function"));

if (api?.listMediaTeam) {
  const listed = await api.listMediaTeam();
  ok("listMediaTeam ok", !!listed?.ok, listed?.error || "");
  ok(
    "seed has media team",
    Array.isArray(listed?.data) && listed.data.length > 0,
    String(listed?.data?.length || 0),
  );

  const created = await api.createMediaTeamMember({
    full_name: "Smoke Media Tech",
    phone: "840000888",
    email: "smoke.media@ce-mozambique.org",
    church_id: "church-hq",
    church_name: "E.C. Maputo Central - Sede",
    department_name: "Mídia",
    primary_role_name: "Operador de Câmara",
    skill_level: "Intermediate",
    status: "Active",
    staff_id: "staff-smoke-media",
    staff_name: "Smoke Media Tech",
  });
  ok("createMediaTeamMember ok", !!created?.ok, created?.error || "");
  ok(
    "status Active/Activo",
    /activ|activo/i.test(String(created?.data?.status || "")),
    String(created?.data?.status),
  );

  if (created?.ok && api.updateMediaTeamMember) {
    const updated = await api.updateMediaTeamMember(created.data.id, {
      skill_level: "Advanced",
      primary_role_name: "Técnico de Som",
    });
    ok("updateMediaTeamMember ok", !!updated?.ok, updated?.error || "");
    ok(
      "skill Advanced",
      /advanced/i.test(String(updated?.data?.skill_level || "")),
      String(updated?.data?.skill_level),
    );
  }

  if (api.createMediaRole) {
    const role = await api.createMediaRole({
      name: "Smoke Role",
      category: "Camera",
      required_skill_level: "Beginner",
      status: "Active",
    });
    ok("createMediaRole ok", !!role?.ok, role?.error || "");
  }

  if (api.createMediaService) {
    const svc = await api.createMediaService({
      name: "Smoke Special Service",
      service_type: "Special Program",
      service_date: "2026-08-15",
      start_time: "18:00",
      church_id: "church-hq",
      status: "Scheduled",
      needs_streaming: true,
    });
    ok("createMediaService ok", !!svc?.ok, svc?.error || "");
  }

  let scheduleId = null;
  if (api.createMediaSchedule) {
    const sch = await api.createMediaSchedule({
      service_name: "Smoke Special Service",
      service_date: "2026-08-15",
      start_time: "18:00",
      status: "Assigned",
      team_member_id: created?.data?.id,
      team_member_name: "Smoke Media Tech",
      assignments: [
        {
          id: "as-smoke-1",
          role_name: "Operador de Câmara",
          technician_id: created?.data?.id,
          technician_name: "Smoke Media Tech",
          status: "Assigned",
          confirmation_status: "Pending",
          attendance_status: "Not Checked In",
        },
      ],
    });
    ok("createMediaSchedule ok", !!sch?.ok, sch?.error || "");
    scheduleId = sch?.data?.id || null;
  }

  if (scheduleId && api.confirmScheduleAssignment) {
    const conf = await api.confirmScheduleAssignment(scheduleId, {
      assignment_id: "as-smoke-1",
      team_member_id: created?.data?.id,
    });
    ok("confirmScheduleAssignment ok", !!conf?.ok, conf?.error || "");
  }

  if (scheduleId && api.markCheckIn) {
    const cin = await api.markCheckIn(scheduleId, {
      assignment_id: "as-smoke-1",
      team_member_id: created?.data?.id,
      check_in_time: "17:45",
    });
    ok("markCheckIn ok", !!cin?.ok, cin?.error || "");
  }

  if (scheduleId && api.markCheckOut) {
    const cout = await api.markCheckOut(scheduleId, {
      assignment_id: "as-smoke-1",
      team_member_id: created?.data?.id,
      check_out_time: "20:00",
    });
    ok("markCheckOut ok", !!cout?.ok, cout?.error || "");
  }

  if (api.createMediaChannel) {
    const ch = await api.createMediaChannel({
      name: "Smoke YouTube",
      type: "YouTube",
      platform_url: "https://youtube.com/@smoke",
      requires_stream_key: true,
      stream_key_status: "Missing",
      stream_key: "SECRET-SHOULD-NOT-PERSIST",
      is_active: true,
      status: "Active",
    });
    ok("createMediaChannel ok", !!ch?.ok, ch?.error || "");
    ok(
      "no real stream_key stored",
      ch?.data?.stream_key == null || ch?.data?.stream_key === undefined,
      String(ch?.data?.stream_key),
    );
    ok(
      "stream_key_status preserved",
      /missing|configured|not required/i.test(String(ch?.data?.stream_key_status || "")),
      String(ch?.data?.stream_key_status),
    );
  }

  if (api.createMediaPerformanceReview) {
    const perf = await api.createMediaPerformanceReview({
      team_member_id: created?.data?.id,
      team_member_name: "Smoke Media Tech",
      technician_id: created?.data?.id,
      technician_name: "Smoke Media Tech",
      service_name: "Smoke Special Service",
      service_date: "2026-08-15",
      role_name: "Operador de Câmara",
      punctuality_score: 90,
      technical_quality_score: 85,
      teamwork_score: 88,
      responsibility_score: 92,
      problem_solving_score: 80,
      spiritual_attitude_score: 95,
      status: "Submitted",
      evaluated_at: "2026-08-16",
    });
    ok("createMediaPerformanceReview ok", !!perf?.ok, perf?.error || "");
    ok(
      "overall_score computed",
      Number(perf?.data?.overall_score || 0) > 0,
      String(perf?.data?.overall_score),
    );
    const expected =
      Math.round(
        ((90 + 85 + 88 + 92 + 80 + 95) / 6) * 10,
      ) / 10;
    ok(
      "overall_score near average",
      Math.abs(Number(perf?.data?.overall_score) - expected) < 1,
      `${perf?.data?.overall_score} vs ~${expected}`,
    );
  }

  if (api.createMediaAward) {
    const award = await api.createMediaAward({
      year: 2026,
      award_category: "Revelação do Ano",
      award_name: "Smoke Award",
      team_member_id: created?.data?.id,
      team_member_name: "Smoke Media Tech",
      reason: "Smoke test",
      status: "Nominated",
    });
    ok("createMediaAward ok", !!award?.ok, award?.error || "");
  }

  if (api.getMediaOverviewStats) {
    const stats = await api.getMediaOverviewStats();
    ok("getMediaOverviewStats ok", !!stats?.ok, stats?.error || "");
    ok(
      "overview has totalTeam",
      stats?.data && typeof stats.data.totalTeam === "number",
      String(stats?.data?.totalTeam),
    );
  }

  if (api.listMediaRoles) {
    const roles = await api.listMediaRoles();
    ok("listMediaRoles ok", !!roles?.ok, roles?.error || "");
    ok(
      "roles seed non-empty",
      Array.isArray(roles?.data) && roles.data.length > 0,
      String(roles?.data?.length || 0),
    );
  }

  if (api.listMediaChannels) {
    const channels = await api.listMediaChannels();
    ok("listMediaChannels ok", !!channels?.ok, channels?.error || "");
    const anyKey = (channels?.data || []).some(
      (c) => c.stream_key != null && String(c.stream_key).length > 0,
    );
    ok("channels seed has no real stream keys", !anyKey);
  }
}

// local mode persistence
globalThis.__CE_ENV__ = { VITE_DATA_SOURCE: "local" };
if (globalThis.CEDataLayer?.resetDataProvider) {
  try {
    globalThis.CEDataLayer.resetDataProvider();
  } catch (_) {}
}
const localApi = globalThis.CEMedia || globalThis.CEDataLayer?.media;
if (localApi?.createMediaTeamMember) {
  const localCreate = await localApi.createMediaTeamMember({
    full_name: "Local Persist Tech",
    status: "Active",
    skill_level: "Beginner",
  });
  ok("local createMediaTeamMember ok", !!localCreate?.ok, localCreate?.error || "");
  const raw = globalThis.localStorage.getItem("ce-data-layer:media-team");
  ok("localStorage media-team written", !!raw && raw.includes("Local Persist Tech"), raw ? "has key" : "empty");
}

console.log("\n=== Media data layer smoke ===\n");
results.forEach((r) => console.log(r));
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
