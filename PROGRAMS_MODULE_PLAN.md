# Programs & Events / Programas — Module Plan

**Status:** Pilot on data layer (`VITE_DATA_SOURCE=mock|local|api|supabase`)  
**Cache buster:** `?v=20260723-programs-data-v1`

## Purpose

Migrate Programas onto the progressive data layer as a **coordinator module**: programs, sessions, teams, registrations, participants, resources, budgets, checklists, and reports — with soft links to Media, Requisitions, Ministry Materials, Venue, and Finance. No automatic finance records.

## Domain collections

| Collection | Storage key |
|------------|-------------|
| Programs | `ce-data-layer:programs` |
| Sessions | `ce-data-layer:program-sessions` |
| Teams | `ce-data-layer:program-teams` |
| Participants | `ce-data-layer:program-participants` |
| Registrations | `ce-data-layer:program-registrations` |
| Resources | `ce-data-layer:program-resources` |
| Budgets | `ce-data-layer:program-budgets` |
| Checklists | `ce-data-layer:program-checklists` |
| Reports | `ce-data-layer:program-reports` |

## Critical rules

1. **No automatic `financeRecord`** (registration paid, budget approved, etc.).
2. **Budget is planning data** — not verified expense.
3. Soft links only: `requisition_ids`, `media_schedule_ids`, `ministry_material_request_ids`, `source_id` on resources.
4. Explicit actions for materials (`requestMinistryMaterialsForProgram`) — never auto-create.
5. UI remains `renderSimple` for the programs list; extended data hydrates into `state.programEvents`.

## Seed examples

- Sunday Service, Pray-a-thon, Healing Streams, Graduation Foundation School  
- Conferência Beira (with requisition link), Master Class, Evangelism Campaign  

## Code map

| Piece | Role |
|-------|------|
| `src/data/repositories/programsEventsRepository.ts` | Aggregator |
| Seeds under `src/data/seeds/program*.ts` | Realistic CE MZ data |
| `js/programs-data-bridge.js` | Dual-write + fallback (`CEPrograms`) |
| Dashboard | `dualWriteProgramsRecord` + `hydrateProgramsFromRepository` |

## Soft integrations

| Module | How |
|--------|-----|
| Media | resource `source_module: Media` (optional schedule id) |
| Requisitions | budget `requisition_id` / resource source |
| Ministry Materials | `requestMinistryMaterialsForProgram` if bridge exists |
| Venue | `venue_space_id` / resource type Venue |
| Finance | placeholders only |

## RBAC

- Module key: `programs`
- Protect budget, cancel, report validate, export

## Roadmap

1. ~~Data layer pilot~~  
2. Full multi-tab Programs UI  
3. Explicit Finance verification of budgets  
4. Supabase tables + RLS  

## How to test

```bash
npm run build
npm run test:programs-data
npm run test:ministry-materials-data
npm run test:media-data
npm run test:requisitions-data
npm run test:access-control-data
```
