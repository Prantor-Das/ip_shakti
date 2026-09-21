'use client';

import * as React from 'react';

const STORAGE_KEY = 'ip-sakti-privacy-notice-seen';

export function PrivacyNotice() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      // Browser storage is only available after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'true');
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // The notice can still be dismissed for this session.
    }
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-[#173b2b]/15 bg-white p-5 text-[#173b2b] shadow-2xl"
      role="dialog"
      aria-label="Privacy notice"
    >
      <p className="text-sm leading-relaxed">
        Questions are processed by this service and may be sent to Google Gemini or Bhashini for
        translation. Don&apos;t enter unpublished or confidential invention details.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a className="text-sm font-semibold underline" href="/privacy">
          Read the privacy notice
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full bg-[#173b2b] px-4 py-2 text-sm font-semibold text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
