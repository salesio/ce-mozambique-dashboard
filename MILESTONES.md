# Data Layer Migration — Milestones

Frontend progressive migration under `VITE_DATA_SOURCE=mock|local|api|supabase`.  
Browser does **not** connect to PostgreSQL directly. Supabase/API = future phase.

| Milestone | Domain | Status |
|-----------|--------|--------|
| cell-report-flow-v1 | Public cell report + Cell Ministry | Done |
| partnerships-analytics-v1 | Partnerships analytics on finance | Done |
| requisitions-finance-flow-v1 | Requisitions → Finance disbursement | Done |
| venue-inventory-flow-v1 | Venue & Inventory | Done |
| staff-hr-flow-v1 | Staff & RH | Done |
| access-control-audit-flow-v1 | Users / Roles / Audit | Done |
| media-department-flow-v1 | Media Department | Done |
| counseling-flow-v1 | Counseling | Done |
| sacraments-flow-v1 | Sacraments | Done |
| fevo-flow-v1 | F.E.V.O | Done |
| prison-ministry-flow-v1 | Prison Ministry | Done |
| ministry-materials-flow-v1 | Ministry Materials | Done |
| programs-events-flow-v1 | Programs & Events | Done |
| settings-notifications-v1 | Settings + Notification Center | Done |
| backend-foundation-v1 | Backend Phase 1 — schema, adapters, docs, env | Done |
| auth-users-roles-v1 | Backend Phase 2 — optional Supabase Auth + Users/Roles | Done |

## Storage model

- Isolated keys: `ce-data-layer:*`
- Dual-write bridges keep UI state + data layer in sync
- localStorage is **pilot/dev only**
- PostgreSQL / Supabase schema prepared under `database/` (not live for UI modules yet)
