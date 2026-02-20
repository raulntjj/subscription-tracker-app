import Cookies from 'js-cookie';
import { create } from 'zustand';

export type Locale = 'en' | 'pt-BR';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALE_STORAGE_KEY = 'NEXT_LOCALE';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: 'en',
  setLocale: (locale) => {
    Cookies.set(LOCALE_COOKIE, locale, { path: '/', sameSite: 'lax', expires: 365 });
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
    set({ locale });
  },
}));
