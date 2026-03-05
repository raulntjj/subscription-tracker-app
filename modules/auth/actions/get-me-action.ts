import type { User } from '@/modules/auth/types/auth-types';
import { apiClient } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';

const BASE_URL = '/api/auth/v1';

export async function getMeAction(): Promise<ApiResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<User>>(`${BASE_URL}/me`);
  return data;
}
