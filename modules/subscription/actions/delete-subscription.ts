import { apiClient } from "@/modules/shared/lib/api-client";

const BASE_URL = "/api/web/v1/subscriptions";

// DELETE retorna 204 sem corpo
export async function deleteSubscription(id: number): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}
