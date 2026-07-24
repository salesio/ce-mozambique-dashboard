/**
 * Programs & Events data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:programs | program-sessions | program-teams |
 *       program-participants | program-registrations | program-resources |
 *       program-budgets | program-checklists | program-reports
 *
 * NEVER creates financeRecord. Budget is planning only. Soft module links only.
 */
(function () {
  var KEYS = {
    programs: "ce-data-layer:programs",
    sessions: "ce-data-layer:program-sessions",
    teams: "ce-data-layer:program-teams",
    participants: "ce-data-layer:program-participants",
    registrations: "ce-data-layer:program-registrations",
    resources: "ce-data-layer:program-resources",
    budgets: "ce-data-layer:program-budgets",
    checklists: "ce-data-layer:program-checklists",
    reports: "ce-data-layer:program-reports",
  };
  var memory = {
    programs: null,
    sessions: null,
    teams: null,
    participants: null,
    registrations: null,
    resources: null,
    budgets: null,
    checklists: null,
    reports: null,
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
    var layer = window.CEDataLayer && window.CEDataLayer.programs;
    if (layer && typeof layer.createProgram === "function") {
      return { api: layer, via: "CEDataLayer.programs" };
    }
    if (window.CEPrograms && typeof window.CEPrograms.createProgram === "function") {
      return { api: window.CEPrograms, via: "CEPrograms" };
    }
    if (window.CESupabase && typeof window.CESupabase.createProgram === "function") {
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
      console.warn("[CE Programs] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "programs") return S.PROGRAMS_SEED || [];
    if (kind === "sessions") return S.PROGRAM_SESSIONS_SEED || [];
    if (kind === "teams") return S.PROGRAM_TEAMS_SEED || [];
    if (kind === "participants") return S.PROGRAM_PARTICIPANTS_SEED || [];
    if (kind === "registrations") return S.PROGRAM_REGISTRATIONS_SEED || [];
    if (kind === "resources") return S.PROGRAM_RESOURCES_SEED || [];
    if (kind === "budgets") return S.PROGRAM_BUDGETS_SEED || [];
    if (kind === "checklists") return S.PROGRAM_CHECKLISTS_SEED || [];
    if (kind === "reports") return S.PROGRAM_REPORTS_SEED || [];
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
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function pure() {
    function list(kind) {
      return ok(store(kind).rows.slice());
    }
    function create(kind, idPrefix, payload) {
      var s = store(kind);
      var row = Object.assign({}, payload, {
        id: (payload && payload.id) || idPrefix + Date.now(),
        updated_at: today(),
        created_at: (payload && payload.created_at) || today(),
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
      s.rows[i] = Object.assign({}, s.rows[i], payload, { id: id, updated_at: today() });
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(s.rows[i]);
    }

    return {
      listPrograms: function () {
        return list("programs");
      },
      createProgram: function (p) {
        var row = Object.assign({ status: "Draft", estado: "Rascunho" }, p || {});
        row.owner = row.owner || row.responsible_name || "";
        row.responsible_name = row.responsible_name || row.owner || "";
        return create("programs", "prog-", row);
      },
      updateProgram: function (id, p) {
        return update("programs", id, p);
      },
      getActivePrograms: function () {
        return ok(
          store("programs").rows.filter(function (r) {
            return /sched|progress|approv|planning|agend|curso/i.test(
              String(r.status || r.estado || ""),
            );
          }),
        );
      },
      getUpcomingPrograms: function () {
        var t = today();
        return ok(
          store("programs").rows.filter(function (r) {
            return String(r.start_date || "") >= t;
          }),
        );
      },
      listProgramSessions: function () {
        return list("sessions");
      },
      createProgramSession: function (p) {
        return create("sessions", "psess-", Object.assign({ status: "Scheduled" }, p || {}));
      },
      updateProgramSession: function (id, p) {
        return update("sessions", id, p);
      },
      completeProgramSession: function (id, p) {
        return update("sessions", id, Object.assign({ status: "Completed" }, p || {}));
      },
      listProgramTeams: function () {
        return list("teams");
      },
      createProgramTeam: function (p) {
        return create("teams", "pteam-", Object.assign({ status: "Active", members: [] }, p || {}));
      },
      updateProgramTeam: function (id, p) {
        return update("teams", id, p);
      },
      listProgramParticipants: function () {
        return list("participants");
      },
      createProgramParticipant: function (p) {
        return create(
          "participants",
          "ppart-",
          Object.assign({ status: "Registered", attendance_status: "Not Checked In" }, p || {}),
        );
      },
      updateProgramParticipant: function (id, p) {
        return update("participants", id, p);
      },
      markProgramParticipantAttendance: function (id, p) {
        var status = (p && p.attendance_status) || "Present";
        return update("participants", id, {
          attendance_status: status,
          status: /present|late/i.test(status) ? "Attended" : "Registered",
          check_in_time: new Date().toISOString(),
        });
      },
      listProgramRegistrations: function () {
        return list("registrations");
      },
      createProgramRegistration: function (p) {
        return create(
          "registrations",
          "preg-",
          Object.assign(
            {
              status: "Pending",
              finance_record_id: null,
              payment_status: "Not Required",
              checked_in: false,
            },
            p || {},
          ),
        );
      },
      updateProgramRegistration: function (id, p) {
        return update("registrations", id, p || {});
      },
      approveProgramRegistration: function (id, p) {
        return update("registrations", id, Object.assign({ status: "Approved" }, p || {}));
      },
      rejectProgramRegistration: function (id, p) {
        return update("registrations", id, Object.assign({ status: "Rejected" }, p || {}));
      },
      checkInProgramRegistration: function (id, p) {
        return update(
          "registrations",
          id,
          Object.assign(
            {
              status: "Checked In",
              checked_in: true,
              check_in_time: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      getPendingProgramRegistrations: function () {
        return ok(
          store("registrations").rows.filter(function (r) {
            return /pend/i.test(String(r.status || ""));
          }),
        );
      },
      listProgramResources: function () {
        return list("resources");
      },
      createProgramResource: function (p) {
        return create("resources", "pres-", Object.assign({ status: "Needed" }, p || {}));
      },
      updateProgramResource: function (id, p) {
        return update("resources", id, p);
      },
      listProgramBudgets: function () {
        return list("budgets");
      },
      createProgramBudget: function (p) {
        return create(
          "budgets",
          "pbud-",
          Object.assign(
            {
              status: "Draft",
              currency: "MTn",
              notes: "Budget only — no financeRecord",
            },
            p || {},
          ),
        );
      },
      updateProgramBudget: function (id, p) {
        return update("budgets", id, p);
      },
      getProgramBudgetSummary: function (programId) {
        var rows = store("budgets").rows.filter(function (b) {
          return b.program_id === programId;
        });
        return ok({
          programId: programId,
          items: rows,
          estimated: rows.reduce(function (s, b) {
            return s + Number(b.estimated_amount || 0);
          }, 0),
          approved: rows.reduce(function (s, b) {
            return s + Number(b.approved_amount || 0);
          }, 0),
          spent: rows.reduce(function (s, b) {
            return s + Number(b.spent_amount || 0);
          }, 0),
          note: "Budget is not verified expense",
        });
      },
      listProgramChecklists: function () {
        return list("checklists");
      },
      createProgramChecklist: function (p) {
        return create("checklists", "pchk-", Object.assign({ status: "Open" }, p || {}));
      },
      updateProgramChecklist: function (id, p) {
        return update("checklists", id, p);
      },
      completeProgramChecklist: function (id, p) {
        return update(
          "checklists",
          id,
          Object.assign({ status: "Completed", completed_at: new Date().toISOString() }, p || {}),
        );
      },
      listProgramReports: function () {
        return list("reports");
      },
      createProgramReport: function (p) {
        return create("reports", "prep-", Object.assign({ status: "Draft" }, p || {}));
      },
      updateProgramReport: function (id, p) {
        return update("reports", id, p);
      },
      submitProgramReport: function (id, p) {
        return update(
          "reports",
          id,
          Object.assign({ status: "Submitted", submitted_at: new Date().toISOString() }, p || {}),
        );
      },
      validateProgramReport: function (id, p) {
        return update(
          "reports",
          id,
          Object.assign({ status: "Validated", validated_at: new Date().toISOString() }, p || {}),
        );
      },
      rejectProgramReport: function (id, p) {
        if (!p || !p.rejection_reason) return fail("rejection_reason é obrigatório", "VALIDATION");
        return update("reports", id, Object.assign({ status: "Needs Correction" }, p));
      },
      getPendingProgramReports: function () {
        return ok(
          store("reports").rows.filter(function (r) {
            return /draft|submit|pend/i.test(String(r.status || ""));
          }),
        );
      },
      getProgramsOverviewStats: function () {
        var p = store("programs").rows;
        return ok({
          totalPrograms: p.length,
          active: pure().getActivePrograms().data.length,
          upcoming: pure().getUpcomingPrograms().data.length,
          sessions: store("sessions").rows.length,
          registrations: store("registrations").rows.length,
          pendingRegistrations: pure().getPendingProgramRegistrations().data.length,
          note: "Budget is planning data — not verified finance expense",
        });
      },
      getProgramBudgetReport: function () {
        return ok({
          budgets: store("budgets").rows.slice(),
          financeRecordsCreated: 0,
          note: "No automatic financeRecord from program budgets",
        });
      },
      ensureProgramsSeeded: function () {
        Object.keys(KEYS).forEach(function (kind) {
          store(kind);
        });
        return ok(true);
      },
      getProgramsDataSourceInfo: function () {
        return {
          source: resolveDataSource(),
          provider: resolveDataSource() === "local" ? "local-bridge" : "mock-bridge",
          ready: true,
          description: "Programs pure-JS bridge fallback",
          domain: "programs",
        };
      },
      getInfo: function () {
        return pure().getProgramsDataSourceInfo();
      },
    };
  }

  function wrapPromise(value) {
    return Promise.resolve(value);
  }

  function call(method, args) {
    var resolved = resolveApi();
    if (resolved.api && typeof resolved.api[method] === "function") {
      try {
        var result = resolved.api[method].apply(resolved.api, args || []);
        if (result && typeof result.then === "function") return result;
        return wrapPromise(result);
      } catch (e) {
        console.warn("[CE Programs] API call failed, using fallback", method, e);
      }
    }
    var fallback = pure();
    if (typeof fallback[method] === "function") {
      try {
        return wrapPromise(fallback[method].apply(fallback, args || []));
      } catch (e2) {
        return wrapPromise(fail(e2 && e2.message ? e2.message : "fallback error"));
      }
    }
    return wrapPromise(fail("Method not available: " + method, "NOT_IMPLEMENTED"));
  }

  var methods = [
    "listPrograms",
    "createProgram",
    "updateProgram",
    "getActivePrograms",
    "getUpcomingPrograms",
    "listProgramSessions",
    "createProgramSession",
    "updateProgramSession",
    "completeProgramSession",
    "listProgramTeams",
    "createProgramTeam",
    "updateProgramTeam",
    "listProgramParticipants",
    "createProgramParticipant",
    "updateProgramParticipant",
    "markProgramParticipantAttendance",
    "listProgramRegistrations",
    "createProgramRegistration",
    "updateProgramRegistration",
    "approveProgramRegistration",
    "rejectProgramRegistration",
    "checkInProgramRegistration",
    "getPendingProgramRegistrations",
    "listProgramResources",
    "createProgramResource",
    "updateProgramResource",
    "listProgramBudgets",
    "createProgramBudget",
    "updateProgramBudget",
    "getProgramBudgetSummary",
    "listProgramChecklists",
    "createProgramChecklist",
    "updateProgramChecklist",
    "completeProgramChecklist",
    "listProgramReports",
    "createProgramReport",
    "updateProgramReport",
    "submitProgramReport",
    "validateProgramReport",
    "rejectProgramReport",
    "getPendingProgramReports",
    "getProgramsOverviewStats",
    "getProgramBudgetReport",
    "ensureProgramsSeeded",
    "getProgramsDataSourceInfo",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      // UI renderSimple uses type "programs"
      if (kind === "programs" || kind === "program") {
        if (mode === "create") return call("createProgram", [record]);
        if (mode === "update") return call("updateProgram", [record.id, record]);
      }
      return Promise.resolve({ ok: true, skipped: true });
    },
  };
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  window.CEPrograms = Object.assign({}, window.CEPrograms || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.programs) window.CEDataLayer.programs = dataApi;
  if (!window.CEDataLayer.programsEvents) window.CEDataLayer.programsEvents = dataApi;

  try {
    console.info("[CE Programs] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
