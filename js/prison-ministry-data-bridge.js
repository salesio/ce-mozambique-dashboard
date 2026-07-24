/**
 * Prison Ministry data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:prison-locations | prison-representatives | prison-services |
 *       prison-participants | prison-foundation-students | prison-weekly-agendas |
 *       prison-follow-ups | prison-reports | prison-materials-requests
 *
 * Participant data is minimal (no criminal fields). Foundation enroll is explicit only.
 * Ministry Materials requests prepared for future module.
 */
(function () {
  var KEYS = {
    locations: "ce-data-layer:prison-locations",
    representatives: "ce-data-layer:prison-representatives",
    services: "ce-data-layer:prison-services",
    participants: "ce-data-layer:prison-participants",
    foundation: "ce-data-layer:prison-foundation-students",
    agendas: "ce-data-layer:prison-weekly-agendas",
    followUps: "ce-data-layer:prison-follow-ups",
    reports: "ce-data-layer:prison-reports",
    materials: "ce-data-layer:prison-materials-requests",
  };
  var memory = {
    locations: null,
    representatives: null,
    services: null,
    participants: null,
    foundation: null,
    agendas: null,
    followUps: null,
    reports: null,
    materials: null,
  };

  var CRIME_KEYS = [
    "crime",
    "crime_type",
    "criminal_record",
    "sentence",
    "sentence_details",
    "charges",
    "offense",
    "case_number",
    "inmate_number",
    "prisoner_number",
    "crime_details",
  ];

  function stripCrime(obj) {
    if (!obj || typeof obj !== "object") return obj;
    var out = Object.assign({}, obj);
    CRIME_KEYS.forEach(function (k) {
      delete out[k];
    });
    return out;
  }

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
    var layer = window.CEDataLayer && window.CEDataLayer.prisonMinistry;
    if (layer && typeof layer.createPrisonLocation === "function") {
      return { api: layer, via: "CEDataLayer.prisonMinistry" };
    }
    if (window.CEPrisonMinistry && typeof window.CEPrisonMinistry.createPrisonLocation === "function") {
      return { api: window.CEPrisonMinistry, via: "CEPrisonMinistry" };
    }
    if (window.CESupabase && typeof window.CESupabase.createPrisonLocation === "function") {
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
      console.warn("[CE Prison] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "locations") return S.PRISON_LOCATIONS_SEED || [];
    if (kind === "representatives") return S.PRISON_REPRESENTATIVES_SEED || [];
    if (kind === "services") return S.PRISON_SERVICES_SEED || [];
    if (kind === "participants") return S.PRISON_PARTICIPANTS_SEED || [];
    if (kind === "foundation") return S.PRISON_FOUNDATION_STUDENTS_SEED || [];
    if (kind === "agendas") return S.PRISON_WEEKLY_AGENDAS_SEED || [];
    if (kind === "followUps") return S.PRISON_FOLLOW_UPS_SEED || [];
    if (kind === "reports") return S.PRISON_REPORTS_SEED || [];
    if (kind === "materials") return S.PRISON_MATERIALS_REQUESTS_SEED || [];
    return [];
  }

  function store(kind) {
    var source = resolveDataSource();
    var key = KEYS[kind];
    if (source === "local") {
      var rows = load(key);
      if (!rows.length) {
        rows = seedFor(kind).map(function (s) {
          return stripCrime(Object.assign({}, s));
        });
        if (rows.length) save(key, rows);
      }
      return { rows: rows, persist: true };
    }
    if (!memory[kind]) {
      memory[kind] = seedFor(kind).map(function (s) {
        return stripCrime(Object.assign({}, s));
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
      var row = stripCrime(
        Object.assign({}, payload, {
          id: (payload && payload.id) || idPrefix + Date.now(),
          updated_at: today(),
          created_at: (payload && payload.created_at) || today(),
        }),
      );
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
      s.rows[i] = stripCrime(
        Object.assign({}, s.rows[i], payload, { id: id, updated_at: today() }),
      );
      if (s.persist) save(KEYS[kind], s.rows);
      return ok(s.rows[i]);
    }

    return {
      listPrisonLocations: function () {
        return list("locations");
      },
      createPrisonLocation: function (p) {
        var row = Object.assign({}, p || {});
        row.name = row.name || row.nome_da_prisao || "";
        row.nome_da_prisao = row.nome_da_prisao || row.name || "";
        row.status = row.status || row.estado || "Active";
        row.estado = row.estado || row.status || "Activo";
        return create("locations", "prison-", row);
      },
      updatePrisonLocation: function (id, p) {
        return update("locations", id, p);
      },
      getActivePrisonLocations: function () {
        return ok(
          store("locations").rows.filter(function (r) {
            return /activ|activo/i.test(String(r.status || r.estado || ""));
          }),
        );
      },
      listPrisonRepresentatives: function () {
        return list("representatives");
      },
      createPrisonRepresentative: function (p) {
        return create(
          "representatives",
          "prep-",
          Object.assign({ status: "Active", estado: "Activo" }, p || {}),
        );
      },
      updatePrisonRepresentative: function (id, p) {
        return update("representatives", id, p);
      },
      getActiveRepresentatives: function () {
        return ok(
          store("representatives").rows.filter(function (r) {
            return /activ|activo/i.test(String(r.status || r.estado || ""));
          }),
        );
      },
      listPrisonServices: function () {
        return list("services");
      },
      createPrisonService: function (p) {
        var row = Object.assign({ status: "Scheduled", estado: "Planeado" }, p || {});
        row.service_date = row.service_date || row.data || "";
        row.data = row.data || row.service_date || "";
        row.prison_id = row.prison_id || row.prisao || "";
        row.prisao = row.prisao || row.prison_id || "";
        return create("services", "ps-", row);
      },
      updatePrisonService: function (id, p) {
        return update("services", id, p);
      },
      completePrisonService: function (id, p) {
        return update(
          "services",
          id,
          Object.assign(
            {
              status: "Completed",
              estado: "Realizado",
              completed_at: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      cancelPrisonService: function (id, p) {
        return update(
          "services",
          id,
          Object.assign({ status: "Cancelled", estado: "Cancelado" }, p || {}),
        );
      },
      listPrisonParticipants: function () {
        return list("participants");
      },
      createPrisonParticipant: function (p) {
        return create(
          "participants",
          "pp-",
          stripCrime(
            Object.assign(
              {
                status: "Active",
                confidentiality_level: "Normal",
                foundation_status: "Not Interested",
                follow_up_status: "Pending",
              },
              p || {},
            ),
          ),
        );
      },
      updatePrisonParticipant: function (id, p) {
        return update("participants", id, stripCrime(p || {}));
      },
      getNewConvertsInPrison: function () {
        return ok(
          store("participants").rows.filter(function (r) {
            return r.born_again || r.new_convert_date;
          }),
        );
      },
      getParticipantsNeedingFollowUp: function () {
        return ok(
          store("participants").rows.filter(function (r) {
            return /pending|needs/i.test(String(r.follow_up_status || ""));
          }),
        );
      },
      listPrisonFoundationStudents: function () {
        return list("foundation");
      },
      createPrisonFoundationStudent: function (p) {
        var row = Object.assign({ status: "Enrolled", estado: "Inscrito" }, p || {});
        row.participant_name = row.participant_name || row.nome_do_participante || "";
        row.nome_do_participante = row.nome_do_participante || row.participant_name || "";
        row.prison_id = row.prison_id || row.prisao || "";
        row.prisao = row.prisao || row.prison_id || "";
        return create("foundation", "pfs-", row);
      },
      updatePrisonFoundationStudent: function (id, p) {
        return update("foundation", id, p);
      },
      markPrisonFoundationLessonCompleted: function (id, p) {
        return update(
          "foundation",
          id,
          Object.assign({ status: "In Progress", estado: "Em Curso" }, p || {}),
        );
      },
      updatePrisonFoundationScore: function (id, p) {
        return update("foundation", id, p || {});
      },
      markPrisonFoundationReadyForFinalExam: function (id, p) {
        return update(
          "foundation",
          id,
          Object.assign(
            {
              status: "Ready for Final Exam",
              estado: "Exame",
              final_exam_status: "Ready",
            },
            p || {},
          ),
        );
      },
      listPrisonWeeklyAgendas: function () {
        return list("agendas");
      },
      createPrisonWeeklyAgenda: function (p) {
        var row = Object.assign({ status: "Draft", estado: "Rascunho" }, p || {});
        row.week_start_date = row.week_start_date || row.semana_inicio || "";
        row.week_end_date = row.week_end_date || row.semana_fim || "";
        row.semana_inicio = row.semana_inicio || row.week_start_date || "";
        row.semana_fim = row.semana_fim || row.week_end_date || "";
        return create("agendas", "pwa-", row);
      },
      updatePrisonWeeklyAgenda: function (id, p) {
        return update("agendas", id, p);
      },
      activatePrisonWeeklyAgenda: function (id, p) {
        var s = store("agendas");
        s.rows.forEach(function (r, idx) {
          if (r.id !== id && /activ|activo|confirm/i.test(String(r.status || r.estado || ""))) {
            s.rows[idx] = Object.assign({}, r, {
              status: "Completed",
              estado: "Concluído",
            });
          }
        });
        if (s.persist) save(KEYS.agendas, s.rows);
        return update(
          "agendas",
          id,
          Object.assign({ status: "Active", estado: "Confirmado" }, p || {}),
        );
      },
      closePrisonWeeklyAgenda: function (id, p) {
        return update(
          "agendas",
          id,
          Object.assign({ status: "Completed", estado: "Concluído" }, p || {}),
        );
      },
      getCurrentPrisonWeeklyAgenda: function () {
        var rows = store("agendas").rows;
        var active = rows.find(function (r) {
          return /activ|activo|confirm/i.test(String(r.status || r.estado || ""));
        });
        return ok(active || rows[0] || null);
      },
      listPrisonFollowUps: function () {
        return list("followUps");
      },
      createPrisonFollowUp: function (p) {
        return create(
          "followUps",
          "pfu-",
          Object.assign({ status: "Pending", method: "Through Representative" }, p || {}),
        );
      },
      updatePrisonFollowUp: function (id, p) {
        return update("followUps", id, p);
      },
      completePrisonFollowUp: function (id, p) {
        return update(
          "followUps",
          id,
          Object.assign({ status: "Completed" }, p || {}),
        );
      },
      getPendingPrisonFollowUps: function () {
        return ok(
          store("followUps").rows.filter(function (r) {
            return /pending|pendente/i.test(String(r.status || ""));
          }),
        );
      },
      listPrisonReports: function () {
        return list("reports");
      },
      createPrisonReport: function (p) {
        var row = Object.assign({ status: "Draft", estado: "Rascunho" }, p || {});
        return create("reports", "pr-", row);
      },
      updatePrisonReport: function (id, p) {
        return update("reports", id, p);
      },
      submitPrisonReport: function (id, p) {
        return update(
          "reports",
          id,
          Object.assign(
            {
              status: "Submitted",
              estado: "Relatório Submetido",
              submitted_at: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      validatePrisonReport: function (id, p) {
        return update(
          "reports",
          id,
          Object.assign(
            {
              status: "Validated",
              estado: "Validado",
              validated_at: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      rejectPrisonReport: function (id, p) {
        if (!p || !p.rejection_reason) {
          return fail("rejection_reason é obrigatório", "VALIDATION");
        }
        return update(
          "reports",
          id,
          Object.assign(
            {
              status: "Needs Correction",
              estado: "Correção Necessária",
              rejected_at: new Date().toISOString(),
            },
            p || {},
          ),
        );
      },
      getPendingPrisonReports: function () {
        return ok(
          store("reports").rows.filter(function (r) {
            return /draft|submit|review|rascun|submet|revis/i.test(String(r.status || r.estado || ""));
          }),
        );
      },
      listPrisonMaterialsRequests: function () {
        return list("materials");
      },
      createPrisonMaterialsRequest: function (p) {
        return create(
          "materials",
          "pmr-",
          Object.assign({ status: "Pending" }, p || {}),
        );
      },
      updatePrisonMaterialsRequest: function (id, p) {
        return update("materials", id, p);
      },
      getPendingPrisonMaterialsRequests: function () {
        return ok(
          store("materials").rows.filter(function (r) {
            return /pending|partial/i.test(String(r.status || ""));
          }),
        );
      },
      markPrisonMaterialsRequestFulfilled: function (id, p) {
        return update(
          "materials",
          id,
          Object.assign({ status: "Fulfilled" }, p || {}),
        );
      },
      getPrisonMinistryOverviewStats: function () {
        return ok({
          prisons: store("locations").rows.length,
          activePrisons: pure().getActivePrisonLocations().data.length,
          services: store("services").rows.length,
          participants: store("participants").rows.length,
          foundationStudents: store("foundation").rows.length,
          pendingFollowUps: pure().getPendingPrisonFollowUps().data.length,
          pendingReports: pure().getPendingPrisonReports().data.length,
          pendingMaterials: pure().getPendingPrisonMaterialsRequests().data.length,
        });
      },
      getPrisonServicesReport: function () {
        return ok({ services: store("services").rows.slice() });
      },
      getPrisonFoundationSchoolReport: function () {
        return ok({ students: store("foundation").rows.slice() });
      },
      getPrisonFollowUpReport: function () {
        return ok({ followUps: store("followUps").rows.slice() });
      },
      getPrisonMaterialsReport: function () {
        return ok({ requests: store("materials").rows.slice() });
      },
      getPrisonWeeklyReport: function () {
        return ok({ agendas: store("agendas").rows.slice() });
      },
      ensurePrisonMinistrySeeded: function () {
        Object.keys(KEYS).forEach(function (kind) {
          store(kind);
        });
        return ok(true);
      },
      getPrisonMinistryDataSourceInfo: function () {
        return {
          source: resolveDataSource(),
          provider: resolveDataSource() === "local" ? "local-bridge" : "mock-bridge",
          ready: true,
          description: "Prison Ministry pure-JS bridge fallback",
          domain: "prisonMinistry",
        };
      },
      getInfo: function () {
        return pure().getPrisonMinistryDataSourceInfo();
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
        console.warn("[CE Prison] API call failed, using fallback", method, e);
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
    "listPrisonLocations",
    "createPrisonLocation",
    "updatePrisonLocation",
    "getActivePrisonLocations",
    "listPrisonRepresentatives",
    "createPrisonRepresentative",
    "updatePrisonRepresentative",
    "getActiveRepresentatives",
    "listPrisonServices",
    "createPrisonService",
    "updatePrisonService",
    "completePrisonService",
    "cancelPrisonService",
    "listPrisonParticipants",
    "createPrisonParticipant",
    "updatePrisonParticipant",
    "getNewConvertsInPrison",
    "getParticipantsNeedingFollowUp",
    "listPrisonFoundationStudents",
    "createPrisonFoundationStudent",
    "updatePrisonFoundationStudent",
    "markPrisonFoundationLessonCompleted",
    "updatePrisonFoundationScore",
    "markPrisonFoundationReadyForFinalExam",
    "listPrisonWeeklyAgendas",
    "createPrisonWeeklyAgenda",
    "updatePrisonWeeklyAgenda",
    "activatePrisonWeeklyAgenda",
    "closePrisonWeeklyAgenda",
    "getCurrentPrisonWeeklyAgenda",
    "listPrisonFollowUps",
    "createPrisonFollowUp",
    "updatePrisonFollowUp",
    "completePrisonFollowUp",
    "getPendingPrisonFollowUps",
    "listPrisonReports",
    "createPrisonReport",
    "updatePrisonReport",
    "submitPrisonReport",
    "validatePrisonReport",
    "rejectPrisonReport",
    "getPendingPrisonReports",
    "listPrisonMaterialsRequests",
    "createPrisonMaterialsRequest",
    "updatePrisonMaterialsRequest",
    "getPendingPrisonMaterialsRequests",
    "markPrisonMaterialsRequestFulfilled",
    "getPrisonMinistryOverviewStats",
    "getPrisonServicesReport",
    "getPrisonFoundationSchoolReport",
    "getPrisonFollowUpReport",
    "getPrisonMaterialsReport",
    "getPrisonWeeklyReport",
    "ensurePrisonMinistrySeeded",
    "getPrisonMinistryDataSourceInfo",
    "getInfo",
  ];

  var dataApi = {
    dualWriteRecord: function (kind, mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      var map = {
        prisonLocation: { create: "createPrisonLocation", update: "updatePrisonLocation" },
        prisonService: { create: "createPrisonService", update: "updatePrisonService" },
        prisonFoundation: {
          create: "createPrisonFoundationStudent",
          update: "updatePrisonFoundationStudent",
        },
        prisonAgenda: { create: "createPrisonWeeklyAgenda", update: "updatePrisonWeeklyAgenda" },
        prisonReport: { create: "createPrisonReport", update: "updatePrisonReport" },
      };
      var entry = map[kind];
      if (!entry) return Promise.resolve({ ok: true, skipped: true });
      if (mode === "create") return call(entry.create, [stripCrime(record)]);
      if (mode === "update") return call(entry.update, [record.id, stripCrime(record)]);
      return Promise.resolve({ ok: true, skipped: true });
    },
  };
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  window.CEPrisonMinistry = Object.assign({}, window.CEPrisonMinistry || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.prisonMinistry) window.CEDataLayer.prisonMinistry = dataApi;

  try {
    console.info("[CE Prison] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
