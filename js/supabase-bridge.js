/**
 * Dashboard bridge: Supabase finance sync with localStorage fallback.
 * Requires js/supabase-bundle.js (built via npm run build:supabase) or CDN is not used here.
 */
(function () {
  const FINANCE_STATUS_PENDING = "Pendente de Verificação";
  const FINANCE_STATUS_VERIFIED = "Verificado";
  const FINANCE_STATUS_REJECTED = "Rejeitado";

  function api() {
    return window.CESupabase || null;
  }

  function isEnabled() {
    const lib = api();
    return Boolean(lib?.isSupabaseConfigured?.());
  }

  function mergeUniqueById(existing, incoming, idKey = "id") {
    const map = new Map((existing || []).map((item) => [item[idKey], item]));
    (incoming || []).forEach((item) => {
      if (item?.[idKey]) map.set(item[idKey], { ...map.get(item[idKey]), ...item });
    });
    return [...map.values()];
  }

  function mergeUniqueByGroup(existing, incoming) {
    const map = new Map((existing || []).map((item) => [item.submission_group_id, item]));
    (incoming || []).forEach((item) => {
      if (item?.submission_group_id) map.set(item.submission_group_id, item);
    });
    return [...map.values()];
  }

  async function syncFinanceIntoState(state, churchIds) {
    const lib = api();
    if (!lib?.fetchFinanceSnapshot) return { synced: false, state };

    try {
      const snapshot = await lib.fetchFinanceSnapshot(churchIds);
      if (!snapshot) return { synced: false, state };

      const next = { ...state };
      next.finance = mergeUniqueById(next.finance, snapshot.finance);
      next.publicGivingSubmissions = mergeUniqueByGroup(next.publicGivingSubmissions, snapshot.publicGivingSubmissions);
      return { synced: true, state: next };
    } catch (error) {
      console.warn("[CE Supabase] Finance sync failed — using local mock data.", error);
      return { synced: false, state, error };
    }
  }

  async function persistRecordDecision(record, patch) {
    const lib = api();
    if (!lib?.updateFinanceRecordStatus || !isEnabled()) return false;
    try {
      return await lib.updateFinanceRecordStatus(record.id, patch);
    } catch (error) {
      console.warn("[CE Supabase] Failed to persist finance record decision.", error);
      return false;
    }
  }

  async function persistGroupDecision(submissionGroupId, mode, data, actorName) {
    const lib = api();
    if (!lib?.updateFinanceGroupStatus || !isEnabled()) return false;

    const nowIso = new Date().toISOString();
    const today = nowIso.slice(0, 10);
    const patch = {
      verificado_por: actorName,
      verified_at: nowIso,
      updated_by: actorName,
      updated_at: today,
      comentario_verificacao: data.comentario_verificacao || "",
      motivo_rejeicao: data.motivo_rejeicao || "",
      estado: mode === "verifyGroup" ? FINANCE_STATUS_VERIFIED : FINANCE_STATUS_REJECTED,
      submissionStatus: mode === "verifyGroup" ? FINANCE_STATUS_VERIFIED : FINANCE_STATUS_REJECTED
    };

    try {
      return await lib.updateFinanceGroupStatus(submissionGroupId, patch);
    } catch (error) {
      console.warn("[CE Supabase] Failed to persist group decision.", error);
      return false;
    }
  }

  async function trySupabaseLogin(email, password) {
    const lib = api();
    if (!lib?.signInWithEmail || !isEnabled()) return { ok: false, skipped: true };
    const result = await lib.signInWithEmail(email, password);
    if (result.error) return { ok: false, error: result.error };
    return { ok: true, session: result.data?.session || null };
  }

  window.CESupabaseBridge = {
    isEnabled,
    syncFinanceIntoState,
    persistRecordDecision,
    persistGroupDecision,
    trySupabaseLogin
  };
})();