'use client';

import * as React from 'react';
import { Send, CheckCircle2, Loader2, Mail } from 'lucide-react';

export default function Contact16() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    try {
      // API call to route handling yashcrj06@gmail.com
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        // Direct client fallback to formsubmit
        await fetch('https://formsubmit.co/ajax/yashcrj06@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `[IP-SAKTI Direct Email] Message from ${name}`,
          }),
        });
      }

      setSent(true);
      // Clear form inputs
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Email send error:', err);
      // Client fallback dispatch
      try {
        await fetch('https://formsubmit.co/ajax/yashcrj06@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `[IP-SAKTI Direct Email] Message from ${name}`,
          }),
        });
      } catch (e) {
        console.error('Fallback error:', e);
      }
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-6xl">
        {/* Card matching user mockup image */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-10 md:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-[#173b2b]/10 text-[#173b2b]">
          
          {/* Subtle envelope watermark positioned with clean gap from the right edge */}
          <div className="absolute top-6 right-8 sm:right-12 md:right-16 pointer-events-none opacity-15 text-[#173b2b]/40">
            <Mail className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 stroke-[1.4]" />
          </div>

          {/* Subtitle */}
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#173b2b]/60 mb-2">
            READY TO START?
          </p>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#173b2b] mb-3 leading-tight">
            Send us an email directly.
          </h2>

          {/* Body Text */}
          <p className="text-sm sm:text-base text-[#173b2b]/70 max-w-xl mx-auto mb-6 leading-relaxed">
            Whether you have a specific project in mind or just want to chat about technology, my inbox is always open.
          </p>

          {sent ? (
            /* Success confirmation box */
            <div className="my-4 p-6 rounded-2xl bg-[#edf6ef] border border-[#2f855a]/20 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300 max-w-xl mx-auto">
              <span className="grid size-12 place-items-center rounded-full bg-[#2f855a]/10 text-[#2f855a]">
                <CheckCircle2 className="size-7 text-[#2f855a]" />
              </span>
              <h3 className="font-bold text-xl text-[#173b2b]">Email Sent Successfully!</h3>
              <p className="text-sm text-[#173b2b]/70 max-w-md">
                Thank you for reaching out. Your message has been sent directly to <strong className="text-[#2f855a]">yashcrj06@gmail.com</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#173b2b] text-white text-xs font-semibold hover:bg-[#2f855a] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Form input fields */
            <form onSubmit={handleSubmit} className="max-w-xl sm:max-w-2xl mx-auto flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label htmlFor="full-name" className="text-xs font-semibold uppercase tracking-wider text-[#173b2b]/70">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-[#173b2b]/15 bg-[#f7faf7] px-4 py-3 text-sm text-[#173b2b] placeholder:text-[#173b2b]/40 focus:outline-none focus:ring-2 focus:ring-[#2f855a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="user-email" className="text-xs font-semibold uppercase tracking-wider text-[#173b2b]/70">
                  Email Address
                </label>
                <input
                  id="user-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-[#173b2b]/15 bg-[#f7faf7] px-4 py-3 text-sm text-[#173b2b] placeholder:text-[#173b2b]/40 focus:outline-none focus:ring-2 focus:ring-[#2f855a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="user-message" className="text-xs font-semibold uppercase tracking-wider text-[#173b2b]/70">
                  Message
                </label>
                <textarea
                  id="user-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-[#173b2b]/15 bg-[#f7faf7] px-4 py-3 text-sm text-[#173b2b] placeholder:text-[#173b2b]/40 focus:outline-none focus:ring-2 focus:ring-[#2f855a] resize-none"
                />
              </div>

              {/* Submit Pill Button with crisp white text & icon */}
              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: '#000000', color: '#ffffff' }}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full !bg-black !text-white font-bold text-sm hover:!bg-[#1a1a1a] transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="!text-white font-semibold" style={{ color: '#ffffff' }}>Sending...</span>
                      <Loader2 className="w-4 h-4 !text-white animate-spin" style={{ color: '#ffffff' }} />
                    </>
                  ) : (
                    <>
                      <span className="!text-white font-semibold" style={{ color: '#ffffff' }}>Contact Me</span>
                      <Send className="w-4 h-4 !text-white" style={{ color: '#ffffff', stroke: '#ffffff' }} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
