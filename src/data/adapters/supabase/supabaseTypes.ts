/**
 * Base types for Supabase adapter foundation (Phase 1).
 * Full generated DB types can replace these later (supabase gen types).
 */

export type SupabaseTableName =
  | "churches"
  | "users"
  | "roles"
  | "permissions"
  | "staff_members"
  | "members"
  | "first_timers"
  | "follow_ups"
  | "follow_up_timeline_events"
  | "finance_records"
  | "public_giving_submissions"
  | "finance_disbursements"
  | "documents"
  | "notifications"
  | "audit_logs"
  | "system_settings";

export type SupabaseRow = Record<string, unknown> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
};

export type SupabaseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export type SupabaseProviderStatus =
  | "disabled"
  | "missing_env"
  | "ready"
  | "error";

export interface SupabaseConnectionInfo {
  status: SupabaseProviderStatus;
  enabled: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  urlHost?: string;
  /** Never expose key material */
  usingServiceRole: false;
  message: string;
}
