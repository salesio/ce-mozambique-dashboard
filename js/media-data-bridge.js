/**
 * Media data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:media-team | media-roles | media-services | media-schedules |
 *       media-channels | media-performance | media-awards
 * Never stores real stream keys.
 */
(function () {
  var KEYS = {
    team: "ce-data-layer:media-team",
    roles: "ce-data-layer:media-roles",
    services: "ce-data-layer:media-services",
    schedules: "ce-data-layer:media-schedules",
    channels: "ce-data-layer:media-channels",
    performance: "ce-data-layer:media-performance",
    awards: "ce-data-layer:media-awards",
  };
  var memory = {
    team: null,
    roles: null,
    services: null,
    schedules: null,
    channels: null,
    performance: null,
    awards: null,
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
    var layer = window.CEDataLayer && window.CEDataLayer.media;
    if (layer && typeof layer.createMediaTeamMember === "function") {
      return { api: layer, via: "CEDataLayer.media" };
    }
    if (window.CEMedia && typeof window.CEMedia.createMediaTeamMember === "function") {
      return { api: window.CEMedia, via: "CEMedia" };
    }
    if (window.CESupabase && typeof window.CESupabase.createMediaTeamMember === "function") {
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
      console.warn("[CE Media] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "team") return S.MEDIA_TEAM_SEED || [];
    if (kind === "roles") return S.MEDIA_ROLES_SEED || [];
    if (kind === "services") return S.MEDIA_SERVICES_SEED || [];
    if (kind === "schedules") return S.MEDIA_SCHEDULES_SEED || [];
    if (kind === "channels") return S.MEDIA_CHANNELS_SEED || [];
    if (kind === "performance") return S.MEDIA_PERFORMANCE_SEED || [];
    if (kind === "awards") return S.MEDIA_AWARDS_SEED || [];
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
      delete row.stream_key;
      delete row.streamKey;
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
      delete next.stream_key;
      delete next.streamKey;
      s.rows[i] = next;
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
      listMediaTeam: function () {
        return list("team");
      },
      createMediaTeamMember: function (p) {
        return create("team", "mt-", p);
      },
      updateMediaTeamMember: function (id, p) {
        return update("team", id, p);
      },
      deleteMediaTeamMember: function (id) {
        return remove("team", id);
      },
      listMediaRoles: function () {
        return list("roles");
      },
      createMediaRole: function (p) {
        return create("roles", "mr-", p);
      },
      updateMediaRole: function (id, p) {
        return update("roles", id, p);
      },
      listMediaServices: function () {
        return list("services");
      },
      createMediaService: function (p) {
        return create("services", "ms-", p);
      },
      updateMediaService: function (id, p) {
        return update("services", id, p);
      },
      listMediaSchedules: function () {
        return list("schedules");
      },
      createMediaSchedule: function (p) {
        return create("schedules", "sch-", p);
      },
      updateMediaSchedule: function (id, p) {
        return update("schedules", id, p);
      },
      confirmScheduleAssignment: function (id, payload) {
        return update("schedules", id, { status: "Confirmed" });
      },
      markCheckIn: function (id, payload) {
        return update("schedules", id, {
          status: "Confirmed",
          check_in_time: (payload && payload.check_in_time) || new Date().toISOString().slice(11, 16),
        });
      },
      markCheckOut: function (id, payload) {
        return update("schedules", id, {
          status: "Completed",
          check_out_time: (payload && payload.check_out_time) || new Date().toISOString().slice(11, 16),
        });
      },
      markAbsent: function (id, payload) {
        return update("schedules", id, { status: "No Show" });
      },
      getTodaySchedules: function () {
        var today = new Date().toISOString().slice(0, 10);
        return ok(
          store("schedules").rows.filter(function (r) {
            return String(r.service_date || r.date || "").slice(0, 10) === today;
          }),
        );
      },
      getUpcomingSchedules: function () {
        var today = new Date().toISOString().slice(0, 10);
        return ok(
          store("schedules").rows.filter(function (r) {
            return String(r.service_date || r.date || "") >= today;
          }),
        );
      },
      listMediaChannels: function () {
        return list("channels");
      },
      createMediaChannel: function (p) {
        return create("channels", "mc-", p);
      },
      updateMediaChannel: function (id, p) {
        return update("channels", id, p);
      },
      listMediaPerformanceReviews: function () {
        return list("performance");
      },
      createMediaPerformanceReview: function (p) {
        var scores = [
          Number(p && p.punctuality_score) || 0,
          Number(p && p.technical_quality_score) || 0,
          Number(p && p.teamwork_score) || 0,
          Number(p && p.responsibility_score) || 0,
          Number(p && p.problem_solving_score) || 0,
          Number(p && p.spiritual_attitude_score) || 0,
        ].filter(function (n) {
          return n > 0;
        });
        var overall =
          scores.length > 0
            ? Math.round((scores.reduce(function (a, b) {
                return a + b;
              }, 0) /
                scores.length) *
                10) / 10
            : 0;
        return create(
          "performance",
          "mev-",
          Object.assign({}, p, { overall_score: overall, score: overall }),
        );
      },
      updateMediaPerformanceReview: function (id, p) {
        return update("performance", id, p);
      },
      getPendingMediaPerformanceReviews: function () {
        return ok(
          store("performance").rows.filter(function (r) {
            return /pending|draft|pendente/i.test(String(r.status || "")) || !r.evaluated_at;
          }),
        );
      },
      listMediaAwards: function () {
        return list("awards");
      },
      createMediaAward: function (p) {
        return create("awards", "maw-", p);
      },
      updateMediaAward: function (id, p) {
        return update("awards", id, p);
      },
      calculateAwardCandidates: function (year) {
        return ok([]);
      },
      getMediaOverviewStats: function () {
        return ok({
          totalTeam: store("team").rows.length,
          activeTeam: store("team").rows.filter(function (t) {
            return /activo|active/i.test(String(t.status || ""));
          }).length,
          todaySchedules: pure().getTodaySchedules().data.length,
          pendingEvaluations: pure().getPendingMediaPerformanceReviews().data.length,
          activeChannels: store("channels").rows.length,
          awards: store("awards").rows.length,
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
      console.warn("[CE Media] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var methods = [
    "listMediaTeam",
    "createMediaTeamMember",
    "updateMediaTeamMember",
    "deleteMediaTeamMember",
    "listMediaRoles",
    "createMediaRole",
    "updateMediaRole",
    "listMediaServices",
    "createMediaService",
    "updateMediaService",
    "listMediaSchedules",
    "createMediaSchedule",
    "updateMediaSchedule",
    "confirmScheduleAssignment",
    "markCheckIn",
    "markCheckOut",
    "markAbsent",
    "getTodaySchedules",
    "getUpcomingSchedules",
    "listMediaChannels",
    "createMediaChannel",
    "updateMediaChannel",
    "listMediaPerformanceReviews",
    "createMediaPerformanceReview",
    "updateMediaPerformanceReview",
    "getPendingMediaPerformanceReviews",
    "listMediaAwards",
    "createMediaAward",
    "updateMediaAward",
    "calculateAwardCandidates",
    "getMediaOverviewStats",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      var map = {
        mediaTechnician: { create: "createMediaTeamMember", update: "updateMediaTeamMember" },
        mediaRole: { create: "createMediaRole", update: "updateMediaRole" },
        mediaService: { create: "createMediaService", update: "updateMediaService" },
        mediaSchedule: { create: "createMediaSchedule", update: "updateMediaSchedule" },
        streamingChannel: { create: "createMediaChannel", update: "updateMediaChannel" },
        mediaEvaluation: {
          create: "createMediaPerformanceReview",
          update: "updateMediaPerformanceReview",
        },
        mediaAward: { create: "createMediaAward", update: "updateMediaAward" },
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

  window.CEMedia = Object.assign({}, window.CEMedia || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.media) window.CEDataLayer.media = dataApi;
  if (!window.CEDataLayer.mediaTeam) {
    window.CEDataLayer.mediaTeam = {
      listMediaTeam: dataApi.listMediaTeam,
      createMediaTeamMember: dataApi.createMediaTeamMember,
      updateMediaTeamMember: dataApi.updateMediaTeamMember,
    };
  }

  try {
    console.info("[CE Media] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
