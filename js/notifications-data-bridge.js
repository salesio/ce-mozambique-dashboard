/**
 * Notifications data bridge — dual-write / pure-JS localStorage fallback.
 * Keys: ce-data-layer:notifications | notification-templates
 * Also exposes window.CENotifications.notify(eventType, payload)
 * and window.recordAuditLog(action, payload) fallback helper.
 */
(function () {
  var KEYS = {
    notifications: "ce-data-layer:notifications",
    templates: "ce-data-layer:notification-templates",
  };
  var memory = { notifications: null, templates: null };

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
    var layer = window.CEDataLayer && window.CEDataLayer.notifications;
    if (layer && typeof layer.createNotification === "function") {
      return { api: layer, via: "CEDataLayer.notifications" };
    }
    if (window.CENotifications && typeof window.CENotifications.createNotification === "function") {
      return { api: window.CENotifications, via: "CENotifications" };
    }
    if (window.CESupabase && typeof window.CESupabase.createNotification === "function") {
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
      console.warn("[CE Notifications] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "notifications") return S.NOTIFICATIONS_SEED || [];
    if (kind === "templates") return S.NOTIFICATION_TEMPLATES_SEED || [];
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
  function now() {
    return new Date().toISOString();
  }

  function fillTemplate(template, vars) {
    return String(template || "").replace(/\{\{(\w+)\}\}/g, function (_, key) {
      return String((vars && vars[key]) != null ? vars[key] : "");
    });
  }

  function pure() {
    function list(kind) {
      return ok(store(kind).rows.slice());
    }
    function create(kind, idPrefix, payload) {
      var s = store(kind);
      var row = Object.assign({}, payload, {
        id: (payload && payload.id) || idPrefix + Date.now(),
        created_at: (payload && payload.created_at) || now(),
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
      listNotifications: function () {
        return list("notifications");
      },
      createNotification: function (p) {
        return create(
          "notifications",
          "not-",
          Object.assign(
            {
              type: "info",
              priority: "normal",
              scope: "national",
              is_read: false,
              is_archived: false,
            },
            p || {},
          ),
        );
      },
      updateNotification: function (id, p) {
        return update("notifications", id, p);
      },
      deleteNotification: function (id) {
        var s = store("notifications");
        s.rows = s.rows.filter(function (r) {
          return r.id !== id;
        });
        if (s.persist) save(KEYS.notifications, s.rows);
        return ok(true);
      },
      getNotificationsByUser: function (userId) {
        return ok(
          store("notifications").rows.filter(function (n) {
            return (
              n.recipient_user_id === userId ||
              n.scope === "national" ||
              n.scope === "all"
            );
          }),
        );
      },
      getUnreadNotifications: function (userId) {
        return ok(
          pure()
            .getNotificationsByUser(userId)
            .data.filter(function (n) {
              return !n.is_read && !n.is_archived;
            }),
        );
      },
      getUnreadCountForUser: function (userId) {
        return ok(pure().getUnreadNotifications(userId).data.length);
      },
      getCriticalNotifications: function (userId) {
        return ok(
          pure()
            .getNotificationsByUser(userId)
            .data.filter(function (n) {
              return !n.is_read && /urgent|critical|high/i.test(String(n.priority || ""));
            }),
        );
      },
      getTodayNotifications: function (userId) {
        var today = new Date().toISOString().slice(0, 10);
        return ok(
          pure()
            .getNotificationsByUser(userId)
            .data.filter(function (n) {
              return String(n.created_at || "").startsWith(today);
            }),
        );
      },
      markNotificationAsRead: function (id) {
        return update("notifications", id, { is_read: true, read_at: now() });
      },
      markNotificationAsUnread: function (id) {
        return update("notifications", id, { is_read: false, read_at: "" });
      },
      markAllNotificationsAsRead: function (userId) {
        var unread = pure().getUnreadNotifications(userId).data;
        unread.forEach(function (n) {
          pure().markNotificationAsRead(n.id);
        });
        return ok(unread.length);
      },
      archiveNotification: function (id) {
        return update("notifications", id, { is_archived: true, archived_at: now() });
      },
      listNotificationTemplates: function () {
        return list("templates");
      },
      createNotificationTemplate: function (p) {
        return create("templates", "ntpl-", Object.assign({ is_active: true }, p || {}));
      },
      updateNotificationTemplate: function (id, p) {
        return update("templates", id, p);
      },
      notify: function (eventType, payload) {
        payload = payload || {};
        var tpl = store("templates").rows.find(function (t) {
          return t.event_type === eventType && t.is_active !== false;
        });
        var vars = payload.vars || payload;
        var title = tpl
          ? fillTemplate(tpl.title_template_pt || eventType, vars)
          : payload.title || eventType;
        var message = tpl
          ? fillTemplate(tpl.message_template_pt || "", vars)
          : payload.message || "";
        return pure().createNotification({
          title: title,
          message: message,
          type: payload.type || (tpl && tpl.default_type) || "info",
          module: payload.module || (tpl && tpl.module) || "system",
          priority: payload.priority || (tpl && tpl.default_priority) || "normal",
          scope: payload.scope || "role",
          recipient_user_id: payload.recipient_user_id || "",
          recipient_role: payload.recipient_role || payload.role || "",
          recipient_church_id: payload.recipient_church_id || "",
          action_url: payload.action_url || "",
          action_label: payload.action_label || "Ver",
          entity_type: payload.entity_type || "",
          entity_id: payload.entity_id || "",
          metadata: payload.metadata || vars,
        });
      },
      getNotificationOverviewStats: function () {
        var rows = store("notifications").rows;
        return ok({
          total: rows.length,
          unread: rows.filter(function (n) {
            return !n.is_read;
          }).length,
          urgent: rows.filter(function (n) {
            return /urgent|critical/i.test(String(n.priority || n.type || ""));
          }).length,
          actionRequired: rows.filter(function (n) {
            return /action_required|approval_required/i.test(String(n.type || ""));
          }).length,
        });
      },
      ensureNotificationsSeeded: function () {
        store("notifications");
        store("templates");
        return ok(true);
      },
      getNotificationsDataSourceInfo: function () {
        return {
          source: resolveDataSource(),
          provider: resolveDataSource() === "local" ? "local-bridge" : "mock-bridge",
          ready: true,
          domain: "notifications",
        };
      },
      getInfo: function () {
        return pure().getNotificationsDataSourceInfo();
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
        console.warn("[CE Notifications] API failed, fallback", method, e);
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
    "listNotifications",
    "createNotification",
    "updateNotification",
    "deleteNotification",
    "getNotificationsByUser",
    "getUnreadNotifications",
    "getUnreadCountForUser",
    "getCriticalNotifications",
    "getTodayNotifications",
    "markNotificationAsRead",
    "markNotificationAsUnread",
    "markAllNotificationsAsRead",
    "archiveNotification",
    "listNotificationTemplates",
    "createNotificationTemplate",
    "updateNotificationTemplate",
    "notify",
    "getNotificationOverviewStats",
    "ensureNotificationsSeeded",
    "getNotificationsDataSourceInfo",
    "getInfo",
  ];

  var dataApi = {};
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  window.CENotifications = Object.assign({}, window.CENotifications || {}, dataApi);
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.notifications) window.CEDataLayer.notifications = dataApi;

  // Global helpers (safe fallbacks)
  if (!window.createSystemNotification) {
    window.createSystemNotification = function (eventType, payload) {
      return dataApi.notify(eventType, payload || {});
    };
  }
  if (!window.recordAuditLog) {
    window.recordAuditLog = function (action, payload) {
      try {
        var ac = window.CEAccessControlData || window.CEAccessControl || window.CEDataLayer?.accessControl;
        if (ac && typeof ac.createAuditLog === "function") {
          void ac.createAuditLog(
            Object.assign(
              {
                action: action,
                module: (payload && payload.module) || "system",
                severity: (payload && payload.severity) || "info",
                created_at: new Date().toISOString(),
              },
              payload || {},
            ),
          );
        }
      } catch (_) {}
    };
  }

  try {
    console.info("[CE Notifications] bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
