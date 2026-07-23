import { getDataProvider } from "../dataProvider";
import { getDataSource } from "../config";
import type {
  EntityId,
  StaffAttendance,
  StaffDepartment,
  StaffDocument,
  StaffMember,
  StaffPerformanceReview,
  StaffRole,
  StaffSalary,
} from "../types/entities";
import type { DataResult } from "../types/repository";
import { STAFF_SEED } from "../seeds/staffSeed";
import { STAFF_DEPARTMENTS_SEED } from "../seeds/staffDepartmentsSeed";
import { STAFF_ROLES_SEED } from "../seeds/staffRolesSeed";
import { STAFF_SALARIES_SEED } from "../seeds/staffSalariesSeed";
import { STAFF_PERFORMANCE_SEED } from "../seeds/staffPerformanceSeed";
import { STAFF_DOCUMENTS_SEED } from "../seeds/staffDocumentsSeed";
import { STAFF_ATTENDANCE_SEED } from "../seeds/staffAttendanceSeed";

function fail<T>(error: string, code = "STAFF_HR_ERROR"): DataResult<T> {
  return { ok: false, error, code };
}
function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
function nowIso(): string {
  return new Date().toISOString();
}
function statusKey(s: string | null | undefined): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Status mapping English ↔ PT UI
// ---------------------------------------------------------------------------

export function toEnglishStaffStatus(raw: string | null | undefined): string {
  const k = statusKey(raw);
  if (!k) return "Active";
  if (k.includes("inactiv") || k === "inactivo") return "Inactive";
  if (k.includes("leave") || k.includes("licenca")) return "On Leave";
  if (k.includes("suspend")) return "Suspended";
  if (k.includes("terminat") || k.includes("demit")) return "Terminated";
  if (k.includes("transfer")) return "Transferred";
  if (k.includes("active") || k.includes("activo") || k.includes("ativo")) return "Active";
  return raw || "Active";
}

export function toLegacyStaffStatus(english: string | null | undefined): string {
  const e = toEnglishStaffStatus(english);
  if (e === "Inactive") return "Inactivo";
  if (e === "On Leave") return "Em Licença";
  if (e === "Suspended") return "Suspenso";
  if (e === "Terminated") return "Terminado";
  if (e === "Transferred") return "Transferido";
  return "Activo";
}

export function toEnglishEmployment(raw: string | null | undefined): string {
  const k = statusKey(raw);
  if (k.includes("part")) return "Part Time";
  if (k.includes("volunt")) return "Volunteer";
  if (k.includes("contract") || k.includes("contrat") || k.includes("prestacao")) return "Contractor";
  if (k.includes("intern") || k.includes("estagi")) return "Intern";
  if (k.includes("full") || k.includes("tempo integral") || k.includes("full-time")) return "Full Time";
  return raw || "Full Time";
}

// Birthday helpers
function parseDob(value: string | null | undefined): { year: number; month: number; day: number } | null {
  if (!value) return null;
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

function daysUntilBirthday(dob: string | null | undefined, ref = new Date()): number | null {
  const p = parseDob(dob);
  if (!p) return null;
  const year = ref.getFullYear();
  let next = new Date(year, p.month - 1, p.day);
  const today = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  if (next < today) next = new Date(year + 1, p.month - 1, p.day);
  return Math.round((next.getTime() - today.getTime()) / 86400000);
}

function calcAge(dob: string | null | undefined, ref = new Date()): number | null {
  const p = parseDob(dob);
  if (!p) return null;
  let age = ref.getFullYear() - p.year;
  const month = ref.getMonth() + 1;
  const day = ref.getDate();
  if (month < p.month || (month === p.month && day < p.day)) age -= 1;
  return age >= 0 ? age : null;
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizeStaffMember(input: Partial<StaffMember> & { id?: string }): StaffMember {
  const id = input.id || `staff-${Date.now()}`;
  const full =
    input.full_name ||
    [input.first_name, input.last_name].filter(Boolean).join(" ") ||
    "";
  const parts = full.trim().split(/\s+/);
  const first = input.first_name || parts[0] || "";
  const last = input.last_name || (parts.length > 1 ? parts.slice(1).join(" ") : "");
  const dob = input.date_of_birth || input.data_de_aniversario || null;
  const parsed = parseDob(dob || undefined);
  const engStatus = toEnglishStaffStatus(input.status);
  const employment = toEnglishEmployment(input.employment_type);

  return {
    ...input,
    id,
    staff_code: input.staff_code || `STF-${String(Date.now()).slice(-6)}`,
    full_name: full,
    first_name: first,
    last_name: last,
    title: input.title || "",
    gender: input.gender || "",
    date_of_birth: dob,
    data_de_aniversario: dob,
    phone: input.phone || "",
    whatsapp: input.whatsapp || input.phone || "",
    email: input.email || "",
    address: input.address || "",
    city: input.city || "",
    province: input.province || "",
    marital_status: input.marital_status || "Por Confirmar",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    role_id: input.role_id || null,
    role_title: input.role_title || "",
    supervisor_id: input.supervisor_id || input.supervisor_user_id || null,
    supervisor_user_id: input.supervisor_user_id || input.supervisor_id || null,
    supervisor_name: input.supervisor_name || "",
    employment_type: employment,
    staff_type: input.staff_type || "Department",
    start_date: input.start_date || todayIso(),
    end_date: input.end_date || null,
    contract_start_date: input.contract_start_date || input.start_date || null,
    contract_end_date: input.contract_end_date || null,
    probation_end_date: input.probation_end_date || null,
    status: engStatus,
    emergency_contact_name: input.emergency_contact_name || "",
    emergency_contact_phone: input.emergency_contact_phone || "",
    national_id_number: input.national_id_number || "",
    nuit: input.nuit || "",
    profile_photo: input.profile_photo || "",
    salary_or_allowance: Number(input.salary_or_allowance ?? 0) || 0,
    payment_frequency: input.payment_frequency || "",
    payment_method: input.payment_method || "",
    bank_name: input.bank_name || "",
    bank_account_number: input.bank_account_number || "",
    mobile_money_number: input.mobile_money_number || "",
    bank_or_mobile_details: input.bank_or_mobile_details || "",
    has_dashboard_access: input.has_dashboard_access ?? !!input.user_id,
    user_id: input.user_id || null,
    login_email: input.login_email || input.email || "",
    notes: input.notes || "",
    birthday_month: parsed ? String(parsed.month).padStart(2, "0") : input.birthday_month || "",
    birthday_day: parsed ? String(parsed.day).padStart(2, "0") : input.birthday_day || "",
    age: calcAge(dob || undefined),
    next_birthday: (() => {
      const d = daysUntilBirthday(dob || undefined);
      if (d == null) return null;
      const ref = new Date();
      const p = parseDob(dob || undefined)!;
      const y = d === 0 || new Date(ref.getFullYear(), p.month - 1, p.day) >= new Date(ref.getFullYear(), ref.getMonth(), ref.getDate())
        ? ref.getFullYear()
        : ref.getFullYear() + 1;
      // simpler: use daysUntil
      const next = new Date();
      next.setDate(next.getDate() + (d || 0));
      return next.toISOString().slice(0, 10);
    })(),
    days_until_birthday: daysUntilBirthday(dob || undefined),
    created_by: input.created_by || input.created_by_name || "",
    created_by_name: input.created_by_name || input.created_by || "",
    updated_by: input.updated_by || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

/** Map for UI which still uses Activo etc. */
export function toUiStaffMember(s: StaffMember): StaffMember {
  const eng = toEnglishStaffStatus(s.status);
  return {
    ...s,
    status: toLegacyStaffStatus(eng),
    // keep English too under a secondary if needed — UI filters on Activo
  };
}

export function normalizeStaffDepartment(
  input: Partial<StaffDepartment> & { id?: string },
): StaffDepartment {
  return {
    ...input,
    id: input.id || `dept-${Date.now()}`,
    name: input.name || "",
    description: input.description || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    head_staff_id: input.head_staff_id || null,
    head_staff_name: input.head_staff_name || "",
    parent_department_id: input.parent_department_id || null,
    status: input.status || "Active",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeStaffRole(input: Partial<StaffRole> & { id?: string }): StaffRole {
  return {
    ...input,
    id: input.id || `role-${Date.now()}`,
    title: input.title || "",
    description: input.description || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    permission_template: input.permission_template || "",
    level: input.level || "Staff",
    status: input.status || "Active",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeStaffSalary(input: Partial<StaffSalary> & { id?: string }): StaffSalary {
  const amount = Number(input.amount ?? input.base_amount ?? 0) || 0;
  const bonus = Number(input.bonus ?? 0) || 0;
  const deductions = Number(input.deductions ?? 0) || 0;
  const net =
    input.net_amount != null ? Number(input.net_amount) : amount + bonus - deductions;
  return {
    ...input,
    id: input.id || `sal-${Date.now()}`,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    salary_type: input.salary_type || "Salary",
    amount,
    base_amount: Number(input.base_amount ?? amount) || amount,
    bonus,
    deductions,
    net_amount: net,
    currency: input.currency || "MZN",
    payment_frequency: input.payment_frequency || "Monthly",
    payment_method: input.payment_method || "",
    bank_name: input.bank_name || "",
    bank_account_number: input.bank_account_number || "",
    mobile_money_number: input.mobile_money_number || "",
    month: input.month || "",
    effective_from: input.effective_from || null,
    effective_to: input.effective_to || null,
    status: input.status || input.payment_status || "Active",
    payment_status: input.payment_status || input.status || "Pendente",
    approved_by_user_id: input.approved_by_user_id || null,
    approved_by_name: input.approved_by_name || input.approved_by || "",
    approved_by: input.approved_by || input.approved_by_name || "",
    approved_at: input.approved_at || null,
    paid_by: input.paid_by || "",
    paid_at: input.paid_at || null,
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizePerformanceReview(
  input: Partial<StaffPerformanceReview> & { id?: string },
): StaffPerformanceReview {
  const scores = [
    Number(input.punctuality_score ?? 0),
    Number(input.responsibility_score ?? input.task_completion_score ?? 0),
    Number(input.teamwork_score ?? 0),
    Number(input.technical_skill_score ?? input.report_submission_score ?? 0),
    Number(input.spiritual_attitude_score ?? 0),
    Number(input.communication_score ?? 0),
    Number(input.leadership_score ?? input.supervisor_rating ?? 0),
  ].filter((n) => !Number.isNaN(n));

  // Support 0–10 UI scores and 0–100 model: if all <= 10, treat as 0–10 scale for overall
  const uiScores = [
    Number(input.punctuality_score ?? 0),
    Number(input.task_completion_score ?? 0),
    Number(input.report_submission_score ?? 0),
    Number(input.teamwork_score ?? 0),
    Number(input.supervisor_rating ?? 0),
  ];
  let overall = input.overall_score;
  if (overall == null || overall === 0) {
    const filled = uiScores.filter((s) => s > 0);
    if (filled.length) {
      overall = Number((filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1));
    } else if (scores.some((s) => s > 0)) {
      const pos = scores.filter((s) => s > 0);
      overall = Number((pos.reduce((a, b) => a + b, 0) / pos.length).toFixed(1));
    } else {
      overall = 0;
    }
  }

  return {
    ...input,
    id: input.id || `perf-${Date.now()}`,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    review_period: input.review_period || input.evaluation_period || "",
    evaluation_period: input.evaluation_period || input.review_period || "",
    review_start_date: input.review_start_date || null,
    review_end_date: input.review_end_date || null,
    reviewed_by_user_id: input.reviewed_by_user_id || null,
    reviewed_by_name: input.reviewed_by_name || input.evaluated_by || "",
    evaluated_by: input.evaluated_by || input.reviewed_by_name || "",
    evaluated_at: input.evaluated_at || null,
    punctuality_score: Number(input.punctuality_score ?? 0),
    responsibility_score: Number(input.responsibility_score ?? 0),
    teamwork_score: Number(input.teamwork_score ?? 0),
    technical_skill_score: Number(input.technical_skill_score ?? 0),
    spiritual_attitude_score: Number(input.spiritual_attitude_score ?? 0),
    communication_score: Number(input.communication_score ?? 0),
    leadership_score: Number(input.leadership_score ?? 0),
    task_completion_score: Number(input.task_completion_score ?? 0),
    report_submission_score: Number(input.report_submission_score ?? 0),
    supervisor_rating: Number(input.supervisor_rating ?? 0),
    overall_score: Number(overall) || 0,
    strengths: input.strengths || "",
    improvements: input.improvements || input.areas_to_improve || "",
    areas_to_improve: input.areas_to_improve || input.improvements || "",
    goals_next_period: input.goals_next_period || input.action_plan || "",
    action_plan: input.action_plan || input.goals_next_period || "",
    status: input.status || (input.evaluated_at ? "Reviewed" : "Draft"),
    reviewed_at: input.reviewed_at || input.evaluated_at || null,
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeStaffDocument(
  input: Partial<StaffDocument> & { id?: string },
): StaffDocument {
  let status = input.status || "Active";
  if (input.expiry_date) {
    const exp = String(input.expiry_date).slice(0, 10);
    const today = todayIso();
    if (exp < today) status = "Expired";
    else {
      const soon = new Date();
      soon.setDate(soon.getDate() + 30);
      if (exp <= soon.toISOString().slice(0, 10)) status = "Expiring Soon";
    }
  }
  return {
    ...input,
    id: input.id || `doc-${Date.now()}`,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    document_type: input.document_type || "Other",
    document_title: input.document_title || input.document_type || "",
    file_url: input.file_url || "",
    file_name: input.file_name || "",
    issue_date: input.issue_date || null,
    expiry_date: input.expiry_date || null,
    status,
    uploaded_by_user_id: input.uploaded_by_user_id || null,
    uploaded_by_name: input.uploaded_by_name || "",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

export function normalizeStaffAttendance(
  input: Partial<StaffAttendance> & { id?: string },
): StaffAttendance {
  const date = input.attendance_date || input.date || todayIso();
  return {
    ...input,
    id: input.id || `att-${Date.now()}`,
    staff_id: input.staff_id || null,
    staff_name: input.staff_name || "",
    church_id: input.church_id || null,
    church_name: input.church_name || "",
    department_id: input.department_id || null,
    department_name: input.department_name || "",
    event_type: input.event_type || "Office Day",
    event_name: input.event_name || "",
    attendance_date: date,
    date,
    check_in_time: input.check_in_time || "",
    check_out_time: input.check_out_time || "",
    status: input.status || input.attendance_status || "Present",
    attendance_status: input.attendance_status || input.status || "Presente",
    recorded_by_user_id: input.recorded_by_user_id || null,
    recorded_by_name: input.recorded_by_name || "",
    notes: input.notes || "",
    created_at: input.created_at || nowIso(),
    updated_at: input.updated_at || todayIso(),
  };
}

// ---------------------------------------------------------------------------
// Staff CRUD
// ---------------------------------------------------------------------------

export async function listStaff(): Promise<DataResult<StaffMember[]>> {
  try {
    const result = await getDataProvider().staff.list();
    if (!result.ok) return result as DataResult<StaffMember[]>;
    // Dual-map: English status + PT Activo for UI
    return ok(
      (result.data || []).map((r) => {
        const n = normalizeStaffMember(r as StaffMember);
        return {
          ...n,
          status: toLegacyStaffStatus(n.status),
        };
      }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaff failed");
  }
}

export async function getStaffById(id: EntityId): Promise<DataResult<StaffMember | null>> {
  try {
    const result = await getDataProvider().staff.getById(id);
    if (!result.ok) return result as DataResult<StaffMember | null>;
    if (!result.data) return ok(null);
    const n = normalizeStaffMember(result.data as StaffMember);
    return ok({ ...n, status: toLegacyStaffStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getStaffById failed");
  }
}

export async function createStaff(payload: Partial<StaffMember>): Promise<DataResult<StaffMember>> {
  try {
    const row = normalizeStaffMember({
      ...payload,
      status: payload.status || "Active",
    });
    // Persist English status
    const toStore = { ...row, status: toEnglishStaffStatus(row.status) };
    const repo = getDataProvider().staff;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(toStore);
    if (!result.ok) return result as DataResult<StaffMember>;
    const n = normalizeStaffMember(result.data as StaffMember);
    return ok({ ...n, status: toLegacyStaffStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaff failed");
  }
}

export async function updateStaff(
  id: EntityId,
  payload: Partial<StaffMember>,
): Promise<DataResult<StaffMember>> {
  try {
    const existing = await getDataProvider().staff.getById(id);
    if (!existing.ok || !existing.data) return fail("Staff não encontrado", "NOT_FOUND");
    const row = normalizeStaffMember({
      ...(existing.data as StaffMember),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const toStore = { ...row, status: toEnglishStaffStatus(row.status) };
    const repo = getDataProvider().staff;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, toStore);
    if (!result.ok) return result as DataResult<StaffMember>;
    const n = normalizeStaffMember(result.data as StaffMember);
    return ok({ ...n, status: toLegacyStaffStatus(n.status) });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaff failed");
  }
}

export async function deleteStaff(id: EntityId): Promise<DataResult<boolean>> {
  try {
    const repo = getDataProvider().staff;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteStaff failed");
  }
}

export async function searchStaff(query: string): Promise<DataResult<StaffMember[]>> {
  const list = await listStaff();
  if (!list.ok) return list;
  const q = statusKey(query);
  if (!q) return list;
  return ok(
    list.data.filter((s) =>
      statusKey(
        [s.full_name, s.staff_code, s.email, s.phone, s.department_name, s.role_title].join(" "),
      ).includes(q),
    ),
  );
}

export async function getStaffByChurch(churchId: EntityId) {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.church_id === churchId));
}
export async function getStaffByDepartment(departmentId: string) {
  const list = await listStaff();
  if (!list.ok) return list;
  const k = statusKey(departmentId);
  return ok(
    list.data.filter(
      (s) =>
        statusKey(s.department_id || "") === k || statusKey(s.department_name || "").includes(k),
    ),
  );
}
export async function getStaffByRole(roleId: string) {
  const list = await listStaff();
  if (!list.ok) return list;
  const k = statusKey(roleId);
  return ok(
    list.data.filter(
      (s) => statusKey(s.role_id || "") === k || statusKey(s.role_title || "").includes(k),
    ),
  );
}
export async function getStaffByStatus(status: string) {
  const list = await listStaff();
  if (!list.ok) return list;
  const target = toEnglishStaffStatus(status);
  return ok(list.data.filter((s) => toEnglishStaffStatus(s.status) === target));
}
export async function getStaffBySupervisor(supervisorId: EntityId) {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(
    list.data.filter(
      (s) => s.supervisor_id === supervisorId || s.supervisor_user_id === supervisorId,
    ),
  );
}
export async function getActiveStaff() {
  return getStaffByStatus("Active");
}
export async function getInactiveStaff() {
  return getStaffByStatus("Inactive");
}
export async function getStaffWithBirthdayToday() {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.days_until_birthday === 0));
}
export async function getUpcomingBirthdays(days = 30) {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(
    list.data
      .filter(
        (s) =>
          s.days_until_birthday != null &&
          s.days_until_birthday > 0 &&
          s.days_until_birthday <= days,
      )
      .sort((a, b) => (a.days_until_birthday ?? 999) - (b.days_until_birthday ?? 999)),
  );
}
export async function getStaffByBirthdayMonth(month: number | string) {
  const list = await listStaff();
  if (!list.ok) return list;
  const m = String(month).padStart(2, "0").slice(-2);
  return ok(list.data.filter((s) => s.birthday_month === m));
}
export async function getStaffWithAssignedEquipment() {
  // Soft-link to inventory data layer when present
  try {
    const root = globalThis as unknown as {
      CEVenueInventory?: { getAssignedInventoryItems?: () => Promise<DataResult<Array<{ assigned_to_user_id?: string; assigned_to_name?: string }>>> };
      CEDataLayer?: { venueInventory?: { getAssignedInventoryItems?: () => Promise<DataResult<Array<{ assigned_to_user_id?: string; assigned_to_name?: string }>>> } };
    };
    const vi = root.CEVenueInventory || root.CEDataLayer?.venueInventory;
    const staff = await listStaff();
    if (!staff.ok) return staff;
    if (vi?.getAssignedInventoryItems) {
      const eq = await vi.getAssignedInventoryItems();
      if (eq.ok && eq.data?.length) {
        const names = new Set(
          eq.data.map((e) => statusKey(e.assigned_to_name || "")).filter(Boolean),
        );
        const ids = new Set(eq.data.map((e) => e.assigned_to_user_id).filter(Boolean));
        return ok(
          staff.data.filter(
            (s) =>
              ids.has(s.user_id || "") ||
              ids.has(s.id) ||
              names.has(statusKey(s.full_name || "")),
          ),
        );
      }
    }
    return ok([]);
  } catch {
    return ok([]);
  }
}
export async function getStaffWithoutDepartment() {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => !s.department_id && !s.department_name));
}
export async function getStaffWithoutRole() {
  const list = await listStaff();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => !s.role_id && !s.role_title));
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export async function listStaffDepartments(): Promise<DataResult<StaffDepartment[]>> {
  try {
    const result = await getDataProvider().staffDepartments.list();
    if (!result.ok) return result as DataResult<StaffDepartment[]>;
    return ok((result.data || []).map((r) => normalizeStaffDepartment(r as StaffDepartment)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaffDepartments failed");
  }
}
export async function getStaffDepartmentById(id: EntityId) {
  try {
    const result = await getDataProvider().staffDepartments.getById(id);
    if (!result.ok) return result as DataResult<StaffDepartment | null>;
    return ok(result.data ? normalizeStaffDepartment(result.data as StaffDepartment) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getStaffDepartmentById failed");
  }
}
export async function createStaffDepartment(payload: Partial<StaffDepartment>) {
  try {
    const row = normalizeStaffDepartment(payload);
    const repo = getDataProvider().staffDepartments;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffDepartment>;
    return ok(normalizeStaffDepartment(result.data as StaffDepartment));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaffDepartment failed");
  }
}
export async function updateStaffDepartment(id: EntityId, payload: Partial<StaffDepartment>) {
  try {
    const existing = await getStaffDepartmentById(id);
    if (!existing.ok || !existing.data) return fail("Departamento não encontrado", "NOT_FOUND");
    const row = normalizeStaffDepartment({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().staffDepartments;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffDepartment>;
    return ok(normalizeStaffDepartment(result.data as StaffDepartment));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaffDepartment failed");
  }
}
export async function deleteStaffDepartment(id: EntityId) {
  try {
    const repo = getDataProvider().staffDepartments;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteStaffDepartment failed");
  }
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export async function listStaffRoles(): Promise<DataResult<StaffRole[]>> {
  try {
    const result = await getDataProvider().staffRoles.list();
    if (!result.ok) return result as DataResult<StaffRole[]>;
    return ok((result.data || []).map((r) => normalizeStaffRole(r as StaffRole)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaffRoles failed");
  }
}
export async function getStaffRoleById(id: EntityId) {
  try {
    const result = await getDataProvider().staffRoles.getById(id);
    if (!result.ok) return result as DataResult<StaffRole | null>;
    return ok(result.data ? normalizeStaffRole(result.data as StaffRole) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getStaffRoleById failed");
  }
}
export async function createStaffRole(payload: Partial<StaffRole>) {
  try {
    const row = normalizeStaffRole(payload);
    const repo = getDataProvider().staffRoles;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffRole>;
    return ok(normalizeStaffRole(result.data as StaffRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaffRole failed");
  }
}
export async function updateStaffRole(id: EntityId, payload: Partial<StaffRole>) {
  try {
    const existing = await getStaffRoleById(id);
    if (!existing.ok || !existing.data) return fail("Cargo não encontrado", "NOT_FOUND");
    const row = normalizeStaffRole({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().staffRoles;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffRole>;
    return ok(normalizeStaffRole(result.data as StaffRole));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaffRole failed");
  }
}
export async function deleteStaffRole(id: EntityId) {
  try {
    const repo = getDataProvider().staffRoles;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteStaffRole failed");
  }
}
export async function getRolesByDepartment(departmentId: EntityId) {
  const list = await listStaffRoles();
  if (!list.ok) return list;
  return ok(list.data.filter((r) => r.department_id === departmentId));
}

// ---------------------------------------------------------------------------
// Salaries (sensitive — filtering is UI/RBAC responsibility)
// ---------------------------------------------------------------------------

export async function listStaffSalaries(): Promise<DataResult<StaffSalary[]>> {
  try {
    const result = await getDataProvider().staffSalaries.list();
    if (!result.ok) return result as DataResult<StaffSalary[]>;
    return ok((result.data || []).map((r) => normalizeStaffSalary(r as StaffSalary)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaffSalaries failed");
  }
}
export async function getStaffSalaryById(id: EntityId) {
  try {
    const result = await getDataProvider().staffSalaries.getById(id);
    if (!result.ok) return result as DataResult<StaffSalary | null>;
    return ok(result.data ? normalizeStaffSalary(result.data as StaffSalary) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getStaffSalaryById failed");
  }
}
export async function getSalaryByStaffId(staffId: EntityId) {
  const list = await listStaffSalaries();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.staff_id === staffId));
}
export async function createStaffSalary(payload: Partial<StaffSalary>) {
  try {
    const row = normalizeStaffSalary(payload);
    const repo = getDataProvider().staffSalaries;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    // Does NOT create finance expense
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffSalary>;
    return ok(normalizeStaffSalary(result.data as StaffSalary));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaffSalary failed");
  }
}
export async function updateStaffSalary(id: EntityId, payload: Partial<StaffSalary>) {
  try {
    const existing = await getStaffSalaryById(id);
    if (!existing.ok || !existing.data) return fail("Salário não encontrado", "NOT_FOUND");
    const row = normalizeStaffSalary({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().staffSalaries;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffSalary>;
    return ok(normalizeStaffSalary(result.data as StaffSalary));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaffSalary failed");
  }
}
export async function deleteStaffSalary(id: EntityId) {
  try {
    const repo = getDataProvider().staffSalaries;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteStaffSalary failed");
  }
}
export async function getSalariesByChurch(churchId: EntityId) {
  const list = await listStaffSalaries();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.church_id === churchId));
}
export async function getSalariesByDepartment(departmentId: EntityId) {
  const list = await listStaffSalaries();
  if (!list.ok) return list;
  return ok(list.data.filter((s) => s.department_id === departmentId));
}
export async function getPendingSalaryReviews() {
  const list = await listStaffSalaries();
  if (!list.ok) return list;
  return ok(
    list.data.filter((s) => {
      const k = statusKey(s.status || s.payment_status);
      return k.includes("pending") || k.includes("pendente");
    }),
  );
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export async function listPerformanceReviews(): Promise<DataResult<StaffPerformanceReview[]>> {
  try {
    const result = await getDataProvider().staffPerformance.list();
    if (!result.ok) return result as DataResult<StaffPerformanceReview[]>;
    return ok(
      (result.data || []).map((r) => normalizePerformanceReview(r as StaffPerformanceReview)),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listPerformanceReviews failed");
  }
}
export async function getPerformanceReviewById(id: EntityId) {
  try {
    const result = await getDataProvider().staffPerformance.getById(id);
    if (!result.ok) return result as DataResult<StaffPerformanceReview | null>;
    return ok(
      result.data ? normalizePerformanceReview(result.data as StaffPerformanceReview) : null,
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getPerformanceReviewById failed");
  }
}
export async function createPerformanceReview(payload: Partial<StaffPerformanceReview>) {
  try {
    const row = normalizePerformanceReview(payload);
    const repo = getDataProvider().staffPerformance;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffPerformanceReview>;
    return ok(normalizePerformanceReview(result.data as StaffPerformanceReview));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createPerformanceReview failed");
  }
}
export async function updatePerformanceReview(
  id: EntityId,
  payload: Partial<StaffPerformanceReview>,
) {
  try {
    const existing = await getPerformanceReviewById(id);
    if (!existing.ok || !existing.data) return fail("Avaliação não encontrada", "NOT_FOUND");
    const row = normalizePerformanceReview({
      ...existing.data,
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().staffPerformance;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffPerformanceReview>;
    return ok(normalizePerformanceReview(result.data as StaffPerformanceReview));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updatePerformanceReview failed");
  }
}
export async function getPerformanceByStaff(staffId: EntityId) {
  const list = await listPerformanceReviews();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.staff_id === staffId));
}
export async function getPerformanceByDepartment(departmentId: EntityId) {
  const list = await listPerformanceReviews();
  if (!list.ok) return list;
  return ok(list.data.filter((p) => p.department_id === departmentId));
}
export async function getPerformanceByPeriod(startDate: string, endDate: string) {
  const list = await listPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => {
      const d = String(p.evaluated_at || p.review_end_date || p.created_at || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}
export async function getPendingPerformanceReviews() {
  const list = await listPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    list.data.filter((p) => {
      const k = statusKey(p.status);
      return (
        !p.evaluated_at ||
        k.includes("draft") ||
        k.includes("submitted") ||
        k.includes("pending") ||
        Number(p.overall_score || 0) === 0
      );
    }),
  );
}
export async function getTopPerformers(_period?: string) {
  const list = await listPerformanceReviews();
  if (!list.ok) return list;
  return ok(
    [...list.data]
      .filter((p) => Number(p.overall_score || 0) > 0)
      .sort((a, b) => Number(b.overall_score || 0) - Number(a.overall_score || 0))
      .slice(0, 10),
  );
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export async function listStaffDocuments(): Promise<DataResult<StaffDocument[]>> {
  try {
    const result = await getDataProvider().staffDocuments.list();
    if (!result.ok) return result as DataResult<StaffDocument[]>;
    return ok((result.data || []).map((r) => normalizeStaffDocument(r as StaffDocument)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaffDocuments failed");
  }
}
export async function getStaffDocumentById(id: EntityId) {
  try {
    const result = await getDataProvider().staffDocuments.getById(id);
    if (!result.ok) return result as DataResult<StaffDocument | null>;
    return ok(result.data ? normalizeStaffDocument(result.data as StaffDocument) : null);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "getStaffDocumentById failed");
  }
}
export async function createStaffDocument(payload: Partial<StaffDocument>) {
  try {
    const row = normalizeStaffDocument(payload);
    const repo = getDataProvider().staffDocuments;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffDocument>;
    return ok(normalizeStaffDocument(result.data as StaffDocument));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaffDocument failed");
  }
}
export async function updateStaffDocument(id: EntityId, payload: Partial<StaffDocument>) {
  try {
    const existing = await getStaffDocumentById(id);
    if (!existing.ok || !existing.data) return fail("Documento não encontrado", "NOT_FOUND");
    const row = normalizeStaffDocument({ ...existing.data, ...payload, id, updated_at: todayIso() });
    const repo = getDataProvider().staffDocuments;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffDocument>;
    return ok(normalizeStaffDocument(result.data as StaffDocument));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaffDocument failed");
  }
}
export async function deleteStaffDocument(id: EntityId) {
  try {
    const repo = getDataProvider().staffDocuments;
    if (!repo.remove) return fail("delete not supported", "NOT_SUPPORTED");
    return (await repo.remove(id)) as DataResult<boolean>;
  } catch (e) {
    return fail(e instanceof Error ? e.message : "deleteStaffDocument failed");
  }
}
export async function getDocumentsByStaff(staffId: EntityId) {
  const list = await listStaffDocuments();
  if (!list.ok) return list;
  return ok(list.data.filter((d) => d.staff_id === staffId));
}
export async function getExpiredDocuments() {
  const list = await listStaffDocuments();
  if (!list.ok) return list;
  const today = todayIso();
  return ok(
    list.data.filter(
      (d) =>
        statusKey(d.status).includes("expired") ||
        (d.expiry_date && String(d.expiry_date).slice(0, 10) < today),
    ),
  );
}
export async function getDocumentsExpiringSoon(days = 30) {
  const list = await listStaffDocuments();
  if (!list.ok) return list;
  const today = todayIso();
  const soon = new Date();
  soon.setDate(soon.getDate() + days);
  const soonStr = soon.toISOString().slice(0, 10);
  return ok(
    list.data.filter((d) => {
      if (!d.expiry_date) return false;
      const exp = String(d.expiry_date).slice(0, 10);
      return exp >= today && exp <= soonStr;
    }),
  );
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export async function listStaffAttendance(): Promise<DataResult<StaffAttendance[]>> {
  try {
    const result = await getDataProvider().staffAttendance.list();
    if (!result.ok) return result as DataResult<StaffAttendance[]>;
    return ok((result.data || []).map((r) => normalizeStaffAttendance(r as StaffAttendance)));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "listStaffAttendance failed");
  }
}
export async function createStaffAttendance(payload: Partial<StaffAttendance>) {
  try {
    const row = normalizeStaffAttendance(payload);
    const repo = getDataProvider().staffAttendance;
    if (!repo.create) return fail("create not supported", "NOT_SUPPORTED");
    const result = await repo.create(row);
    if (!result.ok) return result as DataResult<StaffAttendance>;
    return ok(normalizeStaffAttendance(result.data as StaffAttendance));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "createStaffAttendance failed");
  }
}
export async function updateStaffAttendance(id: EntityId, payload: Partial<StaffAttendance>) {
  try {
    const existing = await getDataProvider().staffAttendance.getById(id);
    if (!existing.ok || !existing.data) return fail("Presença não encontrada", "NOT_FOUND");
    const row = normalizeStaffAttendance({
      ...(existing.data as StaffAttendance),
      ...payload,
      id,
      updated_at: todayIso(),
    });
    const repo = getDataProvider().staffAttendance;
    if (!repo.update) return fail("update not supported", "NOT_SUPPORTED");
    const result = await repo.update(id, row);
    if (!result.ok) return result as DataResult<StaffAttendance>;
    return ok(normalizeStaffAttendance(result.data as StaffAttendance));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "updateStaffAttendance failed");
  }
}
export async function getAttendanceByStaff(staffId: EntityId) {
  const list = await listStaffAttendance();
  if (!list.ok) return list;
  return ok(list.data.filter((a) => a.staff_id === staffId));
}
export async function getAttendanceByDate(date: string) {
  const list = await listStaffAttendance();
  if (!list.ok) return list;
  const d = String(date).slice(0, 10);
  return ok(
    list.data.filter((a) => String(a.attendance_date || a.date || "").slice(0, 10) === d),
  );
}
export async function getAttendanceByPeriod(startDate: string, endDate: string) {
  const list = await listStaffAttendance();
  if (!list.ok) return list;
  return ok(
    list.data.filter((a) => {
      const d = String(a.attendance_date || a.date || "").slice(0, 10);
      return d >= startDate && d <= endDate;
    }),
  );
}

// ---------------------------------------------------------------------------
// Seed + info
// ---------------------------------------------------------------------------

export async function ensureStaffHrSeeded(): Promise<DataResult<boolean>> {
  try {
    const staff = await listStaff();
    if (staff.ok && staff.data.length === 0) {
      for (const s of STAFF_SEED) await createStaff(s);
    }
    const depts = await listStaffDepartments();
    if (depts.ok && depts.data.length === 0) {
      for (const s of STAFF_DEPARTMENTS_SEED) await createStaffDepartment(s);
    }
    const roles = await listStaffRoles();
    if (roles.ok && roles.data.length === 0) {
      for (const s of STAFF_ROLES_SEED) await createStaffRole(s);
    }
    const sals = await listStaffSalaries();
    if (sals.ok && sals.data.length === 0) {
      for (const s of STAFF_SALARIES_SEED) await createStaffSalary(s);
    }
    const perfs = await listPerformanceReviews();
    if (perfs.ok && perfs.data.length === 0) {
      for (const s of STAFF_PERFORMANCE_SEED) await createPerformanceReview(s);
    }
    const docs = await listStaffDocuments();
    if (docs.ok && docs.data.length === 0) {
      for (const s of STAFF_DOCUMENTS_SEED) await createStaffDocument(s);
    }
    const atts = await listStaffAttendance();
    if (atts.ok && atts.data.length === 0) {
      for (const s of STAFF_ATTENDANCE_SEED) await createStaffAttendance(s);
    }
    return ok(true);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "ensureStaffHrSeeded failed");
  }
}

export function getStaffHrDataSourceInfo() {
  const source = getDataSource();
  const provider = getDataProvider();
  return {
    source,
    provider: provider.name,
    ready: provider.isReady(),
    description: provider.description,
    domain: "staffHR",
  };
}

export {
  STAFF_SEED,
  STAFF_DEPARTMENTS_SEED,
  STAFF_ROLES_SEED,
  STAFF_SALARIES_SEED,
  STAFF_PERFORMANCE_SEED,
  STAFF_DOCUMENTS_SEED,
  STAFF_ATTENDANCE_SEED,
};
