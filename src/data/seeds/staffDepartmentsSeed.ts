import type { StaffDepartment } from "../types/entities";

const HQ = "church-hq";
const HQ_NAME = "E.C. Maputo Central - Sede";

export const STAFF_DEPARTMENTS_SEED: StaffDepartment[] = [
  { id: "dept-admin", name: "Administração", description: "Administração geral", church_id: HQ, church_name: HQ_NAME, head_staff_name: "Admin Principal", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-finance", name: "Finanças", description: "Finanças e contabilidade", church_id: HQ, church_name: HQ_NAME, head_staff_name: "Finance Head Demo", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-cell", name: "Células & Liderança", description: "Ministério de Células", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-1", head_staff_name: "Flavia Moneedi Tivane", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-foundation", name: "Escola de Fundação", description: "Escola de Fundação", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-fevo", name: "F.E.V.O", description: "Follow-up, Evangelism, Visitation, Outreach", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-media", name: "Mídia", description: "Media e transmissão", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-3", head_staff_name: "Marcelo Moises Panguene", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-venue", name: "Espaços & Inventário", description: "Venue Management e inventário", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-3", head_staff_name: "Marcelo Moises Panguene", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-requisitions", name: "Requisições", description: "Gestão de requisições e aprovações", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-7", head_staff_name: "Pastora Responsável Requisições", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-prison", name: "Prison Ministry", description: "Ministério Prisional", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-6", head_staff_name: "Janet Baptista Ngoca", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-materials", name: "Ministry Materials", description: "Materiais ministeriais", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-6", head_staff_name: "Janet Baptista Ngoca", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-partnerships", name: "Parcerias", description: "Parcerias e partners", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-counseling", name: "Aconselhamento", description: "Ministério de aconselhamento", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-sacraments", name: "Sacramentos", description: "Baptismos, casamentos, dedications", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-programs", name: "Programas", description: "Programas e eventos", church_id: HQ, church_name: HQ_NAME, head_staff_id: "staff-6", head_staff_name: "Janet Baptista Ngoca", status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
  { id: "dept-hr", name: "Recursos Humanos", description: "Staff & RH", church_id: HQ, church_name: HQ_NAME, status: "Active", created_at: "2024-01-01", updated_at: "2026-07-10" },
];
