'use client';

import * as React from 'react';
import { LANGUAGES, type Language } from '@/lib/i18n/languages';
import en from '@/lib/i18n/messages/en.json';
import hi from '@/lib/i18n/messages/hi.json';
import bn from '@/lib/i18n/messages/bn.json';
import ta from '@/lib/i18n/messages/ta.json';
import te from '@/lib/i18n/messages/te.json';
import mr from '@/lib/i18n/messages/mr.json';

type Messages = Record<string, string>;
const messages: Record<Language, Messages> = { en, hi, bn, ta, te, mr };
const STORAGE_KEY = 'ip-sakti-language';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>('en');

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && LANGUAGES.some((item) => item.code === stored)) {
        // The language is read once from browser storage after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(stored as Language);
      }
    } catch {
      // Storage may be unavailable; English remains the safe default.
    }
  }, []);

  const setLanguage = React.useCallback((next: Language) => {
    setLanguageState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A language switch still applies for the current session.
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = React.useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, replacements) => {
        let value = messages[language][key] ?? messages.en[key] ?? key;
        for (const [name, replacement] of Object.entries(replacements ?? {}))
          value = value.replace(`{${name}}`, replacement);
        return value;
      },
    }),
    [language, setLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = React.useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
