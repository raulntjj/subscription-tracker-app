import { getApiErrorMessage } from "@/modules/shared/lib/api-error";
import { createSubscription } from "@/modules/subscription/actions/create-subscription";
import { deleteSubscription } from "@/modules/subscription/actions/delete-subscription";
import { updateSubscription } from "@/modules/subscription/actions/update-subscription";
import type { SubscriptionFormData } from "@/modules/subscription/lib/validations/subscription";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { subscriptionKeys } from "./use-queries";

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubscriptionFormData) => createSubscription(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.budget() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: SubscriptionFormData;
    }) => updateSubscription(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.budget() });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.budget() });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
