/**
 * Finance module — taxonomy, filters, reports, charts (frontend-first).
 */
const FINANCE_GENERAL_CATEGORIES = [
  "Dízimo", "Ofertas", "Acção de Graças", "Primícias", "Semente de Fé", "Ofertas Especiais", "Outros"
];

const FINANCE_PARTNERSHIP_ARMS = [
  "Escola de Cura",
  "Rapsódia de Realidades",
  "Loveworld SAT",
  "Construtores de Visão",
  "Missões de Cidades do Interior",
  "Alcançar Moçambique",
  "Projecto da Igreja",
  "Projecto de Construção de Igreja",
  "Rapsódias das Crianças",
  "Mandato de Célula",
  "Outros Braços"
];

const FINANCE_CONTRIBUTION_GROUPS = ["Geral", "Parceria", "Projecto", "Missões", "Outros"];

const FINANCE_CATEGORY_ALIASES = {
  "Dízimos": "Dízimo",
  "LoveWorld SAT": "Loveworld SAT",
  "Missões no Interior das Cidades": "Missões de Cidades do Interior",
  "Projectos Locais": "Projecto da Igreja",
  "Parcerias": "Ofertas Especiais",
  "Outros": "Outros"
};

const FINANCE_REPORT_CATEGORY_BUCKETS = [
  { key: "tithe", labelKey: "financeReportTithe", match: ["Dízimo"] },
  { key: "offerings", labelKey: "financeReportOfferings", match: ["Ofertas", "Acção de Graças", "Ofertas Especiais"] },
  { key: "partnerships", labelKey: "financeReportPartnerships", groups: ["Parceria", "Projecto", "Missões"] },
  { key: "firstfruits", labelKey: "financeReportFirstfruits", match: ["Primícias"] },
  { key: "seed", labelKey: "financeReportSeed", match: ["Semente de Fé"] },
  { key: "other", labelKey: "financeReportOther", match: ["Outros", "Outros Braços"], groups: ["Outros"] }
];

function normalizeFinanceCategory(raw) {
  const value = String(raw || "").trim();
  if (!value) return "Outros";
  return FINANCE_CATEGORY_ALIASES[value] || value;
}

function classifyFinanceCategory(rawCategory) {
  const category = normalizeFinanceCategory(rawCategory);
  if (FINANCE_GENERAL_CATEGORIES.includes(category)) {
    return { contribution_group: "Geral", contribution_category: category, partnership_arm: "" };
  }
  if (FINANCE_PARTNERSHIP_ARMS.includes(category)) {
    let group = "Parceria";
    if (category.includes("Projecto")) group = "Projecto";
    if (category.includes("Missões") || category === "Alcançar Moçambique") group = "Missões";
    return { contribution_group: group, contribution_category: category, partnership_arm: category };
  }
  if (/projecto/i.test(category)) {
    return { contribution_group: "Projecto", contribution_category: category, partnership_arm: category };
  }
  if (/miss/i.test(category) || /alcançar/i.test(category)) {
    return { contribution_group: "Missões", contribution_category: category, partnership_arm: category };
  }
  return { contribution_group: "Outros", contribution_category: category, partnership_arm: "" };
}

function enrichFinanceRecord(record) {
  if (!record) return record;
  const category = normalizeFinanceCategory(record.contribution_category || record.categoria_da_contribuicao);
  const classified = classifyFinanceCategory(category);
  const nome = record.nome || "";
  const apelido = record.apelido || "";
  return {
    ...record,
    contribution_category: classified.contribution_category,
    categoria_da_contribuicao: classified.contribution_category,
    contribution_group: record.contribution_group || classified.contribution_group,
    partnership_arm: record.partnership_arm || classified.partnership_arm,
    contributor_name: record.contributor_name || `${nome} ${apelido}`.trim(),
    amount: Number(record.amount ?? record.valor ?? 0),
    valor: Number(record.valor ?? record.amount ?? 0),
    payment_method: record.payment_method || record.metodo_de_pagamento || "",
    metodo_de_pagamento: record.metodo_de_pagamento || record.payment_method || "",
    cell_id: record.cell_id || "",
    date: record.date || record.data_da_transferencia || record.data || ""
  };
}

function financeRecordDate(record) {
  return record.date || record.data_da_transferencia || record.data || "";
}

function financeContributorKey(record) {
  if (record.contributor_id) return `contrib-${record.contributor_id}`;
  if (record.member_id) return `member-${record.member_id}`;
  if (record.partner_id) return `partner-${record.partner_id}`;
  const phone = String(record.telefone || record.whatsapp || "").replace(/\D/g, "");
  const name = String(record.contributor_name || `${record.nome || ""} ${record.apelido || ""}`).trim().toLowerCase();
  return phone ? `phone-${phone}` : `name-${name}`;
}

function getFinancePeriodRange(period, dateFrom = "", dateTo = "") {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const fmt = (d) => d.toISOString().slice(0, 10);

  if (period === "custom" && dateFrom && dateTo) return { from: dateFrom, to: dateTo };
  if (period === "today") return { from: today, to: today };
  if (period === "week") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    return { from: fmt(startOfDay(monday)), to: today };
  }
  if (period === "month") return { from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`, to: today };
  if (period === "quarter") {
    const qMonth = Math.floor(now.getMonth() / 3) * 3;
    return { from: `${now.getFullYear()}-${String(qMonth + 1).padStart(2, "0")}-01`, to: today };
  }
  if (period === "year") return { from: `${now.getFullYear()}-01-01`, to: today };
  return { from: "", to: "" };
}

function getPreviousPeriodRange(period, dateFrom, dateTo) {
  const current = getFinancePeriodRange(period, dateFrom, dateTo);
  if (!current.from || !current.to) return { from: "", to: "" };
  const from = new Date(current.from);
  const to = new Date(current.to);
  const days = Math.max(1, Math.round((to - from) / 86400000) + 1);
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - days + 1);
  return { from: prevFrom.toISOString().slice(0, 10), to: prevTo.toISOString().slice(0, 10) };
}

function filterFinanceRecords(records, filters = {}) {
  const range = getFinancePeriodRange(filters.period, filters.dateFrom, filters.dateTo);
  return records.filter((record) => {
    const date = financeRecordDate(record);
    if (range.from && date < range.from) return false;
    if (range.to && date > range.to) return false;
    if (filters.churchId && record.church_id !== filters.churchId) return false;
    if (filters.category && record.contribution_category !== filters.category) return false;
    if (filters.contributionType && record.contribution_group !== filters.contributionType) return false;
    if (filters.partnershipArm && record.partnership_arm !== filters.partnershipArm) return false;
    if (filters.method && record.metodo_de_pagamento !== filters.method) return false;
    if (filters.status && record.estado !== filters.status) return false;
    if (filters.source && typeof financeSourceKey === "function" && financeSourceKey(record) !== filters.source) return false;
    if (filters.cell && record.celula !== filters.cell) return false;
    if (filters.cellGroup && record.grupo_de_celula !== filters.cellGroup) return false;
    if (filters.contributor) {
      const key = financeContributorKey(record);
      const q = String(filters.contributor).toLowerCase();
      const name = String(record.contributor_name || "").toLowerCase();
      const phone = String(record.telefone || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !key.includes(q)) return false;
    }
    return true;
  });
}

function sumFinanceAmount(records) {
  return records.reduce((sum, r) => sum + Number(r.amount ?? r.valor ?? 0), 0);
}

function computeFinanceReportStats(records) {
  const verified = records.filter((r) => String(r.estado).includes("Verificado"));
  const pending = records.filter((r) => String(r.estado).includes("Pendente"));
  const rejected = records.filter((r) => String(r.estado).includes("Rejeitado"));
  const contributors = new Set(records.map(financeContributorKey));
  const total = sumFinanceAmount(records);
  return {
    totalReceived: total,
    totalVerified: sumFinanceAmount(verified),
    totalPending: sumFinanceAmount(pending),
    totalRejected: sumFinanceAmount(rejected),
    contributionCount: records.length,
    uniqueContributors: contributors.size,
    averageContribution: records.length ? total / records.length : 0
  };
}

function bucketFinanceCategory(record) {
  const group = record.contribution_group;
  const cat = record.contribution_category;
  for (const bucket of FINANCE_REPORT_CATEGORY_BUCKETS) {
    if (bucket.groups?.includes(group)) return bucket.key;
    if (bucket.match?.includes(cat)) return bucket.key;
  }
  return "other";
}

function groupFinanceByBucket(records, labelFn) {
  const grouped = {};
  FINANCE_REPORT_CATEGORY_BUCKETS.forEach((b) => { grouped[b.key] = 0; });
  records.forEach((record) => {
    const key = bucketFinanceCategory(record);
    grouped[key] = (grouped[key] || 0) + Number(record.amount ?? record.valor ?? 0);
  });
  return FINANCE_REPORT_CATEGORY_BUCKETS.map((b) => [labelFn(b.labelKey), grouped[b.key] || 0]);
}

function groupFinanceByPartnershipArm(records) {
  const grouped = {};
  FINANCE_PARTNERSHIP_ARMS.forEach((arm) => { grouped[arm] = 0; });
  records.forEach((record) => {
    const arm = record.partnership_arm || (FINANCE_PARTNERSHIP_ARMS.includes(record.contribution_category) ? record.contribution_category : "");
    if (!arm) return;
    grouped[arm] = (grouped[arm] || 0) + Number(record.amount ?? record.valor ?? 0);
  });
  return FINANCE_PARTNERSHIP_ARMS.map((arm) => [arm, grouped[arm] || 0]);
}

function computePartnershipArmDetails(records, previousRecords, labelGrowth) {
  return FINANCE_PARTNERSHIP_ARMS.map((arm) => {
    const current = records.filter((r) => r.partnership_arm === arm || r.contribution_category === arm);
    const previous = previousRecords.filter((r) => r.partnership_arm === arm || r.contribution_category === arm);
    const total = sumFinanceAmount(current);
    const prevTotal = sumFinanceAmount(previous);
    const partners = new Set(current.map(financeContributorKey));
    const growth = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : (total > 0 ? 100 : 0);
    const activePartners = [...partners].map((key) => {
      const rec = current.find((r) => financeContributorKey(r) === key);
      return {
        key,
        name: rec?.contributor_name || "-",
        phone: rec?.telefone || "-",
        total: sumFinanceAmount(current.filter((r) => financeContributorKey(r) === key))
      };
    }).sort((a, b) => b.total - a.total);
    return { arm, total, partnerCount: partners.size, growth, growthLabel: labelGrowth(growth), activePartners };
  }).filter((row) => row.total > 0 || row.partnerCount > 0);
}

function computeContributorProfiles(records) {
  const map = new Map();
  records.forEach((record) => {
    const key = financeContributorKey(record);
    if (!map.has(key)) {
      map.set(key, {
        key,
        name: record.contributor_name || "-",
        phone: record.telefone || "-",
        church_id: record.church_id,
        celula: record.celula || "-",
        grupo_de_celula: record.grupo_de_celula || "-",
        total: 0,
        count: 0,
        categories: new Set(),
        arms: new Set()
      });
    }
    const profile = map.get(key);
    profile.total += Number(record.amount ?? record.valor ?? 0);
    profile.count += 1;
    profile.categories.add(record.contribution_category);
    if (record.partnership_arm) profile.arms.add(record.partnership_arm);
  });
  return [...map.values()].sort((a, b) => b.total - a.total);
}

function financeDonutChart(title, rows, emptyLabel) {
  const total = rows.reduce((sum, [, v]) => sum + Number(v || 0), 0);
  if (!total) {
    return `<article class="chart-card glass-panel finance-chart-card h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-pie-chart me-2 text-info"></i>${title}</h3></div><p class="finance-chart-empty">${emptyLabel}</p></article>`;
  }
  const colors = ["#22d3ee", "#d7ad45", "#60a5fa", "#34d399", "#f472b6", "#a78bfa", "#fb923c", "#94a3b8"];
  let cursor = 0;
  const segments = rows.filter(([, v]) => Number(v) > 0).map(([label, value], index) => {
    const pct = (Number(value) / total) * 100;
    const color = colors[index % colors.length];
    const start = cursor;
    cursor += pct;
    return { label, value, pct, color, start, end: cursor };
  });
  const gradient = segments.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(", ");
  const legend = segments.map((s) => `
    <div class="finance-donut-legend-item">
      <span class="finance-donut-swatch" style="background:${s.color}"></span>
      <span class="finance-donut-legend-label">${s.label}</span>
      <strong>${Math.round(s.pct)}%</strong>
      <span class="finance-donut-legend-value">${Number(s.value).toLocaleString()}</span>
    </div>`).join("");
  return `
    <article class="chart-card glass-panel finance-chart-card h-100">
      <div class="panel-head"><h3 class="panel-title"><i class="bi bi-pie-chart me-2 text-info"></i>${title}</h3></div>
      <div class="finance-donut-wrap">
        <div class="finance-donut" style="background:conic-gradient(${gradient})">
          <div class="finance-donut-hole"><strong>${total.toLocaleString()}</strong><span>MT</span></div>
        </div>
        <div class="finance-donut-legend">${legend}</div>
      </div>
    </article>`;
}

function financeBarChart(title, rows, emptyLabel) {
  const max = Math.max(...rows.map((r) => Number(r[1] || 0)), 1);
  const bars = rows.length && rows.some(([, v]) => Number(v) > 0)
    ? rows.map(([label, value]) => `
      <div class="chart-row finance-chart-row">
        <span class="finance-chart-label" title="${label}">${label}</span>
        <div class="chart-track"><div class="chart-fill finance-chart-fill" style="width:${Math.max(4, Math.round((Number(value) / max) * 100))}%"></div></div>
        <strong class="finance-chart-value">${Number(value).toLocaleString()}</strong>
      </div>`).join("")
    : `<p class="finance-chart-empty">${emptyLabel}</p>`;
  return `<article class="chart-card glass-panel finance-chart-card h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-bar-chart me-2 text-info"></i>${title}</h3></div><div class="chart-bars">${bars}</div></article>`;
}

function exportFinanceCsv(records, filename) {
  if (!records.length) return;
  const headers = ["contributor_name", "telefone", "church_id", "celula", "contribution_group", "contribution_category", "partnership_arm", "amount", "payment_method", "status", "source", "date"];
  const rows = records.map((r) => headers.map((h) => {
    const val = h === "amount" ? (r.amount ?? r.valor) : h === "payment_method" ? r.metodo_de_pagamento : h === "status" ? r.estado : h === "source" ? (typeof financeSourceKey === "function" ? financeSourceKey(r) : "") : r[h];
    return `"${String(val ?? "").replace(/"/g, '""')}"`;
  }).join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

const FINANCE_CHART_COLORS = {
  gold: "#d7ad45",
  cyan: "#22d3ee",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa"
};

function financeStatusTone(record) {
  const estado = String(record?.estado || "");
  if (estado.includes("Verificado")) return "verified";
  if (estado.includes("Pendente")) return "pending";
  if (estado.includes("Rejeitado")) return "rejected";
  return "neutral";
}

function computeContributorFrequency(records, periodMonths = 3) {
  if (!records.length) return "none";
  const dates = records.map((r) => financeRecordDate(r)).filter(Boolean).sort();
  const uniqueMonths = new Set(dates.map((d) => d.slice(0, 7)));
  if (records.length === 1) return "occasional";
  if (uniqueMonths.size >= Math.min(periodMonths, 2) && records.length >= 2) return "consistent";
  if (records.length >= 2) return "regular";
  return "occasional";
}

function computeContributorDetail(records, contributorKey) {
  const contributorRecords = records
    .filter((r) => financeContributorKey(r) === contributorKey)
    .sort((a, b) => financeRecordDate(b).localeCompare(financeRecordDate(a)));
  if (!contributorRecords.length) return null;
  const first = contributorRecords[contributorRecords.length - 1];
  const last = contributorRecords[0];
  const categories = [...new Set(contributorRecords.map((r) => r.contribution_category))];
  const arms = [...new Set(contributorRecords.map((r) => r.partnership_arm).filter(Boolean))];
  const verified = contributorRecords.filter((r) => financeStatusTone(r) === "verified");
  const pending = contributorRecords.filter((r) => financeStatusTone(r) === "pending");
  const rejected = contributorRecords.filter((r) => financeStatusTone(r) === "rejected");
  let dominantStatus = "verified";
  if (pending.length >= verified.length && pending.length > 0) dominantStatus = "pending";
  if (rejected.length > verified.length && rejected.length > pending.length) dominantStatus = "rejected";
  return {
    key: contributorKey,
    name: last.contributor_name || "-",
    phone: last.telefone || "-",
    church_id: last.church_id,
    celula: last.celula || "-",
    grupo_de_celula: last.grupo_de_celula || "-",
    total: sumFinanceAmount(contributorRecords),
    count: contributorRecords.length,
    categories,
    arms,
    lastContributionDate: financeRecordDate(last),
    lastContributionAmount: Number(last.amount ?? last.valor ?? 0),
    firstContributionDate: financeRecordDate(first),
    frequency: computeContributorFrequency(contributorRecords),
    dominantStatus,
    history: contributorRecords.map((r) => ({
      id: r.id,
      date: financeRecordDate(r),
      category: r.contribution_category,
      arm: r.partnership_arm || "-",
      method: r.metodo_de_pagamento || "-",
      amount: Number(r.amount ?? r.valor ?? 0),
      status: r.estado,
      statusTone: financeStatusTone(r),
      proof: r.imagem_envelope_ou_pop || r.imagem_do_envelope || ""
    }))
  };
}

function groupFinanceMonthly(records) {
  const grouped = {};
  records.forEach((record) => {
    const date = financeRecordDate(record);
    if (!date) return;
    const month = date.slice(0, 7);
    grouped[month] = (grouped[month] || 0) + Number(record.amount ?? record.valor ?? 0);
  });
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
}

function groupFinanceByChurch(records, churchNameFn) {
  const grouped = {};
  records.forEach((record) => {
    const key = record.church_id || "unknown";
    if (!grouped[key]) {
      grouped[key] = {
        church_id: key,
        church_name: churchNameFn(key),
        total: 0,
        verified: 0,
        pending: 0,
        rejected: 0,
        categories: {}
      };
    }
    const amount = Number(record.amount ?? record.valor ?? 0);
    grouped[key].total += amount;
    const tone = financeStatusTone(record);
    if (tone === "verified") grouped[key].verified += amount;
    else if (tone === "pending") grouped[key].pending += amount;
    else if (tone === "rejected") grouped[key].rejected += amount;
    const cat = record.contribution_category || "Outros";
    grouped[key].categories[cat] = (grouped[key].categories[cat] || 0) + amount;
  });
  return Object.values(grouped)
    .map((row) => ({
      ...row,
      topCategories: Object.entries(row.categories).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, value]) => ({ name, value }))
    }))
    .sort((a, b) => b.total - a.total);
}

function computePartnerProfiles(records, allRecords = records, options = {}) {
  const minValue = Number(options.minValue || 0);
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const periodKeys = new Set(records.map(financeContributorKey));
  const allMap = new Map();

  (allRecords || []).forEach((record) => {
    const key = financeContributorKey(record);
    if (!allMap.has(key)) {
      allMap.set(key, {
        key,
        name: record.contributor_name || "-",
        phone: record.telefone || "-",
        church_id: record.church_id,
        arm: record.partnership_arm || record.contribution_category || "-",
        total: 0,
        periodTotal: 0,
        count: 0,
        periodCount: 0,
        lastDate: "",
        records: [],
        allRecords: []
      });
    }
    const profile = allMap.get(key);
    const amount = Number(record.amount ?? record.valor ?? 0);
    const date = financeRecordDate(record);
    profile.allRecords.push(record);
    profile.total += amount;
    if (!profile.lastDate || date > profile.lastDate) profile.lastDate = date;
    if (record.partnership_arm) profile.arm = record.partnership_arm;
    if (periodKeys.has(key)) {
      profile.periodTotal += amount;
      profile.periodCount += 1;
      profile.records.push(record);
    }
  });

  return [...allMap.values()]
    .map((profile) => {
      const frequency = computeContributorFrequency(profile.allRecords);
      const hasPending = profile.records.some((r) => financeStatusTone(r) === "pending")
        || profile.allRecords.some((r) => financeStatusTone(r) === "pending");
      const firstEver = profile.allRecords.map(financeRecordDate).filter(Boolean).sort()[0] || "";
      const isNew = firstEver.startsWith(monthKey) && profile.allRecords.length <= 2;
      const isInactive = profile.periodCount === 0 && profile.allRecords.length > 0;
      let segment = "top";
      if (hasPending) segment = "followup";
      else if (isInactive) segment = "inactive";
      else if (isNew) segment = "new";
      else if (frequency === "consistent") segment = "consistent";
      return {
        key: profile.key,
        name: profile.name,
        phone: profile.phone,
        church_id: profile.church_id,
        arm: profile.arm,
        total: profile.periodCount ? profile.periodTotal : profile.total,
        count: profile.periodCount || profile.allRecords.length,
        lastDate: profile.lastDate,
        records: profile.periodCount ? profile.records : profile.allRecords.slice(0, 3),
        frequency,
        segment,
        hasPending,
        dominantStatus: hasPending ? "pending" : profile.records.every((r) => financeStatusTone(r) === "verified") ? "verified" : "mixed"
      };
    })
    .filter((p) => p.total >= minValue)
    .sort((a, b) => b.total - a.total);
}

function filterPartnerProfiles(profiles, filters = {}) {
  let list = profiles;
  if (filters.partnershipArm) {
    list = list.filter((p) => p.arm === filters.partnershipArm || p.records.some((r) => r.partnership_arm === filters.partnershipArm));
  }
  if (filters.frequency) list = list.filter((p) => p.frequency === filters.frequency);
  if (filters.status) {
    list = list.filter((p) => p.records.some((r) => String(r.estado) === filters.status));
  }
  if (filters.segment && filters.segment !== "all") {
    if (filters.segment === "top") list = list.slice(0, 10);
    else list = list.filter((p) => p.segment === filters.segment);
  }
  return list;
}

function financeLineChart(title, rows, emptyLabel, color = FINANCE_CHART_COLORS.gold) {
  if (!rows.length || !rows.some(([, v]) => Number(v) > 0)) {
    return `<article class="chart-card glass-panel finance-chart-card h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-graph-up me-2 text-warning"></i>${title}</h3></div><p class="finance-chart-empty">${emptyLabel}</p></article>`;
  }
  const max = Math.max(...rows.map(([, v]) => Number(v)), 1);
  const width = 100;
  const height = 48;
  const step = rows.length > 1 ? width / (rows.length - 1) : 0;
  const points = rows.map(([, value], index) => {
    const x = rows.length > 1 ? index * step : width / 2;
    const y = height - (Number(value) / max) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const labels = rows.map(([label, value], index) => {
    const pct = Math.round((Number(value) / max) * 100);
    return `<div class="finance-line-label" style="--i:${index};--n:${rows.length}"><span>${label.slice(5)}</span><strong>${Number(value).toLocaleString()}</strong></div>`;
  }).join("");
  return `
    <article class="chart-card glass-panel finance-chart-card h-100">
      <div class="panel-head"><h3 class="panel-title"><i class="bi bi-graph-up me-2" style="color:${color}"></i>${title}</h3></div>
      <div class="finance-line-chart">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="finance-line-svg" aria-hidden="true">
          <polygon class="finance-line-area" points="${areaPoints}" fill="${color}" fill-opacity="0.12"></polygon>
          <polyline class="finance-line-stroke" points="${points}" fill="none" stroke="${color}" stroke-width="2.2" vector-effect="non-scaling-stroke"></polyline>
        </svg>
        <div class="finance-line-labels">${labels}</div>
      </div>
    </article>`;
}

function financeHBarChart(title, rows, emptyLabel, color = FINANCE_CHART_COLORS.cyan) {
  const max = Math.max(...rows.map((r) => Number(r[1] || 0)), 1);
  const bars = rows.length && rows.some(([, v]) => Number(v) > 0)
    ? rows.slice(0, 10).map(([label, value]) => `
      <div class="finance-hbar-row">
        <span class="finance-hbar-label" title="${label}">${label}</span>
        <div class="finance-hbar-track"><div class="finance-hbar-fill" style="width:${Math.max(4, Math.round((Number(value) / max) * 100))}%;background:linear-gradient(90deg, ${color}99, ${color})"></div></div>
        <strong class="finance-hbar-value">${Number(value).toLocaleString()}</strong>
      </div>`).join("")
    : `<p class="finance-chart-empty">${emptyLabel}</p>`;
  return `<article class="chart-card glass-panel finance-chart-card h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-bar-chart-steps me-2" style="color:${color}"></i>${title}</h3></div><div class="finance-hbar-chart">${bars}</div></article>`;
}

function financeChurchBarChart(title, churchRows, emptyLabel) {
  const rows = churchRows.map((c) => [c.church_name, c.total]);
  return financeBarChart(title, rows, emptyLabel);
}

function financeSemanticBarChart(title, rows, tone = "cyan", emptyLabel) {
  const colorMap = {
    gold: FINANCE_CHART_COLORS.gold,
    cyan: FINANCE_CHART_COLORS.cyan,
    green: FINANCE_CHART_COLORS.green,
    amber: FINANCE_CHART_COLORS.amber,
    red: FINANCE_CHART_COLORS.red
  };
  const color = colorMap[tone] || FINANCE_CHART_COLORS.cyan;
  const max = Math.max(...rows.map((r) => Number(r[1] || 0)), 1);
  const bars = rows.length && rows.some(([, v]) => Number(v) > 0)
    ? rows.map(([label, value]) => `
      <div class="chart-row finance-chart-row">
        <span class="finance-chart-label" title="${label}">${label}</span>
        <div class="chart-track"><div class="chart-fill finance-chart-fill" style="width:${Math.max(4, Math.round((Number(value) / max) * 100))}%;background:linear-gradient(90deg, ${color}88, ${color})"></div></div>
        <strong class="finance-chart-value">${Number(value).toLocaleString()}</strong>
      </div>`).join("")
    : `<p class="finance-chart-empty">${emptyLabel}</p>`;
  return `<article class="chart-card glass-panel finance-chart-card h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-bar-chart me-2" style="color:${color}"></i>${title}</h3></div><div class="chart-bars">${bars}</div></article>`;
}

function exportFinanceExcel(records, filename, sheetName = "Finance") {
  if (!records.length) return;
  const headers = ["contributor_name", "telefone", "church_id", "contribution_category", "partnership_arm", "amount", "payment_method", "status", "date"];
  const escape = (val) => String(val ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = records.map((r) => headers.map((h) => {
    const val = h === "amount" ? (r.amount ?? r.valor) : h === "payment_method" ? r.metodo_de_pagamento : h === "status" ? r.estado : r[h];
    return `<Cell><Data ss:Type="String">${escape(val)}</Data></Cell>`;
  }).join(""));
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${escape(sheetName)}"><Table>
<Row>${headers.map((h) => `<Cell><Data ss:Type="String">${escape(h)}</Data></Cell>`).join("")}</Row>
${rows.map((row) => `<Row>${row}</Row>`).join("")}
</Table></Worksheet></Workbook>`;
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportFinancePrint(html, title) {
  const win = window.open("", "_blank", "noopener,noreferrer,width=980,height=720");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;background:#fff;color:#122;padding:1.5rem}h1{font-size:1.35rem;margin:0 0 .25rem}p.meta{color:#556;font-size:.85rem}table{width:100%;border-collapse:collapse;margin-top:1rem;font-size:.82rem}th,td{border:1px solid #ccd;padding:.45rem .55rem;text-align:left}th{background:#0b1f3f;color:#fff}.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.65rem;margin:1rem 0}.card{border:1px solid #dde;border-radius:.5rem;padding:.65rem}.card span{display:block;color:#667;font-size:.68rem;text-transform:uppercase}.card strong{font-size:1rem;color:#0b1f3f}@media print{body{padding:.5rem}}</style></head><body>${html}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
}

function exportFinancePdf(html, title) {
  exportFinancePrint(html, title);
}

function financeReportFilterBar(filters, churches, labels) {
  const periodOptions = [
    ["today", labels.periodToday],
    ["week", labels.periodWeek],
    ["month", labels.periodMonth],
    ["quarter", labels.periodQuarter],
    ["year", labels.periodYear],
    ["custom", labels.periodCustom]
  ];
  const allCategories = [...FINANCE_GENERAL_CATEGORIES, ...FINANCE_PARTNERSHIP_ARMS];
  const frequencyOptions = [
    ["", labels.allFrequencies],
    ["consistent", labels.frequencyConsistent],
    ["regular", labels.frequencyRegular],
    ["occasional", labels.frequencyOccasional]
  ];
  return `
    <div class="finance-report-filters filter-toolbar filter-bar mb-3">
      <select class="form-select" data-finance-report-filter="period" aria-label="${labels.period}">
        ${periodOptions.map(([v, l]) => `<option value="${v}" ${filters.period === v ? "selected" : ""}>${l}</option>`).join("")}
      </select>
      <input class="form-control ${filters.period === "custom" ? "" : "d-none"}" type="date" data-finance-report-filter="dateFrom" value="${filters.dateFrom || ""}" aria-label="${labels.from}">
      <input class="form-control ${filters.period === "custom" ? "" : "d-none"}" type="date" data-finance-report-filter="dateTo" value="${filters.dateTo || ""}" aria-label="${labels.to}">
      <select class="form-select" data-finance-report-filter="churchId" aria-label="${labels.church}">
        <option value="">${labels.allChurches}</option>
        ${churches.map((c) => `<option value="${c.id}" ${filters.churchId === c.id ? "selected" : ""}>${c.church_name}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="category" aria-label="${labels.category}">
        <option value="">${labels.allCategories}</option>
        ${allCategories.map((c) => `<option value="${c}" ${filters.category === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="contributionType" aria-label="${labels.contributionType}">
        <option value="">${labels.allTypes}</option>
        ${FINANCE_CONTRIBUTION_GROUPS.map((g) => `<option value="${g}" ${filters.contributionType === g ? "selected" : ""}>${g}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="partnershipArm" aria-label="${labels.partnershipArm}">
        <option value="">${labels.allArms}</option>
        ${FINANCE_PARTNERSHIP_ARMS.map((a) => `<option value="${a}" ${filters.partnershipArm === a ? "selected" : ""}>${a}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="method" aria-label="${labels.method}">
        <option value="">${labels.allMethods}</option>
        ${(window.paymentMethods || ["M-Pesa", "E-Mola", "Banco", "Dinheiro", "Outro"]).map((m) => `<option value="${m}" ${filters.method === m ? "selected" : ""}>${m}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="status" aria-label="${labels.status}">
        <option value="">${labels.allStatuses}</option>
        ${(window.financeStatuses || []).map((s) => `<option value="${s}" ${filters.status === s ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" data-finance-report-filter="source" aria-label="${labels.source}">
        <option value="">${labels.allSources}</option>
        <option value="dashboard" ${filters.source === "dashboard" ? "selected" : ""}>${labels.sourceDashboard}</option>
        <option value="public_website" ${filters.source === "public_website" ? "selected" : ""}>${labels.sourcePublic}</option>
        <option value="imported" ${filters.source === "imported" ? "selected" : ""}>${labels.sourceImported}</option>
      </select>
      <input class="form-control" type="number" min="0" step="100" data-finance-report-filter="minValue" value="${filters.minValue || ""}" placeholder="${labels.minValue}" aria-label="${labels.minValue}">
      <select class="form-select" data-finance-report-filter="frequency" aria-label="${labels.frequency}">
        ${frequencyOptions.map(([v, l]) => `<option value="${v}" ${filters.frequency === v ? "selected" : ""}>${l}</option>`).join("")}
      </select>
      <input class="form-control" type="search" data-finance-report-filter="contributor" value="${filters.contributor || ""}" placeholder="${labels.contributorPlaceholder}" aria-label="${labels.contributor}">
      <input class="form-control" type="text" data-finance-report-filter="cell" value="${filters.cell || ""}" placeholder="${labels.cell}" aria-label="${labels.cell}">
      <input class="form-control" type="text" data-finance-report-filter="cellGroup" value="${filters.cellGroup || ""}" placeholder="${labels.cellGroup}" aria-label="${labels.cellGroup}">
    </div>`;
}

window.FINANCE_GENERAL_CATEGORIES = FINANCE_GENERAL_CATEGORIES;
window.FINANCE_PARTNERSHIP_ARMS = FINANCE_PARTNERSHIP_ARMS;
window.FINANCE_CONTRIBUTION_GROUPS = FINANCE_CONTRIBUTION_GROUPS;
window.enrichFinanceRecord = enrichFinanceRecord;
window.classifyFinanceCategory = classifyFinanceCategory;
window.filterFinanceRecords = filterFinanceRecords;
window.getFinancePeriodRange = getFinancePeriodRange;
window.getPreviousPeriodRange = getPreviousPeriodRange;
window.computeFinanceReportStats = computeFinanceReportStats;
window.groupFinanceByBucket = groupFinanceByBucket;
window.groupFinanceByPartnershipArm = groupFinanceByPartnershipArm;
window.computePartnershipArmDetails = computePartnershipArmDetails;
window.computeContributorProfiles = computeContributorProfiles;
window.financeDonutChart = financeDonutChart;
window.financeBarChart = financeBarChart;
window.financeReportFilterBar = financeReportFilterBar;
window.exportFinanceCsv = exportFinanceCsv;
window.exportFinanceExcel = exportFinanceExcel;
window.exportFinancePrint = exportFinancePrint;
window.exportFinancePdf = exportFinancePdf;
window.financeContributorKey = financeContributorKey;
window.sumFinanceAmount = sumFinanceAmount;
window.FINANCE_CHART_COLORS = FINANCE_CHART_COLORS;
window.financeStatusTone = financeStatusTone;
window.computeContributorFrequency = computeContributorFrequency;
window.computeContributorDetail = computeContributorDetail;
window.groupFinanceMonthly = groupFinanceMonthly;
window.groupFinanceByChurch = groupFinanceByChurch;
window.computePartnerProfiles = computePartnerProfiles;
window.filterPartnerProfiles = filterPartnerProfiles;
window.financeLineChart = financeLineChart;
window.financeHBarChart = financeHBarChart;
window.financeChurchBarChart = financeChurchBarChart;
window.financeSemanticBarChart = financeSemanticBarChart;