'use client';

import type { Jurisdiction } from '@/lib/chat/types';

export function JurisdictionToggle({
  value,
  onChange,
}: {
  value: Jurisdiction;
  onChange: (value: Jurisdiction) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl border border-emerald-900/15 bg-white p-1 shadow-sm"
      aria-label="Jurisdiction"
    >
      {(['india', 'international'] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-pressed={value === item}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${value === item ? 'bg-primary text-white' : 'text-emerald-950/60 hover:bg-emerald-50'}`}
        >
          {item === 'india' ? 'India' : 'International'}
        </button>
      ))}
    </div>
  );
}
