import { z } from 'zod';

export const webhookPlatforms = ['discord', 'slack', 'other'] as const;

export const webhookSchema = z.object({
  url: z.string().url('Invalid URL'),
  secret: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  platform: z.enum(webhookPlatforms).optional().default('other'),
  bot_name: z.string().max(255).optional().or(z.literal('')),
  server_name: z.string().max(255).optional().or(z.literal('')),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
