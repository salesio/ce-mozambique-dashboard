# Media Module Plan — CE Mozambique Dashboard

## Status

**Pilot live** on progressive data layer (mock/local).  
UI remains in `js/dashboard.js` (`renderMedia`, state.media).  
Data layer: team, roles, services/programs, schedules, channels, performance, awards.  
**No livestream server** in this phase — Live TV stays embed/link externo.

## Principles

1. **Media uses data layer** (`VITE_DATA_SOURCE=mock|local|api|supabase`).
2. **Technical team may link to Staff & RH** via `staff_id` (no staff duplication).
3. **Equipment** comes from **Venue & Inventory** (category Media / Sound) — soft link only.
4. **Never store real stream keys** in localStorage / frontend.
5. **Live TV** = external embed/URL only; no heavy streaming on VPS.
6. **Performance** auto-calculates `overall_score` from dimension scores.
7. **Awards** are internal recognition only.
8. **RBAC** (Access Control) protects module actions.
9. **Audit Log** should record critical actions when available.
10. **Do not break** Staff & RH, Venue & Inventory, or Access Control.
11. No direct browser → PostgreSQL.

## Domain flow

```
Staff técnico registado
  → funções de mídia
  → escalado a cultos/programas
  → confirma / check-in
  → equipamentos (Inventário)
  → checklist técnico pré-culto
  → performance pós-culto
  → dashboard: escalas, ausências, problemas, prémios, relatórios
```

## Data layer keys

```
ce-data-layer:media-team
ce-data-layer:media-roles
ce-data-layer:media-services
ce-data-layer:media-schedules
ce-data-layer:media-channels
ce-data-layer:media-performance
ce-data-layer:media-awards
```

## Roles (seed)

| Role | Category | Critical |
|------|----------|----------|
| Operador de Câmara | Camera | yes |
| Fotógrafo | Photography | |
| Técnico de Som | Sound | yes |
| Operador de Video Mixer | Video Mixing | yes |
| Técnico de Transmissão | Streaming | yes |
| Lançador de Escrituras | Scriptures | |
| Operador de ProPresenter / EasyWorship | Presentation | |
| Operador de Slides | Presentation | |
| Supervisor de Mídia | Supervision | yes |
| Director de Mídia | Supervision | |
| Assistente Técnico | Technical Support | |
| Iluminação | Lighting | |
| Edição de Vídeo | Editing | |
| Social Media / Publicação | Social Media | |

## Services / programs (examples)

- Quarta-feira 18:00  
- Domingo 07:30 — 1º Culto  
- Domingo 09:30 — 2º Culto  
- Segunda 17:30 — Orações  
- Segunda 19:00 — Master Class  
- Pray-a-thon, Healing Streams, Global Day of Prayer, conferências  

## Channels

| Channel | Notes |
|---------|--------|
| Facebook | Live link externo |
| YouTube | `stream_key_status` only (no real key) |
| Instagram | Clips |
| Zoom | Orações / Master Class |
| Live TV (site público) | Embed/link only |

## Schedules

Statuses: Draft → Assigned → Confirmed → Completed | Cancelled | Replaced | No Show  

Confirmation: Pending | Confirmed | Declined | Needs Replacement  

Attendance: Not Checked In | Present | Late | Absent | Excused  

Actions: `confirmScheduleAssignment`, `markCheckIn`, `markCheckOut`, `markAbsent`.

## Performance

Scores 0–100:

- punctuality  
- technical quality  
- teamwork  
- responsibility  
- problem solving  
- spiritual attitude  

`overall_score` = média dos scores preenchidos.

## Awards (internal)

Categories include: Técnico do Ano, Mais Pontual, Melhor Operador de Câmara, Melhor Técnico de Som, Melhor Operador de Video Mixer, Melhor Técnico de Transmissão, Melhor Fotógrafo, Melhor Lançador de Escrituras, Melhor Espírito de Equipa, Mais Dedicado, Revelação do Ano, Mais Melhorado, Prémio de Excelência, Serviço Fiel.

Statuses: Draft | Nominated | Approved | Awarded | Archived.

## Integrations

| System | Integration |
|--------|-------------|
| Staff & RH | Optional `staff_id` / list media department staff |
| Venue & Inventory | Equipment usage report by category Media |
| Access Control | Module `media`; Media Supervisor / Director / Team Member scopes |
| Finance | None in this phase |
| Streaming server | Future only — not on VPS now |

## Code map

| Piece | Role |
|-------|------|
| `src/data/repositories/mediaRepository.ts` | Aggregator CRUD + schedules side-effects + stats |
| Seeds | team, roles, services, schedules, channels, performance, awards |
| `js/media-data-bridge.js` | Dual-write + pure-JS localStorage fallback (`CEMedia`) |
| Dashboard | `dualWriteMediaRecord` + `hydrateMediaFromRepository` |
| Providers | mock seeds; local keys; api/supabase placeholders |

## Globals

```js
window.CEMedia = {
  listMediaTeam, createMediaTeamMember, …,
  confirmScheduleAssignment, markCheckIn, markCheckOut, markAbsent,
  getMediaOverviewStats, getTodaySchedules, …
  getInfo
}
window.CEDataLayer.media / mediaTeam / mediaRoles / mediaServices /
  mediaSchedules / mediaChannels / mediaPerformance / mediaAwards
```

Cache buster: `?v=20260723-media-data-v1`

## Future (not this phase)

- Real stream keys on backend only  
- Livestream / encoder on server  
- Supabase tables + RLS  
- Full notification fan-out  
- Mobile check-in QR  
- Auto equipment checkout from inventory  

## How to test

```bash
npm run build
npm run test:media-data
npm run test:access-control-data
npm run test:staff-hr-data
npm run test:venue-inventory-data
```

Manual: Super Admin / Media Supervisor → equipa → função → culto → escala → check-in → performance → canais (sem stream key) → equipamentos (Inventário) → prémio → F5 com `VITE_DATA_SOURCE=local`.
