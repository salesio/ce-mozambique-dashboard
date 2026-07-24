# Modules Map — CE Mozambique Dashboard

## Main
- Dashboard · Churches · Members · Reports Hub

## Pastoral Care
- First Timers · Follow-Up · Foundation School · Sacraments · Counseling

## Departments
- Cell Leadership (parent nav) · F.E.V.O · Finance · Partnerships · Programs · Media · Requisitions · Venue & Inventory · Prison Ministry · Ministry Materials

## Admin
- Staff & HR · Users & Roles · Access Control · Settings · Audit Logs

## Notes
- **Loveworld SAT** is a partnership arm, not a sidebar department.
- **Mídia** is a full department module.
- Sensitive modules gated by Access Control + audit on deny/export.
- Globals: `CEChurches`, `CEMembers`, `CEFinance`, `CEFevo`, `CEPrisonMinistry`, `CEMinistryMaterials`, `CEPrograms`, `CESettings`, `CENotifications`, …

## Data sources
`VITE_DATA_SOURCE` → mock | local | api | supabase (placeholders for api/supabase).
