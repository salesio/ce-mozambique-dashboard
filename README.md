# Christ Embassy Mozambique Dashboard

First dashboard prototype for the church team portal.

**Live demo:** https://salesio.github.io/ce-operations-portal/

Login with the demo credentials on the page (`admin@ce-mozambique.org` / `demo`).

### Local development (npm)

```bash
npm install
npm run dev          # dashboard at http://localhost:5173
npm run build        # rebuild js/supabase-bundle.js
npm run test:public-cell-report   # smoke: public form wiring + createCellReport
npm run test:finance-data         # smoke: finance records + verify public giving
npm run test:partnerships-data    # smoke: partnership analytics rules
```

### Data layer (progressive DB migration)

The UI still uses **localStorage mock** for most modules. Typed adapters live under `src/data/`.

**Pilots already on the data layer:** Churches, Members, First Timers, Follow-Up, Foundation School / Escola de Fundação, Cell Ministry / Células & Liderança, **Finance / Finanças**  
(`VITE_DATA_SOURCE=mock|local|api|supabase` — default `mock`).

**Escola de Fundação (functional):** full tabs (overview → reports), 20+ teachers at HQ, delivery modes (in-person / online / home / prison), lesson sessions & attendance, online tests 1–7 (mock Forms; 20×6+10), soul winning (lesson 4), physical final exam + attachment prep, grading 40/60, audit log. No real Google API / scan app / Postgres yet.

**Células & Liderança (pilot):** cell groups, cells, leaders, weekly reports via data layer + accordion UI. Offering → Finance is placeholder only (no auto verified receipt).

**Finance (pilot):** finance records, public giving submissions, and disbursements via data layer + `CEFinance` bridge. Public giving becomes verified income only after Finance Head verifies. Cell offerings stay Pending Finance Review (not auto revenue). Income and expense stay separated.

**Partnerships / Parcerias:** analytics layer on **verified** partnership financeRecords (no duplicate ledger). Loveworld SAT is a partnership arm, not a department. Sidebar: Finanças → Parcerias.

**Public Cell Report Form (leaders, no admin login):**
- Button on the **login screen** only: *Submeter Relatório de Célula* → `#cell-report-submit`
- Cell leaders **do not** enter the staff dashboard
- Public/controlled multi-step form; group → cell dependent selects
- Writes through **`cellReportsRepository` / `createCellReport`** (+ dual-write to existing `cellReports` tab)
- Offering → `finance_review_status = Pending Finance Review` only (never auto-verified revenue)
- Real Finance + backend security (RLS, public insert, cell token/link) = **future Supabase phase**
- Mobile-first, simple UX

See **[DATA_LAYER_PLAN.md](DATA_LAYER_PLAN.md)** § *Public Cell Report Form*.
### Local development (Docker)

Optional. See **[DOCKER_SETUP.md](DOCKER_SETUP.md)** for frontend + PostgreSQL + pgAdmin.

```bash
cp .env.example .env
docker compose up -d
# → http://localhost:5173
```

### Supabase (database backend)

PostgreSQL, auth, and file storage run on **Supabase** — not on GitHub Pages.

See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for project creation, schema, RLS, storage, and env variables.

Quick start:

```bash
cp .env.example .env
# fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run build:supabase
```

Without env variables, the dashboard keeps using **localStorage mock data**.

### Publishing updates

GitHub Pages serves the static site from the `gh-pages` branch (legacy deploy). After changing files on `main`, update the live site:

```bash
git checkout gh-pages
git checkout main -- index.html css js manifest.webmanifest .nojekyll
git commit -am "Update live site"
git push origin gh-pages
git checkout main
```

## Included in v1 prototype

- Login screen placeholder
- Dashboard home
- Members
- Departments
- Cell groups
- Counseling / first timers
- Escola de Fundação tracking
- Users and roles

## Counseling workflow

The first timer form includes:

- Nome
- Número de telefone
- Data de nascimento
- Bairro
- Profissão
- Quem convidou
- Nasceu de novo?
- Quer fazer Escola de Fundação?
- Quer fazer parte de uma célula?
- Vai participar no próximo culto?
- Notas de acompanhamento

If a first timer chooses Escola de Fundação, they are automatically enrolled in the Foundation School tracker.

## Foundation School workflow

- 7 classes
- Exam score
- Graduation status

## Current technical note

This prototype stores data in browser localStorage only. The production version should connect to Supabase for authentication, database, roles and backups.
