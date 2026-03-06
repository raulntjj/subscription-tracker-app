import type { WebhookDictionary } from './en';

const ptBR: WebhookDictionary = {
  // -- Page --
  pageTitle: 'Webhooks',
  pageHeading: 'Configuracao de Webhooks',
  pageDescription:
    'Gerencie endpoints de webhook para notificacoes em tempo real.',
  addWebhook: 'Novo Webhook',

  // -- Dialog --
  editWebhook: 'Editar webhook',
  createWebhook: 'Criar webhook',
  editWebhookDesc: 'Atualize a configuracao do webhook',
  createWebhookDesc: 'Adicione um novo endpoint de webhook',

  // -- Form labels --
  webhookUrl: 'URL do Webhook',
  secret: 'Segredo',
  isActive: 'Ativo',
  platform: 'Plataforma',
  platformDiscord: 'Discord',
  platformSlack: 'Slack',
  platformOther: 'Outro',
  botName: 'Nome do Bot',
  serverName: 'Nome do Servidor',
  selectPlatform: 'Selecione uma plataforma',
  autoFetchHint:
    'Insira uma URL e tentaremos preencher os campos automaticamente.',
  autoFetching: 'Buscando informacoes...',
  autoFetchSuccess: 'Campos preenchidos automaticamente!',
  autoFetchFailed:
    'Nao foi possivel preencher automaticamente. Preencha manualmente.',

  // -- Table --
  thUrl: 'URL',
  thPlatform: 'Plataforma',
  thStatus: 'Status',
  thCreated: 'Criado em',
  noWebhooks: 'Nenhum webhook configurado. Adicione o primeiro!',
  failedToLoadWebhooks: 'Falha ao carregar webhooks. Tente novamente.',

  // -- Delete --
  deleteWebhook: 'Excluir webhook',
  deleteWebhookConfirm:
    'Tem certeza que deseja excluir este endpoint de webhook? Esta acao nao pode ser desfeita.',

  // -- Optional label --
  optional: 'opcional',

  // -- Test --
  test: 'Testar',
  testing: 'Enviando...',
};

export default ptBR;
