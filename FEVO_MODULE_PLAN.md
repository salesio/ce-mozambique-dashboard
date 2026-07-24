# F.E.V.O Module Plan — CE Mozambique Dashboard

## Status

**Pilot live** on progressive data layer (mock/local).  
UI remains in `js/dashboard.js` (`renderFevo`, `state.fevo`).  
Coordinator: Sister Cassandra (F.E.V.O Coordinator role).

## Meaning

**F.E.V.O** = Follow-Up · Evangelização · Visitação · Oração

## Principles

1. Data layer with mock/local/api/supabase adapters.
2. Weekly config drives team A/B/C/D rotation.
3. Reports by activity type; missing reports tracked separately.
4. Soft-link to **Follow-Up** when submitting Acompanhamento reports (if bridge exists).
5. No duplicate ledger of cell/member data — references only.
6. Do not break Follow-Up, Cell Ministry, Members, First Timers, Access Control.
7. Soft audit on activate/close config, submit/validate/reject report, resolve missing.
8. No direct PostgreSQL.

## Local keys

```
ce-data-layer:fevo-weekly-configs
ce-data-layer:fevo-teams
ce-data-layer:fevo-activities
ce-data-layer:fevo-reports
ce-data-layer:fevo-missing-reports
ce-data-layer:fevo-follow-up-records
ce-data-layer:fevo-evangelism-records
ce-data-layer:fevo-visitation-records
ce-data-layer:fevo-prayer-records
```

## Collections

| Collection | UI state key / use |
|------------|--------------------|
| Weekly configs | `weeklyConfigurations` |
| Teams | `teams` (extended) |
| Activities | `activities` (extended) |
| Reports | `reports` + `weeklyReports` (kind filter) |
| Missing | `noReports` |
| Follow-Up records | detail metrics linked by `report_id` |
| Evangelism records | detail metrics linked by `report_id` |
| Visitation records | detail metrics linked by `report_id` |
| Prayer records | detail metrics linked by `report_id` |

Typed activity records are **separate collections** with `report_id` / `activity_id` links (not only filters on reports).

## Workflow

```
Semana configurada → activar → actividades A–D criadas automaticamente
→ equipas submetem relatórios (+ record tipado)
→ validar / rejeitar (Needs Correction)
→ detect missing → contactar → resolver → overview pastoral
```

## Activate weekly config

On `activateFevoWeeklyConfig`:
1. Close other Active configs  
2. Set status Active  
3. If no activities for that week: create 4 activities (Team A–D) with `status: Assigned`  
4. Soft audit `fevo_weekly_config_activated` / `fevo_activity_created`

## Submit report

On `submitFevoReport`:
1. Report → Submitted  
2. Create typed detail record (Follow-Up / Evangelism / Visitation / Prayer) if missing  
3. Activity → Report Submitted + `report_id`  
4. Soft Follow-Up link only when applicable (never auto First Timer)

## Validate / reject

- Validate → report Validated, activity Validated  
- Reject requires `rejection_reason` → Needs Correction  

## Globals

```js
window.CEFevo = { listFevoWeeklyConfigs, createFevoReport, detectMissingReports, … getInfo }
window.CEDataLayer.fevo / fevoWeeklyConfigs / fevoTeams / fevoActivities /
  fevoReports / fevoMissingReports
```

Cache buster: `?v=20260723-fevo-data-v1`

## How to test

```bash
npm run build
npm run test:fevo-data
npm run test:sacraments-data
npm run test:counseling-data
npm run test:access-control-data
```
