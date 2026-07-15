/**
 * CE Mozambique Operations — global UI component library.
 * Uses L() from dashboard.js when available.
 * Supports variant="light" | "dark" for contrast-safe surfaces.
 */

function uiT(key, fallback = "") {
  return typeof L === "function" ? L(key) : (fallback || key);
}

function surfaceClass(variant = "light") {
  return variant === "dark" ? "dark-surface surface-dark" : "light-surface surface-light";
}

function PageShell(content = "", options = {}) {
  const extraClass = options.className || "";
  return `<div class="page-shell ${extraClass}">${content}</div>`;
}

function ModuleHeroCard({ title, subtitle, icon = "bi-stars", eyebrow, modalType, addLabel, moduleNavKey, compact = false, actions = "", variant = "light" } = {}) {
  const label = eyebrow || uiT("titleChurchOps", "CHRIST EMBASSY OPERATIONS");
  const addBtn = modalType
    ? `<button type="button" class="btn btn-ce-gold btn-touch" data-open-form="${modalType}"><i class="bi bi-plus-lg me-2"></i>${addLabel || uiT("add", "Adicionar")}</button>`
    : "";
  const navToggle = moduleNavKey
    ? `<button type="button" class="module-nav-arrow" data-module-nav-toggle="${moduleNavKey}" aria-expanded="true" aria-label="${uiT("sidebarCollapse", "Recolher")}"><i class="bi bi-chevron-up" aria-hidden="true"></i></button>`
    : "";
  return `
    <article class="module-hero-card ${surfaceClass(variant)} ${compact ? "module-hero-card--compact" : ""}">
      <div class="module-hero-card-body">
        <div class="module-hero-card-icon"><i class="bi ${icon}"></i></div>
        <div class="module-hero-card-copy">
          <span class="eyebrow">${label}</span>
          <h2 class="module-hero-card-title">${title}</h2>
          ${subtitle ? `<p class="module-hero-card-subtitle card-subtitle">${subtitle}</p>` : ""}
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
  const variant = options.variant || "light";
  const disabled = Boolean(options.disabled);
  const isClickable = !disabled && Boolean(options.isClickable || options.clickable);
  const clickable = isClickable ? " summary-card--clickable" : "";
  const filterJson = options.filterPayload
    ? encodeURIComponent(JSON.stringify(options.filterPayload))
    : "";
  const aria = options.ariaLabel || label;
  const title = options.tooltip || (isClickable ? aria : "");
  const clickAttrs = isClickable
    ? ` data-summary-card="1" data-summary-module="${options.module || ""}" data-summary-target-tab="${options.targetTab || ""}" data-summary-route="${options.route || ""}" data-summary-modal="${options.modalType || options.modal || ""}" data-summary-scroll="${options.scrollTo || ""}" data-summary-filters="${filterJson}" data-summary-disabled="${disabled}" role="button" tabindex="0" aria-label="${aria}"${title ? ` title="${title}"` : ""}`
    : disabled
      ? ` aria-disabled="true"`
      : options.clickAction
        ? ` data-staff-metric="${options.clickAction}" role="button" tabindex="0" aria-label="${aria}"`
        : "";
  const hintText = hint || (isClickable ? uiT("clickToView", "Click to view") : "");
  return `
    <div class="${col}">
      <article class="summary-card metric-card ${surfaceClass(variant)}${tone}${clickable}"${clickAttrs}>
        <div class="summary-card-icon metric-icon"><i class="bi ${icon}"></i></div>
        <div class="summary-card-body">
          <span class="summary-card-label metric-label chart-label label">${label}</span>
          <strong class="summary-card-value metric-value">${value}</strong>
          ${options.periodLabel ? `<span class="summary-card-period">${options.periodLabel}</span>` : ""}
          ${hintText ? `<small class="summary-card-hint meta-text subtitle">${hintText}</small>` : ""}
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
    applyBtn = true,
    addBtn = "",
    viewToggle = "",
    extraFields = "",
    className = "",
    variant = "light"
  } = options;
  const scope = options.filterScope || "generic";
  const selectedChurch = options.churchValue || "";
  const selectedStatus = options.statusValue || "";
  return `
    <div class="filter-toolbar filter-bar ${surfaceClass(variant)} ${className}">
      ${search ? `<div class="filter-toolbar-field filter-toolbar-search"><i class="bi bi-search"></i><input class="form-control" type="search" data-filter-search="${scope}" value="${options.searchValue || ""}" placeholder="${uiT("search", "Pesquisar")}" aria-label="${uiT("search", "Pesquisar")}"></div>` : ""}
      ${church ? `<select class="form-select" data-filter-church="${scope}" aria-label="${uiT("filterChurch", "Filtrar por Igreja")}"><option value="">${uiT("filterChurch", "Filtrar por Igreja")}</option>${(options.churches || []).map((c) => `<option value="${c.id || c}" ${selectedChurch === (c.id || c) ? "selected" : ""}>${c.church_name || c}</option>`).join("")}</select>` : ""}
      ${month ? `<input class="form-control" type="month" data-filter-month="${scope}" value="${options.monthValue || ""}" aria-label="${uiT("filterMonth", "Filtrar por Mes")}">` : ""}
      ${status ? `<select class="form-select" data-filter-status="${scope}" aria-label="${uiT("filterStatus", "Filtrar por Estado")}"><option value="">${uiT("filterStatus", "Filtrar por Estado")}</option>${(options.statusOptions || []).map((s) => `<option value="${s}" ${selectedStatus === s ? "selected" : ""}>${s}</option>`).join("")}</select>` : ""}
      ${extraFields}
      ${viewToggle}
      <div class="filter-toolbar-actions">
        ${applyBtn ? `<button type="button" class="btn btn-ce-gold btn-touch" data-filter-apply="${scope}"><i class="bi bi-search me-1"></i>${uiT("search", "Pesquisar")}</button>` : ""}
        ${exportBtn ? `<button type="button" class="btn btn-outline-cyan btn-touch action-secondary"><i class="bi bi-download me-1"></i>${uiT("export", "Exportar")}</button>` : ""}
        ${addBtn}
      </div>
    </div>`;
}

function TabButton(label, options = {}) {
  const { active = false, className = "", attrs = "", disabled = false } = options;
  const disabledAttr = disabled ? " disabled" : "";
  const lock = disabled ? `<i class="bi bi-lock-fill me-1" aria-hidden="true"></i>` : "";
  return `<button type="button" class="tab-button ${active ? "active" : ""} ${className}" ${attrs}${disabledAttr}>${lock}${label}</button>`;
}

function ModuleTabs(buttonsHtml = "", options = {}) {
  const className = options.className || "";
  const surface = options.variant ? surfaceClass(options.variant) : "";
  const aria = options.ariaLabel || uiT("moduleNavigation", "Navega��o do m�dulo");
  const classes = ["module-tabs", "tab-strip", "module-tab-strip", surface, className].filter(Boolean).join(" ");
  return `<nav class="${classes}" role="tablist" aria-label="${aria}">${buttonsHtml}</nav>`;
}

function ViewToggle(activeView = "table", labels = {}) {
  const cardsLabel = labels.cards || uiT("cardsView", "Cartões");
  const tableLabel = labels.table || uiT("tableView", "Tabela");
  return `
    <div class="view-toggle light-surface" role="group" aria-label="${uiT("viewMode", "Modo de visualiza��o")}">
      <button type="button" class="view-toggle-btn ${activeView === "cards" ? "active" : ""}" data-view-mode="cards"><i class="bi bi-grid-3x3-gap"></i><span>${cardsLabel}</span></button>
      <button type="button" class="view-toggle-btn ${activeView === "table" ? "active" : ""}" data-view-mode="table"><i class="bi bi-table"></i><span>${tableLabel}</span></button>
    </div>`;
}

function DataCard({ title, subtitle = "", badges = [], meta = [], pills = [], actions = "", className = "", variant = "light" } = {}) {
  const badgesHtml = badges.length ? `<div class="data-card-badges">${badges.join("")}</div>` : "";
  const metaHtml = meta.length
    ? `<div class="data-card-meta">${meta.map(([label, value, icon]) => `<div class="data-card-meta-row"><span class="chart-label">${icon ? `<i class="bi ${icon}"></i>` : ""}${label}</span><strong>${value ?? "-"}</strong></div>`).join("")}</div>`
    : "";
  const pillsHtml = pills.length ? `<div class="data-card-pills">${pills.map((pill) => `<span class="data-card-pill">${pill}</span>`).join("")}</div>` : "";
  return `
    <article class="data-card record-card ${surfaceClass(variant)} ${className}">
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
  const variant = options.variant || "light";
  const rowAttrs = Array.isArray(options.rowAttrs) ? options.rowAttrs : [];
  const mobileCards = options.mobileCards !== false && rows.length
    ? `<div class="data-table-mobile">${rows.map((row, rowIndex) => `
        <article class="data-table-mobile-card ${surfaceClass(variant)}"${rowAttrs[rowIndex] || ""}>
          ${row.map((cell, index) => {
            if (headers[index] === uiT("actions", "Acções") || String(headers[index]).toLowerCase().includes("acç") || String(headers[index]).toLowerCase().includes("action")) {
              return `<div class="data-table-mobile-actions">${cell}</div>`;
            }
            return `<div class="data-table-mobile-row"><span class="chart-label">${headers[index]}</span><div>${cell ?? "-"}</div></div>`;
          }).join("")}
        </article>`).join("")}</div>`
    : "";
  return `
    <div class="data-table-wrap glass-panel ${surfaceClass(variant)}"${tableId}>
      <div class="table-responsive data-table">
        <table class="table align-middle data-table-desktop">
          <thead><tr>${headers.map((h) => `<th scope="col" class="chart-label">${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.length ? rows.map((row, rowIndex) => `<tr${rowAttrs[rowIndex] || ""}>${row.map((cell, index) => `<td data-label="${headers[index]}">${cell ?? "-"}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}" class="data-table-empty">${EmptyState({ icon: "bi-inbox", title: uiT("empty", "Sem registos"), compact: true })}</td></tr>`}</tbody>
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

function FormSection(title, content = "", description = "", variant = "dark") {
  return `
    <section class="form-section finance-form-section ${surfaceClass(variant)}">
      <header class="form-section-head">
        <h4 class="form-section-title finance-form-section-title">${title}</h4>
        ${description ? `<p class="form-section-desc card-subtitle">${description}</p>` : ""}
      </header>
      <div class="form-section-body row g-3">${content}</div>
    </section>`;
}

function EmptyState({ icon = "bi-inbox", title, description = "", action = "", compact = false, variant = "light" } = {}) {
  return `
    <div class="empty-state ui-empty-state ${surfaceClass(variant)} ${compact ? "ui-empty-state--compact" : ""}">
      <div class="empty-state-icon"><i class="bi ${icon}"></i></div>
      <h4 class="empty-state-title">${title || uiT("empty", "Sem registos")}</h4>
      ${description ? `<p class="empty-state-desc meta-text">${description}</p>` : ""}
      ${action}
    </div>`;
}

function GlassPanel(title, content, options = {}) {
  const variant = options.variant || "light";
  const head = title
    ? `<div class="glass-panel-head panel-head"><h3 class="panel-title">${title}</h3>${options.actions || ""}</div>`
    : "";
  return `<article class="glass-panel panel ${surfaceClass(variant)} ${options.className || ""}">${head}${content}</article>`;
}

function ChartPanel(title, content, options = {}) {
  const variant = options.variant || "light";
  return `
    <article class="chart-card glass-panel ${surfaceClass(variant)} h-100 ${options.className || ""}">
      <div class="panel-head"><h3 class="panel-title chart-title card-title"><i class="bi bi-activity me-2 text-info"></i>${title}</h3></div>
      ${content}
    </article>`;
}

function DashboardSection({ title, subtitle = "", icon = "bi-grid", linkRoute = "", linkLabel = "", content = "", className = "" } = {}) {
  return ModuleSection({ title, subtitle, icon, linkRoute, linkLabel, content, className: `dashboard-section ${className}`.trim() });
}

function ModuleSection({ title, subtitle = "", icon = "bi-grid", linkRoute = "", linkLabel = "", content = "", className = "module-section", variant = "dark" } = {}) {
  const link = linkRoute
    ? `<a class="btn btn-sm btn-outline-cyan btn-touch module-section-link" href="#${linkRoute}" data-route="${linkRoute}">${linkLabel || uiT("viewAll", "Ver Tudo")}<i class="bi bi-arrow-right-short ms-1"></i></a>`
    : "";
  return `
    <section class="${className} ${surfaceClass(variant)}">
      <header class="module-section-head dashboard-section-head">
        <div class="module-section-copy dashboard-section-copy">
          <span class="module-section-icon dashboard-section-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
          <div>
            <h3 class="module-section-title dashboard-section-title chart-title">${title}</h3>
            ${subtitle ? `<p class="module-section-subtitle dashboard-section-subtitle card-subtitle subtitle">${subtitle}</p>` : ""}
          </div>
        </div>
        ${link}
      </header>
      <div class="module-section-body dashboard-section-body">${content}</div>
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
    <article class="dashboard-quick-item light-surface">
      <div class="dashboard-quick-item-copy">
        <strong class="dashboard-quick-item-title">${title}</strong>
        ${meta ? `<span class="dashboard-quick-item-meta meta-text">${meta}</span>` : ""}
      </div>
      ${badge ? `<div class="dashboard-quick-item-badge">${badge}</div>` : ""}
      ${actions ? `<div class="dashboard-quick-item-actions">${actions}</div>` : ""}
    </article>`;
}

function KanbanBoard(columns = []) {
  return `
    <div class="kanban-board">
      ${columns.map(([title, count, cardsHtml, tone]) => `
        <section class="kanban-column kanban-column--${tone || "default"} light-surface">
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
    subtitle: uiT("followUp", "Acompanhamento"),
    badges: [StatusBadge(person.estado_do_seguimento)],
    meta: [
      [uiT("phone", "Telefone"), person.telefone, "bi-telephone"],
      [uiT("church", "Igreja"), church, "bi-building"],
      [uiT("nextContact", "Próximo Contacto"), nextDate, "bi-calendar-event"]
    ],
    pills: [person.culto, person.quer_escola_de_fundacao ? uiT("foundationSchool", "Escola de Funda��o") : null].filter(Boolean),
    actions: typeof actionButtons === "function"
      ? actionButtons([["view", "firstTimer", person.id, uiT("view", "Ver")], ["followup", "firstTimer", person.id, uiT("updateFollowup", "Actualizar Acompanhamento")]])
      : ""
  });
}

const PageShellComponent = PageShell;
const ModuleHeroCardComponent = ModuleHeroCard;
const SummaryCardComponent = SummaryCard;
const TabButtonComponent = TabButton;
const ModuleTabsComponent = ModuleTabs;
const FilterToolbarComponent = FilterToolbar;
const DataCardComponent = DataCard;
const DataTableComponent = DataTable;
const StatusBadgeComponent = StatusBadge;
const ActionButtonComponent = ActionButton;
const FormSectionComponent = FormSection;
const EmptyStateComponent = EmptyState;
