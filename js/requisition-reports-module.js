/**
 * Requisition reports — analytics, filters, groupings (frontend-first).
 */
(function () {
  "use strict";

  const FINANCE_STATUS = {
    AWAITING: "Aguardando Liberação",
    RELEASED: "Recursos Liberados",
    PAID: "Pago",
    PARTIAL: "Parcialmente Pago",
    CANCELLED: "Cancelado"
  };

  const FULL_REPORT_ROLES = new Set(["Super Admin", "Main Pastor", "Finance Head", "National Admin"]);

  function accessApi() {
    return window.CEAccessControl || null;
  }

  function normalizeRecord(record) {
    if (!record) return record;
    const approved = Number(record.approved_amount || record.estimated_amount || 0);
    const released = Number(record.released_amount || record.amount_released || 0);
    const pending = Math.max(0, approved - released);
    let financeStatus = record.finance_status || "";
    if (!financeStatus && approved > 0) {
      if (released <= 0) financeStatus = FINANCE_STATUS.AWAITING;
      else if (released < approved) financeStatus = FINANCE_STATUS.PARTIAL;
      else financeStatus = FINANCE_STATUS.RELEASED;
    }
    return {
      ...record,
      approved_amount: approved,
      released_amount: released,
      pending_amount: pending,
      finance_status: financeStatus
    };
  }

  function canViewFullReports(user) {
    return FULL_REPORT_ROLES.has(user?.role || "");
  }

  function canViewReports(user) {
    if (canViewFullReports(user)) return true;
    const role = user?.role || "";
    if (["Church Pastor", "Department Head", "Requisition Officer", "Finance Officer", "HR Manager"].includes(role)) return true;
    const access = accessApi()?.resolveModuleAccess?.(user, "requisitions");
    return Boolean(access?.can_view);
  }

  function canExportReports(user) {
    const role = user?.role || "";
    return canViewFullReports(user) || role === "Finance Officer" || role === "Church Pastor";
  }

  function getFinanceApprovedList(state, user) {
    const disb = window.CEFinanceDisbursements;
    if (disb?.getApprovedRequisitions) {
      return disb.getApprovedRequisitions(state, user).map(normalizeRecord);
    }
    const lib = window.CERequisitions;
    const list = state.requisitions || [];
    if (!lib) return list.map(normalizeRecord);
    const access = lib.resolveAccess(user);
    return lib.scopeFilter(list, user, access)
      .filter((r) => disb?.isApprovedForFinance?.(r) || /Aprovado|Recursos Liberados|Comprado|Fechado/.test(r.status || ""))
      .map(normalizeRecord);
  }

  function getWorkflowList(state, user) {
    const lib = window.CERequisitions;
    const list = state.requisitions || [];
    if (!lib) return list.map(normalizeRecord);
    const access = lib.resolveAccess(user);
    return lib.scopeFilter(list, user, access).map(normalizeRecord);
  }

  function filterRecords(list, filters = {}) {
    let out = [...list];
    const disb = window.CEFinanceDisbursements;
    if (disb?.filterList && filters.mode !== "workflow") {
      out = disb.filterList(out, filters);
    }
    if (filters.period && typeof getFinancePeriodRange === "function") {
      const range = getFinancePeriodRange(filters.period, filters.dateFrom, filters.dateTo);
      if (range.from) {
        out = out.filter((r) => {
          const d = (r.approved_at || r.created_at || "").slice(0, 10);
          return d >= range.from && d <= range.to;
        });
      }
    }
    if (filters.requisition_type) out = out.filter((r) => r.requisition_type === filters.requisition_type);
    if (filters.requisition_status || filters.status) {
      const st = filters.requisition_status || filters.status;
      out = out.filter((r) => r.status === st);
    }
    if (filters.approved_by) {
      const q = String(filters.approved_by).toLowerCase();
      out = out.filter((r) => String(r.approved_by || "").toLowerCase().includes(q));
    }
    if (filters.released_by) {
      const q = String(filters.released_by).toLowerCase();
      out = out.filter((r) => String(r.released_by || r.resources_released_by || "").toLowerCase().includes(q));
    }
    if (filters.card_filter === "approved") {
      out = out.filter((r) => Number(r.approved_amount || 0) > 0 && r.approved_by);
    }
    if (filters.card_filter === "awaiting") {
      out = out.filter((r) => (r.finance_status || FINANCE_STATUS.AWAITING) === FINANCE_STATUS.AWAITING);
    }
    if (filters.card_filter === "released") {
      out = out.filter((r) => [FINANCE_STATUS.RELEASED, FINANCE_STATUS.PAID].includes(r.finance_status));
    }
    if (filters.card_filter === "partial") {
      out = out.filter((r) => r.finance_status === FINANCE_STATUS.PARTIAL);
    }
    return out;
  }

  function computeReportStats(list) {
    const approvedTotal = list.reduce((s, r) => s + Number(r.approved_amount || 0), 0);
    const releasedTotal = list.reduce((s, r) => s + Number(r.released_amount || 0), 0);
    const pendingTotal = list.reduce((s, r) => s + Number(r.pending_amount || 0), 0);
    const awaiting = list.filter((r) => r.finance_status === FINANCE_STATUS.AWAITING).length;
    const released = list.filter((r) => [FINANCE_STATUS.RELEASED, FINANCE_STATUS.PAID].includes(r.finance_status)).length;
    const partial = list.filter((r) => r.finance_status === FINANCE_STATUS.PARTIAL).length;
    const approvedCount = list.filter((r) => r.approved_by).length;
    const avg = list.length ? approvedTotal / list.length : 0;
    return {
      total: list.length,
      approvedCount,
      awaiting,
      released,
      partial,
      approvedTotal,
      releasedTotal,
      pendingTotal,
      avg
    };
  }

  function computeWorkflowStats(list) {
    const counts = {};
    list.forEach((r) => {
      const key = r.status || "Outro";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }

  function groupSum(list, keyField, valueField) {
    const map = {};
    list.forEach((r) => {
      const key = r[keyField] || "—";
      map[key] = (map[key] || 0) + Number(r[valueField] || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  function chartByFinanceStatus(list, labelFn) {
    const map = {};
    Object.values(FINANCE_STATUS).forEach((s) => { map[s] = 0; });
    list.forEach((r) => {
      const s = r.finance_status || FINANCE_STATUS.AWAITING;
      map[s] = (map[s] || 0) + 1;
    });
    const labels = {
      "Aguardando Liberação": "finAwaitingRelease",
      "Recursos Liberados": "finResourcesReleased",
      "Pago": "finMarkPaid",
      "Parcialmente Pago": "finPartialPayment",
      "Cancelado": "rejected"
    };
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([status, count]) => [labelFn(labels[status] || status), count]);
  }

  function chartApprovedVsReleased(stats, labelFn) {
    return [
      [labelFn("finApprovedAmount"), stats.approvedTotal],
      [labelFn("finReleasedAmount"), stats.releasedTotal],
      [labelFn("reqPendingAmount"), stats.pendingTotal]
    ];
  }

  function chartMonthly(list) {
    const map = {};
    list.forEach((r) => {
      const d = (r.approved_at || r.created_at || "").slice(0, 7);
      if (!d) return;
      if (!map[d]) map[d] = { approved: 0, released: 0 };
      map[d].approved += Number(r.approved_amount || 0);
      map[d].released += Number(r.released_amount || 0);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, v]) => [month, v.approved + v.released]);
  }

  function chartMonthlyDual(list) {
    const map = {};
    list.forEach((r) => {
      const d = (r.approved_at || r.created_at || "").slice(0, 7);
      if (!d) return;
      if (!map[d]) map[d] = { approved: 0, released: 0 };
      map[d].approved += Number(r.approved_amount || 0);
      map[d].released += Number(r.released_amount || 0);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function groupByDepartment(list) {
    const map = {};
    list.forEach((r) => {
      const key = r.department_name || "—";
      if (!map[key]) {
        map[key] = {
          department: key,
          count: 0,
          approvedTotal: 0,
          releasedTotal: 0,
          pendingTotal: 0,
          partialCount: 0,
          maxReq: null,
          lastApproved: ""
        };
      }
      const g = map[key];
      g.count += 1;
      g.approvedTotal += Number(r.approved_amount || 0);
      g.releasedTotal += Number(r.released_amount || 0);
      g.pendingTotal += Number(r.pending_amount || 0);
      if (r.finance_status === FINANCE_STATUS.PARTIAL) g.partialCount += 1;
      if (!g.maxReq || Number(r.approved_amount || 0) > Number(g.maxReq.approved_amount || 0)) g.maxReq = r;
      const at = r.approved_at || "";
      if (at > g.lastApproved) g.lastApproved = at;
    });
    return Object.values(map).sort((a, b) => b.approvedTotal - a.approvedTotal);
  }

  function groupByChurch(list) {
    const map = {};
    list.forEach((r) => {
      const key = r.church_name || r.church_id || "—";
      if (!map[key]) {
        map[key] = {
          church: key,
          church_id: r.church_id,
          count: 0,
          approvedTotal: 0,
          releasedTotal: 0,
          pendingTotal: 0,
          awaiting: 0,
          completed: 0
        };
      }
      const g = map[key];
      g.count += 1;
      g.approvedTotal += Number(r.approved_amount || 0);
      g.releasedTotal += Number(r.released_amount || 0);
      g.pendingTotal += Number(r.pending_amount || 0);
      if (r.finance_status === FINANCE_STATUS.AWAITING) g.awaiting += 1;
      if ([FINANCE_STATUS.RELEASED, FINANCE_STATUS.PAID].includes(r.finance_status)) g.completed += 1;
    });
    return Object.values(map).sort((a, b) => b.approvedTotal - a.approvedTotal);
  }

  function groupByRequester(list) {
    const map = {};
    list.forEach((r) => {
      const key = r.requested_by_name || "—";
      if (!map[key]) {
        map[key] = {
          name: key,
          department: r.department_name,
          church: r.church_name,
          count: 0,
          approvedTotal: 0,
          releasedTotal: 0,
          statuses: {},
          lastReq: null,
          lastAt: ""
        };
      }
      const g = map[key];
      g.count += 1;
      g.approvedTotal += Number(r.approved_amount || 0);
      g.releasedTotal += Number(r.released_amount || 0);
      const fs = r.finance_status || r.status || "—";
      g.statuses[fs] = (g.statuses[fs] || 0) + 1;
      const at = r.approved_at || r.created_at || "";
      if (at > g.lastAt) {
        g.lastAt = at;
        g.lastReq = r;
      }
    });
    return Object.values(map).map((g) => {
      const predominant = Object.entries(g.statuses).sort((a, b) => b[1] - a[1])[0];
      return { ...g, predominantStatus: predominant ? predominant[0] : "—" };
    }).sort((a, b) => b.approvedTotal - a.approvedTotal);
  }

  function exportCsv(list, headers, rowFn) {
    const rows = [headers.join(",")];
    list.forEach((r) => rows.push(rowFn(r).map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requisition-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  window.CERequisitionReports = {
    FINANCE_STATUS,
    normalizeRecord,
    canViewReports,
    canViewFullReports,
    canExportReports,
    getFinanceApprovedList,
    getWorkflowList,
    filterRecords,
    computeReportStats,
    computeWorkflowStats,
    groupSum,
    chartByFinanceStatus,
    chartApprovedVsReleased,
    chartMonthly,
    chartMonthlyDual,
    groupByDepartment,
    groupByChurch,
    groupByRequester,
    exportCsv
  };
})();