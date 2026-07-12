/**
 * Global Summary Card navigation — tab switching, filters, modals.
 */
(function () {
  "use strict";

  function t(key, fallback) {
    return typeof L === "function" ? L(key) : fallback;
  }

  function safeJsonParse(value, fallback = {}) {
    if (!value) return fallback;
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }
  }

  function buildOptions(module, config = {}) {
    const hasAction = Boolean(
      config.targetTab || config.route || config.modalType || config.scrollTo ||
      (config.filterPayload && Object.keys(config.filterPayload).length)
    );
    const isClickable = config.isClickable !== false && config.disabled !== true && hasAction;
    const label = config.label || "";
    return {
      isClickable,
      clickable: isClickable,
      disabled: Boolean(config.disabled),
      module: module || "",
      targetTab: config.targetTab || "",
      route: config.route || "",
      modalType: config.modalType || "",
      scrollTo: config.scrollTo || "",
      filterPayload: config.filterPayload || null,
      tooltip: config.tooltip || label,
      ariaLabel: config.ariaLabel || label,
      hint: config.hint ?? (isClickable ? t("clickToView", "Click to view") : "")
    };
  }

  function getFilterStore(module) {
    const stores = {
      staffHr: () => window.staffHrPageState,
      finance: () => window.financePageState,
      churches: () => window.churchPageState,
      foundation: () => window.foundationPageState,
      firstTimers: () => window.firstTimersPageState,
      followUp: () => window.followUpPageState,
      fevo: () => window.fevoPageState,
      requisitions: () => window.requisitionsPageState,
      venue: () => window.venuePageState,
      sacraments: () => window.sacramentsPageState
    };
    return stores[module]?.() || null;
  }

  function clearModuleFilters(module) {
    const store = getFilterStore(module);
    if (!store) return;
    if (module === "staffHr") {
      store.cardFilters = { staff: {}, salaries: {}, performance: {}, equipment: {} };
      store.birthdayFilters = { month: "", churchId: "", department: "", status: "", search: "" };
      return;
    }
    if (module === "finance") {
      Object.keys(store.reportFilters || {}).forEach((key) => { store.reportFilters[key] = ""; });
      Object.keys(store.approvedReqFilters || {}).forEach((key) => { store.approvedReqFilters[key] = ""; });
      store.approvedReqFilters.period = "month";
      store.sourceFilter = "";
      return;
    }
    if (module === "churches") {
      store.filters = { search: "", province: "", city: "", type: "", status: "", information_status: "" };
      return;
    }
    if (module === "foundation") {
      store.panel = "";
      store.filter = {};
      return;
    }
    if (module === "firstTimers" || module === "followUp") {
      store.filter = {};
      return;
    }
    if (module === "fevo") {
      store.filter = {};
      return;
    }
    if (module === "requisitions") {
      store.cardFilter = {};
      return;
    }
    if (module === "venue") {
      store.filter = {};
      return;
    }
    if (module === "sacraments") {
      store.panel = "";
      store.filter = {};
    }
  }

  function formatFilterChip(module, key, value) {
    const labels = {
      status: t("status", "Status"),
      employment_type: t("staffEmploymentType", "Employment Type"),
      payment_status: t("status", "Status"),
      has_salary: t("staffWithSalary", "Salary"),
      pending_eval: t("staffPendingEval", "Pending Evaluations"),
      assigned: t("staffAssignedEq", "Assigned Equipment"),
      birthday_month: t("staffFilterBirthdayMonth", "Birthday Month"),
      upcoming: t("staffUpcomingBirthdays", "Upcoming"),
      period: t("thisMonth", "This month"),
      date: t("date", "Date"),
      source: t("sourceType", "Source"),
      information_status: t("informationStatus", "Information Status"),
      type: t("Type", "Type"),
      province: t("Province", "Province"),
      graduated: t("graduations", "Graduated"),
      certificate_issued: t("certificates", "Certificates"),
      followup: t("followupState", "Follow-up"),
      quer_escola_de_fundacao: t("wantFoundation", "Foundation School"),
      estado: t("estado", "Status"),
      estado_do_seguimento: t("followupState", "Follow-up"),
      souls_contacted: t("soulsContacted", "Souls Contacted"),
      estado_filter: t("estado", "Status"),
      inventory_status: t("status", "Status"),
      pending_value: t("reqPendingValue", "Pending Value")
    };
    const label = labels[key] || key.replaceAll("_", " ");
    if (value === true) return `${label}`;
    return `${label} = ${value}`;
  }

  function collectActiveFilters(module) {
    const store = getFilterStore(module);
    if (!store) return [];
    const chips = [];
    if (module === "staffHr") {
      Object.entries(store.cardFilters?.staff || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
      Object.entries(store.cardFilters?.salaries || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
      Object.entries(store.cardFilters?.performance || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
      Object.entries(store.cardFilters?.equipment || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
      Object.entries(store.birthdayFilters || {}).forEach(([k, v]) => { if (v && k !== "search") chips.push([k === "month" ? "birthday_month" : k, v]); });
      if (store.birthdayFilters?.search) chips.push(["search", store.birthdayFilters.search]);
      if (store.birthdayFilters?.upcoming) chips.push(["upcoming", true]);
    } else if (module === "finance") {
      Object.entries(store.reportFilters || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
      if (store.sourceFilter) chips.push(["source", store.sourceFilter]);
    } else if (module === "churches") {
      Object.entries(store.filters || {}).forEach(([k, v]) => { if (v) chips.push([k, v]); });
    } else if (module === "foundation" || module === "firstTimers" || module === "followUp" || module === "fevo" || module === "venue" || module === "sacraments") {
      Object.entries(store.filter || {}).forEach(([k, v]) => { if (v !== "" && v != null) chips.push([k, v]); });
    } else if (module === "requisitions" && store.cardFilter) {
      Object.entries(store.cardFilter).forEach(([k, v]) => { if (v) chips.push([k, v]); });
    }
    return chips;
  }

  function renderFilterChips(module) {
    const chips = collectActiveFilters(module);
    if (!chips.length || typeof L !== "function") return "";
    return `
      <div class="summary-filter-chips light-surface" role="status" aria-live="polite">
        <span class="summary-filter-chips-label">${L("appliedFilter")}:</span>
        ${chips.map(([key, value]) => `<span class="summary-filter-chip">${formatFilterChip(module, key, value)}</span>`).join("")}
        <button type="button" class="btn btn-sm btn-outline-cyan summary-filter-clear" data-summary-clear-filters="${module}">${L("clearFilters")}</button>
      </div>`;
  }

  function scrollToPanel(id) {
    if (!id) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(id) || document.querySelector(`[id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function rerenderModule(module, route) {
    const targetRoute = route || {
      staffHr: "staffHr",
      finance: "finance",
      churches: "churches",
      foundation: "foundationSchool",
      firstTimers: "firstTimers",
      followUp: "followUp",
      fevo: "fevo",
      requisitions: "requisitions",
      venue: window.venuePageState?.route || "venueInventory",
      sacraments: "sacraments"
    }[module];
    if (typeof setRoute === "function" && targetRoute) setRoute(targetRoute);
    else if (typeof renderStaffHr === "function" && module === "staffHr") renderStaffHr();
  }

  function applyStaffHr(payload) {
    const store = window.staffHrPageState;
    if (!store) return;
    if (!store.cardFilters) store.cardFilters = { staff: {}, salaries: {}, performance: {}, equipment: {} };
    const filters = payload.filterPayload || {};
    if (payload.targetTab) store.tab = payload.targetTab;
    if (payload.targetTab === "birthdays" || filters.birthday_month || filters.upcoming) {
      if (filters.birthday_month) store.birthdayFilters.month = filters.birthday_month;
      if (filters.upcoming) {
        store.birthdayFilters.month = "";
        store.birthdayFilters.upcoming = true;
      } else {
        delete store.birthdayFilters.upcoming;
      }
    }
    if (payload.targetTab === "staff") store.cardFilters.staff = { ...store.cardFilters.staff, ...filters };
    if (payload.targetTab === "salaries") store.cardFilters.salaries = { ...store.cardFilters.salaries, ...filters };
    if (payload.targetTab === "performance") store.cardFilters.performance = { ...store.cardFilters.performance, ...filters };
    if (payload.targetTab === "equipment") store.cardFilters.equipment = { ...store.cardFilters.equipment, ...filters };
    if (payload.modalType && typeof openStaffBirthdaysModal === "function") {
      openStaffBirthdaysModal(payload.modalType);
      return false;
    }
    return true;
  }

  function applyFinance(payload) {
    const store = window.financePageState;
    if (!store) return;
    const filters = payload.filterPayload || {};
    if (payload.targetTab) store.tab = payload.targetTab;
    if (filters.period) store.reportFilters.period = filters.period;
    if (filters.date) store.reportFilters.dateFrom = filters.date;
    if (filters.date) store.reportFilters.dateTo = filters.date;
    if (filters.status) store.reportFilters.status = filters.status;
    if (filters.source) {
      store.sourceFilter = filters.source;
      store.reportFilters.source = filters.source;
      if (payload.targetTab === "public") store.tab = "public";
    }
    if (payload.targetTab === "approvedRequisitions" || filters.finance_status) {
      store.tab = payload.targetTab || "approvedRequisitions";
      store.approvedReqFilters = store.approvedReqFilters || {};
      if (filters.finance_status) store.approvedReqFilters.finance_status = filters.finance_status;
      if (filters.period) store.approvedReqFilters.period = filters.period;
      Object.assign(store.approvedReqFilters, filters);
    }
    Object.assign(store.reportFilters, filters);
    return true;
  }

  function applyChurches(payload) {
    const store = window.churchPageState;
    if (!store) return;
    Object.assign(store.filters, payload.filterPayload || {});
    return true;
  }

  function applyFoundation(payload) {
    const store = window.foundationPageState;
    if (!store) return;
    if (payload.scrollTo) store.panel = payload.scrollTo;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    if (payload.scrollTo) {
      rerenderModule("foundation");
      scrollToPanel(payload.scrollTo);
      return false;
    }
    return true;
  }

  function applyFirstTimers(payload) {
    const store = window.firstTimersPageState;
    if (!store) return;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    return true;
  }

  function applyFollowUp(payload) {
    const store = window.followUpPageState;
    if (!store) return;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    return true;
  }

  function applyFevo(payload) {
    const store = window.fevoPageState;
    if (!store) return;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    if (payload.route) {
      if (typeof setRoute === "function") setRoute(payload.route);
      return false;
    }
    return true;
  }

  function applyRequisitions(payload) {
    const store = window.requisitionsPageState;
    if (!store) return;
    const filters = payload.filterPayload || {};
    if (payload.targetTab) store.tab = payload.targetTab;
    if (filters.status_group === "pending" && !payload.targetTab) store.tab = "received";
    store.cardFilter = { ...store.cardFilter, ...filters };
    return true;
  }

  function applyVenue(payload) {
    const store = window.venuePageState;
    if (!store) return;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    if (payload.route) {
      store.route = payload.route;
      if (typeof setRoute === "function") setRoute(payload.route);
      return false;
    }
    return true;
  }

  function applySacraments(payload) {
    const store = window.sacramentsPageState;
    if (!store) return;
    if (payload.scrollTo) store.panel = payload.scrollTo;
    store.filter = { ...store.filter, ...(payload.filterPayload || {}) };
    if (payload.scrollTo) {
      rerenderModule("sacraments");
      scrollToPanel(payload.scrollTo);
      return false;
    }
    return true;
  }

  function applyAction(module, payload = {}) {
    const handlers = {
      staffHr: applyStaffHr,
      finance: applyFinance,
      churches: applyChurches,
      foundation: applyFoundation,
      firstTimers: applyFirstTimers,
      followUp: applyFollowUp,
      fevo: applyFevo,
      requisitions: applyRequisitions,
      venue: applyVenue,
      sacraments: applySacraments
    };
    const handler = handlers[module];
    if (!handler) return;
    const shouldRerender = handler(payload);
    if (shouldRerender === false) return;
    if (payload.route && typeof setRoute === "function") {
      setRoute(payload.route);
      return;
    }
    rerenderModule(module, payload.route);
    if (payload.scrollTo) scrollToPanel(payload.scrollTo);
  }

  function handleCardClick(el) {
    if (!el || el.dataset.summaryDisabled === "true") return;
    const module = el.dataset.summaryModule;
    if (!module) return;
    const payload = {
      targetTab: el.dataset.summaryTargetTab || "",
      route: el.dataset.summaryRoute || "",
      modalType: el.dataset.summaryModal || "",
      scrollTo: el.dataset.summaryScroll || "",
      filterPayload: safeJsonParse(el.dataset.summaryFilters)
    };
    applyAction(module, payload);
  }

  function initGlobalHandlers() {
    document.addEventListener("click", (event) => {
      const card = event.target.closest("[data-summary-card]");
      if (card) {
        event.preventDefault();
        handleCardClick(card);
        return;
      }
      const clearBtn = event.target.closest("[data-summary-clear-filters]");
      if (clearBtn) {
        clearModuleFilters(clearBtn.dataset.summaryClearFilters);
        rerenderModule(clearBtn.dataset.summaryClearFilters);
      }
    });
    document.addEventListener("keydown", (event) => {
      const card = event.target.closest("[data-summary-card]");
      if (!card || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      handleCardClick(card);
    });
  }

  window.CESummaryCardNav = {
    buildOptions,
    applyAction,
    clearModuleFilters,
    renderFilterChips,
    collectActiveFilters,
    handleCardClick,
    initGlobalHandlers
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobalHandlers);
  } else {
    initGlobalHandlers();
  }
})();