import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiResponse } from '@/modules/shared/types/api-types';
import { getApiErrorMessage } from '@/modules/shared/lib/api-error';
import { testWebhook } from '@/modules/webhook/actions/test-webhook-action';
import { createWebhook } from '@/modules/webhook/actions/create-webhook-action';
import { deleteWebhook } from '@/modules/webhook/actions/delete-webhook-action';
import { updateWebhook } from '@/modules/webhook/actions/update-webhook-action';
import type { WebhookFormData } from '@/modules/webhook/lib/validations/webhook';

import { webhookKeys } from './use-queries';
import { WebhookConfig } from '../types/webhook-types';

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WebhookFormData) => createWebhook(payload),
    onSuccess: (response: ApiResponse<WebhookConfig>) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
      toast.success(response.message);
    },
    onError: (error: ApiResponse<unknown>) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WebhookFormData }) =>
      updateWebhook(id, payload),
    onSuccess: (response: ApiResponse<WebhookConfig>) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.all });
      toast.success(response.message);
    },
    onError: (error: ApiResponse<unknown>) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.all });
    },
    onError: (error: ApiResponse<unknown>) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: (id: number) => testWebhook(id),
    onSuccess: (response: ApiResponse<unknown>) => {
      toast.success(response.message || 'Teste enviado com sucesso!');
    },
    onError: (error: ApiResponse<unknown>) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
