'use client';

import React from 'react';
import Link from 'next/link';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import Step1StudentDetails from '@/components/forms/Step1StudentDetails';
import Step2JerseyDetails from '@/components/forms/Step2JerseyDetails';
import Step3OrderReview from '@/components/forms/Step3OrderReview';
import Step4DemoPayment from '@/components/forms/Step4DemoPayment';
import { Flame, Check, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS_NAV = [
  { step: 1, label: 'STUDENT DETAILS' },
  { step: 2, label: 'JERSEY SPECS' },
  { step: 3, label: 'REVIEW' },
  { step: 4, label: 'DEMO PAYMENT' },
];

export default function RegisterPage() {
  const { currentStep, setStep } = useRegistrationStore();

  return (
    <div className="min-h-screen bg-[#0B0B12] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 mb-6">
          <Link href="/" className="hover:text-pink-hot transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/jerseys" className="hover:text-pink-hot transition-colors">
            JERSEYS
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-yellow-electric font-bold">REGISTRATION PORTAL</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-yellow-electric font-mono text-xs font-bold px-3 py-1 uppercase skew-tag border border-yellow-electric/30">
            <Flame className="w-3.5 h-3.5 skew-tag-inner fill-yellow-electric" />
            <span className="skew-tag-inner">INTERACTIVE STUDENT REGISTRATION</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black italic tracking-tight uppercase text-white leading-none">
            CLAIM YOUR OFFICIAL JERSEY
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Draft auto-saved to your browser. Complete registration to issue your verified collection pass.
          </p>
        </div>

        {/* Animated Multi-Step Stepper Header */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-4 sm:p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-4 gap-2 relative">
            {STEPS_NAV.map((s) => {
              const isDone = s.step < currentStep;
              const isCurrent = s.step === currentStep;

              return (
                <button
                  key={s.step}
                  onClick={() => {
                    // Only allow clicking completed or current steps
                    if (s.step <= currentStep) {
                      setStep(s.step);
                    }
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-1 text-center transition-all ${
                    isCurrent
                      ? 'text-pink-hot font-bold'
                      : isDone
                      ? 'text-yellow-electric hover:text-white'
                      : 'text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isCurrent
                        ? 'bg-pink-hot text-black shadow-hard-yellow scale-110'
                        : isDone
                        ? 'bg-yellow-electric text-black font-black'
                        : 'bg-[#1E1E30] text-zinc-500'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                  </div>
                  <span className="font-display text-xs sm:text-sm tracking-wider uppercase italic hidden sm:inline">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-[#1E1E30] h-1.5 mt-4 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-hot to-yellow-electric"
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Active Step Container */}
        <div className="bg-[#13131F] border-2 border-[#232338] p-6 sm:p-8 shadow-2xl">
          {currentStep === 1 && <Step1StudentDetails />}
          {currentStep === 2 && <Step2JerseyDetails />}
          {currentStep === 3 && <Step3OrderReview />}
          {currentStep === 4 && <Step4DemoPayment />}
        </div>

        {/* Footer Support Tag */}
        <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pink-hot" /> Verified Campus League Registration System
          </span>
          <Link href="/my-order" className="hover:text-yellow-electric underline">
            Already registered? Track Order →
          </Link>
        </div>
      </div>
    </div>
  );
}

