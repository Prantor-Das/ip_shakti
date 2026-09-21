'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Link as LinkIcon, Mail, MapPin } from 'lucide-react';

const linkClass = 'text-sm text-[#173b2b]/65 transition-colors hover:text-[#2f855a]';
const headingClass = 'mb-3 block text-sm font-bold tracking-tight text-[#173b2b]';

export const Footer = ({ contactEmail }: { contactEmail?: string }) => {
  if (usePathname() === '/chat') return null;

  return (
    <footer className="mt-16 border-t border-[#173b2b]/10 bg-[#f7faf7] px-6 py-12 text-[#173b2b]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-4">
        <div>
          <div className="mb-3 font-bebas-neue text-[4rem] uppercase leading-[0.9] tracking-[0.5px]">
            IP - SAKTI
          </div>
          <p className="mb-5 max-w-80 text-sm text-[#173b2b]/65">
            <i>Where Ancient Wisdom Meets Intelligent Technology.</i>
          </p>
        </div>

        <div>
          <span className={headingClass}>Product</span>
          <nav className="flex flex-col gap-2.5" aria-label="Product">
            <Link href="/chat" className={linkClass}>
              AI Assistant
            </Link>
            <Link href="/features" className={linkClass}>
              Features
            </Link>
            <Link href="/how-it-works" className={linkClass}>
              How It Works
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
          </nav>
        </div>

        <div>
          <span className={headingClass}>More</span>
          <nav className="flex flex-col gap-2.5" aria-label="More">
            <Link href="/abs-tkdl" className={linkClass}>
              ABS &amp; TKDL
            </Link>
            <Link href="/sources" className={linkClass}>
              Sources
            </Link>
            <Link href="/samhita" className={linkClass}>
              Samhita
            </Link>
          </nav>
        </div>

        <div>
          <span className={headingClass}>Contact</span>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Asansol,+West+Bengal,+India"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} flex items-start gap-2`}
            >
              <MapPin size={16} />
              <span>Asansol, West Bengal, India</span>
            </a>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className={`${linkClass} flex items-start gap-2`}>
                <Mail size={16} />
                <span>{contactEmail}</span>
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex min-h-24 flex-col justify-between border border-[#173b2b]/[0.12] bg-white/45 p-5">
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[#173b2b]/55">
                built for
              </span>
              <a
                href="https://sih.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bebas-neue text-[2rem] leading-[0.9] tracking-[0.5px] text-[#173b2b]"
              >
                SMART INDIA HACKATHON
              </a>
            </div>
            <div className="flex min-h-24 flex-col justify-between border border-[#173b2b]/[0.12] bg-white/45 p-5">
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[#173b2b]/55">
                built by
              </span>
              <Link
                href="/about"
                className="font-bebas-neue text-[2rem] leading-[0.9] tracking-[0.5px] text-[#173b2b]"
              >
                SENTINALS
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#173b2b]/10 pt-4 text-xs text-[#173b2b]/55 sm:flex-row sm:items-center sm:justify-between md:col-span-4">
          <span>
            © {new Date().getFullYear()} IP-SAKTI Sahayak. All rights reserved. | Smart India
            Hackathon 2026
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/Prantor-Das/ip_shakti"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className={linkClass}
            >
              <Globe size={17} />
            </a>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} aria-label="Email" className={linkClass}>
                <Mail size={17} />
              </a>
            )}
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
