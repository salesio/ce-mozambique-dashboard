/**
 * Requisições & Aprovações — workflow helpers (frontend-first).
 */
(function () {
  "use strict";

  const STATUSES = {
    DRAFT: "Rascunho",
    SUBMITTED: "Submetido",
    UNDER_REVIEW: "Em Revisão",
    SENT_TO_PASTOR: "Enviado ao Pastor Principal",
    RETURNED_FOR_CORRECTION: "Devolvido para Correção",
    APPROVED_AWAITING_RELEASE: "Aprovado — Aguardando Liberação de Recursos",
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado",
    RESOURCES_RELEASED: "Recursos Liberados",
    PURCHASED: "Comprado / Executado",
    REGISTERED: "Registado no Inventário",
    CLOSED: "Fechado"
  };

  const TYPES = [
    "Nova Aquisição", "Reparação", "Material de Ministério", "Transporte",
    "Evento/Programa", "Equipamento", "Pagamento de Serviço", "Apoio Operacional", "Outro"
  ];

  const URGENCY = ["Baixa", "Normal", "Alta", "Urgente"];
  const FINAL_PRIORITIES = ["Normal", "Alta", "Urgente"];

  const TAB_STATUS_MAP = {
    received: [STATUSES.SUBMITTED],
    review: [STATUSES.UNDER_REVIEW, STATUSES.RETURNED_FOR_CORRECTION],
    pastoral: [STATUSES.SENT_TO_PASTOR],
    approved: [
      STATUSES.APPROVED_AWAITING_RELEASE, STATUSES.APPROVED,
      STATUSES.RESOURCES_RELEASED, STATUSES.PURCHASED, STATUSES.REGISTERED
    ],
    rejected: [STATUSES.REJECTED],
    released: [STATUSES.RESOURCES_RELEASED, STATUSES.PURCHASED, STATUSES.REGISTERED],
    history: [STATUSES.CLOSED]
  };

  const INVENTORY_TYPES = new Set(["Nova Aquisição", "Equipamento"]);

  const PASTORAL_DECISION_ROLES = new Set(["Main Pastor", "Super Admin"]);

  function accessApi() {
    return window.CEAccessControl || null;
  }

  function resolveAccess(user) {
    const lib = accessApi();
    return lib?.resolveModuleAccess?.(user, "requisitions") || { can_view: false };
  }

  function canPastoralDecide(user) {
    return PASTORAL_DECISION_ROLES.has(user?.role || "");
  }

  function scopeFilter(list, user, access) {
    if (!Array.isArray(list)) return [];
    const scope = access.scope || "own";
    if (scope === "all") return list;
    if (scope === "church") return list.filter((r) => r.church_id === user.church_id);
    if (scope === "department") {
      const dept = user.assigned_department || user.department_name || "";
      return list.filter((r) => r.department_name === dept || r.church_id === user.church_id);
    }
    return list.filter((r) => r.requested_by_user_id === user.id);
  }

  function filterByTab(list, tab) {
    if (!tab || tab === "overview" || tab === "new") return list;
    const statuses = TAB_STATUS_MAP[tab];
    if (!statuses) return list;
    return list.filter((r) => statuses.includes(r.status));
  }

  function isApprovedStatus(status) {
    return [
      STATUSES.APPROVED_AWAITING_RELEASE, STATUSES.APPROVED,
      STATUSES.RESOURCES_RELEASED, STATUSES.PURCHASED, STATUSES.REGISTERED, STATUSES.CLOSED
    ].includes(status);
  }

  function currentMonthApproved(list) {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return list.filter((r) => isApprovedStatus(r.status) && (r.approved_at || "").startsWith(ym));
  }

  function computeStats(list) {
    const pending = list.filter((r) => [STATUSES.SUBMITTED, STATUSES.DRAFT].includes(r.status)).length;
    const review = list.filter((r) => [STATUSES.UNDER_REVIEW, STATUSES.RETURNED_FOR_CORRECTION].includes(r.status)).length;
    const pastoral = list.filter((r) => r.status === STATUSES.SENT_TO_PASTOR).length;
    const approvedMonth = currentMonthApproved(list).length;
    const rejected = list.filter((r) => r.status === STATUSES.REJECTED).length;
    const released = list.filter((r) => r.status === STATUSES.RESOURCES_RELEASED).length;
    const approvedTotal = list
      .filter((r) => isApprovedStatus(r.status))
      .reduce((sum, r) => sum + Number(r.approved_amount || r.amount_released || r.estimated_amount || 0), 0);
    const pendingValue = list
      .filter((r) => [STATUSES.SUBMITTED, STATUSES.UNDER_REVIEW, STATUSES.SENT_TO_PASTOR, STATUSES.RETURNED_FOR_CORRECTION].includes(r.status))
      .reduce((sum, r) => sum + Number(r.estimated_amount || 0), 0);
    return { pending, review, pastoral, approvedMonth, rejected, released, approvedTotal, pendingValue };
  }

  function appendAuditLog(record, entry) {
    record.audit_history = Array.isArray(record.audit_history) ? record.audit_history : [];
    record.audit_history.push({
      action: entry.action || "",
      by: entry.by || "",
      by_user_id: entry.by_user_id || "",
      at: entry.at || new Date().toISOString(),
      notes: entry.notes || ""
    });
  }

  function buildTimeline(record) {
    const events = [];
    const push = (action, by, at, notes = "") => {
      if (!by && !at) return;
      events.push({ action, by: by || "-", at: at || "", notes });
    };

    push("created", record.requested_by_name, record.created_at);
    push("submitted", record.submitted_by || record.requested_by_name, record.submitted_at);
    push("reviewed", record.reviewed_by, record.reviewed_at, record.review_notes);
    push("sentToPastor", record.sent_to_main_pastor_by, record.sent_to_main_pastor_at);
    push("approved", record.approved_by, record.approved_at, record.approval_notes);
    push("rejected", record.rejected_by, record.rejected_at, record.rejection_reason);
    push("returned", record.returned_by, record.returned_at, record.return_notes);
    push("resourcesReleased", record.resources_released_by, record.resources_released_at);
    push("closed", record.closed_by, record.closed_at);

    return events
      .filter((e) => e.at || e.by !== "-")
      .sort((a, b) => String(a.at).localeCompare(String(b.at)));
  }

  function canAct(user, action, record) {
    const access = resolveAccess(user);
    const role = user?.role || "";
    switch (action) {
      case "submit":
        return access.can_create && record.status === STATUSES.DRAFT && record.requested_by_user_id === user.id;
      case "edit":
        return access.can_edit && [
          STATUSES.DRAFT, STATUSES.SUBMITTED, STATUSES.UNDER_REVIEW,
          STATUSES.RETURNED_FOR_CORRECTION
        ].includes(record.status);
      case "review":
        return (access.can_review || role === "Requisition Officer" || access.can_edit)
          && [STATUSES.SUBMITTED, STATUSES.RETURNED_FOR_CORRECTION].includes(record.status);
      case "forwardPastor":
        return (access.can_forward || role === "Requisition Officer") && record.status === STATUSES.UNDER_REVIEW;
      case "approve":
        return canPastoralDecide(user) && record.status === STATUSES.SENT_TO_PASTOR;
      case "reject":
        if (canPastoralDecide(user) && record.status === STATUSES.SENT_TO_PASTOR) return true;
        return (access.can_review || role === "Requisition Officer") && record.status === STATUSES.UNDER_REVIEW;
      case "returnForCorrection":
        return canPastoralDecide(user) && record.status === STATUSES.SENT_TO_PASTOR;
      case "releaseResources":
        return (access.can_verify || role === "Finance Head")
          && [STATUSES.APPROVED_AWAITING_RELEASE, STATUSES.APPROVED].includes(record.status);
      case "markPurchased":
        return (access.can_edit || role === "Finance Head" || role === "Requisition Officer")
          && record.status === STATUSES.RESOURCES_RELEASED;
      case "registerInventory":
        return (access.can_register_inventory || role === "Venue Manager")
          && record.status === STATUSES.PURCHASED && INVENTORY_TYPES.has(record.requisition_type);
      case "close":
        return access.can_edit && [STATUSES.REGISTERED, STATUSES.PURCHASED, STATUSES.REJECTED].includes(record.status);
      default:
        return access.can_view;
    }
  }

  function availableActions(user, record) {
    const actions = ["view"];
    if (canAct(user, "edit", record)) actions.push("edit");
    if (canAct(user, "submit", record)) actions.push("submit");
    if (canAct(user, "review", record)) actions.push("review");
    if (canAct(user, "forwardPastor", record)) actions.push("forwardPastor");
    if (canAct(user, "approve", record)) actions.push("approve");
    if (canAct(user, "reject", record)) actions.push("reject");
    if (canAct(user, "returnForCorrection", record)) actions.push("returnForCorrection");
    if (canAct(user, "releaseResources", record)) actions.push("releaseResources");
    if (canAct(user, "markPurchased", record)) actions.push("markPurchased");
    if (canAct(user, "registerInventory", record)) actions.push("registerInventory");
    if (canAct(user, "close", record)) actions.push("close");
    return actions;
  }

  function tableActions(user, record) {
    const all = availableActions(user, record);
    if (record.status === STATUSES.SENT_TO_PASTOR) {
      if (canPastoralDecide(user)) return ["view", "approve", "reject"];
      return ["view"];
    }
    return all;
  }

  function applyWorkflowAction(state, user, recordId, action, payload = {}) {
    const record = (state.requisitions || []).find((r) => r.id === recordId);
    if (!record || !canAct(user, action, record)) return { ok: false };

    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    switch (action) {
      case "submit":
        record.status = STATUSES.SUBMITTED;
        record.submitted_by = user.name;
        record.submitted_at = now;
        appendAuditLog(record, { action: "submitted", by: user.name, by_user_id: user.id, at: now });
        break;
      case "review":
        record.status = STATUSES.UNDER_REVIEW;
        record.reviewed_by = user.name;
        record.reviewed_at = now;
        record.review_notes = payload.review_notes || record.review_notes || "";
        appendAuditLog(record, { action: "reviewed", by: user.name, by_user_id: user.id, at: now, notes: record.review_notes });
        break;
      case "forwardPastor":
        record.status = STATUSES.SENT_TO_PASTOR;
        record.sent_to_main_pastor_at = now;
        record.sent_to_main_pastor_by = user.name;
        record.review_notes = payload.review_notes || record.review_notes || "";
        appendAuditLog(record, { action: "sentToPastor", by: user.name, by_user_id: user.id, at: now, notes: record.review_notes });
        break;
      case "approve":
        record.status = STATUSES.APPROVED_AWAITING_RELEASE;
        record.approved_by = user.name;
        record.approved_by_user_id = user.id;
        record.approved_at = now;
        record.approval_notes = payload.approval_notes || payload.pastoral_comment || "";
        record.approved_amount = Number(payload.approved_amount || 0) || null;
        record.final_priority = payload.final_priority || record.urgency || "Normal";
        appendAuditLog(record, {
          action: "approved",
          by: user.name,
          by_user_id: user.id,
          at: now,
          notes: record.approval_notes
        });
        break;
      case "reject":
        record.status = STATUSES.REJECTED;
        record.rejected_by = user.name;
        record.rejected_by_user_id = user.id;
        record.rejected_at = now;
        record.rejection_reason = payload.rejection_reason || payload.review_notes || "Rejeitado";
        appendAuditLog(record, {
          action: "rejected",
          by: user.name,
          by_user_id: user.id,
          at: now,
          notes: record.rejection_reason
        });
        break;
      case "returnForCorrection":
        record.status = STATUSES.RETURNED_FOR_CORRECTION;
        record.returned_by = user.name;
        record.returned_by_user_id = user.id;
        record.returned_at = now;
        record.return_notes = payload.return_notes || payload.pastoral_comment || "";
        appendAuditLog(record, {
          action: "returned",
          by: user.name,
          by_user_id: user.id,
          at: now,
          notes: record.return_notes
        });
        break;
      case "releaseResources": {
        record.status = STATUSES.RESOURCES_RELEASED;
        record.resources_released_by = user.name;
        record.resources_released_at = now;
        record.amount_released = Number(payload.amount_released || record.approved_amount || record.estimated_amount || 0);
        appendAuditLog(record, { action: "resourcesReleased", by: user.name, by_user_id: user.id, at: now });
        const finId = `fin-req-${record.id}`;
        state.finance = Array.isArray(state.finance) ? state.finance : [];
        if (!state.finance.some((f) => f.id === finId)) {
          state.finance.push({
            id: finId,
            source: "requisition",
            source_type: "requisition",
            requisition_id: record.id,
            nome: record.department_name || "Requisição",
            apelido: record.request_number || "",
            telefone: "",
            church_id: record.church_id,
            igreja: record.church_name,
            categoria_da_contribuicao: "Apoio Operacional",
            metodo_de_pagamento: "Banco",
            valor: record.amount_released,
            data: today,
            estado: "Recursos Liberados",
            recebido_por: user.name,
            verificado_por: user.name,
            verified_at: now,
            observacoes: `Liberação de recursos — ${record.title}`,
            created_at: now,
            created_by: user.name,
            updated_by: user.name,
            updated_at: today
          });
        }
        record.finance_record_id = finId;
        break;
      }
      case "markPurchased":
        record.status = STATUSES.PURCHASED;
        appendAuditLog(record, { action: "purchased", by: user.name, by_user_id: user.id, at: now });
        break;
      case "registerInventory": {
        record.status = STATUSES.REGISTERED;
        state.venueInventory = state.venueInventory || {};
        state.venueInventory.inventory = Array.isArray(state.venueInventory.inventory) ? state.venueInventory.inventory : [];
        const invId = `inv-req-${record.id}`;
        if (!state.venueInventory.inventory.some((i) => i.id === invId)) {
          state.venueInventory.inventory.push({
            id: invId,
            church_id: record.church_id,
            created_by: user.name,
            updated_by: user.name,
            created_at: today,
            updated_at: today,
            status: "Bom",
            nome_do_item: record.title,
            categoria: record.requisition_type === "Equipamento" ? "Informática" : "Outros",
            quantidade: 1,
            estado: "Bom",
            localizacao: "A definir",
            departamento_responsavel: record.department_name,
            igreja: record.church_id,
            data_de_entrada: today,
            valor_unitario: record.amount_released || record.approved_amount || record.estimated_amount || 0,
            valor_total: record.amount_released || record.approved_amount || record.estimated_amount || 0,
            serial_number: "",
            observacoes: `Rascunho via requisição ${record.request_number}`,
            requisition_id: record.id,
            draft_from_requisition: true
          });
        }
        record.inventory_item_id = invId;
        appendAuditLog(record, { action: "registered", by: user.name, by_user_id: user.id, at: now });
        break;
      }
      case "close":
        record.status = STATUSES.CLOSED;
        record.closed_by = user.name;
        record.closed_at = now;
        appendAuditLog(record, { action: "closed", by: user.name, by_user_id: user.id, at: now });
        break;
      default:
        return { ok: false };
    }

    record.updated_at = now;
    return { ok: true, record };
  }

  function nextRequestNumber(list) {
    const year = new Date().getFullYear();
    const prefix = `REQ-${year}-`;
    const nums = (list || [])
      .map((r) => r.request_number)
      .filter((n) => n && n.startsWith(prefix))
      .map((n) => Number(n.replace(prefix, "")) || 0);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}${String(next).padStart(4, "0")}`;
  }

  function statusBadgeClass(status) {
    switch (status) {
      case STATUSES.SENT_TO_PASTOR: return "cyan";
      case STATUSES.APPROVED_AWAITING_RELEASE: return "cyan";
      case STATUSES.RESOURCES_RELEASED: return "good";
      case STATUSES.REJECTED: return "danger";
      case STATUSES.RETURNED_FOR_CORRECTION: return "warn";
      case STATUSES.APPROVED: return "good";
      case STATUSES.PURCHASED: return "good";
      case STATUSES.REGISTERED: return "good";
      case STATUSES.UNDER_REVIEW: return "blue";
      case STATUSES.SUBMITTED: return "cyan";
      default: return "warn";
    }
  }

  window.CERequisitions = {
    STATUSES,
    TYPES,
    URGENCY,
    FINAL_PRIORITIES,
    TAB_STATUS_MAP,
    resolveAccess,
    scopeFilter,
    filterByTab,
    computeStats,
    canPastoralDecide,
    canAct,
    availableActions,
    tableActions,
    applyWorkflowAction,
    nextRequestNumber,
    buildTimeline,
    appendAuditLog,
    statusBadgeClass
  };
})();