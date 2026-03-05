import { useQuery } from '@tanstack/react-query';

import { getWebhooks } from '@/modules/webhook/actions/get-webhooks-action';

export const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  detail: (id: number) => [...webhookKeys.all, 'detail', id] as const,
};

export function useWebhooks() {
  return useQuery({
    queryKey: webhookKeys.lists(),
    queryFn: async () => {
      const response = await getWebhooks();
      return response.data;
    },
  });
}
