const en = {
  // -- Page --
  pageTitle: "Webhooks",
  pageHeading: "Webhook Configuration",
  pageDescription: "Manage webhook endpoints for real-time notifications.",
  addWebhook: "Add Webhook",

  // -- Dialog --
  editWebhook: "Edit webhook",
  createWebhook: "Create webhook",
  editWebhookDesc: "Update webhook configuration",
  createWebhookDesc: "Add a new webhook endpoint",

  // -- Form labels --
  webhookUrl: "Webhook URL",
  secret: "Secret",
  isActive: "Active",

  // -- Table --
  thUrl: "URL",
  thStatus: "Status",
  thCreated: "Created",
  noWebhooks: "No webhooks configured. Add your first one!",
  failedToLoadWebhooks: "Failed to load webhooks. Please try again.",

  // -- Delete --
  deleteWebhook: "Delete webhook",
  deleteWebhookConfirm:
    "Are you sure you want to delete this webhook endpoint? This action cannot be undone.",

  // -- Optional label --
  optional: "optional",

  // -- Test --
  test: "Test",
  testing: "Sending...",
};

export type WebhookDictionary = typeof en;
export default en;
