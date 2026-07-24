/**
 * F.E.V.O data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:fevo-weekly-configs | fevo-teams | fevo-activities |
 *       fevo-reports | fevo-missing-reports
 * Soft-links Follow-Up when activity is Acompanhamento (via repository).
 */
(function () {
  var KEYS = {
    configs: "ce-data-layer:fevo-weekly-configs",
    teams: "ce-data-layer:fevo-teams",
    activities: "ce-data-layer:fevo-activities",
    reports: "ce-data-layer:fevo-reports",
    missing: "ce-data-layer:fevo-missing-reports",
    followUp: "ce-data-layer:fevo-follow-up-records",
    evangelism: "ce-data-layer:fevo-evangelism-records",
    visitation: "ce-data-layer:fevo-visitation-records",
    prayer: "ce-data-layer:fevo-prayer-records",
  };
  var memory = {
    configs: null,
    teams: null,
    activities: null,
    reports: null,
    missing: null,
    followUp: null,
    evangelism: null,
    visitation: null,
    prayer: null,
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
    var layer = window.CEDataLayer && window.CEDataLayer.fevo;
    if (layer && typeof layer.createFevoWeeklyConfig === "function") {
      return { api: layer, via: "CEDataLayer.fevo" };
    }
    if (window.CEFevo && typeof window.CEFevo.createFevoWeeklyConfig === "function") {
      return { api: window.CEFevo, via: "CEFevo" };
    }
    if (window.CESupabase && typeof window.CESupabase.createFevoWeeklyConfig === "function") {
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
      console.warn("[CE FEVO] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "configs") return S.FEVO_WEEKLY_CONFIGS_SEED || [];
    if (kind === "teams") return S.FEVO_TEAMS_SEED || [];
    if (kind === "activities") return S.FEVO_ACTIVITIES_SEED || [];
    if (kind === "reports") return S.FEVO_REPORTS_SEED || [];
    if (kind === "missing") return S.FEVO_MISSING_REPORTS_SEED || [];
    if (kind === "followUp") return S.FEVO_FOLLOW_UP_RECORDS_SEED || [];
    if (kind === "evangelism") return S.FEVO_EVANGELISM_RECORDS_SEED || [];
    if (kind === "visitation") return S.FEVO_VISITATION_RECORDS_SEED || [];
    if (kind === "prayer") return S.FEVO_PRAYER_RECORDS_SEED || [];
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
    return {
      listFevoWeeklyConfigs: function () {
        return list("configs");
      },
      createFevoWeeklyConfig: function (p) {
        var row = Object.assign({}, p || {});
        row.semana_inicio = row.semana_inicio || row.week_start_date || "";
        row.semana_fim = row.semana_fim || row.week_end_date || "";
        row.week_start_date = row.week_start_date || row.semana_inicio || "";
        row.week_end_date = row.week_end_date || row.semana_fim || "";
        row.estado = row.estado || row.status || "Rascunho";
        row.status = row.status || row.estado || "Draft";
        row.preparado_por = row.preparado_por || row.prepared_by || "";
        return create("configs", "fevo-cfg-", row);
      },
      updateFevoWeeklyConfig: function (id, p) {
        return update("configs", id, p);
      },
      getCurrentFevoWeeklyConfig: function () {
        var rows = store("configs").rows;
        var active = rows.find(function (c) {
          return /activ|activo/i.test(String(c.status || c.estado || ""));
        });
        return ok(active || rows[0] || null);
      },
      activateFevoWeeklyConfig: function (id) {
        var updated = update("configs", id, { status: "Active", estado: "Activo" });
        if (updated.ok && updated.data) {
          var cfg = updated.data;
          var acts = store("activities").rows.filter(function (a) {
            return a.config_id === id || a.weekly_config_id === id;
          });
          if (!acts.length) {
            var slots = [
              { code: "A", name: "Team A", activity: cfg.team_a_activity || "Follow-Up" },
              { code: "B", name: "Team B", activity: cfg.team_b_activity || "Prayer" },
              { code: "C", name: "Team C", activity: cfg.team_c_activity || "Evangelism" },
              { code: "D", name: "Team D", activity: cfg.team_d_activity || "Visitation" },
            ];
            slots.forEach(function (slot) {
              create("activities", "fevo-act-", {
                weekly_config_id: id,
                config_id: id,
                team_name: slot.name,
                team_code: slot.code,
                activity_type: slot.activity,
                church_id: cfg.church_id,
                week_start_date: cfg.week_start_date || cfg.semana_inicio,
                week_end_date: cfg.week_end_date || cfg.semana_fim,
                due_date: cfg.week_end_date || cfg.semana_fim,
                status: "Assigned",
              });
            });
          }
        }
        return updated;
      },
      closeFevoWeeklyConfig: function (id) {
        return update("configs", id, { status: "Closed", estado: "Fechado" });
      },
      listFevoTeams: function () {
        return list("teams");
      },
      createFevoTeam: function (p) {
        return create("teams", "fevo-team-", Object.assign({ status: "Active" }, p || {}));
      },
      updateFevoTeam: function (id, p) {
        return update("teams", id, p);
      },
      listFevoActivities: function () {
        return list("activities");
      },
      createFevoActivity: function (p) {
        return create("activities", "fevo-act-", Object.assign({ status: "Pending" }, p || {}));
      },
      updateFevoActivity: function (id, p) {
        return update("activities", id, p);
      },
      completeFevoActivity: function (id, p) {
        return update(
          "activities",
          id,
          Object.assign({ status: "Completed", completed_at: new Date().toISOString() }, p || {}),
        );
      },
      listFevoReports: function () {
        return list("reports");
      },
      createFevoReport: function (p) {
        var row = Object.assign({ status: "Draft", report_kind: "activity" }, p || {});
        row.semana_inicio = row.semana_inicio || row.week_start_date || "";
        row.semana_fim = row.semana_fim || row.week_end_date || "";
        return create("reports", "fevo-rpt-", row);
      },
      updateFevoReport: function (id, p) {
        return update("reports", id, p);
      },
      submitFevoReport: function (id, p) {
        var updated = update(
          "reports",
          id,
          Object.assign(
            {
              status: "Submitted",
              submitted_report: true,
              submitted_at: new Date().toISOString().slice(0, 10),
            },
            p || {},
          ),
        );
        if (updated.ok && updated.data && updated.data.activity_id) {
          update("activities", updated.data.activity_id, {
            status: "Report Submitted",
            report_id: id,
          });
        }
        return updated;
      },
      validateFevoReport: function (id, p) {
        var updated = update(
          "reports",
          id,
          Object.assign({ status: "Validated" }, p || {}),
        );
        if (updated.ok && updated.data && updated.data.activity_id) {
          update("activities", updated.data.activity_id, { status: "Validated" });
        }
        return updated;
      },
      rejectFevoReport: function (id, p) {
        if (!p || !p.rejection_reason) {
          return fail("rejection_reason é obrigatório", "VALIDATION");
        }
        return update(
          "reports",
          id,
          Object.assign({ status: "Needs Correction" }, p || {}),
        );
      },
      getPendingFevoReports: function () {
        return ok(
          store("reports").rows.filter(function (r) {
            return /draft|submit|review|rascun|submet|revis/i.test(String(r.status || ""));
          }),
        );
      },
      listFevoMissingReports: function () {
        return list("missing");
      },
      createFevoMissingReport: function (p) {
        return create("missing", "fevo-nr-", Object.assign({ status: "Pending" }, p || {}));
      },
      updateFevoMissingReport: function (id, p) {
        return update("missing", id, p);
      },
      resolveFevoMissingReport: function (id, p) {
        return update(
          "missing",
          id,
          Object.assign(
            { status: "Resolved", resolved_at: new Date().toISOString(), contacted: true },
            p || {},
          ),
        );
      },
      detectMissingReports: function () {
        return ok([]);
      },
      getFevoOverviewStats: function () {
        return ok({
          totalReports: store("reports").rows.length,
          pendingReports: pure().getPendingFevoReports().data.length,
          missingUnresolved: store("missing").rows.filter(function (m) {
            return !/resolv/i.test(String(m.status || ""));
          }).length,
          activeTeams: store("teams").rows.filter(function (t) {
            return /activ|activo/i.test(String(t.status || ""));
          }).length,
        });
      },
      listFevoFollowUpRecords: function () {
        return list("followUp");
      },
      createFevoFollowUpRecord: function (p) {
        return create("followUp", "fevo-fu-", p);
      },
      updateFevoFollowUpRecord: function (id, p) {
        return update("followUp", id, p);
      },
      getFevoFollowUpByReport: function (reportId) {
        return ok(
          store("followUp").rows.filter(function (r) {
            return r.report_id === reportId;
          }),
        );
      },
      listFevoEvangelismRecords: function () {
        return list("evangelism");
      },
      createFevoEvangelismRecord: function (p) {
        return create("evangelism", "fevo-ev-", p);
      },
      updateFevoEvangelismRecord: function (id, p) {
        return update("evangelism", id, p);
      },
      getEvangelismByReport: function (reportId) {
        return ok(
          store("evangelism").rows.filter(function (r) {
            return r.report_id === reportId;
          }),
        );
      },
      listFevoVisitationRecords: function () {
        return list("visitation");
      },
      createFevoVisitationRecord: function (p) {
        return create("visitation", "fevo-vi-", p);
      },
      updateFevoVisitationRecord: function (id, p) {
        return update("visitation", id, p);
      },
      getVisitationByReport: function (reportId) {
        return ok(
          store("visitation").rows.filter(function (r) {
            return r.report_id === reportId;
          }),
        );
      },
      listFevoPrayerRecords: function () {
        return list("prayer");
      },
      createFevoPrayerRecord: function (p) {
        return create("prayer", "fevo-pr-", p);
      },
      updateFevoPrayerRecord: function (id, p) {
        return update("prayer", id, p);
      },
      getPrayerByReport: function (reportId) {
        return ok(
          store("prayer").rows.filter(function (r) {
            return r.report_id === reportId;
          }),
        );
      },
      getFevoWeeklyReport: function () {
        return ok({ config: null, reports: store("reports").rows.slice(), missing: [], activities: [] });
      },
      getFevoTeamPerformanceReport: function () {
        return ok([]);
      },
      getFevoMissingReportsStats: function () {
        var rows = store("missing").rows;
        return ok({
          total: rows.length,
          pending: rows.filter(function (m) {
            return /pend/i.test(String(m.status || ""));
          }).length,
          resolved: rows.filter(function (m) {
            return /resolv/i.test(String(m.status || ""));
          }).length,
        });
      },
      getFevoEvangelismStats: function () {
        var rows = store("evangelism").rows;
        return ok({
          records: rows.length,
          souls_evangelized: rows.reduce(function (s, x) {
            return s + (Number(x.souls_evangelized) || 0);
          }, 0),
          new_converts: rows.reduce(function (s, x) {
            return s + (Number(x.new_converts) || 0);
          }, 0),
        });
      },
      getFevoPrayerStats: function () {
        var rows = store("prayer").rows;
        return ok({
          records: rows.length,
          days_of_prayer: rows.reduce(function (s, x) {
            return s + (Number(x.days_of_prayer) || 0);
          }, 0),
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
      console.warn("[CE FEVO] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var methods = [
    "listFevoWeeklyConfigs",
    "createFevoWeeklyConfig",
    "updateFevoWeeklyConfig",
    "getCurrentFevoWeeklyConfig",
    "activateFevoWeeklyConfig",
    "closeFevoWeeklyConfig",
    "listFevoTeams",
    "createFevoTeam",
    "updateFevoTeam",
    "listFevoActivities",
    "createFevoActivity",
    "updateFevoActivity",
    "completeFevoActivity",
    "listFevoReports",
    "createFevoReport",
    "updateFevoReport",
    "submitFevoReport",
    "validateFevoReport",
    "rejectFevoReport",
    "getPendingFevoReports",
    "listFevoMissingReports",
    "createFevoMissingReport",
    "updateFevoMissingReport",
    "resolveFevoMissingReport",
    "detectMissingReports",
    "getFevoOverviewStats",
    "listFevoFollowUpRecords",
    "createFevoFollowUpRecord",
    "updateFevoFollowUpRecord",
    "getFevoFollowUpByReport",
    "listFevoEvangelismRecords",
    "createFevoEvangelismRecord",
    "updateFevoEvangelismRecord",
    "getEvangelismByReport",
    "listFevoVisitationRecords",
    "createFevoVisitationRecord",
    "updateFevoVisitationRecord",
    "getVisitationByReport",
    "listFevoPrayerRecords",
    "createFevoPrayerRecord",
    "updateFevoPrayerRecord",
    "getPrayerByReport",
    "getFevoWeeklyReport",
    "getFevoTeamPerformanceReport",
    "getFevoMissingReportsStats",
    "getFevoEvangelismStats",
    "getFevoPrayerStats",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      var map = {
        fevoConfig: { create: "createFevoWeeklyConfig", update: "updateFevoWeeklyConfig" },
        fevoReport: { create: "createFevoReport", update: "updateFevoReport" },
        fevoNoReport: { create: "createFevoMissingReport", update: "updateFevoMissingReport" },
        fevoWeeklyReport: { create: "createFevoReport", update: "updateFevoReport" },
      };
      var entry = map[kind];
      if (!entry) return Promise.resolve({ ok: true, skipped: true });
      if (mode === "create") {
        if (kind === "fevoWeeklyReport") {
          record = Object.assign({ report_kind: "weekly_summary" }, record);
        }
        return call(entry.create, [record]);
      }
      if (mode === "update") return call(entry.update, [record.id, record]);
      return Promise.resolve({ ok: true, skipped: true });
    },
  };
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  window.CEFevo = Object.assign({}, window.CEFevo || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.fevo) window.CEDataLayer.fevo = dataApi;

  try {
    console.info("[CE FEVO] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
