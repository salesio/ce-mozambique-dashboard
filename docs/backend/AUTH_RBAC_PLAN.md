# Auth & RBAC Plan

## Phase 1 status (foundation)

- Schema prepared: `users.auth_user_id`, `roles`, `permissions`, `audit_logs`

## Phase 2 status (current pilot)

- **Demo login** remains the **default** (`VITE_ENABLE_REAL_AUTH=false`)
- Optional **Supabase Auth** when flags + env are set
- App resolution:

```
Supabase Auth user
    → public.users.auth_user_id  (or email match → link)
    → role_id → public.roles
    → public.permissions (module + can_*)
    → app canUser() / checkPermission() / activeUser
    → audit logs (auth_* actions)
```

- Domain modules (Churches, Finance, …) still use mock/local data layer
- RLS helpers created; strict table policies **not** fully enabled

## Roles (seed baseline)

| name | display | scope idea |
|------|---------|------------|
| super_admin | Super Admin | all |
| main_pastor | Main Pastor | national / all |
| finance_head | Finance Head | finance-sensitive |
| hr_manager | HR Manager | staff/salaries |
| staff_member | Staff Member | own |

Frontend also keeps richer demo roles (`USERS_SEED` / `ROLES_SEED`).

## Permission model

Columns on `permissions`:

- `can_view`, `can_create`, `can_edit`, `can_delete`
- `can_approve`, `can_verify`, `can_release_resources`
- `can_export`, `can_manage_settings`
- `scope`, `conditions` (jsonb), `is_sensitive`

SQL helpers (Phase 2):

- `current_auth_uid()`
- `current_app_user_id()`
- `current_app_role_id()`
- `current_app_user_scope()`
- `has_module_permission(module, action)`

## Future Auth tasks

- [x] Optional Supabase Auth client + repository
- [x] Link `auth_user_id` by email (pilot)
- [x] Demo login coexistence
- [ ] Migrate app users table fully to Supabase
- [ ] Admin-only auth link (disable auto-link in production)
- [ ] Password reset UX polish
- [ ] Locked / suspended enforcement on every request
- [ ] Session refresh + route guards
- [ ] Enable RLS policies using helpers

## Explicit non-goals (this phase)

- Do not force login through Supabase by default
- Do not break offline/demo GitHub Pages
- Do not put service role in the client
- Do not migrate Churches / Members / Finance yet
