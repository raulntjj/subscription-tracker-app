"use client";

import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { type Locale, useI18nStore } from "@/modules/shared/store/i18n-store";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const localeOptions: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English (EN)", flag: "\u{1F1FA}\u{1F1F8}" },
  {
    value: "pt-BR",
    label: "Portugu\u00eas (PT-BR)",
    flag: "\u{1F1E7}\u{1F1F7}",
  },
];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale, setLocale } = useI18nStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={t("changeLanguage")}
        >
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLocale(option.value)}
            className={locale === option.value ? "bg-accent" : ""}
          >
            <span className="mr-2">{option.flag}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
