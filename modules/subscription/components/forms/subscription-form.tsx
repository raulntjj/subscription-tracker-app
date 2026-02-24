"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { applyValidationErrors } from "@/modules/shared/lib/api-error";
import {
  type SubscriptionFormData,
  subscriptionSchema,
} from "@/modules/subscription/lib/validations/subscription";
import { type Subscription } from "@/modules/subscription/types/subscription-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateSubscription,
  useUpdateSubscription,
} from "../../hooks/use-commands";

const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "\u20AC",
};

const CURRENCY_LOCALES: Record<string, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
};

function formatCurrencyDisplay(cents: number, currency: string): string {
  const value = cents / 100;
  const locale = CURRENCY_LOCALES[currency] ?? "en-US";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type Props = {
  initialData?: Subscription | null;
  onClose?: () => void;
};

export function SubscriptionForm({ initialData, onClose }: Props) {
  const { t } = useTranslation();
  const isEdit = !!initialData;
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          price: initialData.price,
          currency: initialData.currency,
          category: initialData.category ?? "",
          billing_cycle: initialData.billing_cycle,
          status: initialData.status,
          next_billing_date: initialData.next_billing_date,
        }
      : {
          name: "",
          price: 0,
          currency: "BRL",
          category: "",
          billing_cycle: "monthly",
          status: "active",
          next_billing_date: "",
        },
  });

  const currency = watch("currency");
  const priceInCents = watch("price");

  const [displayPrice, setDisplayPrice] = useState(() =>
    initialData && initialData.price > 0
      ? formatCurrencyDisplay(initialData.price, initialData.currency)
      : "",
  );

  const syncDisplayPrice = useCallback((cents: number, cur: string) => {
    if (cents > 0) {
      setDisplayPrice(formatCurrencyDisplay(cents, cur));
    } else {
      setDisplayPrice("");
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        price: initialData.price,
        currency: initialData.currency,
        category: initialData.category ?? "",
        billing_cycle: initialData.billing_cycle,
        status: initialData.status,
        next_billing_date: initialData.next_billing_date,
      });
      syncDisplayPrice(initialData.price, initialData.currency);
    }
  }, [initialData, reset, syncDisplayPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
    setDisplayPrice(e.target.value);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      setValue("price", Math.round(parsed * 100), { shouldValidate: true });
    } else {
      setValue("price", 0, { shouldValidate: true });
    }
  };

  const handlePriceBlur = () => {
    if (priceInCents > 0) {
      setDisplayPrice(formatCurrencyDisplay(priceInCents, currency));
    }
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, payload: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose?.();
    } catch (error) {
      applyValidationErrors(error, setError);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const categoryOptions = [
    { value: "streaming", label: t("categoryStreaming") },
    { value: "software", label: t("categorySoftware") },
    { value: "hosting", label: t("categoryHosting") },
    { value: "gym", label: t("categoryGym") },
    { value: "other", label: t("categoryOther") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("namePlaceholder")}
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                key={field.value}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full" aria-label={t("category")}>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-xs text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">{t("currency")}</Label>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  if (priceInCents > 0) {
                    syncDisplayPrice(priceInCents, v);
                  }
                }}
              >
                <SelectTrigger className="w-full" aria-label={t("currency")}>
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">{"EUR (\u20AC)"}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <p className="text-xs text-destructive">
              {(errors.currency as any).message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">{t("price")}</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {CURRENCY_SYMBOLS[currency] ?? "$"}
            </span>
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              className="pl-10"
              placeholder="0.00"
              value={displayPrice}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              aria-invalid={!!errors.price}
            />
          </div>
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="billing_cycle">{t("billingCycle")}</Label>
          <Controller
            control={control}
            name="billing_cycle"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-label={t("billingCycle")}
                >
                  <SelectValue placeholder={t("selectCycle")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("yearly")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.billing_cycle && (
            <p className="text-xs text-destructive">
              {(errors.billing_cycle as any).message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">{t("status")}</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-label={t("status")}>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="paused">{t("paused")}</SelectItem>
                  <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-xs text-destructive">
              {(errors.status as any).message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("nextBillingDate")}</Label>
        <Controller
          control={control}
          name="next_billing_date"
          render={({ field }) => {
            const selectedDate = field.value
              ? parse(field.value, "yyyy-MM-dd", new Date())
              : undefined;
            const isValidDate = selectedDate && !isNaN(selectedDate.getTime());

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {isValidDate ? format(selectedDate, "PPP") : t("pickADate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={isValidDate ? selectedDate : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(format(date, "yyyy-MM-dd"));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
        {errors.next_billing_date && (
          <p className="text-xs text-destructive">
            {errors.next_billing_date.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? t("saving") : t("creating")}
            </>
          ) : isEdit ? (
            t("save")
          ) : (
            t("create")
          )}
        </Button>
      </div>
    </form>
  );
}
