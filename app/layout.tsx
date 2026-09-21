import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/shared/footer';
import { FloatingNavbar } from '@/components/shared/floating-navbar';
import { I18nProvider } from '@/components/i18n-provider';
import { env } from '@/lib/env';
import { PrivacyNotice } from '@/components/privacy-notice';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: 'IP-SAKTI Sahayak | AI for Ayurveda IP & Regulatory Guidance',
  description:
    'Multilingual RAG-based AI assistant for Intellectual Property and regulatory guidance in Ayurveda. Bridging traditional knowledge with modern IP protection.',
  keywords: [
    'Ayurveda',
    'Intellectual Property',
    'AI Assistant',
    'Regulatory Guidance',
    'RAG',
    'Multilingual',
  ],
  openGraph: {
    title: 'IP-SAKTI Sahayak',
    description: 'AI-powered platform for Ayurveda IP and regulatory guidance',
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: 'IP-SAKTI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning className="site-light antialiased">
        <I18nProvider
          contactEmail={env.NEXT_PUBLIC_CONTACT_EMAIL ?? env.NEXT_PUBLIC_FACILITATOR_EMAIL}
        >
          <FloatingNavbar />
          <main>{children}</main>
          <Footer
            contactEmail={env.NEXT_PUBLIC_CONTACT_EMAIL ?? env.NEXT_PUBLIC_FACILITATOR_EMAIL}
          />
          <PrivacyNotice />
        </I18nProvider>
      </body>
    </html>
  );
}
