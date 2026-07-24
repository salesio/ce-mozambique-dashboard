# System Architecture Overview

## Layers

1. **UI** — static HTML + `js/dashboard.js` + module bridges  
2. **Data bridges** — dual-write / pure-JS fallback (`js/*-data-bridge.js`)  
3. **Data layer** — TypeScript under `src/data/` (repositories, seeds, providers)  
4. **Bundle** — `js/supabase-bundle.js` (Vite IIFE, installs globals)  
5. **Backend** — future Supabase/API (not browser → Postgres)

## Data provider switch

```
VITE_DATA_SOURCE=
  mock      → in-memory seeds
  local     → localStorage ce-data-layer:*
  api       → HTTP placeholder
  supabase  → client placeholder
```

## Security / privacy principles

- RBAC central (`CEAccessControl`)
- Audit log soft dual-write
- No secrets/stream keys/passwords in localStorage
- Sensitive domains: aggregate reports by default; confidential notes restricted
- Finance: no auto-verified income/expense from other modules without explicit action

## Global helpers

- `window.CENotifications.notify(eventType, payload)`
- `window.createSystemNotification(eventType, payload)`
- `window.recordAuditLog(action, payload)`

## Next technical phase

- Supabase schema + RLS  
- Auth (replace demo login)  
- Real notifications channels (optional)  
- Public forms secured insert policies  
