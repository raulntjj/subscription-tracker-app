import type { RegisterFormData, RegisterResponse } from '@/modules/auth/types/auth-types';
import { apiClient, setToken } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';

const BASE_URL = '/api/auth/v1';

export async function registerAction(
  payload: RegisterFormData
): Promise<ApiResponse<RegisterResponse>> {
  const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(
    `${BASE_URL}/register`,
    payload
  );

  if (data.data?.access_token) {
    setToken(data.data.access_token, data.data.expires_in);
  }

  return data;
}
