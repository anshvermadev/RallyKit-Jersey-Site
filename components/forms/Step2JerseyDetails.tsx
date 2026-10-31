'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JerseyCustomizationSchema, JerseyCustomizationData } from '@/lib/validators/order';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { DEPARTMENTS, getDepartmentBySlug } from '@/data/departments';
import { ArrowLeft, ArrowRight, Shirt, Hash, Sparkles } from 'lucide-react';

export default function Step2JerseyDetails() {
  const { jerseyData, setJerseyData, nextStep, prevStep } = useRegistrationStore();

  const currentDeptSlug = jerseyData.departmentSlug || 'cse';
  const currentDept = getDepartmentBySlug(currentDeptSlug) || DEPARTMENTS[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JerseyCustomizationData>({
    resolver: zodResolver(JerseyCustomizationSchema),
    defaultValues: {
      departmentSlug: currentDept.slug,
      departmentName: currentDept.name,
      customName: jerseyData.customName || 'STUDENT',
      jerseyNumber: jerseyData.jerseyNumber ?? 10,
      size: (jerseyData.size as any) || 'L',
      sleeveColor: jerseyData.sleeveColor || currentDept.secondaryColor,
      collarColor: jerseyData.collarColor || currentDept.primaryColor,
      quantity: jerseyData.quantity || 1,
      notes: jerseyData.notes || '',
      thumbnailSnapshot: jerseyData.thumbnailSnapshot || '',
    },
  });

  const selectedSize = watch('size');
  const selectedQuantity = watch('quantity');

  const onDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    const d = getDepartmentBySlug(slug);
    if (d) {
      setValue('departmentSlug', d.slug);
      setValue('departmentName', d.name);
      setValue('sleeveColor', d.sleeveColors[0] || d.secondaryColor);
      setValue('collarColor', d.collarColors[0] || d.primaryColor);
    }
  };

  const onSubmit = (data: JerseyCustomizationData) => {
    setJerseyData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b border-[#232338] pb-4">
        <h2 className="font-display text-2xl sm:text-3xl font-black italic text-white tracking-wider uppercase">
          STEP 2: JERSEY SPECIFICATIONS & CUSTOMIZATION
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Review your 3D customization choices. These will be permanently sublimation-printed on your kit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Confirm / Change */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Shirt className="w-3.5 h-3.5 text-pink-hot" />
            <span>CONFIRM DEPARTMENT JERSEY *</span>
          </label>
          <select
            value={watch('departmentSlug')}
            onChange={onDeptChange}
            className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-pink-hot px-4 py-3 text-sm text-white focus:outline-none"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.slug} value={dept.slug} className="bg-[#13131F] text-white">
                {dept.name} ({dept.shortName})
              </option>
            ))}
          </select>
        </div>

        {/* Custom Back Name */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-electric" />
              <span>CUSTOM BACK NAME (MAX 12 CHARS) *</span>
            </span>
            <span className="text-zinc-500 text-[10px]">A-Z ONLY</span>
          </label>
          <input
            type="text"
            maxLength={12}
            placeholder="e.g. SHARMA_X"
            {...register('customName')}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-lg font-display uppercase tracking-wider text-yellow-electric font-bold focus:outline-none ${
              errors.customName ? 'border-red-500' : 'border-[#232338] focus:border-yellow-electric'
            }`}
          />
          {errors.customName && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.customName.message}</p>
          )}
        </div>

        {/* Jersey Number */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-pink-hot" />
            <span>JERSEY NUMBER (00 - 99) *</span>
          </label>
          <input
            type="number"
            min={0}
            max={99}
            {...register('jerseyNumber', { valueAsNumber: true })}
            className={`w-full bg-[#0B0B12] border-2 px-4 py-3 text-lg font-display text-white focus:outline-none ${
              errors.jerseyNumber ? 'border-red-500' : 'border-[#232338] focus:border-pink-hot'
            }`}
          />
          {errors.jerseyNumber && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.jerseyNumber.message}</p>
          )}
        </div>

        {/* Size Selector */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
            SIZE (XS - 3XL) *
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setValue('size', sz)}
                className={`py-2.5 text-xs font-display font-bold italic transition-all ${
                  selectedSize === sz
                    ? 'bg-pink-hot text-black shadow-hard-yellow'
                    : 'bg-[#0B0B12] text-zinc-400 border border-[#232338] hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
          {errors.size && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.size.message}</p>
          )}
        </div>

        {/* Quantity (1-3) */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
            QUANTITY (MAX 3 PER STUDENT) *
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setValue('quantity', qty)}
                className={`w-14 py-2.5 text-sm font-display font-bold italic transition-all ${
                  selectedQuantity === qty
                    ? 'bg-yellow-electric text-black shadow-hard-pink'
                    : 'bg-[#0B0B12] text-zinc-400 border border-[#232338] hover:text-white'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>
          {errors.quantity && (
            <p className="text-red-400 text-xs mt-1 font-mono">{errors.quantity.message}</p>
          )}
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-300 mb-2">
            SPECIAL INSTRUCTIONS / FIT NOTES (OPTIONAL)
          </label>
          <input
            type="text"
            placeholder="e.g. Slightly longer cut, team captain sleeve badge"
            {...register('notes')}
            className="w-full bg-[#0B0B12] border-2 border-[#232338] focus:border-yellow-electric px-4 py-3 text-sm text-white focus:outline-none"
          />
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
          type="submit"
          className="btn-hard-pink skew-tag px-8 py-4 flex items-center gap-2 group"
        >
          <span className="skew-tag-inner font-display text-lg uppercase tracking-wider text-black flex items-center gap-2">
            <span>CONTINUE TO REVIEW</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </form>
  );
}
