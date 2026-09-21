import type { Metadata } from 'next';
import { Inter, Instrument_Serif, Poppins, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/shared/footer';
import { FloatingNavbar } from '@/components/shared/floating-navbar';

const inter = Inter({ subsets: ['latin'] });
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
});

export const metadata: Metadata = {
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
    url: 'https://ip-sakti.com',
    siteName: 'IP-SAKTI',
    images: [
      {
        url: 'https://ip-sakti.com/og-image.png',
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
      <body
        className={`${inter.className} ${instrumentSerif.variable} ${poppins.variable} ${bebasNeue.variable} site-light antialiased`}
      >
        <FloatingNavbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

