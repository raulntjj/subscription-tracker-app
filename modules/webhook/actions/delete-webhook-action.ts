import { apiClient } from "@/modules/shared/lib/api-client";

const BASE_URL = "/api/web/v1/webhooks";

// DELETE retorna 204 sem corpo
export async function deleteWebhook(id: number): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}
