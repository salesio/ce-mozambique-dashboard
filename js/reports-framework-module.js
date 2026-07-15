/**
 * Reports framework — shared filters, panels, RBAC, domain registry.
 */
(function () {
  "use strict";

  const adapters = {};
  const ALL_DOMAIN_IDS = [
    "funnel", "foundation", "financeExpenses", "reqInventory", "staff",
    "cell", "fevo", "venue", "sacraments", "prison", "materials"
  ];
  const ROLE_DOMAIN_WHITELIST = {
    "Super Admin": ALL_DOMAIN_IDS,
    "Main Pastor": ALL_DOMAIN_IDS,
    "National Admin": ALL_DOMAIN_IDS,
    "Finance Head": ["financeExpenses", "reqInventory", "venue"],
    "HR Manager": ["staff"],
    "Requisition Officer": ["reqInventory"]
  };
  const DEFAULT_FILTERS = {
    period: "month", dateFrom: "", dateTo: "", churchId: "", department: "",
    status: "", card_filter: "", search: ""
  };

  function accessApi() {
    return window.CEAccessControl || null;
  }

  function roleAllowsDomain(user, domainId) {
    const whitelist = ROLE_DOMAIN_WHITELIST[user?.role || ""];
    if (!whitelist) return null;
    return whitelist.includes(domainId);
  }

  function canViewDomain(user, domainId) {
    const roleAllowed = roleAllowsDomain(user, domainId);
    if (roleAllowed === false) return false;
    const adapter = adapters[domainId];
    if (!adapter) return false;
    const moduleOk = adapter.canView ? adapter.canView(user) : Boolean(
      accessApi()?.resolveModuleAccess?.(user, adapter.accessModule || "reports")?.can_view
    );
    if (!moduleOk) return false;
    if (roleAllowed === true) return true;
    const reportsAccess = accessApi()?.resolveModuleAccess?.(user, "reports");
    return Boolean(reportsAccess?.can_view);
  }

  function canExportDomain(user, domainId) {
    const adapter = adapters[domainId];
    if (adapter?.canExport) return adapter.canExport(user);
    const access = accessApi()?.resolveModuleAccess?.(user, adapter?.accessModule || "reports");
    return Boolean(access?.can_export);
  }

  function registerAdapter(adapter) {
    if (!adapter?.id) return;
    adapters[adapter.id] = adapter;
  }

  function getAdapter(id) {
    return adapters[id] || null;
  }

  function listDomains() {
    return Object.values(adapters);
  }

  function applyPeriodFilter(list, filters, dateField = "created_at") {
    if (!filters.period || typeof getFinancePeriodRange !== "function") return list;
    const range = getFinancePeriodRange(filters.period, filters.dateFrom, filters.dateTo);
    if (!range.from) return list;
    return list.filter((r) => {
      const d = String(r[dateField] || r.date || r.data || "").slice(0, 10);
      return d >= range.from && d <= range.to;
    });
  }

  function applyCommonFilters(list, filters = {}, fieldMap = {}) {
    let out = [...list];
    const churchKey = fieldMap.churchId || "church_id";
    const deptKey = fieldMap.department || "department_name";
    const statusKey = fieldMap.status || "status";
    if (filters.churchId) out = out.filter((r) => r[churchKey] === filters.churchId);
    if (filters.department) out = out.filter((r) => r[deptKey] === filters.department);
    if (filters.status) out = out.filter((r) => r[statusKey] === filters.status);
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      out = out.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
    }
    if (filters.card_filter && typeof filters._cardFilterFn === "function") {
      out = filters._cardFilterFn(out, filters.card_filter);
    }
    return out;
  }

  function groupSum(list, keyField, valueField) {
    const map = {};
    list.forEach((r) => {
      const key = r[keyField] || "—";
      map[key] = (map[key] || 0) + Number(r[valueField] || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  function groupCount(list, keyField) {
    const map = {};
    list.forEach((r) => {
      const key = r[keyField] || "—";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  function deriveDepartments(list = [], fieldMap = {}) {
    const key = fieldMap.department || "department_name";
    return [...new Set(list.map((r) => r[key] || r.department_name || r.departamento_responsavel).filter(Boolean))].sort();
  }

  function deriveStatuses(list = [], fieldMap = {}) {
    const key = fieldMap.status || "status";
    return [...new Set(list.map((r) => r[key] || r.status || r.estado || r.funnel_stage).filter(Boolean))].sort();
  }

  function buildFilterBar(filters, labelFn, options = {}) {
    const departments = options.departments || [];
    const statuses = options.statuses || [];
    const churches = options.churches || [];
    const domain = options.domain || "";
    const periodOpts = [
      ["today", labelFn("financePeriodToday")],
      ["week", labelFn("financePeriodWeek")],
      ["month", labelFn("financePeriodMonth")],
      ["quarter", labelFn("financePeriodQuarter")],
      ["year", labelFn("financePeriodYear")],
      ["custom", labelFn("financePeriodCustom")]
    ];
    const customDates = filters.period === "custom" ? `
      <div class="col-md-2"><label class="form-label">${labelFn("dateFrom")}</label>
        <input type="date" name="dateFrom" class="form-control" value="${filters.dateFrom || ""}"></div>
      <div class="col-md-2"><label class="form-label">${labelFn("dateTo")}</label>
        <input type="date" name="dateTo" class="form-control" value="${filters.dateTo || ""}"></div>` : "";
    return `<form class="row g-3 domain-report-filters mb-4" data-domain-report-filters data-report-domain="${domain}">
      <input type="hidden" name="domain" value="${domain}">
      <div class="col-md-2"><label class="form-label">${labelFn("financePeriodMonth")}</label>
        <select name="period" class="form-select">${periodOpts.map(([v, l]) => `<option value="${v}" ${filters.period === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      ${customDates}
      <div class="col-md-2"><label class="form-label">${labelFn("church")}</label>
        <select name="churchId" class="form-select"><option value="">${labelFn("all")}</option>${churches.map((c) => `<option value="${c.id}" ${filters.churchId === c.id ? "selected" : ""}>${c.church_name}</option>`).join("")}</select></div>
      <div class="col-md-2"><label class="form-label">${labelFn("reqDepartment")}</label>
        <select name="department" class="form-select"><option value="">${labelFn("all")}</option>${departments.map((d) => `<option value="${d}" ${filters.department === d ? "selected" : ""}>${d}</option>`).join("")}</select></div>
      <div class="col-md-2"><label class="form-label">${labelFn("status")}</label>
        <select name="status" class="form-select"><option value="">${labelFn("all")}</option>${statuses.map((s) => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
      <div class="col-md-2"><label class="form-label">${labelFn("search")}</label><input name="search" class="form-control" value="${filters.search || ""}" placeholder="${labelFn("search")}"></div>
      <div class="col-md-4 d-flex align-items-end gap-2 flex-wrap">
        <button type="submit" class="btn btn-ce-gold"><i class="bi bi-search me-1"></i>${labelFn("search")}</button>
        <button type="button" class="btn btn-outline-glass" data-domain-report-clear data-report-domain="${domain}">${labelFn("clearFilters")}</button>
      </div>
    </form>`;
  }

  function buildSummaryCards(cards, module, targetTab, smFn) {
    if (!smFn || !cards.length) return "";
    return `<div class="row g-3 summary-cards-row domain-report-cards mb-4">${cards.map((c) =>
      smFn(c.icon, c.label, c.value, module, { targetTab, filterPayload: c.filter || {} })
    ).join("")}</div>`;
  }

  function buildCharts(charts, labelFn) {
    const rows = charts.map((ch) => {
      let html = "";
      const data = ch.data || [];
      if (ch.type === "bar" && typeof financeSemanticBarChart === "function") {
        html = financeSemanticBarChart(ch.title, data, ch.tone || "cyan", labelFn("financeNoChartData"));
      } else if (ch.type === "donut" && typeof financeDonutChart === "function") {
        html = financeDonutChart(ch.title, data, labelFn("financeNoChartData"));
      } else if (ch.type === "hbar" && typeof financeHBarChart === "function") {
        html = financeHBarChart(ch.title, data, labelFn("financeNoChartData"));
      } else if (ch.type === "line" && typeof financeLineChart === "function") {
        html = financeLineChart(ch.title, data, labelFn("financeNoChartData"));
      } else if (typeof chartCard === "function") {
        html = chartCard(ch.title, data);
      }
      return `<div class="col-xl-${ch.col || 6}">${html}</div>`;
    }).join("");
    return `<div class="row g-4 mb-4">${rows}</div>`;
  }

  function buildTables(tables, dataTableFn, labelFn) {
    if (!dataTableFn) return "";
    return tables.map((t) => `
      <article class="panel glass-panel mb-4">
        <div class="panel-head"><h3 class="panel-title">${t.title}</h3></div>
        ${dataTableFn(t.headers, t.rows)}
      </article>`).join("");
  }

  function getContext(adapter, state, user, filters) {
    const raw = adapter.getList(state, user) || [];
    const list = adapter.filterRecords ? adapter.filterRecords(raw, filters, state, user) : applyCommonFilters(raw, filters);
    const stats = adapter.computeStats ? adapter.computeStats(list, state, user) : { total: list.length };
    return { list, stats };
  }

  function renderPanel(adapter, options = {}) {
    const { state, user, filters = {}, module = "reports", targetTab = "reports", compact = false, showTitle = true } = options;
    const labelFn = options.labelFn || ((k) => k);
    const smFn = options.smFn;
    const dataTableFn = options.dataTableFn;
    if (!canViewDomain(user, adapter.id)) {
      return `<div class="finance-privacy-banner"><i class="bi bi-shield-lock"></i><span>${labelFn("accessDeniedText")}</span></div>`;
    }
    const { list, stats } = getContext(adapter, state, user, filters);
    const churches = options.churches || (state.churches || []);
    const rawList = adapter.getList(state, user) || [];
    const fieldMap = adapter.filterFieldMap || {};
    const filterBar = buildFilterBar(filters, labelFn, {
      formAttr: options.formAttr || "data-domain-report-filters",
      domain: adapter.id,
      churches,
      departments: adapter.getDepartments ? adapter.getDepartments(state, rawList) : deriveDepartments(rawList, fieldMap),
      statuses: adapter.getStatuses ? adapter.getStatuses(state, rawList) : deriveStatuses(rawList, fieldMap)
    });
    const summaryCards = buildSummaryCards(
      adapter.getSummaryCards ? adapter.getSummaryCards(stats, labelFn, options.moneyFn) : [],
      module, targetTab, smFn
    );
    const charts = adapter.getCharts ? adapter.getCharts(list, stats, labelFn, options) : [];
    const chartsHtml = buildCharts(charts, labelFn);
    const tables = adapter.getTables ? adapter.getTables(list, stats, labelFn, options) : [];
    const tablesHtml = buildTables(tables, dataTableFn, labelFn);
    const exportBtns = canExportDomain(user, adapter.id) ? `
      <div class="domain-report-export d-flex flex-wrap gap-2 mb-4">
        <button type="button" class="btn btn-outline-glass" data-domain-report-export="csv" data-report-domain="${adapter.id}"><i class="bi bi-filetype-csv me-1"></i>${labelFn("reqExportCsv")}</button>
        <button type="button" class="btn btn-ce-gold" data-domain-report-export="excel" data-report-domain="${adapter.id}"><i class="bi bi-file-earmark-excel me-1"></i>${labelFn("reqExportExcel")}</button>
        <button type="button" class="btn btn-outline-cyan" data-domain-report-export="print" data-report-domain="${adapter.id}"><i class="bi bi-printer me-1"></i>${labelFn("reqPrintReport")}</button>
        <button type="button" class="btn btn-outline-glass" data-domain-report-export="pdf" data-report-domain="${adapter.id}"><i class="bi bi-file-earmark-pdf me-1"></i>${labelFn("reqExportPdf")}</button>
      </div>` : "";

    if (compact) return chartsHtml;

    const title = adapter.titleKey ? labelFn(adapter.titleKey) : adapter.id;
    const hint = adapter.hintKey ? labelFn(adapter.hintKey) : "";
    return `
      <div class="domain-reports-panel" data-report-domain="${adapter.id}" data-report-count="${list.length}">
        ${showTitle ? `<div class="mb-3"><h3 class="panel-title"><i class="bi bi-graph-up-arrow me-2"></i>${title}</h3>${hint ? `<p class="text-secondary mb-0">${hint}</p>` : ""}</div>` : ""}
        ${filterBar}
        ${summaryCards}
        ${exportBtns}
        ${chartsHtml}
        ${tablesHtml}
      </div>`;
  }

  function computeExecutiveKpis(state, user) {
    const kpis = [];
    Object.values(adapters).forEach((adapter) => {
      if (!adapter.executive || !canViewDomain(user, adapter.id)) return;
      const { stats } = getContext(adapter, state, user, { period: "month" });
      kpis.push({ domain: adapter.id, titleKey: adapter.titleKey, stats, cards: adapter.getExecutiveCards ? adapter.getExecutiveCards(stats) : [] });
    });
    return kpis;
  }

  window.CEReportsFramework = {
    DEFAULT_FILTERS,
    registerAdapter,
    getAdapter,
    listDomains,
    canViewDomain,
    canExportDomain,
    applyPeriodFilter,
    applyCommonFilters,
    groupSum,
    groupCount,
    getContext,
    renderPanel,
    computeExecutiveKpis,
    buildFilterBar,
    deriveDepartments,
    deriveStatuses,
    ROLE_DOMAIN_WHITELIST,
    buildPrintHtml: (opts) => window.CEReportsExport?.buildPrintHtml?.(opts)
  };
})();
