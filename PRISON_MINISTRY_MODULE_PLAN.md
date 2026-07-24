# Prison Ministry / Ministério Prisional — Module Plan

**Owner:** Sister Janet Marquele  
**Status:** Pilot on data layer (`VITE_DATA_SOURCE=mock|local|api|supabase`)  
**Cache buster:** `?v=20260723-prison-ministry-data-v1`

## Purpose

Migrate and consolidate Prison Ministry onto the progressive data layer without redesigning the UI, without direct PostgreSQL from the browser, and without breaking Foundation School, Follow-Up, F.E.V.O, Access Control, or the future Ministry Materials module.

## Weekly workflow

| Day | Focus |
|-----|--------|
| Monday | Reports and agenda |
| Tuesday | Prayer / preparation |
| Wednesday | Follow-up with representative + agenda confirmation |
| Thursday | Prison service |
| Friday | Prison service |
| Saturday / Sunday | Follow-up with participants via representatives |

## Domain model (data layer)

| Collection | Storage key | UI state key |
|------------|-------------|--------------|
| Prison locations | `ce-data-layer:prison-locations` | `state.prisonMinistry.prisons` |
| Representatives | `ce-data-layer:prison-representatives` | `state.prisonMinistry.representatives` |
| Services | `ce-data-layer:prison-services` | `state.prisonMinistry.services` |
| Participants (internos) | `ce-data-layer:prison-participants` | `state.prisonMinistry.participants` |
| Foundation students | `ce-data-layer:prison-foundation-students` | `state.prisonMinistry.foundationStudents` |
| Weekly agendas | `ce-data-layer:prison-weekly-agendas` | `state.prisonMinistry.weeklyAgenda` |
| Follow-ups | `ce-data-layer:prison-follow-ups` | `state.prisonMinistry.followUps` |
| Reports | `ce-data-layer:prison-reports` | `state.prisonMinistry.reports` |
| Materials requests | `ce-data-layer:prison-materials-requests` | `state.prisonMinistry.materialsRequests` |

## Privacy & safety rules

- **Não guardar dados criminais** (crime type, sentence, charges, inmate numbers, etc.).
- Participants store **minimal** ministry follow-up fields only.
- Confidentiality levels: `Normal` | `Private` | `Restricted`.
- Reports are **aggregated by default** in analytics/export.
- Sensitive participant detail requires permission (RBAC `prisonMinistry`).
- **No automatic** Member creation.
- **No automatic** Foundation School enrollment (main module) without explicit action.
- Prison foundation track is separate (`prison_foundation_students`) and prepared to soft-link when needed.

## Code map

| Piece | Role |
|-------|------|
| `src/data/repositories/prisonMinistryRepository.ts` | Aggregator CRUD + analytics + soft audit |
| Seeds under `src/data/seeds/prison*.ts` | Realistic Maputo / Janet mock data |
| `js/prison-ministry-data-bridge.js` | Dual-write + pure-JS localStorage fallback (`CEPrisonMinistry`) |
| `src/index.ts` | Installs `CEPrisonMinistry` + `CEDataLayer.prisonMinistry` |
| `js/dashboard.js` | `dualWritePrisonMinistryRecord` + `hydratePrisonMinistryFromRepository` |
| Providers | mock / local / api stub / supabase stub |

## Modal dual-write types

- `prisonLocation`
- `prisonService`
- `prisonFoundation`
- `prisonAgenda`
- `prisonReport`

## RBAC

- Module key: `prisonMinistry`
- Coordinator: Sister Janet Marquele (seed user with `prisonMinistry` department permission)
- Staff without permission → Access Restricted + audit when Access Control is present
- Export respects `can_export`

## Soft integrations (prepared, not forced)

| Module | Link |
|--------|------|
| Foundation School | Prison delivery mode / `is_prison_ministry_student` fields already on foundation entities; no auto-enroll |
| Follow-Up | Prison follow-ups are domain-local; optional future soft-link |
| F.E.V.O | Independent; do not break |
| Ministry Materials | `prison_materials_requests.ministry_materials_request_id` placeholder for next module |
| Access Control | Soft audit on create/update participant, validate/reject report, activate agenda, complete service |

## Notifications (mock / TODO)

1. Service completed → Prison Ministry Coordinator  
2. Report submitted / needs validation → Coordinator  
3. Foundation interest / enrollment → Coordinator + Foundation Rector  
4. Pending follow-up → Coordinator  
5. Materials request → Ministry Materials (future) + Coordinator  
6. Active weekly agenda → team  

If notification system is still mock: create mock notification when available; otherwise safe TODO without breaking.

## Roadmap

1. ~~Data layer pilot (this)~~  
2. Full participant / follow-up UI tables (beyond current nested seed UI)  
3. Ministry Materials fulfillment loop  
4. Supabase tables + RLS (no browser → Postgres direct)  
5. Export packs with aggregated-only default for restricted roles  

## How to test

```bash
npm run build
npm run test:prison-ministry-data
npm run test:fevo-data
npm run test:access-control-data
# Manual: Ministério Prisional as Super Admin / Janet
# Create location → representative → agenda → activate → service → complete → report → validate
# Create participant → foundation interest → enroll prison foundation → follow-up → materials request
# Staff without permission → Access Restricted
# VITE_DATA_SOURCE=local + F5 persistence
```
