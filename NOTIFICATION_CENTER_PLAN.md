# Notification Center — Plan

**Status:** Pilot on data layer (in-app only; no push)

## Collections

| Collection | Key |
|------------|-----|
| Notifications | `ce-data-layer:notifications` |
| Templates | `ce-data-layer:notification-templates` |

## API

- `CENotifications.createNotification / markNotificationAsRead / markAll…`
- `CENotifications.notify(eventType, payload)` — template-based
- `createSystemNotification(eventType, payload)` global helper

## Rules

- No real push / email / WhatsApp yet
- Soft dual-write from dashboard `createNotification`
- RBAC filters visibility in UI (`notificationMatchesUser`)
- Soft audit via `recordAuditLog`

## Event templates (seed)

requisition_submitted, requisition_approved, finance_pending_verification,  
fevo_missing_report, counseling_urgent_case, media_schedule_assigned,  
program_upcoming, ministry_material_low_stock, prison_report_pending,  
staff_birthday_today
