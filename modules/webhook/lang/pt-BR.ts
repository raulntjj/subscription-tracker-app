import type { WebhookDictionary } from "./en";

const ptBR: WebhookDictionary = {
  // -- Page --
  pageTitle: "Webhooks",
  pageHeading: "Configuracao de Webhooks",
  pageDescription:
    "Gerencie endpoints de webhook para notificacoes em tempo real.",
  addWebhook: "Novo Webhook",

  // -- Dialog --
  editWebhook: "Editar webhook",
  createWebhook: "Criar webhook",
  editWebhookDesc: "Atualize a configuracao do webhook",
  createWebhookDesc: "Adicione um novo endpoint de webhook",

  // -- Form labels --
  webhookUrl: "URL do Webhook",
  secret: "Segredo",
  isActive: "Ativo",

  // -- Table --
  thUrl: "URL",
  thStatus: "Status",
  thCreated: "Criado em",
  noWebhooks: "Nenhum webhook configurado. Adicione o primeiro!",
  failedToLoadWebhooks: "Falha ao carregar webhooks. Tente novamente.",

  // -- Delete --
  deleteWebhook: "Excluir webhook",
  deleteWebhookConfirm:
    "Tem certeza que deseja excluir este endpoint de webhook? Esta acao nao pode ser desfeita.",

  // -- Optional label --
  optional: "opcional",

  // -- Test --
  test: "Testar",
  testing: "Enviando...",
};

export default ptBR;
