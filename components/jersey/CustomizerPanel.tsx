'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ruler, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Department } from '@/data/departments';
import { useCustomizerStore } from '@/lib/store/useCustomizerStore';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import SizeChartModal from './SizeChartModal';

interface CustomizerPanelProps {
  department: Department;
}

export default function CustomizerPanel({ department }: CustomizerPanelProps) {
  const router = useRouter();
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  const {
    customName,
    jerseyNumber,
    size,
    sleeveColor,
    collarColor,
    setCustomName,
    setJerseyNumber,
    setSize,
    setSleeveColor,
    setCollarColor,
    setCameraView,
  } = useCustomizerStore();

  const setJerseyData = useRegistrationStore((state) => state.setJerseyData);
  const setStudentData = useRegistrationStore((state) => state.setStudentData);
  const setStep = useRegistrationStore((state) => state.setStep);

  // Price calculations
  const basePrice = department.basePrice;
  const customizationFee = 0; // Complimentary early bird
  const total = basePrice + customizationFee;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only A-Z, numbers, hyphens, spaces, max 12 chars
    const cleaned = e.target.value
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .slice(0, 12)
      .toUpperCase();
    setCustomName(cleaned);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setJerseyNumber(0);
    } else {
      setJerseyNumber(Math.max(0, Math.min(99, val)));
    }
  };

  const handleProceedToRegister = () => {
    // Save selections to registration store draft
    setJerseyData({
      departmentSlug: department.slug,
      departmentName: department.name,
      customName: customName || 'STUDENT',
      jerseyNumber,
      size,
      sleeveColor,
      collarColor,
      quantity: 1,
    });
    setStudentData({
      department: department.name,
    });
    setStep(1); // Start at student details with prefilled jersey
    router.push('/register');
  };

  return (
    <div className="w-full bg-[#13131F] border-2 border-[#232338] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
      {/* Accent corner tag */}
      <div className="absolute top-0 right-0 bg-yellow-electric text-black text-[10px] font-black px-3 py-1 font-mono uppercase tracking-widest">
        {department.badgeText}
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-pink-hot font-bold tracking-wider">
              {department.batch}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-xs text-yellow-electric font-bold">
              {department.shortName}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white italic tracking-wider leading-none">
            {department.name}
          </h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {department.tagline}
          </p>
        </div>

        <div className="h-[1px] bg-[#232338]" />

        {/* 1. Custom Name on Back */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-sm uppercase italic tracking-wider text-white flex items-center gap-1.5">
              <span>PLAYER NAME ON BACK</span>
              <span className="text-zinc-500 text-[10px] font-mono not-italic">(MAX 12 A-Z)</span>
            </label>
            <button
              onClick={() => setCameraView('back')}
              className="text-[11px] text-pink-hot hover:text-yellow-electric font-mono underline"
            >
              View Back
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={customName}
              onChange={handleNameChange}
              maxLength={12}
              placeholder="YOUR NAME"
              className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-pink-hot focus:outline-none px-4 py-3 text-lg font-display uppercase tracking-wider text-yellow-electric font-bold transition-all"
            />
            <span className="absolute right-3 top-3.5 text-xs font-mono text-zinc-500">
              {customName.length}/12
            </span>
          </div>
        </div>

        {/* 2. Jersey Number */}
        <div>
          <label className="font-display text-sm uppercase italic tracking-wider text-white block mb-2">
            JERSEY NUMBER (00 - 99)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {[7, 10, 18, 23, 42, 99].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setJerseyNumber(num)}
                className={`py-2 text-sm font-display font-bold italic transition-all ${
                  jerseyNumber === num
                    ? 'bg-yellow-electric text-black shadow-hard-pink'
                    : 'bg-[#1A1A2E] text-zinc-400 hover:text-white border border-[#232338]'
                }`}
              >
                {String(num).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Custom #:</span>
            <input
              type="number"
              min={0}
              max={99}
              value={jerseyNumber}
              onChange={handleNumberChange}
              className="w-20 bg-[#0B0B12] border border-[#232338] focus:border-yellow-electric px-2 py-1 text-center font-display text-sm text-white"
            />
          </div>
        </div>

        {/* 3. Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-sm uppercase italic tracking-wider text-white">
              SELECT SIZE
            </label>
            <button
              type="button"
              onClick={() => setSizeModalOpen(true)}
              className="text-xs text-yellow-electric hover:text-pink-hot flex items-center gap-1 font-mono transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>SIZE CHART</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {department.availableSizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSize(sz)}
                className={`py-2 text-xs font-display font-bold italic transition-all ${
                  size === sz
                    ? 'bg-pink-hot text-black shadow-hard-yellow'
                    : 'bg-[#1A1A2E] text-zinc-400 hover:text-white border border-[#232338]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Sleeve Trim Colors */}
        {department.sleeveColors && department.sleeveColors.length > 1 && (
          <div>
            <label className="font-display text-xs uppercase italic tracking-wider text-zinc-400 block mb-2">
              SLEEVE ACCENT VARIANT
            </label>
            <div className="flex items-center gap-3">
              {department.sleeveColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSleeveColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    sleeveColor === color
                      ? 'border-yellow-electric scale-110 shadow-lg'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Select ${color}`}
                >
                  {sleeveColor === color && (
                    <Check className="w-3.5 h-3.5 text-black drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Collar Trim Colors */}
        {department.collarColors && department.collarColors.length > 1 && (
          <div>
            <label className="font-display text-xs uppercase italic tracking-wider text-zinc-400 block mb-2">
              COLLAR RIB VARIANT
            </label>
            <div className="flex items-center gap-3">
              {department.collarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCollarColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                    collarColor === color
                      ? 'border-pink-hot scale-110 shadow-lg'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Select ${color}`}
                >
                  {collarColor === color && (
                    <Check className="w-3.5 h-3.5 text-black drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Price Summary & CTA Button */}
      <div className="mt-8 pt-6 border-t-2 border-[#232338] space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-sm uppercase text-zinc-400 tracking-wider">
            PRE-ORDER PRICE
          </span>
          <div className="text-right">
            <span className="font-display text-3xl font-black text-white italic">
              ₹{total}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 block">
              FREE CUSTOM PRINTING INCLUDED
            </span>
          </div>
        </div>

        <button
          onClick={handleProceedToRegister}
          className="btn-hard-pink w-full py-4 text-center skew-tag flex items-center justify-center gap-2 group"
        >
          <span className="skew-tag-inner font-display text-xl uppercase tracking-wider text-black flex items-center gap-2">
            <span>REGISTER FOR THIS JERSEY</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-pink-hot" />
          <span>Official Campus Collection Pass Issued On Submit</span>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
        selectedSize={size}
        onSelectSize={setSize}
      />
    </div>
  );
}
