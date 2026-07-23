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
  MediaSchedule,
  MediaTechnician,
  Member,
  Notification,
  Requisition,
  RequisitionTimelineEvent,
  User,
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
    collection(name) {
      return map[name];
    },
  };
}
