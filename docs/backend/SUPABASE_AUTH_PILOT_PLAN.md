# Supabase Auth Pilot — Backend Phase 2

**Status:** Optional pilot (Users / Roles / Permissions only)  
**Default:** Demo login (`VITE_ENABLE_REAL_AUTH=false`)

---

## Goal

Wire an optional path:

```
Supabase Auth user
  → public.users.auth_user_id
  → role_id
  → permissions
  → canUser() / dashboard activeUser
  → audit logs
```

without replacing demo login or migrating Churches / Members / Finance.

---

## How to stay on Demo Mode (default)

```env
VITE_DATA_SOURCE=local
# or mock
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_REAL_AUTH=false
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Demo emails (password hint `demo` — not real secrets):

- admin@ce-mozambique.org
- pastor.kene@ce-mozambique.org
- finance.head@ce-mozambique.org
- hr@ce-mozambique.org
- staff.member@ce-mozambique.org
- requisitions@ce-mozambique.org

---

## How to enable Real Auth pilot

```env
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_REAL_AUTH=true
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

Then:

```bash
npm run build
npm run dev
```

### If flags are on but URL/key missing

Friendly message (no crash):

- PT: *Autenticação real não está configurada. Verifique as variáveis Supabase.*
- EN: *Real authentication is not configured. Check Supabase environment variables.*

---

## Create Auth users in Supabase (manual)

1. Supabase Dashboard → **Authentication** → Users → **Add user**
2. Use the **same email** as an app user in `USERS_SEED` / Access Control
3. Set a password (managed only by Supabase Auth — never in this repo)
4. Apply SQL: `database/schema.sql` (+ migration `0002_auth_users_roles_pilot.sql`)
5. First successful login with matching email will set `users.auth_user_id` when the app user still has `auth_user_id = null`

Alternatively, set `auth_user_id` manually in SQL:

```sql
UPDATE public.users
SET auth_user_id = '<auth.users.id uuid>'
WHERE email = 'admin@ce-mozambique.org';
```

> Frontend pilot stores users in mock/local data layer until Users table is fully migrated. Linking updates the **data-layer** user row (`auth_user_id`). Cloud `public.users` is prepared for the next pilots.

---

## Not provisioned

If Supabase Auth succeeds but no app user matches `auth_user_id` or email:

- Error: `User account not provisioned`
- Audit: `auth_user_not_provisioned`
- Admin must create/link the app user first

---

## Switch back to demo

```env
VITE_ENABLE_REAL_AUTH=false
VITE_ENABLE_SUPABASE=false
```

Rebuild / restart dev server. Demo login works again.

---

## Security rules

| Do | Don't |
|----|--------|
| Anon key in browser only | Service role in frontend |
| Passwords only in Supabase Auth | Passwords in localStorage / seed / git |
| Feature flags default false | Force Auth on GitHub Pages demo |
| Audit soft-fail if unavailable | Crash on audit write |

---

## Code map

| Piece | Path |
|-------|------|
| Auth client | `src/data/adapters/supabase/supabaseAuthClient.ts` |
| Auth repository | `src/data/repositories/authRepository.ts` |
| User link helpers | `accessControlRepository` (`getUserByAuthUserId`, `linkAuthUserToUser`, …) |
| Global API | `window.CEAuth` / `CESupabase.auth` |
| Login UI | `index.html` + `js/dashboard.js` `enterDashboard` |
| SQL helpers | `database/rls.sql` (`current_app_user_id`, `has_module_permission`, …) |
| Migration | `supabase/migrations/0002_auth_users_roles_pilot.sql` |

---

## Audit events

- `auth_login_success`
- `auth_login_failed`
- `auth_logout`
- `auth_user_linked`
- `auth_user_not_provisioned`
- `auth_password_reset_requested`
- `auth_access_denied`

---

## Risks

- Auth without RLS still depends on app-layer checks for most modules (data stays mock/local)
- Email auto-link is convenient for pilot — tighten in production (admin-only link)
- Do not enable `VITE_ENABLE_REAL_AUTH` on public demo hosting without a real project + provisioned users

---

## Next steps

1. Pilot remote `public.users` / `roles` / `permissions` read when `VITE_DATA_SOURCE=supabase`
2. Enable RLS policies using `has_module_permission`
3. Phase 3 — Churches + Members remote pilot
