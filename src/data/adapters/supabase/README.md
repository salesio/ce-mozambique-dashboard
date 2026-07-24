# Supabase adapter foundation

Phase 1 foundation + Phase 2 optional Auth pilot.  
**Does not** replace domain repositories by default.

| File | Role |
|------|------|
| `supabaseConfig.ts` | Env flags + validation (anon key only) |
| `supabaseClient.ts` | Lazy public client or null |
| `supabaseRepositoryBase.ts` | Generic list/get/create/update/delete |
| `supabaseTypes.ts` | Base types |
| `supabaseAuthClient.ts` | Optional Auth (signIn/out/session/reset) |

## Rules

- `VITE_ENABLE_SUPABASE=true` required to initialize client
- Real Auth also needs `VITE_ENABLE_REAL_AUTH=true`
- Only `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Never** import service role
- Domain modules stay on mock/local until explicit pilots

## Related

- Auth repository: `src/data/repositories/authRepository.ts`
- Legacy finance client: `src/lib/supabaseClient.ts`
- Provider surface: `src/data/adapters/supabaseProvider.ts`
- Docs: `docs/backend/SUPABASE_AUTH_PILOT_PLAN.md`
