import { getSupabaseClient, getSupabaseConfig, PAYMENT_PROOFS_BUCKET } from "./supabaseClient";
import {
  buildFinanceRowsFromSubmission,
  mapFinanceRecordToDashboard,
  mapSubmissionToDashboard
} from "./mappers";
import type { FinanceRecordRow, PublicGivingPayload } from "./types";

const PENDING = "Pendente de Verificação";

function sanitizeFileName(name: string) {
  return String(name || "proof").replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadPaymentProof(
  file: File,
  submissionGroupId: string
): Promise<{ path: string; publicUrl: string } | null> {
  const client = getSupabaseClient();
  if (!client || !file) return null;

  const path = `${submissionGroupId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await client.storage.from(PAYMENT_PROOFS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined
  });
  if (error) throw new Error(error.message);

  const { data } = client.storage.from(PAYMENT_PROOFS_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function submitPublicGiving(
  submission: PublicGivingPayload,
  proofFile?: File | null
): Promise<{ submission: ReturnType<typeof mapSubmissionToDashboard>; financeRecords: ReturnType<typeof mapFinanceRecordToDashboard>[] }> {
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

  const financeRows = buildFinanceRowsFromSubmission(
    { ...submission, id: submissionId, submission_group_id: groupId, created_at: now },
    proofPath,
    proofPublicUrl
  );

  const { error: submissionError } = await client.from("public_giving_submissions").insert(submissionRow);
  if (submissionError) throw new Error(submissionError.message);

  const { data: insertedFinance, error: financeError } = await client
    .from("finance_records")
    .insert(financeRows)
    .select("*");
  if (financeError) throw new Error(financeError.message);

  return {
    submission: mapSubmissionToDashboard(submissionRow as never),
    financeRecords: (insertedFinance as FinanceRecordRow[]).map(mapFinanceRecordToDashboard)
  };
}

export async function fetchFinanceSnapshot(churchIds?: string[]) {
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
    finance: (finance as FinanceRecordRow[]).map(mapFinanceRecordToDashboard),
    publicGivingSubmissions: (submissions || []).map(mapSubmissionToDashboard)
  };
}

export async function updateFinanceRecordStatus(
  recordId: string,
  patch: {
    estado: string;
    verificado_por: string;
    verified_at: string;
    comentario_verificacao?: string;
    motivo_rejeicao?: string;
    updated_by: string;
    updated_at: string;
  }
) {
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

export async function updateFinanceGroupStatus(
  submissionGroupId: string,
  patch: {
    estado: string;
    verificado_por: string;
    verified_at: string;
    comentario_verificacao?: string;
    motivo_rejeicao?: string;
    updated_by: string;
    updated_at: string;
    submissionStatus: string;
  }
) {
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

export async function signInWithEmail(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) return { error: "Supabase is not configured" };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().isConfigured;
}