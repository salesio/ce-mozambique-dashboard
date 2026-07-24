# Migration Roadmap — Backend / Supabase / API

localStorage / mock remain valid for **dev and prototype** until each domain pilot is explicitly moved.

## Phase 1 — Backend foundation (current)

- [x] `database/` schema, seed, rls, storage plans
- [x] Supabase/API adapter foundation
- [x] Env vars + feature flags
- [x] Docs under `docs/backend/`
- [x] Smoke: `test:backend-foundation`
- [ ] No domain auto-migration

## Phase 2 — Auth real + Users/Roles pilot (current)

- [x] Optional Supabase Auth client (`supabaseAuthClient`)
- [x] `authRepository` (demo + real) + `CEAuth` global
- [x] `users.auth_user_id` link helpers + indexes
- [x] RLS SQL helpers (`current_app_user_id`, `has_module_permission`, …)
- [x] Login UI: Demo badge / real auth messages / forgot password (when enabled)
- [x] Audit: `auth_login_*`, `auth_logout`, `auth_user_linked`, …
- [ ] Remote Users/Roles as default source (still mock/local for app data)
- [ ] Production cutover (demo remains until explicit)

## Phase 3 — Churches + Members pilot (current)

- [x] Schema + indexes + migration `0003_churches_members_pilot.sql`
- [x] `churchesSupabaseAdapter` + `membersSupabaseAdapter`
- [x] Repository routing (`VITE_DATA_SOURCE=supabase`)
- [x] API placeholders for churches/members
- [x] Optional SQL seed
- [x] Settings data-source indicator
- [x] Smoke: `test:churches-members-supabase`
- [ ] Production RLS enforced
- [ ] Auto localStorage → Supabase import

## Phase 4 — First Timers + Follow-Up

- Visit conversion pipeline on remote store

## Phase 5 — Finance + Public Giving + Storage proofs

- Align with existing finance bridge
- Private bucket `finance-proofs` + signed URLs

## Phase 6 — Foundation School

- Classes, students, exams, attachments

## Phase 7 — Remaining modules by domain

- Cells, Requisitions, Venue, Staff, Media, Counseling, Sacraments, FEVO, Prison, Materials, Programs, Settings/Notifications

## Phase 8 — Reports + audit + notifications real-time

- Aggregates, audit completeness, optional realtime channels

## Phase 9 — VPS / API deploy

- Optional self-hosted API + Postgres
- `VITE_DATA_SOURCE=api` + hardened secrets

---

## Rules for every phase

1. One domain pilot at a time  
2. Do not remove mock/local until pilot green  
3. Never put service role or `DATABASE_URL` in the browser  
4. Run `npm run build` + `npm run test:data-layer-all` after changes  
5. Document dual-write / hydrate for UI bridges  
