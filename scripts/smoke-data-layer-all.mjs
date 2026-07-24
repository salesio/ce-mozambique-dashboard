/**
 * Run all existing data-layer smoke scripts sequentially.
 * Skips missing scripts without failing the suite runner itself.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const scripts = [
  "smoke-finance-data.mjs",
  "smoke-partnerships-data.mjs",
  "smoke-requisitions-data.mjs",
  "smoke-venue-inventory-data.mjs",
  "smoke-staff-hr-data.mjs",
  "smoke-access-control-data.mjs",
  "smoke-media-data.mjs",
  "smoke-counseling-data.mjs",
  "smoke-sacraments-data.mjs",
  "smoke-fevo-data.mjs",
  "smoke-prison-ministry-data.mjs",
  "smoke-ministry-materials-data.mjs",
  "smoke-programs-data.mjs",
  "smoke-settings-notifications-data.mjs",
];

let failed = 0;
let ran = 0;
let skipped = 0;

console.log("=== Data layer regression suite ===\n");

for (const name of scripts) {
  const path = join(root, "scripts", name);
  if (!existsSync(path)) {
    console.log(`SKIP  ${name} (missing)`);
    skipped += 1;
    continue;
  }
  const result = spawnSync(process.execPath, [path], {
    cwd: root,
    encoding: "utf8",
    env: process.env,
  });
  ran += 1;
  const out = `${result.stdout || ""}${result.stderr || ""}`;
  const last = out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(-3)
    .join(" | ");
  if (result.status === 0) {
    console.log(`PASS  ${name} — ${last}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name} (exit ${result.status}) — ${last}`);
  }
}

console.log(`\n${ran} ran, ${skipped} skipped, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
