# Counseling Module Plan — CE Mozambique Dashboard

## Status

**Pilot live** on progressive data layer (mock/local).  
UI remains in `js/dashboard.js` (`renderCounseling`, `state.counseling`).  
Data layer: requests, cases, appointments, counselors, feedback, referrals.  
**Confidential pastoral data** is protected by RBAC + audit soft-hooks.

## Principles

1. **Counseling uses data layer** (`VITE_DATA_SOURCE=mock|local|api|supabase`).
2. **Confidential notes** (`confidential_notes`, `confidential_session_notes`) only for allowed roles in UI.
3. **Reports are aggregated by default** — no confidential body text in exports.
4. **Audit log** soft-writes on create case, close case, view case, referrals, confidential report.
5. Cases can link to **Members**, **First Timers**, **Follow-Up**, **Staff** counselors.
6. **Do not break** Members, First Timers, Follow-Up, Staff & RH, Access Control.
7. No direct browser → PostgreSQL.

## Workflow

```
Pedido registado
  → triagem (Counseling Head)
  → caso + conselheiro
  → agendamento / sessão
  → feedback
  → opcional: referral Pastor Igreja / Pastor Principal
  → opcional: criar Acompanhamento (CEFollowUps)
  → fechar / reabrir
```

## Data layer keys

```
ce-data-layer:counseling-requests
ce-data-layer:counseling-cases
ce-data-layer:counseling-appointments
ce-data-layer:counselors
ce-data-layer:counseling-feedback
ce-data-layer:counseling-referrals
```

## Categories

Marriage, Family, Business, Spiritual Growth, Prayer, Emotional Support, Leadership, Career, Financial Guidance, Conflict Resolution, Ministry Issue, Personal Decision, Other  
(UI PT: Casamento, Família, Negócios, …)

## Confidentiality levels

| Level | Who may see details |
|-------|---------------------|
| Normal | Counseling team + pastors with module access |
| Private | Counseling Head, assigned counselor, Super Admin |
| Pastoral Only | Church Pastor (own church), Counseling Head, Super Admin, assigned counselor |
| Main Pastor Only | Main Pastor, Super Admin |

## Escalation

None → Counselor → Counseling Head → Church Pastor → Main Pastor

## RBAC (live templates)

- Super Admin / Main Pastor: full (Main Pastor may be limited to escalations in future UI filters)
- Counseling Head: full module ops
- Counselor: assigned cases only (UI scope)
- Church Pastor: church scope + referrals
- Staff Member: blocked

## Integrations

| System | Integration |
|--------|-------------|
| Members / First Timers | person links (`member_id`, `first_timer_id`) |
| Follow-Up | `needs_follow_up` → soft `createFollowUp` when bridge exists; `follow_up_id` on case |
| Staff & RH | counselor `staff_id` optional |
| Access Control | module `counseling`; audit soft-hooks |
| Foundation School / Prayer / Cell | referral targets only |

## Code map

| Piece | Role |
|-------|------|
| `src/data/repositories/counselingRepository.ts` | Aggregator CRUD + close/reopen + reports |
| Seeds | requests, cases, appointments, counselors, feedback, referrals |
| `js/counseling-data-bridge.js` | Dual-write + pure-JS fallback (`CECounseling`) |
| Dashboard | dual-write on form save + hydrate on enter |

## Globals

```js
window.CECounseling = { listCounselingRequests, createCounselingCase, … getInfo }
window.CEDataLayer.counseling / counselingRequests / counselingCases /
  counselingAppointments / counselors / counselingFeedback / counselingReferrals
```

Cache buster: `?v=20260723-counseling-data-v1`

## Future (not this phase)

- Server-side encryption for confidential notes  
- Supabase RLS by role/church/counselor  
- Real notification fan-out  
- Full DOM redaction helpers for every field  

## How to test

```bash
npm run build
npm run test:counseling-data
npm run test:access-control-data
npm run test:staff-hr-data
npm run test:media-data
```
