# Churches + Members Supabase Pilot — Backend Phase 3

**Status:** Optional pilot (mock/local remain default)  
**Scope:** `churches` + `members` only

---

## Goal

First real remote persistence path for:

1. **Churches / Igrejas**
2. **Members / Membros**

```
Frontend → churchesRepository / membersRepository
  → VITE_DATA_SOURCE=supabase + flags
  → churchesSupabaseAdapter / membersSupabaseAdapter
  → public.churches / public.members (anon key)
```

Other modules stay on mock/local.

---

## Activate (optional)

```env
VITE_DATA_SOURCE=supabase
VITE_ENABLE_SUPABASE=true
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_only
```

```bash
npm run build
npm run dev
```

## Stay on demo/local (default)

```env
VITE_DATA_SOURCE=local
# or mock
VITE_ENABLE_SUPABASE=false
```

---

## Apply schema / migration

1. Run `database/schema.sql` (or migration `0003_churches_members_pilot.sql` after Phase 1–2)
2. Optional seed: `supabase/seeds/churches_members_seed.sql`
3. Review RLS notes in `database/rls.sql` (policies **not** forced)

---

## Code map

| Piece | Path |
|-------|------|
| Generic CRUD | `src/data/adapters/supabase/supabaseRepositoryBase.ts` |
| Churches adapter | `src/data/adapters/supabase/churchesSupabaseAdapter.ts` |
| Members adapter | `src/data/adapters/supabase/membersSupabaseAdapter.ts` |
| Repository routing | `churchesRepository.ts` / `membersRepository.ts` |
| API placeholders | `src/data/adapters/api/churchesApiAdapter.ts` / `membersApiAdapter.ts` |
| Migration | `supabase/migrations/0003_churches_members_pilot.sql` |
| Seed | `supabase/seeds/churches_members_seed.sql` |

Bridges unchanged: `window.CEChurches`, `window.CEMembers`, dual-write hydrate.

---

## Errors (friendly)

| Situation | Message |
|-----------|---------|
| Missing env | Supabase não está configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. |
| Missing table | Tabela Supabase ainda não foi criada ou migration não foi aplicada. |
| RLS block | Sem permissão para aceder a estes dados. Verifique políticas RLS/permissões. |

---

## RLS risks (pilot)

- Dev projects may temporarily allow broad access for authenticated/anon during testing.
- Production must scope by `church_id` + role using Phase 2 helpers.
- **Never** put service role in the browser.

---

## Export / import (future)

Do **not** auto-migrate localStorage. Future tools:

- Export local `ce-data-layer:churches` / `ce-data-layer:members` JSON
- Map string ids → UUIDs
- Import via SQL or authenticated client

See `docs/backend/LOCAL_TO_SUPABASE_EXPORT_PLAN.md`.

---

## How to test

```bash
npm run build
npm run test:churches-members-supabase
npm run test:data-layer-all
```

Manual (local): create church/member, refresh, confirm persistence.  
Manual (supabase without env): friendly error, no crash.  
Manual (real Supabase): list/create/edit churches & members in dashboard + table editor.

---

## Next steps

- First Timers / Follow-Up pilot  
- Finance + storage proofs  
- Tighten RLS after Auth cutover  
