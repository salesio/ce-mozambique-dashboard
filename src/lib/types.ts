export type FinanceStatus = "Pendente de Verificação" | "Verificado" | "Rejeitado" | "Incluído no Relatório";

export type AppRole =
  | "national_admin"
  | "finance_head"
  | "finance_officer"
  | "church_pastor"
  | "viewer";

export interface ChurchRow {
  id: string;
  church_name: string;
  public_name: string | null;
  province: string | null;
  city: string | null;
  type: string | null;
  is_active: boolean;
}

export interface ContributionLine {
  categoria: string;
  valor: number;
}

export interface PublicGivingSubmissionRow {
  id: string;
  submission_group_id: string;
  nome_completo: string;
  data_de_aniversario: string | null;
  telefone: string;
  email: string | null;
  igreja_id: string;
  igreja_nome: string | null;
  cell_group_id: string | null;
  cell_group_name: string | null;
  cell_id: string | null;
  cell_name: string | null;
  grupo_de_celula: string | null;
  celula: string | null;
  contribuicoes: ContributionLine[];
  outros_descricao: string | null;
  metodo_de_pagamento: string;
  referencia_da_transaccao: string | null;
  data_da_transferencia: string;
  comprovativo_path: string | null;
  comprovativo_url: string | null;
  mensagem_transferencia: string | null;
  observacoes: string | null;
  total_geral: number;
  source: string;
  status: FinanceStatus;
  created_at: string;
}

export interface FinanceRecordRow {
  id: string;
  submission_group_id: string | null;
  public_submission_id: string | null;
  church_id: string;
  nome: string | null;
  apelido: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  celula: string | null;
  cell_id: string | null;
  cell_name: string | null;
  cell_group_id: string | null;
  cell_group_name: string | null;
  grupo_de_celula: string | null;
  data_de_aniversario: string | null;
  categoria_da_contribuicao: string;
  outros_descricao: string | null;
  valor: number;
  metodo_de_pagamento: string;
  referencia_da_transaccao: string | null;
  data: string;
  data_da_transferencia: string;
  comprovativo_path: string | null;
  comprovativo_url: string | null;
  mensagem_transferencia: string | null;
  observacoes: string | null;
  estado: FinanceStatus;
  source: string;
  source_type: string;
  recebido_por: string | null;
  verificado_por: string | null;
  verified_at: string | null;
  comentario_verificacao: string | null;
  motivo_rejeicao: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export interface PublicGivingPayload {
  id?: string;
  submission_group_id?: string;
  nome_completo: string;
  data_de_aniversario?: string;
  telefone: string;
  email?: string;
  igreja_id: string;
  igreja_nome?: string;
  cell_group_id?: string;
  cell_group_name?: string;
  cell_id?: string;
  cell_name?: string;
  grupo_de_celula?: string;
  celula?: string;
  contribuicoes: ContributionLine[];
  outros_descricao?: string;
  metodo_de_pagamento: string;
  referencia_da_transaccao?: string;
  data_da_transferencia: string;
  comprovativo_path?: string;
  comprovativo_url?: string;
  mensagem_transferencia?: string;
  observacoes?: string;
  total_geral: number;
  source?: string;
  status?: FinanceStatus;
  created_at?: string;
}

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  church_id: string | null;
}

export interface UserRoleRow {
  user_id: string;
  role: AppRole;
  church_id: string | null;
}
