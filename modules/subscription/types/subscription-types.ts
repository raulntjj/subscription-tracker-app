
export const SubscriptionStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const SubscriptionCurrency = {
  BRL: 'BRL',
  USD: 'USD',
  EUR: 'EUR',
} as const;

export type SubscriptionCurrency = (typeof SubscriptionCurrency)[keyof typeof SubscriptionCurrency];

export const BillingCycle = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];


export interface Subscription {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  price_formatted: string;
  currency: SubscriptionCurrency;
  category: string;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  next_billing_date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}


export interface BudgetBreakdown {
  category: string;
  amount: number;
  amount_formatted: string;
  percentage: number;
}

export interface MonthlyBudget {
  total_committed: number;
  total_committed_formatted: string;
  upcoming_bills: number;
  upcoming_bills_formatted: string;
  total_monthly: number;
  total_monthly_formatted: string;
  currency: string;
  breakdown: BudgetBreakdown[];
}
