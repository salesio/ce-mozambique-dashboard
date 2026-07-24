/**
 * Settings data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:system-settings | global-categories | status-definitions |
 *       language-settings | notification-settings | ui-preferences
 */
(function () {
  var KEYS = {
    settings: "ce-data-layer:system-settings",
    categories: "ce-data-layer:global-categories",
    statuses: "ce-data-layer:status-definitions",
    languages: "ce-data-layer:language-settings",
    notifSettings: "ce-data-layer:notification-settings",
    ui: "ce-data-layer:ui-preferences",
  };
  var memory = {
    settings: null,
    categories: null,
    statuses: null,
    languages: null,
    notifSettings: null,
    ui: null,
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
    var layer = window.CEDataLayer && window.CEDataLayer.settings;
    if (layer && typeof layer.setSystemSetting === "function") {
      return { api: layer, via: "CEDataLayer.settings" };
    }
    if (window.CESettings && typeof window.CESettings.setSystemSetting === "function") {
      return { api: window.CESettings, via: "CESettings" };
    }
    if (window.CESupabase && typeof window.CESupabase.setSystemSetting === "function") {
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
      console.warn("[CE Settings] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "settings") return S.SYSTEM_SETTINGS_SEED || [];
    if (kind === "categories") return S.GLOBAL_CATEGORIES_SEED || [];
    if (kind === "statuses") return S.STATUS_DEFINITIONS_SEED || [];
    if (kind === "languages") return S.LANGUAGE_SETTINGS_SEED || [];
    if (kind === "notifSettings") return S.NOTIFICATION_SETTINGS_SEED || [];
    if (kind === "ui") return S.UI_PREFERENCES_SEED || [];
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
      listSystemSettings: function () {
        return list("settings");
      },
      getSystemSettingByKey: function (key) {
        var found = store("settings").rows.find(function (r) {
          return r.key === key;
        });
        return ok(found || null);
      },
      setSystemSetting: function (key, value) {
        var s = store("settings");
        var i = s.rows.findIndex(function (r) {
          return r.key === key;
        });
        if (i >= 0) {
          s.rows[i] = Object.assign({}, s.rows[i], { value: String(value), updated_at: today() });
          if (s.persist) save(KEYS.settings, s.rows);
          return ok(s.rows[i]);
        }
        return create("settings", "set-", {
          key: key,
          value: String(value),
          value_type: "string",
          module: "global",
        });
      },
      updateSystemSetting: function (id, p) {
        return update("settings", id, p);
      },
      listGlobalCategories: function () {
        return list("categories");
      },
      createGlobalCategory: function (p) {
        return create("categories", "gcat-", Object.assign({ status: "Active" }, p || {}));
      },
      updateGlobalCategory: function (id, p) {
        return update("categories", id, p);
      },
      listStatusDefinitions: function () {
        return list("statuses");
      },
      createStatusDefinition: function (p) {
        return create("statuses", "st-", p || {});
      },
      updateStatusDefinition: function (id, p) {
        return update("statuses", id, p);
      },
      listLanguageSettings: function () {
        return list("languages");
      },
      setDefaultLanguage: function (code) {
        var s = store("languages");
        s.rows = s.rows.map(function (r) {
          return Object.assign({}, r, { is_default: r.code === code });
        });
        if (s.persist) save(KEYS.languages, s.rows);
        pure().setSystemSetting("default_public_language", code);
        return ok(s.rows.find(function (r) {
          return r.code === code;
        }) || null);
      },
      getActiveLanguages: function () {
        return ok(
          store("languages").rows.filter(function (r) {
            return r.is_active !== false;
          }),
        );
      },
      listNotificationSettings: function () {
        return list("notifSettings");
      },
      updateNotificationSetting: function (id, p) {
        return update("notifSettings", id, p);
      },
      listUiPreferences: function () {
        return list("ui");
      },
      updateUiPreference: function (id, p) {
        return update("ui", id, p);
      },
      ensureSettingsSeeded: function () {
        Object.keys(KEYS).forEach(function (k) {
          store(k);
        });
        return ok(true);
      },
      getSettingsDataSourceInfo: function () {
        return {
          source: resolveDataSource(),
          provider: resolveDataSource() === "local" ? "local-bridge" : "mock-bridge",
          ready: true,
          domain: "settings",
        };
      },
      getInfo: function () {
        return pure().getSettingsDataSourceInfo();
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
        console.warn("[CE Settings] API failed, fallback", method, e);
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
    "listSystemSettings",
    "getSystemSettingByKey",
    "setSystemSetting",
    "updateSystemSetting",
    "listGlobalCategories",
    "createGlobalCategory",
    "updateGlobalCategory",
    "listStatusDefinitions",
    "createStatusDefinition",
    "updateStatusDefinition",
    "listLanguageSettings",
    "setDefaultLanguage",
    "getActiveLanguages",
    "listNotificationSettings",
    "updateNotificationSetting",
    "listUiPreferences",
    "updateUiPreference",
    "ensureSettingsSeeded",
    "getSettingsDataSourceInfo",
    "getInfo",
  ];

  var dataApi = {};
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  window.CESettings = Object.assign({}, window.CESettings || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.settings) window.CEDataLayer.settings = dataApi;

  try {
    console.info("[CE Settings] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
