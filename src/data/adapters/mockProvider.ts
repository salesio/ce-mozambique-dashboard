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
  MediaSchedule,
  MediaTechnician,
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

const sampleUser: User = {
  id: "user-admin-mock",
  email: "admin@ce-mozambique.org",
  fullName: "Admin Principal",
  role: "national_admin",
  churchId: "church-hq",
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

/**
 * In-memory mock provider with tiny sample seed.
 * Safe for demos / unit experiments. Does not touch dashboard.js state.
 */
export function createMockProvider(): DataProvider {
  const users = createMemoryRepository<User>([sampleUser]);
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
  const mediaTechnicians = createMemoryRepository<MediaTechnician>([]);
  const mediaSchedules = createMemoryRepository<MediaSchedule>([]);
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
    collection(name) {
      return map[name];
    },
  };
}
