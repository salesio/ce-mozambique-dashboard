import type {
  Cell,
  CellGroup,
  CellLeader,
  CellReportSubmission,
  Church,
  EntityCollectionName,
  FinanceDisbursement,
  FinanceRecord,
  FirstTimer,
  PublicGivingSubmission,
  FollowUp,
  FoundationClassGroup,
  FoundationFinalExam,
  FoundationLessonSession,
  FoundationStudent,
  FoundationTeacher,
  FoundationTestSubmission,
  InventoryItem,
  InventoryMaintenanceRecord,
  InventoryMovement,
  MediaAward,
  MediaChannel,
  MediaPerformanceReview,
  MediaRole,
  MediaSchedule,
  MediaService,
  MediaTechnician,
  CounselingAppointment,
  CounselingCase,
  CounselingFeedback,
  CounselingReferral,
  CounselingRequest,
  Counselor,
  BabyDedication,
  Baptism,
  Marriage,
  SacramentAppointment,
  SacramentCertificate,
  SacramentDocument,
  FevoActivity,
  FevoEvangelismRecord,
  FevoFollowUpRecord,
  FevoMissingReport,
  FevoPrayerRecord,
  FevoReport,
  FevoTeam,
  FevoVisitationRecord,
  FevoWeeklyConfig,
  Member,
  Notification,
  Requisition,
  RequisitionTimelineEvent,
  ServiceChecklist,
  StaffAttendance,
  StaffDepartment,
  StaffDocument,
  StaffMember,
  StaffPerformanceReview,
  StaffRole,
  StaffSalary,
  User,
  VenueSpace,
} from "../types/entities";
import type { DataProvider, EntityRepository } from "../types/repository";
import { createMemoryRepository } from "./memoryRepo";
import { CHURCHES_SEED } from "../seeds/churchesSeed";
import { MEMBERS_SEED } from "../seeds/membersSeed";
import { FIRST_TIMERS_SEED } from "../seeds/firstTimersSeed";
import { FOLLOW_UPS_SEED } from "../seeds/followUpsSeed";
import { FOUNDATION_STUDENTS_SEED } from "../seeds/foundationStudentsSeed";
import { FOUNDATION_TEACHERS_SEED } from "../seeds/foundationTeachersSeed";
import { FOUNDATION_CLASSES_SEED } from "../seeds/foundationClassesSeed";
import { CELL_GROUPS_SEED } from "../seeds/cellGroupsSeed";
import { CELLS_SEED } from "../seeds/cellsSeed";
import { CELL_LEADERS_SEED } from "../seeds/cellLeadersSeed";
import { CELL_REPORTS_SEED } from "../seeds/cellReportsSeed";
import { FINANCE_RECORDS_SEED } from "../seeds/financeRecordsSeed";
import { PUBLIC_GIVING_SUBMISSIONS_SEED } from "../seeds/publicGivingSubmissionsSeed";
import { FINANCE_DISBURSEMENTS_SEED } from "../seeds/financeDisbursementsSeed";
import { REQUISITIONS_SEED, REQUISITION_TIMELINE_SEED } from "../seeds/requisitionsSeed";
import { INVENTORY_ITEMS_SEED } from "../seeds/inventoryItemsSeed";
import { INVENTORY_MOVEMENTS_SEED } from "../seeds/inventoryMovementsSeed";
import { INVENTORY_MAINTENANCE_SEED } from "../seeds/inventoryMaintenanceSeed";
import { VENUE_SPACES_SEED } from "../seeds/venueSpacesSeed";
import { SERVICE_CHECKLISTS_SEED } from "../seeds/serviceChecklistsSeed";
import { STAFF_SEED } from "../seeds/staffSeed";
import { STAFF_DEPARTMENTS_SEED } from "../seeds/staffDepartmentsSeed";
import { STAFF_ROLES_SEED } from "../seeds/staffRolesSeed";
import { STAFF_SALARIES_SEED } from "../seeds/staffSalariesSeed";
import { STAFF_PERFORMANCE_SEED } from "../seeds/staffPerformanceSeed";
import { STAFF_DOCUMENTS_SEED } from "../seeds/staffDocumentsSeed";
import { STAFF_ATTENDANCE_SEED } from "../seeds/staffAttendanceSeed";
import { USERS_SEED } from "../seeds/usersSeed";
import { ROLES_SEED } from "../seeds/rolesSeed";
import { PERMISSIONS_SEED } from "../seeds/permissionsSeed";
import { PERMISSION_TEMPLATES_SEED } from "../seeds/permissionTemplatesSeed";
import { AUDIT_LOGS_SEED } from "../seeds/auditLogsSeed";
import { MEDIA_TEAM_SEED } from "../seeds/mediaTeamSeed";
import { MEDIA_ROLES_SEED } from "../seeds/mediaRolesSeed";
import { MEDIA_SERVICES_SEED } from "../seeds/mediaServicesSeed";
import { MEDIA_SCHEDULES_SEED } from "../seeds/mediaSchedulesSeed";
import { MEDIA_CHANNELS_SEED } from "../seeds/mediaChannelsSeed";
import { MEDIA_PERFORMANCE_SEED } from "../seeds/mediaPerformanceSeed";
import { MEDIA_AWARDS_SEED } from "../seeds/mediaAwardsSeed";
import { COUNSELING_REQUESTS_SEED } from "../seeds/counselingRequestsSeed";
import { COUNSELING_CASES_SEED } from "../seeds/counselingCasesSeed";
import { COUNSELING_APPOINTMENTS_SEED } from "../seeds/counselingAppointmentsSeed";
import { COUNSELORS_SEED } from "../seeds/counselorsSeed";
import { COUNSELING_FEEDBACK_SEED } from "../seeds/counselingFeedbackSeed";
import { COUNSELING_REFERRALS_SEED } from "../seeds/counselingReferralsSeed";
import { BAPTISMS_SEED } from "../seeds/baptismsSeed";
import { MARRIAGES_SEED } from "../seeds/marriagesSeed";
import { BABY_DEDICATIONS_SEED } from "../seeds/babyDedicationsSeed";
import { SACRAMENT_CERTIFICATES_SEED } from "../seeds/sacramentCertificatesSeed";
import { SACRAMENT_DOCUMENTS_SEED } from "../seeds/sacramentDocumentsSeed";
import { SACRAMENT_APPOINTMENTS_SEED } from "../seeds/sacramentAppointmentsSeed";
import { FEVO_WEEKLY_CONFIGS_SEED } from "../seeds/fevoWeeklyConfigsSeed";
import { FEVO_TEAMS_SEED } from "../seeds/fevoTeamsSeed";
import { FEVO_ACTIVITIES_SEED } from "../seeds/fevoActivitiesSeed";
import { FEVO_REPORTS_SEED } from "../seeds/fevoReportsSeed";
import { FEVO_MISSING_REPORTS_SEED } from "../seeds/fevoMissingReportsSeed";
import { FEVO_FOLLOW_UP_RECORDS_SEED } from "../seeds/fevoFollowUpRecordsSeed";
import { FEVO_EVANGELISM_RECORDS_SEED } from "../seeds/fevoEvangelismRecordsSeed";
import { FEVO_VISITATION_RECORDS_SEED } from "../seeds/fevoVisitationRecordsSeed";
import { FEVO_PRAYER_RECORDS_SEED } from "../seeds/fevoPrayerRecordsSeed";
import type { AccessPermission, AccessRole, AuditLog, PermissionTemplate } from "../types/entities";

/**
 * In-memory mock provider with tiny sample seed.
 * Safe for demos / unit experiments. Does not touch dashboard.js state.
 */
export function createMockProvider(): DataProvider {
  const users = createMemoryRepository<User>(USERS_SEED.map((r) => ({ ...r })));
  const churches = createMemoryRepository<Church>(CHURCHES_SEED.map((c) => ({ ...c })));
  const members = createMemoryRepository<Member>(MEMBERS_SEED.map((m) => ({ ...m })));
  const firstTimers = createMemoryRepository<FirstTimer>(
    FIRST_TIMERS_SEED.map((f) => ({ ...f })),
  );
  const followUps = createMemoryRepository<FollowUp>(
    FOLLOW_UPS_SEED.map((f) => ({ ...f })),
  );
  const foundationStudents = createMemoryRepository<FoundationStudent>(
    FOUNDATION_STUDENTS_SEED.map((s) => ({ ...s })),
  );
  const foundationTeachers = createMemoryRepository<FoundationTeacher>(
    FOUNDATION_TEACHERS_SEED.map((t) => ({ ...t })),
  );
  const foundationClassGroups = createMemoryRepository<FoundationClassGroup>(
    FOUNDATION_CLASSES_SEED.map((c) => ({ ...c })),
  );
  const foundationLessonSessions = createMemoryRepository<FoundationLessonSession>([]);
  const foundationTestSubmissions = createMemoryRepository<FoundationTestSubmission>([]);
  const foundationFinalExams = createMemoryRepository<FoundationFinalExam>([]);
  const financeRecords = createMemoryRepository<FinanceRecord>(
    FINANCE_RECORDS_SEED.map((r) => ({ ...r })),
  );
  const publicGivingSubmissions = createMemoryRepository<PublicGivingSubmission>(
    PUBLIC_GIVING_SUBMISSIONS_SEED.map((s) => ({ ...s })),
  );
  const financeDisbursements = createMemoryRepository<FinanceDisbursement>(
    FINANCE_DISBURSEMENTS_SEED.map((d) => ({ ...d })),
  );
  const requisitions = createMemoryRepository<Requisition>(
    REQUISITIONS_SEED.map((r) => ({ ...r })),
  );
  const requisitionTimeline = createMemoryRepository<RequisitionTimelineEvent>(
    REQUISITION_TIMELINE_SEED.map((e) => ({ ...e })),
  );
  const notifications = createMemoryRepository<Notification>([]);
  const cellGroups = createMemoryRepository<CellGroup>(CELL_GROUPS_SEED.map((g) => ({ ...g })));
  const cells = createMemoryRepository<Cell>(CELLS_SEED.map((c) => ({ ...c })));
  const cellLeaders = createMemoryRepository<CellLeader>(
    CELL_LEADERS_SEED.map((l) => ({ ...l })),
  );
  const cellReportSubmissions = createMemoryRepository<CellReportSubmission>(
    CELL_REPORTS_SEED.map((r) => ({ ...r })),
  );
  const mediaTechnicians = createMemoryRepository<MediaTechnician>(
    MEDIA_TEAM_SEED.map((r) => ({ ...r })),
  );
  const mediaSchedules = createMemoryRepository<MediaSchedule>(
    MEDIA_SCHEDULES_SEED.map((r) => ({ ...r })),
  );
  const mediaRoles = createMemoryRepository<MediaRole>(MEDIA_ROLES_SEED.map((r) => ({ ...r })));
  const mediaServices = createMemoryRepository<MediaService>(
    MEDIA_SERVICES_SEED.map((r) => ({ ...r })),
  );
  const mediaChannels = createMemoryRepository<MediaChannel>(
    MEDIA_CHANNELS_SEED.map((r) => ({ ...r })),
  );
  const mediaPerformance = createMemoryRepository<MediaPerformanceReview>(
    MEDIA_PERFORMANCE_SEED.map((r) => ({ ...r })),
  );
  const mediaAwards = createMemoryRepository<MediaAward>(MEDIA_AWARDS_SEED.map((r) => ({ ...r })));
  const counselingRequests = createMemoryRepository<CounselingRequest>(
    COUNSELING_REQUESTS_SEED.map((r) => ({ ...r })),
  );
  const counselingCases = createMemoryRepository<CounselingCase>(
    COUNSELING_CASES_SEED.map((r) => ({ ...r })),
  );
  const counselingAppointments = createMemoryRepository<CounselingAppointment>(
    COUNSELING_APPOINTMENTS_SEED.map((r) => ({ ...r })),
  );
  const counselors = createMemoryRepository<Counselor>(COUNSELORS_SEED.map((r) => ({ ...r })));
  const counselingFeedback = createMemoryRepository<CounselingFeedback>(
    COUNSELING_FEEDBACK_SEED.map((r) => ({ ...r })),
  );
  const counselingReferrals = createMemoryRepository<CounselingReferral>(
    COUNSELING_REFERRALS_SEED.map((r) => ({ ...r })),
  );
  const baptisms = createMemoryRepository<Baptism>(BAPTISMS_SEED.map((r) => ({ ...r })));
  const marriages = createMemoryRepository<Marriage>(MARRIAGES_SEED.map((r) => ({ ...r })));
  const babyDedications = createMemoryRepository<BabyDedication>(
    BABY_DEDICATIONS_SEED.map((r) => ({ ...r })),
  );
  const sacramentCertificates = createMemoryRepository<SacramentCertificate>(
    SACRAMENT_CERTIFICATES_SEED.map((r) => ({ ...r })),
  );
  const sacramentDocuments = createMemoryRepository<SacramentDocument>(
    SACRAMENT_DOCUMENTS_SEED.map((r) => ({ ...r })),
  );
  const sacramentAppointments = createMemoryRepository<SacramentAppointment>(
    SACRAMENT_APPOINTMENTS_SEED.map((r) => ({ ...r })),
  );
  const fevoWeeklyConfigs = createMemoryRepository<FevoWeeklyConfig>(
    FEVO_WEEKLY_CONFIGS_SEED.map((r) => ({ ...r })),
  );
  const fevoTeams = createMemoryRepository<FevoTeam>(FEVO_TEAMS_SEED.map((r) => ({ ...r })));
  const fevoActivities = createMemoryRepository<FevoActivity>(
    FEVO_ACTIVITIES_SEED.map((r) => ({ ...r })),
  );
  const fevoReports = createMemoryRepository<FevoReport>(FEVO_REPORTS_SEED.map((r) => ({ ...r })));
  const fevoMissingReports = createMemoryRepository<FevoMissingReport>(
    FEVO_MISSING_REPORTS_SEED.map((r) => ({ ...r })),
  );
  const fevoFollowUpRecords = createMemoryRepository<FevoFollowUpRecord>(
    FEVO_FOLLOW_UP_RECORDS_SEED.map((r) => ({ ...r })),
  );
  const fevoEvangelismRecords = createMemoryRepository<FevoEvangelismRecord>(
    FEVO_EVANGELISM_RECORDS_SEED.map((r) => ({ ...r })),
  );
  const fevoVisitationRecords = createMemoryRepository<FevoVisitationRecord>(
    FEVO_VISITATION_RECORDS_SEED.map((r) => ({ ...r })),
  );
  const fevoPrayerRecords = createMemoryRepository<FevoPrayerRecord>(
    FEVO_PRAYER_RECORDS_SEED.map((r) => ({ ...r })),
  );
  const inventoryItems = createMemoryRepository<InventoryItem>(
    INVENTORY_ITEMS_SEED.map((r) => ({ ...r })),
  );
  const inventoryMovements = createMemoryRepository<InventoryMovement>(
    INVENTORY_MOVEMENTS_SEED.map((r) => ({ ...r })),
  );
  const inventoryMaintenance = createMemoryRepository<InventoryMaintenanceRecord>(
    INVENTORY_MAINTENANCE_SEED.map((r) => ({ ...r })),
  );
  const venueSpaces = createMemoryRepository<VenueSpace>(
    VENUE_SPACES_SEED.map((r) => ({ ...r })),
  );
  const serviceChecklists = createMemoryRepository<ServiceChecklist>(
    SERVICE_CHECKLISTS_SEED.map((r) => ({ ...r })),
  );
  const staff = createMemoryRepository<StaffMember>(STAFF_SEED.map((r) => ({ ...r })));
  const staffDepartments = createMemoryRepository<StaffDepartment>(
    STAFF_DEPARTMENTS_SEED.map((r) => ({ ...r })),
  );
  const staffRoles = createMemoryRepository<StaffRole>(STAFF_ROLES_SEED.map((r) => ({ ...r })));
  const staffSalaries = createMemoryRepository<StaffSalary>(
    STAFF_SALARIES_SEED.map((r) => ({ ...r })),
  );
  const staffPerformance = createMemoryRepository<StaffPerformanceReview>(
    STAFF_PERFORMANCE_SEED.map((r) => ({ ...r })),
  );
  const staffDocuments = createMemoryRepository<StaffDocument>(
    STAFF_DOCUMENTS_SEED.map((r) => ({ ...r })),
  );
  const staffAttendance = createMemoryRepository<StaffAttendance>(
    STAFF_ATTENDANCE_SEED.map((r) => ({ ...r })),
  );
  const roles = createMemoryRepository<AccessRole>(ROLES_SEED.map((r) => ({ ...r })));
  const permissions = createMemoryRepository<AccessPermission>(
    PERMISSIONS_SEED.map((r) => ({ ...r })),
  );
  const permissionTemplates = createMemoryRepository<PermissionTemplate>(
    PERMISSION_TEMPLATES_SEED.map((r) => ({ ...r })),
  );
  const auditLogs = createMemoryRepository<AuditLog>(AUDIT_LOGS_SEED.map((r) => ({ ...r })));

  const map: Record<EntityCollectionName, EntityRepository<unknown>> = {
    users: users as EntityRepository<unknown>,
    churches: churches as EntityRepository<unknown>,
    members: members as EntityRepository<unknown>,
    first_timers: firstTimers as EntityRepository<unknown>,
    follow_ups: followUps as EntityRepository<unknown>,
    foundation_students: foundationStudents as EntityRepository<unknown>,
    foundation_teachers: foundationTeachers as EntityRepository<unknown>,
    foundation_class_groups: foundationClassGroups as EntityRepository<unknown>,
    foundation_lesson_sessions: foundationLessonSessions as EntityRepository<unknown>,
    foundation_test_submissions: foundationTestSubmissions as EntityRepository<unknown>,
    foundation_final_exams: foundationFinalExams as EntityRepository<unknown>,
    finance_records: financeRecords as EntityRepository<unknown>,
    public_giving_submissions: publicGivingSubmissions as EntityRepository<unknown>,
    finance_disbursements: financeDisbursements as EntityRepository<unknown>,
    requisitions: requisitions as EntityRepository<unknown>,
    requisition_timeline: requisitionTimeline as EntityRepository<unknown>,
    notifications: notifications as EntityRepository<unknown>,
    cell_groups: cellGroups as EntityRepository<unknown>,
    cells: cells as EntityRepository<unknown>,
    cell_leaders: cellLeaders as EntityRepository<unknown>,
    cell_report_submissions: cellReportSubmissions as EntityRepository<unknown>,
    media_technicians: mediaTechnicians as EntityRepository<unknown>,
    media_schedules: mediaSchedules as EntityRepository<unknown>,
    media_roles: mediaRoles as EntityRepository<unknown>,
    media_services: mediaServices as EntityRepository<unknown>,
    media_channels: mediaChannels as EntityRepository<unknown>,
    media_performance: mediaPerformance as EntityRepository<unknown>,
    media_awards: mediaAwards as EntityRepository<unknown>,
    counseling_requests: counselingRequests as EntityRepository<unknown>,
    counseling_cases: counselingCases as EntityRepository<unknown>,
    counseling_appointments: counselingAppointments as EntityRepository<unknown>,
    counselors: counselors as EntityRepository<unknown>,
    counseling_feedback: counselingFeedback as EntityRepository<unknown>,
    counseling_referrals: counselingReferrals as EntityRepository<unknown>,
    baptisms: baptisms as EntityRepository<unknown>,
    marriages: marriages as EntityRepository<unknown>,
    baby_dedications: babyDedications as EntityRepository<unknown>,
    sacrament_certificates: sacramentCertificates as EntityRepository<unknown>,
    sacrament_documents: sacramentDocuments as EntityRepository<unknown>,
    sacrament_appointments: sacramentAppointments as EntityRepository<unknown>,
    fevo_weekly_configs: fevoWeeklyConfigs as EntityRepository<unknown>,
    fevo_teams: fevoTeams as EntityRepository<unknown>,
    fevo_activities: fevoActivities as EntityRepository<unknown>,
    fevo_reports: fevoReports as EntityRepository<unknown>,
    fevo_missing_reports: fevoMissingReports as EntityRepository<unknown>,
    fevo_follow_up_records: fevoFollowUpRecords as EntityRepository<unknown>,
    fevo_evangelism_records: fevoEvangelismRecords as EntityRepository<unknown>,
    fevo_visitation_records: fevoVisitationRecords as EntityRepository<unknown>,
    fevo_prayer_records: fevoPrayerRecords as EntityRepository<unknown>,
    inventory_items: inventoryItems as EntityRepository<unknown>,
    inventory_movements: inventoryMovements as EntityRepository<unknown>,
    inventory_maintenance: inventoryMaintenance as EntityRepository<unknown>,
    venue_spaces: venueSpaces as EntityRepository<unknown>,
    service_checklists: serviceChecklists as EntityRepository<unknown>,
    staff: staff as EntityRepository<unknown>,
    staff_departments: staffDepartments as EntityRepository<unknown>,
    staff_roles: staffRoles as EntityRepository<unknown>,
    staff_salaries: staffSalaries as EntityRepository<unknown>,
    staff_performance: staffPerformance as EntityRepository<unknown>,
    staff_documents: staffDocuments as EntityRepository<unknown>,
    staff_attendance: staffAttendance as EntityRepository<unknown>,
    roles: roles as EntityRepository<unknown>,
    permissions: permissions as EntityRepository<unknown>,
    permission_templates: permissionTemplates as EntityRepository<unknown>,
    audit_logs: auditLogs as EntityRepository<unknown>,
  };

  return {
    name: "mock",
    description: "In-memory mock data (isolated from dashboard localStorage UI state).",
    isReady: () => true,
    users,
    churches,
    members,
    firstTimers,
    followUps,
    foundationStudents,
    foundationTeachers,
    foundationClassGroups,
    foundationLessonSessions,
    foundationTestSubmissions,
    foundationFinalExams,
    financeRecords,
    publicGivingSubmissions,
    financeDisbursements,
    requisitions,
    requisitionTimeline,
    notifications,
    cellGroups,
    cells,
    cellLeaders,
    cellReportSubmissions,
    mediaTechnicians,
    mediaSchedules,
    mediaRoles,
    mediaServices,
    mediaChannels,
    mediaPerformance,
    mediaAwards,
    counselingRequests,
    counselingCases,
    counselingAppointments,
    counselors,
    counselingFeedback,
    counselingReferrals,
    baptisms,
    marriages,
    babyDedications,
    sacramentCertificates,
    sacramentDocuments,
    sacramentAppointments,
    fevoWeeklyConfigs,
    fevoTeams,
    fevoActivities,
    fevoReports,
    fevoMissingReports,
    fevoFollowUpRecords,
    fevoEvangelismRecords,
    fevoVisitationRecords,
    fevoPrayerRecords,
    inventoryItems,
    inventoryMovements,
    inventoryMaintenance,
    venueSpaces,
    serviceChecklists,
    staff,
    staffDepartments,
    staffRoles,
    staffSalaries,
    staffPerformance,
    staffDocuments,
    staffAttendance,
    roles,
    permissions,
    permissionTemplates,
    auditLogs,
    collection(name) {
      return map[name];
    },
  };
}
