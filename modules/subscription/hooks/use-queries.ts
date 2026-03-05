import { useQuery } from '@tanstack/react-query';

import { getBudget } from '@/modules/subscription/actions/get-budget';
import type { PaginationParams } from '@/modules/shared/types/api-types';
import { getSubscriptions } from '@/modules/subscription/actions/get-subscriptions';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (params: PaginationParams) =>
    [...subscriptionKeys.lists(), params] as const,
  budget: () => [...subscriptionKeys.all, 'budget'] as const,
};

export function useSubscriptions(params: PaginationParams) {
  return useQuery({
    queryKey: subscriptionKeys.list(params),
    queryFn: async () => {
      const response = await getSubscriptions(params);
      return response.data;
    },
  });
}

export function useBudget() {
  return useQuery({
    queryKey: subscriptionKeys.budget(),
    queryFn: async () => {
      const response = await getBudget();
      return response.data;
    },
  });
}
