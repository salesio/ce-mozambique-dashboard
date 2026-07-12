export {
  getSupabaseClient,
  getSupabaseConfig,
  resetSupabaseClient,
  PAYMENT_PROOFS_BUCKET
} from "./lib/supabaseClient";

export {
  submitPublicGiving,
  fetchFinanceSnapshot,
  updateFinanceRecordStatus,
  updateFinanceGroupStatus,
  uploadPaymentProof,
  signInWithEmail,
  isSupabaseConfigured
} from "./lib/financeRepository";

export { mapFinanceRecordToDashboard, mapSubmissionToDashboard } from "./lib/mappers";