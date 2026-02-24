import { z } from "zod";

export const CATEGORY_OPTIONS = [
  { value: "streaming", label: "Streaming" },
  { value: "software", label: "Software" },
  { value: "hosting", label: "Hosting" },
  { value: "gym", label: "Gym" },
  { value: "other", label: "Other" },
] as const;

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z.number().int().min(1, "Price must be greater than 0"),
  currency: z.enum(["BRL", "USD", "EUR"], {
    required_error: "Currency is required",
  }),
  category: z.string().min(1, "Category is required"),
  billing_cycle: z.enum(["monthly", "yearly"], {
    required_error: "Billing cycle is required",
  }),
  status: z.enum(["active", "paused", "cancelled"], {
    required_error: "Status is required",
  }),
  next_billing_date: z.string().min(1, "Next billing date is required"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
