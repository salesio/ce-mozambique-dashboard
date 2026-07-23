/**
 * Access Control data bridge — dual-write users/roles/permissions/audit.
 * Keys: ce-data-layer:users | roles | permissions | permission-templates | audit-logs
 *
 * Merges with existing window.CEAccessControl (ROLE_TEMPLATES / resolveModuleAccess).
 * Does NOT replace live RBAC. Does NOT store real passwords.
 */
(function () {
  var KEYS = {
    users: "ce-data-layer:users",
    roles: "ce-data-layer:roles",
    permissions: "ce-data-layer:permissions",
    templates: "ce-data-layer:permission-templates",
    audit: "ce-data-layer:audit-logs",
  };
  var memory = {
    users: null,
    roles: null,
    permissions: null,
    templates: null,
    audit: null,
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
    var layer = window.CEDataLayer && (window.CEDataLayer.accessControl || window.CEDataLayer.users);
    if (layer && typeof layer.createUser === "function") {
      return { api: layer, via: "CEDataLayer.accessControl" };
    }
    if (window.CEAccessControlData && typeof window.CEAccessControlData.createUser === "function") {
      return { api: window.CEAccessControlData, via: "CEAccessControlData" };
    }
    if (window.CESupabase && typeof window.CESupabase.createUser === "function") {
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
      console.warn("[CE AccessControl] persist failed", key, e);
    }
  }

  function seedFor(kind) {
    var S = window.CESupabase || {};
    if (kind === "users") return S.USERS_SEED || [];
    if (kind === "roles") return S.ROLES_SEED || [];
    if (kind === "permissions") return S.PERMISSIONS_SEED || [];
    if (kind === "templates") return S.PERMISSION_TEMPLATES_SEED || [];
    if (kind === "audit") return S.AUDIT_LOGS_SEED || [];
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
      // Never store password fields
      delete row.password;
      delete row.password_hash;
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
      delete next.password;
      delete next.password_hash;
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
      listUsers: function () {
        return list("users");
      },
      getUserById: function (id) {
        return ok(
          store("users").rows.find(function (r) {
            return r.id === id;
          }) || null,
        );
      },
      getUserByEmail: function (email) {
        var e = String(email || "").toLowerCase();
        return ok(
          store("users").rows.find(function (r) {
            return String(r.email || "").toLowerCase() === e;
          }) || null,
        );
      },
      createUser: function (p) {
        return create("users", "u-", p);
      },
      updateUser: function (id, p) {
        return update("users", id, p);
      },
      deleteUser: function (id) {
        return remove("users", id);
      },
      linkUserToStaff: function (userId, staffId, staffName) {
        return update("users", userId, {
          staff_id: staffId,
          staff_name: staffName || "",
          assigned_staff_name: staffName || "",
        });
      },
      updateUserRole: function (userId, roleId, roleName) {
        return update("users", userId, {
          role_id: roleId,
          role: roleName || "",
          role_name: roleName || "",
        });
      },
      updateUserStatus: function (userId, status) {
        return update("users", userId, { status: status });
      },
      listRoles: function () {
        return list("roles");
      },
      createRole: function (p) {
        return create("roles", "role-", p);
      },
      updateRole: function (id, p) {
        return update("roles", id, p);
      },
      deleteRole: function (id) {
        return remove("roles", id);
      },
      listPermissions: function () {
        return list("permissions");
      },
      setRolePermissions: function (roleId, permissions) {
        var s = store("permissions");
        s.rows = s.rows.filter(function (r) {
          return r.role_id !== roleId;
        });
        (permissions || []).forEach(function (p) {
          s.rows.unshift(
            Object.assign({}, p, {
              id: p.id || "perm-" + Date.now() + Math.random(),
              role_id: roleId,
            }),
          );
        });
        if (s.persist) save(KEYS.permissions, s.rows);
        return ok(s.rows.filter(function (r) {
          return r.role_id === roleId;
        }));
      },
      checkPermission: function () {
        return ok(null);
      },
      listPermissionTemplates: function () {
        return list("templates");
      },
      applyTemplateToRole: function (templateId, roleId) {
        var tpl = store("templates").rows.find(function (t) {
          return t.id === templateId;
        });
        if (!tpl) return fail("Template não encontrado", "NOT_FOUND");
        return pure().setRolePermissions(roleId, tpl.permissions || []);
      },
      applyTemplateToUser: function (templateId, userId) {
        var tpl = store("templates").rows.find(function (t) {
          return t.id === templateId;
        });
        if (!tpl) return fail("Template não encontrado", "NOT_FOUND");
        return update("users", userId, { permissions: tpl.permissions || [] });
      },
      listAuditLogs: function () {
        return list("audit");
      },
      createAuditLog: function (p) {
        return create("audit", "audit-", Object.assign({}, p, {
          date: (p && p.date) || new Date().toISOString().slice(0, 10),
          created_at: (p && p.created_at) || new Date().toISOString(),
          actor: (p && (p.actor || p.user_name)) || "",
        }));
      },
      searchAuditLogs: function (query) {
        var q = String(query || "").toLowerCase();
        return ok(
          store("audit").rows.filter(function (r) {
            return (
              String(r.description || "").toLowerCase().includes(q) ||
              String(r.action || "").toLowerCase().includes(q) ||
              String(r.user_name || r.actor || "").toLowerCase().includes(q)
            );
          }),
        );
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
      console.warn("[CE AccessControl] call failed", method, error);
      if (typeof fallback[method] === "function") return fallback[method].apply(fallback, args || []);
      return fail(error && error.message);
    }
  }

  var methods = [
    "listUsers",
    "getUserById",
    "getUserByEmail",
    "createUser",
    "updateUser",
    "deleteUser",
    "linkUserToStaff",
    "updateUserRole",
    "updateUserStatus",
    "listRoles",
    "createRole",
    "updateRole",
    "deleteRole",
    "listPermissions",
    "setRolePermissions",
    "checkPermission",
    "listPermissionTemplates",
    "applyTemplateToRole",
    "applyTemplateToUser",
    "listAuditLogs",
    "createAuditLog",
    "searchAuditLogs",
    "getInfo",
  ];

  var dataApi = {
    dualWriteUser: function (mode, record) {
      if (!record) return Promise.resolve({ ok: true, skipped: true });
      if (mode === "create") return call("createUser", [record]);
      if (mode === "update") return call("updateUser", [record.id, record]);
      return Promise.resolve({ ok: true, skipped: true });
    },
    dualWriteAudit: function (record) {
      return call("createAuditLog", [record]);
    },
  };
  methods.forEach(function (m) {
    dataApi[m] = function () {
      return call(m, Array.prototype.slice.call(arguments));
    };
  });

  /**
   * canUser — wraps existing resolveModuleAccess / canPerformAction.
   * Sensitive actions map to can_view_salary / can_verify / etc.
   */
  function canUser(user, module, action, context) {
    var ac = window.CEAccessControl;
    if (!user) return false;
    if ((user.department_permissions || []).includes("*") || user.role === "Super Admin") return true;
    if (!ac) return false;

    var act = String(action || "view");
    if (act === "view_salary" || act === "view_sensitive" || act === "view_documents") {
      if (typeof ac.canViewSalary === "function") return !!ac.canViewSalary(user);
      var sa = ac.resolveModuleAccess?.(user, "staffHr");
      return !!(sa && (sa.can_view_salary || sa.can_edit));
    }
    if (act === "manage_permissions" || act === "view_audit_logs") {
      var mod = act === "view_audit_logs" ? "auditLogs" : "accessControl";
      return !!ac.resolveModuleAccess?.(user, mod)?.can_view;
    }
    if (typeof ac.canPerformAction === "function") {
      return !!ac.canPerformAction(user, module, act);
    }
    var access = ac.resolveModuleAccess?.(user, module);
    if (!access || !access.can_view) return false;
    if (act === "view") return true;
    return !!access["can_" + act] || !!access.can_edit;
  }

  function getCurrentUserPermissions(user) {
    var ac = window.CEAccessControl;
    if (!ac || !user) return {};
    var mods = ac.ALL_MODULES || [];
    var out = {};
    mods.forEach(function (m) {
      out[m] = ac.resolveModuleAccess(user, m);
    });
    return out;
  }

  function getAllowedModulesForUser(user) {
    var perms = getCurrentUserPermissions(user);
    return Object.keys(perms).filter(function (m) {
      return perms[m] && perms[m].can_view;
    });
  }

  // Merge onto existing CEAccessControl without wiping ROLE_TEMPLATES
  var existing = window.CEAccessControl || {};
  window.CEAccessControl = Object.assign({}, existing, dataApi, {
    canUser: canUser,
    getCurrentUserPermissions: getCurrentUserPermissions,
    getAllowedModulesForUser: getAllowedModulesForUser,
    dataApi: dataApi,
    // Keep aliases used by plan
    canViewSensitiveStaffData:
      existing.canViewSensitiveStaffData ||
      function (user) {
        return canUser(user, "staffHr", "view_salary");
      },
    canViewFinanceDetails: function (user) {
      return canUser(user, "finance", "view");
    },
    canViewDocuments: function (user) {
      return canUser(user, "staffHr", "view_documents");
    },
    canExportSensitiveReports: function (user) {
      return canUser(user, "reports", "export") || canUser(user, "finance", "export");
    },
  });

  window.CEAccessControlData = dataApi;
  window.CEDataLayer = window.CEDataLayer || {};
  if (!window.CEDataLayer.accessControl) window.CEDataLayer.accessControl = dataApi;
  if (!window.CEDataLayer.users) window.CEDataLayer.users = dataApi;
  if (!window.CEDataLayer.auditLogs) {
    window.CEDataLayer.auditLogs = {
      listAuditLogs: dataApi.listAuditLogs,
      createAuditLog: dataApi.createAuditLog,
      searchAuditLogs: dataApi.searchAuditLogs,
    };
  }

  try {
    console.info("[CE AccessControl] data bridge ready", dataApi.getInfo());
  } catch (_) {}
})();
