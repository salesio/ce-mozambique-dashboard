# Supabase Setup — CE Mozambique Operations

GitHub Pages hosts **only the frontend**. PostgreSQL, authentication, and file storage live in **Supabase**.

This guide connects:

1. **Public website** giving form → Supabase tables + Storage  
2. **Dashboard** Finanças → read, verify, and reject records from Supabase  
3. **Fallback** → existing `localStorage` mock data when env variables are missing

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a new project.  
2. Choose a region close to Mozambique (e.g. EU West).  
3. Save the **database password** in a password manager — you will not put it in the frontend.  
4. In **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

Never expose:

- `service_role` key  
- Database password  
- Private API keys  

---

## 2. Create database tables

1. Open **SQL Editor** in Supabase.  
2. Paste and run the full script: [`supabase/schema.sql`](supabase/schema.sql)  
3. Confirm tables exist: `churches`, `profiles`, `user_roles`, `members`, `public_giving_submissions`, `finance_records`.

The script also:

- Enables **Row Level Security (RLS)**  
- Seeds the 7 church IDs used by the dashboard mock data  
- Creates helper functions for finance roles  

---

## 3. Create Storage bucket for payment proofs

1. Go to **Storage → New bucket**  
2. Name: `payment-proofs`  
3. **Public bucket**: enabled (public read for proof URLs; tighten later with signed URLs if needed)  
4. Run the storage policy block at the bottom of `supabase/schema.sql` (uncomment and execute).

Uploaded files are stored as:

```
payment-proofs/{submission_group_id}/{timestamp}-{filename}
```

Only the **path** and **public URL** are saved in PostgreSQL — not base64 blobs.

---

## 4. Configure environment variables

### Dashboard (local development + Vite build)

```bash
cd ce-mozambique-dashboard
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Build the browser bundle:

```bash
npm install
npm run build:supabase
```

This generates `js/supabase-bundle.js` with env values baked in.

### GitHub Pages (runtime config without rebuild)

Copy the example file and fill in values on the deployed site:

```bash
cp js/supabase-config.example.js js/supabase-config.js
```

Edit `js/supabase-config.js` (this file is **gitignored** — do not commit real keys):

```javascript
window.__CE_ENV__ = {
  VITE_SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  VITE_SUPABASE_ANON_KEY: "your_anon_key_here"
};
```

`index.html` loads `supabase-config.js` before `supabase-bundle.js`.  
If the file is missing or empty, the app **falls back to localStorage mock data**.

### Public website (Verpex / static hosting)

Same pattern on `ce-mozambique`:

```bash
cp js/supabase-config.example.js js/supabase-config.js
```

Upload `js/supabase-config.js` to your server (not committed to git).

---

## 5. Create finance staff users

1. **Authentication → Users → Add user**  
   - e.g. `finance.head@ce-mozambique.org`  
2. In **SQL Editor**, assign roles (replace `USER_UUID`):

```sql
insert into public.user_roles (user_id, role)
values ('USER_UUID', 'finance_head');

-- Optional church scope for pastors:
insert into public.user_roles (user_id, role, church_id)
values ('USER_UUID', 'church_pastor', 'church-hq');
```

Roles:

| Role | Access |
|------|--------|
| `national_admin` | Full access |
| `finance_head` | Verify / reject + full finance reports |
| `finance_officer` | Create entries |
| `church_pastor` | Church-scoped reports |
| `viewer` | Aggregated read-only |

Dashboard login will attempt Supabase Auth when configured; mock login still works offline.

---

## 6. RLS summary

| Table | Anonymous (public form) | Authenticated staff |
|-------|-------------------------|---------------------|
| `churches` | SELECT | SELECT |
| `public_giving_submissions` | INSERT (pending only) | SELECT / UPDATE (finance head) |
| `finance_records` | INSERT (pending, public source) | SELECT / UPDATE (finance head) |
| `payment-proofs` bucket | INSERT + SELECT | SELECT |

---

## 7. Test public giving submission

1. Configure `js/supabase-config.js` on the public site.  
2. Open any page with **Confirmar Oferta** (e.g. `/ofertas.html`).  
3. Submit a test contribution with a small image/PDF proof.  
4. In Supabase **Table Editor**, verify:
   - `public_giving_submissions` → 1 row, `status = Pendente de Verificação`  
   - `finance_records` → 1 row per contribution line  
   - **Storage** → file under `payment-proofs/...`  
5. If Supabase is not configured, submission falls back to `localStorage` queue (`ce-public-giving-queue`).

---

## 8. Test dashboard finance verification

1. Configure dashboard Supabase env (`.env` + build, or `js/supabase-config.js`).  
2. Log in as Finance Head (Supabase Auth user with `finance_head` role).  
3. Open **Finanças → Submissões Públicas** or **Verificação**.  
4. Verify or reject a pending record.  
5. Confirm in Supabase that `finance_records.estado` and `public_giving_submissions.status` updated.

Without Supabase env, the dashboard continues using seeded `localStorage` data (`ce-ops-dashboard-v3`).

---

## 9. Deploy checklist

### Dashboard → GitHub Pages

```bash
git checkout main
# set .env or js/supabase-config.js locally
npm run build:supabase
git add .
git commit -m "chore: supabase finance integration"
git push origin main

git checkout gh-pages
git checkout main -- index.html css js manifest.webmanifest .nojekyll package.json supabase SUPABASE_SETUP.md .env.example
git commit -am "Sync supabase integration"
git push origin gh-pages
git checkout main
```

For CI, store `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as GitHub Actions secrets and run `npm run build:supabase` before deploying.

### Public site → Verpex

Deploy updated `js/supabase-giving.js`, `js/giving-form.js`, HTML pages, and upload `js/supabase-config.js` manually to the server.

---

## 10. Project structure

```
ce-mozambique-dashboard/
  .env.example
  SUPABASE_SETUP.md
  package.json
  vite.config.ts
  src/lib/supabaseClient.ts      # Supabase client (anon key only)
  src/lib/financeRepository.ts   # Submit, fetch, verify
  js/supabase-bundle.js          # Built IIFE → window.CESupabase
  js/supabase-bridge.js          # Dashboard localStorage bridge
  js/supabase-config.example.js
  supabase/schema.sql

ce-mozambique/
  js/supabase-giving.js          # Public form → Supabase
  js/supabase-config.example.js
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Submissions not appearing | Check RLS policies; confirm anon key in config |
| Storage upload fails | Create `payment-proofs` bucket + storage policies |
| Dashboard cannot verify | User must be logged in via Supabase Auth with `finance_head` role |
| Still seeing mock data only | Env missing — check `window.__CE_ENV__` in browser console |
| CORS errors | Supabase handles CORS; verify Project URL is correct |

For production, replace demo login with full Supabase Auth and remove hardcoded credentials from `index.html`.