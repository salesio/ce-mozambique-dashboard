# First Timers + Follow-Up Supabase Pilot — Backend Phase 4

**Status:** Optional (`VITE_DATA_SOURCE=supabase` only)  
**Scope:** `first_timers`, `follow_ups`, `follow_up_timeline_events`

---

## Goal

```
Frontend → firstTimersRepository / followUpsRepository
  → VITE_DATA_SOURCE=supabase + flags
  → firstTimersSupabaseAdapter / followUpsSupabaseAdapter
  → public.first_timers / public.follow_ups (+ timeline)
```

Churches + Members pilots remain intact. Finance and other modules stay mock/local.

---

## Activate

```env
VITE_DATA_SOURCE=supabase
VITE_ENABLE_SUPABASE=true
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_only
```

## Demo/local (default)

```env
VITE_DATA_SOURCE=local
VITE_ENABLE_SUPABASE=false
```

---

## Migrations / seeds

1. Phase 3: churches/members (`0003`)  
2. Phase 4: `supabase/migrations/0004_first_timers_followups_pilot.sql`  
3. Optional: `supabase/seeds/churches_members_seed.sql` then `first_timers_followups_seed.sql`

---

## Behaviour notes

| Topic | Rule |
|-------|------|
| Auto member creation | **No** automatic conversion |
| convertFirstTimerToMember | Explicit call; uses members repository (may create member) |
| Adapter convert helper | Only links existing `member_id` UUID |
| Timeline | Stored in `follow_up_timeline_events`; loaded on list/get |
| Status change | Creates timeline event; soft-updates FT `follow_up_status` when linked |

---

## Code map

| Piece | Path |
|-------|------|
| First timers adapter | `src/data/adapters/supabase/firstTimersSupabaseAdapter.ts` |
| Follow-ups adapter | `src/data/adapters/supabase/followUpsSupabaseAdapter.ts` |
| API placeholders | `src/data/adapters/api/firstTimersApiAdapter.ts`, `followUpsApiAdapter.ts` |
| Migration | `supabase/migrations/0004_first_timers_followups_pilot.sql` |
| Seed | `supabase/seeds/first_timers_followups_seed.sql` |

Bridges: `window.CEFirstTimers`, `window.CEFollowUps` unchanged.

---

## Errors

- Missing env → configure URL/anon key message  
- Missing table → migration not applied  
- RLS denied → check policies/permissions  

---

## Tests

```bash
npm run build
npm run test:first-timers-followups-supabase
npm run test:churches-members-supabase
npm run test:data-layer-all
```

---

## Not migrated yet

Finance, Foundation School, Staff & RH, Counseling, Cell Ministry domain tables, etc.

## Next

Foundation School pilot or Finance + storage proofs (Phase 5 roadmap).
