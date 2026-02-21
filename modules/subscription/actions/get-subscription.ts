import { apiClient } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';
import type { Subscription } from '@/modules/subscription/types/subscription-types';

const BASE_URL = '/api/web/v1/subscriptions';

export async function getSubscription(id: number): Promise<ApiResponse<Subscription>> {
  const { data } = await apiClient.get<ApiResponse<Subscription>>(`${BASE_URL}/${id}`);
  return data;
}
