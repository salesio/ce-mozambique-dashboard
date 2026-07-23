/**
 * Partnerships / Parcerias — analytics layer over verified financeRecords.
 * Does NOT duplicate finance data. Income only, Verified only.
 */
(function (global) {
  const PARTNERSHIP_ARMS_SEED = [
    { id: "arm-healing", name: "Escola de Cura", description: "Escola de Cura e ministério de cura.", icon: "bi-heart-pulse", monthly_goal: 15000 },
    { id: "arm-rhapsody", name: "Rapsódia de Realidades", description: "Distribuição e parcerias de Rapsódia.", icon: "bi-book", monthly_goal: 20000 },
    { id: "arm-lw-sat", name: "Loveworld SAT", description: "Parceria Loveworld SAT (não é departamento).", icon: "bi-broadcast", monthly_goal: 12000 },
    { id: "arm-vision", name: "Construtores de Visão", description: "Apoio a projectos de visão e expansão.", icon: "bi-building", monthly_goal: 25000 },
    { id: "arm-interior", name: "Missões de Cidades do Interior", description: "Missões e alcance no interior.", icon: "bi-geo-alt", monthly_goal: 10000 },
    { id: "arm-reach-mz", name: "Alcançar Moçambique", description: "Campanhas nacionais de alcance.", icon: "bi-flag", monthly_goal: 18000 },
    { id: "arm-church-project", name: "Projecto da Igreja", description: "Projectos locais da igreja.", icon: "bi-house-heart", monthly_goal: 15000 },
    { id: "arm-construction", name: "Projecto de Construção de Igreja", description: "Construção e infra-estrutura.", icon: "bi-bricks", monthly_goal: 30000 },
    { id: "arm-kids-rhapsody", name: "Rapsódias das Crianças", description: "Rapsódia infantil e ministério kids.", icon: "bi-emoji-smile", monthly_goal: 8000 },
    { id: "arm-cell-mandate", name: "Mandato de Célula", description: "Mandato e crescimento celular.", icon: "bi-diagram-3", monthly_goal: 10000 },
    { id: "arm-other", name: "Outros Braços", description: "Outras parcerias e projectos.", icon: "bi-stars", monthly_goal: 5000 }
  ];

  const partnershipPageState = {
    tab: "overview",
    armId: "",
    churchId: "",
    partnerQuery: "",
    period: "month",
    statusFilter: "",
    methodFilter: "",
    minAmount: "",
    maxAmount: ""
  };

  function t(key, fallback) {
    return typeof L === "function" ? (L(key) !== key ? L(key) : fallback || key) : (fallback || key);
  }

  function isPt() {
    return typeof lang !== "undefined" ? lang === "pt" : true;
  }

  function getArms() {
    const stored = (typeof state !== "undefined" && Array.isArray(state.partnershipArms) && state.partnershipArms.length)
      ? state.partnershipArms
      : PARTNERSHIP_ARMS_SEED;
    return stored.map((arm) => ({
      logo_url: "",
      logo_pending: true,
      monthly_goal: 10000,
      status: "Active",
      is_active: true,
      created_at: "2026-01-01",
      updated_at: "2026-07-01",
      ...arm
    }));
  }

  function isVerifiedIncomeRecord(record) {
    if (!record) return false;
    const tx = String(record.transaction_type || "income").toLowerCase();
    if (tx === "expense") return false;
    const st = String(record.status || record.estado || "").toLowerCase();
    if (st.includes("pending") || st.includes("pendente")) return false;
    if (st.includes("reject") || st.includes("rejeit")) return false;
    if (st.includes("cancel")) return false;
    return st.includes("verif") || st.includes("inclu");
  }

  function isPartnershipRecord(record) {
    if (!isVerifiedIncomeRecord(record)) return false;
    const group = String(record.contribution_group || "").toLowerCase();
    if (group.includes("parcer") || group.includes("partner")) return true;
    if (record.partnership_arm_id || record.partnership_arm_name || record.partnership_arm) return true;
    const cat = String(record.contribution_category || record.categoria_da_contribuicao || record.category || "");
    return getArms().some((arm) => arm.name === cat || arm.id === record.partnership_arm_id);
  }

  function resolveArmId(record) {
    if (record.partnership_arm_id) return record.partnership_arm_id;
    const name = record.partnership_arm_name || record.partnership_arm || record.contribution_category || record.categoria_da_contribuicao || "";
    const found = getArms().find((a) => a.name === name || a.id === name);
    return found ? found.id : "arm-other";
  }

  function resolveArmName(record) {
    const arm = getArms().find((a) => a.id === resolveArmId(record));
    return arm?.name || record.partnership_arm_name || record.partnership_arm || record.contribution_category || "Outros Braços";
  }

  function recordDate(record) {
    return String(record.payment_date || record.data || record.created_at || "").slice(0, 10);
  }

  function amountOf(record) {
    return Number(record.amount ?? record.valor ?? 0);
  }

  function periodRange(periodKey) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    if (periodKey === "year") {
      return { start: `${y}-01-01`, end: `${y}-12-31`, prevStart: `${y - 1}-01-01`, prevEnd: `${y - 1}-12-31` };
    }
    if (periodKey === "quarter") {
      const q = Math.floor(m / 3);
      const startM = String(q * 3 + 1).padStart(2, "0");
      const endM = String(q * 3 + 3).padStart(2, "0");
      const pq = q === 0 ? 3 : q - 1;
      const py = q === 0 ? y - 1 : y;
      return {
        start: `${y}-${startM}-01`,
        end: `${y}-${endM}-31`,
        prevStart: `${py}-${String(pq * 3 + 1).padStart(2, "0")}-01`,
        prevEnd: `${py}-${String(pq * 3 + 3).padStart(2, "0")}-31`
      };
    }
    // month default
    const mm = String(m + 1).padStart(2, "0");
    const prev = new Date(y, m - 1, 1);
    const pmm = String(prev.getMonth() + 1).padStart(2, "0");
    return {
      start: `${y}-${mm}-01`,
      end: `${y}-${mm}-31`,
      prevStart: `${prev.getFullYear()}-${pmm}-01`,
      prevEnd: `${prev.getFullYear()}-${pmm}-31`
    };
  }

  function inRange(dateStr, start, end) {
    const d = String(dateStr || "").slice(0, 10);
    if (!d) return false;
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  }

  function getPartnershipFinanceList() {
    const list = typeof getScopedFinanceList === "function"
      ? getScopedFinanceList()
      : ((typeof state !== "undefined" ? state.finance : []) || []).map((r) =>
          typeof migrateFinanceRecord === "function" ? migrateFinanceRecord(r) : r
        );
    return list.filter(isPartnershipRecord);
  }

  function getPendingPartnershipCount() {
    const list = typeof getScopedFinanceList === "function"
      ? getScopedFinanceList()
      : (typeof state !== "undefined" ? state.finance : []) || [];
    return list.filter((r) => {
      const st = String(r.status || r.estado || "").toLowerCase();
      const pending = st.includes("pending") || st.includes("pendente");
      if (!pending) return false;
      const group = String(r.contribution_group || "").toLowerCase();
      const cat = String(r.contribution_category || r.categoria_da_contribuicao || "");
      return group.includes("parcer") || r.partnership_arm_id || getArms().some((a) => a.name === cat);
    }).length;
  }

  function contributorKey(record) {
    if (typeof financeContributorKey === "function") return financeContributorKey(record);
    return [
      record.contributor_id || "",
      record.telefone || record.contributor_phone || "",
      (record.contributor_name || [record.nome, record.apelido].filter(Boolean).join(" ")).toLowerCase()
    ].join("|");
  }

  function getPartnershipArmPromotionStatus(arm, periodData) {
    const goal = Number(arm.monthly_goal || 0);
    const donorCount = Number(periodData.donor_count || 0);
    const total = Number(periodData.total_amount || 0);
    const growth = Number(periodData.growth_percent || 0);
    const daysSince = Number(periodData.days_since_last_donation || 999);
    const needs =
      donorCount < 3 ||
      (goal > 0 && total < goal * 0.4) ||
      growth < -20 ||
      daysSince > 30 ||
      total === 0;
    let label = isPt() ? "Estável" : "Stable";
    if (total === 0 || daysSince > 45) label = isPt() ? "Baixa Actividade" : "Low Activity";
    else if (needs) label = isPt() ? "Precisa de Promoção" : "Needs Promotion";
    else if (growth > 15 || (goal > 0 && total >= goal)) label = isPt() ? "Forte" : "Strong";
    return { needs_promotion: needs, status_label: label };
  }

  function daysSince(dateStr) {
    if (!dateStr) return 999;
    const t = Date.parse(dateStr);
    if (!t) return 999;
    return Math.floor((Date.now() - t) / 86400000);
  }

  function computeArmAnalytics(periodKey = partnershipPageState.period) {
    const range = periodRange(periodKey);
    const all = getPartnershipFinanceList();
    const current = all.filter((r) => inRange(recordDate(r), range.start, range.end));
    const previous = all.filter((r) => inRange(recordDate(r), range.prevStart, range.prevEnd));

    return getArms().map((arm) => {
      const cur = current.filter((r) => resolveArmId(r) === arm.id);
      const prev = previous.filter((r) => resolveArmId(r) === arm.id);
      const total = cur.reduce((s, r) => s + amountOf(r), 0);
      const prevTotal = prev.reduce((s, r) => s + amountOf(r), 0);
      const donors = new Set(cur.map(contributorKey));
      const amounts = cur.map(amountOf).filter((n) => n > 0);
      const maxDonation = amounts.length ? Math.max(...amounts) : 0;
      const avg = amounts.length ? total / amounts.length : 0;
      const last = cur.map(recordDate).filter(Boolean).sort().reverse()[0] || "";
      const growth = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : total > 0 ? 100 : 0;
      const periodData = {
        total_amount: total,
        donor_count: donors.size,
        growth_percent: growth,
        days_since_last_donation: daysSince(last)
      };
      const promo = getPartnershipArmPromotionStatus(arm, periodData);
      return {
        ...arm,
        total_amount: total,
        donor_count: donors.size,
        donation_count: cur.length,
        average_donation: avg,
        max_donation: maxDonation,
        last_donation_date: last,
        growth_percent: growth,
        needs_promotion: promo.needs_promotion,
        status_label: promo.status_label,
        goal_progress: arm.monthly_goal ? Math.min(100, Math.round((total / arm.monthly_goal) * 100)) : 0,
        records: cur
      };
    });
  }

  function computePartners(periodKey = partnershipPageState.period) {
    const range = periodRange(periodKey);
    const list = getPartnershipFinanceList().filter((r) => inRange(recordDate(r), range.start, range.end));
    const map = new Map();
    list.forEach((r) => {
      const key = contributorKey(r);
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          contributor_id: r.contributor_id || r.partner_id || "",
          contributor_name: r.contributor_name || [r.nome, r.apelido].filter(Boolean).join(" ") || "-",
          phone: r.telefone || r.contributor_phone || r.whatsapp || "",
          email: r.email || r.contributor_email || "",
          church_id: r.church_id || "",
          church_name: r.church_name || r.igreja || "",
          cell_group_id: r.cell_group_id || "",
          cell_group_name: r.cell_group_name || r.grupo_de_celula || "",
          cell_id: r.cell_id || "",
          cell_name: r.cell_name || r.celula || "",
          total_amount: 0,
          donation_count: 0,
          arms_supported: new Set(),
          last_donation_date: "",
          records: []
        });
      }
      const p = map.get(key);
      p.total_amount += amountOf(r);
      p.donation_count += 1;
      p.arms_supported.add(resolveArmName(r));
      p.records.push(r);
      const d = recordDate(r);
      if (d && (!p.last_donation_date || d > p.last_donation_date)) p.last_donation_date = d;
    });
    return [...map.values()]
      .map((p) => {
        const days = daysSince(p.last_donation_date);
        let status = isPt() ? "Activo" : "Active";
        if (p.donation_count <= 1 && days <= 45) status = isPt() ? "Novo" : "New";
        else if (days > 60) status = isPt() ? "Inactivo" : "Inactive";
        else if (days > 30 || p.donation_count < 2) status = isPt() ? "Precisa de Acompanhamento" : "Needs Follow-Up";
        return {
          ...p,
          arms_supported: [...p.arms_supported],
          status
        };
      })
      .sort((a, b) => b.total_amount - a.total_amount);
  }

  function partnershipAccess() {
    const role = (typeof activeUser !== "undefined" && activeUser?.role) || "";
    const canView = typeof canEnterRoute === "function" ? canEnterRoute("partnership") : true;
    const canEdit =
      ["Super Admin", "National Admin", "Partnership Coordinator"].includes(role);
    const canExport =
      canEdit ||
      ["Main Pastor", "Finance Head", "Finance Officer", "Church Pastor"].includes(role);
    return { canView, canEdit, canExport, role };
  }

  function tabDefs() {
    return [
      ["overview", isPt() ? "Visão Geral" : "Overview"],
      ["arms", isPt() ? "Braços de Parceria" : "Partnership Arms"],
      ["partners", isPt() ? "Parceiros" : "Partners"],
      ["contributions", isPt() ? "Contribuições" : "Contributions"],
      ["highlights", isPt() ? "Destaques" : "Highlights"],
      ["analytics", isPt() ? "Análise" : "Analytics"],
      ["reports", isPt() ? "Relatórios" : "Reports"],
      ["exports", isPt() ? "Exportações" : "Exports"]
    ];
  }

  function tabsHtml() {
    return `<div class="view-toggle light-surface mb-3 partnership-tabs" role="tablist">${tabDefs()
      .map(
        ([key, label]) =>
          `<button type="button" class="view-toggle-btn ${partnershipPageState.tab === key ? "active" : ""}" data-partnership-tab="${key}">${label}</button>`
      )
      .join("")}</div>`;
  }

  function moneyFmt(n) {
    return typeof money === "function" ? money(n) : `${Number(n || 0).toFixed(0)} MZN`;
  }

  function badgeHtml(label, tone = "") {
    if (typeof badge === "function") return badge(label);
    return `<span class="badge ${tone}">${label}</span>`;
  }

  function armLogoHtml(arm) {
    if (arm.logo_url) {
      return `<img src="${arm.logo_url}" alt="${arm.name}" class="partnership-arm-logo">`;
    }
    const initials = String(arm.name || "?")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();
    return `<div class="partnership-arm-placeholder" title="${isPt() ? "Logotipo pendente" : "Logo pending"}"><i class="bi ${arm.icon || "bi-stars"}"></i><span>${initials}</span></div>`;
  }

  function summaryCardsHtml(arms, partners) {
    const total = arms.reduce((s, a) => s + a.total_amount, 0);
    const donors = partners.length;
    const byDonors = [...arms].sort((a, b) => b.donor_count - a.donor_count)[0];
    const byValue = [...arms].sort((a, b) => b.total_amount - a.total_amount)[0];
    const byLow = [...arms].filter((a) => a.is_active !== false).sort((a, b) => a.total_amount - b.total_amount)[0];
    const needsPromo = arms.filter((a) => a.needs_promotion).length;
    const newPartners = partners.filter((p) => /Novo|New/i.test(p.status)).length;
    const pending = getPendingPartnershipCount();
    const cards = [
      { icon: "bi-cash-coin", label: isPt() ? "Total Recebido em Parcerias" : "Total Partnership Income", value: moneyFmt(total), tab: "contributions" },
      { icon: "bi-people", label: isPt() ? "Total de Dadores" : "Total Donors", value: donors, tab: "partners" },
      { icon: "bi-person-hearts", label: isPt() ? "Braço com Mais Dadores" : "Arm with Most Donors", value: byDonors?.name || "-", tab: "arms", armId: byDonors?.id },
      { icon: "bi-trophy", label: isPt() ? "Braço com Maior Valor" : "Highest Value Arm", value: byValue?.name || "-", tab: "arms", armId: byValue?.id },
      { icon: "bi-graph-down", label: isPt() ? "Braço com Menor Valor" : "Lowest Value Arm", value: byLow?.name || "-", tab: "arms", armId: byLow?.id },
      { icon: "bi-megaphone", label: isPt() ? "Braços que Precisam de Promoção" : "Arms Needing Promotion", value: needsPromo, tab: "highlights" },
      { icon: "bi-person-plus", label: isPt() ? "Novos Parceiros Este Mês" : "New Partners This Month", value: newPartners, tab: "partners" },
      { icon: "bi-hourglass-split", label: isPt() ? "Contribuições Pendentes de Verificação" : "Pending Verification", value: pending, route: "finance" }
    ];
    const metricFn = typeof metric === "function" ? metric : null;
    if (metricFn) {
      return `<div class="row g-3 summary-cards-row mb-4">${cards
        .map(
          (c) =>
            `<div class="col-6 col-md-4 col-xl-3"><button type="button" class="w-100 border-0 bg-transparent p-0 text-start" data-partnership-jump="${c.tab || ""}" data-partnership-arm="${c.armId || ""}" data-partnership-route="${c.route || ""}">${metricFn(c.icon, c.label, c.value, isPt() ? "Parcerias" : "Partnerships")}</button></div>`
        )
        .join("")}</div>`;
    }
    return `<div class="row g-3 mb-4">${cards
      .map(
        (c) => `<div class="col-6 col-md-3"><article class="record-card data-card"><span class="eyebrow">${c.label}</span><h3>${c.value}</h3></article></div>`
      )
      .join("")}</div>`;
  }

  function armCardsHtml(arms) {
    const access = partnershipAccess();
    return `<div class="row g-3 partnership-arm-grid">${arms
      .map((arm) => {
        const promoBadge = arm.needs_promotion
          ? `<span class="badge badge-promo">${isPt() ? "Precisa de Promoção" : "Needs Promotion"}</span>`
          : badgeHtml(arm.status_label);
        return `
      <div class="col-12 col-md-6 col-xl-4">
        <article class="panel glass-panel partnership-arm-card h-100" data-arm-id="${arm.id}">
          <div class="partnership-arm-card-head">
            ${armLogoHtml(arm)}
            <div>
              <span class="eyebrow">${isPt() ? "Braço de Parceria" : "Partnership Arm"}</span>
              <h3 class="mb-1">${arm.name}</h3>
              ${promoBadge}
            </div>
          </div>
          <p class="text-secondary small">${arm.description || ""}</p>
          <div class="partnership-arm-stats">
            <div><span>${isPt() ? "Total" : "Total"}</span><strong>${moneyFmt(arm.total_amount)}</strong></div>
            <div><span>${isPt() ? "Dadores" : "Donors"}</span><strong>${arm.donor_count}</strong></div>
            <div><span>${isPt() ? "Média" : "Average"}</span><strong>${moneyFmt(arm.average_donation)}</strong></div>
            <div><span>${isPt() ? "Maior" : "Largest"}</span><strong>${moneyFmt(arm.max_donation)}</strong></div>
            <div><span>${isPt() ? "Última" : "Last"}</span><strong>${arm.last_donation_date || "-"}</strong></div>
            <div><span>${isPt() ? "Crescimento" : "Growth"}</span><strong>${arm.growth_percent > 0 ? "+" : ""}${arm.growth_percent}%</strong></div>
          </div>
          <div class="progress partnership-goal-bar mb-3" role="progressbar" aria-valuenow="${arm.goal_progress}">
            <div class="progress-bar" style="width:${arm.goal_progress}%"></div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-sm btn-ce-gold" data-partnership-arm-detail="${arm.id}"><i class="bi bi-eye me-1"></i>${isPt() ? "Ver Detalhes" : "View Details"}</button>
            <button type="button" class="btn btn-sm btn-outline-cyan" data-partnership-arm-partners="${arm.id}"><i class="bi bi-people me-1"></i>${isPt() ? "Ver Parceiros" : "View Partners"}</button>
            <button type="button" class="btn btn-sm btn-outline-cyan" data-partnership-arm-report="${arm.id}"><i class="bi bi-bar-chart me-1"></i>${isPt() ? "Ver Relatório" : "View Report"}</button>
          </div>
        </article>
      </div>`;
      })
      .join("")}</div>`;
  }

  function partnersTableHtml(partners) {
    const rows = partners.map((p) => [
      p.contributor_name,
      typeof churchName === "function" ? churchName(p.church_id) : p.church_name || p.church_id || "-",
      p.cell_name || "-",
      p.arms_supported.join(", ") || "-",
      moneyFmt(p.total_amount),
      p.donation_count,
      p.last_donation_date || "-",
      badgeHtml(p.status)
    ]);
    if (typeof dataTable === "function") {
      return dataTable(
        [
          isPt() ? "Nome" : "Name",
          isPt() ? "Igreja" : "Church",
          isPt() ? "Célula" : "Cell",
          isPt() ? "Braços apoiados" : "Arms supported",
          isPt() ? "Total contribuído" : "Total given",
          isPt() ? "Nº contribuições" : "Gifts",
          isPt() ? "Última contribuição" : "Last gift",
          isPt() ? "Estado" : "Status"
        ],
        rows
      );
    }
    return `<p>${partners.length} partners</p>`;
  }

  function contributionsTableHtml(records) {
    const filtered = records.filter((r) => {
      if (partnershipPageState.armId && resolveArmId(r) !== partnershipPageState.armId) return false;
      if (partnershipPageState.churchId && r.church_id !== partnershipPageState.churchId) return false;
      if (partnershipPageState.methodFilter) {
        const m = r.payment_method || r.metodo_de_pagamento || "";
        if (m !== partnershipPageState.methodFilter) return false;
      }
      const amt = amountOf(r);
      if (partnershipPageState.minAmount !== "" && amt < Number(partnershipPageState.minAmount)) return false;
      if (partnershipPageState.maxAmount !== "" && amt > Number(partnershipPageState.maxAmount)) return false;
      if (partnershipPageState.partnerQuery) {
        const q = partnershipPageState.partnerQuery.toLowerCase();
        const name = (r.contributor_name || [r.nome, r.apelido].join(" ")).toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
    const rows = filtered.slice(0, 200).map((r) => [
      recordDate(r) || "-",
      r.contributor_name || [r.nome, r.apelido].filter(Boolean).join(" ") || "-",
      typeof churchName === "function" ? churchName(r.church_id) : r.church_name || "-",
      r.cell_group_name || r.grupo_de_celula || "-",
      r.cell_name || r.celula || "-",
      resolveArmName(r),
      moneyFmt(amountOf(r)),
      r.payment_method || r.metodo_de_pagamento || "-",
      badgeHtml(r.estado || r.status || "Verified"),
      r.source || r.source_type || "-",
      r.proof_file_name || r.imagem_envelope_ou_pop ? (isPt() ? "Sim" : "Yes") : "-",
      typeof actionButtons === "function"
        ? actionButtons([["view", "finance", r.id, isPt() ? "Ver" : "View"]])
        : ""
    ]);
    return typeof dataTable === "function"
      ? dataTable(
          [
            isPt() ? "Data" : "Date",
            isPt() ? "Parceiro" : "Partner",
            isPt() ? "Igreja" : "Church",
            isPt() ? "Grupo de Célula" : "Cell Group",
            isPt() ? "Célula" : "Cell",
            isPt() ? "Braço" : "Arm",
            isPt() ? "Valor" : "Amount",
            isPt() ? "Método" : "Method",
            isPt() ? "Estado" : "Status",
            isPt() ? "Origem" : "Source",
            isPt() ? "Comprovativo" : "Proof",
            isPt() ? "Acções" : "Actions"
          ],
          rows
        )
      : `<p>${filtered.length}</p>`;
  }

  function highlightsHtml(arms, partners) {
    const mostDonors = [...arms].sort((a, b) => b.donor_count - a.donor_count)[0];
    const mostValue = [...arms].sort((a, b) => b.total_amount - a.total_amount)[0];
    const mostGrowth = [...arms].sort((a, b) => b.growth_percent - a.growth_percent)[0];
    const least = [...arms].sort((a, b) => a.total_amount - b.total_amount)[0];
    const noRecent = arms.filter((a) => a.days_since_last_donation > 30 || !a.last_donation_date);
    const topPartner = partners[0];
    const promote = arms.filter((a) => a.needs_promotion);
    const items = [
      [isPt() ? "Braço com mais dadores" : "Most donors", mostDonors?.name || "-", `${mostDonors?.donor_count || 0}`],
      [isPt() ? "Maior valor recebido" : "Highest value", mostValue?.name || "-", moneyFmt(mostValue?.total_amount || 0)],
      [isPt() ? "Maior crescimento" : "Highest growth", mostGrowth?.name || "-", `${mostGrowth?.growth_percent || 0}%`],
      [isPt() ? "Menor contribuição" : "Lowest contribution", least?.name || "-", moneyFmt(least?.total_amount || 0)],
      [isPt() ? "Sem contribuição recente" : "No recent gifts", String(noRecent.length), noRecent.map((a) => a.name).slice(0, 3).join(", ") || "-"],
      [isPt() ? "Parceiro em destaque" : "Featured partner", topPartner?.contributor_name || "-", moneyFmt(topPartner?.total_amount || 0)],
      [isPt() ? "Braços a promover esta semana" : "Promote this week", String(promote.length), promote.map((a) => a.name).slice(0, 4).join(", ") || "-"]
    ];
    return `<div class="row g-3">${items
      .map(
        ([title, value, sub]) => `
      <div class="col-12 col-md-6 col-xl-4">
        <article class="panel glass-panel h-100">
          <span class="eyebrow">${title}</span>
          <h3 class="mt-2">${value}</h3>
          <p class="text-secondary mb-0 small">${sub}</p>
        </article>
      </div>`
      )
      .join("")}</div>`;
  }

  function analyticsHtml(arms, partners) {
    const byValue = arms.map((a) => [a.name, a.total_amount]);
    const byDonors = arms.map((a) => [a.name, a.donor_count]);
    const topPartners = partners.slice(0, 10).map((p) => [p.contributor_name, p.total_amount]);
    const promote = arms.filter((a) => a.needs_promotion).map((a) => [a.name, a.total_amount]);
    const chart = typeof chartCard === "function" ? chartCard : null;
    if (!chart) {
      return partnersTableHtml(partners.slice(0, 10));
    }
    return `
      <div class="row g-4">
        <div class="col-xl-6">${chart(isPt() ? "Valor por Braço de Parceria" : "Value by Partnership Arm", byValue)}</div>
        <div class="col-xl-6">${chart(isPt() ? "Dadores por Braço" : "Donors by Arm", byDonors)}</div>
        <div class="col-xl-6">${chart(isPt() ? "Top Parceiros" : "Top Partners", topPartners)}</div>
        <div class="col-xl-6">${chart(isPt() ? "Braços que Precisam de Promoção" : "Arms Needing Promotion", promote.length ? promote : [[isPt() ? "Nenhum" : "None", 0]])}</div>
      </div>`;
  }

  function reportsHtml(arms, partners) {
    const access = partnershipAccess();
    const reports = [
      isPt() ? "Relatório geral de Parcerias" : "General Partnerships Report",
      isPt() ? "Relatório por braço" : "Report by arm",
      isPt() ? "Top parceiros" : "Top partners",
      isPt() ? "Braços que precisam de promoção" : "Arms needing promotion",
      isPt() ? "Contribuições por período" : "Contributions by period",
      isPt() ? "Parceiros por igreja" : "Partners by church",
      isPt() ? "Parcerias por célula" : "Partnerships by cell"
    ];
    return `<div class="row g-3">${reports
      .map(
        (title) => `
      <div class="col-md-6">
        <article class="panel glass-panel d-flex justify-content-between align-items-center gap-3">
          <div>
            <h3 class="h5 mb-1">${title}</h3>
            <p class="text-secondary small mb-0">${isPt() ? "Baseado em financeRecords verificados." : "Based on verified financeRecords."}</p>
          </div>
          ${access.canExport ? `<button type="button" class="btn btn-sm btn-ce-gold" data-partnership-export="report">${isPt() ? "Exportar" : "Export"}</button>` : ""}
        </article>
      </div>`
      )
      .join("")}</div>
      <div class="mt-4 panel glass-panel">
        <h3 class="h5">${isPt() ? "Resumo do período" : "Period summary"}</h3>
        <p class="mb-0">${isPt() ? "Total" : "Total"}: <strong>${moneyFmt(arms.reduce((s, a) => s + a.total_amount, 0))}</strong> ·
        ${isPt() ? "Parceiros" : "Partners"}: <strong>${partners.length}</strong> ·
        ${isPt() ? "Braços activos com doações" : "Arms with gifts"}: <strong>${arms.filter((a) => a.total_amount > 0).length}</strong></p>
      </div>`;
  }

  function exportsHtml() {
    const access = partnershipAccess();
    if (!access.canExport) {
      return `<div class="alert alert-info">${isPt() ? "Sem permissão de exportação." : "No export permission."}</div>`;
    }
    const formats = [
      ["csv", "CSV"],
      ["excel", isPt() ? "Excel" : "Excel"],
      ["pdf", "PDF"],
      ["print", isPt() ? "Imprimir" : "Print"]
    ];
    return `<div class="d-flex flex-wrap gap-2">${formats
      .map(
        ([key, label]) =>
          `<button type="button" class="btn btn-ce-gold" data-partnership-export="${key}"><i class="bi bi-download me-1"></i>${label}</button>`
      )
      .join("")}</div>
      <p class="text-secondary small mt-3 mb-0">${isPt() ? "Exporta contribuições de parceria verificadas do período actual." : "Exports verified partnership contributions for the current period."}</p>`;
  }

  function openArmDetail(armId) {
    const arms = computeArmAnalytics();
    const arm = arms.find((a) => a.id === armId);
    if (!arm) return;
    const partners = computePartners().filter((p) => p.arms_supported.includes(arm.name));
    const modalTitle = typeof byId === "function" ? byId("modalTitle") : null;
    const modalFields = typeof byId === "function" ? byId("modalFields") : null;
    const modalEyebrow = typeof byId === "function" ? byId("modalEyebrow") : null;
    if (!modalFields) return;
    if (modalEyebrow) modalEyebrow.textContent = isPt() ? "Braço de Parceria" : "Partnership Arm";
    if (modalTitle) modalTitle.textContent = arm.name;
    modalFields.innerHTML = `
      <div class="col-12">
        <div class="d-flex gap-3 align-items-center mb-3">
          ${armLogoHtml(arm)}
          <div>
            <p class="mb-1 text-secondary">${arm.description || ""}</p>
            ${arm.needs_promotion ? `<span class="badge badge-promo">${isPt() ? "Precisa de Promoção" : "Needs Promotion"}</span>` : badgeHtml(arm.status_label)}
          </div>
        </div>
        <div class="public-confirm-grid mb-3">
          <div><span>${isPt() ? "Total recebido" : "Total received"}</span><strong>${moneyFmt(arm.total_amount)}</strong></div>
          <div><span>${isPt() ? "Dadores" : "Donors"}</span><strong>${arm.donor_count}</strong></div>
          <div><span>${isPt() ? "Média" : "Average"}</span><strong>${moneyFmt(arm.average_donation)}</strong></div>
          <div><span>${isPt() ? "Maior doação" : "Largest gift"}</span><strong>${moneyFmt(arm.max_donation)}</strong></div>
          <div><span>${isPt() ? "Última doação" : "Last gift"}</span><strong>${arm.last_donation_date || "-"}</strong></div>
          <div><span>${isPt() ? "Meta mensal" : "Monthly goal"}</span><strong>${moneyFmt(arm.monthly_goal)} (${arm.goal_progress}%)</strong></div>
        </div>
        <h4 class="h6">${isPt() ? "Parceiros deste braço" : "Partners for this arm"}</h4>
        ${partnersTableHtml(partners.slice(0, 20))}
        <h4 class="h6 mt-3">${isPt() ? "Contribuições recentes" : "Recent contributions"}</h4>
        ${contributionsTableHtml(arm.records.slice(0, 30))}
      </div>`;
    if (typeof bootstrap !== "undefined" && byId("entryModal")) {
      bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
    }
  }

  function exportData(format) {
    const range = periodRange(partnershipPageState.period);
    const list = getPartnershipFinanceList().filter((r) => inRange(recordDate(r), range.start, range.end));
    if (format === "print") {
      window.print();
      return;
    }
    const headers = ["date", "partner", "church", "arm", "amount", "method", "status", "source"];
    const lines = [headers.join(",")].concat(
      list.map((r) =>
        [
          recordDate(r),
          JSON.stringify(r.contributor_name || ""),
          JSON.stringify(r.church_name || r.igreja || ""),
          JSON.stringify(resolveArmName(r)),
          amountOf(r),
          JSON.stringify(r.payment_method || r.metodo_de_pagamento || ""),
          JSON.stringify(r.status || r.estado || ""),
          JSON.stringify(r.source || "")
        ].join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parcerias-${range.start}-${format === "excel" ? "xlsx" : "csv"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderPartnerships(tab) {
    if (tab) partnershipPageState.tab = tab;
    if (typeof canEnterRoute === "function" && !canEnterRoute("partnership")) {
      if (typeof renderAccessDenied === "function") return renderAccessDenied();
    }
    const arms = computeArmAnalytics();
    const partners = computePartners();
    const range = periodRange(partnershipPageState.period);
    const contributions = getPartnershipFinanceList().filter((r) =>
      inRange(recordDate(r), range.start, range.end)
    );

    let body = "";
    switch (partnershipPageState.tab) {
      case "arms":
        body = armCardsHtml(arms);
        break;
      case "partners":
        body = partnersTableHtml(partners);
        break;
      case "contributions":
        body = `
          <div class="filter-toolbar light-surface mb-3 d-flex flex-wrap gap-2">
            <select class="form-select" style="max-width:12rem" data-partnership-filter="armId">
              <option value="">${isPt() ? "Todos os braços" : "All arms"}</option>
              ${getArms().map((a) => `<option value="${a.id}" ${partnershipPageState.armId === a.id ? "selected" : ""}>${a.name}</option>`).join("")}
            </select>
            <input class="form-control" style="max-width:12rem" placeholder="${isPt() ? "Parceiro…" : "Partner…"}" data-partnership-filter="partnerQuery" value="${partnershipPageState.partnerQuery || ""}">
            <input class="form-control" style="max-width:8rem" type="number" min="0" placeholder="${isPt() ? "Mín." : "Min"}" data-partnership-filter="minAmount" value="${partnershipPageState.minAmount || ""}">
            <input class="form-control" style="max-width:8rem" type="number" min="0" placeholder="${isPt() ? "Máx." : "Max"}" data-partnership-filter="maxAmount" value="${partnershipPageState.maxAmount || ""}">
          </div>
          ${contributionsTableHtml(contributions)}`;
        break;
      case "highlights":
        body = highlightsHtml(arms, partners);
        break;
      case "analytics":
        body = analyticsHtml(arms, partners);
        break;
      case "reports":
        body = reportsHtml(arms, partners);
        break;
      case "exports":
        body = exportsHtml();
        break;
      default:
        body = `${summaryCardsHtml(arms, partners)}${armCardsHtml(arms.slice(0, 6))}
          <div class="mt-4"><h3 class="h5">${isPt() ? "Top parceiros" : "Top partners"}</h3>${partnersTableHtml(partners.slice(0, 8))}</div>`;
    }

    const header =
      typeof sectionHeader === "function"
        ? sectionHeader(
            isPt() ? "Parcerias" : "Partnerships",
            isPt()
              ? "Visão analítica sobre contribuições de parceria verificadas em Finanças. Loveworld SAT é um braço, não um departamento."
              : "Analytics over verified partnership contributions from Finance. Loveworld SAT is a partnership arm, not a department.",
            null,
            "bi-stars"
          )
        : `<h1>${isPt() ? "Parcerias" : "Partnerships"}</h1>`;

    const periodSelect = `
      <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <label class="small fw-bold mb-0">${isPt() ? "Período" : "Period"}</label>
        <select class="form-select form-select-sm" style="max-width:10rem" data-partnership-filter="period">
          <option value="month" ${partnershipPageState.period === "month" ? "selected" : ""}>${isPt() ? "Este mês" : "This month"}</option>
          <option value="quarter" ${partnershipPageState.period === "quarter" ? "selected" : ""}>${isPt() ? "Trimestre" : "Quarter"}</option>
          <option value="year" ${partnershipPageState.period === "year" ? "selected" : ""}>${isPt() ? "Ano" : "Year"}</option>
        </select>
        <span class="small text-secondary">${isPt() ? "Fonte: financeRecords verificados (income)" : "Source: verified financeRecords (income)"}</span>
      </div>`;

    if (typeof setPageContent === "function") {
      setPageContent(`${header}${tabsHtml()}${periodSelect}<div class="partnership-body">${body}</div>`);
    }
  }

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("click", (event) => {
      const tabBtn = event.target.closest("[data-partnership-tab]");
      if (tabBtn) {
        partnershipPageState.tab = tabBtn.getAttribute("data-partnership-tab") || "overview";
        renderPartnerships();
        return;
      }
      const jump = event.target.closest("[data-partnership-jump]");
      if (jump) {
        const route = jump.getAttribute("data-partnership-route");
        if (route && typeof setRoute === "function") {
          setRoute(route);
          return;
        }
        const tab = jump.getAttribute("data-partnership-jump");
        const armId = jump.getAttribute("data-partnership-arm");
        if (armId) partnershipPageState.armId = armId;
        if (tab) partnershipPageState.tab = tab;
        renderPartnerships();
        return;
      }
      const detail = event.target.closest("[data-partnership-arm-detail]");
      if (detail) {
        openArmDetail(detail.getAttribute("data-partnership-arm-detail"));
        return;
      }
      const armPartners = event.target.closest("[data-partnership-arm-partners]");
      if (armPartners) {
        partnershipPageState.armId = armPartners.getAttribute("data-partnership-arm-partners") || "";
        partnershipPageState.tab = "partners";
        renderPartnerships();
        return;
      }
      const armReport = event.target.closest("[data-partnership-arm-report]");
      if (armReport) {
        partnershipPageState.armId = armReport.getAttribute("data-partnership-arm-report") || "";
        partnershipPageState.tab = "reports";
        renderPartnerships();
        return;
      }
      const exp = event.target.closest("[data-partnership-export]");
      if (exp) {
        exportData(exp.getAttribute("data-partnership-export") || "csv");
      }
    });

    document.addEventListener("change", (event) => {
      const filter = event.target.closest("[data-partnership-filter]");
      if (!filter) return;
      const key = filter.getAttribute("data-partnership-filter");
      partnershipPageState[key] = filter.value;
      renderPartnerships();
    });
  }

  global.PARTNERSHIP_ARMS_SEED = PARTNERSHIP_ARMS_SEED;
  global.partnershipPageState = partnershipPageState;
  global.renderPartnerships = renderPartnerships;
  global.getPartnershipArmPromotionStatus = getPartnershipArmPromotionStatus;
  global.getVerifiedPartnershipRecords = getPartnershipFinanceList;
  global.computePartnershipArmAnalytics = computeArmAnalytics;
  global.computePartnershipPartners = computePartners;
  global.isPartnershipFinanceRecord = isPartnershipRecord;
  global.CEPartnerships = {
    getArms,
    getPartnershipFinanceList,
    computeArmAnalytics,
    computePartners,
    getPartnershipArmPromotionStatus,
    render: renderPartnerships
  };
})(typeof window !== "undefined" ? window : globalThis);
