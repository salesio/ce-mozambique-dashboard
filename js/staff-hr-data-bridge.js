/**
 * Staff & HR data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:staff | staff-departments | staff-roles | staff-salaries |
 *       staff-performance | staff-documents | staff-attendance
 * Does NOT create finance expense records for salaries.
 * Salary data remains sensitive — UI RBAC must filter display.
 */
(function () {
  var KEYS = {
    staff: "ce-data-layer:staff",
    departments: "ce-data-layer:staff-departments",
    roles: "ce-data-layer:staff-roles",
    salaries: "ce-data-layer:staff-salaries",
    performance: "ce-data-layer:staff-performance",
    documents: "ce-data-layer:staff-documents",
    attendance: "ce-data-layer:staff-attendance",
  };
  var memory = {
    staff: null,
    departments: null,
    roles: null,
    salaries: null,
    performance: null,
    documents: null,
    attendance: null,
  };

  function resolveDataSource() {
    try {
      var runtime = window.__CE_ENV__ && window.__CE_ENV__.VITE_DATA_SOURCE;
      var fromBundle =
        window.CESupabase && typeof window.CESupabase.getDataSource === "function"
          ? window.CESupabase.getDataSource()
          : window.CEDataLayer && typeof window.CEDataLayer.getDataSource === "function"
            ? window.CEDataLayer.getDataSource()
            : "";
      var value = String(runtime || fromBundle || "mock").trim().toLowerCase();
      if (value === "local" || value === "api" || value === "supabase" || value === "mock") return value;
    } catch (_) {}
    return "mock";
  }

  function resolveApi() {
    var layer = window.CEDataLayer && (window.CEDataLayer.staffHR || window.CEDataLayer.staff);
    if (layer && typeof layer.createStaff === "function") {
      return { api: layer, via: "CEDataLayer.staffHR" };
    }
    if (window.CEStaffHR && typeof window.CEStaffHR.createStaff === "function") {
      return { api: window.CEStaffHR, via: "CEStaffHR" };
    }
    if (window.CESupabase && typeof window.CESupabase.createStaff === "function") {
      return { api: window.CESupabase, via: "CESupabase" };
    }
    return { api: null, via: "none" };
  }

  function load(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function save(key, rows) {
    try {
      localStorage.setItem(key, JSON.stringify(rows));
    } catch (e) {
      console.warn("[CE StaffHR] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "staff") return S.STAFF_SEED || [];
    if (kind === "departments") return S.STAFF_DEPARTMENTS_SEED || [];
    if (kind === "roles") return S.STAFF_ROLES_SEED || [];
    if (kind === "salaries") return S.STAFF_SALARIES_SEED || [];
    if (kind === "performance") return S.STAFF_PERFORMANCE_SEED || [];
    if (kind === "documents") return S.STAFF_DOCUMENTS_SEED || [];
    if (kind === "attendance") return S.STAFF_ATTENDANCE_SEED || [];
    return [];
  }

  function store(kind) {
    var source = resolveDataSource();
    var key = KEYS[kind];
    if (source === "local") {
      var rows = load(key);
      if (!rows.length) {
        rows = seedFor(kind).map(function (s) {
          return Object.assign({}, s);
        });
        if (rows.length) save(key, rows);
      }
      return { rows: rows, persist: true };
    }
    if (!memory[kind]) {
      memory[kind] = seedFor(kind).map(function (s) {
        return Object.assign({}, s);
      });
    }
    return { rows: memory[kind], persist: false };
  }

  function ok(data) {
    return { ok: true, data: data };
  }
  function fail(error, code) {
    return { ok: false, error: error || "Erro", code: code || "FALLBACK_ERROR" };
  }

  function pure() {
    function list(kind) {
      return ok(store(kind).rows.slice());
    }
    function create(kind, idPrefix, payload) {
      var s = store(kind);
      var row = Object.assign({}, payload, {
        id: (payload && payload.id) || idPrefix + Date.now(),
        updated_at: new Date().toISOString().slice(0, 10),
      });
      s.rows.unshift(row);
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(row);
    }
    function update(kind, id, payload) {
      var s = store(kind);
      var i = s.rows.findIndex(function (r) {
        return r.id === id;
      });
      if (i < 0) return fail("Não encontrado", "NOT_FOUND");
      s.rows[i] = Object.assign({}, s.rows[i], payload, { id: id });
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(s.rows[i]);
    }
    function remove(kind, id) {
      var s = store(kind);
      s.rows = s.rows.filter(function (r) {
        return r.id !== id;
      });
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(true);
    }
    return {
      listStaff: function () {
        return list("staff");
      },
      getStaffById: function (id) {
        var row = store("staff").rows.find(function (r) {
          return r.id === id;
        });
        return ok(row || null);
      },
      createStaff: function (payload) {
        return create("staff", "staff-", payload);
      },
      updateStaff: function (id, payload) {
        return update("staff", id, payload);
      },
      deleteStaff: function (id) {
        return remove("staff", id);
      },
      searchStaff: function (query) {
        var q = String(query || "").toLowerCase();
        return ok(
          store("staff").rows.filter(function (r) {
            return String(r.full_name || "")
              .toLowerCase()
              .includes(q);
          }),
        );
      },
      getActiveStaff: function () {
        return ok(
          store("staff").rows.filter(function (r) {
            return /activ|activo|ativo/i.test(String(r.status || ""));
          }),
        );
      },
      getStaffWithBirthdayToday: function () {
        var today = new Date();
        var m = String(today.getMonth() + 1).padStart(2, "0");
        var d = String(today.getDate()).padStart(2, "0");
        return ok(
          store("staff").rows.filter(function (r) {
            var dob = String(r.date_of_birth || "");
            return dob.slice(5, 10) === m + "-" + d;
          }),
        );
      },
      getUpcomingBirthdays: function (days) {
        return ok(store("staff").rows.slice(0, 10));
      },
      getStaffWithAssignedEquipment: function () {
        return ok([]);
      },
      listStaffDepartments: function () {
        return list("departments");
      },
      createStaffDepartment: function (p) {
        return create("departments", "dept-", p);
      },
      updateStaffDepartment: function (id, p) {
        return update("departments", id, p);
      },
      listStaffRoles: function () {
        return list("roles");
      },
      createStaffRole: function (p) {
        return create("roles", "role-", p);
      },
      updateStaffRole: function (id, p) {
        return update("roles", id, p);
      },
      listStaffSalaries: function () {
        return list("salaries");
      },
      getSalaryByStaffId: function (staffId) {
        return ok(
          store("salaries").rows.filter(function (r) {
            return r.staff_id === staffId;
          }),
        );
      },
      createStaffSalary: function (p) {
        return create("salaries", "sal-", p);
      },
      updateStaffSalary: function (id, p) {
        return update("salaries", id, p);
      },
      listPerformanceReviews: function () {
        return list("performance");
      },
      createPerformanceReview: function (p) {
        return create("performance", "perf-", p);
      },
      updatePerformanceReview: function (id, p) {
        return update("performance", id, p);
      },
      listStaffDocuments: function () {
        return list("documents");
      },
      createStaffDocument: function (p) {
        return create("documents", "doc-", p);
      },
      updateStaffDocument: function (id, p) {
        return update("documents", id, p);
      },
      listStaffAttendance: function () {
        return list("attendance");
      },
      createStaffAttendance: function (p) {
        return create("attendance", "att-", p);
      },
      updateStaffAttendance: function (id, p) {
        return update("attendance", id, p);
      },
      getInfo: function () {
        return { source: resolveDataSource(), provider: "pure-js-fallback", ready: true };
      },
    };
  }

  async function call(method, args) {
    var resolved = resolveApi();
    var api = resolved.api || pure();
    var fn = api[method];
    var fallback = pure();
    if (typeof fn !== "function") fn = fallback[method];
    if (typeof fn !== "function") return fail("Método em falta: " + method);
    try {
      return await Promise.resolve(fn.apply(api, args || []));
    } catch (error) {
      console.warn("[CE StaffHR] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var methods = [
    "listStaff",
    "getStaffById",
    "createStaff",
    "updateStaff",
    "deleteStaff",
    "searchStaff",
    "getActiveStaff",
    "getStaffWithBirthdayToday",
    "getUpcomingBirthdays",
    "getStaffWithAssignedEquipment",
    "listStaffDepartments",
    "createStaffDepartment",
    "updateStaffDepartment",
    "listStaffRoles",
    "createStaffRole",
    "updateStaffRole",
    "listStaffSalaries",
    "getSalaryByStaffId",
    "createStaffSalary",
    "updateStaffSalary",
    "listPerformanceReviews",
    "createPerformanceReview",
    "updatePerformanceReview",
    "listStaffDocuments",
    "createStaffDocument",
    "updateStaffDocument",
    "listStaffAttendance",
    "createStaffAttendance",
    "updateStaffAttendance",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      var map = {
        staffProfile: { create: "createStaff", update: "updateStaff" },
        staffPerformance: { create: "createPerformanceReview", update: "updatePerformanceReview" },
        staffSalary: { create: "createStaffSalary", update: "updateStaffSalary" },
        staffDocument: { create: "createStaffDocument", update: "updateStaffDocument" },
        staffAttendance: { create: "createStaffAttendance", update: "updateStaffAttendance" },
      };
      var entry = map[kind];
      if (!entry) return Promise.resolve({ ok: true, skipped: true });
      if (mode === "create") return call(entry.create, [record]);
      if (mode === "update") return call(entry.update, [record.id, record]);
      return Promise.resolve({ ok: true, skipped: true });
    },
  };

  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  // Merge with existing CEStaffHr helpers (RBAC, birthdays UI) — do not wipe them
  var existingHr = window.CEStaffHr || {};
  window.CEStaffHR = Object.assign({}, dataApi);
  // Keep legacy name used by dashboard
  window.CEStaffHr = Object.assign({}, existingHr, {
    // data layer methods available under same object when not conflicting
    listStaff: dataApi.listStaff,
    createStaff: dataApi.createStaff,
    updateStaff: dataApi.updateStaff,
    deleteStaff: dataApi.deleteStaff,
    listStaffSalaries: dataApi.listStaffSalaries,
    createStaffSalary: dataApi.createStaffSalary,
    listPerformanceReviews: dataApi.listPerformanceReviews,
    createPerformanceReview: dataApi.createPerformanceReview,
    listStaffDocuments: dataApi.listStaffDocuments,
    listStaffAttendance: dataApi.listStaffAttendance,
    dualWriteRecord: dataApi.dualWriteRecord,
    getInfo: dataApi.getInfo,
    dataApi: dataApi,
  });

  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.staffHR) window.CEDataLayer.staffHR = dataApi;
  if (!window.CEDataLayer.staff) window.CEDataLayer.staff = dataApi;

  try {
    console.info("[CE StaffHR] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
