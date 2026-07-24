# Finance + Public Giving + Storage Pilot — Backend Phase 5

**Status:** Optional (`VITE_DATA_SOURCE=supabase`)  
**Scope:** `finance_records`, `public_giving_submissions`, `finance_disbursements`, `documents` + private `finance-proofs` bucket plan

---

## Goal

```
Public Giving Form
  → public_giving_submission (Pending Verification)
  → optional proof upload (storage if enabled)
  → Finance verifies (explicit)
  → finance_records income Verified
  → Partnerships analytics (Verified income + Parcerias only)
```

Rules:

- **No** auto revenue from Public Giving until verify  
- **No** double finance records on re-verify  
- **No** public bucket for proofs  
- **No** service role in frontend  

---

## Activate

```env
VITE_DATA_SOURCE=supabase
VITE_ENABLE_SUPABASE=true
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ENABLE_STORAGE=false   # true only when finance-proofs bucket exists
```

## Demo/local

```env
VITE_DATA_SOURCE=local
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_STORAGE=false
```

---

## Migrations / seeds

1. Phases 3–4 first if needed  
2. `supabase/migrations/0005_finance_public_giving_storage_pilot.sql`  
3. Optional: `supabase/seeds/finance_public_giving_seed.sql`  
4. Create **private** bucket `finance-proofs` in Supabase Dashboard  

---

## Code map

| Piece | Path |
|-------|------|
| Storage client | `src/data/adapters/supabase/supabaseStorageClient.ts` |
| Documents | `src/data/adapters/supabase/documentsSupabaseAdapter.ts` |
| Finance records | `src/data/adapters/supabase/financeSupabaseAdapter.ts` |
| Public giving | `src/data/adapters/supabase/publicGivingSupabaseAdapter.ts` |
| Disbursements | `src/data/adapters/supabase/financeDisbursementsSupabaseAdapter.ts` |
| Repository routing | `src/data/repositories/financeRepository.ts` |

Bridges: `window.CEFinance` unchanged.

---

## Partnerships

Still analytics-only on **Verified** income where contribution_group = Parcerias / partnership arm set.  
Pending/Rejected/Expense never count.

---

## Storage

| Flag | Behaviour |
|------|-----------|
| `VITE_ENABLE_STORAGE=false` | Mock metadata paths (`mock://…`) only |
| `true` + bucket missing | Friendly bucket-not-configured error |
| `true` + bucket OK | Upload to private `finance-proofs` + documents row + signed URL |

---

## Tests

```bash
npm run build
npm run test:finance-public-giving-supabase
npm run test:finance-data
npm run test:partnerships-data
npm run test:data-layer-all
```

---

## Not migrated

Requisitions full module, Staff/RH, remaining domains.  
RLS not production-enforced yet.
