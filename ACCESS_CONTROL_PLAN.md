# Access Control Plan — CE Mozambique Dashboard

## Status

**Pilot live** on progressive data layer (mock/local).  
Live permission decisions still use `js/access-control.js` role templates.  
Data layer stores users, roles, permissions, templates, and audit logs for dual-write and future backend.

## Principles

1. **No real authentication yet** — demo email login only.
2. **Never store real passwords** in localStorage (demo hint only).
3. **Do not break** existing `CEAccessControl.resolveModuleAccess`.
4. Sensitive modules require explicit view permission.
5. Scopes: `own` | `church` | `department` | `national` | `all`.
6. Audit critical actions: approve, verify, release, export, view_salary, change_role, access_denied.

## Demo users

| Email | Role | Scope notes |
|-------|------|-------------|
| admin@ce-mozambique.org | Super Admin | all |
| pastor.kene@ce-mozambique.org | Main Pastor | national/all |
| finance.head@ce-mozambique.org | Finance Head | finance |
| hr@ce-mozambique.org | HR Manager | staffHr + salary |
| requisitions@ce-mozambique.org | Requisition Officer | requisitions |
| department.head@ce-mozambique.org | Department Head | department |
| staff.member@ce-mozambique.org | Staff Member | own |
| marcelo.panguene@ce-mozambique.org | Venue Manager | inventory |
| media.supervisor@ce-mozambique.org | Media Supervisor | media |
| foundation.rector@ce-mozambique.org | Foundation Rector | foundation |

## Sensitive modules

- finance  
- staffHr (salaries, documents)  
- requisitions  
- usersRoles  
- accessControl  
- auditLogs  

## Data layer keys

```
ce-data-layer:users
ce-data-layer:roles
ce-data-layer:permissions
ce-data-layer:permission-templates
ce-data-layer:audit-logs
```

## Future (not this phase)

- Supabase Auth / API JWT  
- Server-side RLS  
- Real password hashes  
- Session invalidation / MFA  

## How to test

```bash
npm run build
npm run test:access-control-data
```
