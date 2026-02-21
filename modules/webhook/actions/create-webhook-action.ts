import { apiClient } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';
import type { WebhookConfig, WebhookFormData } from '@/modules/webhook/types/webhook-types';

const BASE_URL = '/api/web/v1/webhooks';

export async function createWebhook(payload: WebhookFormData): Promise<ApiResponse<WebhookConfig>> {
  const { data } = await apiClient.post<ApiResponse<WebhookConfig>>(BASE_URL, payload);
  return data;
}
