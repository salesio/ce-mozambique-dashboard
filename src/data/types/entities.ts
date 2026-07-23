/**
 * Domain entity types for progressive data migration.
 * These are intentionally independent of dashboard.js localStorage shapes
 * so modules can migrate one-by-one without a big-bang rewrite.
 */

export type EntityId = string;

export type IsoDate = string;
export type IsoDateTime = string;

// ---------------------------------------------------------------------------
// Core identity & organisation
// ---------------------------------------------------------------------------

/**
 * User / login account — dashboard-compatible (name, role, church_id)
 * plus English model aliases for progressive migration.
 * Never store real passwords in localStorage.
 */
export interface User {
  id: EntityId;
  email: string | null;
  /** Dashboard UI field */
  name?: string | null;
  fullName?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  phone?: string | null;

  role?: string | null;
  role_id?: EntityId | null;
  role_name?: string | null;

  churchId?: EntityId | null;
  church_id?: EntityId | null;
  church_name?: string | null;

  department_id?: EntityId | null;
  department_name?: string | null;
  assigned_department?: string | null;
  department_permissions?: string[] | null;
  can_view_all_churches?: boolean | null;

  staff_id?: EntityId | null;
  staff_name?: string | null;
  assigned_staff_name?: string | null;
  assigned_cells?: string[] | null;
  assigned_teams?: string[] | null;
  assigned_groups?: string[] | null;
  assigned_foundation_teacher_id?: string | null;

  status?: string | null;
  isActive?: boolean;
  has_dashboard_access?: boolean | null;

  last_login_at?: IsoDateTime | null;
  last_active_at?: IsoDateTime | null;
  failed_login_attempts?: number | null;
  locked_until?: IsoDateTime | null;
  preferred_language?: string | null;
  avatar_url?: string | null;
  notes?: string | null;

  /** Demo-only password marker — never real credentials */
  demo_password_hint?: string | null;

  permissions?: Array<Record<string, unknown>> | null;

  created_by?: string | null;
  created_by_name?: string | null;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

/** Access-control role (app RBAC), distinct from StaffRole titles. */
export interface AccessRole {
  id: EntityId;
  name?: string | null;
  display_name?: string | null;
  description?: string | null;
  level?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  is_system_role?: boolean | null;
  is_custom_role?: boolean | null;
  permission_template_id?: EntityId | null;
  default_scope?: string | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface AccessPermission {
  id: EntityId;
  role_id?: EntityId | null;
  role_name?: string | null;
  module?: string | null;
  can_view?: boolean | null;
  can_create?: boolean | null;
  can_edit?: boolean | null;
  can_delete?: boolean | null;
  can_approve?: boolean | null;
  can_verify?: boolean | null;
  can_release_resources?: boolean | null;
  can_export?: boolean | null;
  can_manage_settings?: boolean | null;
  can_view_salary?: boolean | null;
  scope?: string | null;
  conditions?: Record<string, unknown> | null;
  is_sensitive?: boolean | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PermissionTemplate {
  id: EntityId;
  name?: string | null;
  description?: string | null;
  role_level?: string | null;
  permissions?: Array<Record<string, unknown>> | null;
  is_system_template?: boolean | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface AuditLog {
  id: EntityId;
  user_id?: EntityId | null;
  user_name?: string | null;
  user_role?: string | null;
  /** Legacy dashboard fields */
  actor?: string | null;
  church_id?: EntityId | null;
  date?: IsoDate | null;

  module?: string | null;
  action?: string | null;
  entity_type?: string | null;
  entity_id?: EntityId | null;
  entity_label?: string | null;
  old_value?: unknown;
  new_value?: unknown;
  description?: string | null;
  severity?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: IsoDate | IsoDateTime;
  metadata?: Record<string, unknown> | null;
}

/** Service times as used by the Churches UI module. */
export interface ChurchServiceTime {
  id: string;
  day_of_week: string;
  service_name: string;
  time: string;
  service_type: string;
  is_active: boolean;
  notes?: string;
}

/**
 * Church record — dashboard-compatible (snake_case) so the Churches module
 * can migrate without reshaping every field.
 */
export interface Church {
  id: EntityId;
  church_id?: string;
  /** Display name used throughout the dashboard */
  church_name: string;
  /** @deprecated Prefer church_name; kept for adapter aliases */
  name?: string;
  public_name?: string | null;
  publicName?: string | null;
  type?: string | null;
  province: string | null;
  city: string | null;
  district_or_area?: string | null;
  districtOrArea?: string | null;
  address?: string | null;
  pastor_in_charge?: string | null;
  phone_primary?: string | null;
  phone_secondary?: string | null;
  phonePrimary?: string | null;
  phoneSecondary?: string | null;
  email?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  service_times?: ChurchServiceTime[];
  parent_church_id?: string | null;
  status?: string | null;
  information_status?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
  attendance_last_4_weeks?: number[];
  isActive?: boolean;
}

/**
 * Member record — dashboard-compatible (PT field names from the Membros UI)
 * plus optional English aliases from the data-layer model.
 */
export type MemberStatus =
  | "Active"
  | "Activo"
  | "Inactive"
  | "Inactivo"
  | "In Progress"
  | "In Follow-Up"
  | "Em Acompanhamento"
  | "Transferred"
  | "Transferido"
  | "Pending"
  | "Pendente"
  | string;

export type MemberSource =
  | "Manual"
  | "First Timer"
  | "Primeira Vez"
  | "Foundation School"
  | "Escola de Fundação"
  | "Transfer"
  | "Transferência"
  | "Public Form"
  | "Other"
  | string;

export interface Member {
  id: EntityId;
  /** UI / PT fields used by dashboard.js */
  tratamento?: string | null;
  nome?: string | null;
  apelido?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  endereco?: string | null;
  genero?: string | null;
  data_de_nascimento?: IsoDate | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;
  celula?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  departamento?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  estado?: MemberStatus | null;
  data_de_entrada?: IsoDate | null;
  origem?: MemberSource | null;
  notas?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;

  /** English model aliases (optional) */
  title?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  gender?: string | null;
  date_of_birth?: IsoDate | null;
  phone?: string | null;
  address?: string | null;
  churchId?: EntityId | null;
  status?: MemberStatus | null;
  member_since?: IsoDate | null;
  source?: MemberSource | null;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
  isActive?: boolean;
}

// ---------------------------------------------------------------------------
// First timers & follow-up
// ---------------------------------------------------------------------------

/**
 * First Timer / Primeira Vez — dashboard-compatible PT fields
 * plus English snake_case / camelCase model aliases for the data layer.
 *
 * Status examples: New, Pending Follow-Up, Contacted, Interested in Foundation School,
 * Converted to Member, Closed (and PT/UI variants like Pending, Became Member).
 *
 * follow_up_status examples: Pending, Contacted, No Response, Visit Scheduled,
 * Sent to Foundation School, Became Member, Closed.
 */
export interface FirstTimer {
  id: EntityId;
  /** UI / PT fields used by dashboard.js */
  tratamento?: string | null;
  nome?: string | null;
  apelido?: string | null;
  genero?: string | null;
  data_de_nascimento?: IsoDate | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  endereco?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;
  celula_preferida?: string | null;
  data_do_culto?: IsoDate | null;
  culto?: string | null;
  convidado_por?: string | null;
  nasceu_de_novo?: boolean | null;
  quer_escola_de_fundacao?: boolean | null;
  quer_aconselhamento?: boolean | null;
  interesse_em_celula?: boolean | null;
  estado_do_seguimento?: string | null;
  conselheiro_responsavel?: string | null;
  conselheiro_responsavel_id?: EntityId | null;
  proxima_data_contacto?: IsoDate | null;
  convertida_em_membro?: boolean | null;
  member_id?: EntityId | null;
  notas?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;

  /** Spec / English model fields */
  title?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: IsoDate | null;
  date_of_birth?: IsoDate | null;
  phone?: string | null;
  address?: string | null;
  neighbourhood?: string | null;
  churchId?: EntityId | null;
  visit_date?: IsoDate | null;
  service_name?: string | null;
  serviceDate?: IsoDate | null;
  serviceName?: string | null;
  invited_by?: string | null;
  invitedBy?: string | null;
  born_again?: boolean | null;
  bornAgain?: boolean | null;
  wants_foundation_school?: boolean | null;
  wantsFoundationSchool?: boolean | null;
  wants_counseling?: boolean | null;
  wantsCounseling?: boolean | null;
  interested_in_cell?: boolean | null;
  wantsCell?: boolean | null;
  willAttendNextService?: boolean | null;
  follow_up_status?: string | null;
  followUpStatus?: string | null;
  follow_up_responsible_id?: EntityId | null;
  follow_up_responsible_name?: string | null;
  next_follow_up_date?: IsoDate | null;
  converted_to_member?: boolean | null;
  status?: string | null;
  profession?: string | null;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/** Timeline event for a follow-up case / contact log. */
export interface FollowUpTimelineEvent {
  id: EntityId;
  follow_up_id?: EntityId | null;
  event_type: string;
  title: string;
  description?: string | null;
  performed_by_user_id?: EntityId | null;
  performed_by_name?: string | null;
  performed_at?: IsoDateTime | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Follow-Up / Acompanhamento — dashboard-compatible PT contact-log fields
 * plus English model fields for progressive migration.
 *
 * The Acompanhamento UI lists First Timers by status; each contact action
 * also creates/updates a FollowUp log entry in this collection.
 */
export interface FollowUp {
  id: EntityId;
  /** Dashboard contact-log fields */
  first_timer_id?: EntityId | null;
  member_id?: EntityId | null;
  counseling_request_id?: EntityId | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  data_do_contacto?: IsoDate | null;
  metodo?: string | null;
  resultado?: string | null;
  proximo_passo?: string | null;
  proxima_data_de_contacto?: IsoDate | null;
  notas?: string | null;
  notes?: string | null;
  actualizado_por?: string | null;
  estado?: string | null;
  status?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;

  /** Spec / English model */
  firstTimerId?: EntityId | null;
  person_type?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  phone?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  follow_up_date?: IsoDate | null;
  next_follow_up_date?: IsoDate | null;
  contact_method?: string | null;
  result?: string | null;
  next_step?: string | null;
  priority?: string | null;
  wants_foundation_school?: boolean | null;
  wants_counseling?: boolean | null;
  interested_in_cell?: boolean | null;
  became_member?: boolean | null;
  timeline?: FollowUpTimelineEvent[];
  dueAt?: IsoDateTime | null;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

// ---------------------------------------------------------------------------
// Foundation School
// ---------------------------------------------------------------------------

/** delivery_mode: in_person | online | home_visit | prison_ministry | hybrid | other */
export type FoundationDeliveryMode =
  | "in_person"
  | "online"
  | "home_visit"
  | "prison_ministry"
  | "hybrid"
  | "other"
  | string;

/** role_type: Rector | Coordinator | Teacher | Assistant Teacher */
export type FoundationTeacherRole =
  | "Rector"
  | "Coordinator"
  | "Teacher"
  | "Assistant Teacher"
  | string;

export interface FoundationStudent {
  id: EntityId;
  /** Dashboard PT fields */
  first_timer_id?: EntityId | null;
  member_id?: EntityId | null;
  nome?: string | null;
  apelido?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  celula?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  class_group_id?: EntityId | null;
  class_group_name?: string | null;
  mes_de_inscricao?: string | null;
  class_attendance?: Record<string, boolean> | null;
  completed_classes?: number | null;
  class_progress_percent?: number | null;
  estado?: string | null;
  nota_exame?: number | null;
  pratica_evangelismo?: boolean | null;
  numero_de_almas_ganhas?: number | null;
  aprovado?: boolean | null;
  graduado?: boolean | null;
  certificado_emitido?: boolean | null;
  notes?: string | null;
  notas?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;

  /** Spec / English model */
  full_name?: string | null;
  fullName?: string | null;
  phone?: string | null;
  churchId?: EntityId | null;
  enrollment_date?: IsoDate | null;
  quarter?: string | null;
  year?: number | null;
  status?: string | null;
  preferred_delivery_mode?: FoundationDeliveryMode | null;
  assigned_delivery_mode?: FoundationDeliveryMode | null;
  assigned_location_id?: EntityId | null;
  assigned_location_name?: string | null;
  is_prison_ministry_student?: boolean | null;
  prison_center_id?: EntityId | null;
  prison_center_name?: string | null;
  needs_home_visit_class?: boolean | null;
  home_address?: string | null;
  can_attend_online?: boolean | null;
  online_contact?: string | null;
  completed_lessons_count?: number | null;
  attended_lessons_count?: number | null;
  lesson_progress_percent?: number | null;
  lesson_tests_total_score?: number | null;
  lesson_tests_max_score?: number | null;
  lesson_tests_percentage?: number | null;
  final_exam_score?: number | null;
  final_exam_max_score?: number | null;
  final_exam_percentage?: number | null;
  course_final_percentage?: number | null;
  course_passed?: boolean | null;
  soul_winning_completed?: boolean | null;
  souls_won_count?: number | null;
  ready_for_exam?: boolean | null;
  ready_for_graduation?: boolean | null;
  graduated?: boolean | null;
  graduation_date?: IsoDate | null;
  certificate_issued?: boolean | null;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface FoundationTeacher {
  id: EntityId;
  user_id?: EntityId | null;
  staff_id?: EntityId | null;
  full_name?: string | null;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  /** Rector | Coordinator | Teacher | Assistant Teacher */
  role_type?: FoundationTeacherRole | null;
  status?: string | null;
  /** Lessons the teacher can teach (alias of subjects_or_lessons_allowed). */
  can_teach_lessons?: number[] | null;
  subjects_or_lessons_allowed?: number[] | null;
  can_teach_all_lessons?: boolean | null;
  delivery_modes_allowed?: FoundationDeliveryMode[] | null;
  assigned_locations?: string[] | null;
  availability?: string | null;
  max_classes_per_week?: number | null;
  is_prison_ministry_teacher?: boolean | null;
  can_teach_online?: boolean | null;
  can_teach_home_visit?: boolean | null;
  can_teach_in_person?: boolean | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/** Class group / cohort (maps to foundation_class_groups / foundation-classes). */
export interface FoundationClassGroup {
  id: EntityId;
  name: string;
  church_id?: EntityId | null;
  church_name?: string | null;
  quarter?: string | null;
  year?: number | null;
  delivery_mode?: FoundationDeliveryMode | null;
  primary_location_id?: EntityId | null;
  primary_location_name?: string | null;
  location_type?: string | null;
  prison_center_id?: EntityId | null;
  prison_center_name?: string | null;
  online_platform?: string | null;
  online_link?: string | null;
  start_date?: IsoDate | null;
  expected_graduation_date?: IsoDate | null;
  main_teacher_id?: EntityId | null;
  main_teacher_name?: string | null;
  assistant_teacher_ids?: EntityId[] | null;
  rector_id?: EntityId | null;
  rector_name?: string | null;
  coordinator_id?: EntityId | null;
  coordinator_name?: string | null;
  status?: string | null;
  notes?: string | null;
  sequence?: number | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/** Physical / virtual venue for a lesson. */
export interface FoundationLessonLocation {
  id: EntityId;
  name: string;
  location_type?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  address?: string | null;
  prison_center_id?: EntityId | null;
  prison_center_name?: string | null;
  online_platform?: string | null;
  online_link?: string | null;
  contact_person?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FoundationLessonSession {
  id: EntityId;
  class_group_id?: EntityId | null;
  class_group_name?: string | null;
  lesson_number?: number | null;
  lesson_title?: string | null;
  delivery_mode?: FoundationDeliveryMode | null;
  location_id?: EntityId | null;
  location_name?: string | null;
  location_type?: string | null;
  prison_center_id?: EntityId | null;
  prison_center_name?: string | null;
  online_platform?: string | null;
  online_link?: string | null;
  lesson_date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  teacher_id?: EntityId | null;
  teacher_name?: string | null;
  assistant_teacher_ids?: EntityId[] | null;
  status?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  /** Legacy aliases */
  classGroupId?: EntityId | null;
  heldAt?: IsoDateTime | null;
  createdAt?: IsoDateTime;
}

export interface FoundationLessonAttendance {
  id: EntityId;
  lesson_session_id?: EntityId | null;
  student_id?: EntityId | null;
  student_name?: string | null;
  class_group_id?: EntityId | null;
  lesson_number?: number | null;
  attended?: boolean | null;
  attendance_status?: string | null;
  marked_by_user_id?: EntityId | null;
  marked_by_name?: string | null;
  marked_at?: IsoDateTime | null;
  teacher_id?: EntityId | null;
  teacher_name?: string | null;
  delivery_mode?: FoundationDeliveryMode | null;
  location_name?: string | null;
  notes?: string | null;
}

export interface FoundationLessonOnlineTest {
  id: EntityId;
  lesson_number?: number | null;
  lesson_title?: string | null;
  form_title?: string | null;
  form_url?: string | null;
  form_provider?: string | null;
  max_score?: number | null;
  passing_score?: number | null;
  is_active?: boolean | null;
  created_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FoundationTestSubmission {
  id: EntityId;
  student_id?: EntityId | null;
  student_name?: string | null;
  class_group_id?: EntityId | null;
  class_group_name?: string | null;
  lesson_session_id?: EntityId | null;
  lesson_number?: number | null;
  lesson_title?: string | null;
  delivery_mode?: FoundationDeliveryMode | null;
  location_id?: EntityId | null;
  location_name?: string | null;
  teacher_id?: EntityId | null;
  teacher_name?: string | null;
  form_id?: EntityId | null;
  form_url?: string | null;
  submission_id?: string | null;
  submitted_at?: IsoDateTime | null;
  raw_student_name?: string | null;
  raw_phone?: string | null;
  raw_email?: string | null;
  score?: number | null;
  max_score?: number | null;
  percentage?: number | null;
  passed?: boolean | null;
  answers?: unknown[] | null;
  auto_matched?: boolean | null;
  match_confidence?: number | null;
  matched_by?: string | null;
  matched_at?: IsoDateTime | null;
  reviewed_by?: string | null;
  reviewed_at?: IsoDateTime | null;
  review_status?: string | null;
  rector_override_score?: number | string | null;
  rector_override_reason?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  /** Legacy aliases */
  studentId?: EntityId | null;
  submittedAt?: IsoDateTime | null;
  createdAt?: IsoDateTime;
}

export interface FoundationSoulWinning {
  id: EntityId;
  student_id?: EntityId | null;
  student_name?: string | null;
  class_group_id?: EntityId | null;
  class_group_name?: string | null;
  lesson_session_id?: EntityId | null;
  delivery_mode?: FoundationDeliveryMode | null;
  location?: string | null;
  activity_date?: IsoDate | null;
  souls_won_count?: number | null;
  report_summary?: string | null;
  teacher_id?: EntityId | null;
  teacher_name?: string | null;
  confirmed_by?: string | null;
  confirmed_by_teacher_id?: EntityId | null;
  confirmed_by_teacher_name?: string | null;
  confirmed_at?: IsoDateTime | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FoundationFinalExam {
  id: EntityId;
  student_id?: EntityId | null;
  student_name?: string | null;
  class_group_id?: EntityId | null;
  class_group_name?: string | null;
  exam_date?: IsoDate | null;
  score?: number | null;
  max_score?: number | null;
  percentage?: number | null;
  passed?: boolean | null;
  corrected_by?: EntityId | string | null;
  corrected_by_name?: string | null;
  corrected_at?: IsoDateTime | null;
  physical_exam_file_url?: string | null;
  physical_exam_file_name?: string | null;
  scanned_by?: string | null;
  scanned_at?: IsoDateTime | null;
  uploaded_by?: string | null;
  uploaded_at?: IsoDateTime | null;
  scanned_by_app?: boolean | null;
  scan_session_id?: string | null;
  document_type?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  /** Legacy aliases */
  studentId?: EntityId | null;
  takenAt?: IsoDateTime | null;
  createdAt?: IsoDateTime;
}

export interface FoundationAuditLog {
  id: EntityId;
  entity_type?: string | null;
  entity_id?: EntityId | null;
  action?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  performed_by_user_id?: EntityId | null;
  performed_by_name?: string | null;
  performed_at?: IsoDateTime | null;
  notes?: string | null;
}

export interface FoundationGradingSettings {
  lesson_tests_total_max_score?: number;
  final_exam_max_score?: number;
  lesson_tests_weight_percent?: number;
  final_exam_weight_percent?: number;
  passing_percentage?: number;
  require_all_7_lessons?: boolean;
  require_lesson_tests?: boolean;
  require_soul_winning_for_lesson_4?: boolean;
  allow_lessons_in_random_order?: boolean;
}

// ---------------------------------------------------------------------------
// Finance & operations
// ---------------------------------------------------------------------------

/** Single contribution line inside a public giving submission. */
export interface PublicGivingContributionLine {
  contribution_group?: string | null;
  contribution_category?: string | null;
  partnership_arm_id?: EntityId | null;
  partnership_arm_name?: string | null;
  amount?: number | null;
}

/**
 * Finance Record / Lançamento — income or expense.
 * Supports dashboard legacy fields (nome, valor, estado) + data-layer snake_case.
 */
export interface FinanceRecord {
  id: EntityId;
  transaction_type?: "income" | "expense" | string | null;
  contribution_group?: string | null;
  contribution_category?: string | null;
  /** Legacy alias */
  category?: string | null;
  categoria_da_contribuicao?: string | null;

  partnership_arm_id?: EntityId | null;
  partnership_arm_name?: string | null;

  contributor_id?: EntityId | null;
  contributor_name?: string | null;
  contributor_phone?: string | null;
  contributor_email?: string | null;
  nome?: string | null;
  apelido?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  endereco?: string | null;

  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  partner_id?: EntityId | null;
  source_type?: string | null;

  church_id?: EntityId | null;
  churchId?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;

  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  grupo_de_celula?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;

  amount?: number | null;
  valor?: number | null;
  currency?: string | null;

  payment_method?: string | null;
  metodo_de_pagamento?: string | null;
  payment_reference?: string | null;
  referencia_da_transaccao?: string | null;
  payment_date?: IsoDate | null;
  data?: IsoDate | null;
  data_da_transferencia?: IsoDate | null;
  recordedAt?: IsoDate | null;

  proof_file_url?: string | null;
  proof_file_name?: string | null;
  imagem_envelope_ou_pop?: string | null;
  imagem_do_envelope?: string | null;

  /** English data-layer status */
  status?: string | null;
  /** PT dashboard status (Pendente de Verificação / Verificado / …) */
  estado?: string | null;

  source?: string | null;
  submission_group_id?: string | null;
  public_submission_id?: string | null;
  requisition_id?: EntityId | null;
  cell_report_id?: EntityId | null;

  received_by?: string | null;
  received_by_name?: string | null;
  recebido_por?: string | null;

  verified_by?: string | null;
  verified_by_name?: string | null;
  verificado_por?: string | null;
  verified_at?: IsoDateTime | null;
  comentario_verificacao?: string | null;

  rejected_by?: string | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  motivo_rejeicao?: string | null;

  notes?: string | null;
  observacoes?: string | null;
  mensagem_transferencia?: string | null;
  outros_descricao?: string | null;
  data_de_aniversario?: string | null;

  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface PublicGivingSubmission {
  id: EntityId;
  submission_group_id?: string | null;

  full_name?: string | null;
  nome?: string | null;
  apelido?: string | null;
  birthday?: string | null;
  data_de_aniversario?: string | null;
  phone?: string | null;
  telefone?: string | null;
  email?: string | null;

  church_id?: EntityId | null;
  igreja_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;

  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  grupo_de_celula?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;

  contributions?: PublicGivingContributionLine[] | null;
  total_amount?: number | null;
  valor_total?: number | null;
  currency?: string | null;

  payment_method?: string | null;
  metodo_de_pagamento?: string | null;
  payment_reference?: string | null;
  referencia_da_transaccao?: string | null;
  payment_date?: IsoDate | null;
  data_da_transferencia?: IsoDate | null;

  proof_file_url?: string | null;
  proof_file_name?: string | null;
  imagem_envelope_ou_pop?: string | null;

  transfer_message?: string | null;
  mensagem_transferencia?: string | null;
  notes?: string | null;
  observacoes?: string | null;

  status?: string | null;
  source?: string | null;

  created_finance_record_ids?: EntityId[] | null;

  submitted_at?: IsoDateTime | null;
  reviewed_by?: string | null;
  reviewed_at?: IsoDateTime | null;
  verified_by?: string | null;
  verified_at?: IsoDateTime | null;
  rejected_by?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  motivo_rejeicao?: string | null;

  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface FinanceDisbursement {
  id: EntityId;
  requisition_id?: EntityId | null;
  request_number?: string | null;
  title?: string | null;

  department_id?: EntityId | null;
  department_name?: string | null;

  church_id?: EntityId | null;
  church_name?: string | null;

  requested_by?: string | null;
  requested_by_name?: string | null;

  approved_by?: string | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;

  approved_amount?: number | null;
  released_amount?: number | null;
  pending_amount?: number | null;

  payment_method?: string | null;
  payment_reference?: string | null;
  release_date?: IsoDate | null;

  released_by?: string | null;
  released_by_name?: string | null;
  released_at?: IsoDateTime | null;

  status?: string | null;
  proof_file_url?: string | null;
  proof_file_name?: string | null;
  notes?: string | null;

  finance_record_id?: EntityId | null;

  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/**
 * Requisition / Requisição — full workflow (submit → review → pastor → finance → inventory).
 * Supports PT dashboard statuses + English aliases.
 */
export interface Requisition {
  id: EntityId;
  request_number?: string | null;
  title?: string | null;
  description?: string | null;
  justification?: string | null;

  requested_by_user_id?: EntityId | null;
  requested_by_name?: string | null;
  requested_by_role?: string | null;

  department_id?: EntityId | null;
  department_name?: string | null;

  church_id?: EntityId | null;
  churchId?: EntityId | null;
  church_name?: string | null;

  requisition_type?: string | null;
  urgency?: string | null;
  needed_by_date?: IsoDate | null;

  estimated_amount?: number | null;
  approved_amount?: number | null;
  amount?: number | null;
  currency?: string | null;

  supplier_name?: string | null;
  supplier_or_vendor?: string | null;
  quotation_number?: string | null;
  quotation_file_url?: string | null;
  attachments?: Array<Record<string, unknown> | string> | null;

  reviewed_by_user_id?: EntityId | null;
  reviewed_by?: string | null;
  reviewed_by_name?: string | null;
  reviewed_at?: IsoDateTime | null;
  review_notes?: string | null;

  sent_to_main_pastor_by?: string | null;
  sent_to_main_pastor_by_name?: string | null;
  sent_to_main_pastor_at?: IsoDateTime | null;

  approved_by_user_id?: EntityId | null;
  approved_by?: string | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  approval_notes?: string | null;
  final_priority?: string | null;

  rejected_by_user_id?: EntityId | null;
  rejected_by?: string | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;

  returned_by_user_id?: EntityId | null;
  returned_by?: string | null;
  returned_by_name?: string | null;
  returned_at?: IsoDateTime | null;
  return_reason?: string | null;
  return_notes?: string | null;

  finance_status?: string | null;
  released_amount?: number | null;
  amount_released?: number | null;
  pending_amount?: number | null;
  resources_released_by?: string | null;
  resources_released_by_name?: string | null;
  resources_released_at?: IsoDateTime | null;
  released_by?: string | null;
  released_at?: IsoDateTime | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  payment_notes?: string | null;
  sent_to_finance?: boolean | null;
  sent_to_finance_at?: IsoDateTime | null;

  finance_disbursement_id?: EntityId | null;
  finance_record_id?: EntityId | null;

  inventory_required?: boolean | null;
  inventory_item_id?: EntityId | null;
  inventory_status?: string | null;
  sent_to_inventory_at?: IsoDateTime | null;

  status?: string | null;
  notes?: string | null;
  audit_history?: Array<Record<string, unknown>> | null;
  timeline?: RequisitionTimelineEvent[] | null;

  submitted_by?: string | null;
  submitted_at?: IsoDateTime | null;
  closed_by?: string | null;
  closed_at?: IsoDateTime | null;

  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface RequisitionTimelineEvent {
  id: EntityId;
  requisition_id?: EntityId | null;
  event_type?: string | null;
  title?: string | null;
  description?: string | null;
  old_status?: string | null;
  new_status?: string | null;
  performed_by_user_id?: EntityId | null;
  performed_by_name?: string | null;
  performed_by_role?: string | null;
  created_at?: IsoDateTime | null;
  metadata?: Record<string, unknown> | null;
}

export interface Notification {
  id: EntityId;
  userId: EntityId | null;
  title: string | null;
  body: string | null;
  readAt: IsoDateTime | null;
  createdAt: IsoDateTime;
}

// ---------------------------------------------------------------------------
// Cells
// ---------------------------------------------------------------------------

/** Cell Group / Grupo de Células — dashboard snake_case + English aliases. */
export interface CellGroup {
  id: EntityId;
  name?: string | null;
  group_name?: string | null;
  church_id?: EntityId | null;
  churchId?: EntityId | null;
  church_name?: string | null;
  leader_id?: EntityId | null;
  leader_name?: string | null;
  leader_phone?: string | null;
  status?: string | null;
  needs_review?: boolean | null;
  total_cells?: number | null;
  total_members?: number | null;
  responsible_area?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/** Cell / Célula within a group. */
export interface Cell {
  id: EntityId;
  name?: string | null;
  cell_name?: string | null;
  nome_da_celula?: string | null;
  cell_group_id?: EntityId | null;
  group_id?: EntityId | null;
  group_cell_id?: EntityId | null;
  groupId?: EntityId | null;
  cell_group_name?: string | null;
  group_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  leader_id?: EntityId | null;
  leader_name?: string | null;
  leaderName?: string | null;
  lider?: string | null;
  leader_phone?: string | null;
  leader_title?: string | null;
  meeting_day?: string | null;
  meeting_time?: string | null;
  meeting_type?: string | null;
  meeting_location?: string | null;
  area?: string | null;
  status?: string | null;
  needs_review?: boolean | null;
  attendance?: number | null;
  first_timers?: number | null;
  new_converts?: number | null;
  offering?: number | null;
  rs?: number | null;
  observation?: string | null;
  report_week?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/** Cell Leader / Líder de Célula. */
export interface CellLeader {
  id: EntityId;
  full_name?: string | null;
  nome_completo?: string | null;
  title?: string | null;
  titulo?: string | null;
  phone?: string | null;
  contacto?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;
  status?: string | null;
  estado?: string | null;
  trained_by_alec?: boolean | null;
  veio_do_alec?: boolean | null;
  alec_concluido?: boolean | null;
  e_lider_actual?: boolean | null;
  active_since?: IsoDate | null;
  supervisor?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

/**
 * Cell report (public submission shape + internal dashboard aliases).
 * Maps to cell_report_submissions / cellLeadership.cellReports.
 */
export interface CellReportSubmission {
  id: EntityId;
  report_week?: string | null;
  meeting_date?: IsoDate | null;
  weekOf?: IsoDate | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  group_name?: string | null;
  cell_id?: EntityId | null;
  cellId?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;
  leader_id?: EntityId | null;
  leader_name?: string | null;
  nome_do_lider?: string | null;
  leader_phone?: string | null;
  meeting_type?: string | null;
  meeting_location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  topic?: string | null;
  lesson_shared?: string | null;
  meeting_notes?: string | null;
  attendance_count?: number | null;
  attendance?: number | null;
  att?: number | null;
  first_timers_count?: number | null;
  ft?: number | null;
  new_converts_count?: number | null;
  nc?: number | null;
  contacted_people_count?: number | null;
  absent_members_count?: number | null;
  children_youth_count?: number | null;
  souls_won_count?: number | null;
  rs?: number | null;
  people_prayed_for_count?: number | null;
  testimonies?: string | null;
  referred_to_follow_up_count?: number | null;
  interested_in_foundation_school_count?: number | null;
  needs_pastoral_visit_count?: number | null;
  prayer_requests?: string | null;
  offering_given?: boolean | null;
  offering_amount?: number | null;
  oferta?: number | null;
  currency?: string | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  proof_file_url?: string | null;
  finance_review_status?: string | null;
  cell_health_status?: string | null;
  challenges?: string | null;
  needs?: string | null;
  leader_comments?: string | null;
  observacoes?: string | null;
  submitted_by_type?: string | null;
  submitted_from?: string | null;
  submitter_ip?: string | null;
  submitter_device?: string | null;
  status?: string | null;
  estado?: string | null;
  needs_review?: boolean | null;
  possible_duplicate?: boolean | null;
  reviewed_by?: string | null;
  reviewed_at?: IsoDateTime | null;
  validated_by?: string | null;
  validated_at?: IsoDateTime | null;
  avaliado_por?: string | null;
  validado_por?: string | null;
  submetido_por?: string | null;
  notes?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface MediaTechnician {
  id: EntityId;
  fullName: string;
  phone: string | null;
  createdAt: IsoDateTime;
}

export interface MediaSchedule {
  id: EntityId;
  technicianId: EntityId | null;
  serviceDate: IsoDate | null;
  role: string | null;
  notes: string | null;
  createdAt: IsoDateTime;
}

// ---------------------------------------------------------------------------
// Venue & Inventory Management
// ---------------------------------------------------------------------------

/** Physical inventory item — English model + PT UI aliases for dual-map. */
export interface InventoryItem {
  id: EntityId;
  item_code?: string | null;
  name?: string | null;
  description?: string | null;
  /** PT UI */
  nome_do_item?: string | null;
  categoria?: string | null;

  category?: string | null;
  subcategory?: string | null;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;

  quantity?: number | null;
  quantidade?: number | null;
  unit?: string | null;

  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;

  department_id?: EntityId | null;
  department_name?: string | null;
  departamento_responsavel?: string | null;

  space_id?: EntityId | null;
  space_name?: string | null;
  localizacao?: string | null;

  assigned_to_user_id?: EntityId | null;
  assigned_to_name?: string | null;
  assigned_to_role?: string | null;

  acquisition_source?: string | null;
  acquisition_date?: IsoDate | null;
  data_de_entrada?: IsoDate | null;
  acquisition_cost?: number | null;
  valor_unitario?: number | null;
  valor_total?: number | null;
  currency?: string | null;

  requisition_id?: EntityId | null;
  request_number?: string | null;
  finance_disbursement_id?: EntityId | null;
  draft_from_requisition?: boolean | null;

  supplier_name?: string | null;
  warranty_start?: IsoDate | null;
  warranty_end?: IsoDate | null;

  /** English: Available | Assigned | Under Maintenance | Damaged | Pending Registration | … */
  status?: string | null;
  /** PT UI estado (Bom, Mau, Em Reparação, Pendente de Registo, …) */
  estado?: string | null;
  condition?: string | null;

  location_notes?: string | null;
  usage_notes?: string | null;
  observacoes?: string | null;

  photo_url?: string | null;
  attachment_urls?: string[] | null;

  created_by?: string | null;
  created_by_name?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface InventoryMovement {
  id: EntityId;
  item_id?: EntityId | null;
  item_code?: string | null;
  item_name?: string | null;
  /** PT UI */
  item?: string | null;

  movement_type?: string | null;

  from_church_id?: EntityId | null;
  from_church_name?: string | null;
  from_space_id?: EntityId | null;
  from_space_name?: string | null;
  from_user_id?: EntityId | null;
  from_user_name?: string | null;
  origem?: string | null;

  to_church_id?: EntityId | null;
  to_church_name?: string | null;
  to_space_id?: EntityId | null;
  to_space_name?: string | null;
  to_user_id?: EntityId | null;
  to_user_name?: string | null;
  destino?: string | null;

  quantity?: number | null;
  quantidade?: number | null;

  reason?: string | null;
  notes?: string | null;
  observacoes?: string | null;

  movement_date?: IsoDate | null;
  data_de_saida?: IsoDate | null;
  data_prevista_de_retorno?: IsoDate | null;
  data_real_de_retorno?: IsoDate | null;

  performed_by_user_id?: EntityId | null;
  performed_by_name?: string | null;
  pessoa_responsavel?: string | null;
  departamento_solicitante?: string | null;

  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  aprovado_por?: string | null;
  approved_at?: IsoDateTime | null;

  status?: string | null;
  estado?: string | null;
  estado_ao_sair?: string | null;
  estado_ao_voltar?: string | null;

  church_id?: EntityId | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface InventoryMaintenanceRecord {
  id: EntityId;
  item_id?: EntityId | null;
  item_code?: string | null;
  item_name?: string | null;
  /** PT UI */
  item?: string | null;
  categoria?: string | null;
  quantidade?: number | null;

  issue_title?: string | null;
  issue_description?: string | null;
  problema_reportado?: string | null;

  reported_by_user_id?: EntityId | null;
  reported_by_name?: string | null;
  reported_at?: IsoDateTime | null;

  assigned_to_user_id?: EntityId | null;
  assigned_to_name?: string | null;
  tecnico_ou_responsavel?: string | null;

  repair_vendor?: string | null;
  estimated_cost?: number | null;
  actual_cost?: number | null;
  custo_da_reparacao?: number | null;
  currency?: string | null;

  status?: string | null;
  estado?: string | null;
  priority?: string | null;

  started_at?: IsoDate | IsoDateTime | null;
  completed_at?: IsoDate | IsoDateTime | null;
  data_de_envio?: IsoDate | null;
  data_de_retorno?: IsoDate | null;
  estado_antes?: string | null;
  estado_depois?: string | null;

  resolution_notes?: string | null;
  observacoes?: string | null;
  attachment_urls?: string[] | null;

  church_id?: EntityId | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface VenueSpace {
  id: EntityId;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;

  name?: string | null;
  nome_do_espaco?: string | null;
  description?: string | null;
  localizacao?: string | null;

  space_type?: string | null;
  tipo?: string | null;
  capacity?: number | null;
  capacidade?: number | null;

  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  responsavel?: string | null;

  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  equipamentos_fixos?: string | null;

  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ServiceChecklist {
  id: EntityId;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja?: string | null;

  service_name?: string | null;
  service_date?: IsoDate | null;
  data_do_culto?: IsoDate | null;
  service_time?: string | null;
  checklist_type?: string | null;
  tipo_de_culto_ou_evento?: string | null;
  espaco?: string | null;
  space_id?: EntityId | null;
  space_name?: string | null;

  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  responsavel?: string | null;

  sound_ready?: boolean | null;
  microphones_ready?: boolean | null;
  cameras_ready?: boolean | null;
  streaming_ready?: boolean | null;
  projector_ready?: boolean | null;
  lights_ready?: boolean | null;
  ac_ready?: boolean | null;
  chairs_ready?: boolean | null;
  pulpit_ready?: boolean | null;
  cleaning_ready?: boolean | null;
  instruments_ready?: boolean | null;
  power_backup_ready?: boolean | null;

  /** PT UI checkboxes */
  som_verificado?: boolean | null;
  microfones_prontos?: boolean | null;
  cameras_prontas?: boolean | null;
  projector_verificado?: boolean | null;
  luzes_verificadas?: boolean | null;
  ac_verificado?: boolean | null;
  cadeiras_organizadas?: boolean | null;
  pulpito_pronto?: boolean | null;
  limpeza_feita?: boolean | null;

  issues_found?: string | null;
  actions_taken?: string | null;
  observacoes?: string | null;

  status?: string | null;
  estado?: string | null;

  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;

  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Staff & Human Resources
// ---------------------------------------------------------------------------

/** Staff member — English model + existing UI aliases. */
export interface StaffMember {
  id: EntityId;
  staff_code?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  title?: string | null;
  gender?: string | null;
  date_of_birth?: IsoDate | null;
  data_de_aniversario?: IsoDate | null;

  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  marital_status?: string | null;

  church_id?: EntityId | null;
  church_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  role_id?: EntityId | null;
  role_title?: string | null;
  supervisor_id?: EntityId | null;
  supervisor_user_id?: EntityId | null;
  supervisor_name?: string | null;

  employment_type?: string | null;
  staff_type?: string | null;
  start_date?: IsoDate | null;
  end_date?: IsoDate | null;
  contract_start_date?: IsoDate | null;
  contract_end_date?: IsoDate | null;
  probation_end_date?: IsoDate | null;
  status?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  national_id_number?: string | null;
  nuit?: string | null;
  profile_photo?: string | null;

  /** Sensitive — only expose to authorized roles */
  salary_or_allowance?: number | null;
  payment_frequency?: string | null;
  payment_method?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  mobile_money_number?: string | null;
  bank_or_mobile_details?: string | null;

  has_dashboard_access?: boolean | null;
  user_id?: EntityId | null;
  login_email?: string | null;

  notes?: string | null;
  birthday_month?: string | null;
  birthday_day?: string | null;
  age?: number | null;
  next_birthday?: IsoDate | null;
  days_until_birthday?: number | null;

  created_by?: string | null;
  created_by_name?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StaffDepartment {
  id: EntityId;
  name?: string | null;
  description?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  head_staff_id?: EntityId | null;
  head_staff_name?: string | null;
  parent_department_id?: EntityId | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StaffRole {
  id: EntityId;
  title?: string | null;
  description?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  permission_template?: string | null;
  level?: string | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

/** Salary config + optional monthly payment row (UI dual-map). */
export interface StaffSalary {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;

  salary_type?: string | null;
  amount?: number | null;
  base_amount?: number | null;
  bonus?: number | null;
  deductions?: number | null;
  net_amount?: number | null;
  currency?: string | null;

  payment_frequency?: string | null;
  payment_method?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  mobile_money_number?: string | null;

  month?: string | null;
  effective_from?: IsoDate | null;
  effective_to?: IsoDate | null;

  status?: string | null;
  payment_status?: string | null;

  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_by?: string | null;
  approved_at?: IsoDateTime | null;
  paid_by?: string | null;
  paid_at?: IsoDateTime | null;

  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StaffPerformanceReview {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;

  review_period?: string | null;
  evaluation_period?: string | null;
  review_start_date?: IsoDate | null;
  review_end_date?: IsoDate | null;

  reviewed_by_user_id?: EntityId | null;
  reviewed_by_name?: string | null;
  evaluated_by?: string | null;
  evaluated_at?: IsoDate | null;

  punctuality_score?: number | null;
  responsibility_score?: number | null;
  teamwork_score?: number | null;
  technical_skill_score?: number | null;
  spiritual_attitude_score?: number | null;
  communication_score?: number | null;
  leadership_score?: number | null;
  task_completion_score?: number | null;
  report_submission_score?: number | null;
  supervisor_rating?: number | null;
  overall_score?: number | null;

  strengths?: string | null;
  improvements?: string | null;
  areas_to_improve?: string | null;
  goals_next_period?: string | null;
  action_plan?: string | null;

  status?: string | null;
  reviewed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StaffDocument {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  document_type?: string | null;
  document_title?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  issue_date?: IsoDate | null;
  expiry_date?: IsoDate | null;
  status?: string | null;
  uploaded_by_user_id?: EntityId | null;
  uploaded_by_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StaffAttendance {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  event_type?: string | null;
  event_name?: string | null;
  attendance_date?: IsoDate | null;
  date?: IsoDate | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  status?: string | null;
  attendance_status?: string | null;
  recorded_by_user_id?: EntityId | null;
  recorded_by_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

/** Map of collection names used by repositories / adapters. */
export type EntityCollectionName =
  | "users"
  | "churches"
  | "members"
  | "first_timers"
  | "follow_ups"
  | "foundation_students"
  | "foundation_teachers"
  | "foundation_class_groups"
  | "foundation_lesson_sessions"
  | "foundation_test_submissions"
  | "foundation_final_exams"
  | "finance_records"
  | "public_giving_submissions"
  | "finance_disbursements"
  | "requisitions"
  | "requisition_timeline"
  | "notifications"
  | "cell_groups"
  | "cells"
  | "cell_leaders"
  | "cell_report_submissions"
  | "media_technicians"
  | "media_schedules"
  | "inventory_items"
  | "inventory_movements"
  | "inventory_maintenance"
  | "venue_spaces"
  | "service_checklists"
  | "staff"
  | "staff_departments"
  | "staff_roles"
  | "staff_salaries"
  | "staff_performance"
  | "staff_documents"
  | "staff_attendance"
  | "roles"
  | "permissions"
  | "permission_templates"
  | "audit_logs";
