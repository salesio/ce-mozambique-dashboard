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
  MediaAward,
  MediaChannel,
  MediaPerformanceReview,
  MediaRole,
  MediaSchedule,
  MediaService,
  MediaTechnician,
  Member,
  Notification,
  Requisition,
  RequisitionTimelineEvent,
  ServiceChecklist,
  AccessPermission,
  AccessRole,
  AuditLog,
  PermissionTemplate,
  StaffAttendance,
  StaffDepartment,
  StaffDocument,
  StaffMember,
  StaffPerformanceReview,
  StaffRole,
  StaffSalary,
  User,
  VenueSpace,
}

/** Result wrapper so adapters can return soft failures without throwing. */
export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export type ListOptions = {
  limit?: number;
  offset?: number;
  churchId?: EntityId;
};

/**
 * Generic CRUD-ish repository for a single collection.
 * Module migrations should implement real methods gradually.
 */
export interface EntityRepository<T> {
  list(options?: ListOptions): Promise<DataResult<T[]>>;
  getById(id: EntityId): Promise<DataResult<T | null>>;
  create?(input: Partial<T>): Promise<DataResult<T>>;
  update?(id: EntityId, input: Partial<T>): Promise<DataResult<T>>;
  remove?(id: EntityId): Promise<DataResult<boolean>>;
}

/**
 * Central data provider surface.
 * Not every method is wired to the UI yet — this is the migration contract.
 */
export interface DataProvider {
  readonly name: DataSourceName;
  readonly description: string;

  /** True when the provider is ready for real I/O (vs. stub). */
  isReady(): boolean;

  users: EntityRepository<User>;
  churches: EntityRepository<Church>;
  members: EntityRepository<Member>;
  firstTimers: EntityRepository<FirstTimer>;
  followUps: EntityRepository<FollowUp>;
  foundationStudents: EntityRepository<FoundationStudent>;
  foundationTeachers: EntityRepository<FoundationTeacher>;
  foundationClassGroups: EntityRepository<FoundationClassGroup>;
  foundationLessonSessions: EntityRepository<FoundationLessonSession>;
  foundationTestSubmissions: EntityRepository<FoundationTestSubmission>;
  foundationFinalExams: EntityRepository<FoundationFinalExam>;
  financeRecords: EntityRepository<FinanceRecord>;
  publicGivingSubmissions: EntityRepository<PublicGivingSubmission>;
  financeDisbursements: EntityRepository<FinanceDisbursement>;
  requisitions: EntityRepository<Requisition>;
  requisitionTimeline: EntityRepository<RequisitionTimelineEvent>;
  notifications: EntityRepository<Notification>;
  cellGroups: EntityRepository<CellGroup>;
  cells: EntityRepository<Cell>;
  cellLeaders: EntityRepository<CellLeader>;
  cellReportSubmissions: EntityRepository<CellReportSubmission>;
  mediaTechnicians: EntityRepository<MediaTechnician>;
  mediaSchedules: EntityRepository<MediaSchedule>;
  mediaRoles: EntityRepository<MediaRole>;
  mediaServices: EntityRepository<MediaService>;
  mediaChannels: EntityRepository<MediaChannel>;
  mediaPerformance: EntityRepository<MediaPerformanceReview>;
  mediaAwards: EntityRepository<MediaAward>;
  inventoryItems: EntityRepository<InventoryItem>;
  inventoryMovements: EntityRepository<InventoryMovement>;
  inventoryMaintenance: EntityRepository<InventoryMaintenanceRecord>;
  venueSpaces: EntityRepository<VenueSpace>;
  serviceChecklists: EntityRepository<ServiceChecklist>;
  staff: EntityRepository<StaffMember>;
  staffDepartments: EntityRepository<StaffDepartment>;
  staffRoles: EntityRepository<StaffRole>;
  staffSalaries: EntityRepository<StaffSalary>;
  staffPerformance: EntityRepository<StaffPerformanceReview>;
  staffDocuments: EntityRepository<StaffDocument>;
  staffAttendance: EntityRepository<StaffAttendance>;
  roles: EntityRepository<AccessRole>;
  permissions: EntityRepository<AccessPermission>;
  permissionTemplates: EntityRepository<PermissionTemplate>;
  auditLogs: EntityRepository<AuditLog>;

  /** Escape hatch for progressive module adapters. */
  collection(name: EntityCollectionName): EntityRepository<unknown>;
}

export type DataSourceName = "mock" | "local" | "api" | "supabase";
