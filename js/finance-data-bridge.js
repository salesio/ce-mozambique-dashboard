/**
 * Finance data bridge — same dual-write / pure-JS fallback pattern as Cell Ministry.
 * Keys: ce-data-layer:finance-records | public-giving-submissions | finance-disbursements
 */
(function () {
  var KEYS = {
    records: "ce-data-layer:finance-records",
    submissions: "ce-data-layer:public-giving-submissions",
    disbursements: "ce-data-layer:finance-disbursements",
  };
  var memory = { records: null, submissions: null, disbursements: null };

  function resolveDataSource() {
    try {
      var runtime = window.__CE_ENV__ && window.__CE_ENV__.VITE_DATA_SOURCE;
      var fromBundle =
        window.CESupabase && typeof window.CESupabase.getDataSource === "function"
          ? window.CESupabase.getDataSource()
          : window.CEDataLayer && typeof window.CEDataLayer.getDataSource === "function"
            ? window.CEDataLayer.getDataSource()
            : "";
      var value = String(runtime || fromBundle || "mock")
        .trim()
        .toLowerCase();
      if (value === "local" || value === "api" || value === "supabase" || value === "mock") return value;
    } catch (_) {}
    return "mock";
  }

  function resolveApi() {
    var layer = window.CEDataLayer && window.CEDataLayer.finance;
    if (layer && typeof layer.createFinanceRecord === "function") {
      return { api: layer, via: "CEDataLayer.finance" };
    }
    if (window.CESupabase && typeof window.CESupabase.createFinanceRecord === "function") {
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
      console.warn("[CE Finance] persist failed", key, e);
    }
  }

  function seedRecords() {
    return (window.CESupabase && window.CESupabase.FINANCE_RECORDS_SEED) || [];
  }
  function seedSubmissions() {
    return (window.CESupabase && window.CESupabase.PUBLIC_GIVING_SUBMISSIONS_SEED) || [];
  }
  function seedDisbursements() {
    return (window.CESupabase && window.CESupabase.FINANCE_DISBURSEMENTS_SEED) || [];
  }

  function store(kind) {
    var source = resolveDataSource();
    var key = KEYS[kind];
    if (source === "local") {
      var rows = load(key);
      if (!rows.length) {
        var seeds =
          kind === "records"
            ? seedRecords()
            : kind === "submissions"
              ? seedSubmissions()
              : seedDisbursements();
        rows = seeds.map(function (s) {
          return Object.assign({}, s);
        });
        if (rows.length) save(key, rows);
      }
      return { rows: rows, persist: true, source: "local" };
    }
    if (!memory[kind]) {
      var seeds2 =
        kind === "records"
          ? seedRecords()
          : kind === "submissions"
            ? seedSubmissions()
            : seedDisbursements();
      memory[kind] = seeds2.map(function (s) {
        return Object.assign({}, s);
      });
    }
    return { rows: memory[kind], persist: false, source: source };
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
      if (i < 0) return fail("Registo não encontrado.", "NOT_FOUND");
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
      listFinanceRecords: function () {
        return list("records");
      },
      createFinanceRecord: function (payload) {
        return create("records", "fin-", payload);
      },
      updateFinanceRecord: function (id, payload) {
        return update("records", id, payload);
      },
      deleteFinanceRecord: function (id) {
        return remove("records", id);
      },
      getPendingVerificationRecords: function () {
        var rows = store("records").rows.filter(function (r) {
          var st = String(r.status || r.estado || "").toLowerCase();
          return st.indexOf("pending") >= 0 || st.indexOf("pendente") >= 0;
        });
        return ok(rows.slice());
      },
      getMonthlyGiving: function (month, year) {
        var mm = String(month).padStart(2, "0");
        var prefix = year + "-" + mm;
        var records = store("records").rows.filter(function (r) {
          var st = String(r.status || r.estado || "").toLowerCase();
          var verified = st.indexOf("verif") >= 0;
          var d = String(r.payment_date || r.data || r.created_at || "");
          return verified && d.indexOf(prefix) === 0 && (r.transaction_type || "income") === "income";
        });
        var total = records.reduce(function (s, r) {
          return s + Number(r.amount || r.valor || 0);
        }, 0);
        return ok({ total: total, count: records.length, records: records });
      },
      listPublicGivingSubmissions: function () {
        return list("submissions");
      },
      createPublicGivingSubmission: function (payload) {
        return create("submissions", "pgs-", payload);
      },
      updatePublicGivingSubmission: function (id, payload) {
        return update("submissions", id, payload);
      },
      verifyPublicGivingSubmission: function (id, payload) {
        var subRes = update("submissions", id, {
          status: "Verified",
          verified_by: (payload && payload.verified_by) || "Finance Head",
          verified_at: new Date().toISOString(),
        });
        return ok({ submission: subRes.data, financeRecords: [] });
      },
      rejectPublicGivingSubmission: function (id, reason) {
        return update("submissions", id, {
          status: "Rejected",
          rejection_reason: reason,
          motivo_rejeicao: reason,
          rejected_at: new Date().toISOString(),
        });
      },
      listFinanceDisbursements: function () {
        return list("disbursements");
      },
      createFinanceDisbursement: function (payload) {
        return create("disbursements", "disb-", payload);
      },
      updateFinanceDisbursement: function (id, payload) {
        return update("disbursements", id, payload);
      },
      getInfo: function () {
        return { source: resolveDataSource(), provider: "pure-js-fallback", ready: true };
      },
    };
  }

  function getApi() {
    var resolved = resolveApi();
    if (resolved.api) return { api: resolved.api, via: resolved.via, fallback: false };
    console.warn("[CE Finance] API missing — pure JS fallback", {
      CEDataLayer: !!window.CEDataLayer,
      dataSource: resolveDataSource(),
    });
    return { api: pure(), via: "pure-js-fallback", fallback: true };
  }

  async function call(method, args, aliases) {
    var resolved = getApi();
    var fn = resolved.api[method];
    if (typeof fn !== "function" && aliases) {
      for (var a = 0; a < aliases.length; a += 1) {
        if (typeof resolved.api[aliases[a]] === "function") {
          fn = resolved.api[aliases[a]];
          break;
        }
      }
    }
    var fallback = pure();
    if (typeof fn !== "function") fn = fallback[method];
    if (typeof fn !== "function") {
      console.error("[CE Finance] method missing", method);
      return fail("Método não disponível: " + method, "METHOD_MISSING");
    }
    try {
      var result = await Promise.resolve(fn.apply(resolved.api, args || []));
      return result;
    } catch (error) {
      console.warn("[CE Finance] call failed, pure fallback", method, error);
      var fb = fallback[method];
      if (typeof fb === "function") return Promise.resolve(fb.apply(fallback, args || []));
      return fail(error && error.message ? error.message : "Erro finance");
    }
  }

  var api = {
    listFinanceRecords: function () {
      return call("listFinanceRecords", []);
    },
    createFinanceRecord: function (payload) {
      return call("createFinanceRecord", [payload]);
    },
    updateFinanceRecord: function (id, payload) {
      return call("updateFinanceRecord", [id, payload]);
    },
    deleteFinanceRecord: function (id) {
      return call("deleteFinanceRecord", [id]);
    },
    getPendingVerificationRecords: function () {
      return call("getPendingVerificationRecords", []);
    },
    getMonthlyGiving: function (month, year) {
      return call("getMonthlyGiving", [month, year]);
    },
    listPublicGivingSubmissions: function () {
      return call("listPublicGivingSubmissions", []);
    },
    createPublicGivingSubmission: function (payload) {
      return call("createPublicGivingSubmission", [payload]);
    },
    updatePublicGivingSubmission: function (id, payload) {
      return call("updatePublicGivingSubmission", [id, payload]);
    },
    verifyPublicGivingSubmission: function (id, payload) {
      return call("verifyPublicGivingSubmission", [id, payload]);
    },
    rejectPublicGivingSubmission: function (id, reason) {
      return call("rejectPublicGivingSubmission", [id, reason]);
    },
    listFinanceDisbursements: function () {
      return call("listFinanceDisbursements", []);
    },
    createFinanceDisbursement: function (payload) {
      return call("createFinanceDisbursement", [payload]);
    },
    updateFinanceDisbursement: function (id, payload) {
      return call("updateFinanceDisbursement", [id, payload]);
    },
    getInfo: function () {
      return call("getInfo", []);
    },
  };

  window.CEFinance = api;
  if (window.CEDataLayer) {
    window.CEDataLayer.finance = window.CEDataLayer.finance || api;
  }
  console.info("[CE Finance] bridge ready", { source: resolveDataSource() });
})();
