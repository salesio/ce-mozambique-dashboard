import { readFileSync, writeFileSync } from "node:fs";

function patch(file, transforms) {
  let p = readFileSync(file, "utf8");
  for (const [from, to] of transforms) {
    if (!p.includes(from)) {
      console.warn("skip missing in", file, from.slice(0, 60));
      continue;
    }
    p = p.replace(from, to);
  }
  writeFileSync(file, p);
  console.log("patched", file);
}

// mock
patch("src/data/adapters/mockProvider.ts", [
  [
    `ServiceChecklist,
  User,
  VenueSpace,
} from "../types/entities";`,
    `ServiceChecklist,
  StaffAttendance,
  StaffDepartment,
  StaffDocument,
  StaffMember,
  StaffPerformanceReview,
  StaffRole,
  StaffSalary,
  User,
  VenueSpace,
} from "../types/entities";`,
  ],
  [
    `import { SERVICE_CHECKLISTS_SEED } from "../seeds/serviceChecklistsSeed";`,
    `import { SERVICE_CHECKLISTS_SEED } from "../seeds/serviceChecklistsSeed";
import { STAFF_SEED } from "../seeds/staffSeed";
import { STAFF_DEPARTMENTS_SEED } from "../seeds/staffDepartmentsSeed";
import { STAFF_ROLES_SEED } from "../seeds/staffRolesSeed";
import { STAFF_SALARIES_SEED } from "../seeds/staffSalariesSeed";
import { STAFF_PERFORMANCE_SEED } from "../seeds/staffPerformanceSeed";
import { STAFF_DOCUMENTS_SEED } from "../seeds/staffDocumentsSeed";
import { STAFF_ATTENDANCE_SEED } from "../seeds/staffAttendanceSeed";`,
  ],
  [
    `const serviceChecklists = createMemoryRepository<ServiceChecklist>(
    SERVICE_CHECKLISTS_SEED.map((r) => ({ ...r })),
  );`,
    `const serviceChecklists = createMemoryRepository<ServiceChecklist>(
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
  );`,
  ],
  [
    `service_checklists: serviceChecklists as EntityRepository<unknown>,
  };`,
    `service_checklists: serviceChecklists as EntityRepository<unknown>,
    staff: staff as EntityRepository<unknown>,
    staff_departments: staffDepartments as EntityRepository<unknown>,
    staff_roles: staffRoles as EntityRepository<unknown>,
    staff_salaries: staffSalaries as EntityRepository<unknown>,
    staff_performance: staffPerformance as EntityRepository<unknown>,
    staff_documents: staffDocuments as EntityRepository<unknown>,
    staff_attendance: staffAttendance as EntityRepository<unknown>,
  };`,
  ],
  [
    `serviceChecklists,
    collection(name)`,
    `serviceChecklists,
    staff,
    staffDepartments,
    staffRoles,
    staffSalaries,
    staffPerformance,
    staffDocuments,
    staffAttendance,
    collection(name)`,
  ],
]);

// local
patch("src/data/adapters/localStorageProvider.ts", [
  [
    `ServiceChecklist,
  User,
  VenueSpace,
} from "../types/entities";`,
    `ServiceChecklist,
  StaffAttendance,
  StaffDepartment,
  StaffDocument,
  StaffMember,
  StaffPerformanceReview,
  StaffRole,
  StaffSalary,
  User,
  VenueSpace,
} from "../types/entities";`,
  ],
  [
    `if (key === "service_checklists") return \`\${STORAGE_PREFIX}service-checklists\`;
  return STORAGE_PREFIX + key;`,
    `if (key === "service_checklists") return \`\${STORAGE_PREFIX}service-checklists\`;
  if (key === "staff") return \`\${STORAGE_PREFIX}staff\`;
  if (key === "staff_departments") return \`\${STORAGE_PREFIX}staff-departments\`;
  if (key === "staff_roles") return \`\${STORAGE_PREFIX}staff-roles\`;
  if (key === "staff_salaries") return \`\${STORAGE_PREFIX}staff-salaries\`;
  if (key === "staff_performance") return \`\${STORAGE_PREFIX}staff-performance\`;
  if (key === "staff_documents") return \`\${STORAGE_PREFIX}staff-documents\`;
  if (key === "staff_attendance") return \`\${STORAGE_PREFIX}staff-attendance\`;
  return STORAGE_PREFIX + key;`,
  ],
  [
    `const serviceChecklists = createPersistedRepository<ServiceChecklist>("service_checklists");`,
    `const serviceChecklists = createPersistedRepository<ServiceChecklist>("service_checklists");
  const staff = createPersistedRepository<StaffMember>("staff");
  const staffDepartments = createPersistedRepository<StaffDepartment>("staff_departments");
  const staffRoles = createPersistedRepository<StaffRole>("staff_roles");
  const staffSalaries = createPersistedRepository<StaffSalary>("staff_salaries");
  const staffPerformance = createPersistedRepository<StaffPerformanceReview>("staff_performance");
  const staffDocuments = createPersistedRepository<StaffDocument>("staff_documents");
  const staffAttendance = createPersistedRepository<StaffAttendance>("staff_attendance");`,
  ],
  [
    `service_checklists: serviceChecklists as EntityRepository<unknown>,
  };`,
    `service_checklists: serviceChecklists as EntityRepository<unknown>,
    staff: staff as EntityRepository<unknown>,
    staff_departments: staffDepartments as EntityRepository<unknown>,
    staff_roles: staffRoles as EntityRepository<unknown>,
    staff_salaries: staffSalaries as EntityRepository<unknown>,
    staff_performance: staffPerformance as EntityRepository<unknown>,
    staff_documents: staffDocuments as EntityRepository<unknown>,
    staff_attendance: staffAttendance as EntityRepository<unknown>,
  };`,
  ],
  [
    `serviceChecklists,
    collection(name)`,
    `serviceChecklists,
    staff,
    staffDepartments,
    staffRoles,
    staffSalaries,
    staffPerformance,
    staffDocuments,
    staffAttendance,
    collection(name)`,
  ],
]);

for (const file of [
  "src/data/adapters/apiProvider.ts",
  "src/data/adapters/supabaseProvider.ts",
]) {
  patch(file, [
    [
      `"service_checklists",
  ];`,
      `"service_checklists",
    "staff",
    "staff_departments",
    "staff_roles",
    "staff_salaries",
    "staff_performance",
    "staff_documents",
    "staff_attendance",
  ];`,
    ],
    [
      `serviceChecklists: map.service_checklists as EntityRepository<never>,
    collection(name)`,
      `serviceChecklists: map.service_checklists as EntityRepository<never>,
    staff: map.staff as EntityRepository<never>,
    staffDepartments: map.staff_departments as EntityRepository<never>,
    staffRoles: map.staff_roles as EntityRepository<never>,
    staffSalaries: map.staff_salaries as EntityRepository<never>,
    staffPerformance: map.staff_performance as EntityRepository<never>,
    staffDocuments: map.staff_documents as EntityRepository<never>,
    staffAttendance: map.staff_attendance as EntityRepository<never>,
    collection(name)`,
    ],
  ]);
}

console.log("all provider patches done");
