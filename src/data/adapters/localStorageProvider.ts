import type {
  Cell,
  CellGroup,
  CellLeader,
  CellReportSubmission,
  Church,
  EntityCollectionName,
  EntityId,
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
import type {
  DataProvider,
  DataResult,
  EntityRepository,
  ListOptions,
} from "../types/repository";
import { createMemoryRepository } from "./memoryRepo";

const STORAGE_PREFIX = "ce-data-layer:";

/** Collection → storage key (first_timers uses hyphen per pilot plan). */
function storageKeyFor(key: EntityCollectionName): string {
  if (key === "first_timers") return `${STORAGE_PREFIX}first-timers`;
  if (key === "follow_ups") return `${STORAGE_PREFIX}follow-ups`;
  if (key === "foundation_students") return `${STORAGE_PREFIX}foundation-students`;
  if (key === "foundation_teachers") return `${STORAGE_PREFIX}foundation-teachers`;
  if (key === "foundation_class_groups") return `${STORAGE_PREFIX}foundation-classes`;
  if (key === "cell_groups") return `${STORAGE_PREFIX}cell-groups`;
  if (key === "cells") return `${STORAGE_PREFIX}cells`;
  if (key === "cell_leaders") return `${STORAGE_PREFIX}cell-leaders`;
  if (key === "cell_report_submissions") return `${STORAGE_PREFIX}cell-reports`;
  if (key === "finance_records") return `${STORAGE_PREFIX}finance-records`;
  if (key === "public_giving_submissions") return `${STORAGE_PREFIX}public-giving-submissions`;
  if (key === "finance_disbursements") return `${STORAGE_PREFIX}finance-disbursements`;
  if (key === "requisitions") return `${STORAGE_PREFIX}requisitions`;
  if (key === "requisition_timeline") return `${STORAGE_PREFIX}requisition-timeline`;
  if (key === "inventory_items") return `${STORAGE_PREFIX}inventory-items`;
  if (key === "inventory_movements") return `${STORAGE_PREFIX}inventory-movements`;
  if (key === "inventory_maintenance") return `${STORAGE_PREFIX}inventory-maintenance`;
  if (key === "venue_spaces") return `${STORAGE_PREFIX}venue-spaces`;
  if (key === "service_checklists") return `${STORAGE_PREFIX}service-checklists`;
  if (key === "staff") return `${STORAGE_PREFIX}staff`;
  if (key === "staff_departments") return `${STORAGE_PREFIX}staff-departments`;
  if (key === "staff_roles") return `${STORAGE_PREFIX}staff-roles`;
  if (key === "staff_salaries") return `${STORAGE_PREFIX}staff-salaries`;
  if (key === "staff_performance") return `${STORAGE_PREFIX}staff-performance`;
  if (key === "staff_documents") return `${STORAGE_PREFIX}staff-documents`;
  if (key === "staff_attendance") return `${STORAGE_PREFIX}staff-attendance`;
  return STORAGE_PREFIX + key;
}

type WithId = { id: EntityId };

function loadCollection<T extends WithId>(key: EntityCollectionName): T[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKeyFor(key));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function saveCollection<T extends WithId>(key: EntityCollectionName, rows: T[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKeyFor(key), JSON.stringify(rows));
  } catch (error) {
    console.warn(`[CE Data] Failed to persist ${key} to localStorage`, error);
  }
}

/**
 * localStorage-backed repositories under the `ce-data-layer:` prefix.
 * Intentionally separate from the main dashboard STORAGE_KEY blob so
 * gradual module migration does not corrupt existing UI state.
 */
function createPersistedRepository<T extends WithId>(
  key: EntityCollectionName,
): EntityRepository<T> {
  const seed = loadCollection<T>(key);
  const memory = createMemoryRepository<T>(seed);

  const persist = () => saveCollection(key, memory.__rows);

  return {
    async list(options?: ListOptions) {
      return memory.list(options);
    },
    async getById(id: EntityId) {
      return memory.getById(id);
    },
    async create(input: Partial<T>): Promise<DataResult<T>> {
      const result = await memory.create!(input);
      if (result.ok) persist();
      return result;
    },
    async update(id: EntityId, input: Partial<T>): Promise<DataResult<T>> {
      const result = await memory.update!(id, input);
      if (result.ok) persist();
      return result;
    },
    async remove(id: EntityId): Promise<DataResult<boolean>> {
      const result = await memory.remove!(id);
      if (result.ok) persist();
      return result;
    },
  };
}

export function createLocalStorageProvider(): DataProvider {
  const users = createPersistedRepository<User>("users");
  const churches = createPersistedRepository<Church>("churches");
  const members = createPersistedRepository<Member>("members");
  const firstTimers = createPersistedRepository<FirstTimer>("first_timers");
  const followUps = createPersistedRepository<FollowUp>("follow_ups");
  const foundationStudents = createPersistedRepository<FoundationStudent>("foundation_students");
  const foundationTeachers = createPersistedRepository<FoundationTeacher>("foundation_teachers");
  const foundationClassGroups = createPersistedRepository<FoundationClassGroup>(
    "foundation_class_groups",
  );
  const foundationLessonSessions = createPersistedRepository<FoundationLessonSession>(
    "foundation_lesson_sessions",
  );
  const foundationTestSubmissions = createPersistedRepository<FoundationTestSubmission>(
    "foundation_test_submissions",
  );
  const foundationFinalExams = createPersistedRepository<FoundationFinalExam>(
    "foundation_final_exams",
  );
  const financeRecords = createPersistedRepository<FinanceRecord>("finance_records");
  const publicGivingSubmissions = createPersistedRepository<PublicGivingSubmission>(
    "public_giving_submissions",
  );
  const financeDisbursements = createPersistedRepository<FinanceDisbursement>(
    "finance_disbursements",
  );
  const requisitions = createPersistedRepository<Requisition>("requisitions");
  const requisitionTimeline = createPersistedRepository<RequisitionTimelineEvent>(
    "requisition_timeline",
  );
  const notifications = createPersistedRepository<Notification>("notifications");
  const cellGroups = createPersistedRepository<CellGroup>("cell_groups");
  const cells = createPersistedRepository<Cell>("cells");
  const cellLeaders = createPersistedRepository<CellLeader>("cell_leaders");
  const cellReportSubmissions = createPersistedRepository<CellReportSubmission>(
    "cell_report_submissions",
  );
  const mediaTechnicians = createPersistedRepository<MediaTechnician>("media_technicians");
  const mediaSchedules = createPersistedRepository<MediaSchedule>("media_schedules");
  const inventoryItems = createPersistedRepository<InventoryItem>("inventory_items");
  const inventoryMovements = createPersistedRepository<InventoryMovement>("inventory_movements");
  const inventoryMaintenance =
    createPersistedRepository<InventoryMaintenanceRecord>("inventory_maintenance");
  const venueSpaces = createPersistedRepository<VenueSpace>("venue_spaces");
  const serviceChecklists = createPersistedRepository<ServiceChecklist>("service_checklists");
  const staff = createPersistedRepository<StaffMember>("staff");
  const staffDepartments = createPersistedRepository<StaffDepartment>("staff_departments");
  const staffRoles = createPersistedRepository<StaffRole>("staff_roles");
  const staffSalaries = createPersistedRepository<StaffSalary>("staff_salaries");
  const staffPerformance = createPersistedRepository<StaffPerformanceReview>("staff_performance");
  const staffDocuments = createPersistedRepository<StaffDocument>("staff_documents");
  const staffAttendance = createPersistedRepository<StaffAttendance>("staff_attendance");

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
    name: "local",
    description:
      "localStorage provider (ce-data-layer:* keys). Separate from dashboard.js UI state.",
    isReady: () => typeof localStorage !== "undefined",
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
