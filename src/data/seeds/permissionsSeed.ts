import type { AccessPermission } from "../types/entities";

function p(
  id: string,
  role_id: string,
  role_name: string,
  module: string,
  flags: Partial<AccessPermission>,
): AccessPermission {
  return {
    id,
    role_id,
    role_name,
    module,
    can_view: flags.can_view ?? false,
    can_create: flags.can_create ?? false,
    can_edit: flags.can_edit ?? false,
    can_delete: flags.can_delete ?? false,
    can_approve: flags.can_approve ?? false,
    can_verify: flags.can_verify ?? false,
    can_release_resources: flags.can_release_resources ?? false,
    can_export: flags.can_export ?? false,
    can_manage_settings: flags.can_manage_settings ?? false,
    can_view_salary: flags.can_view_salary ?? false,
    scope: flags.scope || "own",
    is_sensitive: flags.is_sensitive ?? false,
    created_at: "2024-01-01",
    updated_at: "2026-07-10",
  };
}

/** Sample explicit permissions (templates drive most RBAC via access-control.js). */
export const PERMISSIONS_SEED: AccessPermission[] = [
  p("perm-sa-all", "role-super-admin", "Super Admin", "dashboard", {
    can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true, can_verify: true, can_release_resources: true, can_export: true, can_manage_settings: true, can_view_salary: true, scope: "all",
  }),
  p("perm-fh-finance", "role-finance-head", "Finance Head", "finance", {
    can_view: true, can_create: true, can_edit: true, can_verify: true, can_release_resources: true, can_export: true, scope: "all", is_sensitive: true,
  }),
  p("perm-fh-req", "role-finance-head", "Finance Head", "requisitions", {
    can_view: true, can_export: true, can_release_resources: true, scope: "all", is_sensitive: true,
  }),
  p("perm-hr-staff", "role-hr", "HR Manager", "staffHr", {
    can_view: true, can_create: true, can_edit: true, can_approve: true, can_export: true, can_view_salary: true, scope: "all", is_sensitive: true,
  }),
  p("perm-req-req", "role-req-officer", "Requisition Officer", "requisitions", {
    can_view: true, can_create: true, can_edit: true, can_export: true, scope: "all", is_sensitive: true,
  }),
  p("perm-venue-inv", "role-venue", "Venue Manager", "venueInventory", {
    can_view: true, can_create: true, can_edit: true, can_export: true, scope: "all",
  }),
  p("perm-mp-req", "role-main-pastor", "Main Pastor", "requisitions", {
    can_view: true, can_approve: true, can_export: true, scope: "all", is_sensitive: true,
  }),
  p("perm-mp-audit", "role-main-pastor", "Main Pastor", "auditLogs", {
    can_view: true, can_export: true, scope: "all", is_sensitive: true,
  }),
  p("perm-staff-own", "role-staff-member", "Staff Member", "staffHr", {
    can_view: true, scope: "own",
  }),
  p("perm-viewer-fin", "role-viewer", "Viewer", "finance", {
    can_view: true, can_export: false, scope: "all", is_sensitive: true,
  }),
];
