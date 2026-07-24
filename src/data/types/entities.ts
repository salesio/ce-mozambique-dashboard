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

/** In-app notification (dashboard dual-map). */
export interface Notification {
  id: EntityId;
  /** Legacy camelCase */
  userId?: EntityId | null;
  title?: string | null;
  body?: string | null;
  message?: string | null;
  type?: string | null;
  module?: string | null;
  entity_type?: string | null;
  entity_id?: EntityId | null;
  entity_label?: string | null;
  priority?: string | null;
  recipient_user_id?: EntityId | null;
  recipient_role_id?: EntityId | null;
  recipient_role?: string | null;
  recipient_role_name?: string | null;
  recipient_department_id?: EntityId | null;
  recipient_church_id?: EntityId | null;
  scope?: string | null;
  action_url?: string | null;
  action_label?: string | null;
  is_read?: boolean | null;
  read_at?: IsoDateTime | null;
  readAt?: IsoDateTime | null;
  is_archived?: boolean | null;
  archived_at?: IsoDateTime | null;
  expires_at?: IsoDateTime | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  created_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  metadata?: Record<string, unknown> | null;
}

export interface SystemSetting {
  id: EntityId;
  key?: string | null;
  value?: string | null;
  value_type?: string | null;
  module?: string | null;
  label_pt?: string | null;
  label_en?: string | null;
  label_fr?: string | null;
  description?: string | null;
  is_sensitive?: boolean | null;
  is_system?: boolean | null;
  editable_by_roles?: string[] | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface GlobalCategory {
  id: EntityId;
  module?: string | null;
  category_group?: string | null;
  name?: string | null;
  name_pt?: string | null;
  name_en?: string | null;
  name_fr?: string | null;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface StatusDefinition {
  id: EntityId;
  module?: string | null;
  status_key?: string | null;
  label_pt?: string | null;
  label_en?: string | null;
  label_fr?: string | null;
  color?: string | null;
  icon?: string | null;
  severity?: string | null;
  is_final?: boolean | null;
  is_positive?: boolean | null;
  is_negative?: boolean | null;
  sort_order?: number | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface LanguageSetting {
  id: EntityId;
  code?: string | null;
  name?: string | null;
  name_native?: string | null;
  is_active?: boolean | null;
  is_default?: boolean | null;
  sort_order?: number | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface NotificationSetting {
  id: EntityId;
  module?: string | null;
  event_type?: string | null;
  role_id?: EntityId | null;
  role_name?: string | null;
  enabled?: boolean | null;
  channels?: string[] | null;
  priority_default?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface UiPreference {
  id: EntityId;
  user_id?: EntityId | null;
  key?: string | null;
  value?: string | null;
  theme?: string | null;
  density?: string | null;
  sidebar_collapsed?: boolean | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface NotificationTemplate {
  id: EntityId;
  event_type?: string | null;
  module?: string | null;
  title_template_pt?: string | null;
  title_template_en?: string | null;
  title_template_fr?: string | null;
  message_template_pt?: string | null;
  message_template_en?: string | null;
  message_template_fr?: string | null;
  default_type?: string | null;
  default_priority?: string | null;
  recipient_strategy?: string | null;
  is_active?: boolean | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
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
// Media Department
// ---------------------------------------------------------------------------

/** Media team member — dashboard technicians shape + English aliases. */
export interface MediaTechnician {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  primary_role_id?: EntityId | null;
  primary_role_name?: string | null;
  roles_can_perform?: string[] | null;
  skill_level?: string | null;
  preferred_services?: string[] | null;
  availability_notes?: string | null;
  supervisor_id?: EntityId | null;
  supervisor_name?: string | null;
  start_date?: IsoDate | null;
  status?: string | null;
  profile_photo?: string | null;
  notes?: string | null;
  equipment_assigned_ids?: string[] | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface MediaRole {
  id: EntityId;
  name?: string | null;
  key?: string | null;
  description?: string | null;
  category?: string | null;
  required_skill_level?: string | null;
  is_required_for_service?: boolean | null;
  is_critical_role?: boolean | null;
  allow_multiple?: boolean | null;
  required_per_service?: number | null;
  requires_equipment?: boolean | null;
  equipment_categories?: string[] | null;
  is_active?: boolean | null;
  status?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MediaService {
  id: EntityId;
  church_id?: EntityId | null;
  church_name?: string | null;
  name?: string | null;
  description?: string | null;
  service_type?: string | null;
  day_of_week?: string | null;
  time?: string | null;
  service_date?: IsoDate | null;
  event_date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  is_recurring?: boolean | null;
  recurrence_rule?: string | null;
  is_special_event?: boolean | null;
  needs_streaming?: boolean | null;
  needs_full_team?: boolean | null;
  channels_used?: string[] | null;
  channels_required?: string[] | null;
  venue_space_id?: EntityId | null;
  venue_space_name?: string | null;
  location?: string | null;
  responsible_name?: string | null;
  checklist_required?: boolean | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MediaScheduleAssignment {
  id?: string;
  role_id?: EntityId | null;
  role_name?: string | null;
  technician_id?: EntityId | null;
  technician_name?: string | null;
  team_member_id?: EntityId | null;
  team_member_name?: string | null;
  status?: string | null;
  confirmation_status?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  attendance_status?: string | null;
  performance_status?: string | null;
  notes?: string | null;
}

/** Schedule document (UI shape with nested assignments) + flat assignment aliases. */
export interface MediaSchedule {
  id: EntityId;
  service_id?: EntityId | null;
  service_name?: string | null;
  service_date?: IsoDate | null;
  date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  supervisor_id?: EntityId | null;
  supervisor_name?: string | null;
  status?: string | null;
  notes?: string | null;
  assignments?: MediaScheduleAssignment[] | null;
  /** Flat assignment fields (optional single-row view) */
  role_id?: EntityId | null;
  role_name?: string | null;
  team_member_id?: EntityId | null;
  team_member_name?: string | null;
  technicianId?: EntityId | null;
  serviceDate?: IsoDate | null;
  role?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
  createdAt?: IsoDateTime;
  updatedAt?: IsoDateTime;
}

export interface MediaChannel {
  id: EntityId;
  name?: string | null;
  type?: string | null;
  platform?: string | null;
  platform_url?: string | null;
  channel_url?: string | null;
  embed_url?: string | null;
  channel_handle?: string | null;
  is_active?: boolean | null;
  status?: string | null;
  requires_stream_key?: boolean | null;
  stream_key_status?: string | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MediaPerformanceReview {
  id: EntityId;
  technician_id?: EntityId | null;
  technician_name?: string | null;
  team_member_id?: EntityId | null;
  team_member_name?: string | null;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  schedule_id?: EntityId | null;
  service_id?: EntityId | null;
  service_name?: string | null;
  service_date?: IsoDate | null;
  period?: string | null;
  role_performed?: string | null;
  role_id?: EntityId | null;
  role_name?: string | null;
  evaluated_by?: string | null;
  evaluated_at?: IsoDate | null;
  reviewed_by_user_id?: EntityId | null;
  reviewed_by_name?: string | null;
  punctuality_score?: number | null;
  technical_quality_score?: number | null;
  teamwork_score?: number | null;
  responsibility_score?: number | null;
  problem_solving_score?: number | null;
  spiritual_attitude_score?: number | null;
  score?: number | null;
  overall_score?: number | null;
  strengths?: string | null;
  areas_to_improve?: string | null;
  improvements?: string | null;
  incidents?: string | null;
  recommendation?: string | null;
  notes?: string | null;
  status?: string | null;
  reviewed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MediaAward {
  id: EntityId;
  year?: number | null;
  category?: string | null;
  award_category?: string | null;
  award_name?: string | null;
  technician_id?: EntityId | null;
  technician_name?: string | null;
  team_member_id?: EntityId | null;
  team_member_name?: string | null;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  winner_id?: EntityId | null;
  reason?: string | null;
  score_basis?: string | null;
  awarded_by?: string | null;
  awarded_at?: IsoDate | null;
  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Counseling / Aconselhamento
// ---------------------------------------------------------------------------

/** Counseling intake request — dual-map English + legacy UI fields. */
export interface CounselingRequest {
  id: EntityId;
  request_number?: string | null;
  person_type?: string | null;
  person_id?: EntityId | null;
  person_name?: string | null;
  full_name?: string | null;
  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  gender?: string | null;
  age?: number | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  category?: string | null;
  counseling_category?: string | null;
  subject?: string | null;
  counseling_subject?: string | null;
  summary?: string | null;
  issue_summary?: string | null;
  urgency?: string | null;
  confidentiality_level?: string | null;
  preferred_contact_method?: string | null;
  preferred_date?: IsoDate | null;
  preferred_time?: string | null;
  preferred_counselor_gender?: string | null;
  preferred_language?: string | null;
  status?: string | null;
  assigned_case_id?: EntityId | null;
  assigned_counselor_id?: EntityId | null;
  assigned_counselor_name?: string | null;
  assigned_by_user_id?: EntityId | null;
  assigned_by_name?: string | null;
  assigned_at?: IsoDateTime | null;
  received_by_user_id?: EntityId | null;
  received_by_name?: string | null;
  requested_by_user_id?: EntityId | null;
  requested_by_name?: string | null;
  source?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

/** Pastoral case — confidential notes restricted by RBAC in UI. */
export interface CounselingCase {
  id: EntityId;
  case_number?: string | null;
  request_id?: EntityId | null;
  person_type?: string | null;
  person_id?: EntityId | null;
  person_name?: string | null;
  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  category?: string | null;
  subject?: string | null;
  summary?: string | null;
  confidential_notes?: string | null;
  urgency?: string | null;
  confidentiality_level?: string | null;
  counselor_id?: EntityId | null;
  counselor_name?: string | null;
  counselor_staff_id?: EntityId | null;
  assigned_by_user_id?: EntityId | null;
  assigned_by_name?: string | null;
  assigned_at?: IsoDateTime | null;
  status?: string | null;
  escalation_level?: string | null;
  referred_to_user_id?: EntityId | null;
  referred_to_name?: string | null;
  referred_to_role?: string | null;
  needs_follow_up?: boolean | null;
  follow_up_id?: EntityId | null;
  outcome?: string | null;
  next_step?: string | null;
  closed_by_user_id?: EntityId | null;
  closed_by_name?: string | null;
  closed_at?: IsoDateTime | null;
  closure_notes?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface CounselingAppointment {
  id: EntityId;
  case_id?: EntityId | null;
  case_number?: string | null;
  request_id?: EntityId | null;
  counseling_request_id?: EntityId | null;
  person_type?: string | null;
  person_id?: EntityId | null;
  person_name?: string | null;
  counselor_id?: EntityId | null;
  counselor_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  appointment_date?: IsoDate | null;
  start_time?: string | null;
  appointment_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  appointment_type?: string | null;
  location_type?: string | null;
  location?: string | null;
  location_details?: string | null;
  meeting_link?: string | null;
  status?: string | null;
  attendance_status?: string | null;
  session_notes?: string | null;
  confidential_session_notes?: string | null;
  notes?: string | null;
  next_appointment_date?: IsoDate | null;
  next_step?: string | null;
  reminder_sent?: boolean | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface Counselor {
  id: EntityId;
  staff_id?: EntityId | null;
  staff_name?: string | null;
  user_id?: EntityId | null;
  full_name?: string | null;
  title?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  categories?: string[] | null;
  counseling_categories?: string[] | null;
  languages?: string[] | null;
  availability?: string | null;
  max_cases_per_week?: number | null;
  current_open_cases?: number | null;
  current_active_cases?: number | null;
  supervisor_id?: EntityId | null;
  supervisor_name?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface CounselingFeedback {
  id: EntityId;
  case_id?: EntityId | null;
  appointment_id?: EntityId | null;
  request_id?: EntityId | null;
  counseling_request_id?: EntityId | null;
  counselor_id?: EntityId | null;
  counselor_name?: string | null;
  person_type?: string | null;
  person_id?: EntityId | null;
  person_name?: string | null;
  feedback_type?: string | null;
  summary?: string | null;
  feedback_summary?: string | null;
  outcome?: string | null;
  needs_follow_up?: boolean | null;
  next_step?: string | null;
  next_contact_date?: IsoDate | null;
  follow_up_date?: IsoDate | null;
  referral_needed?: boolean | null;
  referral_target_type?: string | null;
  needs_pastor_review?: boolean | null;
  referred_to_pastor?: string | null;
  confidentiality_note?: string | null;
  visible_to_roles?: string[] | null;
  church_id?: EntityId | null;
  status?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface CounselingReferral {
  id: EntityId;
  case_id?: EntityId | null;
  case_number?: string | null;
  request_id?: EntityId | null;
  counseling_request_id?: EntityId | null;
  from_user_id?: EntityId | null;
  from_name?: string | null;
  from_role?: string | null;
  referred_by_user_id?: EntityId | null;
  referred_by_name?: string | null;
  target_type?: string | null;
  referred_to_type?: string | null;
  target_user_id?: EntityId | null;
  referred_to_user_id?: EntityId | null;
  target_name?: string | null;
  target_role?: string | null;
  referred_to_role?: string | null;
  referred_to_department?: string | null;
  referral_reason?: string | null;
  reason?: string | null;
  referral_notes?: string | null;
  response_notes?: string | null;
  urgency?: string | null;
  status?: string | null;
  referred_at?: IsoDateTime | null;
  completed_at?: IsoDateTime | null;
  church_id?: EntityId | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Sacraments — Baptism, Marriage, Baby Dedication, Certificates, Documents
// ---------------------------------------------------------------------------

export interface Baptism {
  id: EntityId;
  baptism_number?: string | null;
  person_type?: string | null;
  person_id?: EntityId | null;
  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  /** PT UI */
  nome?: string | null;
  apelido?: string | null;
  gender?: string | null;
  date_of_birth?: IsoDate | null;
  age?: number | null;
  idade?: number | null;
  phone?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  celula?: string | null;
  foundation_school_completed?: boolean | null;
  foundation_school_student_id?: EntityId | null;
  requested_date?: IsoDate | null;
  scheduled_date?: IsoDate | null;
  scheduled_time?: string | null;
  data_do_baptismo?: IsoDate | null;
  location?: string | null;
  local_do_baptismo?: string | null;
  pastor_id?: EntityId | null;
  pastor_name?: string | null;
  baptizado_por?: string | null;
  baptism_type?: string | null;
  status?: string | null;
  estado?: string | null;
  certificate_required?: boolean | null;
  quer_certificado?: boolean | null;
  certificate_paid?: boolean | null;
  certificado_pago?: boolean | null;
  certificate_status?: string | null;
  certificate_id?: EntityId | null;
  certificado_emitido?: boolean | null;
  notes?: string | null;
  observacoes?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface Marriage {
  id: EntityId;
  marriage_number?: string | null;
  groom_member_id?: EntityId | null;
  groom_name?: string | null;
  nome_do_noivo?: string | null;
  groom_phone?: string | null;
  telefone_do_noivo?: string | null;
  groom_email?: string | null;
  bride_member_id?: EntityId | null;
  bride_name?: string | null;
  nome_da_noiva?: string | null;
  bride_phone?: string | null;
  telefone_da_noiva?: string | null;
  bride_email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  counseling_completed?: boolean | null;
  aconselhamento_concluido?: boolean | null;
  counseling_case_id?: EntityId | null;
  documents_status?: string | null;
  documentos_entregues?: boolean | null;
  requested_date?: IsoDate | null;
  scheduled_date?: IsoDate | null;
  scheduled_time?: string | null;
  data_do_casamento?: IsoDate | null;
  location?: string | null;
  venue_space_id?: EntityId | null;
  venue_space_name?: string | null;
  pastor_id?: EntityId | null;
  pastor_name?: string | null;
  pastor_responsavel?: string | null;
  witnesses?: Array<{ name?: string; phone?: string; role?: string }> | null;
  status?: string | null;
  estado?: string | null;
  certificate_required?: boolean | null;
  certificate_paid?: boolean | null;
  certificate_status?: string | null;
  certificate_id?: EntityId | null;
  notes?: string | null;
  observacoes?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface BabyDedication {
  id: EntityId;
  dedication_number?: string | null;
  child_full_name?: string | null;
  nome_da_crianca?: string | null;
  child_gender?: string | null;
  child_date_of_birth?: IsoDate | null;
  data_de_nascimento?: IsoDate | null;
  father_member_id?: EntityId | null;
  father_name?: string | null;
  nome_do_pai?: string | null;
  father_phone?: string | null;
  mother_member_id?: EntityId | null;
  mother_name?: string | null;
  nome_da_mae?: string | null;
  mother_phone?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  telefone_dos_pais?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  requested_date?: IsoDate | null;
  scheduled_date?: IsoDate | null;
  scheduled_time?: string | null;
  data_da_dedicacao?: IsoDate | null;
  location?: string | null;
  pastor_id?: EntityId | null;
  pastor_name?: string | null;
  pastor_responsavel?: string | null;
  status?: string | null;
  estado?: string | null;
  certificate_required?: boolean | null;
  certificate_paid?: boolean | null;
  certificate_status?: string | null;
  certificate_id?: EntityId | null;
  certificado_emitido?: boolean | null;
  notes?: string | null;
  observacoes?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface SacramentCertificate {
  id: EntityId;
  certificate_number?: string | null;
  sacrament_type?: string | null;
  sacrament_id?: EntityId | null;
  person_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  issued_date?: IsoDate | null;
  issued_by_user_id?: EntityId | null;
  issued_by_name?: string | null;
  pastor_id?: EntityId | null;
  pastor_name?: string | null;
  status?: string | null;
  payment_status?: string | null;
  amount_paid?: number | null;
  currency?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface SacramentDocument {
  id: EntityId;
  sacrament_type?: string | null;
  sacrament_id?: EntityId | null;
  person_name?: string | null;
  document_type?: string | null;
  document_title?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  status?: string | null;
  verified_by_user_id?: EntityId | null;
  verified_by_name?: string | null;
  verified_at?: IsoDateTime | null;
  rejected_by_user_id?: EntityId | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  uploaded_by_user_id?: EntityId | null;
  uploaded_by_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface SacramentAppointment {
  id: EntityId;
  sacrament_type?: string | null;
  sacrament_id?: EntityId | null;
  title?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  scheduled_date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  venue_space_id?: EntityId | null;
  venue_space_name?: string | null;
  pastor_id?: EntityId | null;
  pastor_name?: string | null;
  status?: string | null;
  notes?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
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

// ---------------------------------------------------------------------------
// F.E.V.O — Follow-Up, Evangelism, Visitation, Prayer
// ---------------------------------------------------------------------------

export interface FevoWeeklyConfig {
  id: EntityId;
  week_label?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  week_start_date?: IsoDate | null;
  week_end_date?: IsoDate | null;
  /** PT UI */
  semana_inicio?: IsoDate | null;
  semana_fim?: IsoDate | null;
  team_a_activity?: string | null;
  team_b_activity?: string | null;
  team_c_activity?: string | null;
  team_d_activity?: string | null;
  prepared_by?: string | null;
  prepared_by_user_id?: EntityId | null;
  prepared_by_name?: string | null;
  preparado_por?: string | null;
  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  notes?: string | null;
  observacoes?: string | null;
  status?: string | null;
  estado?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoTeam {
  id: EntityId;
  name?: string | null;
  code?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  leader_id?: EntityId | null;
  leader_name?: string | null;
  leader_phone?: string | null;
  assistant_leader_id?: EntityId | null;
  assistant_leader_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_ids?: string[] | null;
  member_count?: number | null;
  members?: string[] | null;
  activity_types?: string[] | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoActivity {
  id: EntityId;
  weekly_config_id?: EntityId | null;
  config_id?: EntityId | null;
  week_label?: string | null;
  week_start_date?: IsoDate | null;
  week_end_date?: IsoDate | null;
  team_id?: EntityId | null;
  team_name?: string | null;
  team_code?: string | null;
  activity_type?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  assigned_date?: IsoDate | null;
  due_date?: IsoDate | null;
  scheduled_date?: IsoDate | null;
  leader_id?: EntityId | null;
  leader_name?: string | null;
  assigned_leader_name?: string | null;
  status?: string | null;
  report_id?: EntityId | null;
  notes?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoReport {
  id: EntityId;
  report_number?: string | null;
  weekly_config_id?: EntityId | null;
  config_id?: EntityId | null;
  week_label?: string | null;
  report_kind?: string | null;
  activity_id?: EntityId | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  week_start_date?: IsoDate | null;
  week_end_date?: IsoDate | null;
  semana_inicio?: IsoDate | null;
  semana_fim?: IsoDate | null;
  team?: string | null;
  team_id?: EntityId | null;
  team_name?: string | null;
  team_code?: string | null;
  activity_type?: string | null;
  group_id?: EntityId | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  leader_id?: EntityId | null;
  group_name?: string | null;
  leader_name?: string | null;
  leader_phone?: string | null;
  report_date?: IsoDate | null;
  number_of_cells?: number | null;
  number_of_members?: number | null;
  leaders_present?: number | null;
  members_present?: number | null;
  ft_in_church?: number | null;
  submitted_report?: boolean | null;
  submitted_by?: string | null;
  submitted_by_user_id?: EntityId | null;
  submitted_by_name?: string | null;
  submitted_at?: IsoDate | null;
  status?: string | null;
  summary?: string | null;
  notes?: string | null;
  /** Follow-up metrics (denormalized for UI reports) */
  souls_contacted?: number | null;
  feedback_count?: number | null;
  followup_result?: string | null;
  next_action?: string | null;
  /** Evangelism */
  souls_evangelized?: number | null;
  new_converts?: number | null;
  evangelism_location?: string | null;
  materials_distributed?: number | null;
  /** Visitation */
  souls_visited?: number | null;
  family_members_reached?: number | null;
  visit_location?: string | null;
  visit_result?: string | null;
  /** Prayer */
  average_members_present?: number | null;
  days_of_prayer?: number | null;
  prayer_focus?: string | null;
  prayer_testimonies?: string | null;
  title?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  validated_by?: string | null;
  validated_by_user_id?: EntityId | null;
  validated_by_name?: string | null;
  validated_at?: IsoDateTime | null;
  rejected_by_user_id?: EntityId | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

/** Typed detail rows linked to a FevoReport */
export interface FevoFollowUpRecord {
  id: EntityId;
  report_id?: EntityId | null;
  activity_id?: EntityId | null;
  souls_contacted?: number | null;
  feedback_count?: number | null;
  successful_contacts?: number | null;
  no_answer_count?: number | null;
  followup_result?: string | null;
  next_action?: string | null;
  referred_to_follow_up_department?: boolean | null;
  created_follow_up_ids?: string[] | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoEvangelismRecord {
  id: EntityId;
  report_id?: EntityId | null;
  activity_id?: EntityId | null;
  location?: string | null;
  souls_evangelized?: number | null;
  new_converts?: number | null;
  first_timers_invited?: number | null;
  first_timers_attended?: number | null;
  invitations_given?: number | null;
  evangelism_location?: string | null;
  materials_distributed?: number | null;
  testimonies?: string | null;
  created_first_timer_ids?: string[] | null;
  follow_up_needed?: boolean | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoVisitationRecord {
  id: EntityId;
  report_id?: EntityId | null;
  activity_id?: EntityId | null;
  location?: string | null;
  souls_visited?: number | null;
  families_visited?: number | null;
  family_members_reached?: number | null;
  homes_visited?: number | null;
  new_converts?: number | null;
  prayer_requests?: string | null;
  visit_location?: string | null;
  visit_result?: string | null;
  referred_to_counseling?: boolean | null;
  referred_to_follow_up?: boolean | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoPrayerRecord {
  id: EntityId;
  report_id?: EntityId | null;
  activity_id?: EntityId | null;
  prayer_focus?: string | null;
  average_members_present?: number | null;
  total_attendance?: number | null;
  days_of_prayer?: number | null;
  testimonies?: string | null;
  prayer_testimonies?: string | null;
  prayer_requests_count?: number | null;
  special_requests_count?: number | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface FevoMissingReport {
  id: EntityId;
  weekly_config_id?: EntityId | null;
  config_id?: EntityId | null;
  week_label?: string | null;
  activity_id?: EntityId | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  week_start_date?: IsoDate | null;
  week_end_date?: IsoDate | null;
  semana_inicio?: IsoDate | null;
  semana_fim?: IsoDate | null;
  team?: string | null;
  team_id?: EntityId | null;
  team_name?: string | null;
  team_code?: string | null;
  activity_type?: string | null;
  expected_report_date?: IsoDate | null;
  group_id?: EntityId | null;
  group_name?: string | null;
  leader_name?: string | null;
  reason_not_submitted?: string | null;
  followup_action?: string | null;
  resolution_notes?: string | null;
  contacted?: boolean | null;
  contacted_by?: string | null;
  contacted_by_user_id?: EntityId | null;
  contacted_by_name?: string | null;
  contacted_at?: IsoDateTime | null;
  status?: string | null;
  resolved_at?: IsoDateTime | null;
  resolved_by?: string | null;
  resolved_by_user_id?: EntityId | null;
  resolved_by_name?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Prison Ministry — Sister Janet Marquele
// Minimal inmate data only; no criminal details.
// ---------------------------------------------------------------------------

export interface PrisonLocation {
  id: EntityId;
  name?: string | null;
  nome_da_prisao?: string | null;
  official_name?: string | null;
  type?: string | null;
  province?: string | null;
  provincia?: string | null;
  city?: string | null;
  cidade?: string | null;
  district?: string | null;
  address?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  representative_id?: EntityId | null;
  representative_name?: string | null;
  representante_da_prisao?: string | null;
  contacto_do_representante?: string | null;
  church_id?: EntityId | null;
  igreja_responsavel?: string | null;
  allowed_visit_days?: string[] | null;
  allowed_visit_times?: string | null;
  requires_authorization?: boolean | null;
  authorization_notes?: string | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonRepresentative {
  id: EntityId;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  full_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  role?: string | null;
  organization?: string | null;
  preferred_contact_method?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonService {
  id: EntityId;
  service_number?: string | null;
  prison_id?: EntityId | null;
  prisao?: string | null;
  prison_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja_responsavel?: string | null;
  service_date?: IsoDate | null;
  data?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  dia_da_semana?: string | null;
  service_type?: string | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  lider_responsavel?: string | null;
  preacher_id?: EntityId | null;
  preacher_name?: string | null;
  team_members?: Array<{ staff_id?: string; name?: string; role?: string }> | null;
  membros_que_foram?: string | null;
  attendance_total?: number | null;
  numero_de_internos_presentes?: number | null;
  first_timers_count?: number | null;
  new_converts_count?: number | null;
  novos_convertidos?: number | null;
  foundation_interest_count?: number | null;
  interessados_em_escola_de_fundacao?: number | null;
  materials_distributed?: number | null;
  prayer_requests_count?: number | null;
  testimonies?: string | null;
  tema_ou_mensagem?: string | null;
  aula_de_fundacao_dada?: boolean | null;
  status?: string | null;
  estado?: string | null;
  report_id?: EntityId | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonParticipant {
  id: EntityId;
  participant_code?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  full_name?: string | null;
  preferred_name?: string | null;
  gender?: string | null;
  age_range?: string | null;
  contact_allowed?: boolean | null;
  contact_reference?: string | null;
  first_contact_date?: IsoDate | null;
  source_service_id?: EntityId | null;
  born_again?: boolean | null;
  new_convert_date?: IsoDate | null;
  foundation_interest?: boolean | null;
  foundation_status?: string | null;
  foundation_student_id?: EntityId | null;
  follow_up_status?: string | null;
  last_follow_up_date?: IsoDate | null;
  next_follow_up_date?: IsoDate | null;
  confidentiality_level?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonFoundationStudent {
  id: EntityId;
  participant_id?: EntityId | null;
  participant_name?: string | null;
  nome_do_participante?: string | null;
  prison_id?: EntityId | null;
  prisao?: string | null;
  prison_name?: string | null;
  foundation_student_id?: EntityId | null;
  class_id?: EntityId | null;
  class_name?: string | null;
  delivery_mode?: string | null;
  current_lesson?: number | null;
  lessons_completed?: number | null;
  attendance_records?: Record<string, boolean> | null;
  aula_1_presenca?: boolean | null;
  aula_2_presenca?: boolean | null;
  aula_3_presenca?: boolean | null;
  aula_4_presenca?: boolean | null;
  aula_5_presenca?: boolean | null;
  aula_6_presenca?: boolean | null;
  aula_7_presenca?: boolean | null;
  test_scores?: number | null;
  nota_exame?: number | null;
  soul_winning_completed?: boolean | null;
  pratica_evangelismo?: boolean | null;
  final_exam_status?: string | null;
  graduation_status?: string | null;
  aprovado?: boolean | null;
  graduado?: boolean | null;
  certificado_emitido?: boolean | null;
  assigned_teacher_id?: EntityId | null;
  assigned_teacher_name?: string | null;
  church_id?: EntityId | null;
  igreja_responsavel?: string | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonWeeklyAgenda {
  id: EntityId;
  week_label?: string | null;
  week_start_date?: IsoDate | null;
  week_end_date?: IsoDate | null;
  semana_inicio?: IsoDate | null;
  semana_fim?: IsoDate | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  responsavel?: string | null;
  monday_reports_agenda?: boolean | null;
  segunda_preparar_relatorios_e_agenda?: boolean | null;
  tuesday_prayer_preparation?: boolean | null;
  terca_reuniao_de_oracao?: boolean | null;
  wednesday_representative_followup?: boolean | null;
  quarta_followup_com_representante?: boolean | null;
  thursday_service_plan?: boolean | null;
  quinta_servico_prisional?: boolean | null;
  friday_service_plan?: boolean | null;
  sexta_servico_prisional?: boolean | null;
  weekend_followup_plan?: boolean | null;
  sabado_domingo_acompanhamento?: boolean | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  church_id?: EntityId | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonFollowUp {
  id: EntityId;
  participant_id?: EntityId | null;
  participant_name?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  representative_id?: EntityId | null;
  representative_name?: string | null;
  follow_up_date?: IsoDate | null;
  method?: string | null;
  status?: string | null;
  result?: string | null;
  next_action?: string | null;
  next_follow_up_date?: IsoDate | null;
  recorded_by_user_id?: EntityId | null;
  recorded_by_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonReport {
  id: EntityId;
  report_number?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  service_id?: EntityId | null;
  service_number?: string | null;
  report_date?: IsoDate | null;
  period_start?: IsoDate | null;
  period_end?: IsoDate | null;
  name?: string | null;
  category?: string | null;
  attendance_total?: number | null;
  first_timers_count?: number | null;
  new_converts_count?: number | null;
  foundation_interest_count?: number | null;
  foundation_students_count?: number | null;
  prayer_requests_count?: number | null;
  testimonies_count?: number | null;
  materials_distributed?: number | null;
  challenges?: string | null;
  recommendations?: string | null;
  status?: string | null;
  estado?: string | null;
  submitted_by_user_id?: EntityId | null;
  submitted_by_name?: string | null;
  submitted_at?: IsoDateTime | null;
  validated_by_user_id?: EntityId | null;
  validated_by_name?: string | null;
  validated_at?: IsoDateTime | null;
  rejected_by_user_id?: EntityId | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  notes?: string | null;
  church_id?: EntityId | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface PrisonMaterialsRequest {
  id: EntityId;
  request_number?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  requested_by_user_id?: EntityId | null;
  requested_by_name?: string | null;
  material_type?: string | null;
  material_name?: string | null;
  quantity_requested?: number | null;
  quantity_fulfilled?: number | null;
  needed_by_date?: IsoDate | null;
  status?: string | null;
  ministry_materials_request_id?: EntityId | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Ministry Materials / Materiais Ministeriais
// ---------------------------------------------------------------------------

/** category: Rhapsody | Bible | Book | Foundation School Material | … */
export interface MinistryMaterial {
  id: EntityId;
  material_code?: string | null;
  name?: string | null;
  /** PT UI */
  titulo_do_material?: string | null;
  description?: string | null;
  category?: string | null;
  /** PT UI */
  tipo?: string | null;
  subcategory?: string | null;
  language?: string | null;
  unit_price?: number | null;
  /** PT UI */
  preco?: number | null;
  currency?: string | null;
  cost_price?: number | null;
  is_free_distribution_allowed?: boolean | null;
  is_sellable?: boolean | null;
  is_digital?: boolean | null;
  /** PT UI */
  formato?: string | null;
  autor_ou_origem?: string | null;
  reorder_level?: number | null;
  /** PT UI dual with reorder_level */
  stock_minimo?: number | null;
  /** Convenience dual with stock collection */
  stock_actual?: number | null;
  photo_url?: string | null;
  church_id?: EntityId | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialStock {
  id: EntityId;
  material_id?: EntityId | null;
  material_code?: string | null;
  material_name?: string | null;
  /** PT UI */
  titulo_do_material?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  location?: string | null;
  storage_space_id?: EntityId | null;
  storage_space_name?: string | null;
  quantity_available?: number | null;
  quantity_reserved?: number | null;
  quantity_distributed?: number | null;
  quantity_sold?: number | null;
  reorder_level?: number | null;
  /** Weekly snapshot dual-map (UI weeklyStock) */
  semana_inicio?: IsoDate | null;
  semana_fim?: IsoDate | null;
  stock_inicial?: number | null;
  entradas?: number | null;
  saidas?: number | null;
  stock_final?: number | null;
  diferenca?: number | null;
  status?: string | null;
  estado?: string | null;
  last_stock_update?: IsoDate | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialStockMovement {
  id: EntityId;
  material_id?: EntityId | null;
  material_name?: string | null;
  movement_type?: string | null;
  quantity?: number | null;
  from_church_id?: EntityId | null;
  from_church_name?: string | null;
  from_location?: string | null;
  to_church_id?: EntityId | null;
  to_church_name?: string | null;
  to_location?: string | null;
  source_type?: string | null;
  source_id?: EntityId | null;
  performed_by_user_id?: EntityId | null;
  performed_by_name?: string | null;
  movement_date?: IsoDate | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialSale {
  id: EntityId;
  sale_number?: string | null;
  material_id?: EntityId | null;
  material_name?: string | null;
  /** PT UI */
  titulo_do_material?: string | null;
  quantity?: number | null;
  /** PT UI */
  quantidade?: number | null;
  unit_price?: number | null;
  total_amount?: number | null;
  /** PT UI */
  valor?: number | null;
  currency?: string | null;
  buyer_type?: string | null;
  buyer_name?: string | null;
  /** PT UI */
  comprador?: string | null;
  buyer_phone?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  /** PT UI */
  igreja?: string | null;
  payment_method?: string | null;
  /** PT UI */
  metodo_de_pagamento?: string | null;
  payment_reference?: string | null;
  pop_prova_de_pagamento?: string | null;
  payment_status?: string | null;
  /** Future Finance link — never auto-created */
  finance_record_id?: EntityId | null;
  sold_by_user_id?: EntityId | null;
  sold_by_name?: string | null;
  recebido_por?: string | null;
  sale_date?: IsoDate | null;
  /** PT UI */
  data?: IsoDate | null;
  semana_do_relatorio?: string | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialDistribution {
  id: EntityId;
  distribution_number?: string | null;
  material_id?: EntityId | null;
  material_name?: string | null;
  titulo_do_material?: string | null;
  quantity?: number | null;
  quantidade?: number | null;
  distribution_type?: string | null;
  tipo_de_distribuicao?: string | null;
  target_type?: string | null;
  target_id?: EntityId | null;
  target_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  igreja_destinataria?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  purpose?: string | null;
  requested_by_user_id?: EntityId | null;
  requested_by_name?: string | null;
  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  distributed_by_user_id?: EntityId | null;
  distributed_by_name?: string | null;
  distributed_at?: IsoDateTime | null;
  responsavel_pelo_envio?: string | null;
  recebido_por?: string | null;
  distribution_date?: IsoDate | null;
  data?: IsoDate | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialRequest {
  id: EntityId;
  request_number?: string | null;
  source?: string | null;
  source_module?: string | null;
  source_id?: EntityId | null;
  material_id?: EntityId | null;
  material_name?: string | null;
  material_type?: string | null;
  quantity_requested?: number | null;
  quantity_approved?: number | null;
  quantity_fulfilled?: number | null;
  target_type?: string | null;
  target_id?: EntityId | null;
  target_name?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  prison_id?: EntityId | null;
  prison_name?: string | null;
  needed_by_date?: IsoDate | null;
  status?: string | null;
  requested_by_user_id?: EntityId | null;
  requested_by_name?: string | null;
  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  fulfilled_by_user_id?: EntityId | null;
  fulfilled_by_name?: string | null;
  fulfilled_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialFund {
  id: EntityId;
  fund_number?: string | null;
  source?: string | null;
  related_sale_id?: EntityId | null;
  related_distribution_id?: EntityId | null;
  material_id?: EntityId | null;
  material_name?: string | null;
  amount?: number | null;
  currency?: string | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  status?: string | null;
  estado?: string | null;
  /** Future Finance link — never auto-created */
  finance_record_id?: EntityId | null;
  received_by_user_id?: EntityId | null;
  received_by_name?: string | null;
  received_at?: IsoDate | IsoDateTime | null;
  /** Campaign-style dual-map (UI freeFunds) */
  campanha?: string | null;
  valor_alvo?: number | null;
  valor_levantado?: number | null;
  materiais_a_distribuir?: string | null;
  igrejas_beneficiadas?: string | null;
  church_id?: EntityId | null;
  notes?: string | null;
  observacoes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface MaterialReport {
  id: EntityId;
  report_number?: string | null;
  name?: string | null;
  category?: string | null;
  period_start?: IsoDate | null;
  period_end?: IsoDate | null;
  quantity?: number | null;
  amount?: number | null;
  currency?: string | null;
  church_id?: EntityId | null;
  status?: string | null;
  estado?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

// ---------------------------------------------------------------------------
// Programs & Events / Programas
// ---------------------------------------------------------------------------

export interface Program {
  id: EntityId;
  program_code?: string | null;
  name?: string | null;
  description?: string | null;
  program_type?: string | null;
  category?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  start_date?: IsoDate | null;
  end_date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  recurrence?: string | null;
  location_type?: string | null;
  location?: string | null;
  venue_space_id?: EntityId | null;
  venue_space_name?: string | null;
  online_link?: string | null;
  streaming_required?: boolean | null;
  expected_attendance?: number | null;
  actual_attendance?: number | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  /** UI dual-map */
  owner?: string | null;
  main_speaker_id?: EntityId | null;
  main_speaker_name?: string | null;
  status?: string | null;
  estado?: string | null;
  priority?: string | null;
  budget_required?: number | null;
  approved_budget?: number | null;
  currency?: string | null;
  requisition_ids?: EntityId[] | null;
  finance_disbursement_ids?: EntityId[] | null;
  media_schedule_ids?: EntityId[] | null;
  ministry_material_request_ids?: EntityId[] | null;
  venue_checklist_ids?: EntityId[] | null;
  registration_required?: boolean | null;
  registration_status?: string | null;
  report_id?: EntityId | null;
  notes?: string | null;
  created_by_user_id?: EntityId | null;
  created_by_name?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramSession {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  title?: string | null;
  description?: string | null;
  session_date?: IsoDate | null;
  start_time?: string | null;
  end_time?: string | null;
  speaker_id?: EntityId | null;
  speaker_name?: string | null;
  session_type?: string | null;
  location?: string | null;
  online_link?: string | null;
  status?: string | null;
  attendance_count?: number | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramTeamMember {
  staff_id?: EntityId | null;
  name?: string | null;
  role?: string | null;
  phone?: string | null;
  status?: string | null;
}

export interface ProgramTeam {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  department_id?: EntityId | null;
  department_name?: string | null;
  team_name?: string | null;
  leader_staff_id?: EntityId | null;
  leader_name?: string | null;
  members?: ProgramTeamMember[] | null;
  responsibilities?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramParticipant {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  participant_type?: string | null;
  person_id?: EntityId | null;
  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  staff_id?: EntityId | null;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  registration_id?: EntityId | null;
  attendance_status?: string | null;
  check_in_time?: IsoDateTime | null;
  born_again?: boolean | null;
  new_convert?: boolean | null;
  foundation_interest?: boolean | null;
  counseling_interest?: boolean | null;
  cell_interest?: boolean | null;
  status?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramRegistration {
  id: EntityId;
  registration_number?: string | null;
  program_id?: EntityId | null;
  program_name?: string | null;
  participant_type?: string | null;
  person_id?: EntityId | null;
  member_id?: EntityId | null;
  first_timer_id?: EntityId | null;
  full_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  church_id?: EntityId | null;
  church_name?: string | null;
  cell_group_id?: EntityId | null;
  cell_group_name?: string | null;
  cell_id?: EntityId | null;
  cell_name?: string | null;
  registration_date?: IsoDate | null;
  status?: string | null;
  payment_required?: boolean | null;
  payment_status?: string | null;
  amount?: number | null;
  currency?: string | null;
  /** Future Finance — never auto-created */
  finance_record_id?: EntityId | null;
  checked_in?: boolean | null;
  check_in_time?: IsoDateTime | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramResource {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  resource_type?: string | null;
  resource_name?: string | null;
  description?: string | null;
  quantity_required?: number | null;
  quantity_available?: number | null;
  source_module?: string | null;
  source_id?: EntityId | null;
  status?: string | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramBudget {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  budget_item?: string | null;
  category?: string | null;
  estimated_amount?: number | null;
  approved_amount?: number | null;
  spent_amount?: number | null;
  currency?: string | null;
  requisition_id?: EntityId | null;
  finance_disbursement_id?: EntityId | null;
  status?: string | null;
  approved_by_user_id?: EntityId | null;
  approved_by_name?: string | null;
  approved_at?: IsoDateTime | null;
  notes?: string | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramChecklist {
  id: EntityId;
  program_id?: EntityId | null;
  program_name?: string | null;
  checklist_type?: string | null;
  responsible_user_id?: EntityId | null;
  responsible_name?: string | null;
  venue_ready?: boolean | null;
  media_ready?: boolean | null;
  sound_ready?: boolean | null;
  streaming_ready?: boolean | null;
  materials_ready?: boolean | null;
  staff_ready?: boolean | null;
  security_ready?: boolean | null;
  decoration_ready?: boolean | null;
  registration_ready?: boolean | null;
  transport_ready?: boolean | null;
  finance_ready?: boolean | null;
  issues_found?: string | null;
  actions_taken?: string | null;
  status?: string | null;
  completed_by_user_id?: EntityId | null;
  completed_by_name?: string | null;
  completed_at?: IsoDateTime | null;
  created_at?: IsoDate | IsoDateTime;
  updated_at?: IsoDate | IsoDateTime;
}

export interface ProgramReport {
  id: EntityId;
  report_number?: string | null;
  program_id?: EntityId | null;
  program_name?: string | null;
  report_date?: IsoDate | null;
  attendance_total?: number | null;
  first_timers_count?: number | null;
  new_converts_count?: number | null;
  foundation_interest_count?: number | null;
  counseling_interest_count?: number | null;
  cell_interest_count?: number | null;
  sessions_completed?: number | null;
  teams_involved?: number | null;
  materials_distributed?: number | null;
  media_coverage_done?: boolean | null;
  budget_approved?: number | null;
  budget_spent?: number | null;
  currency?: string | null;
  challenges?: string | null;
  recommendations?: string | null;
  status?: string | null;
  submitted_by_user_id?: EntityId | null;
  submitted_by_name?: string | null;
  submitted_at?: IsoDateTime | null;
  validated_by_user_id?: EntityId | null;
  validated_by_name?: string | null;
  validated_at?: IsoDateTime | null;
  rejected_by_user_id?: EntityId | null;
  rejected_by_name?: string | null;
  rejected_at?: IsoDateTime | null;
  rejection_reason?: string | null;
  notes?: string | null;
  church_id?: EntityId | null;
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
  | "notification_templates"
  | "system_settings"
  | "global_categories"
  | "status_definitions"
  | "language_settings"
  | "notification_settings"
  | "ui_preferences"
  | "cell_groups"
  | "cells"
  | "cell_leaders"
  | "cell_report_submissions"
  | "media_technicians"
  | "media_schedules"
  | "media_roles"
  | "media_services"
  | "media_channels"
  | "media_performance"
  | "media_awards"
  | "counseling_requests"
  | "counseling_cases"
  | "counseling_appointments"
  | "counselors"
  | "counseling_feedback"
  | "counseling_referrals"
  | "baptisms"
  | "marriages"
  | "baby_dedications"
  | "sacrament_certificates"
  | "sacrament_documents"
  | "sacrament_appointments"
  | "fevo_weekly_configs"
  | "fevo_teams"
  | "fevo_activities"
  | "fevo_reports"
  | "fevo_missing_reports"
  | "fevo_follow_up_records"
  | "fevo_evangelism_records"
  | "fevo_visitation_records"
  | "fevo_prayer_records"
  | "prison_locations"
  | "prison_representatives"
  | "prison_services"
  | "prison_participants"
  | "prison_foundation_students"
  | "prison_weekly_agendas"
  | "prison_follow_ups"
  | "prison_reports"
  | "prison_materials_requests"
  | "ministry_materials_catalog"
  | "ministry_materials_stock"
  | "ministry_materials_stock_movements"
  | "ministry_materials_sales"
  | "ministry_materials_distributions"
  | "ministry_materials_requests"
  | "ministry_materials_funds"
  | "ministry_materials_reports"
  | "programs"
  | "program_sessions"
  | "program_teams"
  | "program_participants"
  | "program_registrations"
  | "program_resources"
  | "program_budgets"
  | "program_checklists"
  | "program_reports"
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
