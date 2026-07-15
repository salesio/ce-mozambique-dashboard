/**
 * Finance disbursements — approved requisitions & resource release (frontend-first).
 */
(function () {
  "use strict";

  const FINANCE_STATUS = {
    AWAITING: "Aguardando Libera��o",
    RELEASED: "Recursos Liberados",
    PAID: "Pago",
    PARTIAL: "Parcialmente Pago",
    CANCELLED: "Cancelado"
  };

  const PAYMENT_METHODS = ["M-Pesa", "E-Mola", "Banco", "Dinheiro", "Cheque", "Outro"];

  const APPROVED_REQ_STATUSES = new Set([
    "Aprovado � Aguardando Libera��o de Recursos",
    "Aprovado",
    "Recursos Liberados",
    "Comprado / Executado",
    "Registado no Inventário",
    "Fechado"
  ]);

  function accessApi() {
    return window.CEAccessControl || null;
  }

  function resolveFinanceRole(user) {
    const role = user?.role || "";
    const perms = user?.department_permissions || [];
    const isSuper = role === "Super Admin" || role === "National Admin" || perms.includes("*");
    const isFinanceHead = isSuper || role === "Finance Head" || perms.includes("financeHead");
    const isFinanceOfficer = isFinanceHead || role === "Finance Officer" || perms.includes("financeOfficer");
    return { isSuper, isFinanceHead, isFinanceOfficer };
  }

  function canViewApprovedRequisitions(user) {
    const { isSuper, isFinanceHead, isFinanceOfficer } = resolveFinanceRole(user);
    if (isSuper || isFinanceHead || isFinanceOfficer) return true;
    const access = accessApi()?.resolveModuleAccess?.(user, "requisitions");
    return access?.can_view && (access?.can_verify || user?.role === "Requisition Officer");
  }

  function canReleaseResources(user) {
    const access = accessApi()?.resolveModuleAccess?.(user, "finance");
    if (typeof access?.can_release_resources === "boolean") return access.can_release_resources;
    const { isSuper, isFinanceHead } = resolveFinanceRole(user);
    return isSuper || isFinanceHead;
  }

  function canMarkPaid(user) {
    return canReleaseResources(user);
  }

  function isApprovedForFinance(record) {
    if (!record) return false;
    return APPROVED_REQ_STATUSES.has(record.status)
      || Boolean(record.finance_status && record.finance_status !== FINANCE_STATUS.CANCELLED);
  }

  function scopeRequisitions(list, user) {
    const lib = window.CERequisitions;
    if (!lib) return list.filter(isApprovedForFinance);
    const access = lib.resolveAccess(user);
    return lib.scopeFilter(list, user, access).filter(isApprovedForFinance);
  }

  function getApprovedRequisitions(state, user) {
    return scopeRequisitions(state.requisitions || [], user);
  }

  function ensureDisbursements(state) {
    state.financeDisbursements = Array.isArray(state.financeDisbursements) ? state.financeDisbursements : [];
    return state.financeDisbursements;
  }

  function buildDisbursement(record, overrides = {}) {
    const approvedAmount = Number(record.approved_amount || record.estimated_amount || 0);
    const releasedAmount = Number(record.released_amount || record.amount_released || 0);
    return {
      id: overrides.id || `disb-${record.id}`,
      requisition_id: record.id,
      request_number: record.request_number,
      title: record.title,
      department_id: record.department_id || "",
      department_name: record.department_name || "",
      church_id: record.church_id || "",
      church_name: record.church_name || "",
      requested_by: record.requested_by_name || "",
      approved_by: record.approved_by || "",
      approved_at: record.approved_at || "",
      approved_amount: approvedAmount,
      released_amount: releasedAmount,
      payment_method: record.payment_method || "",
      payment_reference: record.payment_reference || "",
      released_by: record.released_by || record.resources_released_by || "",
      released_at: record.released_at || record.resources_released_at || "",
      status: record.finance_status || FINANCE_STATUS.AWAITING,
      source: "requisition",
      transaction_type: "expense",
      notes: record.payment_notes || record.approval_notes || "",
      created_at: overrides.created_at || record.sent_to_finance_at || record.approved_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  function syncDisbursement(state, record) {
    if (!isApprovedForFinance(record)) return null;
    const list = ensureDisbursements(state);
    const id = record.finance_disbursement_id || `disb-${record.id}`;
    const existing = list.find((d) => d.id === id);
    const payload = buildDisbursement(record, { id, created_at: existing?.created_at });
    if (existing) {
      Object.assign(existing, payload);
      return existing;
    }
    list.push(payload);
    record.finance_disbursement_id = id;
    return payload;
  }

  function onRequisitionApproved(state, record, user) {
    const now = new Date().toISOString();
    record.finance_status = FINANCE_STATUS.AWAITING;
    record.sent_to_finance_at = now;
    record.sent_to_finance = true;
    if (!record.approved_amount) {
      record.approved_amount = Number(record.estimated_amount || 0) || null;
    }
    const lib = window.CERequisitions;
    lib?.appendAuditLog?.(record, {
      action: "sentToFinance",
      by: user?.name || "Sistema",
      by_user_id: user?.id || "",
      at: now,
      notes: FINANCE_STATUS.AWAITING
    });
    return syncDisbursement(state, record);
  }

  function computeStats(list) {
    const awaiting = list.filter((r) => (r.finance_status || FINANCE_STATUS.AWAITING) === FINANCE_STATUS.AWAITING).length;
    const released = list.filter((r) => r.finance_status === FINANCE_STATUS.RELEASED).length;
    const partial = list.filter((r) => r.finance_status === FINANCE_STATUS.PARTIAL).length;
    const approvedTotal = list.reduce((s, r) => s + Number(r.approved_amount || r.estimated_amount || 0), 0);
    const releasedTotal = list.reduce((s, r) => s + Number(r.released_amount || r.amount_released || 0), 0);
    const pendingTotal = list.reduce((s, r) => {
      const approved = Number(r.approved_amount || r.estimated_amount || 0);
      const released = Number(r.released_amount || r.amount_released || 0);
      return s + Math.max(0, approved - released);
    }, 0);
    const pendingPayments = list.filter((r) =>
      [FINANCE_STATUS.AWAITING, FINANCE_STATUS.PARTIAL].includes(r.finance_status || FINANCE_STATUS.AWAITING)
    ).length;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const releasedThisMonth = list.filter((r) =>
      r.finance_status === FINANCE_STATUS.RELEASED && String(r.released_at || r.resources_released_at || "").startsWith(ym)
    ).length;
    const releasedValueMonth = list
      .filter((r) => String(r.released_at || r.resources_released_at || "").startsWith(ym))
      .reduce((s, r) => s + Number(r.released_amount || r.amount_released || 0), 0);
    return {
      awaiting, released, partial, approvedTotal, releasedTotal, pendingTotal, pendingPayments, releasedThisMonth, releasedValueMonth,
      total: list.length
    };
  }

  function filterList(list, filters = {}) {
    let out = [...list];
    if (filters.finance_status) {
      out = out.filter((r) => (r.finance_status || FINANCE_STATUS.AWAITING) === filters.finance_status);
    }
    if (filters.churchId) out = out.filter((r) => r.church_id === filters.churchId);
    if (filters.department) out = out.filter((r) => r.department_name === filters.department);
    if (filters.urgency) out = out.filter((r) => r.urgency === filters.urgency);
    if (filters.requester) {
      const q = String(filters.requester).toLowerCase();
      out = out.filter((r) => String(r.requested_by_name || "").toLowerCase().includes(q));
    }
    if (filters.minValue) out = out.filter((r) => Number(r.approved_amount || 0) >= Number(filters.minValue));
    if (filters.maxValue) out = out.filter((r) => Number(r.approved_amount || 0) <= Number(filters.maxValue));
    if (filters.period && typeof getFinancePeriodRange === "function") {
      const range = getFinancePeriodRange(filters.period, filters.dateFrom, filters.dateTo);
      if (range.from) {
        out = out.filter((r) => {
          const d = (r.approved_at || "").slice(0, 10);
          return d >= range.from && d <= range.to;
        });
      }
    }
    return out;
  }

  function financeStatusBadgeClass(status) {
    switch (status) {
      case FINANCE_STATUS.AWAITING: return "warn";
      case FINANCE_STATUS.RELEASED:
      case FINANCE_STATUS.PAID: return "good";
      case FINANCE_STATUS.PARTIAL: return "cyan";
      case FINANCE_STATUS.CANCELLED: return "danger";
      default: return "warn";
    }
  }

  function validateRelease(record, payload, user) {
    const approved = Number(record.approved_amount || record.estimated_amount || 0);
    const release = Number(payload.released_amount || payload.amount_released || 0);
    const alreadyReleased = Number(record.released_amount || record.amount_released || 0);
    const totalAfter = alreadyReleased + release;
    const { isSuper } = resolveFinanceRole(user);
    if (release <= 0) return { ok: false, error: "invalid_amount" };
    if (!payload.payment_method) return { ok: false, error: "payment_method_required" };
    if (!payload.released_at && !payload.release_date) return { ok: false, error: "date_required" };
    if (totalAfter > approved && !isSuper) return { ok: false, error: "exceeds_approved" };
    return { ok: true, release, totalAfter, approved };
  }

  function applyRelease(state, user, recordId, payload = {}) {
    const record = (state.requisitions || []).find((r) => r.id === recordId);
    if (!record || !canReleaseResources(user)) return { ok: false };
    const validation = validateRelease(record, payload, user);
    if (!validation.ok) return { ok: false, error: validation.error };

    const now = new Date().toISOString();
    const releaseDate = payload.released_at || payload.release_date || now.slice(0, 10);
    const releaseAmount = validation.release;
    const totalReleased = validation.totalAfter;
    const approved = validation.approved;

    record.released_amount = totalReleased;
    record.amount_released = totalReleased;
    record.released_by = user.name;
    record.resources_released_by = user.name;
    record.released_at = now;
    record.resources_released_at = now;
    record.payment_method = payload.payment_method;
    record.payment_reference = payload.payment_reference || "";
    record.payment_notes = payload.payment_notes || payload.observacoes || "";

    const lib = window.CERequisitions;
    const STATUSES = lib?.STATUSES || {};

    if (totalReleased < approved) {
      record.finance_status = FINANCE_STATUS.PARTIAL;
      lib?.appendAuditLog?.(record, { action: "partialPayment", by: user.name, by_user_id: user.id, at: now, notes: String(releaseAmount) });
    } else {
      record.finance_status = FINANCE_STATUS.RELEASED;
      record.status = STATUSES.RESOURCES_RELEASED || "Recursos Liberados";
      lib?.appendAuditLog?.(record, { action: "resourcesReleased", by: user.name, by_user_id: user.id, at: now, notes: record.payment_notes });
    }

    syncDisbursement(state, record);
    const disb = ensureDisbursements(state).find((d) => d.requisition_id === recordId);
    if (disb) {
      disb.released_amount = totalReleased;
      disb.released_by = user.name;
      disb.released_at = now;
      disb.payment_method = record.payment_method;
      disb.payment_reference = record.payment_reference;
      disb.status = record.finance_status;
      disb.notes = record.payment_notes;
      disb.updated_at = now;
    }

    record.updated_at = now;
    return { ok: true, record };
  }

  function applyMarkPaid(state, user, recordId, payload = {}) {
    const record = (state.requisitions || []).find((r) => r.id === recordId);
    if (!record || !canMarkPaid(user)) return { ok: false };
    const now = new Date().toISOString();
    record.finance_status = FINANCE_STATUS.PAID;
    const lib = window.CERequisitions;
    const STATUSES = lib?.STATUSES || {};
    record.status = STATUSES.PURCHASED || "Comprado / Executado";
    lib?.appendAuditLog?.(record, { action: "paid", by: user.name, by_user_id: user.id, at: now, notes: payload.notes || "" });
    syncDisbursement(state, record);
    record.updated_at = now;
    return { ok: true, record };
  }

  function migrateRequisitionFinanceFields(record) {
    if (!record) return record;
    if (!record.finance_status) {
      if (record.status === "Recursos Liberados" || record.resources_released_at) {
        record.finance_status = FINANCE_STATUS.RELEASED;
      } else if (record.status === "Aprovado � Aguardando Libera��o de Recursos" || record.status === "Aprovado") {
        record.finance_status = FINANCE_STATUS.AWAITING;
      }
    }
    record.released_amount = record.released_amount || record.amount_released || 0;
    record.released_by = record.released_by || record.resources_released_by || "";
    record.released_at = record.released_at || record.resources_released_at || "";
    return record;
  }

  window.CEFinanceDisbursements = {
    FINANCE_STATUS,
    PAYMENT_METHODS,
    canViewApprovedRequisitions,
    canReleaseResources,
    canMarkPaid,
    getApprovedRequisitions,
    computeStats,
    filterList,
    financeStatusBadgeClass,
    syncDisbursement,
    onRequisitionApproved,
    applyRelease,
    applyMarkPaid,
    migrateRequisitionFinanceFields,
    buildDisbursement
  };
})();
