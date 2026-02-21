'use client';

import { useEffect } from 'react';

import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { applyValidationErrors } from '@/modules/shared/lib/api-error';
import { useCreateWebhook, useUpdateWebhook } from '@/modules/webhook/hooks/use-commands';
import { type WebhookFormData, webhookSchema } from '@/modules/webhook/lib/validations/webhook';
import { type WebhookConfig } from '@/modules/webhook/types/webhook-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Props = {
  initialData?: WebhookConfig | null;
  onClose?: () => void;
};

export function WebhookForm({ initialData, onClose }: Props) {
  const { t } = useTranslation();
  const isEdit = !!initialData;
  const createMutation = useCreateWebhook();
  const updateMutation = useUpdateWebhook();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: '',
      secret: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('url', initialData.url);
      setValue('secret', '');
      setValue('is_active', initialData.is_active);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: WebhookFormData) => {
    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, payload: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      // Fecha apenas no sucesso
      onClose?.();
    } catch (error) {
      // Em 422, mapeia erros por campo — dialog continua aberto
      applyValidationErrors(error, setError);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="url">{t('webhookUrl')}</Label>
        <Input id="url" type="url" {...register('url')} aria-invalid={!!errors.url} />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="secret">
          {t('secret')} <span className="text-xs text-muted-foreground">({t('optional')})</span>
        </Label>
        <Input id="secret" type="password" {...register('secret')} aria-invalid={!!errors.secret} />
        {errors.secret && <p className="text-xs text-destructive">{errors.secret.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">{t('isActive')}</Label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? t('saving') : t('creating')}
            </>
          ) : isEdit ? (
            t('save')
          ) : (
            t('create')
          )}
        </Button>
      </div>
    </form>
  );
}
