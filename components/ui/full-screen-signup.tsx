'use client';

import { Check, ChevronDown, Leaf, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

export const USER_TYPES = [
  'Ayurveda Practitioner',
  'Researcher / Academic',
  'Student',
  'Startup / Entrepreneur',
  'Manufacturer',
  'IP Professional',
  'Legal Professional',
  'General User',
];

export const AREAS_OF_INTEREST = [
  'Patents',
  'Traditional Knowledge',
  'Regulatory Classification',
  'ABS / Biological Resources',
  'Trademarks & GI',
  'International IP',
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other / Outside India',
];

export const FullScreenSignup = () => {
  // Form mode: register
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    state: '',
    userType: '',
    organization: '',
    designation: '',
    areasOfInterest: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateMobile = (value: string) => {
    return /^[0-9]{10}$/.test(value.replace(/[^0-9]/g, ''));
  };

  const handleInterestToggle = (area: string) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(area);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter((item) => item !== area)
          : [...prev.areasOfInterest, area],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile || !validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state.';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select your user/stakeholder type.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Registration submitted successfully:', formData);
      alert('Account created successfully! Welcome to IP-SAKTI Sahayak.');
    }
  };

  return (
    <div className="auth-register min-h-dvh flex items-center justify-center overflow-hidden bg-[#f7faf7] p-4 pt-24 pb-12 text-emerald-950 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/10 md:flex">
        {/* Left Side: Branding / Banner */}
        <div className="relative flex overflow-hidden bg-primary p-8 text-white md:w-5/12 md:p-12">
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
              <p className="mb-3 text-xs font-semibold text-emerald-100">START YOUR IP WORKSPACE</p>
              <h1 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                Build a safer path for your Ayurveda innovation.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-50/80">
                Set up one workspace for your formulation records, protection strategy, and market
                research.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-2 border-t border-white/20 pt-5 text-xs text-emerald-50/80">
              <ShieldCheck className="size-4" /> Built for researchers, practitioners, and founders
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex max-h-[85vh] flex-col overflow-y-auto bg-[#fffdf6] p-6 text-emerald-950 md:w-7/12 md:p-10">
          <div className="flex flex-col items-left mb-6">
            <p className="mb-2 text-xs font-semibold text-primary">GET STARTED</p>
            <h2 className="mb-1 text-2xl font-medium tracking-tight md:text-3xl">
              Create an account
            </h2>
            <p className="text-left text-sm text-emerald-950/60">
              Tell us a little about your work so Sahayak can be more useful.
            </p>
          </div>

          {submitted && (
            <div className="mb-6 rounded-xl border border-primary/25 bg-emerald-50 p-4 text-sm text-primary">
              Account registered successfully! Redirecting to login...
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {/* Required Section Header */}
            <div className="mb-1 text-xs font-semibold text-primary">Required Details</div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-xs font-medium text-emerald-950/75"
              >
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Dr. Rajesh Sharma"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 ${
                  errors.fullName ? 'border-red-500' : 'border-slate-700'
                }`}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-1 text-slate-300">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="rajesh@ayurveda.in"
                  className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs font-medium mb-1 text-slate-300">
                  Mobile Number <span className="text-orange-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  placeholder="9876543210"
                  className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 ${
                    errors.mobile ? 'border-red-500' : 'border-slate-700'
                  }`}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
                {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-medium mb-1 text-slate-300">
                  Password <span className="text-orange-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 ${
                    errors.password ? 'border-red-500' : 'border-slate-700'
                  }`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium mb-1 text-slate-300"
                >
                  Confirm Password <span className="text-orange-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* State & Stakeholder Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="state" className="block text-xs font-medium mb-1 text-slate-300">
                  State <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 appearance-none pr-8 ${
                      errors.state ? 'border-red-500' : 'border-slate-700'
                    }`}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="userType" className="block text-xs font-medium mb-1 text-slate-300">
                  User / Stakeholder Type <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="userType"
                    className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500 appearance-none pr-8 ${
                      errors.userType ? 'border-red-500' : 'border-slate-700'
                    }`}
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  >
                    <option value="">Select Stakeholder Category</option>
                    {USER_TYPES.map((ut) => (
                      <option key={ut} value={ut} className="bg-slate-900 text-white">
                        {ut}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
                {errors.userType && <p className="text-red-400 text-xs mt-1">{errors.userType}</p>}
              </div>
            </div>

            {/* Optional Section Header */}
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2 mb-1 border-t border-slate-800 pt-3">
              Optional Details
            </div>

            {/* Organization & Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="organization"
                  className="block text-xs font-medium mb-1 text-slate-400"
                >
                  Organization / Institution
                </label>
                <input
                  type="text"
                  id="organization"
                  placeholder="e.g. AIIA / BHU / Private Lab"
                  className="text-sm w-full py-2 px-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div>
                <label
                  htmlFor="designation"
                  className="block text-xs font-medium mb-1 text-slate-400"
                >
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  placeholder="e.g. Senior Researcher / Founder"
                  className="text-sm w-full py-2 px-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 bg-slate-950 text-white focus:ring-orange-500"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>

            {/* Area of Interest */}
            <div>
              <label className="block text-xs font-medium mb-2 text-slate-400">
                Area of Interest (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AREAS_OF_INTEREST.map((area) => {
                  const isSelected = formData.areasOfInterest.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleInterestToggle(area)}
                      className={`text-xs p-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="line-clamp-1">{area}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-2"
            >
              Create Account
            </button>

            {/* Login Navigation Link */}
            <div className="text-center text-slate-400 text-xs mt-2">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-orange-400 hover:text-orange-300 font-medium underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
