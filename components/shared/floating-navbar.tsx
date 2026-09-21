'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { LANGUAGES, type Language } from '@/lib/i18n/languages';
import { useI18n } from '@/components/i18n-provider';

export const FloatingNavbar = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {/* Top Right Profile Button */}
      <div className="fixed top-3 right-4 sm:right-6 md:right-8 z-50" ref={menuRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          aria-label="User profile and login"
          className="size-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 border border-white/60 transition-all hover:scale-105 focus:outline-none"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Profile Dropdown Menu */}
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-emerald-900/10 shadow-lg p-2 z-50 text-emerald-950 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-emerald-900/10 mb-1">
              <p className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                IP-SAKTI Portal
              </p>
              <p className="text-[10px] text-emerald-950/60">Ayurveda IP & Compliance</p>
            </div>

            <Link
              href="/login"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-emerald-950/75 hover:bg-emerald-50 hover:text-primary transition-colors"
            >
              <LogIn className="size-4 text-primary" />
              <span>Login</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-emerald-950/75 hover:bg-emerald-50 hover:text-primary transition-colors"
            >
              <UserPlus className="size-4 text-primary" />
              <span>Register / Create Account</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
