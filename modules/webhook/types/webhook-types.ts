export type WebhookPlatform = 'discord' | 'slack' | 'other';

export interface WebhookConfig {
  id: number;
  user_id: number;
  url: string;
  is_active: boolean;
  platform: WebhookPlatform;
  bot_name: string | null;
  server_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookFormData {
  url: string;
  is_active?: boolean;
  platform?: WebhookPlatform;
  bot_name?: string;
  server_name?: string;
}
