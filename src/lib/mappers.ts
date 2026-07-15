import type { FinanceRecordRow, PublicGivingPayload, PublicGivingSubmissionRow } from "./types";

const PENDING = "Pendente de Verificação" as const;

export function splitFullName(fullName: string) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { nome: "", apelido: "" };
  if (parts.length === 1) return { nome: parts[0], apelido: "" };
  return { nome: parts[0], apelido: parts.slice(1).join(" ") };
}

export function mapSubmissionToDashboard(submission: PublicGivingSubmissionRow) {
  return {
    id: submission.id,
    submission_group_id: submission.submission_group_id,
    nome_completo: submission.nome_completo,
    data_de_aniversario: submission.data_de_aniversario || "",
    telefone: submission.telefone,
    email: submission.email || "",
    igreja_id: submission.igreja_id,
    igreja_nome: submission.igreja_nome || "",
    cell_group_id: submission.cell_group_id || "",
    cell_group_name: submission.cell_group_name || submission.grupo_de_celula || "",
    cell_id: submission.cell_id || "",
    cell_name: submission.cell_name || submission.celula || "",
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

export function mapFinanceRecordToDashboard(record: FinanceRecordRow) {
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
    cell_id: record.cell_id || "",
    cell_name: record.cell_name || record.celula || "",
    cell_group_id: record.cell_group_id || "",
    cell_group_name: record.cell_group_name || record.grupo_de_celula || "",
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

export function buildFinanceRowsFromSubmission(
  submission: PublicGivingPayload,
  proofPath: string,
  proofPublicUrl: string
): Omit<FinanceRecordRow, "id">[] {
  const { nome, apelido } = splitFullName(submission.nome_completo);
  const now = submission.created_at || new Date().toISOString();
  const today = now.slice(0, 10);
  const lines = (submission.contribuicoes || []).filter((line) => Number(line.valor) > 0);

  return lines.map((line) => ({
    submission_group_id: submission.submission_group_id || null,
    public_submission_id: submission.id || null,
    church_id: submission.igreja_id,
    nome,
    apelido,
    telefone: submission.telefone,
    whatsapp: submission.telefone,
    email: submission.email || null,
    cell_id: submission.cell_id || null,
    cell_name: submission.cell_name || submission.celula || null,
    cell_group_id: submission.cell_group_id || null,
    cell_group_name: submission.cell_group_name || submission.grupo_de_celula || null,
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
    comprovativo_url: proofPublicUrl || null,
    mensagem_transferencia: submission.mensagem_transferencia || null,
    observacoes: submission.observacoes || null,
    estado: PENDING,
    source: "public_website",
    source_type: "public_website",
    recebido_por: "Sistema / Formulário Público",
    verificado_por: null,
    verified_at: null,
    comentario_verificacao: null,
    motivo_rejeicao: null,
    created_at: now,
    created_by: "Sistema / Formulário Público",
    updated_at: today,
    updated_by: "Sistema / Formulário Público"
  }));
}
