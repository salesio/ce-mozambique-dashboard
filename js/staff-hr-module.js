/**
 * Staff & Recursos Humanos — helpers (frontend-first).
 */
(function () {
  "use strict";

  const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Volunt�rio", "Contratado", "Presta��o de Servi�o"];
  const PAYMENT_FREQUENCIES = ["Mensal", "Semanal", "Por Serviço", "Nenhum"];
  const PAYMENT_METHODS = ["M-Pesa", "E-Mola", "Banco", "Dinheiro"];
  const STAFF_STATUSES = ["Activo", "Inactivo", "Suspenso", "Transferido"];
  const MARITAL_STATUSES = ["Solteiro/a", "Casado/a", "Viúvo/a", "Divorciado/a", "Por Confirmar"];
  const ATTENDANCE_STATUSES = ["Presente", "Ausente", "Atrasado", "Justificado", "Licença"];
  const PAYMENT_STATUSES = ["Pendente", "Aprovado", "Pago", "Retido"];
  const DOCUMENT_TYPES = ["BI", "Contrato", "Carta", "Certificado", "Outro"];

  const BIRTHDAY_VIEW_ROLES = ["Super Admin", "Main Pastor", "HR Manager", "Department Head", "Church Pastor"];
  const SENSITIVE_STAFF_ROLES = ["Super Admin", "Main Pastor", "HR Manager", "Finance Head"];

  function accessApi() {
    return window.CEAccessControl || null;
  }

  function resolveAccess(user) {
    const lib = accessApi();
    return lib?.resolveModuleAccess?.(user, "staffHr") || { can_view: false };
  }

  function canViewSalary(user) {
    const lib = accessApi();
    return lib?.canViewSalary?.(user) || false;
  }

  function canViewSensitiveStaffData(user) {
    if ((user?.department_permissions || []).includes("*")) return true;
    if (SENSITIVE_STAFF_ROLES.includes(user?.role)) return true;
    const access = resolveAccess(user);
    return Boolean(access.can_view_salary);
  }

  function canViewBirthday(user, staff, access) {
    if (!user || !staff) return false;
    if (BIRTHDAY_VIEW_ROLES.includes(user.role)) return true;
    const scoped = access || resolveAccess(user);
    const scope = scoped.scope || "own";
    if (scope === "all") return true;
    if (scope === "church" && staff.church_id === user.church_id) return true;
    if (scope === "department") {
      const dept = user.assigned_department || "";
      return staff.department_name === dept || staff.church_id === user.church_id;
    }
    return staff.user_id === user.id || staff.email === user.email;
  }

  function scopeFilterStaff(list, user, access) {
    if (!Array.isArray(list)) return [];
    const scope = access.scope || "own";
    if (scope === "all") return list;
    if (scope === "church") return list.filter((s) => s.church_id === user.church_id);
    if (scope === "department") {
      const dept = user.assigned_department || "";
      return list.filter((s) => s.department_name === dept || s.church_id === user.church_id);
    }
    return list.filter((s) => s.user_id === user.id || s.email === user.email || s.full_name === user.assigned_staff_name);
  }

  function parseDateOnly(value) {
    if (!value || typeof value !== "string") return null;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  }

  function calculateAge(dateOfBirth, refDate = new Date()) {
    const parsed = parseDateOnly(dateOfBirth);
    if (!parsed) return null;
    let age = refDate.getFullYear() - parsed.year;
    const month = refDate.getMonth() + 1;
    const day = refDate.getDate();
    if (month < parsed.month || (month === parsed.month && day < parsed.day)) age -= 1;
    return age >= 0 ? age : null;
  }

  function getNextBirthday(dateOfBirth, refDate = new Date()) {
    const parsed = parseDateOnly(dateOfBirth);
    if (!parsed) return null;
    const year = refDate.getFullYear();
    let next = new Date(year, parsed.month - 1, parsed.day);
    if (next < new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate())) {
      next = new Date(year + 1, parsed.month - 1, parsed.day);
    }
    return next.toISOString().slice(0, 10);
  }

  function daysUntilBirthday(dateOfBirth, refDate = new Date()) {
    const next = getNextBirthday(dateOfBirth, refDate);
    if (!next) return null;
    const today = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
    const target = new Date(next);
    return Math.round((target - today) / 86400000);
  }

  function enrichStaffProfile(record = {}) {
    const dob = record.date_of_birth || record.data_de_aniversario || "";
    const parsed = parseDateOnly(dob);
    return {
      ...record,
      date_of_birth: dob,
      birthday_month: parsed ? String(parsed.month).padStart(2, "0") : record.birthday_month || "",
      birthday_day: parsed ? String(parsed.day).padStart(2, "0") : record.birthday_day || "",
      age: calculateAge(dob),
      next_birthday: getNextBirthday(dob),
      days_until_birthday: daysUntilBirthday(dob)
    };
  }

  function enrichStaffList(list) {
    return (list || []).map((item) => enrichStaffProfile(item));
  }

  function hasDateOfBirth(staff) {
    return Boolean(parseDateOnly(staff?.date_of_birth || staff?.data_de_aniversario || ""));
  }

  function birthdaysThisMonth(list, refDate = new Date()) {
    const month = String(refDate.getMonth() + 1).padStart(2, "0");
    return enrichStaffList(list).filter((s) => hasDateOfBirth(s) && s.birthday_month === month);
  }

  function birthdaysToday(list, refDate = new Date()) {
    return enrichStaffList(list).filter((s) => hasDateOfBirth(s) && s.days_until_birthday === 0);
  }

  function pastBirthdaysThisMonth(list, refDate = new Date()) {
    const month = String(refDate.getMonth() + 1).padStart(2, "0");
    const day = refDate.getDate();
    return enrichStaffList(list).filter((s) => {
      if (!hasDateOfBirth(s) || s.birthday_month !== month) return false;
      return Number(s.birthday_day) < day;
    });
  }

  function upcomingBirthdays(list, limit = 10, withinDays = 60, refDate = new Date()) {
    return enrichStaffList(list)
      .filter((s) => hasDateOfBirth(s) && s.days_until_birthday !== null && s.days_until_birthday > 0 && s.days_until_birthday <= withinDays)
      .sort((a, b) => (a.days_until_birthday ?? 999) - (b.days_until_birthday ?? 999))
      .slice(0, limit);
  }

  function sortByUpcomingBirthday(list) {
    return [...list].sort((a, b) => {
      const daysA = a.days_until_birthday ?? 999;
      const daysB = b.days_until_birthday ?? 999;
      if (daysA !== daysB) return daysA - daysB;
      if (a.birthday_month !== b.birthday_month) return a.birthday_month.localeCompare(b.birthday_month);
      return a.birthday_day.localeCompare(b.birthday_day);
    });
  }

  function birthdaysInMonth(list, monthKey) {
    if (!monthKey) return enrichStaffList(list).filter((s) => s.date_of_birth);
    const month = String(monthKey).padStart(2, "0").slice(-2);
    return enrichStaffList(list).filter((s) => s.birthday_month === month);
  }

  function filterBirthdayList(list, filters = {}, refDate = new Date()) {
    let rows = enrichStaffList(list).filter((s) => hasDateOfBirth(s));
    const search = String(filters.search || "").trim().toLowerCase();
    if (search) {
      rows = rows.filter((s) => String(s.full_name || "").toLowerCase().includes(search));
    }
    if (filters.month) rows = rows.filter((s) => s.birthday_month === String(filters.month).padStart(2, "0").slice(-2));
    if (filters.churchId) rows = rows.filter((s) => s.church_id === filters.churchId);
    if (filters.department) rows = rows.filter((s) => s.department_name === filters.department);
    if (filters.status) rows = rows.filter((s) => s.status === filters.status);
    return sortByUpcomingBirthday(rows);
  }

  function getBirthdaySections(list, filters = {}, refDate = new Date()) {
    const rows = filterBirthdayList(list, filters, refDate);
    const month = String(refDate.getMonth() + 1).padStart(2, "0");
    const day = refDate.getDate();
    return {
      all: rows,
      today: rows.filter((s) => s.days_until_birthday === 0),
      upcoming: rows.filter((s) => s.days_until_birthday > 0),
      thisMonth: rows.filter((s) => s.birthday_month === month),
      pastThisMonth: rows.filter((s) => s.birthday_month === month && Number(s.birthday_day) < day)
    };
  }

  function formatBirthdayDayMonth(dateOfBirth, lang = "pt") {
    const parsed = parseDateOnly(dateOfBirth);
    if (!parsed) return "-";
    const locale = lang === "en" ? "en-US" : "pt-PT";
    const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2026, parsed.month - 1, 1));
    return `${String(parsed.day).padStart(2, "0")} ${month}`;
  }

  function formatBirthdayDisplay(dateOfBirth, lang = "pt") {
    const parsed = parseDateOnly(dateOfBirth);
    if (!parsed) return "-";
    const date = new Date(parsed.year, parsed.month - 1, parsed.day);
    const locale = lang === "en" ? "en-US" : "pt-PT";
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long" }).format(date);
  }

  function maskSalary(value, user) {
    if (canViewSalary(user)) return value;
    return "•••••";
  }

  function maskSensitive(value, user) {
    if (canViewSensitiveStaffData(user)) return value;
    return "•••••";
  }

  function getStaffEquipment(staff, venueInventory) {
    const equipment = venueInventory?.staffEquipment || [];
    const name = String(staff?.full_name || "").trim().toLowerCase();
    return equipment.filter((eq) => String(eq.nome_do_funcionario || "").trim().toLowerCase() === name);
  }

  function computeStats(list, salaries, performance, equipment, refDate = new Date()) {
    const enriched = enrichStaffList(list);
    const active = enriched.filter((s) => s.status === "Activo").length;
    const volunteers = enriched.filter((s) => s.employment_type === "Voluntário").length;
    const withPay = enriched.filter((s) => Number(s.salary_or_allowance || 0) > 0).length;
    const pendingEval = (performance || []).filter((p) => !p.evaluated_at).length;
    const pendingPay = (salaries || []).filter((s) => s.payment_status === "Pendente").length;
    const assignedEq = (equipment || []).filter((e) => e.status === "Activo").length;
    const withDob = enriched.filter((s) => hasDateOfBirth(s));
    const monthBirthdays = birthdaysThisMonth(withDob, refDate);
    const todayBirthdays = birthdaysToday(withDob, refDate);
    const upcoming = upcomingBirthdays(withDob, 100, 365, refDate);
    return {
      total: enriched.length,
      active,
      volunteers,
      withPay,
      pendingEval,
      pendingPay,
      assignedEq,
      birthdays: monthBirthdays.length,
      birthdaysToday: todayBirthdays.length,
      upcomingBirthdays: upcoming.length,
      activeStaffBirthdays: withDob.filter((s) => s.status === "Activo").length
    };
  }

  function filterSalaries(salaries, staffList, user) {
    const access = resolveAccess(user);
    const scopedStaff = scopeFilterStaff(staffList, user, access);
    const ids = new Set(scopedStaff.map((s) => s.id));
    return (salaries || []).filter((s) => ids.has(s.staff_id));
  }

  function staffProfileSections(canSalary = false) {
    return [
      {
        key: "personal",
        titleKey: "staffSectionPersonal",
        fields: [
          ["full_name", "staffFullName"],
          ["title", "treatment", "select", ["Sr.", "Sra.", "Irm�o", "Irm�", "Pastor", "Pastora", "Di�cono", "Diaconisa"]],
          ["gender", "gender", "select", ["Feminino", "Masculino"]],
          ["date_of_birth", "dateOfBirth", "date"],
          ["phone", "phone"],
          ["whatsapp", "whatsapp"],
          ["email", "email", "email"],
          ["address", "address", "textarea-optional"],
          ["marital_status", "maritalStatus", "select", MARITAL_STATUSES]
        ]
      },
      {
        key: "ministerial",
        titleKey: "staffSectionMinisterial",
        fields: [
          ["church_id", "church", "church"],
          ["department_name", "reqDepartment"],
          ["role_title", "staffRoleTitle"],
          ["supervisor_name", "staffSupervisor"],
          ["start_date", "staffStartDate", "date"],
          ["employment_type", "staffEmploymentType", "select", EMPLOYMENT_TYPES],
          ["status", "status", "select", STAFF_STATUSES],
          ["contract_start_date", "contractStartDate", "date"],
          ["contract_end_date", "contractEndDate", "date"],
          ["probation_end_date", "probationEndDate", "date"]
        ]
      },
      {
        key: "payment",
        titleKey: "staffSectionPayment",
        fields: [
          ["salary_or_allowance", "staffSalary", "number"],
          ["payment_frequency", "staffPaymentFreq", "select", PAYMENT_FREQUENCIES],
          ["payment_method", "method", "select", PAYMENT_METHODS],
          ["bank_name", "bankName"],
          ["bank_account_number", "bankAccountNumber"],
          ["mobile_money_number", "mobileMoneyNumber"],
          ["bank_or_mobile_details", "bankOrMobileDetails", "textarea-optional"]
        ],
        sensitive: true
      },
      {
        key: "documents",
        titleKey: "staffSectionDocuments",
        fields: [
          ["national_id_number", "nationalIdNumber"],
          ["nuit", "taxNumber"],
          ["emergency_contact_name", "emergencyContactName"],
          ["emergency_contact_phone", "emergencyContactPhone"],
          ["profile_photo", "profilePhoto", "file-optional"],
          ["notes", "notes", "textarea"]
        ],
        sensitive: true
      }
    ].map((section) => ({
      ...section,
      fields: section.sensitive && !canSalary
        ? section.fields.map((field) => {
            const name = field[0];
            if (["salary_or_allowance", "bank_name", "bank_account_number", "mobile_money_number", "bank_or_mobile_details", "national_id_number", "nuit"].includes(name)) {
              return [name, field[1], "readonly"];
            }
            return field;
          })
        : section.fields
    }));
  }

  window.CEStaffHr = {
    EMPLOYMENT_TYPES,
    PAYMENT_FREQUENCIES,
    PAYMENT_METHODS,
    STAFF_STATUSES,
    MARITAL_STATUSES,
    ATTENDANCE_STATUSES,
    PAYMENT_STATUSES,
    DOCUMENT_TYPES,
    resolveAccess,
    canViewSalary,
    canViewSensitiveStaffData,
    canViewBirthday,
    scopeFilterStaff,
    getStaffEquipment,
    hasDateOfBirth,
    birthdaysThisMonth,
    birthdaysToday,
    pastBirthdaysThisMonth,
    upcomingBirthdays,
    birthdaysInMonth,
    filterBirthdayList,
    getBirthdaySections,
    sortByUpcomingBirthday,
    formatBirthdayDayMonth,
    enrichStaffProfile,
    enrichStaffList,
    calculateAge,
    getNextBirthday,
    daysUntilBirthday,
    formatBirthdayDisplay,
    computeStats,
    maskSalary,
    maskSensitive,
    filterSalaries,
    staffProfileSections
  };
})();