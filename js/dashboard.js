const STORAGE_KEY = "ce-ops-dashboard-v3";
const LANG_KEY = "ce-dashboard-lang";
const SIDEBAR_GROUPS_KEY = "ce-dashboard-sidebar-groups";
const SIDEBAR_COLLAPSED_KEY = "ce-dashboard-sidebar-collapsed";
const MODULE_NAV_KEY = "ce-dashboard-module-nav";

/**
 * Frontend-first state model.
 * These collections are intentionally shaped like future backend tables.
 * Every operational record includes church_id; users include role/access scope.
 */

const TEXT = {
  pt: {
    loginTitle: "Portal da Equipa",
    loginLead: "Acesso interno para acompanhamento espiritual, igrejas, células, escola, finanças e administração.",
    loginPassword: "Senha",
    loginSubmit: "Entrar no Painel",
    loginNote: "Protótipo frontend-first. Autenticação real e base de dados entram na próxima fase.",
    viewSite: "Ver Site",
    logout: "Sair",
    add: "Adicionar",
    edit: "Editar",
    view: "Ver",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Apagar",
    update: "Actualizar",
    export: "Exportar",
    actions: "Acções",
    status: "Estado",
    search: "Pesquisar",
    from: "De",
    to: "Até",
    all: "Todos",
    yes: "Sim",
    no: "Não",
    church: "Igreja",
    name: "Nome",
    surname: "Apelido",
    phone: "Telefone",
    whatsapp: "WhatsApp",
    email: "E-mail",
    address: "Endereço",
    date: "Data",
    notes: "Notas",
    category: "Categoria",
    method: "Método",
    amount: "Valor",
    contributor: "Contribuinte",
    service: "Culto",
    bornAgain: "Nasceu de Novo",
    foundation: "Fundação",
    counselor: "Conselheiro",
    cellInterest: "Interesse em Célula",
    practical: "Prática",
    student: "Aluno",
    classes: "Aulas",
    exam: "Exame",
    progress: "Progresso",
    filterChurch: "Filtrar por Igreja",
    filterMonth: "Filtrar por Mês",
    filterCell: "Filtrar por Célula",
    filterStatus: "Filtrar por Estado",
    empty: "Ainda não existem registos para este módulo.",
    main: "MAIN",
    departments: "DEPARTAMENTOS",
    admin: "ADMIN",
    dashboard: "Painel",
    churches: "Igrejas",
    members: "Membros",
    firstTimers: "Primeira Vez",
    followUp: "Seguimento",
    reports: "Relatórios",
    counseling: "Aconselhamento",
    foundationSchool: "Escola de Fundação",
    finance: "Finanças",
    cellMinistry: "Ministério de Células",
    sacraments: "Sacramentos",
    programs: "Programas",
    partnership: "Parceria",
    media: "Media / Loveworld SAT",
    usersRoles: "Utilizadores e Funções",
    accessControl: "Controlo de Acesso",
    settings: "Definições",
    auditLogs: "Registos de Auditoria",
    requisitions: "Requisições & Aprovações",
    requisitionsSubtitle: "Fluxo de requisições departamentais — revisão, aprovação pastoral e liberação de recursos.",
    staffHr: "Staff & Recursos Humanos",
    staffHrSubtitle: "Registo de equipa, funções, salários, desempenho, presenças e equipamentos atribuídos.",
    reqTabOverview: "Visão Geral",
    reqTabNew: "Nova Requisição",
    reqTabReceived: "Requisições Recebidas",
    reqTabReview: "Em Aprovação Pastoral",
    reqTabPastoral: "Aguardando Pastor Principal",
    reqTabApproved: "Aprovadas",
    reqTabRejected: "Rejeitadas",
    reqTabReleased: "Recursos Liberados",
    reqTabHistory: "Histórico",
    reqPending: "Requisições Pendentes",
    reqInReview: "Em Revisão",
    reqAwaitingPastor: "Aguardando Pastor Principal",
    reqApprovedMonth: "Aprovadas Este Mês",
    reqRejected: "Rejeitadas",
    reqReleased: "Recursos Liberados",
    reqApprovedValue: "Valor Total Aprovado",
    reqPendingValue: "Valor Pendente",
    reqNumber: "Nº Requisição",
    reqType: "Tipo",
    reqTitle: "Título",
    reqDepartment: "Departamento",
    reqUrgency: "Urgência",
    reqNeededBy: "Necessário até",
    reqEstimated: "Valor Estimado",
    reqSubmit: "Submeter",
    reqReview: "Rever",
    reqForwardPastor: "Enviar ao Pastor Principal",
    reqApprove: "Aprovar",
    reqReject: "Rejeitar",
    reqReleaseResources: "Liberar Recursos",
    reqMarkPurchased: "Marcar como Comprado",
    reqRegisterInventory: "Registar no Inventário",
    reqClose: "Fechar",
    reqJustification: "Justificação",
    reqDescription: "Descrição",
    reqSupplier: "Fornecedor",
    reqQuotation: "Nº Cotação",
    reqReturnForCorrection: "Devolver para Correção",
    reqPastoralComment: "Comentário Pastoral",
    reqRejectionReason: "Motivo da Rejeição",
    reqApprovedAmount: "Valor Aprovado",
    reqApprovedAwaitingRelease: "Aprovado — Aguardando Liberação de Recursos",
    reqResourcesReleased: "Recursos Liberados",
    reqHistory: "Histórico da Requisição",
    reqDetails: "Detalhes da Requisição",
    reqSectionData: "Dados da Requisição",
    reqSectionDescription: "Descrição e Justificativa",
    reqSectionInternalReview: "Revisão Interna",
    reqSectionAttachments: "Anexos",
    reqSectionPastoralDecision: "Decisão Pastoral",
    reqRequester: "Solicitante",
    reqCurrentStatus: "Estado Actual",
    reqReviewedBy: "Revisto por",
    reqReviewDate: "Data da revisão",
    reqReviewNotes: "Notas da revisão",
    reqSentToPastorBy: "Enviado ao Pastor Principal por",
    reqSentToPastorAt: "Data de envio",
    reqFinalPriority: "Prioridade Final",
    reqObservations: "Observações",
    reqBudget: "Orçamento",
    reqProforma: "Factura proforma",
    reqNoAttachments: "Sem anexos",
    reqApproveSuccess: "Requisição aprovada e enviada para Finanças para liberação de recursos.",
    reqRejectSuccess: "Requisição rejeitada.",
    reqReturnSuccess: "Requisição devolvida para correção.",
    reqRejectionRequired: "Indique o motivo da rejeição.",
    reqReturnNotesRequired: "Indique o que deve ser corrigido.",
    reqTimelineCreated: "criada por",
    reqTimelineSubmitted: "Submetida em",
    reqTimelineReviewed: "Revista por",
    reqTimelineSentPastor: "Enviada ao Pastor Principal",
    reqTimelineApproved: "Aprovada por",
    reqTimelineRejected: "Rejeitada por",
    reqTimelineReturned: "Devolvida por",
    reqTimelineResourcesReleased: "Recursos liberados por",
    reqTimelineClosed: "Fechada por",
    reqSentToPastor: "Enviado ao Pastor Principal",
    reqReturnedForCorrection: "Devolvido para Correção",
    reqPurchasedExecuted: "Comprado / Executado",
    reqRegisteredInventory: "Registado no Inventário",
    finAwaitingRelease: "Aguardando Liberação",
    finResourcesReleased: "Recursos Liberados",
    finApprovedAmount: "Valor Aprovado",
    finReleasedAmount: "Valor Liberado",
    finPartialPayment: "Pagamento Parcial",
    finMarkPaid: "Marcar como Pago",
    finPendingInFinance: "Pendente em Finanças",
    finSentToFinance: "Enviado para Finanças",
    finResourceDisbursement: "Saída de Recursos",
    finPaymentProof: "Comprovativo de Pagamento",
    finApprovedRequisitions: "Requisições Aprovadas",
    finReleasedThisMonth: "Recursos Liberados Este Mês",
    finTotalReleasedMonth: "Total Liberado Este Mês",
    finPendingPayments: "Pagamentos Pendentes",
    finPartiallyPaid: "Requisições Parcialmente Pagas",
    finFinanceStatus: "Estado Financeiro",
    finReleaseDate: "Data de Liberação",
    finAmountToRelease: "Valor a Liberar",
    finPaymentReference: "Referência de Pagamento",
    finApprovedBy: "Aprovado por",
    finApprovedAt: "Data de aprovação",
    finApprovedReqHint: "Requisições aprovadas pelo Pastor Principal — liberação de recursos e pagamentos.",
    finReleaseDrawerTitle: "Liberar Recursos",
    finExceedsApproved: "O valor a liberar não pode exceder o valor aprovado.",
    finPaymentMethodRequired: "Seleccione o método de pagamento.",
    finReleaseDateRequired: "Indique a data de liberação.",
    finReleaseSuccess: "Recursos liberados com sucesso.",
    finMarkPaidSuccess: "Requisição marcada como paga.",
    finSentToInventory: "Enviar para Inventário",
    finSentToInventorySuccess: "Rascunho criado no Inventário.",
    reqSendToInventory: "Enviar para Inventário",
    reqTabReports: "Relatórios de Requisições",
    reqReportsTitle: "Relatórios de Requisições",
    reqReportsHint: "Análise do workflow e dos valores aprovados vs liberados.",
    reqReportWorkflow: "Workflow das Requisições",
    reqPendingAmount: "Valor Pendente",
    reqApprovedVsReleased: "Aprovado vs Liberado",
    reqReportByDepartment: "Relatório por Departamento",
    reqReportByChurch: "Relatório por Igreja",
    reqReportByRequester: "Relatório por Solicitante",
    reqReportByType: "Requisições por Tipo",
    reqReportMonthly: "Evolução Mensal",
    reqAvgPerRequisition: "Média por Requisição",
    reqRemainingPending: "Valor Ainda Pendente",
    reqExportPdf: "Exportar PDF",
    reqExportExcel: "Exportar Excel",
    reqPrintReport: "Imprimir Relatório",
    reqViewRelease: "Ver Liberação",
    reqRequisitionStatus: "Estado da Requisição",
    reqReleasedBy: "Liberado por",
    reqHighestRequisition: "Maior Requisição",
    reqLastApproved: "Última Aprovação",
    reqPredominantStatus: "Estado Predominante",
    reqCompleted: "Concluídas",
    staffTabOverview: "Visão Geral",
    staffTabStaff: "Staff",
    staffTabDepartments: "Departamentos",
    staffTabRoles: "Funções",
    staffTabSalaries: "Salários & Subsídios",
    staffTabPerformance: "Desempenho",
    staffTabAttendance: "Presenças",
    staffTabEquipment: "Equipamentos Atribuídos",
    staffTabDocuments: "Documentos",
    staffTabReports: "Relatórios",
    staffTabBirthdays: "Aniversários",
    dateOfBirth: "Data de Nascimento",
    staffUpcomingBirthdays: "Próximos Aniversários",
    staffBirthdaysToday: "Aniversariantes de Hoje",
    staffPastBirthdaysThisMonth: "Aniversários Já Passados Este Mês",
    staffActiveBirthdays: "Aniversários Staff Activo",
    staffMissingDateOfBirth: "Data de Nascimento em Falta",
    staffBirthdayDayMonth: "Dia / Mês",
    staffClickToView: "Clique para ver",
    clickToView: "Clique para ver",
    appliedFilter: "Filtro aplicado",
    clearFilters: "Limpar filtros",
    noResultsFound: "Nenhum resultado encontrado",
    staffAge: "Idade",
    staffDaysUntilBirthday: "Dias até ao Aniversário",
    staffBirthdayLabel: "Aniversário",
    staffFilterBirthdayMonth: "Mês de Aniversário",
    staffSendMessage: "Enviar Mensagem",
    staffSectionPersonal: "Dados Pessoais",
    staffSectionMinisterial: "Dados Ministeriais / Profissionais",
    staffSectionPayment: "Pagamento / Subsídio",
    staffSectionDocuments: "Documentos & Observações",
    maritalStatus: "Estado Civil",
    emergencyContactName: "Nome do Contacto de Emergência",
    emergencyContactPhone: "Telefone do Contacto de Emergência",
    nationalIdNumber: "Nº do BI / Documento",
    taxNumber: "NUIT",
    profilePhoto: "Foto de Perfil",
    bankName: "Banco",
    bankAccountNumber: "Nº da Conta",
    mobileMoneyNumber: "Número M-Pesa / E-Mola",
    contractStartDate: "Data de Início do Contrato",
    contractEndDate: "Data de Fim do Contrato",
    probationEndDate: "Fim do Período Experimental",
    bankOrMobileDetails: "Dados Bancários ou Mobile",
    staffTotal: "Total de Staff",
    staffActive: "Staff Activo",
    staffVolunteers: "Voluntários",
    staffWithSalary: "Staff com Salário/Subsídio",
    staffPendingEval: "Avaliações Pendentes",
    staffPendingPay: "Pagamentos Pendentes",
    staffAssignedEq: "Equipamentos Atribuídos",
    staffBirthdays: "Aniversariantes do Mês",
    staffFullName: "Nome Completo",
    staffRoleTitle: "Função",
    staffEmploymentType: "Tipo de Vínculo",
    staffStartDate: "Data de Início",
    staffSalary: "Salário/Subsídio",
    staffPaymentFreq: "Frequência de Pagamento",
    staffSupervisor: "Supervisor",
    staffRegisterSalary: "Registar Salário/Subsídio",
    staffEvaluate: "Avaliar Desempenho",
    staffRegisterAttendance: "Registar Presença",
    staffViewEquipment: "Ver Equipamentos",
    staffPrivacyBanner: "Informação salarial restrita. Apenas perfis autorizados podem ver valores.",
    staffSalaryHidden: "Valor confidencial",
    accessDeniedTitle: "Acesso Restrito",
    accessDeniedText: "Não tem permissão para aceder a esta área. Contacte o administrador se precisar de acesso.",
    accessDeniedBack: "Voltar ao Painel",
    navLockedTooltip: "Sem permissão para aceder a este módulo",
    accessMatrixModule: "Módulo",
    accessMatrixView: "Ver",
    accessMatrixCreate: "Criar",
    accessMatrixEdit: "Editar",
    accessMatrixApprove: "Aprovar",
    accessMatrixScope: "Âmbito",
    heroTitle: "Uma plataforma viva para cuidar da igreja, das almas e da visão.",
    heroText: "Operações da Christ Embassy Mozambique com acompanhamento pastoral, crescimento celular, escola, finanças, sacramentos e relatórios por igreja.",
    pendingFollowups: "Seguimentos Pendentes",
    totalFirstTimers: "Total de Primeira Vez",
    newConverts: "Novos Convertidos",
    foundationEnrolments: "Inscrições na Escola de Fundação",
    graduations: "Graduações",
    activeCells: "Células Activas",
    baptisms: "Baptismos",
    monthlyGiving: "Contribuições Mensais",
    churchesReporting: "Igrejas com Relatório Este Mês",
    firstTimersByMonth: "Primeira Vez por Mês",
    givingByCategory: "Contribuições por Categoria",
    givingByChurch: "Contribuições por Igreja",
    sacramentsSummary: "Resumo de Sacramentos",
    foundationProgress: "Progresso da Escola de Fundação",
    cellGrowth: "Crescimento de Células",
    visitorsCaptured: "Visitantes registados",
    bornAgainHint: "Nasceram de novo",
    thisCycle: "Neste ciclo",
    thisMonth: "Este mês",
    needsAction: "Precisa de acção",
    activeNetwork: "Rede activa",
    registerFirstTimer: "Registar Primeira Vez",
    dashboardOverview: "Visão Geral Operacional",
    dashboardChurchGrowth: "Crescimento da Igreja",
    dashboardChurchGrowthHint: "Primeira vez, convertidos e escola de fundação.",
    dashboardPendingSection: "Seguimentos Pendentes",
    dashboardPendingHint: "Visitantes que precisam de contacto ou próximo passo.",
    dashboardFinanceSection: "Finanças do Mês",
    dashboardFinanceHint: "Contribuições por categoria e por igreja.",
    dashboardCellsSection: "Células & Liderança",
    dashboardCellsHint: "Presença, crescimento e rede celular activa.",
    dashboardRecentSection: "Actividade Recente",
    dashboardRecentHint: "Últimas acções e sacramentos registados.",
    viewAll: "Ver Tudo",
    financeOverviewSection: "Resumo Financeiro",
    financeOverviewHint: "Totais do dia, do mês e estado de verificação.",
    financeAnalyticsSection: "Análise de Contribuições",
    financeAnalyticsHint: "Distribuição por categoria, igreja e método de pagamento.",
    financeRecordsSection: "Registos de Contribuições",
    financeRecordsHint: "Pesquisa, filtros e acções sobre cada contribuição.",
    cellAlecSection: "Formação ALEC",
    cellAlecHint: "Inscrições, progresso e certificação de líderes.",
    cellNetworkSection: "Rede Celular",
    cellNetworkHint: "Grupos, células activas e indicadores da rede.",
    cellGrowthSection: "Crescimento e Desempenho",
    cellGrowthHint: "Presença, primeira vez, convertidos e ofertas.",
    cellDataSection: "Dados Operacionais",
    cellDataHint: "Tabelas, relatórios e acções do módulo.",
    fevoOverviewSection: "Panorama F.E.V.O",
    fevoOverviewHint: "Métricas consolidadas de evangelismo, visitação e oração.",
    fevoAnalyticsSection: "Análise por Equipa",
    fevoAnalyticsHint: "Actividades, contactos e grupos sem relatório.",
    fevoDataSection: "Registos da Semana",
    fevoDataHint: "Configurações, relatórios e follow-up por equipa.",
    firstTimerSubtitle: "Visitantes captados nos cultos e no acompanhamento.",
    followupSubtitle: "Fluxo claro para acompanhar cada visitante até integração.",
    membersSubtitle: "Base de membros por igreja, célula, departamento e estado.",
    foundationSubtitle: "Inscrições pendentes, 7 aulas, notas, exame, prática e certificados.",
    financeSubtitle: "Envelope digital para dízimos, ofertas, parcerias e projectos.",
    churchesSubtitle: "Hierarquia de Sede Nacional, províncias, igrejas e igrejas virtuais.",
    sacramentsSubtitle: "Baptismos, casamentos e dedicação de bebés.",
    reportsSubtitle: "Relatórios visuais com base nos dados actuais.",
    totalToday: "Total Hoje",
    totalThisMonth: "Total Este Mês",
    pendingVerification: "Pendente de Verificação",
    verified: "Verificado",
    byCategory: "Por Categoria",
    byChurch: "Por Igreja",
    byPaymentMethod: "Por Método de Pagamento",
    pendingEnrolments: "Inscrições Pendentes",
    enrolledStudents: "Alunos Inscritos",
    classesAttendance: "Aulas e Presenças",
    exams: "Exames",
    graduation: "Graduação",
    certificates: "Certificados",
    enrolStudent: "Inscrever Aluno",
    markClass: "Marcar Aula",
    launchScore: "Lançar Nota",
    updateStatus: "Actualizar Estado",
    graduate: "Graduar",
    viewProfile: "Ver Perfil",
    moveChurch: "Mover Igreja",
    updateFollowup: "Actualizar Seguimento",
    exportReceipt: "Exportar Recibo/Relatório",
    verify: "Verificar",
    reject: "Rejeitar",
    addFinance: "Adicionar Finanças",
    financeDetails: "Detalhes da Contribuição",
    verifyFinance: "Verificar Contribuição",
    rejectFinance: "Rejeitar Contribuição",
    verifiedBy: "Verificado Por",
    verificationComment: "Comentário de Verificação",
    rejectionReason: "Motivo da Rejeição",
    verifiedAt: "Data de Verificação",
    transactionReference: "Referência da Transacção",
    envelopeImage: "Imagem do Envelope / POP",
    optional: "Opcional",
    createdAt: "Criado Em",
    rejectionReasonRequired: "Indique o motivo da rejeição.",
    searchMemberContributor: "Pesquisar membro / contribuinte",
    searchMemberContributorPlaceholder: "Digite nome, apelido ou telefone...",
    linkedToProfile: "Ligado ao perfil existente",
    registerNewContributor: "Registar novo contribuinte",
    saveAsNewContributor: "Guardar como novo contribuinte",
    possibleDuplicateFound: "Possível duplicado encontrado",
    selectThisProfile: "Seleccionar este perfil",
    noSearchResults: "Nenhum resultado encontrado",
    contributorSection: "Contribuinte",
    contributionSection: "Contribuição",
    sourceMember: "Membro",
    sourceFirstTimer: "Primeira Vez",
    sourceContributor: "Contribuinte",
    sourcePartner: "Parceiro",
    sourceType: "Origem",
    sourcePublicWebsite: "Site Público",
    sourceDashboard: "Dashboard",
    sourceImported: "Importado",
    financeTabOverview: "Visão Geral",
    financeTabEntries: "Lançamentos",
    financeTabPublic: "Submissões Públicas",
    financeTabVerification: "Verificação",
    financeTabApprovedReq: "Requisições Aprovadas",
    financeTabReports: "Relatórios",
    financeTabPartners: "Parceiros em Destaque",
    financeTabExports: "Exportações",
    financeTabAll: "Todos os Registos",
    financeReportsSection: "Relatórios Financeiros",
    financeReportsHint: "Análise detalhada por período, categoria, braço de parceria e contribuinte.",
    financeTotalReceived: "Total Recebido",
    financeTotalVerified: "Total Verificado",
    financeTotalPending: "Total Pendente",
    financeTotalRejected: "Total Rejeitado",
    financeContributionCount: "Nº de Contribuições",
    financeUniqueContributors: "Contribuintes Únicos",
    financeAverageContribution: "Média por Contribuição",
    financeReportByCategory: "Relatório por Categoria",
    financeReportByPartnershipArm: "Relatório por Braço de Parceria",
    financeReportByIndividual: "Relatório por Indivíduo",
    financeReportTithe: "Dízimo",
    financeReportOfferings: "Ofertas",
    financeReportPartnerships: "Parcerias",
    financeReportFirstfruits: "Primícias",
    financeReportSeed: "Semente de Fé",
    financeReportOther: "Outros",
    financeChartBar: "Barras",
    financeChartDonut: "Circular",
    financePartnersPerArm: "Parceiros por Braço",
    financeActivePartners: "Parceiros Activos",
    financeGrowthVsPrev: "Crescimento vs mês anterior",
    financeFeaturedPartners: "Parceiros em Destaque",
    financeExportCsv: "Exportar CSV",
    financeExportJson: "Exportar JSON",
    financeExportHint: "Exportar os dados filtrados do período seleccionado.",
    financeVerificationQueue: "Fila de Verificação",
    financeVerificationHint: "Contribuições pendentes de verificação pela equipa de Finanças.",
    financePeriodToday: "Hoje",
    financePeriodWeek: "Esta Semana",
    financePeriodMonth: "Este Mês",
    financePeriodQuarter: "Este Trimestre",
    financePeriodYear: "Este Ano",
    financePeriodCustom: "Intervalo Personalizado",
    financeAllChurches: "Todas as Igrejas",
    financeAllCategories: "Todas as Categorias",
    financeAllTypes: "Todos os Tipos",
    financeAllArms: "Todos os Braços",
    financeAllMethods: "Todos os Métodos",
    financeAllStatuses: "Todos os Estados",
    financeAllSources: "Todas as Origens",
    financeContributorSearch: "Contribuinte / telefone",
    financeContributionType: "Tipo de Contribuição",
    financePartnershipArm: "Braço de Parceria",
    financeSelectContributor: "Seleccionar contribuinte",
    financeNoChartData: "Sem dados para o período seleccionado.",
    financeReportByChurch: "Relatório por Igreja",
    financeMonthlyEvolution: "Evolução Mensal",
    financeTopPartners: "Top Parceiros",
    financeChartLine: "Linha",
    financeTotalPeriod: "Total no Período",
    financeCategoriesContributed: "Categorias em que Contribuiu",
    financeContributionHistory: "Histórico de Contribuições",
    financeLastContribution: "Última Contribuição",
    financeFrequency: "Frequência",
    financeContributionState: "Estado das Contribuições",
    financeProof: "Comprovativo",
    financeChurchRanking: "Ranking de Igrejas",
    financeChurchTotal: "Total por Igreja",
    financeChurchVerified: "Total Verificado",
    financeChurchPending: "Total Pendente",
    financeChurchTopCategories: "Categorias Principais",
    financeTopPartnerGeneral: "Top Parceiro Geral",
    financeTopPartnerRhapsody: "Maior Parceiro de Rapsódia",
    financeTopPartnerHealing: "Maior Parceiro de Escola de Cura",
    financeTopPartnerLwsat: "Maior Parceiro de Loveworld SAT",
    financeConsistentPartners: "Parceiros Consistentes",
    financeNewPartnersMonth: "Novos Parceiros Este Mês",
    financeSegmentAll: "Todos",
    financeSegmentTop: "Top Gerais",
    financeSegmentConsistent: "Consistentes",
    financeSegmentNew: "Novos",
    financeSegmentInactive: "Pararam de Contribuir",
    financeSegmentFollowup: "Pendentes de Follow-up",
    financeViewFinancialProfile: "Ver Perfil Financeiro",
    financeViewHistory: "Ver Histórico",
    financeContactFollowup: "Contactar / Follow-up",
    financeExportPartner: "Exportar",
    financeExportPdf: "Exportar PDF",
    financeExportExcel: "Exportar Excel",
    financePrintReport: "Imprimir Relatório",
    financeExportGeneral: "Relatório Geral",
    financeExportByCategory: "Relatório por Categoria",
    financeExportByArm: "Relatório por Braço",
    financeExportByChurch: "Relatório por Igreja",
    financeExportByIndividual: "Relatório por Indivíduo",
    financeExportFeaturedPartners: "Parceiros em Destaque",
    financeMinValue: "Valor mínimo",
    financeAllFrequencies: "Todas as Frequências",
    financeFrequencyConsistent: "Consistente",
    financeFrequencyRegular: "Regular",
    financeFrequencyOccasional: "Ocasional",
    financePrivacyNotice: "Dados financeiros sensíveis — visibilidade conforme o seu perfil de acesso.",
    financeAggregatedOnly: "Apenas totais agregados disponíveis para o seu perfil.",
    financeAccessOfficer: "Finance Officer",
    financeAccessHead: "Finance Head",
    financeAccessPastor: "Church Pastor",
    financeAccessAdmin: "National Admin",
    financeAccessViewer: "Viewer",
    viewSubmission: "Ver Submissão",
    viewProof: "Ver Comprovativo",
    publicSubmission: "Submissão Pública",
    submissionGroup: "Grupo de Submissão",
    transferMessage: "Mensagem da Transferência",
    transferDate: "Data da Transferência",
    cellGroup: "Grupo de Célula",
    otherDescription: "Outras Doações",
    grandTotal: "Total Geral",
    contributionLines: "Linhas de Contribuição",
    manual: "Manual",
    followupTimeline: "Linha de Seguimento",
    contactDate: "Data do Contacto",
    contactMethod: "Método",
    result: "Resultado",
    nextStep: "Próximo Passo",
    nextContactDate: "Próxima Data de Contacto",
    updatedBy: "Actualizado Por",
    treatment: "Tratamento",
    gender: "Género",
    birthDate: "Data de Nascimento",
    preferredCell: "Célula Preferida",
    responsibleCounselor: "Conselheiro Responsável",
    followupState: "Estado do Seguimento",
    entryDate: "Data de Entrada",
    origin: "Origem",
    cell: "Célula",
    department: "Departamento",
    "Invited by": "Convidado Por",
    Province: "Província",
    City: "Cidade",
    Type: "Tipo",
    Pastor: "Pastor",
    Leader: "Líder",
    "Cell growth": "Crescimento de Células",
    Role: "Função",
    Departments: "Departamentos",
    Age: "Idade",
    Local: "Local",
    Paid: "Pago",
    Documents: "Documentos",
    Groom: "Noivo",
    Bride: "Noiva",
    Father: "Pai",
    Mother: "Mãe",
    Passed: "Aprovado",
    "Transaction reference": "Referência da Transacção",
    "Received by": "Recebido Por",
    "Verified by": "Verificado Por",
    "Envelope image": "Imagem do Envelope",
    "Souls won": "Almas Ganhas",
    Split: "Divisão",
    "church.operations": "Operações da Igreja",
    Scope: "Âmbito",
    Permissions: "Permissões",
    Actor: "Autor",
    Action: "Acção",
    "National HQ": "Sede Nacional",
    "Virtual Church": "Igreja Virtual",
    titleChurchOps: "Christ Embassy Operations",
    baptismTab: "Baptismos",
    marriageTab: "Casamentos",
    babyTab: "Dedicação de Bebés",
    total: "Total",
    pending: "Pendente",
    contacted: "Contactado",
    noAnswer: "Sem Resposta",
    interested: "Interessado",
    sentToCell: "Encaminhado para Célula",
    enrolledFoundation: "Inscrito na Escola de Fundação",
    becameMember: "Tornou-se Membro",
    closed: "Fechado",
    inProgress: "Em Curso",
    active: "Activo",
    inactive: "Inactivo",
    transferred: "Transferido",
    rejected: "Rejeitado",
    viewMode: "Modo de visualização",
    moduleNavigation: "Navegação do módulo",
    membersByChurch: "Por Igreja",
    wantFoundation: "Querem Escola de Fundação",
    visitScheduled: "Visita Marcada",
    nextContact: "Próximo Contacto",
    partiallyConfirmed: "Confirmado Parcialmente",
    enrolledInCourse: "Alunos Inscritos",
    readyForExam: "Prontos para Exame",
    certificatesIssued: "Certificados Emitidos",
    exportPdf: "Exportar PDF",
    exportExcel: "Exportar Excel",
    includedReport: "Incluído no Relatório",
    scheduled: "Agendado",
    completed: "Realizado",
    certificateIssued: "Certificado Emitido",
    classProgress: "Progresso das Aulas",
    class1: "Aula 1",
    class2: "Aula 2",
    class3: "Aula 3",
    class4: "Aula 4",
    class5: "Aula 5",
    class6: "Aula 6",
    class7: "Aula 7",
    classesCompletedText: "aulas concluídas",
    classesCompletedSummary: "{n}/7 aulas concluídas",
    readyForExam: "Pronto para Exame",
    practicalCompleted: "Prática concluída",
    soulsWon: "Número de almas ganhas",
    enrolled: "Inscrito",
    approved: "Aprovado",
    graduated: "Graduado",
    studentData: "Dados do Aluno",
    evaluation: "Avaliação",
    finalization: "Finalização",
    examScore: "Nota do Exame",
    markClassTitle: "Marcar Aula",
    launchScoreTitle: "Lançar Nota",
    autoStatusHint: "Estado sugerido automaticamente. Pode ajustar manualmente.",
    certificateIssuedLabel: "Certificado emitido"
  },
  en: {
    loginTitle: "Team Portal",
    loginLead: "Internal access for spiritual follow-up, churches, cells, school, finance and administration.",
    loginPassword: "Password",
    loginSubmit: "Enter Dashboard",
    loginNote: "Frontend-first prototype. Real authentication and database come next.",
    viewSite: "View Site",
    logout: "Logout",
    add: "Add",
    edit: "Edit",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    update: "Update",
    export: "Export",
    actions: "Actions",
    status: "Status",
    search: "Search",
    from: "From",
    to: "To",
    all: "All",
    yes: "Yes",
    no: "No",
    church: "Church",
    name: "Name",
    surname: "Last Name",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    address: "Address",
    date: "Date",
    notes: "Notes",
    category: "Category",
    method: "Method",
    amount: "Amount",
    contributor: "Contributor",
    service: "Service",
    bornAgain: "Born Again",
    foundation: "Foundation",
    counselor: "Counselor",
    cellInterest: "Cell Interest",
    practical: "Practical",
    student: "Student",
    classes: "Classes",
    exam: "Exam",
    progress: "Progress",
    filterChurch: "Filter by Church",
    filterMonth: "Filter by Month",
    filterCell: "Filter by Cell",
    filterStatus: "Filter by Status",
    empty: "There are no records for this module yet.",
    main: "MAIN",
    departments: "DEPARTMENTS",
    admin: "ADMIN",
    dashboard: "Dashboard",
    churches: "Churches",
    members: "Members",
    firstTimers: "First Timers",
    followUp: "Follow-Up",
    reports: "Reports",
    counseling: "Counseling",
    foundationSchool: "Foundation School",
    finance: "Finance",
    cellMinistry: "Cell Ministry",
    sacraments: "Sacraments",
    programs: "Programs",
    partnership: "Partnership",
    media: "Media / Loveworld SAT",
    usersRoles: "Users & Roles",
    accessControl: "Access Control",
    settings: "Settings",
    auditLogs: "Audit Logs",
    requisitions: "Requisitions & Approvals",
    requisitionsSubtitle: "Department requisition workflow — review, pastoral approval and resource release.",
    staffHr: "Staff & Human Resources",
    staffHrSubtitle: "Staff registry, roles, salaries, performance, attendance and assigned equipment.",
    reqTabOverview: "Overview",
    reqTabNew: "New Requisition",
    reqTabReceived: "Received Requisitions",
    reqTabReview: "Under Pastoral Review",
    reqTabPastoral: "Awaiting Main Pastor",
    reqTabApproved: "Approved",
    reqTabRejected: "Rejected",
    reqTabReleased: "Resources Released",
    reqTabHistory: "History",
    reqPending: "Pending Requisitions",
    reqInReview: "In Review",
    reqAwaitingPastor: "Awaiting Main Pastor",
    reqApprovedMonth: "Approved This Month",
    reqRejected: "Rejected",
    reqReleased: "Resources Released",
    reqApprovedValue: "Total Approved Value",
    reqPendingValue: "Pending Value",
    reqNumber: "Requisition No.",
    reqType: "Type",
    reqTitle: "Title",
    reqDepartment: "Department",
    reqUrgency: "Urgency",
    reqNeededBy: "Needed By",
    reqEstimated: "Estimated Amount",
    reqSubmit: "Submit",
    reqReview: "Review",
    reqForwardPastor: "Send to Main Pastor",
    reqApprove: "Approve",
    reqReject: "Reject",
    reqReleaseResources: "Release Resources",
    reqMarkPurchased: "Mark as Purchased",
    reqRegisterInventory: "Register in Inventory",
    reqClose: "Close",
    reqJustification: "Justification",
    reqDescription: "Description",
    reqSupplier: "Supplier",
    reqQuotation: "Quotation No.",
    reqReturnForCorrection: "Return for Correction",
    reqPastoralComment: "Pastoral Comment",
    reqRejectionReason: "Rejection Reason",
    reqApprovedAmount: "Approved Amount",
    reqApprovedAwaitingRelease: "Approved — Awaiting Resource Release",
    reqResourcesReleased: "Resources Released",
    reqHistory: "Requisition History",
    reqDetails: "Requisition Details",
    reqSectionData: "Requisition Data",
    reqSectionDescription: "Description & Justification",
    reqSectionInternalReview: "Internal Review",
    reqSectionAttachments: "Attachments",
    reqSectionPastoralDecision: "Pastoral Decision",
    reqRequester: "Requester",
    reqCurrentStatus: "Current Status",
    reqReviewedBy: "Reviewed by",
    reqReviewDate: "Review date",
    reqReviewNotes: "Review notes",
    reqSentToPastorBy: "Sent to Main Pastor by",
    reqSentToPastorAt: "Sent date",
    reqFinalPriority: "Final Priority",
    reqObservations: "Observations",
    reqBudget: "Budget",
    reqProforma: "Proforma invoice",
    reqNoAttachments: "No attachments",
    reqApproveSuccess: "Requisition approved and sent to Finance for resource release.",
    reqRejectSuccess: "Requisition rejected.",
    reqReturnSuccess: "Requisition returned for correction.",
    reqRejectionRequired: "Please provide a rejection reason.",
    reqReturnNotesRequired: "Please explain what needs to be corrected.",
    reqTimelineCreated: "created by",
    reqTimelineSubmitted: "Submitted on",
    reqTimelineReviewed: "Reviewed by",
    reqTimelineSentPastor: "Sent to Main Pastor",
    reqTimelineApproved: "Approved by",
    reqTimelineRejected: "Rejected by",
    reqTimelineReturned: "Returned by",
    reqTimelineResourcesReleased: "Resources released by",
    reqTimelineClosed: "Closed by",
    reqSentToPastor: "Sent to Main Pastor",
    reqReturnedForCorrection: "Returned for Correction",
    reqPurchasedExecuted: "Purchased / Executed",
    reqRegisteredInventory: "Registered in Inventory",
    finAwaitingRelease: "Awaiting Resource Release",
    finResourcesReleased: "Resources Released",
    finApprovedAmount: "Approved Amount",
    finReleasedAmount: "Released Amount",
    finPartialPayment: "Partial Payment",
    finMarkPaid: "Mark as Paid",
    finPendingInFinance: "Pending in Finance",
    finSentToFinance: "Sent to Finance",
    finResourceDisbursement: "Resource Disbursement",
    finPaymentProof: "Payment Proof",
    finApprovedRequisitions: "Approved Requisitions",
    finReleasedThisMonth: "Resources Released This Month",
    finTotalReleasedMonth: "Total Released This Month",
    finPendingPayments: "Pending Payments",
    finPartiallyPaid: "Partially Paid Requisitions",
    finFinanceStatus: "Financial Status",
    finReleaseDate: "Release Date",
    finAmountToRelease: "Amount to Release",
    finPaymentReference: "Payment Reference",
    finApprovedBy: "Approved by",
    finApprovedAt: "Approval date",
    finApprovedReqHint: "Requisitions approved by Main Pastor — resource release and payments.",
    finReleaseDrawerTitle: "Release Resources",
    finExceedsApproved: "Release amount cannot exceed approved amount.",
    finPaymentMethodRequired: "Please select a payment method.",
    finReleaseDateRequired: "Please provide the release date.",
    finReleaseSuccess: "Resources released successfully.",
    finMarkPaidSuccess: "Requisition marked as paid.",
    finSentToInventory: "Send to Inventory",
    finSentToInventorySuccess: "Inventory draft created.",
    reqSendToInventory: "Send to Inventory",
    reqTabReports: "Requisition Reports",
    reqReportsTitle: "Requisition Reports",
    reqReportsHint: "Workflow analysis and approved vs released amounts.",
    reqReportWorkflow: "Requisition Workflow",
    reqPendingAmount: "Pending Amount",
    reqApprovedVsReleased: "Approved vs Released",
    reqReportByDepartment: "Report by Department",
    reqReportByChurch: "Report by Church",
    reqReportByRequester: "Report by Requester",
    reqReportByType: "Requisitions by Type",
    reqReportMonthly: "Monthly Evolution",
    reqAvgPerRequisition: "Average per Requisition",
    reqRemainingPending: "Remaining Pending Amount",
    reqExportPdf: "Export PDF",
    reqExportExcel: "Export Excel",
    reqPrintReport: "Print Report",
    reqViewRelease: "View Release",
    reqRequisitionStatus: "Requisition Status",
    reqReleasedBy: "Released by",
    reqHighestRequisition: "Highest Requisition",
    reqLastApproved: "Last Approval",
    reqPredominantStatus: "Predominant Status",
    reqCompleted: "Completed",
    staffTabOverview: "Overview",
    staffTabStaff: "Staff",
    staffTabDepartments: "Departments",
    staffTabRoles: "Roles",
    staffTabSalaries: "Salaries & Allowances",
    staffTabPerformance: "Performance",
    staffTabAttendance: "Attendance",
    staffTabEquipment: "Assigned Equipment",
    staffTabDocuments: "Documents",
    staffTabReports: "Reports",
    staffTabBirthdays: "Birthdays",
    dateOfBirth: "Date of Birth",
    staffUpcomingBirthdays: "Upcoming Birthdays",
    staffBirthdaysToday: "Birthdays Today",
    staffPastBirthdaysThisMonth: "Past Birthdays This Month",
    staffActiveBirthdays: "Active Staff Birthdays",
    staffMissingDateOfBirth: "Missing Date of Birth",
    staffBirthdayDayMonth: "Day / Month",
    staffClickToView: "Click to view",
    clickToView: "Click to view",
    appliedFilter: "Applied filter",
    clearFilters: "Clear filters",
    noResultsFound: "No results found",
    staffAge: "Age",
    staffDaysUntilBirthday: "Days Until Birthday",
    staffBirthdayLabel: "Birthday",
    staffFilterBirthdayMonth: "Birthday Month",
    staffSendMessage: "Send Message",
    staffSectionPersonal: "Personal Details",
    staffSectionMinisterial: "Ministerial / Professional Details",
    staffSectionPayment: "Payment / Allowance",
    staffSectionDocuments: "Documents & Notes",
    maritalStatus: "Marital Status",
    emergencyContactName: "Emergency Contact Name",
    emergencyContactPhone: "Emergency Contact Phone",
    nationalIdNumber: "ID Document Number",
    taxNumber: "Tax Number",
    profilePhoto: "Profile Photo",
    bankName: "Bank",
    bankAccountNumber: "Account Number",
    mobileMoneyNumber: "M-Pesa / E-Mola Number",
    contractStartDate: "Contract Start Date",
    contractEndDate: "Contract End Date",
    probationEndDate: "Probation End Date",
    bankOrMobileDetails: "Bank or Mobile Details",
    staffTotal: "Total Staff",
    staffActive: "Active Staff",
    staffVolunteers: "Volunteers",
    staffWithSalary: "Staff with Salary/Allowance",
    staffPendingEval: "Pending Evaluations",
    staffPendingPay: "Pending Payments",
    staffAssignedEq: "Assigned Equipment",
    staffBirthdays: "Birthdays This Month",
    staffFullName: "Full Name",
    staffRoleTitle: "Role Title",
    staffEmploymentType: "Employment Type",
    staffStartDate: "Start Date",
    staffSalary: "Salary/Allowance",
    staffPaymentFreq: "Payment Frequency",
    staffSupervisor: "Supervisor",
    staffRegisterSalary: "Register Salary/Allowance",
    staffEvaluate: "Evaluate Performance",
    staffRegisterAttendance: "Register Attendance",
    staffViewEquipment: "View Equipment",
    staffPrivacyBanner: "Salary information is restricted. Only authorized profiles can view amounts.",
    staffSalaryHidden: "Confidential amount",
    accessDeniedTitle: "Access Restricted",
    accessDeniedText: "You do not have permission to access this area. Contact the administrator if you need access.",
    accessDeniedBack: "Back to Dashboard",
    navLockedTooltip: "You do not have permission to access this module",
    accessMatrixModule: "Module",
    accessMatrixView: "View",
    accessMatrixCreate: "Create",
    accessMatrixEdit: "Edit",
    accessMatrixApprove: "Approve",
    accessMatrixScope: "Scope",
    heroTitle: "A living platform for caring for the church, souls and vision.",
    heroText: "Christ Embassy Mozambique operations with pastoral follow-up, cell growth, school, finance, sacraments and church-level reporting.",
    pendingFollowups: "Pending Follow-Ups",
    totalFirstTimers: "Total First Timers",
    newConverts: "New Converts",
    foundationEnrolments: "Foundation School Enrolments",
    graduations: "Graduations",
    activeCells: "Active Cells",
    baptisms: "Baptisms",
    monthlyGiving: "Monthly Giving",
    churchesReporting: "Churches Reporting This Month",
    firstTimersByMonth: "First Timers by Month",
    givingByCategory: "Giving by Category",
    givingByChurch: "Giving by Church",
    sacramentsSummary: "Sacraments Summary",
    foundationProgress: "Foundation School Progress",
    cellGrowth: "Cell Growth",
    visitorsCaptured: "Visitors captured",
    bornAgainHint: "Born again",
    thisCycle: "This cycle",
    thisMonth: "This month",
    needsAction: "Needs action",
    activeNetwork: "Active network",
    registerFirstTimer: "Register First Timer",
    dashboardOverview: "Operational Overview",
    dashboardChurchGrowth: "Church Growth",
    dashboardChurchGrowthHint: "First timers, converts and foundation school.",
    dashboardPendingSection: "Pending Follow-Ups",
    dashboardPendingHint: "Visitors needing contact or next step.",
    dashboardFinanceSection: "Monthly Finance",
    dashboardFinanceHint: "Giving by category and by church.",
    dashboardCellsSection: "Cells & Leadership",
    dashboardCellsHint: "Attendance, growth and active cell network.",
    dashboardRecentSection: "Recent Activity",
    dashboardRecentHint: "Latest actions and sacraments recorded.",
    viewAll: "View All",
    financeOverviewSection: "Finance Summary",
    financeOverviewHint: "Daily and monthly totals plus verification status.",
    financeAnalyticsSection: "Giving Analytics",
    financeAnalyticsHint: "Distribution by category, church and payment method.",
    financeRecordsSection: "Contribution Records",
    financeRecordsHint: "Search, filters and actions for each contribution.",
    cellAlecSection: "ALEC Training",
    cellAlecHint: "Registrations, progress and leader certification.",
    cellNetworkSection: "Cell Network",
    cellNetworkHint: "Groups, active cells and network indicators.",
    cellGrowthSection: "Growth & Performance",
    cellGrowthHint: "Attendance, first timers, converts and offerings.",
    cellDataSection: "Operational Data",
    cellDataHint: "Tables, reports and module actions.",
    fevoOverviewSection: "F.E.V.O Overview",
    fevoOverviewHint: "Consolidated evangelism, visitation and prayer metrics.",
    fevoAnalyticsSection: "Team Analytics",
    fevoAnalyticsHint: "Activities, contacts and groups without reports.",
    fevoDataSection: "Weekly Records",
    fevoDataHint: "Configurations, reports and team follow-up.",
    firstTimerSubtitle: "Visitors captured from services and follow-up.",
    followupSubtitle: "Clear workflow to follow up each visitor until integration.",
    membersSubtitle: "Member database by church, cell, department and status.",
    foundationSubtitle: "Pending enrolments, 7 classes, scores, exam, practical and certificates.",
    financeSubtitle: "Digital envelope for tithes, offerings, partnerships and projects.",
    churchesSubtitle: "National HQ, provinces, branches and virtual church hierarchy.",
    sacramentsSubtitle: "Baptisms, marriages and baby dedications.",
    reportsSubtitle: "Visual reports based on current data.",
    totalToday: "Total Today",
    totalThisMonth: "Total This Month",
    pendingVerification: "Pending Verification",
    verified: "Verified",
    byCategory: "By Category",
    byChurch: "By Church",
    byPaymentMethod: "By Payment Method",
    pendingEnrolments: "Pending Enrolments",
    enrolledStudents: "Enrolled Students",
    classesAttendance: "Classes & Attendance",
    exams: "Exams",
    graduation: "Graduation",
    certificates: "Certificates",
    enrolStudent: "Enrol Student",
    markClass: "Mark Class",
    launchScore: "Launch Score",
    updateStatus: "Update Status",
    graduate: "Graduate",
    viewProfile: "View Profile",
    moveChurch: "Move Church",
    updateFollowup: "Update Follow-Up",
    exportReceipt: "Export Receipt/Report",
    verify: "Verify",
    reject: "Reject",
    addFinance: "Add Finance Record",
    financeDetails: "Contribution Details",
    verifyFinance: "Verify Contribution",
    rejectFinance: "Reject Contribution",
    verifiedBy: "Verified By",
    verificationComment: "Verification Comment",
    rejectionReason: "Rejection Reason",
    verifiedAt: "Verified At",
    transactionReference: "Transaction Reference",
    envelopeImage: "Envelope Image / POP",
    optional: "Optional",
    createdAt: "Created At",
    rejectionReasonRequired: "Please provide a rejection reason.",
    searchMemberContributor: "Search member / contributor",
    searchMemberContributorPlaceholder: "Type name, surname or phone...",
    linkedToProfile: "Linked to existing profile",
    registerNewContributor: "Register new contributor",
    saveAsNewContributor: "Save as new contributor",
    possibleDuplicateFound: "Possible duplicate found",
    selectThisProfile: "Select this profile",
    noSearchResults: "No results found",
    contributorSection: "Contributor",
    contributionSection: "Contribution",
    sourceMember: "Member",
    sourceFirstTimer: "First Timer",
    sourceContributor: "Contributor",
    sourcePartner: "Partner",
    sourceType: "Source",
    sourcePublicWebsite: "Public Website",
    sourceDashboard: "Dashboard",
    sourceImported: "Imported",
    financeTabOverview: "Overview",
    financeTabEntries: "Entries",
    financeTabPublic: "Public Submissions",
    financeTabVerification: "Verification",
    financeTabApprovedReq: "Approved Requisitions",
    financeTabReports: "Reports",
    financeTabPartners: "Featured Partners",
    financeTabExports: "Exports",
    financeTabAll: "All Records",
    financeReportsSection: "Financial Reports",
    financeReportsHint: "Detailed analysis by period, category, partnership arm and contributor.",
    financeTotalReceived: "Total Received",
    financeTotalVerified: "Total Verified",
    financeTotalPending: "Total Pending",
    financeTotalRejected: "Total Rejected",
    financeContributionCount: "Contributions",
    financeUniqueContributors: "Unique Contributors",
    financeAverageContribution: "Average per Contribution",
    financeReportByCategory: "Report by Category",
    financeReportByPartnershipArm: "Report by Partnership Arm",
    financeReportByIndividual: "Report by Individual",
    financeReportTithe: "Tithe",
    financeReportOfferings: "Offerings",
    financeReportPartnerships: "Partnerships",
    financeReportFirstfruits: "Firstfruits",
    financeReportSeed: "Seed of Faith",
    financeReportOther: "Other",
    financeChartBar: "Bar",
    financeChartDonut: "Donut",
    financePartnersPerArm: "Partners per Arm",
    financeActivePartners: "Active Partners",
    financeGrowthVsPrev: "Growth vs previous month",
    financeFeaturedPartners: "Featured Partners",
    financeExportCsv: "Export CSV",
    financeExportJson: "Export JSON",
    financeExportHint: "Export filtered data for the selected period.",
    financeVerificationQueue: "Verification Queue",
    financeVerificationHint: "Contributions pending verification by the Finance team.",
    financePeriodToday: "Today",
    financePeriodWeek: "This Week",
    financePeriodMonth: "This Month",
    financePeriodQuarter: "This Quarter",
    financePeriodYear: "This Year",
    financePeriodCustom: "Custom Range",
    financeAllChurches: "All Churches",
    financeAllCategories: "All Categories",
    financeAllTypes: "All Types",
    financeAllArms: "All Arms",
    financeAllMethods: "All Methods",
    financeAllStatuses: "All Statuses",
    financeAllSources: "All Sources",
    financeContributorSearch: "Contributor / phone",
    financeContributionType: "Contribution Type",
    financePartnershipArm: "Partnership Arm",
    financeSelectContributor: "Select contributor",
    financeNoChartData: "No data for the selected period.",
    financeReportByChurch: "Report by Church",
    financeMonthlyEvolution: "Monthly Evolution",
    financeTopPartners: "Top Partners",
    financeChartLine: "Line",
    financeTotalPeriod: "Total in Period",
    financeCategoriesContributed: "Categories Contributed",
    financeContributionHistory: "Contribution History",
    financeLastContribution: "Last Contribution",
    financeFrequency: "Frequency",
    financeContributionState: "Contribution Status",
    financeProof: "Proof",
    financeChurchRanking: "Church Ranking",
    financeChurchTotal: "Total per Church",
    financeChurchVerified: "Verified Total",
    financeChurchPending: "Pending Total",
    financeChurchTopCategories: "Top Categories",
    financeTopPartnerGeneral: "Top Partner Overall",
    financeTopPartnerRhapsody: "Top Rhapsody Partner",
    financeTopPartnerHealing: "Top Healing School Partner",
    financeTopPartnerLwsat: "Top Loveworld SAT Partner",
    financeConsistentPartners: "Consistent Partners",
    financeNewPartnersMonth: "New Partners This Month",
    financeSegmentAll: "All",
    financeSegmentTop: "Top Overall",
    financeSegmentConsistent: "Consistent",
    financeSegmentNew: "New",
    financeSegmentInactive: "Stopped Contributing",
    financeSegmentFollowup: "Pending Follow-up",
    financeViewFinancialProfile: "View Financial Profile",
    financeViewHistory: "View History",
    financeContactFollowup: "Contact / Follow-up",
    financeExportPartner: "Export",
    financeExportPdf: "Export PDF",
    financeExportExcel: "Export Excel",
    financePrintReport: "Print Report",
    financeExportGeneral: "General Report",
    financeExportByCategory: "Report by Category",
    financeExportByArm: "Report by Partnership Arm",
    financeExportByChurch: "Report by Church",
    financeExportByIndividual: "Report by Individual",
    financeExportFeaturedPartners: "Featured Partners",
    financeMinValue: "Minimum value",
    financeAllFrequencies: "All Frequencies",
    financeFrequencyConsistent: "Consistent",
    financeFrequencyRegular: "Regular",
    financeFrequencyOccasional: "Occasional",
    financePrivacyNotice: "Sensitive financial data — visibility depends on your access profile.",
    financeAggregatedOnly: "Only aggregated totals are available for your profile.",
    financeAccessOfficer: "Finance Officer",
    financeAccessHead: "Finance Head",
    financeAccessPastor: "Church Pastor",
    financeAccessAdmin: "National Admin",
    financeAccessViewer: "Viewer",
    viewSubmission: "View Submission",
    viewProof: "View Proof",
    publicSubmission: "Public Submission",
    submissionGroup: "Submission Group",
    transferMessage: "Transfer Message",
    transferDate: "Transfer Date",
    cellGroup: "Cell Group",
    otherDescription: "Other Donations",
    grandTotal: "Grand Total",
    contributionLines: "Contribution Lines",
    manual: "Manual",
    followupTimeline: "Follow-Up Timeline",
    contactDate: "Contact Date",
    contactMethod: "Method",
    result: "Result",
    nextStep: "Next Step",
    nextContactDate: "Next Contact Date",
    updatedBy: "Updated By",
    treatment: "Title",
    gender: "Gender",
    birthDate: "Date of Birth",
    preferredCell: "Preferred Cell",
    responsibleCounselor: "Responsible Counselor",
    followupState: "Follow-Up Status",
    entryDate: "Entry Date",
    origin: "Origin",
    cell: "Cell",
    department: "Department",
    "Invited by": "Invited By",
    Province: "Province",
    City: "City",
    Type: "Type",
    Pastor: "Pastor",
    Leader: "Leader",
    "Cell growth": "Cell Growth",
    Role: "Role",
    Departments: "Departments",
    Age: "Age",
    Local: "Local",
    Paid: "Paid",
    Documents: "Documents",
    Groom: "Groom",
    Bride: "Bride",
    Father: "Father",
    Mother: "Mother",
    Passed: "Passed",
    "Transaction reference": "Transaction Reference",
    "Received by": "Received By",
    "Verified by": "Verified By",
    "Envelope image": "Envelope Image",
    "Souls won": "Souls Won",
    Split: "Split",
    "church.operations": "Church Operations",
    Scope: "Scope",
    Permissions: "Permissions",
    Actor: "Actor",
    Action: "Action",
    "National HQ": "National HQ",
    "Virtual Church": "Virtual Church",
    titleChurchOps: "Christ Embassy Operations",
    baptismTab: "Baptisms",
    marriageTab: "Marriages",
    babyTab: "Baby Dedications",
    total: "Total",
    pending: "Pending",
    contacted: "Contacted",
    noAnswer: "No Answer",
    interested: "Interested",
    sentToCell: "Sent to Cell",
    enrolledFoundation: "Enrolled in Foundation School",
    becameMember: "Became Member",
    closed: "Closed",
    inProgress: "In Progress",
    active: "Active",
    inactive: "Inactive",
    transferred: "Transferred",
    rejected: "Rejected",
    viewMode: "View mode",
    moduleNavigation: "Module navigation",
    membersByChurch: "By Church",
    wantFoundation: "Want Foundation School",
    visitScheduled: "Visit Scheduled",
    nextContact: "Next Contact",
    partiallyConfirmed: "Partially Confirmed",
    enrolledInCourse: "Enrolled Students",
    readyForExam: "Ready for Exam",
    certificatesIssued: "Certificates Issued",
    exportPdf: "Export PDF",
    exportExcel: "Export Excel",
    includedReport: "Included in Report",
    scheduled: "Scheduled",
    completed: "Completed",
    certificateIssued: "Certificate Issued",
    classProgress: "Class Progress",
    class1: "Class 1",
    class2: "Class 2",
    class3: "Class 3",
    class4: "Class 4",
    class5: "Class 5",
    class6: "Class 6",
    class7: "Class 7",
    classesCompletedText: "classes completed",
    classesCompletedSummary: "{n}/7 classes completed",
    readyForExam: "Ready for Exam",
    practicalCompleted: "Practical completed",
    soulsWon: "Number of souls won",
    enrolled: "Enrolled",
    approved: "Approved",
    graduated: "Graduated",
    studentData: "Student Details",
    evaluation: "Evaluation",
    finalization: "Finalization",
    examScore: "Exam Score",
    markClassTitle: "Mark Class",
    launchScoreTitle: "Launch Score",
    autoStatusHint: "Status suggested automatically. You can adjust it manually.",
    certificateIssuedLabel: "Certificate issued"
  }
};

const STATUS_KEYS = {
  Pending: "pending",
  Pendente: "pending",
  Contacted: "contacted",
  Contactado: "contacted",
  "No Answer": "noAnswer",
  "Sem Resposta": "noAnswer",
  Interested: "interested",
  Interessado: "interested",
  "Sent to Cell": "sentToCell",
  "Encaminhado para Célula": "sentToCell",
  "Enrolled in Foundation School": "enrolledFoundation",
  "Inscrito na Escola de Fundação": "enrolledFoundation",
  "Became Member": "becameMember",
  "Tornou-se Membro": "becameMember",
  Closed: "closed",
  Fechado: "closed",
  Active: "active",
  Activo: "active",
  Activa: "active",
  Inactive: "inactive",
  Inactivo: "inactive",
  Transferred: "transferred",
  Transferido: "transferred",
  "In Progress": "inProgress",
  "Em Curso": "inProgress",
  "Pending Verification": "pendingVerification",
  "Pendente de Verificação": "pendingVerification",
  Verified: "verified",
  Verificado: "verified",
  Rejected: "rejected",
  Rejeitado: "rejected",
  "Included in Report": "includedReport",
  "Incluído no Relatório": "includedReport",
  Scheduled: "scheduled",
  Agendado: "scheduled",
  Cancelado: "cancelled",
  Completed: "completed",
  Realizado: "completed",
  "Certificate Issued": "certificateIssued",
  "Certificado Emitido": "certificateIssued",
  "Planeado": "planned",
  "Relatório Submetido": "reportSubmitted",
  "Inscrito": "enrolled",
  "Exame": "exam",
  "Em Preparação": "inPreparation",
  "Confirmado": "confirmed",
  "Concluído": "completed",
  "Disponível": "available",
  "Esgotado": "outOfStock",
  "Descontinuado": "discontinued",
  "Pausada": "paused",
  "Solicitado": "requested",
  "Aprovado": "approved",
  "Enviado": "sent",
  "Recebido": "received"
};

Object.assign(STATUS_KEYS, {
  "Em Formação": "inTraining",
  "Terminou": "completed",
  "Pendente de Pagamento": "pendingVerification",
  "Rascunho": "draft",
  "Submetido": "submitted",
  "Em Avaliação": "underEvaluation",
  "Aprovado": "approved",
  "Validado": "validated",
  "Devolver para Correção": "returned",
  "Devolvido": "returned",
  "Crítico": "critical",
  "Precisa de Atenção": "needsAttention",
  "Encaminhado para Validação": "forwardValidation",
  "Excelente": "excellent",
  "Bom": "good",
  "Fechado": "closed",
  "Em Revisão": "review",
  "Resolvido": "resolved",
  "Reincidente": "recurrent",
  "Em Crescimento": "growing",
  "Inactivo": "inactive",
  "Em Revisão": "review",
  "Por Confirmar": "toConfirm",
  "Incompleto": "incomplete",
  "Pending Enrolment": "enrolled",
  "Enrolled": "enrolled",
  "Exam Ready": "readyForExam",
  "Passed": "approved",
  "Graduated": "graduated",
  "Pronto para Exame": "readyForExam",
  "Enviado ao Pastor Principal": "sentToPastor",
  "Devolvido para Correção": "returnedForCorrection",
  "Aprovado — Aguardando Liberação de Recursos": "approvedAwaitingRelease",
  "Recursos Liberados": "resourcesReleased",
  "Comprado / Executado": "purchasedExecuted",
  "Registado no Inventário": "registeredInventory",
  "Comprado": "purchasedExecuted",
  Graduado: "graduated",
  Aprovado: "approved"
});

const CHURCH_TYPES = ["Sede Nacional", "Igreja Local", "Igreja Online", "Igreja Virtual", "Grupo / Missão"];
const CHURCH_STATUSES = ["Activa", "Inactiva", "Em Preparação"];
const CHURCH_INFO_STATUSES = ["Confirmado", "Por Confirmar", "Incompleto"];
const CHURCH_VIEW_KEY = "ce-dashboard-church-view";
const ONLINE_CHURCH_TYPES = new Set(["Igreja Online", "Igreja Virtual"]);

const CHURCH_TYPE_LABELS = {
  "Sede Nacional": "churchTypeNational",
  "Igreja Local": "churchTypeLocal",
  "Igreja Online": "churchTypeOnline",
  "Igreja Virtual": "churchTypeVirtual",
  "Grupo / Missão": "churchTypeMission"
};

const DAYS_OF_WEEK = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const DAY_OF_WEEK_ORDER = Object.fromEntries(DAYS_OF_WEEK.map((day, index) => [day, index]));
const SERVICE_TYPES = ["Presencial", "Online", "Híbrido"];
const SERVICE_TYPE_LABELS = {
  Presencial: "serviceTypeInPerson",
  Online: "serviceTypeOnline",
  Híbrido: "serviceTypeHybrid"
};

function makeServiceTimeId() {
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedServiceTime(churchId, slot, fields) {
  return {
    id: `st-${churchId}-${slot}`,
    day_of_week: fields.day_of_week,
    service_name: fields.service_name,
    time: fields.time,
    service_type: fields.service_type || "Presencial",
    is_active: fields.is_active !== false,
    notes: fields.notes || ""
  };
}

function buildGeneralServicePreset() {
  return [
    { id: makeServiceTimeId(), day_of_week: "Domingo", service_name: "Culto de Domingo", time: "09:00", service_type: "Presencial", is_active: true, notes: "" },
    { id: makeServiceTimeId(), day_of_week: "Quarta-feira", service_name: "Culto de Quarta-feira", time: "18:00", service_type: "Presencial", is_active: true, notes: "" }
  ];
}

function buildHqServicePreset() {
  return [
    { id: makeServiceTimeId(), day_of_week: "Domingo", service_name: "1º Culto", time: "07:45", service_type: "Presencial", is_active: true, notes: "" },
    { id: makeServiceTimeId(), day_of_week: "Domingo", service_name: "2º Culto", time: "09:30", service_type: "Presencial", is_active: true, notes: "" },
    { id: makeServiceTimeId(), day_of_week: "Quarta-feira", service_name: "Culto de Quarta-feira", time: "18:00", service_type: "Presencial", is_active: true, notes: "" }
  ];
}

function defaultSeedServiceTimes(churchId, type) {
  const id = churchId || "church-new";
  if (id === "church-hq") {
    return [
      seedServiceTime(id, 0, { day_of_week: "Domingo", service_name: "1º Culto", time: "07:45", service_type: "Presencial" }),
      seedServiceTime(id, 1, { day_of_week: "Domingo", service_name: "2º Culto", time: "09:30", service_type: "Presencial" }),
      seedServiceTime(id, 2, { day_of_week: "Quarta-feira", service_name: "Culto de Quarta-feira", time: "18:00", service_type: "Presencial" })
    ];
  }
  if (id === "church-nampula") {
    return [
      seedServiceTime(id, 0, { day_of_week: "Domingo", service_name: "Culto de Domingo", time: "09:00", service_type: "Presencial" }),
      seedServiceTime(id, 1, { day_of_week: "Quarta-feira", service_name: "Quarta-feira do Amor", time: "17:00", service_type: "Presencial" })
    ];
  }
  if (id === "church-virtual" || ONLINE_CHURCH_TYPES.has(type)) {
    return [
      seedServiceTime(id, 0, { day_of_week: "Domingo", service_name: "Culto de Domingo", time: "09:00", service_type: "Online" }),
      seedServiceTime(id, 1, { day_of_week: "Quarta-feira", service_name: "Culto de Quarta-feira", time: "18:00", service_type: "Online" })
    ];
  }
  return [
    seedServiceTime(id, 0, { day_of_week: "Domingo", service_name: "Culto de Domingo", time: "09:00", service_type: "Presencial" }),
    seedServiceTime(id, 1, { day_of_week: "Quarta-feira", service_name: "Culto de Quarta-feira", time: "18:00", service_type: "Presencial" })
  ];
}

function normalizeServiceTimeRecord(record, churchId, index) {
  const isActive = record.is_active;
  return {
    id: record.id || `st-${churchId}-${index}`,
    day_of_week: DAYS_OF_WEEK.includes(record.day_of_week) ? record.day_of_week : "Domingo",
    service_name: record.service_name || "",
    time: /^\d{2}:\d{2}$/.test(record.time || "") ? record.time : "09:00",
    service_type: SERVICE_TYPES.includes(record.service_type) ? record.service_type : "Presencial",
    is_active: !(isActive === false || isActive === "Não" || isActive === "No"),
    notes: record.notes || ""
  };
}

function parseLegacyServiceTimes(text, churchId) {
  const value = String(text || "").trim();
  if (!value) return defaultSeedServiceTimes(churchId);
  if (/17h?00|17:00/i.test(value) && /quarta/i.test(value)) {
    return [
      seedServiceTime(churchId, 0, { day_of_week: "Domingo", service_name: "Culto de Domingo", time: "09:00", service_type: "Presencial" }),
      seedServiceTime(churchId, 1, { day_of_week: "Quarta-feira", service_name: "Quarta-feira do Amor", time: "17:00", service_type: "Presencial" })
    ];
  }
  if (/online/i.test(value)) {
    return defaultSeedServiceTimes(churchId, "Igreja Online");
  }
  if (/07:?45|7:45|09:30|9:30/i.test(value)) {
    return defaultSeedServiceTimes("church-hq", "Sede Nacional");
  }
  return defaultSeedServiceTimes(churchId);
}

function resolveServiceTimes(serviceTimes, churchId, churchType) {
  if (Array.isArray(serviceTimes) && serviceTimes.length) {
    return serviceTimes.map((record, index) => normalizeServiceTimeRecord(record, churchId, index));
  }
  if (typeof serviceTimes === "string" && serviceTimes.trim()) {
    return parseLegacyServiceTimes(serviceTimes, churchId);
  }
  return defaultSeedServiceTimes(churchId, churchType);
}

function serviceTypeText(type) {
  const key = SERVICE_TYPE_LABELS[type];
  return key ? L(key) : type || "-";
}

function getActiveServiceTimes(serviceTimes) {
  const list = Array.isArray(serviceTimes)
    ? serviceTimes.map((record, index) => normalizeServiceTimeRecord(record, record.id || "svc", index))
    : [];
  return list
    .filter((record) => record.is_active)
    .sort((a, b) => {
      const dayDiff = (DAY_OF_WEEK_ORDER[a.day_of_week] ?? 99) - (DAY_OF_WEEK_ORDER[b.day_of_week] ?? 99);
      if (dayDiff !== 0) return dayDiff;
      return (a.time || "").localeCompare(b.time || "");
    });
}

function formatServiceTimeShort(record) {
  return `${record.day_of_week} ${record.time}`;
}

function formatServiceTimeDetail(record) {
  return `${record.day_of_week} — ${record.service_name} — ${record.time} — ${serviceTypeText(record.service_type)}`;
}

Object.assign(TEXT.pt, {
  cellLeadership: "Células & Liderança",
  cellOverview: "Visão Geral",
  cellCells: "Células",
  cellLeaders: "Líderes",
  cellReports: "Relatórios de Células",
  alec: "ALEC",
  prisonMinistry: "Ministério Prisional",
  ministryMaterials: "Materiais do Ministério",
  prisonMinistrySubtitle: "Serviços prisionais, acompanhamento de internos e Escola de Fundação dentro dos locais de missão.",
  materialsSubtitle: "Catálogo, vendas, distribuição, stock semanal e fundos para distribuição gratuita.",
  activePrisons: "Prisões Activas",
  activeStudents: "Alunos Activos",
  servicesThisWeek: "Serviços Esta Semana",
  inmatesReached: "Internos Alcançados",
  prisonNewConverts: "Novos Convertidos",
  prisonFoundationStudents: "Alunos em Escola de Fundação",
  pendingReports: "Relatórios Pendentes",
  prisonsLocations: "Prisões / Locais",
  prisonServices: "Serviços Prisionais",
  weeklyAgenda: "Agenda Semanal",
  ministryReports: "Relatórios",
  prisonName: "Nome da Prisão",
  province: "Província",
  city: "Cidade",
  responsibleChurch: "Igreja Responsável",
  prisonRepresentative: "Representante da Prisão",
  representativeContact: "Contacto do Representante",
  observations: "Observações",
  weekday: "Dia da Semana",
  prison: "Prisão",
  responsibleLeader: "Líder Responsável",
  membersWent: "Membros que Foram",
  inmatesPresent: "Internos Presentes",
  interestedFoundation: "Interessados na Escola de Fundação",
  foundationClassGiven: "Aula de Fundação Dada",
  topicMessage: "Tema ou Mensagem",
  participantName: "Nome do Participante",
  evangelismPractice: "Prática de Evangelismo",
  approved: "Aprovado",
  graduated: "Graduado",
  weekStart: "Início da Semana",
  weekEnd: "Fim da Semana",
  mondayAgenda: "Segunda: Preparar Relatórios e Agenda",
  tuesdayPrayer: "Terça: Reunião de Oração",
  wednesdayFollowup: "Quarta: Follow-up com Representante",
  thursdayService: "Quinta: Serviço Prisional",
  fridayService: "Sexta: Serviço Prisional",
  weekendFollowup: "Sábado/Domingo: Acompanhamento",
  responsible: "Responsável",
  soldThisMonth: "Total Vendido Este Mês",
  quantitySold: "Quantidade Vendida",
  materialsInStock: "Materiais em Stock",
  lowStockMaterials: "Materiais com Stock Baixo",
  pendingDistributions: "Distribuições Pendentes",
  fundsRaised: "Fundos Levantados",
  catalogue: "Catálogo",
  sales: "Vendas",
  churchDistribution: "Distribuição para Igrejas",
  weeklyStock: "Stock Semanal",
  freeDistributionFunds: "Fundos para Distribuição Gratuita",
  materialTitle: "Título do Material",
  materialType: "Tipo",
  authorOrigin: "Autor / Origem",
  format: "Formato",
  price: "Preço",
  currentStock: "Stock Actual",
  minimumStock: "Stock Mínimo",
  reportWeek: "Semana do Relatório",
  buyer: "Comprador",
  paymentProof: "POP / Prova de Pagamento",
  receivedBy: "Recebido Por",
  destinationChurch: "Igreja Destinatária",
  distributionType: "Tipo de Distribuição",
  sentBy: "Responsável pelo Envio",
  openingStock: "Stock Inicial",
  entries: "Entradas",
  exits: "Saídas",
  finalStock: "Stock Final",
  difference: "Diferença",
  campaign: "Campanha",
  targetAmount: "Valor Alvo",
  raisedAmount: "Valor Levantado",
  materialsToDistribute: "Materiais a Distribuir",
  beneficiaryChurches: "Igrejas Beneficiadas",
  filterWeek: "Filtrar por Semana",
  filterMaterial: "Filtrar por Material",
  filterPaymentMethod: "Método de Pagamento",
  confirm: "Confirmar",
  planned: "Planeado",
  reportSubmitted: "Relatório Submetido",
  enrolled: "Inscrito",
  inPreparation: "Em Preparação",
  confirmed: "Confirmado",
  available: "Disponível",
  outOfStock: "Esgotado",
  discontinued: "Descontinuado",
  paused: "Pausada",
  requested: "Solicitado",
  approved: "Aprovado",
  sent: "Enviado",
  received: "Recebido"
});

Object.assign(TEXT.pt, {
  alecFull: "ALEC - Academia de Liderança da Embaixada de Cristo",
  alecRegistration: "Cadastro ALEC",
  alecScores: "Pauta ALEC",
  churchReports: "Relatórios de Igreja",
  cellReports: "Relatórios de Células",
  cellEvaluation: "Avaliação",
  finalValidation: "Validação Final",
  totalAlecRegistered: "Total Inscritos ALEC",
  alreadyLeaders: "Já são Líderes",
  didFoundationSchool: "Fizeram Escola de Fundação",
  inTraining: "Em Formação",
  alecCompleted: "ALEC Concluídos",
  submittedReports: "Relatórios Submetidos",
  pendingReportsShort: "Relatórios Pendentes",
  totalAttendance: "Assistência Total",
  totalFirstTime: "Primeira Vez Total",
  totalNewConverts: "Novos Convertidos",
  totalOffering: "Oferta Total",
  explosionCells: "Células em Explosão",
  attentionCells: "Células que Precisam de Atenção",
  attendanceByWeek: "Assistência por Semana",
  firstTimersByCell: "Primeira Vez por Célula",
  newConvertsByCell: "Novos Convertidos por Célula",
  offeringByWeek: "Oferta por Semana",
  alecProgressByChurch: "ALEC progresso por igreja",
  reportsByStatus: "Relatórios por estado",
  topCellsGrowth: "Top células por crescimento",
  fullName: "Nome Completo",
  contact: "Contacto",
  cellLeaderName: "Nome do Líder de Célula",
  didFoundation: "Fez Escola de Fundação",
  isLeader: "É Líder",
  alecReason: "Motivo de Fazer ALEC",
  phase1: "Fase 1",
  phase2: "Fase 2",
  finished: "Terminou",
  certificateBandPaid: "Faixa e Certificado Pago",
  finalAverage: "Média Final",
  phase1Average: "Média Fase 1",
  phase2Average: "Média Fase 2",
  week: "Semana",
  startDate: "Data Início",
  endDate: "Data Fim",
  worshipService: "Culto",
  leaderTitle: "Título do Líder",
  leaderName: "Nome do Líder",
  attendance: "Assistência",
  firstTimeShort: "Primeira Vez",
  newConvertsShort: "Novos Convertidos",
  offering: "Oferta",
  comments: "Comentários",
  submittedBy: "Submetido Por",
  evaluatedBy: "Avaliado Por",
  validatedBy: "Validado Por",
  actualLeader: "Líder Actual",
  cameFromAlec: "Veio do ALEC",
  alecFinished: "ALEC Concluído",
  supervisor: "Supervisor",
  evaluator: "Avaliador",
  evaluationDate: "Data da Avaliação",
  classification: "Classificação",
  strengths: "Pontos Fortes",
  improvements: "Pontos a Melhorar",
  recommendedAction: "Acção Recomendada",
  needsFollowup: "Precisa de Follow-up",
  decision: "Decisão",
  finalComment: "Comentário Final",
  finalStatus: "Estado Final",
  excellent: "Excelente",
  good: "Bom",
  needsAttention: "Precisa de Atenção",
  critical: "Crítico",
  draft: "Rascunho",
  submitted: "Submetido",
  underEvaluation: "Em Avaliação",
  validated: "Validado",
  returned: "Devolvido",
  forwardValidation: "Encaminhado para Validação",
  noReport: "Sem relatório",
  readyToSplit: "Pronta para dividir",
  leaderSupport: "Líder precisa de apoio"
});

Object.assign(TEXT.pt, {
  fevo: "F.E.V.O",
  fevoFull: "Follow-Up, Evangelização, Visitação e Oração",
  fevoSubtitle: "Equipas semanais rotativas para seguimento, evangelização, visitação e oração, coordenadas por Sister Cassandra.",
  weeklyConfiguration: "Configuração Semanal",
  evangelism: "Evangelização",
  visitation: "Visitação",
  prayer: "Oração",
  groupsWithoutReport: "Grupos sem Relatório",
  weeklyReports: "Relatórios Semanais",
  analysis: "Análise",
  team: "Equipa",
  teamA: "Team A",
  teamB: "Team B",
  teamC: "Team C",
  teamD: "Team D",
  activityType: "Tipo de Actividade",
  teamAActivity: "Actividade Team A",
  teamBActivity: "Actividade Team B",
  teamCActivity: "Actividade Team C",
  teamDActivity: "Actividade Team D",
  preparedBy: "Preparado Por",
  groupName: "Nome do Grupo",
  numberOfCells: "Número de Células",
  numberOfMembers: "Número de Membros",
  leadersPresent: "Líderes Presentes",
  membersPresent: "Membros Presentes",
  ftInChurch: "Primeira Vez na Igreja",
  submittedReport: "Submeteu Relatório",
  submittedAt: "Submetido Em",
  soulsContacted: "Almas Contactadas",
  feedbackCount: "Quantidade de Feedback",
  followupResult: "Resultado do Follow-Up",
  nextAction: "Próxima Acção",
  soulsEvangelized: "Almas Evangelizadas",
  materialsDistributed: "Materiais Distribuídos",
  evangelismLocation: "Local de Evangelização",
  soulsVisited: "Almas Visitadas",
  familyMembersReached: "Familiares Alcançados",
  visitLocation: "Local da Visitação",
  visitResult: "Resultado da Visitação",
  averageMembersPresent: "Média de Membros Presentes",
  daysOfPrayer: "Dias de Oração",
  prayerFocus: "Foco de Oração",
  prayerTestimonies: "Testemunhos de Oração",
  reasonNotSubmitted: "Motivo de Não Submissão",
  followupAction: "Acção de Seguimento",
  contactedBy: "Contactado Por",
  totalGroups: "Total de Grupos",
  totalCells: "Total de Células",
  totalMembers: "Total de Membros",
  groupsNoReportThisWeek: "Grupos sem Relatório Esta Semana",
  recurringGroups: "Grupos Reincidentes",
  resolved: "Resolvidos",
  activitiesByWeek: "Actividades por Semana",
  contactedByGroup: "Almas Contactadas por Grupo",
  evangelizedByGroup: "Almas Evangelizadas por Grupo",
  visitedByGroup: "Visitação por Grupo",
  prayerDaysByTeam: "Dias de Oração por Equipa",
  noReportByWeek: "Grupos sem Relatório por Semana",
  firstTimersByWeek: "Primeira Vez por Semana",
  exportPdf: "Exportar PDF",
  exportExcel: "Exportar Excel",
  submit: "Submeter",
  approve: "Aprovar",
  review: "Em Revisão",
  recurrent: "Reincidente",
  sidebarCollapse: "Recolher menu",
  sidebarExpand: "Expandir menu",
  navGroupToggle: "Alternar secção",
  moduleNavToggle: "Alternar menu do módulo",
  backToTop: "Voltar ao topo",
  cellAlecArea: "ALEC / Sister Angelica",
  cellMinistryArea: "Cell Ministry / Pastora Flavia",
  cellReportsArea: "Relatórios de Células / Sister Eduarda",
  cellAlecOverview: "Visão Geral ALEC",
  cellMinistryOverview: "Visão Geral",
  receivedReports: "Relatórios Recebidos",
  cellPerformance: "Desempenho das Células",
  leadersAttention: "Líderes em Atenção",
  actionPlan: "Plano de Acção",
  weeklyCellReport: "Relatório Semanal",
  cellGroups: "Grupos de Células",
  cellCellsList: "Células",
  consolidation: "Consolidação",
  totalGroupCells: "Total de Grupos de Células",
  viewCells: "Ver Células",
  updateCellReport: "Actualizar Relatório",
  needsReview: "Revisão Pendente",
  importReview: "Nomes importados",
  growing: "Em Crescimento",
  inactive: "Inactivo",
  cellName: "Nome da Célula",
  observation: "Observação",
  reportWeek: "Julho Semana 1",
  responsibleArea: "Área Responsável",
  clearFilter: "Limpar filtro",
  filteredByGroup: "Filtrado por grupo",
  actionOwner: "Responsável",
  dueDate: "Data Limite",
  recommendedActions: "Acções Recomendadas",
  totalChurches: "Total de Igrejas",
  activeChurches: "Igrejas Activas",
  onlineVirtualChurches: "Igrejas Online / Virtuais",
  provincesCovered: "Províncias Cobertas",
  infoToConfirm: "Informações por Confirmar",
  publicName: "Nome Público",
  districtOrArea: "Zona / Bairro",
  cityDistrict: "Cidade/Distrito",
  areaNeighborhood: "Zona/Bairro",
  selectProvince: "Seleccione a província",
  selectCity: "Seleccione a cidade",
  selectChurch: "Seleccione a igreja",
  noChurchRegistered: "Nenhuma igreja registada",
  addNewChurch: "Adicionar nova igreja",
  serviceTimesShort: "Horários",
  phonePrimary: "Telefone Principal",
  phoneSecondary: "Telefone Secundário",
  serviceTimes: "Horários de Culto",
  parentChurch: "Igreja Mãe",
  informationStatus: "Estado da Informação",
  socialNetworks: "Redes Sociais",
  cardsView: "Cartões",
  tableView: "Tabela",
  churchTypeNational: "Sede Nacional",
  churchTypeLocal: "Igreja Local",
  churchTypeOnline: "Igreja Online",
  churchTypeVirtual: "Igreja Virtual",
  churchTypeMission: "Grupo / Missão",
  toConfirm: "Por Confirmar",
  incomplete: "Incompleto",
  inPreparation: "Em Preparação",
  filterProvince: "Filtrar por Província",
  filterCity: "Filtrar por Cidade",
  filterType: "Filtrar por Tipo",
  filterInfoStatus: "Filtrar por Estado da Informação",
  churchDetails: "Detalhes da Igreja",
  addChurch: "Adicionar Igreja",
  editChurch: "Editar Igreja",
  updateChurchStatus: "Actualizar Estado da Igreja",
  exportChurch: "Exportar Igreja",
  toBeConfirmed: "Por confirmar",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  applyGeneralDefault: "Aplicar Padrão Geral",
  applyHqDefault: "Aplicar Padrão HQ",
  addServiceTime: "Adicionar Horário",
  dayOfWeek: "Dia da Semana",
  serviceName: "Nome do Culto",
  serviceTimeLabel: "Hora",
  serviceType: "Tipo de Culto",
  serviceTypeInPerson: "Presencial",
  serviceTypeOnline: "Online",
  serviceTypeHybrid: "Híbrido",
  remove: "Remover"
});

Object.assign(TEXT.pt, {
  venueInventory: "Gestão de Espaços & Inventário",
  venueInventoryShort: "Espaços & Inventário",
  venueInventorySubtitle: "Inventário, equipamentos do staff, manutenção, movimentações, espaços e checklists de culto sob responsabilidade de Marcelo Panguene.",
  generalInventory: "Inventário Geral",
  newAcquisitions: "Novas Aquisições",
  staffEquipment: "Equipamentos do Staff",
  maintenanceRepairs: "Manutenção & Reparações",
  loansMovements: "Empréstimos / Movimentações",
  venuesRooms: "Espaços & Salas",
  serviceChecklist: "Checklist de Culto",
  totalItems: "Total de Itens",
  goodEquipment: "Equipamentos Bons",
  damagedEquipment: "Equipamentos Danificados",
  inRepair: "Em Reparação",
  assignedStaffEquipment: "Equipamentos Atribuídos ao Staff",
  acquisitions2026: "Novas Aquisições 2026",
  pendingMovements: "Movimentações Pendentes",
  activeSpaces: "Espaços Activos",
  pendingChecklists: "Checklists Pendentes",
  itemsByCategory: "Itens por Categoria",
  itemsByStatus: "Itens por Estado",
  equipmentByDepartment: "Equipamentos por Departamento",
  repairsByStatus: "Reparações por Estado",
  acquisitionsByMonth: "Valor de Aquisições por Mês",
  itemName: "Nome do Item",
  quantity: "Quantidade",
  location: "Localização",
  responsibleDepartment: "Departamento Responsável",
  entryDate: "Data de Entrada",
  unitValue: "Valor Unitário",
  totalValue: "Valor Total",
  serialNumber: "Número de Série",
  itemCode: "Código do Item",
  description: "Descrição",
  purchaseEntryDate: "Data de Compra ou Entrada",
  supplier: "Fornecedor",
  invoiceProof: "Comprovativo ou Factura",
  staffName: "Nome do Funcionário",
  onboardingDate: "Data de Onboarding",
  device: "Dispositivo",
  model: "Modelo",
  deviceId: "Device ID",
  productId: "Product ID",
  deliveryDate: "Data de Entrega",
  conditionAtDelivery: "Estado na Entrega",
  currentCondition: "Estado Actual",
  deliveredBy: "Responsável pela Entrega",
  signatureConfirmed: "Assinatura Confirmada",
  returnDate: "Data de Devolução",
  item: "Item",
  reportedProblem: "Problema Reportado",
  conditionBefore: "Estado Antes",
  conditionAfter: "Estado Depois",
  repairCost: "Custo da Reparação",
  technicianResponsible: "Técnico ou Responsável",
  sentDate: "Data de Envio",
  returnedDate: "Data de Retorno",
  originPlace: "Origem",
  destination: "Destino",
  requestingDepartment: "Departamento Solicitante",
  responsiblePerson: "Pessoa Responsável",
  exitDate: "Data de Saída",
  expectedReturnDate: "Data Prevista de Retorno",
  actualReturnDate: "Data Real de Retorno",
  conditionOut: "Estado ao Sair",
  conditionBack: "Estado ao Voltar",
  approvedBy: "Aprovado Por",
  spaceName: "Nome do Espaço",
  capacity: "Capacidade",
  fixedEquipment: "Equipamentos Fixos",
  serviceDate: "Data do Culto",
  space: "Espaço",
  serviceEventType: "Tipo de Culto ou Evento",
  soundChecked: "Som Verificado",
  lightsChecked: "Luzes Verificadas",
  acChecked: "AC Verificado",
  projectorChecked: "Projector Verificado",
  chairsOrganized: "Cadeiras Organizadas",
  pulpitReady: "Púlpito Pronto",
  camerasReady: "Câmaras Prontas",
  microphonesReady: "Microfones Prontos",
  cleaningDone: "Limpeza Feita",
  inventoryByCategory: "Inventário por Categoria",
  inventoryByStatus: "Inventário por Estado",
  damagedItems: "Equipamentos Danificados",
  repairHistory: "Histórico de Reparações",
  movementsByPeriod: "Movimentações por Período",
  checklistByWeek: "Checklist de Culto por Semana",
  venueReports: "Relatórios",
  filterDepartment: "Filtrar por Departamento",
  filterDate: "Filtrar por Data",
  inventoryByCategory: "Inventário por Categoria",
  inventoryByStatus: "Inventário por Estado",
  staffEquipmentReport: "Equipamentos Atribuídos ao Staff",
  damagedItemsReport: "Equipamentos Danificados",
  repairHistory: "Histórico de Reparações",
  movementsByPeriod: "Movimentações por Período",
  newAcquisitionsByMonth: "Novas Aquisições por Mês",
  venueManagerRole: "Gestor de Espaços",
  requestEquipment: "Solicitar Equipamento",
  receivedBy: "Recebido Por",
  observations: "Observações",
  responsible: "Responsável",
  church: "Igreja",
  spaceType: "Tipo de Espaço"
});

Object.assign(TEXT.en, {
  venueInventory: "Venue & Inventory Management",
  venueInventoryShort: "Venue & Inventory",
  venueInventorySubtitle: "Inventory, staff equipment, maintenance, movements, venues and service checklists under Marcelo Panguene.",
  generalInventory: "General Inventory",
  newAcquisitions: "New Acquisitions",
  staffEquipment: "Staff Equipment",
  maintenanceRepairs: "Maintenance & Repairs",
  loansMovements: "Loans / Movements",
  venuesRooms: "Venues & Rooms",
  serviceChecklist: "Service Checklist",
  totalItems: "Total Items",
  goodEquipment: "Good Equipment",
  damagedEquipment: "Damaged Equipment",
  inRepair: "In Repair",
  assignedStaffEquipment: "Staff Assigned Equipment",
  acquisitions2026: "New Acquisitions 2026",
  pendingMovements: "Pending Movements",
  activeSpaces: "Active Spaces",
  pendingChecklists: "Pending Checklists",
  itemsByCategory: "Items by Category",
  itemsByStatus: "Items by Status",
  equipmentByDepartment: "Equipment by Department",
  repairsByStatus: "Repairs by Status",
  acquisitionsByMonth: "Acquisitions Value by Month",
  itemName: "Item Name",
  quantity: "Quantity",
  location: "Location",
  responsibleDepartment: "Responsible Department",
  entryDate: "Entry Date",
  unitValue: "Unit Value",
  totalValue: "Total Value",
  serialNumber: "Serial Number",
  itemCode: "Item Code",
  description: "Description",
  purchaseEntryDate: "Purchase or Entry Date",
  supplier: "Supplier",
  invoiceProof: "Proof or Invoice",
  staffName: "Staff Name",
  onboardingDate: "Onboarding Date",
  device: "Device",
  model: "Model",
  deviceId: "Device ID",
  productId: "Product ID",
  deliveryDate: "Delivery Date",
  conditionAtDelivery: "Condition at Delivery",
  currentCondition: "Current Condition",
  deliveredBy: "Delivered By",
  signatureConfirmed: "Signature Confirmed",
  returnDate: "Return Date",
  item: "Item",
  reportedProblem: "Reported Problem",
  conditionBefore: "Condition Before",
  conditionAfter: "Condition After",
  repairCost: "Repair Cost",
  technicianResponsible: "Technician or Responsible",
  sentDate: "Sent Date",
  returnedDate: "Return Date",
  originPlace: "Origin",
  destination: "Destination",
  requestingDepartment: "Requesting Department",
  responsiblePerson: "Responsible Person",
  exitDate: "Exit Date",
  expectedReturnDate: "Expected Return Date",
  actualReturnDate: "Actual Return Date",
  conditionOut: "Condition Out",
  conditionBack: "Condition Back",
  approvedBy: "Approved By",
  spaceName: "Space Name",
  capacity: "Capacity",
  fixedEquipment: "Fixed Equipment",
  serviceDate: "Service Date",
  space: "Space",
  serviceEventType: "Service or Event Type",
  soundChecked: "Sound Checked",
  lightsChecked: "Lights Checked",
  acChecked: "AC Checked",
  projectorChecked: "Projector Checked",
  chairsOrganized: "Chairs Organized",
  pulpitReady: "Pulpit Ready",
  camerasReady: "Cameras Ready",
  microphonesReady: "Microphones Ready",
  cleaningDone: "Cleaning Done",
  inventoryByCategory: "Inventory by Category",
  inventoryByStatus: "Inventory by Status",
  damagedItems: "Damaged Equipment",
  repairHistory: "Repair History",
  movementsByPeriod: "Movements by Period",
  checklistByWeek: "Service Checklist by Week",
  venueReports: "Reports",
  filterDepartment: "Filter by Department",
  filterDate: "Filter by Date",
  inventoryByCategory: "Inventory by Category",
  inventoryByStatus: "Inventory by Status",
  staffEquipmentReport: "Staff Assigned Equipment",
  damagedItemsReport: "Damaged Equipment",
  repairHistory: "Repair History",
  movementsByPeriod: "Movements by Period",
  newAcquisitionsByMonth: "New Acquisitions by Month",
  venueManagerRole: "Venue Manager",
  requestEquipment: "Request Equipment",
  receivedBy: "Received By",
  observations: "Notes",
  responsible: "Responsible",
  church: "Church",
  spaceType: "Space Type"
});

Object.assign(TEXT.en, {
  fevo: "F.E.V.O",
  fevoFull: "Follow-Up, Evangelism, Visitation and Prayer",
  fevoSubtitle: "Weekly rotating teams for follow-up, evangelism, visitation and prayer, coordinated by Sister Cassandra.",
  weeklyConfiguration: "Weekly Configuration",
  evangelism: "Evangelism",
  visitation: "Visitation",
  prayer: "Prayer",
  groupsWithoutReport: "Groups Without Report",
  weeklyReports: "Weekly Reports",
  analysis: "Analysis",
  team: "Team",
  teamA: "Team A",
  teamB: "Team B",
  teamC: "Team C",
  teamD: "Team D",
  activityType: "Activity Type",
  teamAActivity: "Team A Activity",
  teamBActivity: "Team B Activity",
  teamCActivity: "Team C Activity",
  teamDActivity: "Team D Activity",
  preparedBy: "Prepared By",
  groupName: "Group Name",
  numberOfCells: "Number of Cells",
  numberOfMembers: "Number of Members",
  leadersPresent: "Leaders Present",
  membersPresent: "Members Present",
  ftInChurch: "First Timers in Church",
  submittedReport: "Submitted Report",
  submittedAt: "Submitted At",
  soulsContacted: "Souls Contacted",
  feedbackCount: "Feedback Count",
  followupResult: "Follow-Up Result",
  nextAction: "Next Action",
  soulsEvangelized: "Souls Evangelized",
  materialsDistributed: "Materials Distributed",
  evangelismLocation: "Evangelism Location",
  soulsVisited: "Souls Visited",
  familyMembersReached: "Family Members Reached",
  visitLocation: "Visit Location",
  visitResult: "Visit Result",
  averageMembersPresent: "Average Members Present",
  daysOfPrayer: "Days of Prayer",
  prayerFocus: "Prayer Focus",
  prayerTestimonies: "Prayer Testimonies",
  reasonNotSubmitted: "Reason Not Submitted",
  followupAction: "Follow-Up Action",
  contactedBy: "Contacted By",
  totalGroups: "Total Groups",
  totalCells: "Total Cells",
  totalMembers: "Total Members",
  groupsNoReportThisWeek: "Groups Without Report This Week",
  recurringGroups: "Recurring Groups",
  resolved: "Resolved",
  activitiesByWeek: "Activities by Week",
  contactedByGroup: "Souls Contacted by Group",
  evangelizedByGroup: "Souls Evangelized by Group",
  visitedByGroup: "Visitation by Group",
  prayerDaysByTeam: "Prayer Days by Team",
  noReportByWeek: "Groups Without Report by Week",
  firstTimersByWeek: "First Timers by Week",
  exportPdf: "Export PDF",
  exportExcel: "Export Excel",
  submit: "Submit",
  approve: "Approve",
  review: "In Review",
  recurrent: "Recurring",
  sidebarCollapse: "Collapse menu",
  sidebarExpand: "Expand menu",
  navGroupToggle: "Toggle section",
  moduleNavToggle: "Toggle module menu",
  backToTop: "Back to top",
  cellAlecArea: "ALEC / Sister Angelica",
  cellMinistryArea: "Cell Ministry / Pastora Flavia",
  cellReportsArea: "Cell Reports / Sister Eduarda",
  cellAlecOverview: "ALEC Overview",
  cellMinistryOverview: "Overview",
  receivedReports: "Received Reports",
  cellPerformance: "Cell Performance",
  leadersAttention: "Leaders Needing Attention",
  actionPlan: "Action Plan",
  weeklyCellReport: "Weekly Report",
  cellGroups: "Cell Groups",
  cellCellsList: "Cells",
  consolidation: "Consolidation",
  totalGroupCells: "Total Cell Groups",
  viewCells: "View Cells",
  updateCellReport: "Update Report",
  needsReview: "Needs Review",
  importReview: "Imported names",
  growing: "Growing",
  inactive: "Inactive",
  cellName: "Cell Name",
  observation: "Observation",
  reportWeek: "July Week 1",
  responsibleArea: "Responsible Area",
  clearFilter: "Clear filter",
  filteredByGroup: "Filtered by group",
  actionOwner: "Owner",
  dueDate: "Due Date",
  recommendedActions: "Recommended Actions",
  totalChurches: "Total Churches",
  activeChurches: "Active Churches",
  onlineVirtualChurches: "Online / Virtual Churches",
  provincesCovered: "Provinces Covered",
  infoToConfirm: "Information to Confirm",
  publicName: "Public Name",
  districtOrArea: "District / Area",
  cityDistrict: "City/District",
  areaNeighborhood: "Area/Neighborhood",
  selectProvince: "Select province",
  selectCity: "Select city",
  selectChurch: "Select church",
  noChurchRegistered: "No church registered",
  addNewChurch: "Add new church",
  serviceTimesShort: "Service Times",
  phonePrimary: "Primary Phone",
  phoneSecondary: "Secondary Phone",
  serviceTimes: "Service Times",
  parentChurch: "Parent Church",
  informationStatus: "Information Status",
  socialNetworks: "Social Networks",
  cardsView: "Cards",
  tableView: "Table",
  churchTypeNational: "National HQ",
  churchTypeLocal: "Local Church",
  churchTypeOnline: "Online Church",
  churchTypeVirtual: "Virtual Church",
  churchTypeMission: "Group / Mission",
  toConfirm: "To Confirm",
  incomplete: "Incomplete",
  inPreparation: "In Preparation",
  filterProvince: "Filter by Province",
  filterCity: "Filter by City",
  filterType: "Filter by Type",
  filterInfoStatus: "Filter by Information Status",
  churchDetails: "Church Details",
  addChurch: "Add Church",
  editChurch: "Edit Church",
  updateChurchStatus: "Update Church Status",
  exportChurch: "Export Church",
  toBeConfirmed: "To be confirmed",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  applyGeneralDefault: "Apply General Default",
  applyHqDefault: "Apply HQ Default",
  addServiceTime: "Add Service Time",
  dayOfWeek: "Day of Week",
  serviceName: "Service Name",
  serviceTimeLabel: "Time",
  serviceType: "Service Type",
  serviceTypeInPerson: "In-person",
  serviceTypeOnline: "Online",
  serviceTypeHybrid: "Hybrid",
  remove: "Remove"
});

Object.assign(TEXT.en, {
  alecFull: "ALEC - Christ Embassy Leadership Academy",
  alecRegistration: "ALEC Registration",
  alecScores: "ALEC Scores",
  churchReports: "Church Reports",
  cellReports: "Cell Reports",
  cellEvaluation: "Evaluation",
  finalValidation: "Final Validation",
  totalAlecRegistered: "Total ALEC Registered",
  alreadyLeaders: "Already Leaders",
  didFoundationSchool: "Completed Foundation School",
  inTraining: "In Training",
  alecCompleted: "ALEC Completed",
  submittedReports: "Submitted Reports",
  pendingReportsShort: "Pending Reports",
  totalAttendance: "Total Attendance",
  totalFirstTime: "Total First Timers",
  totalNewConverts: "New Converts",
  totalOffering: "Total Offering",
  explosionCells: "Explosion Cells",
  attentionCells: "Cells Needing Attention",
  attendanceByWeek: "Attendance by Week",
  firstTimersByCell: "First Timers by Cell",
  newConvertsByCell: "New Converts by Cell",
  offeringByWeek: "Offering by Week",
  alecProgressByChurch: "ALEC Progress by Church",
  reportsByStatus: "Reports by Status",
  topCellsGrowth: "Top Cells by Growth",
  fullName: "Full Name",
  contact: "Contact",
  cellLeaderName: "Cell Leader Name",
  didFoundation: "Completed Foundation School",
  isLeader: "Is Leader",
  alecReason: "Reason for ALEC",
  phase1: "Phase 1",
  phase2: "Phase 2",
  finished: "Finished",
  certificateBandPaid: "Band and Certificate Paid",
  finalAverage: "Final Average",
  phase1Average: "Phase 1 Average",
  phase2Average: "Phase 2 Average",
  week: "Week",
  startDate: "Start Date",
  endDate: "End Date",
  worshipService: "Service",
  leaderTitle: "Leader Title",
  leaderName: "Leader Name",
  attendance: "Attendance",
  firstTimeShort: "First Timers",
  newConvertsShort: "New Converts",
  offering: "Offering",
  comments: "Comments",
  submittedBy: "Submitted By",
  evaluatedBy: "Evaluated By",
  validatedBy: "Validated By",
  actualLeader: "Current Leader",
  cameFromAlec: "Came from ALEC",
  alecFinished: "ALEC Finished",
  supervisor: "Supervisor",
  evaluator: "Evaluator",
  evaluationDate: "Evaluation Date",
  classification: "Classification",
  strengths: "Strengths",
  improvements: "Improvements",
  recommendedAction: "Recommended Action",
  needsFollowup: "Needs Follow-up",
  decision: "Decision",
  finalComment: "Final Comment",
  finalStatus: "Final Status",
  excellent: "Excellent",
  good: "Good",
  needsAttention: "Needs Attention",
  critical: "Critical",
  draft: "Draft",
  submitted: "Submitted",
  underEvaluation: "Under Evaluation",
  validated: "Validated",
  returned: "Returned",
  forwardValidation: "Forwarded to Validation",
  noReport: "No Report",
  readyToSplit: "Ready to Split",
  leaderSupport: "Leader Needs Support"
});

Object.assign(TEXT.en, {
  cellLeadership: "Cells & Leadership",
  cellOverview: "Overview",
  cellCells: "Cells",
  cellLeaders: "Leaders",
  cellReports: "Cell Reports",
  alec: "ALEC",
  prisonMinistry: "Prison Ministry",
  ministryMaterials: "Ministry Materials",
  prisonMinistrySubtitle: "Prison services, inmate follow-up and Foundation School inside mission locations.",
  materialsSubtitle: "Catalogue, sales, church distribution, weekly stock and free distribution funds.",
  activePrisons: "Active Prisons",
  activeStudents: "Active Students",
  servicesThisWeek: "Services This Week",
  inmatesReached: "Inmates Reached",
  prisonNewConverts: "New Converts",
  prisonFoundationStudents: "Foundation School Students",
  pendingReports: "Pending Reports",
  prisonsLocations: "Prisons / Locations",
  prisonServices: "Prison Services",
  weeklyAgenda: "Weekly Agenda",
  ministryReports: "Reports",
  prisonName: "Prison Name",
  province: "Province",
  city: "City",
  responsibleChurch: "Responsible Church",
  prisonRepresentative: "Prison Representative",
  representativeContact: "Representative Contact",
  observations: "Observations",
  weekday: "Weekday",
  prison: "Prison",
  responsibleLeader: "Responsible Leader",
  membersWent: "Members Who Went",
  inmatesPresent: "Inmates Present",
  interestedFoundation: "Interested in Foundation School",
  foundationClassGiven: "Foundation Class Given",
  topicMessage: "Topic or Message",
  participantName: "Participant Name",
  evangelismPractice: "Evangelism Practice",
  approved: "Approved",
  graduated: "Graduated",
  weekStart: "Week Start",
  weekEnd: "Week End",
  mondayAgenda: "Monday: Prepare Reports and Agenda",
  tuesdayPrayer: "Tuesday: Prayer Meeting",
  wednesdayFollowup: "Wednesday: Representative Follow-Up",
  thursdayService: "Thursday: Prison Service",
  fridayService: "Friday: Prison Service",
  weekendFollowup: "Saturday/Sunday: Follow-Up",
  responsible: "Responsible",
  soldThisMonth: "Total Sold This Month",
  quantitySold: "Quantity Sold",
  materialsInStock: "Materials in Stock",
  lowStockMaterials: "Low Stock Materials",
  pendingDistributions: "Pending Distributions",
  fundsRaised: "Funds Raised",
  catalogue: "Catalogue",
  sales: "Sales",
  churchDistribution: "Church Distribution",
  weeklyStock: "Weekly Stock",
  freeDistributionFunds: "Free Distribution Funds",
  materialTitle: "Material Title",
  materialType: "Type",
  authorOrigin: "Author / Origin",
  format: "Format",
  price: "Price",
  currentStock: "Current Stock",
  minimumStock: "Minimum Stock",
  reportWeek: "Report Week",
  buyer: "Buyer",
  paymentProof: "POP / Payment Proof",
  receivedBy: "Received By",
  destinationChurch: "Destination Church",
  distributionType: "Distribution Type",
  sentBy: "Sent By",
  openingStock: "Opening Stock",
  entries: "Entries",
  exits: "Exits",
  finalStock: "Final Stock",
  difference: "Difference",
  campaign: "Campaign",
  targetAmount: "Target Amount",
  raisedAmount: "Raised Amount",
  materialsToDistribute: "Materials to Distribute",
  beneficiaryChurches: "Beneficiary Churches",
  filterWeek: "Filter by Week",
  filterMaterial: "Filter by Material",
  filterPaymentMethod: "Payment Method",
  confirm: "Confirm",
  planned: "Planned",
  reportSubmitted: "Report Submitted",
  enrolled: "Enrolled",
  inPreparation: "In Preparation",
  confirmed: "Confirmed",
  available: "Available",
  outOfStock: "Out of Stock",
  discontinued: "Discontinued",
  paused: "Paused",
  requested: "Requested",
  approved: "Approved",
  sent: "Sent",
  received: "Received"
});

const CELL_NAV = {
  parentKey: "cellLeadership",
  areas: [
    {
      key: "cellAlecArea",
      label: "cellAlecArea",
      routes: [
        ["cellAlecOverview", "cellAlecOverview"],
        ["cellAlecRegistration", "alecRegistration"],
        ["cellAlecScores", "alecScores"],
        ["cellChurchReports", "churchReports"]
      ]
    },
    {
      key: "cellMinistryArea",
      label: "cellMinistryArea",
      routes: [
        ["cellMinistryOverview", "cellMinistryOverview"],
        ["cellReceivedReports", "receivedReports"],
        ["cellEvaluationRoute", "cellEvaluation"],
        ["cellPerformance", "cellPerformance"],
        ["cellLeadersAttention", "leadersAttention"],
        ["cellActionPlan", "actionPlan"]
      ]
    },
    {
      key: "cellReportsArea",
      label: "cellReportsArea",
      routes: [
        ["cellWeeklyReport", "weeklyCellReport"],
        ["cellGroups", "cellGroups"],
        ["cellCellsList", "cellCellsList"],
        ["cellLeadersRoute", "cellLeaders"],
        ["cellFinalValidation", "finalValidation"],
        ["cellConsolidation", "consolidation"]
      ]
    }
  ]
};

const CELL_TAB_ROUTES = new Set([
  ...CELL_NAV.areas.flatMap((area) => area.routes.map(([route]) => route)),
  "cell", "cellAlec", "cellAlecRegistration", "cellAlecScores",
  "cellChurchReports", "cellReportsRoute", "cellLeadersRoute",
  "cellEvaluationRoute", "cellFinalValidation", "cellWorkflowReports"
]);

const CELL_ROUTE_ALIASES = {
  cell: "cellAlecOverview",
  cellAlec: "cellAlecOverview",
  cellReportsRoute: "cellReceivedReports",
  cellWorkflowReports: "cellConsolidation"
};

let cellRegistryFilter = { groupId: null };

const FEVO_TAB_ROUTES = new Set([
  "fevo", "fevoConfigRoute", "fevoFollowUpRoute", "fevoEvangelismRoute",
  "fevoVisitationRoute", "fevoPrayerRoute", "fevoNoReportsRoute",
  "fevoWeeklyReportsRoute", "fevoAnalysisRoute"
]);

const VENUE_TAB_ROUTES = new Set([
  "venueInventory", "venueInventoryGeneral", "venueInventoryAcquisitions",
  "venueInventoryStaff", "venueInventoryMaintenance", "venueInventoryMovements",
  "venueInventorySpaces", "venueInventoryChecklist", "venueInventoryReports"
]);

const TAB_PARALLAX_ORDER = {
  cell: CELL_NAV.areas.flatMap((area) => area.routes.map(([route]) => route)),
  fevo: ["fevo", "fevoConfigRoute", "fevoFollowUpRoute", "fevoEvangelismRoute", "fevoVisitationRoute", "fevoPrayerRoute", "fevoNoReportsRoute", "fevoWeeklyReportsRoute", "fevoAnalysisRoute"],
  venue: ["venueInventory", "venueInventoryGeneral", "venueInventoryAcquisitions", "venueInventoryStaff", "venueInventoryMaintenance", "venueInventoryMovements", "venueInventorySpaces", "venueInventoryChecklist", "venueInventoryReports"]
};

let tabParallaxState = { family: null, index: -1 };

function tabParallaxFamily(route) {
  if (CELL_TAB_ROUTES.has(route)) return "cell";
  if (FEVO_TAB_ROUTES.has(route)) return "fevo";
  if (VENUE_TAB_ROUTES.has(route)) return "venue";
  return null;
}

function tabParallaxDirection(route) {
  const family = tabParallaxFamily(route);
  if (!family) return "none";
  const order = TAB_PARALLAX_ORDER[family];
  const index = order.indexOf(route);
  if (index < 0) return "none";
  const prevIndex = tabParallaxState.family === family ? tabParallaxState.index : index;
  tabParallaxState = { family, index };
  if (index > prevIndex) return "forward";
  if (index < prevIndex) return "back";
  return "none";
}

function tabParallaxWrap(bodyHtml, route) {
  const family = tabParallaxFamily(route);
  if (!family) return bodyHtml;
  const direction = tabParallaxDirection(route);
  return `
    <div class="tab-parallax-stage" data-parallax-dir="${direction}">
      <div class="tab-parallax-bg" aria-hidden="true">
        <span class="tab-parallax-orb tab-parallax-orb-a"></span>
        <span class="tab-parallax-orb tab-parallax-orb-b"></span>
      </div>
      <div class="tab-parallax-layer is-entering">${bodyHtml}</div>
    </div>`;
}

function triggerTabParallax() {
  const layer = byId("content")?.querySelector(".tab-parallax-layer.is-entering");
  if (!layer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    layer.classList.remove("is-entering");
    return;
  }
  requestAnimationFrame(() => {
    layer.classList.add("is-animating");
    layer.addEventListener("animationend", () => layer.classList.remove("is-entering", "is-animating"), { once: true });
  });
}

function triggerScrollTabParallax(targetId) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = targetId === "content" ? byId("content") : byId(targetId);
  if (!target) return;
  const panel = targetId === "content"
    ? target.querySelector(".tab-parallax-layer, .row")
    : target.closest(".panel, .col-12, article") || target;
  if (!panel) return;
  panel.classList.remove("panel-parallax-enter");
  void panel.offsetWidth;
  panel.classList.add("panel-parallax-enter");
  panel.addEventListener("animationend", () => panel.classList.remove("panel-parallax-enter"), { once: true });
}

function isModuleTabRoute(route) {
  return CELL_TAB_ROUTES.has(route) || FEVO_TAB_ROUTES.has(route) || VENUE_TAB_ROUTES.has(route);
}

const NAV_GROUPS = [
  { key: "main", items: [["dashboard", "bi-speedometer2", "dashboard"], ["churches", "bi-building", "churches"], ["members", "bi-people", "members"], ["firstTimers", "bi-person-heart", "firstTimers"], ["followUp", "bi-telephone-outbound", "followUp"], ["reports", "bi-bar-chart-line", "reports"]] },
  { key: "departments", items: [["counseling", "bi-chat-heart", "counseling"], ["foundation", "bi-mortarboard", "foundationSchool"], ["finance", "bi-cash-coin", "finance"], ["requisitions", "bi-clipboard-check", "requisitions"], ["fevo", "bi-compass", "fevo"], ["venueInventory", "bi-box-seam", "venueInventoryShort"], ["sacraments", "bi-droplet", "sacraments"], ["cellPrison", "bi-shield-lock", "prisonMinistry"], ["cellMaterials", "bi-journal-richtext", "ministryMaterials"], ["programs", "bi-calendar-event", "programs"], ["partnership", "bi-stars", "partnership"], ["media", "bi-broadcast", "media"]] },
  { key: "admin", items: [["staffHr", "bi-people-fill", "staffHr"], ["users", "bi-person-lock", "usersRoles"], ["access", "bi-shield-lock", "accessControl"], ["settings", "bi-gear", "settings"], ["audit", "bi-journal-check", "auditLogs"]] }
];

const followupStatuses = ["Pending", "Contacted", "No Answer", "Interested", "Sent to Cell", "Enrolled in Foundation School", "Became Member", "Closed"];
const memberStatuses = ["Active", "Inactive", "In Progress", "Transferred"];
const FINANCE_STATUS_PENDING = "Pendente de Verificação";
const FINANCE_STATUS_VERIFIED = "Verificado";
const FINANCE_STATUS_REJECTED = "Rejeitado";
const FINANCE_STATUS_INCLUDED = "Incluído no Relatório";
const financeStatuses = [FINANCE_STATUS_PENDING, FINANCE_STATUS_VERIFIED, FINANCE_STATUS_REJECTED, FINANCE_STATUS_INCLUDED];
const foundationStatuses = ["Inscrito", "Em Curso", "Pronto para Exame", "Aprovado", "Graduado", "Certificado Emitido"];
const FOUNDATION_STATUS_MAP = {
  "Pending Enrolment": "Inscrito",
  Enrolled: "Inscrito",
  "In Progress": "Em Curso",
  "Exam Ready": "Pronto para Exame",
  Passed: "Aprovado",
  Graduated: "Graduado",
  "Certificate Issued": "Certificado Emitido"
};
const givingCategories = [
  "Dízimo", "Ofertas", "Acção de Graças", "Primícias", "Semente de Fé", "Ofertas Especiais", "Outros",
  "Escola de Cura", "Rapsódia de Realidades", "Loveworld SAT", "Construtores de Visão",
  "Missões de Cidades do Interior", "Alcançar Moçambique", "Projecto da Igreja",
  "Projecto de Construção de Igreja", "Rapsódias das Crianças", "Mandato de Célula", "Outros Braços"
];
const paymentMethods = ["Dinheiro", "Cheque", "M-Pesa", "E-Mola", "Banco"];
const serviceOptions = ["Domingo Manhã", "Domingo Tarde", "Quarta-Feira", "Sexta-Feira", "Programa Especial"];
const treatmentOptions = ["Sr.", "Sra.", "Irmão", "Irmã", "Pastor", "Pastora", "Diácono", "Diaconisa"];

const prisonStatusOptions = ["Activo", "Inactivo"];
const prisonServiceStatuses = ["Planeado", "Realizado", "Cancelado", "Relatório Submetido"];
const prisonFoundationStatuses = ["Inscrito", "Em Curso", "Exame", "Graduado", "Certificado Emitido"];
const prisonAgendaStatuses = ["Em Preparação", "Confirmado", "Concluído"];
const materialStatuses = ["Disponível", "Esgotado", "Descontinuado"];
const materialSalesStatuses = ["Pendente", "Confirmado", "Rejeitado"];
const distributionStatuses = ["Solicitado", "Aprovado", "Enviado", "Recebido"];
const fundStatuses = ["Activa", "Concluída", "Pausada"];
const materialTypes = ["Livro", "Rapsódia", "Áudio", "Vídeo", "Manual", "Outro"];
const materialFormats = ["Físico", "Digital"];
const distributionTypes = ["Venda", "Distribuição Gratuita", "Missões"];
const alecRegistrationStatuses = ["Activo", "Em Formação", "Concluído", "Inactivo"];
const alecScoreStatuses = ["Em Curso", "Terminou", "Pendente de Pagamento", "Certificado Emitido"];
const churchReportStatuses = ["Rascunho", "Submetido", "Em Avaliação", "Aprovado", "Rejeitado"];
const cellReportStatuses = ["Rascunho", "Submetido", "Em Avaliação", "Aprovado", "Rejeitado", "Validado"];
const cellLeaderStatuses = ["Activo", "Em Treinamento", "Pendente", "Inactivo"];
const evaluationStatuses = ["Em Avaliação", "Aprovado", "Rejeitado", "Encaminhado para Validação"];
const validationStatuses = ["Validado", "Pendente", "Devolvido", "Rejeitado"];
const classifications = ["Excelente", "Bom", "Precisa de Atenção", "Crítico"];
const fevoActivities = ["Follow-Up", "Evangelização", "Visitação", "Oração"];
const fevoTeams = ["Team A", "Team B", "Team C", "Team D"];
const fevoConfigStatuses = ["Rascunho", "Activo", "Fechado"];
const fevoReportStatuses = ["Rascunho", "Submetido", "Em Revisão", "Aprovado", "Rejeitado"];
const fevoNoReportStatuses = ["Pendente", "Contactado", "Resolvido", "Reincidente"];
const inventoryCategories = ["Som", "Media", "Luzes", "Instrumentos", "AC / Climatização", "Energia", "Mobiliário", "Decoração", "Escritório", "Informática", "Limpeza", "Outros"];
const inventoryStatuses = ["Bom", "Mau", "Em Reparação", "Perdido", "Descontinuado"];
const repairStatuses = ["Pendente", "Em Reparação", "Reparado", "Irrecuperável"];
const movementStatuses = ["Solicitado", "Aprovado", "Em Uso", "Devolvido", "Atrasado", "Recusado"];
const venueTypes = ["Auditório", "Sala", "Escritório", "Estúdio", "Armazém", "Outro"];
const venueStatuses = ["Activo", "Indisponível", "Em Manutenção"];
const checklistStatuses = ["Pendente", "Parcial", "Pronto"];

const __cellSeed = typeof buildCellGroupsSeed === "function" ? buildCellGroupsSeed() : { cellGroups: [], cellRegistry: [] };

const seedData = {
  users: [
    { id: "u-1", name: "Admin Principal", email: "admin@ce-mozambique.org", role: "Super Admin", church_id: "church-hq", department_permissions: ["*"], can_view_all_churches: true },
    { id: "u-2", name: "Líder de Aconselhamento", email: "aconselhamento@ce-mozambique.org", role: "Counselor", church_id: "church-hq", department_permissions: ["counseling", "firstTimers", "followUp"], can_view_all_churches: false },
    { id: "u-3", name: "Sister Janet Marquele", email: "janet.marquele@ce-mozambique.org", role: "Ministry Coordinator", church_id: "church-hq", department_permissions: ["cell", "prisonMinistry", "ministryMaterials"], can_view_all_churches: true },
    { id: "u-4", name: "Sister Angelica", email: "angelica@ce-mozambique.org", role: "ALEC Coordinator", church_id: "church-hq", department_permissions: ["cell", "alecRegistration", "alecScores", "churchReports"], can_view_all_churches: true },
    { id: "u-5", name: "Pastora Flavia", email: "flavia@ce-mozambique.org", role: "Cell Ministry Head", church_id: "church-hq", department_permissions: ["cell", "cellReports", "cellEvaluation"], can_view_all_churches: true },
    { id: "u-6", name: "Sister Eduarda", email: "eduarda@ce-mozambique.org", role: "Final Coordinator", church_id: "church-hq", department_permissions: ["cell", "finalValidation", "reports"], can_view_all_churches: true },
    { id: "u-7", name: "Cell Leader Demo", email: "cellleader@ce-mozambique.org", role: "Cell Leader", church_id: "church-hq", department_permissions: ["cellReports"], can_view_all_churches: false, assigned_cells: ["cell-1"] },
    { id: "u-8", name: "Pastor da Igreja", email: "pastor.branch@ce-mozambique.org", role: "Church Pastor", church_id: "church-hq", department_permissions: ["cell", "churchReports", "cellReports", "fevo", "venueInventory"], can_view_all_churches: false },
    { id: "u-9", name: "Sister Cassandra", email: "cassandra@ce-mozambique.org", role: "F.E.V.O Coordinator", church_id: "church-hq", department_permissions: ["fevo", "fevoConfig", "fevoReports", "fevoAnalytics"], can_view_all_churches: true },
    { id: "u-10", name: "F.E.V.O Team Leader", email: "fevo.leader@ce-mozambique.org", role: "F.E.V.O Team Leader", church_id: "church-hq", department_permissions: ["fevoReports"], can_view_all_churches: false, assigned_teams: ["Team A"], assigned_groups: ["Group Central"] },
    { id: "u-11", name: "Marcelo Panguene", email: "marcelo.panguene@ce-mozambique.org", role: "Venue Manager", church_id: "church-hq", department_permissions: ["venueInventory", "inventory", "venues", "maintenance", "checklists"], can_view_all_churches: true },
    { id: "u-12", name: "Department Head Demo", email: "department.head@ce-mozambique.org", role: "Department Head", church_id: "church-hq", department_permissions: ["venueInventoryRequests", "venueInventory"], assigned_department: "Cell Ministry", can_view_all_churches: false },
    { id: "u-13", name: "Staff Member Demo", email: "staff.member@ce-mozambique.org", role: "Staff Member", church_id: "church-hq", department_permissions: ["assignedEquipment"], assigned_staff_name: "Laiza Teresa Chirindza", can_view_all_churches: false },
    { id: "u-14", name: "Finance Officer Demo", email: "finance.officer@ce-mozambique.org", role: "Finance Officer", church_id: "church-hq", department_permissions: ["finance", "financeOfficer"], can_view_all_churches: false },
    { id: "u-15", name: "Finance Head Demo", email: "finance.head@ce-mozambique.org", role: "Finance Head", church_id: "church-hq", department_permissions: ["finance", "financeHead", "financeVerify", "reports"], can_view_all_churches: true },
    { id: "u-16", name: "Finance Viewer Demo", email: "finance.viewer@ce-mozambique.org", role: "Viewer", church_id: "church-hq", department_permissions: ["financeViewer", "reports"], can_view_all_churches: true },
    { id: "u-17", name: "Pastor Kene Ume", email: "pastor.kene@ce-mozambique.org", role: "Main Pastor", church_id: "church-hq", department_permissions: ["reports", "requisitions", "staffHr", "finance"], can_view_all_churches: true },
    { id: "u-18", name: "Pastora Responsável Requisições", email: "requisitions@ce-mozambique.org", role: "Requisition Officer", church_id: "church-hq", department_permissions: ["requisitions"], can_view_all_churches: true },
    { id: "u-19", name: "Gestora de RH", email: "hr@ce-mozambique.org", role: "HR Manager", church_id: "church-hq", department_permissions: ["staffHr"], can_view_all_churches: true }
  ],
  departments: [
    { id: "dept-finance", church_id: "church-hq", name: "Finanças", lead_name: "Finance Head Demo" },
    { id: "dept-cell", church_id: "church-hq", name: "Ministério de Células", lead_name: "Pastora Flavia" },
    { id: "dept-media", church_id: "church-hq", name: "Media", lead_name: "Media Team" },
    { id: "dept-venue", church_id: "church-hq", name: "Venue Management", lead_name: "Marcelo Panguene" },
    { id: "dept-programs", church_id: "church-hq", name: "Programas", lead_name: "Programs Team" }
  ],
  requisitions: [
    { id: "req-1", request_number: "REQ-2026-0001", requested_by_user_id: "u-12", requested_by_name: "Department Head Demo", department_id: "dept-cell", department_name: "Cell Ministry", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Material de Ministério", title: "Materiais para Escola de Células", description: "Livros, manuais e apostilas para formação de líderes.", justification: "Preparação do trimestre de liderança celular.", estimated_amount: 18500, currency: "MZN", urgency: "Normal", needed_by_date: "2026-08-01", attachments: [], supplier_or_vendor: "Loveworld Books", quotation_number: "QT-2026-014", reviewed_by: "", reviewed_at: "", review_notes: "", sent_to_main_pastor_at: "", approved_by: "", approved_at: "", approval_notes: "", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "", resources_released_at: "", amount_released: 0, finance_record_id: "", inventory_item_id: "", status: "Submetido", created_at: "2026-07-08T10:00:00.000Z", updated_at: "2026-07-08T10:00:00.000Z" },
    { id: "req-2", request_number: "REQ-2026-0002", requested_by_user_id: "u-13", requested_by_name: "Staff Member Demo", department_id: "dept-finance", department_name: "Finanças", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Apoio Operacional", title: "Material de escritório para Finanças", description: "Papel A4, pastas e toners para impressão de relatórios.", justification: "Reposição de consumíveis do departamento.", estimated_amount: 4200, currency: "MZN", urgency: "Baixa", needed_by_date: "2026-07-20", attachments: [], supplier_or_vendor: "Office Supply Maputo", quotation_number: "", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-09T11:00:00.000Z", review_notes: "Organizado e encaminhado.", sent_to_main_pastor_at: "", approved_by: "", approved_at: "", approval_notes: "", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "", resources_released_at: "", amount_released: 0, finance_record_id: "", inventory_item_id: "", status: "Em Revisão", created_at: "2026-07-07T09:00:00.000Z", updated_at: "2026-07-09T11:00:00.000Z" },
    { id: "req-3", request_number: "REQ-2026-0003", requested_by_user_id: "u-5", requested_by_name: "Pastora Flavia", department_id: "dept-cell", department_name: "Ministério de Células", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Transporte", title: "Transporte para visitação celular — Beira", description: "Deslocação da equipa nacional para apoio à rede de Beira.", justification: "Visita pastoral e formação de líderes.", estimated_amount: 28000, currency: "MZN", urgency: "Alta", needed_by_date: "2026-07-25", attachments: [{ type: "budget", name: "Orcamento-Beira.pdf" }, { type: "proforma", name: "Proforma-Transporte.pdf" }], supplier_or_vendor: "Transporte CE", quotation_number: "QT-2026-021", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-10T08:00:00.000Z", review_notes: "Prioridade confirmada com Pastor Principal.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-07-10T09:00:00.000Z", approved_by: "", approved_at: "", approval_notes: "", rejected_by: "", rejected_at: "", rejection_reason: "", returned_by: "", returned_at: "", return_notes: "", resources_released_by: "", resources_released_at: "", amount_released: 0, finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Enviado ao Pastor Principal", created_at: "2026-07-05T14:00:00.000Z", updated_at: "2026-07-10T09:00:00.000Z" },
    { id: "req-4", request_number: "REQ-2026-0004", requested_by_user_id: "u-11", requested_by_name: "Marcelo Panguene", department_id: "dept-venue", department_name: "Venue Management", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Nova Aquisição", title: "Microfones sem fio adicionais", description: "Compra de 4 microfones BMK ES600 para cultos simultâneos.", justification: "Expansão do auditório e culto online.", estimated_amount: 74000, currency: "MZN", urgency: "Normal", needed_by_date: "2026-08-10", attachments: [], supplier_or_vendor: "Audio Supplier", quotation_number: "QT-2026-033", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-01T10:00:00.000Z", review_notes: "Aprovado para compra após verificação técnica.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-07-02T10:00:00.000Z", approved_by: "Pastor Kene Ume", approved_by_user_id: "u-17", approved_at: "2026-07-03T10:00:00.000Z", approved_amount: 74000, approval_notes: "Autorizado — prioridade media.", final_priority: "Normal", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "Finance Head Demo", released_by: "Finance Head Demo", resources_released_at: "2026-07-04T15:00:00.000Z", released_at: "2026-07-04T15:00:00.000Z", released_amount: 74000, amount_released: 74000, finance_status: "Recursos Liberados", sent_to_finance: true, sent_to_finance_at: "2026-07-03T10:00:00.000Z", finance_disbursement_id: "disb-req-4", payment_method: "Banco", payment_reference: "TRF-2026-044", payment_notes: "Transferência bancária aprovada.", finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Recursos Liberados", created_at: "2026-06-28T08:00:00.000Z", updated_at: "2026-07-04T15:00:00.000Z" },
    { id: "req-5", request_number: "REQ-2026-0005", requested_by_user_id: "u-9", requested_by_name: "Sister Cassandra", department_id: "dept-programs", department_name: "Programas", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Evento/Programa", title: "Apoio logístico — Semana F.E.V.O", description: "Material de evangelização, transporte e refeições para equipas.", justification: "Semana intensiva de F.E.V.O nacional.", estimated_amount: 52000, currency: "MZN", urgency: "Urgente", needed_by_date: "2026-07-15", attachments: [{ type: "budget", name: "Orcamento-FEVO.xlsx" }], supplier_or_vendor: "", quotation_number: "", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-11T09:00:00.000Z", review_notes: "Encaminhado ao Pastor Principal.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-07-11T10:00:00.000Z", approved_by: "", approved_at: "", approval_notes: "", rejected_by: "", rejected_at: "", rejection_reason: "", returned_by: "", returned_at: "", return_notes: "", resources_released_by: "", resources_released_at: "", amount_released: 0, finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Enviado ao Pastor Principal", created_at: "2026-07-09T12:00:00.000Z", updated_at: "2026-07-11T10:00:00.000Z" },
    { id: "req-8", request_number: "REQ-2026-0008", requested_by_user_id: "u-12", requested_by_name: "Department Head Demo", department_id: "dept-cell", department_name: "Cell Ministry", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Material de Ministério", title: "Banners e material gráfico para evangelização", description: "Impressão de banners roll-up e flyers para campanha de Julho.", justification: "Campanha de evangelização nas células.", estimated_amount: 16500, currency: "MZN", urgency: "Alta", needed_by_date: "2026-07-18", attachments: [], supplier_or_vendor: "Print House", quotation_number: "QT-2026-040", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-08T10:00:00.000Z", review_notes: "Aprovado internamente.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-07-08T11:00:00.000Z", approved_by: "Pastor Kene Ume", approved_by_user_id: "u-17", approved_at: "2026-07-09T14:00:00.000Z", approved_amount: 15000, approval_notes: "Aprovado com limite de 15.000 MZN.", final_priority: "Alta", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "", resources_released_at: "", released_amount: 0, amount_released: 0, finance_status: "Aguardando Liberação", sent_to_finance: true, sent_to_finance_at: "2026-07-09T14:00:00.000Z", finance_disbursement_id: "disb-req-8", payment_method: "", payment_reference: "", payment_notes: "", finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Aprovado — Aguardando Liberação de Recursos", created_at: "2026-07-06T08:00:00.000Z", updated_at: "2026-07-09T14:00:00.000Z" },
    { id: "req-6", request_number: "REQ-2026-0006", requested_by_user_id: "u-14", requested_by_name: "Finance Officer Demo", department_id: "dept-finance", department_name: "Finanças", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Pagamento de Serviço", title: "Auditoria externa trimestral", description: "Serviço de revisão de registos financeiros Q2.", justification: "Conformidade e transparência.", estimated_amount: 35000, currency: "MZN", urgency: "Normal", needed_by_date: "2026-07-30", attachments: [], supplier_or_vendor: "Audit Partners Lda", quotation_number: "QT-AUD-02", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-06T10:00:00.000Z", review_notes: "Não prioritário neste momento.", sent_to_main_pastor_at: "2026-07-06T11:00:00.000Z", approved_by: "", approved_at: "", approval_notes: "", rejected_by: "Pastor Kene Ume", rejected_at: "2026-07-07T09:00:00.000Z", rejection_reason: "Adiar para o próximo trimestre.", resources_released_by: "", resources_released_at: "", amount_released: 0, finance_record_id: "", inventory_item_id: "", status: "Rejeitado", created_at: "2026-07-04T08:00:00.000Z", updated_at: "2026-07-07T09:00:00.000Z" },
    { id: "req-9", request_number: "REQ-2026-0009", requested_by_user_id: "u-8", requested_by_name: "Pastor da Igreja", department_id: "dept-media", department_name: "Media", church_id: "church-matola", church_name: "Igreja Embaixada de Cristo Matola", requisition_type: "Equipamento", title: "Câmaras adicionais para transmissão", description: "Duas câmaras PTZ para melhorar transmissão dos cultos em Matola.", justification: "Expansão do ministério de media local.", estimated_amount: 48000, currency: "MZN", urgency: "Normal", needed_by_date: "2026-07-28", attachments: [], supplier_or_vendor: "AV Supplier", quotation_number: "QT-AV-12", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-06-25T10:00:00.000Z", review_notes: "Aprovado internamente.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-06-26T10:00:00.000Z", approved_by: "Pastor Kene Ume", approved_by_user_id: "u-17", approved_at: "2026-06-27T10:00:00.000Z", approved_amount: 45000, approval_notes: "Aprovado parcialmente até 45.000 MZN.", final_priority: "Normal", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "Finance Head Demo", released_by: "Finance Head Demo", resources_released_at: "2026-07-01T10:00:00.000Z", released_at: "2026-07-01T10:00:00.000Z", released_amount: 25000, amount_released: 25000, finance_status: "Parcialmente Pago", sent_to_finance: true, sent_to_finance_at: "2026-06-27T10:00:00.000Z", finance_disbursement_id: "disb-req-9", payment_method: "Banco", payment_reference: "TRF-AV-01", payment_notes: "Primeira tranche de pagamento.", finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Aprovado — Aguardando Liberação de Recursos", created_at: "2026-06-20T08:00:00.000Z", updated_at: "2026-07-01T10:00:00.000Z" },
    { id: "req-10", request_number: "REQ-2026-0010", requested_by_user_id: "u-3", requested_by_name: "Sister Janet Marquele", department_id: "dept-programs", department_name: "Programas", church_id: "church-beira", church_name: "Igreja Embaixada de Cristo Beira", requisition_type: "Transporte", title: "Transporte para conferência regional — Beira", description: "Deslocação de equipa de apoio para conferência em Beira.", justification: "Apoio ao evento regional de Julho.", estimated_amount: 22000, currency: "MZN", urgency: "Alta", needed_by_date: "2026-07-22", attachments: [], supplier_or_vendor: "Transporte CE", quotation_number: "QT-BR-03", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-07-07T10:00:00.000Z", review_notes: "Encaminhado.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-07-07T11:00:00.000Z", approved_by: "Pastor Kene Ume", approved_by_user_id: "u-17", approved_at: "2026-07-08T09:00:00.000Z", approved_amount: 20000, approval_notes: "Aprovado com tecto de 20.000 MZN.", final_priority: "Alta", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "", resources_released_at: "", released_amount: 0, amount_released: 0, finance_status: "Aguardando Liberação", sent_to_finance: true, sent_to_finance_at: "2026-07-08T09:00:00.000Z", finance_disbursement_id: "disb-req-10", payment_method: "", payment_reference: "", payment_notes: "", finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Aprovado — Aguardando Liberação de Recursos", created_at: "2026-07-04T08:00:00.000Z", updated_at: "2026-07-08T09:00:00.000Z" },
    { id: "req-11", request_number: "REQ-2026-0011", requested_by_user_id: "u-4", requested_by_name: "Sister Angelica", department_id: "dept-cell", department_name: "Ministério de Células", church_id: "church-nampula", church_name: "Igreja Embaixada de Cristo Nampula", requisition_type: "Material de Ministério", title: "Manuais e apostilas — Escola de Células Nampula", description: "Material impresso para formação de líderes de célula.", justification: "Formação trimestral em Nampula.", estimated_amount: 12000, currency: "MZN", urgency: "Normal", needed_by_date: "2026-08-05", attachments: [], supplier_or_vendor: "Print Nampula", quotation_number: "QT-NPL-07", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-06-15T10:00:00.000Z", review_notes: "OK.", sent_to_main_pastor_by: "Pastora Responsável Requisições", sent_to_main_pastor_at: "2026-06-16T10:00:00.000Z", approved_by: "Pastor Kene Ume", approved_by_user_id: "u-17", approved_at: "2026-06-17T10:00:00.000Z", approved_amount: 12000, approval_notes: "Aprovado.", final_priority: "Normal", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "Finance Head Demo", released_by: "Finance Head Demo", resources_released_at: "2026-06-18T10:00:00.000Z", released_at: "2026-06-18T10:00:00.000Z", released_amount: 12000, amount_released: 12000, finance_status: "Recursos Liberados", sent_to_finance: true, sent_to_finance_at: "2026-06-17T10:00:00.000Z", finance_disbursement_id: "disb-req-11", payment_method: "M-Pesa", payment_reference: "MP-NPL-07", payment_notes: "", finance_record_id: "", inventory_item_id: "", audit_history: [], status: "Recursos Liberados", created_at: "2026-06-10T08:00:00.000Z", updated_at: "2026-06-18T10:00:00.000Z" },
    { id: "req-7", request_number: "REQ-2026-0007", requested_by_user_id: "u-11", requested_by_name: "Marcelo Panguene", department_id: "dept-venue", department_name: "Venue Management", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", requisition_type: "Equipamento", title: "Laptop para técnico de som", description: "Laptop dedicado para software de som digital.", justification: "Substituição de equipamento antigo.", estimated_amount: 62000, currency: "MZN", urgency: "Normal", needed_by_date: "2026-06-30", attachments: [], supplier_or_vendor: "IT Supplier", quotation_number: "QT-IT-08", reviewed_by: "Pastora Responsável Requisições", reviewed_at: "2026-06-20T10:00:00.000Z", review_notes: "Compra concluída e registada.", sent_to_main_pastor_at: "2026-06-21T10:00:00.000Z", approved_by: "Pastor Kene Ume", approved_at: "2026-06-22", approval_notes: "Aprovado.", rejected_by: "", rejected_at: "", rejection_reason: "", resources_released_by: "Finance Head Demo", released_by: "Finance Head Demo", resources_released_at: "2026-06-23T10:00:00.000Z", released_at: "2026-06-23T10:00:00.000Z", released_amount: 62000, amount_released: 62000, finance_status: "Pago", sent_to_finance: true, sent_to_finance_at: "2026-06-22T10:00:00.000Z", finance_disbursement_id: "disb-req-7", payment_method: "Banco", payment_reference: "TRF-IT-07", finance_record_id: "", inventory_item_id: "inv-req-req-7", status: "Fechado", created_at: "2026-06-15T08:00:00.000Z", updated_at: "2026-06-28T10:00:00.000Z" }
  ],
  financeDisbursements: [
    { id: "disb-req-8", requisition_id: "req-8", request_number: "REQ-2026-0008", title: "Banners e material gráfico para evangelização", department_name: "Cell Ministry", church_name: "National HQ - Christ Embassy Mozambique", requested_by: "Department Head Demo", approved_by: "Pastor Kene Ume", approved_at: "2026-07-09T14:00:00.000Z", approved_amount: 15000, released_amount: 0, status: "Aguardando Liberação", source: "requisition", transaction_type: "expense", created_at: "2026-07-09T14:00:00.000Z", updated_at: "2026-07-09T14:00:00.000Z" },
    { id: "disb-req-4", requisition_id: "req-4", request_number: "REQ-2026-0004", title: "Microfones sem fio adicionais", department_name: "Venue Management", church_name: "National HQ - Christ Embassy Mozambique", requested_by: "Marcelo Panguene", approved_by: "Pastor Kene Ume", approved_at: "2026-07-03T10:00:00.000Z", approved_amount: 74000, released_amount: 74000, released_by: "Finance Head Demo", released_at: "2026-07-04T15:00:00.000Z", payment_method: "Banco", payment_reference: "TRF-2026-044", status: "Recursos Liberados", source: "requisition", transaction_type: "expense", created_at: "2026-07-03T10:00:00.000Z", updated_at: "2026-07-04T15:00:00.000Z" },
    { id: "disb-req-9", requisition_id: "req-9", request_number: "REQ-2026-0009", title: "Câmaras adicionais para transmissão", department_name: "Media", church_name: "Igreja Embaixada de Cristo Matola", requested_by: "Pastor da Igreja", approved_by: "Pastor Kene Ume", approved_at: "2026-06-27T10:00:00.000Z", approved_amount: 45000, released_amount: 25000, released_by: "Finance Head Demo", released_at: "2026-07-01T10:00:00.000Z", payment_method: "Banco", payment_reference: "TRF-AV-01", status: "Parcialmente Pago", source: "requisition", transaction_type: "expense", created_at: "2026-06-27T10:00:00.000Z", updated_at: "2026-07-01T10:00:00.000Z" },
    { id: "disb-req-10", requisition_id: "req-10", request_number: "REQ-2026-0010", title: "Transporte para conferência regional — Beira", department_name: "Programas", church_name: "Igreja Embaixada de Cristo Beira", requested_by: "Sister Janet Marquele", approved_by: "Pastor Kene Ume", approved_at: "2026-07-08T09:00:00.000Z", approved_amount: 20000, released_amount: 0, status: "Aguardando Liberação", source: "requisition", transaction_type: "expense", created_at: "2026-07-08T09:00:00.000Z", updated_at: "2026-07-08T09:00:00.000Z" },
    { id: "disb-req-11", requisition_id: "req-11", request_number: "REQ-2026-0011", title: "Manuais e apostilas — Escola de Células Nampula", department_name: "Ministério de Células", church_name: "Igreja Embaixada de Cristo Nampula", requested_by: "Sister Angelica", approved_by: "Pastor Kene Ume", approved_at: "2026-06-17T10:00:00.000Z", approved_amount: 12000, released_amount: 12000, released_by: "Finance Head Demo", released_at: "2026-06-18T10:00:00.000Z", payment_method: "M-Pesa", payment_reference: "MP-NPL-07", status: "Recursos Liberados", source: "requisition", transaction_type: "expense", created_at: "2026-06-17T10:00:00.000Z", updated_at: "2026-06-18T10:00:00.000Z" }
  ],
  staffProfiles: [
    { id: "staff-1", user_id: "u-5", full_name: "Flavia Moneedi Tivane", title: "Pastora", gender: "Feminino", phone: "860000101", whatsapp: "860000101", email: "flavia@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-cell", department_name: "Ministério de Células", role_title: "Cell Ministry Head", supervisor_user_id: "u-17", supervisor_name: "Pastor Kene Ume", start_date: "2024-01-15", employment_type: "Full-time", salary_or_allowance: 45000, payment_frequency: "Mensal", payment_method: "Banco", bank_name: "BCI", bank_account_number: "****4521", bank_or_mobile_details: "BCI ****4521", marital_status: "Casado/a", address: "Maputo, KaMpfumo", contract_start_date: "2024-01-15", status: "Activo", date_of_birth: "1990-03-14", notes: "", created_at: "2024-01-15", updated_at: "2026-07-10" },
    { id: "staff-2", user_id: "u-4", full_name: "Angelica Amilcar Macuacua", title: "Irmã", gender: "Feminino", phone: "860000102", whatsapp: "860000102", email: "angelica@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-cell", department_name: "Ministério de Células", role_title: "ALEC Coordinator", supervisor_user_id: "u-5", supervisor_name: "Pastora Flavia", start_date: "2023-06-01", employment_type: "Full-time", salary_or_allowance: 38000, payment_frequency: "Mensal", payment_method: "M-Pesa", mobile_money_number: "860000102", bank_or_mobile_details: "86XXXXXXX", marital_status: "Solteiro/a", address: "Matola, Moçambique", status: "Activo", date_of_birth: "1992-07-22", notes: "", created_at: "2023-06-01", updated_at: "2026-07-10" },
    { id: "staff-3", user_id: "u-11", full_name: "Marcelo Moises Panguene", title: "Irmão", gender: "Masculino", phone: "860000103", whatsapp: "860000103", email: "marcelo.panguene@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-venue", department_name: "Venue Management", role_title: "Venue Manager", supervisor_user_id: "u-17", supervisor_name: "Pastor Kene Ume", start_date: "2022-11-01", employment_type: "Full-time", salary_or_allowance: 52000, payment_frequency: "Mensal", payment_method: "Banco", bank_name: "BCI", bank_account_number: "****8832", bank_or_mobile_details: "BCI ****8832", marital_status: "Casado/a", address: "Maputo, Moçambique", emergency_contact_name: "Maria Panguene", emergency_contact_phone: "860000203", status: "Activo", date_of_birth: "1988-11-05", notes: "", created_at: "2022-11-01", updated_at: "2026-07-10" },
    { id: "staff-4", user_id: "", full_name: "Laiza Teresa Chirindza", title: "Irmã", gender: "Feminino", phone: "860000104", whatsapp: "860000104", email: "laiza@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-finance", department_name: "Finanças", role_title: "Finance Officer", supervisor_user_id: "u-15", supervisor_name: "Finance Head Demo", start_date: "2024-03-01", employment_type: "Full-time", salary_or_allowance: 40000, payment_frequency: "Mensal", payment_method: "E-Mola", bank_or_mobile_details: "87XXXXXXX", status: "Activo", date_of_birth: "1995-01-18", notes: "", created_at: "2024-03-01", updated_at: "2026-07-10" },
    { id: "staff-5", user_id: "u-6", full_name: "Eduarda Paula Mnganhela", title: "Irmã", gender: "Feminino", phone: "860000105", whatsapp: "860000105", email: "eduarda@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-cell", department_name: "Ministério de Células", role_title: "Final Coordinator", supervisor_user_id: "u-5", supervisor_name: "Pastora Flavia", start_date: "2023-09-01", employment_type: "Part-time", salary_or_allowance: 25000, payment_frequency: "Mensal", payment_method: "M-Pesa", bank_or_mobile_details: "86XXXXXXX", bank_name: "M-Pesa", mobile_money_number: "860000105", marital_status: "Solteiro/a", address: "Maputo, Moçambique", emergency_contact_name: "Paula Mnganhela", emergency_contact_phone: "860000199", national_id_number: "BI-****5521", nuit: "NUIT-****882", contract_start_date: "2023-09-01", contract_end_date: "", probation_end_date: "2023-12-01", status: "Activo", date_of_birth: "1993-07-15", notes: "", created_at: "2023-09-01", updated_at: "2026-07-10" },
    { id: "staff-6", user_id: "u-3", full_name: "Janet Baptista Ngoca", title: "Irmã", gender: "Feminino", phone: "860000106", whatsapp: "860000106", email: "janet.marquele@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-programs", department_name: "Programas", role_title: "Ministry Coordinator", supervisor_user_id: "u-17", supervisor_name: "Pastor Kene Ume", start_date: "2022-05-01", employment_type: "Full-time", salary_or_allowance: 42000, payment_frequency: "Mensal", payment_method: "Banco", bank_or_mobile_details: "", status: "Activo", date_of_birth: "1987-12-02", notes: "", created_at: "2022-05-01", updated_at: "2026-07-10" },
    { id: "staff-7", user_id: "u-18", full_name: "Pastora Responsável Requisições", title: "Pastora", gender: "Feminino", phone: "860000107", whatsapp: "860000107", email: "requisitions@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-programs", department_name: "Programas", role_title: "Requisition Officer", supervisor_user_id: "u-17", supervisor_name: "Pastor Kene Ume", start_date: "2024-06-01", employment_type: "Full-time", salary_or_allowance: 36000, payment_frequency: "Mensal", payment_method: "Banco", bank_or_mobile_details: "", status: "Activo", date_of_birth: "1991-05-20", notes: "Responsável por organizar requisições.", created_at: "2024-06-01", updated_at: "2026-07-10" },
    { id: "staff-8", user_id: "u-7", full_name: "Cell Leader Demo", title: "Irmão", gender: "Masculino", phone: "860000108", whatsapp: "860000108", email: "cellleader@ce-mozambique.org", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", department_id: "dept-cell", department_name: "Ministério de Células", role_title: "Cell Leader", supervisor_user_id: "u-5", supervisor_name: "Pastora Flavia", start_date: "2025-01-01", employment_type: "Voluntário", salary_or_allowance: 0, payment_frequency: "Nenhum", payment_method: "Nenhum", bank_or_mobile_details: "", status: "Activo", date_of_birth: "1998-08-30", notes: "", created_at: "2025-01-01", updated_at: "2026-07-10" }
  ],
  staffSalaries: [
    { id: "sal-1", staff_id: "staff-1", month: "2026-06", base_amount: 45000, bonus: 5000, deductions: 0, net_amount: 50000, payment_status: "Pago", approved_by: "Finance Head Demo", paid_by: "Finance Head Demo", paid_at: "2026-07-05", notes: "" },
    { id: "sal-2", staff_id: "staff-3", month: "2026-07", base_amount: 52000, bonus: 0, deductions: 2000, net_amount: 50000, payment_status: "Pendente", approved_by: "", paid_by: "", paid_at: "", notes: "Aguardar aprovação." },
    { id: "sal-3", staff_id: "staff-4", month: "2026-07", base_amount: 40000, bonus: 0, deductions: 0, net_amount: 40000, payment_status: "Aprovado", approved_by: "Finance Head Demo", paid_by: "", paid_at: "", notes: "" }
  ],
  staffPerformance: [
    { id: "perf-1", staff_id: "staff-1", evaluation_period: "2026-H1", punctuality_score: 9, task_completion_score: 9, report_submission_score: 8, teamwork_score: 9, supervisor_rating: 9, overall_score: 8.8, strengths: "Liderança e organização.", areas_to_improve: "Delegação de tarefas.", action_plan: "Formação de líderes de área.", evaluated_by: "Pastor Kene Ume", evaluated_at: "2026-07-01" },
    { id: "perf-2", staff_id: "staff-3", evaluation_period: "2026-H1", punctuality_score: 0, task_completion_score: 0, report_submission_score: 0, teamwork_score: 0, supervisor_rating: 0, overall_score: 0, strengths: "", areas_to_improve: "", action_plan: "", evaluated_by: "", evaluated_at: "" }
  ],
  staffAttendance: [
    { id: "att-1", staff_id: "staff-1", date: "2026-07-10", church_id: "church-hq", department_id: "dept-cell", attendance_status: "Presente", check_in_time: "08:45", check_out_time: "17:30", notes: "" },
    { id: "att-2", staff_id: "staff-4", date: "2026-07-10", church_id: "church-hq", department_id: "dept-finance", attendance_status: "Presente", check_in_time: "09:00", check_out_time: "18:00", notes: "" },
    { id: "att-3", staff_id: "staff-3", date: "2026-07-10", church_id: "church-hq", department_id: "dept-venue", attendance_status: "Atrasado", check_in_time: "09:35", check_out_time: "17:00", notes: "Trânsito." }
  ],
  staffDocuments: [
    { id: "doc-1", staff_id: "staff-1", document_type: "BI", file_url: "/docs/staff-1-bi.pdf", expiry_date: "", notes: "" },
    { id: "doc-2", staff_id: "staff-3", document_type: "Contrato", file_url: "/docs/staff-3-contract.pdf", expiry_date: "2027-11-01", notes: "Contrato anual renovável." }
  ],
  churches: [
    { id: "church-hq", church_id: "church-hq", church_name: "National HQ - Christ Embassy Mozambique", public_name: "Igreja Embaixada de Cristo Maputo / Embaixada de Cristo Moçambique", type: "Sede Nacional", province: "Maputo Cidade", city: "KaMpfumo", district_or_area: "Maputo", address: "Avenida de Angola, ao lado da CETRACO, Maputo", pastor_in_charge: "Pastor Kene Ume", phone_primary: "+258 86 227 0000", phone_secondary: "", email: "info@embaixada-de-cristo.obiuba.com", facebook: "Embaixada de Cristo Moçambique", instagram: "@embaixada_de_cristo_mocambique", youtube: "", service_times: defaultSeedServiceTimes("church-hq", "Sede Nacional"), parent_church_id: "", status: "Activa", information_status: "Por Confirmar", notes: "Dados iniciais importados para o protótipo. Confirmar detalhes com a equipa local.", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2024-01-01", updated_at: "2026-07-10", attendance_last_4_weeks: [112, 98, 104, 92] },
    { id: "church-matola", church_id: "church-matola", church_name: "Igreja Embaixada de Cristo Matola", public_name: "Embaixada de Cristo Matola", type: "Igreja Local", province: "Maputo Província", city: "Matola", district_or_area: "Matola", address: "Rua Mário Estêves Coluna, Nr 63B, perto do KFC / DNIC", pastor_in_charge: "", phone_primary: "+258 84 372 2630", phone_secondary: "+258 84 643 5951 / +258 87 780 9005", email: "", facebook: "", instagram: "", youtube: "", service_times: defaultSeedServiceTimes("church-matola", "Igreja Local"), parent_church_id: "church-hq", status: "Activa", information_status: "Por Confirmar", notes: "", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2026-07-01", updated_at: "2026-07-10", attendance_last_4_weeks: [48, 52, 46, 50] },
    { id: "church-khongolote", church_id: "church-khongolote", church_name: "Igreja Embaixada de Cristo Khongolote", public_name: "Embaixada de Cristo Khongolote", type: "Igreja Local", province: "Maputo Província", city: "Matola", district_or_area: "Khongolote", address: "Rua Licuacuanine, 648 – Khongolote, Matola", pastor_in_charge: "", phone_primary: "", phone_secondary: "", email: "", facebook: "", instagram: "", youtube: "", service_times: defaultSeedServiceTimes("church-khongolote", "Igreja Local"), parent_church_id: "church-hq", status: "Activa", information_status: "Por Confirmar", notes: "", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2026-07-01", updated_at: "2026-07-10", attendance_last_4_weeks: [32, 28, 30, 29] },
    { id: "church-choupal", church_id: "church-choupal", church_name: "Igreja Embaixada de Cristo Choupal", public_name: "Embaixada de Cristo Choupal", type: "Igreja Local", province: "Maputo Cidade", city: "KaMubukwana", district_or_area: "Choupal", address: "Choupal, Maputo", pastor_in_charge: "", phone_primary: "", phone_secondary: "", email: "", facebook: "", instagram: "", youtube: "", service_times: defaultSeedServiceTimes("church-choupal", "Igreja Local"), parent_church_id: "church-hq", status: "Activa", information_status: "Por Confirmar", notes: "", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2026-07-01", updated_at: "2026-07-10", attendance_last_4_weeks: [28, 30, 27, 31] },
    { id: "church-beira", church_id: "church-beira", church_name: "Igreja Embaixada de Cristo Beira", public_name: "Igreja Embaixada de Cristo Beira", type: "Igreja Local", province: "Sofala", city: "Beira", district_or_area: "Beira", address: "Por confirmar", pastor_in_charge: "", phone_primary: "", phone_secondary: "", email: "", facebook: "Igreja Embaixada de Cristo Beira", instagram: "@embaixada_de_cristo_beira", youtube: "", service_times: defaultSeedServiceTimes("church-beira", "Igreja Local"), parent_church_id: "church-hq", status: "Activa", information_status: "Por Confirmar", notes: "Endereço e contactos a confirmar com a igreja local.", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2026-07-01", updated_at: "2026-07-10", attendance_last_4_weeks: [40, 38, 42, 39] },
    { id: "church-nampula", church_id: "church-nampula", church_name: "Igreja Embaixada de Cristo Nampula", public_name: "Embaixada De Cristo Nampula", type: "Igreja Local", province: "Nampula", city: "Nampula", district_or_area: "Muhala-Expansão", address: "Terminal de Chapa Muhala-Expansão, Paragem Igreja", pastor_in_charge: "Pastor Armando de Jesus", phone_primary: "", phone_secondary: "", email: "", facebook: "Embaixada De Cristo Nampula", instagram: "@embaixada_de_cristo.nampula", youtube: "", service_times: defaultSeedServiceTimes("church-nampula", "Igreja Local"), parent_church_id: "church-hq", status: "Activa", information_status: "Por Confirmar", notes: "", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2026-07-01", updated_at: "2026-07-10", attendance_last_4_weeks: [36, 34, 35, 37] },
    { id: "church-virtual", church_id: "church-virtual", church_name: "CE Mozambique Online Church", public_name: "Igreja Embaixada de Cristo Online", type: "Igreja Online", province: "Online", city: "Online", district_or_area: "Virtual", address: "Transmissão online", pastor_in_charge: "Equipa de Media", phone_primary: "+258 86 877 389", phone_secondary: "", email: "online@embaixada-de-cristo.obiuba.com", facebook: "", instagram: "", youtube: "Christ Embassy Mozambique Online", service_times: defaultSeedServiceTimes("church-virtual", "Igreja Online"), parent_church_id: "church-hq", status: "Activa", information_status: "Confirmado", notes: "", created_by: "Admin Principal", updated_by: "Admin Principal", created_at: "2024-06-01", updated_at: "2026-07-10", attendance_last_4_weeks: [54, 61, 48, 57] }
  ],
  firstTimers: [
    { id: "ft-1", tratamento: "Irmã", nome: "Aminata", apelido: "Chivinda", genero: "Feminino", data_de_nascimento: "1991-05-05", telefone: "848287179", whatsapp: "848287179", email: "", endereco: "Mavalane A", church_id: "church-hq", data_do_culto: "2026-07-05", culto: "Domingo Manhã", convidado_por: "Irmão da igreja", nasceu_de_novo: false, quer_escola_de_fundacao: true, quer_aconselhamento: true, interesse_em_celula: true, celula_preferida: "Mavalane", estado_do_seguimento: "Pending", conselheiro_responsavel: "Líder de Aconselhamento", notas: "Exemplo baseado na ficha partilhada." },
    { id: "ft-2", tratamento: "Sr.", nome: "Mateus", apelido: "Nhantumbo", genero: "Masculino", data_de_nascimento: "1998-11-12", telefone: "862720011", whatsapp: "862720011", email: "mateus@example.com", endereco: "Matola", church_id: "church-hq", data_do_culto: "2026-06-28", culto: "Domingo Manhã", convidado_por: "Cell Central", nasceu_de_novo: true, quer_escola_de_fundacao: true, quer_aconselhamento: false, interesse_em_celula: true, celula_preferida: "Cell Central", estado_do_seguimento: "Contacted", conselheiro_responsavel: "Líder de Aconselhamento", notas: "Quer integrar uma célula perto de casa." }
  ],
  followUps: [
    { id: "fu-1", first_timer_id: "ft-1", church_id: "church-hq", data_do_contacto: "2026-07-06", metodo: "WhatsApp", resultado: "Mensagem enviada", proximo_passo: "Confirmar presença no próximo culto", proxima_data_de_contacto: "2026-07-09", notas: "Aguardando resposta.", actualizado_por: "Líder de Aconselhamento" }
  ],
  members: [
    { id: "m-1", tratamento: "Pastor", nome: "Kene", apelido: "Ume", telefone: "+258 86 227 0000", email: "", church_id: "church-hq", celula: "Sede", departamento: "Leadership", estado: "Active", data_de_entrada: "2024-01-01", origem: "Manual", notas: "" },
    { id: "m-2", tratamento: "Irmã", nome: "Aminata", apelido: "Chivinda", telefone: "848287179", email: "", church_id: "church-hq", celula: "Mavalane", departamento: "Seguimento", estado: "In Progress", data_de_entrada: "2026-07-05", origem: "Primeira Vez", notas: "" }
  ],
  foundationStudents: [
    {
      id: "fs-1",
      first_timer_id: "ft-2",
      member_id: "",
      church_id: "church-hq",
      nome: "Mateus",
      apelido: "Nhantumbo",
      telefone: "862720011",
      celula: "Cell Central",
      mes_de_inscricao: "2026-07",
      class_attendance: { class_1: true, class_2: true, class_3: true, class_4: true, class_5: false, class_6: false, class_7: false },
      completed_classes: 4,
      class_progress_percent: 57,
      estado: "Em Curso",
      nota_exame: 0,
      pratica_evangelismo: true,
      numero_de_almas_ganhas: 2,
      aprovado: false,
      graduado: false,
      certificado_emitido: false,
      notes: "",
      created_at: "2026-07-01",
      updated_at: "2026-07-10"
    }
  ],
  contributors: [],
  publicGivingSubmissions: [],
  finance: [
    { id: "fin-1", source_type: "contributor", contributor_id: "contrib-fin-1", member_id: "", first_timer_id: "", partner_id: "", nome: "Ana", apelido: "Mabunda", telefone: "874520011", whatsapp: "874520011", email: "", endereco: "Maputo", celula: "Cell Central", grupo_de_celula: "Grupo Central", igreja: "National HQ - Christ Embassy Mozambique", church_id: "church-hq", categoria_da_contribuicao: "Dízimo", metodo_de_pagamento: "M-Pesa", valor: 7500, referencia_da_transaccao: "MP463900298", data: "2026-07-05", imagem_envelope_ou_pop: "", imagem_do_envelope: "", observacoes: "", estado: FINANCE_STATUS_VERIFIED, recebido_por: "Admin Principal", verificado_por: "Admin Principal", verified_at: "2026-07-05T10:30:00.000Z", comentario_verificacao: "Pagamento confirmado no M-Pesa.", motivo_rejeicao: "", created_at: "2026-07-05T09:15:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-05" },
    { id: "fin-2", source_type: "partner", contributor_id: "", member_id: "", first_timer_id: "", partner_id: "part-1", nome: "Carlos", apelido: "Muianga", telefone: "866877389", whatsapp: "866877389", email: "carlos@example.com", endereco: "Online", celula: "Virtual", igreja: "CE Mozambique Online Church", church_id: "church-virtual", categoria_da_contribuicao: "Loveworld SAT", metodo_de_pagamento: "Banco", valor: 4200, referencia_da_transaccao: "BCI-17596091110001", data: "2026-07-02", imagem_envelope_ou_pop: "", imagem_do_envelope: "", observacoes: "Aguardar confirmação bancária.", estado: FINANCE_STATUS_PENDING, recebido_por: "Admin Principal", verificado_por: "", verified_at: "", comentario_verificacao: "", motivo_rejeicao: "", created_at: "2026-07-02T14:20:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-02" },
    { id: "fin-3", source_type: "contributor", contributor_id: "contrib-fin-2", nome: "João", apelido: "Nhaca", telefone: "845551122", celula: "Cell Mavalane", grupo_de_celula: "Grupo Matola", church_id: "church-hq", categoria_da_contribuicao: "Ofertas", metodo_de_pagamento: "M-Pesa", valor: 2500, data: "2026-07-08", estado: FINANCE_STATUS_VERIFIED, verificado_por: "Admin Principal", verified_at: "2026-07-08T11:00:00.000Z", created_at: "2026-07-08T10:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-08" },
    { id: "fin-4", source_type: "partner", partner_id: "part-2", nome: "Helena", apelido: "Cossa", telefone: "843332211", celula: "Cell Central", church_id: "church-hq", categoria_da_contribuicao: "Escola de Cura", metodo_de_pagamento: "E-Mola", valor: 5000, data: "2026-07-09", estado: FINANCE_STATUS_VERIFIED, verificado_por: "Admin Principal", verified_at: "2026-07-09T12:00:00.000Z", created_at: "2026-07-09T09:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-09" },
    { id: "fin-5", source_type: "partner", partner_id: "part-3", nome: "Miguel", apelido: "Tembe", telefone: "861112233", celula: "Cell Central", church_id: "church-matola", categoria_da_contribuicao: "Rapsódia de Realidades", metodo_de_pagamento: "M-Pesa", valor: 3000, data: "2026-07-10", estado: FINANCE_STATUS_VERIFIED, verificado_por: "Admin Principal", verified_at: "2026-07-10T08:30:00.000Z", created_at: "2026-07-10T08:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-10" },
    { id: "fin-6", source_type: "contributor", nome: "Sofia", apelido: "Macuacua", telefone: "872223344", celula: "Cell Mavalane", church_id: "church-hq", categoria_da_contribuicao: "Primícias", metodo_de_pagamento: "Banco", valor: 1800, data: "2026-06-15", estado: FINANCE_STATUS_VERIFIED, verificado_por: "Admin Principal", verified_at: "2026-06-15T14:00:00.000Z", created_at: "2026-06-15T13:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-06-15" },
    { id: "fin-7", source_type: "partner", partner_id: "part-4", nome: "Carlos", apelido: "Muianga", telefone: "866877389", celula: "Virtual", church_id: "church-virtual", categoria_da_contribuicao: "Construtores de Visão", metodo_de_pagamento: "Banco", valor: 10000, data: "2026-06-20", estado: FINANCE_STATUS_VERIFIED, verificado_por: "Admin Principal", verified_at: "2026-06-21T09:00:00.000Z", created_at: "2026-06-20T16:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-06-21" },
    { id: "fin-8", source_type: "contributor", nome: "Rosa", apelido: "Jossias", telefone: "845667788", celula: "Cell Central", church_id: "church-beira", categoria_da_contribuicao: "Alcançar Moçambique", metodo_de_pagamento: "M-Pesa", valor: 1500, data: "2026-07-11", estado: FINANCE_STATUS_PENDING, created_at: "2026-07-11T07:00:00.000Z", created_by: "Admin Principal", updated_by: "Admin Principal", updated_at: "2026-07-11" }
  ],
  cells: [
    { id: "cell-1", church_id: "church-hq", group_cell_id: "group-1", nome_da_celula: "Cell Central", lider_id: "m-1", lider: "Pastor Kene Ume", area: "Maputo", membros: ["m-1", "m-2"], presencas: [{ data: "2026-07-05", total: 18 }, { data: "2026-06-28", total: 16 }], almas_ganhas: [{ data: "2026-07-05", total: 3 }], limite_crescimento: 20 },
    { id: "cell-2", church_id: "church-hq", group_cell_id: "group-1", nome_da_celula: "Cell Mavalane", lider_id: "m-2", lider: "Aminata Chivinda", area: "Mavalane", membros: [], presencas: [{ data: "2026-07-05", total: 9 }, { data: "2026-06-28", total: 7 }], almas_ganhas: [{ data: "2026-07-05", total: 1 }], limite_crescimento: 20 }
  ],
  cellGroups: __cellSeed.cellGroups,
  cellRegistry: __cellSeed.cellRegistry,
  cellLeadership: {
    alecRegistrations: [
      { id: "alec-reg-1", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Sister Angelica", created_at: "2026-06-15", updated_at: "2026-07-03", status: "Em Formação", nome_completo: "Aminata Chivinda", contacto: "848287179", igreja: "church-hq", celula: "Cell Mavalane", nome_do_lider_de_celula: "Aminata Chivinda", fez_escola_de_fundacao: true, e_lider: false, motivo_de_fazer_alec: "Crescer em liderança e ganhar almas.", estado: "Em Formação", observacoes: "Cadastro 2025 importado para protótipo." },
      { id: "alec-reg-2", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Sister Angelica", created_at: "2026-06-15", updated_at: "2026-07-03", status: "Activo", nome_completo: "Mateus Nhantumbo", contacto: "862720011", igreja: "church-hq", celula: "Cell Central", nome_do_lider_de_celula: "Pastor Kene Ume", fez_escola_de_fundacao: true, e_lider: true, motivo_de_fazer_alec: "Preparação para liderar célula.", estado: "Activo", observacoes: "" }
    ],
    alecScores: [
      { id: "alec-score-1", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Sister Angelica", created_at: "2026-07-03", updated_at: "2026-07-03", status: "Em Curso", nome_completo: "Aminata Chivinda", contacto: "848287179", igreja: "church-hq", celula: "Cell Mavalane", fase_1_aula_1: 80, fase_1_aula_2: 77, fase_1_aula_3: 84, fase_1_aula_4: 75, fase_2_aula_1: 0, fase_2_aula_2: 0, fase_2_aula_3: 0, terminou: false, faixa_certificado_pago: false, certificado_emitido: false, estado: "Em Curso" },
      { id: "alec-score-2", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Sister Angelica", created_at: "2026-07-03", updated_at: "2026-07-03", status: "Terminou", nome_completo: "Mateus Nhantumbo", contacto: "862720011", igreja: "church-hq", celula: "Cell Central", fase_1_aula_1: 90, fase_1_aula_2: 88, fase_1_aula_3: 92, fase_1_aula_4: 86, fase_2_aula_1: 84, fase_2_aula_2: 89, fase_2_aula_3: 91, terminou: true, faixa_certificado_pago: true, certificado_emitido: false, estado: "Terminou" }
    ],
    churchReports: [
      { id: "church-report-1", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Sister Angelica", created_at: "2026-06-07", updated_at: "2026-06-07", status: "Submetido", semana: "2026 Junho Semana 1", data_inicio: "2026-06-01", data_fim: "2026-06-07", culto: "Domingo", celula: "Cell Central", titulo_do_lider: "Pastor", nome_do_lider: "Kene Ume", att: 112, ft: 14, nc: 9, rs: 8, total_ft_reached: 12, comentarios: "Bom crescimento no culto de domingo.", submetido_por: "Sister Angelica", estado: "Submetido" }
    ],
    cellReports: [
      { id: "cell-report-1", church_id: "church-hq", created_by: "Cell Leader Demo", updated_by: "Pastora Flavia", created_at: "2026-07-05", updated_at: "2026-07-06", status: "Em Avaliação", semana: "Julho Semana 1", data_inicio: "2026-06-29", data_fim: "2026-07-05", celula: "Cell Central", cell_id: "cell-1", titulo_do_lider: "Irmão", nome_do_lider: "Mateus Nhantumbo", leader_id: "leader-1", att: 18, ft: 5, nc: 3, oferta: 2300, rs: 2, observacoes: "EXPLOSAO - pronta para multiplicação.", submetido_por: "Cell Leader Demo", avaliado_por: "Pastora Flavia", validado_por: "", estado: "Em Avaliação" },
      { id: "cell-report-2", church_id: "church-hq", created_by: "Cell Leader Demo", updated_by: "Sister Eduarda", created_at: "2026-07-05", updated_at: "2026-07-06", status: "Validado", semana: "Julho Semana 1", data_inicio: "2026-06-29", data_fim: "2026-07-05", celula: "Cell Mavalane", cell_id: "cell-2", titulo_do_lider: "Irmã", nome_do_lider: "Aminata Chivinda", leader_id: "leader-2", att: 9, ft: 1, nc: 1, oferta: 850, rs: 1, observacoes: "Precisa acompanhamento para crescimento.", submetido_por: "Cell Leader Demo", avaliado_por: "Pastora Flavia", validado_por: "Sister Eduarda", estado: "Validado" }
    ],
    leaders: [
      { id: "leader-1", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Pastora Flavia", created_at: "2026-07-03", updated_at: "2026-07-06", status: "Activo", nome_completo: "Mateus Nhantumbo", contacto: "862720011", titulo: "Irmão", igreja: "church-hq", celula: "Cell Central", e_lider_actual: true, veio_do_alec: true, alec_concluido: true, faixa_certificado_pago: true, estado: "Activo", supervisor: "Pastora Flavia", observacoes: "Pode submeter relatórios da sua célula." },
      { id: "leader-2", church_id: "church-hq", created_by: "Sister Angelica", updated_by: "Pastora Flavia", created_at: "2026-07-03", updated_at: "2026-07-06", status: "Em Treinamento", nome_completo: "Aminata Chivinda", contacto: "848287179", titulo: "Irmã", igreja: "church-hq", celula: "Cell Mavalane", e_lider_actual: true, veio_do_alec: true, alec_concluido: false, faixa_certificado_pago: false, estado: "Em Treinamento", supervisor: "Pastora Flavia", observacoes: "Acompanhar conclusão do ALEC." }
    ],
    evaluations: [
      { id: "eval-1", church_id: "church-hq", created_by: "Pastora Flavia", updated_by: "Pastora Flavia", created_at: "2026-07-06", updated_at: "2026-07-06", status: "Encaminhado para Validação", report_id: "cell-report-1", avaliador: "Pastora Flavia", data_da_avaliacao: "2026-07-06", classificacao: "Excelente", pontos_fortes: "Alto FT, NC consistente e célula em explosão.", pontos_a_melhorar: "Preparar novo líder auxiliar.", acao_recomendada: "Recomendar divisão da célula.", precisa_followup: true, estado: "Encaminhado para Validação" },
      { id: "eval-2", church_id: "church-hq", created_by: "Pastora Flavia", updated_by: "Pastora Flavia", created_at: "2026-07-06", updated_at: "2026-07-06", status: "Aprovado", report_id: "cell-report-2", avaliador: "Pastora Flavia", data_da_avaliacao: "2026-07-06", classificacao: "Precisa de Atenção", pontos_fortes: "Líder constante.", pontos_a_melhorar: "Aumentar evangelismo e assistência.", acao_recomendada: "Follow-up semanal com supervisora.", precisa_followup: true, estado: "Aprovado" }
    ],
    validations: [
      { id: "validation-1", church_id: "church-hq", created_by: "Sister Eduarda", updated_by: "Sister Eduarda", created_at: "2026-07-06", updated_at: "2026-07-06", status: "Validado", report_id: "cell-report-2", validado_por: "Sister Eduarda", data_validacao: "2026-07-06", decisao: "Validado", comentario_final: "Relatório aceite para consolidação nacional.", estado_final: "Validado" }
    ],
    actionPlans: [
      { id: "ap-1", church_id: "church-hq", leader_name: "Aminata Chivinda", cell_name: "Cell Mavalane", action: "Follow-up semanal com supervisora e reforço de evangelismo.", due_date: "2026-07-17", status: "Em Curso", owner: "Pastora Flavia", created_by: "Pastora Flavia", updated_by: "Pastora Flavia", created_at: "2026-07-06", updated_at: "2026-07-06" },
      { id: "ap-2", church_id: "church-hq", leader_name: "Mateus Nhantumbo", cell_name: "Cell Central", action: "Preparar divisão da célula e identificar líder auxiliar.", due_date: "2026-07-20", status: "Planeado", owner: "Pastora Flavia", created_by: "Pastora Flavia", updated_by: "Pastora Flavia", created_at: "2026-07-06", updated_at: "2026-07-06" }
    ]
  },
  fevo: {
    weeklyConfigurations: [
      { id: "fevo-cfg-1", church_id: "church-hq", semana_inicio: "2026-05-04", semana_fim: "2026-05-10", team_a_activity: "Follow-Up", team_b_activity: "Oração", team_c_activity: "Evangelização", team_d_activity: "Visitação", preparado_por: "Sister Cassandra", observacoes: "Rotação semanal conforme plano F.E.V.O.", estado: "Fechado", status: "Fechado", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-03", updated_at: "2026-05-10" },
      { id: "fevo-cfg-2", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team_a_activity: "Visitação", team_b_activity: "Follow-Up", team_c_activity: "Oração", team_d_activity: "Evangelização", preparado_por: "Sister Cassandra", observacoes: "Configuração activa de exemplo.", estado: "Activo", status: "Activo", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-24", updated_at: "2026-05-25" }
    ],
    reports: [
      { id: "fevo-rpt-1", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team A", activity_type: "Visitação", group_id: "group-1", cell_id: "cell-1", leader_id: "leader-1", group_name: "Group Central", leader_name: "Mateus Nhantumbo", number_of_cells: 2, number_of_members: 26, leaders_present: 3, members_present: 18, ft_in_church: 4, submitted_report: true, submitted_by: "F.E.V.O Team Leader", submitted_at: "2026-05-31", status: "Submetido", notes: "Visitação com bom testemunho.", souls_visited: 12, family_members_reached: 7, new_converts: 2, visit_location: "Mavalane", visit_result: "Famílias abertas para célula.", created_by: "F.E.V.O Team Leader", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-05-31" },
      { id: "fevo-rpt-2", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team B", activity_type: "Follow-Up", group_id: "group-1", cell_id: "cell-2", leader_id: "leader-2", group_name: "Group Mavalane", leader_name: "Aminata Chivinda", number_of_cells: 1, number_of_members: 12, leaders_present: 2, members_present: 8, ft_in_church: 3, submitted_report: true, submitted_by: "Aminata Chivinda", submitted_at: "2026-05-31", status: "Em Revisão", notes: "Seguimento de primeira vez.", souls_contacted: 21, feedback_count: 14, followup_result: "8 confirmaram presença no culto.", next_action: "Adicionar ao grupo WhatsApp.", created_by: "Aminata Chivinda", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-05-31" },
      { id: "fevo-rpt-3", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team C", activity_type: "Oração", group_id: "group-1", cell_id: "", leader_id: "", group_name: "Grupo de Oração", leader_name: "Sister Cassandra", number_of_cells: 3, number_of_members: 31, leaders_present: 4, members_present: 22, ft_in_church: 2, submitted_report: true, submitted_by: "Sister Cassandra", submitted_at: "2026-05-31", status: "Aprovado", notes: "Oração por novos convertidos.", average_members_present: 18, days_of_prayer: 5, prayer_focus: "Retenção de almas e crescimento celular.", prayer_testimonies: "Testemunhos de restauração familiar.", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-05-31" },
      { id: "fevo-rpt-4", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team D", activity_type: "Evangelização", group_id: "group-1", cell_id: "cell-1", leader_id: "leader-1", group_name: "Grupo Evangelismo", leader_name: "Mateus Nhantumbo", number_of_cells: 2, number_of_members: 19, leaders_present: 3, members_present: 15, ft_in_church: 6, submitted_report: true, submitted_by: "Mateus Nhantumbo", submitted_at: "2026-05-31", status: "Submetido", notes: "Evangelização em equipa.", souls_evangelized: 42, new_converts: 9, evangelism_location: "Baixa da Cidade", materials_distributed: 60, created_by: "Mateus Nhantumbo", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-05-31" }
    ],
    noReports: [
      { id: "fevo-nr-1", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team A", activity_type: "Visitação", group_name: "Grupo Matola", leader_name: "Irmã Celeste", reason_not_submitted: "Líder sem internet no domingo.", followup_action: "Contactar e recolher relatório por chamada.", contacted: true, contacted_by: "Sister Cassandra", status: "Contactado", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-06-01" },
      { id: "fevo-nr-2", church_id: "church-hq", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", team: "Team B", activity_type: "Follow-Up", group_name: "Grupo Choupal", leader_name: "Irmão Paulo", reason_not_submitted: "Sem resposta.", followup_action: "Escalar para supervisora.", contacted: false, contacted_by: "", status: "Reincidente", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-06-01" }
    ],
    weeklyReports: [
      { id: "fevo-week-1", church_id: "church-hq", title: "RELATÓRIO F.E.V.O", semana_inicio: "2026-05-25", semana_fim: "2026-05-31", status: "Submetido", created_by: "Sister Cassandra", updated_by: "Sister Cassandra", created_at: "2026-05-31", updated_at: "2026-05-31" }
    ]
  },
  venueInventory: {
    inventory: [
      { id: "inv-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-10", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Yamaha Mixer", categoria: "Som", quantidade: 1, estado: "Bom", localizacao: "Auditório Principal", departamento_responsavel: "Som", igreja: "church-hq", data_de_entrada: "2026-01-10", valor_unitario: 85000, valor_total: 85000, serial_number: "YMX-001", observacoes: "" },
      { id: "inv-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-12", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Amplificador Pevey", categoria: "Som", quantidade: 1, estado: "Bom", localizacao: "Auditório Principal", departamento_responsavel: "Som", igreja: "church-hq", data_de_entrada: "2026-01-12", valor_unitario: 42000, valor_total: 42000, serial_number: "PVY-AMP-01", observacoes: "" },
      { id: "inv-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-02-01", updated_at: "2026-07-10", status: "Em Reparação", nome_do_item: "Microphone FM Wireless", categoria: "Som", quantidade: 4, estado: "Em Reparação", localizacao: "Media Room", departamento_responsavel: "Media", igreja: "church-hq", data_de_entrada: "2026-02-01", valor_unitario: 9500, valor_total: 38000, serial_number: "MIC-FM-SET", observacoes: "Dois microfones com ruído." },
      { id: "inv-4", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-02-05", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Yamaha Piano", categoria: "Instrumentos", quantidade: 1, estado: "Bom", localizacao: "Palco", departamento_responsavel: "Música", igreja: "church-hq", data_de_entrada: "2026-02-05", valor_unitario: 120000, valor_total: 120000, serial_number: "YPI-88", observacoes: "" },
      { id: "inv-5", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-02-08", updated_at: "2026-07-10", status: "Mau", nome_do_item: "Guitar Bass", categoria: "Instrumentos", quantidade: 1, estado: "Mau", localizacao: "Palco", departamento_responsavel: "Música", igreja: "church-hq", data_de_entrada: "2026-02-08", valor_unitario: 35000, valor_total: 35000, serial_number: "BASS-01", observacoes: "Necessita revisão." },
      { id: "inv-6", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-03-01", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Colunas Hybrid", categoria: "Som", quantidade: 6, estado: "Bom", localizacao: "Auditório Principal", departamento_responsavel: "Som", igreja: "church-hq", data_de_entrada: "2026-03-01", valor_unitario: 30000, valor_total: 180000, serial_number: "HYB-SPK", observacoes: "" },
      { id: "inv-7", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-03-05", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Canon Projectors", categoria: "Media", quantidade: 2, estado: "Bom", localizacao: "Media Room", departamento_responsavel: "Media", igreja: "church-hq", data_de_entrada: "2026-03-05", valor_unitario: 58000, valor_total: 116000, serial_number: "CAN-PROJ", observacoes: "" },
      { id: "inv-8", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-03-10", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Stabilizador de Energia 5000W", categoria: "Energia", quantidade: 1, estado: "Bom", localizacao: "Sala Técnica", departamento_responsavel: "Venue Management", igreja: "church-hq", data_de_entrada: "2026-03-10", valor_unitario: 65000, valor_total: 65000, serial_number: "STB-5000", observacoes: "" },
      { id: "inv-9", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-04-01", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Air Conditioners", categoria: "AC / Climatização", quantidade: 5, estado: "Bom", localizacao: "Auditório e Escritórios", departamento_responsavel: "Venue Management", igreja: "church-hq", data_de_entrada: "2026-04-01", valor_unitario: 52000, valor_total: 260000, serial_number: "AC-HIS", observacoes: "" },
      { id: "inv-10", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-04-10", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Câmaras de Vídeo", categoria: "Media", quantidade: 3, estado: "Bom", localizacao: "Media Room", departamento_responsavel: "Media", igreja: "church-hq", data_de_entrada: "2026-04-10", valor_unitario: 98000, valor_total: 294000, serial_number: "VID-CAM", observacoes: "" },
      { id: "inv-11", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-04-12", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Cabos HDMI", categoria: "Media", quantidade: 12, estado: "Bom", localizacao: "Media Room", departamento_responsavel: "Media", igreja: "church-hq", data_de_entrada: "2026-04-12", valor_unitario: 900, valor_total: 10800, serial_number: "HDMI-BULK", observacoes: "" },
      { id: "inv-12", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-04-13", updated_at: "2026-07-10", status: "Bom", nome_do_item: "Camera Stand", categoria: "Media", quantidade: 4, estado: "Bom", localizacao: "Media Room", departamento_responsavel: "Media", igreja: "church-hq", data_de_entrada: "2026-04-13", valor_unitario: 6500, valor_total: 26000, serial_number: "CAM-STAND", observacoes: "" }
    ],
    acquisitions: [
      { id: "acq-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-05-02", updated_at: "2026-05-02", status: "Bom", codigo_do_item: "NEW-001", descricao: "Canon EOS R5 MK-III BODY", categoria: "Media", quantidade: 1, serial_number: "CAN-R5-III", estado: "Bom", data_de_compra_ou_entrada: "2026-05-02", valor_unitario: 245000, valor_total: 245000, fornecedor: "Canon Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-001", observacoes: "" },
      { id: "acq-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-05-02", updated_at: "2026-05-02", status: "Bom", codigo_do_item: "NEW-002", descricao: "Canon RF 24-105mm", categoria: "Media", quantidade: 1, serial_number: "RF-24-105", estado: "Bom", data_de_compra_ou_entrada: "2026-05-02", valor_unitario: 85000, valor_total: 85000, fornecedor: "Canon Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-002", observacoes: "" },
      { id: "acq-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-10", updated_at: "2026-06-10", status: "Bom", codigo_do_item: "NEW-003", descricao: "Laptop", categoria: "Informática", quantidade: 2, serial_number: "LTP-2026", estado: "Bom", data_de_compra_ou_entrada: "2026-06-10", valor_unitario: 62000, valor_total: 124000, fornecedor: "IT Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-003", observacoes: "" },
      { id: "acq-4", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-15", updated_at: "2026-06-15", status: "Bom", codigo_do_item: "NEW-004", descricao: "Hisense BTU AC", categoria: "AC / Climatização", quantidade: 2, serial_number: "HIS-AC", estado: "Bom", data_de_compra_ou_entrada: "2026-06-15", valor_unitario: 54000, valor_total: 108000, fornecedor: "Hisense", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-004", observacoes: "" },
      { id: "acq-5", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-01", updated_at: "2026-07-01", status: "Bom", codigo_do_item: "NEW-005", descricao: "Moving Wash Light", categoria: "Luzes", quantidade: 4, serial_number: "MWL-4", estado: "Bom", data_de_compra_ou_entrada: "2026-07-01", valor_unitario: 27500, valor_total: 110000, fornecedor: "Lighting Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-005", observacoes: "" },
      { id: "acq-6", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-02", updated_at: "2026-07-02", status: "Bom", codigo_do_item: "NEW-006", descricao: "Avolites Quartz Lighting Console", categoria: "Luzes", quantidade: 1, serial_number: "AVL-QTZ", estado: "Bom", data_de_compra_ou_entrada: "2026-07-02", valor_unitario: 180000, valor_total: 180000, fornecedor: "Avolites", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-006", observacoes: "" },
      { id: "acq-7", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-03", updated_at: "2026-07-03", status: "Bom", codigo_do_item: "NEW-007", descricao: "Panasonic 4K Camera", categoria: "Media", quantidade: 1, serial_number: "PAN-4K", estado: "Bom", data_de_compra_ou_entrada: "2026-07-03", valor_unitario: 135000, valor_total: 135000, fornecedor: "Panasonic", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-007", observacoes: "" },
      { id: "acq-8", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-04", updated_at: "2026-07-04", status: "Bom", codigo_do_item: "NEW-008", descricao: "Canon 100-400MM Lens", categoria: "Media", quantidade: 1, serial_number: "CAN-100-400", estado: "Bom", data_de_compra_ou_entrada: "2026-07-04", valor_unitario: 112000, valor_total: 112000, fornecedor: "Canon Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-008", observacoes: "" },
      { id: "acq-9", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Bom", codigo_do_item: "NEW-009", descricao: "BMK ES600 Wireless Microphones", categoria: "Som", quantidade: 2, serial_number: "BMK-ES600", estado: "Bom", data_de_compra_ou_entrada: "2026-07-05", valor_unitario: 18500, valor_total: 37000, fornecedor: "Audio Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-009", observacoes: "" },
      { id: "acq-10", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-06", updated_at: "2026-07-06", status: "Bom", codigo_do_item: "NEW-010", descricao: "Tripés de Câmera", categoria: "Media", quantidade: 3, serial_number: "TRP-CAM-3", estado: "Bom", data_de_compra_ou_entrada: "2026-07-06", valor_unitario: 12000, valor_total: 36000, fornecedor: "Media Supplier", recebido_por: "Marcelo Panguene", comprovativo_ou_factura: "INV-2026-010", observacoes: "" }
    ],
    staffEquipment: [
      { id: "staff-eq-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-05", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Flavia Moneedi Tivane", departamento: "Cell Ministry", igreja: "church-hq", data_onboarding: "2026-01-05", dispositivo: "Laptop", modelo: "Dell Latitude 5410", device_id: "DL-5410-FL", product_id: "P-FL-001", data_de_entrega: "2026-01-05", estado_na_entrega: "Bom", estado_actual: "Bom", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-05", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Flavia Moneedi Tivane", departamento: "Cell Ministry", igreja: "church-hq", data_onboarding: "2026-01-05", dispositivo: "Celular", modelo: "Movitel M9114", device_id: "M9114-FL", product_id: "P-FL-002", data_de_entrega: "2026-01-05", estado_na_entrega: "Bom", estado_actual: "Bom", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-08", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Angelica Amilcar Macuacua", departamento: "Cell Ministry", igreja: "church-hq", data_onboarding: "2026-01-08", dispositivo: "Laptop", modelo: "HP ENVY", device_id: "HP-ENVY-ANG", product_id: "P-ANG-001", data_de_entrega: "2026-01-08", estado_na_entrega: "Bom", estado_actual: "Reparado", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-4", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-10", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Marcelo Moises Panguene", departamento: "Venue Management", igreja: "church-hq", data_onboarding: "2026-01-10", dispositivo: "Laptop", modelo: "HP ProBook 450 G6", device_id: "HP-PB-MAR", product_id: "P-MAR-001", data_de_entrega: "2026-01-10", estado_na_entrega: "Bom", estado_actual: "Reparado", responsavel_pela_entrega: "Admin Principal", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-5", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-12", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Laiza Teresa Chirindza", departamento: "Finanças", igreja: "church-hq", data_onboarding: "2026-01-12", dispositivo: "Laptop", modelo: "Lenovo 81D2", device_id: "LEN-LAIZA", product_id: "P-LAI-001", data_de_entrega: "2026-01-12", estado_na_entrega: "Bom", estado_actual: "Bom", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-6", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-15", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Eduarda Paula Mnganhela", departamento: "Cell Ministry", igreja: "church-hq", data_onboarding: "2026-01-15", dispositivo: "Laptop", modelo: "Inspiron 5482", device_id: "INS-EDU", product_id: "P-EDU-001", data_de_entrega: "2026-01-15", estado_na_entrega: "Bom", estado_actual: "Bom", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" },
      { id: "staff-eq-7", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-18", updated_at: "2026-07-10", status: "Activo", nome_do_funcionario: "Janet Baptista Ngoca", departamento: "Partnership, Prison Ministry, Ministry Materials and Programs", igreja: "church-hq", data_onboarding: "2026-01-18", dispositivo: "Laptop", modelo: "Dell Latitude 7420", device_id: "DL-7420-JAN", product_id: "P-JAN-001", data_de_entrega: "2026-01-18", estado_na_entrega: "Bom", estado_actual: "Bom", responsavel_pela_entrega: "Marcelo Panguene", assinatura_confirmada: true, data_de_devolucao: "", observacoes: "" }
    ],
    maintenance: [
      { id: "maint-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-01", updated_at: "2026-06-04", status: "Reparado", item: "Laptop da Angelica", categoria: "Informática", quantidade: 1, problema_reportado: "Sistema lento e bateria fraca", estado_antes: "Mau", estado_depois: "Bom", custo_da_reparacao: 2500, tecnico_ou_responsavel: "Técnico Local", data_de_envio: "2026-06-01", data_de_retorno: "2026-06-04", estado: "Reparado", observacoes: "" },
      { id: "maint-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-03", updated_at: "2026-06-08", status: "Reparado", item: "Laptop do Deacon", categoria: "Informática", quantidade: 1, problema_reportado: "Ecrã danificado", estado_antes: "Mau", estado_depois: "Bom", custo_da_reparacao: 6000, tecnico_ou_responsavel: "Técnico Local", data_de_envio: "2026-06-03", data_de_retorno: "2026-06-08", estado: "Reparado", observacoes: "" },
      { id: "maint-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-05", updated_at: "2026-06-10", status: "Reparado", item: "Laptop do Marcelo", categoria: "Informática", quantidade: 1, problema_reportado: "Disco com falhas", estado_antes: "Mau", estado_depois: "Bom", custo_da_reparacao: 5500, tecnico_ou_responsavel: "Técnico Local", data_de_envio: "2026-06-05", data_de_retorno: "2026-06-10", estado: "Reparado", observacoes: "" },
      { id: "maint-4", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-06-07", updated_at: "2026-06-12", status: "Reparado", item: "Laptop do Bro. Valdemiro", categoria: "Informática", quantidade: 1, problema_reportado: "Teclado e sistema", estado_antes: "Mau", estado_depois: "Bom", custo_da_reparacao: 5500, tecnico_ou_responsavel: "Técnico Local", data_de_envio: "2026-06-07", data_de_retorno: "2026-06-12", estado: "Reparado", observacoes: "" }
    ],
    movements: [
      { id: "move-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Solicitado", item: "Canon Projector", quantidade: 1, origem: "Media Room", destino: "Sala de Formação", departamento_solicitante: "Escola de Fundação", pessoa_responsavel: "Sister Angelica", data_de_saida: "2026-07-06", data_prevista_de_retorno: "2026-07-07", data_real_de_retorno: "", estado_ao_sair: "Bom", estado_ao_voltar: "", aprovado_por: "", estado: "Solicitado", observacoes: "" },
      { id: "move-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-06", updated_at: "2026-07-08", status: "Devolvido", item: "Microphone FM Wireless", quantidade: 2, origem: "Auditório", destino: "Culto Online", departamento_solicitante: "Media", pessoa_responsavel: "Media Team", data_de_saida: "2026-07-06", data_prevista_de_retorno: "2026-07-08", data_real_de_retorno: "2026-07-08", estado_ao_sair: "Bom", estado_ao_voltar: "Bom", aprovado_por: "Marcelo Panguene", estado: "Devolvido", observacoes: "" }
    ],
    venues: [
      { id: "venue-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-01", updated_at: "2026-07-10", status: "Activo", nome_do_espaco: "Auditório Principal", localizacao: "Sede Nacional", igreja: "church-hq", capacidade: 350, tipo: "Auditório", equipamentos_fixos: "Som, Luzes, AC, Projectores", estado: "Activo", responsavel: "Marcelo Panguene", observacoes: "" },
      { id: "venue-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-01", updated_at: "2026-07-10", status: "Activo", nome_do_espaco: "Sala de Formação", localizacao: "Sede Nacional", igreja: "church-hq", capacidade: 60, tipo: "Sala", equipamentos_fixos: "Projector, cadeiras, quadro", estado: "Activo", responsavel: "Sister Angelica", observacoes: "" },
      { id: "venue-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-01-01", updated_at: "2026-07-10", status: "Em Manutenção", nome_do_espaco: "Media Room", localizacao: "Sede Nacional", igreja: "church-hq", capacidade: 12, tipo: "Estúdio", equipamentos_fixos: "Câmaras, computadores, áudio", estado: "Em Manutenção", responsavel: "Media Team", observacoes: "Organizar cablagem." }
    ],
    checklists: [
      { id: "check-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Pronto", data_do_culto: "2026-07-05", igreja: "church-hq", espaco: "Auditório Principal", tipo_de_culto_ou_evento: "Domingo - 1º Culto", som_verificado: true, luzes_verificadas: true, ac_verificado: true, projector_verificado: true, cadeiras_organizadas: true, pulpito_pronto: true, cameras_prontas: true, microfones_prontos: true, limpeza_feita: true, responsavel: "Marcelo Panguene", estado: "Pronto", observacoes: "" },
      { id: "check-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-09", updated_at: "2026-07-09", status: "Parcial", data_do_culto: "2026-07-12", igreja: "church-hq", espaco: "Auditório Principal", tipo_de_culto_ou_evento: "Domingo - 2º Culto", som_verificado: true, luzes_verificadas: false, ac_verificado: true, projector_verificado: true, cadeiras_organizadas: false, pulpito_pronto: true, cameras_prontas: true, microfones_prontos: true, limpeza_feita: false, responsavel: "Marcelo Panguene", estado: "Parcial", observacoes: "Concluir organização das cadeiras e limpeza." }
    ],
    reports: [
      { id: "ven-report-1", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Inventário por Categoria", category: "Inventário", report_type: "inventoryByCategory" },
      { id: "ven-report-2", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Inventário por Estado", category: "Inventário", report_type: "inventoryByStatus" },
      { id: "ven-report-3", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Equipamentos Atribuídos ao Staff", category: "Staff", report_type: "staffEquipmentReport" },
      { id: "ven-report-4", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Equipamentos Danificados", category: "Inventário", report_type: "damagedItemsReport" },
      { id: "ven-report-5", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Histórico de Reparações", category: "Manutenção", report_type: "repairHistory" },
      { id: "ven-report-6", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Movimentações por Período", category: "Movimentações", report_type: "movementsByPeriod" },
      { id: "ven-report-7", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Checklist de Culto por Semana", category: "Checklist", report_type: "checklistByWeek" },
      { id: "ven-report-8", church_id: "church-hq", created_by: "Marcelo Panguene", updated_by: "Marcelo Panguene", created_at: "2026-07-10", updated_at: "2026-07-10", status: "Concluído", name: "Novas Aquisições por Mês", category: "Aquisições", report_type: "newAcquisitionsByMonth" }
    ]
  },
  prisonMinistry: {
    prisons: [
      { id: "prison-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-22", updated_at: "2026-07-05", status: "Activo", nome_da_prisao: "Cadeia Civil de Maputo", provincia: "Maputo", cidade: "Maputo", igreja_responsavel: "church-hq", representante_da_prisao: "Sr. Mateus Cumbe", contacto_do_representante: "+258 84 000 1001", estado: "Activo", observacoes: "Serviços semanais confirmados para quinta e sexta." },
      { id: "prison-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-22", updated_at: "2026-07-05", status: "Activo", nome_da_prisao: "Centro de Reclusão Feminino", provincia: "Maputo", cidade: "Matola", igreja_responsavel: "church-hq", representante_da_prisao: "Dra. Celeste Mabunda", contacto_do_representante: "+258 84 000 1002", estado: "Activo", observacoes: "Prioridade para Rapsódia e Escola de Fundação." }
    ],
    services: [
      { id: "ps-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-02", updated_at: "2026-07-02", status: "Relatório Submetido", data: "2026-07-02", dia_da_semana: "Quinta", prisao: "prison-1", igreja_responsavel: "church-hq", lider_responsavel: "Sister Janet Marquele", membros_que_foram: "Janet Marquele, Equipa de Células", numero_de_internos_presentes: 46, novos_convertidos: 12, interessados_em_escola_de_fundacao: 9, aula_de_fundacao_dada: true, tema_ou_mensagem: "Nova Vida em Cristo", observacoes: "Relatório e lista entregues.", estado: "Relatório Submetido" },
      { id: "ps-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-03", updated_at: "2026-07-03", status: "Realizado", data: "2026-07-03", dia_da_semana: "Sexta", prisao: "prison-2", igreja_responsavel: "church-hq", lider_responsavel: "Sister Janet Marquele", membros_que_foram: "Janet Marquele, Escola de Fundação", numero_de_internos_presentes: 34, novos_convertidos: 7, interessados_em_escola_de_fundacao: 8, aula_de_fundacao_dada: false, tema_ou_mensagem: "O Amor do Pai", observacoes: "Enviar materiais de fundação.", estado: "Realizado" },
      { id: "ps-3", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-09", updated_at: "2026-07-09", status: "Planeado", data: "2026-07-09", dia_da_semana: "Quinta", prisao: "prison-1", igreja_responsavel: "church-hq", lider_responsavel: "Sister Janet Marquele", membros_que_foram: "A confirmar", numero_de_internos_presentes: 0, novos_convertidos: 0, interessados_em_escola_de_fundacao: 0, aula_de_fundacao_dada: false, tema_ou_mensagem: "Comunhão com o Espírito", observacoes: "Confirmar entrada com representante.", estado: "Planeado" }
    ],
    foundationStudents: [
      { id: "pfs-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-26", updated_at: "2026-07-05", status: "Em Curso", nome_do_participante: "Participante A", prisao: "prison-1", igreja_responsavel: "church-hq", aula_1_presenca: true, aula_2_presenca: true, aula_3_presenca: true, aula_4_presenca: false, aula_5_presenca: false, aula_6_presenca: false, aula_7_presenca: false, nota_exame: 0, pratica_evangelismo: false, aprovado: false, graduado: false, certificado_emitido: false, estado: "Em Curso", observacoes: "Turma prisional de Julho." },
      { id: "pfs-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-20", updated_at: "2026-07-05", status: "Exame", nome_do_participante: "Participante B", prisao: "prison-2", igreja_responsavel: "church-hq", aula_1_presenca: true, aula_2_presenca: true, aula_3_presenca: true, aula_4_presenca: true, aula_5_presenca: true, aula_6_presenca: true, aula_7_presenca: true, nota_exame: 68, pratica_evangelismo: true, aprovado: false, graduado: false, certificado_emitido: false, estado: "Exame", observacoes: "Precisa repetir avaliação." }
    ],
    weeklyAgenda: [
      { id: "pwa-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-06", updated_at: "2026-07-06", status: "Confirmado", semana_inicio: "2026-07-06", semana_fim: "2026-07-12", segunda_preparar_relatorios_e_agenda: true, terca_reuniao_de_oracao: true, quarta_followup_com_representante: true, quinta_servico_prisional: true, sexta_servico_prisional: true, sabado_domingo_acompanhamento: true, responsavel: "Sister Janet Marquele", estado: "Confirmado", observacoes: "Equipa preparada para quinta e sexta." }
    ],
    reports: [
      { id: "pr-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Relatório Submetido", name: "Relatório Prisional Semanal", category: "22 Junho - 05 Julho 2026", estado: "Relatório Submetido" }
    ]
  },
  ministryMaterials: {
    catalogue: [
      { id: "mat-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-22", updated_at: "2026-07-05", status: "Disponível", titulo_do_material: "Rapsódia de Realidades", tipo: "Rapsódia", autor_ou_origem: "LoveWorld", formato: "Físico", preco: 120, stock_actual: 180, stock_minimo: 40, estado: "Disponível", observacoes: "Distribuição semanal." },
      { id: "mat-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-22", updated_at: "2026-07-05", status: "Disponível", titulo_do_material: "Manual da Escola de Fundação", tipo: "Manual", autor_ou_origem: "Christ Embassy", formato: "Físico", preco: 250, stock_actual: 26, stock_minimo: 25, estado: "Disponível", observacoes: "Atenção ao stock mínimo." }
    ],
    sales: [
      { id: "sale-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-28", updated_at: "2026-06-28", status: "Confirmado", data: "2026-06-28", semana_do_relatorio: "2026-06-22/2026-06-28", comprador: "Relatório Semanal", igreja: "church-hq", titulo_do_material: "Rapsódia de Realidades", quantidade: 18, valor: 3440, metodo_de_pagamento: "M-Pesa", pop_prova_de_pagamento: "POP-22-28JUN", recebido_por: "Sister Janet Marquele", estado: "Confirmado", observacoes: "Resumo baseado no relatório semanal." },
      { id: "sale-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Confirmado", data: "2026-07-05", semana_do_relatorio: "2026-06-29/2026-07-05", comprador: "Relatório Semanal", igreja: "church-hq", titulo_do_material: "Rapsódia de Realidades", quantidade: 17, valor: 6960, metodo_de_pagamento: "Banco", pop_prova_de_pagamento: "POP-29JUN-05JUL", recebido_por: "Sister Janet Marquele", estado: "Confirmado", observacoes: "Resumo baseado no relatório semanal." }
    ],
    distributions: [
      { id: "dist-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Solicitado", data: "2026-07-08", igreja_destinataria: "church-virtual", titulo_do_material: "Rapsódia de Realidades", quantidade: 35, tipo_de_distribuicao: "Distribuição Gratuita", responsavel_pelo_envio: "Sister Janet Marquele", recebido_por: "", estado: "Solicitado", observacoes: "Para evangelismo online e prisional." }
    ],
    weeklyStock: [
      { id: "stock-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-06-28", updated_at: "2026-06-28", status: "Concluído", semana_inicio: "2026-06-22", semana_fim: "2026-06-28", titulo_do_material: "Rapsódia de Realidades", stock_inicial: 215, entradas: 0, saidas: 18, stock_final: 197, diferenca: 0, observacoes: "18 unidades, 3440 MTn." },
      { id: "stock-2", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Concluído", semana_inicio: "2026-06-29", semana_fim: "2026-07-05", titulo_do_material: "Rapsódia de Realidades", stock_inicial: 197, entradas: 0, saidas: 17, stock_final: 180, diferenca: 0, observacoes: "17 unidades, 6960 MTn." }
    ],
    freeFunds: [
      { id: "fund-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-01", updated_at: "2026-07-05", status: "Activa", campanha: "Rapsódia para Prisões", valor_alvo: 25000, valor_levantado: 10400, materiais_a_distribuir: "Rapsódia de Realidades, Manuais de Fundação", igrejas_beneficiadas: "National HQ, Igreja Online", estado: "Activa", observacoes: "Fundo para distribuição gratuita em prisões." }
    ],
    reports: [
      { id: "mat-report-1", church_id: "church-hq", created_by: "Sister Janet Marquele", updated_by: "Sister Janet Marquele", created_at: "2026-07-05", updated_at: "2026-07-05", status: "Concluído", name: "Relatório Semanal de Materiais", category: "22 Junho - 05 Julho 2026", quantity: 35, amount: 10400 }
    ]
  },
  sacraments: {
    baptisms: [{ id: "bap-1", church_id: "church-hq", nome: "Mateus", apelido: "Nhantumbo", telefone: "862720011", celula: "Cell Central", idade: 28, data_do_baptismo: "2026-07-20", local_do_baptismo: "Sede", baptizado_por: "Pastor Kene Ume", quer_certificado: true, certificado_pago: true, certificado_emitido: false, estado: "Scheduled", observacoes: "" }],
    marriages: [{ id: "mar-1", church_id: "church-hq", nome_do_noivo: "Paulo M.", telefone_do_noivo: "860000001", nome_da_noiva: "Helena C.", telefone_da_noiva: "860000002", aconselhamento_concluido: false, data_do_casamento: "2026-08-24", pastor_responsavel: "Pastor Kene Ume", documentos_entregues: true, estado: "In Progress", observacoes: "" }],
    babies: [{ id: "baby-1", church_id: "church-hq", nome_da_crianca: "Grace Ana", data_de_nascimento: "2026-03-14", nome_do_pai: "Tomas", nome_da_mae: "Ana", telefone_dos_pais: "874520011", data_da_dedicacao: "2026-07-26", pastor_responsavel: "Pastor Kene Ume", certificado_emitido: false, estado: "Scheduled", observacoes: "" }]
  },
  programs: [{ id: "prog-1", church_id: "church-hq", name: "Sunday Service", owner: "Programs Team", status: "Scheduled" }],
  partnership: [{ id: "part-1", church_id: "church-virtual", nome: "Carlos", apelido: "Muianga", name: "Loveworld SAT Partner", telefone: "866877389", whatsapp: "866877389", email: "carlos@example.com", endereco: "Online", celula: "Virtual", category: "Loveworld SAT", status: "Active" }],
  media: [{ id: "media-1", church_id: "church-hq", name: "Sunday Live Service", channel: "YouTube", status: "Active" }],
  auditLogs: [{ id: "audit-1", church_id: "church-hq", actor: "Admin Principal", action: "Created operations prototype", date: "2026-07-06" }]
};

let lang = localStorage.getItem(LANG_KEY) || "pt";
let state = loadState();
let activeUser = state.users[0];
let activeRoute = "dashboard";
let modalMode = null;
let modalType = null;
let modalRecordId = null;
let churchDrawerMode = null;
let churchDrawerRecordId = null;
let churchFormServiceTimes = [];
let financeDrawerMode = null;
let financeDrawerRecordId = null;
let requisitionDrawerRecordId = null;
let requisitionDrawerPresetDecision = "";
let financeContributorUI = { query: "", results: [], activeIndex: -1, open: false, linked: null };
const financePageState = {
  tab: "overview",
  sourceFilter: "",
  reportChartMode: "bar",
  selectedContributor: "",
  partnerSegment: "all",
  exportReportType: "general",
  approvedReqFilters: {
    period: "month",
    dateFrom: "",
    dateTo: "",
    churchId: "",
    department: "",
    finance_status: "",
    urgency: "",
    requester: "",
    minValue: "",
    maxValue: ""
  },
  requisitionReportFilters: {
    period: "month",
    dateFrom: "",
    dateTo: "",
    churchId: "",
    department: "",
    requisition_type: "",
    urgency: "",
    finance_status: "",
    requisition_status: "",
    requester: "",
    approved_by: "",
    released_by: "",
    minValue: "",
    maxValue: "",
    card_filter: ""
  },
  reportFilters: {
    period: "month",
    dateFrom: "",
    dateTo: "",
    churchId: "",
    category: "",
    contributionType: "",
    partnershipArm: "",
    method: "",
    status: "",
    source: "",
    contributor: "",
    cell: "",
    cellGroup: "",
    minValue: "",
    frequency: ""
  }
};
const churchPageState = {
  view: localStorage.getItem(CHURCH_VIEW_KEY) || "cards",
  filters: { search: "", province: "", city: "", type: "", status: "", information_status: "" }
};
const requisitionsPageState = { tab: "overview", cardFilter: {}, reportFilters: { period: "month", dateFrom: "", dateTo: "", churchId: "", department: "", requisition_type: "", urgency: "", finance_status: "", requisition_status: "", requester: "", approved_by: "", released_by: "", minValue: "", maxValue: "", card_filter: "" } };
const staffHrPageState = {
  tab: "overview",
  selectedStaffId: "",
  birthdayFilters: { month: "", churchId: "", department: "", status: "", search: "" },
  cardFilters: { staff: {}, salaries: {}, performance: {}, equipment: {} }
};
const foundationPageState = { panel: "", filter: {} };
const firstTimersPageState = { filter: {} };
const followUpPageState = { filter: {} };
const fevoPageState = { filter: {} };
const venuePageState = { route: "venueInventory", filter: {} };
const sacramentsPageState = { panel: "", filter: {} };
window.staffHrPageState = staffHrPageState;
window.financePageState = financePageState;
window.churchPageState = churchPageState;
window.requisitionsPageState = requisitionsPageState;
window.foundationPageState = foundationPageState;
window.firstTimersPageState = firstTimersPageState;
window.followUpPageState = followUpPageState;
window.fevoPageState = fevoPageState;
window.venuePageState = venuePageState;
window.sacramentsPageState = sacramentsPageState;

function L(key) {
  return TEXT[lang]?.[key] || TEXT.en[key] || key;
}

function byId(id) {
  return document.getElementById(id);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    let initial = structuredClone(seedData);
    if (typeof importPublicGivingQueue === "function") {
      const result = importPublicGivingQueue(initial);
      initial = result.state;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return structuredClone(initial);
  }
  try {
    let normalized = normalizeState(JSON.parse(saved));
    if (typeof importPublicGivingQueue === "function") {
      const result = importPublicGivingQueue(normalized);
      if (result.imported > 0) {
        normalized = result.state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
    }
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return structuredClone(seedData);
  }
}

function normalizeStaffProfileRecord(seed = {}, saved = {}) {
  const merged = { ...structuredClone(seed || {}), ...saved };
  const withDefaults = {
    marital_status: merged.marital_status || "Por Confirmar",
    address: merged.address || "",
    emergency_contact_name: merged.emergency_contact_name || "",
    emergency_contact_phone: merged.emergency_contact_phone || "",
    national_id_number: merged.national_id_number || "",
    nuit: merged.nuit || "",
    bank_name: merged.bank_name || "",
    bank_account_number: merged.bank_account_number || "",
    mobile_money_number: merged.mobile_money_number || "",
    contract_start_date: merged.contract_start_date || merged.start_date || "",
    contract_end_date: merged.contract_end_date || "",
    probation_end_date: merged.probation_end_date || "",
    profile_photo: merged.profile_photo || "",
    bank_or_mobile_details: merged.bank_or_mobile_details || "",
    date_of_birth: merged.date_of_birth || merged.data_de_aniversario || "",
    ...merged
  };
  return window.CEStaffHr?.enrichStaffProfile ? window.CEStaffHr.enrichStaffProfile(withDefaults) : withDefaults;
}

function normalizeState(saved) {
  const merged = { ...structuredClone(seedData), ...saved };
  const savedUserIds = new Set((merged.users || []).map((user) => user.id));
  seedData.users.forEach((user) => {
    if (!savedUserIds.has(user.id)) merged.users.push(structuredClone(user));
  });
  const venueDemoUserIds = new Set(["u-8", "u-11", "u-12", "u-13"]);
  merged.users = (merged.users || []).map((user) => {
    if (!venueDemoUserIds.has(user.id)) return user;
    const seedUser = seedData.users.find((item) => item.id === user.id);
    return seedUser ? { ...user, department_permissions: [...seedUser.department_permissions], assigned_department: seedUser.assigned_department, assigned_staff_name: seedUser.assigned_staff_name } : user;
  });
  merged.prisonMinistry = {
    ...structuredClone(seedData.prisonMinistry),
    ...(saved.prisonMinistry || {})
  };
  merged.ministryMaterials = {
    ...structuredClone(seedData.ministryMaterials),
    ...(saved.ministryMaterials || {})
  };
  merged.cellLeadership = {
    ...structuredClone(seedData.cellLeadership),
    ...(saved.cellLeadership || {})
  };
  if (!Array.isArray(merged.cellLeadership.actionPlans)) {
    merged.cellLeadership.actionPlans = structuredClone(seedData.cellLeadership.actionPlans || []);
  }
  ["cellGroups", "cellRegistry"].forEach((key) => {
    const seedItems = seedData[key] || [];
    const savedItems = merged[key] || [];
    const savedIds = new Set(savedItems.map((item) => item.id));
    seedItems.forEach((item) => {
      if (!savedIds.has(item.id)) savedItems.push(structuredClone(item));
    });
    merged[key] = savedItems.length ? savedItems : structuredClone(seedItems);
  });
  merged.fevo = {
    ...structuredClone(seedData.fevo),
    ...(saved.fevo || {})
  };
  merged.venueInventory = {
    ...structuredClone(seedData.venueInventory),
    ...(saved.venueInventory || {})
  };
  ["inventory", "acquisitions", "staffEquipment", "maintenance", "movements", "venues", "checklists", "reports"].forEach((key) => {
    const seedItems = seedData.venueInventory[key] || [];
    const savedItems = merged.venueInventory[key] || [];
    const savedIds = new Set(savedItems.map((item) => item.id));
    seedItems.forEach((item) => {
      if (!savedIds.has(item.id)) savedItems.push(structuredClone(item));
    });
    merged.venueInventory[key] = savedItems;
  });
  merged.followUps = Array.isArray(merged.followUps) ? merged.followUps : structuredClone(seedData.followUps);
  merged.sacraments = merged.sacraments || structuredClone(seedData.sacraments);
  merged.sacraments.baptisms = merged.sacraments.baptisms || merged.sacraments.baptism || [];
  merged.sacraments.marriages = merged.sacraments.marriages || merged.sacraments.marriage || [];
  merged.sacraments.babies = merged.sacraments.babies || merged.sacraments.babyDedication || [];
  const seedChurches = seedData.churches.map((church) => migrateChurchRecord(structuredClone(church)));
  const savedChurches = (merged.churches || []).map((church) => migrateChurchRecord(church));
  const savedChurchIds = new Set(savedChurches.map((church) => church.id));
  seedChurches.forEach((church) => {
    if (!savedChurchIds.has(church.id)) savedChurches.push(church);
    else {
      const index = savedChurches.findIndex((item) => item.id === church.id);
      savedChurches[index] = migrateChurchRecord({ ...church, ...savedChurches[index] });
    }
  });
  merged.churches = savedChurches.length ? savedChurches : seedChurches;
  const seedFinance = seedData.finance.map((record) => migrateFinanceRecord(structuredClone(record)));
  const savedFinance = (merged.finance || []).map((record) => migrateFinanceRecord(record));
  const savedFinanceIds = new Set(savedFinance.map((record) => record.id));
  seedFinance.forEach((record) => {
    if (!savedFinanceIds.has(record.id)) savedFinance.push(record);
  });
  merged.finance = savedFinance.length ? savedFinance : seedFinance;
  merged.contributors = Array.isArray(merged.contributors) ? merged.contributors : structuredClone(seedData.contributors || []);
  merged.publicGivingSubmissions = Array.isArray(merged.publicGivingSubmissions) ? merged.publicGivingSubmissions : structuredClone(seedData.publicGivingSubmissions || []);
  merged.foundationStudents = (merged.foundationStudents || []).map((student) => migrateFoundationStudent(student));
  ["departments", "requisitions", "staffSalaries", "staffPerformance", "staffAttendance", "staffDocuments"].forEach((key) => {
    merged[key] = Array.isArray(merged[key]) ? merged[key] : structuredClone(seedData[key] || []);
    const seedItems = seedData[key] || [];
    const savedIds = new Set(merged[key].map((item) => item.id));
    seedItems.forEach((item) => {
      if (!savedIds.has(item.id)) merged[key].push(structuredClone(item));
    });
  });
  const seedStaff = seedData.staffProfiles || [];
  const savedStaff = Array.isArray(merged.staffProfiles) ? merged.staffProfiles : [];
  const savedStaffIds = new Set(savedStaff.map((item) => item.id));
  seedStaff.forEach((item) => {
    if (!savedStaffIds.has(item.id)) savedStaff.push(structuredClone(item));
  });
  merged.staffProfiles = savedStaff.map((item) => {
    const seedItem = seedStaff.find((seed) => seed.id === item.id) || {};
    return normalizeStaffProfileRecord(seedItem, item);
  });
  return merged;
}

function saveState(action = "Updated data") {
  state.auditLogs.push({ id: `audit-${Date.now()}`, church_id: activeUser.church_id, actor: activeUser.name, action, date: new Date().toISOString().slice(0, 10) });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scoped(records) {
  const ids = activeUser.can_view_all_churches ? state.churches.map((church) => church.id) : [activeUser.church_id];
  return records.filter((record) => ids.includes(record.church_id));
}

function hasPermission(...permissions) {
  const grants = activeUser.department_permissions || [];
  if (grants.includes("*")) return true;
  return permissions.some((permission) => grants.includes(permission));
}

function canAddChurch() {
  return hasPermission("*") || ["Super Admin", "Church Pastor"].includes(activeUser.role);
}

function relationalChurches() {
  return state.churches.map((church) => migrateChurchRecord(church));
}

function relationalFormOptions(extra = {}) {
  return {
    churches: relationalChurches(),
    translate: L,
    canAddChurch: canAddChurch(),
    renderServiceTimes: (times) => getActiveServiceTimes(times).map((record) => `<li>${formatServiceTimeDetail(record)}</li>`).join(""),
    ...extra
  };
}

function mountRelationalControls(form) {
  if (!form) return;
  initRelationalFormControls(form, relationalFormOptions());
}

function enrichRecordChurchFields(data) {
  const churchId = data.church_id || data.igreja || data.igreja_responsavel || data.igreja_destinataria;
  const church = findChurchById(relationalChurches(), churchId);
  if (!church) return data;
  if (data.church_id) data.church_id = church.id;
  if (!data.igreja) data.igreja = church.public_name || church.church_name;
  if (!data.province) data.province = church.province;
  if (!data.city) data.city = church.city;
  if (!data.district_or_area) data.district_or_area = church.district_or_area || "";
  return data;
}



function canManageVenue() {
  return hasPermission("*", "inventory", "venues", "maintenance", "checklists");
}

function canRequestVenueEquipment() {
  return hasPermission("venueInventoryRequests");
}

function canViewVenueModule() {
  return canManageVenue() || canRequestVenueEquipment() || hasPermission("assignedEquipment", "venueInventory");
}

function isStaffEquipmentOnly() {
  return hasPermission("assignedEquipment") && !canManageVenue() && !canRequestVenueEquipment();
}

function isDepartmentHeadVenue() {
  return canRequestVenueEquipment() && !canManageVenue();
}

function isViewOnlyVenue() {
  return hasPermission("venueInventory") && !canManageVenue() && !canRequestVenueEquipment() && !isStaffEquipmentOnly();
}

function allowedVenueTabs() {
  if (isStaffEquipmentOnly()) return ["staff"];
  if (isDepartmentHeadVenue()) return ["overview", "staff", "movements"];
  return ["overview", "inventory", "acquisitions", "staff", "maintenance", "movements", "spaces", "checklist", "reports"];
}

function canAccessVenueRoute(route) {
  if (!canViewVenueModule()) return false;
  const routeToTab = {
    venueInventory: "overview",
    venueInventoryGeneral: "inventory",
    venueInventoryAcquisitions: "acquisitions",
    venueInventoryStaff: "staff",
    venueInventoryMaintenance: "maintenance",
    venueInventoryMovements: "movements",
    venueInventorySpaces: "spaces",
    venueInventoryChecklist: "checklist",
    venueInventoryReports: "reports"
  };
  const tab = routeToTab[route];
  return !tab || allowedVenueTabs().includes(tab);
}

function venueRecordActions(type, id) {
  if (canManageVenue()) return backendActions(type, id);
  if (canRequestVenueEquipment()) {
    const buttons = [["view", type, id, L("view")], ["export", type, id, L("export")]];
    if (type === "venueMovement") buttons.splice(1, 0, ["edit", type, id, L("edit")]);
    return actionButtons(buttons);
  }
  return actionButtons([["view", type, id, L("view")], ["export", type, id, L("export")]]);
}

function scopedVenueDepartment(records, departmentField = "departamento") {
  let list = scopedNested(records);
  if (canRequestVenueEquipment() && activeUser.assigned_department && !canManageVenue()) {
    list = list.filter((item) => String(item[departmentField] || item.departamento_responsavel || "").includes(activeUser.assigned_department));
  }
  return list;
}

function scopedVenueStaff(records) {
  let list = scopedNested(records);
  if (isStaffEquipmentOnly()) {
    const staffName = activeUser.assigned_staff_name || activeUser.name;
    list = list.filter((item) => item.nome_do_funcionario === staffName);
  }
  return scopedVenueDepartment(list, "departamento");
}

function venueReportName(report) {
  const map = {
    inventoryByCategory: "inventoryByCategory",
    inventoryByStatus: "inventoryByStatus",
    staffEquipmentReport: "staffEquipmentReport",
    damagedItemsReport: "damagedItemsReport",
    repairHistory: "repairHistory",
    movementsByPeriod: "movementsByPeriod",
    checklistByWeek: "checklistByWeek",
    newAcquisitionsByMonth: "newAcquisitionsByMonth"
  };
  return map[report.report_type] ? L(map[report.report_type]) : report.name;
}

function fullName(record) {
  return `${record.tratamento ? `${record.tratamento} ` : ""}${record.nome || ""} ${record.apelido || ""}`.trim();
}

function migrateChurchRecord(church) {
  if (!church) return church;
  const legacyType = { "National HQ": "Sede Nacional", "Virtual Church": "Igreja Virtual", "Church Branch": "Igreja Local", Province: "Igreja Local" };
  const legacyStatus = { Active: "Activa", Inactive: "Inactiva" };
  const churchId = church.id || church.church_id;
  const churchType = legacyType[church.type] || church.type || "Igreja Local";
  const normalized = typeof normalizeLocationValues === "function"
    ? normalizeLocationValues(church.province, church.city)
    : { province: church.province, city: church.city };
  return {
    ...church,
    id: churchId,
    church_id: church.church_id || churchId,
    public_name: church.public_name || church.church_name || "",
    province: normalized.province || church.province || "",
    city: normalized.city || church.city || "",
    district_or_area: church.district_or_area || church.city || "",
    phone_primary: church.phone_primary || church.phone || "",
    phone_secondary: church.phone_secondary || "",
    facebook: church.facebook || "",
    instagram: church.instagram || "",
    youtube: church.youtube || "",
    service_times: resolveServiceTimes(church.service_times, churchId, churchType),
    information_status: church.information_status || "Por Confirmar",
    notes: church.notes || church.notas || "",
    type: churchType,
    status: legacyStatus[church.status] || church.status || "Activa",
    created_by: church.created_by || "Admin Principal",
    updated_by: church.updated_by || "Admin Principal",
    created_at: church.created_at || "2026-07-01",
    updated_at: church.updated_at || "2026-07-10"
  };
}

function churchName(id) {
  const church = state.churches.find((item) => item.id === id || item.church_id === id);
  return church?.public_name || church?.church_name || id || "-";
}

function churchTypeText(type) {
  const key = CHURCH_TYPE_LABELS[type];
  return key ? L(key) : type || "-";
}

function churchPhone(church) {
  if (!church) return "-";
  return [church.phone_primary, church.phone_secondary].filter(Boolean).join(" / ") || "-";
}

function migrateFinanceRecord(record) {
  if (!record) return record;
  const legacyStatus = {
    "Pending Verification": FINANCE_STATUS_PENDING,
    Verified: FINANCE_STATUS_VERIFIED,
    Rejected: FINANCE_STATUS_REJECTED,
    "Included in Report": FINANCE_STATUS_INCLUDED
  };
  const churchId = record.church_id || "";
  const migrated = {
    ...record,
    estado: legacyStatus[record.estado] || record.estado || FINANCE_STATUS_PENDING,
    recebido_por: record.recebido_por || "",
    verificado_por: record.verificado_por || "",
    verified_at: record.verified_at || "",
    comentario_verificacao: record.comentario_verificacao || "",
    motivo_rejeicao: record.motivo_rejeicao || "",
    observacoes: record.observacoes || "",
    whatsapp: record.whatsapp || "",
    igreja: record.igreja || churchName(churchId),
    source_type: record.source_type || "manual",
    member_id: record.member_id || "",
    contributor_id: record.contributor_id || "",
    first_timer_id: record.first_timer_id || "",
    partner_id: record.partner_id || "",
    imagem_envelope_ou_pop: record.imagem_envelope_ou_pop || record.imagem_do_envelope || "",
    imagem_do_envelope: record.imagem_do_envelope || record.imagem_envelope_ou_pop || "",
    source: record.source || (record.source_type === "public_website" ? "public_website" : record.source === "imported" ? "imported" : ""),
    submission_group_id: record.submission_group_id || "",
    public_submission_id: record.public_submission_id || "",
    mensagem_transferencia: record.mensagem_transferencia || "",
    grupo_de_celula: record.grupo_de_celula || "",
    data_de_aniversario: record.data_de_aniversario || "",
    outros_descricao: record.outros_descricao || "",
    data_da_transferencia: record.data_da_transferencia || record.data || "",
    created_at: record.created_at || record.updated_at || record.data || ""
  };
  return typeof enrichFinanceRecord === "function" ? enrichFinanceRecord(migrated) : migrated;
}

function getScopedFinanceList() {
  return scoped(state.finance).map((record) => migrateFinanceRecord(record));
}

function getFinanceReportLabels() {
  return {
    period: L("date"),
    periodToday: L("financePeriodToday"),
    periodWeek: L("financePeriodWeek"),
    periodMonth: L("financePeriodMonth"),
    periodQuarter: L("financePeriodQuarter"),
    periodYear: L("financePeriodYear"),
    periodCustom: L("financePeriodCustom"),
    from: L("from"),
    to: L("to"),
    church: L("church"),
    allChurches: L("financeAllChurches"),
    category: L("category"),
    allCategories: L("financeAllCategories"),
    contributionType: L("financeContributionType"),
    allTypes: L("financeAllTypes"),
    partnershipArm: L("financePartnershipArm"),
    allArms: L("financeAllArms"),
    method: L("method"),
    allMethods: L("financeAllMethods"),
    status: L("status"),
    allStatuses: L("financeAllStatuses"),
    source: L("sourceType"),
    allSources: L("financeAllSources"),
    sourceDashboard: L("sourceDashboard"),
    sourcePublic: L("sourcePublicWebsite"),
    sourceImported: L("sourceImported"),
    contributor: L("contributor"),
    contributorPlaceholder: L("financeContributorSearch"),
    cell: L("cell"),
    cellGroup: L("cellGroup"),
    minValue: L("financeMinValue"),
    frequency: L("financeFrequency"),
    allFrequencies: L("financeAllFrequencies"),
    frequencyConsistent: L("financeFrequencyConsistent"),
    frequencyRegular: L("financeFrequencyRegular"),
    frequencyOccasional: L("financeFrequencyOccasional")
  };
}

function resolveFinanceAccess(user = activeUser) {
  const role = user?.role || "";
  const perms = user?.department_permissions || [];
  const isNationalAdmin = perms.includes("*") || role === "Super Admin" || role === "National Admin";
  const isFinanceHead = isNationalAdmin || role === "Finance Head" || perms.includes("financeHead") || perms.includes("financeVerify");
  const isFinanceOfficer = isFinanceHead || role === "Finance Officer" || perms.includes("financeOfficer") || (perms.includes("finance") && !perms.includes("financeViewer"));
  const isChurchPastor = role === "Church Pastor";
  const isViewer = role === "Viewer" || perms.includes("financeViewer");
  const canViewIndividualDetails = isNationalAdmin || isFinanceHead || isChurchPastor;
  return {
    isNationalAdmin,
    isFinanceHead,
    isFinanceOfficer,
    isChurchPastor,
    isViewer,
    canCreateEntries: isNationalAdmin || isFinanceHead || isFinanceOfficer,
    canVerifyReject: isNationalAdmin || isFinanceHead,
    canViewFullReports: isNationalAdmin || isFinanceHead || isChurchPastor || isFinanceOfficer,
    canViewIndividualDetails,
    canViewAggregatedOnly: isViewer && !canViewIndividualDetails,
    canExport: isNationalAdmin || isFinanceHead || isChurchPastor || isFinanceOfficer,
    scopeChurchOnly: isChurchPastor && !isNationalAdmin && !isFinanceHead
  };
}

function financeFrequencyLabel(key) {
  const map = {
    consistent: L("financeFrequencyConsistent"),
    regular: L("financeFrequencyRegular"),
    occasional: L("financeFrequencyOccasional"),
    none: "-"
  };
  return map[key] || key;
}

function financeContributorProfileHtml(detail, access = resolveFinanceAccess()) {
  if (!access.canViewIndividualDetails) {
    return `<div class="finance-privacy-notice glass-panel p-3"><i class="bi bi-shield-lock me-2"></i>${L("financeAggregatedOnly")}</div>`;
  }
  if (!detail) return `<p class="text-secondary">${L("financeSelectContributor")}</p>`;
  const historyRows = detail.history.map((row) => {
    const proofBtn = row.proof
      ? `<button type="button" class="btn btn-sm btn-outline-cyan" data-action="viewProof" data-type="finance" data-id="${row.id}">${L("viewProof")}</button>`
      : `<span class="text-secondary small">-</span>`;
    const actions = actionButtons([
      ["view", "finance", row.id, L("view")],
      ["edit", "finance", row.id, L("edit")]
    ]);
    return [row.date, row.category, row.arm, row.method, money(row.amount), badge(row.status), proofBtn, actions];
  });
  const historyTable = dataTable(
    [L("date"), L("category"), L("financePartnershipArm"), L("method"), L("amount"), L("status"), L("financeProof"), L("actions")],
    historyRows
  );
  return `
    <article class="finance-contributor-profile glass-panel">
      <div class="finance-contributor-profile-head">
        <div>
          <span class="eyebrow">${L("contributor")}</span>
          <h3 class="h5 mb-0">${detail.name}</h3>
        </div>
        <strong class="finance-contributor-total">${money(detail.total)}</strong>
      </div>
      <div class="row g-3 mt-2 finance-contributor-metrics">
        <div class="col-6 col-md-4"><div class="finance-metric-pill"><span>${L("financeTotalPeriod")}</span><strong>${money(detail.total)}</strong></div></div>
        <div class="col-6 col-md-4"><div class="finance-metric-pill"><span>${L("financeLastContribution")}</span><strong>${detail.lastContributionDate || "-"}</strong></div></div>
        <div class="col-6 col-md-4"><div class="finance-metric-pill"><span>${L("financeFrequency")}</span><strong>${financeFrequencyLabel(detail.frequency)}</strong></div></div>
        <div class="col-6 col-md-4"><div class="finance-metric-pill"><span>${L("financeContributionCount")}</span><strong>${detail.count}</strong></div></div>
        <div class="col-6 col-md-4"><div class="finance-metric-pill"><span>${L("financeContributionState")}</span><strong>${badge(detail.dominantStatus === "verified" ? FINANCE_STATUS_VERIFIED : detail.dominantStatus === "pending" ? FINANCE_STATUS_PENDING : FINANCE_STATUS_REJECTED)}</strong></div></div>
        <div class="col-12"><div class="finance-metric-pill"><span>${L("financeCategoriesContributed")}</span><strong>${detail.categories.join(", ") || "-"}</strong></div></div>
      </div>
      <div class="mt-3">
        <span class="eyebrow d-block mb-2">${L("financeContributionHistory")}</span>
        <div class="table-responsive">${historyTable}</div>
      </div>
    </article>`;
}

function financeChurchReportHtml(churchRows, access = resolveFinanceAccess()) {
  if (!churchRows.length) return `<p class="finance-chart-empty">${L("financeNoChartData")}</p>`;
  const tableRows = churchRows.map((row, index) => [
    index + 1,
    row.church_name,
    money(row.total),
    money(row.verified),
    money(row.pending),
    row.topCategories.map((c) => c.name).join(", ") || "-"
  ]);
  return `
    <div class="table-responsive mb-3">${dataTable(
      ["#", L("church"), L("financeChurchTotal"), L("financeChurchVerified"), L("financeChurchPending"), L("financeChurchTopCategories")],
      tableRows
    )}</div>`;
}

function financePartnerHighlightCards(partnerProfiles) {
  const top = partnerProfiles[0];
  const byArm = (arm) => partnerProfiles.find((p) => p.arm === arm || p.records.some((r) => r.partnership_arm === arm || r.contribution_category === arm));
  const consistentCount = partnerProfiles.filter((p) => p.segment === "consistent").length;
  const newCount = partnerProfiles.filter((p) => p.segment === "new").length;
  const cards = [
    [L("financeTopPartnerGeneral"), top?.name || "-", top ? money(top.total) : "-", "bi-trophy", "gold"],
    [L("financeTopPartnerRhapsody"), byArm("Rapsódia de Realidades")?.name || "-", byArm("Rapsódia de Realidades") ? money(byArm("Rapsódia de Realidades").total) : "-", "bi-book", "cyan"],
    [L("financeTopPartnerHealing"), byArm("Escola de Cura")?.name || "-", byArm("Escola de Cura") ? money(byArm("Escola de Cura").total) : "-", "bi-heart-pulse", "green"],
    [L("financeTopPartnerLwsat"), byArm("Loveworld SAT")?.name || "-", byArm("Loveworld SAT") ? money(byArm("Loveworld SAT").total) : "-", "bi-broadcast", "cyan"],
    [L("financeConsistentPartners"), String(consistentCount), L("financePartnersPerArm"), "bi-arrow-repeat", "green"],
    [L("financeNewPartnersMonth"), String(newCount), L("financeSegmentNew"), "bi-person-plus", "amber"]
  ];
  return `<div class="row g-3 finance-partner-highlight-cards">${cards.map(([title, value, sub, icon, tone]) => `
    <div class="col-6 col-md-4 col-xl-2">
      <article class="finance-highlight-card glass-panel finance-tone-${tone}">
        <i class="bi ${icon} finance-highlight-icon"></i>
        <span class="eyebrow">${title}</span>
        <strong>${value}</strong>
        <small>${sub}</small>
      </article>
    </div>`).join("")}</div>`;
}

function financePartnerSegmentTabs() {
  const segments = [
    ["all", L("financeSegmentAll")],
    ["top", L("financeSegmentTop")],
    ["consistent", L("financeSegmentConsistent")],
    ["new", L("financeSegmentNew")],
    ["inactive", L("financeSegmentInactive")],
    ["followup", L("financeSegmentFollowup")]
  ];
  return `<div class="finance-segment-tabs view-toggle light-surface mb-3" role="group">${segments.map(([key, label]) =>
    `<button type="button" class="view-toggle-btn ${financePageState.partnerSegment === key ? "active" : ""}" data-finance-partner-segment="${key}">${label}</button>`
  ).join("")}</div>`;
}

function financePartnerTable(profiles, access = resolveFinanceAccess()) {
  if (!access.canViewIndividualDetails) {
    return `<div class="finance-privacy-notice glass-panel p-3"><i class="bi bi-shield-lock me-2"></i>${L("financeAggregatedOnly")}</div>`;
  }
  if (!profiles.length) return `<p class="finance-chart-empty">${L("financeNoChartData")}</p>`;
  const rows = profiles.map((p) => {
    const actions = `
      <div class="finance-partner-actions d-flex flex-wrap gap-1">
        <button type="button" class="btn btn-sm btn-outline-gold" data-finance-select-contributor="${p.key}" title="${L("financeViewFinancialProfile")}"><i class="bi bi-person-badge"></i></button>
        <button type="button" class="btn btn-sm btn-outline-cyan" data-finance-select-contributor="${p.key}" data-finance-tab-jump="reports" title="${L("financeViewHistory")}"><i class="bi bi-clock-history"></i></button>
        <button type="button" class="btn btn-sm btn-outline-cyan" data-finance-partner-action="followup" data-partner-key="${p.key}" data-partner-phone="${p.phone}" title="${L("financeContactFollowup")}"><i class="bi bi-chat-dots"></i></button>
        <button type="button" class="btn btn-sm btn-outline-gold" data-finance-partner-action="export" data-partner-key="${p.key}" title="${L("financeExportPartner")}"><i class="bi bi-download"></i></button>
      </div>`;
    return [p.name, churchName(p.church_id), p.arm, money(p.total), p.count, p.lastDate || "-", financeFrequencyLabel(p.frequency), badge(p.hasPending ? FINANCE_STATUS_PENDING : FINANCE_STATUS_VERIFIED), actions];
  });
  return dataTable(
    [L("name"), L("church"), L("financePartnershipArm"), L("amount"), L("financeContributionCount"), L("financeLastContribution"), L("financeFrequency"), L("status"), L("actions")],
    rows
  );
}

function buildFinanceExportHtml(reportType, list, stats, churchRows, partnerProfiles) {
  const title = L(`financeExport${reportType.charAt(0).toUpperCase()}${reportType.slice(1)}`.replace(/financeExportGeneral/, "financeExportGeneral").replace(/financeExportBy/, "financeExportBy")) || reportType;
  const reportTitles = {
    general: L("financeExportGeneral"),
    category: L("financeExportByCategory"),
    arm: L("financeExportByArm"),
    church: L("financeExportByChurch"),
    individual: L("financeExportByIndividual"),
    partners: L("financeExportFeaturedPartners")
  };
  const heading = reportTitles[reportType] || L("financeExportGeneral");
  const summary = `
    <h1>${heading}</h1>
    <p class="meta">${new Date().toLocaleString()} · ${activeUser.name} (${activeUser.role})</p>
    <div class="summary">
      <div class="card"><span>${L("financeTotalReceived")}</span><strong>${money(stats.totalReceived)}</strong></div>
      <div class="card"><span>${L("financeTotalVerified")}</span><strong>${money(stats.totalVerified)}</strong></div>
      <div class="card"><span>${L("financeTotalPending")}</span><strong>${money(stats.totalPending)}</strong></div>
      <div class="card"><span>${L("financeContributionCount")}</span><strong>${stats.contributionCount}</strong></div>
    </div>`;
  let body = "";
  if (reportType === "church" && churchRows?.length) {
    body = `<table><thead><tr><th>#</th><th>${L("church")}</th><th>${L("amount")}</th><th>${L("verified")}</th><th>${L("pendingVerification")}</th></tr></thead><tbody>
      ${churchRows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.church_name}</td><td>${money(r.total)}</td><td>${money(r.verified)}</td><td>${money(r.pending)}</td></tr>`).join("")}
    </tbody></table>`;
  } else if (reportType === "partners" && partnerProfiles?.length) {
    body = `<table><thead><tr><th>${L("name")}</th><th>${L("church")}</th><th>${L("amount")}</th><th>${L("financeContributionCount")}</th></tr></thead><tbody>
      ${partnerProfiles.map((p) => `<tr><td>${p.name}</td><td>${churchName(p.church_id)}</td><td>${money(p.total)}</td><td>${p.count}</td></tr>`).join("")}
    </tbody></table>`;
  } else if (list?.length) {
    body = `<table><thead><tr><th>${L("date")}</th><th>${L("contributor")}</th><th>${L("category")}</th><th>${L("amount")}</th><th>${L("status")}</th></tr></thead><tbody>
      ${list.map((r) => `<tr><td>${r.data || r.date}</td><td>${r.contributor_name || "-"}</td><td>${r.contribution_category}</td><td>${money(r.valor || r.amount)}</td><td>${r.estado}</td></tr>`).join("")}
    </tbody></table>`;
  }
  return summary + body;
}

function moduleTabButton(label, { active = false, attrs = "" } = {}) {
  if (typeof TabButton === "function") return TabButton(label, { active, attrs });
  return `<button type="button" class="tab-button ${active ? "active" : ""}" ${attrs}>${label}</button>`;
}

function moduleTabsNav(buttonsHtml, className = "") {
  if (typeof ModuleTabs === "function") return ModuleTabs(buttonsHtml, { className });
  return `<nav class="module-tabs tab-strip module-tab-strip ${className}" role="tablist" aria-label="${L("moduleNavigation")}">${buttonsHtml}</nav>`;
}

function moduleScrollTabs(items, activeIndex = 0) {
  const buttons = items.map(([label, target], index) =>
    moduleTabButton(label, { active: index === activeIndex, attrs: `data-scroll="${target}"` })
  ).join("");
  return moduleTabsNav(buttons);
}

function financeModuleTabs() {
  const tabs = [
    ["overview", L("financeTabOverview")],
    ["entries", L("financeTabEntries")],
    ["public", L("financeTabPublic")],
    ["verification", L("financeTabVerification")],
    ["approvedRequisitions", L("financeTabApprovedReq")],
    ["reports", L("financeTabReports")],
    ["partners", L("financeTabPartners")],
    ["exports", L("financeTabExports")]
  ];
  return moduleTabsNav(tabs.map(([key, label]) =>
    moduleTabButton(label, { active: financePageState.tab === key, attrs: `data-finance-tab="${key}"` })
  ).join(""), "finance-module-tabs");
}

function migrateRequisitionsFinanceState() {
  const disb = window.CEFinanceDisbursements;
  if (!disb) return;
  const approvedStatuses = ["Aprovado — Aguardando Liberação de Recursos", "Aprovado", "Recursos Liberados", "Comprado / Executado", "Registado no Inventário", "Fechado"];
  (state.requisitions || []).forEach((r) => {
    disb.migrateRequisitionFinanceFields(r);
    if (approvedStatuses.includes(r.status) || r.finance_status) {
      disb.syncDisbursement(state, r);
    }
  });
}

function financeApprovedReqBadge(financeStatus) {
  const disb = window.CEFinanceDisbursements;
  const cls = disb?.financeStatusBadgeClass?.(financeStatus) || "warn";
  const labels = {
    "Aguardando Liberação": "finAwaitingRelease",
    "Recursos Liberados": "finResourcesReleased",
    "Pago": "finMarkPaid",
    "Parcialmente Pago": "finPartialPayment",
    "Cancelado": "rejected"
  };
  const key = labels[financeStatus] || "finFinanceStatus";
  return `<span class="status-pill status-${cls}"><i class="bi bi-circle-fill"></i>${L(key)}</span>`;
}

function financeApprovedReqFilterBar(filters) {
  const disb = window.CEFinanceDisbursements;
  const statuses = disb?.FINANCE_STATUS || {};
  const departments = [...new Set((state.requisitions || []).map((r) => r.department_name).filter(Boolean))];
  const periodOpts = [
    ["month", L("financePeriodMonth")],
    ["quarter", L("financePeriodQuarter")],
    ["year", L("financePeriodYear")],
    ["custom", L("financePeriodCustom")]
  ];
  return `<form class="row g-3 finance-approved-req-filters mb-4" data-finance-approved-req-filters>
    <div class="col-md-3">
      <label class="form-label">${L("financePeriodMonth")}</label>
      <select name="period" class="form-select">${periodOpts.map(([v, l]) => `<option value="${v}" ${filters.period === v ? "selected" : ""}>${l}</option>`).join("")}</select>
    </div>
    <div class="col-md-3">
      <label class="form-label">${L("church")}</label>
      <select name="churchId" class="form-select"><option value="">${L("financeAllChurches")}</option>${scoped(state.churches).map((c) => `<option value="${c.id}" ${filters.churchId === c.id ? "selected" : ""}>${c.church_name}</option>`).join("")}</select>
    </div>
    <div class="col-md-3">
      <label class="form-label">${L("reqDepartment")}</label>
      <select name="department" class="form-select"><option value="">${L("all")}</option>${departments.map((d) => `<option value="${d}" ${filters.department === d ? "selected" : ""}>${d}</option>`).join("")}</select>
    </div>
    <div class="col-md-3">
      <label class="form-label">${L("finFinanceStatus")}</label>
      <select name="finance_status" class="form-select"><option value="">${L("all")}</option>${Object.values(statuses).map((s) => {
        const map = { "Aguardando Liberação": "finAwaitingRelease", "Recursos Liberados": "finResourcesReleased", "Pago": "finMarkPaid", "Parcialmente Pago": "finPartialPayment", "Cancelado": "rejected" };
        return `<option value="${s}" ${filters.finance_status === s ? "selected" : ""}>${L(map[s] || "finFinanceStatus")}</option>`;
      }).join("")}</select>
    </div>
    <div class="col-md-2">
      <label class="form-label">${L("reqUrgency")}</label>
      <select name="urgency" class="form-select"><option value="">${L("all")}</option>${(window.CERequisitions?.URGENCY || []).map((u) => `<option value="${u}" ${filters.urgency === u ? "selected" : ""}>${u}</option>`).join("")}</select>
    </div>
    <div class="col-md-2">
      <label class="form-label">${L("reqRequester")}</label>
      <input name="requester" class="form-control" value="${filters.requester || ""}">
    </div>
    <div class="col-md-2">
      <label class="form-label">${L("finApprovedAmount")} min</label>
      <input name="minValue" type="number" class="form-control" value="${filters.minValue || ""}">
    </div>
    <div class="col-md-2">
      <label class="form-label">${L("finApprovedAmount")} max</label>
      <input name="maxValue" type="number" class="form-control" value="${filters.maxValue || ""}">
    </div>
    <div class="col-md-4 d-flex align-items-end gap-2">
      <button type="submit" class="btn btn-ce-gold">${L("save")}</button>
      <button type="button" class="btn btn-outline-glass" data-finance-approved-req-clear>${L("clearFilters")}</button>
    </div>
  </form>`;
}

function financeApprovedReqActions(record) {
  const disb = window.CEFinanceDisbursements;
  const canRelease = disb?.canReleaseResources?.(activeUser);
  const finStatus = record.finance_status || "Aguardando Liberação";
  const buttons = [["view", "financeApprovedReq", record.id, L("view")]];
  if (canRelease && finStatus === "Aguardando Liberação") {
    buttons.push(["releaseResources", "financeApprovedReq", record.id, L("reqReleaseResources")]);
  }
  if (canRelease && ["Recursos Liberados", "Parcialmente Pago"].includes(finStatus)) {
    buttons.push(["markPaid", "financeApprovedReq", record.id, L("finMarkPaid")]);
    if (finStatus === "Recursos Liberados" || finStatus === "Parcialmente Pago") {
      buttons.push(["partialPayment", "financeApprovedReq", record.id, L("finPartialPayment")]);
    }
  }
  const invTypes = new Set(["Nova Aquisição", "Equipamento", "Material de Ministério", "Reparação"]);
  if (canRelease && invTypes.has(record.requisition_type) && record.finance_status === "Recursos Liberados" && !record.inventory_item_id) {
    buttons.push(["sendToInventory", "financeApprovedReq", record.id, L("finSentToInventory")]);
  }
  return `<div class="action-cluster">${buttons.map(([action, type, id, label]) => {
    const cls = action === "releaseResources" ? "action-btn action-btn--approve" : action === "markPaid" ? "action-btn action-btn--approve" : "action-btn";
    return `<button type="button" class="${cls}" data-action="${action}" data-type="${type}" data-id="${id}">${label}</button>`;
  }).join("")}</div>`;
}

function openFinanceReleaseDrawer(requisitionId, mode = "release") {
  const record = (state.requisitions || []).find((r) => r.id === requisitionId);
  const disb = window.CEFinanceDisbursements;
  if (!record || !disb?.canReleaseResources(activeUser)) return;
  financeDrawerMode = mode === "partial" ? "partialRelease" : "releaseRequisition";
  financeDrawerRecordId = requisitionId;
  const drawer = byId("financeDrawer");
  const backdrop = byId("financeDrawerBackdrop");
  const body = byId("financeDrawerBody");
  const foot = byId("financeDrawerFoot");
  if (!drawer || !backdrop || !body || !foot) return;
  const approved = Number(record.approved_amount || record.estimated_amount || 0);
  const already = Number(record.released_amount || record.amount_released || 0);
  const remaining = Math.max(0, approved - already);
  const today = new Date().toISOString().slice(0, 10);
  const methods = disb.PAYMENT_METHODS || ["Banco", "M-Pesa"];
  byId("financeDrawerEyebrow").textContent = L("finResourceDisbursement");
  byId("financeDrawerTitle").textContent = mode === "partial" ? L("finPartialPayment") : L("finReleaseDrawerTitle");
  body.innerHTML = `
    <section class="finance-detail-section">
      <div class="church-detail-grid">
        <div><span>${L("reqNumber")}</span><strong>${record.request_number}</strong></div>
        <div><span>${L("reqTitle")}</span><strong>${record.title}</strong></div>
        <div><span>${L("finApprovedAmount")}</span><strong>${money(approved)}</strong></div>
        ${already ? `<div><span>${L("finReleasedAmount")}</span><strong>${money(already)}</strong></div>` : ""}
      </div>
    </section>
    <form id="financeDrawerForm" class="row g-3 mt-2">
      <input type="hidden" name="requisition_id" value="${record.id}">
      <div class="col-md-6">
        <label class="form-label">${L("finAmountToRelease")}</label>
        <input name="released_amount" type="number" class="form-control" value="${mode === "partial" ? "" : remaining}" max="${approved}" min="1" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">${L("method")}</label>
        <select name="payment_method" class="form-select" required><option value="">—</option>${methods.map((m) => `<option value="${m}">${m}</option>`).join("")}</select>
      </div>
      <div class="col-md-6">
        <label class="form-label">${L("finPaymentReference")}</label>
        <input name="payment_reference" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">${L("finReleaseDate")}</label>
        <input name="release_date" type="date" class="form-control" value="${today}" required>
      </div>
      <div class="col-12">
        <label class="form-label">${L("observations")}</label>
        <textarea name="payment_notes" class="form-control" rows="3"></textarea>
      </div>
      <div class="col-12">
        <label class="form-label">${L("finPaymentProof")} <span class="field-optional">(${L("optional")})</span></label>
        <input name="payment_proof" type="file" class="form-control" accept="image/*,.pdf">
      </div>
    </form>`;
  foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
    <button type="submit" form="financeDrawerForm" class="btn btn-ce-gold">${L("reqReleaseResources")}</button>`;
  drawer.classList.remove("d-none");
  backdrop.classList.remove("d-none");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  drawer.setAttribute("aria-hidden", "false");
}

function submitFinanceReleaseDrawer(form) {
  const disb = window.CEFinanceDisbursements;
  const data = Object.fromEntries(new FormData(form).entries());
  const recordId = financeDrawerRecordId || data.requisition_id;
  if (!disb || !recordId) return;
  const result = disb.applyRelease(state, activeUser, recordId, {
    released_amount: data.released_amount,
    amount_released: data.released_amount,
    payment_method: data.payment_method,
    payment_reference: data.payment_reference,
    payment_notes: data.payment_notes,
    release_date: data.release_date,
    released_at: data.release_date
  });
  if (!result.ok) {
    const errors = {
      exceeds_approved: L("finExceedsApproved"),
      payment_method_required: L("finPaymentMethodRequired"),
      date_required: L("finReleaseDateRequired"),
      invalid_amount: L("finExceedsApproved")
    };
    alert(errors[result.error] || L("accessDeniedText"));
    return;
  }
  saveState(`Released resources ${recordId}`);
  closeFinanceDrawer();
  alert(L("finReleaseSuccess"));
  if (activeRoute === "finance") renderFinance();
  else setRoute("finance");
}

function requisitionReportFilterBar(filters, formAttr = "data-requisition-report-filters") {
  const rep = window.CERequisitionReports;
  const disb = window.CEFinanceDisbursements;
  const statuses = disb?.FINANCE_STATUS || rep?.FINANCE_STATUS || {};
  const departments = [...new Set((state.requisitions || []).map((r) => r.department_name).filter(Boolean))];
  const types = window.CERequisitions?.TYPES || [];
  const reqStatuses = [...new Set((state.requisitions || []).map((r) => r.status).filter(Boolean))];
  const periodOpts = [
    ["today", L("financePeriodToday")],
    ["week", L("financePeriodWeek")],
    ["month", L("financePeriodMonth")],
    ["quarter", L("financePeriodQuarter")],
    ["year", L("financePeriodYear")],
    ["custom", L("financePeriodCustom")]
  ];
  return `<form class="row g-3 requisition-report-filters mb-4" ${formAttr}>
    <div class="col-md-2"><label class="form-label">${L("financePeriodMonth")}</label>
      <select name="period" class="form-select">${periodOpts.map(([v, l]) => `<option value="${v}" ${filters.period === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("church")}</label>
      <select name="churchId" class="form-select"><option value="">${L("all")}</option>${scoped(state.churches).map((c) => `<option value="${c.id}" ${filters.churchId === c.id ? "selected" : ""}>${c.church_name}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("reqDepartment")}</label>
      <select name="department" class="form-select"><option value="">${L("all")}</option>${departments.map((d) => `<option value="${d}" ${filters.department === d ? "selected" : ""}>${d}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("reqType")}</label>
      <select name="requisition_type" class="form-select"><option value="">${L("all")}</option>${types.map((t) => `<option value="${t}" ${filters.requisition_type === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("finFinanceStatus")}</label>
      <select name="finance_status" class="form-select"><option value="">${L("all")}</option>${Object.values(statuses).map((s) => `<option value="${s}" ${filters.finance_status === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("reqRequisitionStatus")}</label>
      <select name="requisition_status" class="form-select"><option value="">${L("all")}</option>${reqStatuses.map((s) => `<option value="${s}" ${filters.requisition_status === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("reqUrgency")}</label>
      <select name="urgency" class="form-select"><option value="">${L("all")}</option>${(window.CERequisitions?.URGENCY || []).map((u) => `<option value="${u}" ${filters.urgency === u ? "selected" : ""}>${u}</option>`).join("")}</select></div>
    <div class="col-md-2"><label class="form-label">${L("reqRequester")}</label><input name="requester" class="form-control" value="${filters.requester || ""}"></div>
    <div class="col-md-2"><label class="form-label">${L("finApprovedBy")}</label><input name="approved_by" class="form-control" value="${filters.approved_by || ""}"></div>
    <div class="col-md-2"><label class="form-label">${L("reqReleasedBy")}</label><input name="released_by" class="form-control" value="${filters.released_by || ""}"></div>
    <div class="col-md-1"><label class="form-label">Min</label><input name="minValue" type="number" class="form-control" value="${filters.minValue || ""}"></div>
    <div class="col-md-1"><label class="form-label">Max</label><input name="maxValue" type="number" class="form-control" value="${filters.maxValue || ""}"></div>
    <div class="col-md-4 d-flex align-items-end gap-2">
      <button type="submit" class="btn btn-ce-gold">${L("save")}</button>
      <button type="button" class="btn btn-outline-glass" data-requisition-report-clear>${L("clearFilters")}</button>
    </div>
  </form>`;
}

function requisitionReportTableRows(list) {
  return list.map((r) => [
    r.request_number,
    r.title,
    r.church_name || churchName(r.church_id),
    r.department_name,
    r.requested_by_name,
    r.requisition_type,
    r.urgency,
    formatDateTime(r.approved_at).split(",")[0] || "-",
    r.approved_by || "-",
    money(r.approved_amount),
    money(r.released_amount),
    money(r.pending_amount),
    financeApprovedReqBadge(r.finance_status || "Aguardando Liberação"),
    r.released_by || r.resources_released_by || "-",
    formatDateTime(r.released_at || r.resources_released_at).split(",")[0] || "-",
    financeApprovedReqActions(r)
  ]);
}

function exportRequisitionReportExcel(list) {
  const rep = window.CERequisitionReports;
  if (!rep?.exportCsv) return;
  rep.exportCsv(list,
    ["Nº", "Título", "Igreja", "Departamento", "Solicitante", "Tipo", "Aprovado", "Liberado", "Pendente", "Estado Financeiro"],
    (r) => [r.request_number, r.title, r.church_name, r.department_name, r.requested_by_name, r.requisition_type, r.approved_amount, r.released_amount, r.pending_amount, r.finance_status]
  );
}

function buildRequisitionReportExportHtml(list, stats) {
  const rows = list.map((r) => `
    <tr>
      <td>${r.request_number || ""}</td>
      <td>${r.title || ""}</td>
      <td>${r.church_name || churchName(r.church_id) || ""}</td>
      <td>${r.department_name || ""}</td>
      <td>${r.requested_by_name || ""}</td>
      <td>${money(r.approved_amount)}</td>
      <td>${money(r.released_amount)}</td>
      <td>${money(r.pending_amount)}</td>
      <td>${r.finance_status || ""}</td>
    </tr>`).join("");
  return `
    <h1>${L("reqReportsTitle")}</h1>
    <p class="meta">${new Date().toLocaleString()} · ${activeUser.name} (${activeUser.role})</p>
    <div class="summary">
      <div class="card"><span>${L("finApprovedRequisitions")}</span><strong>${stats.approvedCount || stats.total}</strong></div>
      <div class="card"><span>${L("reqApprovedValue")}</span><strong>${money(stats.approvedTotal)}</strong></div>
      <div class="card"><span>${L("finReleasedAmount")}</span><strong>${money(stats.releasedTotal)}</strong></div>
      <div class="card"><span>${L("reqRemainingPending")}</span><strong>${money(stats.pendingTotal)}</strong></div>
    </div>
    <table>
      <thead><tr>
        <th>${L("reqNumber")}</th><th>${L("reqTitle")}</th><th>${L("church")}</th><th>${L("reqDepartment")}</th>
        <th>${L("reqRequester")}</th><th>${L("finApprovedAmount")}</th><th>${L("finReleasedAmount")}</th>
        <th>${L("reqPendingAmount")}</th><th>${L("finFinanceStatus")}</th>
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="9">${L("noResultsFound")}</td></tr>`}</tbody>
    </table>`;
}

function getActiveRequisitionReportContext() {
  const rep = window.CERequisitionReports;
  if (!rep) return { list: [], stats: {} };
  const workflowMode = activeRoute === "requisitions" && requisitionsPageState.tab === "reports";
  const mode = workflowMode ? "workflow" : "finance";
  const filters = workflowMode ? requisitionsPageState.reportFilters : financePageState.requisitionReportFilters;
  const rawList = mode === "workflow" ? rep.getWorkflowList(state, activeUser) : rep.getFinanceApprovedList(state, activeUser);
  const list = rep.filterRecords(rawList, { ...filters, mode });
  return { list, stats: rep.computeReportStats(list), mode, filters };
}

function renderRequisitionReportsPanel(options = {}) {
  const rep = window.CERequisitionReports;
  if (!rep?.canViewReports(activeUser)) {
    return `<div class="finance-privacy-banner"><i class="bi bi-shield-lock"></i><span>${L("accessDeniedText")}</span></div>`;
  }
  const mode = options.mode || "finance";
  const compact = Boolean(options.compact);
  const filters = options.filters || financePageState.requisitionReportFilters;
  const moduleKey = options.module || "finance";
  const rawList = mode === "workflow" ? rep.getWorkflowList(state, activeUser) : rep.getFinanceApprovedList(state, activeUser);
  const list = rep.filterRecords(rawList, { ...filters, mode });
  const stats = rep.computeReportStats(list);
  const labelFn = (key) => L(key);
  const vsChart = typeof financeSemanticBarChart === "function"
    ? financeSemanticBarChart(L("reqApprovedVsReleased"), rep.chartApprovedVsReleased(stats, labelFn), "gold", L("financeNoChartData"))
    : "";
  const statusChart = typeof financeDonutChart === "function"
    ? financeDonutChart(L("finFinanceStatus"), rep.chartByFinanceStatus(list, labelFn), L("financeNoChartData"))
    : "";
  const deptChart = typeof financeHBarChart === "function"
    ? financeHBarChart(L("reqReportByDepartment"), rep.groupSum(list, "department_name", "approved_amount"), L("financeNoChartData"))
    : "";
  const churchChart = typeof financeHBarChart === "function"
    ? financeHBarChart(L("reqReportByChurch"), rep.groupSum(list, "church_name", "approved_amount"), L("financeNoChartData"))
    : "";
  const typeChart = typeof financeSemanticBarChart === "function"
    ? financeSemanticBarChart(L("reqReportByType"), rep.groupSum(list, "requisition_type", "approved_amount"), "cyan", L("financeNoChartData"))
    : "";
  const monthlyRows = rep.chartMonthlyDual(list).map(([m, v]) => [m, v.approved]);
  const monthlyChart = typeof financeLineChart === "function"
    ? financeLineChart(L("reqReportMonthly"), monthlyRows, L("financeNoChartData"))
    : "";
  const workflowChart = mode === "workflow" && typeof financeDonutChart === "function"
    ? financeDonutChart(L("reqReportWorkflow"), Object.entries(rep.computeWorkflowStats(list)).map(([s, c]) => [s, c]), L("financeNoChartData"))
    : "";

  const summaryCards = `
    <div class="row g-3 summary-cards-row requisition-report-cards mb-4">
      ${sm("bi-clipboard-check", L("finApprovedRequisitions"), stats.approvedCount || stats.total, moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { card_filter: "approved" } })}
      ${sm("bi-hourglass-split", L("finAwaitingRelease"), stats.awaiting, moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { card_filter: "awaiting", finance_status: "Aguardando Liberação" } })}
      ${sm("bi-check-circle", L("finResourcesReleased"), stats.released, moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { card_filter: "released", finance_status: "Recursos Liberados" } })}
      ${sm("bi-pie-chart", L("finPartialPayment"), stats.partial, moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { card_filter: "partial", finance_status: "Parcialmente Pago" } })}
      ${sm("bi-cash-coin", L("reqApprovedValue"), money(stats.approvedTotal), moduleKey, { targetTab: options.targetTab || "approvedRequisitions" })}
      ${sm("bi-wallet2", L("finReleasedAmount"), money(stats.releasedTotal), moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { finance_status: "Recursos Liberados" } })}
      ${sm("bi-clock-history", L("reqRemainingPending"), money(stats.pendingTotal), moduleKey, { targetTab: options.targetTab || "approvedRequisitions", filterPayload: { card_filter: "awaiting" } })}
      ${sm("bi-calculator", L("reqAvgPerRequisition"), money(stats.avg), moduleKey, { targetTab: options.targetTab || "approvedRequisitions" })}
    </div>`;

  const deptGroups = rep.groupByDepartment(list);
  const churchGroups = rep.groupByChurch(list);
  const requesterGroups = rep.groupByRequester(list);

  const deptTable = dataTable(
    [L("reqDepartment"), L("finApprovedRequisitions"), L("finApprovedAmount"), L("finReleasedAmount"), L("reqRemainingPending"), L("finPartialPayment"), L("reqHighestRequisition")],
    deptGroups.map((g) => [g.department, g.count, money(g.approvedTotal), money(g.releasedTotal), money(g.pendingTotal), g.partialCount, g.maxReq ? `${g.maxReq.request_number} (${money(g.maxReq.approved_amount)})` : "-"])
  );
  const churchTable = dataTable(
    [L("church"), L("finApprovedAmount"), L("finReleasedAmount"), L("reqRemainingPending"), L("finAwaitingRelease"), L("reqCompleted")],
    churchGroups.map((g) => [g.church, money(g.approvedTotal), money(g.releasedTotal), money(g.pendingTotal), g.awaiting, g.completed])
  );
  const requesterTable = dataTable(
    [L("reqRequester"), L("reqDepartment"), L("church"), L("finApprovedRequisitions"), L("finApprovedAmount"), L("finReleasedAmount"), L("reqPredominantStatus"), L("reqLastApproved")],
    requesterGroups.map((g) => [g.name, g.department, g.church, g.count, money(g.approvedTotal), money(g.releasedTotal), g.predominantStatus, g.lastReq?.request_number || "-"])
  );

  const detailTable = dataTable(
    [L("reqNumber"), L("reqTitle"), L("church"), L("reqDepartment"), L("reqRequester"), L("reqType"), L("reqUrgency"), L("finApprovedAt"), L("finApprovedBy"), L("finApprovedAmount"), L("finReleasedAmount"), L("reqPendingAmount"), L("finFinanceStatus"), L("reqReleasedBy"), L("finReleaseDate"), L("actions")],
    requisitionReportTableRows(list)
  );

  const exportBtns = rep.canExportReports(activeUser) ? `
    <div class="requisition-report-export d-flex flex-wrap gap-2 mb-4">
      <button type="button" class="btn btn-ce-gold" data-req-report-export="excel"><i class="bi bi-file-earmark-excel me-1"></i>${L("reqExportExcel")}</button>
      <button type="button" class="btn btn-outline-cyan" data-req-report-export="print"><i class="bi bi-printer me-1"></i>${L("reqPrintReport")}</button>
      <button type="button" class="btn btn-outline-glass" data-req-report-export="pdf"><i class="bi bi-file-earmark-pdf me-1"></i>${L("reqExportPdf")}</button>
    </div>` : "";

  if (compact) {
    return `
      <div class="row g-4 mb-4 requisition-reports-compact">
        <div class="col-xl-6">${vsChart}</div>
        <div class="col-xl-6">${statusChart}</div>
      </div>`;
  }

  return `
    <div class="requisition-reports-panel" data-req-report-list="${list.length}">
      ${options.showTitle !== false ? `<div class="mb-3"><h3 class="panel-title"><i class="bi bi-graph-up-arrow me-2"></i>${L("reqReportsTitle")}</h3><p class="text-secondary mb-0">${L("reqReportsHint")}</p></div>` : ""}
      ${requisitionReportFilterBar(filters, options.formAttr || "data-requisition-report-filters")}
      ${summaryCards}
      ${exportBtns}
      ${workflowChart ? `<div class="row g-4 mb-4"><div class="col-xl-6">${workflowChart}</div><div class="col-xl-6">${statusChart}</div></div>` : ""}
      <div class="row g-4 mb-4">
        <div class="col-xl-${workflowChart ? "12" : "6"}">${vsChart}</div>
        ${workflowChart ? "" : `<div class="col-xl-6">${statusChart}</div>`}
        <div class="col-xl-6">${deptChart}</div>
        <div class="col-xl-6">${churchChart}</div>
        <div class="col-xl-6">${typeChart}</div>
        <div class="col-xl-6">${monthlyChart}</div>
      </div>
      <div class="row g-4 mb-4">
        <div class="col-12"><article class="panel glass-panel"><div class="panel-head"><h3 class="panel-title">${L("reqReportByDepartment")}</h3></div>${deptTable}</article></div>
        <div class="col-xl-6"><article class="panel glass-panel"><div class="panel-head"><h3 class="panel-title">${L("reqReportByChurch")}</h3></div>${churchTable}</article></div>
        <div class="col-xl-6"><article class="panel glass-panel"><div class="panel-head"><h3 class="panel-title">${L("reqReportByRequester")}</h3></div>${requesterTable}</article></div>
      </div>
      <article class="panel glass-panel mb-0">
        <div class="panel-head"><h3 class="panel-title">${L("reqReportsTitle")}</h3><span class="text-secondary small">${list.length} ${L("finApprovedRequisitions").toLowerCase()}</span></div>
        ${detailTable}
      </article>
    </div>`;
}

function financeReportStatsCards(stats) {
  return `
    <div class="row g-3 summary-cards-row finance-report-stats">
      ${metric("bi-cash-stack", L("financeTotalReceived"), money(stats.totalReceived), L("finance"))}
      ${metric("bi-patch-check", L("financeTotalVerified"), money(stats.totalVerified), L("verified"))}
      ${metric("bi-hourglass", L("financeTotalPending"), money(stats.totalPending), L("pendingVerification"))}
      ${metric("bi-x-circle", L("financeTotalRejected"), money(stats.totalRejected), L("rejected"))}
      ${metric("bi-receipt", L("financeContributionCount"), stats.contributionCount, L("finance"))}
      ${metric("bi-people", L("financeUniqueContributors"), stats.uniqueContributors, L("contributor"))}
      ${metric("bi-calculator", L("financeAverageContribution"), money(stats.averageContribution), L("amount"))}
    </div>`;
}

function financePartnersArmCards(armDetails) {
  if (!armDetails.length) return `<p class="finance-chart-empty">${L("financeNoChartData")}</p>`;
  return `<div class="row g-3">${armDetails.map((row) => `
    <div class="col-md-6 col-xl-4">
      <article class="finance-partner-arm-card glass-panel h-100">
        <div class="finance-partner-arm-head">
          <h3 class="h6 mb-1">${row.arm}</h3>
          <span class="finance-growth-badge ${row.growth >= 0 ? "is-up" : "is-down"}">${row.growthLabel}</span>
        </div>
        <div class="finance-partner-arm-metrics">
          <div><span>${L("amount")}</span><strong>${money(row.total)}</strong></div>
          <div><span>${L("financePartnersPerArm")}</span><strong>${row.partnerCount}</strong></div>
        </div>
        <div class="finance-partner-arm-list">
          <span class="eyebrow">${L("financeActivePartners")}</span>
          ${row.activePartners.slice(0, 4).map((p) => `
            <button type="button" class="finance-partner-chip" data-finance-select-contributor="${p.key}">
              <span>${p.name}</span><strong>${money(p.total)}</strong>
            </button>`).join("") || `<span class="small text-secondary">-</span>`}
        </div>
      </article>
    </div>`).join("")}</div>`;
}

function financeOriginKey(record) {
  if (typeof financeSourceKey === "function") return financeSourceKey(record);
  if (record?.source === "public_website" || record?.source_type === "public_website") return "public_website";
  if (record?.source === "imported") return "imported";
  return "dashboard";
}

function financeOriginLabel(record) {
  const map = {
    public_website: L("sourcePublicWebsite"),
    dashboard: L("sourceDashboard"),
    imported: L("sourceImported")
  };
  return map[financeOriginKey(record)] || map.dashboard;
}

function financeOriginBadge(record) {
  const key = financeOriginKey(record);
  const classMap = {
    public_website: "finance-origin-public",
    dashboard: "finance-origin-dashboard",
    imported: "finance-origin-imported"
  };
  return `<span class="finance-origin-badge ${classMap[key] || classMap.dashboard}">${financeOriginLabel(record)}</span>`;
}

function getScopedPublicSubmissionRows() {
  const churchIds = activeUser.can_view_all_churches ? state.churches.map((church) => church.id) : [activeUser.church_id];
  const submissions = (state.publicGivingSubmissions || []).filter((submission) => churchIds.includes(submission.igreja_id));
  return submissions.map((submission) => {
    const records = scoped(getSubmissionGroupRecords(state, submission.submission_group_id)).map((record) => migrateFinanceRecord(record));
    const total = records.reduce((sum, record) => sum + Number(record.valor || 0), 0);
    const categories = records.map((record) => record.categoria_da_contribuicao).filter(Boolean).join(", ");
    const status = records.length && records.every((record) => statusKey(record.estado) === "verified")
      ? FINANCE_STATUS_VERIFIED
      : records.some((record) => statusKey(record.estado) === "rejected")
        ? FINANCE_STATUS_REJECTED
        : FINANCE_STATUS_PENDING;
    return { submission, records, total, categories, status };
  }).filter((row) => row.records.length);
}

function publicSubmissionActions(submissionGroupId, records) {
  const actions = [["viewSubmission", "finance", submissionGroupId, L("viewSubmission")]];
  const pending = records.some((record) => statusKey(record.estado) === "pendingVerification");
  if (pending) {
    actions.push(["verifyGroup", "finance", submissionGroupId, L("verify")], ["rejectGroup", "finance", submissionGroupId, L("reject")]);
  }
  return actionButtons(actions);
}

function publicSubmissionDetailHtml(submission, records) {
  const lines = records.map((record) => `
    <div class="public-submission-line">
      <div><span>${L("category")}</span><strong>${record.categoria_da_contribuicao}</strong></div>
      <div><span>${L("amount")}</span><strong>${money(record.valor)}</strong></div>
      <div class="public-submission-line-actions">${financeActions(record.id, record)}</div>
    </div>`).join("");
  const proof = submission?.comprovativo_url || records[0]?.imagem_envelope_ou_pop || "";
  const proofHtml = proof
    ? `<div class="mt-3"><a class="btn btn-sm btn-outline-cyan" href="${proof}" target="_blank" rel="noopener"><i class="bi bi-paperclip me-1"></i>${L("viewProof")}</a></div>`
    : "";
  return `
    <section class="finance-detail-section">
      <h4 class="finance-detail-title">${L("publicSubmission")}</h4>
      <div class="church-detail-grid">
        <div><span>${L("name")}</span><strong>${submission?.nome_completo || fullName(records[0] || {})}</strong></div>
        <div><span>${L("phone")}</span><strong>${submission?.telefone || records[0]?.telefone || "-"}</strong></div>
        <div><span>${L("email")}</span><strong>${submission?.email || records[0]?.email || "-"}</strong></div>
        <div><span>${L("church")}</span><strong>${submission?.igreja_nome || churchName(records[0]?.church_id)}</strong></div>
        <div><span>${L("cellGroup")}</span><strong>${submission?.grupo_de_celula || records[0]?.grupo_de_celula || "-"}</strong></div>
        <div><span>${L("cell")}</span><strong>${submission?.celula || records[0]?.celula || "-"}</strong></div>
        <div><span>${L("method")}</span><strong>${submission?.metodo_de_pagamento || records[0]?.metodo_de_pagamento || "-"}</strong></div>
        <div><span>${L("transactionReference")}</span><strong>${submission?.referencia_da_transaccao || records[0]?.referencia_da_transaccao || "-"}</strong></div>
        <div><span>${L("transferDate")}</span><strong>${submission?.data_da_transferencia || records[0]?.data_da_transferencia || "-"}</strong></div>
        <div><span>${L("grandTotal")}</span><strong>${money(submission?.total_geral || records.reduce((sum, record) => sum + Number(record.valor || 0), 0))}</strong></div>
        <div><span>${L("sourceType")}</span><strong>${financeOriginBadge(records[0] || {})}</strong></div>
        <div><span>${L("status")}</span><strong>${badge(records[0]?.estado || FINANCE_STATUS_PENDING)}</strong></div>
      </div>
      ${proofHtml}
    </section>
    <section class="finance-detail-section">
      <h4 class="finance-detail-title">${L("contributionLines")}</h4>
      <div class="public-submission-lines">${lines}</div>
    </section>
    ${submission?.mensagem_transferencia || records[0]?.mensagem_transferencia ? `
      <section class="finance-detail-section">
        <h4 class="finance-detail-title">${L("transferMessage")}</h4>
        <p class="public-submission-message">${escapeFinanceHtml(submission?.mensagem_transferencia || records[0]?.mensagem_transferencia)}</p>
      </section>` : ""}
    ${submission?.observacoes || records[0]?.observacoes ? `
      <section class="finance-detail-section">
        <h4 class="finance-detail-title">${L("observations")}</h4>
        <p class="public-submission-message">${escapeFinanceHtml(submission?.observacoes || records[0]?.observacoes)}</p>
      </section>` : ""}`;
}

function openPublicSubmissionDrawer(mode, submissionGroupId) {
  financeDrawerMode = mode;
  financeDrawerRecordId = submissionGroupId;
  const submission = typeof getPublicSubmission === "function" ? getPublicSubmission(state, submissionGroupId) : null;
  const records = scoped(getSubmissionGroupRecords(state, submissionGroupId)).map((record) => migrateFinanceRecord(record));
  const drawer = byId("financeDrawer");
  const backdrop = byId("financeDrawerBackdrop");
  const body = byId("financeDrawerBody");
  const foot = byId("financeDrawerFoot");
  if (!drawer || !backdrop || !body || !foot || !records.length) return;

  if (mode === "viewSubmission") {
    byId("financeDrawerEyebrow").textContent = L("publicSubmission");
    byId("financeDrawerTitle").textContent = submission?.nome_completo || fullName(records[0]);
    body.innerHTML = publicSubmissionDetailHtml(submission, records);
    const pending = records.some((record) => statusKey(record.estado) === "pendingVerification");
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      ${pending ? `<button type="button" class="btn btn-ce-gold" data-action="verifyGroup" data-type="finance" data-id="${submissionGroupId}">${L("verify")}</button>
      <button type="button" class="btn btn-outline-danger" data-action="rejectGroup" data-type="finance" data-id="${submissionGroupId}">${L("reject")}</button>` : ""}`;
  } else if (mode === "verifyGroup") {
    byId("financeDrawerEyebrow").textContent = L("verifyFinance");
    byId("financeDrawerTitle").textContent = submission?.nome_completo || fullName(records[0]);
    body.innerHTML = `${publicSubmissionDetailHtml(submission, records)}
      <form id="financeDrawerForm" class="row g-3 mt-2">
        ${fieldControl(["comentario_verificacao", "verificationComment", "textarea-optional"], records[0])}
      </form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="submit" form="financeDrawerForm" class="btn btn-ce-gold">${L("verify")}</button>`;
  } else if (mode === "rejectGroup") {
    byId("financeDrawerEyebrow").textContent = L("rejectFinance");
    byId("financeDrawerTitle").textContent = submission?.nome_completo || fullName(records[0]);
    body.innerHTML = `${publicSubmissionDetailHtml(submission, records)}
      <form id="financeDrawerForm" class="row g-3 mt-2">
        ${fieldControl(["motivo_rejeicao", "rejectionReason", "textarea"], records[0])}
      </form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="submit" form="financeDrawerForm" class="btn btn-outline-danger">${L("reject")}</button>`;
  }

  drawer.classList.remove("d-none");
  backdrop.classList.remove("d-none");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  drawer.setAttribute("aria-hidden", "false");
}

async function syncFinanceFromSupabaseIfEnabled() {
  if (!window.CESupabaseBridge?.isEnabled?.()) return false;
  const churchIds = activeUser.can_view_all_churches
    ? state.churches.map((church) => church.id)
    : [activeUser.church_id];
  const result = await window.CESupabaseBridge.syncFinanceIntoState(state, churchIds);
  if (result.synced) {
    state = result.state;
    return true;
  }
  return false;
}

function applyFinanceGroupDecision(submissionGroupId, mode, data) {
  const records = state.finance.filter((record) => record.submission_group_id === submissionGroupId);
  if (!records.length) return false;
  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);
  if (mode === "verifyGroup") {
    records.forEach((record) => {
      record.estado = FINANCE_STATUS_VERIFIED;
      record.verificado_por = activeUser.name;
      record.verified_at = nowIso;
      record.comentario_verificacao = data.comentario_verificacao || "";
      record.updated_by = activeUser.name;
      record.updated_at = today;
    });
    const submission = (state.publicGivingSubmissions || []).find((item) => item.submission_group_id === submissionGroupId);
    if (submission) submission.status = FINANCE_STATUS_VERIFIED;
    saveState(`Verified public submission ${submissionGroupId}`);
    if (window.CESupabaseBridge?.persistGroupDecision) {
      window.CESupabaseBridge.persistGroupDecision(submissionGroupId, mode, data, activeUser.name);
    }
    return true;
  }
  if (mode === "rejectGroup") {
    if (!String(data.motivo_rejeicao || "").trim()) {
      alert(L("rejectionReasonRequired"));
      return false;
    }
    records.forEach((record) => {
      record.estado = FINANCE_STATUS_REJECTED;
      record.verificado_por = activeUser.name;
      record.verified_at = nowIso;
      record.motivo_rejeicao = data.motivo_rejeicao.trim();
      record.updated_by = activeUser.name;
      record.updated_at = today;
    });
    const submission = (state.publicGivingSubmissions || []).find((item) => item.submission_group_id === submissionGroupId);
    if (submission) submission.status = FINANCE_STATUS_REJECTED;
    saveState(`Rejected public submission ${submissionGroupId}`);
    if (window.CESupabaseBridge?.persistGroupDecision) {
      window.CESupabaseBridge.persistGroupDecision(submissionGroupId, mode, data, activeUser.name);
    }
    return true;
  }
  return false;
}

const CONTRIBUTOR_SOURCE_PRIORITY = { member: 4, first_timer: 3, contributor: 2, partner: 1 };

function contributorSourceLabel(sourceType) {
  const map = {
    member: L("sourceMember"),
    first_timer: L("sourceFirstTimer"),
    contributor: L("sourceContributor"),
    partner: L("sourcePartner"),
    manual: L("manual")
  };
  return map[sourceType] || sourceType;
}

function normalizeContributorPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeContributorName(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function escapeFinanceHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function highlightContributorQuery(text, query) {
  const safe = escapeFinanceHtml(text || "");
  const trimmed = String(query || "").trim();
  if (!trimmed) return safe;
  const parts = trimmed.split(/\s+/).filter(Boolean).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!parts.length) return safe;
  return safe.replace(new RegExp(`(${parts.join("|")})`, "gi"), "<mark>$1</mark>");
}

function buildContributorCandidate(base) {
  const nome = base.nome || "";
  const apelido = base.apelido || "";
  const churchId = base.church_id || "";
  return {
    key: base.key,
    source_type: base.source_type,
    member_id: base.member_id || "",
    contributor_id: base.contributor_id || "",
    first_timer_id: base.first_timer_id || "",
    partner_id: base.partner_id || "",
    nome,
    apelido,
    telefone: base.telefone || "",
    whatsapp: base.whatsapp || base.telefone || "",
    email: base.email || "",
    endereco: base.endereco || "",
    celula: base.celula || "",
    church_id: churchId,
    igreja: base.igreja || churchName(churchId),
    displayName: base.displayName || fullName({ nome, apelido }),
    sourceLabel: contributorSourceLabel(base.source_type),
    searchPhone: normalizeContributorPhone(base.telefone || base.whatsapp),
    searchName: normalizeContributorName(`${nome} ${apelido}`)
  };
}

function upsertContributorCandidate(map, candidate) {
  const keys = [candidate.searchPhone, candidate.searchName].filter(Boolean);
  keys.forEach((key) => {
    const existing = map.get(key);
    if (!existing || (CONTRIBUTOR_SOURCE_PRIORITY[candidate.source_type] || 0) > (CONTRIBUTOR_SOURCE_PRIORITY[existing.source_type] || 0)) {
      map.set(key, candidate);
    }
  });
}

function getContributorSearchIndex() {
  const map = new Map();
  scoped(state.members).forEach((member) => {
    upsertContributorCandidate(map, buildContributorCandidate({
      key: `member-${member.id}`,
      source_type: "member",
      member_id: member.id,
      nome: member.nome,
      apelido: member.apelido,
      telefone: member.telefone,
      whatsapp: member.whatsapp,
      email: member.email,
      endereco: member.endereco,
      celula: member.celula,
      church_id: member.church_id
    }));
  });
  scoped(state.firstTimers).forEach((person) => {
    upsertContributorCandidate(map, buildContributorCandidate({
      key: `first_timer-${person.id}`,
      source_type: "first_timer",
      first_timer_id: person.id,
      nome: person.nome,
      apelido: person.apelido,
      telefone: person.telefone,
      whatsapp: person.whatsapp,
      email: person.email,
      endereco: person.endereco,
      celula: person.celula_preferida || "",
      church_id: person.church_id
    }));
  });
  (state.contributors || []).forEach((person) => {
    upsertContributorCandidate(map, buildContributorCandidate({
      key: `contributor-${person.id}`,
      source_type: "contributor",
      contributor_id: person.id,
      nome: person.nome,
      apelido: person.apelido,
      telefone: person.telefone,
      whatsapp: person.whatsapp,
      email: person.email,
      endereco: person.endereco,
      celula: person.celula,
      church_id: person.church_id,
      igreja: person.igreja
    }));
  });
  scoped(state.finance).forEach((record) => {
    const migrated = migrateFinanceRecord(record);
    if (!migrated.nome && !migrated.telefone) return;
    upsertContributorCandidate(map, buildContributorCandidate({
      key: `finance-${record.id}`,
      source_type: "contributor",
      contributor_id: migrated.contributor_id || `finance-${record.id}`,
      member_id: migrated.member_id,
      first_timer_id: migrated.first_timer_id,
      partner_id: migrated.partner_id,
      nome: migrated.nome,
      apelido: migrated.apelido,
      telefone: migrated.telefone,
      whatsapp: migrated.whatsapp,
      email: migrated.email,
      endereco: migrated.endereco,
      celula: migrated.celula,
      church_id: migrated.church_id,
      igreja: migrated.igreja
    }));
  });
  (state.partnership || []).forEach((partner) => {
    if (!partner.nome && !partner.telefone && !partner.name) return;
    const nomeParts = String(partner.name || "").split(" ");
    upsertContributorCandidate(map, buildContributorCandidate({
      key: `partner-${partner.id}`,
      source_type: "partner",
      partner_id: partner.id,
      nome: partner.nome || nomeParts[0] || partner.name || "",
      apelido: partner.apelido || nomeParts.slice(1).join(" "),
      telefone: partner.telefone || "",
      whatsapp: partner.whatsapp,
      email: partner.email,
      endereco: partner.endereco,
      celula: partner.celula,
      church_id: partner.church_id,
      displayName: partner.name || fullName(partner)
    }));
  });
  const unique = new Map();
  map.forEach((candidate) => unique.set(candidate.key, candidate));
  return [...unique.values()].sort((a, b) => a.displayName.localeCompare(b.displayName, "pt"));
}

function searchContributorCandidates(query, limit = 8) {
  const trimmed = String(query || "").trim().toLowerCase();
  if (!trimmed) return [];
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const phoneQuery = normalizeContributorPhone(trimmed);
  return getContributorSearchIndex().filter((candidate) => {
    const haystack = [
      candidate.displayName,
      candidate.nome,
      candidate.apelido,
      candidate.telefone,
      candidate.whatsapp,
      candidate.email,
      candidate.celula,
      candidate.igreja
    ].join(" ").toLowerCase();
    const phoneMatch = phoneQuery && (candidate.searchPhone.includes(phoneQuery) || normalizeContributorPhone(candidate.whatsapp).includes(phoneQuery));
    const textMatch = tokens.every((token) => haystack.includes(token));
    return phoneMatch || textMatch;
  }).slice(0, limit);
}

function findSimilarContributorCandidates(record = {}) {
  const nome = String(record.nome || "").trim();
  const apelido = String(record.apelido || "").trim();
  const telefone = normalizeContributorPhone(record.telefone);
  if (!nome && !telefone) return [];
  return getContributorSearchIndex().filter((candidate) => {
    if (financeContributorUI.linked?.key === candidate.key) return false;
    const phoneMatch = telefone && candidate.searchPhone && (candidate.searchPhone.includes(telefone) || telefone.includes(candidate.searchPhone));
    const nameMatch = nome && apelido && candidate.searchName === normalizeContributorName(`${nome} ${apelido}`);
    const partialName = nome && candidate.nome?.toLowerCase() === nome.toLowerCase() && (!apelido || candidate.apelido?.toLowerCase().startsWith(apelido.toLowerCase()));
    return phoneMatch || nameMatch || partialName;
  }).slice(0, 3);
}

function resetFinanceContributorUI() {
  financeContributorUI = { query: "", results: [], activeIndex: -1, open: false, linked: null };
}

function renderFinanceContributorSuggestions() {
  const list = byId("financeContributorSuggestions");
  if (!list) return;
  const { results, activeIndex, query } = financeContributorUI;
  if (!financeContributorUI.open) {
    list.innerHTML = "";
    list.classList.add("d-none");
    return;
  }
  if (!results.length) {
    list.innerHTML = `
      <div class="finance-suggestion-empty">${L("noSearchResults")}</div>
      <button type="button" class="finance-suggestion-new" data-finance-new-contributor>+ ${L("registerNewContributor")}</button>`;
    list.classList.remove("d-none");
    return;
  }
  list.innerHTML = `${results.map((candidate, index) => `
    <button type="button" class="finance-suggestion-item ${index === activeIndex ? "is-active" : ""}" data-finance-select-contributor="${index}">
      <div class="finance-suggestion-top">
        <strong>${highlightContributorQuery(candidate.displayName, query)}</strong>
        <span class="finance-source-badge">${candidate.sourceLabel}</span>
      </div>
      <div class="finance-suggestion-meta">
        ${highlightContributorQuery([candidate.telefone, candidate.igreja, candidate.celula].filter(Boolean).join(" · "), query)}
      </div>
    </button>`).join("")}
    <button type="button" class="finance-suggestion-new" data-finance-new-contributor>+ ${L("registerNewContributor")}</button>`;
  list.classList.remove("d-none");
}

function renderFinanceDuplicateWarning(matches = []) {
  const box = byId("financeDuplicateWarning");
  if (!box) return;
  if (!matches.length || financeContributorUI.linked) {
    financeContributorUI.duplicateMatches = [];
    box.innerHTML = "";
    box.classList.add("d-none");
    return;
  }
  financeContributorUI.duplicateMatches = matches;
  box.innerHTML = `
    <div class="finance-duplicate-copy">
      <strong>${L("possibleDuplicateFound")}</strong>
      <span>${matches.map((item) => item.displayName).join(" · ")}</span>
    </div>
    <button type="button" class="btn btn-sm finance-duplicate-btn" data-finance-link-duplicate="0">${L("selectThisProfile")}</button>`;
  box.classList.remove("d-none");
}

function setFinanceLinkedBadge(show) {
  const badge = byId("financeLinkedBadge");
  if (!badge) return;
  badge.classList.toggle("d-none", !show);
}

function applyContributorToFinanceForm(candidate) {
  const form = byId("entryForm");
  if (!form || !candidate) return;
  const set = (name, value) => {
    const field = form.elements[name];
    if (field) field.value = value ?? "";
  };
  set("nome", candidate.nome);
  set("apelido", candidate.apelido);
  set("telefone", candidate.telefone);
  set("whatsapp", candidate.whatsapp);
  set("email", candidate.email);
  set("endereco", candidate.endereco);
  set("celula", candidate.celula);
  set("church_id", candidate.church_id);
  set("igreja", candidate.igreja);
  set("source_type", candidate.source_type);
  set("member_id", candidate.member_id);
  set("contributor_id", candidate.contributor_id);
  set("first_timer_id", candidate.first_timer_id);
  set("partner_id", candidate.partner_id);
  financeContributorUI.linked = candidate;
  financeContributorUI.open = false;
  financeContributorUI.activeIndex = -1;
  const search = byId("financeContributorSearch");
  if (search) search.value = candidate.displayName;
  setFinanceLinkedBadge(true);
  renderFinanceContributorSuggestions();
  renderFinanceDuplicateWarning([]);
  const churchSelectEl = form.querySelector('[name="church_id"][data-church-select]');
  if (churchSelectEl) applyChurchSelection(churchSelectEl, relationalChurches(), relationalFormOptions());
}

function clearFinanceContributorLink(clearFields = false) {
  financeContributorUI.linked = null;
  financeContributorUI.open = false;
  financeContributorUI.activeIndex = -1;
  setFinanceLinkedBadge(false);
  const form = byId("entryForm");
  if (!form) return;
  ["source_type", "member_id", "contributor_id", "first_timer_id", "partner_id", "igreja"].forEach((name) => {
    const field = form.elements[name];
    if (field) field.value = name === "source_type" ? "manual" : "";
  });
  if (clearFields) {
    ["nome", "apelido", "telefone", "whatsapp", "email", "endereco", "celula"].forEach((name) => {
      const field = form.elements[name];
      if (field) field.value = "";
    });
    const search = byId("financeContributorSearch");
    if (search) search.value = "";
  }
  renderFinanceContributorSuggestions();
  renderFinanceDuplicateWarning([]);
}

function updateFinanceContributorSearch(query) {
  financeContributorUI.query = query;
  financeContributorUI.results = searchContributorCandidates(query);
  financeContributorUI.open = true;
  financeContributorUI.activeIndex = financeContributorUI.results.length ? 0 : -1;
  renderFinanceContributorSuggestions();
}

function checkFinanceManualDuplicates() {
  const form = byId("entryForm");
  if (!form || modalType !== "finance" || modalMode !== "create") return;
  const matches = findSimilarContributorCandidates({
    nome: form.elements.nome?.value,
    apelido: form.elements.apelido?.value,
    telefone: form.elements.telefone?.value
  });
  renderFinanceDuplicateWarning(matches);
}

function financeContributorSectionHtml(record = {}) {
  const migrated = migrateFinanceRecord(record);
  const churchField = churchSelect("church_id", L("church"), migrated, {
    ...relationalFormOptions(),
    igrejaField: "igreja",
    selectAttrs: "data-finance-person-field"
  });
  return `
    <div class="col-12 finance-form-section">
      <h4 class="finance-form-section-title">${L("contributorSection")}</h4>
      <div id="financeLinkedBadge" class="finance-linked-badge d-none"><i class="bi bi-link-45deg"></i> ${L("linkedToProfile")}</div>
      <div class="finance-contributor-search-wrap">
        <label class="form-label" for="financeContributorSearch">${L("searchMemberContributor")}</label>
        <input id="financeContributorSearch" class="form-control finance-contributor-search" type="search" autocomplete="off"
          placeholder="${L("searchMemberContributorPlaceholder")}" value="" aria-expanded="false" aria-controls="financeContributorSuggestions">
        <div id="financeContributorSuggestions" class="finance-suggestion-list d-none" role="listbox"></div>
      </div>
      <div id="financeDuplicateWarning" class="finance-duplicate-warning d-none"></div>
      <input type="hidden" name="source_type" value="${migrated.source_type || "manual"}">
      <input type="hidden" name="member_id" value="${migrated.member_id || ""}">
      <input type="hidden" name="contributor_id" value="${migrated.contributor_id || ""}">
      <input type="hidden" name="first_timer_id" value="${migrated.first_timer_id || ""}">
      <input type="hidden" name="partner_id" value="${migrated.partner_id || ""}">
      <input type="hidden" name="igreja" value="${migrated.igreja || ""}">
      <div class="row g-3">
        <div class="col-md-6"><label class="form-label">${L("name")}</label><input class="form-control" name="nome" data-finance-person-field value="${migrated.nome || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("surname")}</label><input class="form-control" name="apelido" data-finance-person-field value="${migrated.apelido || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("phone")}</label><input class="form-control" name="telefone" data-finance-person-field value="${migrated.telefone || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("whatsapp")}</label><input class="form-control" name="whatsapp" data-finance-person-field value="${migrated.whatsapp || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("email")}</label><input class="form-control" name="email" type="email" data-finance-person-field value="${migrated.email || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("address")}</label><input class="form-control" name="endereco" data-finance-person-field value="${migrated.endereco || ""}"></div>
        <div class="col-md-6"><label class="form-label">${L("cell")}</label><input class="form-control" name="celula" data-finance-person-field value="${migrated.celula || ""}"></div>
        ${churchField}
      </div>
      <label class="finance-save-contributor form-check mt-3">
        <input class="form-check-input" type="checkbox" name="save_as_contributor" value="1">
        <span class="form-check-label">${L("saveAsNewContributor")}</span>
      </label>
    </div>`;
}

function financeContributionSectionHtml(record = {}) {
  const migrated = migrateFinanceRecord(record);
  return `
    <div class="col-12 finance-form-section">
      <h4 class="finance-form-section-title">${L("contributionSection")}</h4>
      <div class="row g-3">
        ${fieldControl(["categoria_da_contribuicao", "category", "select", givingCategories], migrated)}
        ${fieldControl(["metodo_de_pagamento", "method", "select", paymentMethods], migrated)}
        ${fieldControl(["valor", "amount", "number"], migrated)}
        ${fieldControl(["referencia_da_transaccao", "transactionReference"], migrated)}
        ${fieldControl(["data", "date", "date"], migrated)}
        ${fieldControl(["imagem_do_envelope", "envelopeImage", "file-optional"], migrated)}
        ${fieldControl(["observacoes", "observations", "textarea-optional"], migrated)}
      </div>
    </div>`;
}

function renderFinanceAddForm(record = {}) {
  resetFinanceContributorUI();
  return `${financeContributorSectionHtml(record)}${financeContributionSectionHtml(record)}`;
}

function financeEntrySchema() {
  return [
    ["nome", "name"], ["apelido", "surname"], ["endereco", "address"], ["telefone", "phone"], ["whatsapp", "whatsapp"], ["email", "email", "email"],
    ["celula", "cell"], ["church_id", "church", "church"],
    ["categoria_da_contribuicao", "category", "select", givingCategories],
    ["metodo_de_pagamento", "method", "select", paymentMethods],
    ["valor", "amount", "number"], ["referencia_da_transaccao", "transactionReference"],
    ["data", "date", "date"], ["imagem_do_envelope", "envelopeImage", "file-optional"],
    ["observacoes", "observations", "textarea-optional"]
  ];
}

function financeEditSchema() {
  return [
    ...financeEntrySchema().filter(([name]) => name !== "imagem_do_envelope"),
    ["imagem_do_envelope", "envelopeImage", "file-optional"],
    ["source_type", "sourceType", "readonly"], ["igreja", "church", "readonly"],
    ["recebido_por", "receivedBy", "readonly"], ["verificado_por", "verifiedBy", "readonly"],
    ["estado", "status", "select", financeStatuses], ["verified_at", "verifiedAt", "readonly"],
    ["comentario_verificacao", "verificationComment", "textarea"], ["motivo_rejeicao", "rejectionReason", "textarea"]
  ];
}

function getFinanceSchema(mode) {
  if (mode === "edit") return financeEditSchema();
  return financeEntrySchema();
}

function financeSummaryHtml(record) {
  const finance = migrateFinanceRecord(record);
  return `
    <div class="finance-verify-summary">
      <div><span>${L("contributor")}</span><strong>${fullName(finance)}</strong></div>
      <div><span>${L("amount")}</span><strong>${money(finance.valor)}</strong></div>
      <div><span>${L("category")}</span><strong>${finance.categoria_da_contribuicao || "-"}</strong></div>
      <div><span>${L("method")}</span><strong>${finance.metodo_de_pagamento || "-"}</strong></div>
      <div><span>${L("transactionReference")}</span><strong>${finance.referencia_da_transaccao || "-"}</strong></div>
      <div><span>${L("church")}</span><strong>${churchName(finance.church_id)}</strong></div>
    </div>`;
}

function financeDetailGrid(record) {
  const finance = migrateFinanceRecord(record);
  const proof = finance.imagem_envelope_ou_pop || finance.imagem_do_envelope || "";
  const entryRows = [
    ["nome", "name"], ["apelido", "surname"], ["endereco", "address"], ["telefone", "phone"], ["whatsapp", "whatsapp"], ["email", "email"],
    ["data_de_aniversario", "birthDate"], ["celula", "cell"], ["grupo_de_celula", "cellGroup"], ["igreja", "church"], ["church_id", "church"],
    ["source", "sourceType"], ["categoria_da_contribuicao", "category"], ["outros_descricao", "otherDescription"], ["metodo_de_pagamento", "method"],
    ["valor", "amount"], ["referencia_da_transaccao", "transactionReference"], ["data_da_transferencia", "transferDate"], ["data", "date"],
    ["mensagem_transferencia", "transferMessage"], ["observacoes", "observations"]
  ];
  const verificationRows = [
    ["recebido_por", "receivedBy"], ["verificado_por", "verifiedBy"], ["estado", "status"],
    ["verified_at", "verifiedAt"], ["comentario_verificacao", "verificationComment"],
    ["motivo_rejeicao", "rejectionReason"], ["created_at", "createdAt"]
  ];
  const renderRows = (rows) => rows.map(([key, labelKey]) => {
    let value = finance[key];
    if (key === "church_id") value = churchName(value);
    else if (key === "source") value = financeOriginBadge(finance);
    else if (key === "source_type") value = contributorSourceLabel(value);
    else if (key === "valor") value = money(value);
    else if (key === "estado") value = badge(value);
    else if (key === "verified_at" || key === "created_at") value = formatDateTime(value);
    else value = value || "-";
    return `<div><span>${L(labelKey)}</span><strong>${value}</strong></div>`;
  }).join("");
  const proofHtml = proof
    ? `<div class="mt-3"><a class="btn btn-sm btn-outline-cyan" href="${proof}" target="_blank" rel="noopener"><i class="bi bi-paperclip me-1"></i>${L("viewProof")}</a></div>`
    : "";
  const groupLink = finance.submission_group_id
    ? `<div class="mt-3"><button type="button" class="btn btn-sm btn-outline-cyan" data-action="viewSubmission" data-type="finance" data-id="${finance.submission_group_id}">${L("viewSubmission")}</button></div>`
    : "";
  return `
    <section class="finance-detail-section">
      <h4 class="finance-detail-title">${L("finance")}</h4>
      <div class="church-detail-grid">${renderRows(entryRows)}</div>
      ${proofHtml}
      ${groupLink}
    </section>
    <section class="finance-detail-section">
      <h4 class="finance-detail-title">${L("status")}</h4>
      <div class="church-detail-grid">${renderRows(verificationRows)}</div>
    </section>`;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(lang === "en" ? "en-GB" : "pt-PT", { dateStyle: "short", timeStyle: "short" });
}

function financeActions(id, record) {
  const migrated = migrateFinanceRecord(record);
  const access = resolveFinanceAccess();
  const actions = [];
  if (access.canViewIndividualDetails || access.canViewFullReports) {
    actions.push(["view", "finance", id, L("view")]);
  }
  if (access.canCreateEntries) {
    actions.push(["edit", "finance", id, L("edit")]);
  }
  if (migrated.submission_group_id && (access.canViewIndividualDetails || access.canViewFullReports)) {
    actions.unshift(["viewSubmission", "finance", migrated.submission_group_id, L("viewSubmission")]);
  }
  if (access.canVerifyReject && statusKey(migrated.estado) === "pendingVerification") {
    if (migrated.submission_group_id) {
      actions.push(["verifyGroup", "finance", migrated.submission_group_id, L("verify")], ["rejectGroup", "finance", migrated.submission_group_id, L("reject")]);
    } else {
      actions.push(["verify", "finance", id, L("verify")], ["reject", "finance", id, L("reject")]);
    }
  }
  return actions.length ? actionButtons(actions) : `<span class="text-secondary small">-</span>`;
}

function openFinanceDrawer(mode, id = null) {
  financeDrawerMode = mode;
  financeDrawerRecordId = id;
  const record = id ? migrateFinanceRecord(state.finance.find((item) => item.id === id)) : {};
  const drawer = byId("financeDrawer");
  const backdrop = byId("financeDrawerBackdrop");
  const body = byId("financeDrawerBody");
  const foot = byId("financeDrawerFoot");
  if (!drawer || !backdrop || !body || !foot) return;

  if (mode === "view") {
    byId("financeDrawerEyebrow").textContent = L("financeDetails");
    byId("financeDrawerTitle").textContent = fullName(record) || L("finance");
    body.innerHTML = financeDetailGrid(record);
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="button" class="btn btn-ce-gold" data-action="edit" data-type="finance" data-id="${record.id}">${L("edit")}</button>`;
  } else if (mode === "edit") {
    byId("financeDrawerEyebrow").textContent = L("edit");
    byId("financeDrawerTitle").textContent = fullName(record) || L("finance");
    body.innerHTML = `<form id="financeDrawerForm" class="row g-3">${getFinanceSchema("edit").map((field) => fieldControl(field, record)).join("")}</form>`;
    requestAnimationFrame(() => mountRelationalControls(byId("financeDrawerForm")));
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="submit" form="financeDrawerForm" class="btn btn-ce-gold">${L("save")}</button>`;
  } else if (mode === "verify") {
    byId("financeDrawerEyebrow").textContent = L("verifyFinance");
    byId("financeDrawerTitle").textContent = fullName(record) || L("verify");
    body.innerHTML = `${financeSummaryHtml(record)}
      <form id="financeDrawerForm" class="row g-3 mt-2">
        ${fieldControl(["comentario_verificacao", "verificationComment", "textarea-optional"], record)}
      </form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="submit" form="financeDrawerForm" class="btn btn-ce-gold">${L("verify")}</button>`;
  } else if (mode === "reject") {
    byId("financeDrawerEyebrow").textContent = L("rejectFinance");
    byId("financeDrawerTitle").textContent = fullName(record) || L("reject");
    body.innerHTML = `${financeSummaryHtml(record)}
      <form id="financeDrawerForm" class="row g-3 mt-2">
        ${fieldControl(["motivo_rejeicao", "rejectionReason", "textarea"], record)}
      </form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-finance-drawer-close>${L("cancel")}</button>
      <button type="submit" form="financeDrawerForm" class="btn btn-outline-danger">${L("reject")}</button>`;
  }

  drawer.classList.remove("d-none");
  backdrop.classList.remove("d-none");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  drawer.setAttribute("aria-hidden", "false");
}

function closeFinanceDrawer() {
  const drawer = byId("financeDrawer");
  const backdrop = byId("financeDrawerBackdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.classList.add("d-none");
  setTimeout(() => {
    drawer.classList.add("d-none");
    financeDrawerMode = null;
    financeDrawerRecordId = null;
  }, 280);
}

function submitFinanceDrawer(form) {
  if (financeDrawerMode === "releaseRequisition" || financeDrawerMode === "partialRelease") {
    return submitFinanceReleaseDrawer(form);
  }
  const data = Object.fromEntries(new FormData(form).entries());
  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);

  if (financeDrawerMode === "verifyGroup" || financeDrawerMode === "rejectGroup") {
    if (applyFinanceGroupDecision(financeDrawerRecordId, financeDrawerMode, data)) {
      closeFinanceDrawer();
      if (activeRoute === "finance") renderFinance();
    }
    return;
  }

  const record = state.finance.find((item) => item.id === financeDrawerRecordId);
  if (!record) return;

  if (financeDrawerMode === "verify") {
    record.estado = FINANCE_STATUS_VERIFIED;
    record.verificado_por = activeUser.name;
    record.verified_at = nowIso;
    record.comentario_verificacao = data.comentario_verificacao || "";
    record.updated_by = activeUser.name;
    record.updated_at = today;
    saveState(`Verified finance record ${fullName(record)}`);
    if (window.CESupabaseBridge?.persistRecordDecision) {
      window.CESupabaseBridge.persistRecordDecision(record, {
        estado: FINANCE_STATUS_VERIFIED,
        verificado_por: activeUser.name,
        verified_at: nowIso,
        comentario_verificacao: data.comentario_verificacao || "",
        updated_by: activeUser.name,
        updated_at: today
      });
    }
  } else if (financeDrawerMode === "reject") {
    if (!String(data.motivo_rejeicao || "").trim()) {
      alert(L("rejectionReasonRequired"));
      return;
    }
    record.estado = FINANCE_STATUS_REJECTED;
    record.verificado_por = activeUser.name;
    record.verified_at = nowIso;
    record.motivo_rejeicao = data.motivo_rejeicao.trim();
    record.updated_by = activeUser.name;
    record.updated_at = today;
    saveState(`Rejected finance record ${fullName(record)}`);
    if (window.CESupabaseBridge?.persistRecordDecision) {
      window.CESupabaseBridge.persistRecordDecision(record, {
        estado: FINANCE_STATUS_REJECTED,
        verificado_por: activeUser.name,
        verified_at: nowIso,
        motivo_rejeicao: data.motivo_rejeicao.trim(),
        updated_by: activeUser.name,
        updated_at: today
      });
    }
  } else if (financeDrawerMode === "edit") {
    const payload = { ...data, updated_by: activeUser.name, updated_at: today };
    Object.assign(record, migrateFinanceRecord({ ...record, ...payload }));
    saveState(`Updated finance record ${fullName(record)}`);
  }

  closeFinanceDrawer();
  if (activeRoute === "finance") renderFinance();
}

function isOnlineChurch(church) {
  return ONLINE_CHURCH_TYPES.has(church?.type) || church?.province === "Online" || church?.city === "Online";
}

function getFilteredChurches() {
  let list = scoped(state.churches.map((church) => migrateChurchRecord(church)));
  const filters = churchPageState.filters;
  if (filters.search) {
    const query = filters.search.toLowerCase();
    list = list.filter((church) => [church.church_name, church.public_name, church.city, church.province, church.district_or_area, church.pastor_in_charge, church.phone_primary, church.phone_secondary, church.address].some((value) => String(value || "").toLowerCase().includes(query)));
  }
  if (filters.province) list = list.filter((church) => church.province === filters.province);
  if (filters.city) list = list.filter((church) => church.city === filters.city);
  if (filters.type) list = list.filter((church) => church.type === filters.type);
  if (filters.status) list = list.filter((church) => church.status === filters.status);
  if (filters.information_status) list = list.filter((church) => church.information_status === filters.information_status);
  return list;
}

function churchFilterOptions(key) {
  const values = [...new Set(scoped(state.churches).map((church) => church[key]).filter(Boolean))].sort();
  return values;
}

function churchActions(id) {
  return actionButtons([
    ["view", "church", id, L("view")],
    ["edit", "church", id, L("edit")],
    ["status", "church", id, L("updateStatus")],
    ["export", "church", id, L("export")]
  ]);
}

function syncChurchServiceTimesJson() {
  const input = byId("churchServiceTimesJson");
  if (input) input.value = JSON.stringify(churchFormServiceTimes);
}

function renderChurchServiceTimeRow(record, index) {
  return `
    <div class="church-service-row" data-service-index="${index}" data-service-id="${record.id}">
      <div class="church-service-field">
        <label class="form-label">${L("dayOfWeek")}</label>
        <select class="form-select" data-service-field="day_of_week" data-service-index="${index}">
          ${DAYS_OF_WEEK.map((day) => `<option value="${day}" ${record.day_of_week === day ? "selected" : ""}>${day}</option>`).join("")}
        </select>
      </div>
      <div class="church-service-field">
        <label class="form-label">${L("serviceName")}</label>
        <input class="form-control" type="text" data-service-field="service_name" data-service-index="${index}" value="${record.service_name || ""}">
      </div>
      <div class="church-service-field">
        <label class="form-label">${L("serviceTimeLabel")}</label>
        <input class="form-control" type="time" data-service-field="time" data-service-index="${index}" value="${record.time || "09:00"}">
      </div>
      <div class="church-service-field">
        <label class="form-label">${L("serviceType")}</label>
        <select class="form-select" data-service-field="service_type" data-service-index="${index}">
          ${SERVICE_TYPES.map((type) => `<option value="${type}" ${record.service_type === type ? "selected" : ""}>${serviceTypeText(type)}</option>`).join("")}
        </select>
      </div>
      <div class="church-service-field church-service-active">
        <label class="form-label">${L("status")}</label>
        <label class="church-service-toggle">
          <input type="checkbox" data-service-field="is_active" data-service-index="${index}" ${record.is_active ? "checked" : ""}>
          <span data-service-active-label="${index}">${record.is_active ? L("active") : L("inactive")}</span>
        </label>
      </div>
      <div class="church-service-field church-service-remove-wrap">
        <button type="button" class="btn btn-sm btn-outline-light church-service-remove" data-church-service-remove="${index}">${L("remove")}</button>
      </div>
    </div>`;
}

function refreshChurchServiceTimesRows() {
  const container = byId("churchServiceTimesRows");
  if (!container) return;
  container.innerHTML = churchFormServiceTimes.map((record, index) => renderChurchServiceTimeRow(record, index)).join("");
  syncChurchServiceTimesJson();
}

function renderChurchServiceTimesEditor(serviceTimes = []) {
  churchFormServiceTimes = structuredClone(Array.isArray(serviceTimes) ? serviceTimes : []);
  return `
    <div class="col-12 church-service-times-editor">
      <div class="church-service-times-head">
        <h4 class="church-service-times-title">${L("serviceTimes")}</h4>
        <div class="church-service-presets">
          <button type="button" class="btn btn-sm church-service-preset-btn" data-church-service-preset="general">${L("applyGeneralDefault")}</button>
          <button type="button" class="btn btn-sm church-service-preset-btn" data-church-service-preset="hq">${L("applyHqDefault")}</button>
        </div>
      </div>
      <div class="church-service-times-rows" id="churchServiceTimesRows">
        ${churchFormServiceTimes.map((record, index) => renderChurchServiceTimeRow(record, index)).join("")}
      </div>
      <button type="button" class="btn btn-sm btn-ce-gold church-service-add-btn" data-church-service-add>+ ${L("addServiceTime")}</button>
      <input type="hidden" name="service_times_json" id="churchServiceTimesJson" value="">
    </div>`;
}

function renderChurchServiceTimesDetail(serviceTimes) {
  const active = getActiveServiceTimes(serviceTimes);
  if (!active.length) return `<p class="church-service-empty">${L("toBeConfirmed")}</p>`;
  return `<ul class="church-service-times-list">${active.map((record) => `<li>${formatServiceTimeDetail(record)}</li>`).join("")}</ul>`;
}

function collectChurchServiceTimesFromForm(form) {
  const jsonValue = form.querySelector("#churchServiceTimesJson")?.value;
  if (jsonValue) {
    try {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) return parsed.map((record, index) => normalizeServiceTimeRecord(record, record.id || `svc-${index}`, index));
    } catch {
      /* fall through to row parsing */
    }
  }
  return [...form.querySelectorAll(".church-service-row")].map((row, index) => normalizeServiceTimeRecord({
    id: row.dataset.serviceId || makeServiceTimeId(),
    day_of_week: row.querySelector('[data-service-field="day_of_week"]')?.value,
    service_name: row.querySelector('[data-service-field="service_name"]')?.value,
    time: row.querySelector('[data-service-field="time"]')?.value,
    service_type: row.querySelector('[data-service-field="service_type"]')?.value,
    is_active: row.querySelector('[data-service-field="is_active"]')?.checked,
    notes: ""
  }, row.dataset.serviceId || `svc-${index}`, index));
}

function money(value) {
  return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function statusKey(status) {
  return STATUS_KEYS[status] || status;
}

function statusText(status) {
  if (status === "Activa") return lang === "pt" ? "Activa" : "Active";
  if (status === "Inactiva") return lang === "pt" ? "Inactiva" : "Inactive";
  if (status === "Por Confirmar") return L("toConfirm");
  if (status === "Confirmado") return L("confirmed");
  if (status === "Incompleto") return L("incomplete");
  const reqStatusLabels = {
    sentToPastor: "reqSentToPastor",
    returnedForCorrection: "reqReturnedForCorrection",
    approvedAwaitingRelease: "reqApprovedAwaitingRelease",
    resourcesReleased: "reqResourcesReleased",
    purchasedExecuted: "reqPurchasedExecuted",
    registeredInventory: "reqRegisteredInventory"
  };
  const key = statusKey(status);
  if (reqStatusLabels[key]) return L(reqStatusLabels[key]);
  return L(key);
}

function yesNo(value) {
  return value ? L("yes") : L("no");
}

function badge(status) {
  return `<span class="status-pill status-${badgeClass(status)}"><i class="bi bi-circle-fill"></i>${statusText(status)}</span>`;
}

function badgeClass(status) {
  const reqLib = window.CERequisitions;
  if (reqLib?.statusBadgeClass) {
    const reqClass = reqLib.statusBadgeClass(status);
    if (reqClass) return reqClass;
  }
  const key = statusKey(status);
  if (["sentToPastor", "approvedAwaitingRelease"].includes(key)) return "cyan";
  if (["returnedForCorrection"].includes(key)) return "warn";
  if (["resourcesReleased", "purchasedExecuted", "registeredInventory"].includes(key)) return "good";
  if (["active", "verified", "becameMember", "completed", "certificateIssued", "confirmed", "available", "approved", "received", "sent", "reportSubmitted", "validated", "excellent", "good", "growing", "graduated"].includes(key)) return "good";
  if (["contacted", "sentToCell", "enrolledFoundation", "enrolled", "exam", "readyForExam"].includes(key)) return "blue";
  if (["pending", "pendingVerification", "scheduled", "planned", "inPreparation", "requested", "draft", "needsAttention", "toConfirm"].includes(key)) return "warn";
  if (["submitted", "reportSubmitted"].includes(key)) return "cyan";
  if (["underEvaluation", "forwardValidation"].includes(key)) return "course";
  if (["partiallyConfirmed"].includes(key)) return "cyan";
  if (["incomplete"].includes(key)) return "orange";
  if (["rejected", "cancelled", "outOfStock", "critical"].includes(key)) return "danger";
  if (["inProgress", "interested", "inTraining"].includes(key)) return "course";
  if (["inactive", "closed", "transferred", "paused", "discontinued", "returned"].includes(key)) return "muted";
  return "blue";
}

function resolveRouteAccess(route) {
  if (window.CEAccessControl?.getNavItemState) {
    return window.CEAccessControl.getNavItemState(activeUser, route);
  }
  return { visible: true, locked: false, access: { can_view: true } };
}

function canAccessNavRoute(route) {
  const nav = resolveRouteAccess(route);
  if (!nav.visible) return false;
  if (route === "venueInventory") return canViewVenueModule();
  return true;
}

function canEnterRoute(route) {
  const nav = resolveRouteAccess(route);
  return nav.access?.can_view && !nav.locked;
}

function loadSidebarGroupState() {
  try {
    return JSON.parse(localStorage.getItem(SIDEBAR_GROUPS_KEY) || "{}");
  } catch {
    return {};
  }
}

let sidebarGroupState = loadSidebarGroupState();

function isSidebarGroupExpanded(key) {
  return sidebarGroupState[key] !== false;
}

function toggleSidebarGroup(key) {
  const expanded = !isSidebarGroupExpanded(key);
  sidebarGroupState[key] = expanded;
  localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(sidebarGroupState));
  const group = document.querySelector(`[data-nav-group="${key}"]`);
  if (!group) return;
  group.classList.toggle("is-expanded", expanded);
  group.querySelector(".nav-group-toggle, .nav-cell-parent, .nav-cell-area-toggle")?.setAttribute("aria-expanded", String(expanded));
}

function isCellRoute(route) {
  return CELL_TAB_ROUTES.has(route);
}

function cellRouteLabel(route) {
  for (const area of CELL_NAV.areas) {
    const found = area.routes.find(([itemRoute]) => itemRoute === route);
    if (found) return L(found[1]);
  }
  return L("cellLeadership");
}

function cellRouteAreaLabel(route) {
  const area = CELL_NAV.areas.find((item) => item.routes.some(([itemRoute]) => itemRoute === route));
  return area ? L(area.label) : L("cellLeadership");
}

function renderCellSidebarNav() {
  const parentExpanded = isSidebarGroupExpanded(CELL_NAV.parentKey);
  const parentActive = isCellRoute(activeRoute);
  return `
    <div class="nav-cell-branch ${parentExpanded ? "is-expanded" : ""} ${parentActive ? "has-active" : ""}" data-nav-group="${CELL_NAV.parentKey}">
      <button type="button" class="nav-cell-parent" aria-expanded="${parentExpanded}" aria-label="${L("navGroupToggle")}: ${L("cellLeadership")}">
        <i class="bi bi-diagram-3" aria-hidden="true"></i>
        <span>${L("cellLeadership")}</span>
        <i class="bi bi-chevron-down nav-cell-chevron" aria-hidden="true"></i>
      </button>
      <div class="nav-cell-body">
        <div class="nav-cell-body-inner">
          ${CELL_NAV.areas.map((area) => {
            const areaExpanded = isSidebarGroupExpanded(area.key);
            const areaActive = area.routes.some(([route]) => route === activeRoute);
            return `
              <div class="nav-cell-area ${areaExpanded ? "is-expanded" : ""} ${areaActive ? "has-active" : ""}" data-nav-group="${area.key}">
                <button type="button" class="nav-cell-area-toggle" aria-expanded="${areaExpanded}" aria-label="${L("navGroupToggle")}: ${L(area.label)}">
                  <span>${L(area.label)}</span>
                  <i class="bi bi-chevron-down nav-cell-area-chevron" aria-hidden="true"></i>
                </button>
                <div class="nav-cell-area-body">
                  <div class="nav-cell-area-body-inner">
                    ${area.routes.map(([route, label]) => `
                      <button type="button" class="nav-cell-item ${activeRoute === route ? "active" : ""}" data-route="${route}" title="${L(label)}">
                        <span>${L(label)}</span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

function cellModuleHeader(route, { modalType = null } = {}) {
  return moduleNavShell("cellLeadership", {
    title: cellRouteLabel(route),
    subtitle: `${L("cellLeadership")} › ${cellRouteAreaLabel(route)}`,
    modalType,
    icon: "bi-diagram-3"
  }, `<div class="cell-route-context"><span class="eyebrow">${L("cellLeadership")}</span><span class="cell-route-sep">›</span><span>${cellRouteAreaLabel(route)}</span></div>`);
}

function isSidebarCollapsed() {
  return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

function applySidebarCollapse(collapsed = isSidebarCollapsed()) {
  const shell = document.querySelector(".ops-shell");
  const toggle = byId("sidebarCollapseToggle");
  if (!shell) return;
  shell.classList.toggle("is-sidebar-collapsed", collapsed);
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  if (toggle) {
    toggle.setAttribute("aria-label", collapsed ? L("sidebarExpand") : L("sidebarCollapse"));
    toggle.setAttribute("title", collapsed ? L("sidebarExpand") : L("sidebarCollapse"));
  }
}

function renderShell() {
  byId("sidebarNav").innerHTML = NAV_GROUPS.map((group) => {
    const items = group.items.map(([route, icon, label]) => ({ route, icon, label, nav: resolveRouteAccess(route) }))
      .filter((item) => item.nav.visible && (item.route !== "venueInventory" || canViewVenueModule()));
    if (!items.length && group.key !== "departments") return "";
    const expanded = isSidebarGroupExpanded(group.key);
    const cellNav = group.key === "departments" ? renderCellSidebarNav() : "";
    const navItems = items.map(({ route, icon, label, nav }) => `
      <button type="button" class="nav-item-btn ${nav.locked ? "is-locked" : ""}" ${nav.locked ? `data-locked-route="${route}"` : `data-route="${route}"`} title="${nav.locked ? L("navLockedTooltip") : L(label)}" ${nav.locked ? "disabled" : ""}>
        <i class="bi ${icon}"></i><span>${L(label)}</span>${nav.locked ? `<i class="bi bi-lock-fill nav-lock-icon" aria-hidden="true"></i>` : ""}
      </button>
    `).join("");
    if (!navItems && !cellNav) return "";
    return `
    <div class="nav-group ${expanded ? "is-expanded" : ""}" data-nav-group="${group.key}">
      <button type="button" class="nav-group-toggle" aria-expanded="${expanded}" aria-label="${L("navGroupToggle")}: ${L(group.key)}">
        <span>${L(group.key)}</span>
        <i class="bi bi-chevron-down nav-group-chevron" aria-hidden="true"></i>
      </button>
      <div class="nav-group-body">
        <div class="nav-group-body-inner">
          ${cellNav}
          ${navItems}
        </div>
      </div>
    </div>`;
  }).join("");
  byId("activeUserName").textContent = activeUser.name;
  byId("activeUserRole").textContent = activeUser.role;
  applySidebarCollapse();
}

function applyLanguage(next = lang) {
  lang = next;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = key === "login.title" ? L("loginTitle") :
      key === "login.lead" ? L("loginLead") :
      key === "login.password" ? L("loginPassword") :
      key === "login.submit" ? L("loginSubmit") :
      key === "login.note" ? L("loginNote") :
      key === "top.site" ? L("viewSite") :
      key === "top.logout" ? L("logout") :
      key === "cancel" ? L("cancel") :
      key === "save" ? L("save") : L(key);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
  const brandOps = byId("brandOps");
  if (brandOps) {
    brandOps.innerHTML = lang === "pt" ? "CE MOZAMBIQUE<small>OPERAÇÕES</small>" : "CE MOZAMBIQUE<small>OPERATIONS</small>";
  }
  renderShell();
  applySidebarCollapse();
  applyBackToTopLabel();
  if (!byId("appView").classList.contains("d-none")) {
    setRoute(activeRoute);
    syncTopbarHeight();
    updateBackToTopVisibility();
  }
}

function updateBackToTopVisibility() {
  const button = byId("backToTopBtn");
  const content = byId("content");
  if (!button || !content || byId("appView").classList.contains("d-none")) {
    button?.classList.remove("is-visible");
    return;
  }
  button.classList.toggle("is-visible", content.scrollTop > 280);
}

function applyBackToTopLabel() {
  const button = byId("backToTopBtn");
  if (!button) return;
  const label = L("backToTop");
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
}

function scrollContentTo(target, { behavior = "smooth" } = {}) {
  const content = byId("content");
  if (!content) return;
  if (!target || target === "content") {
    content.scrollTo({ top: 0, behavior });
    return;
  }
  const element = typeof target === "string" ? byId(target) : target;
  if (!element) return;
  const stickyNav = content.querySelector(".module-nav-sticky");
  const offset = (stickyNav?.offsetHeight || 0) + 8;
  const top = element.getBoundingClientRect().top - content.getBoundingClientRect().top + content.scrollTop - offset;
  content.scrollTo({ top: Math.max(0, top), behavior });
}

function renderAccessDenied() {
  setPageContent(`
    <article class="panel glass-panel access-denied-panel text-center py-5">
      <div class="access-denied-icon mb-3"><i class="bi bi-shield-lock"></i></div>
      <h2 class="mb-2">${L("accessDeniedTitle")}</h2>
      <p class="text-secondary mb-4">${L("accessDeniedText")}</p>
      <button type="button" class="btn btn-ce-gold btn-touch" data-route="dashboard">${L("accessDeniedBack")}</button>
    </article>
  `);
}

function setRoute(route) {
  const prevRoute = activeRoute;
  activeRoute = route || "dashboard";
  if (CELL_ROUTE_ALIASES[activeRoute]) activeRoute = CELL_ROUTE_ALIASES[activeRoute];
  if (!canEnterRoute(activeRoute)) {
    renderAccessDenied();
    byId("pageTitle").textContent = L("accessDeniedTitle");
    byId("sectionLabel").textContent = L("admin");
    history.replaceState(null, "", `#${activeRoute}`);
    document.querySelector(".ops-sidebar")?.classList.remove("is-open");
    updateBackToTopVisibility();
    return;
  }
  if (activeRoute.startsWith("venueInventory") && !canAccessVenueRoute(activeRoute)) {
    activeRoute = isStaffEquipmentOnly() ? "venueInventoryStaff" : "venueInventory";
  }
  const found = NAV_GROUPS.flatMap((group) => group.items.map((item) => ({ group, item }))).find(({ item }) => item[0] === activeRoute);
  const childRoutes = {
    cellAlecOverview: ["departments", "cellAlecOverview"],
    cellAlecRegistration: ["departments", "alecRegistration"],
    cellAlecScores: ["departments", "alecScores"],
    cellChurchReports: ["departments", "churchReports"],
    cellMinistryOverview: ["departments", "cellMinistryOverview"],
    cellReceivedReports: ["departments", "receivedReports"],
    cellEvaluationRoute: ["departments", "cellEvaluation"],
    cellPerformance: ["departments", "cellPerformance"],
    cellLeadersAttention: ["departments", "leadersAttention"],
    cellActionPlan: ["departments", "actionPlan"],
    cellWeeklyReport: ["departments", "weeklyCellReport"],
    cellGroups: ["departments", "cellGroups"],
    cellCellsList: ["departments", "cellCellsList"],
    cellLeadersRoute: ["departments", "cellLeaders"],
    cellFinalValidation: ["departments", "finalValidation"],
    cellConsolidation: ["departments", "consolidation"],
    cellPrison: ["departments", "prisonMinistry"],
    cellMaterials: ["departments", "ministryMaterials"],
    fevoConfigRoute: ["departments", "weeklyConfiguration"],
    fevoFollowUpRoute: ["departments", "followUp"],
    fevoEvangelismRoute: ["departments", "evangelism"],
    fevoVisitationRoute: ["departments", "visitation"],
    fevoPrayerRoute: ["departments", "prayer"],
    fevoNoReportsRoute: ["departments", "groupsWithoutReport"],
    fevoWeeklyReportsRoute: ["departments", "weeklyReports"],
    fevoAnalysisRoute: ["departments", "analysis"],
    venueInventoryGeneral: ["departments", "generalInventory"],
    venueInventoryAcquisitions: ["departments", "newAcquisitions"],
    venueInventoryStaff: ["departments", "staffEquipment"],
    venueInventoryMaintenance: ["departments", "maintenanceRepairs"],
    venueInventoryMovements: ["departments", "loansMovements"],
    venueInventorySpaces: ["departments", "venuesRooms"],
    venueInventoryChecklist: ["departments", "serviceChecklist"],
    venueInventoryReports: ["departments", "venueReports"]
  };
  byId("pageTitle").textContent = found ? L(found.item[2]) : isCellRoute(activeRoute) ? cellRouteLabel(activeRoute) : childRoutes[activeRoute] ? L(childRoutes[activeRoute][1]) : L("dashboard");
  byId("sectionLabel").textContent = found ? L(found.group.key) : isCellRoute(activeRoute) || childRoutes[activeRoute] ? L("departments") : L("main");
  document.querySelectorAll("[data-route]").forEach((item) => {
    const route = item.dataset.route;
    const isActive = route === activeRoute ||
      (route === "fevo" && activeRoute.startsWith("fevo")) ||
      (route === "venueInventory" && activeRoute.startsWith("venueInventory"));
    item.classList.toggle("active", isActive);
  });
  if (isCellRoute(activeRoute)) {
    sidebarGroupState[CELL_NAV.parentKey] = true;
    sidebarGroupState.departments = true;
    const activeArea = CELL_NAV.areas.find((area) => area.routes.some(([route]) => route === activeRoute));
    if (activeArea) sidebarGroupState[activeArea.key] = true;
    localStorage.setItem(SIDEBAR_GROUPS_KEY, JSON.stringify(sidebarGroupState));
    renderShell();
  }
  const renderers = {
    dashboard: renderDashboard,
    churches: renderChurches,
    members: renderMembers,
    firstTimers: renderFirstTimers,
    followUp: renderFollowUp,
    reports: renderReports,
    counseling: renderFirstTimers,
    foundation: renderFoundation,
    finance: renderFinance,
    cellAlecOverview: () => renderCellMinistry("alecOverview"),
    cellAlecRegistration: () => renderCellMinistry("alecRegistration"),
    cellAlecScores: () => renderCellMinistry("alecScores"),
    cellChurchReports: () => renderCellMinistry("churchReports"),
    cellMinistryOverview: () => renderCellMinistry("ministryOverview"),
    cellReceivedReports: () => renderCellMinistry("receivedReports"),
    cellEvaluationRoute: () => renderCellMinistry("cellEvaluation"),
    cellPerformance: () => renderCellMinistry("cellPerformance"),
    cellLeadersAttention: () => renderCellMinistry("leadersAttention"),
    cellActionPlan: () => renderCellMinistry("actionPlan"),
    cellWeeklyReport: () => renderCellMinistry("weeklyReport"),
    cellGroups: renderCellGroups,
    cellCellsList: renderCellCellsList,
    cellLeadersRoute: () => renderCellMinistry("cellLeaders"),
    cellFinalValidation: () => renderCellMinistry("finalValidation"),
    cellConsolidation: () => renderCellMinistry("consolidation"),
    cellPrison: renderPrisonMinistry,
    cellMaterials: renderMinistryMaterials,
    fevo: () => renderFevo("overview"),
    fevoConfigRoute: () => renderFevo("config"),
    fevoFollowUpRoute: () => renderFevo("followup"),
    fevoEvangelismRoute: () => renderFevo("evangelism"),
    fevoVisitationRoute: () => renderFevo("visitation"),
    fevoPrayerRoute: () => renderFevo("prayer"),
    fevoNoReportsRoute: () => renderFevo("noReports"),
    fevoWeeklyReportsRoute: () => renderFevo("weeklyReports"),
    fevoAnalysisRoute: () => renderFevo("analysis"),
    venueInventory: () => renderVenueInventory("overview"),
    venueInventoryGeneral: () => renderVenueInventory("inventory"),
    venueInventoryAcquisitions: () => renderVenueInventory("acquisitions"),
    venueInventoryStaff: () => renderVenueInventory("staff"),
    venueInventoryMaintenance: () => renderVenueInventory("maintenance"),
    venueInventoryMovements: () => renderVenueInventory("movements"),
    venueInventorySpaces: () => renderVenueInventory("spaces"),
    venueInventoryChecklist: () => renderVenueInventory("checklist"),
    venueInventoryReports: () => renderVenueInventory("reports"),
    sacraments: renderSacraments,
    programs: () => renderSimple("programs", L("programs"), state.programs),
    partnership: () => renderSimple("partnership", L("partnership"), state.partnership),
    media: () => renderSimple("media", L("media"), state.media),
    requisitions: renderRequisitions,
    staffHr: renderStaffHr,
    users: renderUsers,
    access: renderAccess,
    settings: renderSettings,
    audit: renderAudit
  };
  (renderers[activeRoute] || renderDashboard)();
  history.replaceState(null, "", `#${activeRoute}`);
  document.querySelector(".ops-sidebar").classList.remove("is-open");
  const contentEl = byId("content");
  if (contentEl) {
    const stayInModuleTabs = isModuleTabRoute(prevRoute) && isModuleTabRoute(activeRoute) &&
      tabParallaxFamily(prevRoute) === tabParallaxFamily(activeRoute);
    if (!stayInModuleTabs) contentEl.scrollTop = 0;
    updateBackToTopVisibility();
  }
}

function syncTopbarHeight() {
  const topbar = document.querySelector(".ops-topbar");
  if (!topbar) return;
  document.documentElement.style.setProperty("--topbar-height", `${topbar.offsetHeight}px`);
}

function loadModuleNavState() {
  try {
    return JSON.parse(localStorage.getItem(MODULE_NAV_KEY) || "{}");
  } catch {
    return {};
  }
}

let moduleNavState = loadModuleNavState();

function isModuleNavExpanded(key) {
  return moduleNavState[key] !== false;
}

function toggleModuleNav(key) {
  const expanded = !isModuleNavExpanded(key);
  moduleNavState[key] = expanded;
  localStorage.setItem(MODULE_NAV_KEY, JSON.stringify(moduleNavState));
  const shell = document.querySelector(`[data-module-nav="${key}"]`);
  if (!shell) return;
  shell.classList.toggle("is-expanded", expanded);
  shell.classList.toggle("is-collapsed", !expanded);
  shell.querySelectorAll("[data-module-nav-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", String(expanded));
  });
}

const modulePageState = { members: { view: "table" }, firstTimers: { view: "table" }, followUp: { view: "kanban" } };

function setPageContent(html) {
  const el = byId("content");
  if (!el) return;
  el.innerHTML = typeof PageShell === "function" ? PageShell(html) : html;
}

function moduleNavShell(key, config, tabsHtml = "", extraHtml = "") {
  const { title, subtitle, modalType = null, icon = "bi-stars" } = config;
  const expanded = isModuleNavExpanded(key);
  const hasNav = Boolean(tabsHtml || extraHtml);
  const headerHtml = sectionHeader(title, subtitle, modalType, icon, { compact: true, moduleNavKey: hasNav ? key : null });
  return `
    <div class="module-nav-shell ${expanded ? "is-expanded" : "is-collapsed"}" data-module-nav="${key}">
      <div class="module-nav-sticky">
        ${hasNav ? `
        <div class="module-nav-collapsed">
          <div class="module-nav-collapsed-info">
            <span class="header-icon header-icon-sm"><i class="bi ${icon}"></i></span>
            <div>
              <span class="eyebrow">${L("titleChurchOps")}</span>
              <strong class="module-nav-collapsed-title">${title}</strong>
            </div>
          </div>
          <button type="button" class="module-nav-arrow" data-module-nav-toggle="${key}" aria-expanded="false" aria-label="${L("sidebarExpand")}">
            <i class="bi bi-chevron-down" aria-hidden="true"></i>
          </button>
        </div>` : ""}
        <div class="module-nav-panel">
          ${headerHtml}
          ${tabsHtml}
          ${extraHtml}
        </div>
      </div>
    </div>`;
}

function sectionHeader(title, subtitle, modalType, icon = "bi-stars", { compact = false, moduleNavKey = null, actions = "" } = {}) {
  if (typeof ModuleHeroCard === "function") {
    return ModuleHeroCard({ title, subtitle, icon, modalType, moduleNavKey: moduleNavKey || undefined, compact, actions });
  }
  return `
    <article class="panel section-panel module-hero-card ${compact ? "mb-0 module-hero-card--compact" : "mb-4"}">
      <div class="panel-head mb-0 module-hero-card-body">
        <span class="header-icon module-hero-card-icon"><i class="bi ${icon}"></i></span>
        <div class="module-hero-card-copy">
          <span class="eyebrow">${L("titleChurchOps")}</span>
          <h2 class="panel-title module-hero-card-title">${title}</h2>
          <p class="module-hero-card-subtitle mb-0">${subtitle}</p>
        </div>
      </div>
      <div class="module-hero-card-actions">
        ${actions}
        ${moduleNavKey ? `<button type="button" class="module-nav-arrow" data-module-nav-toggle="${moduleNavKey}" aria-expanded="true" aria-label="${L("sidebarCollapse")}"><i class="bi bi-chevron-up" aria-hidden="true"></i></button>` : ""}
        ${modalType ? `<button type="button" class="btn btn-ce-gold btn-touch" data-open-form="${modalType}"><i class="bi bi-plus-lg me-2"></i>${L("add")}</button>` : ""}
      </div>
    </article>`;
}

function filterBar(options = {}) {
  const opts = typeof options === "object" && options !== null ? options : {};
  if (typeof FilterToolbar === "function") {
    return FilterToolbar({
      search: opts.search !== false,
      church: opts.church !== false,
      month: opts.month !== false,
      status: opts.status !== false,
      exportBtn: opts.exportBtn !== false,
      churches: state.churches,
      statusOptions: opts.statusOptions || [],
      extraFields: opts.extraFields || "",
      viewToggle: opts.viewToggle || "",
      addBtn: opts.addBtn || "",
      className: opts.className || "mb-3"
    });
  }
  return `
    <div class="filter-toolbar filter-bar mb-3">
      ${opts.search !== false ? `<div class="filter-toolbar-search"><i class="bi bi-search"></i><input class="form-control" type="search" placeholder="${L("search")}"></div>` : ""}
      ${opts.church !== false ? `<select class="form-select"><option value="">${L("filterChurch")}</option>${state.churches.map((c) => `<option>${c.church_name}</option>`).join("")}</select>` : ""}
      ${opts.month !== false ? `<input class="form-control" type="month" aria-label="${L("filterMonth")}">` : ""}
      ${opts.status !== false ? `<select class="form-select"><option value="">${L("filterStatus")}</option></select>` : ""}
      ${opts.exportBtn !== false ? `<button type="button" class="btn btn-outline-cyan action-secondary btn-touch"><i class="bi bi-download me-1"></i>${L("export")}</button>` : ""}
    </div>`;
}

function sm(icon, label, value, module, action = {}) {
  const nav = window.CESummaryCardNav;
  const opts = nav?.buildOptions
    ? nav.buildOptions(module, { ...action, label })
    : { ...action, module, label, hint: action.hint ?? L("clickToView") };
  return metric(icon, label, value, opts.hint || "", opts);
}

function summaryFilterChips(module) {
  return window.CESummaryCardNav?.renderFilterChips?.(module) || "";
}

function noResultsHtml() {
  if (typeof EmptyState === "function") {
    return EmptyState({ icon: "bi-inbox", title: L("noResultsFound"), compact: true, variant: "light" });
  }
  return `<p class="text-secondary mb-0">${L("noResultsFound")}</p>`;
}

function applyStaffCardFilters(list, filters = {}) {
  let rows = [...list];
  if (filters.status) rows = rows.filter((item) => item.status === filters.status);
  if (filters.employment_type) rows = rows.filter((item) => item.employment_type === filters.employment_type);
  if (filters.has_salary) rows = rows.filter((item) => Number(item.salary_or_allowance || 0) > 0);
  return rows;
}

function applyStaffSalaryCardFilters(salaries, staffList, filters = {}) {
  let rows = [...salaries];
  if (filters.payment_status) rows = rows.filter((item) => item.payment_status === filters.payment_status);
  if (filters.has_salary) {
    const ids = new Set(staffList.filter((s) => Number(s.salary_or_allowance || 0) > 0).map((s) => s.id));
    rows = rows.filter((item) => ids.has(item.staff_id));
  }
  return rows;
}

function applyStaffPerformanceCardFilters(list, filters = {}) {
  if (!filters.pending_eval) return list;
  return list.filter((item) => !item.evaluated_at);
}

function applyFirstTimerCardFilters(list, filters = {}) {
  let rows = [...list];
  if (filters.followup) rows = rows.filter((p) => statusKey(p.estado_do_seguimento) === filters.followup);
  if (filters.quer_escola_de_fundacao) rows = rows.filter((p) => p.quer_escola_de_fundacao);
  if (filters.became_member) rows = rows.filter((p) => statusKey(p.estado_do_seguimento) === "becameMember");
  if (filters.sent_to_cell) rows = rows.filter((p) => ["Sent to Cell", "Enrolled in Foundation School"].includes(p.estado_do_seguimento));
  return rows;
}

function applyFoundationCardFilters(students, filters = {}) {
  let rows = [...students];
  if (filters.estado) rows = rows.filter((s) => statusKey(s.estado) === filters.estado);
  if (filters.graduated) rows = rows.filter((s) => s.graduado);
  if (filters.certificate_issued) rows = rows.filter((s) => s.certificado_emitido);
  return rows;
}

function applySacramentCardFilters(records, filters = {}) {
  let rows = [...records];
  if (filters.status) rows = rows.filter((r) => statusKey(r.estado || r.status) === filters.status || r.estado === filters.status);
  if (filters.pending) rows = rows.filter((r) => ["Pending", "Pendente", "Rascunho"].includes(r.estado));
  if (filters.completed) rows = rows.filter((r) => ["Completed", "Realizado", "Certificate Issued", "Concluído"].includes(r.estado));
  return rows;
}

function applyVenueInventoryCardFilters(list, filters = {}) {
  let rows = [...list];
  if (filters.estado) rows = rows.filter((item) => item.estado === filters.estado);
  if (filters.assigned) rows = rows.filter((item) => item.estado === "Activo");
  return rows;
}

function metric(icon, label, value, hint = "", options = {}) {
  if (typeof SummaryCard === "function") return SummaryCard(icon, label, value, hint, options);
  const disabled = Boolean(options.disabled);
  const isClickable = !disabled && Boolean(options.isClickable || options.clickable);
  const clickable = isClickable ? " summary-card--clickable" : "";
  const filterJson = options.filterPayload ? encodeURIComponent(JSON.stringify(options.filterPayload)) : "";
  const hintText = hint || (isClickable ? L("clickToView") : "");
  const clickAttrs = isClickable
    ? ` data-summary-card="1" data-summary-module="${options.module || ""}" data-summary-target-tab="${options.targetTab || ""}" data-summary-route="${options.route || ""}" data-summary-modal="${options.modalType || ""}" data-summary-scroll="${options.scrollTo || ""}" data-summary-filters="${filterJson}" role="button" tabindex="0" aria-label="${options.ariaLabel || label}"`
    : options.clickAction
      ? ` data-staff-metric="${options.clickAction}" role="button" tabindex="0" aria-label="${label}"`
      : "";
  return `
    <div class="col-sm-6 col-xl-4 col-xxl-3">
      <article class="metric-card summary-card light-surface${clickable}"${clickAttrs}>
        <div class="metric-icon summary-card-icon"><i class="bi ${icon}"></i></div>
        <div class="summary-card-body">
          <span class="summary-card-label metric-label chart-label label">${label}</span>
          <strong class="summary-card-value metric-value">${value}</strong>
          ${hintText ? `<small class="summary-card-hint meta-text subtitle">${hintText}</small>` : ""}
        </div>
      </article>
    </div>`;
}

function moduleSection(title, subtitle, icon, route, content) {
  if (typeof ModuleSection === "function") {
    return ModuleSection({ title, subtitle, icon, linkRoute: route, linkLabel: route ? L("viewAll") : "", content });
  }
  return dashboardSection(title, subtitle, icon, route, content);
}

function dashboardSection(title, subtitle, icon, route, content) {
  if (typeof DashboardSection === "function") {
    return DashboardSection({ title, subtitle, icon, linkRoute: route, linkLabel: L("viewAll"), content });
  }
  return `
    <section class="dashboard-section">
      <header class="dashboard-section-head">
        <div class="dashboard-section-copy">
          <span class="dashboard-section-icon"><i class="bi ${icon}"></i></span>
          <div>
            <h3 class="dashboard-section-title">${title}</h3>
            <p class="dashboard-section-subtitle">${subtitle}</p>
          </div>
        </div>
        ${route ? `<a class="btn btn-sm btn-outline-cyan" href="#${route}" data-route="${route}">${L("viewAll")}</a>` : ""}
      </header>
      <div class="dashboard-section-body">${content}</div>
    </section>`;
}

function renderDashboardPendingList(firstTimers) {
  const pending = firstTimers
    .filter((p) => !["closed", "becameMember"].includes(statusKey(p.estado_do_seguimento)))
    .slice(0, 6);
  if (!pending.length) {
    return typeof EmptyState === "function"
      ? EmptyState({ compact: true, title: L("empty"), icon: "bi-check2-circle" })
      : `<p class="dashboard-quick-empty">${L("empty")}</p>`;
  }
  const items = pending.map((person) => {
    const itemHtml = typeof DashboardQuickItem === "function"
      ? DashboardQuickItem({
          title: fullName(person),
          meta: `${churchName(person.church_id)} · ${person.culto || L("service")}`,
          badge: badge(person.estado_do_seguimento),
          actions: actionButtons([["followup", "firstTimer", person.id, L("updateFollowup")]])
        })
      : `
        <article class="dashboard-quick-item">
          <div class="dashboard-quick-item-copy">
            <strong>${fullName(person)}</strong>
            <span>${churchName(person.church_id)}</span>
          </div>
          ${badge(person.estado_do_seguimento)}
          ${actionButtons([["followup", "firstTimer", person.id, L("updateFollowup")]])}
        </article>`;
    return itemHtml;
  });
  return typeof DashboardQuickList === "function" ? DashboardQuickList(items) : `<div class="dashboard-quick-list">${items.join("")}</div>`;
}

function renderDashboardActivityList() {
  const logs = (state.auditLogs || []).slice().reverse().slice(0, 5);
  if (!logs.length) {
    return typeof EmptyState === "function"
      ? EmptyState({ compact: true, title: L("empty"), icon: "bi-journal-check" })
      : `<p class="dashboard-quick-empty">${L("empty")}</p>`;
  }
  const items = logs.map((log) => {
    if (typeof DashboardQuickItem === "function") {
      return DashboardQuickItem({
        title: log.action,
        meta: `${log.actor} · ${churchName(log.church_id)} · ${log.date}`
      });
    }
    return `
      <article class="dashboard-quick-item">
        <div class="dashboard-quick-item-copy">
          <strong>${log.action}</strong>
          <span>${log.actor} · ${churchName(log.church_id)} · ${log.date}</span>
        </div>
      </article>`;
  });
  return typeof DashboardQuickList === "function" ? DashboardQuickList(items) : `<div class="dashboard-quick-list">${items.join("")}</div>`;
}

function renderDashboard() {
  const firstTimers = scoped(state.firstTimers);
  const finance = scoped(state.finance);
  const cells = scoped(state.cells);
  const students = scoped(state.foundationStudents);
  const pendingFollowups = firstTimers.filter((p) => statusKey(p.estado_do_seguimento) !== "closed").length;
  const monthlyGiving = finance.filter((f) => f.data?.startsWith("2026-07")).reduce((sum, f) => sum + Number(f.valor || 0), 0);
  setPageContent(`
    <section class="ops-hero ops-hero--command">
      <div>
        <span class="eyebrow">Christ Embassy Mozambique</span>
        <h2>${L("heroTitle")}</h2>
        <p>${L("heroText")}</p>
        <button class="btn btn-ce-gold mt-3 btn-touch" data-open-form="firstTimer"><i class="bi bi-person-plus me-2"></i>${L("registerFirstTimer")}</button>
      </div>
      <aside class="hero-card">
        <span>${L("pendingFollowups")}</span>
        <strong>${pendingFollowups}</strong>
        <small>${state.churches.length} ${L("churches").toLowerCase()}</small>
      </aside>
    </section>
    <div class="dashboard-overview-label"><span class="eyebrow">${L("dashboardOverview")}</span></div>
    <div class="row g-3 mb-2 dashboard-stats-row">
      ${metric("bi-person-heart", L("totalFirstTimers"), firstTimers.length, L("visitorsCaptured"))}
      ${metric("bi-stars", L("newConverts"), firstTimers.filter((p) => p.nasceu_de_novo).length, L("bornAgainHint"))}
      ${metric("bi-mortarboard", L("foundationEnrolments"), students.length, `${foundationPending().length} ${L("pending").toLowerCase()}`)}
      ${metric("bi-award", L("graduations"), students.filter((s) => s.graduado).length, L("thisCycle"))}
      ${metric("bi-diagram-3", L("activeCells"), cells.length, L("cellGrowth"))}
      ${metric("bi-droplet", L("baptisms"), state.sacraments.baptisms.length, L("sacraments"))}
      ${metric("bi-cash-coin", L("monthlyGiving"), money(monthlyGiving), L("thisMonth"))}
      ${metric("bi-telephone-outbound", L("pendingFollowups"), pendingFollowups, L("needsAction"))}
    </div>
    ${dashboardSection(L("dashboardChurchGrowth"), L("dashboardChurchGrowthHint"), "bi-graph-up-arrow", "firstTimers", `
      <div class="row g-4">
        <div class="col-xl-6">${chartCard(L("firstTimersByMonth"), groupCount(firstTimers, "data_do_culto", true))}</div>
        <div class="col-xl-6">${chartCard(L("foundationProgress"), students.map((s) => [fullName(s), foundationProgress(s)]))}</div>
      </div>`)}
    ${dashboardSection(L("dashboardPendingSection"), L("dashboardPendingHint"), "bi-telephone-outbound", "followUp", `
      <div class="row g-4 align-items-stretch">
        <div class="col-xl-7">${renderDashboardPendingList(firstTimers)}</div>
        <div class="col-xl-5">
          <article class="chart-card glass-panel light-surface h-100 dashboard-side-card">
            <div class="panel-head"><h3 class="panel-title"><i class="bi bi-lightning-charge me-2 text-info"></i>${L("needsAction")}</h3></div>
            <div class="dashboard-side-metrics">
              <div><span>${L("pending")}</span><strong>${firstTimers.filter((p) => statusKey(p.estado_do_seguimento) === "pending").length}</strong></div>
              <div><span>${L("contacted")}</span><strong>${firstTimers.filter((p) => statusKey(p.estado_do_seguimento) === "contacted").length}</strong></div>
              <div><span>${L("sentToCell")}</span><strong>${firstTimers.filter((p) => statusKey(p.estado_do_seguimento) === "sentToCell").length}</strong></div>
              <div><span>${L("becameMember")}</span><strong>${firstTimers.filter((p) => statusKey(p.estado_do_seguimento) === "becameMember").length}</strong></div>
            </div>
          </article>
        </div>
      </div>`)}
    ${dashboardSection(L("dashboardFinanceSection"), L("dashboardFinanceHint"), "bi-cash-stack", "finance", `
      <div class="row g-4">
        <div class="col-xl-6">${chartCard(L("givingByCategory"), groupSum(finance, "categoria_da_contribuicao", "valor"))}</div>
        <div class="col-xl-6">${chartCard(L("givingByChurch"), groupSum(finance.map((f) => ({ ...f, igreja: churchName(f.church_id) })), "igreja", "valor"))}</div>
      </div>`)}
    ${dashboardSection(L("dashboardCellsSection"), L("dashboardCellsHint"), "bi-diagram-3", "cellMinistryOverview", `
      <div class="row g-4">
        <div class="col-xl-8">${chartCard(L("cellGrowth"), cells.map((c) => [c.nome_da_celula, c.presencas[0]?.total || 0]))}</div>
        <div class="col-xl-4">${summaryTiles(L("activeCells"), cells.slice(0, 4).map((c) => [c.nome_da_celula, c.presencas[0]?.total || 0]))}</div>
      </div>`)}
    ${dashboardSection(L("dashboardRecentSection"), L("dashboardRecentHint"), "bi-journal-text", "audit", `
      <div class="row g-4">
        <div class="col-xl-7">${renderDashboardActivityList()}</div>
        <div class="col-xl-5">${summaryTiles(L("sacramentsSummary"), [[L("baptismTab"), state.sacraments.baptisms.length], [L("marriageTab"), state.sacraments.marriages.length], [L("babyTab"), state.sacraments.babies.length]])}</div>
      </div>`)}
  `);
}

function chartCard(title, rows) {
  const max = Math.max(...rows.map((r) => Number(r[1] || 0)), 1);
  const bars = rows.length ? rows.map(([label, value]) => `
      <div class="chart-row">
        <span class="chart-label finance-chart-label">${label}</span>
        <div class="chart-track"><div class="chart-fill finance-chart-fill" style="width:${Math.max(5, Math.round((Number(value) / max) * 100))}%"></div></div>
        <strong class="finance-chart-value chart-value bar-value amount-value">${value}</strong>
      </div>`).join("") : EmptyState({ compact: true, title: L("empty"), icon: "bi-bar-chart", variant: "light" });
  if (typeof ChartPanel === "function") return ChartPanel(title, `<div class="chart-bars">${bars}</div>`, { variant: "light" });
  return `<article class="chart-card glass-panel light-surface h-100"><div class="panel-head"><h3 class="panel-title"><i class="bi bi-activity me-2 text-info"></i>${title}</h3></div><div class="chart-bars">${bars}</div></article>`;
}

function summaryTiles(title, rows) {
  return `
    <article class="chart-card glass-panel light-surface h-100">
      <div class="panel-head"><h3 class="panel-title"><i class="bi bi-grid-1x2 me-2 text-info"></i>${title}</h3></div>
      <div class="donut-grid">${rows.map(([label, value]) => `<div class="donut-item"><span class="chart-label">${label}</span><strong>${value}</strong></div>`).join("")}</div>
    </article>
  `;
}

function groupCount(records, key, month = false) {
  const grouped = {};
  records.forEach((record) => {
    const raw = record[key] || "2026-07-06";
    const label = month ? new Intl.DateTimeFormat(lang === "pt" ? "pt-PT" : "en-US", { month: "short" }).format(new Date(raw)) : raw;
    grouped[label] = (grouped[label] || 0) + 1;
  });
  return Object.entries(grouped);
}

function groupSum(records, groupKey, sumKey) {
  const grouped = {};
  records.forEach((record) => {
    const label = record[groupKey] || "-";
    grouped[label] = (grouped[label] || 0) + Number(record[sumKey] || 0);
  });
  return Object.entries(grouped);
}

function firstTimerActions(id) {
  return actionButtons([["view", "firstTimer", id, L("view")], ["edit", "firstTimer", id, L("edit")], ["followup", "firstTimer", id, L("updateFollowup")]]);
}

function renderFirstTimerCard(person) {
  if (typeof DataCard !== "function") return "";
  return DataCard({
    title: fullName(person),
    subtitle: person.culto || L("service"),
    badges: [badge(person.estado_do_seguimento)],
    meta: [
      [L("phone"), person.telefone, "bi-telephone"],
      [L("church"), churchName(person.church_id), "bi-building"],
      [L("service"), person.culto || "-", "bi-calendar-event"]
    ],
    pills: [person.nasceu_de_novo ? L("bornAgainHint") : null, person.quer_escola_de_fundacao ? L("foundationSchool") : null].filter(Boolean),
    actions: firstTimerActions(person.id)
  });
}

function renderFirstTimers() {
  const list = scoped(state.firstTimers);
  const view = modulePageState.firstTimers.view;
  setPageContent(`
    ${sectionHeader(L("firstTimers"), L("firstTimerSubtitle"), "firstTimer", "bi-person-heart")}
    <div class="row g-3 mb-4 summary-cards-row">
      ${sm("bi-person-heart", L("totalFirstTimers"), list.length, "firstTimers", { filterPayload: {} })}
      ${sm("bi-hourglass-split", L("pending"), list.filter((p) => statusKey(p.estado_do_seguimento) === "pending").length, "firstTimers", { filterPayload: { followup: "pending" } })}
      ${sm("bi-check2-circle", L("contacted"), list.filter((p) => statusKey(p.estado_do_seguimento) === "contacted").length, "firstTimers", { filterPayload: { followup: "contacted" } })}
      ${sm("bi-mortarboard", L("wantFoundation"), list.filter((p) => p.quer_escola_de_fundacao).length, "firstTimers", { filterPayload: { quer_escola_de_fundacao: true } })}
      ${sm("bi-person-check", L("becameMember"), list.filter((p) => statusKey(p.estado_do_seguimento) === "becameMember").length, "firstTimers", { filterPayload: { became_member: true } })}
    </div>
    ${summaryFilterChips("firstTimers")}
    <article class="panel glass-panel">
      ${filterBar({ viewToggle: ViewToggle(view), statusOptions: followupStatuses })}
      ${(() => {
        const filtered = applyFirstTimerCardFilters(list, firstTimersPageState.filter);
        const fTableRows = filtered.map((p) => [
          fullName(p), p.telefone, churchName(p.church_id), p.culto, yesNo(p.nasceu_de_novo), yesNo(p.quer_escola_de_fundacao), badge(p.estado_do_seguimento),
          firstTimerActions(p.id)
        ]);
        const fCardsHtml = filtered.map((p) => renderFirstTimerCard(p)).join("");
        return view === "cards"
          ? (filtered.length ? DataCardsGrid(fCardsHtml) : noResultsHtml())
          : (filtered.length ? dataTable([L("name"), L("phone"), L("church"), L("service"), L("bornAgain"), L("foundation"), L("status"), L("actions")], fTableRows) : noResultsHtml());
      })()}
    </article>
  `);
}

function renderFollowUpKanban(list) {
  const columns = [
    [L("pending"), ["Pending"], "pending"],
    [L("contacted"), ["Contacted"], "contacted"],
    [L("noAnswer"), ["No Answer"], "pending"],
    [L("visitScheduled"), ["Interested"], "contacted"],
    [L("sentToCell"), ["Sent to Cell", "Enrolled in Foundation School"], "success"],
    [L("closed"), ["Became Member", "Closed"], "closed"]
  ];
  if (typeof KanbanBoard !== "function") return "";
  return KanbanBoard(columns.map(([title, statuses, tone]) => {
    const items = list.filter((p) => statuses.includes(p.estado_do_seguimento));
    return [title, items.length, items.map((p) => typeof FollowUpCard === "function" ? FollowUpCard(p) : renderFirstTimerCard(p)).join(""), tone];
  }));
}

function renderFollowUp() {
  const list = scoped(state.firstTimers);
  const view = modulePageState.followUp.view;
  const filtered = applyFirstTimerCardFilters(list, followUpPageState.filter);
  setPageContent(`
    ${sectionHeader(L("followUp"), L("followupSubtitle"), null, "bi-telephone-outbound")}
    <div class="row g-3 mb-4 summary-cards-row">
      ${sm("bi-hourglass-split", L("pending"), list.filter((p) => statusKey(p.estado_do_seguimento) === "pending").length, "followUp", { filterPayload: { followup: "pending" } })}
      ${sm("bi-check2-circle", L("contacted"), list.filter((p) => statusKey(p.estado_do_seguimento) === "contacted").length, "followUp", { filterPayload: { followup: "contacted" } })}
      ${sm("bi-telephone-x", L("noAnswer"), list.filter((p) => statusKey(p.estado_do_seguimento) === "noAnswer").length, "followUp", { filterPayload: { followup: "noAnswer" } })}
      ${sm("bi-calendar-check", L("visitScheduled"), list.filter((p) => statusKey(p.estado_do_seguimento) === "interested").length, "followUp", { filterPayload: { followup: "interested" } })}
      ${sm("bi-diagram-3", L("sentToCell"), list.filter((p) => ["Sent to Cell", "Enrolled in Foundation School"].includes(p.estado_do_seguimento)).length, "followUp", { filterPayload: { sent_to_cell: true } })}
    </div>
    ${summaryFilterChips("followUp")}
    <article class="panel glass-panel">
      ${filterBar({ month: false, viewToggle: `<div class="view-toggle" role="group"><button type="button" class="view-toggle-btn ${view === "kanban" ? "active" : ""}" data-followup-view="kanban"><i class="bi bi-kanban"></i><span>Kanban</span></button><button type="button" class="view-toggle-btn ${view === "table" ? "active" : ""}" data-followup-view="table"><i class="bi bi-table"></i><span>${L("tableView")}</span></button></div>` })}
      ${view === "kanban"
        ? renderFollowUpKanban(filtered.length ? filtered : list)
        : (filtered.length ? dataTable([L("name"), L("phone"), L("counselor"), L("cellInterest"), L("counseling"), L("status"), L("actions")], filtered.map((p) => [
          fullName(p), p.telefone, p.conselheiro_responsavel, yesNo(p.interesse_em_celula), yesNo(p.quer_aconselhamento), badge(p.estado_do_seguimento),
          actionButtons([["view", "firstTimer", p.id, L("view")], ["followup", "firstTimer", p.id, L("updateFollowup")]])
        ])) : noResultsHtml())}
    </article>
  `);
}

function memberActions(id) {
  return actionButtons([["view", "member", id, L("viewProfile")], ["edit", "member", id, L("edit")], ["moveChurch", "member", id, L("moveChurch")], ["status", "member", id, L("updateStatus")]]);
}

function renderMemberCard(member) {
  if (typeof DataCard !== "function") return "";
  return DataCard({
    title: fullName(member),
    subtitle: member.departamento || L("department"),
    badges: [badge(member.estado)],
    meta: [
      [L("phone"), member.telefone, "bi-telephone"],
      [L("church"), churchName(member.church_id), "bi-building"],
      [L("cell"), member.celula || "-", "bi-diagram-3"]
    ],
    pills: [member.origem || L("origin")],
    actions: memberActions(member.id)
  });
}

function renderMembers() {
  const list = scoped(state.members);
  const view = modulePageState.members.view;
  const churchesCount = new Set(list.map((m) => m.church_id).filter(Boolean)).size;
  const tableRows = list.map((m) => [
    fullName(m), m.telefone, churchName(m.church_id), m.celula, m.departamento, badge(m.estado), memberActions(m.id)
  ]);
  setPageContent(`
    ${sectionHeader(L("members"), L("membersSubtitle"), "member", "bi-people")}
    <div class="row g-3 mb-4 summary-cards-row">
      ${metric("bi-people", L("total"), list.length, L("members"))}
      ${metric("bi-check-circle", L("active"), list.filter((m) => statusKey(m.estado) === "active").length, L("status"))}
      ${metric("bi-hourglass", L("inProgress"), list.filter((m) => statusKey(m.estado) === "inProgress").length, L("followUp"))}
      ${metric("bi-arrow-left-right", L("transferred"), list.filter((m) => statusKey(m.estado) === "transferred").length, L("status"))}
      ${metric("bi-building", L("membersByChurch"), churchesCount, L("churches"))}
    </div>
    <article class="panel glass-panel">
      ${filterBar({ viewToggle: ViewToggle(view) })}
      ${view === "cards" ? DataCardsGrid(list.map((m) => renderMemberCard(m)).join("")) : dataTable([L("name"), L("phone"), L("church"), L("cell"), L("department"), L("status"), L("actions")], tableRows)}
    </article>
  `);
}

function defaultFoundationAttendance() {
  return { class_1: false, class_2: false, class_3: false, class_4: false, class_5: false, class_6: false, class_7: false };
}

function getFoundationCompletedClasses(student) {
  const attendance = student.class_attendance || defaultFoundationAttendance();
  return Array.from({ length: 7 }, (_, i) => attendance[`class_${i + 1}`]).filter(Boolean).length;
}

function getFoundationClassProgressPercent(student) {
  return Math.round((getFoundationCompletedClasses(student) / 7) * 100);
}

function migrateFoundationStudent(student) {
  const record = { ...student };
  if (!record.class_attendance) {
    const legacy = Array.isArray(record.presencas) ? record.presencas : [];
    record.class_attendance = defaultFoundationAttendance();
    legacy.forEach((present, index) => {
      if (index < 7) record.class_attendance[`class_${index + 1}`] = !!present;
    });
  }
  for (let i = 1; i <= 7; i += 1) {
    if (record.class_attendance[`class_${i}`] === undefined) record.class_attendance[`class_${i}`] = false;
  }
  record.completed_classes = getFoundationCompletedClasses(record);
  record.class_progress_percent = getFoundationClassProgressPercent(record);
  if (FOUNDATION_STATUS_MAP[record.estado]) record.estado = FOUNDATION_STATUS_MAP[record.estado];
  if (record.notes === undefined) record.notes = record.notas || "";
  return record;
}

function applyFoundationCalculations(student, autoStatus = false) {
  const record = migrateFoundationStudent(student);
  record.completed_classes = getFoundationCompletedClasses(record);
  record.class_progress_percent = getFoundationClassProgressPercent(record);
  if (autoStatus) record.estado = suggestFoundationStatus(record);
  return record;
}

function suggestFoundationStatus(student) {
  const record = migrateFoundationStudent(student);
  const completed = record.completed_classes;
  if (record.certificado_emitido) return "Certificado Emitido";
  if (record.graduado) return "Graduado";
  if (record.aprovado && record.pratica_evangelismo && Number(record.nota_exame) > 0) return "Aprovado";
  if (completed === 7 && !Number(record.nota_exame)) return "Pronto para Exame";
  if (completed >= 1 && completed <= 6) return "Em Curso";
  if (completed === 0) return "Inscrito";
  return record.estado || "Inscrito";
}

function foundationClassLabel(index) {
  return L(`class${index}`);
}

function foundationProgressSummary(student) {
  const record = migrateFoundationStudent(student);
  return L("classesCompletedSummary").replace("{n}", record.completed_classes);
}

function foundationProgressBar(percent, extraClass = "") {
  return `<div class="progress foundation-progress-bar ${extraClass}"><div class="progress-bar" style="width:${percent}%"></div></div>`;
}

function foundationClassDots(student, compact = false) {
  const record = migrateFoundationStudent(student);
  return `<div class="step-row foundation-class-steps ${compact ? "is-compact" : ""}">${Array.from({ length: 7 }, (_, i) => {
    const n = i + 1;
    const done = record.class_attendance[`class_${n}`];
    return `<span class="${done ? "done" : "pending"}" title="${foundationClassLabel(n)}">${n}</span>`;
  }).join("")}</div>`;
}

function foundationClassProgressCell(student) {
  const record = migrateFoundationStudent(student);
  return `
    <div class="foundation-progress-cell">
      ${foundationProgressBar(record.class_progress_percent)}
      ${foundationClassDots(record, true)}
      <small class="foundation-progress-percent">${record.class_progress_percent}%</small>
    </div>
  `;
}

function foundationClassCheckboxes(student, prefix = "class_") {
  const record = migrateFoundationStudent(student);
  return `<div class="foundation-class-grid">${Array.from({ length: 7 }, (_, i) => {
    const n = i + 1;
    const key = `${prefix}${n}`;
    const checked = record.class_attendance[`class_${n}`] ? "checked" : "";
    return `<label class="foundation-class-toggle"><input type="checkbox" name="${key}" data-foundation-class="${n}" ${checked}><span>${foundationClassLabel(n)}</span></label>`;
  }).join("")}</div>`;
}

function foundationProgressPreviewHtml(student) {
  const record = migrateFoundationStudent(student);
  return `
    <div class="foundation-progress-preview" data-foundation-progress-preview>
      ${foundationProgressBar(record.class_progress_percent, "mb-2")}
      ${foundationClassDots(record)}
      <p class="foundation-progress-copy mb-0" data-foundation-progress-text>${foundationProgressSummary(record)} · ${record.class_progress_percent}%</p>
    </div>
  `;
}

function foundationSectionTitle(title) {
  return `<div class="col-12"><h6 class="foundation-form-section">${title}</h6></div>`;
}

function readFoundationAttendanceFromForm(form, prefix = "class_") {
  const attendance = defaultFoundationAttendance();
  for (let i = 1; i <= 7; i += 1) attendance[`class_${i}`] = new FormData(form).has(`${prefix}${i}`);
  return attendance;
}

function updateFoundationProgressPreview(form) {
  const preview = form.closest(".modal-content")?.querySelector("[data-foundation-progress-preview]");
  if (!preview) return;
  const attendance = readFoundationAttendanceFromForm(form);
  const completed = Object.values(attendance).filter(Boolean).length;
  const percent = Math.round((completed / 7) * 100);
  const bar = preview.querySelector(".progress-bar");
  const text = preview.querySelector("[data-foundation-progress-text]");
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${L("classesCompletedSummary").replace("{n}", completed)} · ${percent}%`;
  preview.querySelectorAll(".foundation-class-steps span").forEach((dot, index) => {
    dot.classList.toggle("done", !!attendance[`class_${index + 1}`]);
    dot.classList.toggle("pending", !attendance[`class_${index + 1}`]);
  });
}

function renderFoundationStudentForm(record = {}, mode = "edit") {
  const student = migrateFoundationStudent(record);
  const statusOptions = foundationStatuses.map((status) => `<option value="${status}" ${student.estado === status ? "selected" : ""}>${statusText(status)}</option>`).join("");
  const readonly = mode === "view" ? "disabled" : "";
  const churchField = churchSelect("church_id", L("church"), student, {
    ...relationalFormOptions(),
    showInfoCard: true,
    autofillFields: ["church_id", "province", "city", "district_or_area"],
    readonly: mode === "view"
  });
  return `
    ${foundationSectionTitle(L("studentData"))}
    <div class="col-md-6"><label class="form-label">${L("name")}</label><input name="nome" class="form-control" value="${student.nome || ""}" ${readonly} required></div>
    <div class="col-md-6"><label class="form-label">${L("surname")}</label><input name="apelido" class="form-control" value="${student.apelido || ""}" ${readonly}></div>
    <div class="col-md-6"><label class="form-label">${L("phone")}</label><input name="telefone" class="form-control" value="${student.telefone || ""}" ${readonly}></div>
    ${churchField}
    <div class="col-md-6"><label class="form-label">${L("cell")}</label><input name="celula" class="form-control" value="${student.celula || ""}" ${readonly}></div>
    <div class="col-md-6"><label class="form-label">${L("status")}</label><select name="estado" class="form-select" data-foundation-status ${readonly}>${statusOptions}</select><small class="form-hint d-block mt-1">${L("autoStatusHint")}</small></div>
    ${foundationSectionTitle(L("classProgress"))}
    <div class="col-12">${mode === "view" ? foundationProgressPreviewHtml(student) : foundationClassCheckboxes(student)}</div>
    ${mode !== "view" ? `<div class="col-12">${foundationProgressPreviewHtml(student)}</div>` : ""}
    ${foundationSectionTitle(L("evaluation"))}
    <div class="col-md-6"><label class="form-label">${L("examScore")}</label><input name="nota_exame" type="number" min="0" max="100" class="form-control" value="${student.nota_exame || ""}" ${readonly}></div>
    <div class="col-md-6 d-flex align-items-end"><label class="form-check"><input name="pratica_evangelismo" type="checkbox" class="form-check-input" ${student.pratica_evangelismo ? "checked" : ""} ${readonly}> <span class="form-check-label">${L("practicalCompleted")}</span></label></div>
    <div class="col-md-6"><label class="form-label">${L("soulsWon")}</label><input name="numero_de_almas_ganhas" type="number" min="0" class="form-control" value="${student.numero_de_almas_ganhas || 0}" ${readonly}></div>
    <div class="col-md-6 d-flex align-items-end"><label class="form-check"><input name="aprovado" type="checkbox" class="form-check-input" ${student.aprovado ? "checked" : ""} ${readonly}> <span class="form-check-label">${L("approved")}</span></label></div>
    ${foundationSectionTitle(L("finalization"))}
    <div class="col-md-6 d-flex align-items-end"><label class="form-check foundation-check-graduated"><input name="graduado" type="checkbox" class="form-check-input" ${student.graduado ? "checked" : ""} ${readonly}> <span class="form-check-label">${L("graduated")}</span></label></div>
    <div class="col-md-6 d-flex align-items-end"><label class="form-check foundation-check-certificate"><input name="certificado_emitido" type="checkbox" class="form-check-input" ${student.certificado_emitido ? "checked" : ""} ${readonly}> <span class="form-check-label">${L("certificateIssuedLabel")}</span></label></div>
    <div class="col-12"><label class="form-label">${L("notes")}</label><textarea name="notes" class="form-control" rows="3" ${readonly}>${student.notes || ""}</textarea></div>
  `;
}

function renderFoundationMarkClassForm(record) {
  const student = migrateFoundationStudent(record);
  return `
    <div class="col-12"><p class="mb-1"><strong>${fullName(student)}</strong></p><p class="form-hint small mb-0">${student.telefone || ""} · ${churchName(student.church_id)}</p></div>
    <div class="col-12">${foundationClassCheckboxes(student)}</div>
    <div class="col-12">${foundationProgressPreviewHtml(student)}</div>
  `;
}

function renderFoundationScoreForm(record) {
  const student = migrateFoundationStudent(record);
  return `
    <div class="col-12"><p class="mb-1"><strong>${fullName(student)}</strong></p><p class="form-hint small mb-3">${foundationProgressSummary(student)} · ${student.class_progress_percent}%</p></div>
    <div class="col-md-6"><label class="form-label">${L("examScore")}</label><input name="nota_exame" type="number" min="0" max="100" class="form-control" value="${student.nota_exame || ""}" required></div>
    <div class="col-md-6 d-flex align-items-end"><label class="form-check"><input name="pratica_evangelismo" type="checkbox" class="form-check-input" ${student.pratica_evangelismo ? "checked" : ""}> <span class="form-check-label">${L("practicalCompleted")}</span></label></div>
    <div class="col-md-6"><label class="form-label">${L("soulsWon")}</label><input name="numero_de_almas_ganhas" type="number" min="0" class="form-control" value="${student.numero_de_almas_ganhas || 0}"></div>
    <div class="col-md-6 d-flex align-items-end"><label class="form-check"><input name="aprovado" type="checkbox" class="form-check-input" ${student.aprovado ? "checked" : ""}> <span class="form-check-label">${L("approved")}</span></label></div>
  `;
}

function openFoundationStudentForm(id = null) {
  modalMode = id ? "edit" : "create";
  modalType = "foundationStudent";
  modalRecordId = id;
  const record = id ? getCollection("foundationStudent").find((item) => item.id === id) : {};
  byId("modalEyebrow").textContent = modalMode === "edit" ? L("edit") : L("add");
  byId("modalTitle").textContent = L("foundationSchool");
  byId("modalFields").innerHTML = renderFoundationStudentForm(record, modalMode);
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
  requestAnimationFrame(() => mountRelationalControls(byId("entryForm")));
}

function openFoundationMarkClass(id) {
  const record = getCollection("foundationStudent").find((item) => item.id === id);
  if (!record) return;
  modalMode = "edit";
  modalType = "foundationMarkClass";
  modalRecordId = id;
  byId("modalEyebrow").textContent = L("markClass");
  byId("modalTitle").textContent = L("markClassTitle");
  byId("modalFields").innerHTML = renderFoundationMarkClassForm(record);
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function openFoundationScore(id) {
  const record = getCollection("foundationStudent").find((item) => item.id === id);
  if (!record) return;
  modalMode = "edit";
  modalType = "foundationScore";
  modalRecordId = id;
  byId("modalEyebrow").textContent = L("launchScore");
  byId("modalTitle").textContent = L("launchScoreTitle");
  byId("modalFields").innerHTML = renderFoundationScoreForm(record);
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function collectFoundationStudentPayload(form, base = {}) {
  const data = Object.fromEntries(new FormData(form).entries());
  ["pratica_evangelismo", "aprovado", "graduado", "certificado_emitido"].forEach((key) => {
    data[key] = new FormData(form).has(key);
  });
  data.class_attendance = readFoundationAttendanceFromForm(form);
  data.nota_exame = Number(data.nota_exame || 0);
  data.numero_de_almas_ganhas = Number(data.numero_de_almas_ganhas || 0);
  return applyFoundationCalculations({ ...base, ...data }, false);
}

function submitFoundationStudent(form) {
  const collection = getCollection("foundationStudent");
  const today = new Date().toISOString().slice(0, 10);
  if (modalMode === "edit") {
    const index = collection.findIndex((item) => item.id === modalRecordId);
    const merged = collectFoundationStudentPayload(form, collection[index]);
    if (!form.elements.estado?.dataset.manualStatus) merged.estado = suggestFoundationStatus(merged);
    collection[index] = { ...collection[index], ...merged, updated_at: today };
  } else {
    const payload = collectFoundationStudentPayload(form, {
      id: `fs-${Date.now()}`,
      first_timer_id: "",
      member_id: "",
      mes_de_inscricao: new Date().toISOString().slice(0, 7),
      created_at: today,
      updated_at: today
    });
    payload.estado = form.elements.estado?.dataset.manualStatus ? payload.estado : suggestFoundationStatus(payload);
    collection.push(payload);
  }
  saveState(`${modalMode === "edit" ? "Updated" : "Created"} foundation student`);
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
  form.reset();
  setRoute(activeRoute);
}

function submitFoundationMarkClass(form) {
  const collection = getCollection("foundationStudent");
  const index = collection.findIndex((item) => item.id === modalRecordId);
  if (index < 0) return;
  const merged = applyFoundationCalculations({
    ...collection[index],
    class_attendance: readFoundationAttendanceFromForm(form),
    updated_at: new Date().toISOString().slice(0, 10)
  }, true);
  collection[index] = merged;
  saveState("Updated foundation class attendance");
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
  form.reset();
  setRoute(activeRoute);
}

function submitFoundationScore(form) {
  const collection = getCollection("foundationStudent");
  const index = collection.findIndex((item) => item.id === modalRecordId);
  if (index < 0) return;
  const data = Object.fromEntries(new FormData(form).entries());
  ["pratica_evangelismo", "aprovado"].forEach((key) => {
    data[key] = new FormData(form).has(key);
  });
  const merged = applyFoundationCalculations({
    ...collection[index],
    nota_exame: Number(data.nota_exame || 0),
    pratica_evangelismo: data.pratica_evangelismo,
    numero_de_almas_ganhas: Number(data.numero_de_almas_ganhas || 0),
    aprovado: data.aprovado,
    updated_at: new Date().toISOString().slice(0, 10)
  }, true);
  collection[index] = merged;
  saveState("Updated foundation exam score");
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
  form.reset();
  setRoute(activeRoute);
}

function renderFoundation() {
  const pending = foundationPending();
  const students = scoped(state.foundationStudents).map((student) => migrateFoundationStudent(student));
  setPageContent(`
    ${moduleNavShell("foundationSchool", { title: L("foundationSchool"), subtitle: L("foundationSubtitle"), modalType: "foundationStudent", icon: "bi-mortarboard" },
      moduleScrollTabs([
        [L("pendingEnrolments"), "panel-foundationPending"],
        [L("enrolledStudents"), "panel-foundationStudents"],
        [L("classesAttendance"), "panel-foundationStudents"],
        [L("exams"), "panel-foundationStudents"],
        [L("graduation"), "panel-foundationStudents"],
        [L("certificates"), "panel-foundationStudents"]
      ])
    )}
    <div class="row g-3 mb-4 summary-cards-row">
      ${sm("bi-hourglass-split", L("pendingEnrolments"), pending.length, "foundation", { scrollTo: "panel-foundationPending" })}
      ${sm("bi-person-plus", L("enrolledInCourse"), students.filter((s) => statusKey(s.estado) === "enrolled").length, "foundation", { scrollTo: "panel-foundationStudents", filterPayload: { estado: "enrolled" } })}
      ${sm("bi-book", L("inProgress"), students.filter((s) => statusKey(s.estado) === "inProgress").length, "foundation", { scrollTo: "panel-foundationStudents", filterPayload: { estado: "inProgress" } })}
      ${sm("bi-clipboard-check", L("readyForExam"), students.filter((s) => statusKey(s.estado) === "readyForExam").length, "foundation", { scrollTo: "panel-foundationStudents", filterPayload: { estado: "readyForExam" } })}
      ${sm("bi-award", L("graduations"), students.filter((s) => s.graduado).length, "foundation", { scrollTo: "panel-foundationStudents", filterPayload: { graduated: true } })}
      ${sm("bi-patch-check", L("certificatesIssued"), students.filter((s) => s.certificado_emitido).length, "foundation", { scrollTo: "panel-foundationStudents", filterPayload: { certificate_issued: true } })}
    </div>
    ${summaryFilterChips("foundation")}
    <div class="row g-4">
      <div class="col-xl-4">
        <article id="panel-foundationPending" class="panel h-100">
          <h3 class="panel-title">${L("pendingEnrolments")}</h3>
          <div class="d-grid gap-2 mt-3">
            ${pending.length ? pending.map((p) => `<div class="record-card"><strong>${fullName(p)}</strong><p class="text-secondary mb-2">${p.telefone} - ${churchName(p.church_id)}</p><button class="btn btn-sm btn-ce-gold" data-enroll="${p.id}">${L("enrolStudent")}</button></div>`).join("") : `<p class="text-secondary">${L("empty")}</p>`}
          </div>
        </article>
      </div>
      <div class="col-xl-8">
        <article id="panel-foundationStudents" class="panel">
          ${filterBar()}
          ${dataTable([L("student"), L("church"), L("cell"), L("classes"), L("exam"), L("practical"), L("status"), L("progress"), L("actions")], applyFoundationCardFilters(students, foundationPageState.filter).map((s) => [
            fullName(s), churchName(s.church_id), s.celula, `${s.completed_classes}/7`, s.nota_exame || "-", yesNo(s.pratica_evangelismo), badge(s.estado), foundationClassProgressCell(s),
            actionButtons([["view", "foundationStudent", s.id, L("view")], ["edit", "foundationStudent", s.id, L("edit")], ["markClass", "foundationStudent", s.id, L("markClass")], ["score", "foundationStudent", s.id, L("launchScore")], ["graduate", "foundationStudent", s.id, L("graduate")]])
          ]))}
        </article>
      </div>
    </div>
  `);
}

function foundationPending() {
  const ids = new Set(state.foundationStudents.map((s) => s.first_timer_id));
  return scoped(state.firstTimers).filter((p) => p.quer_escola_de_fundacao && !ids.has(p.id));
}

function foundationProgress(student) {
  return migrateFoundationStudent(student).class_progress_percent;
}

let financeSupabaseSyncToken = 0;

function renderFinance() {
  const syncToken = ++financeSupabaseSyncToken;
  syncFinanceFromSupabaseIfEnabled().then((changed) => {
    if (changed && syncToken === financeSupabaseSyncToken && activeRoute === "finance") renderFinance();
  });

  if (typeof importPublicGivingQueue === "function") {
    const result = importPublicGivingQueue(state);
    if (result.imported > 0) {
      state = result.state;
      saveState(`Imported ${result.imported} public giving submission(s)`);
    }
  }

  window.paymentMethods = paymentMethods;
  window.financeStatuses = financeStatuses;
  migrateRequisitionsFinanceState();

  const disbLib = window.CEFinanceDisbursements;
  const approvedReqAll = disbLib?.getApprovedRequisitions?.(state, activeUser) || [];
  const approvedReqStats = disbLib?.computeStats?.(approvedReqAll) || {};

  const allList = getScopedFinanceList();
  const filters = financePageState.reportFilters;
  const filteredList = typeof filterFinanceRecords === "function"
    ? filterFinanceRecords(allList, filters)
    : allList;
  const prevRange = typeof getPreviousPeriodRange === "function"
    ? getPreviousPeriodRange(filters.period, filters.dateFrom, filters.dateTo)
    : { from: "", to: "" };
  const previousList = prevRange.from && typeof filterFinanceRecords === "function"
    ? filterFinanceRecords(allList, { ...filters, period: "custom", dateFrom: prevRange.from, dateTo: prevRange.to })
    : [];

  let list = filteredList;
  if (financePageState.sourceFilter) {
    list = list.filter((record) => financeOriginKey(record) === financePageState.sourceFilter);
  }

  const stats = typeof computeFinanceReportStats === "function"
    ? computeFinanceReportStats(list)
    : { totalReceived: 0, totalVerified: 0, totalPending: 0, totalRejected: 0, contributionCount: 0, uniqueContributors: 0, averageContribution: 0 };

  const today = allList.filter((f) => f.data === new Date().toISOString().slice(0, 10)).reduce((sum, f) => sum + Number(f.valor || 0), 0);
  const monthKey = new Date().toISOString().slice(0, 7);
  const month = allList.filter((f) => f.data?.startsWith(monthKey)).reduce((sum, f) => sum + Number(f.valor || 0), 0);
  const publicRows = getScopedPublicSubmissionRows();
  const pendingList = allList.filter((f) => statusKey(f.estado) === "pendingVerification");
  const financeAccess = resolveFinanceAccess();
  const contributorProfiles = typeof computeContributorProfiles === "function" ? computeContributorProfiles(list) : [];
  if (!financeAccess.canViewIndividualDetails) {
    financePageState.selectedContributor = "";
  } else if (!financePageState.selectedContributor && contributorProfiles[0]) {
    financePageState.selectedContributor = contributorProfiles[0].key;
  }
  const selectedDetail = financeAccess.canViewIndividualDetails && typeof computeContributorDetail === "function" && financePageState.selectedContributor
    ? computeContributorDetail(list, financePageState.selectedContributor)
    : null;

  const categoryRows = typeof groupFinanceByBucket === "function"
    ? groupFinanceByBucket(list, (key) => L(key))
    : [];
  const armRows = typeof groupFinanceByPartnershipArm === "function" ? groupFinanceByPartnershipArm(list) : [];
  const armDetails = typeof computePartnershipArmDetails === "function"
    ? computePartnershipArmDetails(list, previousList, (g) => `${g >= 0 ? "+" : ""}${g}%`)
    : [];
  const monthlyRows = typeof groupFinanceMonthly === "function" ? groupFinanceMonthly(list) : [];
  const churchRows = typeof groupFinanceByChurch === "function"
    ? groupFinanceByChurch(list, churchName)
    : [];
  const topPartnerRows = contributorProfiles.slice(0, 8).map((p) => [p.name, p.total]);
  const partnerProfilesRaw = typeof computePartnerProfiles === "function"
    ? computePartnerProfiles(list, allList, { minValue: financePageState.reportFilters.minValue })
    : [];
  const partnerProfiles = typeof filterPartnerProfiles === "function"
    ? filterPartnerProfiles(partnerProfilesRaw, { ...financePageState.reportFilters, segment: financePageState.partnerSegment })
    : partnerProfilesRaw;

  const categoryChart = financePageState.reportChartMode === "donut" && typeof financeDonutChart === "function"
    ? financeDonutChart(L("financeReportByCategory"), categoryRows, L("financeNoChartData"))
    : typeof financeSemanticBarChart === "function"
      ? financeSemanticBarChart(L("financeReportByCategory"), categoryRows, "cyan", L("financeNoChartData"))
      : chartCard(L("financeReportByCategory"), categoryRows);

  const armChart = typeof financeSemanticBarChart === "function"
    ? financeSemanticBarChart(L("financeReportByPartnershipArm"), armRows, "cyan", L("financeNoChartData"))
    : chartCard(L("financeReportByPartnershipArm"), armRows);

  const monthlyChart = typeof financeLineChart === "function"
    ? financeLineChart(L("financeMonthlyEvolution"), monthlyRows, L("financeNoChartData"))
    : "";

  const topPartnersChart = typeof financeHBarChart === "function"
    ? financeHBarChart(L("financeTopPartners"), topPartnerRows, L("financeNoChartData"))
    : "";

  const churchChart = typeof financeChurchBarChart === "function"
    ? financeChurchBarChart(L("financeReportByChurch"), churchRows, L("financeNoChartData"))
    : chartCard(L("financeReportByChurch"), churchRows.map((c) => [c.church_name, c.total]));

  const reportFiltersHtml = typeof financeReportFilterBar === "function"
    ? financeReportFilterBar(filters, scoped(state.churches), getFinanceReportLabels())
    : "";

  const chartModeToggle = `<div class="finance-chart-mode-toggle view-toggle light-surface" role="group">
    <button type="button" class="view-toggle-btn ${financePageState.reportChartMode === "bar" ? "active" : ""}" data-finance-chart-mode="bar"><i class="bi bi-bar-chart"></i> ${L("financeChartBar")}</button>
    <button type="button" class="view-toggle-btn ${financePageState.reportChartMode === "donut" ? "active" : ""}" data-finance-chart-mode="donut"><i class="bi bi-pie-chart"></i> ${L("financeChartDonut")}</button>
  </div>`;

  const maskContributor = (name) => (financeAccess.canViewIndividualDetails ? name : L("financeAggregatedOnly"));
  const entriesTable = dataTable(
    [L("contributor"), L("category"), L("financeContributionType"), L("method"), L("amount"), L("date"), L("church"), L("sourceType"), L("status"), L("actions")],
    list.map((f) => [
      maskContributor(f.contributor_name || fullName(f)),
      f.contribution_category,
      f.contribution_group || "-",
      f.metodo_de_pagamento,
      money(f.valor),
      f.data,
      churchName(f.church_id),
      financeOriginBadge(f),
      badge(f.estado),
      financeActions(f.id, f)
    ])
  );

  const publicTable = dataTable(
    [L("contributor"), L("category"), L("amount"), L("method"), L("date"), L("church"), L("sourceType"), L("status"), L("actions")],
    publicRows.map((row) => [
      row.submission.nome_completo || fullName(row.records[0] || {}),
      row.categories || "-",
      money(row.total),
      row.submission.metodo_de_pagamento || row.records[0]?.metodo_de_pagamento || "-",
      row.submission.data_da_transferencia || row.records[0]?.data || "-",
      row.submission.igreja_nome || churchName(row.records[0]?.church_id),
      financeOriginBadge(row.records[0] || {}),
      badge(row.status),
      publicSubmissionActions(row.submission.submission_group_id, row.records)
    ])
  );

  const verificationTable = dataTable(
    [L("contributor"), L("category"), L("amount"), L("method"), L("date"), L("church"), L("sourceType"), L("actions")],
    pendingList.map((f) => [
      f.contributor_name || fullName(f),
      f.contribution_category,
      money(f.valor),
      f.metodo_de_pagamento,
      f.data,
      churchName(f.church_id),
      financeOriginBadge(f),
      financeActions(f.id, f)
    ])
  );

  const contributorOptions = financeAccess.canViewIndividualDetails
    ? contributorProfiles.slice(0, 30).map((p) =>
      `<option value="${p.key}" ${financePageState.selectedContributor === p.key ? "selected" : ""}>${p.name} — ${money(p.total)}</option>`
    ).join("")
    : "";
  const privacyBanner = `<div class="finance-privacy-banner mb-3"><i class="bi bi-shield-lock me-2"></i>${L("financePrivacyNotice")}</div>`;

  const financeChips = summaryFilterChips("finance");
  let tabContent = "";
  if (financePageState.tab === "overview") {
    tabContent = `
      ${moduleSection(L("financeOverviewSection"), L("financeOverviewHint"), "bi-speedometer2", "", `
        <div class="row g-3 summary-cards-row">
          ${sm("bi-calendar-day", L("totalToday"), money(today), "finance", { targetTab: "entries", filterPayload: { period: "today", dateFrom: new Date().toISOString().slice(0, 10), dateTo: new Date().toISOString().slice(0, 10) } })}
          ${sm("bi-calendar3", L("totalThisMonth"), money(month), "finance", { targetTab: "reports", filterPayload: { period: "month" } })}
          ${sm("bi-hourglass", L("pendingVerification"), pendingList.length, "finance", { targetTab: "verification", filterPayload: { status: FINANCE_STATUS_PENDING } })}
          ${sm("bi-patch-check", L("verified"), allList.filter((f) => statusKey(f.estado) === "verified").length, "finance", { targetTab: "entries", filterPayload: { status: FINANCE_STATUS_VERIFIED } })}
          ${sm("bi-globe2", L("financeTabPublic"), publicRows.filter((row) => statusKey(row.status) === "pendingVerification").length, "finance", { targetTab: "public", filterPayload: { source: "public_website" } })}
          ${sm("bi-x-circle", L("financeTotalRejected"), allList.filter((f) => statusKey(f.estado) === "rejected").length, "finance", { targetTab: "entries", filterPayload: { status: FINANCE_STATUS_REJECTED } })}
        </div>
        <div class="row g-3 summary-cards-row mt-2">
          ${sm("bi-clipboard-check", L("finApprovedRequisitions"), approvedReqStats.total || 0, "finance", { targetTab: "approvedRequisitions" })}
          ${sm("bi-hourglass-split", L("finAwaitingRelease"), approvedReqStats.awaiting || 0, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Aguardando Liberação" } })}
          ${sm("bi-cash-stack", L("finReleasedThisMonth"), approvedReqStats.releasedThisMonth || 0, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Recursos Liberados", period: "month" } })}
          ${sm("bi-graph-up", L("finTotalReleasedMonth"), money(approvedReqStats.releasedValueMonth || 0), "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Recursos Liberados", period: "month" } })}
          ${sm("bi-clock-history", L("reqRemainingPending"), money(approvedReqStats.pendingTotal || 0), "finance", { targetTab: "reports", filterPayload: { card_filter: "awaiting" } })}
        </div>`)}
      ${moduleSection(L("financeAnalyticsSection"), L("financeAnalyticsHint"), "bi-pie-chart", "", `
        <div class="row g-4">
          <div class="col-xl-4">${chartCard(L("byCategory"), groupSum(allList, "contribution_category", "valor"))}</div>
          <div class="col-xl-4">${chartCard(L("byChurch"), groupSum(allList.map((f) => ({ ...f, igreja: churchName(f.church_id) })), "igreja", "valor"))}</div>
          <div class="col-xl-4">${chartCard(L("byPaymentMethod"), groupSum(allList, "metodo_de_pagamento", "valor"))}</div>
        </div>`)}`;
  } else if (financePageState.tab === "entries") {
    tabContent = moduleSection(L("financeRecordsSection"), L("financeRecordsHint"), "bi-table", "", `
      ${financeChips}<article class="panel glass-panel mb-0">${entriesTable}</article>`);
  } else if (financePageState.tab === "public") {
    tabContent = moduleSection(L("financeTabPublic"), L("financeRecordsHint"), "bi-globe2", "", `
      ${financeChips}<article class="panel glass-panel mb-0">${publicTable}</article>`);
  } else if (financePageState.tab === "verification") {
    tabContent = moduleSection(L("financeVerificationQueue"), L("financeVerificationHint"), "bi-shield-check", "", `
      ${financeChips}<article class="panel glass-panel mb-0">${verificationTable}</article>`);
  } else if (financePageState.tab === "approvedRequisitions") {
    if (!disbLib?.canViewApprovedRequisitions?.(activeUser)) {
      tabContent = `<div class="finance-privacy-banner"><i class="bi bi-shield-lock"></i><span>${L("accessDeniedText")}</span></div>`;
    } else {
      const filters = financePageState.approvedReqFilters;
      const filteredApproved = disbLib.filterList(approvedReqAll, filters);
      const reqStats = disbLib.computeStats(filteredApproved);
      tabContent = moduleSection(L("financeTabApprovedReq"), L("finApprovedReqHint"), "bi-clipboard-check", "", `
        <div class="row g-3 summary-cards-row mb-4">
          ${sm("bi-hourglass-split", L("finAwaitingRelease"), reqStats.awaiting, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Aguardando Liberação" } })}
          ${sm("bi-check-circle", L("finResourcesReleased"), reqStats.released, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Recursos Liberados" } })}
          ${sm("bi-cash-coin", L("finApprovedAmount"), money(reqStats.approvedTotal), "finance", { targetTab: "approvedRequisitions" })}
          ${sm("bi-wallet2", L("finReleasedAmount"), money(reqStats.releasedTotal), "finance", { targetTab: "approvedRequisitions" })}
          ${sm("bi-clock-history", L("finPendingPayments"), reqStats.pendingPayments, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Aguardando Liberação" } })}
          ${sm("bi-pie-chart", L("finPartiallyPaid"), reqStats.partial, "finance", { targetTab: "approvedRequisitions", filterPayload: { finance_status: "Parcialmente Pago" } })}
        </div>
        ${financeApprovedReqFilterBar(filters)}
        ${renderRequisitionReportsPanel({ compact: true, showTitle: false, filters: { ...financePageState.requisitionReportFilters, ...filters } })}
        ${filteredApproved.length ? dataTable(
          [L("reqNumber"), L("reqTitle"), L("reqDepartment"), L("church"), L("reqRequester"), L("finApprovedBy"), L("reqApprovedAmount"), L("finReleasedAmount"), L("finFinanceStatus"), L("actions")],
          filteredApproved.map((r) => [
            r.request_number,
            r.title,
            r.department_name,
            r.church_name || churchName(r.church_id),
            r.requested_by_name,
            r.approved_by || "-",
            money(r.approved_amount || r.estimated_amount),
            money(r.released_amount || r.amount_released || 0),
            financeApprovedReqBadge(r.finance_status || "Aguardando Liberação"),
            financeApprovedReqActions(r)
          ])
        ) : noResultsHtml()}`
      );
    }
  } else if (financePageState.tab === "reports") {
    tabContent = `
      ${moduleSection(L("financeReportsSection"), L("financeReportsHint"), "bi-graph-up", "", `
        ${privacyBanner}
        ${reportFiltersHtml}
        ${financeReportStatsCards(stats)}
        <div class="d-flex justify-content-end mb-3">${chartModeToggle}</div>
        <div class="row g-4 mb-4">
          <div class="col-xl-6">${categoryChart}</div>
          <div class="col-xl-6">${armChart}</div>
          <div class="col-xl-6">${monthlyChart}</div>
          <div class="col-xl-6">${financeAccess.canViewIndividualDetails ? topPartnersChart : `<article class="chart-card glass-panel finance-chart-card light-surface h-100"><div class="panel-head"><h3 class="panel-title">${L("financeTopPartners")}</h3></div><p class="finance-chart-empty">${L("financeAggregatedOnly")}</p></article>`}</div>
          <div class="col-12">${churchChart}</div>
        </div>
        <div class="row g-4 mb-4">
          <div class="col-12">
            <article class="panel glass-panel">
              <div class="panel-head"><h3 class="panel-title"><i class="bi bi-building me-2"></i>${L("financeChurchRanking")}</h3></div>
              ${financeChurchReportHtml(churchRows, financeAccess)}
            </article>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-xl-5">
            <article class="panel glass-panel h-100">
              <div class="panel-head"><h3 class="panel-title">${L("financeReportByIndividual")}</h3></div>
              ${financeAccess.canViewIndividualDetails ? `
                <select class="form-select mb-3" data-finance-select-contributor aria-label="${L("financeSelectContributor")}">
                  <option value="">${L("financeSelectContributor")}</option>
                  ${contributorOptions}
                </select>
                ${financeContributorProfileHtml(selectedDetail, financeAccess)}` : financeContributorProfileHtml(null, financeAccess)}
            </article>
          </div>
          <div class="col-xl-7">
            <article class="panel glass-panel h-100">
              <div class="panel-head"><h3 class="panel-title">${L("financeReportByPartnershipArm")}</h3></div>
              ${financePartnersArmCards(armDetails)}
            </article>
          </div>
        </div>`)}
      ${moduleSection(L("reqReportsTitle"), L("reqReportsHint"), "bi-clipboard-data", "", renderRequisitionReportsPanel({ showTitle: false, filters: financePageState.requisitionReportFilters, targetTab: "reports" }))}`;
  } else if (financePageState.tab === "partners") {
    tabContent = moduleSection(L("financeFeaturedPartners"), L("financeReportsHint"), "bi-stars", "", `
      ${privacyBanner}
      ${reportFiltersHtml}
      ${financePartnerSegmentTabs()}
      ${financePartnerHighlightCards(partnerProfilesRaw)}
      <article class="panel glass-panel mt-4 mb-0">
        <div class="panel-head"><h3 class="panel-title">${L("financeFeaturedPartners")}</h3></div>
        <div class="table-responsive">${financePartnerTable(partnerProfiles, financeAccess)}</div>
      </article>
      <div class="row g-4 mt-1">
        <div class="col-xl-6">${armChart}</div>
        <div class="col-xl-6">${topPartnersChart || armChart}</div>
      </div>`);
  } else if (financePageState.tab === "exports") {
    const exportTypes = [
      ["general", L("financeExportGeneral")],
      ["category", L("financeExportByCategory")],
      ["arm", L("financeExportByArm")],
      ["church", L("financeExportByChurch")],
      ["individual", L("financeExportByIndividual")],
      ["partners", L("financeExportFeaturedPartners")]
    ];
    tabContent = moduleSection(L("financeTabExports"), L("financeExportHint"), "bi-download", "", `
      ${reportFiltersHtml}
      ${financeReportStatsCards(stats)}
      <div class="finance-export-type mb-3">
        <label class="form-label">${L("financeTabReports")}</label>
        <select class="form-select" data-finance-export-type>
          ${exportTypes.map(([key, label]) => `<option value="${key}" ${financePageState.exportReportType === key ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>
      <div class="finance-export-actions d-flex flex-wrap gap-3 mt-3">
        ${financeAccess.canExport ? `
          <button type="button" class="btn btn-ce-gold" data-finance-export="pdf"><i class="bi bi-file-earmark-pdf me-2"></i>${L("financeExportPdf")}</button>
          <button type="button" class="btn btn-outline-cyan" data-finance-export="excel"><i class="bi bi-file-earmark-excel me-2"></i>${L("financeExportExcel")}</button>
          <button type="button" class="btn btn-outline-glass" data-finance-export="print"><i class="bi bi-printer me-2"></i>${L("financePrintReport")}</button>
          <button type="button" class="btn btn-outline-cyan" data-finance-export="csv"><i class="bi bi-filetype-csv me-2"></i>${L("financeExportCsv")}</button>
          <button type="button" class="btn btn-outline-cyan" data-finance-export="json"><i class="bi bi-braces me-2"></i>${L("financeExportJson")}</button>` : `<p class="text-secondary mb-0">${L("financeAggregatedOnly")}</p>`}
      </div>
      <p class="small text-secondary mt-3 mb-0">${list.length} ${L("financeContributionCount").toLowerCase()} · ${money(stats.totalReceived)}</p>`);
  }

  setPageContent(`
    ${sectionHeader(L("finance"), L("financeSubtitle"), "finance", "bi-cash-coin")}
    <article class="panel glass-panel module-content-card mb-4">
      ${financeModuleTabs()}
      <div class="tab-content-panel">${tabContent}</div>
    </article>
  `);
}

function renderSacraments() {
  const baptisms = scoped(state.sacraments.baptisms);
  const marriages = scoped(state.sacraments.marriages);
  const babies = scoped(state.sacraments.babies);
  const allSacraments = [...baptisms, ...marriages, ...babies];
  const pendingCount = allSacraments.filter((r) => ["Pending", "Pendente"].includes(r.estado)).length;
  const completedCount = allSacraments.filter((r) => ["Completed", "Realizado", "Certificate Issued"].includes(r.estado)).length;
  setPageContent( `
    ${moduleNavShell("sacraments", { title: L("sacraments"), subtitle: L("sacramentsSubtitle"), icon: "bi-droplet" },
      moduleScrollTabs([
        [L("baptismTab"), "panel-baptism"],
        [L("marriageTab"), "panel-marriage"],
        [L("babyTab"), "panel-baby"]
      ])
    )}
    <div class="row g-3 mb-4 summary-cards-row">
      ${sm("bi-droplet", L("baptismTab"), baptisms.length, "sacraments", { scrollTo: "panel-baptism" })}
      ${sm("bi-heart", L("marriageTab"), marriages.length, "sacraments", { scrollTo: "panel-marriage" })}
      ${sm("bi-emoji-smile", L("babyTab"), babies.length, "sacraments", { scrollTo: "panel-baby" })}
      ${sm("bi-hourglass-split", L("pending"), pendingCount, "sacraments", { filterPayload: { pending: true } })}
      ${sm("bi-check-circle", L("completed"), completedCount, "sacraments", { filterPayload: { completed: true } })}
    </div>
    ${summaryFilterChips("sacraments")}
    <div class="row g-4">
      <div class="col-xl-4">${sacramentPanel("baptism", L("baptismTab"), applySacramentCardFilters(baptisms, sacramentsPageState.filter), ["nome", "apelido", "telefone", "data_do_baptismo", "estado"])}</div>
      <div class="col-xl-4">${sacramentPanel("marriage", L("marriageTab"), applySacramentCardFilters(marriages, sacramentsPageState.filter), ["nome_do_noivo", "nome_da_noiva", "data_do_casamento", "estado"])}</div>
      <div class="col-xl-4">${sacramentPanel("baby", L("babyTab"), applySacramentCardFilters(babies, sacramentsPageState.filter), ["nome_da_crianca", "telefone_dos_pais", "data_da_dedicacao", "estado"])}</div>
    </div>
  `);
}

function sacramentPanel(type, title, records, keys) {
  return `
    <article id="panel-${type}" class="panel h-100">
      <div class="panel-head">
        <h3 class="panel-title">${title}</h3>
        <button class="btn btn-sm btn-ce-gold" data-open-form="${type}">${L("add")}</button>
      </div>
      ${dataTable([...keys.map((key) => labelFor(key)), L("actions")], records.map((record) => [
        ...keys.map((key) => key === "estado" ? badge(record[key]) : record[key]),
        actionButtons([["view", type, record.id, L("view")], ["edit", type, record.id, L("edit")]])
      ]))}
    </article>
  `;
}

function renderChurchCard(church) {
  const upcoming = getActiveServiceTimes(church.service_times).slice(0, 2);
  const servicesHtml = upcoming.length
    ? `<div class="church-card-services">${upcoming.map((record) => `<span class="church-service-chip">${formatServiceTimeShort(record)}</span>`).join("")}</div>`
    : "";
  return `
    <article class="church-card data-card light-surface">
      <div class="church-card-head">
        <div class="church-card-titles">
          <span class="eyebrow church-card-type">${churchTypeText(church.type)}</span>
          <h3>${church.church_name}</h3>
          ${church.public_name && church.public_name !== church.church_name ? `<p class="church-card-public mb-0">${church.public_name}</p>` : ""}
        </div>
        <div class="church-badge-row">
          ${badge(church.status)}
          ${badge(church.information_status)}
        </div>
      </div>
      <div class="church-card-meta">
        <div><span><i class="bi bi-geo-alt" aria-hidden="true"></i>${L("Province")} / ${L("City")}</span><strong>${church.province} / ${church.city}</strong></div>
        <div><span><i class="bi bi-person-badge" aria-hidden="true"></i>${L("Pastor")}</span><strong>${church.pastor_in_charge || L("toBeConfirmed")}</strong></div>
        <div><span><i class="bi bi-telephone" aria-hidden="true"></i>${L("phone")}</span><strong>${churchPhone(church)}</strong></div>
      </div>
      ${servicesHtml}
      <footer class="church-card-foot data-card-foot">${churchActions(church.id)}</footer>
    </article>`;
}

function renderChurchesTable(churches) {
  return dataTable(
    [L("church"), L("publicName"), L("Province"), L("City"), L("Type"), L("Pastor"), L("phone"), L("status"), L("informationStatus"), L("actions")],
    churches.map((church) => [
      church.church_name,
      church.public_name || "-",
      church.province,
      church.city,
      churchTypeText(church.type),
      church.pastor_in_charge || L("toBeConfirmed"),
      churchPhone(church),
      badge(church.status),
      badge(church.information_status),
      churchActions(church.id)
    ])
  );
}

function churchFilterSelect(name, label, options, value) {
  const labelForOption = (option) => {
    if (name === "type") return churchTypeText(option);
    if (name === "status" || name === "information_status") return statusText(option);
    return option;
  };
  return `
    <select class="form-select" data-church-filter="${name}" aria-label="${label}">
      <option value="">${label}</option>
      ${options.map((option) => `<option value="${option}" ${value === option ? "selected" : ""}>${labelForOption(option)}</option>`).join("")}
    </select>`;
}

function renderChurches() {
  const churches = getFilteredChurches();
  const allChurches = scoped(state.churches);
  const provinces = new Set(allChurches.map((church) => church.province).filter(Boolean));
  const activeCount = allChurches.filter((church) => statusKey(church.status) === "active").length;
  const onlineCount = allChurches.filter((church) => isOnlineChurch(church)).length;
  const confirmCount = allChurches.filter((church) => statusKey(church.information_status) === "toConfirm").length;
  const filters = churchPageState.filters;
  const listHtml = churchPageState.view === "table"
    ? `<article class="panel">${renderChurchesTable(churches)}</article>`
    : `<div class="church-card-grid">${churches.length ? churches.map((church) => renderChurchCard(church)).join("") : `<div class="col-12">${EmptyState({ title: L("empty"), icon: "bi-building" })}</div>`}</div>`;

  setPageContent( `
    ${sectionHeader(L("churches"), L("churchesSubtitle"), "church", "bi-building")}
    <div class="row g-3 mb-4">
      ${sm("bi-building", L("totalChurches"), allChurches.length, "churches", { filterPayload: {} })}
      ${sm("bi-check-circle", L("activeChurches"), activeCount, "churches", { filterPayload: { status: "Activa" } })}
      ${sm("bi-broadcast", L("onlineVirtualChurches"), onlineCount, "churches", { filterPayload: { type: "Igreja Online" } })}
      ${sm("bi-geo-alt", L("provincesCovered"), provinces.size, "churches", { scrollTo: "churches-filter-grid" })}
      ${sm("bi-flag", L("infoToConfirm"), confirmCount, "churches", { filterPayload: { information_status: "Por Confirmar" } })}
    </div>
    ${summaryFilterChips("churches")}
    <div class="churches-toolbar">
      <div class="churches-view-toggle" role="group" aria-label="${L("churches")}">
        <button type="button" class="${churchPageState.view === "cards" ? "active" : ""}" data-church-view="cards">${L("cardsView")}</button>
        <button type="button" class="${churchPageState.view === "table" ? "active" : ""}" data-church-view="table">${L("tableView")}</button>
      </div>
      <button type="button" class="btn btn-ce-gold" data-open-church-form="create"><i class="bi bi-plus-lg me-2"></i>${L("addChurch")}</button>
    </div>
    <div class="churches-filter-grid" id="churches-filter-grid">
      <input class="form-control" type="search" data-church-filter="search" value="${filters.search}" placeholder="${L("search")}" aria-label="${L("search")}">
      ${churchFilterSelect("province", L("filterProvince"), churchFilterOptions("province"), filters.province)}
      ${churchFilterSelect("city", L("filterCity"), churchFilterOptions("city"), filters.city)}
      ${churchFilterSelect("type", L("filterType"), CHURCH_TYPES, filters.type)}
      ${churchFilterSelect("status", L("filterStatus"), CHURCH_STATUSES, filters.status)}
      ${churchFilterSelect("information_status", L("filterInfoStatus"), CHURCH_INFO_STATUSES, filters.information_status)}
    </div>
    ${listHtml}
  `);
}

function openChurchDrawer(mode, id = null) {
  churchDrawerMode = mode;
  churchDrawerRecordId = id;
  const record = id ? state.churches.find((item) => item.id === id) : migrateChurchRecord({ status: "Activa", information_status: "Por Confirmar", type: "Igreja Local", parent_church_id: "church-hq" });
  const drawer = byId("churchDrawer");
  const backdrop = byId("churchDrawerBackdrop");
  const body = byId("churchDrawerBody");
  const foot = byId("churchDrawerFoot");
  if (!drawer || !backdrop || !body || !foot) return;

  if (mode === "view") {
    byId("churchDrawerEyebrow").textContent = L("churchDetails");
    byId("churchDrawerTitle").textContent = record.church_name || L("churches");
    body.innerHTML = churchDetailGrid(record);
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-church-drawer-close>${L("cancel")}</button>
      <button type="button" class="btn btn-ce-gold" data-action="edit" data-type="church" data-id="${record.id}">${L("edit")}</button>`;
  } else if (mode === "status") {
    byId("churchDrawerEyebrow").textContent = L("updateChurchStatus");
    byId("churchDrawerTitle").textContent = record.church_name || L("churches");
    body.innerHTML = `<form id="churchDrawerForm" class="row g-3">
      ${fieldControl(["status", "status", "select", CHURCH_STATUSES], record)}
      ${fieldControl(["information_status", "informationStatus", "select", CHURCH_INFO_STATUSES], record)}
    </form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-church-drawer-close>${L("cancel")}</button>
      <button type="submit" form="churchDrawerForm" class="btn btn-ce-gold">${L("save")}</button>`;
  } else {
    const migrated = migrateChurchRecord(record);
    byId("churchDrawerEyebrow").textContent = id ? L("editChurch") : L("addChurch");
    byId("churchDrawerTitle").textContent = id ? (migrated.church_name || L("edit")) : L("addChurch");
    body.innerHTML = `<form id="churchDrawerForm" class="row g-3">${formSchemas.church.map((field) => fieldControl(field, migrated)).join("")}${renderChurchServiceTimesEditor(migrated.service_times)}</form>`;
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-church-drawer-close>${L("cancel")}</button>
      <button type="submit" form="churchDrawerForm" class="btn btn-ce-gold">${L("save")}</button>`;
    drawer.classList.add("church-drawer--form");
    syncChurchServiceTimesJson();
    requestAnimationFrame(() => mountRelationalControls(byId("churchDrawerForm")));
  }

  if (mode !== "form") drawer.classList.remove("church-drawer--form");

  drawer.classList.remove("d-none");
  backdrop.classList.remove("d-none");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  drawer.setAttribute("aria-hidden", "false");
}

function closeChurchDrawer() {
  const drawer = byId("churchDrawer");
  const backdrop = byId("churchDrawerBackdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.classList.add("d-none");
  setTimeout(() => {
    drawer.classList.add("d-none");
    churchDrawerMode = null;
    churchDrawerRecordId = null;
  }, 280);
}

function churchDetailGrid(church) {
  const migrated = migrateChurchRecord(church);
  const rows = [
    ["church_name", "church"],
    ["public_name", "publicName"],
    ["type", "Type"],
    ["province", "Province"],
    ["city", "City"],
    ["district_or_area", "districtOrArea"],
    ["address", "address"],
    ["pastor_in_charge", "Pastor"],
    ["phone_primary", "phonePrimary"],
    ["phone_secondary", "phoneSecondary"],
    ["email", "email"],
    ["facebook", "facebook"],
    ["instagram", "instagram"],
    ["youtube", "youtube"],
    ["parent_church_id", "parentChurch"],
    ["status", "status"],
    ["information_status", "informationStatus"],
    ["notes", "notes"]
  ];
  return `
    <div class="church-detail-grid">${rows.map(([key, labelKey]) => {
      let value = migrated[key];
      if (key === "type") value = churchTypeText(value);
      else if (key === "parent_church_id") value = value ? churchName(value) : L("all");
      else if (key === "status" || key === "information_status") value = badge(value);
      else value = value || L("toBeConfirmed");
      return `<div><span>${L(labelKey)}</span><strong>${value}</strong></div>`;
    }).join("")}</div>
    <section class="church-service-times-detail">
      <h4 class="church-service-times-detail-title">${L("serviceTimes")}</h4>
      ${renderChurchServiceTimesDetail(migrated.service_times)}
    </section>`;
}

function submitChurchDrawer(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const today = new Date().toISOString().slice(0, 10);
  if (churchDrawerMode === "status" && churchDrawerRecordId) {
    const church = state.churches.find((item) => item.id === churchDrawerRecordId);
    if (!church) return;
    church.status = data.status || church.status;
    church.information_status = data.information_status || church.information_status;
    church.updated_by = activeUser.name;
    church.updated_at = today;
    saveState(`Updated church status ${church.church_name}`);
  } else {
    const service_times = collectChurchServiceTimesFromForm(form);
    delete data.service_times_json;
    const payload = migrateChurchRecord({
      ...data,
      service_times,
      parent_church_id: data.parent_church_id || "",
      updated_by: activeUser.name,
      updated_at: today
    });
    if (churchDrawerRecordId) {
      const index = state.churches.findIndex((item) => item.id === churchDrawerRecordId);
      if (index >= 0) {
        state.churches[index] = { ...state.churches[index], ...payload, id: churchDrawerRecordId, church_id: churchDrawerRecordId };
        saveState(`Updated church ${state.churches[index].church_name}`);
      }
    } else {
      const id = `church-${Date.now()}`;
      const service_times = payload.service_times?.length
        ? payload.service_times.map((record, index) => normalizeServiceTimeRecord(record, id, index))
        : defaultSeedServiceTimes(id, payload.type);
      state.churches.push({
        ...payload,
        id,
        church_id: id,
        service_times,
        created_by: activeUser.name,
        created_at: today,
        attendance_last_4_weeks: [0, 0, 0, 0]
      });
      saveState(`Created church ${payload.church_name}`);
    }
  }
  closeChurchDrawer();
  renderChurches();
}

function reviewFlag(needsReview) {
  return needsReview ? `<span class="review-flag" title="${L("needsReview")}"><i class="bi bi-flag-fill"></i></span>` : "";
}

function cellModalType(activeTab) {
  const map = {
    alecRegistration: "alecRegistration",
    alecScores: "alecScore",
    churchReports: "churchReport",
    receivedReports: "cellReport",
    cellLeaders: "cellLeader",
    cellEvaluation: "cellEvaluation",
    finalValidation: "finalValidation"
  };
  return map[activeTab] || null;
}

function renderCellMinistry(activeTab = "alecOverview") {
  const leadership = state.cellLeadership || seedData.cellLeadership;
  const registry = scopedNested(state.cellRegistry || []);
  const groups = scopedNested(state.cellGroups || []);
  const alecRegistrations = scopedNested(leadership.alecRegistrations);
  const alecScores = scopedNested(leadership.alecScores);
  const churchReports = scopedNested(leadership.churchReports);
  const cellReports = scopedNested(leadership.cellReports);
  const leaders = scopedNested(leadership.leaders);
  const evaluations = scopedNested(leadership.evaluations);
  const validations = scopedNested(leadership.validations);
  const actionPlans = scopedNested(leadership.actionPlans || []);
  const allReports = [...churchReports, ...cellReports];
  const totalAttendance = cellReports.reduce((sum, report) => sum + Number(report.att || 0), 0);
  const totalFt = cellReports.reduce((sum, report) => sum + Number(report.ft || 0), 0);
  const totalNc = cellReports.reduce((sum, report) => sum + Number(report.nc || 0), 0);
  const totalOffering = cellReports.reduce((sum, report) => sum + Number(report.oferta || 0), 0);
  const explosionCells = registry.filter((item) => String(item.observation || "").toUpperCase().includes("EXPLOSAO")).length;
  const attentionLeaders = leaders.filter((item) => ["Em Treinamento", "Precisa de Atenção"].includes(item.estado));
  const attentionEvaluations = evaluations.filter((item) => ["Precisa de Atenção", "Crítico"].includes(item.classificacao));
  const navHtml = cellModuleHeader(activeRoute, { modalType: cellModalType(activeTab) });
  let bodyHtml = "";

  if (activeTab === "alecOverview") {
    bodyHtml = `
      ${moduleSection(L("cellAlecSection"), L("cellAlecHint"), "bi-mortarboard", "cellAlecOverview", `
        <div class="row g-3 summary-cards-row">
          ${metric("bi-mortarboard", L("totalAlecRegistered"), alecRegistrations.length, L("alecFull"))}
          ${metric("bi-person-badge", L("alreadyLeaders"), alecRegistrations.filter((item) => item.e_lider).length, L("cellLeaders"))}
          ${metric("bi-book", L("didFoundationSchool"), alecRegistrations.filter((item) => item.fez_escola_de_fundacao).length, L("foundationSchool"))}
          ${metric("bi-hourglass-split", L("inTraining"), alecRegistrations.filter((item) => item.estado === "Em Formação").length, L("active"))}
          ${metric("bi-award", L("alecCompleted"), alecScores.filter((item) => item.terminou).length, L("certificateIssued"))}
          ${metric("bi-clipboard-check", L("churchReports"), churchReports.length, L("reports"))}
        </div>`)}
      ${moduleSection(L("cellGrowthSection"), L("cellAlecHint"), "bi-graph-up", "", `
        <div class="row g-4">
          <div class="col-xl-6">${chartCard(L("alecProgressByChurch"), groupCount(alecRegistrations, "igreja"))}</div>
          <div class="col-xl-6">${chartCard(L("reportsByStatus"), groupCount(alecScores, "estado"))}</div>
        </div>`)}`;
  } else if (activeTab === "ministryOverview") {
    bodyHtml = `
      ${moduleSection(L("cellNetworkSection"), L("cellNetworkHint"), "bi-diagram-3", "cellMinistryOverview", `
        <div class="row g-3 summary-cards-row">
          ${metric("bi-collection", L("totalGroupCells"), groups.length, L("cellGroups"))}
          ${metric("bi-diagram-3", L("totalCells"), registry.length, L("activeCells"))}
          ${metric("bi-clipboard-check", L("submittedReports"), cellReports.filter((item) => item.estado !== "Rascunho").length, L("reports"))}
          ${metric("bi-hourglass-split", L("pendingReportsShort"), cellReports.filter((item) => ["Rascunho", "Submetido", "Em Avaliação"].includes(item.estado)).length, L("needsAction"))}
          ${metric("bi-lightning-charge", L("explosionCells"), explosionCells, L("readyToSplit"))}
          ${metric("bi-exclamation-triangle", L("attentionCells"), attentionEvaluations.length, L("leaderSupport"))}
        </div>`)}
      ${moduleSection(L("cellGrowthSection"), L("cellGrowthHint"), "bi-graph-up-arrow", "", `
        <div class="row g-3 summary-cards-row mb-3">
          ${metric("bi-people", L("totalAttendance"), totalAttendance, L("attendance"))}
          ${metric("bi-person-heart", L("totalFirstTime"), totalFt, L("firstTimers"))}
          ${metric("bi-stars", L("totalNewConverts"), totalNc, L("newConverts"))}
          ${metric("bi-cash-coin", L("totalOffering"), money(totalOffering), L("finance"))}
        </div>
        <div class="row g-4">
          <div class="col-xl-4">${chartCard(L("attendanceByWeek"), groupSum(cellReports, "semana", "att"))}</div>
          <div class="col-xl-4">${chartCard(L("firstTimersByCell"), groupSum(cellReports, "celula", "ft"))}</div>
          <div class="col-xl-4">${chartCard(L("newConvertsByCell"), groupSum(cellReports, "celula", "nc"))}</div>
          <div class="col-xl-4">${chartCard(L("offeringByWeek"), groupSum(cellReports, "semana", "oferta"))}</div>
          <div class="col-xl-4">${chartCard(L("reportsByStatus"), groupCount(cellReports, "estado"))}</div>
          <div class="col-xl-4">${chartCard(L("topCellsGrowth"), cellReports.map((report) => [report.celula, Number(report.ft || 0) + Number(report.nc || 0)]))}</div>
        </div>`)}`;
  } else if (activeTab === "cellPerformance") {
    bodyHtml = `
      <div class="row g-3 mb-4">
        ${metric("bi-people", L("totalAttendance"), registry.reduce((sum, item) => sum + Number(item.attendance || 0), 0), L("reportWeek"))}
        ${metric("bi-person-heart", L("totalFirstTime"), registry.reduce((sum, item) => sum + Number(item.first_timers || 0), 0), L("firstTimers"))}
        ${metric("bi-stars", L("totalNewConverts"), registry.reduce((sum, item) => sum + Number(item.new_converts || 0), 0), L("newConverts"))}
        ${metric("bi-lightning-charge", L("explosionCells"), explosionCells, L("readyToSplit"))}
      </div>
      <div class="row g-4">
        <div class="col-xl-4">${chartCard(L("attendanceByWeek"), registry.slice(0, 24).map((item) => [item.cell_name, item.attendance]))}</div>
        <div class="col-xl-4">${chartCard(L("firstTimersByCell"), registry.slice(0, 24).map((item) => [item.cell_name, item.first_timers]))}</div>
        <div class="col-xl-4">${chartCard(L("newConvertsByCell"), registry.slice(0, 24).map((item) => [item.cell_name, item.new_converts]))}</div>
        <div class="col-xl-4">${chartCard(L("offeringByWeek"), registry.slice(0, 24).map((item) => [item.cell_name, item.offering]))}</div>
        <div class="col-xl-4">${chartCard(L("topCellsGrowth"), registry.slice(0, 20).map((item) => [item.cell_name, Number(item.first_timers || 0) + Number(item.new_converts || 0)]))}</div>
        <div class="col-xl-4">${chartCard(L("itemsByStatus"), groupCount(registry, "status"))}</div>
      </div>`;
  } else if (activeTab === "leadersAttention") {
    bodyHtml = `
      <div class="row g-3 mb-4">
        ${metric("bi-exclamation-triangle", L("leadersAttention"), attentionLeaders.length, L("needsAction"))}
        ${metric("bi-clipboard-check", L("attentionCells"), attentionEvaluations.length, L("cellEvaluation"))}
      </div>
      <div class="row g-4">
        <div class="col-12">${modulePanel("cellLeader", L("leadersAttention"), null, [L("fullName"), L("contact"), L("church"), L("cell"), L("supervisor"), L("status"), L("actions")], attentionLeaders.map((item) => [item.nome_completo, item.contacto, churchName(item.igreja), item.celula, item.supervisor, badge(item.estado), backendActions("cellLeader", item.id)]), true)}</div>
        <div class="col-12">${modulePanel("cellEvaluation", L("recommendedActions"), null, [L("reports"), L("evaluator"), L("classification"), L("recommendedAction"), L("status"), L("actions")], attentionEvaluations.map((item) => [item.report_id, item.avaliador, badge(item.classificacao), item.acao_recomendada, badge(item.estado), backendActions("cellEvaluation", item.id)]), false)}</div>
      </div>`;
  } else if (activeTab === "actionPlan") {
    bodyHtml = `<div class="row g-4"><div class="col-12">${modulePanel("cellActionPlan", L("actionPlan"), null, [L("cell"), L("leaderName"), L("recommendedActions"), L("actionOwner"), L("dueDate"), L("status"), L("actions")], actionPlans.map((item) => [item.cell_name, item.leader_name, item.action, item.owner, item.due_date, badge(item.status), actionButtons([["view", "cellActionPlan", item.id, L("view")], ["edit", "cellActionPlan", item.id, L("edit")]])]), true)}</div></div>`;
  } else if (activeTab === "weeklyReport") {
    bodyHtml = `
      <div class="row g-3 mb-4">
        ${metric("bi-calendar-week", L("weeklyCellReport"), cellReports.length, L("reportWeek"))}
        ${metric("bi-people", L("totalAttendance"), totalAttendance, L("attendance"))}
        ${metric("bi-person-heart", L("totalFirstTime"), totalFt, L("firstTimers"))}
        ${metric("bi-stars", L("totalNewConverts"), totalNc, L("newConverts"))}
      </div>
      <div class="row g-4"><div class="col-12">${modulePanel("cellReport", L("weeklyCellReport"), "cellReport", [L("week"), L("cell"), L("leaderName"), "ATT", "FT", "NC", "OF.", "RS", L("status"), L("actions")], cellReports.map((item) => [item.semana, item.celula, item.nome_do_lider, item.att, item.ft, item.nc, money(item.oferta), item.rs, badge(item.estado), backendActions("cellReport", item.id)]), true)}</div></div>`;
  } else if (activeTab === "consolidation") {
    bodyHtml = `
      <div class="row g-3 mb-4">
        ${metric("bi-clipboard-check", L("submittedReports"), allReports.filter((item) => item.estado !== "Rascunho").length, L("reports"))}
        ${metric("bi-patch-check", L("validated"), validations.filter((item) => item.estado_final === "Validado").length, L("finalValidation"))}
        ${metric("bi-collection", L("totalGroupCells"), groups.length, L("cellGroups"))}
        ${metric("bi-diagram-3", L("totalCells"), registry.length, L("activeCells"))}
      </div>
      <div class="row g-4">
        <div class="col-xl-6">${chartCard(L("reportsByStatus"), groupCount(allReports, "estado"))}</div>
        <div class="col-xl-6">${chartCard(L("itemsByStatus"), groupCount(groups, "status"))}</div>
        <div class="col-12">${modulePanel("finalValidation", L("consolidation"), "finalValidation", [L("reports"), L("validatedBy"), L("date"), L("decision"), L("finalStatus"), L("actions")], validations.map((item) => [item.report_id, item.validado_por, item.data_validacao, badge(item.decisao), badge(item.estado_final), backendActions("finalValidation", item.id)]), true)}</div>
      </div>`;
  } else {
    const panels = {
      alecRegistration: () => modulePanel("alecRegistration", L("alecRegistration"), "alecRegistration", [L("fullName"), L("contact"), L("church"), L("cell"), L("cellLeaderName"), L("didFoundation"), L("isLeader"), L("status"), L("actions")], alecRegistrations.map((item) => [item.nome_completo, item.contacto, churchName(item.igreja), item.celula, item.nome_do_lider_de_celula, yesNo(item.fez_escola_de_fundacao), yesNo(item.e_lider), badge(item.estado), backendActions("alecRegistration", item.id)]), true),
      alecScores: () => modulePanel("alecScore", L("alecScores"), "alecScore", [L("fullName"), L("church"), L("cell"), L("phase1Average"), L("phase2Average"), L("finalAverage"), L("finished"), L("status"), L("progress"), L("actions")], alecScores.map((item) => [item.nome_completo, churchName(item.igreja), item.celula, alecPhaseAverage(item, 1), alecPhaseAverage(item, 2), alecFinalAverage(item), yesNo(item.terminou), badge(item.estado), alecProgress(item), backendActions("alecScore", item.id)]), true),
      churchReports: () => modulePanel("churchReport", L("churchReports"), "churchReport", [L("week"), L("worshipService"), L("cell"), L("leaderName"), "ATT", "FT", "NC", "RS", L("status"), L("actions")], churchReports.map((item) => [item.semana, item.culto, item.celula, item.nome_do_lider, item.att, item.ft, item.nc, item.rs, badge(item.estado), backendActions("churchReport", item.id)]), true),
      receivedReports: () => modulePanel("cellReport", L("receivedReports"), "cellReport", [L("week"), L("cell"), L("leaderName"), "ATT", "FT", "NC", "OF.", "RS", L("status"), L("actions")], cellReports.map((item) => [item.semana, item.celula, item.nome_do_lider, item.att, item.ft, item.nc, money(item.oferta), item.rs, badge(item.estado), backendActions("cellReport", item.id)]), true),
      cellEvaluation: () => modulePanel("cellEvaluation", L("cellEvaluation"), "cellEvaluation", [L("reports"), L("evaluator"), L("evaluationDate"), L("classification"), L("needsFollowup"), L("recommendedAction"), L("status"), L("actions")], evaluations.map((item) => [item.report_id, item.avaliador, item.data_da_avaliacao, badge(item.classificacao), yesNo(item.precisa_followup), item.acao_recomendada, badge(item.estado), backendActions("cellEvaluation", item.id)]), true),
      cellLeaders: () => modulePanel("cellLeader", L("cellLeaders"), "cellLeader", [L("fullName"), L("contact"), L("church"), L("cell"), L("actualLeader"), L("cameFromAlec"), L("alecFinished"), L("supervisor"), L("status"), L("actions")], leaders.map((item) => [item.nome_completo, item.contacto, churchName(item.igreja), item.celula, yesNo(item.e_lider_actual), yesNo(item.veio_do_alec), yesNo(item.alec_concluido), item.supervisor, badge(item.estado), backendActions("cellLeader", item.id)]), true),
      finalValidation: () => modulePanel("finalValidation", L("finalValidation"), "finalValidation", [L("reports"), L("validatedBy"), L("date"), L("decision"), L("finalStatus"), L("actions")], validations.map((item) => [item.report_id, item.validado_por, item.data_validacao, badge(item.decisao), badge(item.estado_final), backendActions("finalValidation", item.id)]), true)
    };
    const panelTitle = cellRouteLabel(activeRoute);
    bodyHtml = moduleSection(panelTitle, L("cellDataHint"), "bi-table", activeRoute, `
      <div class="row g-4"><div class="col-12">${(panels[activeTab] || panels.alecRegistration)()}</div></div>`);
  }

  setPageContent(navHtml + tabParallaxWrap(bodyHtml, activeRoute));
  triggerTabParallax();
  requestAnimationFrame(() => scrollContentTo("content", { behavior: "auto" }));
}

function renderCellGroups() {
  const groups = scopedNested(state.cellGroups || []);
  const registry = scopedNested(state.cellRegistry || []);
  const navHtml = cellModuleHeader("cellGroups");
  const bodyHtml = `
    ${filterBar({ search: true, church: true, month: false, status: true })}
    <div class="row g-3 mb-4">
      ${metric("bi-collection", L("totalGroupCells"), groups.length, L("cellGroups"))}
      ${metric("bi-diagram-3", L("totalCells"), registry.length, L("activeCells"))}
      ${metric("bi-people", L("totalMembers"), groups.reduce((sum, item) => sum + Number(item.total_members || 0), 0), L("members"))}
      ${metric("bi-flag", L("needsReview"), groups.filter((item) => item.needs_review).length, L("importReview"))}
    </div>
    <div class="row g-4">
      <div class="col-12">${modulePanel("cellGroup", L("cellGroups"), null, [L("groupName"), L("leaderName"), L("church"), L("totalCells"), L("totalMembers"), L("status"), L("review"), L("actions")], groups.map((item) => [
        `${item.group_name} ${reviewFlag(item.needs_review)}`,
        item.leader_name || "-",
        churchName(item.church_id),
        item.total_cells,
        item.total_members || "-",
        badge(item.status),
        item.needs_review ? badge("Em Revisão") : "-",
        actionButtons([
          ["view", "cellGroup", item.id, L("view")],
          ["edit", "cellGroup", item.id, L("edit")],
          ["viewGroupCells", "cellGroup", item.id, L("viewCells")]
        ])
      ]), true)}</div>
    </div>`;
  setPageContent(navHtml + tabParallaxWrap(bodyHtml, activeRoute));
  triggerTabParallax();
}

function renderCellCellsList() {
  const groups = scopedNested(state.cellGroups || []);
  let cells = scopedNested(state.cellRegistry || []);
  const filterGroup = cellRegistryFilter.groupId ? groups.find((item) => item.id === cellRegistryFilter.groupId) : null;
  if (filterGroup) cells = cells.filter((item) => item.group_id === filterGroup.id);
  const navHtml = cellModuleHeader("cellCellsList");
  const filterBanner = filterGroup ? `
    <div class="cell-filter-banner mb-3">
      <span>${L("filteredByGroup")}: <strong>${filterGroup.group_name}</strong></span>
      <button type="button" class="btn btn-sm btn-outline-light" data-action="clearCellFilter">${L("clearFilter")}</button>
    </div>` : "";
  const bodyHtml = `
    ${filterBanner}
    ${filterBar({ search: true, church: true, month: false, status: true, exportBtn: true })}
    <div class="row g-3 mb-4">
      ${metric("bi-diagram-3", L("totalCells"), cells.length, filterGroup ? filterGroup.group_name : L("all"))}
      ${metric("bi-people", L("totalAttendance"), cells.reduce((sum, item) => sum + Number(item.attendance || 0), 0), L("reportWeek"))}
      ${metric("bi-person-heart", L("totalFirstTime"), cells.reduce((sum, item) => sum + Number(item.first_timers || 0), 0), L("firstTimers"))}
      ${metric("bi-stars", L("totalNewConverts"), cells.reduce((sum, item) => sum + Number(item.new_converts || 0), 0), L("newConverts"))}
    </div>
    <div class="row g-4">
      <div class="col-12">${modulePanel("cellRegistry", L("cellCellsList"), null, [L("cellName"), L("groupName"), L("leaderTitle"), L("leaderName"), L("attendance"), L("firstTimeShort"), L("newConvertsShort"), L("offering"), L("observation"), L("status"), L("actions")], cells.map((item) => [
        item.cell_name,
        item.group_name,
        item.leader_title,
        item.leader_name,
        item.attendance,
        item.first_timers,
        item.new_converts,
        money(item.offering),
        item.observation || "-",
        badge(item.status),
        actionButtons([
          ["view", "cellRegistry", item.id, L("view")],
          ["edit", "cellRegistry", item.id, L("edit")],
          ["updateReport", "cellRegistry", item.id, L("updateCellReport")]
        ])
      ]), true)}</div>
    </div>`;
  setPageContent(navHtml + tabParallaxWrap(bodyHtml, activeRoute));
  triggerTabParallax();
}

function scopedNested(records) {
  return scoped(records || []);
}

function prisonName(id) {
  return state.prisonMinistry.prisons.find((prison) => prison.id === id)?.nome_da_prisao || id || "-";
}

function materialName(idOrTitle) {
  return state.ministryMaterials.catalogue.find((item) => item.id === idOrTitle)?.titulo_do_material || idOrTitle || "-";
}

function backendActions(type, id, extra = []) {
  if (type.endsWith("Report")) {
    return actionButtons([["view", type, id, L("view")], ["export", type, id, L("export")]]);
  }
  return actionButtons([
    ["view", type, id, L("view")],
    ["edit", type, id, L("edit")],
    ["status", type, id, L("updateStatus")],
    ...extra,
    ["export", type, id, L("export")]
  ]);
}

function renderPrisonMinistry() {
  const prisons = scopedNested(state.prisonMinistry.prisons);
  const services = scopedNested(state.prisonMinistry.services);
  const students = scopedNested(state.prisonMinistry.foundationStudents);
  const agenda = scopedNested(state.prisonMinistry.weeklyAgenda);
  const reports = scopedNested(state.prisonMinistry.reports);
  const thisWeekServices = services.filter((service) => service.data >= "2026-07-06" && service.data <= "2026-07-12");
  setPageContent( `
    ${moduleNavShell("prisonMinistry", { title: L("prisonMinistry"), subtitle: L("prisonMinistrySubtitle"), modalType: "prisonService", icon: "bi-shield-lock" },
      moduleScrollTabs([
        [L("cellOverview"), "content"],
        [L("prisonsLocations"), "panel-prisonLocation"],
        [L("prisonServices"), "panel-prisonService"],
        [L("foundationSchool"), "panel-prisonFoundation"],
        [L("weeklyAgenda"), "panel-prisonAgenda"],
        [L("ministryReports"), "panel-prisonReport"]
      ])
    )}
    <div class="row g-3 mb-4">
      ${metric("bi-building-lock", L("activePrisons"), prisons.filter((item) => statusKey(item.estado) === "active").length, L("prisonsLocations"))}
      ${metric("bi-calendar-week", L("servicesThisWeek"), thisWeekServices.length, "Quinta / Sexta")}
      ${metric("bi-people", L("inmatesReached"), services.reduce((sum, item) => sum + Number(item.numero_de_internos_presentes || 0), 0), L("thisMonth"))}
      ${metric("bi-stars", L("prisonNewConverts"), services.reduce((sum, item) => sum + Number(item.novos_convertidos || 0), 0), L("newConverts"))}
      ${metric("bi-mortarboard", L("prisonFoundationStudents"), students.length, L("foundationSchool"))}
      ${metric("bi-clipboard-check", L("pendingReports"), services.filter((item) => item.estado !== "Relatório Submetido").length, L("needsAction"))}
    </div>
    <div class="row g-4">
      <div class="col-12">${modulePanel("prisonLocation", L("prisonsLocations"), "prisonLocation", [L("prisonName"), L("province"), L("city"), L("responsibleChurch"), L("prisonRepresentative"), L("status"), L("actions")], prisons.map((item) => [item.nome_da_prisao, item.provincia, item.cidade, churchName(item.igreja_responsavel), item.representante_da_prisao, badge(item.estado), backendActions("prisonLocation", item.id)]), true)}</div>
      <div class="col-12">${modulePanel("prisonService", L("prisonServices"), "prisonService", [L("date"), L("weekday"), L("prison"), L("responsibleLeader"), L("inmatesPresent"), L("prisonNewConverts"), L("status"), L("actions")], services.map((item) => [item.data, item.dia_da_semana, prisonName(item.prisao), item.lider_responsavel, item.numero_de_internos_presentes, item.novos_convertidos, badge(item.estado), backendActions("prisonService", item.id)]), true)}</div>
      <div class="col-12">${modulePanel("prisonFoundation", L("foundationSchool"), "prisonFoundation", [L("participantName"), L("prison"), L("classes"), L("exam"), L("evangelismPractice"), L("graduated"), L("status"), L("progress"), L("actions")], students.map((item) => [item.nome_do_participante, prisonName(item.prisao), `${prisonClassCount(item)}/7`, item.nota_exame || "-", yesNo(item.pratica_evangelismo), yesNo(item.graduado), badge(item.estado), prisonProgress(item), backendActions("prisonFoundation", item.id)]), true)}</div>
      <div class="col-xl-6">${modulePanel("prisonAgenda", L("weeklyAgenda"), "prisonAgenda", [L("weekStart"), L("weekEnd"), L("responsible"), L("thursdayService"), L("fridayService"), L("status"), L("actions")], agenda.map((item) => [item.semana_inicio, item.semana_fim, item.responsavel, yesNo(item.quinta_servico_prisional), yesNo(item.sexta_servico_prisional), badge(item.estado), backendActions("prisonAgenda", item.id)]), false)}</div>
      <div class="col-xl-6">${modulePanel("prisonReport", L("ministryReports"), null, [L("name"), L("category"), L("status"), L("actions")], reports.map((item) => [item.name, item.category, badge(item.estado || item.status), backendActions("prisonReport", item.id)]), false)}</div>
    </div>
  `);
}

function venueDepartmentTabs(active) {
  const allTabs = [
    ["venueInventory", "cellOverview", "overview"],
    ["venueInventoryGeneral", "generalInventory", "inventory"],
    ["venueInventoryAcquisitions", "newAcquisitions", "acquisitions"],
    ["venueInventoryStaff", "staffEquipment", "staff"],
    ["venueInventoryMaintenance", "maintenanceRepairs", "maintenance"],
    ["venueInventoryMovements", "loansMovements", "movements"],
    ["venueInventorySpaces", "venuesRooms", "spaces"],
    ["venueInventoryChecklist", "serviceChecklist", "checklist"],
    ["venueInventoryReports", "venueReports", "reports"]
  ];
  const allowed = new Set(allowedVenueTabs());
  const tabs = allTabs.filter(([, , tab]) => allowed.has(tab));
  return moduleTabsNav(tabs.map(([route, label, tab]) =>
    moduleTabButton(L(label), { active: active === tab, attrs: `data-route="${route}"` })
  ).join(""), "department-tabs");
}

function venueDepartments() {
  const values = new Set();
  (state.venueInventory?.inventory || []).forEach((item) => {
    if (item.departamento_responsavel) values.add(item.departamento_responsavel);
  });
  (state.venueInventory?.staffEquipment || []).forEach((item) => {
    if (item.departamento) values.add(item.departamento);
  });
  return [...values];
}

function venueFilterBar() {
  return `
    <div class="filter-bar advanced-filter mb-3">
      <input class="form-control" placeholder="${L("search")}">
      <select class="form-select"><option>${L("category")}</option>${inventoryCategories.map((item) => `<option>${item}</option>`).join("")}</select>
      <select class="form-select"><option>${L("filterStatus")}</option>${inventoryStatuses.map((item) => `<option>${item}</option>`).join("")}</select>
      <select class="form-select"><option>${L("filterDepartment")}</option>${venueDepartments().map((item) => `<option>${item}</option>`).join("")}</select>
      <select class="form-select"><option>${L("filterChurch")}</option>${state.churches.map((church) => `<option>${church.church_name}</option>`).join("")}</select>
      <input class="form-control" type="date" aria-label="${L("filterDate")}">
    </div>
  `;
}

function venueModulePanel(type, title, modalType, headers, rows, { showFilters = true, allowAdd = true } = {}) {
  const canAdd = allowAdd && modalType && (canManageVenue() || (modalType === "venueMovement" && canRequestVenueEquipment()));
  return `
    <article id="panel-${type}" class="panel h-100">
      <div class="panel-head">
        <h3 class="panel-title">${title}</h3>
        <div class="action-cluster">
          ${canAdd ? `<button class="btn btn-sm btn-ce-gold" data-open-form="${modalType}"><i class="bi bi-plus-lg me-1"></i>${modalType === "venueMovement" && !canManageVenue() ? L("requestEquipment") : L("add")}</button>` : ""}
          <button type="button" class="btn btn-sm btn-outline-cyan action-secondary" data-action="export" data-type="${type}" data-id="${type}"><i class="bi bi-file-earmark-excel me-1"></i>${L("exportExcel")}</button>
          <button type="button" class="btn btn-sm btn-outline-cyan action-secondary" data-action="export" data-type="${type}" data-id="${type}"><i class="bi bi-file-earmark-pdf me-1"></i>${L("exportPdf")}</button>
        </div>
      </div>
      ${showFilters ? venueFilterBar() : ""}
      ${dataTable(headers, rows)}
    </article>
  `;
}

function renderVenueInventory(activeTab = "overview") {
  if (!canViewVenueModule()) {
    setPageContent(`<article class="empty-state ui-empty-state">${L("accessControl")}</article>`);
    return;
  }
  if (isStaffEquipmentOnly()) activeTab = "staff";

  const venue = state.venueInventory || seedData.venueInventory;
  const inventory = scopedVenueDepartment(venue.inventory, "departamento_responsavel");
  const acquisitions = scopedNested(venue.acquisitions);
  const staffEquipment = scopedVenueStaff(venue.staffEquipment);
  const maintenance = scopedNested(venue.maintenance);
  const movements = scopedVenueDepartment(venue.movements, "departamento_solicitante");
  const venues = scopedNested(venue.venues);
  const checklists = scopedNested(venue.checklists);
  const reports = scopedNested(venue.reports || []);
  const goodItems = inventory.filter((item) => item.estado === "Bom");
  const damagedItems = inventory.filter((item) => ["Mau", "Em Reparação"].includes(item.estado));
  const acquisitionValue = acquisitions.reduce((sum, item) => sum + Number(item.valor_total || 0), 0);
  const pendingMovements = movements.filter((item) => ["Solicitado", "Aprovado", "Em Uso"].includes(item.estado));
  const pendingChecklists = checklists.filter((item) => item.estado !== "Pronto");
  const addType = canManageVenue() ? "inventoryItem" : null;
  const show = (...tabs) => tabs.some((tab) => allowedVenueTabs().includes(tab)) && (activeTab === "overview" || tabs.includes(activeTab));

  const navHtml = moduleNavShell("venueInventory", { title: L("venueInventory"), subtitle: L("venueInventorySubtitle"), modalType: addType, icon: "bi-box-seam" }, venueDepartmentTabs(activeTab));
  const bodyHtml = `
    ${show("overview") ? `<div class="row g-3 mb-4">
      ${sm("bi-box-seam", L("totalItems"), inventory.length, "venue", { route: "venueInventoryGeneral" })}
      ${sm("bi-check-circle", L("goodEquipment"), goodItems.length, "venue", { route: "venueInventoryGeneral", filterPayload: { estado: "Bom" } })}
      ${sm("bi-exclamation-triangle", L("damagedEquipment"), damagedItems.length, "venue", { route: "venueInventoryGeneral", filterPayload: { estado: "Mau" } })}
      ${sm("bi-tools", L("inRepair"), inventory.filter((item) => item.estado === "Em Reparação").length, "venue", { route: "venueInventoryMaintenance", filterPayload: { estado: "Em Reparação" } })}
      ${sm("bi-laptop", L("assignedStaffEquipment"), staffEquipment.filter((item) => item.estado === "Activo").length, "venue", { route: "venueInventoryStaff", filterPayload: { assigned: true } })}
      ${sm("bi-cart-plus", L("acquisitions2026"), acquisitions.length, "venue", { route: "venueInventoryAcquisitions" })}
      ${sm("bi-arrow-left-right", L("pendingMovements"), pendingMovements.length, "venue", { route: "venueInventoryMovements" })}
      ${sm("bi-building", L("activeSpaces"), venues.filter((item) => item.estado === "Activo").length, "venue", { route: "venueInventorySpaces" })}
      ${sm("bi-clipboard-check", L("pendingChecklists"), pendingChecklists.length, "venue", { route: "venueInventoryChecklist" })}
    </div>
    ${summaryFilterChips("venue")}
    <div class="row g-4 mb-4">
      <div class="col-xl-4">${chartCard(L("itemsByCategory"), groupCount(inventory, "categoria"))}</div>
      <div class="col-xl-4">${chartCard(L("itemsByStatus"), groupCount(inventory, "estado"))}</div>
      <div class="col-xl-4">${chartCard(L("equipmentByDepartment"), groupCount(inventory, "departamento_responsavel"))}</div>
      <div class="col-xl-4">${chartCard(L("repairsByStatus"), groupCount(maintenance, "estado"))}</div>
      <div class="col-xl-4">${chartCard(L("acquisitionsByMonth"), acquisitions.map((item) => [item.data_de_compra_ou_entrada?.slice(0, 7) || "-", Number(item.valor_total || 0)]))}</div>
    </div>` : ""}
    <div class="row g-4">
      ${show("inventory") ? `<div class="col-12">${summaryFilterChips("venue")}${venueModulePanel("inventoryItem", L("generalInventory"), canManageVenue() ? "inventoryItem" : null, [L("itemName"), L("category"), L("quantity"), L("location"), L("responsibleDepartment"), L("church"), L("unitValue"), L("totalValue"), L("status"), L("actions")], applyVenueInventoryCardFilters(inventory, venuePageState.filter).map((item) => [item.nome_do_item, item.categoria, item.quantidade, item.localizacao, item.departamento_responsavel, churchName(item.church_id), money(item.valor_unitario), money(item.valor_total), badge(item.estado), venueRecordActions("inventoryItem", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("acquisitions") ? `<div class="col-12">${venueModulePanel("venueAcquisition", L("newAcquisitions"), canManageVenue() ? "venueAcquisition" : null, [L("itemCode"), L("description"), L("category"), L("quantity"), L("purchaseEntryDate"), L("supplier"), L("receivedBy"), L("totalValue"), L("status"), L("actions")], acquisitions.map((item) => [item.codigo_do_item, item.descricao, item.categoria, item.quantidade, item.data_de_compra_ou_entrada, item.fornecedor, item.recebido_por, money(item.valor_total), badge(item.estado), venueRecordActions("venueAcquisition", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("staff") ? `<div class="col-12">${venueModulePanel("venueStaffEquipment", L("staffEquipment"), canManageVenue() ? "venueStaffEquipment" : null, [L("staffName"), L("department"), L("church"), L("device"), L("model"), L("deliveryDate"), L("currentCondition"), L("signatureConfirmed"), L("status"), L("actions")], staffEquipment.map((item) => [item.nome_do_funcionario, item.departamento, churchName(item.church_id), item.dispositivo, item.modelo, item.data_de_entrega, item.estado_actual, yesNo(item.assinatura_confirmada), badge(item.estado), venueRecordActions("venueStaffEquipment", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("maintenance") ? `<div class="col-12">${venueModulePanel("venueMaintenance", L("maintenanceRepairs"), canManageVenue() ? "venueMaintenance" : null, [L("item"), L("category"), L("quantity"), L("reportedProblem"), L("repairCost"), L("technicianResponsible"), L("sentDate"), L("returnedDate"), L("status"), L("actions")], maintenance.map((item) => [item.item, item.categoria, item.quantidade, item.problema_reportado, money(item.custo_da_reparacao), item.tecnico_ou_responsavel, item.data_de_envio, item.data_de_retorno, badge(item.estado), venueRecordActions("venueMaintenance", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("movements") ? `<div class="col-12">${venueModulePanel("venueMovement", L("loansMovements"), canManageVenue() || canRequestVenueEquipment() ? "venueMovement" : null, [L("item"), L("quantity"), L("originPlace"), L("destination"), L("requestingDepartment"), L("responsiblePerson"), L("exitDate"), L("expectedReturnDate"), L("status"), L("actions")], movements.map((item) => [item.item, item.quantidade, item.origem, item.destino, item.departamento_solicitante, item.pessoa_responsavel, item.data_de_saida, item.data_prevista_de_retorno, badge(item.estado), venueRecordActions("venueMovement", item.id)]), { allowAdd: canManageVenue() || canRequestVenueEquipment() })}</div>` : ""}
      ${show("spaces") ? `<div class="col-12">${venueModulePanel("venueSpace", L("venuesRooms"), canManageVenue() ? "venueSpace" : null, [L("spaceName"), L("location"), L("church"), L("capacity"), L("fixedEquipment"), L("responsible"), L("status"), L("actions")], venues.map((item) => [item.nome_do_espaco, item.localizacao, churchName(item.church_id), item.capacidade, item.equipamentos_fixos, item.responsavel, badge(item.estado), venueRecordActions("venueSpace", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("checklist") ? `<div class="col-12">${venueModulePanel("venueChecklist", L("serviceChecklist"), canManageVenue() ? "venueChecklist" : null, [L("serviceDate"), L("church"), L("space"), L("serviceEventType"), L("soundChecked"), L("lightsChecked"), L("acChecked"), L("projectorChecked"), L("cleaningDone"), L("status"), L("actions")], checklists.map((item) => [item.data_do_culto, churchName(item.church_id), item.espaco, item.tipo_de_culto_ou_evento, yesNo(item.som_verificado), yesNo(item.luzes_verificadas), yesNo(item.ac_verificado), yesNo(item.projector_verificado), yesNo(item.limpeza_feita), badge(item.estado), venueRecordActions("venueChecklist", item.id)]), { allowAdd: canManageVenue() })}</div>` : ""}
      ${show("reports") ? `<div class="col-xl-6">${chartCard(L("inventoryByCategory"), groupCount(inventory, "categoria"))}</div>
      <div class="col-xl-6">${chartCard(L("inventoryByStatus"), groupCount(inventory, "estado"))}</div>
      <div class="col-xl-6">${chartCard(L("movementsByPeriod"), groupCount(movements, "data_de_saida"))}</div>
      <div class="col-xl-6">${chartCard(L("checklistByWeek"), groupCount(checklists, "data_do_culto"))}</div>
      <div class="col-xl-6">${chartCard(L("newAcquisitionsByMonth"), acquisitions.map((item) => [item.data_de_compra_ou_entrada?.slice(0, 7) || "-", Number(item.valor_total || 0)]))}</div>
      <div class="col-12">${venueModulePanel("venueReport", L("venueReports"), null, [L("name"), L("category"), L("status"), L("actions")], reports.map((item) => [venueReportName(item), item.category, badge(item.status), actionButtons([["view", "venueReport", item.id, L("view")], ["export", "venueReport", item.id, L("exportExcel")], ["export", "venueReport", item.id, L("exportPdf")]])]), { showFilters: false, allowAdd: false })}</div>
      <div class="col-xl-6">${modulePanel("damagedInventory", L("damagedItemsReport"), null, [L("itemName"), L("category"), L("location"), L("status")], damagedItems.map((item) => [item.nome_do_item, item.categoria, item.localizacao, badge(item.estado)]), false)}</div>
      <div class="col-xl-6">${modulePanel("repairHistoryPanel", L("repairHistory"), null, [L("item"), L("repairCost"), L("sentDate"), L("returnedDate"), L("status")], maintenance.map((item) => [item.item, money(item.custo_da_reparacao), item.data_de_envio, item.data_de_retorno, badge(item.estado)]), false)}</div>
      <div class="col-12">${modulePanel("staffEquipmentReportPanel", L("staffEquipmentReport"), null, [L("staffName"), L("department"), L("device"), L("model"), L("currentCondition"), L("status")], staffEquipment.map((item) => [item.nome_do_funcionario, item.departamento, item.dispositivo, item.modelo, item.estado_actual, badge(item.estado)]), false)}</div>` : ""}
    </div>`;
  setPageContent(navHtml + tabParallaxWrap(bodyHtml, activeRoute));
  triggerTabParallax();
}

function renderMinistryMaterials() {
  const catalogue = scopedNested(state.ministryMaterials.catalogue);
  const sales = scopedNested(state.ministryMaterials.sales);
  const distributions = scopedNested(state.ministryMaterials.distributions);
  const stocks = scopedNested(state.ministryMaterials.weeklyStock);
  const funds = scopedNested(state.ministryMaterials.freeFunds);
  const reports = scopedNested(state.ministryMaterials.reports);
  const monthSales = sales.filter((item) => item.data?.startsWith("2026-07"));
  setPageContent( `
    ${moduleNavShell("ministryMaterials", { title: L("ministryMaterials"), subtitle: L("materialsSubtitle"), modalType: "materialSale", icon: "bi-journal-richtext" },
      moduleScrollTabs([
        [L("cellOverview"), "content"],
        [L("catalogue"), "panel-materialCatalogue"],
        [L("sales"), "panel-materialSale"],
        [L("churchDistribution"), "panel-materialDistribution"],
        [L("weeklyStock"), "panel-materialStock"],
        [L("freeDistributionFunds"), "panel-materialFund"],
        [L("ministryReports"), "panel-materialReport"]
      ])
    )}
    <div class="row g-3 mb-4">
      ${metric("bi-cash-stack", L("soldThisMonth"), money(monthSales.reduce((sum, item) => sum + Number(item.valor || 0), 0)), L("thisMonth"))}
      ${metric("bi-bag-check", L("quantitySold"), sales.reduce((sum, item) => sum + Number(item.quantidade || 0), 0), "22 Jun - 05 Jul 2026")}
      ${metric("bi-box-seam", L("materialsInStock"), catalogue.reduce((sum, item) => sum + Number(item.stock_actual || 0), 0), L("catalogue"))}
      ${metric("bi-exclamation-triangle", L("lowStockMaterials"), catalogue.filter((item) => Number(item.stock_actual || 0) <= Number(item.stock_minimo || 0)).length, L("needsAction"))}
      ${metric("bi-truck", L("pendingDistributions"), distributions.filter((item) => ["Solicitado", "Aprovado"].includes(item.estado)).length, L("churchDistribution"))}
      ${metric("bi-heart", L("fundsRaised"), money(funds.reduce((sum, item) => sum + Number(item.valor_levantado || 0), 0)), L("freeDistributionFunds"))}
    </div>
    <div class="row g-4">
      <div class="col-12">${modulePanel("materialCatalogue", L("catalogue"), "materialCatalogue", [L("materialTitle"), L("materialType"), L("format"), L("price"), L("currentStock"), L("minimumStock"), L("status"), L("actions")], catalogue.map((item) => [item.titulo_do_material, item.tipo, item.formato, money(item.preco), item.stock_actual, item.stock_minimo, badge(item.estado), backendActions("materialCatalogue", item.id)]), true, true)}</div>
      <div class="col-12">${modulePanel("materialSale", L("sales"), "materialSale", [L("date"), L("reportWeek"), L("buyer"), L("materialTitle"), L("quantitySold"), L("amount"), L("method"), L("status"), L("actions")], sales.map((item) => [item.data, item.semana_do_relatorio, item.comprador, materialName(item.titulo_do_material), item.quantidade, money(item.valor), item.metodo_de_pagamento, badge(item.estado), backendActions("materialSale", item.id, [["verify", "materialSale", item.id, L("confirm")], ["reject", "materialSale", item.id, L("reject")]])]), true, true)}</div>
      <div class="col-12">${modulePanel("materialDistribution", L("churchDistribution"), "materialDistribution", [L("date"), L("destinationChurch"), L("materialTitle"), L("quantitySold"), L("distributionType"), L("sentBy"), L("status"), L("actions")], distributions.map((item) => [item.data, churchName(item.igreja_destinataria), materialName(item.titulo_do_material), item.quantidade, item.tipo_de_distribuicao, item.responsavel_pelo_envio, badge(item.estado), backendActions("materialDistribution", item.id)]), true, true)}</div>
      <div class="col-xl-7">${modulePanel("materialStock", L("weeklyStock"), "materialStock", [L("weekStart"), L("weekEnd"), L("materialTitle"), L("openingStock"), L("entries"), L("exits"), L("finalStock"), L("difference"), L("actions")], stocks.map((item) => [item.semana_inicio, item.semana_fim, materialName(item.titulo_do_material), item.stock_inicial, item.entradas, item.saidas, item.stock_final, item.diferenca, backendActions("materialStock", item.id)]), false, true)}</div>
      <div class="col-xl-5">${modulePanel("materialFund", L("freeDistributionFunds"), "materialFund", [L("campaign"), L("targetAmount"), L("raisedAmount"), L("status"), L("actions")], funds.map((item) => [item.campanha, money(item.valor_alvo), money(item.valor_levantado), badge(item.estado), backendActions("materialFund", item.id)]), false)}</div>
      <div class="col-12">${modulePanel("materialReport", L("ministryReports"), null, [L("name"), L("category"), L("quantitySold"), L("amount"), L("status"), L("actions")], reports.map((item) => [item.name, item.category, item.quantity, money(item.amount), badge(item.status), backendActions("materialReport", item.id)]), false)}</div>
    </div>
  `);
}

function modulePanel(type, title, modalType, headers, rows, showFilters = false, materialFilters = false) {
  return `
    <article id="panel-${type}" class="panel glass-panel h-100">
      <div class="panel-head">
        <h3 class="panel-title">${title}</h3>
        <div class="action-cluster">
          ${modalType ? `<button class="btn btn-sm btn-ce-gold" data-open-form="${modalType}"><i class="bi bi-plus-lg me-1"></i>${L("add")}</button>` : ""}
          <button type="button" class="btn btn-sm btn-outline-cyan action-secondary" data-action="export" data-type="${type}" data-id="${type}"><i class="bi bi-download me-1"></i>${L("export")}</button>
        </div>
      </div>
      ${showFilters ? advancedFilterBar(materialFilters) : ""}
      ${dataTable(headers, rows)}
    </article>
  `;
}

function advancedFilterBar(materialFilters = false) {
  const materialFields = materialFilters
    ? `<select class="form-select"><option value="">${L("filterMaterial")}</option>${state.ministryMaterials.catalogue.map((item) => `<option>${item.titulo_do_material}</option>`).join("")}</select><select class="form-select"><option value="">${L("filterPaymentMethod")}</option>${paymentMethods.map((item) => `<option>${item}</option>`).join("")}</select>`
    : "";
  return filterBar({
    month: false,
    extraFields: `<input class="form-control" type="week" aria-label="${L("filterWeek")}">${materialFields}`,
    className: "advanced-filter mb-3"
  });
}

function prisonClassCount(student) {
  return [1, 2, 3, 4, 5, 6, 7].filter((number) => student[`aula_${number}_presenca`]).length;
}

function prisonProgress(student) {
  const completed = prisonClassCount(student) + (Number(student.nota_exame) >= 70 ? 1 : 0) + (student.pratica_evangelismo ? 1 : 0) + (student.graduado ? 1 : 0);
  const value = Math.round((completed / 10) * 100);
  return `<div class="progress mb-1"><div class="progress-bar" style="width:${value}%"></div></div><small class="text-secondary">${value}%</small>`;
}

function alecPhaseAverage(record, phase) {
  const keys = phase === 1 ? ["fase_1_aula_1", "fase_1_aula_2", "fase_1_aula_3", "fase_1_aula_4"] : ["fase_2_aula_1", "fase_2_aula_2", "fase_2_aula_3"];
  const values = keys.map((key) => Number(record[key] || 0)).filter((value) => value > 0);
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function alecFinalAverage(record) {
  const values = [alecPhaseAverage(record, 1), alecPhaseAverage(record, 2)].filter((value) => value > 0);
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function alecProgress(record) {
  const classKeys = ["fase_1_aula_1", "fase_1_aula_2", "fase_1_aula_3", "fase_1_aula_4", "fase_2_aula_1", "fase_2_aula_2", "fase_2_aula_3"];
  const completed = classKeys.filter((key) => Number(record[key] || 0) > 0).length + (record.terminou ? 1 : 0) + (record.certificado_emitido ? 1 : 0);
  const value = Math.round((completed / 9) * 100);
  const labels = ["F1 A1", "F1 A2", "F1 A3", "F1 A4", "F2 A1", "F2 A2", "F2 A3", L("finished"), L("certificates")];
  const done = [...classKeys.map((key) => Number(record[key] || 0) > 0), record.terminou, record.certificado_emitido];
  return `<div class="progress mb-1"><div class="progress-bar" style="width:${value}%"></div></div><div class="step-row">${labels.map((label, index) => `<span class="${done[index] ? "done" : ""}">${label}</span>`).join("")}</div>`;
}

function renderFevo(activeTab = "overview") {
  const configs = scopedNested(state.fevo.weeklyConfigurations);
  const reports = scopedNested(state.fevo.reports);
  const noReports = scopedNested(state.fevo.noReports);
  const weeklyReports = scopedNested(state.fevo.weeklyReports);
  const show = (...tabs) => activeTab === "overview" || activeTab === "analysis" || tabs.includes(activeTab);
  const groups = new Set(reports.map((item) => item.group_name));
  const totals = {
    cells: reports.reduce((sum, item) => sum + Number(item.number_of_cells || 0), 0),
    members: reports.reduce((sum, item) => sum + Number(item.number_of_members || 0), 0),
    leadersPresent: reports.reduce((sum, item) => sum + Number(item.leaders_present || 0), 0),
    membersPresent: reports.reduce((sum, item) => sum + Number(item.members_present || 0), 0),
    soulsContacted: reports.reduce((sum, item) => sum + Number(item.souls_contacted || 0), 0),
    soulsEvangelized: reports.reduce((sum, item) => sum + Number(item.souls_evangelized || 0), 0),
    soulsVisited: reports.reduce((sum, item) => sum + Number(item.souls_visited || 0), 0),
    newConverts: reports.reduce((sum, item) => sum + Number(item.new_converts || 0), 0),
    prayerDays: reports.reduce((sum, item) => sum + Number(item.days_of_prayer || 0), 0),
    firstTimers: reports.reduce((sum, item) => sum + Number(item.ft_in_church || 0), 0)
  };
  const navHtml = moduleNavShell("fevo", { title: L("fevo"), subtitle: L("fevoSubtitle"), modalType: "fevoReport", icon: "bi-compass" },
    moduleTabsNav([
      ["cellOverview", "fevo", "overview"],
      ["weeklyConfiguration", "fevoConfigRoute", "config"],
      ["followUp", "fevoFollowUpRoute", "followup"],
      ["evangelism", "fevoEvangelismRoute", "evangelism"],
      ["visitation", "fevoVisitationRoute", "visitation"],
      ["prayer", "fevoPrayerRoute", "prayer"],
      ["groupsWithoutReport", "fevoNoReportsRoute", "noReports"],
      ["weeklyReports", "fevoWeeklyReportsRoute", "weeklyReports"],
      ["analysis", "fevoAnalysisRoute", "analysis"]
    ].map(([key, route, tab]) =>
      moduleTabButton(L(key), { active: activeTab === tab, attrs: `data-route="${route}"` })
    ).join(""), "department-tabs fevo-module-tabs")
  );
  const overviewSection = show("analysis") ? moduleSection(L("fevoOverviewSection"), L("fevoOverviewHint"), "bi-compass", "fevo", `
    <div class="row g-3 summary-cards-row">
      ${sm("bi-collection", L("totalGroups"), groups.size, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-diagram-3", L("totalCells"), totals.cells, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-people", L("totalMembers"), totals.members, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-person-badge", L("leadersPresent"), totals.leadersPresent, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-person-check", L("membersPresent"), totals.membersPresent, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-telephone-outbound", L("soulsContacted"), totals.soulsContacted, "fevo", { route: "fevoFollowUpRoute", filterPayload: { souls_contacted: true } })}
      ${sm("bi-megaphone", L("soulsEvangelized"), totals.soulsEvangelized, "fevo", { route: "fevoEvangelismRoute" })}
      ${sm("bi-house-heart", L("soulsVisited"), totals.soulsVisited, "fevo", { route: "fevoVisitationRoute" })}
      ${sm("bi-stars", L("newConverts"), totals.newConverts, "fevo", { route: "fevoEvangelismRoute" })}
      ${sm("bi-calendar-heart", L("daysOfPrayer"), totals.prayerDays, "fevo", { route: "fevoPrayerRoute" })}
      ${sm("bi-person-heart", L("ftInChurch"), totals.firstTimers, "fevo", { route: "fevoWeeklyReportsRoute" })}
      ${sm("bi-exclamation-triangle", L("groupsWithoutReport"), noReports.length, "fevo", { route: "fevoNoReportsRoute", filterPayload: { status: "Pendente" } })}
    </div>
    ${summaryFilterChips("fevo")}`) : "";
  const analyticsSection = show("analysis") ? moduleSection(L("fevoAnalyticsSection"), L("fevoAnalyticsHint"), "bi-bar-chart-line", "", `
    <div class="row g-4">
      <div class="col-xl-4">${chartCard(L("activitiesByWeek"), groupCount(reports, "activity_type"))}</div>
      <div class="col-xl-4">${chartCard(L("contactedByGroup"), groupSum(reports, "group_name", "souls_contacted"))}</div>
      <div class="col-xl-4">${chartCard(L("evangelizedByGroup"), groupSum(reports, "group_name", "souls_evangelized"))}</div>
      <div class="col-xl-4">${chartCard(L("visitedByGroup"), groupSum(reports, "group_name", "souls_visited"))}</div>
      <div class="col-xl-4">${chartCard(L("prayerDaysByTeam"), groupSum(reports, "team", "days_of_prayer"))}</div>
      <div class="col-xl-4">${chartCard(L("noReportByWeek"), groupCount(noReports, "semana_inicio"))}</div>
    </div>`) : "";
  const dataPanels = `
    <div class="row g-4">
      ${show("config") ? `<div class="col-12">${modulePanel("fevoConfig", L("weeklyConfiguration"), "fevoConfig", [L("weekStart"), L("weekEnd"), L("teamAActivity"), L("teamBActivity"), L("teamCActivity"), L("teamDActivity"), L("preparedBy"), L("status"), L("actions")], configs.map((item) => [item.semana_inicio, item.semana_fim, item.team_a_activity, item.team_b_activity, item.team_c_activity, item.team_d_activity, item.preparado_por, badge(item.estado), backendActions("fevoConfig", item.id)]), true)}</div>` : ""}
      ${show("followup") ? `<div class="col-12">${fevoActivityPanel("fevoFollowUp", L("followUp"), reports.filter((item) => item.activity_type === "Follow-Up"))}</div>` : ""}
      ${show("evangelism") ? `<div class="col-12">${fevoActivityPanel("fevoEvangelism", L("evangelism"), reports.filter((item) => item.activity_type === "Evangelização"))}</div>` : ""}
      ${show("visitation") ? `<div class="col-12">${fevoActivityPanel("fevoVisitation", L("visitation"), reports.filter((item) => item.activity_type === "Visitação"))}</div>` : ""}
      ${show("prayer") ? `<div class="col-12">${fevoActivityPanel("fevoPrayer", L("prayer"), reports.filter((item) => item.activity_type === "Oração"))}</div>` : ""}
      ${show("weeklyReports") ? `<div class="col-12">${modulePanel("fevoReport", L("weeklyReports"), "fevoReport", [L("weekStart"), L("team"), L("activityType"), L("groupName"), L("leaderName"), L("leadersPresent"), L("membersPresent"), L("ftInChurch"), L("status"), L("actions")], reports.map((item) => [item.semana_inicio, item.team, item.activity_type, item.group_name, item.leader_name, item.leaders_present, item.members_present, item.ft_in_church, badge(item.status), actionButtons([["view", "fevoReport", item.id, L("view")], ["edit", "fevoReport", item.id, L("edit")], ["submit", "fevoReport", item.id, L("submit")], ["approve", "fevoReport", item.id, L("approve")], ["reject", "fevoReport", item.id, L("reject")], ["export", "fevoReport", item.id, L("export")]])]), true)}</div>` : ""}
      ${show("noReports") ? `<div class="col-12">${modulePanel("fevoNoReport", L("groupsWithoutReport"), "fevoNoReport", [L("weekStart"), L("team"), L("activityType"), L("groupName"), L("leaderName"), L("reasonNotSubmitted"), L("contacted"), L("status"), L("actions")], noReports.map((item) => [item.semana_inicio, item.team, item.activity_type, item.group_name, item.leader_name, item.reason_not_submitted, yesNo(item.contacted), badge(item.status), backendActions("fevoNoReport", item.id)]), true)}</div><div class="col-12">${summaryTiles(L("groupsWithoutReport"), [[L("groupsNoReportThisWeek"), noReports.length], [L("recurringGroups"), noReports.filter((item) => statusKey(item.status) === "recurrent").length], [L("contacted"), noReports.filter((item) => item.contacted).length], [L("resolved"), noReports.filter((item) => statusKey(item.status) === "resolved").length]])}</div>` : ""}
      ${show("weeklyReports") ? `<div class="col-12">${renderFevoWeeklyReport(weeklyReports[0], reports, noReports)}</div>` : ""}
    </div>`;
  const bodyHtml = activeTab === "overview" || activeTab === "analysis"
    ? `${overviewSection}${analyticsSection}`
    : moduleSection(L("fevoDataSection"), L("fevoDataHint"), "bi-journal-text", "", dataPanels);
  setPageContent(navHtml + tabParallaxWrap(bodyHtml, activeRoute));
  triggerTabParallax();
}

function renderFevoWeeklyReport(report, reports, noReports) {
  const teams = fevoTeams.map((team) => [team, reports.filter((item) => item.team === team)]);
  return `
    <article id="panel-fevoWeekly" class="panel h-100">
      <div class="panel-head">
        <div>
          <span class="eyebrow">${L("weeklyReports")}</span>
          <h3 class="panel-title">${report?.title || "RELATÓRIO F.E.V.O"}</h3>
          <p class="text-secondary mb-0">${report?.semana_inicio || "-"} - ${report?.semana_fim || "-"}</p>
        </div>
        <div class="action-cluster">
          <button class="btn btn-sm btn-ce-gold" data-action="export" data-type="fevoWeeklyReport" data-id="${report?.id || "fevo"}">${L("exportPdf")}</button>
          <button class="btn btn-sm btn-outline-cyan action-secondary" data-action="export" data-type="fevoWeeklyReport" data-id="${report?.id || "fevo"}">${L("exportExcel")}</button>
        </div>
      </div>
      <div class="row g-3">
        ${teams.map(([team, rows]) => `<div class="col-xl-6"><div class="record-card"><span class="eyebrow">${team}</span><h3>${rows[0]?.activity_type || "-"}</h3><div class="detail-list"><div><span>${L("totalGroups")}</span><strong>${rows.length}</strong></div><div><span>${L("membersPresent")}</span><strong>${rows.reduce((sum, item) => sum + Number(item.members_present || 0), 0)}</strong></div><div><span>${L("newConverts")}</span><strong>${rows.reduce((sum, item) => sum + Number(item.new_converts || 0), 0)}</strong></div><div><span>${L("ftInChurch")}</span><strong>${rows.reduce((sum, item) => sum + Number(item.ft_in_church || 0), 0)}</strong></div></div></div></div>`).join("")}
      </div>
      <div class="mt-4">${dataTable([L("groupsWithoutReport"), L("team"), L("activityType"), L("leaderName"), L("status")], noReports.map((item) => [item.group_name, item.team, item.activity_type, item.leader_name, badge(item.status)]))}</div>
    </article>
  `;
}

function fevoActivityPanel(id, title, rows) {
  const activity = rows[0]?.activity_type || title;
  const activityMetric = activity === "Follow-Up" ? ["soulsContacted", "souls_contacted"] :
    activity === "Evangelização" ? ["soulsEvangelized", "souls_evangelized"] :
    activity === "Visitação" ? ["soulsVisited", "souls_visited"] :
    ["daysOfPrayer", "days_of_prayer"];
  return `
    <article id="panel-${id}" class="panel h-100">
      <div class="panel-head">
        <div>
          <span class="eyebrow">${L("fevo")}</span>
          <h3 class="panel-title">${title}</h3>
          <p class="text-secondary mb-0">${L("team")} / ${L("groupName")} / ${L("leaderName")}</p>
        </div>
        <button class="btn btn-sm btn-ce-gold" data-open-form="fevoReport"><i class="bi bi-plus-lg me-1"></i>${L("add")}</button>
      </div>
      <div class="row g-3 mb-3">
        ${metric("bi-collection", L("totalGroups"), rows.length, title)}
        ${metric("bi-people", L("membersPresent"), rows.reduce((sum, item) => sum + Number(item.members_present || 0), 0), L("members"))}
        ${metric("bi-person-heart", L("ftInChurch"), rows.reduce((sum, item) => sum + Number(item.ft_in_church || 0), 0), L("firstTimers"))}
        ${metric("bi-stars", L(activityMetric[0]), rows.reduce((sum, item) => sum + Number(item[activityMetric[1]] || 0), 0), title)}
      </div>
      ${dataTable([L("weekStart"), L("team"), L("groupName"), L("leaderName"), L("leadersPresent"), L("membersPresent"), L(activityMetric[0]), L("status"), L("actions")], rows.map((item) => [
        item.semana_inicio,
        item.team,
        item.group_name,
        item.leader_name,
        item.leaders_present,
        item.members_present,
        item[activityMetric[1]] || 0,
        badge(item.status),
        actionButtons([["view", "fevoReport", item.id, L("view")], ["edit", "fevoReport", item.id, L("edit")], ["submit", "fevoReport", item.id, L("submit")], ["approve", "fevoReport", item.id, L("approve")], ["reject", "fevoReport", item.id, L("reject")], ["export", "fevoReport", item.id, L("export")]])
      ]))}
    </article>
  `;
}

function renderReports() {
  const finance = scoped(state.finance);
  setPageContent(`
    ${sectionHeader(L("reports"), L("reportsSubtitle"), null, "bi-bar-chart-line", { actions: `<button type="button" class="btn btn-outline-cyan btn-touch action-secondary"><i class="bi bi-file-earmark-pdf me-1"></i>${L("exportPdf")}</button><button type="button" class="btn btn-outline-cyan btn-touch action-secondary"><i class="bi bi-file-earmark-excel me-1"></i>${L("exportExcel")}</button>` })}
    ${filterBar({ church: true, month: true, status: false })}
    <div class="row g-4">
      <div class="col-xl-6">${chartCard(L("givingByCategory"), groupSum(finance, "categoria_da_contribuicao", "valor"))}</div>
      <div class="col-xl-6">${chartCard(L("firstTimersByMonth"), groupCount(scoped(state.firstTimers), "data_do_culto", true))}</div>
      <div class="col-xl-6">${chartCard(L("cellGrowth"), scoped(state.cells).map((c) => [c.nome_da_celula, c.presencas[0]?.total || 0]))}</div>
      <div class="col-xl-6">${summaryTiles(L("sacramentsSummary"), [[L("baptismTab"), state.sacraments.baptisms.length], [L("marriageTab"), state.sacraments.marriages.length], [L("babyTab"), state.sacraments.babies.length]])}</div>
    </div>`);
}

function requisitionsModuleTabs() {
  const tabs = [
    ["overview", L("reqTabOverview")],
    ["new", L("reqTabNew")],
    ["received", L("reqTabReceived")],
    ["review", L("reqTabReview")],
    ["pastoral", L("reqTabPastoral")],
    ["approved", L("reqTabApproved")],
    ["rejected", L("reqTabRejected")],
    ["released", L("reqTabReleased")],
    ["reports", L("reqTabReports")],
    ["history", L("reqTabHistory")]
  ];
  return moduleTabsNav(tabs.map(([key, label]) =>
    moduleTabButton(label, { active: requisitionsPageState.tab === key, attrs: `data-requisition-tab="${key}"` })
  ).join(""), "requisitions-module-tabs");
}

function requisitionActionLabel(action) {
  const map = {
    submit: L("reqSubmit"), review: L("reqReview"), forwardPastor: L("reqForwardPastor"),
    approve: L("reqApprove"), reject: L("reqReject"), returnForCorrection: L("reqReturnForCorrection"),
    releaseResources: L("reqReleaseResources"),
    markPurchased: L("reqMarkPurchased"), registerInventory: L("reqRegisterInventory"),
    sendToInventory: L("reqSendToInventory"), close: L("reqClose"),
    edit: L("edit"), view: L("view")
  };
  return map[action] || action;
}

function requisitionActionButtonClass(action) {
  if (action === "approve") return "action-btn action-btn--approve";
  if (action === "reject") return "action-btn action-btn--reject";
  if (action === "returnForCorrection") return "action-btn action-btn--return";
  return "action-btn";
}

function requisitionActionButtons(record) {
  const lib = window.CERequisitions;
  if (!lib) return "";
  const actions = (lib.tableActions ? lib.tableActions(activeUser, record) : lib.availableActions(activeUser, record))
    .filter((a) => a !== "view");
  const buttons = [["view", "requisition", record.id, L("view")], ...actions.map((a) => [a, "requisition", record.id, requisitionActionLabel(a)])];
  return `<div class="action-cluster">${buttons.map(([action, type, id, label]) =>
    `<button type="button" class="${requisitionActionButtonClass(action)}" data-action="${action}" data-type="${type}" data-id="${id}">${label}</button>`
  ).join("")}</div>`;
}

function requisitionStatusBadge(status) {
  return badge(status);
}

function requisitionDetailRow(label, value) {
  return `<div><span>${label}</span><strong>${value ?? "-"}</strong></div>`;
}

function requisitionAttachmentsHtml(record) {
  const attachments = Array.isArray(record.attachments) ? record.attachments : [];
  if (!attachments.length) return `<p class="text-secondary mb-0">${L("reqNoAttachments")}</p>`;
  const typeLabel = { budget: L("reqBudget"), proforma: L("reqProforma"), document: L("staffTabDocuments") };
  return `<ul class="requisition-attachment-list">${attachments.map((file) => {
    const label = typeLabel[file.type] || L("documents");
    return `<li><i class="bi bi-paperclip me-2"></i><span class="text-secondary">${label}:</span> <strong>${file.name || file}</strong></li>`;
  }).join("")}</ul>`;
}

function requisitionTimelineLabel(event, record) {
  const num = record.request_number || "";
  const date = event.at ? formatDateTime(event.at).split(",")[0] : "";
  const map = {
    created: `${num} ${L("reqTimelineCreated")} ${event.by}`,
    submitted: `${L("reqTimelineSubmitted")} ${date}`,
    reviewed: `${L("reqTimelineReviewed")} ${event.by}`,
    sentToPastor: L("reqTimelineSentPastor"),
    sentToFinance: L("finSentToFinance"),
    approved: `${L("reqTimelineApproved")} ${event.by}`,
    rejected: `${L("reqTimelineRejected")} ${event.by}`,
    returned: `${L("reqTimelineReturned")} ${event.by}`,
    resourcesReleased: `${L("reqTimelineResourcesReleased")} ${event.by}`,
    closed: `${L("reqTimelineClosed")} ${event.by}`,
    purchased: `${event.by}`,
    registered: `${event.by}`
  };
  return map[event.action] || `${event.by}${event.notes ? ` — ${event.notes}` : ""}`;
}

function requisitionTimelineHtml(record) {
  const lib = window.CERequisitions;
  const events = lib?.buildTimeline ? lib.buildTimeline(record) : [];
  if (!events.length) return `<p class="text-secondary mb-0">${L("empty")}</p>`;
  return `<ol class="requisition-timeline">${events.map((event, index) =>
    `<li><span class="requisition-timeline-step">${index + 1}</span><div><strong>${requisitionTimelineLabel(event, record)}</strong>${event.notes && !["rejected", "returned", "approved"].includes(event.action) ? `<p class="mb-0 text-secondary small">${event.notes}</p>` : ""}${event.notes && ["rejected", "returned", "approved"].includes(event.action) ? `<p class="mb-0 text-secondary small">${event.notes}</p>` : ""}</div></li>`
  ).join("")}</ol>`;
}

function requisitionFinanceSectionHtml(record) {
  const lib = window.CERequisitions;
  const approvedStatuses = [lib?.STATUSES?.APPROVED_AWAITING_RELEASE, lib?.STATUSES?.APPROVED, lib?.STATUSES?.RESOURCES_RELEASED, lib?.STATUSES?.PURCHASED, "Aprovado", "Aprovado — Aguardando Liberação de Recursos", "Recursos Liberados"];
  if (!approvedStatuses.includes(record.status) && !record.finance_status && !record.sent_to_finance) return "";
  const finStatus = record.finance_status || "Aguardando Liberação";
  const pendingBadge = finStatus === "Aguardando Liberação"
    ? `<span class="status-pill status-warn ms-2"><i class="bi bi-circle-fill"></i>${L("finPendingInFinance")}</span>`
    : finStatus === "Recursos Liberados" || finStatus === "Pago"
      ? `<span class="status-pill status-good ms-2"><i class="bi bi-circle-fill"></i>${L("finResourcesReleased")}</span>`
      : financeApprovedReqBadge(finStatus);
  return `
    <section class="requisition-detail-section requisition-finance-section">
      <h4 class="requisition-detail-title">${L("finance")} — ${L("finResourceDisbursement")}</h4>
      <div class="church-detail-grid">
        ${requisitionDetailRow(L("finSentToFinance"), record.sent_to_finance ? L("yes") : L("no"))}
        ${requisitionDetailRow(L("finFinanceStatus"), pendingBadge)}
        ${requisitionDetailRow(L("finApprovedAmount"), money(record.approved_amount || record.estimated_amount))}
        ${requisitionDetailRow(L("finReleasedAmount"), money(record.released_amount || record.amount_released || 0))}
        ${requisitionDetailRow(L("finApprovedBy"), record.approved_by || "-")}
        ${requisitionDetailRow(L("finApprovedAt"), formatDateTime(record.approved_at))}
        ${requisitionDetailRow(L("reqReleaseResources"), record.released_by || record.resources_released_by || "-")}
        ${requisitionDetailRow(L("finReleaseDate"), formatDateTime(record.released_at || record.resources_released_at))}
        ${requisitionDetailRow(L("method"), record.payment_method || "-")}
        ${requisitionDetailRow(L("finPaymentReference"), record.payment_reference || "-")}
      </div>
    </section>`;
}

function requisitionPastoralDecisionHtml(record, preset = "") {
  const lib = window.CERequisitions;
  if (!lib?.canPastoralDecide(activeUser) || record.status !== lib.STATUSES.SENT_TO_PASTOR) return "";
  const priorities = lib.FINAL_PRIORITIES || ["Normal", "Alta", "Urgente"];
  return `
    <section class="requisition-detail-section requisition-pastoral-section">
      <h4 class="requisition-detail-title">${L("reqSectionPastoralDecision")}</h4>
      <form id="requisitionPastoralForm" class="row g-3">
        <input type="hidden" name="requisition_id" value="${record.id}">
        <div class="col-12">
          <label class="form-label">${L("reqSectionPastoralDecision")}</label>
          <select name="pastoral_decision" class="form-select" required>
            <option value="">—</option>
            <option value="approve" ${preset === "approve" ? "selected" : ""}>${L("reqApprove")}</option>
            <option value="reject" ${preset === "reject" ? "selected" : ""}>${L("reqReject")}</option>
            <option value="returnForCorrection" ${preset === "returnForCorrection" ? "selected" : ""}>${L("reqReturnForCorrection")}</option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label">${L("reqPastoralComment")}</label>
          <textarea name="pastoral_comment" class="form-control" rows="3"></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">${L("reqApprovedAmount")} <span class="field-optional">(${L("optional")})</span></label>
          <input type="number" name="approved_amount" class="form-control" value="${record.estimated_amount || ""}" min="0" step="1">
        </div>
        <div class="col-md-6">
          <label class="form-label">${L("reqFinalPriority")}</label>
          <select name="final_priority" class="form-select">
            ${priorities.map((p) => `<option value="${p}" ${(record.urgency || "Normal") === p ? "selected" : ""}>${p}</option>`).join("")}
          </select>
        </div>
      </form>
    </section>`;
}

function requisitionDetailHtml(record, presetDecision = "") {
  const lib = window.CERequisitions;
  const showPastoral = lib?.canPastoralDecide(activeUser) && record.status === lib?.STATUSES.SENT_TO_PASTOR;
  return `
    <section class="requisition-detail-section">
      <h4 class="requisition-detail-title">${L("reqSectionData")}</h4>
      <div class="church-detail-grid">
        ${requisitionDetailRow(L("reqNumber"), record.request_number)}
        ${requisitionDetailRow(L("reqTitle"), record.title)}
        ${requisitionDetailRow(L("reqDepartment"), record.department_name)}
        ${requisitionDetailRow(L("church"), record.church_name)}
        ${requisitionDetailRow(L("reqRequester"), record.requested_by_name)}
        ${requisitionDetailRow(L("reqType"), record.requisition_type)}
        ${requisitionDetailRow(L("reqUrgency"), record.urgency)}
        ${requisitionDetailRow(L("reqNeededBy"), record.needed_by_date || "-")}
        ${requisitionDetailRow(L("reqEstimated"), money(record.estimated_amount))}
        ${requisitionDetailRow(L("reqCurrentStatus"), requisitionStatusBadge(record.status))}
      </div>
    </section>
    <section class="requisition-detail-section">
      <h4 class="requisition-detail-title">${L("reqSectionDescription")}</h4>
      <div class="church-detail-grid">
        ${requisitionDetailRow(L("reqDescription"), record.description || "-")}
        ${requisitionDetailRow(L("reqJustification"), record.justification || "-")}
        ${requisitionDetailRow(L("reqObservations"), record.review_notes || record.approval_notes || "-")}
      </div>
    </section>
    <section class="requisition-detail-section">
      <h4 class="requisition-detail-title">${L("reqSectionInternalReview")}</h4>
      <div class="church-detail-grid">
        ${requisitionDetailRow(L("reqReviewedBy"), record.reviewed_by || "-")}
        ${requisitionDetailRow(L("reqReviewDate"), formatDateTime(record.reviewed_at))}
        ${requisitionDetailRow(L("reqReviewNotes"), record.review_notes || "-")}
        ${requisitionDetailRow(L("reqSentToPastorBy"), record.sent_to_main_pastor_by || "-")}
        ${requisitionDetailRow(L("reqSentToPastorAt"), formatDateTime(record.sent_to_main_pastor_at))}
      </div>
    </section>
    <section class="requisition-detail-section">
      <h4 class="requisition-detail-title">${L("reqSectionAttachments")}</h4>
      ${requisitionAttachmentsHtml(record)}
    </section>
    ${requisitionFinanceSectionHtml(record)}
    ${requisitionPastoralDecisionHtml(record, presetDecision)}
    <section class="requisition-detail-section">
      <h4 class="requisition-detail-title">${L("reqHistory")}</h4>
      ${requisitionTimelineHtml(record)}
    </section>
    ${showPastoral ? "" : ""}`;
}

function openRequisitionDrawer(id, presetDecision = "") {
  const record = (state.requisitions || []).find((r) => r.id === id);
  if (!record) return;
  requisitionDrawerRecordId = id;
  requisitionDrawerPresetDecision = presetDecision;
  const drawer = byId("requisitionDrawer");
  const backdrop = byId("requisitionDrawerBackdrop");
  const body = byId("requisitionDrawerBody");
  const foot = byId("requisitionDrawerFoot");
  if (!drawer || !backdrop || !body || !foot) return;

  byId("requisitionDrawerEyebrow").textContent = L("reqDetails");
  byId("requisitionDrawerTitle").textContent = record.request_number || L("requisitions");
  body.innerHTML = requisitionDetailHtml(record, presetDecision);

  const lib = window.CERequisitions;
  const showPastoral = lib?.canPastoralDecide(activeUser) && record.status === lib?.STATUSES.SENT_TO_PASTOR;
  if (showPastoral) {
    foot.innerHTML = `
      <button type="button" class="btn btn-outline-glass" data-requisition-drawer-close>${L("cancel")}</button>
      <button type="button" class="btn btn-outline-warning req-btn-return" data-req-pastoral-action="returnForCorrection">${L("reqReturnForCorrection")}</button>
      <button type="button" class="btn btn-outline-danger req-btn-reject" data-req-pastoral-action="reject">${L("reqReject")}</button>
      <button type="button" class="btn btn-ce-gold req-btn-approve" data-req-pastoral-action="approve">${L("reqApprove")}</button>`;
  } else {
    foot.innerHTML = `<button type="button" class="btn btn-outline-glass" data-requisition-drawer-close>${L("cancel")}</button>`;
  }

  drawer.classList.remove("d-none");
  backdrop.classList.remove("d-none");
  requestAnimationFrame(() => drawer.classList.add("is-open"));
  drawer.setAttribute("aria-hidden", "false");
}

function closeRequisitionDrawer() {
  const drawer = byId("requisitionDrawer");
  const backdrop = byId("requisitionDrawerBackdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.classList.add("d-none");
  setTimeout(() => {
    drawer.classList.add("d-none");
    requisitionDrawerRecordId = null;
    requisitionDrawerPresetDecision = "";
  }, 280);
}

function submitRequisitionPastoralDecision(decision) {
  const form = byId("requisitionPastoralForm");
  const lib = window.CERequisitions;
  const record = (state.requisitions || []).find((r) => r.id === requisitionDrawerRecordId);
  if (!form || !record || !lib) return;

  const data = Object.fromEntries(new FormData(form).entries());
  const pastoralDecision = decision || data.pastoral_decision;
  if (!pastoralDecision) return;

  const payload = {
    approval_notes: data.pastoral_comment || "",
    pastoral_comment: data.pastoral_comment || "",
    approved_amount: data.approved_amount,
    final_priority: data.final_priority,
    rejection_reason: data.pastoral_comment || "",
    return_notes: data.pastoral_comment || ""
  };

  if (pastoralDecision === "reject" && !String(payload.rejection_reason).trim()) {
    alert(L("reqRejectionRequired"));
    return;
  }
  if (pastoralDecision === "returnForCorrection" && !String(payload.return_notes).trim()) {
    alert(L("reqReturnNotesRequired"));
    return;
  }

  const actionMap = { approve: "approve", reject: "reject", returnForCorrection: "returnForCorrection" };
  const action = actionMap[pastoralDecision];
  if (!action) return;

  const result = lib.applyWorkflowAction(state, activeUser, record.id, action, payload);
  if (!result.ok) return;

  const messages = {
    approve: L("reqApproveSuccess"),
    reject: L("reqRejectSuccess"),
    returnForCorrection: L("reqReturnSuccess")
  };
  saveState(`${action} requisition ${record.request_number}`);
  closeRequisitionDrawer();
  alert(messages[action] || L("save"));
  setRoute(activeRoute);
}

function renderRequisitions() {
  const lib = window.CERequisitions;
  if (!lib?.resolveAccess(activeUser).can_view) return renderAccessDenied();
  const access = lib.resolveAccess(activeUser);
  const scoped = lib.scopeFilter(state.requisitions || [], activeUser, access);
  const stats = lib.computeStats(scoped);
  let tabContent = "";

  if (requisitionsPageState.tab === "overview") {
    tabContent = `
      <div class="row g-3 mb-4">
        ${sm("bi-hourglass-split", L("reqPending"), stats.pending, "requisitions", { targetTab: "received", filterPayload: { status_group: "pending" } })}
        ${sm("bi-search", L("reqInReview"), stats.review, "requisitions", { targetTab: "review" })}
        ${sm("bi-person-badge", L("reqAwaitingPastor"), stats.pastoral, "requisitions", { targetTab: "pastoral" })}
        ${sm("bi-check-circle", L("reqApprovedMonth"), stats.approvedMonth, "requisitions", { targetTab: "approved" })}
        ${sm("bi-x-circle", L("reqRejected"), stats.rejected, "requisitions", { targetTab: "rejected" })}
        ${sm("bi-cash-stack", L("reqReleased"), stats.released, "requisitions", { targetTab: "released" })}
        ${sm("bi-graph-up", L("reqApprovedValue"), money(stats.approvedTotal), "requisitions", { targetTab: "approved" })}
        ${sm("bi-clock-history", L("reqPendingValue"), money(stats.pendingValue), "requisitions", { targetTab: "received", filterPayload: { pending_value: true } })}
      </div>
      ${summaryFilterChips("requisitions")}
      ${dataTable([L("reqNumber"), L("reqTitle"), L("reqDepartment"), L("reqType"), L("reqEstimated"), L("status"), L("actions")],
        scoped.slice(0, 8).map((r) => [r.request_number, r.title, r.department_name, r.requisition_type, money(r.estimated_amount), requisitionStatusBadge(r.status), requisitionActionButtons(r)]))}`;
  } else if (requisitionsPageState.tab === "reports") {
    tabContent = renderRequisitionReportsPanel({
      mode: "workflow",
      module: "requisitions",
      targetTab: "reports",
      filters: requisitionsPageState.reportFilters,
      formAttr: "data-requisition-module-report-filters"
    });
  } else if (requisitionsPageState.tab === "new") {
    tabContent = access.can_create ? `
      <div class="d-flex justify-content-end mb-3">
        <button type="button" class="btn btn-ce-gold btn-touch" data-open-form="requisition">${L("add")} ${L("requisitions")}</button>
      </div>
      <p class="text-secondary">${L("reqTabNew")} — ${L("requisitionsSubtitle")}</p>`
      : `<div class="finance-privacy-banner"><i class="bi bi-shield-lock"></i><span>${L("accessDeniedText")}</span></div>`;
  } else {
    let filtered = lib.filterByTab(scoped, requisitionsPageState.tab);
    if (requisitionsPageState.cardFilter?.pending_value) {
      filtered = filtered.filter((r) => ["Submetido", "Em Revisão", "Rascunho", "Devolvido para Correção"].includes(r.status) && Number(r.estimated_amount || 0) > 0);
    }
    tabContent = `${summaryFilterChips("requisitions")}${filtered.length ? dataTable(
      [L("reqNumber"), L("reqTitle"), L("reqDepartment"), L("reqUrgency"), L("reqNeededBy"), L("reqEstimated"), L("status"), L("actions")],
      filtered.map((r) => [r.request_number, r.title, r.department_name, r.urgency, r.needed_by_date || "-", money(r.estimated_amount), requisitionStatusBadge(r.status), requisitionActionButtons(r)])
    ) : noResultsHtml()}`;
  }

  setPageContent(`
    ${sectionHeader(L("requisitions"), L("requisitionsSubtitle"), "requisition", "bi-clipboard-check")}
    <article class="panel glass-panel module-content-card mb-4">
      ${requisitionsModuleTabs()}
      <div class="tab-content-panel">${tabContent}</div>
    </article>
  `);
}

function monthFilterOptions(selected = "") {
  const locale = lang === "en" ? "en-US" : "pt-PT";
  return [`<option value="">${L("all")}</option>`,
    ...Array.from({ length: 12 }, (_, index) => {
      const month = String(index + 1).padStart(2, "0");
      const label = new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, index, 1));
      return `<option value="${month}" ${selected === month ? "selected" : ""}>${label}</option>`;
    })
  ].join("");
}

function staffProfileFieldValue(name, record, lib, access) {
  const canBirthday = lib.canViewBirthday(activeUser, record, access);
  const canSalary = lib.canViewSalary(activeUser);
  let value = record[name];
  if (name === "church_id") return churchName(record.church_id);
  if (name === "salary_or_allowance") return canSalary ? money(value) : L("staffSalaryHidden");
  if (["national_id_number", "nuit", "bank_name", "bank_account_number", "mobile_money_number", "bank_or_mobile_details"].includes(name)) {
    return lib.maskSensitive(value, activeUser);
  }
  if (name === "date_of_birth") {
    if (!canBirthday) return "•••••";
    if (!value) return "-";
    const birthday = lib.formatBirthdayDisplay(value, lang);
    const age = record.age != null ? ` · ${L("staffAge")}: ${record.age}` : "";
    return `${value} · ${L("staffBirthdayLabel")}: ${birthday}${age}`;
  }
  if (value === "" || value == null) return "-";
  return value;
}

function staffProfileDetailRow(label, value) {
  return `<div><span>${label}</span><strong>${value ?? "-"}</strong></div>`;
}

function renderStaffProfileForm(record = {}, mode = "edit") {
  const lib = window.CEStaffHr;
  const canSalary = lib?.canViewSalary(activeUser);
  const sections = lib?.staffProfileSections(canSalary) || [];
  const enriched = lib?.enrichStaffProfile(record) || record;
  return sections.map((section) => {
    const fields = section.fields.map((field) => fieldControl(field, enriched)).join("");
    return typeof FormSection === "function"
      ? FormSection(L(section.titleKey), fields, "", "light")
      : `<div class="col-12"><h5>${L(section.titleKey)}</h5><div class="row g-3">${fields}</div></div>`;
  }).join("");
}

function openStaffProfileView(id) {
  const lib = window.CEStaffHr;
  const access = lib.resolveAccess(activeUser);
  const record = getCollection("staffProfile").find((item) => item.id === id);
  if (!record) return;
  const enriched = lib.enrichStaffProfile(record);
  const canBirthday = lib.canViewBirthday(activeUser, enriched, access);
  const canSalary = lib.canViewSalary(activeUser);
  const sections = lib.staffProfileSections(canSalary);
  const birthdayBlock = canBirthday ? (enriched.date_of_birth ? `
    <div class="col-12 staff-birthday-panel light-surface">
      <p class="mb-1"><strong>${L("dateOfBirth")}:</strong> ${enriched.date_of_birth}</p>
      <p class="mb-1"><strong>${L("staffBirthdayLabel")}:</strong> ${lib.formatBirthdayDisplay(enriched.date_of_birth, lang)}</p>
      <p class="mb-1"><strong>${L("staffBirthdayDayMonth")}:</strong> ${lib.formatBirthdayDayMonth(enriched.date_of_birth, lang)}</p>
      ${enriched.age != null ? `<p class="mb-1"><strong>${L("staffAge")}:</strong> ${enriched.age}</p>` : ""}
      ${enriched.days_until_birthday != null ? `<p class="mb-0"><strong>${L("staffDaysUntilBirthday")}:</strong> ${enriched.days_until_birthday}</p>` : ""}
    </div>` : `
    <div class="col-12 staff-birthday-panel staff-birthday-panel--warning light-surface">
      <p class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>${L("staffMissingDateOfBirth")}</p>
    </div>`) : "";
  const detailSections = sections.map((section) => {
    const rows = section.fields.map(([name, labelKey]) =>
      staffProfileDetailRow(L(labelKey), staffProfileFieldValue(name, enriched, lib, access))
    ).join("");
    const body = `<div class="col-12"><div class="detail-grid">${rows}</div></div>`;
    return typeof FormSection === "function"
      ? FormSection(L(section.titleKey), body, "", "light")
      : `<div class="col-12"><h5>${L(section.titleKey)}</h5>${body}</div>`;
  }).join("");
  byId("modalEyebrow").textContent = L("viewProfile");
  byId("modalTitle").textContent = enriched.full_name || L("staffHr");
  byId("modalFields").innerHTML = birthdayBlock + detailSections;
  modalType = null;
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function staffVisibleBirthdays(staffList, lib, access) {
  return lib.enrichStaffList(staffList).filter((staff) =>
    lib.hasDateOfBirth(staff) && lib.canViewBirthday(activeUser, staff, access)
  );
}

function staffBirthdayActions(staff, canEdit = false) {
  const actions = [
    ["view", "staffProfile", staff.id, L("viewProfile")],
    ["staffMessage", "staffProfile", staff.id, L("staffSendMessage")]
  ];
  if (canEdit) actions.push(["edit", "staffProfile", staff.id, L("edit")]);
  return actionButtons(actions);
}

function staffBirthdayEmptyState() {
  if (typeof EmptyState === "function") {
    return EmptyState({ icon: "bi-gift", title: L("empty"), description: "", compact: true, variant: "light" });
  }
  return `<p class="text-secondary mb-0">${L("empty")}</p>`;
}

function staffBirthdayCard(staff, lib, canEdit = false) {
  return `
    <article class="staff-birthday-card light-surface">
      <div class="staff-birthday-card-head">
        <div>
          <h6 class="staff-birthday-card-name">${staff.full_name}</h6>
          <p class="staff-birthday-card-role mb-0">${staff.role_title || "-"} · ${staff.department_name || "-"}</p>
        </div>
        ${staff.days_until_birthday === 0 ? `<span class="staff-birthday-today-badge">🎂</span>` : ""}
      </div>
      <div class="staff-birthday-card-meta">
        <span><strong>${L("church")}:</strong> ${churchName(staff.church_id)}</span>
        <span><strong>${L("dateOfBirth")}:</strong> ${staff.date_of_birth}</span>
        <span><strong>${L("staffBirthdayDayMonth")}:</strong> ${lib.formatBirthdayDayMonth(staff.date_of_birth, lang)}</span>
        <span><strong>${L("staffAge")}:</strong> ${staff.age ?? "-"}</span>
        <span><strong>${L("staffDaysUntilBirthday")}:</strong> ${staff.days_until_birthday ?? "-"}</span>
        <span><strong>${L("phone")}:</strong> ${staff.phone || staff.whatsapp || "-"}</span>
        <span>${badge(staff.status)}</span>
      </div>
      <div class="staff-birthday-card-actions">${staffBirthdayActions(staff, canEdit)}</div>
    </article>`;
}

function staffBirthdayTableRows(staffList, lib, canEdit = false) {
  return staffList.map((staff) => [
    staff.full_name,
    staff.role_title || "-",
    staff.department_name || "-",
    churchName(staff.church_id),
    staff.date_of_birth,
    lib.formatBirthdayDayMonth(staff.date_of_birth, lang),
    staff.age ?? "-",
    staff.days_until_birthday ?? "-",
    staff.phone || staff.whatsapp || "-",
    badge(staff.status),
    staffBirthdayActions(staff, canEdit)
  ]);
}

function renderStaffBirthdayList(staffList, lib, { compact = false, canEdit = false } = {}) {
  if (!staffList.length) return staffBirthdayEmptyState();
  const headers = [
    L("staffFullName"), L("staffRoleTitle"), L("reqDepartment"), L("church"),
    L("dateOfBirth"), L("staffBirthdayDayMonth"), L("staffAge"), L("staffDaysUntilBirthday"),
    L("phone"), L("status"), L("actions")
  ];
  const rows = staffBirthdayTableRows(staffList, lib, canEdit);
  if (compact) {
    return dataTable(
      [L("staffFullName"), L("staffBirthdayLabel"), L("staffAge"), L("staffDaysUntilBirthday"), L("actions")],
      staffList.map((staff) => [
        staff.full_name,
        lib.formatBirthdayDisplay(staff.date_of_birth, lang),
        staff.age ?? "-",
        staff.days_until_birthday ?? "-",
        staffBirthdayActions(staff, false)
      ])
    );
  }
  return `
    <div class="staff-birthday-cards-grid d-md-none">${staffList.map((staff) => staffBirthdayCard(staff, lib, canEdit)).join("")}</div>
    <div class="d-none d-md-block">${dataTable(headers, rows)}</div>`;
}

function staffBirthdaySection(title, staffList, lib, { compact = false, canEdit = false } = {}) {
  return `
    <section class="staff-birthday-section light-surface">
      <header class="staff-birthday-section-head">
        <h5 class="mb-0">${title}</h5>
        <span class="staff-birthday-section-count">${staffList.length}</span>
      </header>
      <div class="staff-birthday-section-body">${renderStaffBirthdayList(staffList, lib, { compact, canEdit })}</div>
    </section>`;
}

function openStaffBirthdaysModal(section = "thisMonth") {
  const lib = window.CEStaffHr;
  const access = lib.resolveAccess(activeUser);
  const visible = staffVisibleBirthdays(lib.scopeFilterStaff(state.staffProfiles || [], activeUser, access), lib, access);
  let title = L("staffBirthdays");
  let rows = lib.birthdaysThisMonth(visible);
  if (section === "today") {
    title = L("staffBirthdaysToday");
    rows = lib.birthdaysToday(visible);
  } else if (section === "upcoming") {
    title = L("staffUpcomingBirthdays");
    rows = lib.upcomingBirthdays(visible, 50, 365);
  } else if (section === "past") {
    title = L("staffPastBirthdaysThisMonth");
    rows = lib.pastBirthdaysThisMonth(visible);
  }
  rows = lib.sortByUpcomingBirthday(rows);
  byId("modalEyebrow").textContent = L("staffTabBirthdays");
  byId("modalTitle").textContent = title;
  byId("modalFields").innerHTML = `<div class="col-12 staff-birthday-modal-body">${renderStaffBirthdayList(rows, lib, { compact: false })}</div>`;
  modalType = null;
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function staffUpcomingBirthdaysPanel(staffList, lib, access) {
  const upcoming = lib.upcomingBirthdays(staffVisibleBirthdays(staffList, lib, access), 5, 60);
  if (!upcoming.length) return staffBirthdayEmptyState();
  return `<ul class="staff-birthday-shortlist list-unstyled mb-0">${upcoming.map((staff) => `
    <li class="d-flex justify-content-between align-items-center gap-2 py-2 border-bottom border-light-subtle">
      <button type="button" class="btn btn-link p-0 text-start staff-birthday-link" data-action="view" data-type="staffProfile" data-id="${staff.id}">
        <strong>${staff.full_name}</strong>
        <small class="text-secondary d-block">${lib.formatBirthdayDisplay(staff.date_of_birth, lang)}</small>
      </button>
      <span class="text-nowrap staff-birthday-days">${staff.days_until_birthday === 0 ? "🎂" : `${staff.days_until_birthday} ${lang === "pt" ? "dias" : "days"}`}</span>
    </li>`).join("")}</ul>`;
}

function staffBirthdayFilterBar(staffList) {
  const filters = staffHrPageState.birthdayFilters;
  const departments = [...new Set(staffList.map((staff) => staff.department_name).filter(Boolean))].sort();
  const churchIds = [...new Set(staffList.map((staff) => staff.church_id).filter(Boolean))];
  const churches = relationalChurches().filter((church) => churchIds.includes(church.id));
  const statuses = window.CEStaffHr?.STAFF_STATUSES || [];
  return `
    <div class="staff-birthday-filters light-surface row g-2 mb-3 p-3">
      <div class="col-md-4 col-lg-3">
        <label class="form-label">${L("search")}</label>
        <input class="form-control" type="search" data-staff-birthday-filter="search" value="${filters.search || ""}" placeholder="${L("staffFullName")}">
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label">${L("staffFilterBirthdayMonth")}</label>
        <select class="form-select" data-staff-birthday-filter="month">${monthFilterOptions(filters.month)}</select>
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label">${L("church")}</label>
        <select class="form-select" data-staff-birthday-filter="churchId">
          <option value="">${L("all")}</option>
          ${churches.map((church) => `<option value="${church.id}" ${filters.churchId === church.id ? "selected" : ""}>${churchOptionLabel(church)}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label">${L("reqDepartment")}</label>
        <select class="form-select" data-staff-birthday-filter="department">
          <option value="">${L("all")}</option>
          ${departments.map((department) => `<option value="${department}" ${filters.department === department ? "selected" : ""}>${department}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-4 col-lg-2">
        <label class="form-label">${L("status")}</label>
        <select class="form-select" data-staff-birthday-filter="status">
          <option value="">${L("all")}</option>
          ${statuses.map((status) => `<option value="${status}" ${filters.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </div>
    </div>`;
}

function renderStaffBirthdaysTab(staffList, lib, access, stats) {
  const visible = staffVisibleBirthdays(staffList, lib, access);
  const sections = lib.getBirthdaySections(visible, staffHrPageState.birthdayFilters);
  const canEdit = Boolean(access.can_edit);
  return `
    <div class="row g-3 mb-4">
      ${sm("bi-balloon", L("staffBirthdaysToday"), stats.birthdaysToday, "staffHr", { modalType: "today" })}
      ${sm("bi-gift", L("staffBirthdays"), stats.birthdays, "staffHr", { modalType: "thisMonth" })}
      ${sm("bi-calendar-event", L("staffUpcomingBirthdays"), stats.upcomingBirthdays, "staffHr", { targetTab: "birthdays", filterPayload: { upcoming: true } })}
      ${sm("bi-person-check", L("staffActiveBirthdays"), stats.activeStaffBirthdays, "staffHr", { targetTab: "staff", filterPayload: { status: "Activo", has_dob: true } })}
    </div>
    ${staffBirthdayFilterBar(staffList)}
    <div class="staff-birthday-sections">
      ${staffBirthdaySection(L("staffBirthdaysToday"), sections.today, lib, { canEdit })}
      ${staffBirthdaySection(L("staffUpcomingBirthdays"), sections.upcoming, lib, { canEdit })}
      ${staffBirthdaySection(L("staffBirthdays"), sections.thisMonth, lib, { canEdit })}
      ${staffBirthdaySection(L("staffPastBirthdaysThisMonth"), sections.pastThisMonth, lib, { canEdit })}
    </div>`;
}

function staffMissingDobBadge() {
  return `<span class="staff-missing-dob-badge">${L("staffMissingDateOfBirth")}</span>`;
}

function staffHrModuleTabs() {
  const tabs = [
    ["overview", L("staffTabOverview")],
    ["staff", L("staffTabStaff")],
    ["birthdays", L("staffTabBirthdays")],
    ["departments", L("staffTabDepartments")],
    ["roles", L("staffTabRoles")],
    ["salaries", L("staffTabSalaries")],
    ["performance", L("staffTabPerformance")],
    ["attendance", L("staffTabAttendance")],
    ["equipment", L("staffTabEquipment")],
    ["documents", L("staffTabDocuments")],
    ["reports", L("staffTabReports")]
  ];
  return moduleTabsNav(tabs.map(([key, label]) =>
    moduleTabButton(label, { active: staffHrPageState.tab === key, attrs: `data-staff-tab="${key}"` })
  ).join(""), "staff-hr-module-tabs");
}

function renderStaffHr() {
  const lib = window.CEStaffHr;
  if (!lib?.resolveAccess(activeUser).can_view) return renderAccessDenied();
  const access = lib.resolveAccess(activeUser);
  const staffList = lib.scopeFilterStaff(state.staffProfiles || [], activeUser, access);
  const salaries = lib.filterSalaries(state.staffSalaries || [], state.staffProfiles || [], activeUser);
  const equipment = state.venueInventory?.staffEquipment || [];
  const stats = lib.computeStats(staffList, salaries, state.staffPerformance, equipment);
  const canSalary = lib.canViewSalary(activeUser);
  let tabContent = "";

  const visibleBirthdays = staffVisibleBirthdays(staffList, lib, access);
  const birthdayStats = {
    birthdays: lib.birthdaysThisMonth(visibleBirthdays).length,
    birthdaysToday: lib.birthdaysToday(visibleBirthdays).length,
    upcomingBirthdays: lib.upcomingBirthdays(visibleBirthdays, 100, 365).length,
    activeStaffBirthdays: visibleBirthdays.filter((staff) => staff.status === "Activo").length
  };

  if (staffHrPageState.tab === "overview") {
    const monthBirthdays = lib.sortByUpcomingBirthday(lib.birthdaysThisMonth(visibleBirthdays));
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    tabContent = `
      <div class="row g-3 mb-4">
        ${sm("bi-people", L("staffTotal"), stats.total, "staffHr", { targetTab: "staff", filterPayload: {} })}
        ${sm("bi-person-check", L("staffActive"), stats.active, "staffHr", { targetTab: "staff", filterPayload: { status: "Activo" } })}
        ${sm("bi-heart", L("staffVolunteers"), stats.volunteers, "staffHr", { targetTab: "staff", filterPayload: { employment_type: "Voluntário" } })}
        ${sm("bi-wallet2", L("staffWithSalary"), stats.withPay, "staffHr", { targetTab: "salaries", filterPayload: { has_salary: true } })}
        ${sm("bi-clipboard-data", L("staffPendingEval"), stats.pendingEval, "staffHr", { targetTab: "performance", filterPayload: { pending_eval: true } })}
        ${sm("bi-cash", L("staffPendingPay"), stats.pendingPay, "staffHr", { targetTab: "salaries", filterPayload: { payment_status: "Pendente" } })}
        ${sm("bi-laptop", L("staffAssignedEq"), stats.assignedEq, "staffHr", { targetTab: "equipment", filterPayload: { assigned: true } })}
        ${sm("bi-gift", L("staffBirthdays"), birthdayStats.birthdays, "staffHr", { targetTab: "birthdays", filterPayload: { birthday_month: currentMonth } })}
        ${sm("bi-calendar-event", L("staffUpcomingBirthdays"), birthdayStats.upcomingBirthdays, "staffHr", { targetTab: "birthdays", filterPayload: { upcoming: true } })}
      </div>
      <div class="row g-3">
        <div class="col-lg-6">
          <article class="panel glass-panel staff-birthday-panel light-surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h5 class="mb-0">${L("staffBirthdays")}</h5>
              <button type="button" class="btn btn-sm btn-outline-cyan" data-staff-tab="birthdays">${L("viewAll")}</button>
            </div>
            ${renderStaffBirthdayList(monthBirthdays, lib, { compact: true })}
          </article>
        </div>
        <div class="col-lg-6">
          <article class="panel glass-panel staff-birthday-panel light-surface p-3 h-100">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h5 class="mb-0">${L("staffUpcomingBirthdays")}</h5>
              <button type="button" class="btn btn-sm btn-outline-cyan" data-staff-metric="birthdays-upcoming">${L("viewAll")}</button>
            </div>
            ${staffUpcomingBirthdaysPanel(staffList, lib, access)}
          </article>
        </div>
      </div>`;
  } else if (staffHrPageState.tab === "staff") {
    const filteredStaff = applyStaffCardFilters(staffList, staffHrPageState.cardFilters?.staff || {});
    tabContent = `${summaryFilterChips("staffHr")}${access.can_create ? `<div class="d-flex justify-content-end mb-3"><button type="button" class="btn btn-ce-gold btn-touch" data-open-form="staffProfile">${L("add")}</button></div>` : ""}
      ${filteredStaff.length ? dataTable([L("staffFullName"), L("staffRoleTitle"), L("church"), L("reqDepartment"), L("staffEmploymentType"), L("status"), L("actions")],
        filteredStaff.map((s) => {
          const enriched = lib.enrichStaffProfile(s);
          const nameCell = `${s.full_name}${!lib.hasDateOfBirth(enriched) ? ` ${staffMissingDobBadge()}` : ""}`;
          return [nameCell, s.role_title, churchName(s.church_id), s.department_name, s.employment_type, badge(s.status),
            actionButtons([["view", "staffProfile", s.id, L("viewProfile")], ["edit", "staffProfile", s.id, L("edit")]])];
        })) : noResultsHtml()}`;
  } else if (staffHrPageState.tab === "birthdays") {
    tabContent = `${summaryFilterChips("staffHr")}${renderStaffBirthdaysTab(staffList, lib, access, birthdayStats)}`;
  } else if (staffHrPageState.tab === "departments") {
    tabContent = dataTable([L("name"), L("church"), L("staffSupervisor"), L("actions")],
      (state.departments || []).map((d) => [d.name, churchName(d.church_id), d.lead_name || "-", "-"]));
  } else if (staffHrPageState.tab === "roles") {
    const roles = [...new Set(staffList.map((s) => s.role_title))];
    tabContent = dataTable([L("staffRoleTitle"), L("staffTotal")], roles.map((r) => [r, staffList.filter((s) => s.role_title === r).length]));
  } else if (staffHrPageState.tab === "salaries") {
    const filteredSalaries = applyStaffSalaryCardFilters(salaries, staffList, staffHrPageState.cardFilters?.salaries || {});
    tabContent = `${summaryFilterChips("staffHr")}${!canSalary ? `<div class="finance-privacy-banner mb-3"><i class="bi bi-shield-lock"></i><span>${L("staffPrivacyBanner")}</span></div>` : ""}
      ${filteredSalaries.length ? dataTable([L("staffFullName"), L("date"), L("staffSalary"), L("amount"), L("status"), L("actions")],
        filteredSalaries.map((sal) => {
          const staff = staffList.find((s) => s.id === sal.staff_id) || state.staffProfiles.find((s) => s.id === sal.staff_id);
          return [staff?.full_name || "-", sal.month, canSalary ? money(sal.net_amount) : L("staffSalaryHidden"), money(canSalary ? sal.net_amount : 0), badge(sal.payment_status),
            actionButtons([["view", "staffSalary", sal.id, L("view")]])];
        })) : noResultsHtml()}`;
  } else if (staffHrPageState.tab === "performance") {
    const perfBase = (state.staffPerformance || []).filter((p) => staffList.some((s) => s.id === p.staff_id));
    const perfRows = applyStaffPerformanceCardFilters(perfBase, staffHrPageState.cardFilters?.performance || {});
    tabContent = `${summaryFilterChips("staffHr")}${perfRows.length ? dataTable([L("staffFullName"), L("date"), L("progress"), L("status"), L("actions")],
      perfRows.map((p) => {
        const staff = staffList.find((s) => s.id === p.staff_id);
        return [staff?.full_name || "-", p.evaluation_period, p.overall_score ? `${p.overall_score}/10` : "-", badge(p.evaluated_at ? L("verified") : L("pendingVerification")),
          actionButtons([["view", "staffPerformance", p.id, L("view")]])];
      })) : noResultsHtml()}`;
  } else if (staffHrPageState.tab === "attendance") {
    tabContent = dataTable([L("staffFullName"), L("date"), L("church"), L("status"), L("notes")],
      (state.staffAttendance || []).filter((a) => staffList.some((s) => s.id === a.staff_id)).map((a) => {
        const staff = staffList.find((s) => s.id === a.staff_id);
        return [staff?.full_name || "-", a.date, churchName(a.church_id), badge(a.attendance_status), a.notes || "-"];
      }));
  } else if (staffHrPageState.tab === "equipment") {
    const rows = staffList.flatMap((s) => {
      const items = lib.getStaffEquipment(s, state.venueInventory);
      return items.length ? items.map((eq) => [s.full_name, eq.dispositivo, eq.modelo, eq.departamento, badge(eq.status)]) : [[s.full_name, "-", "-", s.department_name, badge(L("empty"))]];
    });
    tabContent = dataTable([L("staffFullName"), L("device"), L("model"), L("reqDepartment"), L("status")], rows);
  } else if (staffHrPageState.tab === "documents") {
    tabContent = dataTable([L("staffFullName"), L("category"), L("date"), L("notes")],
      (state.staffDocuments || []).filter((d) => staffList.some((s) => s.id === d.staff_id)).map((d) => {
        const staff = staffList.find((s) => s.id === d.staff_id);
        return [staff?.full_name || "-", d.document_type, d.expiry_date || "-", d.notes || "-"];
      }));
  } else {
    const monthBirthdays = lib.sortByUpcomingBirthday(lib.birthdaysThisMonth(visibleBirthdays));
    tabContent = `
      <div class="module-grid mb-4">${[
        [L("staffTotal"), stats.total],
        [L("staffActive"), stats.active],
        [L("staffPendingPay"), stats.pendingPay],
        [L("staffBirthdays"), birthdayStats.birthdays]
      ].map(([label, val]) => `<article class="record-card data-card light-surface"><span class="eyebrow">${L("staffTabReports")}</span><h3>${label}</h3><p class="mb-0">${val}</p></article>`).join("")}</div>
      <article class="panel glass-panel staff-birthday-panel light-surface p-3">
        <div class="d-flex justify-content-between align-items-center gap-2 mb-3">
          <h5 class="mb-0">${L("staffBirthdays")}</h5>
          <button type="button" class="btn btn-sm btn-ce-gold" data-staff-tab="birthdays">${L("staffTabBirthdays")}</button>
        </div>
        ${renderStaffBirthdayList(monthBirthdays, lib, { compact: true })}
      </article>`;
  }

  setPageContent(`
    ${sectionHeader(L("staffHr"), L("staffHrSubtitle"), "staffProfile", "bi-people-fill")}
    <article class="panel glass-panel module-content-card mb-4">
      ${staffHrModuleTabs()}
      <div class="tab-content-panel">${tabContent}</div>
    </article>
  `);
}

function renderUsers() {
  if (!canEnterRoute("users")) return renderAccessDenied();
  setPageContent(`${sectionHeader(L("usersRoles"), L("accessControl"), "user", "bi-person-lock")}<article class="panel glass-panel">${dataTable([L("name"), L("email"), L("Role"), L("church"), L("Permissions"), L("actions")], state.users.map((u) => [u.name, u.email, u.role, churchName(u.church_id), u.department_permissions.join(", "), actionButtons([["view", "user", u.id, L("view")], ["edit", "user", u.id, L("edit")]])]))}</article>`);
}

function renderAccess() {
  if (!canEnterRoute("access")) return renderAccessDenied();
  const moduleLabels = {
    dashboard: "dashboard", churches: "churches", members: "members", firstTimers: "firstTimers",
    followUp: "followUp", reports: "reports", counseling: "counseling", foundation: "foundationSchool",
    finance: "finance", fevo: "fevo", venueInventory: "venueInventoryShort", sacraments: "sacraments",
    prisonMinistry: "prisonMinistry", ministryMaterials: "ministryMaterials", programs: "programs",
    partnership: "partnership", media: "media", cell: "cellMinistry", requisitions: "requisitions",
    staffHr: "staffHr", usersRoles: "usersRoles", accessControl: "accessControl", settings: "settings", auditLogs: "auditLogs"
  };
  const modules = window.CEAccessControl?.ALL_MODULES || [];
  const rows = modules.map((mod) => {
    const access = window.CEAccessControl.resolveModuleAccess(activeUser, mod);
    return [L(moduleLabels[mod] || mod), access.can_view ? L("yes") : L("no"), access.can_create ? L("yes") : L("no"), access.can_edit ? L("yes") : L("no"), access.can_approve ? L("yes") : L("no"), access.scope || "-"];
  });
  setPageContent(`${sectionHeader(L("accessControl"), L("staffHrSubtitle"), null, "bi-shield-lock")}
    <article class="panel glass-panel mb-3">${dataTable([L("Role"), L("Scope"), L("Permissions")], state.users.map((u) => [u.role, u.can_view_all_churches ? L("all") : churchName(u.church_id), u.department_permissions.join(", ")]))}</article>
    <article class="panel glass-panel">${dataTable([L("accessMatrixModule"), L("accessMatrixView"), L("accessMatrixCreate"), L("accessMatrixEdit"), L("accessMatrixApprove"), L("accessMatrixScope")], rows)}</article>`);
}

function renderSettings() {
  setPageContent(`${sectionHeader(L("settings"), lang === "pt" ? "Definições futuras para backend, autenticação, notificações e API mobile." : "Backend, authentication, notifications and mobile API settings will live here.", null, "bi-gear")}<div class="module-grid">${["Supabase/Firebase/PostgreSQL", "Authentication", "Mobile API", "Notifications"].map((item) => `<article class="record-card data-card"><span class="eyebrow">${L("settings")}</span><h3>${item}</h3><p class="text-secondary mb-0">${lang === "pt" ? "Espaço reservado do protótipo." : "Frontend placeholder."}</p></article>`).join("")}</div>`);
}

function renderAudit() {
  if (!canEnterRoute("audit")) return renderAccessDenied();
  setPageContent(`${sectionHeader(L("auditLogs"), lang === "pt" ? "Histórico operacional das alterações neste protótipo." : "Operational history for changes in this prototype.", null, "bi-journal-check")}<article class="panel glass-panel">${dataTable([L("date"), L("Actor"), L("church"), L("Action")], state.auditLogs.slice().reverse().map((log) => [log.date, log.actor, churchName(log.church_id), log.action]))}</article>`);
}

function renderSimple(type, title, records) {
  setPageContent(`${sectionHeader(title, title, type, "bi-grid")}<article class="panel glass-panel">${dataTable([L("name"), L("church"), L("category"), L("status"), L("actions")], scoped(records).map((r) => [r.name, churchName(r.church_id), r.category || r.owner || r.channel || "-", badge(r.status), actionButtons([["view", type, r.id, L("view")], ["edit", type, r.id, L("edit")]])]))}</article>`);
}

function dataTable(headers, rows, options = {}) {
  if (typeof DataTable === "function") return DataTable(headers, rows, options);
  return `
    <div class="data-table-wrap glass-panel">
      <div class="table-responsive data-table">
        <table class="table align-middle data-table-desktop">
          <thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell, index) => `<td data-label="${headers[index]}">${cell ?? "-"}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">${EmptyState({ compact: true, title: L("empty") })}</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

function actionButtons(buttons) {
  return `<div class="action-cluster">${buttons.map(([action, type, id, label]) => `<button type="button" class="action-btn" data-action="${action}" data-type="${type}" data-id="${id}">${label}</button>`).join("")}</div>`;
}

function labelFor(key) {
  const map = {
    nome: L("name"), apelido: L("surname"), telefone: L("phone"), data_do_baptismo: L("date"), estado: L("status"),
    nome_do_noivo: "Noivo", nome_da_noiva: "Noiva", data_do_casamento: L("date"), nome_da_crianca: "Criança", telefone_dos_pais: L("phone"), data_da_dedicacao: L("date"),
    church_name: L("church"), public_name: L("publicName"), district_or_area: L("districtOrArea"), phone_primary: L("phonePrimary"),
    phone_secondary: L("phoneSecondary"), service_times: L("serviceTimes"), parent_church_id: L("parentChurch"),
    information_status: L("informationStatus"), pastor_in_charge: L("Pastor"), facebook: L("facebook"), instagram: L("instagram"), youtube: L("youtube"),
    endereco: L("address"), celula: L("cell"), categoria_da_contribuicao: L("category"), metodo_de_pagamento: L("method"), valor: L("amount"),
    referencia_da_transaccao: L("transactionReference"), recebido_por: L("receivedBy"), verificado_por: L("verifiedBy"), observacoes: L("observations"),
    imagem_do_envelope: L("envelopeImage"), imagem_envelope_ou_pop: L("envelopeImage"), verified_at: L("verifiedAt"), comentario_verificacao: L("verificationComment"),
    motivo_rejeicao: L("rejectionReason"), created_at: L("createdAt"), church_id: L("church"), whatsapp: L("whatsapp"), igreja: L("church"),
    source_type: L("sourceType"), member_id: "Member ID", contributor_id: "Contributor ID", first_timer_id: "First Timer ID", partner_id: "Partner ID",
    full_name: L("staffFullName"), title: L("treatment"), gender: L("gender"), date_of_birth: L("dateOfBirth"),
    birthday_month: L("staffFilterBirthdayMonth"), birthday_day: L("staffBirthdayLabel"), age: L("staffAge"),
    next_birthday: L("staffUpcomingBirthdays"), days_until_birthday: L("staffDaysUntilBirthday"),
    marital_status: L("maritalStatus"), address: L("address"),
    emergency_contact_name: L("emergencyContactName"), emergency_contact_phone: L("emergencyContactPhone"),
    national_id_number: L("nationalIdNumber"), nuit: L("taxNumber"), profile_photo: L("profilePhoto"),
    bank_name: L("bankName"), bank_account_number: L("bankAccountNumber"), mobile_money_number: L("mobileMoneyNumber"),
    contract_start_date: L("contractStartDate"), contract_end_date: L("contractEndDate"), probation_end_date: L("probationEndDate"),
    role_title: L("staffRoleTitle"), department_name: L("reqDepartment"), supervisor_name: L("staffSupervisor"),
    start_date: L("staffStartDate"), employment_type: L("staffEmploymentType"),
    salary_or_allowance: L("staffSalary"), payment_frequency: L("staffPaymentFreq"), payment_method: L("method"),
    bank_or_mobile_details: L("bankOrMobileDetails"), notes: L("notes"), phone: L("phone"), email: L("email")
  };
  return map[key] || key.replaceAll("_", " ");
}

const formSchemas = {
  firstTimer: [
    ["tratamento", "treatment", "select", treatmentOptions], ["nome", "name"], ["apelido", "surname"], ["genero", "gender", "select", ["Feminino", "Masculino"]], ["data_de_nascimento", "birthDate", "date"], ["telefone", "phone"], ["whatsapp", "whatsapp"], ["email", "email", "email"], ["endereco", "address"], ["church_id", "church", "church"], ["data_do_culto", "date", "date"], ["culto", "service", "select", serviceOptions], ["convidado_por", "Invited by"], ["nasceu_de_novo", "bornAgain", "checkbox"], ["quer_escola_de_fundacao", "foundationSchool", "checkbox"], ["quer_aconselhamento", "counseling", "checkbox"], ["interesse_em_celula", "cellInterest", "checkbox"], ["celula_preferida", "preferredCell"], ["estado_do_seguimento", "followupState", "select", followupStatuses], ["conselheiro_responsavel", "responsibleCounselor"], ["notas", "notes", "textarea"]
  ],
  member: [
    ["tratamento", "treatment", "select", treatmentOptions], ["nome", "name"], ["apelido", "surname"], ["telefone", "phone"], ["email", "email", "email"],
    ["church_id", "church", "church", { showInfoCard: true, autofillFields: ["church_id", "province", "city", "district_or_area"], igrejaField: "igreja" }],
    ["celula", "cell"], ["departamento", "department"], ["estado", "status", "select", memberStatuses], ["data_de_entrada", "entryDate", "date"], ["origem", "origin", "select", ["Primeira Vez", "Escola de Fundação", "Transferência", "Manual"]], ["notas", "notes", "textarea"]
  ],
  foundationStudent: [],
  finance: financeEntrySchema(),
  church: [
    ["church_name", "church"], ["public_name", "publicName"], ["type", "Type", "select", CHURCH_TYPES],
    ["province", "province", "province"], ["city", "cityDistrict", "city"], ["district_or_area", "areaNeighborhood"], ["address", "address"],
    ["pastor_in_charge", "Pastor"], ["phone_primary", "phonePrimary"], ["phone_secondary", "phoneSecondary"],
    ["email", "email", "email"], ["facebook", "facebook"], ["instagram", "instagram"], ["youtube", "youtube"],
    ["parent_church_id", "parentChurch", "parentChurch"],
    ["status", "status", "select", CHURCH_STATUSES], ["information_status", "informationStatus", "select", CHURCH_INFO_STATUSES],
    ["notes", "notes", "textarea"]
  ],
  cell: [["nome_da_celula", "cell"], ["lider", "Leader"], ["area", "address"], ["limite_crescimento", "Cell growth", "number"]],
  user: [["name", "name"], ["email", "email", "email"], ["role", "Role"], ["church_id", "church", "church"], ["department_permissions", "Departments"], ["can_view_all_churches", "Access Control", "checkbox"]],
  baptism: [["nome", "name"], ["apelido", "surname"], ["telefone", "phone"], ["church_id", "church", "church"], ["celula", "cell"], ["idade", "Age", "number"], ["data_do_baptismo", "date", "date"], ["local_do_baptismo", "Local"], ["baptizado_por", "Pastor"], ["quer_certificado", "certificates", "checkbox"], ["certificado_pago", "Paid", "checkbox"], ["certificado_emitido", "certificateIssued", "checkbox"], ["estado", "status", "select", ["Pending", "Scheduled", "Completed", "Certificate Issued"]], ["observacoes", "notes", "textarea"]],
  marriage: [["nome_do_noivo", "Groom"], ["telefone_do_noivo", "phone"], ["nome_da_noiva", "Bride"], ["telefone_da_noiva", "phone"], ["church_id", "church", "church"], ["aconselhamento_concluido", "counseling", "checkbox"], ["data_do_casamento", "date", "date"], ["pastor_responsavel", "Pastor"], ["documentos_entregues", "Documents", "checkbox"], ["estado", "status", "select", ["Pending", "In Progress", "Scheduled", "Completed"]], ["observacoes", "notes", "textarea"]],
  baby: [["nome_da_crianca", "name"], ["data_de_nascimento", "birthDate", "date"], ["nome_do_pai", "Father"], ["nome_da_mae", "Mother"], ["telefone_dos_pais", "phone"], ["church_id", "church", "church"], ["data_da_dedicacao", "date", "date"], ["pastor_responsavel", "Pastor"], ["certificado_emitido", "certificateIssued", "checkbox"], ["estado", "status", "select", ["Pending", "Scheduled", "Completed", "Certificate Issued"]], ["observacoes", "notes", "textarea"]],
  fevoConfig: [["semana_inicio", "weekStart", "date"], ["semana_fim", "weekEnd", "date"], ["team_a_activity", "teamAActivity", "select", fevoActivities], ["team_b_activity", "teamBActivity", "select", fevoActivities], ["team_c_activity", "teamCActivity", "select", fevoActivities], ["team_d_activity", "teamDActivity", "select", fevoActivities], ["preparado_por", "preparedBy"], ["church_id", "church", "church"], ["observacoes", "observations", "textarea"], ["estado", "status", "select", fevoConfigStatuses]],
  fevoReport: [["semana_inicio", "weekStart", "date"], ["semana_fim", "weekEnd", "date"], ["team", "team", "select", fevoTeams], ["activity_type", "activityType", "select", fevoActivities], ["group_id", "groupName"], ["cell_id", "cell", "cellSelect"], ["leader_id", "Leader"], ["church_id", "church", "church"], ["group_name", "groupName"], ["leader_name", "leaderName"], ["number_of_cells", "numberOfCells", "number"], ["number_of_members", "numberOfMembers", "number"], ["leaders_present", "leadersPresent", "number"], ["members_present", "membersPresent", "number"], ["ft_in_church", "ftInChurch", "number"], ["submitted_report", "submittedReport", "checkbox"], ["submitted_by", "submittedBy"], ["submitted_at", "submittedAt", "date"], ["souls_contacted", "soulsContacted", "number"], ["feedback_count", "feedbackCount", "number"], ["followup_result", "followupResult", "textarea"], ["next_action", "nextAction"], ["souls_evangelized", "soulsEvangelized", "number"], ["new_converts", "newConverts", "number"], ["evangelism_location", "evangelismLocation"], ["materials_distributed", "materialsDistributed", "number"], ["souls_visited", "soulsVisited", "number"], ["family_members_reached", "familyMembersReached", "number"], ["visit_location", "visitLocation"], ["visit_result", "visitResult", "textarea"], ["average_members_present", "averageMembersPresent", "number"], ["days_of_prayer", "daysOfPrayer", "number"], ["prayer_focus", "prayerFocus", "textarea"], ["prayer_testimonies", "prayerTestimonies", "textarea"], ["notes", "notes", "textarea"], ["status", "status", "select", fevoReportStatuses]],
  fevoNoReport: [["semana_inicio", "weekStart", "date"], ["semana_fim", "weekEnd", "date"], ["team", "team", "select", fevoTeams], ["activity_type", "activityType", "select", fevoActivities], ["church_id", "church", "church"], ["group_name", "groupName"], ["leader_name", "leaderName"], ["reason_not_submitted", "reasonNotSubmitted", "textarea"], ["followup_action", "followupAction", "textarea"], ["contacted", "contacted", "checkbox"], ["contacted_by", "contactedBy"], ["status", "status", "select", fevoNoReportStatuses]],
  prisonLocation: [["nome_da_prisao", "prisonName"], ["provincia", "province", "province"], ["cidade", "cityDistrict", "city"], ["church_id", "church", "church"], ["igreja_responsavel", "responsibleChurch", "church"], ["representante_da_prisao", "prisonRepresentative"], ["contacto_do_representante", "representativeContact"], ["estado", "status", "select", prisonStatusOptions], ["observacoes", "observations", "textarea"]],
  prisonService: [["data", "date", "date"], ["dia_da_semana", "weekday", "select", ["Quinta", "Sexta"]], ["prisao", "prison", "prison"], ["church_id", "church", "church"], ["igreja_responsavel", "responsibleChurch", "church"], ["lider_responsavel", "responsibleLeader"], ["membros_que_foram", "membersWent", "textarea"], ["numero_de_internos_presentes", "inmatesPresent", "number"], ["novos_convertidos", "prisonNewConverts", "number"], ["interessados_em_escola_de_fundacao", "interestedFoundation", "number"], ["aula_de_fundacao_dada", "foundationClassGiven", "checkbox"], ["tema_ou_mensagem", "topicMessage"], ["estado", "status", "select", prisonServiceStatuses], ["observacoes", "observations", "textarea"]],
  prisonFoundation: [["nome_do_participante", "participantName"], ["prisao", "prison", "prison"], ["church_id", "church", "church"], ["igreja_responsavel", "responsibleChurch", "church"], ["aula_1_presenca", "classes", "checkbox"], ["aula_2_presenca", "classes", "checkbox"], ["aula_3_presenca", "classes", "checkbox"], ["aula_4_presenca", "classes", "checkbox"], ["aula_5_presenca", "classes", "checkbox"], ["aula_6_presenca", "classes", "checkbox"], ["aula_7_presenca", "classes", "checkbox"], ["nota_exame", "exam", "number"], ["pratica_evangelismo", "evangelismPractice", "checkbox"], ["aprovado", "approved", "checkbox"], ["graduado", "graduated", "checkbox"], ["certificado_emitido", "certificateIssued", "checkbox"], ["estado", "status", "select", prisonFoundationStatuses], ["observacoes", "observations", "textarea"]],
  prisonAgenda: [["semana_inicio", "weekStart", "date"], ["semana_fim", "weekEnd", "date"], ["segunda_preparar_relatorios_e_agenda", "mondayAgenda", "checkbox"], ["terca_reuniao_de_oracao", "tuesdayPrayer", "checkbox"], ["quarta_followup_com_representante", "wednesdayFollowup", "checkbox"], ["quinta_servico_prisional", "thursdayService", "checkbox"], ["sexta_servico_prisional", "fridayService", "checkbox"], ["sabado_domingo_acompanhamento", "weekendFollowup", "checkbox"], ["responsavel", "responsible"], ["estado", "status", "select", prisonAgendaStatuses], ["observacoes", "observations", "textarea"]],
  materialCatalogue: [["titulo_do_material", "materialTitle"], ["tipo", "materialType", "select", materialTypes], ["autor_ou_origem", "authorOrigin"], ["formato", "format", "select", materialFormats], ["preco", "price", "number"], ["stock_actual", "currentStock", "number"], ["stock_minimo", "minimumStock", "number"], ["church_id", "church", "church"], ["estado", "status", "select", materialStatuses], ["observacoes", "observations", "textarea"]],
  materialSale: [["data", "date", "date"], ["semana_do_relatorio", "reportWeek"], ["comprador", "buyer"], ["igreja", "church", "church"], ["church_id", "church", "church"], ["titulo_do_material", "materialTitle", "material"], ["quantidade", "quantitySold", "number"], ["valor", "amount", "number"], ["metodo_de_pagamento", "method", "select", paymentMethods], ["pop_prova_de_pagamento", "paymentProof"], ["recebido_por", "receivedBy"], ["estado", "status", "select", materialSalesStatuses], ["observacoes", "observations", "textarea"]],
  materialDistribution: [["data", "date", "date"], ["igreja_destinataria", "destinationChurch", "church"], ["church_id", "church", "church"], ["titulo_do_material", "materialTitle", "material"], ["quantidade", "quantitySold", "number"], ["tipo_de_distribuicao", "distributionType", "select", distributionTypes], ["responsavel_pelo_envio", "sentBy"], ["recebido_por", "receivedBy"], ["estado", "status", "select", distributionStatuses], ["observacoes", "observations", "textarea"]],
  materialStock: [["semana_inicio", "weekStart", "date"], ["semana_fim", "weekEnd", "date"], ["titulo_do_material", "materialTitle", "material"], ["church_id", "church", "church"], ["stock_inicial", "openingStock", "number"], ["entradas", "entries", "number"], ["saidas", "exits", "number"], ["stock_final", "finalStock", "number"], ["diferenca", "difference", "number"], ["observacoes", "observations", "textarea"]],
  materialFund: [["campanha", "campaign"], ["valor_alvo", "targetAmount", "number"], ["valor_levantado", "raisedAmount", "number"], ["materiais_a_distribuir", "materialsToDistribute", "textarea"], ["igrejas_beneficiadas", "beneficiaryChurches", "textarea"], ["church_id", "church", "church"], ["estado", "status", "select", fundStatuses], ["observacoes", "observations", "textarea"]],
  alecRegistration: [["nome_completo", "fullName"], ["contacto", "contact"], ["igreja", "church", "church"], ["church_id", "church", "church"], ["celula", "cell"], ["nome_do_lider_de_celula", "cellLeaderName"], ["fez_escola_de_fundacao", "didFoundation", "checkbox"], ["e_lider", "isLeader", "checkbox"], ["motivo_de_fazer_alec", "alecReason", "textarea"], ["estado", "status", "select", alecRegistrationStatuses], ["observacoes", "observations", "textarea"]],
  alecScore: [["nome_completo", "fullName"], ["contacto", "contact"], ["igreja", "church", "church"], ["church_id", "church", "church"], ["celula", "cell"], ["fase_1_aula_1", "phase1", "number"], ["fase_1_aula_2", "phase1", "number"], ["fase_1_aula_3", "phase1", "number"], ["fase_1_aula_4", "phase1", "number"], ["fase_2_aula_1", "phase2", "number"], ["fase_2_aula_2", "phase2", "number"], ["fase_2_aula_3", "phase2", "number"], ["terminou", "finished", "checkbox"], ["faixa_certificado_pago", "certificateBandPaid", "checkbox"], ["certificado_emitido", "certificateIssued", "checkbox"], ["estado", "status", "select", alecScoreStatuses]],
  churchReport: [["semana", "week"], ["data_inicio", "startDate", "date"], ["data_fim", "endDate", "date"], ["culto", "worshipService", "select", ["Domingo", "Quarta-feira", "Outro"]], ["church_id", "church", "church"], ["celula", "cell"], ["titulo_do_lider", "leaderTitle"], ["nome_do_lider", "leaderName"], ["att", "attendance", "number"], ["ft", "firstTimeShort", "number"], ["nc", "newConvertsShort", "number"], ["rs", "RS", "number"], ["total_ft_reached", "totalFirstTime", "number"], ["comentarios", "comments", "textarea"], ["submetido_por", "submittedBy"], ["estado", "status", "select", churchReportStatuses]],
  cellReport: [["semana", "week"], ["data_inicio", "startDate", "date"], ["data_fim", "endDate", "date"], ["church_id", "church", "church"], ["celula", "cell"], ["titulo_do_lider", "leaderTitle"], ["nome_do_lider", "leaderName"], ["att", "attendance", "number"], ["ft", "firstTimeShort", "number"], ["nc", "newConvertsShort", "number"], ["oferta", "offering", "number"], ["rs", "RS", "number"], ["observacoes", "observations", "textarea"], ["submetido_por", "submittedBy"], ["avaliado_por", "evaluatedBy"], ["validado_por", "validatedBy"], ["estado", "status", "select", cellReportStatuses]],
  cellLeader: [["nome_completo", "fullName"], ["contacto", "contact"], ["titulo", "treatment"], ["igreja", "church", "church"], ["church_id", "church", "church"], ["celula", "cell"], ["e_lider_actual", "actualLeader", "checkbox"], ["veio_do_alec", "cameFromAlec", "checkbox"], ["alec_concluido", "alecFinished", "checkbox"], ["faixa_certificado_pago", "certificateBandPaid", "checkbox"], ["estado", "status", "select", cellLeaderStatuses], ["supervisor", "supervisor"], ["observacoes", "observations", "textarea"]],
  cellEvaluation: [["report_id", "reports"], ["avaliador", "evaluator"], ["data_da_avaliacao", "evaluationDate", "date"], ["classificacao", "classification", "select", classifications], ["pontos_fortes", "strengths", "textarea"], ["pontos_a_melhorar", "improvements", "textarea"], ["acao_recomendada", "recommendedAction", "textarea"], ["precisa_followup", "needsFollowup", "checkbox"], ["church_id", "church", "church"], ["estado", "status", "select", evaluationStatuses]],
  finalValidation: [["report_id", "reports"], ["validado_por", "validatedBy"], ["data_validacao", "date", "date"], ["decisao", "decision", "select", ["Validado", "Devolver para Correção", "Rejeitado"]], ["comentario_final", "finalComment", "textarea"], ["church_id", "church", "church"], ["estado_final", "finalStatus", "select", validationStatuses]],
  inventoryItem: [["nome_do_item", "itemName"], ["categoria", "category", "select", inventoryCategories], ["quantidade", "quantity", "number"], ["estado", "status", "select", inventoryStatuses], ["localizacao", "location"], ["departamento_responsavel", "responsibleDepartment"], ["church_id", "church", "church"], ["data_de_entrada", "entryDate", "date"], ["valor_unitario", "unitValue", "number"], ["valor_total", "totalValue", "number"], ["serial_number", "serialNumber"], ["observacoes", "observations", "textarea"]],
  venueAcquisition: [["codigo_do_item", "itemCode"], ["descricao", "description"], ["categoria", "category", "select", inventoryCategories], ["quantidade", "quantity", "number"], ["serial_number", "serialNumber"], ["estado", "status", "select", inventoryStatuses], ["data_de_compra_ou_entrada", "purchaseEntryDate", "date"], ["valor_unitario", "unitValue", "number"], ["valor_total", "totalValue", "number"], ["fornecedor", "supplier"], ["recebido_por", "receivedBy"], ["comprovativo_ou_factura", "invoiceProof"], ["church_id", "church", "church"], ["observacoes", "observations", "textarea"]],
  venueStaffEquipment: [["nome_do_funcionario", "staffName"], ["departamento", "department"], ["church_id", "church", "church"], ["data_onboarding", "onboardingDate", "date"], ["dispositivo", "device"], ["modelo", "model"], ["device_id", "deviceId"], ["product_id", "productId"], ["data_de_entrega", "deliveryDate", "date"], ["estado_na_entrega", "conditionAtDelivery", "select", inventoryStatuses], ["estado_actual", "currentCondition", "select", inventoryStatuses], ["responsavel_pela_entrega", "deliveredBy"], ["assinatura_confirmada", "signatureConfirmed", "checkbox"], ["data_de_devolucao", "returnDate", "date"], ["estado", "status", "select", ["Activo", "Inactivo"]], ["observacoes", "observations", "textarea"]],
  venueMaintenance: [["item", "item"], ["categoria", "category", "select", inventoryCategories], ["quantidade", "quantity", "number"], ["problema_reportado", "reportedProblem", "textarea"], ["estado_antes", "conditionBefore", "select", inventoryStatuses], ["estado_depois", "conditionAfter", "select", inventoryStatuses], ["custo_da_reparacao", "repairCost", "number"], ["tecnico_ou_responsavel", "technicianResponsible"], ["data_de_envio", "sentDate", "date"], ["data_de_retorno", "returnedDate", "date"], ["church_id", "church", "church"], ["estado", "status", "select", repairStatuses], ["observacoes", "observations", "textarea"]],
  venueMovement: [["item", "item"], ["quantidade", "quantity", "number"], ["origem", "originPlace"], ["destino", "destination"], ["departamento_solicitante", "requestingDepartment"], ["pessoa_responsavel", "responsiblePerson"], ["data_de_saida", "exitDate", "date"], ["data_prevista_de_retorno", "expectedReturnDate", "date"], ["data_real_de_retorno", "actualReturnDate", "date"], ["estado_ao_sair", "conditionOut", "select", inventoryStatuses], ["estado_ao_voltar", "conditionBack", "select", inventoryStatuses], ["aprovado_por", "approvedBy"], ["church_id", "church", "church"], ["estado", "status", "select", movementStatuses], ["observacoes", "observations", "textarea"]],
  venueSpace: [["nome_do_espaco", "spaceName"], ["localizacao", "location"], ["church_id", "church", "church"], ["capacidade", "capacity", "number"], ["tipo", "spaceType", "select", venueTypes], ["equipamentos_fixos", "fixedEquipment", "textarea"], ["responsavel", "responsible"], ["estado", "status", "select", venueStatuses], ["observacoes", "observations", "textarea"]],
  venueChecklist: [["data_do_culto", "serviceDate", "date"], ["church_id", "church", "church"], ["espaco", "space"], ["tipo_de_culto_ou_evento", "serviceEventType"], ["som_verificado", "soundChecked", "checkbox"], ["luzes_verificadas", "lightsChecked", "checkbox"], ["ac_verificado", "acChecked", "checkbox"], ["projector_verificado", "projectorChecked", "checkbox"], ["cadeiras_organizadas", "chairsOrganized", "checkbox"], ["pulpito_pronto", "pulpitReady", "checkbox"], ["cameras_prontas", "camerasReady", "checkbox"], ["microfones_prontos", "microphonesReady", "checkbox"], ["limpeza_feita", "cleaningDone", "checkbox"], ["responsavel", "responsible"], ["estado", "status", "select", checklistStatuses], ["observacoes", "observations", "textarea"]],
  requisition: [["title", "reqTitle"], ["requisition_type", "reqType", "select", (window.CERequisitions?.TYPES || [])], ["department_name", "reqDepartment"], ["church_id", "church", "church"], ["description", "reqDescription", "textarea"], ["justification", "reqJustification", "textarea"], ["estimated_amount", "reqEstimated", "number"], ["urgency", "reqUrgency", "select", (window.CERequisitions?.URGENCY || [])], ["needed_by_date", "reqNeededBy", "date"], ["supplier_or_vendor", "reqSupplier"], ["quotation_number", "reqQuotation"]],
  staffProfile: [["full_name", "staffFullName"], ["title", "treatment", "select", treatmentOptions], ["gender", "gender", "select", ["Feminino", "Masculino"]], ["phone", "phone"], ["whatsapp", "whatsapp"], ["email", "email", "email"], ["church_id", "church", "church"], ["department_name", "reqDepartment"], ["role_title", "staffRoleTitle"], ["supervisor_name", "staffSupervisor"], ["start_date", "staffStartDate", "date"], ["employment_type", "staffEmploymentType", "select", (window.CEStaffHr?.EMPLOYMENT_TYPES || [])], ["salary_or_allowance", "staffSalary", "number"], ["payment_frequency", "staffPaymentFreq", "select", (window.CEStaffHr?.PAYMENT_FREQUENCIES || [])], ["payment_method", "method", "select", paymentMethods], ["status", "status", "select", (window.CEStaffHr?.STAFF_STATUSES || [])], ["notes", "notes", "textarea"]]
};

function getCollection(type) {
  if (type === "firstTimer") return state.firstTimers;
  if (type === "member") return state.members;
  if (type === "foundationStudent") return state.foundationStudents;
  if (type === "finance") return state.finance;
  if (type === "church") return state.churches;
  if (type === "cell") return state.cells;
  if (type === "user") return state.users;
  if (type === "requisition") return state.requisitions;
  if (type === "staffProfile") return state.staffProfiles;
  if (type === "staffSalary") return state.staffSalaries;
  if (type === "staffPerformance") return state.staffPerformance;
  if (type === "baptism") return state.sacraments.baptisms;
  if (type === "marriage") return state.sacraments.marriages;
  if (type === "baby") return state.sacraments.babies;
  if (type === "fevoConfig") return state.fevo.weeklyConfigurations;
  if (type === "fevoReport") return state.fevo.reports;
  if (type === "fevoNoReport") return state.fevo.noReports;
  if (type === "fevoWeeklyReport") return state.fevo.weeklyReports;
  if (type === "prisonLocation") return state.prisonMinistry.prisons;
  if (type === "prisonService") return state.prisonMinistry.services;
  if (type === "prisonFoundation") return state.prisonMinistry.foundationStudents;
  if (type === "prisonAgenda") return state.prisonMinistry.weeklyAgenda;
  if (type === "prisonReport") return state.prisonMinistry.reports;
  if (type === "materialCatalogue") return state.ministryMaterials.catalogue;
  if (type === "materialSale") return state.ministryMaterials.sales;
  if (type === "materialDistribution") return state.ministryMaterials.distributions;
  if (type === "materialStock") return state.ministryMaterials.weeklyStock;
  if (type === "materialFund") return state.ministryMaterials.freeFunds;
  if (type === "materialReport") return state.ministryMaterials.reports;
  if (type === "alecRegistration") return state.cellLeadership.alecRegistrations;
  if (type === "alecScore") return state.cellLeadership.alecScores;
  if (type === "churchReport") return state.cellLeadership.churchReports;
  if (type === "cellReport") return state.cellLeadership.cellReports;
  if (type === "cellLeader") return state.cellLeadership.leaders;
  if (type === "cellEvaluation") return state.cellLeadership.evaluations;
  if (type === "finalValidation") return state.cellLeadership.validations;
  if (type === "cellActionPlan") return state.cellLeadership.actionPlans || [];
  if (type === "cellGroup") return state.cellGroups || [];
  if (type === "cellRegistry") return state.cellRegistry || [];
  if (type === "inventoryItem") return state.venueInventory.inventory;
  if (type === "venueAcquisition") return state.venueInventory.acquisitions;
  if (type === "venueStaffEquipment") return state.venueInventory.staffEquipment;
  if (type === "venueMaintenance") return state.venueInventory.maintenance;
  if (type === "venueMovement") return state.venueInventory.movements;
  if (type === "venueSpace") return state.venueInventory.venues;
  if (type === "venueChecklist") return state.venueInventory.checklists;
  if (type === "venueReport") return state.venueInventory.reports || [];
  return state[type] || [];
}

function openForm(type, id = null) {
  if (type === "foundationStudent") return openFoundationStudentForm(id);
  if (type === "church") return openChurchDrawer(id ? "form" : "form", id);
  if (type === "finance" && id) return openFinanceDrawer("edit", id);
  if (type === "staffProfile") {
    modalMode = id ? "edit" : "create";
    modalType = type;
    modalRecordId = id;
    const record = id ? getCollection(type).find((item) => item.id === id) : {};
    byId("modalEyebrow").textContent = modalMode === "edit" ? L("edit") : L("add");
    byId("modalTitle").textContent = formTitle(type);
    byId("modalFields").innerHTML = renderStaffProfileForm(record, modalMode);
    bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
    requestAnimationFrame(() => mountRelationalControls(byId("entryForm")));
    return;
  }
  modalMode = id ? "edit" : "create";
  modalType = type;
  modalRecordId = id;
  const record = id ? getCollection(type).find((item) => item.id === id) : {};
  byId("modalEyebrow").textContent = modalMode === "edit" ? L("edit") : L("add");
  byId("modalTitle").textContent = type === "finance" && !id ? L("addFinance") : formTitle(type);
  if (type === "finance" && !id) {
    byId("modalFields").innerHTML = renderFinanceAddForm(record);
  } else {
    const schema = type === "finance" ? getFinanceSchema("create") : formSchemas[type];
    byId("modalFields").innerHTML = schema.map((field) => fieldControl(field, record)).join("");
  }
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
  requestAnimationFrame(() => mountRelationalControls(byId("entryForm")));
}

function formTitle(type) {
  const map = { firstTimer: L("firstTimers"), member: L("members"), foundationStudent: L("foundationSchool"), finance: L("finance"), church: L("churches"), cell: L("cellLeadership"), user: L("usersRoles"), requisition: L("requisitions"), staffProfile: L("staffHr"), baptism: L("baptismTab"), marriage: L("marriageTab"), baby: L("babyTab"), fevoConfig: L("weeklyConfiguration"), fevoReport: L("weeklyReports"), fevoNoReport: L("groupsWithoutReport"), fevoWeeklyReport: L("weeklyReports"), prisonLocation: L("prisonsLocations"), prisonService: L("prisonServices"), prisonFoundation: L("foundationSchool"), prisonAgenda: L("weeklyAgenda"), prisonReport: L("ministryReports"), materialCatalogue: L("catalogue"), materialSale: L("sales"), materialDistribution: L("churchDistribution"), materialStock: L("weeklyStock"), materialFund: L("freeDistributionFunds"), materialReport: L("ministryReports"), alecRegistration: L("alecRegistration"), alecScore: L("alecScores"), churchReport: L("churchReports"), cellReport: L("cellReports"), cellLeader: L("cellLeaders"), cellEvaluation: L("cellEvaluation"), finalValidation: L("finalValidation"), inventoryItem: L("generalInventory"), venueAcquisition: L("newAcquisitions"), venueStaffEquipment: L("staffEquipment"), venueMaintenance: L("maintenanceRepairs"), venueMovement: L("loansMovements"), venueSpace: L("venuesRooms"), venueChecklist: L("serviceChecklist") };
  return map[type] || type;
}

function fieldControl([name, labelKey, inputType = "text", options = []], record = {}) {
  const label = L(labelKey) || labelKey;
  const value = record[name] ?? "";
  const fieldOptions = Array.isArray(options) ? options : (options || {});
  const enrichedRecord = { ...record };
  if (enrichedRecord.church_id && !enrichedRecord.province) {
    const linkedChurch = findChurchById(relationalChurches(), enrichedRecord.church_id);
    if (linkedChurch) {
      enrichedRecord.province = linkedChurch.province;
      enrichedRecord.city = linkedChurch.city;
      enrichedRecord.district_or_area = linkedChurch.district_or_area || enrichedRecord.district_or_area;
    }
  }
  if ((name === "provincia" || name === "cidade") && !enrichedRecord.province && enrichedRecord.provincia) {
    enrichedRecord.province = enrichedRecord.provincia;
    enrichedRecord.city = enrichedRecord.cidade;
  }
  if (inputType === "province") {
    const cityTarget = name === "provincia" ? "cidade" : "city";
    return provinceSelect(name, label, enrichedRecord, { ...relationalFormOptions(), cityTarget, attrs: "data-province-field" });
  }
  if (inputType === "city") {
    const provinceField = name === "cidade" ? "provincia" : "province";
    return citySelect(name, label, enrichedRecord, { ...relationalFormOptions(), provinceSource: provinceField, attrs: `data-city-field data-province-link="${provinceField}"` });
  }
  if (inputType === "church") {
    const colClass = fieldOptions.showInfoCard || fieldOptions.fullWidth ? "col-12" : "col-md-6";
    return churchSelect(name, label, enrichedRecord, { ...relationalFormOptions(), ...fieldOptions, colClass });
  }
  if (inputType === "parentChurch") {
    const currentId = record.id || churchDrawerRecordId || "";
    const churches = getChurchOptions(relationalChurches().filter((church) => church.id !== currentId));
    return `
      <div class="col-md-6">
        <label class="form-label">${label}</label>
        <select name="${name}" class="form-select relational-church-select">
          <option value="">${L("selectChurch")}</option>
          ${churches.map((church) => `<option value="${church.id}" ${value === church.id ? "selected" : ""}>${churchOptionLabel(church)}</option>`).join("")}
        </select>
      </div>`;
  }
  if (inputType === "prison") {
    return `<div class="col-md-6"><label class="form-label">${label}</label><select name="${name}" class="form-select">${state.prisonMinistry.prisons.map((p) => `<option value="${p.id}" ${value === p.id ? "selected" : ""}>${p.nome_da_prisao}</option>`).join("")}</select></div>`;
  }
  if (inputType === "material") {
    return `<div class="col-md-6"><label class="form-label">${label}</label><select name="${name}" class="form-select">${state.ministryMaterials.catalogue.map((m) => `<option value="${m.titulo_do_material}" ${value === m.titulo_do_material ? "selected" : ""}>${m.titulo_do_material}</option>`).join("")}</select></div>`;
  }
  if (inputType === "cellSelect") {
    return `<div class="col-md-6"><label class="form-label">${label}</label><select name="${name}" class="form-select"><option value="">${L("all")}</option>${state.cells.map((c) => `<option value="${c.id}" ${value === c.id ? "selected" : ""}>${c.nome_da_celula}</option>`).join("")}</select></div>`;
  }
  if (inputType === "select") {
    const selectOptions = Array.isArray(options) ? options : [];
    return `<div class="col-md-6"><label class="form-label">${label}</label><select name="${name}" class="form-select">${selectOptions.map((o) => `<option value="${o}" ${value === o ? "selected" : ""}>${STATUS_KEYS[o] ? statusText(o) : o}</option>`).join("")}</select></div>`;
  }
  if (inputType === "checkbox") {
    return `<div class="col-md-6 d-flex align-items-end"><label class="form-check"><input name="${name}" type="checkbox" class="form-check-input" ${value ? "checked" : ""}> <span class="form-check-label">${label}</span></label></div>`;
  }
  if (inputType === "textarea" || inputType === "textarea-optional") {
    const optional = inputType === "textarea-optional" ? ` <span class="field-optional">(${L("optional")})</span>` : "";
    return `<div class="col-12"><label class="form-label">${label}${optional}</label><textarea name="${name}" class="form-control" rows="3">${value || ""}</textarea></div>`;
  }
  if (inputType === "file" || inputType === "file-optional") {
    const optional = inputType === "file-optional" ? ` <span class="field-optional">(${L("optional")})</span>` : "";
    return `<div class="col-12"><label class="form-label">${label}${optional}</label><input name="${name}" type="file" class="form-control" accept="image/*,.pdf"></div>`;
  }
  if (inputType === "readonly") {
    let display = value || "-";
    if (name === "verified_at" || name === "created_at") display = formatDateTime(value);
    else if (name === "source_type") display = contributorSourceLabel(value);
    return `<div class="col-md-6"><label class="form-label">${label}</label><input class="form-control" value="${display}" readonly tabindex="-1"></div>`;
  }
  return `<div class="col-md-6"><label class="form-label">${label}</label><input name="${name}" type="${inputType}" class="form-control" value="${value || ""}"></div>`;
}

function submitForm(form) {
  const schema = modalType === "finance" ? getFinanceSchema(modalMode === "edit" ? "edit" : "create") : formSchemas[modalType];
  const data = Object.fromEntries(new FormData(form).entries());
  if (modalType === "requisition") {
    schema.forEach(([name, , inputType]) => {
      if (inputType === "checkbox") data[name] = new FormData(form).has(name);
    });
    enrichRecordChurchFields(data);
    const dept = (state.departments || []).find((d) => d.name === data.department_name);
    const now = new Date().toISOString();
    if (modalMode === "edit") {
      const index = state.requisitions.findIndex((item) => item.id === modalRecordId);
      state.requisitions[index] = { ...state.requisitions[index], ...data, updated_at: now };
    } else {
      state.requisitions = state.requisitions || [];
      state.requisitions.push({
        id: `req-${Date.now()}`,
        request_number: window.CERequisitions?.nextRequestNumber(state.requisitions) || `REQ-${Date.now()}`,
        requested_by_user_id: activeUser.id,
        requested_by_name: activeUser.name,
        department_id: dept?.id || "",
        church_name: churchName(data.church_id || activeUser.church_id),
        currency: "MZN",
        attachments: [],
        status: "Rascunho",
        created_at: now,
        updated_at: now,
        reviewed_by: "", reviewed_at: "", review_notes: "", sent_to_main_pastor_at: "",
        approved_by: "", approved_at: "", approval_notes: "",
        rejected_by: "", rejected_at: "", rejection_reason: "",
        resources_released_by: "", resources_released_at: "", amount_released: 0,
        finance_record_id: "", inventory_item_id: "",
        ...data,
        church_id: data.church_id || activeUser.church_id
      });
    }
    saveState(`${modalMode} requisition`);
    bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
    if (activeRoute === "requisitions") renderRequisitions();
    return;
  }
  if (modalType === "staffProfile") {
    const staffLib = window.CEStaffHr;
    const canSalary = staffLib?.canViewSalary(activeUser);
    const staffSchema = (staffLib?.staffProfileSections(canSalary) || []).flatMap((section) => section.fields);
    staffSchema.forEach(([name, , inputType]) => {
      if (inputType === "checkbox") data[name] = new FormData(form).has(name);
    });
    enrichRecordChurchFields(data);
    data.church_name = churchName(data.church_id);
    if (canSalary) data.salary_or_allowance = Number(data.salary_or_allowance || 0);
    const today = new Date().toISOString().slice(0, 10);
    if (modalMode === "edit") {
      const index = state.staffProfiles.findIndex((item) => item.id === modalRecordId);
      state.staffProfiles[index] = staffLib.enrichStaffProfile({ ...state.staffProfiles[index], ...data, updated_at: today });
    } else {
      state.staffProfiles = state.staffProfiles || [];
      state.staffProfiles.push(staffLib.enrichStaffProfile({
        id: `staff-${Date.now()}`,
        user_id: "",
        created_at: today,
        updated_at: today,
        bank_or_mobile_details: "",
        date_of_birth: "",
        marital_status: "Por Confirmar",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        national_id_number: "",
        nuit: "",
        bank_name: "",
        bank_account_number: "",
        mobile_money_number: "",
        contract_start_date: "",
        contract_end_date: "",
        probation_end_date: "",
        profile_photo: "",
        ...data
      }));
    }
    saveState(`${modalMode} staffProfile`);
    bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
    if (activeRoute === "staffHr") renderStaffHr();
    return;
  }
  schema.forEach(([name, , inputType]) => {
    if (inputType === "checkbox") data[name] = new FormData(form).has(name);
  });
  enrichRecordChurchFields(data);
  const collection = getCollection(modalType);
  if (modalMode === "edit") {
    const index = collection.findIndex((item) => item.id === modalRecordId);
    collection[index] = { ...collection[index], ...data, updated_by: activeUser.name, updated_at: new Date().toISOString().slice(0, 10), status: data.estado || data.status || collection[index].status };
    saveState(`Updated ${modalType}`);
  } else {
    const idPrefix = modalType.slice(0, 3);
    const nowIso = new Date().toISOString();
    const today = nowIso.slice(0, 10);
    const record = {
      id: `${idPrefix}-${Date.now()}`,
      church_id: data.church_id || data.igreja_responsavel || data.igreja || activeUser.church_id,
      created_by: activeUser.name,
      updated_by: activeUser.name,
      created_at: nowIso,
      updated_at: today,
      status: data.estado || data.status || "Activo",
      ...data
    };
    if (modalType === "finance") {
      record.estado = FINANCE_STATUS_PENDING;
      record.recebido_por = activeUser.name;
      record.verificado_por = "";
      record.verified_at = "";
      record.comentario_verificacao = "";
      record.motivo_rejeicao = "";
      record.status = record.estado;
      record.source_type = data.source_type || "manual";
      record.member_id = data.member_id || "";
      record.contributor_id = data.contributor_id || "";
      record.first_timer_id = data.first_timer_id || "";
      record.partner_id = data.partner_id || "";
      record.whatsapp = data.whatsapp || "";
      record.igreja = data.igreja || churchName(record.church_id);
      record.imagem_envelope_ou_pop = data.imagem_do_envelope || "";
      record.imagem_do_envelope = record.imagem_envelope_ou_pop;
      if (new FormData(form).has("save_as_contributor") && record.source_type === "manual") {
        if (!Array.isArray(state.contributors)) state.contributors = [];
        const contributorId = `contrib-${Date.now()}`;
        state.contributors.push({
          id: contributorId,
          nome: record.nome,
          apelido: record.apelido,
          telefone: record.telefone,
          whatsapp: record.whatsapp,
          email: record.email,
          endereco: record.endereco,
          celula: record.celula,
          church_id: record.church_id,
          igreja: record.igreja,
          created_at: nowIso
        });
        record.contributor_id = contributorId;
        record.source_type = "contributor";
      }
      delete record.save_as_contributor;
    }

    if (modalType === "church") record.church_id = record.id;
    if (modalType === "cell") {
      record.presencas = [{ data: new Date().toISOString().slice(0, 10), total: 0 }];
      record.almas_ganhas = [];
      record.membros = [];
    }
    collection.push(record);
    saveState(`Created ${modalType}`);
  }
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
  form.reset();
  setRoute(activeRoute);
}

function openView(type, id) {
  if (type === "church") return openChurchDrawer("view", id);
  if (type === "finance") return openFinanceDrawer("view", id);
  if (type === "staffProfile") return openStaffProfileView(id);
  if (type === "foundationStudent") {
    const record = getCollection(type).find((item) => item.id === id);
    byId("modalEyebrow").textContent = L("view");
    byId("modalTitle").textContent = L("foundationSchool");
    byId("modalFields").innerHTML = renderFoundationStudentForm(record, "view");
    modalType = null;
    return bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
  }
  const record = getCollection(type).find((item) => item.id === id);
  byId("modalEyebrow").textContent = L("view");
  byId("modalTitle").textContent = formTitle(type);
  byId("modalFields").innerHTML = `
    <div class="col-12">${detailGrid(record)}</div>
    ${type === "firstTimer" ? `<div class="col-12"><h5>${L("followupTimeline")}</h5>${followupTimeline(id)}</div>` : ""}
  `;
  modalType = null;
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function detailGrid(record) {
  return `<div class="detail-grid">${Object.entries(record).filter(([key]) => !["id"].includes(key)).map(([key, value]) => `<div><span>${labelFor(key)}</span><strong>${Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? yesNo(value) : value || "-"}</strong></div>`).join("")}</div>`;
}

function followupTimeline(firstTimerId) {
  const logs = state.followUps.filter((item) => item.first_timer_id === firstTimerId);
  return logs.length ? `<div class="timeline">${logs.map((log) => `<div><span>${log.data_do_contacto} - ${log.metodo}</span><strong>${log.resultado}</strong><p>${log.notas || ""}</p></div>`).join("")}</div>` : `<p class="text-secondary">${L("empty")}</p>`;
}

function openFollowup(id) {
  modalType = "followup";
  modalRecordId = id;
  byId("modalEyebrow").textContent = L("updateFollowup");
  byId("modalTitle").textContent = L("followUp");
  byId("modalFields").innerHTML = [
    ["data_do_contacto", "contactDate", "date"],
    ["metodo", "contactMethod", "select", ["Chamada", "WhatsApp", "SMS", "Presencial"]],
    ["resultado", "result", "textarea"],
    ["proximo_passo", "nextStep"],
    ["proxima_data_de_contacto", "nextContactDate", "date"],
    ["estado_do_seguimento", "followupState", "select", followupStatuses],
    ["notas", "notes", "textarea"],
    ["actualizado_por", "updatedBy"]
  ].map((field) => fieldControl(field, { actualizado_por: activeUser.name })).join("");
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).show();
}

function submitFollowup(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const person = state.firstTimers.find((item) => item.id === modalRecordId);
  if (person) {
    person.estado_do_seguimento = data.estado_do_seguimento || person.estado_do_seguimento;
    state.followUps.push({ id: `fu-${Date.now()}`, first_timer_id: person.id, church_id: person.church_id, ...data });
    saveState(`Updated follow-up for ${fullName(person)}`);
  }
  bootstrap.Modal.getOrCreateInstance(byId("entryModal")).hide();
  setRoute(activeRoute);
}

function quickAction(action, type, id) {
  if (type === "financeApprovedReq") {
    const disb = window.CEFinanceDisbursements;
    const record = (state.requisitions || []).find((r) => r.id === id);
    if (!record) return;
    if (action === "view") return openRequisitionDrawer(id);
    if (action === "releaseResources") return openFinanceReleaseDrawer(id, "release");
    if (action === "partialPayment") return openFinanceReleaseDrawer(id, "partial");
    if (action === "markPaid" && disb?.applyMarkPaid) {
      const result = disb.applyMarkPaid(state, activeUser, id, {});
      if (result.ok) {
        saveState(`Mark paid ${record.request_number}`);
        alert(L("finMarkPaidSuccess"));
        return setRoute(activeRoute);
      }
      return;
    }
    if (action === "sendToInventory" && window.CERequisitions) {
      const result = window.CERequisitions.applyWorkflowAction(state, activeUser, id, "sendToInventory", {});
      if (result.ok) {
        saveState(`Send to inventory ${record.request_number}`);
        alert(L("finSentToInventorySuccess"));
        return setRoute(activeRoute);
      }
    }
    return;
  }
  if (type === "requisition" && window.CERequisitions) {
    const record = (state.requisitions || []).find((r) => r.id === id);
    if (!record) return;
    if (action === "view") return openRequisitionDrawer(id);
    if (action === "approve" || action === "reject") return openRequisitionDrawer(id, action);
    if (action === "edit") return openForm("requisition", id);
    if (action === "releaseResources") return openFinanceReleaseDrawer(id, "release");
    const result = window.CERequisitions.applyWorkflowAction(state, activeUser, id, action, {});
    if (result.ok) {
      saveState(`${action} requisition ${record.request_number}`);
      return setRoute(activeRoute);
    }
    return;
  }
  if (action === "viewGroupCells") {
    cellRegistryFilter.groupId = id;
    return setRoute("cellCellsList");
  }
  if (action === "clearCellFilter") {
    cellRegistryFilter.groupId = null;
    return setRoute("cellCellsList");
  }
  if (action === "updateReport") return alert(`${L("updateCellReport")}: ${id}`);
  if (action === "staffMessage" && type === "staffProfile") {
    const record = (state.staffProfiles || []).find((item) => item.id === id);
    if (!record) return;
    const phone = String(record.whatsapp || record.phone || "").replace(/\D/g, "");
    if (!phone) return alert(lang === "pt" ? "Sem contacto disponível." : "No contact available.");
    const message = lang === "pt"
      ? `Feliz aniversário, ${record.full_name}! Que Deus abençoe o seu dia especial.`
      : `Happy birthday, ${record.full_name}! May God bless your special day.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    return;
  }
  if (action === "view") return openView(type, id);
  if (action === "status" && type === "church") return openChurchDrawer("status", id);
  if (action === "export" && type === "church") return alert(`${L("exportChurch")}: ${churchName(id)}`);
  if (action === "viewSubmission" && type === "finance") return openPublicSubmissionDrawer("viewSubmission", id);
  if (action === "verifyGroup" && type === "finance") return openPublicSubmissionDrawer("verifyGroup", id);
  if (action === "rejectGroup" && type === "finance") return openPublicSubmissionDrawer("rejectGroup", id);
  if (action === "edit" && type === "finance") return openFinanceDrawer("edit", id);
  if (action === "markClass" && type === "foundationStudent") return openFoundationMarkClass(id);
  if (action === "score" && type === "foundationStudent") return openFoundationScore(id);
  if (action === "edit" || action === "moveChurch" || action === "status") return openForm(type, id);
  if (action === "followup") return openFollowup(id);
  if (action === "submit" || action === "approve") {
    const record = getCollection(type).find((item) => item.id === id);
    if (!record) return;
    record.status = action === "submit" ? "Submetido" : "Aprovado";
    record.estado = record.status;
    record.updated_by = activeUser.name;
    record.updated_at = new Date().toISOString().slice(0, 10);
    saveState(`${action} ${type}`);
    return setRoute(activeRoute);
  }
  if (action === "verify" || action === "reject") {
    if (type === "finance") return openFinanceDrawer(action, id);
    const record = getCollection(type).find((item) => item.id === id);
    if (!record) return;
    if (type === "materialSale") {
      record.estado = action === "verify" ? "Confirmado" : "Rejeitado";
      record.status = record.estado;
    } else if (type.startsWith("fevo")) {
      record.status = action === "verify" ? "Aprovado" : "Rejeitado";
      record.estado = record.status;
    } else {
      record.estado = action === "verify" ? FINANCE_STATUS_VERIFIED : FINANCE_STATUS_REJECTED;
      record.status = record.estado;
    }
    record.updated_by = activeUser.name;
    record.updated_at = new Date().toISOString().slice(0, 10);
    saveState(`${action} ${type}`);
    return setRoute(activeRoute);
  }
  if (action === "graduate") {
    const collection = getCollection(type);
    const index = collection.findIndex((item) => item.id === id);
    if (index < 0) return;
    collection[index] = applyFoundationCalculations({
      ...collection[index],
      graduado: true,
      updated_at: new Date().toISOString().slice(0, 10)
    }, true);
    saveState("Graduated student");
    return setRoute(activeRoute);
  }
  if (action === "export") return alert(`${L("export")}: ${id}`);
}

function enrollFirstTimer(id) {
  const person = state.firstTimers.find((item) => item.id === id);
  if (!person) return;
  state.foundationStudents.push(applyFoundationCalculations({
    id: `fs-${Date.now()}`,
    first_timer_id: person.id,
    member_id: "",
    church_id: person.church_id,
    nome: person.nome,
    apelido: person.apelido,
    telefone: person.telefone,
    celula: person.celula_preferida || "",
    mes_de_inscricao: new Date().toISOString().slice(0, 7),
    class_attendance: defaultFoundationAttendance(),
    nota_exame: 0,
    pratica_evangelismo: false,
    numero_de_almas_ganhas: 0,
    aprovado: false,
    graduado: false,
    certificado_emitido: false,
    notes: "",
    created_at: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString().slice(0, 10)
  }, true));
  person.estado_do_seguimento = "Enrolled in Foundation School";
  saveState(`Enrolled ${fullName(person)}`);
  renderFoundation();
}

document.addEventListener("click", (event) => {
  const langButton = event.target.closest("[data-lang]");
  if (langButton) return applyLanguage(langButton.dataset.lang);
  const groupToggle = event.target.closest(".nav-group-toggle");
  if (groupToggle) {
    const key = groupToggle.closest(".nav-group")?.dataset.navGroup;
    if (key) toggleSidebarGroup(key);
    return;
  }
  const cellParentToggle = event.target.closest(".nav-cell-parent");
  if (cellParentToggle) {
    toggleSidebarGroup(CELL_NAV.parentKey);
    return;
  }
  const cellAreaToggle = event.target.closest(".nav-cell-area-toggle");
  if (cellAreaToggle) {
    const key = cellAreaToggle.closest("[data-nav-group]")?.dataset.navGroup;
    if (key && key !== "departments") toggleSidebarGroup(key);
    return;
  }
  const moduleNavToggle = event.target.closest("[data-module-nav-toggle]");
  if (moduleNavToggle) {
    const key = moduleNavToggle.dataset.moduleNavToggle;
    if (key) toggleModuleNav(key);
    return;
  }
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) return setRoute(routeButton.dataset.route);
  const lockedRoute = event.target.closest("[data-locked-route]");
  if (lockedRoute) return;
  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    scrollButton.closest(".department-tabs, .tab-strip, .module-tabs")?.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === scrollButton));
    const scrollTarget = scrollButton.dataset.scroll;
    scrollContentTo(scrollTarget);
    triggerScrollTabParallax(scrollTarget);
    return;
  }
  const openChurchForm = event.target.closest("[data-open-church-form]");
  if (openChurchForm) return openChurchDrawer("form");
  const servicePreset = event.target.closest("[data-church-service-preset]");
  if (servicePreset) {
    churchFormServiceTimes = servicePreset.dataset.churchServicePreset === "hq" ? buildHqServicePreset() : buildGeneralServicePreset();
    refreshChurchServiceTimesRows();
    return;
  }
  const serviceAdd = event.target.closest("[data-church-service-add]");
  if (serviceAdd) {
    churchFormServiceTimes.push({
      id: makeServiceTimeId(),
      day_of_week: "Domingo",
      service_name: "",
      time: "09:00",
      service_type: "Presencial",
      is_active: true,
      notes: ""
    });
    refreshChurchServiceTimesRows();
    return;
  }
  const serviceRemove = event.target.closest("[data-church-service-remove]");
  if (serviceRemove) {
    const index = Number(serviceRemove.dataset.churchServiceRemove);
    if (!Number.isNaN(index)) {
      churchFormServiceTimes.splice(index, 1);
      refreshChurchServiceTimesRows();
    }
    return;
  }
  const selectContributor = event.target.closest("[data-finance-select-contributor]");
  if (selectContributor) {
    const candidate = financeContributorUI.results[Number(selectContributor.dataset.financeSelectContributor)];
    if (candidate) applyContributorToFinanceForm(candidate);
    return;
  }
  const newContributor = event.target.closest("[data-finance-new-contributor]");
  if (newContributor) {
    clearFinanceContributorLink(true);
    byId("financeContributorSearch")?.focus();
    return;
  }
  const duplicateLink = event.target.closest("[data-finance-link-duplicate]");
  if (duplicateLink) {
    const candidate = financeContributorUI.duplicateMatches?.[Number(duplicateLink.dataset.financeLinkDuplicate)];
    if (candidate) applyContributorToFinanceForm(candidate);
    return;
  }
  if (financeContributorUI.open && !event.target.closest(".finance-contributor-search-wrap")) {
    financeContributorUI.open = false;
    renderFinanceContributorSuggestions();
  }
  const financeDrawerClose = event.target.closest("[data-finance-drawer-close]");
  if (financeDrawerClose || event.target === byId("financeDrawerBackdrop")) return closeFinanceDrawer();
  const churchDrawerClose = event.target.closest("[data-church-drawer-close]");
  if (churchDrawerClose || event.target === byId("churchDrawerBackdrop")) return closeChurchDrawer();
  const requisitionDrawerClose = event.target.closest("[data-requisition-drawer-close]");
  if (requisitionDrawerClose || event.target === byId("requisitionDrawerBackdrop")) return closeRequisitionDrawer();
  const reqPastoralBtn = event.target.closest("[data-req-pastoral-action]");
  if (reqPastoralBtn) {
    submitRequisitionPastoralDecision(reqPastoralBtn.dataset.reqPastoralAction);
    return;
  }
  const viewModeBtn = event.target.closest("[data-view-mode]");
  if (viewModeBtn) {
    const mode = viewModeBtn.dataset.viewMode;
    if (activeRoute === "members") {
      modulePageState.members.view = mode;
      renderMembers();
    } else if (activeRoute === "firstTimers" || activeRoute === "counseling") {
      modulePageState.firstTimers.view = mode;
      renderFirstTimers();
    }
    return;
  }
  const followupViewBtn = event.target.closest("[data-followup-view]");
  if (followupViewBtn) {
    modulePageState.followUp.view = followupViewBtn.dataset.followupView;
    if (activeRoute === "followUp") renderFollowUp();
    return;
  }
  const churchViewBtn = event.target.closest("[data-church-view]");
  if (churchViewBtn) {
    churchPageState.view = churchViewBtn.dataset.churchView;
    localStorage.setItem(CHURCH_VIEW_KEY, churchPageState.view);
    if (activeRoute === "churches") renderChurches();
    return;
  }
  const financeTabBtn = event.target.closest("[data-finance-tab]");
  if (financeTabBtn) {
    financePageState.tab = financeTabBtn.dataset.financeTab || "overview";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.closest("[data-finance-approved-req-clear]")) {
    financePageState.approvedReqFilters = { period: "month", dateFrom: "", dateTo: "", churchId: "", department: "", finance_status: "", urgency: "", requester: "", minValue: "", maxValue: "" };
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.closest("[data-requisition-report-clear]")) {
    const defaultFilters = { period: "month", dateFrom: "", dateTo: "", churchId: "", department: "", requisition_type: "", urgency: "", finance_status: "", requisition_status: "", requester: "", approved_by: "", released_by: "", minValue: "", maxValue: "", card_filter: "" };
    const moduleForm = event.target.closest("form[data-requisition-module-report-filters]");
    if (moduleForm) {
      requisitionsPageState.reportFilters = { ...defaultFilters };
      if (activeRoute === "requisitions") renderRequisitions();
    } else {
      financePageState.requisitionReportFilters = { ...defaultFilters };
      if (activeRoute === "finance") renderFinance();
    }
    return;
  }
  const reqReportExport = event.target.closest("[data-req-report-export]");
  if (reqReportExport) {
    const rep = window.CERequisitionReports;
    if (!rep?.canExportReports(activeUser)) return;
    const { list, stats } = getActiveRequisitionReportContext();
    const kind = reqReportExport.dataset.reqReportExport;
    if (kind === "excel") exportRequisitionReportExcel(list);
    else if (kind === "print") window.print();
    else if (kind === "pdf" && typeof exportFinancePrint === "function") {
      exportFinancePrint(buildRequisitionReportExportHtml(list, stats), L("reqReportsTitle"));
    }
    return;
  }
  const requisitionTabBtn = event.target.closest("[data-requisition-tab]");
  if (requisitionTabBtn) {
    requisitionsPageState.tab = requisitionTabBtn.dataset.requisitionTab || "overview";
    if (activeRoute === "requisitions") renderRequisitions();
    return;
  }
  const staffMetricBtn = event.target.closest("[data-staff-metric]");
  if (staffMetricBtn) {
    const metricKey = staffMetricBtn.dataset.staffMetric;
    if (metricKey === "birthdays-month") return openStaffBirthdaysModal("thisMonth");
    if (metricKey === "birthdays-today") return openStaffBirthdaysModal("today");
    if (metricKey === "birthdays-past") return openStaffBirthdaysModal("past");
    if (metricKey === "birthdays-upcoming") {
      staffHrPageState.tab = "birthdays";
      if (activeRoute === "staffHr") renderStaffHr();
      else setRoute("staffHr");
      return;
    }
    return;
  }
  const staffTabBtn = event.target.closest("[data-staff-tab]");
  if (staffTabBtn) {
    staffHrPageState.tab = staffTabBtn.dataset.staffTab || "overview";
    if (activeRoute === "staffHr") renderStaffHr();
    return;
  }
  const financeChartModeBtn = event.target.closest("[data-finance-chart-mode]");
  if (financeChartModeBtn) {
    financePageState.reportChartMode = financeChartModeBtn.dataset.financeChartMode || "bar";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  const financeExportBtn = event.target.closest("[data-finance-export]");
  if (financeExportBtn) {
    const access = resolveFinanceAccess();
    if (!access.canExport) return;
    const list = typeof filterFinanceRecords === "function"
      ? filterFinanceRecords(getScopedFinanceList(), financePageState.reportFilters)
      : getScopedFinanceList();
    const stats = typeof computeFinanceReportStats === "function" ? computeFinanceReportStats(list) : {};
    const churchRows = typeof groupFinanceByChurch === "function" ? groupFinanceByChurch(list, churchName) : [];
    const partnerProfiles = typeof computePartnerProfiles === "function"
      ? computePartnerProfiles(list, getScopedFinanceList(), { minValue: financePageState.reportFilters.minValue })
      : [];
    const reportType = financePageState.exportReportType || "general";
    const stamp = new Date().toISOString().slice(0, 10);
    const exportList = reportType === "individual" && !access.canViewIndividualDetails ? [] : list;
    if (financeExportBtn.dataset.financeExport === "csv" && typeof exportFinanceCsv === "function") {
      exportFinanceCsv(exportList, `ce-finance-${reportType}-${stamp}.csv`);
    } else if (financeExportBtn.dataset.financeExport === "json") {
      const blob = new Blob([JSON.stringify(exportList, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ce-finance-${reportType}-${stamp}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (financeExportBtn.dataset.financeExport === "excel" && typeof exportFinanceExcel === "function") {
      exportFinanceExcel(exportList, `ce-finance-${reportType}-${stamp}.xls`, `CE Finance ${reportType}`);
    } else if ((financeExportBtn.dataset.financeExport === "pdf" || financeExportBtn.dataset.financeExport === "print") && typeof exportFinancePrint === "function") {
      const html = buildFinanceExportHtml(reportType, exportList, stats, churchRows, partnerProfiles);
      exportFinancePrint(html, `CE Finance ${reportType}`);
    }
    return;
  }
  const financePartnerSegmentBtn = event.target.closest("[data-finance-partner-segment]");
  if (financePartnerSegmentBtn) {
    financePageState.partnerSegment = financePartnerSegmentBtn.dataset.financePartnerSegment || "all";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  const financePartnerActionBtn = event.target.closest("[data-finance-partner-action]");
  if (financePartnerActionBtn) {
    const action = financePartnerActionBtn.dataset.financePartnerAction;
    const key = financePartnerActionBtn.dataset.partnerKey || "";
    const phone = financePartnerActionBtn.dataset.partnerPhone || "";
    if (action === "followup" && phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank", "noopener,noreferrer");
    } else if (action === "export" && key) {
      financePageState.selectedContributor = key;
      financePageState.exportReportType = "individual";
      financePageState.tab = "exports";
      if (activeRoute === "finance") renderFinance();
    }
    return;
  }
  const financeContributorBtn = event.target.closest("[data-finance-select-contributor]");
  if (financeContributorBtn) {
    financePageState.selectedContributor = financeContributorBtn.dataset.financeSelectContributor || "";
    financePageState.tab = financeContributorBtn.dataset.financeTabJump || "reports";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  const openButton = event.target.closest("[data-open-form]");
  if (openButton) return openForm(openButton.dataset.openForm);
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) return quickAction(actionButton.dataset.action, actionButton.dataset.type, actionButton.dataset.id);
  const enrollButton = event.target.closest("[data-enroll]");
  if (enrollButton) return enrollFirstTimer(enrollButton.dataset.enroll);
});

byId("entryForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (modalType === "followup") return submitFollowup(event.target);
  if (modalType === "foundationStudent") return submitFoundationStudent(event.target);
  if (modalType === "foundationMarkClass") return submitFoundationMarkClass(event.target);
  if (modalType === "foundationScore") return submitFoundationScore(event.target);
  if (modalType) submitForm(event.target);
});

document.addEventListener("submit", (event) => {
  if (event.target.matches("[data-requisition-report-filters]")) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    financePageState.requisitionReportFilters = { ...financePageState.requisitionReportFilters, ...data };
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.matches("[data-requisition-module-report-filters]")) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    requisitionsPageState.reportFilters = { ...requisitionsPageState.reportFilters, ...data };
    if (activeRoute === "requisitions") renderRequisitions();
    return;
  }
  if (event.target.matches("[data-finance-approved-req-filters]")) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    financePageState.approvedReqFilters = { ...financePageState.approvedReqFilters, ...data };
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.id === "financeDrawerForm") {
    event.preventDefault();
    submitFinanceDrawer(event.target);
    return;
  }
  if (event.target.id === "churchDrawerForm") {
    event.preventDefault();
    submitChurchDrawer(event.target);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-foundation-class]")) {
    const form = event.target.closest("form");
    if (form) updateFoundationProgressPreview(form);
    return;
  }
  if (event.target.matches("[data-foundation-status]")) {
    event.target.dataset.manualStatus = "1";
    return;
  }
  if (event.target.id === "financeContributorSearch") {
    updateFinanceContributorSearch(event.target.value);
    return;
  }
  if (event.target.dataset?.financePersonField) {
    const form = byId("entryForm");
    if (financeContributorUI.linked) {
      financeContributorUI.linked = null;
      setFinanceLinkedBadge(false);
      if (form) {
        form.elements.source_type.value = "manual";
        ["member_id", "contributor_id", "first_timer_id", "partner_id"].forEach((name) => {
          if (form.elements[name]) form.elements[name].value = "";
        });
      }
    }
    if (event.target.matches("[data-church-select]") && form) {
      applyChurchSelection(event.target, relationalChurches(), relationalFormOptions());
    } else if (event.target.name === "church_id" && form?.elements.igreja) {
      form.elements.igreja.value = churchName(event.target.value);
    }
    checkFinanceManualDuplicates();
    return;
  }
  if (event.target.matches("[data-finance-source-filter]")) {
    financePageState.sourceFilter = event.target.value || "";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  const birthdaySearchFilter = event.target.dataset?.staffBirthdayFilter;
  if (birthdaySearchFilter === "search" && activeRoute === "staffHr") {
    staffHrPageState.birthdayFilters.search = event.target.value;
    renderStaffHr();
    return;
  }
  const reportFilterKey = event.target.dataset?.financeReportFilter;
  if (reportFilterKey) {
    financePageState.reportFilters[reportFilterKey] = event.target.value || "";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.matches("[data-finance-select-contributor]")) {
    financePageState.selectedContributor = event.target.value || "";
    if (activeRoute === "finance") renderFinance();
    return;
  }
  if (event.target.matches("[data-finance-export-type]")) {
    financePageState.exportReportType = event.target.value || "general";
    return;
  }
  const serviceField = event.target.dataset?.serviceField;
  if (serviceField && serviceField !== "is_active") {
    const index = Number(event.target.dataset.serviceIndex);
    if (!Number.isNaN(index) && churchFormServiceTimes[index]) {
      churchFormServiceTimes[index][serviceField] = event.target.value;
      syncChurchServiceTimesJson();
    }
    return;
  }
  const birthdayFilterInput = event.target.dataset?.staffBirthdayFilter;
  if (birthdayFilterInput && activeRoute === "staffHr") {
    staffHrPageState.birthdayFilters[birthdayFilterInput] = event.target.value;
    renderStaffHr();
    return;
  }
  const filter = event.target.dataset?.churchFilter;
  if (!filter || activeRoute !== "churches") return;
  churchPageState.filters[filter] = event.target.value;
  renderChurches();
});

document.addEventListener("keydown", (event) => {
  if (event.target.id !== "financeContributorSearch" || !financeContributorUI.open) return;
  const max = financeContributorUI.results.length - 1;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    financeContributorUI.activeIndex = Math.min(max, financeContributorUI.activeIndex + 1);
    renderFinanceContributorSuggestions();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    financeContributorUI.activeIndex = Math.max(0, financeContributorUI.activeIndex - 1);
    renderFinanceContributorSuggestions();
  } else if (event.key === "Enter") {
    if (financeContributorUI.activeIndex >= 0 && financeContributorUI.results[financeContributorUI.activeIndex]) {
      event.preventDefault();
      applyContributorToFinanceForm(financeContributorUI.results[financeContributorUI.activeIndex]);
    }
  } else if (event.key === "Escape") {
    financeContributorUI.open = false;
    renderFinanceContributorSuggestions();
  } else if (event.key === "Tab" && financeContributorUI.activeIndex >= 0 && financeContributorUI.results[financeContributorUI.activeIndex]) {
    applyContributorToFinanceForm(financeContributorUI.results[financeContributorUI.activeIndex]);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-foundation-class]")) {
    const form = event.target.closest("form");
    if (form) updateFoundationProgressPreview(form);
    return;
  }
  if (event.target.matches("[data-foundation-status]")) {
    event.target.dataset.manualStatus = "1";
    return;
  }
  if (event.target.matches("[data-church-select]")) {
    const form = event.target.closest("form");
    if (form) applyChurchSelection(event.target, relationalChurches(), relationalFormOptions());
  }
  const serviceField = event.target.dataset?.serviceField;
  if (serviceField) {
    const index = Number(event.target.dataset.serviceIndex);
    if (!Number.isNaN(index) && churchFormServiceTimes[index]) {
      churchFormServiceTimes[index][serviceField] = serviceField === "is_active" ? event.target.checked : event.target.value;
      if (serviceField === "is_active") {
        const label = document.querySelector(`[data-service-active-label="${index}"]`);
        if (label) label.textContent = event.target.checked ? L("active") : L("inactive");
      }
      syncChurchServiceTimesJson();
    }
    return;
  }
  const birthdayFilterSelect = event.target.dataset?.staffBirthdayFilter;
  if (birthdayFilterSelect && activeRoute === "staffHr") {
    staffHrPageState.birthdayFilters[birthdayFilterSelect] = event.target.value;
    renderStaffHr();
    return;
  }
  const filter = event.target.dataset?.churchFilter;
  if (!filter || activeRoute !== "churches") return;
  churchPageState.filters[filter] = event.target.value;
  renderChurches();
});

byId("content")?.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

byId("backToTopBtn")?.addEventListener("click", () => scrollContentTo("content"));

function enterDashboard() {
  const email = (byId("loginEmail")?.value || "").trim().toLowerCase();
  const matchedUser = state.users.find((user) => String(user.email || "").trim().toLowerCase() === email);
  if (matchedUser) activeUser = matchedUser;
  byId("loginView")?.classList.add("d-none");
  byId("appView")?.classList.remove("d-none");
  renderShell();
  syncTopbarHeight();
  applyBackToTopLabel();
  setRoute(location.hash.replace("#", "") || "dashboard");
  updateBackToTopVisibility();
}

function runOptionalSupabaseLoginSync(email, password) {
  (async () => {
    try {
      if (window.CESupabaseBridge?.trySupabaseLogin) {
        await Promise.race([
          window.CESupabaseBridge.trySupabaseLogin(email, password),
          new Promise((resolve) => setTimeout(() => resolve({ ok: false, timeout: true }), 4000))
        ]);
      }
      await Promise.race([
        syncFinanceFromSupabaseIfEnabled(),
        new Promise((resolve) => setTimeout(() => resolve(false), 4000))
      ]);
    } catch (error) {
      console.warn("[CE] Supabase login/sync skipped — using local data.", error);
    }
  })();
}

byId("loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = byId("loginEmail")?.value || "";
  const password = byId("loginPassword")?.value || "";
  enterDashboard();
  runOptionalSupabaseLoginSync(email, password);
});

window.addEventListener("resize", syncTopbarHeight);

byId("logoutBtn")?.addEventListener("click", () => {
  byId("appView")?.classList.add("d-none");
  byId("loginView")?.classList.remove("d-none");
  updateBackToTopVisibility();
});

byId("menuToggle")?.addEventListener("click", () => {
  document.querySelector(".ops-sidebar")?.classList.toggle("is-open");
});

byId("sidebarCollapseToggle")?.addEventListener("click", () => {
  applySidebarCollapse(!document.querySelector(".ops-shell")?.classList.contains("is-sidebar-collapsed"));
});

applyLanguage(lang);
applySidebarCollapse();
applyBackToTopLabel();
updateBackToTopVisibility();

const ServiceTimesEditor = renderChurchServiceTimesEditor;
