export interface WebhookConfig {
  id: number;
  user_id: number;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookFormData {
  url: string;
  is_active?: boolean;
}
