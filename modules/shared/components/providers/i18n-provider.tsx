'use client';

import { useEffect, useRef } from 'react';

import { type Locale, useI18nStore } from '@/modules/shared/store/i18n-store';

interface I18nProviderProps {
  initialLocale: Locale;
  children: React.ReactNode;
}

export function I18nProvider({ initialLocale, children }: I18nProviderProps) {
  const hydrated = useRef(false);

  if (!hydrated.current) {
    useI18nStore.setState({ locale: initialLocale });
    hydrated.current = true;
  }

  useEffect(() => {
    const currentLocale = useI18nStore.getState().locale;
    if (currentLocale !== initialLocale) {
      useI18nStore.setState({ locale: initialLocale });
    }
  }, [initialLocale]);

  return <>{children}</>;
}
