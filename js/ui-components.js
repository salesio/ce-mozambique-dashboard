/**
 * CE Mozambique Operations — global UI component library.
 * Uses L() from dashboard.js when available.
 */

function uiT(key, fallback = "") {
  return typeof L === "function" ? L(key) : (fallback || key);
}

function PageShell(content = "", options = {}) {
  const extraClass = options.className || "";
  return `<div class="page-shell ${extraClass}">${content}</div>`;
}

function ModuleHeroCard({ title, subtitle, icon = "bi-stars", eyebrow, modalType, addLabel, moduleNavKey, compact = false, actions = "" } = {}) {
  const label = eyebrow || uiT("titleChurchOps", "CHRIST EMBASSY OPERATIONS");
  const addBtn = modalType
    ? `<button type="button" class="btn btn-ce-gold btn-touch" data-open-form="${modalType}"><i class="bi bi-plus-lg me-2"></i>${addLabel || uiT("add", "Adicionar")}</button>`
    : "";
  const navToggle = moduleNavKey
    ? `<button type="button" class="module-nav-arrow" data-module-nav-toggle="${moduleNavKey}" aria-expanded="true" aria-label="${uiT("sidebarCollapse", "Recolher")}"><i class="bi bi-chevron-up" aria-hidden="true"></i></button>`
    : "";
  return `
    <article class="module-hero-card ${compact ? "module-hero-card--compact" : ""}">
      <div class="module-hero-card-body">
        <div class="module-hero-card-icon"><i class="bi ${icon}"></i></div>
        <div class="module-hero-card-copy">
          <span class="eyebrow">${label}</span>
          <h2 class="module-hero-card-title">${title}</h2>
          ${subtitle ? `<p class="module-hero-card-subtitle">${subtitle}</p>` : ""}
        </div>
      </div>
      <div class="module-hero-card-actions">
        ${actions}
        ${navToggle}
        ${addBtn}
      </div>
    </article>`;
}

function SummaryCard(icon, label, value, hint = "", options = {}) {
  const col = options.colClass || "col-sm-6 col-xl-4 col-xxl-3";
  const tone = options.tone ? ` summary-card--${options.tone}` : "";
  return `
    <div class="${col}">
      <article class="summary-card metric-card${tone}">
        <div class="summary-card-icon metric-icon"><i class="bi ${icon}"></i></div>
        <div class="summary-card-body">
          <span class="summary-card-label">${label}</span>
          <strong class="summary-card-value">${value}</strong>
          ${hint ? `<small class="summary-card-hint">${hint}</small>` : ""}
        </div>
      </article>
    </div>`;
}

function SummaryCardsRow(cards = []) {
  return `<div class="row g-3 mb-4 summary-cards-row">${cards.join("")}</div>`;
}

function FilterToolbar(options = {}) {
  const {
    search = true,
    church = true,
    month = true,
    status = true,
    exportBtn = true,
    addBtn = "",
    viewToggle = "",
    extraFields = "",
    className = ""
  } = options;
  return `
    <div class="filter-toolbar filter-bar ${className}">
      ${search ? `<div class="filter-toolbar-field filter-toolbar-search"><i class="bi bi-search"></i><input class="form-control" type="search" placeholder="${uiT("search", "Pesquisar")}" aria-label="${uiT("search", "Pesquisar")}"></div>` : ""}
      ${church ? `<select class="form-select" aria-label="${uiT("filterChurch", "Filtrar por Igreja")}"><option value="">${uiT("filterChurch", "Filtrar por Igreja")}</option>${(options.churches || []).map((c) => `<option value="${c.id || c}">${c.church_name || c}</option>`).join("")}</select>` : ""}
      ${month ? `<input class="form-control" type="month" aria-label="${uiT("filterMonth", "Filtrar por Mês")}">` : ""}
      ${status ? `<select class="form-select" aria-label="${uiT("filterStatus", "Filtrar por Estado")}"><option value="">${uiT("filterStatus", "Filtrar por Estado")}</option>${(options.statusOptions || []).map((s) => `<option value="${s}">${s}</option>`).join("")}</select>` : ""}
      ${extraFields}
      ${viewToggle}
      <div class="filter-toolbar-actions">
        ${exportBtn ? `<button type="button" class="btn btn-outline-cyan btn-touch action-secondary"><i class="bi bi-download me-1"></i>${uiT("export", "Exportar")}</button>` : ""}
        ${addBtn}
      </div>
    </div>`;
}

function ViewToggle(activeView = "table", labels = {}) {
  const cardsLabel = labels.cards || uiT("cardsView", "Cartões");
  const tableLabel = labels.table || uiT("tableView", "Tabela");
  return `
    <div class="view-toggle" role="group" aria-label="${uiT("viewMode", "Modo de visualização")}">
      <button type="button" class="view-toggle-btn ${activeView === "cards" ? "active" : ""}" data-view-mode="cards"><i class="bi bi-grid-3x3-gap"></i><span>${cardsLabel}</span></button>
      <button type="button" class="view-toggle-btn ${activeView === "table" ? "active" : ""}" data-view-mode="table"><i class="bi bi-table"></i><span>${tableLabel}</span></button>
    </div>`;
}

function DataCard({ title, subtitle = "", badges = [], meta = [], pills = [], actions = "", className = "" } = {}) {
  const badgesHtml = badges.length ? `<div class="data-card-badges">${badges.join("")}</div>` : "";
  const metaHtml = meta.length
    ? `<div class="data-card-meta">${meta.map(([label, value, icon]) => `<div class="data-card-meta-row"><span>${icon ? `<i class="bi ${icon}"></i>` : ""}${label}</span><strong>${value ?? "-"}</strong></div>`).join("")}</div>`
    : "";
  const pillsHtml = pills.length ? `<div class="data-card-pills">${pills.map((pill) => `<span class="data-card-pill">${pill}</span>`).join("")}</div>` : "";
  return `
    <article class="data-card record-card ${className}">
      <div class="data-card-head">
        <div class="data-card-titles">
          ${subtitle ? `<span class="eyebrow">${subtitle}</span>` : ""}
          <h3 class="data-card-title">${title}</h3>
        </div>
        ${badgesHtml}
      </div>
      ${metaHtml}
      ${pillsHtml}
      ${actions ? `<footer class="data-card-foot">${actions}</footer>` : ""}
    </article>`;
}

function DataCardsGrid(cardsHtml = "", emptyHtml = "") {
  if (!cardsHtml) return EmptyState({ icon: "bi-inbox", title: uiT("empty", "Sem registos") });
  return `<div class="data-cards-grid">${cardsHtml}</div>`;
}

function DataTable(headers, rows, options = {}) {
  const tableId = options.id ? ` id="${options.id}"` : "";
  const mobileCards = options.mobileCards !== false && rows.length
    ? `<div class="data-table-mobile">${rows.map((row, rowIndex) => `
        <article class="data-table-mobile-card">
          ${row.map((cell, index) => {
            if (headers[index] === uiT("actions", "Acções") || String(headers[index]).toLowerCase().includes("acç") || String(headers[index]).toLowerCase().includes("action")) {
              return `<div class="data-table-mobile-actions">${cell}</div>`;
            }
            return `<div class="data-table-mobile-row"><span>${headers[index]}</span><div>${cell ?? "-"}</div></div>`;
          }).join("")}
        </article>`).join("")}</div>`
    : "";
  return `
    <div class="data-table-wrap glass-panel"${tableId}>
      <div class="table-responsive data-table">
        <table class="table align-middle data-table-desktop">
          <thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell, index) => `<td data-label="${headers[index]}">${cell ?? "-"}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="data-table-empty">${EmptyState({ icon: "bi-inbox", title: uiT("empty", "Sem registos"), compact: true })}</td></tr>`}</tbody>
        </table>
      </div>
      ${mobileCards}
    </div>`;
}

function StatusBadge(status, text = null) {
  if (typeof badge === "function" && text === null) return badge(status);
  const label = text || (typeof statusText === "function" ? statusText(status) : status);
  const cls = typeof badgeClass === "function" ? badgeClass(status) : "blue";
  return `<span class="status-badge status-pill status-${cls}"><i class="bi bi-circle-fill" aria-hidden="true"></i><span>${label}</span></span>`;
}

function ActionButton(action, type, id, label, variant = "ghost") {
  const variants = {
    primary: "action-btn action-btn--primary btn-ce-gold",
    secondary: "action-btn action-btn--secondary",
    ghost: "action-btn action-btn--ghost",
    danger: "action-btn action-btn--danger",
    success: "action-btn action-btn--success"
  };
  const cls = variants[variant] || variants.ghost;
  return `<button type="button" class="${cls} btn-touch" data-action="${action}" data-type="${type}" data-id="${id}">${label}</button>`;
}

function ActionButtonCluster(buttons = [], mapFn = null) {
  if (typeof actionButtons === "function" && !mapFn) {
    return actionButtons(buttons);
  }
  const items = mapFn ? buttons.map(mapFn) : buttons.map(([action, type, id, label, variant]) => ActionButton(action, type, id, label, variant));
  return `<div class="action-cluster action-button-cluster">${items.join("")}</div>`;
}

function FormSection(title, content = "", description = "") {
  return `
    <section class="form-section finance-form-section">
      <header class="form-section-head">
        <h4 class="form-section-title finance-form-section-title">${title}</h4>
        ${description ? `<p class="form-section-desc">${description}</p>` : ""}
      </header>
      <div class="form-section-body row g-3">${content}</div>
    </section>`;
}

function EmptyState({ icon = "bi-inbox", title, description = "", action = "", compact = false } = {}) {
  return `
    <div class="empty-state ui-empty-state ${compact ? "ui-empty-state--compact" : ""}">
      <div class="empty-state-icon"><i class="bi ${icon}"></i></div>
      <h4 class="empty-state-title">${title || uiT("empty", "Sem registos")}</h4>
      ${description ? `<p class="empty-state-desc">${description}</p>` : ""}
      ${action}
    </div>`;
}

function GlassPanel(title, content, options = {}) {
  const head = title
    ? `<div class="glass-panel-head panel-head"><h3 class="panel-title">${title}</h3>${options.actions || ""}</div>`
    : "";
  return `<article class="glass-panel panel ${options.className || ""}">${head}${content}</article>`;
}

function ChartPanel(title, content) {
  return `
    <article class="chart-card glass-panel h-100">
      <div class="panel-head"><h3 class="panel-title"><i class="bi bi-activity me-2 text-info"></i>${title}</h3></div>
      ${content}
    </article>`;
}

function DashboardSection({ title, subtitle = "", icon = "bi-grid", linkRoute = "", linkLabel = "", content = "" } = {}) {
  const link = linkRoute
    ? `<a class="btn btn-sm btn-outline-cyan btn-touch dashboard-section-link" href="#${linkRoute}" data-route="${linkRoute}">${linkLabel || uiT("viewAll", "Ver Tudo")}<i class="bi bi-arrow-right-short ms-1"></i></a>`
    : "";
  return `
    <section class="dashboard-section">
      <header class="dashboard-section-head">
        <div class="dashboard-section-copy">
          <span class="dashboard-section-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
          <div>
            <h3 class="dashboard-section-title">${title}</h3>
            ${subtitle ? `<p class="dashboard-section-subtitle">${subtitle}</p>` : ""}
          </div>
        </div>
        ${link}
      </header>
      <div class="dashboard-section-body">${content}</div>
    </section>`;
}

function DashboardQuickList(items = []) {
  if (!items.length) {
    return EmptyState({ compact: true, title: uiT("empty", "Sem registos"), icon: "bi-inbox" });
  }
  return `<div class="dashboard-quick-list">${items.join("")}</div>`;
}

function DashboardQuickItem({ title, meta = "", badge = "", actions = "" } = {}) {
  return `
    <article class="dashboard-quick-item">
      <div class="dashboard-quick-item-copy">
        <strong class="dashboard-quick-item-title">${title}</strong>
        ${meta ? `<span class="dashboard-quick-item-meta">${meta}</span>` : ""}
      </div>
      ${badge ? `<div class="dashboard-quick-item-badge">${badge}</div>` : ""}
      ${actions ? `<div class="dashboard-quick-item-actions">${actions}</div>` : ""}
    </article>`;
}

function KanbanBoard(columns = []) {
  return `
    <div class="kanban-board">
      ${columns.map(([title, count, cardsHtml, tone]) => `
        <section class="kanban-column kanban-column--${tone || "default"}">
          <header class="kanban-column-head">
            <h4>${title}</h4>
            <span class="kanban-count">${count}</span>
          </header>
          <div class="kanban-column-body">${cardsHtml || EmptyState({ compact: true, title: uiT("empty", "Vazio") })}</div>
        </section>`).join("")}
    </div>`;
}

function FollowUpCard(person) {
  const name = typeof fullName === "function" ? fullName(person) : person.nome;
  const church = typeof churchName === "function" ? churchName(person.church_id) : "";
  const followup = (state?.followUps || []).find((f) => f.first_timer_id === person.id);
  const nextDate = followup?.proxima_data_de_contacto || "-";
  return DataCard({
    title: name,
    subtitle: uiT("followUp", "Seguimento"),
    badges: [StatusBadge(person.estado_do_seguimento)],
    meta: [
      [uiT("phone", "Telefone"), person.telefone, "bi-telephone"],
      [uiT("church", "Igreja"), church, "bi-building"],
      [uiT("nextContact", "Próximo Contacto"), nextDate, "bi-calendar-event"]
    ],
    pills: [person.culto, person.quer_escola_de_fundacao ? uiT("foundationSchool", "Escola de Fundação") : null].filter(Boolean),
    actions: typeof actionButtons === "function"
      ? actionButtons([["view", "firstTimer", person.id, uiT("view", "Ver")], ["followup", "firstTimer", person.id, uiT("updateFollowup", "Actualizar Seguimento")]])
      : ""
  });
}

const PageShellComponent = PageShell;
const ModuleHeroCardComponent = ModuleHeroCard;
const SummaryCardComponent = SummaryCard;
const FilterToolbarComponent = FilterToolbar;
const DataCardComponent = DataCard;
const DataTableComponent = DataTable;
const StatusBadgeComponent = StatusBadge;
const ActionButtonComponent = ActionButton;
const FormSectionComponent = FormSection;
const EmptyStateComponent = EmptyState;