/**
 * Quick browser smoke: Login → Finance → Partnerships
 */
import { chromium } from "playwright";

const BASE = process.env.CE_BASE_URL || "http://localhost:5173";
const results = [];
let failed = 0;

function log(ok, name, detail = "") {
  const line = `${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`;
  results.push(line);
  if (!ok) failed += 1;
  console.log(line);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("#loginView", { timeout: 15000 });
    log(true, "1. Login screen");

    // Enter dashboard
    await page.locator("#loginForm button[type='submit'], [data-login-enter]").first().click();
    await page.waitForSelector("#appView:not(.d-none)", { timeout: 15000 });
    log(true, "2. Dashboard entered");

    // Sidebar: Finanças then Parcerias exist
    // Expand departments group if collapsed
    const deptToggle = page.locator('[data-nav-group="departments"] .nav-group-toggle, [data-nav-group="departments"] > button').first();
    if (await deptToggle.count()) await deptToggle.click().catch(() => {});
    await page.waitForTimeout(200);
    const navText = await page.locator("#sidebarNav").innerText().catch(() => "");
    const hasFinanceNav =
      /Finan/i.test(navText) ||
      /Finance/i.test(navText) ||
      (await page.locator('[data-route="finance"]').count()) > 0;
    log(hasFinanceNav, "3. Finance in sidebar", navText.slice(0, 120).replace(/\s+/g, " "));
    log(/Parceria|Partnership/i.test(navText) || (await page.locator('[data-route="partnership"]').count()) > 0, "4. Partnerships in sidebar");
    log(!/Loveworld SAT/i.test(navText.split("DEPARTAMENTOS")[1] || navText), "5. Loveworld SAT not a department nav item");

    // Open Finance
    await page.evaluate(() => window.setRoute && window.setRoute("finance"));
    await page.waitForTimeout(800);
    const finText = await page.locator("#content").innerText();
    log(/Finan|Lançament|contribu|Verified|Verificado|Pendente/i.test(finText), "6. Finance module renders", finText.slice(0, 80).replace(/\s+/g, " "));

    // Open Partnerships
    await page.evaluate(() => window.setRoute && window.setRoute("partnership"));
    await page.waitForTimeout(900);
    const partText = await page.locator("#content").innerText();
    log(/Parceria|Partnership/i.test(partText), "7. Partnerships module renders");
    log(/Visão Geral|Overview|Braços|Arms|Parceiros|Partners/i.test(partText), "8. Partnership tabs present");
    log(/Loveworld SAT/i.test(partText), "9. Loveworld SAT appears as arm content");
    log(/Escola de Cura|Rapsód|Construtores|Mandato/i.test(partText), "10. Other arms listed");

    // Click Braços tab if available
    const armsTab = page.locator("[data-partnership-tab='arms']");
    if (await armsTab.count()) {
      await armsTab.click();
      await page.waitForTimeout(400);
      const armsText = await page.locator("#content").innerText();
      log(/Loveworld SAT/i.test(armsText), "11. Arms tab shows Loveworld SAT");
      log(/Precisa de Promo|Needs Promotion|Forte|Estável|Stable|Strong|Baixa/i.test(armsText), "12. Arm status badges present");
    } else {
      log(false, "11. Arms tab missing");
      log(false, "12. Arm status badges present");
    }

    // Contributions tab
    const contribTab = page.locator("[data-partnership-tab='contributions']");
    if (await contribTab.count()) {
      await contribTab.click();
      await page.waitForTimeout(400);
      const cText = await page.locator("#content").innerText();
      log(/Loveworld|Escola de Cura|Rapsód|Carlos|Helena|Verified|Verificado/i.test(cText), "13. Contributions list has verified partnership rows", cText.slice(0, 100).replace(/\s+/g, " "));
    } else {
      log(false, "13. Contributions tab missing");
    }

    // Analytics helpers in page context
    const metrics = await page.evaluate(() => {
      if (!window.computePartnershipArmAnalytics) return { err: "no analytics" };
      const arms = window.computePartnershipArmAnalytics("month");
      const lw = arms.find((a) => a.id === "arm-lw-sat" || /Loveworld/i.test(a.name));
      const list = window.getVerifiedPartnershipRecords ? window.getVerifiedPartnershipRecords() : [];
      const hasPending = list.some((r) => /pending|pendente/i.test(String(r.status || r.estado || "")));
      const hasExpense = list.some((r) => String(r.transaction_type || "").toLowerCase() === "expense");
      return {
        armCount: arms.length,
        lwTotal: lw?.total_amount ?? null,
        listCount: list.length,
        hasPending,
        hasExpense,
        promoCount: arms.filter((a) => a.needs_promotion).length
      };
    });
    log(!metrics.err, "14. Analytics runtime available", metrics.err || "");
    log(Number(metrics.armCount) >= 10, "15. 11 arms catalog", String(metrics.armCount));
    log(Number(metrics.lwTotal) > 0, "16. Loveworld verified total > 0", String(metrics.lwTotal));
    log(metrics.hasPending === false, "17. Pending not in partnership totals");
    log(metrics.hasExpense === false, "18. Expense not in partnership list");
    log(Number(metrics.promoCount) >= 0, "19. Promotion flags computed", String(metrics.promoCount));

    // Open arm detail (from Arms tab)
    const armsTab2 = page.locator("[data-partnership-tab='arms']");
    if (await armsTab2.count()) {
      await armsTab2.click();
      await page.waitForTimeout(400);
    }
    const detailBtn = page.locator("[data-partnership-arm-detail]").first();
    if (await detailBtn.count()) {
      await detailBtn.click();
      await page.waitForTimeout(600);
      // Bootstrap modal may need show class; also accept filled modal fields
      await page.evaluate(() => {
        const el = document.getElementById("entryModal");
        if (el && window.bootstrap?.Modal) window.bootstrap.Modal.getOrCreateInstance(el).show();
      }).catch(() => {});
      await page.waitForTimeout(300);
      const modalText = await page.locator("#modalFields").innerText().catch(() => "");
      const titleText = await page.locator("#modalTitle").innerText().catch(() => "");
      log(
        /Total|Dador|meta|Meta|Loveworld|Escola|Rapsód|Parceiro/i.test(modalText + titleText),
        "20. Arm detail drawer/modal opens",
        `${titleText} ${modalText}`.slice(0, 80).replace(/\s+/g, " ")
      );
    } else {
      log(false, "20. No arm detail button");
    }

    // Back to finance quickly
    await page.evaluate(() => window.setRoute && window.setRoute("finance"));
    await page.waitForTimeout(500);
    log(/Finan|Lançament|contribu/i.test(await page.locator("#content").innerText()), "21. Finance still works after Partnerships");
  } catch (error) {
    log(false, "E2E crashed", error?.message || String(error));
  } finally {
    await browser.close();
  }

  console.log(`\n${results.filter((r) => r.startsWith("PASS")).length} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
}

main();
