'use client';

import React from 'react';
import { Flame, Star } from 'lucide-react';
import { DEPARTMENTS } from '@/data/departments';

export default function Marquee() {
  const items = [
    'EVERY DEPARTMENT',
    'ONE CAMPUS',
    ...DEPARTMENTS.map((d) => d.name.toUpperCase()),
    'COLLEGE RIVALS 2026',
    'WEAR YOUR COLORS',
  ];

  return (
    <div className="relative w-full bg-[#FFE600] py-3.5 border-y-2 border-black overflow-hidden -skew-y-1 transform scale-105 z-20 my-4 select-none">
      <div className="flex w-max animate-marquee">
        {/* Sequence 1 */}
        <div className="flex items-center gap-8 shrink-0">
          {items.map((text, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-6">
              <span className="font-display text-2xl sm:text-3xl font-black italic tracking-wider text-black uppercase">
                {text}
              </span>
              <Flame className="w-5 h-5 text-pink-hot fill-pink-hot shrink-0" />
            </div>
          ))}
        </div>

        {/* Duplicate sequence for seamless loop */}
        <div className="flex items-center gap-8 shrink-0 ml-8">
          {items.map((text, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-6">
              <span className="font-display text-2xl sm:text-3xl font-black italic tracking-wider text-black uppercase">
                {text}
              </span>
              <Star className="w-5 h-5 text-pink-hot fill-pink-hot shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

