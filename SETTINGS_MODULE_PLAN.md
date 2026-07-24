# Settings / Configurações — Module Plan

**Status:** Pilot on data layer  
**Cache:** `?v=20260723-settings-notifications-v1`

## Collections

| Collection | Key |
|------------|-----|
| System settings | `ce-data-layer:system-settings` |
| Global categories | `ce-data-layer:global-categories` |
| Status definitions | `ce-data-layer:status-definitions` |
| Languages | `ce-data-layer:language-settings` |
| Notification settings | `ce-data-layer:notification-settings` |
| UI preferences | `ce-data-layer:ui-preferences` |

## Defaults

- Language: **pt**
- Currency: **MZN**
- Timezone: **Africa/Maputo**
- Theme: **dark**
- Notifications / Audit / Export: enabled

## Public site handoff settings

- `public_site_enabled`, `giving_form_enabled`, `cell_report_form_enabled`
- `default_public_language`, `service_times_source=churches`

## Code

- `src/data/repositories/settingsRepository.ts`
- `js/settings-data-bridge.js` → `CESettings`
