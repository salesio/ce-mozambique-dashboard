# RLS Security Plan

## Phase 1 status

- Principles documented in `database/rls.sql`
- Policies largely **commented** / not forced on Docker dev
- `VITE_ENABLE_RLS=false` (flag reserved for future app behaviour)

## Phase 2 status (Auth pilot)

Resolution chain for future policies:

```
auth.uid() / current_auth_uid()
  → users.auth_user_id
  → role_id
  → permissions
  → has_module_permission(module, action)
```

SQL helpers added (not fully enforcing table policies yet):

- `current_auth_uid()`
- `current_app_user_id()`
- `current_app_role_id()`
- `current_app_user_scope()`
- `has_module_permission(module_name, action_name)`

See migration `supabase/migrations/0002_auth_users_roles_pilot.sql`.

## Principles

| Role / scope | Access idea |
|--------------|-------------|
| Super Admin | Broad access via permissions |
| Main Pastor | National / all churches when scope = all |
| Church Pastor | `church_id = user.church_id` |
| Department Head | `department_id` + church scope |
| Staff Member | Own records (`created_by` / `staff_id` / recipient) |
| Finance roles | Verify/export only when permitted |
| Sensitive modules | Explicit `can_view` + `is_sensitive` |

## Helper functions (Auth phase)

Planned SQL helpers:

- `current_auth_uid()` — stub exists (JWT sub)
- `current_app_user()` — map auth uid → `public.users`
- `app_user_can(module, action)` — permissions table
- `app_user_church_ids()` — scope set

## Tables to enable first (when Auth ready)

1. `users`, `roles`, `permissions`
2. `churches`, `members`
3. `finance_records`, `public_giving_submissions`
4. `documents`, `audit_logs`
5. Domain tables as pilots migrate

## Public forms (later)

Cell report / public giving need **constrained** insert policies or Edge Functions — not open tables.

## Service role

Service role bypasses RLS. Use only on trusted server/CI. Never in frontend.
