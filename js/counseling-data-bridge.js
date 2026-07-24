/**
 * Counseling data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:counseling-requests | counseling-cases | counseling-appointments |
 *       counselors | counseling-feedback | counseling-referrals
 * Confidential notes stay in storage; UI must mask by RBAC.
 */
(function () {
  var KEYS = {
    requests: "ce-data-layer:counseling-requests",
    cases: "ce-data-layer:counseling-cases",
    appointments: "ce-data-layer:counseling-appointments",
    counselors: "ce-data-layer:counselors",
    feedback: "ce-data-layer:counseling-feedback",
    referrals: "ce-data-layer:counseling-referrals",
  };
  var memory = {
    requests: null,
    cases: null,
    appointments: null,
    counselors: null,
    feedback: null,
    referrals: null,
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
    var layer = window.CEDataLayer && window.CEDataLayer.counseling;
    if (layer && typeof layer.createCounselingRequest === "function") {
      return { api: layer, via: "CEDataLayer.counseling" };
    }
    if (window.CECounseling && typeof window.CECounseling.createCounselingRequest === "function") {
      return { api: window.CECounseling, via: "CECounseling" };
    }
    if (window.CESupabase && typeof window.CESupabase.createCounselingRequest === "function") {
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
      console.warn("[CE Counseling] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "requests") return S.COUNSELING_REQUESTS_SEED || [];
    if (kind === "cases") return S.COUNSELING_CASES_SEED || [];
    if (kind === "appointments") return S.COUNSELING_APPOINTMENTS_SEED || [];
    if (kind === "counselors") return S.COUNSELORS_SEED || [];
    if (kind === "feedback") return S.COUNSELING_FEEDBACK_SEED || [];
    if (kind === "referrals") return S.COUNSELING_REFERRALS_SEED || [];
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
      if (kind === "requests" && !row.request_number) {
        row.request_number = "CON-" + new Date().getFullYear() + "-" + String(s.rows.length + 1).padStart(4, "0");
      }
      if (kind === "cases" && !row.case_number) {
        row.case_number = "CASE-" + new Date().getFullYear() + "-" + String(s.rows.length + 1).padStart(4, "0");
      }
      if (kind === "requests") {
        row.person_name = row.person_name || row.full_name || "";
        row.full_name = row.full_name || row.person_name || "";
        row.counseling_category = row.counseling_category || row.category || "";
        row.category = row.category || row.counseling_category || "";
      }
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
      var next = Object.assign({}, s.rows[i], payload, { id: id });
      s.rows[i] = next;
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(s.rows[i]);
    }
    return {
      listCounselingRequests: function () {
        return list("requests");
      },
      createCounselingRequest: function (p) {
        return create("requests", "cr-", Object.assign({ status: "New" }, p || {}));
      },
      updateCounselingRequest: function (id, p) {
        return update("requests", id, p);
      },
      listCounselingCases: function () {
        return list("cases");
      },
      createCounselingCase: function (p) {
        return create("cases", "cc-", Object.assign({ status: "Open" }, p || {}));
      },
      updateCounselingCase: function (id, p) {
        return update("cases", id, p);
      },
      closeCounselingCase: function (id, p) {
        return update(
          "cases",
          id,
          Object.assign({ status: "Closed", closed_at: new Date().toISOString() }, p || {}),
        );
      },
      reopenCounselingCase: function (id, p) {
        return update("cases", id, Object.assign({ status: "Open", closed_at: null }, p || {}));
      },
      getOpenCounselingCases: function () {
        return ok(
          store("cases").rows.filter(function (c) {
            return !/closed|completed|cancel|conclu/i.test(String(c.status || ""));
          }),
        );
      },
      getCasesNeedingFollowUp: function () {
        return ok(
          store("cases").rows.filter(function (c) {
            return c.needs_follow_up || /follow|acompanh/i.test(String(c.status || c.next_step || ""));
          }),
        );
      },
      listCounselingAppointments: function () {
        return list("appointments");
      },
      createCounselingAppointment: function (p) {
        return create("appointments", "ca-", Object.assign({ status: "Scheduled" }, p || {}));
      },
      updateCounselingAppointment: function (id, p) {
        return update("appointments", id, p);
      },
      completeCounselingAppointment: function (id, p) {
        return update(
          "appointments",
          id,
          Object.assign(
            {
              status: "Completed",
              attendance_status: "Present",
              completed_at: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      cancelCounselingAppointment: function (id, p) {
        return update("appointments", id, Object.assign({ status: "Cancelled" }, p || {}));
      },
      getTodayCounselingAppointments: function () {
        var today = new Date().toISOString().slice(0, 10);
        return ok(
          store("appointments").rows.filter(function (a) {
            return String(a.appointment_date || "").slice(0, 10) === today;
          }),
        );
      },
      listCounselors: function () {
        return list("counselors");
      },
      createCounselor: function (p) {
        return create("counselors", "coun-", Object.assign({ status: "Active" }, p || {}));
      },
      updateCounselor: function (id, p) {
        return update("counselors", id, p);
      },
      listCounselingFeedback: function () {
        return list("feedback");
      },
      createCounselingFeedback: function (p) {
        return create("feedback", "cfb-", p);
      },
      updateCounselingFeedback: function (id, p) {
        return update("feedback", id, p);
      },
      listCounselingReferrals: function () {
        return list("referrals");
      },
      createCounselingReferral: function (p) {
        return create(
          "referrals",
          "cref-",
          Object.assign({ status: "Pending", referred_at: new Date().toISOString() }, p || {}),
        );
      },
      updateCounselingReferral: function (id, p) {
        return update("referrals", id, p);
      },
      markReferralCompleted: function (id, p) {
        return update(
          "referrals",
          id,
          Object.assign({ status: "Completed", completed_at: new Date().toISOString() }, p || {}),
        );
      },
      getUrgentCounselingRequests: function () {
        return ok(
          store("requests").rows.filter(function (r) {
            return /urgent|high|alta/i.test(String(r.urgency || ""));
          }),
        );
      },
      getCounselingOverviewStats: function () {
        return ok({
          newRequests: store("requests").rows.filter(function (r) {
            return /new|pending/i.test(String(r.status || ""));
          }).length,
          openCases: pure().getOpenCounselingCases().data.length,
          todayAppointments: pure().getTodayCounselingAppointments().data.length,
          activeCounselors: store("counselors").rows.filter(function (c) {
            return /activ|activo/i.test(String(c.status || ""));
          }).length,
          needsFollowUp: pure().getCasesNeedingFollowUp().data.length,
        });
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
      console.warn("[CE Counseling] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var methods = [
    "listCounselingRequests",
    "createCounselingRequest",
    "updateCounselingRequest",
    "listCounselingCases",
    "createCounselingCase",
    "updateCounselingCase",
    "closeCounselingCase",
    "reopenCounselingCase",
    "getOpenCounselingCases",
    "getCasesNeedingFollowUp",
    "listCounselingAppointments",
    "createCounselingAppointment",
    "updateCounselingAppointment",
    "completeCounselingAppointment",
    "cancelCounselingAppointment",
    "getTodayCounselingAppointments",
    "listCounselors",
    "createCounselor",
    "updateCounselor",
    "listCounselingFeedback",
    "createCounselingFeedback",
    "updateCounselingFeedback",
    "listCounselingReferrals",
    "createCounselingReferral",
    "updateCounselingReferral",
    "markReferralCompleted",
    "getUrgentCounselingRequests",
    "getCounselingOverviewStats",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      var map = {
        counselingRequest: { create: "createCounselingRequest", update: "updateCounselingRequest" },
        counselor: { create: "createCounselor", update: "updateCounselor" },
        counselingAppointment: {
          create: "createCounselingAppointment",
          update: "updateCounselingAppointment",
        },
        counselingFeedback: { create: "createCounselingFeedback", update: "updateCounselingFeedback" },
        counselingReferral: { create: "createCounselingReferral", update: "updateCounselingReferral" },
        counselingCase: { create: "createCounselingCase", update: "updateCounselingCase" },
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

  window.CECounseling = Object.assign({}, window.CECounseling || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.counseling) window.CEDataLayer.counseling = dataApi;
  if (!window.CEDataLayer.counselingRequests) {
    window.CEDataLayer.counselingRequests = {
      listCounselingRequests: dataApi.listCounselingRequests,
      createCounselingRequest: dataApi.createCounselingRequest,
      updateCounselingRequest: dataApi.updateCounselingRequest,
    };
  }

  try {
    console.info("[CE Counseling] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
