import { apiClient } from "@/modules/shared/lib/api-client";
import type { ApiResponse } from "@/modules/shared/types/api-types";
import type { SubscriptionFormData } from "@/modules/subscription/lib/validations/subscription";
import type { Subscription } from "@/modules/subscription/types/subscription-types";

const BASE_URL = "/api/web/v1/subscriptions";

export async function createSubscription(
  payload: SubscriptionFormData,
): Promise<ApiResponse<Subscription>> {
  const { data } = await apiClient.post<ApiResponse<Subscription>>(
    BASE_URL,
    payload,
  );
  return data;
}
