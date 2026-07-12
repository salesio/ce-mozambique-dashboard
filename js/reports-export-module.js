/**
 * Unified report export — CSV, Excel, PDF/Print.
 */
(function () {
  "use strict";

  function escapeCsv(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function exportCsv(list, headers, rowFn, filename) {
    const rows = [headers.map(escapeCsv).join(",")];
    (list || []).forEach((r) => rows.push(rowFn(r).map(escapeCsv).join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel(list, headers, rowFn, filename, sheetTitle) {
    const title = sheetTitle || "Report";
    const headerRow = headers.map((h) => `<th>${h}</th>`).join("");
    const body = (list || []).map((r) => `<tr>${rowFn(r).map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("");
    const html = `<html><head><meta charset="utf-8"></head><body><table border="1"><caption>${title}</caption><thead><tr>${headerRow}</tr></thead><tbody>${body}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `report-${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPrint(html, title) {
    if (typeof exportFinancePrint === "function") {
      exportFinancePrint(html, title);
      return;
    }
    const win = window.open("", "_blank", "noopener,noreferrer,width=980,height=720");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;padding:1.5rem;color:#122}h1{font-size:1.35rem}p.meta{color:#556;font-size:.85rem}table{width:100%;border-collapse:collapse;margin-top:1rem;font-size:.82rem}th,td{border:1px solid #ccd;padding:.45rem}th{background:#0b1f3f;color:#fff}.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.65rem;margin:1rem 0}.card{border:1px solid #dde;border-radius:.5rem;padding:.65rem}.card span{display:block;color:#667;font-size:.68rem;text-transform:uppercase}.card strong{font-size:1rem;color:#0b1f3f}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  }

  function buildPrintHtml(options = {}) {
    const { title, meta, summaryCards = [], headers = [], rows = [], emptyLabel = "—" } = options;
    const summary = summaryCards.length
      ? `<div class="summary">${summaryCards.map(([label, value]) => `<div class="card"><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>`
      : "";
    const tableRows = rows.length
      ? rows.map((row) => `<tr>${row.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${headers.length || 1}">${emptyLabel}</td></tr>`;
    return `
      <h1>${title || "Report"}</h1>
      ${meta ? `<p class="meta">${meta}</p>` : ""}
      ${summary}
      <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table>`;
  }

  function exportDomain(adapter, list, stats, format, ctx = {}) {
    if (!adapter) return;
    const labelFn = ctx.labelFn || ((k) => k);
    const moneyFn = ctx.moneyFn || ((v) => v);
    const headers = adapter.exportHeaders ? adapter.exportHeaders(labelFn) : [];
    const rowFn = adapter.exportRow || ((r) => []);
    const title = adapter.titleKey ? labelFn(adapter.titleKey) : adapter.id;
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `${adapter.id}-report-${stamp}`;
    if (format === "excel") exportExcel(list, headers, rowFn, `${filename}.xls`, title);
    else if (format === "csv") exportCsv(list, headers, rowFn, `${filename}.csv`);
    else if (format === "print") window.print();
    else if (format === "pdf") {
      const summaryCards = adapter.printSummaryCards
        ? adapter.printSummaryCards(stats, labelFn, moneyFn)
        : [];
      const rows = list.map((r) => rowFn(r));
      const meta = `${new Date().toLocaleString()}${ctx.user ? ` · ${ctx.user.name} (${ctx.user.role})` : ""}`;
      exportPrint(buildPrintHtml({ title, meta, summaryCards, headers, rows, emptyLabel: labelFn("noResultsFound") }), title);
    }
  }

  window.CEReportsExport = { exportCsv, exportExcel, exportPrint, buildPrintHtml, exportDomain };
})();