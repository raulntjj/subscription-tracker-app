import { apiClient } from "@/modules/shared/lib/api-client";
import type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
} from "@/modules/shared/types/api-types";
import type { Subscription } from "@/modules/subscription/types/subscription-types";

const BASE_URL = "/api/web/v1/subscriptions";

// A API retorna: { success, message, data: { subscriptions: [...], total, per_page, current_page, last_page } }
type SubscriptionsPaginatedData = PaginatedData<{
  subscriptions: Subscription[];
}>;

export async function getSubscriptions(
  params?: PaginationParams,
): Promise<ApiResponse<SubscriptionsPaginatedData>> {
  const { data } = await apiClient.get<ApiResponse<SubscriptionsPaginatedData>>(
    BASE_URL,
    {
      params,
    },
  );
  return data;
}
