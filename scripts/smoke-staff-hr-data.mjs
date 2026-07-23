/**
 * Smoke tests — Staff & HR data layer.
 * Run: node scripts/smoke-staff-hr-data.mjs  (after npm run build)
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

ok("staff hr repository exists", existsSync(join(root, "src/data/repositories/staffHrRepository.ts")));
ok("staff seed exists", existsSync(join(root, "src/data/seeds/staffSeed.ts")));
ok("staff departments seed exists", existsSync(join(root, "src/data/seeds/staffDepartmentsSeed.ts")));
ok("staff roles seed exists", existsSync(join(root, "src/data/seeds/staffRolesSeed.ts")));
ok("staff salaries seed exists", existsSync(join(root, "src/data/seeds/staffSalariesSeed.ts")));
ok("staff performance seed exists", existsSync(join(root, "src/data/seeds/staffPerformanceSeed.ts")));
ok("staff documents seed exists", existsSync(join(root, "src/data/seeds/staffDocumentsSeed.ts")));
ok("staff attendance seed exists", existsSync(join(root, "src/data/seeds/staffAttendanceSeed.ts")));
ok("staff hr bridge exists", existsSync(join(root, "js/staff-hr-data-bridge.js")));
ok(
  "index includes staff hr bridge",
  /staff-hr-data-bridge\.js\?v=20260723-staff-hr-data-v1/.test(read("index.html")),
);
ok("docs pilot Staff & HR", /Pilot migration: Staff & Human Resources/.test(read("DATA_LAYER_PLAN.md")));
ok("README mentions Staff pilot", /Staff & HR/.test(read("README.md")));
ok(
  "dashboard dual-write staff",
  /dualWriteStaffHrRecord|hydrateStaffHrFromRepository/.test(read("js/dashboard.js")),
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
runInThisContext(readFileSync(join(root, "js/staff-hr-data-bridge.js"), "utf8"), {
  filename: "staff-hr-data-bridge.js",
});

const api =
  globalThis.CEDataLayer?.staffHR || globalThis.CEStaffHR || globalThis.CESupabase;
ok("CEStaffHR / CEDataLayer.staffHR exposed", !!(api && typeof api.createStaff === "function"));

if (api?.listStaff) {
  const listed = await api.listStaff();
  ok("listStaff ok", !!listed?.ok, listed?.error || "");
  ok("seed has staff", Array.isArray(listed?.data) && listed.data.length > 0, String(listed?.data?.length || 0));

  const created = await api.createStaff({
    full_name: "Smoke Staff Member",
    first_name: "Smoke",
    last_name: "Member",
    title: "Brother",
    church_id: "church-hq",
    department_name: "Administração",
    role_title: "Staff Member",
    employment_type: "Full Time",
    status: "Active",
    date_of_birth: "1990-07-23",
    phone: "840000999",
    email: "smoke.staff@ce-mozambique.org",
    salary_or_allowance: 10000,
    created_by: "Smoke Tester",
  });
  ok("createStaff ok", !!created?.ok, created?.error || "");
  ok(
    "status Active/Activo",
    /activ|activo/i.test(String(created?.data?.status || "")),
    String(created?.data?.status),
  );
  ok("staff_code present", !!created?.data?.staff_code, String(created?.data?.staff_code));

  if (created?.ok && api.updateStaff) {
    const updated = await api.updateStaff(created.data.id, {
      department_name: "Finanças",
      role_title: "Finance Officer",
    });
    ok("updateStaff ok", !!updated?.ok, updated?.error || "");
    ok(
      "department updated",
      /finan/i.test(
        String(updated?.data?.department_name || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
      String(updated?.data?.department_name),
    );
  }

  if (api.createPerformanceReview) {
    const perf = await api.createPerformanceReview({
      staff_id: created?.data?.id,
      staff_name: "Smoke Staff Member",
      evaluation_period: "2026-Q3",
      punctuality_score: 8,
      task_completion_score: 9,
      report_submission_score: 7,
      teamwork_score: 8,
      supervisor_rating: 9,
      evaluated_by: "Smoke Tester",
      evaluated_at: "2026-07-23",
      status: "Reviewed",
    });
    ok("createPerformanceReview ok", !!perf?.ok, perf?.error || "");
    ok(
      "overall_score computed",
      Number(perf?.data?.overall_score || 0) > 0,
      String(perf?.data?.overall_score),
    );
  }

  if (api.createStaffSalary) {
    const sal = await api.createStaffSalary({
      staff_id: created?.data?.id,
      staff_name: "Smoke Staff Member",
      salary_type: "Salary",
      amount: 10000,
      base_amount: 10000,
      currency: "MZN",
      payment_frequency: "Monthly",
      status: "Pending Approval",
      payment_status: "Pendente",
    });
    ok("createStaffSalary ok", !!sal?.ok, sal?.error || "");
    ok("salary does not set transaction_type", sal?.data?.transaction_type == null);
  }

  if (api.createStaffDocument) {
    const doc = await api.createStaffDocument({
      staff_id: created?.data?.id,
      staff_name: "Smoke Staff Member",
      document_type: "Contract",
      document_title: "Smoke Contract",
      expiry_date: "2026-08-01",
    });
    ok("createStaffDocument ok", !!doc?.ok, doc?.error || "");
  }

  if (api.createStaffAttendance) {
    const att = await api.createStaffAttendance({
      staff_id: created?.data?.id,
      staff_name: "Smoke Staff Member",
      attendance_date: "2026-07-23",
      status: "Present",
      attendance_status: "Presente",
      event_type: "Office Day",
    });
    ok("createStaffAttendance ok", !!att?.ok, att?.error || "");
  }

  if (api.createStaffDepartment) {
    const dept = await api.createStaffDepartment({
      name: "Smoke Department",
      church_id: "church-hq",
      status: "Active",
    });
    ok("createStaffDepartment ok", !!dept?.ok, dept?.error || "");
  }

  if (api.createStaffRole) {
    const role = await api.createStaffRole({
      title: "Smoke Role",
      level: "Staff",
      status: "Active",
    });
    ok("createStaffRole ok", !!role?.ok, role?.error || "");
  }

  // Local persistence
  globalThis.__CE_ENV__.VITE_DATA_SOURCE = "local";
  if (typeof globalThis.CEDataLayer?.resetDataProvider === "function") {
    globalThis.CEDataLayer.resetDataProvider();
  }
  const bridge = globalThis.CEStaffHR;
  if (bridge?.createStaff) {
    const localStaff = await bridge.createStaff({
      id: "staff-local-smoke",
      full_name: "Local Persist Staff",
      status: "Active",
    });
    ok("local create staff ok", !!localStaff?.ok, localStaff?.error || "");
    const raw = globalThis.localStorage.getItem("ce-data-layer:staff");
    ok(
      "local key staff written",
      !!raw && raw.includes("staff-local-smoke"),
      raw ? `len=${raw.length}` : "empty",
    );
  }

  const info = api.getInfo?.() || api.getStaffHrDataSourceInfo?.();
  ok("getInfo available", !!info, JSON.stringify(info || {}));
}

ok(
  "venue inventory still exposed",
  !!(globalThis.CEDataLayer?.venueInventory || globalThis.CEVenueInventory || globalThis.CESupabase?.createInventoryItem),
);
ok(
  "finance still exposed",
  !!(globalThis.CEDataLayer?.finance || globalThis.CEFinance || globalThis.CESupabase?.createFinanceRecord),
);
ok(
  "requisitions still exposed",
  !!(globalThis.CEDataLayer?.requisitions || globalThis.CERequisitionsData || globalThis.CESupabase?.createRequisition),
);

console.log(results.join("\n"));
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
