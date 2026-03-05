import type { ApiResponse } from '@/modules/shared/types/api-types';
import { apiClient, removeToken } from '@/modules/shared/lib/api-client';

const BASE_URL = '/api/auth/v1';

export async function logoutAction(): Promise<ApiResponse> {
  try {
    const { data } = await apiClient.post<ApiResponse>(`${BASE_URL}/logout`);
    return data;
  } finally {
    // Sempre remove o token local, mesmo se a API falhar
    removeToken();
  }
}
