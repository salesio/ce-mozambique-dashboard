/**
 * Requisitions data bridge — dual-write to data layer + pure-JS localStorage fallback.
 * Keys: ce-data-layer:requisitions | requisition-timeline
 * UI workflow remains in CERequisitions (requisitions-module.js).
 */
(function () {
  var KEYS = {
    requisitions: "ce-data-layer:requisitions",
    timeline: "ce-data-layer:requisition-timeline",
  };
  var memory = { requisitions: null, timeline: null };

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
    var layer = window.CEDataLayer && (window.CEDataLayer.requisitionsWorkflow || window.CEDataLayer.requisitions);
    if (layer && typeof layer.createRequisition === "function") {
      return { api: layer, via: "CEDataLayer.requisitions" };
    }
    if (window.CERequisitionsData && typeof window.CERequisitionsData.createRequisition === "function") {
      return { api: window.CERequisitionsData, via: "CERequisitionsData" };
    }
    if (window.CESupabase && typeof window.CESupabase.createRequisition === "function") {
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
      console.warn("[CE Requisitions] persist failed", key, e);
    }
  }

  function seedReqs() {
    return (window.CESupabase && window.CESupabase.REQUISITIONS_SEED) || [];
  }

  function store(kind) {
    var source = resolveDataSource();
    var key = KEYS[kind];
    if (source === "local") {
      var rows = load(key);
      if (!rows.length && kind === "requisitions") {
        rows = seedReqs().map(function (s) {
          return Object.assign({}, s);
        });
        if (rows.length) save(key, rows);
      }
      return { rows: rows, persist: true };
    }
    if (!memory[kind]) {
      memory[kind] =
        kind === "requisitions"
          ? seedReqs().map(function (s) {
              return Object.assign({}, s);
            })
          : [];
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
    return {
      listRequisitions: function () {
        return ok(store("requisitions").rows.slice());
      },
      createRequisition: function (payload) {
        var s = store("requisitions");
        var row = Object.assign({}, payload, {
          id: (payload && payload.id) || "req-" + Date.now(),
          updated_at: new Date().toISOString().slice(0, 10),
        });
        s.rows.unshift(row);
        if (s.persist) save(KEYS.requisitions, s.rows);
        return ok(row);
      },
      updateRequisition: function (id, payload) {
        var s = store("requisitions");
        var i = s.rows.findIndex(function (r) {
          return r.id === id;
        });
        if (i < 0) return fail("Não encontrado", "NOT_FOUND");
        s.rows[i] = Object.assign({}, s.rows[i], payload, { id: id });
        if (s.persist) save(KEYS.requisitions, s.rows);
        return ok(s.rows[i]);
      },
      deleteRequisition: function (id) {
        var s = store("requisitions");
        s.rows = s.rows.filter(function (r) {
          return r.id !== id;
        });
        if (s.persist) save(KEYS.requisitions, s.rows);
        return ok(true);
      },
      getSubmittedRequisitions: function () {
        var rows = store("requisitions").rows.filter(function (r) {
          return /submetid/i.test(String(r.status || ""));
        });
        return ok(rows);
      },
      getApprovedAwaitingFinance: function () {
        var rows = store("requisitions").rows.filter(function (r) {
          return /aguardando liber/i.test(String(r.status || r.finance_status || ""));
        });
        return ok(rows);
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
      console.warn("[CE Requisitions] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var dataApi = {
    listRequisitions: function () {
      return call("listRequisitions", []);
    },
    createRequisition: function (payload) {
      return call("createRequisition", [payload]);
    },
    updateRequisition: function (id, payload) {
      return call("updateRequisition", [id, payload]);
    },
    deleteRequisition: function (id) {
      return call("deleteRequisition", [id]);
    },
    submitRequisition: function (id, actor) {
      return call("submitRequisition", [id, actor]);
    },
    reviewRequisition: function (id, payload) {
      return call("reviewRequisition", [id, payload]);
    },
    sendToMainPastor: function (id, payload) {
      return call("sendToMainPastor", [id, payload]);
    },
    approveRequisition: function (id, payload) {
      return call("approveRequisition", [id, payload]);
    },
    rejectRequisition: function (id, payload) {
      return call("rejectRequisition", [id, payload]);
    },
    returnRequisitionForCorrection: function (id, payload) {
      return call("returnRequisitionForCorrection", [id, payload]);
    },
    markResourcesReleased: function (id, payload) {
      return call("markResourcesReleased", [id, payload]);
    },
    markSentToInventory: function (id, payload) {
      return call("markSentToInventory", [id, payload]);
    },
    getSubmittedRequisitions: function () {
      return call("getSubmittedRequisitions", []);
    },
    getUnderReviewRequisitions: function () {
      return call("getUnderReviewRequisitions", []);
    },
    getAwaitingMainPastorRequisitions: function () {
      return call("getAwaitingMainPastorRequisitions", []);
    },
    getApprovedAwaitingFinance: function () {
      return call("getApprovedAwaitingFinance", []);
    },
    getResourcesReleasedRequisitions: function () {
      return call("getResourcesReleasedRequisitions", []);
    },
    getRequisitionsPendingInventory: function () {
      return call("getRequisitionsPendingInventory", []);
    },
    getInfo: function () {
      return call("getInfo", []);
    },
  };

  // Dual-write helper used by UI after local workflow mutates state
  dataApi.dualWriteRecord = function (mode, record) {
    if (!record) return Promise.resolve({ ok: true, skipped: true });
    if (mode === "create") return dataApi.createRequisition(record);
    if (mode === "update") return dataApi.updateRequisition(record.id, record);
    return Promise.resolve({ ok: true, skipped: true });
  };

  window.CERequisitionsDataBridge = dataApi;

  // Enrich existing CERequisitions UI API without replacing workflow helpers
  if (window.CERequisitions) {
    var ui = window.CERequisitions;
    var origApply = ui.applyWorkflowAction;
    if (typeof origApply === "function") {
      ui.applyWorkflowAction = function (state, user, recordId, action, payload) {
        var result = origApply(state, user, recordId, action, payload);
        if (result && result.ok && result.record) {
          void dataApi.dualWriteRecord("update", result.record);
        }
        return result;
      };
    }
    // Expose data-layer methods under CERequisitions for convenience
    Object.keys(dataApi).forEach(function (k) {
      if (typeof ui[k] !== "function") ui[k] = dataApi[k];
    });
  } else {
    window.CERequisitions = Object.assign({}, dataApi);
  }

  if (window.CEDataLayer) {
    window.CEDataLayer.requisitions = window.CEDataLayer.requisitions || dataApi;
    window.CEDataLayer.requisitionsWorkflow = window.CEDataLayer.requisitionsWorkflow || dataApi;
  }

  console.info("[CE Requisitions] data bridge ready", { source: resolveDataSource() });
})();
