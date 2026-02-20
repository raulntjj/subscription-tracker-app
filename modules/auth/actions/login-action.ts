import type { LoginFormData, LoginResponse } from '@/modules/auth/types/auth-types';
import { apiClient, setToken } from '@/modules/shared/lib/api-client';
import type { ApiResponse } from '@/modules/shared/types/api-types';

const BASE_URL = '/api/auth/v1';

export async function loginAction(payload: LoginFormData): Promise<ApiResponse<LoginResponse>> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(`${BASE_URL}/login`, payload);

  if (data.data?.access_token) {
    setToken(data.data.access_token, data.data.expires_in);
  }

  return data;
}
