import { useMemo } from 'react';

import authEn from '@/modules/auth/lang/en';
import authPtBR from '@/modules/auth/lang/pt-BR';
import sharedEn from '@/modules/shared/lang/en';
import sharedPtBR from '@/modules/shared/lang/pt-BR';
import { type Locale, useI18nStore } from '@/modules/shared/store/i18n-store';
import subEn from '@/modules/subscription/lang/en';
import subPtBR from '@/modules/subscription/lang/pt-BR';
import webhookEn from '@/modules/webhook/lang/en';
import webhookPtBR from '@/modules/webhook/lang/pt-BR';

const dictionaries = {
  en: { ...sharedEn, ...authEn, ...subEn, ...webhookEn },
  'pt-BR': { ...sharedPtBR, ...authPtBR, ...subPtBR, ...webhookPtBR },
} as const;

export type DictionaryKey = keyof (typeof dictionaries)['en'];

export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);

  const t = useMemo(() => {
    const dict = dictionaries[locale] ?? dictionaries.en;

    return (key: DictionaryKey, params?: Record<string, string | number>): string => {
      let value: string = (dict as Record<string, string>)[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    };
  }, [locale]);

  return { t, locale };
}
