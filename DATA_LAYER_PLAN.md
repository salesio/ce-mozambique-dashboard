# Data layer plan — CE Mozambique Operations Dashboard

## Current state (today)

| Layer | Status |
|-------|--------|
| **Dashboard UI** (`index.html`, `js/dashboard.js`, …) | Fully functional with **localStorage** mock state |
| **Supabase finance bridge** (`js/supabase-bridge.js` + bundle) | Optional; falls back to local mock when not configured |
| **Docker PostgreSQL** | Running for local dev (`localhost:5433`) — **not used by the UI yet** |
| **Typed data layer** (`src/data/…`) | Ready — adapters + **Churches** + **Members** + **First Timers** pilot repositories |
| **Churches / Igrejas UI** | Writes/reads through `churchesRepository` (+ fallback to existing state) |
| **Members / Membros UI** | Writes/reads through `membersRepository` (+ fallback to existing state) |
| **First Timers / Primeira Vez UI** | Writes/reads through `firstTimersRepository` (+ fallback to existing state) |
| **Follow-Up / Acompanhamento UI** | Contact logs + create-from-FT via `followUpsRepository` (+ first-timer status dual-write) |
| **Foundation School / ESF UI** | Full operational module on data layer + local state (sessions, tests, soul winning, final exam, audit) |
| **Cell Ministry / Células & Liderança** | Groups, cells, leaders, reports via `cellMinistryRepository` + bridge |
| **Finance / Finanças** | Records, public giving submissions, disbursements via `financeRepository` + bridge |
| **Requisitions & Approvals** | Workflow + timeline via `requisitionsRepository`; approved → financeDisbursement (expense) |

**Other modules** still use the classic `dashboard.js` localStorage blob only.  
**Nothing is abandoned:** open http://localhost:5173 and the app still works.

---

## Why this layer exists

We need a path to real data without a big-bang rewrite:

1. **mock** — in-memory samples (safe experiments)
2. **local** — isolated `localStorage` keys (`ce-data-layer:*`) for module prototypes
3. **api** — future HTTP backend → Docker PostgreSQL
4. **supabase** — future / partial Supabase repositories (finance already has a special bridge)

A **feature flag** selects the active provider:

```env
VITE_DATA_SOURCE=mock
```

Options: `mock` | `local` | `api` | `supabase`  
Default: **`mock`**

---

## Architecture

```
src/data/
  config.ts                 # reads VITE_DATA_SOURCE
  dataProvider.ts           # getDataProvider() factory
  types/
    entities.ts             # User, Church, Member, FirstTimer, …
    repository.ts           # DataProvider + EntityRepository contracts
  adapters/
    mockProvider.ts
    localStorageProvider.ts
    apiProvider.ts          # placeholder (NOT_IMPLEMENTED)
    supabaseProvider.ts     # placeholder (NOT_IMPLEMENTED)
    memoryRepo.ts           # shared in-memory CRUD helper
  index.ts
```

Built into `js/supabase-bundle.js` (global `CESupabase`) via `npm run build`.

### Usage (future modules — not required by UI today)

```js
// After supabase-bundle.js is loaded:
const provider = window.CESupabase.getDataProvider();
console.log(provider.name); // "mock" | "local" | …

const churches = await provider.churches.list();
// { ok: true, data: [...] } or { ok: false, error, code }
```

Or from TypeScript:

```ts
import { getDataProvider } from "./data";
const dp = getDataProvider();
```

---

## Important separation

| Storage | Purpose |
|---------|---------|
| Dashboard `localStorage` key (existing `STORAGE_KEY` in `dashboard.js`) | **Live UI** — do not replace yet |
| `ce-data-layer:*` keys (`local` provider) | **New** isolated store for gradual adapters |
| Docker Postgres (`database/schema.sql`) | Infrastructure ready; no app traffic yet |
| Supabase cloud | Optional finance + future tables |

Migrating a module means:

1. Define/confirm entity type in `src/data/types/entities.ts`
2. Implement real methods on the target adapter (or a module-specific adapter)
3. Point **only that module’s** UI code at `getDataProvider().…`
4. Leave other modules on dashboard localStorage until ready

---

## Migration order (suggested)

Do **one domain at a time**:

1. Churches / users (reference data)
2. Members
3. First timers + follow-ups
4. Cells + cell reports
5. Foundation School
6. Finance (align with existing Supabase bridge)
7. Requisitions, notifications, media

Each step:

- [ ] Repository methods on adapter return real data  
- [ ] UI reads/writes through provider  
- [ ] Fallback or dual-write plan if needed  
- [ ] Manual test of that module only  

---

## PostgreSQL readiness

- Compose service: healthy on host **port 5433**
- Evolving schema: `database/schema.sql` + `database/seed.sql`
- Production-oriented Supabase SQL: `supabase/schema.sql`

When a **backend/API** exists, set:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:4000
DATABASE_URL=postgresql://ce_admin:ce_dev_password@localhost:5433/ce_dashboard
```

(`DATABASE_URL` is for the **server**, never expose DB credentials to the browser.)

---

## What we will NOT do yet

- Force full schema migration  
- Point `dashboard.js` wholesale at Postgres  
- Delete mock/localStorage paths  
- Require Supabase for login/demo  
- Migrate Members, First Timers, Finance, Foundation, Cells, etc.

---

## Pilot migration: Churches

**Status: live (pilot)**

Churches / Igrejas is the first module wired to the data layer.

### What changed

| Piece | Role |
|-------|------|
| `src/data/repositories/churchesRepository.ts` | `listChurches`, `getChurchById`, `createChurch`, `updateChurch`, `deleteChurch`, `searchChurches`, `getChurchServiceTimes` |
| `src/data/seeds/churchesSeed.ts` | Seed = existing dashboard mock churches |
| `js/churches-data-bridge.js` | `window.CEChurches` bridge used by the UI |
| `js/dashboard.js` | Create/update/status + hydrate via repository; **UI unchanged** |

### Behaviour by `VITE_DATA_SOURCE`

| Value | Behaviour |
|-------|-----------|
| **`mock`** (default) | In-memory provider pre-seeded with the 7 prototype churches. UI hydrates from repository on login. |
| **`local`** | Persists to `localStorage` key **`ce-data-layer:churches`**. Seeds automatically if empty. Independent from the main `ce-ops-dashboard-v3` blob (UI state still dual-written for compatibility). |
| **`api`** | Placeholder — writes fail with a friendly error; existing `state.churches` is kept. |
| **`supabase`** | Placeholder for full table repos (finance bridge remains separate). |

### Safety / fallback

- Globals: `window.CEDataLayer.churches`, `window.CESupabase.*`, `window.CEChurches` (bridge).
- Resolution order for writes: **TS repository** → **pure JS bridge fallback** (`mock` / `ce-data-layer:churches`) → **dashboard `state` + localStorage**.
- Soft failures (`UNAVAILABLE` / `NOT_IMPLEMENTED`) no longer block “Guardar”; the classic local path still saves.
- Hard repository errors still show a friendly alert and keep previous data on failed updates.
- Hydrate never blocks first paint; it runs after login in the background.
- Browser **never** talks to PostgreSQL. `DATABASE_URL` stays for a future backend only.

Console diagnostics:

```js
window.CEChurches.getInfo()
window.CEChurches._debugResolve()
window.CEDataLayer
```

### How to test

```bash
# 1) Rebuild data-layer bundle (required after TS changes)
npm run build

# 2) Default mock
# .env → VITE_DATA_SOURCE=mock
npm run dev
# Login → Igrejas → add / edit / service times / filters

# 3) Isolated localStorage provider
# .env → VITE_DATA_SOURCE=local
npm run build
npm run dev
# Clear ce-data-layer:churches in DevTools to re-seed
# Create a church → refresh → still present under ce-data-layer:churches
```

Console helper:

```js
window.CEChurches.getInfo()
// { source, provider, ready, description }
```

### Dual-write note

Until all modules read churches only from the repository, `dashboard.js` still keeps `state.churches` and saves the full app blob (`ce-ops-dashboard-v3`).  
The repository is the **write path** for church mutations and the **preferred hydrate source** for the Churches page.

---

## Verification checklist

```bash
npm run build                 # must succeed (exports data layer + churches repo)
docker compose up -d          # postgres + frontend still work
# open http://localhost:5173  # login demo still works
# open Igrejas — cards, filters, add/edit, service times, RBAC
```

With default `VITE_DATA_SOURCE=mock`, the Churches + Members + First Timers pilots use the repository; other modules stay on classic localStorage.

---

## Pilot migration: Members

**Status: live (pilot)** — follows the same pattern as Churches.

Members / Membros is the second module wired to the data layer.

### What changed

| Piece | Role |
|-------|------|
| `src/data/repositories/membersRepository.ts` | `listMembers`, `getMemberById`, `createMember`, `updateMember`, `deleteMember`, `searchMembers`, `getMembersByChurch/Cell/CellGroup/Department`, `getActiveMembers`, `getInactiveMembers` |
| `src/data/seeds/membersSeed.ts` | Seed = existing dashboard mock members |
| `js/members-data-bridge.js` | `window.CEMembers` bridge used by the UI |
| `js/dashboard.js` | Create/update/delete + hydrate via repository; **UI unchanged** |
| Church selects | Still driven by `state.churches` after Churches hydrate — new local churches appear in member forms |

### Behaviour by `VITE_DATA_SOURCE`

| Value | Behaviour |
|-------|-----------|
| **`mock`** (default) | In-memory provider pre-seeded with prototype members. UI hydrates from repository on login. |
| **`local`** | Persists to `localStorage` key **`ce-data-layer:members`**. Seeds automatically if empty. Dual-write to main blob continues for compatibility. |
| **`api`** | Placeholder — soft-fail then local fallback. |
| **`supabase`** | Placeholder. |

### Safety / fallback

- Globals: `window.CEDataLayer.members`, `window.CESupabase.*`, `window.CEMembers` (bridge).
- Resolution: **TS repository** → **pure JS bridge fallback** → **dashboard `state` + localStorage**.
- Soft failures do not block “Guardar”.
- Hard errors show: *“Não foi possível guardar o membro. Tente novamente.”*
- Members resolve `church_name` via `listChurches()` when possible.

Console diagnostics:

```js
window.CEMembers.getInfo()
window.CEMembers._debugResolve()
window.CEDataLayer.members
```

### How to test

```bash
npm run build

# mock (default)
# .env → VITE_DATA_SOURCE=mock
npm run dev
# Login → Membros → add / edit / filter / status

# local persistence
# .env → VITE_DATA_SOURCE=local
npm run build
npm run dev
# DevTools → ce-data-layer:members
```

### Dual-write note

Until all modules read members only from the repository, `dashboard.js` still keeps `state.members` and saves the full app blob (`ce-ops-dashboard-v3`).

---

## Pilot migration: First Timers

**Status: live (pilot)** — follows the same pattern as Churches and Members.

First Timers / Primeira Vez is the third module wired to the data layer.

### What changed

| Piece | Role |
|-------|------|
| `src/data/repositories/firstTimersRepository.ts` | list/create/update/delete/search + filters + **`convertFirstTimerToMember`** (prepared, not auto) |
| `src/data/seeds/firstTimersSeed.ts` | Seed = existing dashboard mock first timers (+ 1 extra realistic row) |
| `js/first-timers-data-bridge.js` | `window.CEFirstTimers` bridge |
| `js/dashboard.js` | Create/update/delete + hydrate; filters (church/cell/group/status/search); dashboard cards; church select refresh; **UI unchanged** |

### Model notes

Dashboard PT fields (`nome`, `nasceu_de_novo`, `estado_do_seguimento`, …) plus English aliases  
(`visit_date`, `born_again`, `wants_foundation_school`, `follow_up_status`, `converted_to_member`, `member_id`, …).

### Behaviour by `VITE_DATA_SOURCE`

| Value | Behaviour |
|-------|-----------|
| **`mock`** (default) | In-memory provider pre-seeded with prototype first timers. Hydrate on login. |
| **`local`** | Persists to **`ce-data-layer:first-timers`**. Seeds if empty. Dual-write to main blob continues. |
| **`api`** / **`supabase`** | Placeholder + soft fallback. |

### Safety / fallback

- Globals: `window.CEDataLayer.firstTimers`, `window.CESupabase.*`, `window.CEFirstTimers`.
- Resolution: **TS repository** → **pure JS bridge fallback** → **dashboard `state` + localStorage**.
- Hard errors: *“Não foi possível guardar o registo de primeira vez. Tente novamente.”*
- Church name resolved via `listChurches()` when possible.
- Follow-Up UI lists First Timers by status; contact logs live in `followUpsRepository` (see pilot below).

```js
window.CEFirstTimers.getInfo()
window.CEDataLayer.firstTimers
```

### How to test

```bash
npm run build
# .env → VITE_DATA_SOURCE=mock|local
npm run dev
# Login → Primeira Vez → add / edit / filters / follow-up status
# DevTools → ce-data-layer:first-timers (when local)
```

---

## Pilot migration: Follow-Up / Acompanhamento

**Status: live (pilot)** — same pattern as Churches, Members, First Timers.

### Architecture note

- **Kanban / lista de Acompanhamento** still shows **First Timers** by `estado_do_seguimento` (status workflow).
- **Contact history / timeline** and dashboard overdue/today metrics use **`followUpsRepository`** → `state.followUps`.
- Updating follow-up from a First Timer: dual-writes FT status + creates a FollowUp log (+ timeline event).

### What changed

| Piece | Role |
|-------|------|
| `src/data/repositories/followUpsRepository.ts` | Full API + `createFollowUpFromFirstTimer` + `markFollowUpBecameMember` |
| `src/data/seeds/followUpsSeed.ts` | 6 seed logs linked to ft-1/ft-2/ft-3 |
| `js/follow-ups-data-bridge.js` | `window.CEFollowUps` |
| `js/dashboard.js` | `submitFollowup` / timeline / hydrate / dashboard cards |

### Behaviour by `VITE_DATA_SOURCE`

| Value | Behaviour |
|-------|-----------|
| **`mock`** (default) | In-memory seed follow-ups |
| **`local`** | **`ce-data-layer:follow-ups`** |
| **`api`** / **`supabase`** | Placeholder + soft fallback |

### Console

```js
window.CEFollowUps.getInfo()
window.CEDataLayer.followUps
window.CEFollowUps.getPendingFollowUps()
window.CEFollowUps.getOverdueFollowUps()
```

### How to test

```bash
npm run build
npm run dev
# Login → Acompanhamento → Actualizar Acompanhamento on a visitor
# DevTools → ce-data-layer:follow-ups (when local)
```

---

## Foundation School — functional upgrade (on data layer)

**Status: live** — pilot persistence + full operational UI logic (no real Google API / scan app / PostgreSQL).

### Data layer

| Piece | Role |
|-------|------|
| `src/data/repositories/foundationSchoolRepository.ts` | Students + teachers + classes API + normalize |
| Thin re-exports | `foundationStudents/Teachers/ClassesRepository.ts` |
| Seeds | 20+ HQ teachers (Reitor + Coordenador + formats), turmas presencial/online/domicílio/prisional, alunos com delivery modes |
| Entity types | Student, Teacher (`role_type`), ClassGroup, LessonSession, Attendance, OnlineTest, TestSubmission, SoulWinning, FinalExam, AuditLog, GradingSettings |
| `js/foundation-school-data-bridge.js` | `window.CEFoundationSchool` dual-write students/teachers/classes |

### Local keys (repository)

- `ce-data-layer:foundation-students`
- `ce-data-layer:foundation-teachers`
- `ce-data-layer:foundation-classes`

Extended collections (sessions, attendance, online tests, soul winning, final exams, audit) live in the main dashboard `state` / localStorage blob.

### Operational model (UI)

- **Tabs:** Visão Geral · Inscrições · Turmas · Alunos · Aulas & Presenças · Testes Online · Ganhar Almas · Exame Final · Professores · Graduação · Relatórios
- **Delivery modes:** presencial, online, ao domicílio, Ministério Prisional, híbrido
- **Teachers:** role_type (Reitor/Coordenador/Professor/Assistente), 20+ Sede, filters by lesson/format/church/status/prison
- **Online tests 1–7:** Google Forms mock links; max 20 (aulas 1–6) / 10 (aula 7); total 130; Reitor review with override + reason + audit
- **Lesson 4:** soul winning with exact souls count + confirmed_by
- **Final exam:** physical only; score + PDF/image attachment prep (`document_type = foundation_final_exam`)
- **Grading:** tests 40% + final 60%; `getLessonMaxScore(n)`; auto student status
- **Audit log + notifications** for key school events
- **Prison Ministry:** fields/filters prepared; no Prison module redesign

### Integration with migrated domains

- Church selects use `state.churches` hydrated from **churchesRepository**
- Students keep **`first_timer_id`** / **`member_id`**
- Follow-Up / Members / First Timers remain independent and must keep working

### Fallback

Soft-fail → local `state` + blob. Message: *“Não foi possível guardar os dados da Escola de Fundação. Tente novamente.”*

### How to test

```bash
npm run build
npm run dev
# Login → #foundation → professors, turmas, session attendance, simulate online test,
# soul winning, final exam + attachment, refresh with VITE_DATA_SOURCE=local
```

**Not in this phase:** real Google Forms API, Scan App, direct PostgreSQL.

---

## Pilot migration: Cell Ministry

**Status: live (pilot)** — same dual-write / hydrate pattern as Churches → Foundation School.

### Scope

| Collection | Local key | UI state |
|------------|-----------|----------|
| Cell groups | `ce-data-layer:cell-groups` | `state.cellGroups` |
| Cells | `ce-data-layer:cells` | `state.cellRegistry` |
| Cell leaders | `ce-data-layer:cell-leaders` | `state.cellLeadership.leaders` |
| Cell reports | `ce-data-layer:cell-reports` | `state.cellLeadership.cellReports` + submissions |

### Code

| Piece | Role |
|-------|------|
| `src/data/repositories/cellMinistryRepository.ts` | Groups + cells + leaders + reports API |
| Thin re-exports | `cellGroups/cells/cellLeaders/cellReportsRepository.ts` |
| Seeds | 42 groups, sample cells/leaders/reports |
| `js/cell-ministry-data-bridge.js` | `window.CECellMinistry` pure-JS fallback |
| `js/dashboard.js` | Dual-write on create/edit; hydrate on login; accordion + forms |

### What works

- List/expand cell groups accordion
- Create/edit group (`cellGroup`) and cell (`cellRegistry`)
- Leaders and cell reports dual-write
- Approve / correct / validate / reject reports
- “Send offering to Finance” = **placeholder only** (`finance_review_status = Pending Finance Review`) — no verified finance receipt
- Cell Group / Cell dependent selects unchanged for other modules

### Public Cell Report Form

Public weekly report form for **cell leaders** (no admin login).

**Phase rules (non-negotiable) — §24:**
- Cell leader does **not** enter the staff dashboard
- Entry button stays on the **login** screen only
- Form is **public / controlled** (frontend-first; no staff auth this phase)
- Uses the **existing data layer** (`cellReportsRepository` / `createCellReport` + dual-write)
- **Group and cell** are selectable and **dependent** (cells filter by group + church)
- Report lands in the **existing** tab: Células & Liderança → Relatórios de Células → Submissões Semanais
- Offering does **not** become verified finance income automatically (`Pending Finance Review` only)
- Real Finance = **future phase**
- Backend security (RLS, public insert, token/link per cell) = **future Supabase phase**
- Keep UX **simple and mobile-friendly**

| Item | Detail |
|------|--------|
| Entry | Login screen button **Submeter Relatório de Célula** → hash `#cell-report-submit` (aliases: `#submit-cell-report`, `#cell-report`) |
| Auth | **None** this phase — leaders do not get staff accounts |
| UI | 7-step mobile-first form on navy shell + premium light card |
| Data sources | Churches / groups / cells / leaders from `CEDataLayer` / `CECellMinistry` / existing `state` |
| Write path | `cellReportsRepository.createCellReport` (+ dual-write into `state.cellLeadership.cellReports` + `state.cellReportSubmissions` + localStorage) |
| Local key | `ce-data-layer:cell-reports` (same collection as internal reports) |

#### Payload meta (auto)

| Field | Value |
|-------|--------|
| `status` | `Submitted` or `Pending Review` (duplicate / manual cell / missing offer ref / health flags) |
| `submitted_by_type` | `Cell Leader Public Form` |
| `submitted_from` | `login_public_button` |
| `needs_review` | `true` when manual cell, duplicate, pastoral/follow-up health, or missing payment ref with offering |
| `possible_duplicate` | same week + group + cell already submitted |
| `finance_review_status` | `Pending Finance Review` if offering; else `Not Applicable` |
| `currency` | `MZN` |

**Critical:** offering never creates a verified finance income record. Finance action is a **placeholder** only.

#### Internal dashboard integration

Reports land in the **existing** module tab (no separate report type):

**Células & Liderança → Relatórios de Células → Submissões Semanais**  
(also **Cell Ministry → Submissões Semanais** / received reports — same `cellReports` list)

Columns include status, source badge (public form), `needs_review`, possible duplicate, and finance review under offering.

#### Internal actions (same list)

- Ver Detalhes / Aprovar / Pedir Correção / Validar / Rejeitar
- Enviar para Finanças — **placeholder** (`finance_review_status` only)
- Criar Acompanhamento — soft flag / placeholder
- Encaminhar para Visita Pastoral — soft flag / placeholder

#### Notifications (mock / data layer)

On submit (non-blocking; TODO console if `createNotification` missing):

1. **Novo relatório de célula submetido** → Cell Ministry Head (Pastora Flávia) + Final Coordinator (Sister Eduarda)
2. If offering → **Relatório de célula com oferta** → Finance Head + same coordinators
3. If needs review / duplicate → extra review alert

#### Frontend-first security (no login)

- Honeypot hidden field `website`
- Strong client validation (identity, meeting type, attendance, health, confirmation, numbers ≥ 0, offering amount when given)
- Simple rate limit via `localStorage` (`ce-public-cell-report-last-submit`, 15s)
- `possible_duplicate` + `needs_review` flags

**Future backend / Supabase (documented only — not implemented):**

- Controlled public insert (edge function / RPC)
- RLS for anonymous insert with validation
- Server-side validation
- Per-cell token / access code
- Unique shareable link per cell

#### Cache buster

`index.html` scripts/CSS for this feature: `?v=20260723-cell-report-submit-v1`

### Not in this phase

- Real Finance auto-posting / verified receipts for cell offerings
- Direct PostgreSQL
- WhatsApp/SMS
- Excel import
- Cell leader admin accounts / authentication
- Real RLS / public insert API

### How to test

```bash
npm run build
npm run test:public-cell-report   # smoke: UI wiring + cellReportsRepository create path
npm run dev
# Manual:
# 1) Login page → Submeter Relatório de Célula → fill 7 steps → submit
# 2) Success screen → Submeter outro relatório / Voltar ao Login
# 3) Staff login → Células & Liderança → Relatórios de Células → Submissões Semanais
#    Expect: status Submitted|Pending Review, Public form badge, finance_review if offering
# 4) Actions: Ver / Aprovar / Pedir Correção / Validar / Rejeitar / Enviar Finanças (placeholder)
# 5) F5 with VITE_DATA_SOURCE=local — report still present
```

---

## Pilot migration: Finance

**Status: live (pilot)** — dual-write / hydrate pattern as Churches → Cell Ministry.

### Scope

| Collection | Local key | UI state |
|------------|-----------|----------|
| Finance records | `ce-data-layer:finance-records` | `state.finance` |
| Public giving submissions | `ce-data-layer:public-giving-submissions` | `state.publicGivingSubmissions` |
| Finance disbursements | `ce-data-layer:finance-disbursements` | `state.financeDisbursements` |

### Code

| Piece | Role |
|-------|------|
| `src/data/repositories/financeRepository.ts` | Records + public giving + disbursements API |
| Thin re-exports | `financeRecords/publicGivingSubmissions/financeDisbursementsRepository.ts` |
| Seeds | Realistic dízimos/ofertas/parcerias + pending public + disbursements |
| `js/finance-data-bridge.js` | `window.CEFinance` pure-JS fallback |
| `js/dashboard.js` | Dual-write on create/edit/verify; hydrate on login |

### Rules (non-negotiable)

- **Income vs expense separated** (`transaction_type`)
- Public Giving creates **Verified** `financeRecord`s only after Finance Head **Verificar**
- Manual entry starts as **Pending Verification** / `source = Manual Entry`
- Cell report offerings stay **Pending Finance Review** — never auto-verified income
- `createFinanceRecordFromCellReport` exists as future hook only
- Partnerships: `partnership_arm_id` / `partnership_arm_name` prepared (module not migrated)
- Direct PostgreSQL / real bank / M-Pesa = **future phase**
- Existing RBAC + finance visual unchanged

### How to test Finance

```bash
npm run build
npm run test:finance-data   # smoke repository create/verify/monthly
npm run dev
# 1) Finanças → listar lançamentos
# 2) Adicionar → status Pending Verification
# 3) Verificar → Verified
# 4) Submissão pública → Verificar → financeRecords criados
# 5) Monthly Giving só conta Verified
# 6) Oferta de célula com Pending Finance Review NÃO entra como receita
# 7) F5 com VITE_DATA_SOURCE=local — persistência
# 8) Churches / Members / FT / Follow-Up / Foundation / Cells still OK
```

---

## Partnerships analytics layer

**Status: live** — view/analytics over **verified** finance income; no duplicate ledger.

### Rules

| Rule | Detail |
|------|--------|
| Source of truth | `financeRecords` (`transaction_type=income`, status **Verified**) with partnership arm or `contribution_group=Parcerias` |
| Not included | Pending Verification, Rejected, expense, disbursements, cell `Pending Finance Review` |
| Loveworld SAT | **Partnership arm only** — not a sidebar department |
| Sidebar | Finanças → **Parcerias** → Mídia / … |
| Module file | `js/partnerships-module.js` (`window.CEPartnerships`, `renderPartnerships`) |
| Tabs | Visão Geral · Braços · Parceiros · Contribuições · Destaques · Análise · Relatórios · Exportações |

### Promotion logic

`getPartnershipArmPromotionStatus` marks **Precisa de Promoção** when donors &lt; 3, total &lt; 40% of monthly goal, growth &lt; −20%, no gift &gt; 30 days, or total = 0.

### Integration

- Public giving verified with partnership arm → appears automatically in Parcerias
- Finanças creates/verifies; Parcerias only analyses
- Cache buster: `?v=20260723-partnerships-v1`

### How to test Partnerships

```bash
npm run build
npm run test:partnerships-data
npm run dev
# Finanças → verify partnership gift (e.g. Loveworld SAT)
# Parcerias → arm shows value; Pending does not; expense does not
# needs_promotion / top partners / refresh local
```

---

## Pilot migration: Requisitions & Approvals

**Status: live (pilot)** — dual-write / hydrate; UI workflow remains in `js/requisitions-module.js`.

### Local keys

| Collection | Key |
|------------|-----|
| Requisitions | `ce-data-layer:requisitions` |
| Timeline | `ce-data-layer:requisition-timeline` |

(Reviews/approvals are events on the requisition + timeline, not separate ledgers.)

### Workflow

1. Staff/Department creates → Draft / Submitted  
2. Requisition Officer reviews → Under Review → **Send to Main Pastor** (does **not** approve pastorally)  
3. Main Pastor → Approve / Reject / Return  
4. On **Approve** → `finance_status = Awaiting Release` + `createFinanceDisbursement` (**expense**, never income)  
5. Finance Head releases → Partially Released / Released (may create expense `financeRecord` on full release)  
6. Optional inventory placeholder → Sent to Inventory (full inventory module later)

### Code

| Piece | Role |
|-------|------|
| `src/data/repositories/requisitionsRepository.ts` | CRUD + workflow API |
| Thin re-exports | reviews / approvals / workflow aggregators |
| `js/requisitions-data-bridge.js` | Dual-write + wrap `applyWorkflowAction` |
| `js/finance-disbursements-module.js` | Syncs disbursement to `CEFinance` on approve/release |

### Rules

- Resources release is **expense**, never income  
- No verified expense without Finance action  
- Inventory fields prepared; full inventory not migrated  
- PostgreSQL direct = future  
- Cache buster: `?v=20260723-requisitions-data-v1`

### How to test Requisitions

```bash
npm run build
npm run test:requisitions-data
npm run test:finance-data   # regression
# Manual: create → submit → review → send pastor → approve → finance release
# VITE_DATA_SOURCE=local + F5
```
