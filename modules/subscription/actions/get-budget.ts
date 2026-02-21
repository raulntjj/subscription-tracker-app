import { apiClient } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';
import type { MonthlyBudget } from '@/modules/subscription/types/subscription-types';

const BASE_URL = '/api/web/v1/subscriptions/budget';

export async function getBudget(): Promise<ApiResponse<MonthlyBudget>> {
  const { data } = await apiClient.get<ApiResponse<MonthlyBudget>>(BASE_URL);
  return data;
}
