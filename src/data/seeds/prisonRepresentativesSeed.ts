import type { PrisonRepresentative } from "../types/entities";

export const PRISON_REPRESENTATIVES_SEED: PrisonRepresentative[] = [
  {
    id: "prep-1",
    prison_id: "prison-1",
    prison_name: "Cadeia Civil de Maputo",
    full_name: "Sr. Mateus Cumbe",
    phone: "+258 84 000 1001",
    whatsapp: "+258 84 000 1001",
    role: "Prison Officer",
    preferred_contact_method: "WhatsApp",
    status: "Active",
    notes: "Contacto principal para entrada da equipa.",
    created_at: "2026-06-22",
    updated_at: "2026-07-05",
  },
  {
    id: "prep-2",
    prison_id: "prison-2",
    prison_name: "Centro de Reclusão Feminino",
    full_name: "Dra. Celeste Mabunda",
    phone: "+258 84 000 1002",
    role: "Coordinator",
    preferred_contact_method: "Phone",
    status: "Active",
    notes: "Facilita Fundação e materiais.",
    created_at: "2026-06-22",
    updated_at: "2026-07-05",
  },
];
