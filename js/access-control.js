/**
 * CE Mozambique — role-based access control (frontend-first).
 * Prepares permission model for future Supabase/PostgreSQL profiles + user_roles.
 */
(function () {
  "use strict";

  const SHOW_LOCKED_MODULES = true;

  const SENSITIVE_MODULES = new Set([
    "finance", "staffHr", "requisitions", "accessControl", "usersRoles", "auditLogs"
  ]);

  const ROUTE_MODULE_MAP = {
    dashboard: "dashboard",
    churches: "churches",
    members: "members",
    firstTimers: "firstTimers",
    followUp: "followUp",
    reports: "reports",
    counseling: "counseling",
    foundation: "foundation",
    finance: "finance",
    fevo: "fevo",
    venueInventory: "venueInventory",
    sacraments: "sacraments",
    cellPrison: "prisonMinistry",
    cellMaterials: "ministryMaterials",
    programs: "programs",
    partnership: "partnership",
    media: "media",
    requisitions: "requisitions",
    staffHr: "staffHr",
    users: "usersRoles",
    access: "accessControl",
    settings: "settings",
    audit: "auditLogs"
  };

  const CELL_ROUTE_MODULES = {
    cellAlecOverview: "cell",
    cellAlecRegistration: "cell",
    cellAlecScores: "cell",
    cellChurchReports: "cell",
    cellMinistryOverview: "cell",
    cellReceivedReports: "cell",
    cellEvaluationRoute: "cell",
    cellPerformance: "cell",
    cellLeadersAttention: "cell",
    cellActionPlan: "cell",
    cellWeeklyReport: "cell",
    cellGroups: "cell",
    cellCellsList: "cell",
    cellLeadersRoute: "cell",
    cellFinalValidation: "cell",
    cellConsolidation: "cell"
  };

  const FEVO_ROUTE_MODULES = {
    fevoConfigRoute: "fevo",
    fevoFollowUpRoute: "fevo",
    fevoEvangelismRoute: "fevo",
    fevoVisitationRoute: "fevo",
    fevoPrayerRoute: "fevo",
    fevoNoReportsRoute: "fevo",
    fevoWeeklyReportsRoute: "fevo",
    fevoAnalysisRoute: "fevo"
  };

  const VENUE_ROUTE_MODULES = {
    venueInventoryGeneral: "venueInventory",
    venueInventoryAcquisitions: "venueInventory",
    venueInventoryStaff: "venueInventory",
    venueInventoryMaintenance: "venueInventory",
    venueInventoryMovements: "venueInventory",
    venueInventorySpaces: "venueInventory",
    venueInventoryChecklist: "venueInventory",
    venueInventoryReports: "venueInventory"
  };

  const ALL_MODULES = [
    "dashboard", "churches", "members", "firstTimers", "followUp", "reports", "counseling",
    "foundation", "finance", "notifications", "fevo", "venueInventory", "sacraments", "prisonMinistry",
    "ministryMaterials", "programs", "partnership", "media", "cell", "requisitions",
    "staffHr", "usersRoles", "accessControl", "settings", "auditLogs"
  ];

  const FULL_ACCESS = {
    can_view: true, can_create: true, can_edit: true, can_delete: true,
    can_approve: true, can_verify: true, can_release_resources: true, can_export: true, scope: "all"
  };

  const VIEW_ONLY = {
    can_view: true, can_create: false, can_edit: false, can_delete: false,
    can_approve: false, can_verify: false, can_release_resources: false, can_export: false, scope: "church"
  };

  const ROLE_TEMPLATES = {
    "Super Admin": { modules: Object.fromEntries(ALL_MODULES.map((m) => [m, { ...FULL_ACCESS }])) },
    "Main Pastor": {
      modules: {
        dashboard: { ...FULL_ACCESS, can_delete: false },
        churches: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        members: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        firstTimers: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        followUp: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        reports: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        counseling: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" },
        foundation: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        finance: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_release_resources: false, can_export: true, scope: "all" },
        fevo: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        venueInventory: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        sacraments: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        prisonMinistry: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        ministryMaterials: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        programs: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        partnership: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        media: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        cell: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        requisitions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: true, can_verify: false, can_release_resources: false, can_export: true, scope: "all" },
        staffHr: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        usersRoles: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" },
        accessControl: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" },
        settings: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" },
        auditLogs: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" }
      }
    },
    "National Admin": {
      modules: Object.fromEntries(ALL_MODULES.map((m) => [m, m === "usersRoles" || m === "accessControl"
        ? { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" }
        : { ...FULL_ACCESS, can_delete: m === "auditLogs" ? false : FULL_ACCESS.can_delete }
      ]))
    },
    "Church Pastor": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "church" },
        churches: { ...VIEW_ONLY, can_edit: true },
        members: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        firstTimers: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        followUp: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        reports: { ...VIEW_ONLY, can_export: true },
        counseling: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        foundation: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        finance: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        fevo: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        venueInventory: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        sacraments: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        cell: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        requisitions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        staffHr: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        programs: { ...VIEW_ONLY, can_create: true, can_edit: true },
        partnership: { ...VIEW_ONLY },
        media: { ...VIEW_ONLY },
        prisonMinistry: { ...VIEW_ONLY },
        ministryMaterials: { ...VIEW_ONLY },
        usersRoles: { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        accessControl: { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" },
        settings: { ...VIEW_ONLY },
        auditLogs: { can_view: false, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "church" }
      }
    },
    "Department Head": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "department" },
        members: { ...VIEW_ONLY, scope: "department" },
        firstTimers: { ...VIEW_ONLY, scope: "department" },
        followUp: { ...VIEW_ONLY, scope: "department" },
        reports: { ...VIEW_ONLY, scope: "department", can_export: true },
        requisitions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "department" },
        staffHr: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "department" },
        venueInventory: { can_view: true, can_create: true, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "department" },
        fevo: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "department" },
        cell: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "department" }
      }
    },
    "Counseling Head": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        counseling: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: true, can_export: true, scope: "all", can_assign_counselor: true, can_schedule_counseling: true, can_write_counseling_feedback: true, can_view_sensitive_counseling_notes: true, can_refer_to_pastor: true, can_create_follow_up_from_counseling: true },
        followUp: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        firstTimers: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        notifications: { ...VIEW_ONLY, scope: "all" }
      }
    },
    "Counselor": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "own" },
        counseling: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own", can_write_counseling_feedback: true },
        followUp: { ...VIEW_ONLY, scope: "own" },
        notifications: { ...VIEW_ONLY, scope: "own" }
      }
    },
    "Follow-Up Coordinator": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        followUp: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        counseling: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all", can_create_follow_up_from_counseling: true },
        firstTimers: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true }
      }
    },
    "Finance Head": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        finance: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: true, can_release_resources: true, can_export: true, scope: "all" },
        partnership: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        requisitions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: true, can_release_resources: true, can_export: true, scope: "all" },
        auditLogs: { ...VIEW_ONLY, scope: "all" }
      }
    },
    "Finance Officer": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "church" },
        finance: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: true, can_release_resources: false, can_export: true, scope: "church" },
        partnership: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "church" },
        reports: { ...VIEW_ONLY, scope: "church", can_export: true }
      }
    },
    "Partnership Coordinator": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        partnership: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        finance: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true }
      }
    },
    "HR Manager": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        staffHr: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all", can_view_salary: true },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true }
      }
    },
    "Requisition Officer": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        requisitions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all", can_review: true, can_forward: true },
        venueInventory: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" }
      }
    },
    "Media Director": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        media: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: true, can_export: true, scope: "all", can_view_media: true, can_create_media_schedule: true, can_edit_media_schedule: true, can_manage_media_team: true, can_evaluate_media_team: true, can_view_media_reports: true, can_manage_media_awards: true, can_export_media_reports: true },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        venueInventory: { ...VIEW_ONLY, scope: "all" },
        programs: { ...VIEW_ONLY, scope: "all" }
      }
    },
    "Media Supervisor": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        media: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: true, can_export: true, scope: "all", can_view_media: true, can_create_media_schedule: true, can_edit_media_schedule: true, can_manage_media_team: true, can_evaluate_media_team: true, can_view_media_reports: true, can_manage_media_awards: false, can_export_media_reports: true },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        venueInventory: { ...VIEW_ONLY, scope: "all" }
      }
    },
    "Media Team Member": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "own" },
        media: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own", can_view_media: true, can_create_media_schedule: false, can_edit_media_schedule: false, can_manage_media_team: false, can_evaluate_media_team: false, can_view_media_reports: false, can_manage_media_awards: false, can_export_media_reports: false },
        notifications: { ...VIEW_ONLY, scope: "own" }
      }
    },
    "Venue Manager": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        venueInventory: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all", can_register_inventory: true },
        requisitions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" }
      }
    },
    "Foundation Teacher": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "own" },
        foundation: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own" },
        notifications: { ...VIEW_ONLY, scope: "own" }
      }
    },
    "Foundation Rector": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        foundation: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: true, can_export: true, scope: "all" },
        notifications: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true }
      }
    },
    "Foundation Coordinator": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        foundation: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: true, can_export: true, scope: "all" },
        notifications: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true }
      }
    },
    "Foundation Assistant": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "own" },
        foundation: { can_view: true, can_create: false, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own" },
        notifications: { ...VIEW_ONLY, scope: "own" }
      }
    },
    "Cell Ministry Head": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        cell: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" },
        requisitions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "department" },
        staffHr: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "department" }
      }
    },
    "ALEC Coordinator": {
      modules: { dashboard: { ...VIEW_ONLY }, cell: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: true, scope: "all" } }
    },
    "F.E.V.O Coordinator": {
      modules: { dashboard: { ...VIEW_ONLY }, fevo: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_verify: false, can_export: true, scope: "all" } }
    },
    "Staff Member": {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "own" },
        requisitions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own" },
        staffHr: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own" },
        venueInventory: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "own" }
      }
    },
    Viewer: {
      modules: {
        dashboard: { ...VIEW_ONLY, scope: "all" },
        reports: { ...VIEW_ONLY, scope: "all", can_export: true },
        finance: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_verify: false, can_export: false, scope: "all" }
      }
    }
  };

  const LEGACY_PERMISSION_MAP = {
    counseling: "counseling",
    firstTimers: "firstTimers",
    followUp: "followUp",
    foundation: "foundation",
    foundation_teacher: "foundation",
    foundation_assistant: "foundation",
    foundation_rector: "foundation",
    foundation_coordinator: "foundation",
    finance: "finance",
    financeHead: "finance",
    financeOfficer: "finance",
    financeViewer: "finance",
    financeVerify: "finance",
    fevo: "fevo",
    fevoConfig: "fevo",
    fevoReports: "fevo",
    fevoAnalytics: "fevo",
    venueInventory: "venueInventory",
    venueInventoryRequests: "venueInventory",
    inventory: "venueInventory",
    venues: "venueInventory",
    maintenance: "venueInventory",
    checklists: "venueInventory",
    assignedEquipment: "venueInventory",
    cell: "cell",
    cellReports: "cell",
    cellEvaluation: "cell",
    churchReports: "cell",
    alecRegistration: "cell",
    alecScores: "cell",
    finalValidation: "cell",
    reports: "reports",
    prisonMinistry: "prisonMinistry",
    ministryMaterials: "ministryMaterials",
    media: "media",
    mediaTeam: "media",
    requisitions: "requisitions",
    staffHr: "staffHr",
    users: "usersRoles",
    access: "accessControl"
  };

  const NO_ACCESS = {
    can_view: false, can_create: false, can_edit: false, can_delete: false,
    can_approve: false, can_verify: false, can_release_resources: false, can_export: false, scope: "own"
  };

  function routeToModule(route) {
    if (!route) return "dashboard";
    if (ROUTE_MODULE_MAP[route]) return ROUTE_MODULE_MAP[route];
    if (CELL_ROUTE_MODULES[route]) return CELL_ROUTE_MODULES[route];
    if (FEVO_ROUTE_MODULES[route]) return FEVO_ROUTE_MODULES[route];
    if (VENUE_ROUTE_MODULES[route]) return VENUE_ROUTE_MODULES[route];
    if (route.startsWith("venueInventory")) return "venueInventory";
    if (route.startsWith("fevo")) return "fevo";
    if (route.startsWith("cell")) return "cell";
    return route;
  }

  function emptyAccess() {
    return { module: "", ...NO_ACCESS, can_view_salary: false, can_review: false, can_forward: false, can_register_inventory: false };
  }

  function mergeAccess(base, override) {
    if (!override) return { ...base };
    return { ...base, ...override, module: base.module };
  }

  function legacyGrant(user, module) {
    const grants = user?.department_permissions || [];
    if (grants.includes("*")) return { ...FULL_ACCESS };
    const keys = Object.entries(LEGACY_PERMISSION_MAP)
      .filter(([, mod]) => mod === module)
      .map(([key]) => key);
    if (keys.some((key) => grants.includes(key))) {
      return {
        can_view: true,
        can_create: grants.includes("*") || module === "finance" && grants.includes("financeHead"),
        can_edit: grants.includes("*") || grants.some((g) => keys.includes(g)),
        can_delete: grants.includes("*"),
        can_approve: grants.includes("*") || grants.includes("financeHead") || grants.includes("financeVerify"),
        can_verify: grants.includes("financeVerify") || grants.includes("financeHead"),
        can_export: true,
        scope: user.can_view_all_churches ? "all" : user.assigned_department ? "department" : "church"
      };
    }
    return null;
  }

  function resolveModuleAccess(user, module) {
    if (!user || !module) return emptyAccess();
    const base = { module, ...NO_ACCESS };
    const explicitDeniedModules = {
      "Finance Head": new Set(["staffHr", "usersRoles", "accessControl"]),
      "Finance Officer": new Set(["staffHr", "usersRoles", "accessControl", "auditLogs"]),
      "HR Manager": new Set(["finance", "requisitions", "usersRoles", "accessControl", "auditLogs"]),
      "Requisition Officer": new Set(["finance", "staffHr", "usersRoles", "accessControl", "auditLogs"]),
      "Staff Member": new Set(["finance", "reports", "usersRoles", "accessControl", "auditLogs"])
    };

    if (explicitDeniedModules[user.role]?.has(module)) {
      return base;
    }

    if (module === "notifications") {
      return { module, ...VIEW_ONLY, scope: user.can_view_all_churches ? "all" : user.assigned_department ? "department" : "church" };
    }

    if ((user.department_permissions || []).includes("*") || user.role === "Super Admin") {
      return { module, ...FULL_ACCESS, can_view_salary: true, can_review: true, can_forward: true, can_register_inventory: true };
    }

    const roleTemplate = ROLE_TEMPLATES[user.role];
    if (roleTemplate?.modules?.[module]) {
      const access = mergeAccess(base, roleTemplate.modules[module]);
      access.module = module;
      return access;
    }

    if (Array.isArray(user.permissions)) {
      const explicit = user.permissions.find((p) => p.module === module);
      if (explicit) return mergeAccess(base, explicit);
    }

    const legacy = legacyGrant(user, module);
    if (legacy) return { module, ...legacy };

    return base;
  }

  function canViewRoute(user, route) {
    const module = routeToModule(route);
    return resolveModuleAccess(user, module).can_view;
  }

  function canViewModule(user, module) {
    return Boolean(resolveModuleAccess(user, module).can_view);
  }

  function canAccessTab(user, module, tab) {
    const access = resolveModuleAccess(user, module);
    if (!access.can_view) return false;
    if (!tab) return true;
    const financeSensitiveTabs = new Set(["partners", "exports"]);
    const financeVerificationTabs = new Set(["verification", "approvedRequisitions"]);
    const staffSensitiveTabs = new Set(["salaries", "performance", "documents"]);
    const requisitionApprovalTabs = new Set(["review", "pastoral", "approved"]);
    const requisitionFinanceTabs = new Set(["released"]);
    const requisitionReportTabs = new Set(["reports", "history"]);
    const foundationTeacherTabs = new Set(["overview", "classes", "students", "lessons", "onlineTests", "soulWinning", "reports"]);
    const foundationAssistantTabs = new Set(["overview", "classes", "students", "lessons", "onlineTests"]);
    if (module === "finance" && financeSensitiveTabs.has(tab)) return Boolean(access.can_export || access.can_verify || access.can_approve);
    if (module === "finance" && financeVerificationTabs.has(tab)) return Boolean(access.can_verify || access.can_approve || access.can_release_resources);
    if (module === "staffHr" && staffSensitiveTabs.has(tab)) return Boolean(access.can_view_salary || access.can_edit || access.can_approve);
    if (module === "requisitions" && requisitionApprovalTabs.has(tab)) return Boolean(access.can_approve || access.can_verify || access.can_review || access.can_forward);
    if (module === "requisitions" && requisitionFinanceTabs.has(tab)) return Boolean(access.can_release_resources || access.can_verify);
    if (module === "requisitions" && requisitionReportTabs.has(tab)) return Boolean(access.can_export || access.can_approve || access.can_verify);
    if (module === "foundation" && user?.role === "Foundation Teacher") return foundationTeacherTabs.has(tab);
    if (module === "foundation" && user?.role === "Foundation Assistant") return foundationAssistantTabs.has(tab);
    return true;
  }

  function canPerformAction(user, module, action) {
    const access = resolveModuleAccess(user, module);
    const map = {
      view: "can_view",
      add: "can_create",
      create: "can_create",
      edit: "can_edit",
      delete: "can_delete",
      approve: "can_approve",
      reject: "can_approve",
      verify: "can_verify",
      rejectGroup: "can_verify",
      verifyGroup: "can_verify",
      releaseResources: "can_release_resources",
      partialPayment: "can_release_resources",
      markPaid: "can_release_resources",
      export: "can_export",
      status: "can_edit",
      moveChurch: "can_edit",
      followup: "can_edit",
      updateReport: "can_edit"
    };
    if (action === "sendToInventory") return Boolean(access.can_approve || access.can_verify || access.can_edit);
    if (action === "markClass" || action === "score") return Boolean(access.can_edit || access.can_approve);
    const key = map[action] || "can_view";
    return Boolean(access[key]);
  }

  function getUserScope(user, module = "dashboard") {
    const access = resolveModuleAccess(user, module);
    if (access.scope) return access.scope;
    if ((user?.department_permissions || []).includes("*")) return "all";
    if (user?.can_view_all_churches) return "national";
    if (user?.assigned_department || user?.department_ids?.length) return "department";
    return "church";
  }

  function recordMatchesScope(record, user, module = "dashboard") {
    const scope = getUserScope(user, module);
    if (!record || !user) return false;
    if (["all", "national"].includes(scope)) return true;
    if (scope === "own") {
      const staffName = user.assigned_staff_name || user.name;
      return record.user_id === user.id ||
        record.requested_by_user_id === user.id ||
        record.created_by_user_id === user.id ||
        record.created_by === user.name ||
        record.requested_by_name === user.name ||
        record.assigned_to === user.name ||
        record.full_name === staffName ||
        record.nome_completo === staffName;
    }
    if (scope === "department") {
      const deptIds = new Set(user.department_ids || []);
      const deptNames = new Set([...(user.department_names || []), user.assigned_department].filter(Boolean).map((v) => String(v).toLowerCase()));
      const recordDeptId = record.department_id || record.recipient_department_id || record.departamento_id;
      const recordDeptName = String(record.department_name || record.departamento || record.department || record.departamento_responsavel || "").toLowerCase();
      return (recordDeptId && deptIds.has(recordDeptId)) || (recordDeptName && deptNames.has(recordDeptName));
    }
    return !record.church_id || record.church_id === user.church_id || record.igreja_id === user.church_id || record.recipient_church_id === user.church_id;
  }

  function filterDataByScope(data, user, module = "dashboard") {
    if (!Array.isArray(data)) return [];
    return data.filter((record) => recordMatchesScope(record, user, module));
  }

  function isSensitiveModule(module) {
    return SENSITIVE_MODULES.has(module);
  }

  function getNavItemState(user, route) {
    const module = routeToModule(route);
    const access = resolveModuleAccess(user, module);
    const sensitive = isSensitiveModule(module);

    if (access.can_view) {
      return { route, module, visible: true, locked: false, access, sensitive };
    }

    if (SHOW_LOCKED_MODULES && (!sensitive || user.role === "Super Admin" || user.role === "Main Pastor")) {
      return { route, module, visible: true, locked: true, access, sensitive };
    }

    if (SHOW_LOCKED_MODULES && !sensitive) {
      return { route, module, visible: true, locked: true, access, sensitive };
    }

    return { route, module, visible: false, locked: true, access, sensitive };
  }

  function getVisibleSidebarItems(user, routes = []) {
    return routes
      .map((route) => getNavItemState(user, Array.isArray(route) ? route[0] : route))
      .filter((item) => item.visible);
  }

  function getVisibleTabs(user, module, tabs = []) {
    return tabs.map((tab) => {
      const key = Array.isArray(tab) ? tab[0] : tab;
      const allowed = canAccessTab(user, module, key);
      const sensitive = isSensitiveModule(module);
      return {
        key,
        tab,
        visible: allowed || SHOW_LOCKED_MODULES || !sensitive,
        locked: !allowed
      };
    }).filter((tab) => tab.visible);
  }

  function canViewSalary(user) {
    if ((user?.department_permissions || []).includes("*")) return true;
    const access = resolveModuleAccess(user, "staffHr");
    if (access.can_view_salary) return true;
    return ["Super Admin", "Main Pastor", "HR Manager"].includes(user?.role);
  }

  function canViewStaffBirthday(user) {
    if ((user?.department_permissions || []).includes("*")) return true;
    return ["Super Admin", "Main Pastor", "HR Manager", "Department Head", "Church Pastor"].includes(user?.role);
  }

  function canViewSensitiveStaffData(user) {
    return canViewSalary(user);
  }

  window.CEAccessControl = {
    SHOW_LOCKED_MODULES,
    SENSITIVE_MODULES,
    ROUTE_MODULE_MAP,
    ALL_MODULES,
    ROLE_TEMPLATES,
    routeToModule,
    resolveModuleAccess,
    canViewModule,
    canAccessTab,
    canPerformAction,
    getUserScope,
    filterDataByScope,
    recordMatchesScope,
    canViewRoute,
    getNavItemState,
    getVisibleSidebarItems,
    getVisibleTabs,
    canViewSalary,
    canViewStaffBirthday,
    canViewSensitiveStaffData,
    isSensitiveModule
  };
})();
