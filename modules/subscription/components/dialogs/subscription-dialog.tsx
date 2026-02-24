"use client";

import React from "react";

import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { SubscriptionForm } from "@/modules/subscription/components/forms/subscription-form";
import type { Subscription } from "@/modules/subscription/types/subscription-types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Subscription | null;
  trigger?: React.ReactNode;
};

export function SubscriptionDialog({
  open,
  onOpenChange,
  initialData,
  trigger,
}: Props) {
  const { t } = useTranslation();
  const title = initialData ? t("editSubscription") : t("createSubscription");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData
              ? t("editSubscriptionDesc")
              : t("createSubscriptionDesc")}
          </DialogDescription>
        </DialogHeader>

        <SubscriptionForm
          initialData={initialData}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
