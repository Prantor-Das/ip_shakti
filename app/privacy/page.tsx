import { env } from '@/lib/env';

export const metadata = {
  title: 'Privacy | IP-SAKTI Sahayak',
  description: 'How IP-SAKTI Sahayak processes questions and contact messages.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-[#173b2b]">
      <h1 className="text-4xl font-bold">Privacy notice</h1>
      <p className="mt-4 text-sm text-[#173b2b]/70">Last updated: 21 September 2026</p>
      <div className="mt-10 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">What is processed</h2>
          <p className="mt-2">
            Questions, selected jurisdiction and formulation context are processed to retrieve
            corpus sources and generate an answer. Contact forms process the name, email address and
            message needed to respond.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Third-party processing</h2>
          <p className="mt-2">
            Questions may be sent to Google Gemini for retrieval, generation or fallback
            translation, and to Bhashini when its translation service is configured. These providers
            process data under their own terms. Translation is a third-party processing step.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Accounts, storage and logs</h2>
          <p className="mt-2">
            The site does not require accounts and does not use cookies. A language preference and
            this first-visit notice may be kept in browser local storage. Server audit records
            contain operational metadata such as a hashed client identifier, language, jurisdiction,
            document IDs, confidence, latency and token counts. Question and answer text are not
            stored unless the server operator explicitly enables <code>LOG_CONTENT=true</code>.
            Records are retained for {env.AUDIT_RETENTION_DAYS} days by default.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Important caution</h2>
          <p className="mt-2">
            Do not enter unpublished or confidential invention details. This service provides
            information, not legal advice.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2">
            For privacy questions, contact{' '}
            {env.NEXT_PUBLIC_CONTACT_EMAIL ??
              env.NEXT_PUBLIC_FACILITATOR_EMAIL ??
              'the IP-SAKTI team through the contact form'}
            .
          </p>
        </section>
      </div>
    </div>
  );
}
