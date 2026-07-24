import type { EntityCollectionName, EntityId } from "../types/entities";
import type {
  DataProvider,
  DataResult,
  EntityRepository,
  ListOptions,
} from "../types/repository";
import { getApiBaseUrl } from "../config";

/**
 * Placeholder REST/API provider for future Node/Express (or similar) backend
 * backed by local Docker PostgreSQL.
 *
 * Not implemented yet — methods return a clear NOT_IMPLEMENTED result so the
 * dashboard keeps using mock/localStorage UI paths.
 */
function createStubRepository<T>(collection: EntityCollectionName): EntityRepository<T> {
  const notReady = <R>(): DataResult<R> => ({
    ok: false,
    error: `API provider not implemented for "${collection}". Set VITE_DATA_SOURCE=mock|local until the backend exists.`,
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

export function createApiProvider(): DataProvider {
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
    "counseling_requests",
    "counseling_cases",
    "counseling_appointments",
    "counselors",
    "counseling_feedback",
    "counseling_referrals",
    "baptisms",
    "marriages",
    "baby_dedications",
    "sacrament_certificates",
    "sacrament_documents",
    "sacrament_appointments",
    "fevo_weekly_configs",
    "fevo_teams",
    "fevo_activities",
    "fevo_reports",
    "fevo_missing_reports",
    "fevo_follow_up_records",
    "fevo_evangelism_records",
    "fevo_visitation_records",
    "fevo_prayer_records",
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

  const baseUrl = getApiBaseUrl();

  return {
    name: "api",
    description: baseUrl
      ? `HTTP API placeholder (base: ${baseUrl}) — not wired yet.`
      : "HTTP API placeholder — set VITE_API_BASE_URL when backend is ready.",
    isReady: () => false,
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
    counselingRequests: map.counseling_requests as EntityRepository<never>,
    counselingCases: map.counseling_cases as EntityRepository<never>,
    counselingAppointments: map.counseling_appointments as EntityRepository<never>,
    counselors: map.counselors as EntityRepository<never>,
    counselingFeedback: map.counseling_feedback as EntityRepository<never>,
    counselingReferrals: map.counseling_referrals as EntityRepository<never>,
    baptisms: map.baptisms as EntityRepository<never>,
    marriages: map.marriages as EntityRepository<never>,
    babyDedications: map.baby_dedications as EntityRepository<never>,
    sacramentCertificates: map.sacrament_certificates as EntityRepository<never>,
    sacramentDocuments: map.sacrament_documents as EntityRepository<never>,
    sacramentAppointments: map.sacrament_appointments as EntityRepository<never>,
    fevoWeeklyConfigs: map.fevo_weekly_configs as EntityRepository<never>,
    fevoTeams: map.fevo_teams as EntityRepository<never>,
    fevoActivities: map.fevo_activities as EntityRepository<never>,
    fevoReports: map.fevo_reports as EntityRepository<never>,
    fevoMissingReports: map.fevo_missing_reports as EntityRepository<never>,
    fevoFollowUpRecords: map.fevo_follow_up_records as EntityRepository<never>,
    fevoEvangelismRecords: map.fevo_evangelism_records as EntityRepository<never>,
    fevoVisitationRecords: map.fevo_visitation_records as EntityRepository<never>,
    fevoPrayerRecords: map.fevo_prayer_records as EntityRepository<never>,
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
