'use client';

import { ArrowRight, Leaf, Lock, Mail, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

export const FullScreenLogin = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!emailOrMobile.trim()) {
      setEmailError('Please enter your email or mobile number.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      setSubmitted(true);
      console.log('Logged in:', { emailOrMobile, rememberMe });
      alert('Successfully logged in to IP-SAKTI!');
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center overflow-hidden bg-[#f7faf7] p-4 pt-24 pb-12 text-emerald-950 sm:p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/10 md:flex">
        {/* Left Side: Branding */}
        <div className="relative flex overflow-hidden bg-primary p-8 text-white md:w-1/2 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-white/20" />
          <div className="pointer-events-none absolute right-10 top-10 size-28 rounded-full border border-white/15" />
          <Leaf
            aria-hidden
            className="pointer-events-none absolute right-14 top-14 size-14 rotate-12 text-emerald-100/70"
          />
          <div className="relative flex flex-1 flex-col justify-between">
            <div>
              <div className="mb-16">
                <span className="text-xl font-semibold tracking-tight">IP-SAKTI</span>
              </div>
              <p className="mb-3 text-xs font-semibold text-emerald-100">
                YOUR AYURVEDA IP WORKSPACE
              </p>
              <h1 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                Return to the work that protects your knowledge.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-50/80">
                Access saved searches, patent evaluations, regulatory drafts, and AI research
                history.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-2 border-t border-white/20 pt-5 text-xs text-emerald-50/80">
              <ShieldCheck className="size-4" /> Secure RAG & multilingual AI gateway
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center bg-[#fffdf6] p-8 text-emerald-950 md:w-1/2 md:p-12">
          <div className="flex flex-col items-left mb-6">
            <p className="mb-2 text-xs font-semibold text-primary">WELCOME BACK</p>
            <h2 className="mb-1 text-2xl font-medium tracking-tight md:text-3xl">Account login</h2>
            <p className="text-left text-sm text-emerald-950/60">
              Enter your credentials to continue.
            </p>
          </div>

          {submitted && (
            <div className="mb-4 rounded-xl border border-primary/25 bg-emerald-50 p-3 text-xs text-primary">
              Logged in successfully! Redirecting...
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {/* Email or Mobile */}
            <div>
              <label
                htmlFor="emailOrMobile"
                className="mb-1.5 block text-xs font-medium text-emerald-950/75"
              >
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="emailOrMobile"
                  placeholder="name@example.com or 9876543210"
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-primary/30 ${
                    emailError ? 'border-red-500' : 'border-emerald-900/15'
                  }`}
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                />
                <Mail className="absolute left-3 top-3 size-4 text-emerald-950/40" />
              </div>
              {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-emerald-950/75">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to your registered email!');
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 pl-9 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-primary/30 ${
                    passwordError ? 'border-red-500' : 'border-emerald-900/15'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-3 size-4 text-emerald-950/40" />
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center justify-between my-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-emerald-950/65">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-emerald-900/20 bg-white accent-primary focus:ring-primary"
                />
                Remember me on this device
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-white shadow-md shadow-emerald-900/10 transition hover:bg-primary/90"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider and Create Account link */}
            <div className="border-t border-emerald-900/10 pt-4 text-center text-xs text-emerald-950/55">
              New to IP-SAKTI?{' '}
              <Link
                href="/register"
                className="font-medium text-primary underline hover:text-primary/80"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
