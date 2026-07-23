import type { EntityCollectionName, EntityId } from "../types/entities";
import type {
  DataProvider,
  DataResult,
  EntityRepository,
  ListOptions,
} from "../types/repository";
import { getSupabaseClient, getSupabaseConfig } from "../../lib/supabaseClient";

/**
 * Placeholder Supabase provider for progressive migration.
 * Finance already has a parallel path via financeRepository + CESupabaseBridge.
 * Full table repositories are not implemented here yet.
 */
function createStubRepository<T>(collection: EntityCollectionName): EntityRepository<T> {
  const notReady = <R>(): DataResult<R> => ({
    ok: false,
    error: `Supabase repository not implemented for "${collection}" yet. Keep using mock/local or the existing finance bridge.`,
    code: "NOT_IMPLEMENTED",
  });

  return {
    async list(_options?: ListOptions) {
      return notReady<T[]>();
    },
    async getById(_id: EntityId) {
      return notReady<T | null>();
    },
    async create(_input: Partial<T>) {
      return notReady<T>();
    },
    async update(_id: EntityId, _input: Partial<T>) {
      return notReady<T>();
    },
    async remove(_id: EntityId) {
      return notReady<boolean>();
    },
  };
}

export function createSupabaseProvider(): DataProvider {
  const names: EntityCollectionName[] = [
    "users",
    "churches",
    "members",
    "first_timers",
    "follow_ups",
    "foundation_students",
    "foundation_teachers",
    "foundation_class_groups",
    "foundation_lesson_sessions",
    "foundation_test_submissions",
    "foundation_final_exams",
    "finance_records",
    "public_giving_submissions",
    "finance_disbursements",
    "requisitions",
    "requisition_timeline",
    "notifications",
    "cell_groups",
    "cells",
    "cell_leaders",
    "cell_report_submissions",
    "media_technicians",
    "media_schedules",
    "media_roles",
    "media_services",
    "media_channels",
    "media_performance",
    "media_awards",
    "inventory_items",
    "inventory_movements",
    "inventory_maintenance",
    "venue_spaces",
    "service_checklists",
    "staff",
    "staff_departments",
    "staff_roles",
    "staff_salaries",
    "staff_performance",
    "staff_documents",
    "staff_attendance",
    "roles",
    "permissions",
    "permission_templates",
    "audit_logs",
  ];

  const map = Object.fromEntries(
    names.map((n) => [n, createStubRepository(n)]),
  ) as Record<EntityCollectionName, EntityRepository<unknown>>;

  return {
    name: "supabase",
    description: "Supabase provider placeholder (finance bridge remains separate).",
    isReady: () => {
      const cfg = getSupabaseConfig();
      return cfg.isConfigured && !!getSupabaseClient();
    },
    users: map.users as EntityRepository<never>,
    churches: map.churches as EntityRepository<never>,
    members: map.members as EntityRepository<never>,
    firstTimers: map.first_timers as EntityRepository<never>,
    followUps: map.follow_ups as EntityRepository<never>,
    foundationStudents: map.foundation_students as EntityRepository<never>,
    foundationTeachers: map.foundation_teachers as EntityRepository<never>,
    foundationClassGroups: map.foundation_class_groups as EntityRepository<never>,
    foundationLessonSessions: map.foundation_lesson_sessions as EntityRepository<never>,
    foundationTestSubmissions: map.foundation_test_submissions as EntityRepository<never>,
    foundationFinalExams: map.foundation_final_exams as EntityRepository<never>,
    financeRecords: map.finance_records as EntityRepository<never>,
    publicGivingSubmissions: map.public_giving_submissions as EntityRepository<never>,
    financeDisbursements: map.finance_disbursements as EntityRepository<never>,
    requisitions: map.requisitions as EntityRepository<never>,
    requisitionTimeline: map.requisition_timeline as EntityRepository<never>,
    notifications: map.notifications as EntityRepository<never>,
    cellGroups: map.cell_groups as EntityRepository<never>,
    cells: map.cells as EntityRepository<never>,
    cellLeaders: map.cell_leaders as EntityRepository<never>,
    cellReportSubmissions: map.cell_report_submissions as EntityRepository<never>,
    mediaTechnicians: map.media_technicians as EntityRepository<never>,
    mediaSchedules: map.media_schedules as EntityRepository<never>,
    mediaRoles: map.media_roles as EntityRepository<never>,
    mediaServices: map.media_services as EntityRepository<never>,
    mediaChannels: map.media_channels as EntityRepository<never>,
    mediaPerformance: map.media_performance as EntityRepository<never>,
    mediaAwards: map.media_awards as EntityRepository<never>,
    inventoryItems: map.inventory_items as EntityRepository<never>,
    inventoryMovements: map.inventory_movements as EntityRepository<never>,
    inventoryMaintenance: map.inventory_maintenance as EntityRepository<never>,
    venueSpaces: map.venue_spaces as EntityRepository<never>,
    serviceChecklists: map.service_checklists as EntityRepository<never>,
    staff: map.staff as EntityRepository<never>,
    staffDepartments: map.staff_departments as EntityRepository<never>,
    staffRoles: map.staff_roles as EntityRepository<never>,
    staffSalaries: map.staff_salaries as EntityRepository<never>,
    staffPerformance: map.staff_performance as EntityRepository<never>,
    staffDocuments: map.staff_documents as EntityRepository<never>,
    staffAttendance: map.staff_attendance as EntityRepository<never>,
    roles: map.roles as EntityRepository<never>,
    permissions: map.permissions as EntityRepository<never>,
    permissionTemplates: map.permission_templates as EntityRepository<never>,
    auditLogs: map.audit_logs as EntityRepository<never>,
    collection(name) {
      return map[name];
    },
  };
}
