'use client';

import React from 'react';

import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { WebhookForm } from '@/modules/webhook/components/forms/webhook-form';
import type { WebhookConfig } from '@/modules/webhook/types/webhook-types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: WebhookConfig | null;
  trigger?: React.ReactNode;
};

export function WebhookDialog({ open, onOpenChange, initialData, trigger }: Props) {
  const { t } = useTranslation();
  const title = initialData ? t('editWebhook') : t('createWebhook');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? t('editWebhookDesc') : t('createWebhookDesc')}
          </DialogDescription>
        </DialogHeader>

        <WebhookForm initialData={initialData} onClose={() => onOpenChange(false)} />

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
