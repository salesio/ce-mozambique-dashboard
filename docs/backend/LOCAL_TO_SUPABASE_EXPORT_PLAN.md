# Local → Supabase export plan (future)

**Not implemented automatically in Phase 3.**

## Why

localStorage pilots use string ids (`church-hq`, `m-123`).  
Postgres pilot tables use **uuid** PKs.

## Suggested future flow

1. Export from browser console / admin tool:
   - `localStorage.getItem('ce-data-layer:churches')`
   - `localStorage.getItem('ce-data-layer:members')`
2. Transform JSON:
   - Generate uuid for each row if id is not uuid
   - Map member.church_id to new church uuid map
   - Drop password-like fields if any
3. Import:
   - SQL `COPY` / bulk insert with service role on **server only**, or
   - Authenticated client insert loop (admin session)

## Placeholders

- `src/data/tools/` may hold export helpers later
- Do not run bulk import from GitHub Pages without auth + RLS

## Phase 3 stance

- No automatic localStorage migration  
- SQL seed provides clean demo churches/members for cloud pilot  
