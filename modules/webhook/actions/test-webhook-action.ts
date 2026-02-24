import { apiClient } from "@/modules/shared/lib/api-client";
import type { ApiResponse } from "@/modules/shared/types/api-types";

const BASE_URL = "/api/web/v1/webhooks";

export async function testWebhook(id: number): Promise<ApiResponse> {
  const { data } = await apiClient.post<ApiResponse>(
    `${BASE_URL}/${id}/test`,
    null,
    {
      params: { async: true },
    },
  );
  return data;
}
