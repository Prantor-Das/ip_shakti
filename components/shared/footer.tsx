'use client';

import Link from 'next/link';
import { Globe, Mail, MapPin, Link as LinkIcon } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-logo-section">
      {/* Top Banner & Socials (New Footer Style) */}
      <div className="footer-content">
        <div
          className="sih-logo"
          style={{ fontSize: '4rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}
        >
          IP - SAKTI
        </div>
        <p><i>Where Ancient Wisdom Meets Intelligent Technology.</i></p>
        <div className="footer-links">
          <a
            href="https://www.facebook.com/AEC1998"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://github.com/YASH-HCKT/SIH"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.instagram.com/yashprabhakar____/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/smart-india-hackathon/home/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '4rem',
        }}
      >
        <div className="sih-logo-wrap">
          <div className="built-for">built for</div>
          <a
            href="https://sih.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="sih-logo"
          >
            SMART INDIA HACKATHON
          </a>
        </div>

        <div className="sih-logo-wrap">
          <div className="built-for">built by</div>
          <Link
            href="/about"
            className="sih-logo"
            style={{ fontSize: '2.5rem' }}
          >
            SENTINALS
          </Link>
        </div>
      </div>

      {/* Prominent Black Separation Line */}
      <div
        className="max-w-7xl mx-auto my-8"
        style={{ borderTop: '1px solid rgba(0, 0, 0, 0.25)' }}
      />

      {/* Detailed Navigation & Info Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <span
                style={{ color: '#000000' }}
                className="font-bold tracking-tight text-lg"
              >
                IP-SAKTI
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Bridging traditional Ayurvedic knowledge with modern intellectual property protection.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 style={{ color: '#000000' }} className="font-semibold mb-4 text-base">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/chat" className="hover:text-emerald-700 transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-emerald-700 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-700 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-700 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{ color: '#000000' }} className="font-semibold mb-4 text-base">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:text-emerald-700 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-700 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-700 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-emerald-700 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: '#000000' }} className="font-semibold mb-4 text-base">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Asansol,+West+Bengal,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-emerald-700 transition-colors"
              >
                <MapPin size={16} />
                <span>Asansol, West Bengal, India</span>
              </a>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:team@ip-sakti.com" className="hover:text-emerald-700 transition-colors">
                  team@ip-sakti.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Black Separation Line above Copyright */}
        <div
          className="my-8"
          style={{ borderTop: '1px solid rgba(0, 0, 0, 0.25)' }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">
          <div className="mb-4 md:mb-0">
            © {currentYear} IP-SAKTI Sahayak. All rights reserved. | Smart India Hackathon 2026
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-6 my-2 md:my-0 text-gray-800">
            <a
              href="https://github.com/YASH-HCKT/SIH"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="hover:text-emerald-700 transition-colors"
            >
              <Globe size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/smart-india-hackathon/home/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-emerald-700 transition-colors"
            >
              <LinkIcon size={18} />
            </a>
            <a
              href="mailto:team@ip-sakti.com"
              aria-label="Email"
              className="hover:text-emerald-700 transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-4 text-gray-700">
            <a href="#" className="hover:text-emerald-700 transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-700 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
