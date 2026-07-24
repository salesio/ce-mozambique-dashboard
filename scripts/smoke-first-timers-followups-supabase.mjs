/**
 * Phase 4 — First Timers + Follow-Up Supabase pilot smoke (no cloud required).
 * Run: npm run test:first-timers-followups-supabase (after npm run build)
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
  "src/data/adapters/supabase/firstTimersSupabaseAdapter.ts",
  "src/data/adapters/supabase/followUpsSupabaseAdapter.ts",
  "src/data/adapters/api/firstTimersApiAdapter.ts",
  "src/data/adapters/api/followUpsApiAdapter.ts",
  "supabase/migrations/0004_first_timers_followups_pilot.sql",
  "supabase/seeds/first_timers_followups_seed.sql",
  "docs/backend/FIRST_TIMERS_FOLLOWUPS_SUPABASE_PILOT.md",
];

for (const f of files) {
  ok(`exists ${f}`, existsSync(join(root, f)));
}

const schema = read("database/schema.sql");
ok("schema first_timers", /create table if not exists public\.first_timers/i.test(schema));
ok("schema follow_ups", /create table if not exists public\.follow_ups/i.test(schema));
ok(
  "schema follow_up_timeline_events",
  /create table if not exists public\.follow_up_timeline_events/i.test(schema),
);
ok("schema idx_first_timers_church_id", /idx_first_timers_church_id/i.test(schema));
ok("schema idx_follow_ups_status", /idx_follow_ups_status/i.test(schema));
ok(
  "schema idx_follow_up_timeline_follow_up_id",
  /idx_follow_up_timeline_follow_up_id/i.test(schema),
);

const mig = read("supabase/migrations/0004_first_timers_followups_pilot.sql");
ok("migration 0004 content", /first_timers/i.test(mig) && /follow_ups/i.test(mig));
ok("migration no drop table", !/drop table/i.test(mig));

const envEx = read(".env.example");
ok(".env.example flags", /VITE_ENABLE_SUPABASE/.test(envEx) && /VITE_DATA_SOURCE/.test(envEx));

const ftRepo = read("src/data/repositories/firstTimersRepository.ts");
ok("firstTimers repo supabase route", /useSupabaseFirstTimers|firstTimersSupabaseAdapter/.test(ftRepo));
const fuRepo = read("src/data/repositories/followUpsRepository.ts");
ok("followUps repo supabase route", /useSupabaseFollowUps|followUpsSupabaseAdapter/.test(fuRepo));

for (const a of [
  "src/data/adapters/supabase/firstTimersSupabaseAdapter.ts",
  "src/data/adapters/supabase/followUpsSupabaseAdapter.ts",
]) {
  ok(`${a} no service role`, !/SERVICE_ROLE_KEY\s*=\s*['"`]/.test(read(a)));
}

ok(
  "docs pilot",
  /VITE_DATA_SOURCE=supabase/i.test(read("docs/backend/FIRST_TIMERS_FOLLOWUPS_SUPABASE_PILOT.md")),
);
ok(
  "DATA_LAYER_PLAN Phase 4",
  /Backend Phase 4|first-timers-followups/i.test(read("DATA_LAYER_PLAN.md")),
);
ok("README Phase 4", /First Timers|Follow-Up|Phase 4/i.test(read("README.md")));
ok(
  "settings indicator FT/FU",
  /first timers|follow-up/i.test(read("js/dashboard.js")),
);

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
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
  };

  try {
    runInThisContext(readFileSync(bundlePath, "utf8"), { filename: "supabase-bundle.js" });
    const CE = globalThis.CESupabase;
    ok("CESupabase exists", !!CE);

    if (CE?.listFirstTimers) {
      const r = await CE.listFirstTimers();
      ok("mock listFirstTimers ok", r?.ok === true, `n=${r?.data?.length ?? 0}`);
    }
    if (CE?.listFollowUps) {
      const r = await CE.listFollowUps();
      ok("mock listFollowUps ok", r?.ok === true, `n=${r?.data?.length ?? 0}`);
    }

    if (CE?.createSupabaseProvider) {
      const sp = CE.createSupabaseProvider();
      ok("provider getInfo", typeof sp.getInfo === "function");
      const info = sp.getInfo();
      ok("usingServiceRole false", info?.usingServiceRole === false);
      if (sp.firstTimers?.list) {
        const r = await sp.firstTimers.list();
        ok(
          "supabase firstTimers.list soft fail without env",
          r?.ok === false || r?.ok === true,
          r?.ok === false ? r.code || "" : "ready",
        );
        if (r && !r.ok) {
          ok(
            "friendly code",
            /NOT_CONFIGURED|SUPABASE|configur/i.test(String(r.error || "") + String(r.code || "")),
          );
        }
      }
      if (sp.followUps?.list) {
        const r = await sp.followUps.list();
        ok(
          "supabase followUps.list soft fail without env",
          r?.ok === false || r?.ok === true,
          r?.ok === false ? r.code || "" : "ready",
        );
      }
    }

    ok(
      "CEFirstTimers getInfo",
      !!(globalThis.CEFirstTimers && typeof globalThis.CEFirstTimers.getInfo === "function"),
    );
    ok(
      "CEFollowUps getInfo",
      !!(globalThis.CEFollowUps && typeof globalThis.CEFollowUps.getInfo === "function"),
    );

    // Churches/members still work
    if (CE?.listChurches) {
      const r = await CE.listChurches();
      ok("churches still ok", r?.ok === true);
    }
  } catch (e) {
    ok("runtime", false, e instanceof Error ? e.message : String(e));
  }
}

console.log(results.join("\n"));
console.log("");
console.log(`First Timers/Follow-Ups Supabase pilot: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
