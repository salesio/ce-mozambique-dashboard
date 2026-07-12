/**
 * Domain report adapters — Phases 2 & 3 departments.
 */
(function () {
  "use strict";

  const fw = () => window.CEReportsFramework;
  const staffLib = () => window.CEStaffHr;
  const disbLib = () => window.CEFinanceDisbursements;
  const reqRep = () => window.CERequisitionReports;

  function register(adapter) {
    fw()?.registerAdapter(adapter);
  }

  function scopedChurches(state) {
    return typeof scoped === "function" ? scoped(state.churches || []) : (state.churches || []);
  }

  /* ── Phase 2: Finance Expenses ── */
  register({
    id: "financeExpenses",
    accessModule: "finance",
    titleKey: "rptFinanceExpensesTitle",
    hintKey: "rptFinanceExpensesHint",
    executive: true,
    canView(user) {
      const access = window.CEAccessControl?.resolveModuleAccess?.(user, "finance");
      return Boolean(access?.can_view);
    },
    canExport(user) {
      const access = window.CEAccessControl?.resolveModuleAccess?.(user, "finance");
      return Boolean(access?.can_export);
    },
    getList(state) {
      return (state.financeDisbursements || []).filter((d) => d.transaction_type === "expense");
    },
    filterRecords(list, filters) {
      let out = fw().applyPeriodFilter(list, filters, "released_at");
      out = fw().applyCommonFilters(out, filters, { churchId: "church_id", department: "department_name", status: "status" });
      if (filters.card_filter === "awaiting") out = out.filter((r) => r.status === "Aguardando Liberação");
      if (filters.card_filter === "released") out = out.filter((r) => ["Recursos Liberados", "Pago"].includes(r.status));
      if (filters.card_filter === "partial") out = out.filter((r) => r.status === "Parcialmente Pago");
      return out;
    },
    computeStats(list) {
      const released = list.reduce((s, r) => s + Number(r.released_amount || 0), 0);
      const approved = list.reduce((s, r) => s + Number(r.approved_amount || 0), 0);
      return {
        total: list.length,
        awaiting: list.filter((r) => r.status === "Aguardando Liberação").length,
        released: list.filter((r) => ["Recursos Liberados", "Pago"].includes(r.status)).length,
        partial: list.filter((r) => r.status === "Parcialmente Pago").length,
        releasedTotal: released,
        approvedTotal: approved,
        pendingTotal: Math.max(0, approved - released)
      };
    },
    getExecutiveCards(stats) {
      return [
        { key: "awaiting", value: stats.awaiting },
        { key: "releasedTotal", value: stats.releasedTotal, money: true }
      ];
    },
    getSummaryCards(stats, L, money) {
      return [
        { icon: "bi-hourglass-split", label: L("finAwaitingRelease"), value: stats.awaiting, filter: { card_filter: "awaiting" } },
        { icon: "bi-check-circle", label: L("finResourcesReleased"), value: stats.released, filter: { card_filter: "released" } },
        { icon: "bi-pie-chart", label: L("finPartialPayment"), value: stats.partial, filter: { card_filter: "partial" } },
        { icon: "bi-wallet2", label: L("finReleasedAmount"), value: money(stats.releasedTotal), filter: {} },
        { icon: "bi-clock-history", label: L("reqRemainingPending"), value: money(stats.pendingTotal), filter: { card_filter: "awaiting" } }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "bar", title: L("reqApprovedVsReleased"), tone: "gold", data: [[L("finApprovedAmount"), stats.approvedTotal], [L("finReleasedAmount"), stats.releasedTotal], [L("reqPendingAmount"), stats.pendingTotal]] },
        { type: "donut", title: L("finFinanceStatus"), data: fw().groupCount(list, "status") },
        { type: "hbar", title: L("reqReportByDepartment"), data: fw().groupSum(list, "department_name", "released_amount") },
        { type: "hbar", title: L("reqReportByChurch"), data: fw().groupSum(list, "church_name", "released_amount") }
      ];
    },
    getTables(list, stats, L, opts) {
      const money = opts.moneyFn || ((v) => v);
      return [{
        title: L("rptExpenseDetail"),
        headers: [L("reqNumber"), L("reqTitle"), L("church"), L("reqDepartment"), L("finApprovedAmount"), L("finReleasedAmount"), L("finFinanceStatus")],
        rows: list.map((r) => [r.request_number, r.title, r.church_name, r.department_name, money(r.approved_amount), money(r.released_amount), r.status])
      }];
    },
    exportHeaders(L) {
      return [L("reqNumber"), L("reqTitle"), L("church"), L("finApprovedAmount"), L("finReleasedAmount"), L("finFinanceStatus")];
    },
    exportRow(r) {
      return [r.request_number, r.title, r.church_name, r.approved_amount, r.released_amount, r.status];
    },
    printSummaryCards(stats, L, money) {
      return [[L("finReleasedAmount"), money(stats.releasedTotal)], [L("reqRemainingPending"), money(stats.pendingTotal)]];
    }
  });

  /* ── Phase 2: Requisition → Inventory ── */
  register({
    id: "reqInventory",
    accessModule: "requisitions",
    titleKey: "rptReqInventoryTitle",
    hintKey: "rptReqInventoryHint",
    canView(user) { return reqRep()?.canViewReports?.(user); },
    canExport(user) { return reqRep()?.canExportReports?.(user); },
    getList(state, user) {
      return (reqRep()?.getFinanceApprovedList?.(state, user) || []).map((r) => ({
        ...r,
        in_inventory: Boolean(r.inventory_item_id || /Inventário|Registado/.test(r.status || "")),
        pending_inventory: !r.inventory_item_id && Number(r.released_amount || 0) > 0
      }));
    },
    filterRecords(list, filters) {
      let out = reqRep()?.filterRecords?.(list, filters) || list;
      if (filters.card_filter === "pending_inv") out = out.filter((r) => r.pending_inventory);
      if (filters.card_filter === "in_inventory") out = out.filter((r) => r.in_inventory);
      return out;
    },
    computeStats(list) {
      return {
        total: list.length,
        inInventory: list.filter((r) => r.in_inventory).length,
        pendingInventory: list.filter((r) => r.pending_inventory).length,
        releasedValue: list.reduce((s, r) => s + Number(r.released_amount || 0), 0)
      };
    },
    getSummaryCards(stats, L, money) {
      return [
        { icon: "bi-box-seam", label: L("rptInInventory"), value: stats.inInventory, filter: { card_filter: "in_inventory" } },
        { icon: "bi-hourglass", label: L("rptPendingInventory"), value: stats.pendingInventory, filter: { card_filter: "pending_inv" } },
        { icon: "bi-clipboard-check", label: L("finApprovedRequisitions"), value: stats.total, filter: {} },
        { icon: "bi-wallet2", label: L("finReleasedAmount"), value: money(stats.releasedValue), filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("rptInventoryStatus"), data: [[L("rptInInventory"), stats.inInventory], [L("rptPendingInventory"), stats.pendingInventory], [L("finAwaitingRelease"), list.filter((r) => !r.in_inventory && !r.pending_inventory).length]] },
        { type: "hbar", title: L("reqReportByType"), data: fw().groupSum(list.filter((r) => r.in_inventory), "requisition_type", "approved_amount") }
      ];
    },
    getTables(list, stats, L, opts) {
      const money = opts.moneyFn || ((v) => v);
      return [{
        title: L("rptReqInventoryDetail"),
        headers: [L("reqNumber"), L("reqTitle"), L("reqType"), L("finReleasedAmount"), L("rptInventoryStatus"), L("status")],
        rows: list.map((r) => [r.request_number, r.title, r.requisition_type, money(r.released_amount), r.in_inventory ? L("rptInInventory") : r.pending_inventory ? L("rptPendingInventory") : L("finAwaitingRelease"), r.status])
      }];
    },
    exportHeaders(L) { return [L("reqNumber"), L("reqTitle"), L("rptInventoryStatus"), L("finReleasedAmount")]; },
    exportRow(r) { return [r.request_number, r.title, r.in_inventory ? "In Inventory" : "Pending", r.released_amount]; }
  });

  /* ── Phase 2: Staff & HR ── */
  register({
    id: "staff",
    accessModule: "staffHr",
    titleKey: "rptStaffTitle",
    hintKey: "rptStaffHint",
    executive: true,
    canView(user) { return staffLib()?.resolveAccess?.(user)?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "staffHr")?.can_export; },
    getList(state, user) {
      const lib = staffLib();
      const access = lib.resolveAccess(user);
      return lib.scopeFilterStaff(state.staffProfiles || [], user, access);
    },
    filterRecords(list, filters, state) {
      let out = fw().applyCommonFilters(list, filters);
      if (filters.card_filter === "active") out = out.filter((s) => s.status === "Activo");
      if (filters.card_filter === "volunteers") out = out.filter((s) => s.employment_type === "Voluntário");
      if (filters.card_filter === "with_salary") out = out.filter((s) => Number(s.salary_or_allowance || 0) > 0);
      return out;
    },
    computeStats(list, state) {
      const salaries = state.staffSalaries || [];
      const pendingPay = salaries.filter((s) => s.payment_status === "Pendente").length;
      const pendingEval = (state.staffPerformance || []).filter((p) => !p.evaluated_at).length;
      return {
        total: list.length,
        active: list.filter((s) => s.status === "Activo").length,
        volunteers: list.filter((s) => s.employment_type === "Voluntário").length,
        withSalary: list.filter((s) => Number(s.salary_or_allowance || 0) > 0).length,
        pendingPay,
        pendingEval
      };
    },
    getDepartments(state, list) {
      return [...new Set(list.map((s) => s.department_name).filter(Boolean))];
    },
    getStatuses(state, list) {
      return [...new Set(list.map((s) => s.status).filter(Boolean))];
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-people", label: L("staffTotal"), value: stats.total, filter: {} },
        { icon: "bi-person-check", label: L("staffActive"), value: stats.active, filter: { card_filter: "active" } },
        { icon: "bi-heart", label: L("staffVolunteers"), value: stats.volunteers, filter: { card_filter: "volunteers" } },
        { icon: "bi-wallet2", label: L("staffWithSalary"), value: stats.withSalary, filter: { card_filter: "with_salary" } },
        { icon: "bi-cash", label: L("staffPendingPay"), value: stats.pendingPay, filter: {} },
        { icon: "bi-clipboard-data", label: L("staffPendingEval"), value: stats.pendingEval, filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("rptStaffByStatus"), data: fw().groupCount(list, "status") },
        { type: "hbar", title: L("rptStaffByDepartment"), data: fw().groupCount(list, "department_name") },
        { type: "hbar", title: L("rptStaffByChurch"), data: fw().groupCount(list, "church_id").map(([id, c]) => [typeof churchName === "function" ? churchName(id) : id, c]) },
        { type: "bar", title: L("rptStaffByEmployment"), data: fw().groupCount(list, "employment_type") }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptStaffDetail"),
        headers: [L("staffFullName"), L("staffRoleTitle"), L("church"), L("reqDepartment"), L("staffEmploymentType"), L("status")],
        rows: list.map((s) => [s.full_name, s.role_title, typeof churchName === "function" ? churchName(s.church_id) : s.church_id, s.department_name, s.employment_type, s.status])
      }];
    },
    exportHeaders(L) { return [L("staffFullName"), L("church"), L("reqDepartment"), L("status")]; },
    exportRow(s) { return [s.full_name, s.church_id, s.department_name, s.status]; }
  });

  /* ── Phase 2: Foundation School ── */
  register({
    id: "foundation",
    accessModule: "foundation",
    titleKey: "rptFoundationTitle",
    hintKey: "rptFoundationHint",
    executive: true,
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "foundation")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "foundation")?.can_export; },
    getList(state, user) {
      const students = typeof scoped === "function" ? scoped(state.foundationStudents || []) : (state.foundationStudents || []);
      return students.map((s) => ({
        ...s,
        student_name: typeof fullName === "function" ? fullName(s) : (s.nome || s.name || "—"),
        church_label: typeof churchName === "function" ? churchName(s.church_id) : s.church_id
      }));
    },
    filterRecords(list, filters) {
      let out = fw().applyCommonFilters(list, filters, { status: "estado" });
      if (filters.card_filter === "graduated") out = out.filter((s) => s.graduado);
      if (filters.card_filter === "certificates") out = out.filter((s) => s.certificado_emitido);
      if (filters.card_filter === "in_progress") out = out.filter((s) => /Em Curso|In Progress/i.test(s.estado || ""));
      return out;
    },
    computeStats(list) {
      return {
        total: list.length,
        enrolled: list.filter((s) => /Inscrito|Enrolled/i.test(s.estado || "")).length,
        inProgress: list.filter((s) => /Em Curso|In Progress/i.test(s.estado || "")).length,
        graduated: list.filter((s) => s.graduado).length,
        certificates: list.filter((s) => s.certificado_emitido).length,
        examReady: list.filter((s) => /Exame|Exam Ready/i.test(s.estado || "")).length
      };
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-person-plus", label: L("enrolledInCourse"), value: stats.enrolled, filter: {} },
        { icon: "bi-book", label: L("inProgress"), value: stats.inProgress, filter: { card_filter: "in_progress" } },
        { icon: "bi-clipboard-check", label: L("readyForExam"), value: stats.examReady, filter: {} },
        { icon: "bi-award", label: L("graduations"), value: stats.graduated, filter: { card_filter: "graduated" } },
        { icon: "bi-patch-check", label: L("certificatesIssued"), value: stats.certificates, filter: { card_filter: "certificates" } }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("rptFoundationFunnel"), data: [[L("enrolledInCourse"), stats.enrolled], [L("inProgress"), stats.inProgress], [L("readyForExam"), stats.examReady], [L("graduations"), stats.graduated], [L("certificatesIssued"), stats.certificates]] },
        { type: "hbar", title: L("rptFoundationByChurch"), data: fw().groupCount(list, "church_label") },
        { type: "bar", title: L("rptFoundationProgress"), data: list.slice(0, 12).map((s) => [s.student_name, s.class_progress_percent || s.completed_classes || 0]) }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptFoundationDetail"),
        headers: [L("student"), L("church"), L("classes"), L("exam"), L("status"), L("progress")],
        rows: list.map((s) => [s.student_name, s.church_label, `${s.completed_classes || 0}/7`, s.nota_exame || "-", s.estado, `${s.class_progress_percent || 0}%`])
      }];
    },
    exportHeaders(L) { return [L("student"), L("church"), L("status"), L("progress")]; },
    exportRow(s) { return [s.student_name, s.church_label, s.estado, s.class_progress_percent]; }
  });

  /* ── Phase 2: First Timers / Follow-up Funnel ── */
  register({
    id: "funnel",
    accessModule: "firstTimers",
    titleKey: "rptFunnelTitle",
    hintKey: "rptFunnelHint",
    executive: true,
    canView(user) {
      return window.CEAccessControl?.resolveModuleAccess?.(user, "firstTimers")?.can_view
        || window.CEAccessControl?.resolveModuleAccess?.(user, "followUp")?.can_view;
    },
    canExport(user) {
      return window.CEAccessControl?.resolveModuleAccess?.(user, "reports")?.can_export;
    },
    getList(state, user) {
      const fts = typeof scoped === "function" ? scoped(state.firstTimers || []) : (state.firstTimers || []);
      return fts.map((p) => ({
        ...p,
        person_name: typeof fullName === "function" ? fullName(p) : (p.nome || "—"),
        church_label: typeof churchName === "function" ? churchName(p.church_id) : p.church_id,
        funnel_stage: p.estado_do_seguimento || "Pending"
      }));
    },
    filterRecords(list, filters) {
      let out = fw().applyPeriodFilter(list, filters, "data_do_culto");
      out = fw().applyCommonFilters(out, filters, { status: "funnel_stage" });
      if (filters.card_filter === "foundation") out = out.filter((p) => p.quer_escola_de_fundacao);
      if (filters.card_filter === "cell") out = out.filter((p) => p.interesse_em_celula);
      if (filters.card_filter === "born_again") out = out.filter((p) => p.nasceu_de_novo);
      if (filters.card_filter === "pending") out = out.filter((p) => /Pending|Pendente/i.test(p.funnel_stage));
      return out;
    },
    computeStats(list) {
      const stage = (s) => String(s).toLowerCase();
      return {
        total: list.length,
        pending: list.filter((p) => stage(p.funnel_stage).includes("pending")).length,
        contacted: list.filter((p) => stage(p.funnel_stage).includes("contact")).length,
        sentToCell: list.filter((p) => stage(p.funnel_stage).includes("cell")).length,
        foundation: list.filter((p) => p.quer_escola_de_fundacao).length,
        members: list.filter((p) => stage(p.funnel_stage).includes("member")).length,
        bornAgain: list.filter((p) => p.nasceu_de_novo).length
      };
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-person-heart", label: L("totalFirstTimers"), value: stats.total, filter: {} },
        { icon: "bi-hourglass", label: L("pending"), value: stats.pending, filter: { card_filter: "pending" } },
        { icon: "bi-telephone", label: L("contacted"), value: stats.contacted, filter: {} },
        { icon: "bi-diagram-3", label: L("sentToCell"), value: stats.sentToCell, filter: { card_filter: "cell" } },
        { icon: "bi-mortarboard", label: L("foundationEnrolments"), value: stats.foundation, filter: { card_filter: "foundation" } },
        { icon: "bi-stars", label: L("newConverts"), value: stats.bornAgain, filter: { card_filter: "born_again" } }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("rptFunnelStages"), data: fw().groupCount(list, "funnel_stage") },
        { type: "bar", title: L("firstTimersByMonth"), data: fw().groupCount(list, "data_do_culto").slice(0, 8) },
        { type: "hbar", title: L("rptFunnelByChurch"), data: fw().groupCount(list, "church_label") }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptFunnelDetail"),
        headers: [L("name"), L("church"), L("followupState"), L("wantFoundation"), L("cellInterest"), L("bornAgain")],
        rows: list.map((p) => [p.person_name, p.church_label, p.funnel_stage, p.quer_escola_de_fundacao ? "Sim" : "Não", p.interesse_em_celula ? "Sim" : "Não", p.nasceu_de_novo ? "Sim" : "Não"])
      }];
    },
    exportHeaders(L) { return [L("name"), L("church"), L("followupState")]; },
    exportRow(p) { return [p.person_name, p.church_label, p.funnel_stage]; }
  });

  /* ── Phase 3: Cells / ALEC ── */
  register({
    id: "cell",
    accessModule: "cell",
    titleKey: "rptCellTitle",
    hintKey: "rptCellHint",
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "cell")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "reports")?.can_export; },
    getList(state, user) {
      const leadership = state.cellLeadership || {};
      const reports = [...(leadership.churchReports || []), ...(leadership.cellReports || [])];
      const scopedFn = typeof scopedNested === "function" ? scopedNested : (x) => x;
      return scopedFn(reports).map((r) => ({ ...r, report_type: r.celula ? "cell" : "church" }));
    },
    filterRecords(list, filters) {
      let out = fw().applyCommonFilters(list, filters, { status: "estado" });
      if (filters.card_filter === "submitted") out = out.filter((r) => r.estado !== "Rascunho");
      if (filters.card_filter === "pending") out = out.filter((r) => ["Rascunho", "Submetido", "Em Avaliação"].includes(r.estado));
      return out;
    },
    computeStats(list) {
      return {
        total: list.length,
        submitted: list.filter((r) => r.estado !== "Rascunho").length,
        pending: list.filter((r) => ["Rascunho", "Submetido", "Em Avaliação"].includes(r.estado)).length,
        totalAtt: list.reduce((s, r) => s + Number(r.att || 0), 0),
        totalFt: list.reduce((s, r) => s + Number(r.ft || 0), 0),
        totalNc: list.reduce((s, r) => s + Number(r.nc || 0), 0)
      };
    },
    getSummaryCards(stats, L, money) {
      return [
        { icon: "bi-clipboard-check", label: L("submittedReports"), value: stats.submitted, filter: { card_filter: "submitted" } },
        { icon: "bi-hourglass", label: L("pendingReportsShort"), value: stats.pending, filter: { card_filter: "pending" } },
        { icon: "bi-people", label: L("totalAttendance"), value: stats.totalAtt, filter: {} },
        { icon: "bi-person-heart", label: L("totalFirstTime"), value: stats.totalFt, filter: {} },
        { icon: "bi-stars", label: L("totalNewConverts"), value: stats.totalNc, filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("reportsByStatus"), data: fw().groupCount(list, "estado") },
        { type: "hbar", title: L("attendanceByWeek"), data: fw().groupSum(list, "semana", "att") },
        { type: "hbar", title: L("firstTimersByCell"), data: fw().groupSum(list, "celula", "ft") },
        { type: "hbar", title: L("newConvertsByCell"), data: fw().groupSum(list, "celula", "nc") }
      ];
    },
    getTables(list, stats, L, opts) {
      const money = opts.moneyFn || ((v) => v);
      return [{
        title: L("rptCellDetail"),
        headers: [L("week"), L("cell"), L("leaderName"), "ATT", "FT", "NC", L("status")],
        rows: list.map((r) => [r.semana, r.celula, r.nome_do_lider, r.att, r.ft, r.nc, r.estado])
      }];
    },
    exportHeaders(L) { return [L("week"), L("cell"), "ATT", "FT", "NC", L("status")]; },
    exportRow(r) { return [r.semana, r.celula, r.att, r.ft, r.nc, r.estado]; }
  });

  /* ── Phase 3: FEVO ── */
  register({
    id: "fevo",
    accessModule: "fevo",
    titleKey: "rptFevoTitle",
    hintKey: "rptFevoHint",
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "fevo")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "fevo")?.can_export; },
    getList(state, user) {
      const scopedFn = typeof scopedNested === "function" ? scopedNested : (x) => x;
      return scopedFn(state.fevo?.reports || []);
    },
    filterRecords(list, filters, state) {
      let out = fw().applyCommonFilters(list, filters, { status: "status" });
      if (filters.card_filter === "no_report") {
        const scopedFn = typeof scopedNested === "function" ? scopedNested : (x) => x;
        return scopedFn(state?.fevo?.noReports || []);
      }
      return out;
    },
    computeStats(list, state) {
      const noReports = (state?.fevo?.noReports || []).length;
      return {
        total: list.length,
        soulsContacted: list.reduce((s, r) => s + Number(r.souls_contacted || 0), 0),
        soulsEvangelized: list.reduce((s, r) => s + Number(r.souls_evangelized || 0), 0),
        newConverts: list.reduce((s, r) => s + Number(r.new_converts || 0), 0),
        noReports
      };
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-clipboard-data", label: L("fevoReports"), value: stats.total, filter: {} },
        { icon: "bi-telephone", label: L("soulsContacted"), value: stats.soulsContacted, filter: {} },
        { icon: "bi-megaphone", label: L("soulsEvangelized"), value: stats.soulsEvangelized, filter: {} },
        { icon: "bi-stars", label: L("newConverts"), value: stats.newConverts, filter: {} },
        { icon: "bi-exclamation-circle", label: L("fevoNoReports"), value: stats.noReports, filter: { card_filter: "no_report" } }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "bar", title: L("soulsContacted"), data: fw().groupSum(list, "team", "souls_contacted") },
        { type: "donut", title: L("fevoActivities"), data: fw().groupCount(list, "activity_type") },
        { type: "hbar", title: L("rptFevoByGroup"), data: fw().groupCount(list, "group_name") }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptFevoDetail"),
        headers: [L("week"), L("team"), L("group"), L("soulsContacted"), L("newConverts"), L("status")],
        rows: list.map((r) => [r.semana_inicio || r.week, r.team, r.group_name, r.souls_contacted, r.new_converts, r.status])
      }];
    },
    exportHeaders(L) { return [L("team"), L("group"), L("soulsContacted"), L("newConverts")]; },
    exportRow(r) { return [r.team, r.group_name, r.souls_contacted, r.new_converts]; }
  });

  /* ── Phase 3: Venue / Inventory ── */
  register({
    id: "venue",
    accessModule: "venueInventory",
    titleKey: "rptVenueTitle",
    hintKey: "rptVenueHint",
    canView(user) { return window.CEAccessControl?.canViewVenueModule?.(user) ?? window.CEAccessControl?.resolveModuleAccess?.(user, "venueInventory")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "venueInventory")?.can_export; },
    getList(state, user) {
      const venue = state.venueInventory || {};
      const scopedFn = typeof scopedVenueDepartment === "function"
        ? (items) => scopedVenueDepartment(items, "departamento_responsavel")
        : (items) => items;
      return scopedFn(venue.inventory || []);
    },
    filterRecords(list, filters) {
      let out = fw().applyCommonFilters(list, filters, { status: "estado" });
      if (filters.card_filter === "damaged") out = out.filter((i) => ["Mau", "Em Reparação"].includes(i.estado));
      if (filters.card_filter === "good") out = out.filter((i) => i.estado === "Bom");
      return out;
    },
    computeStats(list, state) {
      const maintenance = state.venueInventory?.maintenance || [];
      return {
        total: list.length,
        good: list.filter((i) => i.estado === "Bom").length,
        damaged: list.filter((i) => ["Mau", "Em Reparação"].includes(i.estado)).length,
        totalValue: list.reduce((s, i) => s + Number(i.valor_total || 0), 0),
        repairs: maintenance.length
      };
    },
    getSummaryCards(stats, L, money) {
      return [
        { icon: "bi-box-seam", label: L("totalItems"), value: stats.total, filter: {} },
        { icon: "bi-check-circle", label: L("goodEquipment"), value: stats.good, filter: { card_filter: "good" } },
        { icon: "bi-exclamation-triangle", label: L("damagedEquipment"), value: stats.damaged, filter: { card_filter: "damaged" } },
        { icon: "bi-cash-coin", label: L("rptInventoryValue"), value: money(stats.totalValue), filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("itemsByCategory"), data: fw().groupCount(list, "categoria") },
        { type: "donut", title: L("itemsByStatus"), data: fw().groupCount(list, "estado") },
        { type: "hbar", title: L("equipmentByDepartment"), data: fw().groupSum(list, "departamento_responsavel", "valor_total") }
      ];
    },
    getTables(list, stats, L, opts) {
      const money = opts.moneyFn || ((v) => v);
      return [{
        title: L("rptVenueDetail"),
        headers: [L("itemName"), L("category"), L("quantity"), L("location"), L("totalValue"), L("status")],
        rows: list.map((i) => [i.nome_do_item, i.categoria, i.quantidade, i.localizacao, money(i.valor_total), i.estado])
      }];
    },
    exportHeaders(L) { return [L("itemName"), L("category"), L("totalValue"), L("status")]; },
    exportRow(i) { return [i.nome_do_item, i.categoria, i.valor_total, i.estado]; }
  });

  /* ── Phase 3: Sacraments ── */
  register({
    id: "sacraments",
    accessModule: "sacraments",
    titleKey: "rptSacramentsTitle",
    hintKey: "rptSacramentsHint",
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "sacraments")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "reports")?.can_export; },
    getList(state) {
      const sac = state.sacraments || {};
      const baptisms = (sac.baptisms || []).map((r) => ({ ...r, sacrament_type: "Baptism", type_label: "Batismo" }));
      const marriages = (sac.marriages || []).map((r) => ({ ...r, sacrament_type: "Marriage", type_label: "Casamento" }));
      const babies = (sac.babies || []).map((r) => ({ ...r, sacrament_type: "Baby", type_label: "Apresentação" }));
      return [...baptisms, ...marriages, ...babies];
    },
    filterRecords(list, filters) {
      let out = fw().applyPeriodFilter(list, filters, "data");
      if (filters.card_filter === "baptism") out = out.filter((r) => r.sacrament_type === "Baptism");
      if (filters.card_filter === "marriage") out = out.filter((r) => r.sacrament_type === "Marriage");
      if (filters.card_filter === "baby") out = out.filter((r) => r.sacrament_type === "Baby");
      return out;
    },
    computeStats(list) {
      return {
        total: list.length,
        baptisms: list.filter((r) => r.sacrament_type === "Baptism").length,
        marriages: list.filter((r) => r.sacrament_type === "Marriage").length,
        babies: list.filter((r) => r.sacrament_type === "Baby").length,
        completed: list.filter((r) => /Concluído|Completed|Realizado/i.test(r.estado || "")).length
      };
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-droplet", label: L("baptismTab"), value: stats.baptisms, filter: { card_filter: "baptism" } },
        { icon: "bi-heart", label: L("marriageTab"), value: stats.marriages, filter: { card_filter: "marriage" } },
        { icon: "bi-emoji-smile", label: L("babyTab"), value: stats.babies, filter: { card_filter: "baby" } },
        { icon: "bi-check-circle", label: L("rptCompleted"), value: stats.completed, filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("sacramentsSummary"), data: [[L("baptismTab"), stats.baptisms], [L("marriageTab"), stats.marriages], [L("babyTab"), stats.babies]] },
        { type: "hbar", title: L("rptSacramentsByChurch"), data: fw().groupCount(list, "igreja") }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptSacramentsDetail"),
        headers: [L("type"), L("name"), L("church"), L("date"), L("status")],
        rows: list.map((r) => [r.type_label, r.nome || r.nome_do_bebe || r.noivos || "-", r.igreja, r.data || "-", r.estado || "-"])
      }];
    },
    exportHeaders(L) { return [L("type"), L("name"), L("church"), L("date")]; },
    exportRow(r) { return [r.type_label, r.nome || r.noivos, r.igreja, r.data]; }
  });

  /* ── Phase 3: Prison Ministry ── */
  register({
    id: "prison",
    accessModule: "prisonMinistry",
    titleKey: "rptPrisonTitle",
    hintKey: "rptPrisonHint",
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "prisonMinistry")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "reports")?.can_export; },
    getList(state) {
      const pm = state.prisonMinistry || {};
      return (pm.services || []).map((s) => ({
        ...s,
        record_type: "service",
        prisao_label: typeof prisonName === "function" ? prisonName(s.prisao) : s.prisao
      }));
    },
    filterRecords(list, filters) {
      let out = fw().applyPeriodFilter(list, filters, "data");
      out = fw().applyCommonFilters(out, filters, { status: "estado" });
      return out;
    },
    computeStats(list, state) {
      const pm = state.prisonMinistry || {};
      return {
        total: list.length,
        prisons: (pm.prisons || []).length,
        foundationStudents: (pm.foundationStudents || []).length,
        inmatesReached: list.reduce((s, r) => s + Number(r.numero_de_internos_presentes || 0), 0),
        completed: list.filter((r) => /Realizado|Relatório Submetido/i.test(r.estado || "")).length
      };
    },
    getSummaryCards(stats, L) {
      return [
        { icon: "bi-building", label: L("prisons"), value: stats.prisons, filter: {} },
        { icon: "bi-calendar-event", label: L("prisonServices"), value: stats.total, filter: {} },
        { icon: "bi-people", label: L("rptInmatesReached"), value: stats.inmatesReached, filter: {} },
        { icon: "bi-mortarboard", label: L("foundationSchool"), value: stats.foundationStudents, filter: {} }
      ];
    },
    getCharts(list, stats, L) {
      return [
        { type: "donut", title: L("rptPrisonServices"), data: fw().groupCount(list, "estado") },
        { type: "hbar", title: L("rptPrisonByLocation"), data: fw().groupCount(list, "prisao") }
      ];
    },
    getTables(list, stats, L) {
      return [{
        title: L("rptPrisonDetail"),
        headers: [L("date"), L("prison"), L("service"), L("attendance"), L("status")],
        rows: list.map((r) => [r.data, r.prisao_label || r.prisao, r.tema_ou_mensagem || "-", r.numero_de_internos_presentes, r.estado])
      }];
    },
    exportHeaders(L) { return [L("date"), L("prison"), L("attendance"), L("status")]; },
    exportRow(r) { return [r.data, r.prisao_label || r.prisao, r.numero_de_internos_presentes, r.estado]; }
  });

  /* ── Phase 3: Ministry Materials ── */
  register({
    id: "materials",
    accessModule: "ministryMaterials",
    titleKey: "rptMaterialsTitle",
    hintKey: "rptMaterialsHint",
    canView(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "ministryMaterials")?.can_view; },
    canExport(user) { return window.CEAccessControl?.resolveModuleAccess?.(user, "reports")?.can_export; },
    getList(state) {
      const mm = state.ministryMaterials || {};
      return (mm.sales || []).map((s) => ({ ...s, record_type: "sale" }));
    },
    filterRecords(list, filters, state) {
      if (filters.card_filter === "low_stock") {
        const catalogue = state?.ministryMaterials?.catalogue || [];
        return catalogue.filter((i) => Number(i.stock_actual || 0) <= Number(i.stock_minimo || 0))
          .map((i) => ({ titulo_do_material: i.titulo_do_material, stock_actual: i.stock_actual, stock_minimo: i.stock_minimo, estado: i.estado }));
      }
      return fw().applyPeriodFilter(list, filters, "data");
    },
    computeStats(list, state) {
      const catalogue = state?.ministryMaterials?.catalogue || [];
      const distributions = state?.ministryMaterials?.distributions || [];
      return {
        total: list.length,
        salesValue: list.reduce((s, r) => s + Number(r.valor || 0), 0),
        qtySold: list.reduce((s, r) => s + Number(r.quantidade || 0), 0),
        lowStock: catalogue.filter((i) => Number(i.stock_actual || 0) <= Number(i.stock_minimo || 0)).length,
        pendingDist: distributions.filter((d) => ["Solicitado", "Aprovado"].includes(d.estado)).length
      };
    },
    getSummaryCards(stats, L, money) {
      return [
        { icon: "bi-cash-stack", label: L("soldThisMonth"), value: money(stats.salesValue), filter: {} },
        { icon: "bi-bag-check", label: L("quantitySold"), value: stats.qtySold, filter: {} },
        { icon: "bi-exclamation-triangle", label: L("lowStockMaterials"), value: stats.lowStock, filter: { card_filter: "low_stock" } },
        { icon: "bi-truck", label: L("pendingDistributions"), value: stats.pendingDist, filter: {} }
      ];
    },
    getCharts(list, stats, L, opts) {
      const catalogue = opts.state?.ministryMaterials?.catalogue || [];
      return [
        { type: "bar", title: L("sales"), data: fw().groupSum(list, "titulo_do_material", "valor") },
        { type: "hbar", title: L("catalogue"), data: catalogue.slice(0, 10).map((i) => [i.titulo_do_material, i.stock_actual]) }
      ];
    },
    getTables(list, stats, L, opts) {
      const money = opts.moneyFn || ((v) => v);
      return [{
        title: L("rptMaterialsDetail"),
        headers: [L("date"), L("buyer"), L("materialTitle"), L("quantitySold"), L("amount"), L("status")],
        rows: list.map((r) => [r.data, r.comprador, r.titulo_do_material, r.quantidade, money(r.valor), r.estado])
      }];
    },
    exportHeaders(L) { return [L("date"), L("materialTitle"), L("quantitySold"), L("amount")]; },
    exportRow(r) { return [r.data, r.titulo_do_material, r.quantidade, r.valor]; }
  });

  window.CEDomainReports = { register };
})();