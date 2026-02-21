import { z } from 'zod';

export const webhookSchema = z.object({
  url: z.string().url('Invalid URL'),
  secret: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
