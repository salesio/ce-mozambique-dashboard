/**
 * CE Supabase bundle (IIFE).
 * Source: src/ — rebuild with `npm run build:supabase` when Node.js is available.
 * Uses @supabase/supabase-js loaded from CDN when window.supabase is present.
 */
var CESupabase = (function () {
  "use strict";

  const PENDING = "Pendente de Verificação";
  const BUCKET = "payment-proofs";
  let cachedClient = null;

  function getSupabaseConfig() {
    const runtime = typeof window !== "undefined" ? window.__CE_ENV__ || {} : {};
    const url = String(runtime.VITE_SUPABASE_URL || "").trim();
    const anonKey = String(runtime.VITE_SUPABASE_ANON_KEY || "").trim();
    return { url, anonKey, isConfigured: Boolean(url && anonKey) };
  }

  function getSupabaseClient() {
    const { url, anonKey, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return null;
    if (!window.supabase?.createClient) {
      console.warn("[CE Supabase] Load @supabase/supabase-js before supabase-bundle.js");
      return null;
    }
    if (!cachedClient) cachedClient = window.supabase.createClient(url, anonKey);
    return cachedClient;
  }

  function splitFullName(fullName) {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return { nome: "", apelido: "" };
    if (parts.length === 1) return { nome: parts[0], apelido: "" };
    return { nome: parts[0], apelido: parts.slice(1).join(" ") };
  }

  function mapSubmissionToDashboard(submission) {
    return {
      id: submission.id,
      submission_group_id: submission.submission_group_id,
      nome_completo: submission.nome_completo,
      data_de_aniversario: submission.data_de_aniversario || "",
      telefone: submission.telefone,
      email: submission.email || "",
      igreja_id: submission.igreja_id,
      igreja_nome: submission.igreja_nome || "",
      grupo_de_celula: submission.grupo_de_celula || "",
      celula: submission.celula || "",
      contribuicoes: submission.contribuicoes || [],
      outros_descricao: submission.outros_descricao || "",
      metodo_de_pagamento: submission.metodo_de_pagamento,
      referencia_da_transaccao: submission.referencia_da_transaccao || "",
      data_da_transferencia: submission.data_da_transferencia,
      comprovativo_url: submission.comprovativo_url || submission.comprovativo_path || "",
      mensagem_transferencia: submission.mensagem_transferencia || "",
      observacoes: submission.observacoes || "",
      total_geral: Number(submission.total_geral || 0),
      source: submission.source || "public_website",
      status: submission.status || PENDING,
      created_at: submission.created_at
    };
  }

  function mapFinanceRecordToDashboard(record) {
    return {
      id: record.id,
      submission_group_id: record.submission_group_id || "",
      public_submission_id: record.public_submission_id || "",
      source: record.source || "public_website",
      source_type: record.source_type || record.source || "public_website",
      nome: record.nome || "",
      apelido: record.apelido || "",
      telefone: record.telefone || "",
      whatsapp: record.whatsapp || record.telefone || "",
      email: record.email || "",
      endereco: "",
      celula: record.celula || "",
      grupo_de_celula: record.grupo_de_celula || "",
      data_de_aniversario: record.data_de_aniversario || "",
      church_id: record.church_id,
      igreja: "",
      categoria_da_contribuicao: record.categoria_da_contribuicao,
      outros_descricao: record.outros_descricao || "",
      valor: Number(record.valor || 0),
      metodo_de_pagamento: record.metodo_de_pagamento,
      referencia_da_transaccao: record.referencia_da_transaccao || "",
      data: record.data,
      data_da_transferencia: record.data_da_transferencia || record.data,
      imagem_envelope_ou_pop: record.comprovativo_url || record.comprovativo_path || "",
      imagem_do_envelope: record.comprovativo_url || record.comprovativo_path || "",
      mensagem_transferencia: record.mensagem_transferencia || "",
      observacoes: record.observacoes || "",
      estado: record.estado || PENDING,
      recebido_por: record.recebido_por || "Sistema / Formulário Público",
      verificado_por: record.verificado_por || "",
      verified_at: record.verified_at || "",
      comentario_verificacao: record.comentario_verificacao || "",
      motivo_rejeicao: record.motivo_rejeicao || "",
      created_at: record.created_at,
      created_by: record.created_by || "Sistema / Formulário Público",
      updated_by: record.updated_by || "",
      updated_at: record.updated_at || ""
    };
  }

  async function uploadPaymentProof(file, submissionGroupId) {
    const client = getSupabaseClient();
    if (!client || !file) return null;
    const safeName = String(file.name || "proof").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${submissionGroupId}/${Date.now()}-${safeName}`;
    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined
    });
    if (error) throw new Error(error.message);
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  }

  function buildFinanceRows(submission, proofPath, proofUrl) {
    const { nome, apelido } = splitFullName(submission.nome_completo);
    const now = submission.created_at || new Date().toISOString();
    const today = now.slice(0, 10);
    return (submission.contribuicoes || [])
      .filter((line) => Number(line.valor) > 0)
      .map((line) => ({
        submission_group_id: submission.submission_group_id,
        public_submission_id: submission.id,
        church_id: submission.igreja_id,
        nome,
        apelido,
        telefone: submission.telefone,
        whatsapp: submission.telefone,
        email: submission.email || null,
        celula: submission.celula || null,
        grupo_de_celula: submission.grupo_de_celula || null,
        data_de_aniversario: submission.data_de_aniversario || null,
        categoria_da_contribuicao: line.categoria,
        outros_descricao: line.categoria === "Outros" ? submission.outros_descricao || null : null,
        valor: Number(line.valor),
        metodo_de_pagamento: submission.metodo_de_pagamento,
        referencia_da_transaccao: submission.referencia_da_transaccao || null,
        data: submission.data_da_transferencia || today,
        data_da_transferencia: submission.data_da_transferencia || today,
        comprovativo_path: proofPath || null,
        comprovativo_url: proofUrl || null,
        mensagem_transferencia: submission.mensagem_transferencia || null,
        observacoes: submission.observacoes || null,
        estado: PENDING,
        source: "public_website",
        source_type: "public_website",
        recebido_por: "Sistema / Formulário Público",
        created_at: now,
        created_by: "Sistema / Formulário Público",
        updated_at: today,
        updated_by: "Sistema / Formulário Público"
      }));
  }

  async function submitPublicGiving(submission, proofFile) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase is not configured");

    const groupId = submission.submission_group_id || `sg-${Date.now()}`;
    const submissionId = submission.id || crypto.randomUUID();
    const now = submission.created_at || new Date().toISOString();

    let proofPath = submission.comprovativo_path || "";
    let proofPublicUrl = submission.comprovativo_url || "";
    if (proofFile) {
      const uploaded = await uploadPaymentProof(proofFile, groupId);
      if (uploaded) {
        proofPath = uploaded.path;
        proofPublicUrl = uploaded.publicUrl;
      }
    }

    const submissionRow = {
      id: submissionId,
      submission_group_id: groupId,
      nome_completo: submission.nome_completo,
      data_de_aniversario: submission.data_de_aniversario || null,
      telefone: submission.telefone,
      email: submission.email || null,
      igreja_id: submission.igreja_id,
      igreja_nome: submission.igreja_nome || null,
      grupo_de_celula: submission.grupo_de_celula || null,
      celula: submission.celula || null,
      contribuicoes: submission.contribuicoes,
      outros_descricao: submission.outros_descricao || null,
      metodo_de_pagamento: submission.metodo_de_pagamento,
      referencia_da_transaccao: submission.referencia_da_transaccao || null,
      data_da_transferencia: submission.data_da_transferencia,
      comprovativo_path: proofPath || null,
      comprovativo_url: proofPublicUrl || null,
      mensagem_transferencia: submission.mensagem_transferencia || null,
      observacoes: submission.observacoes || null,
      total_geral: Number(submission.total_geral || 0),
      source: "public_website",
      status: PENDING,
      created_at: now
    };

    const financeRows = buildFinanceRows(
      { ...submission, id: submissionId, submission_group_id: groupId, created_at: now },
      proofPath,
      proofPublicUrl
    );

    const { error: submissionError } = await client.from("public_giving_submissions").insert(submissionRow);
    if (submissionError) throw new Error(submissionError.message);

    const { data: insertedFinance, error: financeError } = await client.from("finance_records").insert(financeRows).select("*");
    if (financeError) throw new Error(financeError.message);

    return {
      submission: mapSubmissionToDashboard(submissionRow),
      financeRecords: (insertedFinance || []).map(mapFinanceRecordToDashboard)
    };
  }

  async function fetchFinanceSnapshot(churchIds) {
    const client = getSupabaseClient();
    if (!client) return null;

    let financeQuery = client.from("finance_records").select("*").order("created_at", { ascending: false });
    let submissionQuery = client.from("public_giving_submissions").select("*").order("created_at", { ascending: false });
    if (churchIds?.length) {
      financeQuery = financeQuery.in("church_id", churchIds);
      submissionQuery = submissionQuery.in("igreja_id", churchIds);
    }

    const [{ data: finance, error: financeError }, { data: submissions, error: submissionError }] = await Promise.all([
      financeQuery,
      submissionQuery
    ]);
    if (financeError) throw new Error(financeError.message);
    if (submissionError) throw new Error(submissionError.message);

    return {
      finance: (finance || []).map(mapFinanceRecordToDashboard),
      publicGivingSubmissions: (submissions || []).map(mapSubmissionToDashboard)
    };
  }

  async function updateFinanceRecordStatus(recordId, patch) {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from("finance_records").update({
      estado: patch.estado,
      verificado_por: patch.verificado_por,
      verified_at: patch.verified_at,
      comentario_verificacao: patch.comentario_verificacao || null,
      motivo_rejeicao: patch.motivo_rejeicao || null,
      updated_by: patch.updated_by,
      updated_at: patch.updated_at
    }).eq("id", recordId);
    if (error) throw new Error(error.message);
    return true;
  }

  async function updateFinanceGroupStatus(submissionGroupId, patch) {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error: financeError } = await client.from("finance_records").update({
      estado: patch.estado,
      verificado_por: patch.verificado_por,
      verified_at: patch.verified_at,
      comentario_verificacao: patch.comentario_verificacao || null,
      motivo_rejeicao: patch.motivo_rejeicao || null,
      updated_by: patch.updated_by,
      updated_at: patch.updated_at
    }).eq("submission_group_id", submissionGroupId);
    if (financeError) throw new Error(financeError.message);

    const { error: submissionError } = await client.from("public_giving_submissions").update({
      status: patch.submissionStatus,
      updated_at: patch.updated_at
    }).eq("submission_group_id", submissionGroupId);
    if (submissionError) throw new Error(submissionError.message);
    return true;
  }

  async function signInWithEmail(email, password) {
    const client = getSupabaseClient();
    if (!client) return { error: "Supabase is not configured" };
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { data };
  }

  return {
    getSupabaseConfig,
    getSupabaseClient,
    isSupabaseConfigured: () => getSupabaseConfig().isConfigured,
    submitPublicGiving,
    fetchFinanceSnapshot,
    updateFinanceRecordStatus,
    updateFinanceGroupStatus,
    uploadPaymentProof,
    signInWithEmail,
    mapFinanceRecordToDashboard,
    mapSubmissionToDashboard,
    PAYMENT_PROOFS_BUCKET: BUCKET
  };
})();

window.CESupabase = CESupabase;