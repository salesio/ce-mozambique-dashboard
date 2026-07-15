/**
 * Imports public giving submissions from the shared localStorage queue
 * into dashboard finance records (frontend-first bridge).
 */
(function () {
  const PUBLIC_GIVING_QUEUE_KEY = "ce-public-giving-queue";
  const FINANCE_STATUS_PENDING = "Pendente de Verifica��o";

  function splitPublicFullName(fullName) {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return { nome: "", apelido: "" };
    if (parts.length === 1) return { nome: parts[0], apelido: "" };
    return { nome: parts[0], apelido: parts.slice(1).join(" ") };
  }

  function financeRecordsFromPublicSubmission(submission) {
    const { nome, apelido } = splitPublicFullName(submission.nome_completo);
    const now = submission.created_at || new Date().toISOString();
    const today = now.slice(0, 10);
    const lines = (submission.contribuicoes || []).filter((line) => Number(line.valor) > 0);
    return lines.map((line, index) => ({
      id: `fin-pub-${submission.submission_group_id}-${index + 1}`,
      submission_group_id: submission.submission_group_id,
      public_submission_id: submission.id,
      source: "public_website",
      source_type: "public_website",
      nome,
      apelido,
      telefone: submission.telefone,
      whatsapp: submission.telefone,
      email: submission.email || "",
      endereco: "",
      celula: submission.celula || "",
      grupo_de_celula: submission.grupo_de_celula || "",
      cell_id: submission.cell_id || "",
      cell_name: submission.cell_name || submission.celula || "",
      cell_group_id: submission.cell_group_id || "",
      cell_group_name: submission.cell_group_name || submission.grupo_de_celula || "",
      data_de_aniversario: submission.data_de_aniversario || "",
      church_id: submission.igreja_id,
      igreja: submission.igreja_nome,
      categoria_da_contribuicao: line.categoria,
      outros_descricao: line.categoria === "Outros" ? submission.outros_descricao || "" : "",
      valor: Number(line.valor),
      metodo_de_pagamento: submission.metodo_de_pagamento,
      referencia_da_transaccao: submission.referencia_da_transaccao || "",
      data: submission.data_da_transferencia || today,
      data_da_transferencia: submission.data_da_transferencia || today,
      imagem_envelope_ou_pop: submission.comprovativo_url || "",
      imagem_do_envelope: submission.comprovativo_url || "",
      mensagem_transferencia: submission.mensagem_transferencia || "",
      observacoes: submission.observacoes || "",
      estado: FINANCE_STATUS_PENDING,
      recebido_por: "Sistema / Formulário Público",
      verificado_por: "",
      verified_at: "",
      comentario_verificacao: "",
      motivo_rejeicao: "",
      created_at: now,
      created_by: "Sistema / Formulário Público",
      updated_by: "Sistema / Formulário Público",
      updated_at: today
    }));
  }

  function importPublicGivingQueue(state) {
    if (!state) return { imported: 0, state };
    let imported = 0;
    let queue = [];
    try {
      queue = JSON.parse(localStorage.getItem(PUBLIC_GIVING_QUEUE_KEY) || "[]");
    } catch {
      return { imported: 0, state };
    }
    if (!Array.isArray(queue) || !queue.length) return { imported: 0, state };

    state.publicGivingSubmissions = Array.isArray(state.publicGivingSubmissions) ? state.publicGivingSubmissions : [];
    state.finance = Array.isArray(state.finance) ? state.finance : [];
    const knownGroups = new Set(state.publicGivingSubmissions.map((s) => s.submission_group_id));
    const knownFinanceIds = new Set(state.finance.map((f) => f.id));
    const remaining = [];

    queue.forEach((submission) => {
      if (!submission?.submission_group_id) {
        remaining.push(submission);
        return;
      }
      if (knownGroups.has(submission.submission_group_id) || submission.imported) return;
      state.publicGivingSubmissions.push(submission);
      knownGroups.add(submission.submission_group_id);
      financeRecordsFromPublicSubmission(submission).forEach((record) => {
        if (!knownFinanceIds.has(record.id)) {
          state.finance.push(record);
          knownFinanceIds.add(record.id);
        }
      });
      imported += 1;
    });

    try {
      localStorage.setItem(PUBLIC_GIVING_QUEUE_KEY, JSON.stringify(remaining));
    } catch {}

    return { imported, state };
  }

  function financeSourceKey(record) {
    const migrated = record || {};
    if (migrated.source === "public_website" || migrated.source_type === "public_website") return "public_website";
    if (migrated.source === "imported") return "imported";
    return "dashboard";
  }

  function getSubmissionGroupRecords(state, submissionGroupId) {
    return (state.finance || []).filter((r) => r.submission_group_id === submissionGroupId);
  }

  function getPublicSubmission(state, submissionGroupId) {
    return (state.publicGivingSubmissions || []).find((s) => s.submission_group_id === submissionGroupId);
  }

  window.PUBLIC_GIVING_QUEUE_KEY = PUBLIC_GIVING_QUEUE_KEY;
  window.importPublicGivingQueue = importPublicGivingQueue;
  window.financeRecordsFromPublicSubmission = financeRecordsFromPublicSubmission;
  window.financeSourceKey = financeSourceKey;
  window.getSubmissionGroupRecords = getSubmissionGroupRecords;
  window.getPublicSubmission = getPublicSubmission;
})();
