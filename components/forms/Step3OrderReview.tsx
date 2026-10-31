'use client';

import React from 'react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { getDepartmentBySlug, DEPARTMENTS } from '@/data/departments';
import { ArrowLeft, ArrowRight, Edit3, ShieldCheck, Tag } from 'lucide-react';

export default function Step3OrderReview() {
  const { studentData, jerseyData, nextStep, prevStep, setStep } = useRegistrationStore();

  const dept = getDepartmentBySlug(jerseyData.departmentSlug || 'cse') || DEPARTMENTS[0];
  const quantity = jerseyData.quantity || 1;
  const basePrice = dept.basePrice;
  const subtotal = basePrice * quantity;
  const customizationFee = 0; // Free early bird
  const total = subtotal + customizationFee;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#232338] pb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-black italic text-white tracking-wider uppercase">
          STEP 3: REVIEW YOUR REGISTRATION
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Double-check all student information and jersey details before proceeding to simulated payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Summary Breakdown Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Student Information */}
          <div className="bg-[#0B0B12] border-2 border-[#232338] p-5 relative">
            <div className="flex items-center justify-between border-b border-[#1E1E30] pb-3 mb-4">
              <span className="font-display text-lg text-yellow-electric italic uppercase tracking-wider">
                1. STUDENT PROFILE
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-pink-hot hover:underline flex items-center gap-1 font-mono uppercase"
              >
                <Edit3 className="w-3.5 h-3.5" /> EDIT
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 font-mono block">NAME:</span>
                <span className="text-white font-bold text-sm">{studentData.fullName}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">ENROLLMENT #:</span>
                <span className="text-yellow-electric font-mono font-bold text-sm">
                  {studentData.enrollmentNumber}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">COLLEGE EMAIL:</span>
                <span className="text-zinc-300 font-mono">{studentData.collegeEmail}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">PHONE NUMBER:</span>
                <span className="text-zinc-300 font-mono">+91 {studentData.phone}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">DEPARTMENT:</span>
                <span className="text-zinc-300">{studentData.department}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">YEAR & DIV:</span>
                <span className="text-zinc-300">
                  {studentData.year} {studentData.division ? `(Div ${studentData.division})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Jersey Customization */}
          <div className="bg-[#0B0B12] border-2 border-[#232338] p-5 relative">
            <div className="flex items-center justify-between border-b border-[#1E1E30] pb-3 mb-4">
              <span className="font-display text-lg text-pink-hot italic uppercase tracking-wider">
                2. JERSEY SPECIFICATION
              </span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-yellow-electric hover:underline flex items-center gap-1 font-mono uppercase"
              >
                <Edit3 className="w-3.5 h-3.5" /> EDIT
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 font-mono block">DEPARTMENT KIT:</span>
                <span className="text-white font-bold">{dept.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">PRINTED NAME ON BACK:</span>
                <span className="text-pink-hot font-display text-xl font-bold tracking-wider">
                  {jerseyData.customName}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">JERSEY NUMBER:</span>
                <span className="text-yellow-electric font-display text-2xl font-black">
                  #{jerseyData.jerseyNumber}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">ATHLETIC SIZE:</span>
                <span className="bg-[#1A1A2E] text-white font-mono font-bold px-2 py-0.5 border border-zinc-700">
                  {jerseyData.size}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-mono block">QUANTITY:</span>
                <span className="text-white font-mono font-bold">{quantity}x Units</span>
              </div>
              {jerseyData.notes && (
                <div>
                  <span className="text-zinc-500 font-mono block">NOTES:</span>
                  <span className="text-zinc-400 italic">{jerseyData.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Visual Preview & Price Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B0B12] border-2 border-[#232338] p-5 flex flex-col justify-between">
            {/* 3D Silhouette / Snapshot */}
            <div className="relative w-full h-44 bg-[#141424] border border-[#232338] flex items-center justify-center mb-4 overflow-hidden">
              <svg viewBox="0 0 160 180" className="w-32 h-36 drop-shadow-xl">
                <path d="M 25,45 L 0,70 L 20,105 L 40,75 Z" fill={dept.secondaryColor} />
                <path d="M 135,45 L 160,70 L 140,105 L 120,75 Z" fill={dept.secondaryColor} />
                <path d="M 35,45 L 125,45 L 130,170 L 30,170 Z" fill={dept.primaryColor} />
                <path d="M 55,45 Q 80,75 105,45 Z" fill={dept.collarColors[0] || '#FFE600'} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-display text-xs text-white uppercase bg-black/60 px-2 py-0.5 tracking-wider">
                  {jerseyData.customName}
                </span>
                <span className="font-display text-4xl text-yellow-electric font-black mt-1">
                  {jerseyData.jerseyNumber}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-[#1E1E30] pt-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Base Price ({quantity}x)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-pink-hot" /> Custom Name & Number
                </span>
                <span className="text-pink-hot font-bold">FREE (Early Bird)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Campus Pickup Handling</span>
                <span className="text-yellow-electric">FREE</span>
              </div>
              <div className="border-t border-[#232338] pt-2 flex justify-between items-baseline">
                <span className="font-display text-lg text-white uppercase italic">
                  TOTAL AMOUNT
                </span>
                <span className="font-display text-3xl font-black text-yellow-electric italic">
                  ₹{total}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#181829] border border-zinc-700/60 p-3 text-[11px] text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pink-hot shrink-0" />
            <span>Click below to complete simulated zero-cost demo payment.</span>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="pt-6 border-t border-[#232338] flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-[#1A1A2E] text-zinc-300 hover:text-white border border-[#232338] font-display text-base uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="btn-hard-pink skew-tag px-8 py-4 flex items-center gap-2 group"
        >
          <span className="skew-tag-inner font-display text-lg uppercase tracking-wider text-black flex items-center gap-2">
            <span>PROCEED TO DEMO PAYMENT</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
}
