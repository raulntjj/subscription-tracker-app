"use client";

import { LoginForm } from "@/modules/auth/components/forms/login-form";
import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { Coins } from "lucide-react";

export function LoginContainer() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh">
      {/* Painel de branding */}
      <div className="hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Coins className="size-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">
            {t("appName")}
          </span>
        </div>
        <div className="max-w-md">
          <blockquote className="text-xl leading-relaxed font-light">
            {t("loginQuote")}
          </blockquote>
          <p className="mt-4 text-sm font-medium text-primary-foreground/75">
            {t("loginQuoteAuthor")}
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">{t("brandFooter")}</p>
      </div>

      {/* Painel do formulário */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-1">
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Coins className="size-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                {t("appName")}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              {t("welcomeBack")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("signInToContinue")}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
