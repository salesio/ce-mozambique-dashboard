/**
 * Verify foundation SQL files exist and contain expected markers.
 * Does not connect to a database.
 * Run: node scripts/check-sql-files.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
let passed = 0;
let failed = 0;

function ok(name, cond, detail = "") {
  if (cond) {
    passed += 1;
    console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

const sqlFiles = [
  "database/schema.sql",
  "database/seed.sql",
  "database/rls.sql",
  "database/storage.sql",
  "database/README.md",
];

for (const f of sqlFiles) {
  ok(`${f} exists`, existsSync(join(root, f)));
}

const schema = read("database/schema.sql");
ok("schema has pgcrypto", /pgcrypto/i.test(schema));
ok("schema has update_updated_at_column", /update_updated_at_column/i.test(schema));
ok("schema has churches", /create table if not exists public\.churches/i.test(schema));
ok("schema has users", /create table if not exists public\.users/i.test(schema));
ok("schema has roles", /create table if not exists public\.roles/i.test(schema));
ok("schema has permissions", /create table if not exists public\.permissions/i.test(schema));
ok("schema has members", /create table if not exists public\.members/i.test(schema));
ok("schema has first_timers", /create table if not exists public\.first_timers/i.test(schema));
ok("schema has finance_records", /create table if not exists public\.finance_records/i.test(schema));
ok("schema has public_giving_submissions", /create table if not exists public\.public_giving_submissions/i.test(schema));
ok("schema has documents", /create table if not exists public\.documents/i.test(schema));
ok("schema has notifications", /create table if not exists public\.notifications/i.test(schema));
ok("schema has audit_logs", /create table if not exists public\.audit_logs/i.test(schema));
ok("schema has system_settings", /create table if not exists public\.system_settings/i.test(schema));
ok("schema has staff_members", /create table if not exists public\.staff_members/i.test(schema));
ok("schema uuid default", /gen_random_uuid\(\)/i.test(schema));
ok("schema has auth_user_id", /auth_user_id/i.test(schema));
ok("schema has idx_users_auth_user_id", /idx_users_auth_user_id/i.test(schema));
ok("schema has idx_churches_status", /idx_churches_status/i.test(schema));
ok("schema has idx_members_church_id", /idx_members_church_id/i.test(schema));
ok("schema has follow_ups", /create table if not exists public\.follow_ups/i.test(schema));
ok("schema has follow_up_timeline", /follow_up_timeline_events/i.test(schema));
ok("schema has idx_first_timers_church_id", /idx_first_timers_church_id/i.test(schema));

const seed = read("database/seed.sql");
ok("seed has super_admin", /super_admin/i.test(seed));
ok("seed has finance_head", /finance_head/i.test(seed));
ok("seed default_language pt", /default_language/i.test(seed) && /"pt"/i.test(seed));
ok("seed default_currency MZN", /default_currency/i.test(seed) && /MZN/i.test(seed));
ok("seed timezone Maputo", /Africa\/Maputo/i.test(seed));

const rls = read("database/rls.sql");
ok("rls documents principles", /Super Admin|church_id/i.test(rls));
ok("rls has current_auth_uid", /current_auth_uid/i.test(rls));

const storage = read("database/storage.sql");
ok("storage lists finance-proofs", /finance-proofs/i.test(storage));
ok("storage lists public-assets", /public-assets/i.test(storage));

console.log("");
console.log(`SQL check: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
