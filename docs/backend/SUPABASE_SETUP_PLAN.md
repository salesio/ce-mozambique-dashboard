# Supabase Setup Plan — Backend Phase 1

## Goal

Prepare a Supabase project path without forcing the live dashboard onto cloud data.

## Prerequisites

- Supabase project (or local Supabase CLI — optional)
- Node.js for `npm run build` (unchanged)
- Docker Postgres optional for local SQL testing

## Environment

Copy `.env.example` → `.env`:

```env
VITE_DATA_SOURCE=local
VITE_ENABLE_SUPABASE=false
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

When ready for **client init only** (still no domain migration):

```env
VITE_ENABLE_SUPABASE=true
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Backend-only (never in browser)

```env
DATABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Schema apply order

1. `database/schema.sql` — core + pilot tables  
2. `database/seed.sql` — roles + default settings  
3. Review `database/rls.sql` (do not force complex policies yet)  
4. Review `database/storage.sql` (buckets when Storage phase starts)

Also see `supabase/migrations/20260724_backend_phase1_foundation.sql` and legacy `supabase/schema.sql` (older finance-oriented draft).

## Client code

| File | Role |
|------|------|
| `src/data/adapters/supabase/supabaseClient.ts` | Foundation public client |
| `src/data/adapters/supabaseProvider.ts` | Provider + `getInfo()` + generic CRUD helpers |
| `src/lib/supabaseClient.ts` | Legacy finance bridge client |

Rules:

- Init only if `VITE_ENABLE_SUPABASE=true` and URL/anon look valid
- Missing env → `null` client, **no build break**
- Never import service role

## Verify without cloud

```bash
npm run build
npm run test:backend-foundation
npm run test:data-layer-all
```

## Next / Phase 3–4 pilots

- Auth pilot (Phase 2) optional  
- **Churches + Members (Phase 3):** migration `0003` + seed `churches_members_seed.sql`  
- **First Timers + Follow-Up (Phase 4):** migration `0004` + seed `first_timers_followups_seed.sql`  
- Docs: `CHURCHES_MEMBERS_SUPABASE_PILOT.md`, `FIRST_TIMERS_FOLLOWUPS_SUPABASE_PILOT.md`  
