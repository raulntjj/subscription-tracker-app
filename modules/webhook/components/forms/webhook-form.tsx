'use client';

import { useCallback, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { applyValidationErrors } from '@/modules/shared/lib/api-error';
import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { type WebhookConfig } from '@/modules/webhook/types/webhook-types';
import {
  useCreateWebhook,
  useUpdateWebhook,
} from '@/modules/webhook/hooks/use-commands';
import {
  type WebhookFormData,
  webhookPlatforms,
  webhookSchema,
} from '@/modules/webhook/lib/validations/webhook';

type Props = {
  initialData?: WebhookConfig | null;
  onClose?: () => void;
};

function detectPlatformFromUrl(url: string): 'discord' | 'slack' | 'other' {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('discord.com') || hostname.includes('discordapp.com'))
      return 'discord';
    if (hostname.includes('hooks.slack.com')) return 'slack';
  } catch {
    // invalid URL, ignore
  }
  return 'other';
}

export function WebhookForm({ initialData, onClose }: Props) {
  const { t } = useTranslation();
  const isEdit = !!initialData;
  const createMutation = useCreateWebhook();
  const updateMutation = useUpdateWebhook();
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: initialData
      ? {
          url: initialData.url,
          secret: undefined,
          is_active: initialData.is_active,
          platform: initialData.platform ?? 'other',
          bot_name: initialData.bot_name ?? '',
          server_name: initialData.server_name ?? '',
        }
      : {
          url: undefined,
          secret: undefined,
          is_active: true,
          platform: 'other',
          bot_name: '',
          server_name: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        url: initialData.url,
        secret: undefined,
        is_active: initialData.is_active,
        platform: initialData.platform ?? 'other',
        bot_name: initialData.bot_name ?? '',
        server_name: initialData.server_name ?? '',
      });
    }
  }, [initialData, reset]);

  const autoFetchFromUrl = useCallback(
    async (url: string) => {
      if (!url) return;

      try {
        new URL(url);
      } catch {
        return;
      }

      const platform = detectPlatformFromUrl(url);
      setValue('platform', platform);

      if (platform !== 'discord') return;

      setIsFetching(true);
      try {
        const response = await fetch(url, { method: 'GET' });
        if (response.ok) {
          const json = await response.json();
          if (json.name) {
            setValue('bot_name', json.name);
          }
          if (json.guild?.name) {
            setValue('server_name', json.guild.name);
          } else if (json.channel?.name) {
            setValue('server_name', json.channel.name);
          }
        }
      } catch {
        // fetch failed, user continues manually
      } finally {
        setIsFetching(false);
      }
    },
    [setValue]
  );

  const onSubmit = async (data: WebhookFormData) => {
    try {
      const payload = {
        ...data,
        bot_name: data.bot_name || undefined,
        server_name: data.server_name || undefined,
      };
      if (isEdit && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose?.();
    } catch (error) {
      applyValidationErrors(error, setError);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const platformLabels: Record<string, string> = {
    discord: t('platformDiscord'),
    slack: t('platformSlack'),
    other: t('platformOther'),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* URL - first field, triggers auto-fetch */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="url">{t('webhookUrl')}</Label>
        <div className="relative">
          <Input
            id="url"
            type="url"
            {...register('url', {
              onBlur: (e) => {
                if (!isEdit) {
                  autoFetchFromUrl(e.target.value);
                }
              },
            })}
            aria-invalid={!!errors.url}
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {errors.url && (
          <p className="text-xs text-destructive">{errors.url.message}</p>
        )}
        {!isEdit && (
          <p className="text-xs text-muted-foreground">{t('autoFetchHint')}</p>
        )}
      </div>

      {/* Platform */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="platform">{t('platform')}</Label>
        <Controller
          control={control}
          name="platform"
          render={({ field }) => (
            <Select
              key={field.value}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectPlatform')} />
              </SelectTrigger>
              <SelectContent>
                {webhookPlatforms.map((p) => (
                  <SelectItem key={p} value={p}>
                    {platformLabels[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.platform && (
          <p className="text-xs text-destructive">{errors.platform.message}</p>
        )}
      </div>

      {/* Bot Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="bot_name">
          {t('botName')}{' '}
          <span className="text-xs text-muted-foreground">
            ({t('optional')})
          </span>
        </Label>
        <Input
          id="bot_name"
          type="text"
          {...register('bot_name')}
          aria-invalid={!!errors.bot_name}
        />
        {errors.bot_name && (
          <p className="text-xs text-destructive">{errors.bot_name.message}</p>
        )}
      </div>

      {/* Server Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="server_name">
          {t('serverName')}{' '}
          <span className="text-xs text-muted-foreground">
            ({t('optional')})
          </span>
        </Label>
        <Input
          id="server_name"
          type="text"
          {...register('server_name')}
          aria-invalid={!!errors.server_name}
        />
        {errors.server_name && (
          <p className="text-xs text-destructive">
            {errors.server_name.message}
          </p>
        )}
      </div>

      {/* Secret */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="secret">
          {t('secret')}{' '}
          <span className="text-xs text-muted-foreground">
            ({t('optional')})
          </span>
        </Label>
        <Input
          id="secret"
          type="password"
          {...register('secret')}
          aria-invalid={!!errors.secret}
        />
        {errors.secret && (
          <p className="text-xs text-destructive">{errors.secret.message}</p>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="is_active">{t('isActive')}</Label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Switch
              id="is_active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
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
