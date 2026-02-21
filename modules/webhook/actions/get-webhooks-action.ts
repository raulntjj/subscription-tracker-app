import { apiClient } from '@/modules/shared/lib/api-client';
import type { ApiResponse, PaginatedData } from '@/modules/shared/types/api-types';
import type { WebhookConfig } from '@/modules/webhook/types/webhook-types';

const BASE_URL = '/api/web/v1/webhooks';

// A API retorna: { success, message, data: { webhooks: [...], total, ... } }
type WebhooksPaginatedData = PaginatedData<{ webhooks: WebhookConfig[] }>;

export async function getWebhooks(): Promise<ApiResponse<WebhooksPaginatedData>> {
  const { data } = await apiClient.get<ApiResponse<WebhooksPaginatedData>>(BASE_URL);
  return data;
}
