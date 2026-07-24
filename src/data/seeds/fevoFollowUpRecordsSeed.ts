import type { FevoFollowUpRecord } from "../types/entities";

export const FEVO_FOLLOW_UP_RECORDS_SEED: FevoFollowUpRecord[] = [
  {
    id: "fevo-fu-1",
    report_id: "fevo-rpt-2",
    activity_id: "fevo-act-2",
    souls_contacted: 21,
    feedback_count: 14,
    successful_contacts: 14,
    no_answer_count: 7,
    followup_result: "Encouraged",
    next_action: "Call Again",
    referred_to_follow_up_department: true,
    created_follow_up_ids: [],
    notes: "8 confirmaram presença no culto; adicionar WhatsApp.",
    created_at: "2026-05-31",
    updated_at: "2026-05-31",
  },
  {
    id: "fevo-fu-2",
    report_id: "fevo-rpt-2",
    souls_contacted: 5,
    feedback_count: 3,
    successful_contacts: 3,
    no_answer_count: 2,
    followup_result: "Needs Visit",
    next_action: "Visit",
    referred_to_follow_up_department: false,
    notes: "Contactos secundários da mesma semana.",
    created_at: "2026-05-31",
    updated_at: "2026-05-31",
  },
];
