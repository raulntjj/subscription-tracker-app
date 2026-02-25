"use client";

import { RegisterForm } from "@/modules/auth/components/forms/register-form";
import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { Coins } from "lucide-react";

export function RegisterContainer() {
  const { t } = useTranslation();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Coins className="size-4" />
          </div>
          {t("appName")}
        </a>
        <RegisterForm />
      </div>
    </div>
  );
}
