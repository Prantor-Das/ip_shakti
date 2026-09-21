'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGUAGES, type Language } from '@/lib/i18n/languages';
import { useI18n } from '@/components/i18n-provider';

export const FloatingNavbar = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const localizedNavItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.assistant'), href: '/chat' },
    { label: 'ABS & TKDL', href: '/abs-tkdl' },
    { label: 'Sources', href: '/sources' },
    { label: t('nav.samhita'), href: '/samhita' },
    { label: t('nav.features'), href: '/features' },
    { label: t('nav.howItWorks'), href: '/how-it-works' },
    { label: t('nav.about'), href: '/about' },
  ];
  return (
    <>
      {/* Floating Main Nav */}
      <nav className="fixed left-1/2 top-0 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-b-2xl bg-white/95 backdrop-blur-md border-x border-b border-emerald-900/10 px-4 py-2.5 sm:gap-6 md:gap-8 md:rounded-b-3xl md:px-8 shadow-md">
          {localizedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[11px] sm:text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary font-semibold border-b border-primary'
                    : 'text-emerald-950/60 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="fixed left-4 top-3 z-50 sm:left-6 md:left-8">
        <label className="sr-only" htmlFor="language-switcher">
          {t('nav.language')}
        </label>
        <select
          id="language-switcher"
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
          className="rounded-lg border border-emerald-900/10 bg-white/95 px-2 py-1.5 text-xs text-emerald-950 shadow-sm backdrop-blur-md"
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.nativeName}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
